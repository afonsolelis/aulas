// Exporta o deck da palestra Cardiff em PDF (16:9, 1920x1080 por slide).
// Estratégia: navega slide a slide, espera as animações completarem,
// captura screenshot e depois junta tudo num PDF único com pdf-lib.
//
// Uso: node scripts/export-cardiff-pdf.mjs [output.pdf]

import { chromium } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const slideFile = 'pages/palestras/slides/slide_data-analytics.html';
const outPath = process.argv[2] || '.tmp/cardiff-shots/palestra-cardiff.pdf';
const shotsDir = '.tmp/cardiff-pdf-shots';

const url = pathToFileURL(path.resolve(slideFile)).href;
fs.mkdirSync(shotsDir, { recursive: true });
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const W = 1920;
const H = 1080;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: W, height: H } });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });

const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
console.log(`Capturando ${total} slides @ ${W}x${H}…`);

await page.addStyleTag({ content: `.slide-footer { display: none !important; }` });

// Aguarda animações específicas por slide, retornando quando o conteúdo está em seu pico.
async function waitForAnimation(page, idx) {
  const info = await page.evaluate(() => {
    const s = document.querySelector('.slide.active');
    if (!s) return { id: '', hasDrill: false, hasSql: false, hasJupyter: false, hasStory: false, hasPipeline: false, hasMedallion: false };
    return {
      id: s.id || '',
      hasDrill: !!s.querySelector('.drill-demo'),
      hasSql: !!s.querySelector('.sql-terminal'),
      hasJupyter: !!s.querySelector('.jupyter-nb, #jupyterCells'),
      hasStory: !!s.querySelector('.story-table'),
      hasPipeline: !!s.querySelector('.pipeline-step'),
      hasMedallion: !!s.querySelector('.medallion-layer'),
    };
  });

  // Tempo adaptativo baseado no tipo de animação presente
  let waitMs = 2000;
  if (info.hasStory) waitMs = 8000;
  if (info.hasPipeline) waitMs = 5000;
  if (info.hasMedallion) waitMs = 7000;
  if (info.hasDrill) waitMs = 14000;
  if (info.hasJupyter) waitMs = 18000;
  if (info.hasSql) waitMs = 18000;

  await page.waitForTimeout(waitMs);

  // Força estados finais para elementos que usam opacity:0 e classe reveal
  await page.evaluate(() => {
    const active = document.querySelector('.slide.active');
    if (!active) return;
    const revealMap = [
      ['.story-cell', 'visible'],
      ['.story-vs', 'visible'],
      ['.story-verdict', 'visible'],
      ['.pipeline-step.anim', 'step-visible'],
      ['.medallion-layer', 'layer-visible'],
      ['.medallion-arrow', 'layer-visible'],
      ['.medallion-summary', 'layer-visible'],
      ['.drill-bar-row', 'visible'],
      ['.jupyter-cell', 'jc-visible'],
      ['.sql-result-area', 'visible'],
      ['.sql-insight-box', 'visible'],
      ['.sql-result-table tr', 'visible'],
    ];
    for (const [sel, cls] of revealMap) {
      active.querySelectorAll(sel).forEach((el) => el.classList.add(cls));
    }
  });
  await page.waitForTimeout(300);
}

const pngBuffers = [];

for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => { window.showSlide(idx); }, i);
  await waitForAnimation(page, i);

  const file = path.join(shotsDir, `slide-${String(i+1).padStart(2,'0')}.png`);
  const buf = await page.screenshot({ path: file, fullPage: false, type: 'png' });
  pngBuffers.push(buf);
  console.log(`  [${i+1}/${total}] capturado`);
}

await browser.close();

console.log('Montando PDF…');
const pdf = await PDFDocument.create();
for (const buf of pngBuffers) {
  const img = await pdf.embedPng(buf);
  const pageDoc = pdf.addPage([W, H]);
  pageDoc.drawImage(img, { x: 0, y: 0, width: W, height: H });
}
const bytes = await pdf.save();
fs.writeFileSync(outPath, bytes);

const sizeMB = (bytes.byteLength / (1024 * 1024)).toFixed(2);
console.log(`PDF pronto: ${outPath} (${sizeMB} MB, ${total} páginas)`);
