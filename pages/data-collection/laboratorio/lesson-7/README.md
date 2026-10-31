# Aula 07 · Laboratório de validação com Pydantic e testes integrados

Data Collection and Storage · Inteli · 28/11/2026 · 8h30 – 12h10

Material completo: `../../materials/lesson-7-material.html`
Slides: `../../slides/slide-lesson-7.html`

Este roteiro resume a prática. Os prompts CREATE completos, os quadros "Revise antes de seguir" e as explicações estão no material (seções 11 a 15).

## O que fica nesta pasta

| Arquivo | Para que serve |
|---|---|
| `README.md` | este roteiro |
| `AGENTS.md` | modelo de regras para o agente de código na pasta `aula_07_validacao_testes/` |
| `requirements-dev.txt` | dependências de validação e teste, com versões testadas em 03/10/2026 |
| `exemplo/` | referência mínima: contrato da leitura IoT da Aula 06 (`LeituraBruta` e `LeituraNormalizada`), testes de unidade e um teste com Testcontainers subindo o MinIO |

O `exemplo/` mostra o mecanismo. Ele não é a solução do projeto: os contratos de livro, PTAX e sensor do grupo nascem ao vivo pelos prompts, a partir do código que o grupo escreveu nas Aulas 03 e 06.

## Pré-requisitos

- Codespace aberto no repositório do grupo (a imagem universal traz Docker e Python 3).
- Pastas das Aulas 03 (scraping de books.toscrape.com + PTAX, com `bronze/books_toscrape/` e `bronze/ptax/` no MinIO) e 06 (sensores → RabbitMQ → transformador → ClickHouse) no repositório.
- `.env` com `S3_ENDPOINT_URL`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` e `S3_REGION=us-east-1`, como nas Aulas 02 a 04.
- Agente de código de sua preferência (Claude Code, Codex CLI, Gemini CLI, OpenCode, Cursor ou Copilot) lendo o `AGENTS.md`. No Claude Code, crie antes um `CLAUDE.md` que importe as regras: `echo "@AGENTS.md" > CLAUDE.md`. Outros agentes leem o `AGENTS.md` diretamente ou aceitam o arquivo colado no contexto.
- Trabalhe um prompt por vez e revise antes do próximo.

## Passo 0 · Conferir o Docker

```bash
docker version --format '{{.Server.Version}}'
docker run --rm hello-world
```

Se o segundo comando falhar, os testes de integração serão pulados. Resolva antes de seguir (seção 9.5 do material).

## Passo 1 · Criar a pasta da aula no repositório do grupo

```bash
cd /workspaces/<repositorio-do-grupo>
mkdir -p aula_07_validacao_testes/{docs/adr,docs/contratos,specs,src,tests/unit,tests/contract,tests/integration}
LAB=<caminho>/aulas/pages/data-collection/laboratorio/lesson-7
cp $LAB/requirements-dev.txt $LAB/AGENTS.md aula_07_validacao_testes/
cd aula_07_validacao_testes
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements-dev.txt
python -c "import pydantic, testcontainers, vcr; print(pydantic.VERSION)"
```

Se o repositório `aulas` não estiver clonado no Codespace, baixe o arquivo pela interface do GitHub ou copie o conteúdo da tabela de dependências da seção 11 do material.

Acrescente ao `.gitignore` do repositório: `.venv/`, `.env`, `.pytest_cache/`, `__pycache__/`.

## Passo 2 · Rodar o exemplo de referência (opcional, 5 minutos)

```bash
cp -r $LAB/exemplo /tmp/exemplo_aula07
cd /tmp/exemplo_aula07
pytest -m "not integracao" -q   # unidade: sem Docker, sem rede
pytest -q --durations=5         # inclui o MinIO em contêiner
```

Resultado registrado pelo professor em 03/10/2026 (Python 3.12, Docker 29, imagem já baixada): 10 testes passaram em 1,86 s; a subida do MinIO consumiu 1,59 s; os 9 testes de unidade levaram 0,11 s. Sem Docker, o teste de integração aparece como `SKIPPED` com o motivo "Docker indisponível neste ambiente". No primeiro uso, o download da imagem soma tempo.

## Passo 3 · Sequência SDD (prompts no material, seção 12)

| Prompt | Artefato | Gate |
|---|---|---|
| 1. Persona | `docs/00_persona.md` | quem sofre com dado inválido e que decisão fica errada |
| 2. Objetivos | `docs/01_objetivos_negocio.md` | métricas de qualidade com origem ou marcadas como hipótese |
| 3. Especificação | `specs/spec.md` | RF/RNF com Dado/Quando/Então; RNF de validade, rastreabilidade e cobertura |
| 4. Plano | `specs/plan.md` | C4 em Mermaid; onde cada validação entra; pirâmide de testes |
| 5. Tarefas | `specs/tasks.md` | cada tarefa ligada a RF/RNF e a um teste |
| 6. Implementação | `src/`, `tests/` | teste vermelho, código, teste verde; uma tarefa por vez |
| 7. ATAM | `docs/atam.md`, `docs/adr/` | seis cenários da aula, matriz requisito → decisão → componente → evidência |

## Passo 4 · Comandos de teste usados na prática

```bash
pytest tests/unit -q                                  # segundos, sem rede nem Docker
pytest tests/contract --record-mode=once -q           # grava cassetes na primeira execução
pytest tests/contract --block-network -q              # reproduz cassetes; rede bloqueada
pytest tests/integration -m integracao -q --durations=10
pytest -q                                             # suíte inteira antes do commit
```

O `pytest-recording` usa o modo `none` por padrão: sem cassete gravado, o teste falha com `CannotOverwriteExistingCassetteException` em vez de chamar a rede.

## Passo 5 · Entregável

Pasta `aula_07_validacao_testes/` no repositório do grupo com:

- esqueleto SDD completo (`AGENTS.md`, `docs/`, `specs/`, `src/`, `tests/`);
- contratos Pydantic de livro, cotação PTAX e leitura de sensor, com o JSON Schema publicado em `docs/contratos/`;
- quarentena no MinIO (prefixo `quarantine/`) e DLQ no RabbitMQ;
- suíte verde (`pytest -q`), com cassetes sem segredos;
- `docs/relatorio_rejeicoes.md` gerado a partir da quarentena e da DLQ;
- `docs/atam.md` com os seis cenários da aula e ADRs.

## Segredos

Credenciais do MinIO, do RabbitMQ, do ClickHouse e qualquer chave de API do agente ficam em `.env` ou no campo seguro do próprio agente, fora do Git. Antes de cada commit, procure nos cassetes:

```bash
grep -RniE "authorization|password|secret|token|api[_-]?key" tests/cassettes || echo "nenhum segredo aparente"
```
