import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { resolveRepoPath, toFileUrl } from './test-helpers';

test.describe('Página Inicial (index.html) - Validação de Identidade e Estrutura', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(toFileUrl('index.html'));
  });

  test('o logo do inteli deve estar visível e funcionando', async ({ page }) => {
    const logo = page.locator('.logo-container img');
    await expect(logo).toBeVisible();
    
    // Verifica se a URL configurada do logo continua válida.
    const src = await logo.getAttribute('src');
    expect(src).toContain('res.cloudinary.com');
  });

  test('todos os cards devem apontar para um arquivo "home_*.html"', async ({ page }) => {
    // Seleciona todos os links dentro dos cards da grid principal
    const cardLinks = page.locator('.row.g-4 a');
    const count = await cardLinks.count();
    
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = cardLinks.nth(i);
      const href = await link.getAttribute('href');
      
      // Ignora links que ainda são "#" (módulos não implementados)
      if (href !== '#') {
        expect(href, `O link "${href}" deve começar com "pages/home_"`).toMatch(/^pages\/home_/);
        
        // Valida se o arquivo físico existe no repositório.
        expect(fs.existsSync(resolveRepoPath(href!)), `O arquivo ${href} não foi encontrado no repositório`).toBe(true);
      }
    }
  });

  test('as cores dos cards de disciplinas devem seguir o padrão estabelecido', async ({ page }) => {
    const colors = {
      si: 'rgb(137, 206, 165)',   // Verde (#89cea5)
      eng: 'rgb(255, 69, 69)',  // Vermelho (#ff4545)
      adm: 'rgb(46, 38, 64)'    // Navy/Azul (#2e2640)
    };

    // Testa SI
    const siHeaders = page.locator('.card-header-si');
    const siCount = await siHeaders.count();
    for (let i = 0; i < siCount; i++) {
      await expect(siHeaders.nth(i)).toHaveCSS('background-color', colors.si);
    }

    // Testa Eng Software
    const engHeaders = page.locator('.card-header-eng-software');
    const engCount = await engHeaders.count();
    for (let i = 0; i < engCount; i++) {
      await expect(engHeaders.nth(i)).toHaveCSS('background-color', colors.eng);
    }

    // Testa Adm Tech
    const admHeaders = page.locator('.card-header-adm-tech');
    const admCount = await admHeaders.count();
    for (let i = 0; i < admCount; i++) {
      await expect(admHeaders.nth(i)).toHaveCSS('background-color', colors.adm);
    }
  });
});
