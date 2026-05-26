import { test, expect, Page } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

/**
 * UX Audit — Aula 7 (Front-End I · HTML, DOM e JS com SSR + EJS).
 * Persona: Uma (UX Design Expert).
 *
 * Saída: test-results/ux-audit/lesson-7/*.png  +  audit.json
 */

const SLIDE_FILE = path.resolve(
  __dirname,
  '..',
  'pages',
  'module-2-common',
  'slides',
  'slide-lesson-7.html'
);
const OUT_DIR = path.resolve(__dirname, '..', 'test-results', 'ux-audit', 'lesson-7');
const TOTAL_SLIDES = 17;

const SLIDE_TITLES: Record<number, string> = {
  1: 'Cover',
  2: 'Daily',
  3: 'Agenda',
  4: 'Roadmap',
  5: 'SSR vs CSR',
  6: 'Setup EJS',
  7: 'Estrutura de views',
  8: 'Sintaxe EJS',
  9: 'Fluxo MVC com res.render',
  10: 'HTML Semântico',
  11: 'DOM Essencial',
  12: 'Static + dados do server',
  13: 'Validação dupla',
  14: 'Desafio · Tela do Projeto em EJS',
  15: 'RM-ODP · As 5 Visões',
  16: 'Esta Aula · Views (RF/RNF)',
  17: 'Encerramento',
};

type SlideReport = {
  number: number;
  title: string;
  screenshot: string;
  contentOverflows: boolean;
  contentHeight: number;
  viewportHeight: number;
  hiddenElementsAfterAnim: number;
  clippedNodes: string[];
};

test.describe('UX Audit — Aula 7', () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  test('inspeciona visualmente os 17 slides', async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(pathToFileURL(SLIDE_FILE).toString());
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const report: SlideReport[] = [];

    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      if (i > 1) {
        await page.keyboard.press('ArrowRight');
      }
      await page.waitForTimeout(2200);

      const data = await inspectSlide(page);
      const file = path.join(OUT_DIR, `slide-${String(i).padStart(2, '0')}.png`);
      await page.screenshot({ path: file, fullPage: false });

      report.push({
        number: i,
        title: SLIDE_TITLES[i] ?? `Slide ${i}`,
        screenshot: path.relative(path.resolve(__dirname, '..'), file).replace(/\\/g, '/'),
        ...data,
      });
    }

    fs.writeFileSync(
      path.join(OUT_DIR, 'audit.json'),
      JSON.stringify(report, null, 2),
      'utf8'
    );

    expect(report).toHaveLength(TOTAL_SLIDES);
  });
});

async function inspectSlide(page: Page) {
  return await page.evaluate(() => {
    const active = document.querySelector('.slide.active');
    if (!active) {
      return {
        contentOverflows: false,
        contentHeight: 0,
        viewportHeight: window.innerHeight,
        hiddenElementsAfterAnim: 0,
        clippedNodes: [] as string[],
      };
    }
    const inner = active.querySelector('.sc') as HTMLElement | null;
    const contentHeight = inner ? inner.scrollHeight : (active as HTMLElement).scrollHeight;
    const vh = window.innerHeight;
    const usable = vh - 132;
    const contentOverflows = contentHeight > usable + 4;

    const candidates = active.querySelectorAll(
      '[id^="ct"],[id^="dt"],[id^="ag"],[id^="rm"],[id^="ej"],[id^="ex"],' +
      '[id^="pp"],[id^="ct-"],[id^="dm"],[id^="sd"],[id^="ds"],[id^="rmo"],' +
      '[id^="rma"],[id^="art"],[id^="rt"],[id^="su"]'
    );
    let hidden = 0;
    candidates.forEach((el) => {
      const cs = window.getComputedStyle(el as Element);
      if (parseFloat(cs.opacity) < 0.05) hidden++;
    });

    const clipped: string[] = [];
    active.querySelectorAll('.box, .ri, .mc, .vs-card, .ej-card, .term, .cv-tag, .ps, .alayer').forEach((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      if (r.bottom > vh - 60 || r.top < 0) {
        const tag = (el as HTMLElement).className.split(' ')[0] || el.tagName;
        clipped.push(`${tag} bottom=${Math.round(r.bottom)}`);
      }
    });

    return {
      contentOverflows,
      contentHeight,
      viewportHeight: vh,
      hiddenElementsAfterAnim: hidden,
      clippedNodes: clipped.slice(0, 5),
    };
  });
}
