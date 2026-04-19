// Captura screenshots de todos os slides de um deck HTML padronizado (módulo 2 style)
// e detecta overflow do conteúdo (.sc) em relação ao footer fixo.
//
// Requer: HTML com `window.showSlide(idx)` e `.slide-container > .slide` + `.slide-footer` fixo.
//
// Uso:
//   node scripts/capture-slides.mjs <html-path> <out-dir> [width] [height]
// Ex.:
//   node scripts/capture-slides.mjs pages/module-6-eng-software/slides/slide-lesson-1.html .tmp/shots 1280 720
//
// Saída: PNGs por slide + issues.json listando overflow.

import { chromium } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const [,, slideFile, outDir, wArg, hArg] = process.argv;
if (!slideFile || !outDir) {
  console.error('Uso: node scripts/capture-slides.mjs <html-path> <out-dir> [width=1280] [height=720]');
  process.exit(1);
}
const width = parseInt(wArg || '1280');
const height = parseInt(hArg || '720');

const url = pathToFileURL(path.resolve(slideFile)).href;
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width, height } });
const page = await context.newPage();
await page.goto(url);

const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
console.log(`Deck: ${path.basename(slideFile)} · ${total} slides @ ${width}×${height}`);

const issues = [];
for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => { window.showSlide(idx); }, i);
  await page.waitForTimeout(1500);

  const m = await page.evaluate(() => {
    const active = document.querySelector('.slide.active');
    if (!active) return null;
    const sc = active.querySelector('.sc') || active.firstElementChild;
    if (!sc) return null;
    const scR = sc.getBoundingClientRect();
    const footer = document.querySelector('.slide-footer');
    const footerTop = footer ? footer.getBoundingClientRect().top : window.innerHeight;
    const margin = 12; // considerar apertado se a folga for menor que isto
    const exceedsBottom = scR.bottom > footerTop;
    const exceedsTop = scR.top < 0;
    const tight = !exceedsBottom && (footerTop - scR.bottom) < margin;
    return {
      scTop: Math.round(scR.top),
      scBottom: Math.round(scR.bottom),
      scHeight: Math.round(scR.height),
      footerTop: Math.round(footerTop),
      viewportH: window.innerHeight,
      exceedsBottom,
      exceedsTop,
      tight,
      overlapPx: exceedsBottom ? Math.round(scR.bottom - footerTop) : 0,
      slackPx: Math.round(footerTop - scR.bottom),
    };
  });

  const file = path.join(outDir, `slide-${String(i+1).padStart(2,'0')}.png`);
  await page.screenshot({ path: file, fullPage: false });

  let flag = '';
  if (m.exceedsBottom) flag = ` ⛔ OVERFLOW +${m.overlapPx}px`;
  else if (m.exceedsTop) flag = ` ⛔ OVERFLOW-TOP`;
  else if (m.tight) flag = ` ⚠️ TIGHT (folga ${m.slackPx}px)`;

  console.log(`[${i+1}/${total}] sc ${m.scTop}..${m.scBottom} / footer ${m.footerTop}${flag}`);
  if (m.exceedsBottom || m.exceedsTop || m.tight) {
    issues.push({ slide: i+1, file, ...m });
  }
}

await browser.close();

fs.writeFileSync(path.join(outDir, 'issues.json'), JSON.stringify(issues, null, 2));
console.log(`\nProblemas detectados: ${issues.length}`);
if (issues.length > 0) {
  console.log('Veja detalhes em:', path.join(outDir, 'issues.json'));
  process.exitCode = 2;
}
