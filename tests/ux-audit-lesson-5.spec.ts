import { test, expect, Page } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

/**
 * UX Audit — Aula 5 (Transactions e Triggers · 22/05/2026).
 * Persona: Uma (UX Design Expert).
 *
 * Saída: test-results/ux-audit/lesson-5/*.png  +  audit.json
 */

const SLIDE_FILE = path.resolve(
  __dirname,
  '..',
  'pages',
  'module-6-eng-software',
  'slides',
  'slide-lesson-5.html'
);
const OUT_DIR = path.resolve(__dirname, '..', 'test-results', 'ux-audit', 'lesson-5');
const TOTAL_SLIDES = 18;

const SLIDE_TITLES: Record<number, string> = {
  1: 'Cover',
  2: 'Daily',
  3: 'Autoestudos',
  4: 'Agenda',
  5: 'A condição de corrida',
  6: 'ACID',
  7: 'Níveis de isolamento',
  8: 'BEGIN / COMMIT / ROLLBACK',
  9: 'Locks · pessimista vs otimista',
  10: 'Triggers · Anatomia',
  11: 'Triggers · Boas práticas e armadilhas',
  12: 'Do banco até a tela · checkout',
  13: 'Repository · erros SQL → tipos',
  14: 'ViewModel · useCheckout hook',
  15: 'View · CheckoutScreen',
  16: 'Atividade Prática · Descrição',
  17: 'Mão na massa',
  18: 'Encerramento',
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

test.describe('UX Audit — Aula 5', () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  test('inspeciona visualmente os 18 slides', async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(pathToFileURL(SLIDE_FILE).toString());
    await page.waitForLoadState('domcontentloaded');
    await page.waitForFunction(() => (window as any).__anime !== undefined, { timeout: 3000 });

    const report: SlideReport[] = [];

    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      if (i > 1) {
        await page.keyboard.press('ArrowRight');
      }
      await page.waitForTimeout(2000);

      const data = await inspectSlide(page, i);
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

async function inspectSlide(page: Page, slideNumber: number) {
  return await page.evaluate((n) => {
    const active = document.querySelector('.slide.active');
    if (!active) {
      return {
        contentOverflows: false,
        contentHeight: 0,
        viewportHeight: window.innerHeight,
        hiddenElementsAfterAnim: 0,
        clippedNodes: [],
      };
    }
    const inner = active.querySelector('.sc') as HTMLElement | null;
    const contentHeight = inner ? inner.scrollHeight : (active as HTMLElement).scrollHeight;
    const vh = window.innerHeight;
    const usable = vh - 132;
    const contentOverflows = contentHeight > usable + 4;

    const candidates = active.querySelectorAll(
      '[id^="ct"],[id^="dt"],[id^="ae"],[id^="ag"],[id^="dl"],[id^="mm"],[id^="en"],' +
      '[id^="fx"],[id^="fa"],[id^="fc"],' +
      '#rp-types,#rp-impl,#vm-reducer,#vm-hook,#vw-jsx,' +
      '[id^="vw-st"]'
    );
    let hidden = 0;
    candidates.forEach((el) => {
      const cs = window.getComputedStyle(el as Element);
      if (parseFloat(cs.opacity) < 0.05) hidden++;
    });

    const clipped: string[] = [];
    active.querySelectorAll('.box, .jp, .ctab, table, .cv-tag, .jdf, .rc-grid, .acid-card').forEach((el) => {
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
  }, slideNumber);
}
