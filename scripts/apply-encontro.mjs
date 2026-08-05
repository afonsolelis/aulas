#!/usr/bin/env node
/**
 * Aplica o padrão de encontro a todas as páginas de aula do acervo:
 *
 *   1. botão flutuante de exportação em PDF, com o nome de arquivo padronizado
 *      pelo Inteli (ANO-MÊS-DIA-Nome-NoSequencial);
 *   2. ficha do encontro — objetivo de aprendizagem, estratégia e estrutura.
 *
 * A fonte de verdade é `config/encontros.json`. O script é idempotente: o
 * conteúdo injetado fica entre marcadores e é substituído a cada execução.
 *
 * Uso:
 *   node scripts/apply-encontro.mjs            # aplica em todas as páginas
 *   node scripts/apply-encontro.mjs --check    # não escreve; lista pendências
 *   node scripts/apply-encontro.mjs <path>...  # aplica apenas nos caminhos dados
 *
 * Ver .claude/skills/padrao-encontro/SKILL.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = path.join(ROOT, 'config/encontros.json');

const MARK = {
  metaStart: '<!-- encontro:meta:start -->',
  metaEnd: '<!-- encontro:meta:end -->',
  pdfStart: '<!-- encontro:pdf:start -->',
  pdfEnd: '<!-- encontro:pdf:end -->',
  cssStart: '<!-- encontro:css:start -->',
  cssEnd: '<!-- encontro:css:end -->',
};

const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Caminho relativo de uma página até a raiz do repositório. */
function toRoot(pagePath) {
  const depth = pagePath.split('/').length - 1;
  return depth ? '../'.repeat(depth) : './';
}

function fichaHtml(enc, { titulo }) {
  const itens = enc.agenda.map((a) => `<li>${esc(a)}</li>`).join('');
  return (
    `<section class="encontro-meta" data-encontro-ficha>` +
    `<h2>Sobre este encontro</h2>` +
    `<p class="encontro-ref">${esc(titulo)}${enc.data ? ` · ${esc(enc.data.split('-').reverse().join('/'))}` : ''} · Prof. ${esc(enc.docente)}</p>` +
    `<div class="encontro-item" data-encontro="objetivo"><h3>Objetivo de aprendizagem</h3><p>${esc(enc.objetivo)}</p></div>` +
    `<div class="encontro-item" data-encontro="estrategia"><h3>Estratégia do encontro</h3><p>${esc(enc.estrategia)}</p></div>` +
    `<div class="encontro-item" data-encontro="agenda"><h3>Estrutura do encontro</h3><ol>${itens}</ol></div>` +
    `</section>`
  );
}

function botaoHtml(enc, seq, rel) {
  return (
    `${MARK.pdfStart}\n` +
    `<button type="button" class="pdf-export-btn" ` +
    `data-encontro-data="${esc(enc.data || '')}" ` +
    `data-encontro-docente="${esc(enc.docente)}" ` +
    `data-encontro-seq="${esc(seq)}" ` +
    `title="Exportar esta página em PDF com o nome padronizado">📄 Exportar PDF</button>\n` +
    `<script src="${rel}js/encontro-pdf.js" defer></script>\n` +
    `${MARK.pdfEnd}`
  );
}

/** Remove qualquer injeção anterior, deixando a página no estado original. */
function limpar(html) {
  const bloco = (a, b) => new RegExp(`\\s*${a}[\\s\\S]*?${b}`, 'g');
  return html
    .replace(bloco(MARK.metaStart, MARK.metaEnd), '')
    .replace(bloco(MARK.pdfStart, MARK.pdfEnd), '')
    .replace(bloco(MARK.cssStart, MARK.cssEnd), '');
}

/**
 * Garante a folha de estilo do padrão de encontro. Nem toda página de aula
 * importa css/inteli-styles.css — sem o link explícito, o botão fica sem
 * estilo e a folha de impressão A4 não se aplica.
 */
function injetarCss(html, rel) {
  const link =
    `\n${MARK.cssStart}\n` +
    `<link rel="stylesheet" href="${rel}css/encontro.css">\n` +
    `${MARK.cssEnd}`;
  const head = html.lastIndexOf('</head>');
  if (head >= 0) return html.slice(0, head) + link + '\n' + html.slice(head);
  const body = /<body[^>]*>/i.exec(html);
  if (!body) return link + html;
  const at = body.index + body[0].length;
  return html.slice(0, at) + link + html.slice(at);
}

/** Índice logo após o fechamento do elemento aberto em `open`. */
function fimDoElemento(html, open, tag) {
  const re = new RegExp(`</?${tag}\\b`, 'gi');
  re.lastIndex = open;
  let nivel = 0;
  let m;
  while ((m = re.exec(html))) {
    nivel += m[0][1] === '/' ? -1 : 1;
    if (nivel === 0) return html.indexOf('>', m.index) + 1;
  }
  return -1;
}

