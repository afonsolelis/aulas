// Validação ad-hoc do deck slide-lesson-1.html (anime.js v4)
// - Viewport 1440x900
// - Verifica window.__anime
// - Captura erros de console e pageerror
// - Navega 21 slides via window.showSlide(i)
// - Screenshot por slide em .playwright-mcp/
// - Detecta overflow scroll (scrollH > clientH || scrollW > clientW)

import { chromium } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const slideFile = 'pages/module-2-common/slides/slide-lesson-1.html';
const outDir = '.playwright-mcp';
const width = 1440;
const height = 900;

const url = pathToFileURL(path.resolve(slideFile)).href;
fs.mkdirSync(outDir, { recursive: true });

const consoleMessages = [];
const pageErrors = [];
const failedRequests = [];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width, height } });
const page = await context.newPage();

page.on('console', (msg) => {
  const type = msg.type();
  if (type === 'error' || type === 'warning') {
    consoleMessages.push({ type, text: msg.text(), location: msg.location() });
  }
});
page.on('pageerror', (err) => {
  pageErrors.push({ message: err.message, stack: err.stack });
});
page.on('requestfailed', (req) => {
  failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
});

console.log('URL:', url);
await page.goto(url, { waitUntil: 'networkidle' });

// Esperar um pouco para módulos ESM carregarem
await page.waitForTimeout(3000);

// Check window.__anime
const animeLoaded = await page.evaluate(() => !!window.__anime);
console.log(`window.__anime loaded: ${animeLoaded}`);

// Contar slides
const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
console.log(`Total slides: ${total}`);

const results = [];
for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => { window.showSlide(idx); }, i);
  await page.waitForTimeout(1500);

  const metrics = await page.evaluate(() => {
    const s = document.querySelector('.slide.active');
    if (!s) return null;
    return {
      scrollH: s.scrollHeight,
      clientH: s.clientHeight,
      scrollW: s.scrollWidth,
      clientW: s.clientWidth,
      bodyScrollH: document.body.scrollHeight,
      bodyClientH: document.body.clientHeight,
      winInnerW: window.innerWidth,
      winInnerH: window.innerHeight,
    };
  });

  const file = path.join(outDir, `slide-lesson-1-anime-${i + 1}.png`);
  await page.screenshot({ path: file, fullPage: false });

  const overflowV = metrics.scrollH > metrics.clientH;
  const overflowH = metrics.scrollW > metrics.clientW;
  const tag = (overflowV || overflowH) ? ` OVERFLOW(v=${overflowV},h=${overflowH}) scroll=${metrics.scrollW}x${metrics.scrollH} client=${metrics.clientW}x${metrics.clientH}` : '';
  console.log(`[${i + 1}/${total}]${tag}`);

  results.push({ slide: i + 1, ...metrics, overflowV, overflowH, file });
}

await browser.close();

const overflows = results.filter(r => r.overflowV || r.overflowH);

const report = {
  animeLoaded,
  totalSlides: total,
  expected: 21,
  overflows,
  consoleMessages,
  pageErrors,
  failedRequests,
  allSlides: results,
};

fs.writeFileSync(path.join(outDir, 'lesson-1-anime-report.json'), JSON.stringify(report, null, 2));

console.log('\n=== SUMMARY ===');
console.log(`__anime: ${animeLoaded ? 'YES' : 'NO'}`);
console.log(`Total slides: ${total} (expected 21)`);
console.log(`Overflows: ${overflows.length}`);
overflows.forEach(o => console.log(`  slide ${o.slide}: scroll=${o.scrollW}x${o.scrollH} client=${o.clientW}x${o.clientH}`));
console.log(`Console errors/warnings: ${consoleMessages.length}`);
consoleMessages.forEach(m => console.log(`  [${m.type}] ${m.text}`));
console.log(`Page errors: ${pageErrors.length}`);
pageErrors.forEach(e => console.log(`  ${e.message}`));
console.log(`Failed requests: ${failedRequests.length}`);
failedRequests.forEach(f => console.log(`  ${f.url}: ${f.failure}`));
