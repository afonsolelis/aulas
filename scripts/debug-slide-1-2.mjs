import { chromium } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';

const url = pathToFileURL(path.resolve('pages/module-2-common/slides/slide-lesson-1.html')).href;
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

for (const idx of [0, 1, 20]) {
  await page.evaluate((i) => window.showSlide(i), idx);
  await page.waitForTimeout(1800);
  const info = await page.evaluate(() => {
    const s = document.querySelector('.slide.active');
    const kids = Array.from(s.children).map(c => {
      const r = c.getBoundingClientRect();
      const st = getComputedStyle(c);
      return {
        tag: c.tagName, cls: c.className, id: c.id || null,
        top: Math.round(r.top), left: Math.round(r.left),
        w: Math.round(r.width), h: Math.round(r.height),
        pos: st.position, transform: st.transform,
      };
    });
    return {
      scrollH: s.scrollHeight, clientH: s.clientHeight,
      scrollW: s.scrollWidth, clientW: s.clientWidth,
      kids,
    };
  });
  console.log(`\n=== Slide ${idx+1} ===`);
  console.log(JSON.stringify(info, null, 2));
}
await browser.close();
