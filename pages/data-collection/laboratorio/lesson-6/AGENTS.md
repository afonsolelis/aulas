# AGENTS.md (modelo para aula_06_streaming_iot/)

Copie este arquivo para a raiz de `aula_06_streaming_iot/` no repositório do grupo e ajuste o que estiver entre `<>`.

## Escopo

- Projeto: pipeline de streaming de sensores IoT simulados (temperatura e umidade de estufas e salas). Três processos Python: simulador (publica no RabbitMQ), transformador (valida, normaliza, enriquece, separa inválidos para a DLQ) e armazenador (insere em lote no ClickHouse).
- Trabalhe somente dentro de `aula_06_streaming_iot/`. Não edite arquivos de outras aulas.
- Fontes de verdade, nesta ordem: `docs/00_persona.md`, `docs/01_objetivos_negocio.md`, `specs/spec.md`, `specs/plan.md`, `specs/tasks.md`.
- Preserve os identificadores `P-xx`, `OBJ-xx`, `RF-xx`, `RNF-xx`, `T-xx` e `ADR-xxx`. Não renumere.
- A tabela do ClickHouse está em `sql/001_criar_tabelas.sql`. Mudanças nela exigem ADR.

## Regras de trabalho

- Mostre o plano de alteração antes de editar arquivos.
- Execute uma etapa (ou uma tarefa `T-xx`) por vez e pare ao final, aguardando revisão humana.
- Não invente números, SLAs ou limites. Quando faltar um valor, escreva "hipótese, validação pendente".
- Separe fato, lacuna e suposição em toda análise.
- Toda tarefa de código vem acompanhada de teste em `tests/` e só termina com `pytest` passando.
- Lógica de validação, normalização e montagem de lote fica em funções puras, testáveis sem RabbitMQ nem ClickHouse.
- Consumidores usam ack manual. Nunca use `auto_ack=True` nas filas de leituras.
- Toda escrita no ClickHouse é em lote e idempotente: o mesmo lote reenviado usa o mesmo `insert_deduplication_token`.

## Comandos permitidos

- `python -m pytest -q`
- `python -m src.simulador`, `python -m src.transformador`, `python -m src.armazenador`
- `docker compose up -d`, `docker compose ps`, `docker compose logs <serviço>`, `docker compose stop <serviço>`, `docker compose start <serviço>`
- `docker compose exec rabbitmq rabbitmqctl list_queues ...` e `list_exchanges`, `list_bindings` (somente leitura)
- `docker compose exec clickhouse clickhouse-client ...` apenas com `SELECT`, `SHOW`, `DESCRIBE`

Peça autorização antes de: instalar pacotes fora do `requirements.txt`, apagar filas ou exchanges, rodar `TRUNCATE`, `DROP` ou `docker compose down -v`, alterar a DDL, qualquer comando `railway`.

## Segredos

- Credenciais vêm de variáveis de ambiente (`AMQP_URL`, `CLICKHOUSE_PASSWORD` etc.). Nunca escreva valores reais em código, testes, documentação ou mensagens de commit.
- `.env` e `.env.*` (exceto `.env.example`) estão no `.gitignore`. Se uma senha aparecer no diff, pare e avise.

## Gates

1. `python -m pytest -q` sem falhas.
2. Com o pipeline rodando, `rabbitmqctl list_queues` mostra a fila de válidas sem crescimento contínuo e a DLQ recebendo só as leituras inválidas.
3. Encerrar o armazenador no meio de um lote não perde leituras: as mensagens sem ack voltam para a fila.
4. Reenviar um lote com o mesmo token não altera `SELECT count() FROM iot.leituras`.
5. Nenhum segredo em `git diff --staged`.
