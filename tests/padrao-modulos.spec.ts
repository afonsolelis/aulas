import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { listHtmlFiles, readRepoFile, resolveRepoPath } from './test-helpers';

/**
 * specs/padrao-modulos.md — padrão único de aula nos módulos da graduação.
 *
 * Toda home `pages/home-module-<N>-<curso>.html` descreve um módulo cujas aulas
 * do acervo têm, cada uma, três artefatos em pastas fixas:
 *
 *   pages/module-<N>-<curso>/slides/slide-lesson-<A>.html
 *   pages/module-<N>-<curso>/materials/lesson-<A>-material.html
 *   pages/module-<N>-<curso>/planos/lesson-<A>-plano.html
 *
 * O card da aula na home leva aos três, com os rótulos padronizados; os três se
 * ligam entre si; e os três estão registrados no index.json e no
 * config/encontros.json. Card que só aponta para fora do acervo (aula de outro
 * docente conduzida no Miro, por exemplo) não conta como aula do acervo e não
 * pode apontar para nenhum artefato local.
 *
 * Teste de filesystem: lê arquivos com `fs`, não abre browser.
 */

const homes = listHtmlFiles('pages').filter((f) => /^pages\/home-module-\d+-[a-z0-9-]+\.html$/.test(f));

const indexJson: { items: { path: string; type: string; module: string }[] } = JSON.parse(readRepoFile('index.json'));
const indexPorPath = new Map(indexJson.items.map((i) => [i.path, i]));
const encontros: { paginas: { path: string; encontro: string }[] } = JSON.parse(readRepoFile('config/encontros.json'));
const encontroPorPath = new Map(encontros.paginas.map((p) => [p.path, p.encontro]));

const ROTULOS = {
  pt: { slides: '🎞️ Slides', material: '📝 Material', plano: '🗂️ Plano de Ensino' },
  en: { slides: '🎞️ Slides', material: '📝 Material', plano: '🗂️ Lesson Plan' },
};

interface Botao { href: string; texto: string }
interface Aula { numero: number; botoes: Botao[] }

function moduloDaHome(home: string): string {
  return path.basename(home, '.html').replace(/^home-/, '');
}

/** Cards de aula da home, com os links de cada um e o texto normalizado dos botões. */
function cardsDaHome(html: string): Botao[][] {
  return html
    .split(/<div class="col-12 lesson-card/)
    .slice(1)
    .map((trecho) => trecho.split(/<div class="(?:week-block|sprint-group|col-12 lesson-card)|<\/main>|<footer|<section/)[0])
    .map((card) =>
      [...card.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
        href: m[1],
        texto: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      })),
    );
}

function aulasDaHome(home: string): { aulas: Aula[]; externos: Botao[][]; parciais: Botao[][] } {
  const modulo = moduloDaHome(home);
  const html = readRepoFile(home);
  const aulas: Aula[] = [];
  const externos: Botao[][] = [];
  const parciais: Botao[][] = [];
  for (const botoes of cardsDaHome(html)) {
    const deck = botoes.find((b) => new RegExp(`^${modulo}/slides/slide-lesson-(\\d+)\\.html$`).test(b.href));
    const locais = botoes.filter((b) => b.href.startsWith(`${modulo}/`));
    if (deck) aulas.push({ numero: Number(deck.href.match(/slide-lesson-(\d+)\.html$/)![1]), botoes });
    else if (locais.length) parciais.push(botoes);
    else externos.push(botoes);
  }
  return { aulas, externos, parciais };
}

function artefatos(modulo: string, n: number) {
  const base = `pages/${modulo}`;
  return {
    slides: `${base}/slides/slide-lesson-${n}.html`,
    material: `${base}/materials/lesson-${n}-material.html`,
    plano: `${base}/planos/lesson-${n}-plano.html`,
  };
}

/** Material gerado em JavaScript (Módulo 11): a navegação vem do gerador. */
function conteudoComGerador(arquivo: string): string {
  const html = readRepoFile(arquivo);
  const gerador = html.match(/<script[^>]*src="([^"]*lesson-content\.js)"/);
  if (!gerador) return html;
  return html + readRepoFile(path.posix.normalize(path.posix.join(path.posix.dirname(arquivo), gerador[1])));
}

/** O arquivo (ou seu gerador) aponta para `alvo` por caminho relativo à pasta da aula. */
function ligaPara(arquivo: string, alvo: string, n: number): boolean {
  const conteudo = conteudoComGerador(arquivo);
  const rel = path.posix.relative(path.posix.dirname(arquivo), alvo);
  if (conteudo.includes(`"${rel}"`) || conteudo.includes(`'${rel}'`)) return true;
  // gerador com template literal: `../planos/lesson-${lessonId}-plano.html`
  const escapado = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const molde = new RegExp('`' + escapado.replace(new RegExp(`lesson-${n}(?=\\b)`), 'lesson-\\$\\{\\w+\\}') + '`');
  return molde.test(conteudo);
}

