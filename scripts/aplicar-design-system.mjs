#!/usr/bin/env node
/**
 * Aplica o Design System Inteli v2 (specs/design-system.md) às páginas do portal.
 *
 *   node scripts/aplicar-design-system.mjs            aplica e grava
 *   node scripts/aplicar-design-system.mjs --check    só relata o que mudaria (sai com 1 se houver mudança)
 *   node scripts/aplicar-design-system.mjs arquivo…   limita a arquivos específicos
 *
 * O que faz, em cada .html de pages/ (e index.html) e em cada .css do portal:
 *   1. Fontes: troca os links do Google Fonts pelo par Inter + JetBrains Mono e
 *      substitui Manrope, Azurio, Space Mono, Courier New, Fira Code e Merriweather.
 *   2. Peso: 800 e 900 passam a 700.
 *   3. Raio: 0–2px → 2px, 3–5px → 4px, 6–49px → 6px, pílula (≥ 50px) → 4px. 50% fica.
 *   4. Sombra: sombra difusa (desfoque ≥ 10px) vira o contorno do sistema.
 *   5. Hover: deslocamento vertical maior que 1px e escala são anulados.
 *   6. Cor: cores de outras paletas viram o equivalente Inteli (tabela CORES).
 *      Gradiente entre cores sólidas vira cor única. Não se aplica a pages/palestras/.
 *   7. HTML: injeta css/inteli-ds.css como última folha de estilo do <head>.
 *
 * O script é idempotente: rodar de novo não muda nada.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const URL_FONTES = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap';

export const FONTES_PROIBIDAS = ['Manrope', 'Azurio', 'Space Mono', 'Courier New', 'Fira Code', 'Merriweather'];
const TROCA_FONTE = {
  'Manrope': 'Inter',
  'Azurio': 'Inter',
  'Merriweather': 'Inter',
  'Space Mono': 'JetBrains Mono',
  'Courier New': 'JetBrains Mono',
  'Fira Code': 'JetBrains Mono',
};

/* Cor de outra paleta → cor Inteli de mesmo papel. Ver docs/design-system.md, seção Conversão. */
const GRUPOS = {
  // texto forte, ação, fundo escuro, azuis e violetas de destaque
  '#2e2640': ['#0f0f0f', '#111827', '#0f172a', '#1e293b', '#1f2937', '#334155', '#1e1829', '#12082c', '#1a172a',
    '#4a3d6b', '#450a0a', '#212529', '#1863dc', '#1d4ed8', '#3b82f6', '#2563eb', '#1e40af', '#1e3a8a', '#0d6efd',
    '#7c3aed', '#855ede', '#8b5cf6', '#6d28d9', '#5b21b6', '#4c1d95', '#6b4dbb', '#0dcaf0', '#0ea5e9', '#0284c7'],
  // texto corrido
  '#4d475d': ['#374151', '#4b5563', '#475569', '#5c5c5c', '#3f3f46', '#52525b', '#5a5470', '#444444', '#333333', '#444', '#333'],
  // texto suave
  '#777283': ['#64748b', '#6b7280', '#666666', '#666', '#71717a', '#78716c', '#6c757d', '#979da8', '#555555', '#555'],
  // texto fraco
  '#a19da9': ['#94a3b8', '#9ca3af', '#a1a1aa', '#999999', '#999'],
  // borda forte e tons claros de destaque
  '#caced6': ['#cbd5e1', '#d1d5db', '#d4d4d8', '#a78bfa', '#60a5fa', '#93c5fd', '#c4b5fd', '#adb5bd'],
  // borda
  '#dbdfe3': ['#e2e8f0', '#dfe5ec', '#e8ecf1', '#e5e7eb', '#d6d9e6', '#e4e4e7', '#dee2e6'],
  // fundo fraco
  '#f3f5f5': ['#f1f4f8', '#f8fafc', '#f1f5f9', '#f3f4f6', '#f9fafb', '#f2f2ee', '#fafafa', '#f8f9fa', '#f5f7fb'],
  // tinta de roxo
  '#f3f2f4': ['#eff6ff', '#f5f3ff', '#eef2ff', '#f4f2fa', '#f0f9ff'],
  '#e9e7ec': ['#dbeafe', '#ede9fe', '#e0e7ff', '#bfdbfe', '#ddd6fe', '#e9e5f5', '#e0f2fe'],
  // verde de preenchimento
  '#2f8f78': ['#0d9488', '#10b981', '#22c55e', '#16a34a', '#059669', '#14b8a6', '#5eb88a', '#198754', '#20c997'],
  // verde de texto
  '#267562': ['#15803d', '#14532d', '#166534', '#047857', '#065f46', '#0f766e', '#115e59', '#6fb88c'],
  // verde claro
  '#89cea5': ['#4ade80', '#34d399', '#2dd4bf'],
  '#d0ebdb': ['#bbf7d0', '#a7f3d0', '#86efac', '#99f6e4', '#6ee7b7'],
  '#edf8f2': ['#dcfce7', '#f0fdf4', '#d1fae5', '#ccfbf1', '#ecfdf5', '#f0fdfa'],
  // coral de preenchimento (vermelhos e âmbares: a paleta Inteli tem um só tom quente)
  '#ff4545': ['#dc2626', '#ef4444', '#f87171', '#e63e3e', '#c62828', '#f43f5e', '#e11d48', '#dc3545',
    '#d97706', '#f59e0b', '#fbbf24', '#eab308', '#ca8a04', '#f97316', '#ea580c', '#ffc107', '#fd7e14'],
  // coral de texto
  '#d53f44': ['#b91c1c', '#991b1b', '#7f1d1d', '#b45309', '#92400e', '#78350f', '#9a3412', '#854d0e', '#a16207'],
  // coral claro
  '#ffd1d1': ['#fecaca', '#fca5a5', '#fde68a', '#fcd34d', '#fed7aa'],
  '#ffecec': ['#fee2e2', '#fef2f2', '#fef3c7', '#fffbeb', '#fef9c3', '#fff7ed', '#ffedd5', '#fff1f2'],
};

