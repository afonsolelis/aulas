# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

Educational curriculum repository for the discipline **"Sistemas de Informação (SI07)"** at Inteli (Instituto de Tecnologia e Liderança). Course materials — lectures, self-study guides, sprint deliverable templates and assessment rubrics — no runnable code.

## Structure

- `aulas/` — 34 lecture modules (`aula_01.md` through `aula_34.md`) + a skill definition file
- `autoestudos/` — deep-study modules with an index (`indice.md`) showing learning dependencies
- `artefatos/` — sprint deliverable templates aligned to the course assessment rubrics
- `ponderadas/` — assessment guides and supporting material
- `suporte/` — reference bodies of knowledge (SWEBOK, SEBoK, Use Case)
- `GEMINI.md`, `QWEN.md` — AI context documents defining project vocabulary and frameworks

## Course Framework

Content organized in **3 blocks** mapping to **5 RM-ODP viewpoints** and **5 sprints**:

| Block | Sprints | RM-ODP Viewpoints |
|-------|---------|-------------------|
| "O QUÊ" (What) | 1 | Enterprise, Information |
| "COMO" (How) | 2–3 | Computational |
| "ONDE" (Where) | 4–5 | Engineering, Technology |

## The 8 RNF Axes (ISO/IEC 25010)

Every deliverable must address all 8 axes:

1. **USAB** — Usabilidade
2. **CONF** — Confiabilidade
3. **DES** — Desempenho
4. **SUP** — Suportabilidade
5. **SEG** — Segurança
6. **CAP** — Capacidade
7. **REST** — Restrições de Design
8. **ORG** — Organizacionais

## Content Conventions

- All content in Brazilian Portuguese unless a file is explicitly in English
- Autoestudos enforce study time limits per module and require academic depth (papers, theory) over shallow tutorials
- Content maps to official Bodies of Knowledge: SWEBOK v3, SEBoK, BABOK
- The `GEMINI.md` skill file defines an "Academic Research Curation" protocol — follow it when adding or updating autoestudo content
- RTM (Requirements Traceability Matrix) links: persona → RF (functional requirement) → RN (business rule) → test → evidence
