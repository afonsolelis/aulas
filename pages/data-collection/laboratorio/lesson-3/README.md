# Aula 03 · Laboratório: monitor de preços de livros

Data Collection and Storage · Inteli · 24/10/2026, 8h30 às 12h10

Roteiro da construção em etapas. A explicação de cada etapa e os prompts CREATE completos estão no material da aula: `../../materials/lesson-3-material.html` (seções 11 a 18). O método foi adaptado do repositório público https://github.com/afonsolelis/cinesenac, que constrói um sistema transacional do PRD ao CI por prompts; aqui o mesmo caminho é aplicado a um sistema de dados.

O código não está aqui. Ele nasce ao vivo, pelos prompts, no repositório do grupo. Esta pasta traz só os arquivos de apoio.

## Arquivos de apoio

| Arquivo | Uso |
|---|---|
| `docker-compose.yml` | MinIO local (`coollabsio/minio:RELEASE.2025-10-15T17-29-55Z`), API S3 na porta 9000 e console na 9001 |
| `.env.example` | variáveis do MinIO, da coleta e das fontes; copie para `.env` |
| `requirements.txt` | dependências Python sugeridas |
| `AGENTS.md` | regras para o agente de código nesta pasta, incluindo o registro de prompts |

## Fontes

- Scraping: https://books.toscrape.com (site de treino; os preços e as avaliações são aleatórios, como o próprio site avisa).
- API: PTAX do Banco Central, `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata`, recurso `CotacaoMoedaPeriodo`, moeda `GBP`, datas no formato `MM-DD-AAAA`.

Fatos verificados em 03/10/2026: 50 categorias, 1.000 livros, 20 por página, 80 páginas de categoria; UPC e quantidade em estoque (`In stock (20 available)`) só aparecem na página de detalhe de cada livro, que tem entre 9 e 15 KiB; a coleta completa faz cerca de 1.081 requisições (perto de 18 minutos só de espera com 1 s de intervalo); `robots.txt` devolve 404; o servidor não declara charset no `Content-Type` (use `response.content`); a PTAX devolve `200` com lista vazia em sábado e em data no formato ISO, e `500` em data `DD-MM-AAAA`.

## Horário

A teoria entra dentro das etapas: o prompt vai para o agente e, enquanto ele trabalha, a aula explica o que o prompt pediu. Depois o grupo volta ao artefato e faz a revisão.

| Horário | Parte |
|---|---|
| 8h30 às 8h45 | abertura, API e anatomia da requisição, método |
| 8h45 às 9h20 | Etapas 00 a 03: ambiente, personas, direcionadores e regras |
| 9h20 às 9h51 | Etapas 04 e 05: requisitos funcionais e não funcionais |
| 9h51 às 10h35 | Etapas 06 a 08: modelo de dados e modelagens |
| 10h35 às 10h54 | Etapas 09 a 11: ADRs, plano, tarefas e testes vermelhos |
| 10h54 às 11h20 | Etapas 12 a 15: código |
| 11h20 às 11h30 | Etapas 16 a 18 apresentadas e revisão dos pontos-chave |
| 11h30 às 12h00 | revisão dos pontos-chave |
| 12h00 às 12h10 | fechamento |
| semana | Etapas 16 a 18: execução completa, ATAM e Railway |

## Etapas e artefatos

| Etapa | Tema | Artefato |
|---|---|---|
| 00 | Preparação | pasta, MinIO local, buckets `raw`, `bronze` e `teste`, `docs/prompts.md` |
| 01 | Personas | `docs/00_persona.md` |
| 02 | Direcionadores de negócio e objetivos | `docs/01_objetivos_negocio.md` |
| 03 | Regras de negócio e de coleta | `docs/02_regras_de_negocio.md` |
| 04 | Requisitos funcionais | `specs/01_requisitos_funcionais.md` |
| 05 | Requisitos não funcionais (ISO/IEC 25010) | `specs/02_requisitos_nao_funcionais.md` |
| 06 | Modelo de dados | `specs/03_modelo_de_dados.md`, `specs/modelo.dbml` |
| 07 | Modelagem estática | `docs/modelagem/estatica/componentes.md`, `classes.md` |
| 08 | Modelagem dinâmica | `docs/modelagem/dinamica/RF-xx.md`, `estados_item.md` |
| 09 | Arquitetura e ADRs | `docs/arquitetura.md`, `docs/adr/ADR-001` a `ADR-007` |
| 10 | Plano e tarefas | `specs/plan.md`, `specs/tasks.md` |
| 11 | Testes primeiro | `tests/fixtures/`, `features/*.feature`, testes vermelhos |
| 12 | Configuração e cliente HTTP | `src/`, testes verdes |
| 13 | Gravador S3 e manifesto | `src/`, testes verdes |
| 14 | Coletores PTAX e books | `src/`, testes verdes |
| 15 | Extrator e linha de comando | `src/`, `pytest -q` inteiro verde |
| 16 | Execução local e gate | objetos no MinIO local |
| 17 | Validação ATAM e rastreabilidade | `docs/atam.md`, `docs/rastreabilidade.md` |
| 18 | Railway e entrega | objetos no MinIO do Railway |

