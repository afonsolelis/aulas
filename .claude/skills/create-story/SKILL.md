---
name: create-story
description: Create next story from epic using @sm agent
type: workflow
---

# create-story

Ativa o agente @sm e cria a próxima story a partir de um epic.

## Como usar

```
/create-story [epic-id]
```

## O que faz

1. Ativa o agente @sm (River)
2. Lê o contexto do epic em `docs/stories/epics/`
3. Gera `{epicNum}.{storyNum}.story.md` com todos os detalhes necessários
4. Story começa em status `Draft`

## Referência

Task completa: `.aiox-core/development/tasks/create-next-story.md`
