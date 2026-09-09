import { test, expect } from '@playwright/test';
import { listHtmlFiles, readRepoFile } from './test-helpers';

/**
 * Garante a cobertura do indicador flutuante da semana do ano e a correção do
 * cálculo ISO 8601 que o alimenta.
 *
 * Escopo: index.html + todo .html em pages/, o mesmo escopo do index.json.
 * Fora do escopo: config/template*.html e os subprojetos de module_guidelines/.
 *
 * A injeção é feita por `node scripts/apply-semana.mjs`, idempotente. Ao criar
 * uma página nova, execute o script para cobri-la.
 */

const paginas = ['index.html', ...listHtmlFiles('pages')].sort();

/** Profundidade da página traduzida em prefixo relativo até a raiz. */
function rel(pagina: string): string {
  const depth = pagina.split('/').length - 1;
  return depth ? '../'.repeat(depth) : './';
}

test.describe('indicador da semana do ano — cobertura', () => {
  test('toda página do acervo deve importar css/semana-ano.css', () => {
    const faltando = paginas.filter((p) => !readRepoFile(p).includes('css/semana-ano.css'));
    expect(
      faltando,
      `Páginas sem a folha do indicador (rode: node scripts/apply-semana.mjs):\n${faltando.join('\n')}`
    ).toEqual([]);
  });

  test('toda página do acervo deve carregar js/semana-ano.js', () => {
    const faltando = paginas.filter((p) => !readRepoFile(p).includes('js/semana-ano.js'));
    expect(
      faltando,
      `Páginas sem o script do indicador (rode: node scripts/apply-semana.mjs):\n${faltando.join('\n')}`
    ).toEqual([]);
  });

  test('os caminhos até css/ e js/ devem ser relativos e corretos por profundidade', () => {
    const erradas: string[] = [];
    for (const p of paginas) {
      const html = readRepoFile(p);
      const prefixo = rel(p);
      if (!html.includes(`href="${prefixo}css/semana-ano.css"`)) erradas.push(`${p} — CSS`);
      if (!html.includes(`src="${prefixo}js/semana-ano.js"`)) erradas.push(`${p} — JS`);
    }
    expect(erradas, `Caminho relativo incorreto:\n${erradas.join('\n')}`).toEqual([]);
  });

  test('a injeção deve ficar entre marcadores, para permanecer idempotente', () => {
    const semMarcador = paginas.filter((p) => {
      const html = readRepoFile(p);
      return !(
        html.includes('<!-- semana:css:start -->') &&
        html.includes('<!-- semana:css:end -->') &&
        html.includes('<!-- semana:js:start -->') &&
        html.includes('<!-- semana:js:end -->')
      );
    });
    expect(semMarcador, `Injeção sem marcadores:\n${semMarcador.join('\n')}`).toEqual([]);
  });

  test('o indicador não deve aparecer na página impressa', () => {
    const css = readRepoFile('css/semana-ano.css');
    expect(css).toMatch(/@media print[\s\S]*\.semana-badge[\s\S]*display:\s*none/);
  });
});

test.describe('indicador da semana do ano — cálculo ISO 8601', () => {
  // O módulo é carregado por avaliação direta: o arquivo é servido ao navegador
  // como script clássico e não usa sintaxe de módulo.
  const fonte = readRepoFile('js/semana-ano.js');
  const carregar = () => {
    const exportado: { semanaIso?: Function; semanasNoAno?: Function } = {};
    const mod = { exports: exportado };
    new Function('module', 'exports', fonte)(mod, exportado);
    return mod.exports as {
      semanaIso: (d: Date) => { semana: number; ano: number };
      semanasNoAno: (ano: number) => number;
    };
  };

  test('a semana e o ano ISO devem coincidir com a norma nas datas de borda', () => {
    const { semanaIso } = carregar();
    const casos: Array<[number, number, number, number, number]> = [
      // [ano, mês (1-12), dia, semana ISO esperada, ano ISO esperado]
      [2026, 1, 1, 1, 2026], // 1º de janeiro em quinta-feira abre a semana 1
      [2026, 9, 9, 37, 2026],
      [2026, 12, 31, 53, 2026], // 2026 tem 53 semanas
      [2027, 1, 1, 53, 2026], // sexta-feira ainda pertence ao ano ISO anterior
      [2025, 12, 29, 1, 2026], // segunda-feira já abre o ano ISO seguinte
      [2024, 12, 30, 1, 2025],
    ];
    for (const [ano, mes, dia, semana, anoIso] of casos) {
      const r = semanaIso(new Date(ano, mes - 1, dia));
      expect(r, `${dia}/${mes}/${ano}`).toEqual({ semana, ano: anoIso });
    }
  });

  test('o total de semanas do ano deve ser 52, ou 53 nos anos longos', () => {
    const { semanasNoAno } = carregar();
    const esperado: Record<number, number> = {
      2020: 53, // bissexto com 1º de janeiro em quarta-feira
      2024: 52,
      2025: 52,
      2026: 53, // 1º de janeiro em quinta-feira
      2027: 52,
      2032: 53,
    };
    for (const [ano, total] of Object.entries(esperado)) {
      expect(semanasNoAno(Number(ano)), `ano ${ano}`).toBe(total);
    }
  });
});
