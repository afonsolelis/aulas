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

  test('as classes de cor dos cards de disciplinas devem seguir o padrão estabelecido', () => {
    expect(indexHtml).toContain('card-header-si');
    expect(indexHtml).toContain('card-header-eng-software');
    expect(indexHtml).toContain('card-header-adm-tech');
    expect(indexHtml).toContain('card-header-common');

    expect(css).toMatch(/\.card-header-si\s*\{[\s\S]*background-color:\s*var\(--si-blue\)/);
    expect(css).toMatch(/\.card-header-eng-software\s*\{[\s\S]*background-color:\s*var\(--eng-software-yellow\)/);
    expect(css).toMatch(/\.card-header-adm-tech\s*\{[\s\S]*background-color:\s*var\(--adm-tech-navy\)/);
    expect(css).toMatch(/\.card-header-common\s*\{[\s\S]*background-color:\s*var\(--inteli-dark-gray\)/);
  });
});
