#!/usr/bin/env node
/**
 * Gera os PDFs do kit da Rede Aurora, empresa fictícia da oficina AI for Business da turma
 * Iguatemi (Módulo III, IA na Prática).
 *
 * As fontes de verdade são os .md de scripts/kit-iguatemi/fontes/, que não são publicados.
 * Cada .md vira um PDF A4 em pages/palestras/assets/iguatemi/kit/, com o prefixo
 * "rede-aurora-", renderizado pelo Chromium do Playwright. Os participantes sobem esses
 * PDFs na base de conhecimento do Projeto que criam no Claude.
 *
 * Uso: node scripts/kit-iguatemi/build-kit.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const FONTES = path.join(REPO, 'scripts/kit-iguatemi/fontes');
const SAIDA = path.join(REPO, 'pages/palestras/assets/iguatemi/kit');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

/** Conversor mínimo de markdown: títulos, parágrafos, listas, citação e tabela. */
function mdToHtml(md) {
  const out = [];
  const lines = md.replace(/\r/g, '').split('\n');
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.trim() === '') { i++; continue; }
    if (/^#{1,6} /.test(l)) {
      const n = l.match(/^#+/)[0].length;
      out.push(`<h${n}>${inline(l.slice(n + 1))}</h${n}>`);
      i++;
      continue;
    }
    if (l.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const body = rows.filter((r) => !/^\|[\s|:-]+\|$/.test(r));
      out.push('<table>');
      body.forEach((r, k) => {
        const tag = k === 0 ? 'th' : 'td';
        out.push('<tr>' + cells(r).map((c) => `<${tag}>${inline(c) || '&nbsp;'}</${tag}>`).join('') + '</tr>');
      });
      out.push('</table>');
      continue;
    }
    if (l.startsWith('>')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<p class="aviso">${inline(buf.join(' '))}</p>`);
      continue;
    }
    if (/^(\d+\.|-)\s/.test(l)) {
      const ordered = /^\d+\./.test(l);
      const items = [];
      while (i < lines.length && /^(\d+\.|-)\s/.test(lines[i])) items.push(lines[i++].replace(/^(\d+\.|-)\s/, ''));
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((it) => `<li>${inline(it)}</li>`).join('')}</${tag}>`);
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^(#|\||>|\d+\.\s|-\s)/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

const CSS = `
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Inter, "Helvetica Neue", Arial, sans-serif; color: #2e2640; font-size: 10pt; line-height: 1.5; margin: 0; }
  .topo { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #2e2640; padding-bottom: 6pt; margin-bottom: 14pt; font-family: "JetBrains Mono", Consolas, monospace; font-size: 7.5pt; letter-spacing: .08em; text-transform: uppercase; }
  .topo b { font-size: 9pt; }
  h1 { font-size: 18pt; line-height: 1.2; margin: 0 0 10pt; }
  h2 { font-size: 12pt; margin: 16pt 0 6pt; padding-bottom: 3pt; border-bottom: 1px solid #caced6; }
  p { margin: 0 0 8pt; text-align: justify; }
  p.aviso { font-size: 8.5pt; padding: 6pt 9pt; border-left: 3pt solid #ff4545; background: #f4f4f6; text-align: left; }
  ul, ol { margin: 0 0 8pt; padding-left: 16pt; }
  li { margin-bottom: 3pt; }
  table { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; font-size: 8.5pt; page-break-inside: avoid; }
  th { background: #2e2640; color: #fff; text-align: left; padding: 5pt 6pt; font-weight: 600; }
  td { padding: 4pt 6pt; border-bottom: 1px solid #e6eaeb; vertical-align: top; }
  tr:nth-child(even) td { background: #f7f7f9; }
`;

function pagina(titulo, corpo) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(titulo)}</title><style>${CSS}</style></head>
<body><div class="topo"><b>Rede Aurora</b><span>Empresa fictícia · Inteli Exec · AI for Business</span></div>${corpo}</body></html>`;
}

fs.mkdirSync(SAIDA, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const arquivo of fs.readdirSync(FONTES).filter((f) => f.endsWith('.md')).sort()) {
  const md = fs.readFileSync(path.join(FONTES, arquivo), 'utf8');
  const titulo = (md.match(/^# (.+)$/m) || [, arquivo])[1];
  const nome = 'rede-aurora-' + arquivo.replace(/^\d+-/, '').replace(/\.md$/, '.pdf');
  await page.setContent(pagina(titulo, mdToHtml(md)), { waitUntil: 'load' });
  await page.pdf({ path: path.join(SAIDA, nome), format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font-size:7pt;color:#6b6478;text-align:center;font-family:Arial">Documento fictício, com números sintéticos, criado para a oficina · página <span class="pageNumber"></span> de <span class="totalPages"></span></div>' });
  console.log('gerado', path.relative(REPO, path.join(SAIDA, nome)));
}
await browser.close();
