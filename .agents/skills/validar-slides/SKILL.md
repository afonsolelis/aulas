---
name: validar-slides
description: Inspeção visual interativa de decks de slides HTML, materiais e planos — via MCP do Chrome quando conectado, ou via Brave por CDP quando não há MCP. Percorre slide a slide, detecta overflow do conteúdo em relação ao footer, elementos invisíveis após animação e nós cortados, e captura screenshots para inspeção. Use após criar ou editar qualquer slide-lesson-*.html ou página de pages/, para inspeção interativa (screenshots, dirigir o Chrome real). Para checagem headless rápida de overflow/console, prefira `npm run validate:slides`.
type: reference
---

# Validar Slides (MCP do Chrome)

> **Estado desta máquina (21/08/2026).**
>
> - **O Playwright voltou a funcionar.** As revisões `chromium-1208` e
>   `chromium_headless_shell-1208` foram instaladas, então `npm run validate:slides -- <path>`
>   roda sozinho — é o caminho preferido para checagem headless de overflow e console.
>   Se algum dia faltar de novo, **não** use `npx playwright install`: nesta máquina ele
>   trava na extração. O `AGENTS.md` da raiz traz o passo a passo de baixar e extrair à mão.
> - **Nenhum MCP de browser está conectado** — nem `mcp__claude-in-chrome__*`, nem
>   `mcp__playwright__*`. O procedimento descrito abaixo não roda como está escrito; para
>   inspeção interativa, use o [Fallback](#fallback--brave-via-cdp) por CDP.

Historicamente, os antigos
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


## Fallback — Brave via CDP

Reaproveita o Brave instalado por Flatpak, dirigido pela biblioteca do Playwright por CDP.
Serve para inspeção interativa enquanto não há MCP conectado, e como rede de segurança se o
browser do Playwright voltar a faltar. É o mesmo procedimento descrito no `AGENTS.md` da raiz.

```bash
python3 -m http.server 8123 &                       # o Flatpak tem shared=network
flatpak run com.brave.Browser --headless=new \
  --remote-debugging-port=9222 --remote-allow-origins='*' \
  --user-data-dir=/tmp/brave-cdp --no-first-run &   # o sandbox enxerga /tmp
sleep 6                                             # o CDP demora a subir

PW_CDP_URL=http://127.0.0.1:9222 PW_BASE_URL=http://127.0.0.1:8123 \
  node scripts/validate-slides.mjs pages/module-11-eng-software/slides/slide-lesson-6.html
```

Para inspeção própria, conecte pela biblioteca do repositório — em ESM, importe pelo caminho
absoluto, porque um script fora do repo não resolve `'playwright'` por nome:

```js
import { chromium } from '/var/home/afonsolelis/Repos/aulas/node_modules/playwright/index.mjs';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
```

Ao terminar, encerre **por PID** — `pkill -f "http.server 8123"` mata o próprio shell que
executa o comando, porque o padrão casa com a própria linha de comando:

```bash
ps -eo pid,args --no-headers | grep -E 'com.brave.Browser|htt[p]\.server' \
  | grep -v grep | awk '{print $1}' | xargs -r kill
```

### Também vale para material e plano

Esta skill não é só para decks. Material e plano do Módulo 11 são **gerados em JS** — o
arquivo tem ~40 linhas e o conteúdo só existe depois do `render`. Verificar o padrão desses
artefatos (ficha, botão de PDF, `#progress-bar`, `#float-nav`, ausência de overflow
horizontal) exige renderizar a página; ler o HTML do arquivo não revela nada.

## Por que isso importa

Bugs visuais em slides HTML não aparecem em `console.log` — é preciso ver a tela. O MCP do
Chrome dá isso dirigindo o Chrome real do sistema, sem depender do binário empacotado do
Playwright. Sem este passo, aprovam-se layouts que falham no projetor: cards empurrando o
slide para fora do viewport, `justify-content:center` cortando conteúdo silenciosamente,
partículas com overflow, ou animações deixando elementos invisíveis.
