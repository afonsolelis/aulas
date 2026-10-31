# AGENTS.md · aula_07_validacao_testes

Regras para o agente de código nesta pasta, qualquer que seja o agente escolhido pelo grupo (Claude Code, Codex CLI, OpenCode ou outro). Copie para `aula_07_validacao_testes/AGENTS.md` no repositório do grupo e ajuste os nomes de pasta se forem diferentes.

## Escopo

- Trabalhe somente dentro de `aula_07_validacao_testes/`.
- Leia, sem editar, as pastas das Aulas 03 (`aula_03_api_scraping/`) e 06 (`aula_06_streaming_iot/` ou o nome usado pelo grupo). Elas são fonte de verdade dos campos que os contratos validam.
- Quando precisar de código dessas aulas, copie para `src/pipelines/` e registre em `docs/adr/` de qual arquivo e de qual commit veio.

## Fontes de verdade, nesta ordem

1. `specs/spec.md` (RF/RNF com critérios de aceite)
2. `specs/plan.md` e `specs/tasks.md`
3. `docs/00_persona.md`, `docs/01_objetivos_negocio.md`, `docs/atam.md`
4. Código e docs das Aulas 03 e 06

## Regras fixas

- Não invente números, limites, SLAs ou campos. Valor sem origem entra como "hipótese, validação pendente".
- Separe fato, lacuna e suposição.
- Preserve os IDs RF-xx, RNF-xx, T-xx e ADR-xxx.
- Mostre o plano e o diff antes de editar. Pare ao fim de cada etapa e aguarde revisão.
- Uma tarefa de `specs/tasks.md` por vez: teste primeiro, depois código.

## Stack desta pasta

- Pydantic v2 (`BaseModel`, `Field`, `Annotated`, `field_validator`, `model_validator`, `ConfigDict`, `TypeAdapter`, `model_json_schema`). Não use a API v1 (`validator`, `root_validator`, `parse_obj`, `.dict()`).
- pytest, vcrpy e pytest-recording para HTTP; cassetes em `tests/contract/cassettes/`.
- testcontainers-python 4.15.0, importado de `testcontainers.community.<modulo>`.
- Imagens com tag fixa, as mesmas do `docker-compose.yml` da Aula 06: MinIO `coollabsio/minio:RELEASE.2025-10-15T17-29-55Z`, RabbitMQ `rabbitmq:4.3.6-management`, ClickHouse `clickhouse/clickhouse-server:26.8.15.10`.
- Conexão com o MinIO no código Python pelas variáveis `S3_ENDPOINT_URL`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` e `S3_REGION=us-east-1` (padrão das Aulas 02 a 04).
- Topologia RabbitMQ da Aula 06: exchange topic `iot.leituras`, exchange fanout `iot.dlx`, filas quorum `leituras.brutas`, `leituras.validas` e `leituras.dlq`. Leitura recusada vai para `iot.dlx` com cabeçalho `x-motivo` e para `iot.leituras_rejeitadas` no ClickHouse.
- Contratos e campos de origem:
  - Livro: linha de `bronze/books_toscrape/data=AAAA-MM-DD/livros.jsonl` (`upc`, `url`, `titulo`, `categoria`, `avaliacao`, `preco_gbp`, `em_estoque`, `qtd_estoque`, `coletado_em`).
  - CotacaoPtax: linha de `bronze/ptax/moeda=GBP/data=AAAA-MM-DD/cotacoes.jsonl` (`moeda`, `dataHoraCotacao`, `tipoBoletim`, `cotacaoCompra`, `cotacaoVenda`).
  - LeituraBruta: mensagem da Aula 06 (`event_id`, `device_id`, `medido_em`, `temperatura`, `unidade_temperatura` em C ou F, `umidade`); LeituraNormalizada com as colunas de `iot.leituras` (`temperatura_c`, `umidade_pct`, `local`, `tipo_local`).
- Códigos de motivo da Aula 06: `json_invalido`, `campo_ausente`, `unidade_desconhecida`, `umidade_fora_da_faixa`, `temperatura_fora_da_faixa`, `sensor_desconhecido`, `medido_em_no_futuro`.
- Regras que dependem do relógio recebem o instante pelo contexto de validação; testes fixam o instante.

## Comandos permitidos

```bash
python -m pip install -r requirements-dev.txt
pytest tests/unit -q --block-network
pytest tests/contract -q --block-network
pytest tests/contract -q --record-mode=once      # só para gravar cassete novo, com aviso
pytest tests/integration -m integracao -q --durations=10
docker ps
```

Não execute `git push`, `docker system prune`, `rm -rf` fora de `.pytest_cache/` ou comandos que alterem o MinIO e o ClickHouse publicados no Railway.

## Segredos

- Credenciais vêm de variáveis de ambiente ou de `.env` (no `.gitignore`). Nunca em código, teste, cassete, log ou commit.
- Todo `vcr_config` filtra `authorization`, `cookie` e `set-cookie`.
- Antes de propor commit, rode: `grep -RniE "authorization|password|secret|token|api[_-]?key" tests/cassettes`.

## Gates antes de declarar uma tarefa pronta

1. O teste da tarefa falhou antes da implementação e passa depois.
2. `pytest tests/unit -q --block-network` verde.
3. Se a tarefa toca integração: `pytest tests/integration -m integracao -q` verde com Docker disponível.
4. `specs/tasks.md` atualizado com o comando executado e o resultado.
