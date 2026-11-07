import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { extractAnchorHrefs, extractImgTags, readRepoFile, resolveRepoPath } from './test-helpers';

const indexHtml = readRepoFile('index.html');
const css = readRepoFile('css/inteli-styles.css');

test.describe('Página Inicial (index.html) - Validação de Identidade e Estrutura', () => {
  test('o logo do Inteli deve existir com alt e imagem remota configurada', () => {
    const imgTags = extractImgTags(indexHtml);
    const logoTag = imgTags.find((tag) => /Inteli Logo/i.test(tag));

    expect(logoTag).toBeDefined();
    expect(logoTag).toMatch(/\balt=(["'])Inteli Logo\1/);
    expect(logoTag).toMatch(/res\.cloudinary\.com/);
  });

  test('todos os cards devem apontar para um arquivo "home-*.html"', () => {
    const cardLinks = extractAnchorHrefs(indexHtml).filter((href) => href.startsWith('pages/home-'));

    expect(cardLinks.length).toBeGreaterThan(0);

    cardLinks.forEach((href) => {
      expect(href, `O link "${href}" deve começar com "pages/home-"`).toMatch(/^pages\/home-/);
      expect(fs.existsSync(resolveRepoPath(href)), `O arquivo ${href} não foi encontrado no repositório`).toBe(true);
    });
  });

  // specs/design-system.md, regras 21 e 22: a cor do curso é um quadrado no cabeçalho do card.
  test('as classes de cor dos cards de disciplinas devem seguir o padrão estabelecido', () => {
    const ds = readRepoFile('css/inteli-ds.css');
    expect(indexHtml).toContain('ds-curso-si');
    expect(indexHtml).toContain('ds-curso-eng-software');
    expect(indexHtml).toContain('ds-curso-adm-tech');
    expect(indexHtml).toContain('ds-curso-comum');

    expect(ds).toMatch(/--ds-curso-si:\s*var\(--inteli-verde\)/);
    expect(ds).toMatch(/--ds-curso-eng-software:\s*var\(--inteli-coral\)/);
    expect(ds).toMatch(/--ds-curso-adm-tech:\s*var\(--inteli-roxo\)/);
    expect(ds).toMatch(/--ds-curso-comum:\s*var\(--inteli-cinza-400\)/);
    expect(css).toMatch(/\.card-header-si\s*\{[^}]*--ds-curso:\s*var\(--si-blue\)/);
    expect(css).toMatch(/\.card-header-eng-software\s*\{[^}]*--ds-curso:\s*var\(--eng-software-yellow\)/);
    expect(css).toMatch(/\.card-header-adm-tech\s*\{[^}]*--ds-curso:\s*var\(--adm-tech-navy\)/);
    expect(css).toMatch(/\.card-header-common\s*\{[^}]*--ds-curso:\s*var\(--inteli-dark-gray\)/);
  });
});
