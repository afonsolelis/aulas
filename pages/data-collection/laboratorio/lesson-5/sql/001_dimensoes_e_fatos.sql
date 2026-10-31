-- Aula 05 · Modelo dimensional no ClickHouse, sobre ingestao.db_ingestion (Aula 04).
-- Banco dw: dimensões, fatos e as views materializadas que os alimentam a cada INSERT.
-- Uso: docker compose exec -T clickhouse clickhouse-client --user "$CLICKHOUSE_USER" \
--        --password "$CLICKHOUSE_PASSWORD" --multiquery < sql/001_dimensoes_e_fatos.sql
CREATE DATABASE IF NOT EXISTS dw;

-- ---------------------------------------------------------------------------
-- Dimensão de data. Grão: um dia. Chave AAAAMMDD, gerada, não vem da fonte.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.dim_data
(
    data_key    UInt32,                    -- 20261030
    data        Date,
    ano         UInt16,
    mes         UInt8,
    dia         UInt8,
    dia_semana  UInt8,                     -- 1 = segunda ... 7 = domingo
    nome_dia    LowCardinality(String),
    fim_semana  Bool
)
ENGINE = MergeTree
ORDER BY data_key;

INSERT INTO dw.dim_data
SELECT toYYYYMMDD(d), d, toYear(d), toMonth(d), toDayOfMonth(d), toDayOfWeek(d),
       ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'][toDayOfWeek(d)],
       toDayOfWeek(d) >= 6
FROM (SELECT toDate('2026-01-01') + number AS d FROM numbers(731))
WHERE (SELECT count() FROM dw.dim_data) = 0;   -- roda uma vez só

-- ---------------------------------------------------------------------------
-- Dimensão de livro. Grão: um livro (upc). SCD tipo 1: fica a versão mais recente.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.dim_livro
(
    upc          String,
    titulo       String,
    categoria    LowCardinality(String),
    url          String,
    avaliacao    UInt8,
    versao_ms    UInt64                    -- timestamp da ingestão: a maior versão vence
)
ENGINE = ReplacingMergeTree(versao_ms)
ORDER BY upc;

-- ---------------------------------------------------------------------------
-- Dimensão de caminhão. Grão: um caminhão. Só a chave e quando apareceu.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.dim_caminhao
(
    caminhao          LowCardinality(String),
    primeira_leitura  SimpleAggregateFunction(min, DateTime('America/Sao_Paulo')),
    ultima_leitura    SimpleAggregateFunction(max, DateTime('America/Sao_Paulo'))
)
ENGINE = AggregatingMergeTree
ORDER BY caminhao;

-- ---------------------------------------------------------------------------
-- Fato de preço de livro. Grão: um livro em um dia de coleta (snapshot periódico).
-- preco_gbp não soma entre dias; qtd_estoque soma entre livros, não entre dias.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.fato_preco_livro
(
    data_key     UInt32,
    upc          String,
    preco_gbp    Decimal(10, 2),
    qtd_estoque  UInt32,
    em_estoque   Bool,
    coletado_em  DateTime('America/Sao_Paulo'),
    versao_ms    UInt64
)
ENGINE = ReplacingMergeTree(versao_ms)    -- reentrega e nova coleta no mesmo dia: fica a mais recente
ORDER BY (data_key, upc);

-- ---------------------------------------------------------------------------
-- Fato de cotação PTAX. Grão: um boletim (moeda, instante, tipo de boletim).
-- Cotações não são aditivas: média, mínimo, último, nunca soma.
-- tipo_boletim é dimensão degenerada: fica no fato, sem tabela própria.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.fato_cotacao_ptax
(
    data_key          UInt32,
    moeda             LowCardinality(String),
    data_hora         DateTime64(3, 'America/Sao_Paulo'),
    tipo_boletim      LowCardinality(String),
    cotacao_compra    Decimal(12, 5),
    cotacao_venda     Decimal(12, 5),
    versao_ms         UInt64
)
ENGINE = ReplacingMergeTree(versao_ms)
ORDER BY (moeda, data_hora, tipo_boletim);