export const CORES = {};
for (const [destino, origens] of Object.entries(GRUPOS)) {
  for (const o of origens) CORES[o] = destino;
}

/* Cores que ficam como estão: paleta Inteli, derivações documentadas, preto
   (usado em sombras e sobreposições) e o tema Catppuccin dos blocos de código. */
export const PERMITIDAS = new Set([
  '#2e2640', '#89cea5', '#ff4545', '#b2b6bf', '#caced6', '#e6eaeb', '#ffffff', '#000000',
  '#251e33', '#f3f2f4', '#e9e7ec', '#2f8f78', '#267562', '#edf8f2', '#d0ebdb', '#d53f44',
  '#ffecec', '#ffd1d1', '#201b2d', '#4d475d', '#777283', '#a19da9', '#f3f5f5', '#dbdfe3',
  // Catppuccin Mocha
  '#f5e0dc', '#f2cdcd', '#f5c2e7', '#cba6f7', '#f38ba8', '#eba0ac', '#fab387', '#f9e2af',
  '#a6e3a1', '#94e2d5', '#89dceb', '#74c7ec', '#89b4fa', '#b4befe', '#cdd6f4', '#bac2de',
  '#a6adc8', '#9399b2', '#7f849c', '#6c7086', '#585b70', '#45475a', '#313244', '#1e1e2e',
  '#181825', '#11111b',
]);

/* Regra geral para cor fora da tabela: o papel sai do matiz e da luminosidade. */
export function papelInteli([r, g, b]) {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const L = (max + min) / 2;
  const d = max - min;
  const S = d === 0 ? 0 : d / (1 - Math.abs(2 * L - 1));
  let H = 0;
  if (d) {
    if (max === R) H = 60 * (((G - B) / d) % 6);
    else if (max === G) H = 60 * ((B - R) / d + 2);
    else H = 60 * ((R - G) / d + 4);
    if (H < 0) H += 360;
  }
  if (S < 0.25 || L > 0.96) {
    if (L < 0.25) return '#2e2640';
    if (L < 0.42) return '#4d475d';
    if (L < 0.58) return '#777283';
    if (L < 0.74) return '#a19da9';
    if (L < 0.84) return '#caced6';
    if (L < 0.915) return '#dbdfe3';
    if (L < 0.985) return '#f3f5f5';
    return '#ffffff';
  }
  if (H >= 80 && H < 195) {           // verdes e turquesas
    if (L < 0.4) return '#267562';
    if (L < 0.58) return '#2f8f78';
    if (L < 0.76) return '#89cea5';
    if (L < 0.9) return '#d0ebdb';
    return '#edf8f2';
  }
  if (H < 80 || H >= 315) {           // vermelhos, laranjas, amarelos, rosas
    if (L < 0.22) return '#2e2640';
    if (L < 0.47) return '#d53f44';
    if (L < 0.72) return '#ff4545';
    if (L < 0.88) return '#ffd1d1';
    return '#ffecec';
  }
  // azuis e violetas
  if (L < 0.72) return '#2e2640';
  if (L < 0.8) return '#caced6';
  if (L < 0.92) return '#e9e7ec';
  return '#f3f2f4';
}

