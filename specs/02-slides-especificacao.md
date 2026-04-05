# Especificação de Slides (Reveal.js)

## Visão Geral

Esta especificação define os padrões para criação de apresentações de slides utilizando Reveal.js no projeto Aulas.

## Estrutura Obrigatória do HTML

### Head Section

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aula N - Título da Aula - Inteli</title>
  
  <!-- Favicon (opcional, usar emoji relacionado ao tema) -->
  <link rel="icon" href="data:image/svg+xml,<svg...>📊</svg>">
  
  <!-- Fontes Google -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  
  <!-- Reveal.js CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/theme/white.min.css">
  
  <!-- Bootstrap 5 (opcional, para grids) -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  
  <!-- Estilos globais Inteli -->
  <link href="../../../css/inteli-styles.css" rel="stylesheet">
  
  <!-- Estilos customizados da aula -->
  <style>
    :root {
      --inteli-purple: #2e2640;
      --inteli-blue: #89cea5;
      --inteli-green: #89cea5;
    }
    /* ... estilos específicos ... */
  </style>
</head>
```

### Body Section

```html
<body>
  <!-- Logo fixa (opcional, aparece em todos os slides) -->
  <img src="https://res.cloudinary.com/..." alt="Inteli Logo" class="logo-fixed">
  
  <div class="reveal">
    <div class="slides">
      <!-- Slides aqui -->
    </div>
  </div>
  
  <!-- Botões de navegação flutuantes -->
  <div class="nav-buttons">
    <a href="../../home_module-X-CURSO.html" class="btn-nav btn-home">🏠 Home</a>
    <a href="../materials/lesson-N-material.html" class="btn-nav btn-material">📖 Material</a>
  </div>
  
  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.min.js"></script>
  <script>
    Reveal.initialize({
      hash: true,
      slideNumber: 'h.v',
      transition: 'convex',
      controls: true,
      progress: true,
      center: false
    });
  </script>
</body>
</html>
```

## Estrutura de Slides

### Slide 1: Capa (Obrigatório)

**Elementos obrigatórios:**

| Elemento | Classe | Descrição |
|----------|--------|-----------|
| Logo Inteli | `.logo-cover` | Imagem da logo (altura: 80px) |
| Subtítulo | `.cover-subtitle` | Módulo • Projeto • Curso |
| Título | `.cover-title` | Título da aula (fonte: 3.4-3.8rem) |
| Tags de tópicos | `.topics-grid` + `.topic-tag` | 3-5 tags com emojis |
| Metadados | `.cover-meta` | Professor, data, duração |

**Exemplo:**

```html
<section>
  <div class="cover-container">
    <img src="https://res.cloudinary.com/dyhjjms8y/image/upload/v1769427095/9c2796bb-d4da-4f4e-846a-d38d547249ee_pwwh3l.png" 
         alt="Inteli Logo" class="logo-cover">
    
    <div class="cover-subtitle">Módulo 5 • Projeto 5 • Adm Tech</div>
    
    <h1 class="cover-title">Estatística e Análise de Dados em Planilhas</h1>
    
    <div class="topics-grid">
      <span class="topic-tag">📊 Tendência Central</span>
      <span class="topic-tag">📉 Variância &amp; Risco</span>
      <span class="topic-tag">🎲 LGN</span>
      <span class="topic-tag">🔮 Forecast</span>
      <span class="topic-tag">💰 Valuation</span>
    </div>
    
    <div class="cover-meta">
      <span>👨‍🏫 Prof. <strong>Afonso Brandão</strong></span>
      <span>📅 Fevereiro 2025</span>
      <span>⏱️ 2 Horas</span>
    </div>
  </div>
