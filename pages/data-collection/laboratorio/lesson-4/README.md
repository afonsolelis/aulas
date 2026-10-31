# Aula 04 · Laboratório: servidor de ingestão com fila, DuckDB e ClickHouse

Data Collection and Storage · Inteli · 31/10/2026, 8h30 às 12h10

Roteiro da construção em etapas. A explicação de cada etapa e os prompts CREATE completos estão no material da aula: `../../materials/lesson-4-material.html`. O formato é o da Aula 03: o prompt vai para o agente e, enquanto ele trabalha, a aula explica e justifica o que o prompt pediu. Depois o grupo revisa o artefato e segue.

O código do grupo nasce ao vivo, pelos prompts, no repositório do grupo, na pasta `aula_04_ingestao/`. Esta pasta traz os arquivos de apoio, os dados de entrada e, em `referencia/`, o servidor de referência que o professor usa na demonstração.

## Arquivos de apoio

| Arquivo | Uso |
|---|---|
| `docker-compose.yml` | RustFS (`rustfs/rustfs:1.0.4`, API S3 na porta 9000, console na 9001), `rustfs-init` (buckets `raw`, `bronze`, `silver`, `gold`, `teste`), cliente `mc` para olhar o lake, RabbitMQ (`rabbitmq:4.3.6-management`, portas 5672 e 15672) e ClickHouse (`clickhouse/clickhouse-server:26.8.15.10`, porta 8123) |
| `.env.example` | variáveis dos três serviços e do servidor de ingestão; copie para `.env` |
| `requirements.txt` | dependências Python validadas em 30/10/2026 |
| `AGENTS.md` | regras para o agente de código, incluindo o registro de prompts |
| `dados/dados_aula_04.zip` | dados completos da aula (991.897 bytes): 1.000 livros, 40 boletins PTAX e um dia de telemetria, organizados em `entrada/` |
| `enviar_entrada.py` | lê `entrada/` e envia tudo pelo contrato público (HTTP e fila); serve para qualquer servidor que siga o contrato |
| `referencia/` | servidor de referência (gabarito do professor para a demonstração) com `src/` e `tests/` |
| `sql/001_db_ingestion.sql` | DDL da tabela de pouso, executado pelo ClickHouse na primeira subida |
| `sql/duckdb_cast.sql` | contagens de raw, bronze e manifestos e JSON cast no DuckDB lendo o bronze |
| `sql/clickhouse_cast.sql` | JSON cast no ClickHouse, lendo os caminhos do tipo `JSON` (`data_json.caminho::Tipo`) |
| `sql/silver_livros_ptax.sql` | silver de livros e PTAX, gerado a partir do bronze |
| `sql/rodar_sql.py` | executa um `.sql` no DuckDB com o secret S3 montado a partir do `.env` |
| `fixtures/` | dados pequenos para os testes e exemplos de envelope |

## Arquitetura

```text
curl / produtor --HTTP POST /ingest--> API (FastAPI) --valida envelope--> publica na fila --+
                                        400, 413, 422 se inválido; 202 depois do ack do broker  |
produtor --AMQP publish------------------------------------------------> fila ingestao (durável)
                                                                                                |
                         consumidor (thread no mesmo processo) <--------------------------------+
                           valida de novo; inválido vai para raw/ingestao_rejeitados/ e recebe ack
                           válido: acumula em memória; flush a cada FLUSH_N envelopes ou FLUSH_SEGUNDOS
                             1. raw: os envelopes como chegaram  -> raw/ingestao/data_tag=X/data=D/lote_<HHMMSS>_<id>.jsonl
                             2. bronze: uma linha por objeto     -> bronze/ingestao/data_tag=X/data=D/lote_<HHMMSS>_<id>.parquet
                             3. clickhouse-connect insere o lote -> ingestao.db_ingestion
                             4. manifesto do lote                -> raw/_manifestos/ingestao/data=D/lote_<HHMMSS>_<id>.json
                             5. ack (multiple) das mensagens do lote
```

Por que essa ordem:

- raw antes de tudo: é o que chegou, sem interpretação. Se a extração tiver erro, o raw permite refazer o bronze.
- bronze antes do ClickHouse: o bronze é o histórico tipável e o backup; com ele dá para recriar a tabela do ClickHouse.
- manifesto depois do ClickHouse: ele é o recibo do lote e registra o resultado de todos os destinos. Manifesto com `"status": "ok"` quer dizer lote completo. Arquivos de lote sem manifesto `ok` vêm de um flush interrompido; como não houve ack, a fila reentrega as mensagens e elas entram de novo num lote novo. Se o ClickHouse falhar, o servidor grava o manifesto com `"status": "erro_clickhouse"` e o erro, e não dá ack.
- ack por último: a mensagem só sai da fila quando está no raw, no bronze, no ClickHouse e no manifesto. Se o processo cair entre o manifesto e o ack, o lote volta e é gravado de novo: entrega pelo menos uma vez.

Envelope (contrato desta aula, só a casca):

```json
{"data_tag": "livros", "data": {"upc": "a897fe39b1053632", "titulo": "A Light in the Attic", "preco_gbp": 51.77}}
{"data_tag": "ptax", "data": [{"moeda": "GBP", "dataHoraCotacao": "2026-10-29 10:10:54.921", "tipoBoletim": "Abertura"}]}
{"data_tag": "telemetria", "data": {"arquivo": "entrada/telemetria/CAM-0451_20261029T0600.txt", "numero_linha": 1, "linha": "CAM-0451|29/10/26 06:00:31|..."}}
```

- `data_tag` obrigatório, texto, em `DOMINIOS` do `.env`. Desconhecido: 422.
- `data` obrigatório: objeto, ou lista não vazia de objetos (cada objeto vira uma linha). Outro tipo: 422.
- Campo extra no envelope: 422. O envelope é fechado; o conteúdo de `data` é aberto e não é validado nesta aula (Aula 07).
- Corpo que não é JSON: 400. Corpo acima de `HTTP_MAX_BYTES` (1 MiB): 413.
- O servidor acrescenta o `timestamp` (unix em milissegundos); o produtor não manda.

