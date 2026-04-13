---
name: devops-push
description: Push changes and create PR using @devops agent (exclusive git push authority)
type: workflow
---

# devops-push

Ativa o agente @devops (Gage) para fazer push e criar PR. Somente @devops pode executar `git push`.

## Como usar

```
/devops-push [branch] [pr-title]
```

## O que faz

1. Ativa @devops (Gage)
2. Verifica status do git e branch atual
3. Executa `git push` para o remote
4. Cria PR via `gh pr create` com título e body padronizados
5. Associa PR à story correspondente

## Autoridade exclusiva

Conforme Article II da Constitution:
> Apenas @devops pode executar `git push` e `gh pr create`

Outros agentes DEVEM delegar para @devops quando precisam de push.
