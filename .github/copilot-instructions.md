# Copilot Instructions for Aulas (Inteli)

## Project Overview

This repository is a static educational platform hosting didactic materials for Inteli courses:
- **Administração em Tecnologia (Adm Tech)**
- **Engenharia de Software (Eng. Software)**
- **Sistemas de Informação (SI)**

The platform is built with vanilla HTML/CSS/JavaScript, Bootstrap 5, and Reveal.js for interactive slide presentations.

## Build, Test, and Development Commands

### Installation
```bash
npm install
```

### Running Tests
- **Full test suite:** `npm test`
- **Single test file:** `npx playwright test tests/home_pages.spec.ts`
- **Interactive test runner:** `npx playwright test --ui`
- **View test report:** `npx playwright show-report`

### Local Development
- **Serve locally:** `npx http-server .` (from repo root)
- **Watch Playwright tests:** `npx playwright test --watch`

### Git Hooks
- Husky is configured for git hooks (see `.husky/`)
- Run `npm run prepare` if hooks don't trigger automatically

## Architecture and Structure

### Directory Organization
```
aulas/
├── index.html                    # Main portal
├── config/                       # Module configuration JSONs
├── css/inteli-styles.css         # Global styles and CSS variables
├── pages/
│   ├── home_module-[n]-[course].html   # Module home pages
│   ├── module-[n]-[course]/
│   │   ├── slides/               # Reveal.js slide presentations
│   │   └── materials/            # Reading materials (HTML)
│   └── autoestudos/              # Self-study articles
├── assets/
│   └── uml/                      # PlantUML diagrams (.puml) and PNG exports
├── tests/                        # Playwright test suite (TypeScript)
├── specs/                        # Specification documents
└── .agents/                      # AI agent workflows
```

### Naming Conventions

**Strict and test-driven.** Files must follow these exact patterns:

- **Modules:** `module-[n]-[course]` (e.g., `module-5-adm-tech`)
- **Slides:** `slide_lesson-[n].html` (lesson numbering starts at 1)
- **Materials:** `lesson-[n]-material.html`
- **Module homes:** `home_module-[n]-[course].html`
- **All files:** kebab-case

Treat `specs/` (especially `01-estrutura-diretorios.md`) as the source of truth for naming and structure.

### CSS Architecture

**Global styles live in `css/inteli-styles.css`.** All new styles must use CSS variables for colors and reusable values.

**Course Color Mapping (CSS variables):**
- Adm Tech: `--adm-tech-navy` (`#2e2640`)
- SI: `--si-blue` (`#89cea5`)
- Eng. Software: `--eng-software-yellow` (`#ff4545`)

**Patterns:**
- 2-space indentation in HTML, CSS, and TypeScript
- Semantic HTML; avoid unnecessary `<div>` wrappers
- Classes follow pattern: `.module-header`, `.slide-container`, etc.
- Glassmorphism effects for cards (see existing CSS)
- All relative links; no hardcoded absolute paths

### Reveal.js Slides

Slides use Reveal.js 4.5+ with a custom layout integrated into the project:
- Slides must fill the viewport correctly: avoid vertical overflow and excessive empty space
- Keyboard navigation: arrow keys, space, Escape
- Check dense slides visually and adjust typography, grid, padding, and card heights for proper distribution
- Add tests to `tests/` if changing shared slide structure

### Testing Architecture

Tests use **Playwright with TypeScript** and run against local HTML files (no server needed).

**Key test files:**
- `home_pages.spec.ts` – Validates module home page colors, structure, and course identity
- `index.spec.ts` – Index page and main portal validation
- `lesson_structure.spec.ts` – Slide and material structure validation
- `test-helpers.ts` – Shared test utilities (file resolution, URL conversion)

**Test Strategy:**
- Add or update tests whenever changing shared layouts, module homes, or Reveal.js structures
- Always validate course colors and naming patterns (test checks for exact naming in file paths)
- Before PR: run `npm test` and verify targeted specs if you modified navigation, naming, or colors

