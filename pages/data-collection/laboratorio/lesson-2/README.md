# Laboratório da Aula 02: coleta dos lotes de telemetria no MinIO

Data Collection and Storage, Inteli. Aula de 17/10/2026, 8h30 às 12h10.

Este roteiro acompanha o material da aula (`../../materials/lesson-2-material.html`). O material traz a explicação e os sete prompts CREATE completos; aqui ficam os comandos, na ordem em que são executados.

O caso é o da teoria: uma transportadora fictícia recebe do provedor de rastreamento por satélite, para cada caminhão, um lote TXT a cada 15 minutos, com linhas do tacógrafo, do GPS e do rádio em cinco formatos misturados. O provedor deixa os lotes numa pasta SFTP e não guarda histórico. Na aula, a pasta `pouso/` faz o papel do SFTP, e o `gerar_lotes.py` faz o papel do provedor.

O que se constrói é um coletor que pega cada lote de `pouso/`, grava os bytes intactos no bucket `raw` do MinIO com a chave e os metadados do contrato, faz `HEAD` antes do `PUT`, registra a execução num manifesto JSON Lines e só apaga o arquivo do pouso depois de confirmar a gravação. É a alternativa "SFTP como pouso, bucket como destino" discutida no bloco 4.

O código do coletor não está nesta pasta. Ele nasce durante a aula, pelos prompts, dentro do repositório do grupo.

## Arquivos de apoio

| Arquivo | Para que serve |
|---|---|
| `docker-compose.yml` | MinIO local (imagem `ghcr.io/coollabsio/minio:RELEASE.2025-10-15T17-29-55Z`) e um serviço que cria o bucket `raw` |
| `gerar_lotes.py` | Simula o provedor: escreve os lotes TXT em `pouso/`. Só biblioteca padrão, determinístico |
| `.env.example` | Variáveis do MinIO local e do coletor; vira `.env` e `.env.railway` |
| `requirements.txt` | Dependências sugeridas: `boto3` e `pytest` |
| `AGENTS.md` | Regras para o agente de código de preferência do grupo: escopo, comandos permitidos, segredos, gates |
| `.gitignore` | Impede que `.env`, `.env.railway`, `.venv/` e `pouso/` entrem no Git |

O `docker-compose.yml`, o gerador e o fluxo completo (gerar, coletar, conferir chave, metadados e hash, coletar de novo) foram executados de ponta a ponta na preparação da aula, em 16/10/2026, com um coletor de referência do professor.

## Contrato dos dados

| Item | Valor |
|---|---|
| Arquivo no pouso | `pouso/CAM-XXXX_AAAAMMDDTHHMM.txt`, início da janela de 15 min no horário de Brasília |
| Conteúdo | UTF-8, fim de linha `\n`, 15 linhas de posição (uma por minuto) e eventos, em cinco formatos |
| Bucket | `raw` |
| Chave | `telemetria/data=AAAA-MM-DD/hora=HH/caminhao=CAM-XXXX/lote_HHMM.txt`, com data, hora e HHMM do início da janela convertidos para UTC |
| Bytes | gravados exatamente como estão no arquivo, sem reserializar nem trocar fim de linha |
| Metadados (`x-amz-meta-*`, ASCII) | `fonte=provedor-satelite`, `recebido-em` (UTC ISO), `versao-coletor`, `sha256`, `caminhao`, `janela-inicio` (UTC ISO), `arquivo-origem` |
| Idempotência | `HEAD` antes do `PUT`; chave existente com o mesmo `sha256` vira `ja_existia`; com `sha256` diferente vira `conflito_hash` e o arquivo fica no pouso |
| Pouso | o arquivo só é apagado depois de `PUT` confirmado ou de `ja_existia` com o mesmo `sha256` |
| Manifesto | `_manifestos/telemetria/data=AAAA-MM-DD/hora=HH/execucao_<AAAAMMDDTHHMMSSZ>.jsonl` (data e hora do início da execução, em UTC), uma linha por lote: `arquivo`, `chave`, `status` (`gravado`, `ja_existia`, `erro`, `conflito_hash`), `bytes`, `sha256`, `linhas`, `alertas` |