-- ---------------------------------------------------------------------------
-- Fato de leitura de telemetria. Grão: uma leitura de posição de um caminhão num instante.
-- As linhas sem leitura (ERR SAT, #RADIO) não entram aqui: vão para a observabilidade.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.fato_leitura_telemetria
(
    data_key        UInt32,
    caminhao        LowCardinality(String),
    instante        DateTime('America/Sao_Paulo'),
    latitude        Float64,
    longitude       Float64,
    velocidade_kmh  UInt16,
    formato         LowCardinality(String),   -- 'barra' (CAM|data|...) ou 'espaco' (CAM data GPS ...)
    arquivo         String,
    numero_linha    UInt32,
    versao_ms       UInt64
)
ENGINE = ReplacingMergeTree(versao_ms)
ORDER BY (caminhao, instante);

-- ---------------------------------------------------------------------------
-- Fato de alerta de direção contínua. Grão: um alerta do tacógrafo (caminhão, instante).
-- Vem do mesmo arquivo da telemetria, mas é outro evento: não é posição, é tempo ao volante.
-- Linha: TAC;CAM-3126;20261029T180000;DIRECAO CONTINUA 05:35;ALERTA
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.fato_alerta_direcao
(
    data_key          UInt32,
    caminhao          LowCardinality(String),
    instante          DateTime('America/Sao_Paulo'),
    direcao_continua_min UInt16,             -- 05:35 vira 335 minutos
    arquivo           String,
    numero_linha      UInt32,
    versao_ms         UInt64
)
ENGINE = ReplacingMergeTree(versao_ms)
ORDER BY (caminhao, instante);

-- ===========================================================================
-- Views materializadas incrementais: cada INSERT em db_ingestion dispara o SELECT
-- sobre o bloco inserido e grava o resultado na tabela de destino (TO ...).
-- Os OrNull evitam que um valor fora do tipo derrube o INSERT do lote inteiro.
-- ===========================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS dw.mv_dim_livro TO dw.dim_livro AS
SELECT data_json.upc::String                                    AS upc,
       data_json.titulo::String                                 AS titulo,
       data_json.categoria::String                              AS categoria,
       data_json.url::String                                    AS url,
       toUInt8OrZero(data_json.avaliacao::String)               AS avaliacao,
       timestamp                                                AS versao_ms
FROM ingestao.db_ingestion
WHERE data_tag = 'livros' AND data_json.upc::String != '';

CREATE MATERIALIZED VIEW IF NOT EXISTS dw.mv_fato_preco_livro TO dw.fato_preco_livro AS
SELECT toYYYYMMDD(coletado_em)                                  AS data_key,
       data_json.upc::String                                    AS upc,
       toDecimal64OrZero(data_json.preco_gbp::String, 2)        AS preco_gbp,
       toUInt32OrZero(data_json.qtd_estoque::String)            AS qtd_estoque,
       data_json.em_estoque::String = 'true'                    AS em_estoque,
       parseDateTimeBestEffort(data_json.coletado_em::String, 'America/Sao_Paulo') AS coletado_em,
       timestamp                                                AS versao_ms
FROM ingestao.db_ingestion
WHERE data_tag = 'livros' AND data_json.upc::String != '';

CREATE MATERIALIZED VIEW IF NOT EXISTS dw.mv_fato_cotacao_ptax TO dw.fato_cotacao_ptax AS
SELECT toYYYYMMDD(data_hora)                                    AS data_key,
       data_json.moeda::String                                  AS moeda,
       parseDateTime64BestEffort(data_json.dataHoraCotacao::String, 3, 'America/Sao_Paulo') AS data_hora,
       data_json.tipoBoletim::String                            AS tipo_boletim,
       toDecimal64OrZero(data_json.cotacaoCompra::String, 5)    AS cotacao_compra,
       toDecimal64OrZero(data_json.cotacaoVenda::String, 5)     AS cotacao_venda,
       timestamp                                                AS versao_ms
FROM ingestao.db_ingestion
WHERE data_tag = 'ptax';

-- Telemetria: dois formatos de linha. Barra: CAM-0451|29/10/26 06:00:55|-23.6965,-46.7802|VEL 083|...
-- Espaço: CAM-0451 29-10-2026 06:05:55 GPS -23.6527 -46.7452 v=86. O horário é o de Brasília.
CREATE MATERIALIZED VIEW IF NOT EXISTS dw.mv_fato_leitura_telemetria TO dw.fato_leitura_telemetria AS
WITH data_json.linha::String AS linha,
     match(linha, '^CAM-[0-9]{4}\\|')                AS barra,
     match(linha, '^CAM-[0-9]{4} [0-9]{2}-[0-9]{2}-') AS espaco,
     if(barra,
        parseDateTimeOrNull(extract(linha, '\\|([0-9/]+ [0-9:]+)\\|'), '%d/%m/%y %H:%i:%s', 'America/Sao_Paulo'),
        parseDateTimeOrNull(extract(linha, ' ([0-9-]+ [0-9:]+) GPS'), '%d-%m-%Y %H:%i:%s', 'America/Sao_Paulo')) AS inst
SELECT toYYYYMMDD(assumeNotNull(inst))                         AS data_key,
       substring(linha, 1, 8)                                   AS caminhao,
       assumeNotNull(inst)                                      AS instante,
       toFloat64OrZero(if(barra, extract(linha, '\\|(-?[0-9.]+),'), extract(linha, 'GPS (-?[0-9.]+) '))) AS latitude,
       toFloat64OrZero(if(barra, extract(linha, ',(-?[0-9.]+)\\|'), extract(linha, 'GPS -?[0-9.]+ (-?[0-9.]+)'))) AS longitude,
       toUInt16OrZero(if(barra, extract(linha, 'VEL ([0-9]+)'), extract(linha, 'v=([0-9]+)'))) AS velocidade_kmh,
       if(barra, 'barra', 'espaco')                             AS formato,
       data_json.arquivo::String                                AS arquivo,
       toUInt32OrZero(data_json.numero_linha::String)           AS numero_linha,
       timestamp                                                AS versao_ms
FROM ingestao.db_ingestion
WHERE data_tag = 'telemetria' AND (barra OR espaco) AND inst IS NOT NULL;

CREATE MATERIALIZED VIEW IF NOT EXISTS dw.mv_fato_alerta_direcao TO dw.fato_alerta_direcao AS
WITH data_json.linha::String AS linha,
     splitByChar(';', linha) AS campos,
     parseDateTimeOrNull(campos[3], '%Y%m%dT%H%i%s', 'America/Sao_Paulo') AS inst
SELECT toYYYYMMDD(assumeNotNull(inst))                          AS data_key,
       campos[2]                                                AS caminhao,
       assumeNotNull(inst)                                      AS instante,
       toUInt16(toUInt16OrZero(substring(campos[4], -5, 2)) * 60 + toUInt16OrZero(substring(campos[4], -2, 2))) AS direcao_continua_min,
       data_json.arquivo::String                                AS arquivo,
       toUInt32OrZero(data_json.numero_linha::String)           AS numero_linha,
       timestamp                                                AS versao_ms
FROM ingestao.db_ingestion
WHERE data_tag = 'telemetria' AND startsWith(linha, 'TAC;') AND inst IS NOT NULL;

CREATE MATERIALIZED VIEW IF NOT EXISTS dw.mv_dim_caminhao TO dw.dim_caminhao AS
SELECT caminhao, min(instante) AS primeira_leitura, max(instante) AS ultima_leitura
FROM dw.fato_leitura_telemetria
GROUP BY caminhao;
