-- Aula 06 - consultas analíticas de referência sobre iot.leituras
-- Rode no ClickHouse local:
--   docker compose exec clickhouse clickhouse-client --user iot --password "$CLICKHOUSE_PASSWORD" --multiquery < consultas_analiticas.sql
-- Ou cole uma por vez no cliente.

-- 1) Volume e duplicatas ainda não colapsadas pelo merge
SELECT
    count()                          AS linhas_fisicas,
    (SELECT count() FROM iot.leituras FINAL) AS linhas_logicas
FROM iot.leituras;

-- 2) Média por janela de 5 minutos, por local (janela fixa / tumbling)
SELECT
    toStartOfInterval(medido_em, INTERVAL 5 MINUTE) AS janela,
    local,
    round(avg(temperatura_c), 2) AS temp_media_c,
    round(avg(umidade_pct), 1)   AS umid_media_pct,
    count()                      AS leituras
FROM iot.leituras FINAL
WHERE medido_em >= now64(3) - INTERVAL 1 HOUR
GROUP BY janela, local
ORDER BY janela, local;

-- 3) Último valor por sensor (argMax pelo instante de medição)
SELECT
    device_id,
    any(local)                          AS local,
    max(medido_em)                      AS ultima_medicao,
    argMax(temperatura_c, medido_em)    AS temperatura_c,
    argMax(umidade_pct, medido_em)      AS umidade_pct
FROM iot.leituras
GROUP BY device_id
ORDER BY device_id;

-- 4) Último valor por sensor, forma alternativa com LIMIT 1 BY
SELECT device_id, local, medido_em, temperatura_c, umidade_pct
FROM iot.leituras FINAL
ORDER BY device_id, medido_em DESC
LIMIT 1 BY device_id;

-- 5) Sensores silenciosos: sem leitura nos últimos 2 minutos
SELECT device_id, max(medido_em) AS ultima_medicao
FROM iot.leituras
GROUP BY device_id
HAVING ultima_medicao < now64(3) - INTERVAL 2 MINUTE
ORDER BY ultima_medicao;

-- 6) Atraso entre medição e gravação (latência ponta a ponta observada)
SELECT
    quantile(0.5)(dateDiff('millisecond', medido_em, ingerido_em))  AS p50_ms,
    quantile(0.95)(dateDiff('millisecond', medido_em, ingerido_em)) AS p95_ms
FROM iot.leituras
WHERE ingerido_em >= now64(3) - INTERVAL 15 MINUTE;

-- 7) Rejeições por motivo (se o grupo gravar a tabela de auditoria)
SELECT motivo, count() AS total
FROM iot.leituras_rejeitadas
GROUP BY motivo
ORDER BY total DESC;

-- 8) Partes e partições: observar o efeito de inserir em lote ou linha a linha
SELECT partition, count() AS partes_ativas, sum(rows) AS linhas
FROM system.parts
WHERE database = 'iot' AND table = 'leituras' AND active
GROUP BY partition
ORDER BY partition;
