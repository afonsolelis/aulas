# Especificação das Páginas Home de Módulo

## Visão Geral

Esta especificação define os padrões para criação das páginas home de cada módulo. Estas páginas servem como hub central para todas as aulas e recursos do módulo.

## Estrutura Obrigatória do HTML

### Head Section

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projeto N - Curso - Inteli</title>
  
  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg...>📚</svg>">
  
  <!-- Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  
  <!-- Estilos globais Inteli -->
  <link href="../css/inteli-styles.css" rel="stylesheet">
  
  <!-- Estilos customizados do módulo -->
  <style>
    .module-header {
      background: var(--adm-tech-navy); /* ou cor do curso */
      color: white;
      padding: 15px 0;
    }
    /* ... mais estilos ... */
  </style>
</head>
```

### Body Section

```html
<body>
  <!-- Header do Módulo -->
  <header class="module-header">
    <div class="container">
      <div class="module-badge">Curso</div>
      <h1>Projeto N - Nome do Módulo</h1>
      <h3>Descrição curta do módulo</h3>
    </div>
  </header>

  <!-- Conteúdo Principal -->
  <main class="container">
    
    <!-- Seção: Sobre o Módulo -->
    <section class="content-section">
      <h5>Sobre o Módulo</h5>
      <p>Descrição detalhada do módulo...</p>
    </section>

    <!-- Seção: Principais Tópicos -->
    <section class="content-section">
      <h5>Principais Tópicos</h5>
      <div class="topics-list">
        <div class="topic-item">📌 Tópico 1</div>
        <div class="topic-item">📌 Tópico 2</div>
      </div>
      <a href="https://tapi.inteli.edu.br" target="_blank">Acessar TAPI</a>
    </section>

    <!-- Seção: Aulas do Módulo -->
    <section class="content-section">
      <h4>Aulas do Módulo</h4>
      <div class="row">
        <div class="col-md-8">
          <!-- Cards de aula aqui -->
        </div>
        <div class="col-md-4">
          <!-- Sidebar opcional -->
        </div>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="inteli-footer mt-auto py-4 bg-light border-top">
    <div class="container text-center">
      <p class="mb-1">Material criado pelo professor <strong>Afonso Brandão</strong> para o <strong>Inteli</strong>.</p>
      <small class="text-muted">🔓 Licença de leitura aberta</small>
    </div>
  </footer>
</body>
</html>
```

## Estrutura de Conteúdo

### 1. Header do Módulo

```html
<header class="module-header">
  <div class="container">
    <div class="module-badge">Administração em Tecnologia</div>
    <h1>Projeto 5 - Modelagem Financeira e Valuation</h1>
    <h3>Modelagem financeira de uma empresa ou projeto e avaliação de seu valor de mercado</h3>
  </div>
</header>
```

**Elementos obrigatórios:**
- `.module-badge` - Nome do curso
- `h1` - Nome do projeto/módulo
- `h3` - Descrição curta

**Cores por curso:**
| Curso | Classe | Cor |
|-------|--------|-----|
| Adm Tech | `.module-header-adm-tech` | `#2e2640` |
| SI | `.module-header-si` | `#89cea5` |
| Eng. Software | `.module-header-eng-software` | `#ff4545` |

### 2. Seção Sobre o Módulo

```html
<section class="content-section">
  <h5>Sobre o Módulo</h5>
  <p>
    Este módulo aborda os conceitos fundamentais de [tema]. 
    Ao final, os alunos serão capazes de:
  </p>
  <ul>
    <li>Competência 1</li>
    <li>Competência 2</li>
    <li>Competência 3</li>
  </ul>
</section>
```

### 3. Seção Principais Tópicos

```html
<section class="content-section">
  <h5>Principais Tópicos</h5>
  <div class="topics-list">
    <div class="topic-item">
      <span class="topic-icon">📊</span>
      Matemática financeira
    </div>
    <div class="topic-item">
      <span class="topic-icon">💻</span>
      Planilhas avançadas
    </div>
    <div class="topic-item">
      <span class="topic-icon">💰</span>
      Valuation e análise de DRE
    </div>
  </div>
  <p class="mt-3">
    <strong>Recursos adicionais:</strong>
    <a href="https://tapi.inteli.edu.br" target="_blank">TAPI - Trilha de Aprendizagem</a>
  </p>
</section>
```

**Elementos obrigatórios:**
- Lista de tópicos com emojis
- Link para o TAPI (target="_blank")

### 4. Seção Aulas do Módulo

