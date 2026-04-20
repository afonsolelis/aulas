import { chromium } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';

const url = pathToFileURL(path.resolve('pages/module-2-common/slides/slide-lesson-1.html')).href;
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Go to slide 21 (index 20)
await page.evaluate(() => window.showSlide(20));
await page.waitForTimeout(2500);

const info = await page.evaluate(() => {
  const slides = document.querySelectorAll('.slide');
  const active = document.querySelector('.slide.active');
  const idx = Array.from(slides).indexOf(active);
  const sc = active?.querySelector('.sc');
  const scStyle = sc ? getComputedStyle(sc) : null;
  const activeStyle = active ? getComputedStyle(active) : null;
  const tags = active?.querySelectorAll('.cv-tag');
  const tagStyles = tags ? Array.from(tags).map(t => {
    const s = getComputedStyle(t);
    return { id: t.id, opacity: s.opacity, transform: s.transform, visibility: s.visibility, display: s.display };
  }) : [];
  const activeRect = active?.getBoundingClientRect();
  const scRect = sc?.getBoundingClientRect();
  return {
    totalSlides: slides.length,
    activeIndex: idx,
    activeRect: activeRect ? { top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height } : null,
    scRect: scRect ? { top: scRect.top, left: scRect.left, width: scRect.width, height: scRect.height } : null,
    activeDisplay: activeStyle?.display,
    activeVisibility: activeStyle?.visibility,
    activeOpacity: activeStyle?.opacity,
    scDisplay: scStyle?.display,
    scVisibility: scStyle?.visibility,
    scOpacity: scStyle?.opacity,
    tagStyles,
    animMapLen: window.animMap?.length,
    hasAnimSupabase: typeof window.animMap?.[20] === 'function',
  };
});

console.log(JSON.stringify(info, null, 2));
console.log('\nERRORS:', errs);

await browser.close();
