/**
 * Validação visual de slides via Playwright (headless).
 *
 * Renderiza um deck de slides HTML e, tela a tela, mede se o conteúdo
 * (.slide-content / .sc) invade o rodapé fixo (.slide-footer) nos viewports
 * de projetor. Reporta OVERFLOW / OVERFLOW-TOP / TIGHT e erros de console.
 *
 * Uso:
 *   node scripts/validate-slides.mjs <caminho-relativo-ao-repo> [maisCaminhos...]
 * Exemplos:
 *   node scripts/validate-slides.mjs pages/inteli-camp/slides/slide-lesson-1.html
 *   npm run validate:slides -- pages/module-6-eng-software/slides/slide-lesson-1.html
 *
 * Observação: os browsers do Playwright precisam estar instalados
 * (`npx playwright install chromium`). Este script NÃO roda no pre-commit —
 * é uma ferramenta manual de inspeção visual.
 */
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const VIEWPORTS = [ { w: 1280, h: 720 }, { w: 1920, h: 1080 } ];

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Uso: node scripts/validate-slides.mjs <caminho-relativo-ao-repo> [...]');
  process.exit(2);
}

let browser;
try {
  browser = await chromium.launch();
} catch (e) {
  console.error('LAUNCH-FAIL (rode `npx playwright install chromium`):', e.message);
  process.exit(2);
}

let anyFailure = false;

for (const rel of targets) {
  const abs = resolve(process.cwd(), rel);
  if (!existsSync(abs)) { console.error(`\n[${rel}] arquivo não encontrado`); anyFailure = true; continue; }
  const url = pathToFileURL(abs).href;
  console.log(`\n### ${rel}`);

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(url, { waitUntil: 'networkidle' });
    const total = await page.evaluate(() => document.querySelectorAll('.slide').length);

    console.log(`  ==== ${vp.w}x${vp.h} — ${total} telas ====`);
    for (let i = 0; i < total; i++) {
      await page.evaluate((n) => { if (typeof window.showSlide === 'function') window.showSlide(n); }, i);
      await page.waitForTimeout(200);
      const r = await page.evaluate(() => {
        const active = document.querySelector('.slide.active') || document.querySelector('.slide');
        const sc = active.querySelector('.sc') || active.querySelector('.slide-content') || active.firstElementChild;
        const scR = sc.getBoundingClientRect();
        const footer = document.querySelector('.slide-footer');
        const ft = footer ? footer.getBoundingClientRect().top : window.innerHeight;
        const title = (active.querySelector('.slide-title, h1, h2') || {}).textContent || '';
        return {
          exceedsBottom: scR.bottom > ft, exceedsTop: scR.top < 0,
          slack: Math.round(ft - scR.bottom), title: title.trim().slice(0, 46),
        };
      });
      const flag = r.exceedsBottom ? 'OVERFLOW' : (r.exceedsTop ? 'OVERFLOW-TOP' : (r.slack < 12 ? 'TIGHT' : 'ok'));
      if (flag === 'OVERFLOW' || flag === 'OVERFLOW-TOP') anyFailure = true;
      console.log(`    ${String(i + 1).padStart(2)}  ${flag.padEnd(12)} folga=${String(r.slack).padStart(4)}px  ${r.title}`);
    }
    if (errors.length) { anyFailure = true; console.log('    CONSOLE ERRORS:', errors.slice(0, 5)); }
    else console.log('    console: sem erros');
    await page.close();
  }
}

await browser.close();
process.exit(anyFailure ? 1 : 0);
