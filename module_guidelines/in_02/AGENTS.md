# Repository Guidelines

## Project Structure & Module Organization
This repository is documentation-first and does not contain runnable application code. Keep content in the folder that matches its teaching purpose:

- `aulas/`: lecture notes for `aula_01.md` through `aula_11.md`
- `autoestudos/`: deeper study guides plus [`autoestudos/indice.md`](./autoestudos/indice.md) for reading order
- `artefatos/`: sprint deliverable templates such as `sprint_01_artefato.md`
- `ponderadas/`: assessment guides and supporting material
- Root files like `requisitos.md`, `refactor.txt`, `QWEN.md`, and `CLAUDE.md`: cross-cutting context

Prefer updating existing documents instead of creating parallel versions of the same topic.

## Build, Test, and Development Commands
There is no build pipeline or test runner configured at the repository root. Use lightweight checks while editing:

- `rg --files`: inspect the content map quickly
- `git diff --stat`: review scope before committing
- `sed -n '1,120p' path/to/file.md`: verify a section in terminal

Validation is primarily manual: confirm heading structure, internal links, file names, and consistency with RM-ODP, RTM, and the 8 RNF axes described in the repository context files.

## Coding Style & Naming Conventions
Write in Brazilian Portuguese unless a file is explicitly in English. Use concise Markdown with clear heading levels and short paragraphs. Match the repository naming pattern:

- Lecture files: `aula_NN.md`
- Sprint templates: `sprint_0N_artefato.md`
- Study guides: `aula_NN_tema.md`

Use lowercase file names with underscores. Keep terminology consistent with existing acronyms such as `RF`, `RN`, `RNF`, and `RTM`.

## Testing Guidelines
Testing here means content review, not automated execution. Before opening a PR, check:

- links and relative paths resolve correctly
- tables render cleanly
- new material preserves traceability between persona, requirement, rule, test, and evidence when applicable
- changes stay aligned with the course structure in `QWEN.md` and `requisitos.md`

## Commit & Pull Request Guidelines
Recent history favors short Portuguese commit messages in the imperative, for example `adiciona requisitos.md...` or `Atualiza links de estudo...`. Prefer specific summaries over vague messages like `ok`.

PRs should include a short description, affected directories, rationale for curriculum changes, and screenshots only when layout-heavy Markdown rendering changed materially.
