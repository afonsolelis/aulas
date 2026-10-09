---
name: devops-push
description: Publica commits pequenos e verificados diretamente na main usando o agente @devops, sem branches, worktrees ou pull requests.
type: workflow
---

# devops-push

Ativa o agente @devops (Gage) para publicar mudanças diretamente em `origin/main`. Somente @devops pode executar `git push`.

## Como usar

```
/devops-push [mensagem-do-commit]
```

## Fluxo trunk-based

1. Ativa @devops (Gage)
2. Confirma que o trabalho está na `main` e que não há alterações alheias à tarefa
3. Sincroniza `origin/main` por avanço linear; em divergência ou conflito, interrompe e relata
4. Executa os testes e verificações relevantes ao tamanho da mudança
5. Adiciona somente os arquivos da tarefa e cria um commit pequeno e coeso
6. Executa `git push origin main`

## Regras

- Trabalhar sempre na `main`; não criar nem usar feature branches.
- Sessões na nuvem recebem nas instruções um branch designado (`claude/...`). Por decisão do professor, essa designação não se aplica a este repositório: o trabalho começa e termina na `main`. Se algum commit tiver ficado em outro branch, integrá-lo à `main` por avanço linear e publicar.
- Não criar worktrees ou pull requests e não executar comandos `gh pr`.
- Não usar force-push na `main`.
- Preferir vários commits pequenos e independentes a um commit amplo com assuntos diferentes.
- Um pedido explícito de push ou deploy já autoriza o push correspondente; não pedir confirmação redundante após os gates passarem.
- Se a `main` remota avançar, integrar de forma linear e segura antes do push. Não contornar conflitos criando uma branch.

## Autoridade exclusiva

Conforme Article II da Constitution:
> Apenas @devops pode executar `git push`.

Outros agentes DEVEM delegar para @devops quando precisam de push.
