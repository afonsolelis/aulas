#!/usr/bin/env node
/**
 * Gera os arquivos derivados do kit do treinamento da Copel.
 *
 * Os .md e o .csv da pasta do kit são a fonte de verdade. Este script produz, com o
 * LibreOffice em modo headless:
 *   - benchmark/relatorio-benchmark-ia-distribuicao.docx (a partir do .md)
 *   - propostas/*.docx, conselho/proposta-b-medicao-inteligente.docx e
 *     conselho/cartoes-de-papel.docx (a partir dos .md)
 *   - benchmark/indicadores-distribuidoras.xlsx (a partir do .csv pt-BR)
 *   - documento-do-participante.docx (montado a partir do canvas, dos casos, do registro
 *     e da preparação para a reunião do conselho)
 *
 * Uso: node scripts/kit-copel/build-kit.mjs
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const BASE = path.join(REPO, 'pages/palestras/assets/copel');
const KIT = path.join(BASE, 'kit-ia-na-pratica');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-copel-'));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

/** Conversor mínimo de markdown para HTML: títulos, parágrafos, listas, citação, tabela e código. */
function mdToHtml(md) {
  const out = [];
  const lines = md.replace(/\r/g, '').split('\n');
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('```')) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++;
      out.push(`<pre style="font-family:Consolas,monospace;font-size:9pt;background:#f3f3f3;padding:6pt">${esc(buf.join('\n'))}</pre>`);
      continue;
    }
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
      out.push('<table border="1" cellpadding="4" style="border-collapse:collapse">');
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
      out.push(`<blockquote><i>${inline(buf.join(' '))}</i></blockquote>`);
      continue;
    }
    if (/^\s*(\d+\.|-)\s/.test(l)) {
      const ordered = /^\s*\d+\./.test(l);
      const items = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('|')) {
        if (/^\s*(\d+(\.\d+)*\.?|-)\s/.test(lines[i]) && !/^\s{3,}\d+\.\d/.test(lines[i]) || items.length === 0) {
          items.push(lines[i].replace(/^\s*(\d+\.|-)\s/, ''));
        } else {
          items[items.length - 1] += ' ' + lines[i].trim();
        }
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>` + items.map((t) => `<li>${inline(t)}</li>`).join('') + `</${tag}>`);
      continue;
    }
    if (l.trim() === '') { i++; continue; }
    const buf = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^(#|\||>|```|\s*(\d+\.|-)\s)/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

