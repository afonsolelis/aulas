-- Aula 06 - Streaming com RabbitMQ e ClickHouse
-- DDL do armazenamento analitico do mini projeto IoT.
--
-- Localmente este arquivo roda sozinho na primeira subida do contêiner
-- (montado em /docker-entrypoint-initdb.d). No Railway, aplique-o uma vez
-- pela interface HTTPS (ver README.md, Parte 5).
--
-- O banco se chama iot. Se você mudar CLICKHOUSE_DB no .env, ajuste aqui.

CREATE DATABASE IF NOT EXISTS iot;

-- Leituras validas, ja normalizadas pelo transformador.
-- Grão: uma leitura por sensor (device_id) por instante de medição (medido_em).
--
-- Duas defesas contra duplicatas, com papéis diferentes:
-- 1) non_replicated_deduplication_window: o ClickHouse guarda o identificador
--    dos ultimos N blocos inseridos. Reenviar o MESMO lote com o MESMO
--    insert_deduplication_token (retry depois de um 502) é ignorado.
--    Em MergeTree não replicado o padrão é 0, ou seja, nada é deduplicado.
-- 2) ReplacingMergeTree(ingerido_em): linhas com a mesma chave ORDER BY
--    (device_id, medido_em) colapsam em uma só durante os merges, que ocorrem
--    em momento imprevisível. Consultas que exigem exatidão usam FINAL.
CREATE TABLE IF NOT EXISTS iot.leituras
(
    event_id      String,
    device_id     LowCardinality(String),
    local         LowCardinality(String),
    tipo_local    LowCardinality(String),
    medido_em     DateTime64(3, 'UTC'),
    temperatura_c Float32,
    umidade_pct   Float32,
    lote_id       String,
    ingerido_em   DateTime64(3, 'UTC') DEFAULT now64(3)
)
ENGINE = ReplacingMergeTree(ingerido_em)
PARTITION BY toYYYYMM(medido_em)
ORDER BY (device_id, medido_em)
-- Retenção de 90 dias: hipótese didática, validação pendente com a persona.
TTL toDateTime(medido_em) + INTERVAL 90 DAY
SETTINGS non_replicated_deduplication_window = 1000;

-- Leituras rejeitadas que o grupo decidir também registrar para auditoria
-- (além da DLQ no RabbitMQ). Guarda o payload bruto e o motivo.
CREATE TABLE IF NOT EXISTS iot.leituras_rejeitadas
(
    recebido_em   DateTime64(3, 'UTC') DEFAULT now64(3),
    device_id     String,
    motivo        LowCardinality(String),
    payload       String
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(recebido_em)
ORDER BY (motivo, recebido_em)
-- Retenção de 30 dias: hipótese didática, validação pendente.
TTL toDateTime(recebido_em) + INTERVAL 30 DAY;
