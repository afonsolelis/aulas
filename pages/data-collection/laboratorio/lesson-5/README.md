# Aula 05 · Laboratório: modelo dimensional, views e observabilidade no ClickHouse

A Aula 04 deixou tudo o que chegou pelo servidor de ingestão numa tabela de três colunas, `ingestao.db_ingestion` (`timestamp`, `data_json` no tipo JSON e `data_tag`), e um manifesto por lote no RustFS. Esta aula monta, no próprio ClickHouse, o modelo dimensional de livros, PTAX e telemetria sobre essa tabela, e a observabilidade do processo de ingestão. Nada sai do ClickHouse: as dimensões e os fatos são alimentados por views materializadas, os relatórios fechados por views materializadas refreshable e a observabilidade corrente por views comuns com janela de tempo.

Esta pasta é a referência do professor. O grupo reproduz as etapas no próprio repositório, na pasta `aula_05_dimensional/`, com o agente de código de sua preferência e os prompts CREATE dos slides e do material.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `docker-compose.yml` | a pilha da Aula 04 (RustFS, RabbitMQ, ClickHouse) com a coleção nomeada `lake` montada no ClickHouse; o projeto se chama `aula04_ingestao`, então os volumes e os dados da Aula 04 são os mesmos |
| `.env.example` | o mesmo da Aula 04; se o grupo já tem o `.env` da Aula 04, copie-o para cá |
| `clickhouse/lake.xml` | coleção nomeada `lake`: URL dos manifestos no RustFS, chaves lidas das variáveis `S3_ACCESS_KEY` e `S3_SECRET_KEY` do contêiner |
| `clickhouse/lake_acesso.xml` | dá ao usuário `ingestao` permissão para usar coleções nomeadas |
| `sql/000_db_ingestion.sql` | a tabela de pouso da Aula 04, para quem sobe a pilha do zero |
| `sql/001_dimensoes_e_fatos.sql` | banco `dw`: `dim_data`, `dim_livro`, `dim_caminhao`, quatro fatos e as views materializadas incrementais que os alimentam |
| `sql/002_carga_historico.sql` | carga do que já estava em `db_ingestion` antes das views existirem |
| `sql/003_relatorios_fechados.sql` | dois relatórios fechados com views materializadas refreshable |
| `sql/004_observabilidade.sql` | contadores por minuto, fato de lote a partir dos manifestos e três views em janela |
| `sql/005_consultas.sql` | teste do grão, consultas na estrela, tipo de cada view e a observabilidade |

## Horário (07/11/2026)

| Horário | Parte |
|---|---|
| 8h30 às 8h40 | retomada da Aula 04: a tabela de pouso, o manifesto e o que ficou para a semana |
| 8h40 às 9h20 | Discussão de três decisões da Aula 04 |
| 9h20 às 9h40 | café |
| 9h40 às 10h00 | Etapa 01: o grão de cada fato |
| 10h00 às 10h30 | Etapa 02: dimensões, fatos e views materializadas incrementais |
| 10h30 às 10h50 | Etapa 03: o que é uma view e como ela funciona no ClickHouse |
| 10h50 às 11h15 | Etapa 04: relatórios fechados com view materializada refreshable |
| 11h15 às 11h35 | Etapa 05: observabilidade corrente com views em janela |
| 11h35 às 12h00 | Etapa 06: observabilidade do processo, do manifesto ao descarte |
| 12h00 às 12h10 | fechamento |

## Etapa 00 · Subir a pilha com a coleção `lake`

```bash
cp ../../aula_04_dados_semiestruturados_parquet_duckdb_e_lakehouse/laboratorio/.env .env   # ou: cp .env.example .env
docker compose up -d
docker compose up -d --wait rustfs rabbitmq clickhouse
set -a; . ./.env; set +a
CH="docker compose exec -T clickhouse clickhouse-client --user $CLICKHOUSE_USER --password $CLICKHOUSE_PASSWORD --multiquery"
$CH -q "SELECT data_tag, count() FROM ingestao.db_ingestion GROUP BY data_tag"
$CH -q "SELECT count() FROM s3(lake)"     # manifestos que o ClickHouse enxerga no RustFS
```

Como o compose usa o nome de projeto da Aula 04, ele recria os contêineres da Aula 04 com as duas mudanças e mantém os volumes. Se `db_ingestion` estiver vazia, suba o servidor de ingestão da Aula 04 e rode `python enviar_entrada.py` lá: as views das etapas seguintes recebem as linhas enquanto elas chegam.

A coleção nomeada guarda URL e chaves do RustFS fora do SQL. A consulta escreve `s3(lake)`, e as chaves vêm das variáveis do contêiner (`from_env`), nunca de um arquivo versionado.

## Etapa 01 · O grão de cada fato

Antes de qualquer DDL, o grupo escreve `specs/04_modelo_dimensional.md` com, para cada processo de negócio, o grão em uma frase, as dimensões, as medidas e se cada medida soma (aditiva, semiaditiva ou não aditiva).

