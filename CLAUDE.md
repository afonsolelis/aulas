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
index.html                          # Entry point; cards link to pages/home_*.html
pages/
  home_module-[N]-[curso].html      # Module home page (sidebar + lesson grid)
  home_professor.html
  home_autoestudos.html
  home_tutorial-gitlab.html
  module-[N]-[curso]/
    slides/slide_lesson-[N].html    # Reveal.js slide presentation
    materials/lesson-[N]-material.html  # Reading material (long-form HTML)
  autoestudos/                      # Self-study articles
config/
  module-[N]-[curso].json           # Metadata: module info, lessons, disciplines, links
css/
  inteli-styles.css                 # Global CSS variables and component styles
```

**Important naming rule:** Module home pages are prefixed `home_` (e.g. `home_module-9-sistemas-informacao.html`), not `module-*.html`. Index card links must point to `pages/home_*.html` — the Playwright test enforces this.

### Slide System (Reveal.js — required for all new slides)

All slides use **Reveal.js 5.0.4** from CDN. The old custom `.slide/.active` JS navigation system exists in older lessons but must not be used for new content.

Required Reveal.js setup:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.min.css">

<div class="reveal">
  <div class="slides">
    <section class="custom-slide cover-slide-bg">
      <div class="slide-inner"><!-- content --></div>
    </section>
  </div>
</div>

<!-- Top nav (outside .reveal, before </body>) -->
<div class="top-nav">
  <a href="javascript:history.back()" class="nav-btn">← Voltar</a>
  <a href="../home_module-X-curso.html" class="nav-btn">Material</a>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.js"></script>
<script>
  Reveal.initialize({
    controls: true, progress: true,
    slideNumber: 'h.v', center: false, hash: true,
    transition: 'convex', width: '100%', height: '100%',
    margin: 0, disableLayout: true
  });
</script>
```

Do **not** add a custom slide-footer with manual prev/next buttons — Reveal.js handles navigation natively.

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
- `tests/index.spec.ts` — index card links point to `pages/home_*.html` and files exist on disk; course card header colors match the design system
- `tests/home_pages.spec.ts` — module home pages load correctly
- `tests/lesson_structure.spec.ts` — slides/materials have required structure

When adding a new module/lesson, ensure the corresponding file exists on disk before committing or tests will fail.

## Key Rules

1. Every page must include the global Inteli footer (see `frontend-best-practices.md` in `.claude/`).
2. All inter-page links must be relative.
3. Slides must fill the viewport — no overflow and no excessive blank space. Check the densest slides visually and adjust typography, grid, padding, and card height until content is well distributed.
4. Images must have descriptive `alt` text; images are hosted on Cloudinary (`https://res.cloudinary.com/dyhjjms8y/image/upload/`).
5. Keep `config/module-[N]-[curso].json` in sync when adding/removing lessons.
