# Laboratório da Aula 01: SDD e MinIO do grupo no Railway

Data Collection and Storage · Inteli · 10/10/2026 · 8h30 às 12h10

Este roteiro resume a parte prática. A explicação completa, os sete prompts CREATE e o
exemplo resolvido estão no material:
[material da Aula 01](../../materials/lesson-1-material.html)
· [slides](../../slides/slide-lesson-1.html)

## Organização do repositório do grupo

```text
repositorio-do-grupo/
├── .gitignore
├── README.md
├── aula_01_minio/           # esta aula
├── aula_02_coleta_json/     # próximas aulas, uma pasta por aula
├── ...
└── projeto_final/           # projeto final (Aula 08), com o mesmo esqueleto SDD
```

## O que há nesta pasta

```text
laboratorio/
├── README.md                       # este roteiro
├── modelo_repositorio/             # copiar para a raiz do repositório do grupo
│   ├── .gitignore                  # .env e credenciais fora do Git
│   └── aula_01_minio/
│       ├── AGENTS.md               # regras do agente para a disciplina
│       ├── .env.example            # nomes das variáveis, sem segredo
│       ├── docs/00_persona.md
│       ├── docs/01_objetivos_negocio.md
│       ├── docs/atam.md
│       ├── docs/rastreabilidade.md # requisito → decisão → componente → evidência → estado
│       ├── docs/prompts.md         # histórico real dos prompts enviados
│       ├── docs/evidencias/        # saídas de comandos que provam os critérios
│       ├── docs/adr/ADR-000-modelo.md
│       ├── specs/spec.md
│       ├── specs/plan.md
│       └── specs/tasks.md
└── referencia/                     # gabarito para conferir o que o agente gerar
    ├── docker-compose.yml          # MinIO local, mesma tag do Railway
    └── minio_railway/Dockerfile    # MinIO publicado no Railway
```

Os arquivos de `referencia/` não são copiados no início. O agente os cria na etapa de
implementação; o grupo compara com o gabarito usando `diff`. Use a cópia direta apenas se
o agente não conseguir gerar os arquivos a tempo.

## Etapa 1. Repositório do grupo e Codespace

1. Um integrante cria um repositório público no GitHub (ex.: `dcs-2026-grupo-xx`),
   com README, e adiciona os colegas em Settings > Collaborators.
2. No repositório: Code > Codespaces > Create codespace on main.
3. No terminal do Codespace:

```bash
docker --version
python3 --version
node --version
```

4. Copie o modelo da disciplina para o repositório:

```bash
git clone --depth 1 https://github.com/afonsolelis/aulas.git /tmp/aulas
LAB=/tmp/aulas/pages/data-collection/laboratorio/lesson-1
cp -rn "$LAB/modelo_repositorio/." .
cp aula_01_minio/.env.example aula_01_minio/.env
git status --short        # .env NÃO pode aparecer na lista
```

Checklist:

- [ ] `docker`, `python3` e `node` respondem com versão.
- [ ] `aula_01_minio/AGENTS.md`, `docs/` e `specs/` existem.
- [ ] `git status --short` não lista `aula_01_minio/.env`.

## Etapa 2. Agente de código

Cada integrante usa o agente de código ou a IA de sua preferência: Claude Code, Codex CLI,
Gemini CLI, OpenCode com o provedor que quiser, Cursor ou Copilot. O fluxo SDD e os prompts
são os mesmos para qualquer um deles.

1. Abra o agente escolhido dentro da pasta do projeto:

```bash
cd aula_01_minio
claude            # ou o agente que você usa
```

2. Garanta que o agente leia o `AGENTS.md`. No Claude Code, crie um `CLAUDE.md` que o
   importe, antes de abrir o agente: `echo "@AGENTS.md" > CLAUDE.md`. Outros agentes leem o
   `AGENTS.md` diretamente ou aceitam o arquivo colado no contexto.
3. Teste: `Leia AGENTS.md e liste, em 5 itens, as regras que você deve seguir neste projeto. Não edite nada.`

Se o agente pedir chave de API, guarde-a fora do repositório. Revezem o piloto do agente
entre os integrantes.

Checklist:

- [ ] O agente respondeu ao teste citando regras do `AGENTS.md`.
- [ ] Nenhuma chave de API aparece em arquivo do repositório (`git grep -nE "\bsk-[A-Za-z0-9_-]{16,}"` vazio).

## Etapa 3. Railway

1. Crie conta em https://railway.com com login do GitHub (verificação pelo GitHub libera o
   Full Trial). Trial: crédito único de US$ 5, até 30 dias; depois, plano Free com US$ 1/mês.
   Limites do trial: 1 GB de RAM, vCPU compartilhada, até 5 serviços por projeto.
   Volumes de contas trial são apagados 30 dias após o fim dos créditos.
2. Instale e autentique a CLI:

```bash
npm i -g @railway/cli
railway --version
railway login --browserless
railway whoami
```

Checklist:

- [ ] `railway whoami` mostra o seu usuário.

## Etapa 4. Ciclo SDD do projeto MinIO (prompts 1 a 7)

Execute, no agente de código, os sete prompts CREATE do material (seção 11), um por vez, e faça a
revisão "Revise antes de seguir" depois de cada um. Arquivos esperados:

| Prompt | Arquivo gerado ou atualizado |
|---|---|
| 1. Persona | `docs/00_persona.md` |
| 2. Objetivos | `docs/01_objetivos_negocio.md` |
| 3. Spec | `specs/spec.md` |
| 4. Plano | `specs/plan.md` (C4 em Mermaid) |
| 5. Tarefas | `specs/tasks.md` |
| 6. Implementação | `docker-compose.yml`, `minio_railway/Dockerfile`, `scripts/`, `tests/` |
| 7. ATAM | `docs/atam.md`, `docs/adr/ADR-001-*.md`, `docs/adr/ADR-002-*.md`, `docs/rastreabilidade.md` |

