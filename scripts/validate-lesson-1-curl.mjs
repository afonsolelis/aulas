// Validação pos-expansao slide-lesson-1.html (25 slides, terminais curl hacker)
// - Viewport 1440x900
// - Verifica window.__anime
// - Captura erros de console e pageerror
// - Navega 25 slides. Slides 9-13 (idx 8-12) = terminais, aguardam 8s
// - Screenshot por slide em .playwright-mcp/slide-lesson-1-curl-{1..25}.png
// - Valida overflow (scrollH > clientH || scrollW > clientW)
// - Nos slides 9-13 valida conteudo do terminal

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

// Mapping slide index (1-based) -> terminal id and expected status class
const terminalSlides = {
  9:  { termId: 'term-1xx', statusClass: 'hack-st-info'  },
  10: { termId: 'term-2xx', statusClass: 'hack-st-ok'    },
  11: { termId: 'term-3xx', statusClass: 'hack-st-redir' },
  12: { termId: 'term-4xx', statusClass: 'hack-st-err'   },
  13: { termId: 'term-5xx', statusClass: 'hack-st-5xx'   },
};

const results = [];
const terminalChecks = {};

for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => { window.showSlide(idx); }, i);
  const slideNum = i + 1;
  const isTerminal = !!terminalSlides[slideNum];
  const waitMs = isTerminal ? 8000 : 1500;
  await page.waitForTimeout(waitMs);

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

  if (isTerminal) {
    const tspec = terminalSlides[slideNum];
    const termCheck = await page.evaluate(({ termId, statusClass }) => {
      const el = document.getElementById(termId);
      if (!el) return { found: false };
      const text = el.textContent || '';
      const statusEls = el.querySelectorAll(`.${statusClass}`);
      const hasCurl200 = text.includes('curl -i https://api.meuapp.com/usuarios/42');
      return {
        found: true,
        textLength: text.length,
        textNonEmpty: text.trim().length > 0,
        statusCount: statusEls.length,
        hasCurl200,
        firstChars: text.slice(0, 200),
      };
    }, tspec);
    terminalChecks[slideNum] = termCheck;
  }

  const file = path.join(outDir, `slide-lesson-1-curl-${slideNum}.png`);
  await page.screenshot({ path: file, fullPage: false });

  const overflowV = metrics.scrollH > metrics.clientH;
  const overflowH = metrics.scrollW > metrics.clientW;
  const tag = (overflowV || overflowH) ? ` OVERFLOW(v=${overflowV},h=${overflowH}) scroll=${metrics.scrollW}x${metrics.scrollH} client=${metrics.clientW}x${metrics.clientH}` : '';
  console.log(`[${slideNum}/${total}]${isTerminal ? ' TERM' : ''}${tag}`);

  results.push({ slide: slideNum, ...metrics, overflowV, overflowH, file, isTerminal });
}

await browser.close();

const overflows = results.filter(r => r.overflowV || r.overflowH);

const report = {
  animeLoaded,
  totalSlides: total,
  expected: 25,
  overflows,
  terminalChecks,
  consoleMessages,
  pageErrors,
  failedRequests,
  allSlides: results,
};

fs.writeFileSync(path.join(outDir, 'lesson-1-curl-report.json'), JSON.stringify(report, null, 2));

console.log('\n=== SUMMARY ===');
console.log(`__anime: ${animeLoaded ? 'YES' : 'NO'}`);
console.log(`Total slides: ${total} (expected 25)`);
console.log(`Overflows: ${overflows.length}`);
overflows.forEach(o => console.log(`  slide ${o.slide}: scroll=${o.scrollW}x${o.scrollH} client=${o.clientW}x${o.clientH}`));
console.log(`Console errors/warnings: ${consoleMessages.length}`);
consoleMessages.forEach(m => console.log(`  [${m.type}] ${m.text}`));
console.log(`Page errors: ${pageErrors.length}`);
pageErrors.forEach(e => console.log(`  ${e.message}`));
console.log(`Failed requests: ${failedRequests.length}`);
failedRequests.forEach(f => console.log(`  ${f.url}: ${f.failure}`));
console.log('\n=== TERMINAL CHECKS ===');
for (const [slide, chk] of Object.entries(terminalChecks)) {
  console.log(`Slide ${slide}:`, JSON.stringify(chk));
}
