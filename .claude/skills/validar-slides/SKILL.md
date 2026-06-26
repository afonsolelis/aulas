---
name: validar-slides
description: Valida visualmente decks de slides HTML (e demais páginas) via MCP do Chrome — não Playwright. Percorre slide a slide, detecta overflow do conteúdo em relação ao footer, elementos invisíveis após animação e nós cortados, e captura screenshots para inspeção. Use após criar ou editar qualquer slide-lesson-*.html ou página de pages/, e sempre que precisar ver o renderizado real (o binário do Playwright não funciona nesta máquina).
type: reference
---

# Validar Slides (MCP do Chrome)

Esta skill substitui a antiga validação visual via Playwright. Nesta máquina o Chromium
empacotado do Playwright **não funciona** (binário ausente/quebrado), então os antigos
`tests/ux-audit-*.spec.ts` e os scripts de captura/validação em `scripts/*.mjs` que importavam
`@playwright/test` (`capture-slides.mjs`, `audit-cardiff-slides.mjs`, `validate-*.mjs`,
`debug-*.mjs`) foram **removidos**. A validação visual passa a ser feita pelo **MCP do Chrome**
(`mcp__claude-in-chrome__*`), que dirige o Chrome real do sistema.

> Os specs de filesystem (`index`, `specs-compliance`, `calendar-consistency`,
> `index-json-coverage`) **continuam** em `npm test` — eles só leem arquivos com `fs` e não
> abrem browser. Esta skill cobre apenas a inspeção visual que exige renderizar a página.

## Pré-requisitos

As ferramentas `mcp__claude-in-chrome__*` são *deferred*: carregue-as **uma vez**, em uma
única chamada, antes de usar.

```
ToolSearch "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__read_console_messages"
```

O `navigate` **recusa `file://`** — sirva o repositório por HTTP a partir da raiz do projeto:

```bash
npx http-server . -p 8123 -c-1 >/dev/null 2>&1 &
```

(encerre ao final com `pkill -f "http-server . -p 8123"`).

## Procedimento

1. **Abra a aba.** `tabs_context_mcp { createIfEmpty: true }` → guarde o `tabId`.

2. **Navegue até o deck** servido por HTTP, no viewport do projetor (caso mais apertado):
   - `navigate` → `http://127.0.0.1:8123/<path-relativo-ao-repo>`
     (ex.: `pages/module-2-common/slides/slide-lesson-7.html`).
   - Garanta 1280×720 com `resize_window` se necessário; valide depois em 1440×900 e
     1920×1080 se houver dúvida.

3. **Descubra o total de slides** via `javascript_tool`:
   `return document.querySelectorAll('.slide').length;`

4. **Percorra slide a slide.** Para cada `i` de 0 a `total-1`:
   - Avance com `window.showSlide(i)` (via `javascript_tool`) ou `computer { action:"key", text:"ArrowRight" }`.
   - **Aguarde ~2 s** para as animações do anime.js assentarem (`computer { action:"wait", duration:2 }`).
   - Rode o **inspetor** abaixo via `javascript_tool` e registre o resultado.
   - Capture o slide com `computer { action:"screenshot", save_to_disk:true }` e **olhe a imagem**
     (volta como PNG nativo) quando o inspetor sinalizar algo ou em covers/slides densos.

### Inspetor (javascript_tool) — porta a lógica dos antigos ux-audit + capture-slides

```js
const active = document.querySelector('.slide.active');
if (!active) return { error: 'sem slide ativo' };

const inner = active.querySelector('.sc');
const vh = window.innerHeight;

// 1) Overflow do conteúdo vs footer fixo (.slide-footer)
const sc = inner || active.firstElementChild;
const scR = sc.getBoundingClientRect();
const footer = document.querySelector('.slide-footer');
const footerTop = footer ? footer.getBoundingClientRect().top : vh;
const exceedsBottom = scR.bottom > footerTop;
const exceedsTop = scR.top < 0;
const slackPx = Math.round(footerTop - scR.bottom);

// 2) Altura de conteúdo vs área útil (vh - 132)
const contentHeight = inner ? inner.scrollHeight : active.scrollHeight;
const contentOverflows = contentHeight > (vh - 132) + 4;

// 3) Elementos invisíveis após animação (opacity ~0 residual)
const candidates = active.querySelectorAll(
  '[id^="ct"],[id^="dt"],[id^="ag"],[id^="rm"],[id^="ej"],[id^="ex"],' +
  '[id^="pp"],[id^="dm"],[id^="sd"],[id^="ds"],[id^="rmo"],[id^="rma"],' +
  '[id^="art"],[id^="rt"],[id^="su"]'
);
let hidden = 0;
candidates.forEach((el) => { if (parseFloat(getComputedStyle(el).opacity) < 0.05) hidden++; });

// 4) Nós cortados (saem por cima ou perto do rodapé)
const clipped = [];
active.querySelectorAll('.box, .ri, .mc, .vs-card, .ej-card, .term, .cv-tag, .ps, .alayer')
  .forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom > vh - 60 || r.top < 0) {
      clipped.push((el.className.split(' ')[0] || el.tagName) + ' bottom=' + Math.round(r.bottom));
    }
  });

return {
  scTop: Math.round(scR.top), scBottom: Math.round(scR.bottom),
  footerTop: Math.round(footerTop),
  exceedsBottom, exceedsTop, tight: !exceedsBottom && slackPx < 12,
  overlapPx: exceedsBottom ? Math.round(scR.bottom - footerTop) : 0, slackPx,
  contentOverflows, contentHeight, viewportHeight: vh,
  hiddenElementsAfterAnim: hidden, clippedNodes: clipped.slice(0, 5),
};
```

**Critérios de falha (corrija e revalide):**

| Flag | Significado |
|------|-------------|
| `exceedsBottom` / `overlapPx > 0` | **OVERFLOW** — `.sc` invade o footer; conteúdo cortado |
| `exceedsTop` | **OVERFLOW-TOP** — `.sc` começa acima do viewport |
| `tight` (folga < 12 px) | conteúdo quase encostando no footer; aperte tipografia/padding |
| `contentOverflows` | altura de conteúdo > área útil (`vh − 132`) |
| `hiddenElementsAfterAnim > 0` | animação deixou elemento com `opacity ~0` residual |
| `clippedNodes` não vazio | card/tag/termo saindo do viewport |

5. **Validações adicionais** (via `javascript_tool` / `read_console_messages`):
   - `window.__anime` definido (CDN do anime.js carregou): `return typeof window.__anime !== 'undefined';`
   - Console sem erros (warnings do anime.js "No target found" são toleráveis, mas reporte).
   - Partículas nos covers: `return !!document.querySelector('.cover-particles circle');`
   - Deck com daily: `#daily-timer` exibe `"15:00"`.
   - Deck de 3º ano (módulo ≥ 9): **não** deve haver `#daily-timer` no DOM.

6. **Itere** até nenhum slide sinalizar overflow/tight/clipping E a inspeção visual aprovar.
   Só então declare o deck pronto.

## Por que isso importa

Bugs visuais em slides HTML não aparecem em `console.log` — é preciso ver a tela. O MCP do
Chrome dá isso dirigindo o Chrome real do sistema, sem depender do binário empacotado do
Playwright. Sem este passo, aprovam-se layouts que falham no projetor: cards empurrando o
slide para fora do viewport, `justify-content:center` cortando conteúdo silenciosamente,
partículas com overflow, ou animações deixando elementos invisíveis.
