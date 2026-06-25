# Frontend Best Practices - Inteli Educational Platform

Esta skill contém as melhores práticas e padrões de desenvolvimento para engenheiros front-end trabalhando na plataforma educacional do Inteli.

## Descrição

Guia completo de padrões de código, design system, arquitetura de componentes e convenções para desenvolvimento front-end na plataforma Inteli. Use esta skill ao criar novas páginas, módulos, aulas ou componentes.

---

## 1. ESTRUTURA DE ARQUIVOS E PASTAS

### Organização do Projeto

```
/
├── config/                     # Arquivos JSON de configuração
│   ├── module-[N]-[curso].json
│   └── template-*.json
├── css/                        # Estilos globais
│   └── inteli-styles.css
├── pages/                      # Todas as páginas HTML
│   ├── autoestudos/           # Artigos de autoestudo
│   ├── module-[N]-[curso]/    # Aulas do módulo
│   │   └── lesson-[N].html
│   ├── module-[N]-[curso].html # Página do módulo
│   ├── autoestudos.html       # Portal de autoestudos
│   └── professor.html         # Perfil do professor
└── index.html                  # Página inicial
```

### Convenções de Nomenclatura

**Arquivos:**
- Módulos: `module-[numero]-[sigla-curso]` (ex: `module-5-adm-tech`)
- Aulas: `lesson-[numero].html` (numeração inicia em 1)
- Configurações: `module-[numero]-[sigla-curso].json`
- Minúsculas com hífens (kebab-case)

**Classes CSS:**
```css
/* Componentes principais */
.logo-container
.slide-container
.module-header
.content-section

/* Específicos de curso */
.card-header-adm-tech
.card-header-si
.bg-adm-tech
.bg-si

/* Badges e indicadores */
.module-badge
.lesson-number

/* Navegação */
.nav-buttons
.back-home
.slide-footer
```

---

## 2. DESIGN SYSTEM

### 2.1 Paleta de Cores (CSS Variables)

**Sempre use CSS Variables definidas em `/css/inteli-styles.css`:**

```css
:root {
  /* Cores Primárias Inteli */
  --inteli-purple: #855ede;
  --inteli-blue: #1863dc;

  /* Cores Secundárias */
  --inteli-dark-purple: #2E2640;
  --inteli-very-dark: #1e1829;
  --inteli-light-purple: #C39EFF;
  --inteli-light-orange: #FFBC7D;
  --inteli-green: #61ce70;
  --inteli-pink: #f78da7;

  /* Cores por Curso */
  --adm-tech-navy: #1a237e;
  --si-blue: #039be5;
}
```

### 2.2 Gradientes Padrão

```css
/* Gradiente primário Inteli */
background: linear-gradient(135deg, #855ede, #1863dc);

/* Autoestudos */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Módulo 9 - Sistemas de Informação */
background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
```

### 2.3 Tipografia

**Fontes:**
```css
/* Títulos e destaques */
font-family: 'Poppins', sans-serif;
font-weight: 500 | 600 | 700;

/* Corpo de texto */
font-family: 'Inter', sans-serif;
font-weight: 400 | 500 | 600;

/* Fallback system fonts */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

**Escala Tipográfica:**
- Títulos principais: `2.5rem` - `3rem` (Poppins Bold)
- Subtítulos: `1.5rem` - `2rem` (Poppins Semibold)
- Corpo: `1rem` - `1.1rem` (Inter Regular)
- Small: `0.875rem` (Inter Regular)

### 2.4 Efeitos Glassmorphism

**Padrão para cards e overlays:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### 2.5 Transições e Animações

**Padrão de transições:**
```css
/* Hover em cards */
transition: all 0.3s ease;
transform: translateY(-10px);

/* Fade-in de slides */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Timing padrão */
transition-duration: 0.2s - 0.5s;
transition-timing-function: ease | ease-in-out;
```

---

## 3. COMPONENTES REUTILIZÁVEIS

### 3.1 Logo Container

```html
<div class="logo-container">
  <img src="https://res.cloudinary.com/dyhjjms8y/image/upload/v1234567890/logo-inteli.png"
       alt="Inteli Logo"
       style="max-width: 200px;">