| Fato | Processo | Grão: uma linha é... | Chave do grão | Medidas |
|---|---|---|---|---|
| `fato_preco_livro` | coleta de preço | um livro num dia de coleta | `data_key`, `upc` | `preco_gbp` (não aditiva), `qtd_estoque` (semiaditiva: soma entre livros, não entre dias) |
| `fato_cotacao_ptax` | boletim do BCB | um boletim PTAX | `moeda`, `data_hora`, `tipo_boletim` | `cotacao_compra`, `cotacao_venda` (não aditivas) |
| `fato_leitura_telemetria` | posição do caminhão | uma leitura de um caminhão num instante | `caminhao`, `instante` | `velocidade_kmh` (não aditiva), contagem de leituras |
| `fato_alerta_direcao` | alerta do tacógrafo | um alerta de direção contínua de um caminhão num instante | `caminhao`, `instante` | `direcao_continua_min` (não aditiva) |
| `fato_lote_ingestao` | flush do servidor | um lote gravado pelo servidor (um manifesto) | `lote` | linhas, mensagens, tempos em ms |

O teste do grão é uma consulta: com `FINAL`, o número de linhas do fato é igual ao número de combinações distintas da chave do grão (`sql/005_consultas.sql`, consulta 1). Se for maior, a tabela tem duas linhas para o mesmo fato e o grão declarado está errado.

## Etapa 02 · Dimensões, fatos e views materializadas incrementais

```bash
$CH < sql/001_dimensoes_e_fatos.sql
$CH < sql/002_carga_historico.sql
```

Cada fato tem uma view materializada `dw.mv_*` que lê `ingestao.db_ingestion` e grava na tabela do fato (`TO dw.fato_...`). A view é um gatilho de INSERT: a cada bloco inserido na tabela de pouso, o ClickHouse roda o SELECT da view sobre esse bloco e insere o resultado no destino. Ela não vê o que já estava na tabela; por isso o `002` carrega o histórico com o mesmo SELECT.

- `dim_livro` e os fatos usam `ReplacingMergeTree(versao_ms)`: a reentrega da Aula 04 (pelo menos uma vez) e uma segunda carga do histórico geram cópias, que o `FINAL` junta na leitura.
- `dim_caminhao` sai do fato de leitura por uma view em cascata (`mv_dim_caminhao`), com `SimpleAggregateFunction(min/max)` para a primeira e a última leitura.
- A telemetria chega em dois formatos (`CAM-0451|29/10/26 06:00:55|...` e `CAM-0451 29-10-2026 06:05:55 GPS ...`), mais alertas `TAC;` e ruído (`ERR SAT`, `#RADIO`). A view usa `OrZero` e `OrNull` nas conversões, porque um erro de conversão dentro da view faz falhar o INSERT do lote inteiro na tabela de pouso.

Gate: `sql/005_consultas.sql`, consultas 1 e 2.

## Etapa 03 · O que é uma view e como ela funciona

Três objetos com o mesmo nome de família e comportamentos diferentes:

| Objeto | Guarda dado? | Quando o SELECT roda | Sobre o quê | Uso nesta aula |
|---|---|---|---|---|
| `VIEW` | não, guarda a consulta | a cada leitura da view | as tabelas inteiras, no estado do momento | observabilidade corrente |
| `MATERIALIZED VIEW ... TO` | sim, na tabela de destino | a cada INSERT na tabela de origem | só o bloco recém-inserido | dimensões e fatos |
| `MATERIALIZED VIEW ... REFRESH` | sim, na tabela de destino | no horário do `REFRESH` | as tabelas inteiras; troca o conteúdo de uma vez | relatórios fechados |

`EXPLAIN SELECT * FROM dw.v_saude_ingestao_15min` mostra que a view comum é só o SELECT dela, lendo `obs_ingestao_minuto`. A consulta 5 do `005` lista as 14 views do banco `dw` com o tipo de cada uma. O ClickHouse também tem `WINDOW VIEW`, que agrega por janelas de tempo no próprio motor, mas ela é experimental (`allow_experimental_window_view`) e fica fora do laboratório.

## Etapa 04 · Relatórios fechados com view materializada refreshable

```bash
$CH < sql/003_relatorios_fechados.sql
$CH -q "SYSTEM REFRESH VIEW dw.rmv_preco_categoria_dia; SYSTEM WAIT VIEW dw.rmv_preco_categoria_dia;
        SYSTEM REFRESH VIEW dw.rmv_telemetria_caminhao_dia; SYSTEM WAIT VIEW dw.rmv_telemetria_caminhao_dia"
$CH -q "SELECT * FROM dw.rel_preco_categoria_dia ORDER BY livros DESC LIMIT 5"
```

- `rel_preco_categoria_dia`: preço médio por categoria e dia em GBP e em BRL, com o último Fechamento PTAX até o dia (`ASOF LEFT JOIN`).
- `rel_telemetria_caminhao_dia`: leituras, velocidade média e máxima, primeira e última leitura e a parte das leituras no formato com espaço, por caminhão e dia.

