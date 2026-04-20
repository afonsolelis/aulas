// Validação do deck pages/module-6-eng-software/slides/slide-lesson-1.html (anime.js v4)
// Bateria de 10 checks conforme solicitada

import { chromium } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const slideFile = 'pages/module-6-eng-software/slides/slide-lesson-1.html';
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

// Esperar módulos ESM carregarem
await page.waitForTimeout(3000);

// CHECK 2: window.__anime
const animeLoaded = await page.evaluate(() => !!window.__anime);
console.log(`Check 2 - window.__anime loaded: ${animeLoaded}`);

// CHECK 4: contagem de slides
const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
console.log(`Check 4 - Total slides: ${total} (expected 24)`);

const results = [];
const coverSlideIndices = [0, 1, 21, 23]; // slides 1, 2, 22, 24
const coverParticleCounts = {};
let counter_s0_final = null;
let adjustedCosineOpacities = null;

for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => { window.showSlide(idx); }, i);
  await page.waitForTimeout(1800);

  const metrics = await page.evaluate(() => {
    const s = document.querySelector('.slide.active');
    if (!s) return null;
    const rect = s.getBoundingClientRect();
    return {
      activeTop: rect.top,
      activeLeft: rect.left,
      activeWidth: rect.width,
      activeHeight: rect.height,
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

  const file = path.join(outDir, `slide-lesson-1-m6-${i + 1}.png`);
  await page.screenshot({ path: file, fullPage: false });

  const overflowV = metrics.scrollH > metrics.clientH;
  const overflowH = metrics.scrollW > metrics.clientW;
  const displaced = metrics.activeTop !== 0 || metrics.activeLeft !== 0;
  const heightWrong = metrics.activeHeight !== 900;

  const flags = [];
  if (overflowV) flags.push(`OVERFLOW-V(scroll=${metrics.scrollH} client=${metrics.clientH})`);
  if (overflowH) flags.push(`OVERFLOW-H(scroll=${metrics.scrollW} client=${metrics.clientW})`);
  if (displaced) flags.push(`DISPLACED(top=${metrics.activeTop} left=${metrics.activeLeft})`);
  if (heightWrong) flags.push(`HEIGHT-WRONG(${metrics.activeHeight})`);

  const tag = flags.length ? ` [${flags.join(', ')}]` : '';
  console.log(`[${i + 1}/${total}]${tag}`);

  // CHECK 8: contagem de partículas nos slides cover
  if (coverSlideIndices.includes(i)) {
    const circles = await page.evaluate(() => {
      const s = document.querySelector('.slide.active');
      if (!s) return -1;
      return s.querySelectorAll('.cover-particles circle').length;
    });
    coverParticleCounts[i] = circles;
    console.log(`  Cover slide ${i} (${i + 1}): .cover-particles > circle = ${circles}`);
  }

  // CHECK 9: counter do slide 5 (idx 4)
  if (i === 4) {
    // Extra wait para contar animar
    await page.waitForTimeout(2000);
    counter_s0_final = await page.evaluate(() => {
      const el = document.querySelector('#s0 .stat-n');
      return el ? el.textContent : null;
    });
    console.log(`  Counter #s0 .stat-n final value: "${counter_s0_final}"`);
  }

  // CHECK 10: adjusted cosine opacities no slide 12 (idx 11)
  if (i === 11) {
    await page.waitForTimeout(3000);
    adjustedCosineOpacities = await page.evaluate(() => {
      const out = {};
      for (let k = 0; k < 4; k++) {
        const el = document.querySelector(`#ac${k} .pn`);
        if (!el) { out[`ac${k}`] = 'NOT_FOUND'; continue; }
        const cs = window.getComputedStyle(el);
        out[`ac${k}`] = cs.opacity;
      }
      return out;
    });
    console.log(`  Adjusted cosine opacities: ${JSON.stringify(adjustedCosineOpacities)}`);
  }

  results.push({ slide: i + 1, index: i, ...metrics, overflowV, overflowH, displaced, heightWrong, flags, file });
}

await browser.close();

const overflows = results.filter(r => r.overflowV || r.overflowH || r.displaced || r.heightWrong);

const report = {
  animeLoaded,
  totalSlides: total,
  expected: 24,
  overflows,
  coverParticleCounts,
  counter_s0_final,
  adjustedCosineOpacities,
  consoleMessages,
  pageErrors,
  failedRequests,
  allSlides: results,
};

fs.writeFileSync(path.join(outDir, 'm6-lesson-1-report.json'), JSON.stringify(report, null, 2));

console.log('\n=== SUMMARY ===');
console.log(`__anime: ${animeLoaded ? 'YES' : 'NO'}`);
console.log(`Total slides: ${total} (expected 24)`);
console.log(`Viewport issues: ${overflows.length}`);
overflows.forEach(o => console.log(`  slide ${o.slide} (idx ${o.index}): flags=${o.flags.join(' | ')}`));
console.log(`\nCover particle counts:`);
Object.entries(coverParticleCounts).forEach(([idx, n]) => console.log(`  slide idx ${idx}: ${n} circles`));
console.log(`\nCounter #s0 final: "${counter_s0_final}"`);
console.log(`\nAdjusted cosine opacities: ${JSON.stringify(adjustedCosineOpacities)}`);
console.log(`\nConsole errors/warnings: ${consoleMessages.length}`);
consoleMessages.forEach(m => console.log(`  [${m.type}] ${m.text}`));
console.log(`Page errors: ${pageErrors.length}`);
pageErrors.forEach(e => console.log(`  ${e.message}`));
console.log(`Failed requests: ${failedRequests.length}`);
failedRequests.forEach(f => console.log(`  ${f.url}: ${f.failure}`));