Árvore final:

```text
aula_03_api_scraping/
├── AGENTS.md
├── docker-compose.yml  .env.example  requirements.txt
├── docs/
│   ├── prompts.md
│   ├── 00_persona.md
│   ├── 01_objetivos_negocio.md
│   ├── 02_regras_de_negocio.md
│   ├── modelagem/estatica/componentes.md, classes.md
│   ├── modelagem/dinamica/RF-xx.md, estados_item.md
│   ├── arquitetura.md
│   ├── adr/ADR-001-coleta-e-extracao-separadas.md ... ADR-007
│   ├── atam.md
│   └── rastreabilidade.md
├── specs/
│   ├── 01_requisitos_funcionais.md
│   ├── 02_requisitos_nao_funcionais.md
│   ├── 03_modelo_de_dados.md, modelo.dbml
│   ├── plan.md, tasks.md
├── features/*.feature
├── src/
└── tests/ (fixtures/)
```

## 1. Etapa 00 · Preparar a pasta no repositório do grupo

No Codespace do repositório do grupo, na raiz:

```bash
mkdir -p aula_03_api_scraping/{docs/adr,docs/modelagem/estatica,docs/modelagem/dinamica,specs,features,src,tests/fixtures}
# copie para aula_03_api_scraping/ os quatro arquivos de apoio desta pasta
cd aula_03_api_scraping
printf '.env\n.env.*\n!.env.example\n.venv/\n__pycache__/\n' >> .gitignore
cp .env.example .env
git check-ignore .env            # deve imprimir: .env
openssl rand -base64 24          # use como MINIO_ROOT_PASSWORD e S3_SECRET_KEY no .env
printf '# Registro de prompts\n' > docs/prompts.md
```

Edite o `.env`: senha do MinIO (o mesmo valor nas duas variáveis) e `USER_AGENT` com o endereço do repositório do grupo.

## 2. Subir o MinIO local e criar os buckets

```bash
docker compose config --quiet && echo "compose ok"
docker compose up -d --wait
docker compose ps                # STATUS deve mostrar (healthy)
docker compose exec minio sh -c 'mc alias set local http://localhost:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" && mc mb --ignore-existing local/raw local/bronze local/teste'
docker compose exec minio mc ls local
```

O bucket `teste` recebe só os testes de gravação (Etapa 13). O console web fica na porta 9001 (no Codespace, abra a porta encaminhada).

## 3. Ambiente Python

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 4. Conferir as fontes antes dos prompts

```bash
curl -sI https://books.toscrape.com/ | head -5
curl -s -o /dev/null -w "%{http_code}\n" https://books.toscrape.com/robots.txt
B="https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata"
curl -s "$B/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='GBP'&@dataInicial='10-17-2026'&@dataFinalCotacao='10-24-2026'&\$format=json&\$select=cotacaoVenda,dataHoraCotacao,tipoBoletim"
```

## 5. Agente

```bash
echo "@AGENTS.md" > CLAUDE.md    # só no Claude Code
claude                           # ou o agente que você usa
```

Use o agente de código de sua preferência, aberto nesta pasta. Outros agentes leem o `AGENTS.md` diretamente ou aceitam o arquivo colado no contexto. Rode os prompts das Etapas 01 a 18 do material, um por vez, e faça a revisão "Revise antes de seguir" depois de cada um. Ao fim de cada etapa, o agente acrescenta em `docs/prompts.md` o prompt literal, a data e os arquivos gerados. Nenhuma chave de API entra no Git nem no registro de prompts.

