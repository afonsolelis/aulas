# Laboratório da Aula 06: streaming de sensores IoT com RabbitMQ e ClickHouse

Data Collection and Storage, Inteli. Aula de 14/11/2026, 8h30 às 12h10.

Este roteiro acompanha o material da aula (`../../materials/lesson-6-material.html`). O material explica os conceitos e traz os sete prompts CREATE completos; aqui ficam os comandos, na ordem em que são executados.

O código dos três processos (simulador, transformador e armazenador) não está nesta pasta. Ele nasce durante a aula, pelos prompts, dentro do repositório do grupo.

## Arquivos de apoio

| Arquivo | Para que serve |
|---|---|
| `docker-compose.yml` | RabbitMQ (`rabbitmq:4.3.6-management`) e ClickHouse (`clickhouse/clickhouse-server:26.8.15.10`) locais, com healthcheck e volumes |
| `sql/001_criar_tabelas.sql` | DDL do banco `iot`: `leituras` (ReplacingMergeTree, partição mensal, TTL, janela de deduplicação) e `leituras_rejeitadas` |
| `consultas_analiticas.sql` | Consultas de referência: média por janela, último valor por sensor, sensores silenciosos, latência, partes |
| `scripts/aplicar_ddl.py` | Aplica a DDL por HTTP(S), uma instrução por requisição (usado no Railway) |
| `.env.example` | Variáveis do RabbitMQ, do ClickHouse, do lote e do simulador |
| `requirements.txt` | `pika`, `clickhouse-connect`, `python-dotenv`, `pytest` |
| `Dockerfile` | Imagem única dos processos Python; o processo é escolhido pela variável `PROCESSO` |
| `AGENTS.md` | Regras para o agente de código: escopo, comandos permitidos, segredos, gates |
| `.gitignore` | Impede que `.env`, `.venv/` e caches entrem no Git |

Validação feita no preparo da aula: `docker compose config` sem erros; os dois serviços sobem `healthy`; `rabbitmq-diagnostics -q ping` responde `Ping succeeded`; `curl http://localhost:8123/ping` responde `Ok.`; a DDL é aplicada pelo `docker-entrypoint-initdb.d`; o mesmo lote inserido duas vezes com o mesmo `insert_deduplication_token` resulta em uma única cópia; uma mensagem rejeitada com `basic_nack(requeue=False)` chega à DLQ com o cabeçalho `x-death`; as oito consultas de `consultas_analiticas.sql` executam; `scripts/aplicar_ddl.py` roda duas vezes sem erro; o `Dockerfile` constrói e falha com mensagem clara se `PROCESSO` não for definido.

## Pré-requisitos (feitos na Aula 01)

- Codespace aberto no repositório do grupo.
- Agente de código de sua preferência (Claude Code, Codex CLI, Gemini CLI, OpenCode, Cursor ou Copilot) lendo o `AGENTS.md`.
- Railway CLI instalada e autenticada (`railway login --browserless`).

Rode um prompt por vez e revise antes do próximo. Nenhuma chave de API entra no Git.

## Etapa 1. Criar a pasta da aula no repositório do grupo

```bash
cd /workspaces/<repositorio-do-grupo>
mkdir -p aula_06_streaming_iot/{docs/adr,specs,src,tests,sql,scripts}
cd aula_06_streaming_iot

BASE=https://raw.githubusercontent.com/afonsolelis/aulas/main/pages/data-collection/laboratorio/lesson-6
for f in docker-compose.yml .env.example requirements.txt AGENTS.md .gitignore Dockerfile \
         consultas_analiticas.sql sql/001_criar_tabelas.sql scripts/aplicar_ddl.py; do
  curl -fsSL "$BASE/$f" -o "$f"
done
touch src/__init__.py
find . -type f | sort
```

Gate: os nove arquivos aparecem na listagem, mais `src/__init__.py`.

## Etapa 2. Subir RabbitMQ e ClickHouse locais

As senhas são hexadecimais de propósito: `+` e `/`, comuns em base64, quebram a URL AMQP.

```bash
cp .env.example .env
RABBIT=$(openssl rand -hex 16)
CH=$(openssl rand -hex 16)
sed -i "s|^RABBITMQ_PASSWORD=.*|RABBITMQ_PASSWORD=$RABBIT|; \
        s|^AMQP_URL=.*|AMQP_URL=amqp://iot:$RABBIT@localhost:5672/%2F|; \
        s|^CLICKHOUSE_PASSWORD=.*|CLICKHOUSE_PASSWORD=$CH|" .env
unset RABBIT CH

docker compose config -q && echo "compose ok"
docker compose up -d --wait
docker compose ps
```

Gates:

```bash
docker compose exec rabbitmq rabbitmq-diagnostics -q ping      # Ping succeeded
curl -s http://localhost:8123/ping                              # Ok.
set -a; source .env; set +a
docker compose exec clickhouse clickhouse-client --user iot --password "$CLICKHOUSE_PASSWORD" -q "SHOW TABLES FROM iot"
git status --short | grep -c '\.env$'                           # 0
```

