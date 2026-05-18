import { test, expect, Page } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

/**
 * UX Audit — Aula 4 (Stored Procedures / MVVM / React Native / APK).
 * Persona: Uma (UX Design Expert).
 *
 * Para cada um dos 19 slides:
 *  1. Navega via teclado.
 *  2. Aguarda animação (1500ms).
 *  3. Captura screenshot em 1280x720.
 *  4. Mede overflow vertical do conteúdo (.sc).
 *  5. Conta elementos ainda invisíveis após animação (opacity 0).
 *  6. Lista elementos cortados pela viewport.
 *
 * Saída: test-results/ux-audit/lesson-4/*.png  +  audit.json
 */

const SLIDE_FILE = path.resolve(
  __dirname,
  '..',
  'pages',
  'module-6-eng-software',
  'slides',
  'slide-lesson-4.html'
);
const OUT_DIR = path.resolve(__dirname, '..', 'test-results', 'ux-audit', 'lesson-4');
const TOTAL_SLIDES = 19;

const SLIDE_TITLES: Record<number, string> = {
  1: 'Cover',
  2: 'Daily',
  3: 'Autoestudos',
  4: 'Agenda',
  5: 'Por que descer lógica para o BD',
  6: 'Procedure · Anatomia',
  7: 'Procedure · OUTPUT + Transação',
  8: 'Function · Escalar vs Tabular',
  9: 'Procedure × Function · Comparação',
  10: 'Performance · Plano de execução',
  11: 'Versionamento e CI/CD',
  12: 'Atividade Prática · Descrição',
  13: 'O que é MVVM?',
  14: 'Diagrama SVG da MVVM',
  15: 'Como funciona o React Native',
  16: 'Compilar APK',
  17: 'Caminho de uma requisição',
  18: 'Mão na massa',
  19: 'Encerramento',
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

test.describe('UX Audit — Aula 4', () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  test('inspeciona visualmente os 19 slides', async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(pathToFileURL(SLIDE_FILE).toString());
    await page.waitForLoadState('domcontentloaded');
    // garante anime.js carregado
    await page.waitForFunction(() => (window as any).__anime !== undefined, { timeout: 3000 });

    const report: SlideReport[] = [];

    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      // navega para o slide i (se i==1, já está nele)
      if (i > 1) {
        await page.keyboard.press('ArrowRight');
      }
      // aguarda animação (slides com revelação cinematográfica precisam de tempo
      // razoável — 2000ms cobre as células SQL que mostram spinner + output)
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

    // garante contagem certa
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

    // medir overflow vertical do conteúdo dentro do slide
    // o slide tem padding 44/52/88; consideramos a área disponível
    const rect = active.getBoundingClientRect();
    const inner = active.querySelector('.sc') as HTMLElement | null;
    const contentHeight = inner ? inner.scrollHeight : (active as HTMLElement).scrollHeight;
    const vh = window.innerHeight;
    // estimativa: padding bottom 88px + top 44px reduz a área para ~vh-132 antes do footer
    const usable = vh - 132;
    const contentOverflows = contentHeight > usable + 4;

    // contar elementos que deveriam ter aparecido mas continuam invisíveis
    const candidates = active.querySelectorAll(
      '[id^="ct"],[id^="dt"],[id^="ae"],[id^="ag"],[id^="dl"],[id^="mm"],[id^="en"],' +
      '[id^="mv"],[id^="rn"],[id^="apk"],[id^="rna"],[id^="rnm"],' +
      '[id^="mvvm-"],#rn-view,#rn-vm,#rn-repo,#rn-sql,#apk-expo,#apk-cli,' +
      '#c1-out-wrap,#c2-out-wrap,#c3a-out-wrap,#c3b-out-wrap'
    );
    let hidden = 0;
    candidates.forEach((el) => {
      const cs = window.getComputedStyle(el as Element);
      if (parseFloat(cs.opacity) < 0.05) hidden++;
    });

    // elementos cuja bounding box ultrapassa o viewport visível
    const clipped: string[] = [];
    active.querySelectorAll('.box, .jp, .ctab, table, .cv-tag, .jdf').forEach((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      if (r.bottom > vh - 60 || r.top < 0) {
        // foot bar tem ~50px; vamos descontar
        const tag = (el as HTMLElement).className.split(' ')[0] || el.tagName;
        clipped.push(`${tag} bottom=${Math.round(r.bottom)}`);
      }
    });

    return {
      contentOverflows,
      contentHeight,
      viewportHeight: vh,
      hiddenElementsAfterAnim: hidden,
      clippedNodes: clipped.slice(0, 5), // só os 5 primeiros para ler
    };
  }, slideNumber);
}
