#!/usr/bin/env node
/**
 * Injeta o indicador flutuante da semana do ano em todas as páginas do acervo.
 *
 * Alvo: `index.html` e todo `.html` sob `pages/`. Ficam de fora os templates de
 * `config/`, os subprojetos de `module_guidelines/` e os diretórios gerados.
 *
 * O script é idempotente: o conteúdo injetado fica entre marcadores e é
 * substituído a cada execução. Executá-lo novamente após criar uma página nova
 * é o procedimento para mantê-la coberta.
 *
 * Uso:
 *   node scripts/apply-semana.mjs             # aplica em todas as páginas
 *   node scripts/apply-semana.mjs --check     # não escreve; lista pendências
 *   node scripts/apply-semana.mjs <path>...   # aplica apenas nos caminhos dados
 *
 * O cálculo da semana está em js/semana-ano.js e a apresentação em
 * css/semana-ano.css.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const MARK = {
  cssStart: '<!-- semana:css:start -->',
  cssEnd: '<!-- semana:css:end -->',
  jsStart: '<!-- semana:js:start -->',
  jsEnd: '<!-- semana:js:end -->',
};

/** Caminho relativo de uma página até a raiz do repositório. */
function toRoot(pagePath) {
  const depth = pagePath.split('/').length - 1;
  return depth ? '../'.repeat(depth) : './';
}

/** Todas as páginas do acervo, em caminho relativo à raiz e com barra normal. */
function paginas() {
  const alvos = ['index.html'];
  const anda = (dir) => {
    for (const ent of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${ent.name}`;
      if (ent.isDirectory()) anda(rel);
      else if (ent.name.endsWith('.html')) alvos.push(rel);
    }
  };
  anda('pages');
  return alvos.sort();
}

/** Remove qualquer injeção anterior, deixando a página no estado original. */
function limpar(html) {
  const bloco = (a, b) => new RegExp(`\\s*${a}[\\s\\S]*?${b}`, 'g');
  return html.replace(bloco(MARK.cssStart, MARK.cssEnd), '').replace(bloco(MARK.jsStart, MARK.jsEnd), '');
}

/**
 * Insere a folha de estilo antes de `</head>`.
 *
 * Nem toda página do acervo importa css/inteli-styles.css, de modo que o link
 * explícito é necessário. Quando não há `<head>`, o link entra após `<body>`,
 * onde o navegador o aplica igualmente.
 */
function injetarCss(html, rel) {
  const link = `\n${MARK.cssStart}\n<link rel="stylesheet" href="${rel}css/semana-ano.css">\n${MARK.cssEnd}`;
  const head = html.lastIndexOf('</head>');
  if (head >= 0) return html.slice(0, head) + link + '\n' + html.slice(head);

  const body = /<body[^>]*>/i.exec(html);
  if (!body) return null;
  const at = body.index + body[0].length;
  return html.slice(0, at) + link + html.slice(at);
}

/** Insere o script antes de `</body>`, depois do conteúdo da página. */
function injetarJs(html, rel) {
  const tag = `${MARK.jsStart}\n<script src="${rel}js/semana-ano.js" defer></script>\n${MARK.jsEnd}`;
  const close = html.lastIndexOf('</body>');
  if (close < 0) return null;
  return html.slice(0, close) + tag + '\n' + html.slice(close);
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const alvos = args.filter((a) => !a.startsWith('--')).map((a) => a.replace(/^\.\//, ''));

  const lista = alvos.length ? alvos : paginas();
  const relatorio = { aplicadas: 0, pendentes: [], falhas: [] };

  for (const rel of lista) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      relatorio.falhas.push(`${rel} (inexistente)`);
      continue;
    }

    const original = fs.readFileSync(abs, 'utf8');
    const base = limpar(original);
    const raiz = toRoot(rel);

    const comCss = injetarCss(base, raiz);
    if (comCss === null) {
      relatorio.falhas.push(`${rel} (sem head nem body)`);
      continue;
    }
    const html = injetarJs(comCss, raiz);
    if (html === null) {
      relatorio.falhas.push(`${rel} (sem </body>)`);
      continue;
    }

    if (html === original) continue; // já coberta e atualizada
    if (check) {
      relatorio.pendentes.push(rel);
      continue;
    }
    fs.writeFileSync(abs, html);
    relatorio.aplicadas++;
  }

  if (check) {
    console.log(`páginas verificadas: ${lista.length} · pendentes: ${relatorio.pendentes.length}`);
    if (relatorio.pendentes.length) {
      console.log('sem o indicador da semana, ou desatualizadas:');
      for (const p of relatorio.pendentes) console.log(`  ${p}`);
    }
  } else {
    console.log(`páginas verificadas: ${lista.length} · alteradas: ${relatorio.aplicadas}`);
  }

  if (relatorio.falhas.length) {
    console.log('FALHAS:', relatorio.falhas);
    process.exitCode = 1;
  } else if (check && relatorio.pendentes.length) {
    process.exitCode = 1;
  }
}

main();
