import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { listHtmlFiles, readRepoFile, resolveRepoPath } from './test-helpers';

/**
 * Material e plano do Módulo 11 são páginas GERADAS: o arquivo tem ~40 linhas e
 * todo o conteúdo nasce de `renderLessonMaterial` / `renderLessonPlan`, em
 * pages/module-11-eng-software/lesson-content.js.
 *
 * Isso cria um ponto cego: um spec que apenas lê o HTML do arquivo não enxerga
 * nada do que a página mostra. Foi assim que a navegação flutuante exigida por
 * specs/lesson-materials.md ficou ausente de todas essas páginas sem que nenhum
 * teste reprovasse. Este spec fecha a lacuna verificando o GERADOR: se o padrão
 * sair de lá, some de doze páginas de uma vez.
 *
 * Continua sendo um teste de filesystem — lê arquivos com `fs`, não abre browser.
 */

const GENERATOR = 'pages/module-11-eng-software/lesson-content.js';
const STYLESHEET = 'pages/module-11-eng-software/lesson-content.css';

test.describe('module-11 — páginas geradas (material e plano)', () => {
  const generator = readRepoFile(GENERATOR);
  const stylesheet = readRepoFile(STYLESHEET);

  test('o gerador monta barra de progresso e nav flutuante', () => {
    expect(generator).toContain('mountFloatNav');
    expect(generator).toContain('progress-bar');
    expect(generator).toContain('float-nav');
  });

  test('material e plano chamam mountFloatNav com o próprio cabeçalho', () => {
    expect(generator).toMatch(/mountFloatNav\('\.material-head'/);
    expect(generator).toMatch(/mountFloatNav\('\.plan-head'/);
  });

  test('a nav leva às outras duas faces do encontro e à home do módulo', () => {
    // material → slides, plano, módulo
    expect(generator).toMatch(/slides\/slide-lesson-\$\{lessonId\}\.html/);
    expect(generator).toMatch(/planos\/lesson-\$\{lessonId\}-plano\.html/);
    // plano → slides, material, módulo
    expect(generator).toMatch(/materials\/lesson-\$\{lessonId\}-material\.html/);
    expect(generator).toContain('home-module-11-eng-software.html');
  });

  test('a nav não é duplicada em página que já traz a sua', () => {
    // Os materiais artesanais (aulas 1 e 5) declaram #float-nav no próprio HTML.
    expect(generator).toMatch(/if \(document\.getElementById\('float-nav'\)\) return;/);
  });

  test('o CSS define os elementos flutuantes e os três estilos de botão', () => {
    expect(stylesheet).toMatch(/#progress-bar\s*\{[^}]*position:\s*fixed/);
    expect(stylesheet).toMatch(/#float-nav\s*\{[^}]*position:\s*fixed/);
    expect(stylesheet).toContain('#float-nav.visible');
    ['fn-btn-slides', 'fn-btn-alt', 'fn-btn-back'].forEach((cls) => {
      expect(stylesheet).toContain(`.${cls}`);
    });
  });

  test('a impressão em PDF continua ocultando os elementos flutuantes', () => {
    const encontro = readRepoFile('css/encontro.css');
    expect(encontro).toContain('#float-nav');
    expect(encontro).toContain('#progress-bar');
  });

  test('toda aula com material tem também plano e slide, para nenhum botão apontar ao vazio', () => {
    const materiais = listHtmlFiles('pages/module-11-eng-software/materials');
    expect(materiais.length).toBeGreaterThan(0);

    materiais.forEach((file) => {
      const numero = file.match(/lesson-(\d+)-material\.html$/)?.[1];
      expect(numero, `nome fora do padrão: ${file}`).toBeTruthy();
      const irmaos = [
        `pages/module-11-eng-software/planos/lesson-${numero}-plano.html`,
        `pages/module-11-eng-software/slides/slide-lesson-${numero}.html`,
      ];
      irmaos.forEach((irmao) => {
        expect(fs.existsSync(resolveRepoPath(irmao)), `faltando: ${irmao}`).toBe(true);
      });
    });
  });
});
