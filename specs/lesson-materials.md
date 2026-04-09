# Spec: Materiais de Leitura — Padrão Livro Didático

## Objetivo

Definir o padrão obrigatório para páginas de material de leitura do Módulo 2 e futuros módulos modernos. O material deve ter profundidade de livro didático, com texto explicativo extenso, demonstrações interativas e animações scroll-triggered.

## Estrutura Geral Obrigatória

```
[progress bar fixo no topo]
[floating nav — aparece após rolar o header]
<header class="mat-header">           ← gradiente de identidade do módulo
<div class="mat-layout">              ← grid 260px sidebar + 1fr artigo
  <aside class="mat-sidebar">         ← TOC sticky com IntersectionObserver
  <article class="mat-article">       ← seções de conteúdo
<footer>                              ← footer padrão Inteli
```

## Elementos Obrigatórios

### 1. Barra de Progresso de Leitura

```html
<div id="progress-bar"></div>
```

CSS:
```css
#progress-bar {
  position: fixed; top: 0; left: 0; height: 3px;
  background: linear-gradient(90deg, var(--ac), var(--hi));
  width: 0%; z-index: 9999; transition: width .1s;
}
```

JS (no scroll):
```js
const h = document.documentElement;
const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
document.getElementById('progress-bar').style.width = pct + '%';
```

### 2. Floating Nav (segue o scroll)

Dois botões fixos no canto inferior direito que aparecem apenas após o usuário rolar além do header:

```html
<div id="float-nav">
  <a href="../slides/slide-lesson-N.html" class="fn-btn fn-btn-slides">▶ Slides</a>
  <a href="../../home-module-X-curso.html" class="fn-btn fn-btn-back">← Módulo</a>
</div>
```

CSS:
```css
#float-nav {
  position: fixed; bottom: 28px; right: 28px;
  display: flex; flex-direction: column; gap: 8px;
  z-index: 9998; opacity: 0; pointer-events: none;
  transform: translateY(12px); transition: opacity .3s, transform .3s;
}
#float-nav.visible { opacity: 1; pointer-events: auto; transform: translateY(0); }
.fn-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 16px; border-radius: 999px;
  font-size: .82rem; font-weight: 700; text-decoration: none;
  box-shadow: 0 4px 18px rgba(0,0,0,.25); white-space: nowrap;
}
.fn-btn-slides { background: white; color: var(--ac); border: 2px solid var(--ac); }
.fn-btn-back   { background: var(--dk); color: white; }
```

JS (no mesmo listener de scroll):
```js
const headerBottom = document.querySelector('.mat-header').getBoundingClientRect().bottom;
if (headerBottom < 0) { floatNav.classList.add('visible'); }
else { floatNav.classList.remove('visible'); }
```

### 3. Header da Página

```html
<header class="mat-header">
  <div class="container">
    <div class="mat-badge">Módulo N · Ciclo Comum · Código</div>
    <h1>Título da Aula</h1>
    <p class="subtitle">Aula N — Material de Leitura Aprofundado</p>
    <div class="d-flex gap-2 flex-wrap">
      <a href="../slides/slide-lesson-N.html" class="btn btn-light btn-sm">▶ Slides</a>
      <a href="../../home-module-X-curso.html" class="btn btn-outline-light btn-sm">← Voltar ao Módulo</a>
    </div>
  </div>
</header>
```

### 4. Layout Sidebar + Artigo

```html
<div class="mat-layout">
  <aside class="mat-sidebar">
    <nav class="mat-toc">
      <h4>Nesta página</h4>
      <a href="#secao-1" class="toc-h2">Título da Seção 1</a>
      <a href="#sub-1" class="toc-h3">Subtópico</a>
      <!-- ... -->
    </nav>
  </aside>
  <article class="mat-article">
    <!-- seções aqui -->
  </article>
</div>
```

CSS grid:
```css
.mat-layout {
  display: grid; grid-template-columns: 260px 1fr;
  gap: 32px; max-width: 1200px; margin: 0 auto; padding: 40px 24px;
}
@media(max-width: 900px) {
  .mat-layout { grid-template-columns: 1fr; }
  .mat-sidebar { display: none; }
}
.mat-sidebar { position: sticky; top: 24px; max-height: calc(100vh - 48px); overflow-y: auto; }
```

IntersectionObserver para TOC ativo:
```js
const tocLinks = document.querySelectorAll('.mat-toc a');
const sections = document.querySelectorAll('[id]');
const tocObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      tocLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.mat-toc a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-10% 0px -80% 0px' });
sections.forEach(s => tocObserver.observe(s));
```

