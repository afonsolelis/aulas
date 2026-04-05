# Spec: Slides do Módulo 2 — Sistema Próprio de Navegação

## Objetivo

Documentar o padrão obrigatório para slides do Módulo 2 e módulos modernos. Estes slides usam sistema de navegação próprio em JS vanilla — **nunca Reveal.js**.

## Estrutura HTML Obrigatória

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- Bootstrap + Google Fonts Manrope/JetBrains Mono -->
  <!-- Link para ../../../css/inteli-styles.css -->
  <style>
    /* variáveis de cor + estilos do slide system */
  </style>
</head>
<body>
  <!-- SLIDE FOOTER (fixo, fora do container) -->
  <div class="slide-footer">
    <a href="../../home-module-X-curso.html" class="back-home">🏠 Home</a>
    <div class="slide-nav">
      <button onclick="prevSlide()">← Anterior</button>
      <span class="slide-counter"><span id="current-slide">1</span>/<span id="total-slides">N</span></span>
      <button onclick="nextSlide()">Próximo →</button>
    </div>
    <a href="../materials/lesson-N-material.html" class="back-home material">📖 Material</a>
  </div>

  <!-- SLIDE CONTAINER -->
  <div class="slide-container">
    <div class="slide active" id="slide-1"><!-- capa --></div>
    <div class="slide" id="slide-2"><!-- agenda/daily --></div>
    <!-- ... -->
    <div class="slide" id="slide-N"><!-- recap --></div>
  </div>

  <script>
    /* showSlide, prevSlide, nextSlide, teclado, animMap, animações */
  </script>
</body>
</html>
```

## Sistema de Navegação (JS Obrigatório)

```js
let current = 0;
const slides = document.querySelectorAll('.slide');
const total = slides.length;
document.getElementById('total-slides').textContent = total;

