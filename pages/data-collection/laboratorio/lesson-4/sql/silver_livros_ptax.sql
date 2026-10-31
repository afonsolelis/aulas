-- Aula 04 · Silver de livros e PTAX a partir do histórico da ingestão (contrato da silver, o mesmo da Aula 03).
-- Uso: python sql/rodar_sql.py sql/silver_livros_ptax.sql --var DATA=2026-10-31
-- DATA é a data da coleta dos livros (dia de coletado_em no horário de Brasília).
-- Lê o bronze (bronze/ingestao/data_tag=X/...). arquivo_origem é o Parquet do bronze de onde a linha veio.

SET TimeZone = 'America/Sao_Paulo';

-- 1. Livros: tipos do contrato, um por upc, fica a coleta mais recente.
COPY (
    SELECT
        l.upc, l.url, l.titulo, l.categoria,
        CAST(l.avaliacao AS TINYINT)                AS avaliacao,
        CAST(l.preco_gbp AS DECIMAL(10, 2))         AS preco_gbp,
        l.em_estoque,
        CAST(l.qtd_estoque AS INTEGER)              AS qtd_estoque,
        -- lido como texto: a conversão respeita o deslocamento -03:00 gravado pela Aula 03
        CAST(l.coletado_em AS TIMESTAMPTZ)          AS coletado_em,
        filename                                    AS arquivo_origem,
        now()                                       AS processado_em
    FROM (
        SELECT from_json(data_json, '{"upc":"VARCHAR","url":"VARCHAR","titulo":"VARCHAR","categoria":"VARCHAR",
                                      "avaliacao":"BIGINT","preco_gbp":"DOUBLE","em_estoque":"BOOLEAN",
                                      "qtd_estoque":"BIGINT","coletado_em":"VARCHAR"}') AS l,
               timestamp, filename
        FROM read_parquet('s3://bronze/ingestao/data_tag=livros/*/*.parquet', hive_partitioning = true, filename = true)
    )
    WHERE CAST(CAST(l.coletado_em AS TIMESTAMPTZ) AS DATE) = DATE '{{DATA}}'
    -- reentrega ou recoleta: fica a coleta mais recente; empate, a ingestão mais recente
    QUALIFY row_number() OVER (PARTITION BY l.upc ORDER BY CAST(l.coletado_em AS TIMESTAMPTZ) DESC, timestamp DESC) = 1
    ORDER BY l.upc
) TO 's3://silver/livros/data_coleta={{DATA}}/livros.parquet' (FORMAT parquet, COMPRESSION zstd);

-- 2. PTAX: tabela pequena, recalculada inteira, um boletim por (moeda, data_hora_cotacao, tipo_boletim).
COPY (
    SELECT
        CAST(p.moeda AS VARCHAR)                    AS moeda,
        CAST(p.dataHoraCotacao AS TIMESTAMP)        AS data_hora_cotacao,
        CAST(p.tipoBoletim AS VARCHAR)              AS tipo_boletim,
        CAST(p.cotacaoCompra AS DECIMAL(12, 5))     AS cotacao_compra,
        CAST(p.cotacaoVenda AS DECIMAL(12, 5))      AS cotacao_venda,
        filename                                    AS arquivo_origem,
        now()                                       AS processado_em
    FROM (
        SELECT from_json(data_json, '{"moeda":"VARCHAR","dataHoraCotacao":"VARCHAR","tipoBoletim":"VARCHAR",
                                      "cotacaoCompra":"DOUBLE","cotacaoVenda":"DOUBLE"}') AS p,
               timestamp, filename
        FROM read_parquet('s3://bronze/ingestao/data_tag=ptax/*/*.parquet', hive_partitioning = true, filename = true)
    )
    QUALIFY row_number() OVER (PARTITION BY moeda, data_hora_cotacao, tipo_boletim ORDER BY timestamp DESC) = 1
    ORDER BY data_hora_cotacao
) TO 's3://silver/ptax/ptax.parquet' (FORMAT parquet, COMPRESSION zstd);

-- 3. Conferência: contagens, faixa de preço e origem no silver.
SELECT data_coleta, count(*) AS livros, count(DISTINCT upc) AS upcs,
       min(preco_gbp) AS menor, max(preco_gbp) AS maior,
       count(*) FILTER (WHERE arquivo_origem IS NULL) AS sem_origem
FROM read_parquet('s3://silver/livros/data_coleta={{DATA}}/*.parquet', hive_partitioning = true)
GROUP BY data_coleta;

DESCRIBE SELECT * FROM read_parquet('s3://silver/livros/data_coleta={{DATA}}/*.parquet', hive_partitioning = true);

SELECT moeda, CAST(data_hora_cotacao AS DATE) AS dia, count(*) AS boletins,
       max(cotacao_venda) FILTER (WHERE tipo_boletim IN ('Fechamento PTAX', 'Fechamento')) AS fechamento_venda
FROM read_parquet('s3://silver/ptax/*.parquet')
GROUP BY ALL
ORDER BY dia;

DESCRIBE SELECT * FROM read_parquet('s3://silver/ptax/*.parquet');
