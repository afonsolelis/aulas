# Skill: Gerenciador de Git (Conventional Commits)

Esta skill é especializada na gestão de versão do projeto, garantindo mensagens de commit padronizadas e integração contínua.

## Objetivos
- Manter o histórico do Git limpo e semântico.
- Automatizar o processo de `add`, `commit` e `push`.
- Seguir rigorosamente o padrão **Conventional Commits**.

## Padrão de Mensagem de Commit
Formato: `<tipo>(<escopo>): <descrição curta>`

- **feat**: Uma nova funcionalidade (ex: criação de uma nova aula ou skill).
- **fix**: Correção de um bug ou erro de digitação/conteúdo.
- **docs**: Mudanças apenas na documentação ou README.
- **style**: Alterações de formatação, visual (CSS) ou espaçamento que não afetam a lógica.
- **refactor**: Mudança no código que não corrige bug nem adiciona funcionalidade.
- **perf**: Mudança de código que melhora o desempenho.
- **chore**: Atualizações de tarefas de build, pacotes ou ferramentas auxiliares.

**Exemplo:** `feat(material): adiciona material de leitura da aula 7`

## Fluxo de Execução
1.  **Staging:** `git add .` (ou arquivos específicos).
2.  **Verificação:** `git status` para confirmar o que será commitado.
3.  **Commit:** `git commit -m "<tipo>(<escopo>): <descrição>"`
4.  **Push:** `git push origin <branch-atual>` (geralmente `main` ou `master`).

## Regras de Segurança
- Nunca commite arquivos `.env`, segredos ou chaves de API.
- Verifique se o `.gitignore` está configurado corretamente antes de operações em massa.