Tabela de pouso (`sql/001_db_ingestion.sql`):

```sql
CREATE TABLE IF NOT EXISTS ingestao.db_ingestion
(
    timestamp UInt64,                  -- unix em milissegundos, hora da ingestão
    data_json JSON,                    -- o dado recebido, no tipo JSON
    data_tag  LowCardinality(String)   -- o domínio
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(fromUnixTimestamp64Milli(toInt64(timestamp)))
ORDER BY (data_tag, timestamp);
```

O tipo `JSON` do ClickHouse faz o papel do `jsonb` do PostgreSQL: o documento é interpretado no INSERT e cada caminho vira uma subcoluna com tipo inferido. O consumidor insere com `input_format_try_infer_dates = 0` e `input_format_try_infer_datetimes = 0` (em `referencia/src/clickhouse.py`), para que datas e horas fiquem como texto e o `-03:00` não se perca. Quem inserir por outro caminho, como um `INSERT` manual ou o reprocesso a partir do bronze, passa as mesmas duas configurações. O texto exato que chegou fica no raw.

## Horário

A teoria entra dentro das etapas.

| Horário | Parte |
|---|---|
| 8h30 às 8h45 | abertura: ingestão por puxar (Aulas 02 e 03) e por empurrar; a arquitetura inteira |
| 8h45 às 9h00 | Etapa 00: pasta, compose (RustFS, RabbitMQ, ClickHouse), buckets, venv, dados em `entrada/`, `docs/prompts.md` |
| 9h00 às 9h10 | Etapa 01: persona e objetivos |
| 9h10 às 9h30 | Etapa 02: contrato do envelope |
| 9h30 às 9h45 | Etapa 03: requisitos |
| 9h45 às 10h10 | Etapa 04: modelo de dados, DDL e layout do lake |
| 10h10 às 10h30 | Etapa 05: arquitetura e ADRs |
| 10h30 às 10h40 | Etapa 06: plano, tarefas e testes vermelhos |
| 10h40 às 10h50 | Etapa 07: contrato e API |
| 10h50 às 11h05 | Etapa 08: consumidor e gravadores (raw, bronze, ClickHouse, manifesto) |
| 11h05 às 11h15 | Etapa 09: produtores lendo `entrada/`, execução e teste de queda |
| 11h15 às 11h30 | Etapa 10: JSON cast e silver de livros e PTAX |
| 11h30 às 12h00 | conferência do resultado no ClickHouse e no RustFS e dúvidas da construção |
| 12h00 às 12h10 | fechamento |
| semana | ATAM e Railway |

## Etapas e artefatos

| Etapa | Tema | Artefato |
|---|---|---|
| 00 | Preparação | pasta, três serviços no ar, buckets, venv, `entrada/`, `docs/prompts.md` |
| 01 | Persona e objetivos | `docs/00_persona.md`, `docs/01_objetivos.md` |
| 02 | Contrato do envelope | `specs/01_contrato_envelope.md`, `specs/exemplos/*.json` |
| 03 | Requisitos | `specs/02_requisitos.md` (RF com Dado/Quando/Então, RNF com número) |
| 04 | Modelo de dados | `specs/03_modelo_de_dados.md` (tabela e layout raw, bronze, manifesto), `sql/001_db_ingestion.sql` |
| 05 | Arquitetura e ADRs | `docs/arquitetura.md`, `docs/adr/ADR-001` a `ADR-005` |
| 06 | Plano, tarefas e testes vermelhos | `specs/plan.md`, `specs/tasks.md`, `tests/` |
| 07 | Código: contrato e API | `src/contrato.py`, `src/api.py` |
| 08 | Código: consumidor e gravadores | `src/consumidor.py`, `src/lake.py`, `src/clickhouse.py` |
| 09 | Produtores e execução | `src/produtores/*.py` lendo `entrada/`, gate de contagens, teste de queda |
| 10 | JSON cast e silver | `sql/duckdb_cast.sql`, `sql/clickhouse_cast.sql`, `sql/silver_livros_ptax.sql` |
| semana | ATAM e Railway | `docs/atam.md`, servidor e serviços no Railway |

Árvore final:

```text
aula_04_ingestao/
├── AGENTS.md
├── docker-compose.yml  .env.example  requirements.txt
├── entrada/                         (do zip; não versionar)
│   ├── livros/livros.jsonl
│   ├── ptax/cotacoes.jsonl
│   └── telemetria/*.txt
├── docs/
│   ├── prompts.md
│   ├── 00_persona.md
│   ├── 01_objetivos.md
│   ├── arquitetura.md
│   ├── adr/ADR-001 ... ADR-005
│   └── atam.md                      (semana)
├── specs/
│   ├── 01_contrato_envelope.md
│   ├── exemplos/*.json
│   ├── 02_requisitos.md
│   ├── 03_modelo_de_dados.md
│   ├── plan.md, tasks.md
├── sql/
│   ├── 001_db_ingestion.sql
│   ├── duckdb_cast.sql, clickhouse_cast.sql, silver_livros_ptax.sql
│   └── rodar_sql.py
├── fixtures/
├── src/
│   ├── contrato.py, api.py, consumidor.py, lake.py, clickhouse.py, servidor.py
│   └── produtores/
└── tests/
```

## 1. Etapa 00 · Preparar a pasta e subir os serviços

No Codespace do repositório do grupo, na raiz:

```bash
mkdir -p aula_04_ingestao/{docs/adr,specs/exemplos,sql,src/produtores,tests}
# copie para aula_04_ingestao/ os arquivos de apoio desta pasta (incluindo sql/, fixtures/ e enviar_entrada.py)
cd aula_04_ingestao
printf '.env\n.env.*\n!.env.example\n.venv/\n__pycache__/\n.pytest_cache/\nentrada/\n' >> .gitignore
cp .env.example .env
git check-ignore .env            # deve imprimir: .env
printf '# Registro de prompts\n' > docs/prompts.md
```

