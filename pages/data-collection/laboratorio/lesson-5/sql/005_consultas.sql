-- Aula 05 · Consultas de conferência: grão, estrela, views e observabilidade.
-- Uso: docker compose exec -T clickhouse clickhouse-client --user "$CLICKHOUSE_USER" \
--        --password "$CLICKHOUSE_PASSWORD" --multiquery < sql/005_consultas.sql

-- 1. Teste do grão: com FINAL, linhas = combinações distintas da chave do grão.
--    Sem FINAL, a diferença são as cópias que o ReplacingMergeTree ainda não juntou.
SELECT 'fato_preco_livro' AS fato,
       (SELECT count() FROM dw.fato_preco_livro)                                    AS linhas_sem_final,
       (SELECT count() FROM dw.fato_preco_livro FINAL)                              AS linhas_final,
       (SELECT uniqExact(data_key, upc) FROM dw.fato_preco_livro)                   AS chaves_do_grao
UNION ALL
SELECT 'fato_cotacao_ptax',
       (SELECT count() FROM dw.fato_cotacao_ptax),
       (SELECT count() FROM dw.fato_cotacao_ptax FINAL),
       (SELECT uniqExact(moeda, data_hora, tipo_boletim) FROM dw.fato_cotacao_ptax)
UNION ALL
SELECT 'fato_leitura_telemetria',
       (SELECT count() FROM dw.fato_leitura_telemetria),
       (SELECT count() FROM dw.fato_leitura_telemetria FINAL),
       (SELECT uniqExact(caminhao, instante) FROM dw.fato_leitura_telemetria)
UNION ALL
SELECT 'fato_alerta_direcao',
       (SELECT count() FROM dw.fato_alerta_direcao),
       (SELECT count() FROM dw.fato_alerta_direcao FINAL),
       (SELECT uniqExact(caminhao, instante) FROM dw.fato_alerta_direcao)
FORMAT PrettyCompactNoEscapes;

-- 2. Para onde foi cada linha de telemetria da tabela de pouso.
SELECT multiIf(match(l, '^CAM-[0-9]{4}\\|'), 'leitura, formato barra',
               match(l, '^CAM-[0-9]{4} [0-9]{2}-[0-9]{2}-'), 'leitura, formato espaço',
               startsWith(l, 'TAC;'), 'alerta de direção',
               startsWith(l, 'ERR SAT'), 'descarte: ERR SAT',
               startsWith(l, '#RADIO'), 'descarte: #RADIO',
               'descarte: outro') AS destino,
       count() AS linhas
FROM (SELECT data_json.linha::String AS l FROM ingestao.db_ingestion WHERE data_tag = 'telemetria')
GROUP BY destino
ORDER BY linhas DESC
FORMAT PrettyCompactNoEscapes;

-- 3. Estrela: preço médio por categoria e dia da semana da coleta (fato + duas dimensões).
SELECT d.nome_dia, l.categoria, count() AS livros, round(avg(p.preco_gbp), 2) AS preco_medio_gbp
FROM dw.fato_preco_livro AS p FINAL
INNER JOIN dw.dim_livro AS l FINAL ON l.upc = p.upc
INNER JOIN dw.dim_data AS d ON d.data_key = p.data_key
GROUP BY d.nome_dia, l.categoria
ORDER BY livros DESC
LIMIT 5
FORMAT PrettyCompactNoEscapes;

-- 4. Alertas de direção contínua por caminhão, com a velocidade média do dia (dois fatos, mesma dimensão).
SELECT a.caminhao, count() AS alertas, max(a.direcao_continua_min) AS maior_direcao_min,
       any(r.velocidade_media) AS velocidade_media_dia
FROM dw.fato_alerta_direcao AS a FINAL
LEFT JOIN dw.rel_telemetria_caminhao_dia AS r ON r.caminhao = a.caminhao AND r.data_key = a.data_key
GROUP BY a.caminhao
ORDER BY alertas DESC
LIMIT 5
SETTINGS join_use_nulls = 1          -- caminhão sem linha no relatório aparece como NULL, não como 0
FORMAT PrettyCompactNoEscapes;

-- 5. As views do banco dw: tipo de cada uma e de onde vem o dado.
SELECT name, engine,
       multiIf(engine = 'View', 'consulta guardada, roda a cada leitura',
               engine = 'MaterializedView' AND create_table_query LIKE '%REFRESH%', 'refreshable: recalcula no horário',
               engine = 'MaterializedView', 'incremental: roda a cada INSERT na origem',
               'tabela') AS como_funciona
FROM system.tables
WHERE database = 'dw' AND engine LIKE '%View%'
ORDER BY engine, name
FORMAT PrettyCompactNoEscapes;

-- 6. Uma view comum é só o SELECT dela: o plano mostra a leitura de obs_ingestao_minuto.
EXPLAIN SELECT * FROM dw.v_saude_ingestao_15min;

-- 7. Estado das refreshable: último sucesso e próximo horário.
SELECT view, status, last_success_time, next_refresh_time, exception
FROM system.view_refreshes
WHERE database = 'dw'
FORMAT PrettyCompactNoEscapes;

-- 8. Observabilidade corrente (views em janela).
SELECT * FROM dw.v_saude_ingestao_15min FORMAT PrettyCompactNoEscapes;
SELECT * FROM dw.v_lotes_ultima_hora FORMAT Vertical;
SELECT * FROM dw.v_descartes_telemetria_1h FORMAT PrettyCompactNoEscapes;

-- 9. Lotes com erro, em todo o histórico dos manifestos.
SELECT flush_inicio, lote, status, linhas, erro
FROM dw.fato_lote_ingestao
WHERE status != 'ok'
ORDER BY flush_inicio
FORMAT Vertical;
