"""Aplica sql/001_criar_tabelas.sql em um ClickHouse pela interface HTTP(S).

A interface HTTP do ClickHouse aceita uma instrução por requisição, por isso o
arquivo é dividido em ';'. Use para o ClickHouse do Railway, que só fica
exposto por HTTPS na porta 443:

    CLICKHOUSE_HOST=<dominio>.up.railway.app CLICKHOUSE_PORT=443 \
    CLICKHOUSE_SECURE=true CLICKHOUSE_USER=iot CLICKHOUSE_PASSWORD=... \
    python scripts/aplicar_ddl.py

As instruções usam IF NOT EXISTS: rodar duas vezes não muda nada.
"""

import os
import sys
from pathlib import Path

import clickhouse_connect

ARQUIVO = Path(__file__).resolve().parent.parent / "sql" / "001_criar_tabelas.sql"


def instrucoes(texto: str) -> list[str]:
    saida = []
    for bloco in texto.split(";"):
        linhas = [l for l in bloco.splitlines() if not l.strip().startswith("--")]
        sql = "\n".join(linhas).strip()
        if sql:
            saida.append(sql)
    return saida


def main() -> int:
    cliente = clickhouse_connect.get_client(
        host=os.environ["CLICKHOUSE_HOST"],
        port=int(os.environ.get("CLICKHOUSE_PORT", "8123")),
        secure=os.environ.get("CLICKHOUSE_SECURE", "false").lower() == "true",
        username=os.environ.get("CLICKHOUSE_USER", "default"),
        password=os.environ["CLICKHOUSE_PASSWORD"],
    )
    for sql in instrucoes(ARQUIVO.read_text(encoding="utf-8")):
        print("->", sql.splitlines()[0])
        cliente.command(sql)
    print(cliente.command("SHOW TABLES FROM iot"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
