-- Aula 04 · Tabela de pouso da ingestão no ClickHouse.
-- Executado pelo contêiner na primeira subida (docker-entrypoint-initdb.d).
-- Três colunas: hora da ingestão, o dado no tipo JSON e o domínio.
CREATE DATABASE IF NOT EXISTS ingestao;

CREATE TABLE IF NOT EXISTS ingestao.db_ingestion
(
    timestamp UInt64,                  -- unix em milissegundos, hora da ingestão (dada pelo servidor)
    data_json JSON,                    -- o dado recebido, no tipo JSON: cada caminho vira subcoluna tipada
    data_tag  LowCardinality(String)   -- o domínio: telemetria, livros, ptax
)
ENGINE = MergeTree
-- uma partição por mês da ingestão
PARTITION BY toYYYYMM(fromUnixTimestamp64Milli(toInt64(timestamp)))
-- índice esparso: filtros por data_tag e por intervalo de tempo leem poucos grânulos
ORDER BY (data_tag, timestamp);

-- O tipo de cada caminho é inferido no INSERT. Datas e horas ficam como texto porque o
-- consumidor insere com input_format_try_infer_dates = 0 e input_format_try_infer_datetimes = 0.
-- Sem isso, "2026-10-30T19:27:52-03:00" vira DateTime em UTC e o -03:00 se perde.
