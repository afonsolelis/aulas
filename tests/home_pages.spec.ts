import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { resolveHtmlPath, toFileUrl } from './test-helpers';

const pagesDir = path.join(__dirname, '../pages');
const moduleFiles = fs.readdirSync(pagesDir).filter(file => file.startsWith('home_module-') && file.endsWith('.html'));

test.describe('Páginas de Módulos (home_module-*.html) - Validação Estrutural e Visual', () => {
  
  for (const fileName of moduleFiles) {
    const pagePath = `pages/${fileName}`;
    
    test.describe(`Página: ${fileName}`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.goto(toFileUrl(pagePath));
      });

      test('Cores devem ser consistentes (Header, Badge, Lesson Numbers, Buttons)', async ({ page }) => {
        // Cores padrão
        const colors = {
          adm: 'rgb(46, 38, 64)',   // Navy
          si: 'rgb(137, 206, 165)',  // Verde
          eng: 'rgb(255, 69, 69)'   // Vermelho
        };

        let expectedColor = '';
        if (fileName.includes('adm-tech')) expectedColor = colors.adm;
        else if (fileName.includes('sistemas-informacao')) expectedColor = colors.si;
        else if (fileName.includes('eng-software')) expectedColor = colors.eng;

        if (expectedColor) {
          // 1. Verifica cor do Header
          const header = page.locator('.module-header');
          await expect(header).toHaveCSS('background-color', expectedColor);

          // 2. Verifica cor da Badge (deve ser igual ao header)
          const badge = page.locator('.module-header .module-badge');
          await expect(badge).toHaveCSS('background-color', expectedColor);

          // 3. Verifica cor dos Números das Lições (bolinhas)
          const lessonNumbers = page.locator('.lesson-number');
          const count = await lessonNumbers.count();
          for (let i = 0; i < count; i++) {
            await expect(lessonNumbers.nth(i)).toHaveCSS('background-color', expectedColor);
          }

          // 4. Verifica cor dos botões de Slides (deve ser a cor sólida)
          const slidesButtons = page.locator('.btn-slides, .btn-adm, .btn-si, .btn-eng').filter({ hasText: /Slides/ });
          const slidesCount = await slidesButtons.count();
          for (let i = 0; i < slidesCount; i++) {
            await expect(slidesButtons.nth(i)).toHaveCSS('background-color', expectedColor);
          }
        }
      });

      test('Header deve ter a tag do curso e o nome do projeto formatado', async ({ page }) => {
        const badge = page.locator('.module-header .module-badge');
        await expect(badge).toBeVisible();
        const h1 = page.locator('.module-header h1');
        const h3 = page.locator('.module-header h3');
        await expect(h1).toContainText(/Projeto \d+/);
        await expect(h3).not.toBeEmpty();
      });

      test('deve possuir as seções obrigatórias: Sobre, Tópicos e Aulas', async ({ page }) => {
        await expect(page.locator('h5:has-text("Sobre o Módulo")')).toBeVisible();
        await expect(page.locator('h5:has-text("Principais Tópicos")')).toBeVisible();
        await expect(page.locator('h4:has-text("Aulas do Módulo")')).toBeVisible();
      });

      test('deve conter o link do TAPI nos principais tópicos', async ({ page }) => {
        const tapiLink = page.locator('a[href*="tapi.inteli.edu.br"]');
        await expect(tapiLink).toBeVisible();
        await expect(tapiLink).toHaveAttribute('target', '_blank');
      });

      test('cada card de aula deve ter botões de Slides e Material', async ({ page }) => {
        const lessonCards = page.locator('.lesson-card');
        const count = await lessonCards.count();
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            const card = lessonCards.nth(i);
            const btnSlides = card.locator('a:has-text("Slides"), a:has-text("🖥️")');
            const btnMaterial = card.locator('a:has-text("Material"), a:has-text("📖")');
            await expect(btnSlides).toBeVisible();
            await expect(btnMaterial).toBeVisible();
          }
        }
      });

      test('deve possuir um link de "Voltar" funcional', async ({ page }) => {
        const backLink = page.locator('a:has-text("Voltar"), a:has-text("←")').first();
        await expect(backLink).toBeVisible();
        const href = await backLink.getAttribute('href');
        expect(href).toMatch(/index\.html|^\.\.\/$/);
        expect(fs.existsSync(resolveHtmlPath(pagePath, href!))).toBe(true);
      });
    });
  }
});
