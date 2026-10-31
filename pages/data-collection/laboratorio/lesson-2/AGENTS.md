# AGENTS.md (modelo para aula_02_coleta_telemetria/)

Copie este arquivo para a raiz de `aula_02_coleta_telemetria/` no repositório do grupo e ajuste o que estiver entre `<>`. Vale para qualquer agente de código no terminal; no Claude Code, crie um `CLAUDE.md` com a linha `@AGENTS.md` para que ele seja lido.

## Escopo

- Projeto: coletor dos lotes TXT de telemetria de caminhões. Lê os arquivos da pasta `pouso/` (que faz o papel do SFTP do provedor por satélite), grava os bytes intactos no bucket `raw` de um MinIO, registra a execução num manifesto JSON Lines e só apaga do pouso o que foi confirmado.
- Trabalhe somente dentro de `aula_02_coleta_telemetria/`. Não edite arquivos de outras aulas.
- Fontes de verdade, nesta ordem: `docs/00_persona.md`, `docs/01_objetivos_negocio.md`, `specs/spec.md`, `specs/plan.md`, `specs/tasks.md`.
- `gerar_lotes.py` e os arquivos de `pouso/` são a fonte simulada: nunca os edite para fazer um teste passar.
- Preserve os identificadores `RF-xx`, `RNF-xx` e `T-xx`. Não renumere.

## Regras de trabalho

- Mostre o plano de alteração antes de editar arquivos.
- Execute uma etapa por vez e pare ao final dela, aguardando revisão humana.
- Não invente números, SLAs ou limites. Quando faltar um valor, escreva "hipótese, validação pendente".
- Separe fato, lacuna e suposição em toda análise.
- Toda tarefa de código vem acompanhada de teste em `tests/` e só termina com `pytest` passando.
- Os bytes gravados no bucket são exatamente os lidos do arquivo (`Path.read_bytes()`); nunca decodifique, normalize ou troque o fim de linha antes de gravar.

## Comandos permitidos

- `python -m pytest -q`
- `python gerar_lotes.py --inicio <AAAA-MM-DDTHH:MM> [--horas N] [--caminhoes N]`
- `python -m src.coletor` (ou o ponto de entrada definido em `specs/plan.md`)
- `ls pouso`, `sha256sum pouso/<arquivo>`
- `docker compose up -d`, `docker compose ps`, `docker compose logs minio`
- `docker compose exec minio mc ...` apenas para leitura (`ls`, `stat`, `cat`, `du`, `find`)

Peça autorização antes de: instalar pacotes fora do `requirements.txt`, apagar objetos no bucket, apagar arquivos de `pouso/` fora do coletor, rodar `docker compose down -v`, qualquer comando `railway`.

## Segredos

- Credenciais vêm de variáveis de ambiente (`S3_ACCESS_KEY`, `S3_SECRET_KEY`). Nunca escreva valores reais em código, testes, documentação ou mensagens de commit.
- `.env` e `.env.railway` estão no `.gitignore`. Se uma chave aparecer no diff, pare e avise.

## Gates

1. `python -m pytest -q` sem falhas.
2. Cada hora gerada com `gerar_lotes.py` vira 80 objetos em `raw/telemetria/` (20 caminhões vezes 4 lotes), e `pouso/` termina vazio.
3. Uma segunda execução sobre os mesmos lotes não cria objeto nem versão em `raw/telemetria/` e registra `ja_existia` no manifesto.
4. Todo objeto gravado tem os sete metadados de procedência da spec, e o `sha256` do conteúdo é igual ao metadado.
5. Nenhum segredo em `git diff --staged`.
