# Spec: Estrutura Obrigatória dos Slides do Módulo 2

## Objetivo

Todo deck de slides do Módulo 2 deve ter exatamente **3 slides fixos no início**: Capa, Daily (com cronômetro) e Agenda. Essa sequência é obrigatória independente do conteúdo da aula.

---

## Slide 1 — Capa

**Posição:** primeiro slide (índice 0 no animMap).

**Elementos obrigatórios:**

| Elemento | Classe/ID | Conteúdo |
|----------|-----------|----------|
| Badge | `.cv-badge` | `Módulo 2 · Ciclo Comum · IN02 · Aula N de 11` |
| Título | `.cv-title` | Nome curto da aula + subtítulo menor |
| Subtítulo | `.cv-sub` | Descrição dos temas abordados |
| Tags de tópicos | `.cv-tags` + `.cv-tag` | 4–6 tags com emoji, IDs `ct0`…`ctN` |

**CSS obrigatório:**
```css
.cover-bg { background:linear-gradient(135deg,#1f2937 0%,#4b5563 50%,#b2b6bf 100%) !important; }
.cv-badge { background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.28); color:white; padding:5px 16px; border-radius:999px; font-size:.82rem; font-weight:600; display:inline-block; margin-bottom:18px; }
.cv-title { font-size:3rem; font-weight:800; color:white; line-height:1.15; margin:0 0 14px; }
.cv-sub   { font-size:1.1rem; color:rgba(255,255,255,.82); margin:0 0 28px; }
.cv-tags  { display:flex; flex-wrap:wrap; gap:8px; }
.cv-tag   { background:rgba(255,255,255,.13); border:1px solid rgba(255,255,255,.28); color:white; padding:7px 16px; border-radius:10px; font-weight:700; font-size:.84rem; opacity:0; transform:translateY(18px); transition:all .5s cubic-bezier(.34,1.3,.64,1); }
.cv-tag.vis { opacity:1; transform:translateY(0); }
```

**Animação obrigatória (`animCover`):**
```js
function animCover() {
  // remove vis de todos os ct0..ctN
  // adiciona vis com stagger de 120ms cada
  ['ct0','ct1','ct2','ct3','ct4','ct5'].forEach(function(id,i){
    T(function(){ var el=document.getElementById(id); if(el) el.classList.add('vis'); }, i*120);
  });
}
```

**Estrutura HTML:**
```html
<!-- ====== SLIDE 1: CAPA ====== -->
<div class="slide cover-bg">
  <div class="sc">
    <div class="cv-badge">Módulo 2 · Ciclo Comum · IN02 · Aula N de 11</div>
    <div class="cv-title">Título da Aula<br><span style="font-size:2rem;opacity:.9;">Subtítulo Complementar</span></div>
    <div class="cv-sub">Descrição dos temas abordados na aula</div>
    <div class="cv-tags">
      <div class="cv-tag" id="ct0">🏷️ Tópico 1</div>
      <div class="cv-tag" id="ct1">🏷️ Tópico 2</div>
      <div class="cv-tag" id="ct2">🏷️ Tópico 3</div>
      <div class="cv-tag" id="ct3">🏷️ Tópico 4</div>
    </div>
  </div>
</div>
```

---

## Slide 2 — Daily com Cronômetro

**Posição:** segundo slide (índice 1 no animMap).

**Propósito:** conduzir a daily standup de 15 minutos com cronômetro regressivo interativo.

**Elementos obrigatórios:**

| Elemento | ID | Descrição |
|----------|----|-----------|
| Display do timer | `daily-timer` | Exibe `MM:SS`, começa em `15:00` |
| Botão iniciar/pausar | `daily-start-btn` | Toggle: Iniciar / Pausar / Continuar / Fim! |
| Botão reset | — | Volta para `15:00` |
| Tags das perguntas | `dt0`…`dt3` | Animam em entrada com stagger |

