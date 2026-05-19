// Captura screenshots do deck Ambev M1 (slide-content como wrapper).
// Uso: node scripts/capture-ambev-slides.mjs <html-path> <out-dir> [width] [height]

import { chromium } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const [,, slideFile, outDir, wArg, hArg] = process.argv;
if (!slideFile || !outDir) {
  console.error('Uso: node scripts/capture-ambev-slides.mjs <html-path> <out-dir> [width=1280] [height=720]');
  process.exit(1);
}
const width = parseInt(wArg || '1280');
const height = parseInt(hArg || '720');

const url = pathToFileURL(path.resolve(slideFile)).href;
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width, height } });
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

await page.goto(url);

const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
console.log(`Deck: ${path.basename(slideFile)} · ${total} slides @ ${width}x${height}`);

const issues = [];
for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => { window.showSlide(idx); }, i);
  await page.waitForTimeout(400);

  const m = await page.evaluate(() => {
    const active = document.querySelector('.slide.active');
    if (!active) return null;
    const sc = active.querySelector('.slide-content') || active.firstElementChild;
    if (!sc) return null;
    const scR = sc.getBoundingClientRect();
    const footer = document.querySelector('.slide-footer');
    const topbar = document.querySelector('.exec-topbar');
    const footerTop = footer ? footer.getBoundingClientRect().top : window.innerHeight;
    const topbarBottom = topbar ? topbar.getBoundingClientRect().bottom : 0;
    const margin = 12;
    const exceedsBottom = scR.bottom > footerTop;
    const exceedsTop = scR.top < topbarBottom;
    const tight = !exceedsBottom && (footerTop - scR.bottom) < margin;
    return {
      scTop: Math.round(scR.top),
      scBottom: Math.round(scR.bottom),
      scHeight: Math.round(scR.height),
      footerTop: Math.round(footerTop),
      topbarBottom: Math.round(topbarBottom),
      viewportH: window.innerHeight,
      exceedsBottom,
      exceedsTop,
      tight
    };
  });

  const pad = String(i + 1).padStart(2, '0');
  const file = path.join(outDir, `slide-${pad}.png`);
  await page.screenshot({ path: file, fullPage: false });

  let flag = 'OK';
  if (m && m.exceedsBottom) flag = 'OVERFLOW';
  else if (m && m.exceedsTop) flag = 'OVERFLOW-TOP';
  else if (m && m.tight) flag = 'TIGHT';

  if (flag !== 'OK') {
    issues.push({ slide: i + 1, flag, ...m });
  }
  console.log(`  slide ${pad} : ${flag}  scH=${m && m.scHeight}  scBottom=${m && m.scBottom}  footerTop=${m && m.footerTop}`);
}

fs.writeFileSync(path.join(outDir, 'issues.json'),
  JSON.stringify({ total, viewport: { width, height }, issues, consoleErrors }, null, 2));

await browser.close();

if (issues.length) {
  console.log(`\n${issues.length} issue(s) found. See ${path.join(outDir, 'issues.json')}`);
} else {
  console.log(`\nNo overflow issues. Screenshots in ${outDir}`);
}
if (consoleErrors.length) console.log(`Console errors: ${consoleErrors.length}`);
