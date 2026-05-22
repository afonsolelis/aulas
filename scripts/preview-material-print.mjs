// Preview da visualização em tela (com botão Imprimir) e validação do @media print.
//
// Uso: node scripts/preview-material-print.mjs

import { chromium } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const file = 'pages/palestras/materials/data-analytics-material.html';
const outDir = '.tmp/material-print';
fs.mkdirSync(outDir, { recursive: true });

const url = pathToFileURL(path.resolve(file)).href;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });

// Captura do header na tela (screen mode) — confere o botão novo
await page.screenshot({ path: path.join(outDir, 'screen-header.png'), clip: { x: 0, y: 0, width: 1280, height: 220 } });

// Agora emula print e gera PDF A4
await page.emulateMedia({ media: 'print' });
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, 'print-preview-top.png'), fullPage: false });

const pdfPath = path.join(outDir, 'material-print.pdf');
await page.pdf({
  path: pdfPath,
  format: 'A4',
  margin: { top: '1.6cm', bottom: '1.6cm', left: '1.8cm', right: '1.8cm' },
  printBackground: true,
});

await browser.close();
const stats = fs.statSync(pdfPath);
console.log(`PDF gerado: ${pdfPath} (${(stats.size/1024/1024).toFixed(2)} MB)`);
console.log(`Screenshot tela: ${outDir}/screen-header.png`);