O console do RabbitMQ fica na porta 15672 (usuário `iot`, senha do `.env`). No Codespace, abra pela aba PORTS.

A porta nativa 9000 do ClickHouse não é publicada no host porque o MinIO das Aulas 02 a 04 usa a mesma porta. O `clickhouse-client` roda dentro do contêiner, como acima.

## Etapa 3. Ambiente Python

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -c "import pika, clickhouse_connect; print(pika.__version__, clickhouse_connect.__version__)"
```

## Etapa 4. Prompts 1 a 5 (persona, objetivos, spec, plano, tarefas)

Abra o agente de código em um terminal dentro de `aula_06_streaming_iot/` e mantenha um segundo terminal para os comandos. No Claude Code, crie antes um `CLAUDE.md` que importe as regras: `echo "@AGENTS.md" > CLAUDE.md`. Outros agentes leem o `AGENTS.md` diretamente ou aceitam o arquivo colado no contexto.

```bash
claude            # ou o agente que você usa
```

Cole os prompts 1 a 5 do material, um por vez. Depois de cada um, responda o quadro "Revise antes de seguir" antes de colar o próximo. Ao final:

```bash
ls docs specs
grep -c '^### RF-' specs/spec.md
grep -c '^### RNF-' specs/spec.md
grep -c '^### T-' specs/tasks.md
```

## Etapa 5. Prompt 6: implementação tarefa a tarefa

Cole o prompt 6 uma vez para cada tarefa `T-xx`, na ordem de `specs/tasks.md`. A cada tarefa:

```bash
python -m pytest -q
git add -A && git status --short
git commit -m "aula06: T-xx <resumo>"
```

Quando os três processos existirem, rode cada um em um terminal:

```bash
# terminal A
source .venv/bin/activate && python -m src.armazenador
# terminal B
source .venv/bin/activate && python -m src.transformador
# terminal C
source .venv/bin/activate && python -m src.simulador
```

Gates do pipeline local:

```bash
docker compose exec rabbitmq rabbitmqctl list_exchanges name type
docker compose exec rabbitmq rabbitmqctl list_bindings source_name destination_name routing_key
docker compose exec rabbitmq rabbitmqctl list_queues name type messages_ready messages_unacknowledged consumers
docker compose exec clickhouse clickhouse-client --user iot --password "$CLICKHOUSE_PASSWORD" \
  -q "SELECT count(), uniqExact(device_id), max(medido_em) FROM iot.leituras"
docker compose exec -T clickhouse clickhouse-client --user iot --password "$CLICKHOUSE_PASSWORD" \
  --multiquery < consultas_analiticas.sql
```

- `leituras.validas` não cresce sem parar enquanto o armazenador roda.
- `leituras.dlq` recebe mensagens e cada uma tem motivo identificável.
- `count()` cresce a cada lote; `uniqExact(device_id)` bate com `SENSORES` do `.env`.

## Etapa 6. Provocar as falhas dos cenários ATAM

Cada experimento vira evidência em `docs/atam.md` (comando, saída, horário).

1. Consumidor cai com mensagens sem ack: com o simulador rodando, encerre o armazenador com Ctrl+C antes de um lote fechar. Rode `list_queues` e observe `messages_ready` subir. Suba o armazenador de novo e confirme que a fila esvazia e que `count()` no ClickHouse não perdeu leituras.
2. ClickHouse indisponível: `docker compose stop clickhouse`. Observe o armazenador tentar de novo com espera crescente e a fila acumular. `docker compose start clickhouse` e confirme a drenagem.
3. Mensagem malformada: no console do RabbitMQ (Exchanges, `iot.leituras`, Publish message), publique com routing key `leitura.bruta.estufa.sensor-x` o corpo `{"device_id": 1, "temperatura": "quente"}`. Confirme que ela vai para `leituras.dlq` e que o transformador continua consumindo.
4. Reenvio do mesmo lote: rode o teste do armazenador que reenvia um lote com o mesmo token e confira `SELECT count() FROM iot.leituras` antes e depois.
5. Pico de sensores: pare o transformador, rode o simulador com `SENSORES=200` por um minuto, religue o transformador e meça quanto tempo a fila leva para esvaziar.

## Etapa 7. Publicar no Railway

Crie um projeto novo para esta aula. O plano de teste permite até 5 serviços por projeto, e a arquitetura completa usa exatamente 5: `rabbitmq`, `clickhouse`, `simulador`, `transformador`, `armazenador`. O material discute a alternativa de juntar transformador e armazenador.

```bash
railway init            # nome sugerido: aula06-streaming-iot
```

RabbitMQ (rede privada para AMQP, domínio público só para o console):

```bash
railway add --service rabbitmq --image rabbitmq:4.3.6-management \
  --variables "RABBITMQ_DEFAULT_USER=iot" \
  --variables "RABBITMQ_NODENAME=rabbit@localhost"