```html
<section class="content-section">
  <h4>Aulas do Módulo</h4>
  <div class="row">
    <div class="col-md-8">
      
      <!-- Aula 1 -->
      <div class="lesson-card card mb-3">
        <div class="card-body">
          <div class="d-flex align-items-start gap-3">
            <div class="lesson-number bg-adm-tech">1</div>
            <div class="flex-grow-1">
              <h5 class="card-title">Estatística e Análise de Dados em Planilhas</h5>
              <p class="card-text">Dominando cálculos estatísticos, previsões e valuation com Excel/Google Sheets.</p>
              <div class="d-flex gap-2 mt-2">
                <a href="slides/slide-lesson-1.html" class="btn btn-slides btn-adm">🖥️ Slides</a>
                <a href="materials/lesson-1-material.html" class="btn btn-material btn-outline-adm">📖 Material</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aula 2 -->
      <div class="lesson-card card mb-3">
        <!-- ... mesma estrutura ... -->
      </div>

    </div>

    <!-- Sidebar (opcional) -->
    <div class="col-md-4">
      <div class="sidebar">
        <div class="card bg-light">
          <div class="card-body">
            <h6>Informações do Módulo</h6>
            <ul class="list-unstyled">
              <li>📅 Duração: X semanas</li>
              <li>📚 Aulas: N</li>
              <li>👨‍🏫 Professor: Nome</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

## Estrutura do Card de Aula

Cada aula deve ter um card com:

| Elemento | Classe | Descrição |
|----------|--------|-----------|
| Número | `.lesson-number` | Bolinha colorida com número |
| Título | `.card-title` | Título da aula |
| Descrição | `.card-text` | Breve descrição |
| Botão Slides | `.btn-slides` | Link para slides |
| Botão Material | `.btn-material` | Link para material |

### Variação com Disciplinas

Para módulos com múltiplas disciplinas:

```html
<div class="lesson-card card mb-3">
  <div class="card-body">
    <div class="d-flex align-items-start gap-3">
      <div class="lesson-number bg-si">3</div>
      <div class="flex-grow-1">
        <h5 class="card-title">ETL e Arquitetura de Dados</h5>
        <p class="card-text">Construção de pipelines de dados.</p>
        
        <!-- Disciplinas -->
        <div class="topics-list mb-3">
          <div class="topic-item">
            <span class="topic-icon">🔄</span>
            Extração, Transformação e Carga
          </div>
          <div class="topic-item">
            <span class="topic-icon">🏗️</span>
            Arquitetura de Dados
          </div>
        </div>
        
        <div class="d-flex gap-2">
          <a href="slides/slide-lesson-3.html" class="btn btn-slides btn-si">🖥️ Slides</a>
          <a href="materials/lesson-3-material.html" class="btn btn-material btn-outline-si">📖 Material</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Estilos CSS Obrigatórios

### Cores por Curso

```css
/* Adm Tech */
.bg-adm-tech { background-color: #2e2640 !important; color: white !important; }
.btn-adm { background-color: #2e2640 !important; color: white !important; }
.btn-outline-adm { border-color: #2e2640 !important; color: #2e2640 !important; }

/* Sistemas de Informação */
.bg-si { background-color: #89cea5 !important; color: white !important; }
.btn-si { background-color: #89cea5 !important; color: white !important; }
.btn-outline-si { border-color: #89cea5 !important; color: #89cea5 !important; }

/* Engenharia de Software */
.bg-eng-software { background-color: #ff4545 !important; color: white !important; }
.btn-eng { background-color: #ff4545 !important; color: white !important; }
.btn-outline-eng { border-color: #ff4545 !important; color: #ff4545 !important; }
```

### Componentes

```css
/* Header do Módulo */
.module-header {
  background: var(--adm-tech-navy); /* ou cor do curso */
  color: white;
  padding: 15px 0;
}

.module-header .module-badge {
  display: inline-block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  opacity: 0.9;
}

.module-header h1 {
  font-size: 1.5rem;
  margin: 0;
  display: inline;
}

.module-header h3 {
  font-size: 1.1rem;
  margin: 0;
  font-weight: normal;
}

/* Seções de Conteúdo */
.content-section {
  padding: 30px 0;
}

/* Card de Aula */
.lesson-card {
  margin-bottom: 12px;
  padding: 0;
}

.lesson-number {
  color: white;
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* Lista de Tópicos */
.topics-list {
  background-color: #e6eaeb;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.topic-item {
  padding: 8px 0;
  border-bottom: 1px solid #caced6;
}

.topic-item:last-child {
  border-bottom: none;
}

.topic-icon {
  color: var(--inteli-purple);
  margin-right: 10px;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 20px;
}
```

## Regras de Validação

### Checklist de Criação

- [ ] Header com badge, título e descrição
- [ ] Cor do header consistente com o curso
- [ ] Seção "Sobre o Módulo" presente
- [ ] Seção "Principais Tópicos" com lista
- [ ] Link para TAPI presente e funcional
- [ ] Seção "Aulas do Módulo" com cards
- [ ] Cada aula tem botões Slides e Material
- [ ] Links relativos funcionando
- [ ] Footer com créditos presente

### Validações Automatizadas (Playwright)

Os testes em `tests/home_pages.spec.ts` verificam:

1. **Cores consistentes**: Header, badge, lesson numbers e botões
2. **Header formatado**: Tag do curso e nome do projeto
3. **Seções obrigatórias**: Sobre, Tópicos e Aulas
4. **Link TAPI**: Presente e com target="_blank"
5. **Cards de aula**: Botões Slides e Material em cada card
6. **Link Voltar**: Funcional e apontando para index.html

## Template por Curso

### Adm Tech

```html
<header class="module-header" style="background: #2e2640;">
  <div class="module-badge">Administração em Tecnologia</div>
  <h1>Projeto 5 - Modelagem Financeira e Valuation</h1>
</header>
```

### Sistemas de Informação

```html
<header class="module-header" style="background: #89cea5;">
  <div class="module-badge">Sistemas de Informação</div>
  <h1>Projeto 9 - Dashboards Gerenciais</h1>
</header>
```

### Engenharia de Software

```html
<header class="module-header" style="background: #ff4545;">
  <div class="module-badge">Engenharia de Software</div>
  <h1>Projeto 5 - Sistema Digital de Processamento Distribuído</h1>
</header>
```

## Exemplo Completo

Veja `pages/home_module-5-adm-tech.html` como referência completa.
