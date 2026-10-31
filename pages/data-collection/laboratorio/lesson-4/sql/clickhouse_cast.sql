-- Aula 04 · JSON cast no ClickHouse, sobre ingestao.db_ingestion.
-- data_json é do tipo JSON: cada caminho já é uma subcoluna, lida com data_json.caminho.
-- O valor de um caminho sai como Dynamic; o ::Tipo diz como ler.
-- Uso: docker compose exec -T clickhouse clickhouse-client --user "$CLICKHOUSE_USER" \
--        --password "$CLICKHOUSE_PASSWORD" --time --multiquery < sql/clickhouse_cast.sql

-- 1. Linhas por domínio (gate da Etapa 09) e o intervalo de ingestão em hora legível.
SELECT data_tag, count() AS linhas,
       fromUnixTimestamp64Milli(toInt64(min(timestamp)), 'America/Sao_Paulo') AS primeira,
       fromUnixTimestamp64Milli(toInt64(max(timestamp)), 'America/Sao_Paulo') AS ultima
FROM ingestao.db_ingestion
GROUP BY data_tag
ORDER BY data_tag;

-- 2. Os caminhos de cada domínio e o tipo que o servidor inferiu no INSERT.
SELECT data_tag, arrayJoin(JSONAllPathsWithTypes(data_json)) AS caminho_tipo, count() AS linhas
FROM ingestao.db_ingestion
GROUP BY data_tag, caminho_tipo
ORDER BY data_tag, caminho_tipo;

-- 3. Livros: preço médio por categoria, lendo as subcolunas pelo caminho.
SELECT data_json.categoria::String                     AS categoria,
       count()                                         AS livros,
       round(avg(data_json.preco_gbp::Float64), 2)     AS preco_medio_gbp
FROM ingestao.db_ingestion
WHERE data_tag = 'livros'          -- primeira coluna do ORDER BY: lê só os grânulos de livros
GROUP BY categoria
ORDER BY livros DESC, categoria
LIMIT 10;

-- 4. A mesma conta com o preço lido como decimal: o ::Tipo da consulta decide o arredondamento.
SELECT data_json.categoria::String                          AS categoria,
       round(avg(data_json.preco_gbp::Decimal(10, 2)), 2)   AS preco_medio_gbp
FROM ingestao.db_ingestion
WHERE data_tag = 'livros'
GROUP BY categoria
ORDER BY categoria
LIMIT 5;

-- 5. PTAX: venda média por tipo de boletim.
SELECT data_json.tipoBoletim::String                   AS tipo_boletim,
       count()                                         AS boletins,
       round(avg(data_json.cotacaoVenda::Float64), 5)  AS venda_media
FROM ingestao.db_ingestion
WHERE data_tag = 'ptax'
GROUP BY tipo_boletim
ORDER BY tipo_boletim;

-- 6. Telemetria: caminhão extraído da linha de texto por expressão regular.
SELECT nullIf(extract(data_json.linha::String, 'CAM-[0-9]{4}'), '') AS caminhao,
       count() AS linhas
FROM ingestao.db_ingestion
WHERE data_tag = 'telemetria'
GROUP BY caminhao
ORDER BY linhas DESC
LIMIT 5;

-- 7. Duplicatas: o par (timestamp, data_json) repetido indica reentrega.
--    toJSONString devolve o objeto como texto, com as chaves em ordem alfabética.
SELECT data_tag, count() AS linhas, uniqExact(timestamp, toJSONString(data_json)) AS distintas
FROM ingestao.db_ingestion
GROUP BY data_tag
ORDER BY data_tag;

-- 8. Partes e compressão da tabela (micro-lote e tamanho).
SELECT count() AS partes_ativas, sum(rows) AS linhas,
       formatReadableSize(sum(data_compressed_bytes))   AS comprimido,
       formatReadableSize(sum(data_uncompressed_bytes)) AS descomprimido
FROM system.parts
WHERE database = 'ingestao' AND table = 'db_ingestion' AND active;