O `.env.example` já vem com valores que funcionam no ambiente local: `admin` e `admin123` no RustFS (`S3_ACCESS_KEY` e `S3_SECRET_KEY`, o mesmo par do login no console), `ingestao` e `ingestao123` no RabbitMQ e no ClickHouse. Servem só para o Codespace ou o notebook. No Railway, ou em qualquer lugar acessível por outras pessoas, troque todas as senhas (`openssl rand -base64 24`).

```bash
docker compose config --quiet && echo "compose ok"
docker compose up -d
docker compose up -d --wait rustfs rabbitmq clickhouse   # volta quando os três estão healthy
docker compose ps
docker compose logs rustfs-init                          # deve listar raw, bronze, silver, gold e teste
```

O `docker compose up -d --wait` sem nomes de serviço devolve código 1 mesmo com tudo no ar, porque o `rustfs-init` termina depois de criar os buckets (Compose 5.6.1). Por isso o `--wait` vai com os três serviços nomeados.

O `rustfs-init` e o serviço `mc` usam o cliente `mc` da imagem do MinIO (`ghcr.io/coollabsio/minio:RELEASE.2025-10-15T17-29-55Z`), que fala S3 com qualquer servidor compatível. O `mc` não sobe com o `up`; ele roda sob demanda:

```bash
docker compose run --rm mc ls lake                        # os cinco buckets
docker compose run --rm mc tree --files lake/raw          # árvore de um bucket
```

Dados de entrada (o mesmo zip do rodapé dos slides):

```bash
unzip -o dados_aula_04.zip            # cria entrada/livros, entrada/ptax e entrada/telemetria
ls entrada/telemetria | wc -l         # 1920
wc -l entrada/livros/livros.jsonl entrada/ptax/cotacoes.jsonl   # 1000 e 40
```

Ambiente Python:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Conferir o ClickHouse e a tabela criada pelo DDL montado em `docker-entrypoint-initdb.d`:

```bash
set -a; source .env; set +a
docker compose exec clickhouse clickhouse-client --user "$CLICKHOUSE_USER" --password "$CLICKHOUSE_PASSWORD" \
  -q "SELECT version(); SHOW CREATE TABLE ingestao.db_ingestion"
```

O DDL só roda na primeira subida, com o volume vazio. Se a tabela mudar depois, rode o arquivo de novo pelo `clickhouse-client` (`< sql/001_db_ingestion.sql`) ou recrie o volume com autorização.

Consoles: RustFS em `http://localhost:9001/rustfs/console/` (login `admin` / `admin123`), RabbitMQ em `http://localhost:15672` e ClickHouse em `http://localhost:8123/play`. No Codespace, abra as portas encaminhadas (seção 13).

## 2. Agente

```bash
echo "@AGENTS.md" > CLAUDE.md    # só no Claude Code
```

Use o agente de código de sua preferência, aberto nesta pasta. Outros agentes leem o `AGENTS.md` diretamente ou aceitam o arquivo colado no contexto. Rode os prompts das Etapas 01 a 10 do material, um por vez, e faça a revisão "Revise antes de seguir" depois de cada um. Ao fim de cada etapa, o agente acrescenta em `docs/prompts.md` o prompt literal, a data e os arquivos gerados.

## 3. Dados de entrada

Os produtores leem a pasta `entrada/`, na raiz de `aula_04_ingestao/`, criada pelo `dados_aula_04.zip`:

| Pasta | Conteúdo | Como entra |
|---|---|---|
| `entrada/livros/livros.jsonl` | 1.000 livros coletados do books.toscrape.com em 30/10/2026, no contrato do bronze da Aula 03 | um `POST /ingest` por linha |
| `entrada/ptax/cotacoes.jsonl` | 40 boletins PTAX GBP de 20/10 a 29/10/2026 (API Olinda do BCB), com `moeda` | uma mensagem na fila com a lista |
| `entrada/telemetria/*.txt` | 1.920 lotes de 29/10/2026, 20 caminhões, 31.265 linhas (gerador da Aula 02) | uma mensagem na fila por linha, `{"arquivo", "numero_linha", "linha"}` |

As fixtures desta pasta continuam para os testes:

| Arquivo | Conteúdo |
|---|---|
| `fixtures/livros.jsonl` | 20 livros (as 20 primeiras linhas da coleta) |
| `fixtures/ptax_cotacoes.jsonl` | 5 boletins de 29/10/2026 |
| `fixtures/telemetria/*.txt` | 12 lotes do caminhão CAM-0451, 29/10/2026 das 6h00 às 8h45, 200 linhas |
| `fixtures/exemplos/valido_*.json` | 3 envelopes válidos, um por domínio |
| `fixtures/exemplos/invalido_*` | 7 inválidos (6 com 422 e 1 com 400), o código esperado está no nome |

`enviar_entrada.py` envia a pasta inteira usando só o contrato público: `POST /ingest` para livros e a fila `ingestao` com o envelope JSON para PTAX e telemetria. Ele não conhece o lake nem o ClickHouse, por isso funciona com o servidor de referência e com o servidor do grupo.

```bash
python enviar_entrada.py                                   # tudo
python enviar_entrada.py --so livros                       # um domínio
python enviar_entrada.py --so telemetria --limite-telemetria 2000
```

No fim ele imprime, por `data_tag`, as mensagens enviadas e as linhas esperadas no destino.

## 4. Servidor de referência (demonstração do professor)

`referencia/` é o gabarito do professor para a demonstração. Os alunos constroem o servidor deles pelos prompts, na pasta `aula_04_ingestao/`; a referência serve para mostrar o resultado esperado e para conferir números.

Nesta pasta do laboratório, com o `.env` preenchido, os serviços no ar e `entrada/` descompactada:

