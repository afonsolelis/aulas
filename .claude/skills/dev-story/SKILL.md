---
name: dev-story
description: Develop a story using AIOX Story Development Cycle with @dev agent
type: workflow
---

# dev-story

Ativa o agente @dev e executa o ciclo completo de desenvolvimento de uma story.

## Como usar

```
/dev-story [story-id]
```

## O que faz

1. Ativa o agente @dev (Dex)
2. Carrega o contexto da story em `docs/stories/`
3. Executa `dev-develop-story` com modo interativo, YOLO ou pre-flight
4. Atualiza checkboxes e File List na story conforme avança
5. Roda CodeRabbit self-healing (max 2 iterações)

## Referência

Task completa: `.aiox-core/development/tasks/dev-develop-story.md`
