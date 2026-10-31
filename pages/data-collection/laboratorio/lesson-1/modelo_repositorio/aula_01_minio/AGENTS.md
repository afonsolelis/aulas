# AGENTS.md: regras para o agente neste projeto

Disciplina: Data Collection and Storage (Inteli, 2026).
Projeto: aula_01_minio (object storage do grupo, local e no Railway).

Leia este arquivo inteiro antes de qualquer ação. Estas regras valem para todos os prompts.

## 1. Escopo

- Trabalhe somente dentro desta pasta (`aula_01_minio/`). Não altere arquivos de outras aulas.
- Fontes de verdade, nesta ordem: `docs/00_persona.md`, `docs/01_objetivos_negocio.md`,
  `specs/spec.md`, `specs/plan.md`, `specs/tasks.md`, `docs/atam.md`, `docs/adr/`,
  `docs/rastreabilidade.md`.
- `docs/prompts.md` é o histórico real dos prompts enviados. Não o reescreva; apenas
  acrescente ao final quando o grupo pedir.
- Se um arquivo de fonte de verdade não existir ou estiver vazio, pare e pergunte.

## 2. Forma de trabalho

- Um prompt por etapa SDD: persona, objetivos, spec, plano, tarefas, implementação, ATAM.
  Ao terminar a etapa pedida, pare e resuma o que mudou. Não avance para a etapa seguinte.
- Antes de editar qualquer arquivo, mostre o plano: arquivos que serão criados ou alterados
  e o motivo de cada um. Espere confirmação.
- Na implementação, execute uma tarefa de `specs/tasks.md` por vez, rode o teste ou a
  verificação ligada a ela e mostre a saída real do comando.
- Preserve os identificadores existentes (RF-xx, RNF-xx, T-xx, CEN-xx, ADR-xxx).
  Nunca renumere nem apague um requisito; marque como "descartado" com o motivo.

## 3. Números, fatos e hipóteses

- Não invente números, SLAs, volumes, custos ou limites. Use apenas os que estiverem nos
  arquivos de fonte de verdade ou na documentação citada.
- Quando faltar um valor, escreva "hipótese: validação pendente" e explique como medir.
- Separe sempre: fato (com origem), lacuna, suposição.
- Não escolha tecnologia sem um requisito ou restrição que a justifique.

## 4. Segredos

- Nunca escreva senhas, chaves de API ou tokens em arquivos versionados, prompts,
  logs, commits ou saídas de exemplo.
- Credenciais ficam em `.env` (fora do Git, ver `.gitignore`) ou nas variáveis do Railway.
- `.env.example` contém apenas nomes de variáveis e valores fictícios.
- Não leia, não imprima e não edite o arquivo `.env`. Scripts podem carregá-lo, mas
  nunca podem ecoar valores de senha na saída.
- Não gere senhas nem execute `railway variable set` com valores secretos: isso é feito
  pelo grupo, em terminal separado. Tudo o que o agente lê é enviado ao provedor do modelo.
- Se encontrar um segredo em arquivo versionado, pare e avise.

## 5. Comandos

Permitidos sem pedir: `ls`, `cat` (exceto `.env`), `docker compose config --quiet`
(sem `--quiet` o comando imprime as senhas já interpoladas), `docker compose ps`,
`docker compose logs`, `mc ls`, `railway status`, `railway logs`, execução de testes
em `tests/` e de scripts em `scripts/` que não imprimem segredos.

Peça confirmação antes de: `docker compose up/down`, `railway up`, `railway volume`,
`railway variable set`, `railway domain`, `mc rb`, `mc rm`, qualquer comando que apague
dados, crie recursos pagos ou altere o serviço publicado.

Proibido: `docker compose down -v` e `railway volume delete` sem pedido explícito;
`railway variable list` e `cat .env` (imprimem segredos); `railway login` (feito pelo
grupo); `git push`; usar a imagem `latest`.

## 6. Commits

- Um commit por tarefa, fazendo uma coisa só, no formato `tipo(T-xx): descrição [RF-yy]`.
  Exemplos: `feat(T-03): script cria os quatro buckets de forma idempotente [RF-02]`,
  `docs(T-00): spec com RF e RNF do MinIO [RF-01]`.
- Tipos: `feat`, `fix`, `docs`, `test`, `chore`.
- Proponha a mensagem; quem faz o commit é o grupo, depois de revisar o diff.

## 7. Gates de qualidade (toda entrega)

- Cada RF/RNF tem critério de aceite verificável (Dado/Quando/Então).
- Cada tarefa aponta para um RF/RNF e para um teste ou comando de verificação.
- Cada decisão relevante tem ADR com alternativas e consequências.
- Cada RF/RNF tem linha em `docs/rastreabilidade.md` com estado atendido, parcial ou
  não atendido; nenhuma linha sem evidência é marcada como atendida.
- Evidências (saídas de comandos) ficam em `docs/evidencias/`, sem segredos.
- O diff não contém segredo nem número sem origem.
