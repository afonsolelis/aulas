---
name: spec-pipeline
description: Run the Spec Pipeline to transform requirements into executable spec
type: workflow
---

# spec-pipeline

Executa o pipeline completo de especificação: requisitos → complexidade → pesquisa → spec → crítica → plano.

## Como usar

```
/spec-pipeline
```

## Fases

| Fase | Agente | Output |
|------|--------|--------|
| 1. Requisitos | @pm | requirements.json |
| 2. Complexidade | @architect | complexity.json |
| 3. Pesquisa | @analyst | research.json |
| 4. Spec | @pm | spec.md |
| 5. Crítica | @qa | critique.json |
| 6. Plano | @architect | implementation.yaml |

## Classes de Complexidade

- **SIMPLE** (<=8): fases 1, 4, 5
- **STANDARD** (9-15): todas as 6 fases
- **COMPLEX** (>=16): 6 fases + ciclo de revisão
