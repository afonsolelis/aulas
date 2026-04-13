---
name: qa-review
description: Run QA gate with 7 quality checks using @qa agent
type: workflow
---

# qa-review

Ativa o agente @qa e executa o gate de qualidade completo.

## Como usar

```
/qa-review [story-id]
```

## O que faz

1. Ativa o agente @qa (Quinn)
2. Executa 7 checks: code review, testes, AC, regressões, performance, segurança, docs
3. Emite veredicto: PASS / CONCERNS / FAIL / WAIVED
4. Inicia QA Loop se necessário (max 5 iterações)

## Referência

Task completa: `.aiox-core/development/tasks/qa-gate.md`