```bash
pip install -r requirements.txt
cd referencia
python -m pytest -q                  # 19 testes, sem rede
python -m src.servidor               # API em :8000 e consumidor da fila no mesmo processo
```

Em outro terminal, na pasta do laboratório:

```bash
python enviar_entrada.py
```

O servidor lê o `.env` da pasta do laboratório (a busca sobe de `referencia/src/` até achar o arquivo). Os produtores próprios da referência também existem e leem `../entrada/`: `python -m src.produtores.livros_http`, `python -m src.produtores.ptax_fila` e `python -m src.produtores.telemetria_fila`.

## 5. Etapa 07 · Gate da API

Com o servidor no ar (`python -m src.servidor` ou o comando definido no `plan.md`):

```bash
curl -s -w ' %{http_code}\n' localhost:8000/health
for f in fixtures/exemplos/*; do
  printf '%s ' "$(curl -s -o /dev/null -w '%{http_code}' -X POST localhost:8000/ingest \
    -H 'content-type: application/json' --data-binary @"$f")"; echo "$f"
done
# esperado: 202 para valido_*, 422 para invalido_422_*, 400 para invalido_400_*
head -c 1100000 /dev/zero | tr '\0' ' ' > /tmp/grande.json
curl -s -o /dev/null -w '%{http_code}\n' -X POST localhost:8000/ingest --data-binary @/tmp/grande.json   # 413
```

## 6. Etapa 09 · Gate de contagens

Depois de rodar os três produtores (ou `python enviar_entrada.py`), a mesma contagem em quatro lugares, por `data_tag`: o que foi enviado, o ClickHouse, o bronze e o raw. Mensagens e linhas não são a mesma coisa: o envelope de PTAX com 40 boletins é uma mensagem no raw e 40 linhas no bronze e no ClickHouse.

ClickHouse:

```bash
docker compose exec clickhouse clickhouse-client --user "$CLICKHOUSE_USER" --password "$CLICKHOUSE_PASSWORD" -q "
  SELECT data_tag, count() AS linhas, uniqExact(timestamp, toJSONString(data_json)) AS distintas
  FROM ingestao.db_ingestion GROUP BY data_tag ORDER BY data_tag"
```

Bronze, raw e manifestos, pelo DuckDB (consultas 1, 1a e 1b de `sql/duckdb_cast.sql`):

```bash
python sql/rodar_sql.py sql/duckdb_cast.sql
```

Fila vazia e rejeitados:

```bash
docker compose exec rabbitmq rabbitmqctl list_queues name messages messages_unacknowledged
docker compose run --rm mc ls --recursive lake/raw/ingestao_rejeitados/
```

Teste de queda (no meio da carga de telemetria):

```bash
python -m src.servidor & SERVIDOR=$!
python enviar_entrada.py --so telemetria &            # ou o produtor do grupo
sleep 3; kill -9 $SERVIDOR                            # derruba sem flush e sem ack
docker compose exec rabbitmq rabbitmqctl list_queues name messages messages_unacknowledged
python -m src.servidor                                # reinicia; a fila reentrega o que não teve ack
```

Depois da drenagem, refaça as contagens. Nada se perde. Linhas repetidas só aparecem se o processo cair entre a gravação e o ack; a consulta 7 de cada arquivo de cast mostra quantas, e o lote repetido aparece com dois manifestos.

Checklist:

- [ ] `pytest -q` verde
- [ ] curl: 202, 422, 400 e 413 nos casos esperados
- [ ] por `data_tag`: linhas esperadas = linhas no ClickHouse = linhas no bronze = linhas derivadas do raw
- [ ] envelopes no raw = mensagens enviadas; um manifesto `ok` por lote, e a soma de `linhas` dos manifestos = linhas no ClickHouse
- [ ] fila com 0 mensagens e 0 sem ack depois da drenagem
- [ ] envelope inválido publicado direto na fila aparece em `raw/ingestao_rejeitados/` com o motivo
- [ ] teste de queda: nenhuma linha perdida; duplicadas contadas e explicadas
- [ ] `git status --short` não lista `.env` nem `entrada/`

## 7. Etapa 10 · JSON cast e silver

```bash
python sql/rodar_sql.py sql/duckdb_cast.sql
docker compose exec -T clickhouse clickhouse-client --user "$CLICKHOUSE_USER" --password "$CLICKHOUSE_PASSWORD" \
  --time --multiquery < sql/clickhouse_cast.sql
python sql/rodar_sql.py sql/silver_livros_ptax.sql --var DATA=2026-10-30   # dia da coleta dos livros do zip
```

O silver sai do bronze, no contrato da silver (o mesmo da Aula 03):

- `s3://silver/livros/data_coleta=D/livros.parquet`: `upc`, `url`, `titulo`, `categoria`, `avaliacao` (TINYINT), `preco_gbp` (DECIMAL(10,2)), `em_estoque` (BOOLEAN), `qtd_estoque` (INTEGER), `coletado_em` (TIMESTAMPTZ), `arquivo_origem`, `processado_em`; um por `upc`, fica a coleta mais recente;
- `s3://silver/ptax/ptax.parquet`: `moeda`, `data_hora_cotacao` (TIMESTAMP), `tipo_boletim`, `cotacao_compra` e `cotacao_venda` (DECIMAL(12,5)), `arquivo_origem`, `processado_em`; um por (`moeda`, `data_hora_cotacao`, `tipo_boletim`).

`arquivo_origem` passa a ser o Parquet do bronze de onde a linha veio.

## 8. Layout esperado no lake (RustFS)

A organização segue a da Aula 03: `raw` guarda o que chegou, sem interpretação; `bronze` guarda o extraído, uma linha por registro; a chave tem partições no formato `nome=valor`; a data da partição é a do recebimento em `America/Sao_Paulo`; cada lote grava um manifesto.

