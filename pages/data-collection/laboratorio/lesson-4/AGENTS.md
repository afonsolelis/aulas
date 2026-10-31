# AGENTS.md · aula_04_ingestao

Regras para o agente de código nesta pasta, qualquer que seja o agente escolhido (Claude Code, Codex CLI, Gemini CLI, Cursor, Copilot ou outro). Leia este arquivo antes de qualquer etapa.

## Escopo

- Projeto: servidor de ingestão. Um processo Python que fica no ar com uma API HTTP (`POST /ingest`) e um consumidor da fila `ingestao` do RabbitMQ. Cada envelope válido vai, em micro-lote, para o lake no RustFS (raw em JSON Lines e bronze em Parquet escrito pelo DuckDB), para a tabela `ingestao.db_ingestion` do ClickHouse e para um manifesto do lote, nessa ordem, e só então recebe ack.
- Domínios desta aula: `telemetria` (linhas dos TXT da Aula 02), `livros` e `ptax` (bronze da Aula 03), lidos da pasta `entrada/` (do `dados_aula_04.zip`).
- Trabalhe somente dentro de `aula_04_ingestao/`.
- Uma etapa por vez. Mostre o plano antes de editar e pare ao fim da etapa.

## Sequência das etapas

| Etapa | Artefato |
|---|---|
| 00 | preparação; `docs/prompts.md` |
| 01 | `docs/00_persona.md`, `docs/01_objetivos.md` |
| 02 | `specs/01_contrato_envelope.md`, `specs/exemplos/*.json` |
| 03 | `specs/02_requisitos.md` |
| 04 | `specs/03_modelo_de_dados.md` (tabela e layout raw, bronze, manifesto), `sql/001_db_ingestion.sql` |
| 05 | `docs/arquitetura.md`, `docs/adr/ADR-001` a `ADR-005` |
| 06 | `specs/plan.md`, `specs/tasks.md`, testes vermelhos em `tests/` |
| 07 | `src/contrato.py`, `src/api.py` |
| 08 | `src/consumidor.py`, `src/lake.py`, `src/clickhouse.py` |
| 09 | `src/produtores/*.py` lendo `entrada/` e execução com o gate de contagens |
| 10 | `sql/duckdb_cast.sql`, `sql/clickhouse_cast.sql`, `sql/silver_livros_ptax.sql` |
| semana | `docs/atam.md` e execução no Railway |

Não pule etapa: cada uma lê os artefatos das anteriores. Nenhum código em `src/` antes da Etapa 07.

## Registro de prompts

Ao fim de cada etapa, acrescente em `docs/prompts.md` uma seção com: número e nome da etapa, data, o prompt recebido copiado literalmente (sem corrigir digitação) e a lista de arquivos criados ou alterados. Nunca registre segredos; se o prompt contiver um, pare e avise.

## Fontes de verdade

- Precedência, da mais forte para a mais fraca: contrato do envelope (`specs/01_contrato_envelope.md`) > requisitos (`specs/02_requisitos.md`) > modelo de dados (`specs/03_modelo_de_dados.md`) > ADR (`docs/adr/`) > `specs/plan.md` > `specs/tasks.md`.
- `docker-compose.yml`, `.env.example`, `requirements.txt` e `sql/001_db_ingestion.sql` desta pasta.
- `entrada/` é dado de entrada: leia, nunca altere nem versione.
- Os campos do bronze da Aula 03 e o contrato da silver (o mesmo da Aula 03) não mudam: não renomeie nem traduza.
- Se dois documentos se contradisserem, pare e pergunte.

## Regras de conteúdo

- Não invente números, SLAs, volumes ou limites. Valor sem origem recebe a marcação "hipótese, validação pendente".
- Separe fato, lacuna e suposição.
- Preserve os IDs existentes: P1, OBJ-01, RF-01, RNF-01, T-01, ADR-001.
- Toda escolha técnica aponta para um RF ou RNF.
- O contrato desta aula valida só o envelope (`data_tag` e `data`). O conteúdo de `data` não é validado aqui; o schema por domínio fica para a Aula 07.
- Assuntos da Aula 06 (DLX, prefetch ajustado, exchanges, ReplacingMergeTree, TTL) aparecem só como "a Aula 06 aprofunda".
- Mermaid sem ponto e vírgula em rótulos e mensagens (quebra a renderização). Valide cada bloco antes de terminar.
- Toda ADR nasce com status "Proposta". Aceitar é decisão do grupo.
- Toda ADR tem as seções Custos (infraestrutura e mão de obra) e Previsão de esforço em HH, com a decisão e a alternativa lado a lado. O valor-hora é parâmetro declarado pelo grupo. Estimativa sem base (medição, código existente ou tarefa parecida) vira pergunta, não número.

