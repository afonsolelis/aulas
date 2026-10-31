-- Aula 05 · Carga do histórico. A view materializada só vê o que for inserido depois dela;
-- as linhas que já estavam em db_ingestion entram por INSERT ... SELECT com o mesmo SELECT da view.
-- Pode rodar mais de uma vez: os destinos são ReplacingMergeTree (fatos e dim_livro) e
-- AggregatingMergeTree com min/max (dim_caminhao), e a repetição não muda o resultado lido com FINAL.

-- mesmo SELECT de dw.mv_dim_livro
INSERT INTO dw.dim_livro
SELECT data_json.upc::String                                    AS upc,
       data_json.titulo::String                                 AS titulo,
       data_json.categoria::String                              AS categoria,
       data_json.url::String                                    AS url,
       toUInt8OrZero(data_json.avaliacao::String)               AS avaliacao,
       timestamp                                                AS versao_ms
FROM ingestao.db_ingestion
WHERE data_tag = 'livros' AND data_json.upc::String != '';

-- mesmo SELECT de dw.mv_fato_preco_livro
INSERT INTO dw.fato_preco_livro
SELECT toYYYYMMDD(coletado_em)                                  AS data_key,
       data_json.upc::String                                    AS upc,
       toDecimal64OrZero(data_json.preco_gbp::String, 2)        AS preco_gbp,
       toUInt32OrZero(data_json.qtd_estoque::String)            AS qtd_estoque,
       data_json.em_estoque::String = 'true'                    AS em_estoque,
       parseDateTimeBestEffort(data_json.coletado_em::String, 'America/Sao_Paulo') AS coletado_em,
       timestamp                                                AS versao_ms
FROM ingestao.db_ingestion
WHERE data_tag = 'livros' AND data_json.upc::String != '';

-- mesmo SELECT de dw.mv_fato_cotacao_ptax
INSERT INTO dw.fato_cotacao_ptax
SELECT toYYYYMMDD(data_hora)                                    AS data_key,
       data_json.moeda::String                                  AS moeda,
       parseDateTime64BestEffort(data_json.dataHoraCotacao::String, 3, 'America/Sao_Paulo') AS data_hora,
       data_json.tipoBoletim::String                            AS tipo_boletim,
       toDecimal64OrZero(data_json.cotacaoCompra::String, 5)    AS cotacao_compra,
       toDecimal64OrZero(data_json.cotacaoVenda::String, 5)     AS cotacao_venda,
       timestamp                                                AS versao_ms
FROM ingestao.db_ingestion
WHERE data_tag = 'ptax';

-- mesmo SELECT de dw.mv_fato_leitura_telemetria
INSERT INTO dw.fato_leitura_telemetria
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

-- mesmo SELECT de dw.mv_fato_alerta_direcao
INSERT INTO dw.fato_alerta_direcao
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

-- dim_caminhao sai do fato já carregado
INSERT INTO dw.dim_caminhao
SELECT caminhao, min(instante), max(instante) FROM dw.fato_leitura_telemetria GROUP BY caminhao;
