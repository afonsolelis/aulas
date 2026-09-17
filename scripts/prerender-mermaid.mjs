#!/usr/bin/env node
/**
 * Pré-renderiza todos os blocos <div class="mermaid"> de um arquivo HTML para
 * SVG inline. Usa Playwright para rodar Mermaid em browser headless, navega
 * por todos os slides para disparar o lazy render, captura cada SVG e
 * substitui o source Mermaid pelo SVG no arquivo.
 *
 * Uso:
 *   node scripts/prerender-mermaid.mjs <caminho-do-arquivo>
 *
 * Exemplo:
 *   node scripts/prerender-mermaid.mjs pages/module-2-common/slides/slide-lesson-4.html
 */

import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { RAIZ, caminhoNoProjeto, relativoAoProjeto } from './lib/entrada.mjs';

const arg = process.argv[2];
if (!arg) {
  console.error('Uso: node scripts/prerender-mermaid.mjs <arquivo.html>');
  process.exit(1);
}

// O arquivo vem da linha de comando e é reescrito no fim: resolvê-lo contra a
// raiz impede que um `../` no argumento leia ou sobrescreva fora do projeto.
let file;
try {
  file = caminhoNoProjeto(arg, 'arquivo');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
if (!file.endsWith('.html')) {
  console.error('O alvo precisa ser um arquivo .html do acervo.');
  process.exit(1);
}

const PORT = 9876;

// Binário do próprio projeto, em caminho absoluto: não depende do PATH nem do
// npx, que buscaria o pacote na rede se ele faltasse em node_modules.
const HTTP_SERVER = path.join(RAIZ, 'node_modules', '.bin',
  process.platform === 'win32' ? 'http-server.cmd' : 'http-server');

function startServer() {
  if (!existsSync(HTTP_SERVER)) {
    return Promise.reject(new Error(`http-server não encontrado em ${HTTP_SERVER}. Rode npm ci.`));
  }
  const proc = spawn(HTTP_SERVER, [RAIZ, '-p', String(PORT), '--silent'], {
    stdio: 'pipe',
    shell: process.platform === 'win32',
  });
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => resolve(proc), 2500);
    proc.on('error', (err) => { clearTimeout(timeout); reject(err); });
  });
}

async function main() {
  console.log(`Iniciando servidor HTTP em :${PORT}…`);
  const server = await startServer();

  let svgs = [];
  try {
    console.log('Carregando Playwright (Chromium)…');
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

    const url = `http://localhost:${PORT}/${relativoAoProjeto(file)}`;
    console.log(`Acessando ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
    const mermaidCount = await page.evaluate(() => document.querySelectorAll('.mermaid').length);

    if (mermaidCount === 0) {
      console.log('Nenhum bloco .mermaid encontrado. Saindo.');
      await browser.close();
      return;
    }
    console.log(`Encontrados ${mermaidCount} blocos Mermaid em ${total} slides.`);
    console.log('Navegando por todos os slides para forçar o lazy render…');
    for (let i = 0; i < total; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(700);
    }
    // Volta ao primeiro só por garantia
    await page.waitForTimeout(800);

    svgs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.mermaid')).map((b) => {
        const svg = b.querySelector('svg');
        return svg ? svg.outerHTML : '';
      })
    );

    await browser.close();

    const failed = svgs.filter((s) => !s).length;
    if (failed > 0) {
      throw new Error(`${failed} blocos Mermaid não renderizaram para SVG`);
    }
    console.log(`✓ ${svgs.length} SVGs capturados.`);
  } finally {
    server.kill();
  }

  console.log(`Patchando ${file}…`);
  let html = await readFile(file, 'utf-8');

  // Captura cada <div class="mermaid"...>...</div> em ordem (não-greedy).
  // Aceita atributos extras como data-rendered (idempotente em re-runs).
  const re = /<div class="mermaid"[^>]*>([\s\S]*?)<\/div>/g;
  const matches = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length, full: m[0] });
  }

  if (matches.length !== svgs.length) {
    throw new Error(
      `Mismatch: HTML tem ${matches.length} blocos, browser renderizou ${svgs.length}`
    );
  }

  // Substitui de trás pra frente para preservar índices.
  for (let i = matches.length - 1; i >= 0; i--) {
    const { start, end } = matches[i];
    const replacement = `<div class="mermaid" data-rendered="prerendered">${svgs[i]}</div>`;
    html = html.slice(0, start) + replacement + html.slice(end);
  }

  await writeFile(file, html, 'utf-8');
  console.log(`✓ ${matches.length} blocos Mermaid substituídos por SVG inline em ${file}`);
}

main().catch((e) => {
  console.error('ERRO:', e);
  process.exit(1);
});
