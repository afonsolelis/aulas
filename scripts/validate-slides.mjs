/**
 * Validação visual de slides via Playwright (headless).
 *
 * Renderiza um deck de slides HTML e, tela a tela, mede se o conteúdo invade o
 * rodapé fixo, se a tela rola (conteúdo cortado) e quanto espaço vertical fica
 * ocioso. Reporta OVERFLOW / OVERFLOW-TOP / TIGHT / SPARSE e erros de console.
 *
 * Reconhece as duas estruturas de deck do acervo:
 *   - deck artesanal: .slide  + .sc / .slide-content + .slide-footer
 *   - deck gerado:    .lesson-slide + .lesson-footer (módulo 11)
 *
 * Uso:
 *   node scripts/validate-slides.mjs <caminho-relativo-ao-repo> [maisCaminhos...]
 *   npm run validate:slides -- pages/module-6-eng-software/slides/slide-lesson-1.html
 *
 * Browser: por padrão usa o Chromium do Playwright (`npx playwright install
 * chromium`). Se o binário não estiver instalado, é possível reaproveitar um
 * browser Chromium já presente na máquina — inclusive Brave em Flatpak —
 * subindo-o com depuração remota e apontando PW_CDP_URL:
 *
 *   flatpak run com.brave.Browser --headless=new --remote-debugging-port=9222 \
 *     --remote-allow-origins='*' --user-data-dir=/tmp/brave-cdp --no-first-run &
 *   python3 -m http.server 8123 &
 *   PW_CDP_URL=http://127.0.0.1:9222 PW_BASE_URL=http://127.0.0.1:8123 \
 *     node scripts/validate-slides.mjs pages/.../slide-lesson-1.html
 *
 * PW_BASE_URL serve os arquivos por HTTP em vez de file://, necessário quando o
 * browser roda em sandbox sem acesso ao diretório do repositório.
 *
 * Este script NÃO roda no pre-commit — é ferramenta manual de inspeção visual.
 */
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const VIEWPORTS = [{ w: 1280, h: 720 }, { w: 1920, h: 1080 }];
const CDP_URL = process.env.PW_CDP_URL || '';
const BASE_URL = (process.env.PW_BASE_URL || '').replace(/\/$/, '');

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Uso: node scripts/validate-slides.mjs <caminho-relativo-ao-repo> [...]');
  process.exit(2);
}

let browser;
let usingCdp = false;
try {
  if (CDP_URL) {
    browser = await chromium.connectOverCDP(CDP_URL);
    usingCdp = true;
    console.log(`(conectado por CDP em ${CDP_URL})`);
  } else {
    browser = await chromium.launch();
  }
} catch (e) {
  console.error(
    CDP_URL
      ? `CDP-FAIL (o browser está no ar em ${CDP_URL}?): ${e.message}`
      : `LAUNCH-FAIL (rode \`npx playwright install chromium\` ou use PW_CDP_URL): ${e.message}`
  );
  process.exit(2);
}

let anyFailure = false;

for (const rel of targets) {
  const abs = resolve(process.cwd(), rel);
  if (!existsSync(abs)) { console.error(`\n[${rel}] arquivo não encontrado`); anyFailure = true; continue; }
  const url = BASE_URL ? `${BASE_URL}/${rel.replace(/^\.?\//, '')}` : pathToFileURL(abs).href;
  console.log(`\n### ${rel}`);

  for (const vp of VIEWPORTS) {
    const context = usingCdp ? await browser.newContext({ viewport: { width: vp.w, height: vp.h } }) : null;
    const page = context
      ? await context.newPage()
      : await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    if (context) await page.setViewportSize({ width: vp.w, height: vp.h });

    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(url, { waitUntil: 'networkidle' });

    const total = await page.evaluate(
      () => document.querySelectorAll('.slide, .lesson-slide').length
    );
    console.log(`  ==== ${vp.w}x${vp.h} — ${total} telas ====`);

    for (let i = 0; i < total; i++) {
      await page.evaluate((n) => {
        // decks artesanais expõem showSlide(); os gerados expõem show();
        // se nenhum existir, alterna a classe .active na mão.
        if (typeof window.showSlide === 'function') return window.showSlide(n);
        if (typeof window.show === 'function') return window.show(n);
        const all = document.querySelectorAll('.slide, .lesson-slide');
        all.forEach((s, k) => s.classList.toggle('active', k === n));
      }, i);
      await page.waitForTimeout(200);

      const r = await page.evaluate(() => {
        const active = document.querySelector('.slide.active, .lesson-slide.active')
          || document.querySelector('.slide, .lesson-slide');
        const footer = document.querySelector('.slide-footer, .lesson-footer');
        const ft = footer ? footer.getBoundingClientRect().top : window.innerHeight;

        let top, bottom;
        if (active.classList.contains('lesson-slide')) {
          // o <article> ocupa a área toda; o conteúdo real são os filhos
          const rects = [...active.children].map((k) => k.getBoundingClientRect());
          top = rects.length ? Math.min(...rects.map((x) => x.top)) : 0;
          bottom = rects.length ? Math.max(...rects.map((x) => x.bottom)) : 0;
        } else {
          const sc = active.querySelector('.sc') || active.querySelector('.slide-content') || active.firstElementChild;
          const rr = sc.getBoundingClientRect();
          top = rr.top; bottom = rr.bottom;
        }

        const title = (active.querySelector('.slide-title, h1, h2') || {}).textContent || '';
        return {
          exceedsBottom: bottom > ft + 1,
          exceedsTop: top < -1,
          scrolls: active.scrollHeight > active.clientHeight + 1,
          slack: Math.round(ft - bottom),
          fill: ft > 0 ? (bottom - top) / ft : 1,
          title: title.trim().replace(/\s+/g, ' ').slice(0, 44),
        };
      });

      // OVERFLOW e OVERFLOW-TOP reprovam; TIGHT e SPARSE são avisos.
      let flag = 'ok';
      if (r.exceedsBottom || r.scrolls) flag = 'OVERFLOW';
      else if (r.exceedsTop) flag = 'OVERFLOW-TOP';
      else if (r.slack < 12) flag = 'TIGHT';
      else if (r.fill < 0.45) flag = 'SPARSE';
      if (flag === 'OVERFLOW' || flag === 'OVERFLOW-TOP') anyFailure = true;

      console.log(
        `    ${String(i + 1).padStart(2)}  ${flag.padEnd(12)}`
        + ` folga=${String(r.slack).padStart(4)}px  ocupa=${String(Math.round(r.fill * 100)).padStart(3)}%  ${r.title}`
      );
    }

    if (errors.length) { anyFailure = true; console.log('    CONSOLE ERRORS:', errors.slice(0, 5)); }
    else console.log('    console: sem erros');

    await page.close();
    if (context) await context.close();
  }
}

// Com CDP o browser é do usuário: desconecta sem fechá-lo.
if (usingCdp) await browser.close().catch(() => {});
else await browser.close();
process.exit(anyFailure ? 1 : 0);