Os cinco formatos de linha:

```text
CAM-0412|17/10/26 09:14:03|-23.5481,-46.6390|VEL 087|TAC MOT 03h12          formato 1, cerca de 72% das linhas
#RADIO 09:14 MOTORISTA: parada posto km 214 BR-116                            formato 2, texto livre, só hora
CAM-0412 17-10-2026 09:15:03 GPS -23.5502 -46.6411 v=85                       formato 3, cerca de 20%; firmware novo acrescenta " TEMP_BAU 04.2"
ERR SAT SINAL FRACO                                                           formato 4, erro do enlace
TAC;CAM-0977;20261017T091500;DIRECAO CONTINUA 05:31;ALERTA                    formato 5, acima de 5h30 viola a Lei 13.103/2015
```

## Pré-requisitos (feitos na Aula 01)

- Codespace aberto no repositório do grupo.
- Um agente de código no terminal, o de preferência do grupo (Claude Code, Codex CLI, Gemini CLI, OpenCode ou outro).
- MinIO publicado no Railway, com domínio público para a porta 9000, usuário e senha guardados fora do Git.

Rode um prompt por vez e revise a saída antes do próximo: é nessa revisão que o erro do agente é pego antes de contaminar a etapa seguinte.

## Etapa 1. Criar a pasta da aula no repositório do grupo

```bash
cd /workspaces/<repositorio-do-grupo>
mkdir -p aula_02_coleta_telemetria/{docs/adr,specs,src,tests}
cd aula_02_coleta_telemetria

BASE=https://raw.githubusercontent.com/afonsolelis/aulas/main/pages/data-collection/laboratorio/lesson-2
for f in docker-compose.yml .env.example requirements.txt AGENTS.md .gitignore gerar_lotes.py; do
  curl -fsSLO "$BASE/$f"
done
ls -la
```

Gate: os seis arquivos aparecem em `ls -la`.

## Etapa 2. Subir o MinIO local

```bash
cp .env.example .env
SENHA=$(openssl rand -base64 24)
sed -i "s|^MINIO_ROOT_PASSWORD=.*|MINIO_ROOT_PASSWORD=$SENHA|; s|^S3_SECRET_KEY=.*|S3_SECRET_KEY=$SENHA|" .env
unset SENHA

docker compose config -q && echo "compose ok"
docker compose up -d
docker compose ps -a
docker compose logs minio-init
```

Gates:

- `minio` aparece como `healthy`.
- `minio-init` termina com `Exited (0)` e o log mostra `Bucket created successfully` (ou nada a criar, se o bucket já existia).
- `git status` não lista `.env`.

Para usar o `mc` local, registre o alias dentro do próprio contêiner (a imagem já traz o `mc`) e ligue o versionamento:

```bash
docker compose exec minio sh -c 'mc alias set local http://localhost:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"'
docker compose exec minio mc ls local
docker compose exec minio mc version enable local/raw
docker compose exec minio mc version info local/raw
```

O console web fica na porta 9001. No Codespace, abra pela aba PORTS.

