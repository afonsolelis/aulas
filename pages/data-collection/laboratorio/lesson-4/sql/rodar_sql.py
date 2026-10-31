"""Executa um arquivo .sql no DuckDB com o secret S3 montado a partir do .env.

Uso (na pasta do grupo):
    python sql/rodar_sql.py sql/duckdb_cast.sql
    python sql/rodar_sql.py sql/silver_livros_ptax.sql --var DATA=2026-10-31

Os arquivos .sql não contêm credenciais. Este utilitário lê .env, cria um
secret temporário (só existe nesta conexão) e executa as instruções do arquivo
na ordem, imprimindo o resultado e o tempo de cada uma.
Variáveis no formato {{NOME}} dentro do .sql são substituídas por --var NOME=valor.
"""

import argparse
import os
import pathlib
import sys
import time
from urllib.parse import urlparse

import duckdb


def carregar_env(caminho: pathlib.Path) -> None:
    """Lê KEY=VALUE do .env sem sobrescrever variáveis já definidas no ambiente."""
    if not caminho.exists():
        return
    for linha in caminho.read_text(encoding="utf-8").splitlines():
        linha = linha.strip()
        if not linha or linha.startswith("#") or "=" not in linha:
            continue
        chave, valor = linha.split("=", 1)
        os.environ.setdefault(chave.strip(), valor.strip())


def exigir(nome: str) -> str:
    valor = os.environ.get(nome, "")
    if not valor:
        sys.exit(f"Variável {nome} ausente. Copie .env.example para .env e preencha.")
    return valor


def criar_secret(con: duckdb.DuckDBPyConnection) -> None:
    con.sql("INSTALL httpfs")
    con.sql("LOAD httpfs")
    # S3_ENDPOINT_URL tem esquema (http://localhost:9000, o RustFS); o DuckDB quer host:porta
    # em ENDPOINT e o esquema em USE_SSL.
    url = urlparse(exigir("S3_ENDPOINT_URL"))
    if url.scheme not in ("http", "https") or not url.netloc:
        sys.exit("S3_ENDPOINT_URL precisa começar com http:// ou https://")
    use_ssl = url.scheme == "https"
    con.execute(
        f"""
        CREATE OR REPLACE TEMPORARY SECRET lake (
            TYPE s3,
            PROVIDER config,
            KEY_ID '{exigir("S3_ACCESS_KEY")}',
            SECRET '{exigir("S3_SECRET_KEY")}',
            REGION '{os.environ.get("S3_REGION", "us-east-1")}',
            ENDPOINT '{url.netloc}',
            URL_STYLE 'path',
            USE_SSL {str(use_ssl).lower()}
        )
        """
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("arquivo_sql")
    parser.add_argument("--var", action="append", default=[], help="NOME=valor")
    args = parser.parse_args()

    carregar_env(pathlib.Path(".env"))
    texto = pathlib.Path(args.arquivo_sql).read_text(encoding="utf-8")
    variaveis = dict(par.split("=", 1) for par in args.var)
    for nome, valor in variaveis.items():
        texto = texto.replace("{{" + nome + "}}", valor)
    if "{{" in texto:
        sys.exit("O arquivo usa variáveis {{...}} não informadas com --var.")

    con = duckdb.connect()
    criar_secret(con)

    instrucoes = [s.strip() for s in texto.split(";\n") if s.strip()]
    for instrucao in instrucoes:
        sem_comentarios = "\n".join(
            l for l in instrucao.splitlines() if not l.strip().startswith("--")
        ).strip().rstrip(";")
        if not sem_comentarios:
            continue
        print(f"\n-- {sem_comentarios.splitlines()[0][:70]}")
        inicio = time.perf_counter()
        resultado = con.sql(sem_comentarios)
        if resultado is not None and resultado.columns[:1] == ["explain_key"]:
            for _, plano in resultado.fetchall():  # EXPLAIN: imprime o plano legível
                print(plano)
        elif resultado is not None:
            resultado.show(max_rows=40, max_width=160)
        print(f"   ({time.perf_counter() - inicio:.3f}s)")


if __name__ == "__main__":
    main()