As duas rodam todo dia à 01h00 do servidor (`REFRESH EVERY 1 DAY OFFSET 1 HOUR`) e só incluem dias anteriores a hoje: um dia publicado não muda depois. O `SYSTEM REFRESH VIEW` antecipa o horário, e é o que se usa depois de uma carga atrasada. `system.view_refreshes` mostra o último sucesso, o próximo horário e a exceção, se houver.

## Etapa 05 · Observabilidade corrente com views em janela

```bash
$CH < sql/004_observabilidade.sql
$CH -q "SELECT * FROM dw.v_saude_ingestao_15min"
```

Duas views materializadas incrementais contam por minuto o que entra (`obs_ingestao_minuto`, por `data_tag`) e o que a telemetria descartou (`obs_telemetria_descartes_minuto`, por motivo), em `SummingMergeTree`. As três views em janela leem esses contadores e o fato de lote com `now() - INTERVAL`:

- `v_saude_ingestao_15min`: linhas por `data_tag` nos últimos 15 minutos e há quantos segundos chegou o último dado;
- `v_lotes_ultima_hora`: lotes, lotes com erro, linhas, p50 e p95 do flush e a maior espera;
- `v_descartes_telemetria_1h`: descartes por motivo e a parte do total.

Os contadores começam a contar quando a view nasce. Uma carga do histórico com `SummingMergeTree` somaria duas vezes se fosse repetida, e a observabilidade mede o processo de agora em diante.

## Etapa 06 · Observabilidade do processo

`dw.fato_lote_ingestao` tem um lote por linha, lido dos manifestos no RustFS por `s3(lake)` e recalculado a cada minuto por uma refreshable (`rmv_fato_lote_ingestao`). Com ele, o grupo responde quantos lotes falharam, quando e por quê, e quanto tempo cada destino levou (raw, bronze, ClickHouse).

```bash
$CH < sql/005_consultas.sql
```

## Números da preparação (31/10/2026)

Carga completa do `dados_aula_04.zip` pelo servidor da Aula 04 (1.000 livros por HTTP, 40 boletins PTAX e 31.265 linhas de telemetria pela fila, 1.465 s de envio), ClickHouse 26.8.15.10.

| Medida | Valor |
|---|---|
| `db_ingestion` | livros 1.000, ptax 40, telemetria 31.265 (32.305 linhas) |
| Teste do grão (com `FINAL` = chaves do grão) | `fato_preco_livro` 1.000, `fato_cotacao_ptax` 40, `fato_leitura_telemetria` 28.800, `fato_alerta_direcao` 69 |
| Sem `FINAL`, depois de rodar a carga do histórico duas vezes | `fato_preco_livro` 2.000, `fato_cotacao_ptax` 80 |
| Destino das 31.265 linhas de telemetria | leitura no formato barra 22.432, leitura no formato espaço 6.368, descarte `#RADIO` 1.464, descarte `ERR SAT` 932, alerta de direção 69 |
| Dimensões | `dim_livro` 1.000, `dim_caminhao` 20, `dim_data` 731 |
| `rel_preco_categoria_dia` (50 linhas) | 30/10/2026, Default: 152 livros, 34,39 GBP, PTAX de venda 7,1899 (de 29/10), 247,28 BRL |
| `rel_telemetria_caminhao_dia` (20 linhas) | 29/10/2026, CAM-0451: 1.440 leituras, velocidade média 72,2 e máxima 96 km/h, 22,6% no formato espaço |
| Alertas de direção contínua | CAM-5707 com 12 alertas; maior direção contínua 360 min (CAM-3126) |
| `fato_lote_ingestao` | 670 lotes entre 11h50 e 12h14 de 31/10: 668 `ok` com 32.305 linhas, 2 `erro_clickhouse` com 48 linhas cada |
| Flush dos lotes `ok` | p50 139 ms, p95 170 ms; médias raw 15 ms, bronze 24 ms, ClickHouse 103 ms; maior espera de mensagem 2.788 ms |
| Lotes com erro | 12h03 e 12h04, ClickHouse reiniciado durante a carga, `OperationalError(... Connection aborted ...)`; sem ack, as 96 linhas voltaram pela fila e entraram em lotes `ok` (668 lotes `ok` somam as 32.305 linhas da tabela) |
| Views no banco `dw` | 14: 8 incrementais, 3 refreshable, 3 comuns |
| Caso do relatório atualizado cedo | o refresh rodou antes do fim da carga e o CAM-4120 (1.440 leituras) ficou fora do relatório; o LEFT JOIN mostrou velocidade 0 até `join_use_nulls = 1` (NULL) e um `SYSTEM REFRESH VIEW` depois da carga |

## Encerrar

`docker compose down` para os contêineres e mantém os dados. `docker compose down -v` apaga os volumes, inclusive a tabela de pouso da Aula 04, e o agente pede autorização antes de rodá-lo.