## Regras do servidor

- A API não grava no lake nem no ClickHouse: valida, publica na fila com confirmação do broker e responde 202. Corpo que não é JSON recebe 400; envelope inválido, 422; corpo acima de `HTTP_MAX_BYTES`, 413.
- O consumidor valida o envelope de novo. Inválido vai para `raw/ingestao_rejeitados/data=AAAA-MM-DD/` com o motivo e recebe ack.
- Layout do lake (organização da Aula 03), com `D` = data do recebimento em America/Sao_Paulo e o mesmo nome de lote nas três chaves:
  - raw: `raw/ingestao/data_tag=X/data=D/lote_<HHMMSS>_<id>.jsonl`, um envelope por linha, como chegou, com `recebido_em_ms`;
  - bronze: `bronze/ingestao/data_tag=X/data=D/lote_<HHMMSS>_<id>.parquet`, uma linha por objeto de `data`, colunas `timestamp` e `data_json`;
  - manifesto: `raw/_manifestos/ingestao/data=D/lote_<HHMMSS>_<id>.json`, com lote, mensagens e linhas por `data_tag`, chaves gravadas, bytes e SHA-256 de cada arquivo, tempos e status.
- Ordem do flush: raw, bronze, ClickHouse, manifesto, ack. Nunca dê ack antes de gravar tudo. Se o ClickHouse falhar, grave o manifesto com status de erro e não dê ack.
- `timestamp` é a hora da ingestão em unix milissegundos, dada pelo servidor. O produtor não manda timestamp.
- Em `ingestao.db_ingestion`, `data_json` é do tipo `JSON` do ClickHouse, nunca `String`. Todo INSERT nela usa `input_format_try_infer_dates = 0` e `input_format_try_infer_datetimes = 0`, para datas e horas ficarem como texto. Consultas leem `data_json.caminho::Tipo`, não `JSONExtract*`.
- Flush por `FLUSH_N` envelopes ou `FLUSH_SEGUNDOS`, o que vier primeiro. O `prefetch_count` do consumidor é pelo menos `FLUSH_N`.
- Mensagens persistentes, fila durável, conexão pika usada por uma thread só.

## Segredos

- Credenciais só no `.env` (ou `.env.railway`), que não são versionados.
- Nunca escreva segredos em código, testes, logs, prompts, `docs/prompts.md` ou commits.
- Não leia nem imprima o conteúdo do `.env`. Use os nomes das variáveis.

## Comandos permitidos

- `python`, `pytest`, `pip install -r requirements.txt`, `uvicorn`
- `docker compose up -d`, `docker compose up -d --wait rustfs rabbitmq clickhouse`, `docker compose ps`, `docker compose logs <serviço>`
- `docker compose run --rm mc ...` (somente leitura: `ls`, `tree`, `cat`, `stat`, `du`), `docker compose exec clickhouse clickhouse-client ...` (consultas e o DDL de `sql/`)
- `python enviar_entrada.py` (envia `entrada/` pelo contrato público)
- `curl` contra `http://localhost:8000`
- `git status`, `git diff`

Peça autorização antes de: apagar objetos, buckets ou tabelas, purgar a fila, rodar `docker compose down -v`, apontar para o Railway, instalar pacotes fora do `requirements.txt`, fazer commit ou push.

## Gates

- Testes são escritos antes do código (Etapa 06) e falham por falta de implementação, não por erro no teste.
- Não altere um teste para fazê-lo passar. Se o teste estiver errado, pare e explique.
- Testes do contrato não acessam a rede; usam `specs/exemplos/` e `fixtures/`.
- Testes de integração usam os serviços locais e o bucket `teste`, nunca `raw` com dados das aulas.
- Gate da Etapa 09: por `data_tag`, linhas esperadas = linhas no ClickHouse = linhas no bronze, e envelopes no raw = mensagens enviadas; um manifesto `ok` por lote.
- Uma tarefa só é marcada como concluída em `specs/tasks.md` com o teste passando e o comando de verificação anotado.
