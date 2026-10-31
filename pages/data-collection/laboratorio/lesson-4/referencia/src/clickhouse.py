import clickhouse_connect
from src.config import env


class TabelaIngestao:
    COLUNAS = ["timestamp", "data_json", "data_tag"]

    def __init__(self):
        self.cli = clickhouse_connect.get_client(
            host=env("CLICKHOUSE_HOST", "localhost"), port=int(env("CLICKHOUSE_HTTP_PORT", "8123")),
            username=env("CLICKHOUSE_USER"), password=env("CLICKHOUSE_PASSWORD"),
            database=env("CLICKHOUSE_DATABASE", "ingestao"),
            # O ClickHouse 26.8 liga async_insert por padrão: o servidor junta INSERTs pequenos
            # e segura cada um por 50 a 200 ms. O consumidor já faz o lote, então desligamos.
            # data_json é do tipo JSON: o servidor infere o tipo de cada caminho no INSERT.
            # Datas e horas ficam como texto, para não perder o deslocamento (-03:00).
            settings={"async_insert": int(env("CLICKHOUSE_ASYNC_INSERT", "0")),
                      "input_format_try_infer_dates": 0,
                      "input_format_try_infer_datetimes": 0})
        self.tabela = env("CLICKHOUSE_TABELA", "db_ingestion")

    def inserir(self, linhas: list[tuple[int, str, str]]) -> None:
        """Um INSERT por lote: cada INSERT cria uma parte no MergeTree.
        O data_json vai como texto JSON; o servidor o converte para o tipo JSON da coluna."""
        self.cli.insert(self.tabela, linhas, column_names=self.COLUNAS)
