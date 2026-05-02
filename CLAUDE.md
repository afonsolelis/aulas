# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run tests (Playwright, Chromium only)
npm test

# Run a single test file
npx playwright test tests/index.spec.ts

# Serve locally for manual testing
npx http-server . -p 8080
# or
python -m http.server 8000

# View test report after run
npx playwright show-report
```

> **Note:** Husky runs `npm test` as a pre-commit hook. Tests must pass before any commit lands.

## Architecture

### Page Structure

```
index.html                          # Entry point; cards link to pages/home-*.html
pages/
  home-module-[N]-[curso].html      # Module home page (sidebar + lesson grid)
  home-professor.html
  home-autoestudos.html
  home-tutorial-gitlab.html
  module-[N]-[curso]/
    slides/slide-lesson-[N].html    # HTML slide presentation
    materials/lesson-[N]-material.html  # Reading material (long-form HTML)
  autoestudos/                      # Self-study articles
config/
  module-[N]-[curso].json           # Metadata: module info, lessons, disciplines, links
css/
  inteli-styles.css                 # Global CSS variables and component styles
```

**Important naming rule:** Module home pages use kebab-case with `home-` prefix (e.g. `home-module-9-sistemas-informacao.html`), not `module-*.html` and never with underscore. Index card links must point to `pages/home-*.html` — the Playwright test enforces this.

### Slide System (HTML padronizado)

Slides são HTML standalone — **sem** bibliotecas de apresentação externas. Cada arquivo `slide-lesson-[N].html` traz seu próprio CSS/JS inline para navegação.

Estrutura base:
```html
<div class="slide-container">
  <section class="slide active">
    <!-- conteúdo do slide 1 -->
  </section>
  <section class="slide">
    <!-- conteúdo do slide 2 -->
  </section>
</div>
```

Navegação: use o padrão `.slide/.active` com JS próprio (setas do teclado + botões prev/next). Inclua também um `.top-nav` com link para o material da aula e "← Voltar". Importe `css/inteli-styles.css` via caminho relativo e a fonte Manrope do Google Fonts.

### CSS Design System

CSS variables are defined in `/css/inteli-styles.css` — never hardcode colors.

Key color variables:
- `--inteli-purple: #855ede` / `--inteli-blue: #1863dc`
- `--inteli-dark-purple: #2E2640` / `--inteli-very-dark: #1e1829`
- Course headers: `.card-header-si` (green `#89cea5`), `.card-header-eng-software` (red `#ff4545`), `.card-header-adm-tech` (navy `#2e2640`)

Glassmorphism pattern for cards:
```css
background: rgba(255,255,255,0.85);
backdrop-filter: blur(16px);
border-radius: 20px;
box-shadow: 0 8px 32px rgba(31,38,135,0.37);
border: 1px solid rgba(255,255,255,0.18);
```

### Module Config JSON Schema

```json
{
  "module": { "name": "...", "course": "...", "description": "..." },
  "lessons": [{ "number": 1, "title": "...", "description": "..." }],
  "disciplines": {
    "mathematics": { "topics": [] },
    "computing": { "topics": [] },
    "ux": { "topics": [] },
    "business": { "topics": [] },
    "leadership": { "topics": [] }
  },
  "external_links": { "drive": "https://..." }
}
```

### Playwright Tests

Tests run against local `file://` URLs (no server needed). They validate:
- `tests/index.spec.ts` — index card links point to `pages/home-*.html` and files exist on disk; course card header colors match the design system
- `tests/specs-compliance.spec.ts` — validates all specs including home pages, routes naming, slides, and lesson cards
- `tests/calendar-consistency.spec.ts` — validates that `config/calendar.json` dates match the `📅 dd/mm/yyyy` shown in each lesson card of the active modules' homes

When adding a new module/lesson, ensure the corresponding file exists on disk before committing or tests will fail.

### `config/calendar.json` — Trimester & Active Modules

Single source of truth for which modules the professor is currently teaching and the date of every lesson. Schema:

```json
{
  "trimester": { "code": "2026-T2", "start": "23/04/2026", "end": "22/06/2026", "professor": "..." },
  "active_modules": [
    {
      "id": "module-2-common",
      "course": "...",
      "name": "...",
      "config": "config/module-2-common.json",
      "home": "pages/home-module-2-common.html",
      "lessons": [{ "number": 1, "date": "23/04/2026", "title": "..." }]
    }
  ]
}
```

Dates are stored as `dd/mm/yyyy` strings to match exactly what is rendered in the home cards (`<small>📅 dd/mm/yyyy</small>`). The Playwright spec above fails if any home card date diverges from `calendar.json`.

## Key Rules

1. Every page must include the global Inteli footer (see `frontend-best-practices.md` in `.claude/`).
2. All inter-page links must be relative.
3. Slides must fill the viewport — no overflow and no excessive blank space. Check the densest slides visually and adjust typography, grid, padding, and card height until content is well distributed.
4. Images must have descriptive `alt` text; images are hosted on Cloudinary (`https://res.cloudinary.com/dyhjjms8y/image/upload/`).
5. Keep `config/module-[N]-[curso].json` in sync when adding/removing lessons.
6. Whenever a lesson date changes, update **both** `config/calendar.json` **and** the corresponding `<small>📅 dd/mm/yyyy</small>` in `pages/home-module-*.html` — they must match exactly. Same applies when activating/deactivating a module for the trimester.
