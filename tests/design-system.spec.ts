/**
 * specs/design-system.md: Design System Inteli v2.
 *
 * Confere, em todas as páginas do portal, as regras que dá para verificar no
 * código: o carregamento de css/inteli-ds.css (regra 2), a ausência das cores
 * convertidas (regra 9), das fontes antigas (regra 12) e de raio fora da escala
 * (regra 16), além dos tokens da paleta (regra 5). Por fim, confere que o
 * script de aplicação não teria mais nada a mudar, e que todo material de
 * leitura fora de pages/palestras/ usa o layout terminal (regra 33).
 */
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { listHtmlFiles, readRepoFile, resolveRepoPath } from './test-helpers';

const paginas = ['index.html', ...listHtmlFiles('pages')];

function listarCss(): string[] {
  const saida: string[] = [];
  const andar = (dir: string) => {
    for (const e of fs.readdirSync(resolveRepoPath(dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) andar(rel);
      else if (e.name.endsWith('.css')) saida.push(rel);
    }
  };
  andar('pages');
  for (const f of fs.readdirSync(resolveRepoPath('css'))) if (f.endsWith('.css')) saida.push(`css/${f}`);
  return saida;
}

const folhas = listarCss();
const todos = [...paginas, ...folhas];

test.describe('design-system.md: Design System Inteli v2', () => {
  test('css/inteli-ds.css define a paleta Inteli e os tokens de forma', () => {
    const ds = readRepoFile('css/inteli-ds.css');
    const paleta: Record<string, string> = {
      '--inteli-roxo': '#2e2640',
      '--inteli-verde': '#89cea5',
      '--inteli-coral': '#ff4545',
      '--inteli-cinza-400': '#b2b6bf',
      '--inteli-cinza-300': '#caced6',
      '--inteli-cinza-100': '#e6eaeb',
      '--inteli-branco': '#ffffff',
    };
    for (const [token, valor] of Object.entries(paleta)) {
      expect(ds, token).toMatch(new RegExp(`${token}:\\s*${valor};`, 'i'));
    }
    expect(ds).toMatch(/--ds-raio-3:\s*6px;/);
    expect(ds).toMatch(/family=Inter/);
    expect(ds).toMatch(/family=JetBrains\+Mono/);
  });

  test('toda página carrega css/inteli-ds.css como última folha antes de </head>', () => {
    const faltando: string[] = [];
    for (const rel of paginas) {
      const html = readRepoFile(rel);
      const cabeca = html.split(/<\/head>/i)[0];
      const m = cabeca.match(/<link[^>]*href="([^"]*inteli-ds\.css)"[^>]*>\s*$/);
      if (!m) { faltando.push(rel); continue; }
      const alvo = path.resolve(path.dirname(resolveRepoPath(rel)), m[1]);
      if (alvo !== resolveRepoPath('css/inteli-ds.css')) faltando.push(`${rel} (caminho ${m[1]})`);
    }
    expect(faltando).toEqual([]);
  });

  test('nenhuma página usa as fontes substituídas', () => {
    const proibidas = /\b(Manrope|Azurio|Space Mono|Courier New|Fira Code|Merriweather)\b/;
    const achados = todos.filter((rel) => proibidas.test(readRepoFile(rel)));
    expect(achados).toEqual([]);
  });

  test('raio de borda fica em 0, 2, 4 ou 6 px (ou 50%)', () => {
    const achados: string[] = [];
    for (const rel of todos) {
      const txt = readRepoFile(rel);
      for (const m of txt.matchAll(/border(?:-(?:top|bottom)-(?:left|right))?-radius\s*:\s*([^;"}{!]+)/gi)) {
        for (const v of m[1].matchAll(/(-?\d*\.?\d+)(px|rem|em)\b/g)) {
          const px = parseFloat(v[1]) * (v[2] === 'px' ? 1 : 16);
          if (![0, 2, 4, 6].includes(px)) achados.push(`${rel}: ${m[0].trim()}`);
        }
      }
    }
    expect(achados.slice(0, 20)).toEqual([]);
  });

  test('toda cor hexadecimal pertence à paleta Inteli ou às derivações (exceto em pages/palestras/)', async () => {
    const { CORES, PERMITIDAS } = await import('../scripts/aplicar-design-system.mjs');
    const achados: string[] = [];
    for (const rel of todos.filter((r) => !r.startsWith('pages/palestras/'))) {
      const txt = readRepoFile(rel);
      for (const m of txt.matchAll(/(?<![&\w])#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F\w])/g)) {
        const cor = m[0].toLowerCase();
        const fora = cor.length === 7 ? !PERMITIDAS.has(cor) : Boolean(CORES[cor]);
        if (fora) achados.push(`${rel}: ${m[0]}`);
      }
    }
    expect(achados.slice(0, 20)).toEqual([]);
  });

  test('o script de aplicação não teria nada a mudar', async () => {
    const { transformar } = await import('../scripts/aplicar-design-system.mjs');
    const pendentes = todos.filter((rel) => {
      if (rel === 'css/inteli-ds.css') return false;
      const txt = readRepoFile(rel);
      return transformar(txt, resolveRepoPath(rel)) !== txt;
    });
    expect(pendentes).toEqual([]);
  });
  test('todo material de leitura fora de pages/palestras/ usa o layout terminal (regra 33)', () => {
    const materiais = paginas.filter((p) => /\/materials\/[^/]+\.html$/.test(p) && !p.startsWith('pages/palestras/'));
    expect(materiais.length).toBeGreaterThan(0);
    const fora = materiais.filter((rel) => !/<body[^>]*class="[^"]*\btm-material\b/.test(readRepoFile(rel)));
    expect(fora, 'materiais sem <body class="tm-material">').toEqual([]);
  });
});
