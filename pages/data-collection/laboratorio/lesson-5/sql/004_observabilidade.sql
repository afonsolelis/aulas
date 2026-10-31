-- Aula 05 · Observabilidade do processo de ingestão.
-- Três fontes: a própria db_ingestion (o que chegou), os manifestos no lake (como cada lote foi gravado)
-- e as linhas de telemetria descartadas (o que chegou e não virou fato).

-- ---------------------------------------------------------------------------
-- Linhas ingeridas por minuto e domínio. View materializada incremental.
-- Cada INSERT agrega só o próprio bloco; SummingMergeTree soma os blocos do mesmo minuto no merge,
-- e a leitura soma de novo com sum(), porque o merge pode não ter acontecido ainda.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.obs_ingestao_minuto
(
    minuto    DateTime('America/Sao_Paulo'),
    data_tag  LowCardinality(String),
    linhas    UInt64
)
ENGINE = SummingMergeTree
ORDER BY (data_tag, minuto);

CREATE MATERIALIZED VIEW IF NOT EXISTS dw.mv_obs_ingestao_minuto TO dw.obs_ingestao_minuto AS
SELECT toStartOfMinute(fromUnixTimestamp64Milli(toInt64(timestamp), 'America/Sao_Paulo')) AS minuto,
       data_tag,
       count() AS linhas
FROM ingestao.db_ingestion
GROUP BY minuto, data_tag;

-- ---------------------------------------------------------------------------
-- Linhas de telemetria que não viraram fato (nem leitura nem alerta), por minuto e motivo. Incremental.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.obs_telemetria_descartes_minuto
(
    minuto  DateTime('America/Sao_Paulo'),
    motivo  LowCardinality(String),
    linhas  UInt64
)
ENGINE = SummingMergeTree
ORDER BY (motivo, minuto);

CREATE MATERIALIZED VIEW IF NOT EXISTS dw.mv_obs_telemetria_descartes_minuto TO dw.obs_telemetria_descartes_minuto AS
WITH data_json.linha::String AS linha
SELECT toStartOfMinute(fromUnixTimestamp64Milli(toInt64(timestamp), 'America/Sao_Paulo')) AS minuto,
       multiIf(startsWith(linha, 'ERR SAT'), 'ERR SAT',
               startsWith(linha, '#RADIO'), '#RADIO',
               'outro') AS motivo,
       count() AS linhas
FROM ingestao.db_ingestion
WHERE data_tag = 'telemetria'
  AND NOT match(linha, '^CAM-[0-9]{4}(\\|| [0-9]{2}-[0-9]{2}-)')
  AND NOT startsWith(linha, 'TAC;')
GROUP BY minuto, motivo;

-- ---------------------------------------------------------------------------
-- Fato de lote. Grão: um lote gravado pelo consumidor (um manifesto no lake).
-- Os manifestos estão no RustFS, fora do ClickHouse: nenhum INSERT dispara uma view incremental.
-- Por isso é uma refreshable que relê os manifestos a cada minuto (coleção nomeada "lake").
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.fato_lote_ingestao
(
    lote                  String,
    data_key              UInt32,
    status                LowCardinality(String),
    mensagens             UInt32,
    linhas                UInt32,
    primeiro_recebido_em  DateTime64(3, 'America/Sao_Paulo'),
    flush_inicio          DateTime64(3, 'America/Sao_Paulo'),
    flush_fim             DateTime64(3, 'America/Sao_Paulo'),
    espera_ms             Float64,      -- do primeiro envelope ao início do flush
    flush_ms              Float64,      -- do início ao fim do flush
    raw_ms                Float64,
    bronze_ms             Float64,
    clickhouse_ms         Float64,
    erro                  String,
    arquivo_manifesto     String
)
ENGINE = MergeTree
ORDER BY (flush_inicio, lote);

CREATE MATERIALIZED VIEW IF NOT EXISTS dw.rmv_fato_lote_ingestao
REFRESH EVERY 1 MINUTE
TO dw.fato_lote_ingestao AS
WITH parseDateTime64BestEffort(JSONExtractString(json, 'primeiro_recebido_em'), 3, 'America/Sao_Paulo') AS primeiro,
     parseDateTime64BestEffort(JSONExtractString(json, 'flush_inicio'), 3, 'America/Sao_Paulo') AS inicio,
     parseDateTime64BestEffort(JSONExtractString(json, 'flush_fim'), 3, 'America/Sao_Paulo') AS fim
SELECT JSONExtractString(json, 'lote')                              AS lote,
       toYYYYMMDD(toDate(JSONExtractString(json, 'data')))          AS data_key,
       JSONExtractString(json, 'status')                            AS status,
       JSONExtractUInt(json, 'mensagens')                           AS mensagens,
       JSONExtractUInt(json, 'linhas')                              AS linhas,
       primeiro                                                     AS primeiro_recebido_em,
       inicio                                                       AS flush_inicio,
       fim                                                          AS flush_fim,
       dateDiff('millisecond', primeiro, inicio)                    AS espera_ms,
       dateDiff('millisecond', inicio, fim)                         AS flush_ms,
       JSONExtractFloat(json, 'tempos_ms', 'raw')                   AS raw_ms,
       JSONExtractFloat(json, 'tempos_ms', 'bronze')                AS bronze_ms,
       JSONExtractFloat(json, 'tempos_ms', 'clickhouse')            AS clickhouse_ms,
       ifNull(JSONExtractString(json, 'erro'), '')                  AS erro,
       _path                                                        AS arquivo_manifesto
FROM s3(lake);

-- ===========================================================================
-- Views em janela: views comuns com um filtro relativo a now(). Não guardam nada;
-- cada consulta roda o SELECT de novo, e a janela anda com o relógio.
-- ===========================================================================

-- Saúde por domínio nos últimos 15 minutos: volume e há quanto tempo não chega nada.
CREATE OR REPLACE VIEW dw.v_saude_ingestao_15min AS
SELECT data_tag,
       sum(linhas)                                AS linhas_15min,
       max(minuto)                                AS ultimo_minuto_com_dado,
       dateDiff('second', max(minuto), now())     AS segundos_desde_ultimo_minuto
FROM dw.obs_ingestao_minuto
WHERE minuto >= now() - INTERVAL 15 MINUTE
GROUP BY data_tag;

-- Lotes da última hora: quantos, quantos com erro, tempos de flush e de espera.
CREATE OR REPLACE VIEW dw.v_lotes_ultima_hora AS
SELECT count()                                    AS lotes,
       countIf(status != 'ok')                    AS lotes_com_erro,
       sum(linhas)                                AS linhas,
       round(quantile(0.5)(flush_ms))             AS flush_p50_ms,
       round(quantile(0.95)(flush_ms))            AS flush_p95_ms,
       round(max(espera_ms))                      AS espera_max_ms,
       max(flush_fim)                             AS ultimo_flush
FROM dw.fato_lote_ingestao
WHERE flush_inicio >= now() - INTERVAL 1 HOUR;

-- Descartes de telemetria na última hora, por motivo, com a parte do total.
CREATE OR REPLACE VIEW dw.v_descartes_telemetria_1h AS
SELECT d.motivo,
       sum(d.linhas)                                                         AS descartadas,
       (SELECT sum(linhas) FROM dw.obs_ingestao_minuto
        WHERE data_tag = 'telemetria' AND minuto >= now() - INTERVAL 1 HOUR) AS telemetria_total,
       round(100 * descartadas / telemetria_total, 2)                        AS pct
FROM dw.obs_telemetria_descartes_minuto AS d
WHERE d.minuto >= now() - INTERVAL 1 HOUR
GROUP BY d.motivo;
