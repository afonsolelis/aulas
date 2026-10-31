# AGENTS.md · aula_03_api_scraping

Regras para o agente de código nesta pasta, qualquer que seja o agente escolhido (Claude Code, Codex CLI, OpenCode ou outro). Leia este arquivo antes de qualquer etapa.

## Escopo

- Projeto: monitor de preços de livros. Scraping de https://books.toscrape.com e cotação GBP para BRL pela API PTAX do Banco Central (https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata), com gravação direta no MinIO.
- Trabalhe somente dentro de `aula_03_api_scraping/`.
- Uma etapa por vez. Mostre o plano antes de editar e pare ao fim da etapa.

## Sequência das etapas

| Etapa | Artefato |
|---|---|
| 00 | preparação; `docs/prompts.md` |
| 01 | `docs/00_persona.md` |
| 02 | `docs/01_objetivos_negocio.md` (direcionadores e objetivos) |
| 03 | `docs/02_regras_de_negocio.md` |
| 04 | `specs/01_requisitos_funcionais.md` |
| 05 | `specs/02_requisitos_nao_funcionais.md` |
| 06 | `specs/03_modelo_de_dados.md` e `specs/modelo.dbml` |
| 07 | `docs/modelagem/estatica/componentes.md` e `classes.md` |
| 08 | `docs/modelagem/dinamica/RF-xx.md` e `estados_item.md` |
| 09 | `docs/arquitetura.md` e `docs/adr/ADR-001` a `ADR-007` |
| 10 | `specs/plan.md` e `specs/tasks.md` |
| 11 | `tests/fixtures/`, `features/*.feature`, testes vermelhos |
| 12 a 15 | `src/` e `tests/`, uma tarefa de `specs/tasks.md` por vez |
| 16 | execução local e verificação |
| 17 | `docs/atam.md` e `docs/rastreabilidade.md` |
| 18 | execução contra o MinIO do Railway |

Não pule etapa: cada uma lê os artefatos das anteriores.

## Registro de prompts

Ao fim de cada etapa, acrescente em `docs/prompts.md` uma seção com: número e nome da etapa, data, o prompt recebido copiado literalmente (sem corrigir digitação) e a lista de arquivos criados ou alterados. Nunca registre segredos; se o prompt contiver um, pare e avise.

## Fontes de verdade

- Precedência, da mais forte para a mais fraca: requisitos (`specs/01_requisitos_funcionais.md`, `specs/02_requisitos_nao_funcionais.md`) > modelo de dados (`specs/03_modelo_de_dados.md`) > modelagem (`docs/modelagem/`) > ADR (`docs/adr/`) > `specs/plan.md` > `specs/tasks.md`.
- `docs/00_persona.md`, `docs/01_objetivos_negocio.md` e `docs/02_regras_de_negocio.md` são a origem dos requisitos.
- `docker-compose.yml`, `.env.example` e `requirements.txt` desta pasta.
- Se dois documentos se contradisserem, pare e pergunte.

## Regras de conteúdo

- Não invente números, SLAs, volumes ou limites. Valor sem origem recebe a marcação "hipótese — validação pendente".
- Separe fato, lacuna e suposição.
- Preserve os IDs existentes: P1, DN-01, OBJ-01, RN-01, RF-01, RNF-01, T-01, ADR-001.
- Toda escolha técnica aponta para um RF ou RNF.
- Os campos do bronze são contrato com as Aulas 04 e 05: não renomeie nem traduza.
- Mermaid sem ponto e vírgula em rótulos e mensagens (quebra a renderização). Valide cada bloco antes de terminar.
- Toda ADR nasce com status "Proposta". Aceitar é decisão do grupo.
- Matrizes de rastreabilidade são derivadas dos arquivos, não digitadas de memória.

## Regras de coleta

- Toda requisição HTTP tem timeout explícito.
- Requisições ao books.toscrape.com usam o `USER_AGENT` do `.env`, respeitam `SCRAPER_INTERVALO_SEGUNDOS` e nunca rodam em paralelo.
- Consulte `robots.txt` em cada execução e registre o resultado.
- Retry apenas para timeout, erro de conexão, 408, 429 e 5xx, com backoff exponencial, jitter, respeito a `Retry-After` e limite de `HTTP_MAX_TENTATIVAS`.
- O HTML é tratado como bytes: o parser recebe `response.content` e o MinIO recebe os bytes originais.
- O bruto é gravado antes de qualquer extração. A extração lê do MinIO, não da rede.

## Segredos

- Credenciais só no `.env` (ou `.env.railway`), que não são versionados.
- Nunca escreva segredos em código, testes, logs, manifestos, metadados de objeto, prompts, `docs/prompts.md` ou commits.
- Não leia nem imprima o conteúdo do `.env`. Use os nomes das variáveis.

## Comandos permitidos

- `python`, `pytest`, `pip install -r requirements.txt`
- `docker compose up -d --wait`, `docker compose ps`, `docker compose logs minio`, `docker compose exec minio mc ...` (somente leitura e criação de buckets)
- `curl -sI` para inspecionar cabeçalhos das fontes; `curl -s -A "$USER_AGENT"` para baixar as fixtures da Etapa 11, com pausa entre as chamadas
- `git status`, `git diff`

Peça autorização antes de: apagar objetos ou buckets, rodar a coleta completa contra o site, apontar para o MinIO do Railway, instalar pacotes fora do `requirements.txt`, fazer commit ou push.

## Gates

- Testes são escritos antes do código (Etapa 11) e falham por falta de implementação, não por erro no teste.
- Não altere um teste para fazê-lo passar. Se o teste estiver errado, pare e explique.
- Testes unitários não acessam a rede; usam fixtures em `tests/fixtures/`.
- Testes de gravação usam o MinIO local e o bucket `BUCKET_TESTE` (`teste`), nunca `raw`, `bronze` ou o Railway.
- Uma tarefa só é marcada como concluída em `specs/tasks.md` com o teste passando e o comando de verificação anotado.