function rgbParaHex([r, g, b]) {
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

function hexParaRgb(h) {
  let s = h.slice(1);
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}

/* ---------------------------------------------------------------- funções */

function trocarFontes(txt, ehHtml) {
  const url = ehHtml ? URL_FONTES.replace(/&/g, '&amp;') : URL_FONTES;
  txt = txt.replace(/https:\/\/fonts\.googleapis\.com\/css2?\?[^"')\s]*/g, (m) => {
    if (/[?&](amp;)?family=Material/.test(m)) return m;
    return url;
  });
  for (const [de, para] of Object.entries(TROCA_FONTE)) {
    txt = txt.replace(new RegExp(`\\b${de.replace(' ', '\\s')}\\b`, 'g'), para);
  }
  // evita repetir a família na mesma lista: 'JetBrains Mono','JetBrains Mono'
  txt = txt.replace(/(['"])JetBrains Mono\1\s*,\s*(['"]?)JetBrains Mono\2/g, '$1JetBrains Mono$1');
  return txt;
}

function trocarPesos(txt) {
  return txt
    .replace(/(font-weight\s*:\s*)(800|900)\b/g, '$1700')
    .replace(/(fontWeight\s*[:=]\s*['"]?)(800|900)\b/g, '$1700');
}

function raioPx(valor) {
  const m = /^(-?\d*\.?\d+)(px|rem|em)$/.exec(valor);
  if (!m) return valor;
  const px = parseFloat(m[1]) * (m[2] === 'px' ? 1 : 16);
  if (px <= 0) return '0';
  if (px >= 50) return '4px';
  if (px <= 2) return '2px';
  if (px <= 5) return '4px';
  return '6px';
}

function trocarRaios(txt) {
  txt = txt.replace(/(border(?:-(?:top|bottom)-(?:left|right))?-radius\s*:\s*)([^;"}{!]+)/gi, (m, pre, val) =>
    pre + val.replace(/-?\d*\.?\d+(px|rem|em)\b/g, (v) => raioPx(v)));
  txt = txt.replace(/(borderRadius\s*[:=]\s*)(['"])([^'"]+)\2/g, (m, pre, q, val) =>
    pre + q + val.replace(/-?\d*\.?\d+(px|rem|em)\b/g, (v) => raioPx(v)) + q);
  return txt;
}

function trocarSombras(txt) {
  return txt.replace(/(box-shadow\s*:\s*)([^;"}{]+)/gi, (m, pre, val) => {
    if (/var\(--ds-|none|inset/i.test(val)) return m;
    const imp = /!important/.test(val) ? ' !important' : '';
    const fim = val.match(/\s*$/)[0];
    // desfoque = terceiro comprimento de cada camada
    let maior = 0;
    for (const camada of val.split(/,(?![^(]*\))/)) {
      const nums = camada.replace(/rgba?\([^)]*\)|hsla?\([^)]*\)|var\([^)]*\)/g, '').match(/-?\d*\.?\d+(px|rem)?/g) || [];
      if (nums.length >= 3) maior = Math.max(maior, parseFloat(nums[2]) * (/rem/.test(nums[2]) ? 16 : 1));
    }
    if (maior < 10) return m;
    const token = maior >= 20 ? 'var(--ds-sombra-2)' : 'var(--ds-sombra-1)';
    return pre + token + imp + fim;
  });
}

function hoverCss(css) {
  // percorre as regras pelo fechamento '}' (linear, sem retrocesso)
  return css.split('}').map((pedaco) => {
    const k = pedaco.lastIndexOf('{');
    if (k < 0) return pedaco;
    const sel = pedaco.slice(Math.max(0, k - 400), k);
    const ultimoSel = sel.slice(Math.max(sel.lastIndexOf(';'), sel.lastIndexOf('{')) + 1);
    if (!ultimoSel.includes(':hover')) return pedaco;
    const corpo = pedaco.slice(k + 1)
      .replace(/translateY\(\s*-\s*(\d*\.?\d+)px\s*\)/g, (t, n) => (parseFloat(n) > 1 ? 'translateY(-1px)' : t))
      .replace(/scale\(\s*1\.\d+\s*\)/g, 'scale(1)');
    return pedaco.slice(0, k + 1) + corpo;
  }).join('}');
}

function trocarHover(txt, ehHtml) {
  if (!ehHtml) return hoverCss(txt);
  return txt.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (m, a, css, b) => a + hoverCss(css) + b);
}

export function corInteli(hex) {
  const h = hex.toLowerCase();
  if (CORES[h]) return CORES[h];
  if (h.length !== 7 || PERMITIDAS.has(h)) return h;
  return papelInteli(hexParaRgb(h));
}

function trocarCores(txt) {
  // (?<![&\w]) evita entidades HTML (&#039;) e identificadores
  txt = txt.replace(/(?<![&\w])#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F\w])/g, (m) => {
    const novo = corInteli(m);
    return novo === m.toLowerCase() ? m : novo;
  });
  txt = txt.replace(/(rgba?\(\s*)(\d{1,3})(\s*,\s*)(\d{1,3})(\s*,\s*)(\d{1,3})(?=\s*[,)])/g,
    (m, a, r, s1, g, s2, b) => {
      const hex = rgbParaHex([+r, +g, +b]);
      const novo = corInteli(hex);
      if (novo === hex) return m;
      const [r2, g2, b2] = hexParaRgb(novo);
      return `${a}${r2}${s1}${g2}${s2}${b2}`;
    });
  return txt;
}

function argumentos(args) {
  const partes = [];
  let nivel = 0, atual = '';
  for (const c of args) {
    if (c === '(') nivel++;
    if (c === ')') nivel--;
    if (c === ',' && nivel === 0) { partes.push(atual.trim()); atual = ''; continue; }
    atual += c;
  }
  partes.push(atual.trim());
  return partes
    .filter((p) => !/^(to\s|-?\d*\.?\d+(deg|turn|rad)\b|at\s)/.test(p))
    .map((p) => p.replace(/\s+-?\d*\.?\d+%(\s+-?\d*\.?\d+%)?\s*$/, '').trim());
}

function trocarGradientes(txt) {
  let saida = '', i = 0;
  const alvo = 'linear-gradient(';
  for (;;) {
    const j = txt.indexOf(alvo, i);
    if (j < 0) { saida += txt.slice(i); break; }
    const repetido = txt.slice(Math.max(0, j - 10), j) === 'repeating-';
    let k = j + alvo.length, nivel = 1;
    while (k < txt.length && nivel > 0) {
      if (txt[k] === '(') nivel++;
      else if (txt[k] === ')') nivel--;
      k++;
    }
    const inteiro = txt.slice(j, k);
    saida += txt.slice(i, j);
    const cores = argumentos(txt.slice(j + alvo.length, k - 1));
    const opacas = cores.length >= 2 && cores.every((c) =>
      /^(#[0-9a-f]{3}|#[0-9a-f]{6}|var\(--[\w-]+\)|white|black|color-mix\((?![^)]*transparent)[^]*\))$/i.test(c));
    const unica = cores.every((c) => c.toLowerCase() === cores[0].toLowerCase());
    saida += !repetido && opacas && !unica ? `linear-gradient(${cores[0]},${cores[0]})` : inteiro;
    i = k;
  }
  return saida;
}

function injetarDs(txt, arquivo) {
  if (/css\/inteli-ds\.css/.test(txt)) return txt;
  const rel = path.relative(path.dirname(arquivo), RAIZ).replace(/\\/g, '/');
  const href = (rel ? rel + '/' : './') + 'css/inteli-ds.css';
  return txt.replace(/<\/head>/i, `<!-- ds:css -->\n<link rel="stylesheet" href="${href}">\n</head>`);
}

/* ---------------------------------------------------------------- principal */

export function transformar(txt, arquivo) {
  const rel = path.relative(RAIZ, arquivo).replace(/\\/g, '/');
  const ehHtml = rel.endsWith('.html');
  const comCor = !rel.startsWith('pages/palestras/');
  let t = txt;
  t = trocarFontes(t, ehHtml);
  t = trocarPesos(t);
  t = trocarRaios(t);
  t = trocarSombras(t);
  t = trocarHover(t, ehHtml);
  if (comCor) {
    t = trocarCores(t);
    t = trocarGradientes(t);
  }
  if (ehHtml) t = injetarDs(t, arquivo);
  return t;
}

export function arquivosDoPortal() {
  const lista = [path.join(RAIZ, 'index.html')];
  const andar = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) andar(p);
      else if (/\.(html|css)$/.test(e.name)) lista.push(p);
    }
  };
  andar(path.join(RAIZ, 'pages'));
  for (const f of fs.readdirSync(path.join(RAIZ, 'css'))) {
    if (f.endsWith('.css') && f !== 'inteli-ds.css') lista.push(path.join(RAIZ, 'css', f));
  }
  return lista;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const alvos = args.filter((a) => !a.startsWith('--'));
  const arquivos = alvos.length ? alvos.map((a) => path.resolve(a)) : arquivosDoPortal();
  let mudados = 0;
  for (const f of arquivos) {
    const antes = fs.readFileSync(f, 'utf8');
    const depois = transformar(antes, f);
    if (antes !== depois) {
      mudados++;
      if (check) console.log('mudaria:', path.relative(RAIZ, f));
      else fs.writeFileSync(f, depois);
    }
  }
  console.log(`${check ? 'mudariam' : 'alterados'}: ${mudados} de ${arquivos.length} arquivos`);
  if (check && mudados) process.exit(1);
}
