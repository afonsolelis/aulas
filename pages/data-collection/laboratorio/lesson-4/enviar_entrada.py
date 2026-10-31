"""Lê a pasta entrada/ e envia tudo ao servidor de ingestão pelo contrato público.

Funciona com qualquer servidor que siga o contrato da aula (o de referência ou o do grupo):
- livros: um POST /ingest por linha de entrada/livros/*.jsonl, envelope {"data_tag": "livros", "data": {...}};
- ptax: uma mensagem na fila por arquivo de entrada/ptax/*.jsonl, envelope com a lista de boletins;
- telemetria: uma mensagem na fila por linha de entrada/telemetria/*.txt,
  data = {"arquivo", "numero_linha", "linha"}.

Uso (na pasta que tem o .env e a pasta entrada/):
    python enviar_entrada.py
    python enviar_entrada.py --entrada entrada --api http://localhost:8000/ingest
    python enviar_entrada.py --so telemetria --limite-telemetria 2000

Lê do .env só as variáveis da fila (RABBITMQ_*, FILA_INGESTAO). Não conhece o lake nem o ClickHouse.
No fim imprime, por data_tag, as mensagens enviadas e as linhas esperadas no destino.
"""
import argparse
import json
import os
import pathlib
import sys
import time

import pika
import requests


def carregar_env(caminho: pathlib.Path) -> None:
    """Lê KEY=VALUE do .env sem sobrescrever variáveis já definidas no ambiente."""
    if not caminho.exists():
        return
    for linha in caminho.read_text(encoding="utf-8").splitlines():
        linha = linha.strip()
        if linha and not linha.startswith("#") and "=" in linha:
            chave, valor = linha.split("=", 1)
            os.environ.setdefault(chave.strip(), valor.strip())


def abrir_fila():
    cred = pika.PlainCredentials(os.environ.get("RABBITMQ_USER", "ingestao"), os.environ["RABBITMQ_PASSWORD"])
    params = pika.ConnectionParameters(os.environ.get("RABBITMQ_HOST", "localhost"),
                                       int(os.environ.get("RABBITMQ_PORT", "5672")), credentials=cred)
    con = pika.BlockingConnection(params)
    canal = con.channel()
    fila = os.environ.get("FILA_INGESTAO", "ingestao")
    try:
        # Se o servidor já criou a fila, usa a dele, com os argumentos que ele escolheu.
        canal.queue_declare(queue=fila, passive=True)
    except pika.exceptions.ChannelClosedByBroker:
        canal = con.channel()
        canal.queue_declare(queue=fila, durable=True)
    canal.confirm_delivery()            # basic_publish só volta depois da confirmação do broker
    return con, canal, fila


def publicar(canal, fila: str, envelope: dict) -> None:
    corpo = json.dumps(envelope, ensure_ascii=False).encode("utf-8")
    props = pika.BasicProperties(delivery_mode=pika.DeliveryMode.Persistent, content_type="application/json")
    canal.basic_publish(exchange="", routing_key=fila, body=corpo, properties=props)


def enviar_livros(pasta: pathlib.Path, api: str) -> dict:
    s = requests.Session()
    aceitos, recusados = 0, 0
    for arq in sorted(pasta.glob("*.jsonl")):
        with open(arq, encoding="utf-8") as f:
            for linha in f:
                if not linha.strip():
                    continue
                r = s.post(api, json={"data_tag": "livros", "data": json.loads(linha)}, timeout=10)
                if r.status_code == 202:
                    aceitos += 1
                else:
                    recusados += 1
                    print(f"livros: {r.status_code} {r.text[:200]}", file=sys.stderr)
    return {"mensagens": aceitos, "linhas_esperadas": aceitos, "recusados_http": recusados}


def enviar_ptax(pasta: pathlib.Path, canal, fila: str) -> dict:
    mensagens, boletins = 0, 0
    for arq in sorted(pasta.glob("*.jsonl")):
        lista = [json.loads(l) for l in arq.read_text(encoding="utf-8").splitlines() if l.strip()]
        if lista:
            publicar(canal, fila, {"data_tag": "ptax", "data": lista})
            mensagens += 1
            boletins += len(lista)
    return {"mensagens": mensagens, "linhas_esperadas": boletins}


def enviar_telemetria(pasta: pathlib.Path, canal, fila: str, limite: int | None) -> dict:
    n = 0
    for txt in sorted(pasta.glob("*.txt")):
        for i, linha in enumerate(txt.read_text(encoding="utf-8").splitlines(), start=1):
            if limite is not None and n >= limite:
                return {"mensagens": n, "linhas_esperadas": n}
            publicar(canal, fila, {"data_tag": "telemetria",
                                   "data": {"arquivo": f"entrada/telemetria/{txt.name}",
                                            "numero_linha": i, "linha": linha}})
            n += 1
    return {"mensagens": n, "linhas_esperadas": n}


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--entrada", default="entrada", help="pasta com livros/, ptax/ e telemetria/")
    p.add_argument("--api", default="http://localhost:8000/ingest")
    p.add_argument("--env", default=".env")
    p.add_argument("--so", choices=["livros", "ptax", "telemetria"], action="append",
                   help="envia só este domínio (pode repetir)")
    p.add_argument("--limite-telemetria", type=int, default=None, help="no máximo N linhas de telemetria")
    args = p.parse_args()

    carregar_env(pathlib.Path(args.env))
    if "RABBITMQ_PASSWORD" not in os.environ:
        sys.exit("RABBITMQ_PASSWORD ausente. Rode na pasta do .env ou passe --env.")
    entrada = pathlib.Path(args.entrada)
    if not entrada.is_dir():
        sys.exit(f"Pasta {entrada} não existe. Descompacte dados_aula_04.zip aqui.")
    dominios = args.so or ["livros", "ptax", "telemetria"]

    resumo = {}
    t0 = time.perf_counter()
    if "livros" in dominios:
        t = time.perf_counter()
        resumo["livros"] = {**enviar_livros(entrada / "livros", args.api), "via": "http",
                            "segundos": round(time.perf_counter() - t, 2)}
    if "ptax" in dominios or "telemetria" in dominios:
        con, canal, fila = abrir_fila()
        if "ptax" in dominios:
            t = time.perf_counter()
            resumo["ptax"] = {**enviar_ptax(entrada / "ptax", canal, fila), "via": "fila",
                              "segundos": round(time.perf_counter() - t, 2)}
        if "telemetria" in dominios:
            t = time.perf_counter()
            resumo["telemetria"] = {**enviar_telemetria(entrada / "telemetria", canal, fila,
                                                        args.limite_telemetria),
                                    "via": "fila", "segundos": round(time.perf_counter() - t, 2)}
        con.close()

    print(f"{'data_tag':<12}{'via':<6}{'mensagens':>10}{'linhas esperadas':>18}{'segundos':>10}")
    for tag, r in resumo.items():
        print(f"{tag:<12}{r['via']:<6}{r['mensagens']:>10}{r['linhas_esperadas']:>18}{r['segundos']:>10}")
    print(f"total: {round(time.perf_counter() - t0, 2)} s")
    if any(r.get("recusados_http") for r in resumo.values()):
        sys.exit("Houve envelopes recusados pela API; veja as mensagens acima.")


if __name__ == "__main__":
    main()