```text
raw/ingestao/data_tag=livros/data=AAAA-MM-DD/lote_<HHMMSS>_<id>.jsonl
raw/ingestao/data_tag=ptax/data=AAAA-MM-DD/lote_<HHMMSS>_<id>.jsonl
raw/ingestao/data_tag=telemetria/data=AAAA-MM-DD/lote_<HHMMSS>_<id>.jsonl
raw/ingestao_rejeitados/data=AAAA-MM-DD/rejeitado_<HHMMSS>_<id>.json
raw/_manifestos/ingestao/data=AAAA-MM-DD/lote_<HHMMSS>_<id>.json
bronze/ingestao/data_tag=livros/data=AAAA-MM-DD/lote_<HHMMSS>_<id>.parquet
bronze/ingestao/data_tag=ptax/data=AAAA-MM-DD/lote_<HHMMSS>_<id>.parquet
bronze/ingestao/data_tag=telemetria/data=AAAA-MM-DD/lote_<HHMMSS>_<id>.parquet
silver/livros/data_coleta=AAAA-MM-DD/livros.parquet
silver/ptax/ptax.parquet
```

- raw: um JSON Lines por lote e por `data_tag`, uma linha por envelope: `{"recebido_em_ms": ..., "envelope": <o corpo recebido>}`. Quebras de linha do corpo viram espaço (num JSON válido elas só separam tokens), para caber em uma linha.
- bronze: um Parquet ZSTD por lote e por `data_tag`, com `timestamp` (UBIGINT, unix ms) e `data_json` (VARCHAR), uma linha por objeto de `data`. `data_tag` e `data` vêm do caminho.
- O mesmo nome de lote liga o raw, o bronze e o manifesto. `HHMMSS` é a hora do primeiro envelope do lote em Brasília; o sufixo aleatório evita colisão entre lotes do mesmo segundo. A chave não é determinística como as da Aula 03: aqui o dado é empurrado, e um lote reentregue pode ter outra composição. O manifesto faz o papel de registro.
- manifesto: `lote`, `data`, horários do primeiro e do último envelope, início e fim do flush, `mensagens`, `linhas`, contagem por `data_tag`, a lista de `arquivos` (camada, chave, registros, bytes, SHA-256), o destino no ClickHouse, os tempos de cada passo em ms, `status` (`ok` ou `erro_clickhouse`) e `erro`.
- Cada objeto leva os metadados `sha256` e `lote` (`mc stat` mostra).
- rejeitado: um JSON por envelope recusado pelo consumidor, com `recebido_em_ms`, `motivo` e o `corpo` como chegou.

## 9. O que foi validado em 30/10/2026

Servidor de referência (`referencia/`) montado e medido na preparação. Máquina: notebook Intel Core i5-1345U (12 threads), 15 GiB de RAM, Linux, Docker 29.9.2, Compose 5.6.1, Python 3.12.3. Serviços e servidor na mesma máquina, sem rede entre eles. Cliente sequencial, uma conexão keep-alive. Mediana (p50) e percentil 95 (p95).

Dados usados: os do `dados_aula_04.zip`. 1.000 livros coletados do books.toscrape.com em 30/10/2026 (páginas de detalhe, 50 categorias, 1 s entre requisições, 25 minutos); 40 boletins PTAX GBP de 20/10 a 29/10/2026 (API Olinda, 8 dias úteis, 5 boletins por dia); um dia de telemetria do gerador da Aula 02 (`--inicio 2026-10-29T00:00 --horas 24`, 20 caminhões, 1.920 lotes, 31.265 linhas, 1.956.243 bytes).

A primeira rodada usou MinIO e gravava só um Parquet por lote em `raw/`. A segunda, com RustFS 1.0.4 e a organização raw, bronze e manifesto, refez as medidas que dependem do armazenamento e do flush. As demais (latência HTTP, JSON cast, tamanho no ClickHouse) não passam pelo lake na escrita e ficaram da primeira rodada, marcadas como "MinIO".

### Segunda rodada: RustFS e lake organizado

Roteiro executado de ponta a ponta: `docker compose up`, buckets pelo `rustfs-init`, `pytest` da referência (19 testes), servidor de referência, `unzip` do pacote, `python enviar_entrada.py`, contagens, envelopes inválidos pela fila, teste de queda, os quatro arquivos de `sql/` e os comandos da seção 13.

RustFS:

- Imagem `rustfs/rustfs:1.0.4` (publicada em 25/10/2026; `rustfs --version` = 1.0.4). A 1.0.3 é de 17/10/2026.
- Variáveis: `RUSTFS_ACCESS_KEY`, `RUSTFS_SECRET_KEY`, `RUSTFS_ADDRESS` (padrão `:9000`), `RUSTFS_CONSOLE_ENABLE`, `RUSTFS_CONSOLE_ADDRESS` (padrão `:9001`).
- `GET /health` na porta 9000 responde 200 com a versão; é o healthcheck do compose (a imagem tem `curl`).
- Console em `http://localhost:9001/rustfs/console/`. A raiz `http://localhost:9001/` responde 403. Login com `admin` / `admin123` abriu o navegador de buckets; o console só fez requisições à porta 9001.
- `mc` (imagem do MinIO), boto3 1.43.123 e DuckDB 1.5.6 com `httpfs` (`URL_STYLE 'path'`, `USE_SSL false`, `REGION 'us-east-1'`) leram e gravaram sem ajuste. O RustFS sem `RUSTFS_SERVER_DOMAINS` só aceita endereçamento por caminho (path-style).

Gate de contagens com o pacote inteiro (`enviar_entrada.py`, `FLUSH_N=500`, `FLUSH_SEGUNDOS=2`):

| data_tag | Enviadas | Linhas esperadas | ClickHouse | Bronze (arquivos) | Raw: envelopes (arquivos) |
|---|---|---|---|---|---|
| livros | 1.000 por HTTP (1,9 s) | 1.000 | 1.000 | 1.000 (2) | 1.000 (2) |
| ptax | 1 pela fila | 40 | 40 | 40 (1) | 1 (1) |
| telemetria | 31.265 pela fila (11,4 s) | 31.265 | 31.265 | 31.265 (63) | 31.265 (63) |