function showSlide(n) {
  slides[current].classList.remove('active');
  current = (n + total) % total;
  slides[current].classList.add('active');
  document.getElementById('current-slide').textContent = current + 1;
  clearT();
  if (animMap[current]) animMap[current]();
}
function nextSlide() { showSlide(current + 1); }
function prevSlide() { showSlide(current - 1); }
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});
```

## Sistema de Animações Cardiff

Timer helpers obrigatórios para animações sequenciais:

```js
var _ts = [], _run = false;
function T(fn, ms) { _ts.push(setTimeout(fn, ms)); }
function clearT() { _ts.forEach(clearTimeout); _ts = []; _run = false; }
```

Função de digitação para terminais:

```js
function showLine(id, tokens, delay) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '';
  let i = 0;
  T(() => {
    const iv = setInterval(() => {
      if (i >= tokens.length) { clearInterval(iv); return; }
      el.innerHTML += tokens[i++];
    }, 35);
  }, delay);
}
```

Dispatch por slide:

```js
const animMap = [
  animCover,    // slide 0
  animDaily,    // slide 1
  // ...
  animRmOdp,    // slide penúltimo (RM-ODP)
  animRfRnf,    // slide penúltimo+1 (RF/RNF/8 Eixos)
  animChecklist,// slide antepenúltimo do final
  animRecap,    // slide N-1 (último)
];
```

## Slides Padrão em Todo Deck

| # | Nome | Conteúdo |
|---|------|---------|
| 0 | Capa | Logo, título, tags de tópicos, meta (professor/data/duração) |
| 1 | Daily | Estrutura do dia / agenda de aula |
| 2–N-4 | Conteúdo | Slides temáticos com animações Cardiff |
| N-3 | RM-ODP | Framework de 5 viewpoints com destaque no viewpoint da aula |
| N-2 | RF/RNF | 8 Eixos de RNF (ISO/IEC 25010) relevantes para o tema |
| N-1 | Checklist | Checklist da aula com items marcáveis |
| N | Recap | Resumo dos pontos principais |

## Footer do Slide (CSS Obrigatório)

```css
.slide-footer {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: rgba(46,38,64,.95); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 20px; z-index: 1000; height: 52px;
}
.back-home {
  color: white; text-decoration: none; font-weight: 700;
  font-size: .82rem; padding: 6px 14px; border-radius: 8px;
  background: rgba(255,255,255,.12); transition: background .2s;
}
.back-home:hover { background: rgba(255,255,255,.22); color: white; }
.back-home.material { background: #2f8f78; color: white; }
.slide-counter { color: white; font-size: .85rem; font-weight: 700; }
.slide-nav button {
  background: rgba(255,255,255,.15); color: white; border: none;
  padding: 5px 14px; border-radius: 6px; cursor: pointer; font-weight: 700;
  font-size: .8rem; transition: background .2s;
}
.slide-nav button:hover { background: rgba(255,255,255,.3); }
```

## Slides de Conteúdo — Padrões

### Terminal Animado (Cardiff)

```html
<div class="slide" id="slide-N">
  <div class="slide-inner">
    <h2 class="slide-title">Título</h2>
    <div class="terminal">
      <div class="term-bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span></div>
      <div class="term-body">
        <div class="term-line" id="line-1"></div>
        <div class="term-line" id="line-2"></div>
      </div>
    </div>
  </div>
</div>
```

### Grid de Cards Animados

```html
<div class="mc-grid sr" id="meu-grid">
  <div class="mc" style="--d:0s"><span class="mc-icon">🔷</span><strong>Título</strong><p>Descrição</p></div>
  <div class="mc" style="--d:.1s"><span class="mc-icon">🔶</span><strong>Título</strong><p>Descrição</p></div>
</div>
```

### Slide RM-ODP (Obrigatório)

Apresentar os 5 viewpoints com destaque no relevante para a aula:

| Viewpoint | Foco |
|-----------|------|
| Enterprise | Propósito organizacional |
| Information | Estrutura e semântica de dados |
| Computational | Serviços e interfaces |
| Engineering | Infraestrutura e distribuição |
| Technology | Plataformas e padrões concretos |

### Slide RF/RNF — 8 Eixos (Obrigatório)

Os 8 eixos de RNF (ISO/IEC 25010) relevantes para o tema da aula:
USAB (Usabilidade), CONF (Confiabilidade), DES (Desempenho), SUP (Suportabilidade), SEG (Segurança), CAP (Capacidade), REST (Restrições), ORG (Organizacionais).

## Regras

1. **Nunca usar Reveal.js** — sistema próprio apenas.
2. **Slide container** com classe `slide-container`; cada slide com classe `slide`.
3. **Footer fixo** com `Home`, `Anterior/Próximo`, contador e `Material` (verde `#2f8f78`).
4. **animMap** deve ter exatamente `slides.length` entradas (null para slides sem animação).
5. **RM-ODP e RF/RNF**: obrigatórios em toda aula, posicionados antes do Checklist.
6. **Checklist**: último slide antes do Recap, itens clicáveis com `toggle('done')`.
7. Slides devem preencher o viewport sem overflow vertical nem excesso de espaço vazio.
8. Variável CSS `--dk: #2e2640` para cor principal; gradiente da capa consistente com identidade do módulo.

## Checklist de Criação

- [ ] Sistema de navegação JS próprio (sem Reveal.js)
- [ ] Footer com Home, nav, contador, Material (verde)
- [ ] animMap com entrada para cada slide
- [ ] Timer helpers `T()` e `clearT()` presentes
- [ ] Slide de capa com logo, título, tags, meta
- [ ] Slide RM-ODP com 5 viewpoints + destaque
- [ ] Slide RF/RNF com 8 eixos ISO/IEC 25010
- [ ] Slide checklist interativo
- [ ] Slide de recap/encerramento
- [ ] Links relativos para home do módulo e material funcionando
- [ ] Sem erros de console no navegador