**CSS obrigatório:**
```css
.daily-timer { font-size:3.5rem; font-weight:800; font-family:monospace; background:rgba(255,255,255,.15); border-radius:16px; padding:10px 28px; display:inline-block; margin-bottom:16px; letter-spacing:4px; color:white; }
.daily-tag { background:rgba(255,255,255,.18); border:1px solid rgba(255,255,255,.3); padding:6px 16px; border-radius:8px; font-weight:700; font-size:.85rem; color:white; opacity:0; transform:translateY(14px); transition:all .45s cubic-bezier(.34,1.3,.64,1); display:inline-block; margin:4px; }
.daily-tag.vis { opacity:1; transform:translateY(0); }
```

**JS obrigatório (timer):**
```js
var dailyInterval = null;
var dailySeconds = 900;
var dailyRunning = false;

function updateDailyDisplay() {
  var m = Math.floor(dailySeconds / 60);
  var s = dailySeconds % 60;
  var el = document.getElementById('daily-timer');
  if (el) el.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}
function startDaily() {
  if (dailyRunning) {
    clearInterval(dailyInterval);
    dailyRunning = false;
    document.getElementById('daily-start-btn').textContent = '▶ Continuar';
    return;
  }
  dailyRunning = true;
  document.getElementById('daily-start-btn').textContent = '⏸ Pausar';
  dailyInterval = setInterval(function() {
    if (dailySeconds <= 0) {
      clearInterval(dailyInterval);
      dailyRunning = false;
      document.getElementById('daily-start-btn').textContent = '✅ Fim!';
      return;
    }
    dailySeconds--;
    updateDailyDisplay();
  }, 1000);
}
function resetDaily() {
  clearInterval(dailyInterval);
  dailyRunning = false;
  dailySeconds = 900;
  updateDailyDisplay();
  document.getElementById('daily-start-btn').textContent = '▶ Iniciar';
}
```

**Animação (`animDaily`):**
```js
function animDaily() {
  ['dt0','dt1','dt2','dt3'].forEach(function(id){ var el=document.getElementById(id); if(el) el.classList.remove('vis'); });
  ['dt0','dt1','dt2','dt3'].forEach(function(id,i){
    T(function(){ var el=document.getElementById(id); if(el) el.classList.add('vis'); }, 300 + i*200);
  });
}
```

**Estrutura HTML:**
```html
<!-- ====== SLIDE 2: DAILY ====== -->
<div class="slide cover-bg" style="background:linear-gradient(135deg,#1f2937 0%,#4b5563 50%,#b2b6bf 100%)!important;">
  <div class="sc" style="text-align:center;">
    <div style="background:rgba(255,255,255,.12);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.22);border-radius:20px;padding:28px 32px;">
      <div style="font-size:2rem;font-weight:800;color:white;margin-bottom:6px;">⏱️ Daily — 15 Minutos</div>
      <div style="font-size:1rem;color:rgba(255,255,255,.85);margin-bottom:18px;">O que você fez? O que vai fazer? Algum impedimento?</div>
      <div class="daily-timer" id="daily-timer">15:00</div>
      <div style="margin-bottom:18px;">
        <button id="daily-start-btn" onclick="startDaily()" style="background:rgba(255,255,255,.25);border:1px solid rgba(255,255,255,.4);color:white;padding:9px 22px;border-radius:10px;font-weight:700;font-size:.9rem;cursor:pointer;margin:0 6px;font-family:'Manrope',sans-serif;">▶ Iniciar</button>
        <button onclick="resetDaily()" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);color:white;padding:9px 22px;border-radius:10px;font-weight:700;font-size:.9rem;cursor:pointer;margin:0 6px;font-family:'Manrope',sans-serif;">↺ Reset</button>
      </div>
      <div>
        <span class="daily-tag" id="dt0">✅ O que fiz</span>
        <span class="daily-tag" id="dt1">🎯 O que vou fazer</span>
        <span class="daily-tag" id="dt2">🚧 Impedimentos</span>
        <span class="daily-tag" id="dt3">📦 Progresso do projeto</span>
      </div>
    </div>
  </div>
</div>
```