65 manifestos, todos `ok`, somando 32.266 mensagens e 32.305 linhas. Fila com 0 mensagens e 0 sem ack. Raw com 66 objetos e 7.757.890 bytes, bronze com 66 objetos e 702.664 bytes, manifestos com 85.881 bytes. Três envelopes inválidos publicados direto na fila foram para `raw/ingestao_rejeitados/data=2026-10-30/` (136, 156 e 179 bytes).

Custo de um flush por passo (mediana de 30 repetições; 10 com 5.000 linhas):

| Linhas no lote | raw (PUT do JSON Lines) | bronze (DuckDB + PUT) | ClickHouse (INSERT) | manifesto (PUT) | total |
|---|---|---|---|---|---|
| 1 | 7,0 ms | 10,5 ms | 5,0 ms | 7,7 ms | 30,8 ms |
| 500 | 8,0 ms | 10,7 ms | 5,7 ms | 7,5 ms | 31,6 ms |
| 5.000 | 18,5 ms | 12,4 ms | 8,0 ms | 7,4 ms | 45,9 ms |

Na primeira rodada o flush tinha dois passos: Parquet direto no MinIO (5,2, 5,3 e 6,5 ms) e INSERT (4,0, 4,0 e 6,0 ms), cerca de 9 a 13 ms. O mesmo `COPY ... TO 's3://...'` do DuckDB, agora contra o RustFS, levou 7,6, 7,2 e 7,8 ms. O flush ficou cerca de 3,4 vezes mais caro porque faz três PUTs em vez de um e porque cada PUT no RustFS custa uns 2 ms a mais nesta máquina. O custo fixo continua dominando: 5.000 linhas custam 1,5 vez o de uma linha.

Comparação com a primeira rodada:

| Medida | MinIO, lake só com Parquet | RustFS, raw + bronze + manifesto |
|---|---|---|
| Flush de 500 linhas (lake + ClickHouse) | cerca de 9,3 ms | 31,6 ms |
| Dia de telemetria na fila, `FLUSH_N=500`, tempo para drenar | 3,84 s (8.147 linhas/s) | 6,19 s e 5,98 s (5.049 e 5.226 linhas/s) |
| Objetos gravados pelo dia de telemetria | 63 | 189 (63 raw, 63 bronze, 63 manifestos) |
| Bytes do dia de telemetria no lake | 619.050 (Parquet) | raw 7.347.808; bronze 617.737; manifestos 82.579 |
| POST até a linha no ClickHouse, `FLUSH_N=500`, `FLUSH_SEGUNDOS=2` | p50 2.030 ms, p95 2.039 ms | p50 2.053 ms, p95 2.086 ms |
| O mesmo com `FLUSH_N=1` | p50 34 ms, p95 52 ms | p50 49 ms, p95 61 ms |

O raw é o dado sem compressão: o dia de telemetria em envelopes ocupa 3,8 vezes o TXT original e 12 vezes o bronze. Com pouco tráfego, a latência continua sendo `FLUSH_SEGUNDOS` mais o flush.

Queda (kill -9 do servidor no meio da carga de telemetria, `FLUSH_N=500`, reinício e drenagem):

| Momento do kill | Publicadas | ClickHouse | Bronze | Raw (envelopes) | Manifestos | Duplicadas | Perdidas |
|---|---|---|---|---|---|---|---|
| com 10.000 linhas no ClickHouse | 31.265 | 31.265 | 31.265 (63 arquivos) | 31.265 (63) | 63 | 0 | 0 |
| entre o manifesto e o ack (pausa de 3 s, só no script de medição) | 31.265 | 31.765 | 31.765 (64) | 31.765 (64) | 64 | 500 em cada destino | 0 |

No segundo caso, o lote repetido aparece com dois manifestos `ok` e as mesmas mensagens. A pausa existe só no script de medição; o servidor de referência não tem esse gancho.

Silver (`sql/silver_livros_ptax.sql --var DATA=2026-10-30`, lendo o bronze): 1.000 livros, 1.000 UPCs, preço de 10,00 a 59,99, nenhum sem `arquivo_origem`; 40 boletins PTAX, 5 por dia de 20/10 a 29/10/2026. `DESCRIBE` igual ao contrato: `avaliacao` TINYINT, `preco_gbp` DECIMAL(10,2), `em_estoque` BOOLEAN, `qtd_estoque` INTEGER, `coletado_em` TIMESTAMP WITH TIME ZONE, `data_hora_cotacao` TIMESTAMP, `cotacao_compra` e `cotacao_venda` DECIMAL(12,5). `duckdb_cast.sql`, `clickhouse_cast.sql` e `rodar_sql.py` rodaram sem erro contra o RustFS; a venda média do Fechamento deu 6,95758 no DuckDB (DECIMAL) e 6,95757 no ClickHouse (Float64).

### Primeira rodada (MinIO, lake só com Parquet)

Contrato e DDL:

- `PARTITION BY toYYYYMM(fromUnixTimestamp64Milli(toInt64(timestamp)))` aceito pelo ClickHouse 26.8.15.10 sem ajuste; `1793452800123` cai na partição `202610`.
- Os 10 exemplos de `fixtures/exemplos/` devolveram o código do nome do arquivo (3 com 202, 6 com 422, 1 com 400); corpo de 1,1 MB devolveu 413.

Latência do `POST /ingest` (1.000 requisições por caso, depois de 50 de aquecimento):

| Caso | Corpo | p50 | p95 |
|---|---|---|---|
| inválido, `data_tag` desconhecida (422) | 317 B | 0,53 ms | 1,00 ms |
| inválido, `data` vazia (422) | 34 B | 0,50 ms | 0,98 ms |
| válido, um objeto (202) | 319 B | 1,51 ms | 2,19 ms |
| válido, lista de 10 livros (202) | 2.922 B | 1,55 ms | 2,08 ms |
| válido, lista de 100 livros (202) | 28.932 B | 2,47 ms | 3,62 ms |