</section>
```

### Slide 2: Agenda (Obrigatório)

**Elementos obrigatórios:**

| Elemento | Classe | Descrição |
|----------|--------|-----------|
| Título | `.slide-title` | "Agenda da Aula" |
| Cards de blocos | `.info-card` | 2-4 blocos de conteúdo |
| Disclaimer (opcional) | `.info-card` com cor customizada | Observações importantes |

**Exemplo:**

```html
<section>
  <h2 class="slide-title">Agenda da Aula</h2>
  <div class="row g-3">
    <div class="col-6">
      <div class="info-card">
        <h4>Bloco 1 — Tendência Central</h4>
        <p>Média, Mediana, Moda e variações condicionais no Excel.</p>
      </div>
      <div class="info-card" style="border-left-color: var(--inteli-purple);">
        <h4>Bloco 2 — Dispersão &amp; Risco</h4>
        <p>Desvio Padrão, Variância, Quartis e Coeficiente de Variação.</p>
      </div>
    </div>
    <div class="col-6">
      <div class="info-card">
        <h4>Bloco 3 — Lei dos Grandes Números</h4>
        <p>Convergência amostral e simulação no Excel.</p>
      </div>
      <div class="info-card" style="border-left-color: var(--inteli-purple);">
        <h4>Observação</h4>
        <p>No terceiro ano a daily não é mais no horário de instrução.</p>
      </div>
    </div>
  </div>
</section>
```

### Slides de Conteúdo (Slides 3+)

**Tipos de slides suportados:**

#### 1. Slide de Título de Seção

```html
<section>
  <h2 class="slide-title">Medidas de Tendência Central</h2>
  <p>Introdução ao conceito...</p>
</section>
```

#### 2. Slide com Info Cards

```html
<section>
  <h2 class="slide-title">Conceitos Principais</h2>
  <div class="info-card">
    <h4>Média</h4>
    <p>Soma dos valores dividida pela quantidade.</p>
  </div>
  <div class="info-card">
    <h4>Mediana</h4>
    <p>Valor central quando ordenados.</p>
  </div>
</section>
```

#### 3. Slide com Código

```html
<section>
  <h2 class="slide-title">Implementação em Python</h2>
  <div class="code-block">import pandas as pd

# Carregar dados
df = pd.read_csv('dados.csv')

# Calcular média
media = df['valor'].mean()
print(f"Média: {media}")</div>
</section>
```

#### 4. Slide com Tabela

```html
<section>
  <h2 class="slide-title">Fórmulas Excel</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th>Medida</th>
        <th>Fórmula</th>
        <th>Quando usar</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Média</td>
        <td><code>=MÉDIA(A1:A100)</code></td>
        <td>Dados simétricos</td>
      </tr>
    </tbody>
  </table>
</section>
```

#### 5. Slide com Fórmula

```html
<section>
  <h2 class="slide-title">Cálculo de VPL</h2>
  <div class="formula-box">
    VPL = Σ [FCt / (1 + i)^t] - Investimento Inicial
  </div>
  <p>Onde: FCt = Fluxo de Caixa, i = taxa, t = período</p>
</section>
```

#### 6. Slide com Box de Interação

```html
<section>
  <h2 class="slide-title">Atividade Prática</h2>
  <div class="interaction-box">
    <h4>📝 Instruções</h4>
    <ul>
      <li>Abra o Excel/Google Sheets</li>
      <li>Importe a planilha fornecida</li>
      <li>Calcule a média usando =MÉDIA()</li>
    </ul>
  </div>
</section>
```

## Estilos CSS Obrigatórios

### Variáveis de Cores

```css
:root {
  --inteli-purple: #2e2640;
  --inteli-blue: #89cea5;
  --inteli-green: #89cea5;
}
```

### Classes de Utilidade

```css
/* Capa */
.cover-container { 
  text-align: center; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  height: 100%; 
}

.logo-cover { height: 80px; margin-bottom: 40px; }

.cover-title { 
  font-size: 3.8rem !important; 
  font-weight: 800 !important; 
  line-height: 1.1; 
  margin-bottom: 20px !important; 
  max-width: 900px; 
}

.cover-subtitle { 
  font-size: 1.4rem; 
  font-weight: 600; 
  color: var(--inteli-blue) !important; 
  letter-spacing: 2px; 
  text-transform: uppercase !important; 
  margin-bottom: 40px; 
}

.topics-grid { 
  display: flex; 
  gap: 15px; 
  justify-content: center; 
  flex-wrap: wrap; 
  margin-bottom: 50px; 
}

.topic-tag { 
  background: #f3f4f6; 
  padding: 8px 20px; 
  border-radius: 25px; 
  font-size: 0.9rem; 
  font-weight: 700; 
  color: var(--inteli-purple) !important; 
  border: 1px solid #e6eaeb; 
}

.cover-meta { 
  font-size: 1.1rem; 
  opacity: 0.7; 
  margin-top: 20px; 
  display: flex; 
  gap: 30px; 
}