## Etapa 3. Ambiente Python

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -c "import boto3, pytest; print('ok')"
```

## Etapa 4. Gerar lotes e olhar a fonte antes de escrever a spec

```bash
python gerar_lotes.py --inicio 2026-10-17T09:00
ls pouso | head -4
ls pouso | wc -l
cat pouso/CAM-0451_20261017T0900.txt
sha256sum pouso/CAM-0451_20261017T0900.txt
grep -h '^TAC;' pouso/*.txt
```

Gates:

- O gerador informa `80 lotes em pouso/ (20 caminhões x 4 janelas)` e média de 1.025 bytes por lote.
- `ls pouso | wc -l` mostra 80.
- O lote `CAM-0451_20261017T0900.txt` tem 983 bytes e `sha256` `6789b712602d1985d24df7b48370a1190da3db4e2576a74b07b5520d28601b12`. Com a mesma semente e o mesmo `--inicio`, todos os grupos obtêm os mesmos bytes; esse hash serve de teste de aceitação.

Sem `--inicio`, o gerador usa a última hora completa (às 10h37, gera de 09:00 a 10:00). Outras opções: `--horas 24` gera um dia inteiro (1.920 lotes), `--caminhoes` muda o tamanho da frota e `--inicio 2027-03-02T08:00` gera lotes depois da data do firmware novo, com `TEMP_BAU` no formato 3. O horário do nome do arquivo e das linhas é o de Brasília; o coletor converte para UTC na chave (09:00 em Brasília vira `hora=12`).

Não edite `gerar_lotes.py` nem os arquivos de `pouso/`: eles são a fonte, e o hash de aceitação depende deles.

## Etapa 5. Prompts SDD no agente de código

Abra o agente dentro de `aula_02_coleta_telemetria/`, para que ele enxergue o `AGENTS.md`:

```bash
claude          # ou o agente que você usa
```

O Claude Code lê instruções de um `CLAUDE.md`. Para não manter dois arquivos, crie um que importe o `AGENTS.md`:

```bash
echo "@AGENTS.md" > CLAUDE.md
git add CLAUDE.md
```

Execute os prompts do material, seção 10, um por vez. Depois de cada um, faça a revisão indicada antes de seguir.

| Prompt | Artefato | Gate antes do próximo |
|---|---|---|
| 1. Persona | `docs/00_persona.md` | decisão, dor e frequência explícitas para frota, jurídico e engenharia |
| 2. Objetivos de negócio | `docs/01_objetivos_negocio.md` | métricas sem números inventados |
| 3. Especificação | `specs/spec.md` | todo RF e RNF tem critério Dado/Quando/Então |
| 4. Plano | `specs/plan.md` | C4 em Mermaid e escolhas ligadas a RF/RNF |
| 5. Tarefas | `specs/tasks.md` | cada tarefa tem RF/RNF e teste |
| 6. Implementação | `src/`, `tests/` | `python -m pytest -q` sem falhas, tarefa a tarefa |
| 7. Validação ATAM | `docs/atam.md`, `docs/adr/` | cenários de seis partes com evidência |

Em sala, a turma acompanha a demonstração até o prompt 5. Os prompts 6 e 7 e as etapas 6 e 7 seguem durante a semana.

## Etapa 6. Rodar contra o MinIO local

```bash
set -a; source .env; set +a
python -m pytest -q

python gerar_lotes.py --inicio 2026-10-17T09:00
python -m src.coletor
ls pouso | wc -l                               # 0: tudo foi confirmado e apagado

docker compose exec -T minio mc find local/raw/telemetria --name "*.txt" | wc -l
docker compose exec -T minio mc ls --recursive --versions local/raw/telemetria/ | wc -l

python gerar_lotes.py --inicio 2026-10-17T09:00   # o provedor reenvia os mesmos lotes
python -m src.coletor
ls pouso | wc -l
docker compose exec -T minio mc find local/raw/telemetria --name "*.txt" | wc -l
docker compose exec -T minio mc ls --recursive --versions local/raw/telemetria/ | wc -l
docker compose exec minio mc ls --recursive local/raw/_manifestos/
```

Gates:

- Depois da primeira execução, 80 objetos `.txt` e 80 versões em `telemetria/` (20 caminhões vezes 4 lotes por hora gerada), e `pouso/` vazio.
- A segunda execução não cria objeto nem versão em `telemetria/`: as duas contagens continuam 80, `pouso/` fica vazio de novo e o manifesto dela tem 80 linhas `ja_existia`. O manifesto é um objeto novo por execução, fora de `telemetria/`.
- Código de saída 0 nas duas execuções (`echo $?`).

Inspecione um objeto e confira o hash:

```bash
K=telemetria/data=2026-10-17/hora=12/caminhao=CAM-0451/lote_1200.txt
docker compose exec minio mc stat local/raw/$K
docker compose exec -T minio mc cat local/raw/$K | sha256sum
docker compose exec -T minio mc cat local/raw/$K | head -5
```

Gates:

- `mc stat` mostra `X-Amz-Meta-Fonte: provedor-satelite`, `X-Amz-Meta-Recebido-Em`, `X-Amz-Meta-Versao-Coletor`, `X-Amz-Meta-Sha256`, `X-Amz-Meta-Caminhao: CAM-0451`, `X-Amz-Meta-Janela-Inicio: 2026-10-17T12:00:00Z` e `X-Amz-Meta-Arquivo-Origem: CAM-0451_20261017T0900.txt`.
- O `sha256sum` do conteúdo é igual ao metadado e ao hash de aceitação da etapa 4.

Teste os dois caminhos de falha:

```bash
# retransmissão com conteúdo diferente
python gerar_lotes.py --inicio 2026-10-17T09:00 --caminhoes 1
echo "linha que chegou atrasada" >> pouso/CAM-9840_20261017T0915.txt
python -m src.coletor; echo "saida $?"         # diferente de zero
ls pouso                                       # o lote alterado continua no pouso

# MinIO fora do ar
docker compose stop minio
python -m src.coletor; echo "saida $?"         # diferente de zero, sem travar, depois das tentativas da spec
ls pouso                                       # nada foi apagado
docker compose start minio
```

O manifesto da primeira falha registra `conflito_hash` para o lote alterado e `ja_existia` para os outros. Decida o que fazer com o lote em conflito e registre no `docs/atam.md` (cenário C-07); para seguir, mova-o para fora de `pouso/`.

## Etapa 7. Rodar contra o MinIO do Railway

Crie um segundo arquivo de ambiente, também fora do Git:

```bash
cp .env .env.railway
# edite .env.railway: S3_ENDPOINT_URL=https://<dominio-da-porta-9000>, S3_ACCESS_KEY e S3_SECRET_KEY do Railway
git status --short   # .env.railway não pode aparecer
```

Registre o alias `railway` no `mc`. Sem as chaves na linha de comando, o `mc` pede os valores de forma interativa e eles não ficam no histórico do shell:

```bash
docker compose exec minio mc alias set railway https://<dominio-da-porta-9000>
docker compose exec minio mc mb --ignore-existing railway/raw
docker compose exec minio mc version enable railway/raw
```

Rode o coletor local apontando para o Railway:

```bash
set -a; source .env.railway; set +a
python gerar_lotes.py --inicio 2026-10-17T09:00 && python -m src.coletor
python gerar_lotes.py --inicio 2026-10-17T09:00 && python -m src.coletor

docker compose exec minio mc ls --recursive railway/raw/telemetria/ | head
docker compose exec -T minio mc find railway/raw/telemetria --name "*.txt" | wc -l
docker compose exec -T minio mc ls --recursive --versions railway/raw/telemetria/ | wc -l
docker compose exec minio mc du railway/raw
```

Gates: 80 objetos e 80 versões em `railway/raw/telemetria/` depois das duas execuções, e `pouso/` vazio. Para cada hora a mais gerada com `--inicio`, mais 80 objetos.

Se aparecer erro 502 do proxy do Railway, o coletor deve tentar de novo com espera crescente; se as tentativas se esgotarem, o lote fica no pouso e a próxima execução tenta outra vez na mesma chave. Registre o que aconteceu no `docs/atam.md` (cenário C-03), com a contagem de versões.

Volte ao ambiente local antes de continuar desenvolvendo:

```bash
set -a; source .env; set +a
```

## Etapa 8. Entrega

Na pasta `aula_02_coleta_telemetria/` do repositório do grupo, até a Aula 03 (24/10/2026):

- `AGENTS.md`, `docs/00_persona.md`, `docs/01_objetivos_negocio.md`, `docs/atam.md`, `docs/adr/ADR-001-*.md`, `docs/adr/ADR-002-*.md`;
- `specs/spec.md`, `specs/plan.md`, `specs/tasks.md`;
- `src/` com o coletor e `tests/` com testes passando;
- objetos no bucket `raw` do MinIO do Railway, com a saída de `mc ls --recursive`, das contagens e de `mc stat` de um objeto colada em `docs/atam.md` como evidência.

Antes do commit:

```bash
git status --short
git diff --staged -- . ':!.env.example' | grep -nE "SECRET_KEY=|PASSWORD=|ACCESS_KEY=" && echo "PARE: possível segredo no diff"
```

## Encerrar

```bash
docker compose down        # mantém os dados no volume
docker compose down -v     # apaga também o volume local (só quando quiser recomeçar)
```
