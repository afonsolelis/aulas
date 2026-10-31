-- Aula 05 · Relatórios fechados com views materializadas refreshable.
-- O SELECT roda inteiro no horário do REFRESH e troca o conteúdo da tabela de destino de uma vez.
-- Só entram dias fechados (anteriores a hoje): o número de um dia não muda depois de publicado.
-- Para rodar agora, sem esperar o horário: SYSTEM REFRESH VIEW dw.rmv_...; SYSTEM WAIT VIEW dw.rmv_...;

-- ---------------------------------------------------------------------------
-- Preço médio por categoria e dia de coleta, em GBP e em BRL.
-- Grão do relatório: categoria x dia. O BRL usa o último Fechamento PTAX até o dia (ASOF JOIN).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.rel_preco_categoria_dia
(
    data_key         UInt32,
    categoria        LowCardinality(String),
    livros           UInt32,
    preco_medio_gbp  Decimal(10, 2),
    ptax_venda       Decimal(12, 5),
    data_ptax        Date,
    preco_medio_brl  Decimal(12, 2)
)
ENGINE = MergeTree
ORDER BY (data_key, categoria);

CREATE MATERIALIZED VIEW IF NOT EXISTS dw.rmv_preco_categoria_dia
REFRESH EVERY 1 DAY OFFSET 1 HOUR          -- todo dia à 01h00 do servidor
TO dw.rel_preco_categoria_dia AS
WITH fechamento AS
(
    SELECT moeda, toDate(data_hora) AS data, argMax(cotacao_venda, data_hora) AS venda
    FROM dw.fato_cotacao_ptax FINAL
    WHERE tipo_boletim IN ('Fechamento', 'Fechamento PTAX')
    GROUP BY moeda, data
),
precos AS
(
    SELECT p.data_key, toDate(toString(p.data_key)) AS data, 'GBP' AS moeda, l.categoria, p.preco_gbp
    FROM dw.fato_preco_livro AS p FINAL
    INNER JOIN dw.dim_livro AS l FINAL ON l.upc = p.upc
    WHERE p.data_key < toYYYYMMDD(today())
)
SELECT pr.data_key                                         AS data_key,
       pr.categoria                                        AS categoria,
       toUInt32(count())                                   AS livros,
       toDecimal64(avg(pr.preco_gbp), 2)                   AS preco_medio_gbp,
       any(f.venda)                                        AS ptax_venda,
       any(f.data)                                         AS data_ptax,
       toDecimal64(avg(pr.preco_gbp) * any(f.venda), 2)    AS preco_medio_brl
FROM precos AS pr
ASOF LEFT JOIN fechamento AS f ON pr.moeda = f.moeda AND pr.data >= f.data
GROUP BY pr.data_key, pr.categoria;

-- ---------------------------------------------------------------------------
-- Telemetria por caminhão e dia. Grão do relatório: caminhão x dia.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dw.rel_telemetria_caminhao_dia
(
    data_key            UInt32,
    caminhao            LowCardinality(String),
    leituras            UInt32,
    velocidade_media    Float32,
    velocidade_maxima   UInt16,
    primeira_leitura    DateTime('America/Sao_Paulo'),
    ultima_leitura      DateTime('America/Sao_Paulo'),
    leituras_espaco_pct Float32               -- parte das leituras no formato com espaço
)
ENGINE = MergeTree
ORDER BY (data_key, caminhao);

CREATE MATERIALIZED VIEW IF NOT EXISTS dw.rmv_telemetria_caminhao_dia
REFRESH EVERY 1 DAY OFFSET 1 HOUR
TO dw.rel_telemetria_caminhao_dia AS
SELECT data_key,
       caminhao,
       toUInt32(count())                                   AS leituras,
       round(avg(velocidade_kmh), 1)                       AS velocidade_media,
       max(velocidade_kmh)                                 AS velocidade_maxima,
       min(instante)                                       AS primeira_leitura,
       max(instante)                                       AS ultima_leitura,
       round(100 * countIf(formato = 'espaco') / count(), 1) AS leituras_espaco_pct
FROM dw.fato_leitura_telemetria FINAL
WHERE data_key < toYYYYMMDD(today())
GROUP BY data_key, caminhao;
