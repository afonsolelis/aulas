# Repository Guidelines

## Project Structure & Module Organization
This repository is a static teaching site. The entry point is `index.html`, shared styles live in `css/inteli-styles.css`, reusable templates/configs live in `config/`, and validation rules are documented in `specs/`. Main content lives under `pages/`: module homes use `pages/home-module-<n>-<course>.html` (kebab-case with hyphen after "home"), while each module folder follows `pages/module-<n>-<course>/slides/` and `pages/module-<n>-<course>/materials/`. Keep assets in `assets/`, especially UML sources in `assets/uml/`.

## Build, Test, and Development Commands
Install dependencies with `npm install`. Run the validation suite with `npm test`, which executes Playwright against local HTML files. Use `npx playwright test --ui` for interactive debugging, `npx playwright test tests/specs-compliance.spec.ts` for a focused run, and `npx playwright show-report` to inspect the latest HTML report. For quick local browsing, serve the repo root with `npx http-server .`.

## Coding Style & Naming Conventions
Match the existing style: 2-space indentation in HTML, CSS, and TypeScript; semantic HTML; and direct, readable selectors. Reuse the CSS variables in `css/inteli-styles.css` and preserve the course color mapping already validated by tests. Naming is strict and test-driven: module directories use `module-<n>-<course>`, slides use `slide-lesson-<n>.html`, materials use `lesson-<n>-material.html`, and module homes use `home-module-<n>-<course>.html` (hyphen, not underscore).

## Testing Guidelines
Tests live in `tests/` and use Playwright with TypeScript. Add or update tests whenever changing shared layouts, module homes, or Reveal.js slide structure. Keep new specs in `*.spec.ts` and place shared helpers in `tests/test-helpers.ts`. Before opening a PR, run `npm test`; if you changed navigation, naming, or course colors, verify the relevant targeted spec too.

## Commit & Pull Request Guidelines
Recent history mixes descriptive commits with low-signal messages like `ok`; use the descriptive style only. Prefer short imperative subjects such as `Adjust slide typography for better fit` or `Add module 9 lesson materials`. PRs should summarize affected modules/pages, mention any structural or visual changes, link the relevant issue when available, and include screenshots for noticeable UI updates. Note the exact test command you ran in the PR description.

## Contributor Notes
Treat `specs/` as the source of truth for structure and content rules. Avoid renaming files casually: Playwright checks rely on the current path patterns and relative links.
