import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const pagesDir = path.join(__dirname, '../pages');
const moduleDirs = fs.readdirSync(pagesDir)
  .filter(file => file.startsWith('module-') && fs.statSync(path.join(pagesDir, file)).isDirectory());

test.describe('Validação Rigorosa de Slides (Reveal.js)', () => {

  for (const moduleDir of moduleDirs) {
    const modulePath = path.join(pagesDir, moduleDir);
    const slidesPath = path.join(modulePath, 'slides');

    if (fs.existsSync(slidesPath)) {
      const slideFiles = fs.readdirSync(slidesPath).filter(f => f.startsWith('slide_') && f.endsWith('.html'));

      for (const slideFile of slideFiles) {
        test(`Módulo ${moduleDir} - Slide ${slideFile}: Capa e Agenda`, async ({ page }) => {
          await page.goto(`/pages/${moduleDir}/slides/${slideFile}`);

          // 1. Validação do Slide 1: Capa
          const firstSlide = page.locator('.reveal .slides section').first();
          await expect(firstSlide).toBeVisible();

          const logoCover = firstSlide.locator('img[src*="cloudinary"], .logo-cover');
          await expect(logoCover).toBeVisible();

          const title = firstSlide.locator('h1');
          await expect(title).not.toBeEmpty();
          
          const topics = firstSlide.locator('.topics-grid');
          await expect(topics, `Tópicos da capa não encontrados em ${slideFile}`).toBeVisible();

          // 2. Validação do Slide 2: Agenda
          await page.keyboard.press('ArrowRight');
          
          const secondSlide = page.locator('.reveal .slides section').nth(1);
          await expect(secondSlide).toBeVisible();

          const agendaTitle = secondSlide.locator('h2, h1');
          await expect(agendaTitle).toContainText(/Agenda/i);

          const agendaItems = secondSlide.locator('li, .info-card, .topic-item');
          const count = await agendaItems.count();
          expect(count, `Agenda em ${slideFile} deve ter itens listados`).toBeGreaterThan(0);

          // 3. Botões de Navegação
          const btnHome = page.locator('.btn-home, a[href*="home_module"]');
          const btnMaterial = page.locator('.btn-material, a[href*="materials/lesson"]');
          await expect(btnHome).toBeVisible();
          await expect(btnMaterial).toBeVisible();
        });
      }
    }
  }
});
