import os
from dotenv import load_dotenv

# Procura o .env subindo a partir desta pasta: referencia/src -> referencia -> laboratorio/.env
load_dotenv()


def env(nome, padrao=None):
    v = os.getenv(nome, padrao)
    if v is None:
        raise RuntimeError(f"variável {nome} ausente no .env")
    return v


DOMINIOS = frozenset(d.strip() for d in env("DOMINIOS", "telemetria,livros,ptax").split(",") if d.strip())
FLUSH_N = int(env("FLUSH_N", "500"))
FLUSH_SEGUNDOS = float(env("FLUSH_SEGUNDOS", "2"))
HTTP_MAX_BYTES = int(env("HTTP_MAX_BYTES", "1048576"))
FILA = env("FILA_INGESTAO", "ingestao")