O 422 não toca a fila. A diferença para o 202, cerca de 1 ms, é a publicação com confirmação do broker.

Do POST até a linha aparecer no ClickHouse (MinIO; 30 POSTs, consulta ao ClickHouse a cada 10 ms):

| Configuração | p50 | p95 |
|---|---|---|
| `FLUSH_N=500`, `FLUSH_SEGUNDOS=2`, sem outro tráfego | 2.030 ms | 2.039 ms |
| `FLUSH_N=1` (flush a cada envelope), sem outro tráfego | 34 ms | 52 ms |
| `FLUSH_N=500`, `FLUSH_SEGUNDOS=2`, durante a carga de 31.265 linhas de telemetria | 145 ms | 2.039 ms |

Com pouco tráfego, quem dispara o flush é o relógio: a latência é `FLUSH_SEGUNDOS` mais uns 30 ms. Durante a carga, o lote enche antes e a latência cai para a casa de 150 ms.

Micro-lote (MinIO, lake só com Parquet): fila pré-carregada com o dia de telemetria (31.265 mensagens), consumidor sobe e drena. O tempo inclui a subida do servidor (cerca de 1 s).

| `FLUSH_N` | Tempo para drenar | Linhas/s | INSERTs | Partes criadas | Partes ativas ao fim | Objetos no lake | Bytes no lake |
|---|---|---|---|---|---|---|---|
| 1 | 524,5 s | 60 | 31.265 | 31.265 | 5 | 31.265 | 33.339.527 |
| 500 | 3,8 s | 8.147 | 63 | 63 | 3 | 63 | 619.050 |
| 5.000 | 3,3 s | 9.554 | 7 | 7 | 2 | 7 | 567.283 |

Com `FLUSH_N=1`, o ClickHouse fez cerca de 19.600 merges durante os 9 minutos para manter as partes ativas em 5 (contagem por minuto em `system.part_log`). O lake guardou 54 vezes mais bytes que com `FLUSH_N=500`, porque cada Parquet de uma linha carrega cabeçalho, rodapé e metadados.

Mesma carga menor (2.000 mensagens): `FLUSH_N=1` levou 22,0 s (91 linhas/s, 2.000 partes, 399 merges); `FLUSH_N=500`, 0,48 s (4 partes); `FLUSH_N=5000`, 2,53 s, porque o lote nunca enche e o flush espera os 2 s.

Tamanho do dia de telemetria (31.265 linhas):

| Forma | Bytes |
|---|---|
| TXT original (1.920 arquivos) | 1.956.243 |
| JSON Lines `{"timestamp", "data"}` | 5.847.088 |
| JSON Lines com gzip | 550.383 |
| Parquet ZSTD no lake (63 arquivos, `FLUSH_N=500`, MinIO) | 631.827 |
| Parquet ZSTD em um arquivo só | 580.547 |
| ClickHouse, LZ4 padrão, depois de `OPTIMIZE FINAL` | 1.012.247 comprimido, 5.253.229 descomprimido |

O envelope JSON triplica o texto original (nomes de campo e escapes repetidos em cada linha). O Parquet ZSTD guarda o mesmo dia em um terço do TXT.

JSON cast (MinIO; tempo de consulta, mediana de 5 execuções depois de uma de aquecimento):

| Consulta | Dados reais (1.000 livros) | Livros x1.000 (1.000.000 linhas) |
|---|---|---|
| DuckDB `->>` com `CAST` sobre o Parquet do lake | 3,8 ms | 211 ms |
| DuckDB `json_extract_string` / `json_extract` | 3,9 ms | 194 ms |
| DuckDB `from_json` com estrutura declarada | 3,5 ms | 130 ms |
| DuckDB sobre Parquet já tipado (silver) | | 7,5 ms |
| ClickHouse coluna do tipo `JSON`, a tabela da aula (subcolunas na escrita) | | 21 ms |
| ClickHouse coluna `JSON` com tipo declarado (`data.preco_gbp.:Float64`) | | 16 ms |
| ClickHouse coluna `String`, `JSONExtractString` / `JSONExtractFloat` | 3,4 ms | 146 ms |
| ClickHouse coluna `String`, `simpleJSONExtract*` | 4,6 ms | 75 ms |
| ClickHouse coluna `String`, `CAST(data_json AS JSON)` na consulta | 6,4 ms | 957 ms |

Telemetria (contar linhas por caminhão com expressão regular sobre `linha`): 8,7 ms no DuckDB e 12,6 ms no ClickHouse; 2.396 das 31.265 linhas não têm caminhão (`#RADIO` e `ERR SAT`).

Com mil livros, todas as formas respondem em poucos milissegundos. Com um milhão de linhas, `CAST AS JSON` na hora da consulta é a mais lenta (o texto é convertido de novo a cada consulta) e a coluna do tipo `JSON` é a mais rápida (as subcolunas já estão separadas no disco). Por isso a tabela de pouso usa o tipo `JSON`; as linhas com `String` mostram o custo da alternativa. Com a inferência padrão, a coluna `JSON` inferiu `coletado_em` como `DateTime` e converteu `2026-10-30T19:27:52-03:00` para `2026-10-30 22:27:52` em UTC, perdendo o deslocamento. Com `input_format_try_infer_dates = 0` e `input_format_try_infer_datetimes = 0`, como o consumidor insere, o caminho fica `String` e guarda `2026-10-30T19:27:52-03:00`.

## 10. Semana · ATAM e Railway

- `docs/atam.md` com os cenários: ClickHouse fora por 20 minutos, RustFS fora, processo morto entre a gravação e o ack, produtor que manda 10 vezes o volume normal, payload que muda de forma (`linha` vira `texto`), envelope com `data_tag` nova. Cada cenário com estímulo, resposta esperada, medida e evidência (comando e número).
- Railway: o plano de teste permite até cinco serviços. O object storage (o grupo usa no Railway o que já tem desde a Aula 01), RabbitMQ, ClickHouse e o servidor de ingestão somam quatro. Confira quantos o grupo já usa antes de criar.

