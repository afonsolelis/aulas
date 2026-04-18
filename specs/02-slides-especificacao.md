# Especificação de Slides — Design System Moderno

## Visão Geral

Esta especificação define o padrão atual para criação de slides no projeto Aulas. O design system utiliza HTML padronizado com JavaScript nativo para navegação e animações CSS/JavaScript integradas diretamente no arquivo.

## Estrutura Obrigatória do HTML

### Head Section

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aula N - Título da Aula - Inteli</title>
  
  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
  
  <!-- Fontes Google (Manrope) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Estilos globais Inteli -->
  <link href="../../../css/inteli-styles.css" rel="stylesheet">
  
  <!-- Estilos customizados do slide -->
  <style>
    :root { --ac:#ff4545; --hi:#c62828; --dk:#2e2640; --gr:#0d9488; --re:#dc2626; --am:#d97706; }
    body { margin:0; padding:0; overflow:hidden; font-family:'Manrope',sans-serif; background:#f5f7fb; color:var(--dk); }
    /* Classes do design system abaixo */
  </style>
</head>
```

### Body Section

```html
<body>
<div class="slide-container">
  <!-- Slides aqui -->
</div>

<!-- Footer de navegação -->
<div class="slide-footer">
  <div class="footer-links">
    <a href="../../home-module-X-CURSO.html" class="back-home">🏠 Home</a>
    <a href="../materials/lesson-N-material.html" class="back-home material">📖 Material</a>
  </div>
  <div class="nav-wrapper">
    <button onclick="prevSlide()" id="btn-prev">←</button>
    <span class="slide-counter" id="slide-counter">1 / 14</span>
    <button onclick="nextSlide()" id="btn-next">→</button>
  </div>
</div>

<script>
  // Sistema de navegação (ver abaixo)
</script>
</body>
</html>
```

## Design System — Classes CSS

### Cores do Curso

```css
/* Engineering Software (vermelho) */
--ac:#ff4545; --hi:#c62828; --dk:#2e2640;

/* Sistemas de Informação (verde) */
--ac:#89cea5; --hi:#5eb88a; --dk:#1e1829;

/* Adm Tech (roxo/navy) */
--ac:#855ede; --hi:#6b4dbb; --dk:#2e2640;

/* Common/Ciclo Comum (cinza) */
--ac:#6b7280; --hi:#4b5563; --dk:#1f2937;
```

### Estrutura Base

```css
.slide-container { width:100vw; height:100vh; position:relative; overflow:hidden; }
.slide { width:100%; height:100%; display:none; padding:44px 52px 88px; box-sizing:border-box; position:absolute; }
.slide.active { display:flex; flex-direction:column; justify-content:center; animation:slideIn 0.35s ease-in-out; }

@keyframes slideIn { from{opacity:0;transform:translateX(36px)} to{opacity:1;transform:translateX(0)} }

.sc { width:min(1140px,100%); margin:0 auto; font-size:1.05rem; line-height:1.55; }
```

### Slide Header

```css
.sh { color:white; padding:16px 22px; border-radius:14px; margin-bottom:14px; }
.sh.blue  { background:linear-gradient(135deg,var(--ac),var(--hi)); }
.sh.dark  { background:linear-gradient(135deg,var(--dk),#4a3d6b); }
.sh.green { background:linear-gradient(135deg,var(--gr),#10b981); }
.st { font-size:1.9rem; font-weight:800; margin:0 0 4px; line-height:1.15; }
.ss { font-size:0.95rem; opacity:.9; margin:0; }
```

### Boxes de Conteúdo

```css
.box { background:white; border:1px solid #dfe5ec; border-left:5px solid var(--hi); border-radius:12px; padding:14px 18px; box-shadow:0 4px 14px rgba(46,38,64,.06); }
.box h3 { font-size:1rem; font-weight:700; margin:0 0 6px; color:var(--dk); }
.box p  { margin:0 0 5px; font-size:.88rem; line-height:1.5; color:#374151; }
.box ul { margin:3px 0; padding-left:1.1rem; }
.box li { font-size:.87rem; margin-bottom:3px; line-height:1.4; color:#374151; }
.box.acc { border-left-color:var(--ac); }
.box.grn { border-left-color:var(--gr); }
```

### Grids

```css
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
.g5 { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; }
```

## Slide 1 — Capa (Cover)

### Estrutura

```html
<div class="slide cover-bg">
  <div class="sc">
    <div class="cv-badge">Módulo 6 · Engenharia de Software · ES06 · Aula 1 de 14</div>
    <div class="cv-title">Filtragem Colaborativa<br>por Usuário</div>
    <div class="cv-sub">SWEBOK, SEBOK e React Native — as bases para construir sistemas de recomendação mobile</div>
    <div class="cv-tags">
      <div class="cv-tag" id="ct0">📚 SWEBOK</div>
      <div class="cv-tag" id="ct1">🔧 SEBOK</div>
      <div class="cv-tag" id="ct2">📱 React Native</div>
    </div>
  </div>
</div>
```

### CSS da Capa

```css
.cover-bg { background:linear-gradient(135deg,#12082c 0%,#c62828 55%,#ff4545 100%) !important; }
.cv-badge { background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.28); color:white; padding:5px 16px; border-radius:999px; font-size:.82rem; font-weight:600; display:inline-block; margin-bottom:18px; }
.cv-title { font-size:3rem; font-weight:800; color:white; line-height:1.15; margin:0 0 14px; }
.cv-sub   { font-size:1.1rem; color:rgba(255,255,255,.82); margin:0 0 28px; }
.cv-tags  { display:flex; flex-wrap:wrap; gap:8px; }
.cv-tag { background:rgba(255,255,255,.13); border:1px solid rgba(255,255,255,.28); backdrop-filter:blur(8px); color:white; padding:7px 16px; border-radius:10px; font-weight:700; font-size:.84rem; opacity:0; transform:translateY(18px); transition:all .5s cubic-bezier(.34,1.3,.64,1); }
.cv-tag.vis { opacity:1; transform:translateY(0); }
```

### Animação da Capa (JavaScript)

```javascript
function animCover() {
  var tags = document.querySelectorAll('.cv-tag');
  tags.forEach(function(t){ t.classList.remove('vis'); });
  tags.forEach(function(t,i){
    setTimeout(function(){ t.classList.add('vis'); }, 200 + i * 180);
  });
}
```

## Slide 2 — Agenda

### Estrutura

```html
<div class="slide">
  <div class="sc">
    <div class="sh blue"><div class="st">Agenda da Aula</div><div class="ss">Estrutura do encontro de hoje</div></div>
    <div class="g2" style="gap:14px;">
      <div class="box acc" id="ag0">
        <h3>📋 Bloco 1 — Visão Geral do Módulo</h3>
        <p>Projeto 6, contexto do problema, entregáveis do módulo e expectativas.</p>
      </div>
      <div class="box" id="ag1">
        <h3>📚 Bloco 2 — SWEBOK</h3>
        <p>Áreas de conhecimento de engenharia de software segundo o IEEE.</p>
      </div>
    </div>
  </div>
</div>
```

## Slide Footer — Navegação

### HTML

```html
<div class="slide-footer">
  <div class="footer-links">
    <a href="../../home-module-X-CURSO.html" class="back-home">🏠 Home</a>
    <a href="../materials/lesson-N-material.html" class="back-home material">📖 Material</a>
  </div>
  <div class="nav-wrapper">
    <button onclick="prevSlide()" id="btn-prev">←</button>
    <span class="slide-counter" id="slide-counter">1 / 14</span>
    <button onclick="nextSlide()" id="btn-next">→</button>
  </div>
</div>
```

### CSS

```css
.slide-footer { position:fixed; bottom:0; left:0; right:0; background:rgba(255,255,255,.97); border-top:1px solid #dfe5ec; padding:10px 24px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 -2px 10px rgba(46,38,64,.06); z-index:100; gap:12px; }
.footer-links { display:flex; gap:10px; }
.back-home { color:var(--dk); text-decoration:none; font-weight:700; display:inline-flex; align-items:center; gap:5px; padding:8px 14px; border-radius:10px; background:#f1f4f8; font-size:.9rem; }
.back-home.material { background:#2f8f78 !important; color:white !important; }
.nav-wrapper { display:flex; align-items:center; gap:14px; background:#f1f4f8; padding:7px 18px; border-radius:30px; }
.nav-buttons button { background:var(--dk); color:white; border:none; padding:8px 16px; border-radius:8px; font-weight:700; cursor:pointer; }
.slide-counter { font-weight:700; color:var(--dk); min-width:70px; text-align:center; }
```

## Sistema de Navegação JavaScript

```javascript
var _cur = 0;
var _run = true;
var _total = 0;

function showSlide(n) {
  var slides = document.querySelectorAll('.slide');
  _total = slides.length;
  if (n < 0) n = 0;
  if (n >= _total) n = _total - 1;
  _cur = n;
  slides.forEach(function(s, i) {
    s.classList.remove('active');
    if (i === n) {
      s.classList.add('active');
      var fn = s.getAttribute('data-anim');
      if (fn && typeof window[fn] === 'function') {
        _run = true;
        window[fn]();
      }
    }
  });
  document.getElementById('slide-counter').textContent = (n+1) + ' / ' + _total;
  document.getElementById('btn-prev').disabled = n === 0;
  document.getElementById('btn-next').disabled = n === _total - 1;
}

function nextSlide() { showSlide(_cur + 1); }
function prevSlide() { showSlide(_cur - 1); }

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

showSlide(0);
```

## Componentes Visuais

### Pipeline (Fluxo de Processos)

```css
.pipe { display:flex; align-items:flex-start; justify-content:center; gap:0; margin:14px 0; }
.ps { flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; position:relative; }
.pn { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.3rem; color:white; font-weight:800; z-index:2; box-shadow:0 4px 14px rgba(0,0,0,.18); flex-shrink:0; }
.pl { font-size:.8rem; font-weight:700; color:var(--dk); margin-top:7px; }
.pc { position:absolute; top:26px; left:calc(50% + 26px); width:calc(100% - 52px); height:4px; z-index:1; }
.pcb { width:100%; height:100%; border-radius:2px; background:linear-gradient(90deg,var(--fc,#ff4545),var(--tc,#c62828)); }
```

### Terminal / Código

```css
.term { background:#1e1e2e; border-radius:14px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,.3); display:flex; flex-direction:column; }
.term-bar { background:#313244; padding:7px 12px; display:flex; align-items:center; gap:6px; }
.dot { width:10px; height:10px; border-radius:50%; }
.dot.r{background:#f38ba8;} .dot.y{background:#f9e2af;} .dot.g{background:#a6e3a1;}
.term-ttl { color:#6c7086; font-size:.7rem; font-weight:600; margin-left:7px; font-family:monospace; }
.term-body { padding:12px 14px; font-family:'Courier New',monospace; font-size:.8rem; line-height:1.65; flex:1; overflow:hidden; }
/* Syntax highlighting */
.kw{color:#89b4fa;font-weight:700;} .pth{color:#a6e3a1;} .ver{color:#f9e2af;}
.cm{color:#6c7086;font-style:italic;} .txt{color:#cdd6f4;}
```

### Method Cards

```css
.mc { background:white; border-radius:11px; padding:12px 14px; border-top:4px solid var(--mc,var(--ac)); box-shadow:0 4px 14px rgba(46,38,64,.08); opacity:0; transform:translateY(18px) scale(.93); transition:all .5s cubic-bezier(.34,1.3,.64,1); }
.mc.vis { opacity:1; transform:translateY(0) scale(1); }
.mb { font-size:.74rem; font-weight:800; padding:2px 9px; border-radius:5px; background:var(--mc,var(--ac)); color:white; display:inline-block; margin-bottom:6px; font-family:monospace; }
.mt { font-size:.84rem; font-weight:700; color:var(--dk); margin-bottom:3px; }
.md { font-size:.76rem; color:#64748b; line-height:1.35; }
```

### Status Bars

```css
.sbr { display:flex; align-items:center; gap:10px; opacity:0; transform:translateX(-18px); transition:all .5s cubic-bezier(.34,1.56,.64,1); margin-bottom:7px; }
.sbr.vis { opacity:1; transform:translateX(0); }
.scg { width:48px; font-size:.78rem; font-weight:800; font-family:monospace; color:var(--dk); text-align:right; flex-shrink:0; }
.str { flex:1; height:26px; background:#f1f5f9; border-radius:8px; overflow:hidden; }
.sf  { height:100%; border-radius:8px; display:flex; align-items:center; padding-left:10px; transition:width .85s cubic-bezier(.34,1.56,.64,1); }
```

### Story Table

```css
.stbl { width:100%; border-collapse:separate; border-spacing:0 5px; }
.stbl th { padding:9px 12px; font-size:.86rem; font-weight:800; text-align:left; border-radius:9px; }
.stbl th:nth-child(1){background:var(--dk);color:white;width:22%;}
.stbl th:nth-child(2){background:linear-gradient(135deg,var(--ac),#e53e3e);color:white;}
.stbl th:nth-child(3){background:linear-gradient(135deg,var(--gr),#10b981);color:white;}
.stbl td { padding:9px 12px; font-size:.86rem; vertical-align:top; border-radius:8px; }
.stbl td:nth-child(1){background:var(--dk);color:white;font-weight:700;}
```

### Layers Stack

```css
.lstack { display:flex; flex-direction:column; gap:8px; margin:8px 0; }
.alayer { border-radius:12px; padding:13px 18px; display:flex; align-items:center; gap:14px; opacity:0; transform:translateX(-28px) scale(.95); transition:all .6s cubic-bezier(.34,1.3,.64,1); }
.alayer.vis { opacity:1; transform:translateX(0) scale(1); }
.li { font-size:1.9rem; flex-shrink:0; }
.ln { font-size:1rem; font-weight:800; color:white; margin-bottom:2px; }
.lt { font-size:.78rem; color:rgba(255,255,255,.88); }
```

## Checklist de Validação

- [ ] Slide 1: Cover com gradiente, badge, título, subtítulo e tags animadas
- [ ] Slide 2: Agenda com slide header e boxes de blocos
- [ ] Footer: Botões Home, Material (verde), navegação e contador
- [ ] Navegação: Botões funcionam com clique e teclas (← → Espaço)
- [ ] CSS: Variáveis de cores do curso configuradas no :root
- [ ] Fonte: Manrope carregada do Google Fonts
- [ ] Animações: Funções JavaScript para cada slide (data-anim)

## Boas Práticas

### Conteúdo
- Máximo 6-8 bullets por slide
- Usar boxes para destaque (acc, grn)
- Incluir terminal/code para exemplos técnicos
- Usar pipeline para fluxos de processo

### Animações
- Usar classes `.vis` para elementos que animam entrada
- Funções de animação nomeadas: `animCover()`, `animAgenda()`, etc.
- Atribuir via `<div class="slide" data-anim="animNome">`

### Design
- Preencher viewport sem espaços vazios excessivos
- Usar grids (g2, g3, g5) para layouts responsivos
- Manter consistência de cores com o curso