### 5. Seções de Conteúdo

Cada seção usa `<section class="mat-section" id="slug">`:

```html
<section class="mat-section" id="introducao">
  <h2>Título da Seção</h2>
  <p>Parágrafo explicativo com densidade de livro didático. Mínimo 3 parágrafos por seção principal.</p>

  <h3>Subtópico</h3>
  <p>...</p>
</section>
```

### 6. Componentes de Conteúdo

#### Callout Boxes

```html
<div class="callout callout-info">
  <div class="callout-label">Definição</div>
  <p>Texto informativo aqui.</p>
</div>
```

Variantes: `callout-info`, `callout-warn`, `callout-danger`, `callout-tip`, `callout-deep`

#### Blocos de Código com Cópia

```html
<div class="code-wrap">
  <div class="code-label">
    SQL
    <button class="code-copy" onclick="copyCode(this)">Copiar</button>
  </div>
  <pre class="code-block"><code>SELECT * FROM tabela;</code></pre>
</div>
```

Syntax highlighting com spans: `.hl-kw` (keywords), `.hl-str` (strings), `.hl-num` (números), `.hl-cmt` (comentários), `.hl-typ` (tipos), `.hl-fn` (funções).

#### Animações Scroll-Triggered

```html
<div class="sr meu-diagrama" id="diagrama-xyz"></div>
```

```css
.sr { opacity: 0; transform: translateY(20px); transition: opacity .6s, transform .6s; }
.sr.vis { opacity: 1; transform: none; }
```

```js
const srObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); srObserver.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.sr').forEach(el => srObserver.observe(el));
```

#### Checklist Interativo

```html
<ul class="check-list" id="checklist">
  <li onclick="this.classList.toggle('done')">Item 1</li>
  <li onclick="this.classList.toggle('done')">Item 2</li>
</ul>
```

### 7. Footer Padrão

```html
<footer class="inteli-footer">
  <div class="container text-center">
    <img src="https://res.cloudinary.com/dyhjjms8y/image/upload/..." alt="Inteli" style="height:40px;">
    <p>Material criado pelo professor <strong>Afonso Brandão</strong> para o <strong>Inteli</strong>.</p>
    <small>🔓 Conteúdo de leitura aberta</small>
  </div>
</footer>
```

## CSS Variables Obrigatórias (no `<style>`)

```css
:root {
  --ac: #1863dc;   /* accent/link blue */
  --hi: #855ede;   /* highlight purple */
  --dk: #2e2640;   /* dark purple (headings) */
  --gr: #0d9488;   /* green (success/tip) */
  --re: #dc2626;   /* red (danger) */
  --am: #d97706;   /* amber (warn) */
  --text: #1e293b;
  --muted: #64748b;
  --border: #e2e8f0;
  --bg: #f8fafc;
  --card: #ffffff;
}
```

Fontes obrigatórias:
- `Manrope` (texto) via Google Fonts
- `JetBrains Mono` (código) via Google Fonts

## Regras de Qualidade de Conteúdo

1. **Profundidade**: cada seção deve ter no mínimo 3 parágrafos explanatórios (estilo livro didático).
2. **Exemplos concretos**: todo conceito deve ter ao menos um exemplo com código ou diagrama.
3. **Progressão**: conceitos mais simples antes dos avançados dentro de cada seção.
4. **RM-ODP**: toda aula deve ter seção sobre o viewpoint RM-ODP relevante para o tema.
5. **Checklist**: toda aula deve terminar com checklist interativo de verificação.
6. **Scroll animations**: diagramas e grids devem ter scroll-reveal (classe `.sr`).
7. **Acessibilidade**: imagens com `alt`, headings hierárquicos (h1→h2→h3), contraste de texto ≥ 4.5:1.

## Checklist de Criação

- [ ] Barra de progresso de leitura
- [ ] Floating nav (Slides + Módulo)
- [ ] Header com badge, título, subtitle e botões
- [ ] Sidebar TOC com IntersectionObserver
- [ ] Mínimo 8 seções de conteúdo
- [ ] Callout boxes usados (info, warn, tip)
- [ ] Blocos de código com syntax highlight e botão copiar
- [ ] Ao menos um diagrama animado com scroll-reveal
- [ ] Seção RM-ODP com viewpoints relevantes
- [ ] Checklist interativo ao final
- [ ] Footer Inteli
- [ ] Links relativos funcionando (slides + módulo)
- [ ] Não contém palavras "Placeholder", "em organização", "em desenvolvimento"