## 6. Etapa 11 · Fixtures

Páginas reais, baixadas uma vez, com o `User-Agent` do grupo e pausa entre as chamadas:

```bash
UA='inteli-aula03-coletor/0.1 (+https://github.com/<org>/<repo>)'
curl -s -A "$UA" https://books.toscrape.com/ -o tests/fixtures/inicio.html; sleep 1
curl -s -A "$UA" https://books.toscrape.com/catalogue/category/books/mystery_3/index.html -o tests/fixtures/categoria_mystery_p1.html; sleep 1
curl -s -A "$UA" https://books.toscrape.com/catalogue/sharp-objects_997/index.html -o tests/fixtures/detalhe_sharp_objects.html
```

A página de detalhe do Sharp Objects tem UPC `e00eb4fd7b871a48`, preço `£47.82` e `In stock (20 available)`.

## 7. Layout esperado no MinIO

`raw` guarda os bytes como chegaram da fonte (HTML e JSON); `bronze` guarda os registros extraídos em JSON Lines, ainda sem tipagem forte. Silver e gold vêm na Aula 04.

```text
raw/books_toscrape/data=AAAA-MM-DD/robots.txt.json
raw/books_toscrape/data=AAAA-MM-DD/categoria=_inicio/pagina=001.html
raw/books_toscrape/data=AAAA-MM-DD/categoria=<slug>/pagina=NNN.html
raw/books_toscrape/data=AAAA-MM-DD/livro=<slug_id>/detalhe.html
raw/ptax/moeda=GBP/data=AAAA-MM-DD/cotacao_moeda_periodo.json
raw/manifestos/data=AAAA-MM-DD/execucao=<id>.json
bronze/books_toscrape/data=AAAA-MM-DD/livros.jsonl
bronze/ptax/moeda=GBP/data=AAAA-MM-DD/cotacoes.jsonl
```

Campos combinados com as Aulas 04 e 05 (a Etapa 06 os documenta; não renomeie nem traduza):

- `livros.jsonl`: `upc`, `url`, `titulo`, `categoria`, `avaliacao`, `preco_gbp`, `em_estoque`, `qtd_estoque`, `coletado_em`
- `cotacoes.jsonl`: `moeda`, `dataHoraCotacao`, `tipoBoletim`, `cotacaoCompra`, `cotacaoVenda`

A conversão para reais fica para a Aula 04. Durante o desenvolvimento, use `SCRAPER_CATEGORIAS=mystery_3,poetry_23` para não baixar as 1.000 páginas de detalhe a cada teste.

A data da partição é a data da coleta em `America/Sao_Paulo`. As chaves de páginas e da PTAX são determinísticas: reexecutar no mesmo dia sobrescreve, sem duplicar. Cada execução grava um manifesto próprio.

## 8. Etapa 16 · Verificação local

Troque `AAAA-MM-DD` pela data da coleta.

```bash
pytest -q
SCRAPER_CATEGORIAS=mystery_3,poetry_23 python -m src.coletar --data AAAA-MM-DD
python -m src.extrair --data AAAA-MM-DD
docker compose exec minio mc ls --recursive local/raw/books_toscrape/data=AAAA-MM-DD/ | wc -l
docker compose exec minio mc cat local/raw/ptax/moeda=GBP/data=AAAA-MM-DD/cotacao_moeda_periodo.json
docker compose exec minio mc find local/raw/books_toscrape/data=AAAA-MM-DD/ --name detalhe.html | wc -l
docker compose exec minio mc cat local/bronze/books_toscrape/data=AAAA-MM-DD/livros.jsonl | wc -l
docker compose exec minio mc cat local/bronze/ptax/moeda=GBP/data=AAAA-MM-DD/cotacoes.jsonl
docker compose exec minio mc ls local/raw/manifestos/data=AAAA-MM-DD/
```

Os nomes `src.coletar` e `src.extrair` são os sugeridos no prompt; se o `plan.md` do grupo definir outros, use os do plano. A coleta completa (cerca de 18 minutos) só roda depois da coleta com duas categorias verificada e com autorização no agente.

Metadados de um objeto (o `mc stat` da imagem não exibiu os metadados de usuário; use o `boto3`):

