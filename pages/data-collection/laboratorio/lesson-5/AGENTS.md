# AGENTS.md · aula_05_dimensional

Regras para o agente de código nesta pasta, qualquer que seja o agente escolhido (Claude Code, Codex CLI, Gemini CLI, Cursor, Copilot ou outro). Leia este arquivo antes de qualquer etapa.

## Escopo

- Projeto: modelo dimensional e observabilidade no ClickHouse, sobre a tabela `ingestao.db_ingestion` da Aula 04 (`timestamp` UInt64 em unix ms, `data_json` no tipo JSON, `data_tag`).
- Domínios: `livros`, `ptax` e `telemetria`, como chegaram pelo servidor de ingestão da Aula 04.
- Tudo acontece no ClickHouse, no banco `dw`. Nenhum código Python novo, nenhum outro banco, nenhuma exportação para o lake.
- Trabalhe somente dentro de `aula_05_dimensional/`. A pasta `aula_04_ingestao/` é lida, nunca alterada.
- Uma etapa por vez. Mostre o plano antes de editar e pare ao fim da etapa.

## Sequência das etapas

| Etapa | Artefato |
|---|---|
| 00 | compose com a coleção `lake`, `clickhouse/*.xml`, `docs/prompts.md` |
| 01 | `specs/04_modelo_dimensional.md` (processo, grão, dimensões, medidas, aditividade, chave do grão) |
| 02 | `sql/001_dimensoes_e_fatos.sql`, `sql/002_carga_historico.sql` |
| 03 | `docs/views.md` (VIEW, MV incremental e MV refreshable, com o EXPLAIN de uma view) |
| 04 | `sql/003_relatorios_fechados.sql` |
| 05 | `sql/004_observabilidade.sql` (contadores e views em janela) |
| 06 | fato de lote em `sql/004_observabilidade.sql`, `sql/005_consultas.sql` e `docs/observabilidade.md` |
| Decisões | `docs/adr/ADR-006` a `ADR-008`, uma por questão da discussão de decisões da Aula 04, com status Proposta |

Não pule etapa. Nenhum DDL antes de `specs/04_modelo_dimensional.md` existir e ter o grão de cada fato em uma frase.

## Registro de prompts

Ao fim de cada etapa, acrescente em `docs/prompts.md` uma seção com: número e nome da etapa, data, o prompt recebido copiado literalmente e a lista de arquivos criados ou alterados. Nunca registre segredos.

## Regras de modelagem

- Todo fato declara o grão em uma frase ("uma linha é ...") e a chave do grão. O teste do grão é: com `FINAL`, `count()` igual a `uniqExact(chave do grão)`.
- Medida não aditiva (preço, velocidade, cotação) nunca é somada; use média, mínimo, máximo ou último valor. Medida semiaditiva (estoque) soma entre livros, não entre dias.
- `dim_data` é gerada (chave AAAAMMDD), não vem da fonte. Dimensões de livro e de caminhão são SCD tipo 1.
- `tipo_boletim` da PTAX é dimensão degenerada: fica no fato.
- Fatos e `dim_livro` usam `ReplacingMergeTree(versao_ms)` com `versao_ms = timestamp` da tabela de pouso, porque a Aula 04 entrega pelo menos uma vez. Leitura de fato e de dimensão usa `FINAL`.
- Campos do JSON são lidos com `data_json.caminho::Tipo`. Conversões dentro de view materializada usam `OrZero` ou `OrNull`: um erro ali faz falhar o INSERT do lote inteiro na tabela de pouso.
- Datas e horas ficam em `America/Sao_Paulo`.

## Regras das views

- Dimensões e fatos: view materializada incremental (`CREATE MATERIALIZED VIEW ... TO dw.tabela`). Ela só vê os blocos inseridos depois de existir; o histórico entra por `INSERT ... SELECT` com o mesmo SELECT, num arquivo que pode rodar mais de uma vez sem mudar o resultado lido com `FINAL`.
- Relatórios fechados: view materializada refreshable (`REFRESH EVERY ...`), só com dias anteriores a hoje.
- Observabilidade corrente: view comum com janela `now() - INTERVAL ...` sobre contadores por minuto em `SummingMergeTree`. Os contadores começam quando a view nasce; não faça carga do histórico deles.
- `WINDOW VIEW` e `LIVE VIEW` ficam fora: a primeira é experimental, a segunda está obsoleta.
- Credenciais do RustFS só na coleção nomeada `lake`, lidas do ambiente (`from_env`). Nenhuma chave em SQL.

## Regras de conteúdo

- Não invente números. Todo número em `docs/` vem de uma consulta registrada com o comando que a gerou.
- Separe fato, lacuna e suposição.
- Mermaid sem ponto e vírgula em rótulos.

## Segredos

- Credenciais só no `.env`, que não é versionado.
- Não leia nem imprima o conteúdo do `.env`. Use os nomes das variáveis.

## Comandos permitidos

- `docker compose up -d`, `docker compose up -d --wait rustfs rabbitmq clickhouse`, `docker compose ps`, `docker compose logs <serviço>`
- `docker compose exec clickhouse clickhouse-client ...` (consultas, DDL de `sql/`, `SYSTEM REFRESH VIEW`, `SYSTEM WAIT VIEW`)
- `docker compose run --rm mc ...` (somente leitura)
- `git status`, `git diff`

Peça autorização antes de: `DROP` ou `TRUNCATE` de qualquer tabela ou view, qualquer comando sobre `ingestao.db_ingestion` que não seja SELECT, `docker compose down -v`, apontar para o Railway, fazer commit ou push.
