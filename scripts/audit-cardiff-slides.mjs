// Auditoria de overflow dos slides da palestra Cardiff (data analytics)
// Usa .slide-content como container principal e compara com a área útil do .slide
// considerando o footer fixo. Gera PNGs e issues.json.

import { chromium } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const slideFile = 'pages/palestras/slides/slide_data-analytics.html';
const outDir = '.tmp/cardiff-shots';
const width = parseInt(process.argv[2] || '1920');
const height = parseInt(process.argv[3] || '1080');

const url = pathToFileURL(path.resolve(slideFile)).href;
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width, height } });
const page = await context.newPage();
await page.goto(url);

const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
console.log(`Deck: ${path.basename(slideFile)} · ${total} slides @ ${width}x${height}`);

const issues = [];
for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => { window.showSlide(idx); }, i);
  await page.waitForTimeout(1200);

  const m = await page.evaluate(() => {
    const active = document.querySelector('.slide.active');
    if (!active) return null;
    const sc = active.querySelector('.slide-content');
    if (!sc) return null;
    const scR = sc.getBoundingClientRect();
    const footer = document.querySelector('.slide-footer');
    const footerTop = footer ? footer.getBoundingClientRect().top : window.innerHeight;
    const title = (active.querySelector('.slide-title')?.textContent || '').trim().slice(0, 80);
    const margin = 12;
    const exceedsBottom = scR.bottom > footerTop;
    const exceedsTop = scR.top < 0;
    const tight = !exceedsBottom && (footerTop - scR.bottom) < margin;
    return {
      title,
      scTop: Math.round(scR.top),
      scBottom: Math.round(scR.bottom),
      scHeight: Math.round(scR.height),
      footerTop: Math.round(footerTop),
      viewportH: window.innerHeight,
      exceedsBottom,
      exceedsTop,
      tight,
      overlapBottomPx: exceedsBottom ? Math.round(scR.bottom - footerTop) : 0,
      overlapTopPx: exceedsTop ? Math.round(-scR.top) : 0,
      slackPx: Math.round(footerTop - scR.bottom),
    };
  });

  const file = path.join(outDir, `slide-${String(i+1).padStart(2,'0')}.png`);
  await page.screenshot({ path: file, fullPage: false });

  let flag = '';
  if (m.exceedsBottom) flag += ` BOTTOM +${m.overlapBottomPx}px`;
  if (m.exceedsTop) flag += ` TOP +${m.overlapTopPx}px`;
  if (!flag && m.tight) flag = ` TIGHT (${m.slackPx}px)`;

  console.log(`[${String(i+1).padStart(2,'0')}/${total}] "${m.title}" sc=${m.scHeight}px${flag ? ' OVERFLOW' + flag : ' OK'}`);
  if (m.exceedsBottom || m.exceedsTop || m.tight) {
    issues.push({ slide: i+1, file, ...m });
  }
}

await browser.close();
fs.writeFileSync(path.join(outDir, 'issues.json'), JSON.stringify(issues, null, 2));
console.log(`\nProblemas detectados: ${issues.length}`);
if (issues.length > 0) {
  console.log('Detalhes:', path.join(outDir, 'issues.json'));
}