SENHA_RABBIT="$(openssl rand -hex 24)"
printf '%s' "$SENHA_RABBIT" | railway variable set RABBITMQ_DEFAULT_PASS --stdin --service rabbitmq --skip-deploys
railway volume add --service rabbitmq --mount-path /var/lib/rabbitmq
railway domain --service rabbitmq --port 15672
railway redeploy --service rabbitmq --yes
```

`RABBITMQ_NODENAME=rabbit@localhost` fixa o nome do nó. O RabbitMQ guarda os dados numa pasta com o nome do nó, e sem isso uma troca de hostname entre deploys pode fazer o nó ignorar o volume. Confirme no gate desta etapa que a fila sobrevive a um `railway redeploy`.

ClickHouse (domínio público HTTPS para a porta 8123):

```bash
railway add --service clickhouse --image clickhouse/clickhouse-server:26.8.15.10 \
  --variables "CLICKHOUSE_DB=iot" \
  --variables "CLICKHOUSE_USER=iot" \
  --variables "CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1"
SENHA_CH="$(openssl rand -hex 24)"
printf '%s' "$SENHA_CH" | railway variable set CLICKHOUSE_PASSWORD --stdin --service clickhouse --skip-deploys
railway volume add --service clickhouse --mount-path /var/lib/clickhouse
railway domain --service clickhouse --port 8123
railway redeploy --service clickhouse --yes
```

O domínio gerado atende em HTTPS na porta 443. A porta 8123 não é publicada para fora; o cliente usa `port=443` e `secure=True`.

Aplicar a DDL pelo HTTPS e testar:

```bash
export CLICKHOUSE_HOST=<dominio-do-clickhouse>.up.railway.app CLICKHOUSE_PORT=443 \
       CLICKHOUSE_SECURE=true CLICKHOUSE_USER=iot CLICKHOUSE_PASSWORD="$SENHA_CH"
curl -s "https://$CLICKHOUSE_HOST/ping"
python scripts/aplicar_ddl.py
```

Os três processos usam a mesma imagem (o `Dockerfile` desta pasta) e a rede privada do Railway. As referências `${{servico.VARIAVEL}}` são resolvidas pelo Railway; mantenha as aspas simples.

```bash
for p in simulador transformador armazenador; do
  railway add --service "$p" --variables "PROCESSO=$p"
  railway variable set --service "$p" --skip-deploys \
    'AMQP_URL=amqp://iot:${{rabbitmq.RABBITMQ_DEFAULT_PASS}}@rabbitmq.railway.internal:5672/%2F' \
    'CLICKHOUSE_HOST=clickhouse.railway.internal' 'CLICKHOUSE_PORT=8123' 'CLICKHOUSE_SECURE=false' \
    'CLICKHOUSE_USER=iot' 'CLICKHOUSE_PASSWORD=${{clickhouse.CLICKHOUSE_PASSWORD}}' 'CLICKHOUSE_DB=iot'
  railway up . --path-as-root --service "$p" --detach
done
unset SENHA_RABBIT SENHA_CH
railway logs --service transformador
```

Copie também para cada serviço as variáveis de topologia, lote e simulador que a spec definir (`EXCHANGE_LEITURAS`, `PREFETCH`, `LOTE_MAX_LINHAS` etc.).

Gates no Railway:

```bash
railway service status
railway logs --service armazenador --lines 50
python - <<'EOF'
import os, clickhouse_connect
c = clickhouse_connect.get_client(host=os.environ["CLICKHOUSE_HOST"], port=443, secure=True,
                                  username="iot", password=os.environ["CLICKHOUSE_PASSWORD"])
print(c.query("SELECT count(), uniqExact(device_id), max(medido_em) FROM iot.leituras").result_rows)
EOF
```

- Os cinco serviços aparecem ativos.
- `count()` cresce entre duas execuções da consulta.
- O console do RabbitMQ (domínio da porta 15672) mostra as filas com consumidores.
- Depois de `railway redeploy --service rabbitmq --yes`, as filas duráveis continuam existindo.

Se a conexão pela rede privada falhar, confira no painel o nome do serviço (o host interno é `<nome-do-serviço>.railway.internal`) e registre o problema e a solução em `docs/adr/`.

## Etapa 8. Prompt 7: validação ATAM

Cole o prompt 7 do material. Ele produz `docs/atam.md`, os ADRs e a matriz requisito, decisão, componente e evidência, usando as saídas das Etapas 5, 6 e 7.

## Encerramento

```bash
docker compose down        # mantém os volumes locais
# docker compose down -v   # apaga também os dados locais
```

No Railway, os volumes de contas trial são apagados 30 dias após o fim dos créditos. Exporte o que quiser guardar antes disso, por exemplo:

```bash
curl -s -u "iot:<senha>" "https://$CLICKHOUSE_HOST/" \
  --data-binary "SELECT * FROM iot.leituras FORMAT Parquet" -o leituras.parquet
```
