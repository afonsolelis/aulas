---
name: brownfield
description: Run Brownfield Discovery for legacy codebase assessment
type: workflow
---

# brownfield

Executa a descoberta de codebase existente em 10 fases, produzindo relatório de dívida técnica.

## Como usar

```
/brownfield
```

## Fases

**Coleta (1-3):**
- @architect → system-architecture.md
- @data-engineer → SCHEMA.md + DB-AUDIT.md
- @ux-design-expert → frontend-spec.md

**Validação (4-7):**
- @architect → technical-debt-DRAFT.md
- Especialistas revisam
- @qa → QA Gate (APPROVED | NEEDS WORK)

**Finalização (8-10):**
- @architect → technical-debt-assessment.md
- @analyst → TECHNICAL-DEBT-REPORT.md
- @pm → Epic + stories para desenvolvimento

## Referência

Task completa: `.aiox-core/development/tasks/analyze-brownfield.md`