```bash
python - <<'EOF'
import os, boto3
from dotenv import load_dotenv
load_dotenv()
s3 = boto3.client("s3", endpoint_url=os.environ["S3_ENDPOINT_URL"],
                  aws_access_key_id=os.environ["S3_ACCESS_KEY"],
                  aws_secret_access_key=os.environ["S3_SECRET_KEY"],
                  region_name=os.environ["S3_REGION"])
k = "books_toscrape/data=AAAA-MM-DD/categoria=mystery_3/pagina=001.html"
h = s3.head_object(Bucket="raw", Key=k)
print(h["ContentType"], h["Metadata"])
EOF
```

Checklist:

- [ ] número de linhas do `livros.jsonl` igual ao total que a página inicial declara e ao número de `detalhe.html`
- [ ] todo registro com `upc` preenchido e `qtd_estoque` inteiro
- [ ] resposta PTAX com ao menos um boletim `Fechamento` na janela
- [ ] metadados com `fonte-url`, `coletado-em`, `sha256` (somente ASCII; o `boto3` recusa acentos)
- [ ] reexecução no mesmo dia: mesma contagem de páginas e um manifesto a mais
- [ ] `git status --short` não lista `.env` nem `.env.railway`

## 9. Etapa 17 · Validação

`docs/atam.md` com os sete cenários obrigatórios (site muda o HTML, PTAX sem cotação na data, 429 ou timeout, reexecução no mesmo dia, configuração agressiva, custo das 1.000 páginas de detalhe, 502 do Railway), cada um com as seis partes e evidência. `docs/rastreabilidade.md` com a cadeia P, DN, OBJ, RN, RF, RNF, ADR, tarefa, teste e evidência, derivada dos arquivos. A cobertura, se medida, vem do comando (`pytest --cov=src`, com `pytest-cov` justificado no `plan.md`).

## 10. Etapa 18 · MinIO no Railway

```bash
cp .env .env.railway
git check-ignore .env.railway    # deve imprimir: .env.railway
railway service                  # selecione o serviço minio
railway variable list            # consulte MINIO_ROOT_USER e MINIO_ROOT_PASSWORD
```

No `.env.railway`: `S3_ENDPOINT_URL=https://<dominio-gerado-pelo-railway>` (o domínio da porta 9000 criado na Aula 01), `S3_ACCESS_KEY` e `S3_SECRET_KEY` com os valores do serviço.

Os buckets `raw` e `bronze` já existem no Railway desde a Aula 01. Para conferir, use o `mc` do contêiner local (ele pede as chaves de forma interativa, sem deixá-las no histórico do shell):

```bash
docker compose exec minio mc alias set railway https://<dominio-gerado-pelo-railway>
docker compose exec minio mc mb --ignore-existing railway/raw railway/bronze
```

Coleta e extração com `.env.railway`:

```bash
set -a; source .env.railway; set +a
SCRAPER_CATEGORIAS=mystery_3,poetry_23 python -m src.coletar --data AAAA-MM-DD
python -m src.extrair --data AAAA-MM-DD
docker compose exec minio mc ls --recursive railway/raw/books_toscrape/ | wc -l
docker compose exec minio mc cat railway/bronze/books_toscrape/data=AAAA-MM-DD/livros.jsonl | wc -l
```

O proxy do Railway pode devolver 502. Procure no manifesto gravações com mais de uma tentativa.

## 11. Entregável

Pasta `aula_03_api_scraping/` no repositório do grupo com:

- `AGENTS.md`;
- `docs/`: `prompts.md`, `00_persona.md`, `01_objetivos_negocio.md`, `02_regras_de_negocio.md`, `modelagem/`, `arquitetura.md`, sete ADRs (entre elas `adr/ADR-001-coleta-e-extracao-separadas.md`), `atam.md` e `rastreabilidade.md`;
- `specs/`: `01_requisitos_funcionais.md`, `02_requisitos_nao_funcionais.md`, `03_modelo_de_dados.md`, `modelo.dbml`, `plan.md` e `tasks.md`;
- `features/` com os cenários Gherkin;
- `src/` com coletores e extrator rodando e `tests/` passando;
- objetos de pelo menos uma data no MinIO do Railway em `raw/books_toscrape/`, `raw/ptax/`, `raw/manifestos/`, `bronze/books_toscrape/` e `bronze/ptax/`.

## 12. Encerrar

```bash
docker compose down          # mantém o volume com os dados locais
docker compose down -v       # apaga também o volume local
```
