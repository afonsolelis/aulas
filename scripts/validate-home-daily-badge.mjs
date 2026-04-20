// Validates the "3º ano · Sem daily em sala" badge + note on module home pages.
// Captures screenshots at 1440x900 and asserts elements exist and are visible.

import { chromium } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const targets = [
  {
    label: 'm9',
    file: 'pages/home-module-9-sistemas-informacao.html',
    out: '.playwright-mcp/home-m9.png',
  },
  {
    label: 'm11',
    file: 'pages/home-module-11-eng-software.html',
    out: '.playwright-mcp/home-m11.png',
  },
];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const consoleErrors = {};
const results = [];

for (const t of targets) {
  consoleErrors[t.label] = [];
  page.removeAllListeners('console');
  page.removeAllListeners('pageerror');
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleErrors[t.label].push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors[t.label].push(`[pageerror] ${err.message}`);
  });

  const url = pathToFileURL(path.resolve(t.file)).href;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const info = await page.evaluate(() => {
    const badge = document.querySelector('.year-badge');
    const note = document.querySelector('.no-daily-note');
    const header = document.querySelector('.module-header');
    const backBtn = document.querySelector('.module-header a, .module-header button, .module-header .back-link, .module-header [href*="index"], .module-header [href*=".."]');
    const sidebar = document.querySelector('.sidebar, aside, .module-sidebar');

    const describe = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return {
        exists: true,
        visible: cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0 && r.width > 0 && r.height > 0,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        text: (el.textContent || '').trim().slice(0, 160),
        display: cs.display,
        bg: cs.backgroundColor,
      };
    };

    const noteParentIsSidebar = (() => {
      if (!note) return null;
      let p = note.parentElement;
      while (p) {
        if (p.matches && p.matches('.sidebar, aside, .module-sidebar')) return p.className || p.tagName;
        p = p.parentElement;
      }
      return null;
    })();

    return {
      badge: describe(badge),
      note: describe(note),
      header: describe(header),
      backBtn: describe(backBtn),
      sidebar: describe(sidebar),
      noteParentIsSidebar,
      title: document.querySelector('.module-header h3')?.textContent?.trim() || document.querySelector('.module-header h1')?.textContent?.trim() || '',
      viewport: { w: window.innerWidth, h: window.innerHeight },
    };
  });

  fs.mkdirSync(path.dirname(t.out), { recursive: true });
  await page.screenshot({ path: t.out, fullPage: false });

  results.push({ target: t, info, consoleErrors: consoleErrors[t.label] });
  console.log(`\n=== ${t.label} (${t.file}) ===`);
  console.log(JSON.stringify(info, null, 2));
  if (consoleErrors[t.label].length) {
    console.log('Console errors:', consoleErrors[t.label]);
  } else {
    console.log('Console: clean');
  }
  console.log(`Screenshot: ${t.out}`);
}

await browser.close();

const reportPath = '.playwright-mcp/home-daily-report.json';
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\nReport: ${reportPath}`);
