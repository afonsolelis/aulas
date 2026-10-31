"""Gravação no lake (RustFS, API S3), com a organização da Aula 03.

raw     o que chegou, sem interpretação: um JSON Lines por lote e por data_tag, uma linha por envelope
bronze  o extraído: um Parquet por lote e por data_tag, uma linha por objeto de data (timestamp, data_json)
raw/_manifestos/ingestao/  um manifesto por lote: contagens, chaves, SHA-256, tempos e status
raw/ingestao_rejeitados/   um JSON por envelope recusado, com o motivo

A data da partição é a do recebimento em America/Sao_Paulo. O Parquet é escrito pelo DuckDB
num arquivo temporário e enviado com boto3, para calcular o SHA-256 dos bytes enviados.
"""
import hashlib, json, os, tempfile, time, uuid
from datetime import datetime
from zoneinfo import ZoneInfo
import boto3
import duckdb
import pyarrow as pa
from src.config import env

FUSO = ZoneInfo("America/Sao_Paulo")


def dia_e_hora(ts_ms: int) -> tuple[str, str]:
    """Unix ms -> ('AAAA-MM-DD', 'HHMMSS') no horário de Brasília."""
    t = datetime.fromtimestamp(ts_ms / 1000, FUSO)
    return t.date().isoformat(), t.strftime("%H%M%S")


def novo_lote(ts_ms: int) -> str:
    """Identificador do lote: hora do primeiro envelope e um sufixo aleatório (lote_093012_1a2b3c4d)."""
    return f"lote_{dia_e_hora(ts_ms)[1]}_{uuid.uuid4().hex[:8]}"


def chaves(lote: str, tag: str, dia: str) -> dict[str, str]:
    """Chaves (sem o bucket) de um lote para uma data_tag."""
    return {"raw": f"ingestao/data_tag={tag}/data={dia}/{lote}.jsonl",
            "bronze": f"ingestao/data_tag={tag}/data={dia}/{lote}.parquet"}


def chave_manifesto(lote: str, dia: str) -> str:
    return f"_manifestos/ingestao/data={dia}/{lote}.json"


def linha_raw(ts_ms: int, corpo: bytes) -> bytes:
    """Uma linha do raw: o envelope como chegou, embrulhado com a hora de recebimento.
    Quebras de linha num JSON válido só aparecem como espaço entre tokens; trocá-las por
    espaço mantém o mesmo JSON e deixa o arquivo em uma linha por envelope."""
    corpo = corpo.replace(b"\r", b" ").replace(b"\n", b" ")
    return b'{"recebido_em_ms":%d,"envelope":%s}\n' % (ts_ms, corpo)


def conectar_s3():
    return boto3.client("s3", endpoint_url=env("S3_ENDPOINT_URL"), aws_access_key_id=env("S3_ACCESS_KEY"),
                        aws_secret_access_key=env("S3_SECRET_KEY"), region_name=env("S3_REGION", "us-east-1"))


def conectar_duckdb() -> duckdb.DuckDBPyConnection:
    """DuckDB com o secret S3 do .env (usado na leitura do lake e nos scripts de conferência)."""
    from urllib.parse import urlparse
    con = duckdb.connect()
    con.execute("INSTALL httpfs; LOAD httpfs;")
    url = urlparse(env("S3_ENDPOINT_URL"))
    con.execute(f"""CREATE OR REPLACE SECRET lake (TYPE s3, KEY_ID '{env("S3_ACCESS_KEY")}',
        SECRET '{env("S3_SECRET_KEY")}', REGION '{env("S3_REGION", "us-east-1")}',
        ENDPOINT '{url.netloc}', URL_STYLE 'path', USE_SSL {str(url.scheme == "https").lower()})""")
    return con


class Lake:
    def __init__(self, bucket_raw=None, bucket_bronze=None):
        self.s3 = conectar_s3()
        self.con = duckdb.connect()            # só converte Arrow em Parquet; não acessa a rede
        self.raw = bucket_raw or env("BUCKET_RAW", "raw")
        self.bronze = bucket_bronze or env("BUCKET_BRONZE", "bronze")

    def _put(self, bucket: str, chave: str, dados: bytes, tipo: str, lote: str) -> dict:
        sha = hashlib.sha256(dados).hexdigest()
        self.s3.put_object(Bucket=bucket, Key=chave, Body=dados, ContentType=tipo,
                           Metadata={"sha256": sha, "lote": lote})
        return {"chave": f"{bucket}/{chave}", "bytes": len(dados), "sha256": sha}

    def gravar_raw(self, lote: str, tag: str, dia: str, envelopes: list[tuple[int, bytes]]) -> dict:
        dados = b"".join(linha_raw(ts, corpo) for ts, corpo in envelopes)
        return self._put(self.raw, chaves(lote, tag, dia)["raw"], dados, "application/x-ndjson", lote)

    def gravar_bronze(self, lote: str, tag: str, dia: str, linhas: list[tuple[int, str]]) -> dict:
        # Arrow entrega o lote ao DuckDB sem copiar valor a valor
        tabela = pa.table({"timestamp": pa.array([t for t, _ in linhas], pa.uint64()),
                           "data_json": pa.array([j for _, j in linhas], pa.string())})
        with tempfile.TemporaryDirectory() as tmp:
            arq = os.path.join(tmp, "lote.parquet")
            self.con.register("lote", tabela)
            try:
                self.con.execute(f"COPY lote TO '{arq}' (FORMAT parquet, COMPRESSION zstd)")
            finally:
                self.con.unregister("lote")
            with open(arq, "rb") as f:
                dados = f.read()
        return self._put(self.bronze, chaves(lote, tag, dia)["bronze"], dados,
                         "application/vnd.apache.parquet", lote)

    def gravar_manifesto(self, lote: str, dia: str, manifesto: dict) -> dict:
        dados = json.dumps(manifesto, ensure_ascii=False, indent=2).encode()
        return self._put(self.raw, chave_manifesto(lote, dia), dados, "application/json", lote)

    def rejeitar(self, corpo: bytes, motivo: str, ts: int) -> str:
        dia, hora = dia_e_hora(ts)
        chave = f"ingestao_rejeitados/data={dia}/rejeitado_{hora}_{uuid.uuid4().hex[:8]}.json"
        # um objeto JSON por arquivo: hora, motivo e o corpo exatamente como chegou
        dados = json.dumps({"recebido_em_ms": ts, "motivo": motivo,
                            "corpo": corpo.decode("utf-8", "replace")}, ensure_ascii=False).encode()
        self._put(self.raw, chave, dados, "application/json", "rejeitado")
        return f"{self.raw}/{chave}"
