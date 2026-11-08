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
  if (head >= 0) {
    // css/inteli-ds.css tem de ser a última folha do <head> (specs/design-system.md,
    // regra 2), então o indicador entra antes do bloco do design system quando ele existe.
    const ds = ds_inicio(html.slice(0, head));
    const at = ds >= 0 ? ds : head;
    return html.slice(0, at) + link + '\n' + html.slice(at);
  }

  const body = /<body[^>]*>/i.exec(html);
  if (!body) return null;
  const at = body.index + body[0].length;
  return html.slice(0, at) + link + html.slice(at);
}

/** Posição do bloco do design system no <head>: o marcador `<!-- ds:css -->` ou o link de inteli-ds.css. */
function ds_inicio(head) {
  const marcador = head.lastIndexOf('<!-- ds:css -->');
  if (marcador >= 0) return marcador;
  const link = /<link[^>]*inteli-ds\.css[^>]*>/g;
  let m, ultimo = -1;
  while ((m = link.exec(head))) ultimo = m.index;
  return ultimo;
}

/**
 * A página já tem o indicador completo e válido: a folha com o caminho certo,
 * antes do bloco do design system quando ele existe, e o script com o caminho
 * certo antes de `</body>`. Nesse caso o script não reescreve a página, para
 * não mover blocos que já estão corretos.
 */
function jaCoberta(html, rel) {
  const css = html.indexOf(MARK.cssStart);
  const js = html.indexOf(MARK.jsStart);
  if (css < 0 || js < 0) return false;
  const blocoCss = html.slice(css, html.indexOf(MARK.cssEnd, css));
  const blocoJs = html.slice(js, html.indexOf(MARK.jsEnd, js));
  if (!blocoCss.includes(`href="${rel}css/semana-ano.css"`)) return false;
  if (!blocoJs.includes(`${rel}js/semana-ano.js`)) return false;
  const head = html.lastIndexOf('</head>');
  if (head >= 0) {
    if (css > head) return false;
    const ds = ds_inicio(html.slice(0, head));
    if (ds >= 0 && css > ds) return false;
  }
  return js < html.lastIndexOf('</body>');
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
    const raiz = toRoot(rel);
    if (jaCoberta(original, raiz)) continue; // indicador presente, no lugar e com os caminhos certos
    const base = limpar(original);

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