</div>
```

**Regras:**
- Usar sempre URL do Cloudinary para consistência
- Alt text descritivo
- max-width para responsividade

### 3.2 Footer Global

```html
<footer class="inteli-footer mt-auto py-4 bg-light border-top">
  <div class="container text-center">
    <p class="mb-1">
      Material criado pelo professor <strong>Afonso Brandão</strong>
      para o <strong>Inteli</strong>.
    </p>
    <small class="text-muted">🔓 Licença de leitura aberta</small>
  </div>
</footer>
```

**Regras:**
- Footer presente em TODAS as páginas
- Classes Bootstrap para spacing
- Texto padronizado
- Licença aberta sempre visível

### 3.3 Card de Módulo (Index)

```html
<div class="card shadow-sm h-100 border-0">
  <div class="card-header bg-adm-tech text-white text-center">
    <span class="module-badge bg-white text-dark px-3 py-1 rounded-pill">
      Módulo 5
    </span>
    <h5 class="mt-3 mb-0 fw-bold">Nome do Módulo</h5>
  </div>
  <div class="card-body">
    <h6 class="fw-semibold mb-3">📚 Principais Tópicos:</h6>
    <ul class="list-unstyled">
      <li>📊 Tópico 1</li>
      <li>💻 Tópico 2</li>
    </ul>
  </div>
  <div class="card-footer bg-transparent border-0 text-center pb-3">
    <a href="pages/module-5-adm-tech.html"
       class="btn btn-inteli">
      Ver Módulo →
    </a>
  </div>
</div>
```

**Regras:**
- Badge com número do módulo
- Header colorido por curso (use classes específicas)
- Lista de tópicos com emojis relevantes
- Botão CTA sempre presente
- Shadow e border-radius para elevação

### 3.4 Sistema de Slides (Aulas)

**Estrutura HTML:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Título da Aula] - Inteli</title>
  <link rel="icon" href="data:image/svg+xml,<svg>...</svg>">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="../../css/inteli-styles.css" rel="stylesheet">
  <style>
    /* Estilos específicos da aula */
  </style>
</head>
<body>
  <div class="slide-container">
    <!-- Slide de capa -->
    <div class="slide active cover-slide">
      <div class="glass-card">
        <h1>[Título]</h1>
        <p>[Descrição]</p>
      </div>
    </div>

    <!-- Slides de conteúdo -->
    <div class="slide">
      <div class="slide-header">
        <div class="slide-title">[Título do Slide]</div>
      </div>
      <div class="slide-content">
        <!-- Conteúdo -->
      </div>
    </div>
  </div>

  <!-- Footer fixo -->
  <div class="slide-footer">
    <img src="[logo-compact]" class="footer-logo" alt="Inteli">
    <a href="../module-X.html" class="back-home">← Voltar ao Módulo</a>
    <div class="slide-counter">
      Slide <span id="current-slide">1</span> de <span id="total-slides">X</span>
    </div>
    <div class="nav-buttons">
      <button id="prev-btn" disabled>← Anterior</button>
      <button id="next-btn">Próximo →</button>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    // JavaScript de navegação (ver seção 5)
  </script>
</body>
</html>
```

**Regras:**
- Primeiro slide sempre é `cover-slide`
- Classe `active` define slide visível
- Footer fixo com navegação
- Contador dinâmico
- Logo compacto no footer

---

## 4. ARQUITETURA DE NAVEGAÇÃO

### 4.1 Hierarquia de URLs

```
Nível 1: /index.html
         ├─ /pages/professor.html
         ├─ /pages/autoestudos.html
         │  └─ /pages/autoestudos/[nome].html
         └─ /pages/module-[N]-[curso].html
            └─ /pages/module-[N]-[curso]/lesson-[N].html
```

### 4.2 Links de Navegação

**Breadcrumb padrão:**
- Aulas → Módulo: `<a href="../module-X.html">← Voltar ao Módulo</a>`
- Módulo → Index: `<a href="../index.html">← Voltar</a>`
- Autoestudos → Portal: `<a href="../autoestudos.html">← Portal de Autoestudos</a>`

**Regras:**
- Sempre fornecer caminho de volta
- Texto descritivo (não apenas "Voltar")
- Usar caminhos relativos

### 4.3 Estrutura de Página de Módulo