## Key Conventions and Patterns

### Module Addition Workflow
1. Create `config/module-X-[course].json` with module metadata
2. Create `pages/home_module-X-[course].html` with module landing page
3. Create folder `pages/module-X-[course]/` with subfolders: `slides/` and `materials/`
4. Add lesson files: `pages/module-X-[course]/slides/slide_lesson-[n].html`
5. Add material files: `pages/module-X-[course]/materials/lesson-[n]-material.html`
6. Add card link on `index.html`

### Lesson Addition Workflow
1. Copy an existing lesson template as reference
2. Update title, content, and lesson number
3. Update the module's `config/module-X-[course].json`
4. Update the module home page (`home_module-[n]-[course].html`) with new card
5. Add or update tests in `tests/` if structure changed

### Common Requirements
- Every page must include the global Inteli footer
- Alt text is mandatory on all images
- Links must be relative (no hardcoded protocols or domains)
- Keep JSON configuration files in sync with HTML content
- Color values must come from CSS variables, never hardcoded

## Important Files and Documentation

- **CI/CD Pipeline:** `.github/CI-CD-PIPELINE.md` – Complete documentation on automated testing and deployment
  - Automatic tests on every push/PR
  - Deploy to GitHub Pages on merge to `main`/`develop`
  - Code quality checks (JSON validation, naming conventions)
  - See workflows in `.github/workflows/`

- **Specifications:** `/specs/` contains authoritative rules for structure, slides, materials, assets, and testing
  - `01-estrutura-diretorios.md` – Directory structure rules
  - `02-slides-especificacao.md` – Reveal.js slide patterns
  - `03-materiais-leitura.md` – Reading material HTML structure
  - `04-home-module.md` – Module home page structure
  - `05-casos-teste.md` – Test cases and validation rules
  - `06-assets-recursos.md` – Asset and UML diagram standards
  - `07-config-json.md` – Configuration file structure

- **Workflows:** `/config/` and `/.agents/workflows/` contain reusable configuration and agent workflows
- **Slide Creation Workflow:** `/.agents/workflows/criacao_de_slides.md` documents the slide creation process
- **CSS Reference:** Review `css/inteli-styles.css` for available variables and class patterns before adding new styles

## MCP Servers

### Playwright MCP (Recommended for Testing)
The Playwright MCP server enables interactive browser automation and test debugging:

**Setup:**
```bash
npm install -D @modelcontextprotocol/server-playwright
```

**Usage:**
- Debug failing tests by launching browser instances
- Inspect DOM elements interactively
- Navigate and interact with pages programmatically
- Useful for understanding test failures and validating selectors

**When to use:**
- After a test fails and you need to understand why
- When validating HTML structure or CSS properties
- When debugging color or layout issues in module pages

## Commit Guidelines

Use descriptive, imperative commit messages (not `ok` or low-signal messages).

**Examples:**
- `Adjust slide typography for better fit`
- `Add module 9 lesson materials`
- `Fix course color inconsistency in Adm Tech module`
- `Update navigation links in module 5`

Include the following trailer in commit messages:
```
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

## Troubleshooting

**Tests fail with naming errors:**
- Verify file names match strict patterns (check `specs/01-estrutura-diretorios.md`)
- Ensure paths are relative and use correct case (kebab-case for files)
- Confirm course identifiers match: `adm-tech`, `eng-software`, `sistemas-informacao`

**Styles not applying:**
- Ensure CSS variables are used (not hardcoded colors)
- Check that styles are added to `css/inteli-styles.css`, not inline
- Verify Bootstrap 5 class names if using Bootstrap components

**Slides not rendering:**
- Check Reveal.js HTML structure (see `02-slides-especificacao.md`)
- Verify all closing tags and proper nesting
- Test locally with `npx http-server .` and check browser console for errors

**Link issues in tests:**
- Always use relative paths (e.g., `pages/module-5-adm-tech/slides/slide_lesson-1.html`)
- Avoid hardcoded domains or protocols
- Test helpers provide URL conversion utilities
