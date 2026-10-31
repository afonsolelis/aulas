"""Consumidor: lê a fila, junta o micro-lote e faz o flush.

Ordem do flush: raw, bronze, ClickHouse, manifesto, ack.
O manifesto vem depois do ClickHouse para registrar o resultado de todos os destinos:
manifesto com status "ok" quer dizer lote completo. Arquivos de lote sem manifesto "ok"
são de um flush interrompido, e a fila reentrega essas mensagens porque não houve ack.
"""
import json, logging, socket, threading, time
from collections import defaultdict
from datetime import datetime
from src import contrato
from src.config import DOMINIOS, FLUSH_N, FLUSH_SEGUNDOS, FILA
from src.clickhouse import TabelaIngestao
from src.fila import conectar
from src.lake import FUSO, Lake, dia_e_hora, novo_lote

log = logging.getLogger("consumidor")


def _iso(ts_ms: int) -> str:
    return datetime.fromtimestamp(ts_ms / 1000, FUSO).isoformat(timespec="milliseconds")


class Consumidor:
    def __init__(self, flush_n=FLUSH_N, flush_segundos=FLUSH_SEGUNDOS):
        self.flush_n, self.flush_segundos = flush_n, flush_segundos
        self.lake, self.ch = Lake(), TabelaIngestao()
        self._zerar()
        self.parar = threading.Event()

    def _zerar(self):
        self.envelopes: list[tuple[int, bytes, str, list[str]]] = []   # (timestamp, corpo, data_tag, data_json)
        self.ultima_tag_entrega = None
        self.inicio_lote = None

    def _mensagem(self, canal, metodo, props, corpo):
        ts = (props.headers or {}).get("recebido_em_ms") or time.time_ns() // 1_000_000
        try:
            tag, itens = contrato.validar(corpo, DOMINIOS)   # a fila aceita qualquer coisa: valida de novo
        except contrato.EnvelopeInvalido as e:
            self.lake.rejeitar(corpo, str(e), ts)
            canal.basic_ack(metodo.delivery_tag)            # registrado no lake: sai da fila
            return
        if not self.envelopes:
            self.inicio_lote = time.monotonic()
        jsons = [json.dumps(i, ensure_ascii=False, separators=(",", ":")) for i in itens]
        self.envelopes.append((ts, corpo, tag, jsons))
        self.ultima_tag_entrega = metodo.delivery_tag
        if len(self.envelopes) >= self.flush_n:
            self.flush(canal)

    def _ack(self, canal):
        canal.basic_ack(self.ultima_tag_entrega, multiple=True)

    def flush(self, canal):
        if not self.envelopes:
            return
        t_inicio = time.time_ns() // 1_000_000
        ts0 = self.envelopes[0][0]
        lote, dia_lote = novo_lote(ts0), dia_e_hora(ts0)[0]
        grupos = defaultdict(lambda: {"envelopes": [], "linhas": []})   # (data_tag, data) -> conteúdo
        linhas_ch = []
        for ts, corpo, tag, jsons in self.envelopes:
            g = grupos[(tag, dia_e_hora(ts)[0])]
            g["envelopes"].append((ts, corpo))
            g["linhas"].extend((ts, j) for j in jsons)
            linhas_ch.extend((ts, j, tag) for j in jsons)

        por_tag = defaultdict(lambda: {"mensagens": 0, "linhas": 0})
        for (tag, _), g in grupos.items():
            por_tag[tag]["mensagens"] += len(g["envelopes"])
            por_tag[tag]["linhas"] += len(g["linhas"])
        manifesto = {
            "lote": lote, "data": dia_lote, "processo": socket.gethostname(),
            "primeiro_recebido_em": _iso(ts0), "ultimo_recebido_em": _iso(self.envelopes[-1][0]),
            "flush_inicio": _iso(t_inicio), "flush_fim": None,
            "mensagens": len(self.envelopes), "linhas": len(linhas_ch), "por_data_tag": dict(por_tag),
            "arquivos": [], "clickhouse": None, "tempos_ms": {}, "status": None, "erro": None,
        }

        t = time.perf_counter()                                     # 1. raw: os envelopes como chegaram
        for (tag, dia), g in grupos.items():
            manifesto["arquivos"].append({"camada": "raw", "data_tag": tag, "data": dia,
                                          "registros": len(g["envelopes"]),
                                          **self.lake.gravar_raw(lote, tag, dia, g["envelopes"])})
        manifesto["tempos_ms"]["raw"] = round((time.perf_counter() - t) * 1000, 1)

        t = time.perf_counter()                                     # 2. bronze: uma linha por objeto
        for (tag, dia), g in grupos.items():
            manifesto["arquivos"].append({"camada": "bronze", "data_tag": tag, "data": dia,
                                          "registros": len(g["linhas"]),
                                          **self.lake.gravar_bronze(lote, tag, dia, g["linhas"])})
        manifesto["tempos_ms"]["bronze"] = round((time.perf_counter() - t) * 1000, 1)

        t = time.perf_counter()                                     # 3. ClickHouse, um INSERT por lote
        try:
            self.ch.inserir(linhas_ch)
        except Exception as e:
            manifesto.update(status="erro_clickhouse", erro=repr(e)[:500],
                             flush_fim=_iso(time.time_ns() // 1_000_000))
            self.lake.gravar_manifesto(lote, dia_lote, manifesto)  # registra a tentativa; sem ack
            raise
        manifesto["tempos_ms"]["clickhouse"] = round((time.perf_counter() - t) * 1000, 1)
        manifesto["clickhouse"] = {"tabela": f"{self.ch.cli.database}.{self.ch.tabela}", "linhas": len(linhas_ch)}

        manifesto.update(status="ok", flush_fim=_iso(time.time_ns() // 1_000_000))
        self.lake.gravar_manifesto(lote, dia_lote, manifesto)      # 4. manifesto: o recibo do lote
        self._ack(canal)                                            # 5. ack: só depois de tudo gravado
        log.info("flush %s: %d envelopes, %d linhas, tempos %s", lote, len(self.envelopes),
                 len(linhas_ch), manifesto["tempos_ms"])
        self._zerar()

    def rodar(self):
        while not self.parar.is_set():
            con = None
            try:
                con, canal = conectar()
                # prefetch >= FLUSH_N: senão o broker para de entregar antes de o lote encher
                canal.basic_qos(prefetch_count=self.flush_n)
                canal.basic_consume(queue=FILA, on_message_callback=self._mensagem, auto_ack=False)
                while not self.parar.is_set():
                    con.process_data_events(time_limit=0.2)
                    if self.envelopes and time.monotonic() - self.inicio_lote >= self.flush_segundos:
                        self.flush(canal)
                self.flush(canal)
            except Exception:
                # falhou o lake, o ClickHouse ou a fila: descarta o lote em memória sem ack.
                # Ao fechar a conexão, o broker devolve as mensagens à fila (reentrega).
                log.exception("falha no consumo; reconectando em 5 s")
                self._zerar()
                time.sleep(5)
            finally:
                if con and con.is_open:
                    con.close()