```html
<div class="container-fluid">
  <div class="row">
    <!-- Sidebar -->
    <div class="col-lg-3 sidebar">
      <div class="sticky-top">
        <div class="module-info">
          <h2>[Nome do Módulo]</h2>
          <p>[Descrição]</p>
        </div>

        <div class="section">
          <h5>📚 Principais Tópicos</h5>
          <!-- Tópicos organizados por disciplina -->
        </div>

        <div class="section">
          <h5>🔗 Links Externos</h5>
          <!-- Google Drive, etc -->
        </div>
      </div>
    </div>

    <!-- Grid de aulas -->
    <div class="col-lg-9">
      <div class="row g-4">
        <!-- Cards de aulas -->
      </div>
    </div>
  </div>
</div>
```

---

## 5. JAVASCRIPT PATTERNS

### 5.1 Sistema de Navegação de Slides

**Template padrão:**
```javascript
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentSlideSpan = document.getElementById('current-slide');
const totalSlidesSpan = document.getElementById('total-slides');

// Inicialização
totalSlidesSpan.textContent = totalSlides;

function showSlide(n) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (n + totalSlides) % totalSlides;
  slides[currentSlide].classList.add('active');
  currentSlideSpan.textContent = currentSlide + 1;

  // Atualizar estados dos botões
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === totalSlides - 1;
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    showSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    showSlide(currentSlide - 1);
  }
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Navegação por teclado
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevSlide();
  }
});
```

**Regras:**
- Sempre incluir navegação por teclado
- Desabilitar botões nos limites
- Atualizar contador em tempo real
- Prevenir comportamento padrão de espaço

### 5.2 Copy to Clipboard

```javascript
function copyCode(button) {
  const codeBlock = button.previousElementSibling;
  const code = codeBlock.textContent;

  navigator.clipboard.writeText(code).then(() => {
    const originalText = button.textContent;
    button.textContent = '✓ Copiado!';
    button.classList.add('btn-success');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('btn-success');
    }, 2000);
  });
}
```

---

## 6. CONFIGURAÇÃO JSON

### 6.1 Estrutura de module-[X].json

```json
{
  "module": {
    "name": "Módulo X - Nome do Módulo",
    "course": "Nome do Curso",
    "description": "Descrição detalhada do módulo e objetivos de aprendizagem"
  },
  "lessons": [
    {
      "number": 1,
      "title": "Introdução ao Tema",
      "description": "Breve descrição da aula"
    },
    {
      "number": 2,
      "title": "Conceitos Avançados",
      "description": "Descrição da segunda aula"
    }
  ],
  "disciplines": {
    "mathematics": {
      "topics": [
        "Tópico 1",
        "Tópico 2"
      ]
    },
    "computing": {
      "topics": [
        "Tópico 1",
        "Tópico 2"
      ]
    },
    "ux": {
      "topics": [
        "Tópico 1"
      ]
    },
    "business": {
      "topics": [
        "Tópico 1"
      ]
    },
    "leadership": {
      "topics": [
        "Tópico 1"
      ]
    }
  },
  "external_links": {
    "drive": "https://drive.google.com/...",
    "resources": "https://..."
  }
}
```

---

## 7. RESPONSIVIDADE E ACESSIBILIDADE

### 7.1 Breakpoints Bootstrap

```css
/* Mobile first */
.col-12          /* xs: < 576px */
.col-sm-*        /* sm: ≥ 576px */
.col-md-*        /* md: ≥ 768px */
.col-lg-*        /* lg: ≥ 992px */
.col-xl-*        /* xl: ≥ 1200px */
```

**Uso padrão:**
- Cards de módulos: `col-md-6 col-lg-4`
- Sidebar: `col-lg-3` (full width em mobile)
- Conteúdo: `col-lg-9`

### 7.2 Checklist de Acessibilidade

