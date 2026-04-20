// Revalidação do slide-lesson-1.html após 3 fixes
// - Viewport 1440x900
// - window.__anime presente
// - Zero erros/warnings/pageerrors
// - Navega 21 slides via window.showSlide(i), 1500ms espera
// - Screenshots em .playwright-mcp/slide-lesson-1-fix-{1..21}.png
// - Reporta scrollH, clientH, scrollW, clientW, activeTop, activeLeft via getBoundingClientRect()
// - Flag scrollH > clientH ou activeTop != 0

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

await page.waitForTimeout(3000);

const animeLoaded = await page.evaluate(() => !!window.__anime);
console.log(`window.__anime loaded: ${animeLoaded}`);

const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
console.log(`Total slides: ${total}`);

const results = [];
for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => { window.showSlide(idx); }, i);
  await page.waitForTimeout(1500);

  const metrics = await page.evaluate(() => {
    const s = document.querySelector('.slide.active');
    if (!s) return null;
    const r = s.getBoundingClientRect();
    return {
      scrollH: s.scrollHeight,
      clientH: s.clientHeight,
      scrollW: s.scrollWidth,
      clientW: s.clientWidth,
      activeTop: r.top,
      activeLeft: r.left,
      activeWidth: r.width,
      activeHeight: r.height,
      bodyScrollH: document.body.scrollHeight,
      bodyClientH: document.body.clientHeight,
      winInnerW: window.innerWidth,
      winInnerH: window.innerHeight,
    };
  });

  const file = path.join(outDir, `slide-lesson-1-fix-${i + 1}.png`);
  await page.screenshot({ path: file, fullPage: false });

  const overflowV = metrics.scrollH > metrics.clientH;
  const overflowH = metrics.scrollW > metrics.clientW;
  const offsetTop = metrics.activeTop !== 0;
  const offsetLeft = metrics.activeLeft !== 0;
  const flags = [];
  if (overflowV) flags.push('OVERFLOW-V');
  if (overflowH) flags.push('OVERFLOW-H');
  if (offsetTop) flags.push(`TOP=${metrics.activeTop}`);
  if (offsetLeft) flags.push(`LEFT=${metrics.activeLeft}`);
  const tag = flags.length ? ` [${flags.join(',')}]` : '';
  console.log(`[${i + 1}/${total}]${tag} scroll=${metrics.scrollW}x${metrics.scrollH} client=${metrics.clientW}x${metrics.clientH} rect(top=${metrics.activeTop}, left=${metrics.activeLeft})`);

  results.push({ slide: i + 1, ...metrics, overflowV, overflowH, offsetTop, offsetLeft, file });
}

await browser.close();

const overflows = results.filter(r => r.overflowV || r.overflowH);
const offsets = results.filter(r => r.offsetTop || r.offsetLeft);

const report = {
  animeLoaded,
  totalSlides: total,
  expected: 21,
  overflows,
  offsets,
  consoleMessages,
  pageErrors,
  failedRequests,
  allSlides: results,
};

fs.writeFileSync(path.join(outDir, 'lesson-1-fix-report.json'), JSON.stringify(report, null, 2));

console.log('\n=== SUMMARY ===');
console.log(`__anime: ${animeLoaded ? 'YES' : 'NO'}`);
console.log(`Total slides: ${total} (expected 21)`);
console.log(`Overflows: ${overflows.length}`);
overflows.forEach(o => console.log(`  slide ${o.slide}: scroll=${o.scrollW}x${o.scrollH} client=${o.clientW}x${o.clientH}`));
console.log(`Offsets (top!=0 || left!=0): ${offsets.length}`);
offsets.forEach(o => console.log(`  slide ${o.slide}: top=${o.activeTop} left=${o.activeLeft}`));
console.log(`Console errors/warnings: ${consoleMessages.length}`);
consoleMessages.forEach(m => console.log(`  [${m.type}] ${m.text}`));
console.log(`Page errors: ${pageErrors.length}`);
pageErrors.forEach(e => console.log(`  ${e.message}`));
console.log(`Failed requests: ${failedRequests.length}`);
failedRequests.forEach(f => console.log(`  ${f.url}: ${f.failure}`));