Depois de cada prompt, cole o texto enviado em `docs/prompts.md` e faça um commit no
formato `tipo(T-xx): descrição [RF-yy]` (nas etapas de documentação, use `docs(...)`).

Compare a implementação com o gabarito (se abriu outro terminal, defina `LAB` de novo, como na etapa 1):

```bash
diff docker-compose.yml "$LAB/referencia/docker-compose.yml"
diff minio_railway/Dockerfile "$LAB/referencia/minio_railway/Dockerfile"
```

## Etapa 5. MinIO local (conferência)

```bash
cd aula_01_minio
# edite .env e troque MINIO_ROOT_PASSWORD por: openssl rand -hex 24
docker compose config --quiet && echo "compose ok"
docker compose up -d --wait
docker compose ps                                   # STATUS: healthy
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9000/minio/health/live   # 200
```

O console fica na porta 9001 (aba Ports do Codespace). Para parar sem perder dados:
`docker compose down`. O comando `docker compose down -v` apaga o volume.

## Etapa 6. Cliente mc

O endereço antigo `dl.min.io` responde 410 desde o arquivamento do MinIO comunitário.
Instale o binário da última release publicada no GitHub, conferindo o checksum:

```bash
MC_RELEASE=RELEASE.2025-08-13T08-35-41Z
curl -fsSL -o "mc.$MC_RELEASE" "https://github.com/minio/mc/releases/download/$MC_RELEASE/mc.linux-amd64.$MC_RELEASE"
curl -fsSL -o mc.sha256sum "https://github.com/minio/mc/releases/download/$MC_RELEASE/mc.linux-amd64.$MC_RELEASE.sha256sum"
sha256sum -c mc.sha256sum
sudo install -m 0755 "mc.$MC_RELEASE" /usr/local/bin/mc
rm "mc.$MC_RELEASE" mc.sha256sum
mc --version
```

Alternativa sem instalar: a imagem da coolLabs já traz o `mc` (mesma release):
`docker compose exec minio mc --version`.

## Etapa 7. Deploy no Railway (prompt 8 do material)

Comandos esperados, para conferir o que o agente executar. As linhas marcadas com
"GRUPO" são digitadas por uma pessoa, em outro terminal, porque envolvem senha.

```bash
cd aula_01_minio/minio_railway
railway init --name minio-grupo-xx
railway add --service minio
railway service link minio
railway volume add --mount-path /data

# GRUPO (terminal separado, dentro de aula_01_minio/minio_railway):
railway variable set MINIO_ROOT_USER=admin_grupo_xx --skip-deploys
SENHA="$(openssl rand -hex 24)"
printf '%s' "$SENHA" | railway variable set MINIO_ROOT_PASSWORD --stdin --skip-deploys
sed -i "s|^MINIO_RAILWAY_PASSWORD=.*|MINIO_RAILWAY_PASSWORD=$SENHA|" ../.env
sed -i "s|^MINIO_RAILWAY_USER=.*|MINIO_RAILWAY_USER=admin_grupo_xx|" ../.env
unset SENHA

railway up --detach
railway logs
railway domain --port 9000 --service minio
# GRUPO: copie o domínio para MINIO_RAILWAY_ENDPOINT no ../.env, com https://
```

Verificação e buckets (GRUPO):

```bash
cd aula_01_minio
set -a; . ./.env; set +a
mc alias set railway "$MINIO_RAILWAY_ENDPOINT" "$MINIO_RAILWAY_USER" "$MINIO_RAILWAY_PASSWORD"
mc ready railway
for b in raw bronze silver gold; do mc mb --ignore-existing "railway/$b"; done
mc ls railway
curl -s -o /dev/null -w "%{http_code}\n" "$MINIO_RAILWAY_ENDPOINT/raw"   # 403 sem credencial
```

Teste de persistência:

```bash
echo '{"teste": "persistencia"}' > /tmp/teste.json
mc cp /tmp/teste.json railway/raw/_verificacao/teste.json
railway redeploy --service minio --yes
# aguarde o deploy terminar (railway logs) e então:
mc ls railway/raw/_verificacao/
```

Checklist:

- [ ] `mc ready railway` responde que o cluster está pronto.
- [ ] `mc ls railway` mostra `raw`, `bronze`, `silver`, `gold`.
- [ ] Acesso sem credencial devolve 403.
- [ ] O objeto de teste sobrevive ao `railway redeploy`.
- [ ] `git ls-files | grep '\.env$'` não retorna nada (o `.env` não está versionado).

## Entregável

No repositório do grupo, até o fim da aula: `aula_01_minio/` com `AGENTS.md`, `docs/` e
`specs/` preenchidos para o projeto MinIO, `docker-compose.yml`, `minio_railway/Dockerfile`,
scripts de verificação, `docs/atam.md`, pelo menos dois ADRs, `docs/rastreabilidade.md`
com o estado de cada requisito, `docs/prompts.md` com os prompts realmente enviados e
`docs/evidencias/` com as saídas das verificações. MinIO no ar no Railway com
os quatro buckets. Registre o repositório com o professor.

Ao fim da disciplina, exporte os dados antes que o volume do trial seja apagado:

```bash
for b in raw bronze silver gold; do mc mirror "railway/$b" "./backup_minio/$b"; done
```
