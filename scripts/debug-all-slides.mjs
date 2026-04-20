import { chromium } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';

const url = pathToFileURL(path.resolve('pages/module-2-common/slides/slide-lesson-1.html')).href;
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
const report = [];
for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => window.showSlide(idx), i);
  await page.waitForTimeout(1600);
  const m = await page.evaluate(() => {
    const active = document.querySelector('.slide.active');
    const sc = active?.querySelector('.sc');
    const ar = active?.getBoundingClientRect();
    const sr = sc?.getBoundingClientRect();
    const st = active ? getComputedStyle(active) : null;
    const scSt = sc ? getComputedStyle(sc) : null;
    return {
      activeTop: Math.round(ar?.top ?? -1),
      activeHeight: Math.round(ar?.height ?? -1),
      scTop: Math.round(sr?.top ?? -1),
      scHeight: Math.round(sr?.height ?? -1),
      activeTransform: st?.transform,
      scTransform: scSt?.transform,
    };
  });
  report.push({ slide: i + 1, ...m });
}
await browser.close();
report.forEach(r => console.log(JSON.stringify(r)));