---

## Slide 3 — Agenda da Aula

**Posição:** terceiro slide (índice 2 no animMap).

**Propósito:** apresentar os blocos de conteúdo da aula, com tempo estimado e destaque do objetivo central.

**Elementos obrigatórios:**

| Elemento | Classe/ID | Conteúdo |
|----------|-----------|----------|
| Header do slide | `.sh.dark` | "Agenda da Aula N" |
| Cards de blocos | `.box` com IDs `ag0`…`agN` | 3–4 blocos de conteúdo com tempo |
| Objetivo central | `.callout` ou box destacado | O que o aluno deve conseguir ao final |

**Animação (`animAgenda`):**
```js
function animAgenda() {
  ['ag0','ag1','ag2','ag3'].forEach(function(id){ var el=document.getElementById(id); if(el){ el.style.opacity='0'; el.style.transform='translateY(18px)'; } });
  ['ag0','ag1','ag2','ag3'].forEach(function(id,i){
    T(function(){
      var el=document.getElementById(id);
      if(el){ el.style.opacity='1'; el.style.transform='translateY(0)'; el.style.transition='all .45s cubic-bezier(.34,1.3,.64,1)'; }
    }, i*160);
  });
}
```

**Estrutura HTML:**
```html
<!-- ====== SLIDE 3: AGENDA ====== -->
<div class="slide">
  <div class="sc">
    <div class="sh dark"><div class="st">📋 Agenda da Aula N</div><div class="ss">Estrutura e objetivos da aula de hoje</div></div>
    <div class="g2" style="gap:12px;">
      <div id="ag0" class="box" style="opacity:0;">
        <h3>🕐 Bloco 1 — Título (XX min)</h3>
        <p>Descrição do que será abordado neste bloco.</p>
      </div>
      <div id="ag1" class="box" style="opacity:0;">
        <h3>🕑 Bloco 2 — Título (XX min)</h3>
        <p>Descrição do que será abordado neste bloco.</p>
      </div>
      <div id="ag2" class="box" style="opacity:0;">
        <h3>🕒 Bloco 3 — Título (XX min)</h3>
        <p>Descrição do que será abordado neste bloco.</p>
      </div>
      <div id="ag3" class="box acc" style="opacity:0;">
        <h3>🎯 Objetivo da Aula</h3>
        <p>O que o aluno deve conseguir fazer ao final desta aula.</p>
      </div>
    </div>
  </div>
</div>
```

---

## Estrutura completa do animMap

```js
const animMap = [
  animCover,    // 0 — Capa
  animDaily,    // 1 — Daily com cronômetro
  animAgenda,   // 2 — Agenda
  // ... slides de conteúdo ...
  animRmOdp,    // N-3 — RM-ODP viewpoints
  animRfRnf,    // N-2 — RF/RNF e 8 Eixos
  animChecklist,// N-1 — Checklist interativo
  animRecap,    // N   — Recap/Encerramento
];
```

---

## Regras de validação

1. **Ordem obrigatória**: Capa (0) → Daily (1) → Agenda (2) → conteúdo → RM-ODP → RF/RNF → Checklist → Recap.
2. **Cronômetro**: `daily-timer`, `daily-start-btn`, `startDaily()`, `resetDaily()` e `updateDailyDisplay()` presentes em todos os decks.
3. **animMap**: entrada para cada slide (null para slides sem animação específica); tamanho igual a `slides.length`.
4. **Badge da capa**: deve conter o número correto da aula (`Aula N de 11`).
5. **Tags da capa**: IDs `ct0`…`ctN`, animam com stagger de 120ms.
6. **Tags da daily**: IDs `dt0`…`dt3`, animam com stagger de 200ms após 300ms de delay.
