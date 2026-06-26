import { test, expect } from '@playwright/test';
import { listHtmlFiles, readRepoFile } from './test-helpers';

/**
 * Garante que /index.json (índice de conteúdo do acervo) permaneça em sincronia
 * com os arquivos HTML do repositório — ver Key Rule 7 no CLAUDE.md.
 *
 * Escopo indexado: index.html + todo .html em pages/.
 * Fora do escopo: .aiox-core/, playwright-report/, config/template*.html.
 */

interface IndexItem {
  path: string;
  type: string;
  module: string;
  title: string;
  summary: string;
}

interface ContentIndex {
  total: number;
  counts_by_type: Record<string, number>;
  counts_by_module: Record<string, number>;
  items: IndexItem[];
}

const index = JSON.parse(readRepoFile('index.json')) as ContentIndex;

// Arquivos reais no escopo do índice.
const scopedFiles = ['index.html', ...listHtmlFiles('pages')].sort();

const indexedPaths = index.items.map((item) => item.path).sort();

test.describe('index.json — sincronia com o acervo', () => {
  test('todo HTML de pages/ (e index.html) deve ter uma entrada no index.json', () => {
    const missing = scopedFiles.filter((file) => !indexedPaths.includes(file));
    expect(
      missing,
      `Arquivos sem entrada no index.json (adicione { path, type, module, title, summary }):\n${missing.join('\n')}`
    ).toEqual([]);
  });

  test('nenhuma entrada do index.json deve apontar para um arquivo inexistente', () => {
    const scopedSet = new Set(scopedFiles);
    const orphans = indexedPaths.filter((p) => !scopedSet.has(p));
    expect(
      orphans,
      `Entradas no index.json sem arquivo correspondente (remova ou corrija o path):\n${orphans.join('\n')}`
    ).toEqual([]);
  });

  test('não deve haver paths duplicados no index.json', () => {
    const seen = new Set<string>();
    const dups = new Set<string>();
    index.items.forEach((item) => {
      if (seen.has(item.path)) dups.add(item.path);
      seen.add(item.path);
    });
    expect([...dups], `Paths duplicados no index.json:\n${[...dups].join('\n')}`).toEqual([]);
  });

  test('cada item deve ter path, type, module, title e summary preenchidos', () => {
    const invalid = index.items
      .filter((item) => !item.path || !item.type || !item.module || !item.title || !item.summary?.trim())
      .map((item) => item.path || '(sem path)');
    expect(invalid, `Itens com campos vazios:\n${invalid.join('\n')}`).toEqual([]);
  });

  test('total e counts_by_* devem refletir os items', () => {
    expect(index.total, 'total deve igualar o número de items').toBe(index.items.length);

    const typeCounts: Record<string, number> = {};
    const moduleCounts: Record<string, number> = {};
    index.items.forEach((item) => {
      typeCounts[item.type] = (typeCounts[item.type] ?? 0) + 1;
      moduleCounts[item.module] = (moduleCounts[item.module] ?? 0) + 1;
    });

    expect(index.counts_by_type, 'counts_by_type deve refletir os items').toEqual(typeCounts);
    expect(index.counts_by_module, 'counts_by_module deve refletir os items').toEqual(moduleCounts);
  });
});