test.describe('padrao-modulos.md — padrão único de aula nos módulos da graduação', () => {
  test('existe ao menos uma home de módulo', () => {
    expect(homes.length).toBeGreaterThan(0);
  });

  for (const home of homes) {
    const modulo = moduloDaHome(home);
    const dir = `pages/${modulo}`;

    test.describe(modulo, () => {
      test('tem config JSON com as aulas do módulo', () => {
        const cfg = `config/${modulo}.json`;
        expect(fs.existsSync(resolveRepoPath(cfg)), `${cfg} deve existir`).toBe(true);
        const lessons = JSON.parse(readRepoFile(cfg)).lessons ?? [];
        expect(lessons.length, `${cfg} deve listar as aulas`).toBeGreaterThan(0);
      });

      test('slides, material e plano ficam em slides/, materials/ e planos/, sem página de aula solta na raiz', () => {
        const soltas = listHtmlFiles(dir).filter((f) => path.posix.dirname(f) === dir && /lesson-\d+/.test(f));
        expect(soltas, 'páginas de aula fora das pastas padrão (mova-as e deixe um redirect-legado)').toEqual([]);
      });

      test('todo card com conteúdo no acervo é uma aula completa: slides, material e plano', () => {
        const { aulas, parciais } = aulasDaHome(home);
        expect(aulas.length, `${home} deve ter aulas com deck`).toBeGreaterThan(0);
        expect(parciais, 'cards com material ou plano mas sem deck').toEqual([]);

        const idioma = /<html[^>]*lang="en/i.test(readRepoFile(home)) ? 'en' : 'pt';
        const rotulos = ROTULOS[idioma];
        const problemas: string[] = [];
        for (const { numero, botoes } of aulas) {
          const a = artefatos(modulo, numero);
          for (const tipo of ['slides', 'material', 'plano'] as const) {
            const href = a[tipo].replace(/^pages\//, '');
            const botao = botoes.find((b) => b.href === href);
            if (!botao) problemas.push(`Aula ${numero}: card sem link para ${href}`);
            else if (botao.texto !== rotulos[tipo]) problemas.push(`Aula ${numero}: botão "${botao.texto}" deveria ser "${rotulos[tipo]}"`);
            if (!fs.existsSync(resolveRepoPath(a[tipo]))) problemas.push(`Aula ${numero}: falta ${a[tipo]}`);
          }
        }
        expect(problemas).toEqual([]);
      });

      test('card externo (Miro, aula de outro docente) não aponta para arquivo do acervo', () => {
        const { externos } = aulasDaHome(home);
        const locais = externos.flat().filter((b) => !/^(https?:)?\/\//.test(b.href) && !b.href.startsWith('#'));
        expect(locais).toEqual([]);
      });

      test('todo deck do módulo aparece num card da home', () => {
        const numeros = new Set(aulasDaHome(home).aulas.map((a) => a.numero));
        const decks = fs.existsSync(resolveRepoPath(`${dir}/slides`))
          ? listHtmlFiles(`${dir}/slides`).filter((f) => /\/slide-lesson-\d+\.html$/.test(f))
          : [];
        const orfaos = decks.filter((f) => !numeros.has(Number(f.match(/slide-lesson-(\d+)\.html$/)![1])));
        expect(orfaos, 'decks sem card na home').toEqual([]);
      });

      test('slides, material e plano de cada aula se ligam entre si', () => {
        const problemas: string[] = [];
        for (const { numero } of aulasDaHome(home).aulas) {
          const a = artefatos(modulo, numero);
          if (!fs.existsSync(resolveRepoPath(a.slides))) continue; // já reprovado acima
          const pares: [string, string][] = [
            [a.slides, a.material],
            [a.material, a.slides],
            [a.material, a.plano],
            [a.plano, a.slides],
            [a.plano, a.material],
          ];
          for (const [de, para] of pares) {
            if (!fs.existsSync(resolveRepoPath(de))) continue;
            if (!ligaPara(de, para, numero)) problemas.push(`${de} não liga para ${path.posix.basename(para)}`);
          }
        }
        expect(problemas).toEqual([]);
      });

      test('slides, material e plano estão no index.json e no config/encontros.json', () => {
        const problemas: string[] = [];
        const tipoEsperado = { slides: 'slide', material: 'material', plano: 'plano' } as const;
        for (const { numero } of aulasDaHome(home).aulas) {
          const a = artefatos(modulo, numero);
          for (const tipo of ['slides', 'material', 'plano'] as const) {
            const item = indexPorPath.get(a[tipo]);
            if (!item) problemas.push(`index.json sem ${a[tipo]}`);
            else {
              if (item.type !== tipoEsperado[tipo]) problemas.push(`index.json: ${a[tipo]} com type "${item.type}" (esperado "${tipoEsperado[tipo]}")`);
              if (item.module !== modulo) problemas.push(`index.json: ${a[tipo]} com module "${item.module}"`);
            }
            const enc = encontroPorPath.get(a[tipo]);
            if (!enc) problemas.push(`config/encontros.json sem ${a[tipo]}`);
            else if (enc !== `${modulo}#${numero}`) problemas.push(`config/encontros.json: ${a[tipo]} ligado a ${enc} (esperado ${modulo}#${numero})`);
          }
        }
        expect(problemas).toEqual([]);
      });
    });
  }
});