const page = (title, body) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt} th{background:#e8e8e8}</style></head><body>${body}</body></html>`;

function soffice(args, cwd) {
  execFileSync('soffice', ['--headless', `-env:UserInstallation=file://${TMP}/profile`, ...args], { cwd, stdio: 'pipe' });
}

function htmlToDocx(html, destino) {
  const nome = path.basename(destino, '.docx');
  const src = path.join(TMP, `${nome}.html`);
  fs.writeFileSync(src, html);
  soffice(['--convert-to', 'docx:MS Word 2007 XML', '--outdir', TMP, src], TMP);
  fs.copyFileSync(path.join(TMP, `${nome}.docx`), destino);
}

const ler = (rel) => fs.readFileSync(path.join(KIT, rel), 'utf8');

// 1. Relatório do benchmark, propostas e cartões de papel em .docx
for (const [titulo, rel] of [
  ['Benchmark de mercado', 'benchmark/relatorio-benchmark-ia-distribuicao.md'],
  ['Proposta PRJ-2026-014', 'propostas/proposta-a-ia-perdas.md'],
  ['Proposta PRJ-2026-019', 'propostas/proposta-c-religacao.md'],
  ['Proposta PRJ-2026-021', 'conselho/proposta-b-medicao-inteligente.md'],
  ['Cartões de papel', 'conselho/cartoes-de-papel.md'],
]) {
  htmlToDocx(page(titulo, mdToHtml(ler(rel))), path.join(KIT, rel.replace(/\.md$/, '.docx')));
}

// 2. Planilha em .xlsx (CSV com ponto e vírgula, aspas, UTF-8, primeira linha, idioma pt-BR)
const csv = path.join(TMP, 'indicadores-distribuidoras.csv');
fs.copyFileSync(path.join(KIT, 'benchmark/indicadores-distribuidoras.csv'), csv);
soffice(['--infilter=CSV:59,34,76,1,,1046', '--convert-to', 'xlsx', '--outdir', TMP, csv], TMP);
fs.copyFileSync(path.join(TMP, 'indicadores-distribuidoras.xlsx'), path.join(KIT, 'benchmark/indicadores-distribuidoras.xlsx'));

// 3. Documento do participante
const campo = (n = 6) => '<table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><td>' + '&nbsp;<br>'.repeat(n) + '</td></tr></table>';
const contagem = '<table border="1" cellpadding="4" style="border-collapse:collapse;width:100%"><tr><th>Ponto</th><th>Achado pelo Prompt 0 (sim/não)</th><th>Achado pelo Prompt 1 (sim/não)</th><th>Onde a saída apontou</th></tr>'
  + [1, 2, 3, 4, 5, 6, 7].map((n) => `<tr><td>${n}</td><td></td><td></td><td></td></tr>`).join('')
  + '<tr><td>Pontos adicionais</td><td></td><td></td><td></td></tr></table>';
// Os títulos internos descem um nível para ficarem abaixo das seções numeradas do documento.
const semTitulo = (md) => md.replace(/^# .*\n/, '').replace(/^## /gm, '### ');
const participante = [
  '<h1>Documento do participante</h1>',
  '<p>IA na Prática e Prototipagem · Copel · AI for Business. Participante: ______________________________________ Área: ________________</p>',
  '<p>Uma cópia por participante. Cole aqui, sem editar, as saídas das ferramentas, e preencha os campos na ordem das práticas.</p>',
  '<h2>1. Canvas de anatomia do workflow (Prática 1)</h2>', mdToHtml(semTitulo(ler('canvas-anatomia.md'))),
  '<h2>2. Saída do Prompt 0 sobre a minuta A (Prática 2)</h2>', campo(10),
  '<h2>3. Saída do Prompt 1 sobre a minuta A (Prática 2)</h2>', campo(10),
  '<h2>4. Contagem de pontos</h2>', contagem,
  '<h2>5. Uma afirmação sem base de cada saída</h2>', '<p>Prompt 0:</p>', campo(2), '<p>Prompt 1:</p>', campo(2),
  '<h2>6. Instruções das três skills do workflow (Prática 3)</h2>',
  '<p>Extração, versão 1:</p>', campo(4), '<p>Verificação, versão 1:</p>', campo(4), '<p>Parecer, versão 1:</p>', campo(4),
  '<p>Versão 2 (etapa, componente e o que mudou):</p>', campo(3),
  '<h2>7. Casos de teste</h2>', mdToHtml(semTitulo(ler('mvp-zero/casos-de-teste.md'))),
  '<h2>8. Registro de iterações</h2>', mdToHtml(semTitulo(ler('mvp-zero/registro-de-iteracoes.md'))),
  '<h2>9. Reunião do conselho: preparação</h2>',
  '<p>Papel e posição atribuídos:</p>', campo(1),
  '<p>Parecer do workflow sobre a proposta B (cole sem editar):</p>', campo(10),
  '<p>Três argumentos, cada um com a seção da proposta ou o achado do parecer que o sustenta:</p>', campo(6),
  '<p>A objeção que espero ouvir e como responderia:</p>', campo(3),
].join('\n');
htmlToDocx(page('Documento do participante', participante), path.join(KIT, 'documento-do-participante.docx'));

fs.rmSync(TMP, { recursive: true, force: true });
console.log('kit gerado:', path.relative(REPO, KIT));