## 11. Entregável

Pasta `aula_04_ingestao/` no repositório do grupo com `AGENTS.md`, `docs/` (prompts, persona, objetivos, arquitetura, cinco ADRs), `specs/` (contrato, exemplos, requisitos, modelo, plano, tarefas), `sql/`, `src/` rodando, `tests/` passando e o gate da Etapa 09 registrado em `docs/prompts.md` com os números do grupo.

## 12. Encerrar

```bash
docker compose down          # mantém os volumes com os dados locais
docker compose down -v       # apaga também os volumes (pede autorização no agente)
```

## 13. Mostrar o resultado

Comandos testados em 30/10/2026 com o servidor de referência, depois de `python enviar_entrada.py`. Rode na pasta do `docker-compose.yml`, com o `.env` carregado no terminal:

```bash
set -a; source .env; set +a
```

ClickHouse pelo `clickhouse-client` dentro do contêiner (sessão interativa; saia com `exit`):

```bash
docker compose exec clickhouse clickhouse-client --user "$CLICKHOUSE_USER" --password "$CLICKHOUSE_PASSWORD" --database ingestao
```

Dentro da sessão:

```sql
SHOW TABLES;
DESCRIBE db_ingestion;

SELECT data_tag, count() AS linhas
FROM db_ingestion
GROUP BY data_tag
ORDER BY data_tag;

SELECT timestamp,
       fromUnixTimestamp64Milli(toInt64(timestamp), 'America/Sao_Paulo') AS recebido_em,
       data_tag, data_json
FROM db_ingestion WHERE data_tag = 'livros' ORDER BY timestamp LIMIT 5
FORMAT Vertical;

SELECT * FROM db_ingestion WHERE data_tag = 'ptax' ORDER BY timestamp LIMIT 5 FORMAT Vertical;

SELECT * FROM db_ingestion WHERE data_tag = 'telemetria' ORDER BY timestamp LIMIT 5 FORMAT Vertical;

SELECT data_json.titulo::String     AS titulo,
       data_json.categoria::String  AS categoria,
       data_json.preco_gbp::Float64 AS preco_gbp
FROM db_ingestion
WHERE data_tag = 'livros'
ORDER BY preco_gbp DESC
LIMIT 5;
```

Resultado esperado com o pacote inteiro: `livros 1000`, `ptax 40`, `telemetria 31265`; o livro mais caro é "The Perfect Play (Play by Play #1)", Romance, 59.99.

A mesma contagem sem entrar na sessão (`-q`) e pela interface HTTP:

```bash
docker compose exec clickhouse clickhouse-client --user "$CLICKHOUSE_USER" --password "$CLICKHOUSE_PASSWORD" \
  --database ingestao -q "SELECT data_tag, count() AS linhas FROM db_ingestion GROUP BY data_tag ORDER BY data_tag"

curl -s -u "$CLICKHOUSE_USER:$CLICKHOUSE_PASSWORD" 'http://localhost:8123/?database=ingestao' \
  --data-binary 'SELECT data_tag, count() AS linhas FROM db_ingestion GROUP BY data_tag ORDER BY data_tag FORMAT PrettyCompact'
```

Interface web do ClickHouse: `http://localhost:8123/play`. Preencha usuário e senha do `.env` (`ingestao` / `ingestao123` no padrão) e rode `SELECT data_tag, count() FROM ingestao.db_ingestion GROUP BY data_tag`.

Console do RustFS: `http://localhost:9001/rustfs/console/`, login `admin` / `admin123`. O navegador mostra os buckets `raw`, `bronze`, `silver`, `gold` e `teste` com a contagem de objetos.

Árvore do lake (o serviço `mc` do compose já entra com o alias `lake`):

```bash
docker compose run --rm mc tree --files lake/raw/ingestao
docker compose run --rm mc tree --files lake/bronze
docker compose run --rm mc tree --files lake/raw/_manifestos
docker compose run --rm mc tree --files lake/silver
docker compose run --rm mc du --depth 2 lake/raw lake/bronze     # bytes por prefixo
```

Abrir um manifesto (copie a chave de um da listagem):

```bash
docker compose run --rm mc ls --recursive lake/raw/_manifestos/ingestao/
docker compose run --rm mc cat lake/raw/_manifestos/ingestao/data=AAAA-MM-DD/lote_HHMMSS_xxxxxxxx.json
docker compose run --rm mc stat lake/bronze/ingestao/data_tag=ptax/data=AAAA-MM-DD/lote_HHMMSS_xxxxxxxx.parquet   # metadados sha256 e lote
```

Resumo de todos os manifestos, raw e bronze pelo DuckDB: `python sql/rodar_sql.py sql/duckdb_cast.sql` (consultas 1, 1a e 1b).

No Codespaces, os comandos acima rodam no terminal do próprio Codespace e usam `localhost` sem nada a configurar. Só o que abre no navegador precisa de porta encaminhada (aba Ports; o Codespaces costuma encaminhar sozinho quando a porta abre):

| Porta | Serviço | Endereço no navegador |
|---|---|---|
| 9001 | console do RustFS | `/rustfs/console/` na URL encaminhada |
| 8123 | ClickHouse HTTP e `/play` | `/play` na URL encaminhada |
| 15672 | console do RabbitMQ | raiz da URL encaminhada |
| 8000 | API de ingestão (`/docs` da FastAPI) | `/docs` na URL encaminhada |

As portas 9000 (API S3) e 5672 (AMQP) não precisam de encaminhamento: só o servidor e os scripts, dentro do Codespace, falam com elas. Localmente o console do RustFS só fez requisições à porta 9001. O acesso pelas URLs encaminhadas do Codespaces não foi testado na preparação.