function injetarDeckEstatico(html, ficha) {
  const m = /<(div|section)[^>]*class="[^"]*slide-container[^"]*"[^>]*>/i.exec(html);
  if (!m) return null;
  const slide =
    `\n${MARK.metaStart}\n` +
    `<div class="slide encontro-slide"><div class="sc">${ficha}</div></div>\n` +
    `${MARK.metaEnd}\n`;

  const fim = fimDoElemento(html, m.index, m[1]);
  if (fim >= 0) {
    const fechamento = html.lastIndexOf(`</${m[1]}>`, fim);
    return html.slice(0, fechamento) + slide + html.slice(fechamento);
  }

  // Algumas páginas antigas não fecham o container; nesse caso o slide entra
  // imediatamente antes do rodapé de navegação, que é o fim do deck na prática.
  const rodape = /<(?:div|footer)[^>]*class="[^"]*(?:slide-footer|lesson-footer)[^"]*"[^>]*>/i.exec(html);
  const at = rodape ? rodape.index : html.lastIndexOf('</body>');
  if (at < 0) return null;
  return html.slice(0, at) + slide + html.slice(at);
}

function injetarPaginaTexto(html, ficha) {
  const bloco = `\n${MARK.metaStart}\n<div class="container" style="max-width:1100px;margin:24px auto 0;padding:0 16px;">${ficha}</div>\n${MARK.metaEnd}\n`;
  // Após o cabeçalho da página, quando houver; caso contrário, logo após <body>.
  const header = /<\/(header|div)>\s*(?=<(?:div|main|section|article)[^>]*class="(?:mat-layout|container|material-body|plan-body)")/i.exec(html);
  if (header) {
    const at = header.index + header[0].length;
    return html.slice(0, at) + bloco + html.slice(at);
  }
  const cabecalhos = [
    /<\/header>/i,
    /<div class="material-header"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i,
  ];
  for (const re of cabecalhos) {
    const m = re.exec(html);
    if (m) {
      const at = m.index + m[0].length;
      return html.slice(0, at) + bloco + html.slice(at);
    }
  }
  const body = /<body[^>]*>/i.exec(html);
  if (!body) return null;
  const at = body.index + body[0].length;
  return html.slice(0, at) + bloco + html.slice(at);
}

function injetarBotao(html, botao) {
  const close = html.lastIndexOf('</body>');
  if (close < 0) return html + `\n${botao}\n`;
  return html.slice(0, close) + `${botao}\n` + html.slice(close);
}

/**
 * Sobe o total estático de slides. Só se aplica às páginas que não recalculam
 * o total em JavaScript — nas demais o valor do HTML é sobrescrito na carga.
 */
function corrigirTotalSlides(html) {
  if (/getElementById\(['"]total-slides['"]\)\s*\.\s*textContent\s*=/.test(html)) return html;
  if (/total-slides['"]\s*\)\s*\.\s*innerHTML\s*=/.test(html)) return html;
  return html.replace(
    /(<span id="total-slides">)(\d+)(<\/span>)/,
    (_, a, n, b) => `${a}${Number(n) + 1}${b}`,
  );
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const alvos = args.filter((a) => !a.startsWith('--'));

  const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
  const paginas = alvos.length ? cfg.paginas.filter((p) => alvos.includes(p.path)) : cfg.paginas;

  const relatorio = { aplicadas: 0, deckEstatico: 0, deckGerado: 0, texto: 0, semEncontro: [], falhas: [] };

  for (const pg of paginas) {
    const abs = path.join(ROOT, pg.path);
    const enc = cfg.encontros[pg.encontro];
    if (!enc) {
      relatorio.semEncontro.push(pg.path);
      continue;
    }

    let html = limpar(fs.readFileSync(abs, 'utf8'));
    const ficha = fichaHtml(enc, { titulo: enc.titulo });
    const geradoPorJs = /class="lesson-deck"|renderLessonSlides|renderLessonMaterial|renderLessonPlan/.test(html);

    if (geradoPorJs) {
      // A ficha destas páginas é montada por lesson-content.js a partir dos
      // mesmos dados; aqui injeta-se apenas o botão e os dados do encontro.
      relatorio.deckGerado++;
    } else if (/class="[^"]*slide-container/i.test(html)) {
      const r = injetarDeckEstatico(html, ficha);
      if (!r) {
        relatorio.falhas.push(pg.path);
        continue;
      }
      html = corrigirTotalSlides(r);
      relatorio.deckEstatico++;
    } else {
      const r = injetarPaginaTexto(html, ficha);
      if (!r) {
        relatorio.falhas.push(pg.path);
        continue;
      }
      html = r;
      relatorio.texto++;
    }

    const rel = toRoot(pg.path);
    html = injetarCss(html, rel);
    html = injetarBotao(html, botaoHtml(enc, pg.seq, rel));

    if (!check) fs.writeFileSync(abs, html);
    relatorio.aplicadas++;
  }

  console.log(
    `páginas: ${relatorio.aplicadas} (deck estático ${relatorio.deckEstatico}, ` +
      `deck gerado ${relatorio.deckGerado}, texto ${relatorio.texto})`,
  );
  if (relatorio.semEncontro.length) console.log('sem ficha de encontro:', relatorio.semEncontro);
  if (relatorio.falhas.length) {
    console.log('FALHAS:', relatorio.falhas);
    process.exitCode = 1;
  }
}

main();