- [ ] Alt text em todas as imagens
- [ ] Navegação via teclado funcionando
- [ ] Contraste mínimo de 4.5:1 para texto
- [ ] HTML semântico (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [ ] Links descritivos (não apenas "clique aqui")
- [ ] Focus states visíveis em elementos interativos
- [ ] Meta viewport para responsividade

---

## 8. PERFORMANCE E OTIMIZAÇÃO

### 8.1 Assets Externos

**CDNs oficiais:**
```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

**Cloudinary para imagens:**
- Base URL: `https://res.cloudinary.com/dyhjjms8y/image/upload/`
- Usar transformações para otimização quando possível

### 8.2 Boas Práticas

- Minificar CSS inline em produção
- Lazy loading para imagens fora da viewport
- Defer/async em scripts não críticos
- Usar CSS Variables para evitar repetição
- Combinar múltiplos event listeners quando possível

---

## 9. CHECKLIST DE QUALIDADE

### Antes de Commitar:

**HTML:**
- [ ] Indentação consistente (2 espaços)
- [ ] Meta tags presentes (charset, viewport, title)
- [ ] Favicon definido
- [ ] Footer global incluído
- [ ] Links de navegação funcionando
- [ ] Semântica HTML5 correta

**CSS:**
- [ ] Usar CSS Variables para cores
- [ ] Seguir convenção de nomenclatura
- [ ] Efeitos de transição suaves
- [ ] Responsividade testada
- [ ] Glassmorphism aplicado corretamente

**JavaScript:**
- [ ] Navegação de slides funcionando
- [ ] Event listeners sem memory leaks
- [ ] Feedback visual para ações do usuário
- [ ] Console sem erros

**Conteúdo:**
- [ ] Títulos descritivos e claros
- [ ] Texto revisado (ortografia e gramática)
- [ ] Emojis relevantes e consistentes
- [ ] JSON de configuração atualizado

**Acessibilidade:**
- [ ] Alt text em imagens
- [ ] Navegação por teclado
- [ ] Contraste adequado
- [ ] Links descritivos

---

## 10. FLUXO DE TRABALHO PARA NOVOS MÓDULOS

### Passo a Passo:

1. **Criar configuração JSON:**
   ```bash
   cp config/template-config.json config/module-X-[curso].json
   ```
   Preencher com informações do módulo

2. **Criar página do módulo:**
   ```bash
   cp pages/module-5-adm-tech.html pages/module-X-[curso].html
   ```
   - Atualizar header com cor do curso
   - Preencher sidebar com tópicos do JSON
   - Criar grid de aulas

3. **Criar pasta de aulas:**
   ```bash
   mkdir pages/module-X-[curso]
   ```

4. **Criar aulas:**
   ```bash
   cp pages/module-5-adm-tech/lesson-1.html pages/module-X-[curso]/lesson-1.html
   ```
   - Atualizar título e conteúdo
   - Configurar navegação de slides
   - Testar navegação por teclado

5. **Adicionar card no index.html:**
   - Copiar estrutura de card existente
   - Atualizar cores, badge, tópicos e link

6. **Testar fluxo completo:**
   - Index → Módulo → Aula → Voltar

---

## 11. COMANDOS ÚTEIS

### Git:

```bash
# Status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: adicionar módulo X com Y aulas"

# Push
git push origin main
```

### Desenvolvimento Local:

```bash
# Servir localmente (Python)
python -m http.server 8000

# Servir localmente (Node)
npx serve

# Acessar
open http://localhost:8000
```

---

## 12. RECURSOS E REFERÊNCIAS

**Bibliotecas:**
- [Bootstrap 5.3 Docs](https://getbootstrap.com/docs/5.3/)
- [Google Fonts](https://fonts.google.com/)

**Design:**
- [Coolors - Paleta de cores](https://coolors.co/)
- [CSS Gradient Generator](https://cssgradient.io/)

**Validação:**
- [W3C HTML Validator](https://validator.w3.org/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Assets:**
- [Cloudinary Dashboard](https://cloudinary.com/)
- [Inteli Brand Guidelines](interno)

---

## RESUMO EXECUTIVO

**Princípios fundamentais:**

1. **Consistência:** Seguir padrões estabelecidos em todo o projeto
2. **Modularidade:** Componentes reutilizáveis e configurações JSON
3. **Responsividade:** Mobile-first com Bootstrap grid
4. **Acessibilidade:** Navegação por teclado e semântica adequada
5. **Performance:** CDNs, lazy loading, código otimizado
6. **Branding:** Cores Inteli, footer padronizado, licença aberta
7. **Simplicidade:** Código limpo, sem over-engineering
8. **Documentação:** Comentários quando necessário, nomes descritivos

**Lembre-se:**
- Toda página deve ter footer global
- Use CSS Variables para cores
- Teste navegação por teclado em slides
- Mantenha JSONs de configuração atualizados
- Siga convenções de nomenclatura
- Priorize acessibilidade e responsividade

---

**Versão:** 1.1
**Última atualização:** 2026-01-23
**Autor:** Sistema de documentação Inteli