/* Slides internos */
.slide-title { 
  font-size: 2.5rem; 
  margin-bottom: 30px; 
  border-bottom: 4px solid var(--inteli-blue); 
  display: inline-block; 
  padding-bottom: 10px; 
  font-weight: 800 !important; 
}

.info-card { 
  background: #f8fafc; 
  border-radius: 16px; 
  padding: 25px; 
  border: 1px solid #e6eaeb; 
  margin-bottom: 20px; 
  border-left: 6px solid var(--inteli-blue); 
}

.data-table { 
  width: 100%; 
  border-collapse: collapse; 
  font-size: 0.85rem; 
  background: white; 
  margin: 20px 0; 
}

.data-table th { 
  background: var(--inteli-purple); 
  color: white !important; 
  padding: 10px; 
}

.data-table td { 
  padding: 8px; 
  border-bottom: 1px solid #e6eaeb; 
}

.data-table tr:nth-child(even) td { 
  background: #f8fafc; 
}

.code-block { 
  background: #1e1e2e; 
  color: #f8f8f2 !important; 
  padding: 20px; 
  border-radius: 12px; 
  font-family: 'Space Mono', monospace; 
  font-size: 0.85rem; 
  margin: 10px 0; 
  overflow-x: auto; 
}

.formula-box { 
  background: #f8fafc; 
  border-left: 5px solid var(--inteli-blue); 
  padding: 14px 20px; 
  border-radius: 0 12px 12px 0; 
  margin: 12px 0; 
  font-family: 'Space Mono', monospace; 
  font-size: 0.95rem; 
}

.interaction-box { 
  background: #dbeafe; 
  border: 2px solid var(--inteli-blue); 
  border-radius: 12px; 
  padding: 20px; 
  margin: 15px 0; 
}

/* Botões flutuantes */
.nav-buttons { 
  position: fixed; 
  bottom: 30px; 
  left: 30px; 
  z-index: 1000; 
  display: flex; 
  gap: 12px; 
}

.btn-nav { 
  padding: 10px 20px; 
  border-radius: 10px; 
  text-decoration: none !important; 
  font-weight: 700; 
  font-size: 14px; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
  transition: 0.2s; 
}

.btn-home { 
  background: var(--inteli-purple) !important; 
  color: white !important; 
}

.btn-material { 
  background: var(--inteli-green) !important; 
  color: white !important; 
}
```

## Configuração do Reveal.js

```javascript
Reveal.initialize({
  controls: true,           // Mostrar setas de navegação
  progress: true,           // Mostrar barra de progresso
  slideNumber: 'h.v',       // Numeração (horizontal.vertical)
  center: false,            // Não centralizar verticalmente
  hash: true,               // Usar hash na URL
  transition: 'convex',     // Efeito: none/fade/slide/convex/concave/zoom
  width: '100%',
  height: '100%',
  margin: 0,
  disableLayout: true       // Prevenir escalonamento automático
});
```

## Regras de Validação

### Checklist de Criação

- [ ] Slide 1: Capa com todos os elementos obrigatórios
- [ ] Slide 2: Agenda com blocos de conteúdo
- [ ] Botões de navegação (Home e Material) presentes
- [ ] Logo Inteli visível na capa
- [ ] Cores seguindo padrão do curso
- [ ] Fontes Manrope e Space Mono carregadas
- [ ] Reveal.js inicializado corretamente
- [ ] Links relativos funcionando

### Validações Automatizadas (Playwright)

Os testes verificam:

1. **Capa**: Logo, título, tópicos e metadados visíveis
2. **Agenda**: Título e itens de agenda presentes
3. **Navegação**: Botões Home e Material visíveis e funcionais
4. **Estrutura**: Classes obrigatórias presentes

## Boas Práticas

### Design

- Preencher o viewport sem deixar espaços vazios excessivos
- Não estourar blocos de texto verticalmente
- Usar grids de 2 colunas quando apropriado
- Manter consistência visual entre slides

### Conteúdo

- Máximo de 6-8 bullets por slide
- Usar emojis nas tags da capa e títulos
- Incluir exemplos práticos em código quando aplicável
- Usar boxes coloridos para destacar informações importantes

### Performance

- Evitar imagens muito grandes
- Usar CDN para bibliotecas externas
- Minimizar CSS inline

## Template Base

Use `pages/module-X/slides/template_reveal.html` como ponto de partida para novos slides.
