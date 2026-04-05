# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is an educational curriculum repository for the discipline **"Refatoração e Arquitetura de Software (IN02)"** at Inteli (Instituto de Tecnologia e Liderança). It contains course materials — lectures, self-study guides, and sprint deliverable templates — with no runnable code.

## Structure

- `aulas/` — 11 lecture modules (aula_01.md through aula_11.md) + a skill definition file
- `autoestudos/` — 11 deep-study modules with an index (`indice.md`) showing learning dependencies
- `artefatos/` — 5 sprint deliverable templates aligned to the course assessment rubrics
- `refactor.txt` — Complete course curriculum summary (RM-ODP matrices, 8 RNF axes, rubrics)
- `GEMINI.md`, `QWEN.md` — AI context documents defining project vocabulary and frameworks

## Course Framework

Content is organized around **3 blocks** mapping to **5 RM-ODP viewpoints**:

| Block | Aulas | RM-ODP Viewpoints | Sprint |
|-------|-------|-------------------|--------|
| "O QUÊ" (What) | 1–3 | Enterprise, Information | 1 |
| "COMO" (How) | 4–6 | Computational | 2–3 |
| "ONDE" (Where) | 7–11 | Engineering, Technology | 4–5 |

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

## Assessment Rubrics

Three weighted activities (Ponderadas) map to the three blocks:

- **Ponderada 1** (Aulas 1–3): UML class/sequence diagrams, relational model, 8-axis RNF table
- **Ponderada 2** (Aulas 4–6): RF→RN matrix, Jest test suite (≥2 tests/RF), updated UML
- **Ponderada 3** (Aulas 7–11): Complete RTM (persona→test→evidence), integration docs, deployment diagram

## Content Conventions

- All content is in Brazilian Portuguese
- Autoestudos enforce a 120-minute study time limit per module and require academic depth (papers, theory) over shallow tutorials
- Content maps to official Bodies of Knowledge: SWEBOK v3, SEBoK, BABOK
- The `GEMINI.md` skill file defines an "Academic Research Curation" protocol — follow it when adding or updating autoestudo content
- RTM (Requirements Traceability Matrix) links: persona → RF (functional requirement) → RN (business rule) → test → evidence
