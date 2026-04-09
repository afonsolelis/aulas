# Especificação de Materiais de Leitura

## Visão Geral

Esta especificação define os padrões para criação de materiais de leitura em HTML que complementam as aulas. Estes materiais são documentos estáticos para estudo individual dos alunos.

## Estrutura Obrigatória do HTML

### Head Section

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aula N - Material Escrito | Projeto X</title>
  
  <!-- Favicon (opcional) -->
  <link rel="icon" href="data:image/svg+xml,<svg...>📖</svg>">
  
  <!-- Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  
  <!-- Fontes Google -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  
  <!-- Estilos globais Inteli -->
  <link href="../../css/inteli-styles.css" rel="stylesheet">
  
  <!-- Estilos customizados -->
  <style>
    body { 
      background: #f7f9fb; 
      color: #1f2933; 
      font-family: "Manrope", sans-serif; 
    }
    .page-header { 
      background: linear-gradient(135deg, #2e2640, #1b1530); 
      color: #fff; 
      padding: 28px 0; 
      margin-bottom: 24px; 
    }
    .cardx { 
      background: #fff; 
      border: 1px solid #e3e7ea; 
      border-radius: 14px; 
      padding: 22px; 
      margin-bottom: 14px; 
    }
    .title { 
      color: #2e2640; 
      font-weight: 700; 
      margin-bottom: 10px; 
    }
    .code { 
      background: #1f1d2b; 
      color: #d9f7e6; 
      border-radius: 10px; 
      padding: 14px; 
      overflow-x: auto; 
      font-size: .88rem; 
    }
    .formula-box { 
      background: #f8fafc; 
      border-left: 5px solid #89cea5; 
      padding: 12px 18px; 
      border-radius: 0 10px 10px 0; 
      font-family: monospace; 
      margin: 10px 0; 
    }
  </style>
</head>
```

### Body Section

```html
<body>
  <!-- Header da Página -->
  <header class="page-header">
    <div class="container d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div>
        <div class="module-badge">Projeto X • Curso</div>
        <h1 class="h3 mb-1">Aula N - Material Escrito</h1>
        <div>Título da Aula</div>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <a href="../slides/slide-lesson-N.html" class="btn btn-light">🎞️ Ver Slides</a>
        <a href="../../home_module-X-CURSO.html" class="btn btn-outline-light">← Voltar ao Módulo</a>
      </div>
    </div>
  </header>

  <!-- Conteúdo Principal -->
  <main class="container pb-4">
    <!-- Seções de conteúdo aqui -->
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

### Seções Padrão

O material de leitura deve seguir uma estrutura lógica:

```html
<main class="container pb-4">

  <!-- Seção 1: Objetivos da Aula -->
  <section class="cardx">
    <h2 class="title h5">Objetivo prático da aula</h2>
    <ul class="mb-0">
      <li>Objetivo 1</li>
      <li>Objetivo 2</li>
      <li>Objetivo 3</li>
    </ul>
  </section>

  <!-- Seção 2: Conceitos Teóricos -->
  <section class="cardx">
    <h2 class="title h5">Título do Conceito</h2>
    <p>Explicação do conceito...</p>
    
    <!-- Tabela (opcional) -->
    <table class="table table-sm table-bordered">
      <thead class="table-dark">
        <tr><th>Coluna 1</th><th>Coluna 2</th><th>Coluna 3</th></tr>
      </thead>
      <tbody>
        <tr><td>Dado 1</td><td>Dado 2</td><td>Dado 3</td></tr>
      </tbody>
    </table>
  </section>

  <!-- Seção 3: Fórmulas -->
  <section class="cardx">
    <h2 class="title h5">Fórmulas e Cálculos</h2>
    <div class="formula-box">
      Fórmula ou equação aqui
    </div>
    <p>Explicação da fórmula...</p>
  </section>

  <!-- Seção 4: Código/Implementação -->
  <section class="cardx">
    <h2 class="title h5">Implementação</h2>
    <div class="code">
      <pre><code># Código aqui
def exemplo():
    return "valor"</code></pre>
    </div>
  </section>

  <!-- Seção 5: Atividade Prática -->
  <section class="cardx">
    <h2 class="title h5">Atividade Prática</h2>
    <p>Instruções da atividade...</p>
    <ol>
      <li>Passo 1</li>
      <li>Passo 2</li>
      <li>Passo 3</li>
    </ol>
  </section>

</main>
```

## Componentes de Conteúdo

### 1. Card de Conteúdo (`.cardx`)

Container principal para cada seção de conteúdo.

```html
<section class="cardx">
  <h2 class="title h5">Título da Seção</h2>
  <p>Conteúdo em parágrafo...</p>
</section>
```

**Estilos:**
- Background branco
- Borda arredondada (14px)
- Padding interno de 22px
- Sombra sutil

### 2. Títulos de Seção

```html
<h2 class="title h5">Título</h2>
<h3 class="title h6">Subtítulo</h3>
```

**Características:**
- Cor: `#2e2640` (roxo Inteli)
- Font-weight: 700
- Margin-bottom: 10px

### 3. Tabelas

```html
<table class="table table-sm table-bordered">
  <thead class="table-dark">
    <tr>
      <th>Cabeçalho 1</th>
      <th>Cabeçalho 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dado 1</td>
      <td>Dado 2</td>
    </tr>
  </tbody>
</table>
```

**Uso recomendado:**
- Comparação de conceitos
- Fórmulas e funções
- Dados estruturados

### 4. Blocos de Código

```html
<div class="code">
  <pre><code># Comentário
def funcao():
    return valor</code></pre>
</div>
```

**Características:**
- Background escuro (`#1f1d2b`)
- Texto claro (`#d9f7e6`)
- Fonte monospace
- Scroll horizontal se necessário

### 5. Fórmulas (`.formula-box`)

```html
<div class="formula-box">
  VPL = Σ [FCt / (1 + i)^t] - Investimento Inicial
</div>
```

**Características:**
- Background claro
- Borda esquerda verde (`#89cea5`)
- Fonte monospace
- Ideal para equações e fórmulas

### 6. Listas

```html
<!-- Lista não ordenada -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- Lista ordenada -->
<ol>
  <li>Passo 1</li>
  <li>Passo 2</li>
</ol>
```

### 7. Alertas e Destaques

```html
<div class="alert alert-warning" role="alert">
  ⚠️ <strong>Atenção:</strong> Informação importante aqui.
</div>

<div class="alert alert-info" role="alert">
  💡 <strong>Dica:</strong> Sugestão útil.
</div>
```

## Estrutura por Tipo de Conteúdo

### Material de Aula Teórica

```
1. Objetivos da aula
2. Introdução ao tema
3. Conceitos fundamentais
4. Exemplos práticos
5. Referências bibliográficas
```

### Material de Aula Prática

```
1. Objetivos da aula
2. Pré-requisitos
3. Setup do ambiente
4. Passo a passo da atividade
5. Código de exemplo
6. Exercícios propostos
```

### Material de Revisão

```
1. Resumo dos conceitos
2. Fórmulas principais
3. Pontos de atenção
4. Exercícios de fixação
5. Gabarito comentado
```

## Estilos CSS Obrigatórios

```css
/* Container principal */
.cardx { 
  background: #fff; 
  border: 1px solid #e3e7ea; 
  border-radius: 14px; 
  padding: 22px; 
  margin-bottom: 14px; 
}

/* Títulos */
.title { 
  color: #2e2640; 
  font-weight: 700; 
  margin-bottom: 10px; 
}

/* Código */
.code { 
  background: #1f1d2b; 
  color: #d9f7e6; 
  border-radius: 10px; 
  padding: 14px; 
  overflow-x: auto; 
  font-size: .88rem; 
}
.code pre { margin: 0; white-space: pre-wrap; }

/* Fórmulas */
.formula-box { 
  background: #f8fafc; 
  border-left: 5px solid #89cea5; 
  padding: 12px 18px; 
  border-radius: 0 10px 10px 0; 
  font-family: monospace; 
  margin: 10px 0; 
}

/* Header da página */
.page-header { 
  background: linear-gradient(135deg, #2e2640, #1b1530); 
  color: #fff; 
  padding: 28px 0; 
  margin-bottom: 24px; 
}

/* Badge do módulo */
.module-badge { 
  font-size: 0.85rem; 
  opacity: 0.75; 
  margin-bottom: 6px; 
}
```

## Regras de Validação

### Checklist de Criação

- [ ] Header com título e botões de navegação
- [ ] Link para slides correspondentes
- [ ] Link de volta para home do módulo
- [ ] Seção de objetivos presente
- [ ] Conteúdo dividido em cards (`.cardx`)
- [ ] Footer com créditos
- [ ] Estilos consistentes com o projeto
- [ ] Links relativos funcionando

### Validações de Conteúdo

1. **Objetivos claros**: O aluno deve saber o que vai aprender
2. **Progressão lógica**: Conceitos básicos antes de avançados
3. **Exemplos práticos**: Sempre que possível, incluir código ou casos reais
4. **Formatação consistente**: Usar estilos padrão do projeto

## Boas Práticas

### Escrita

- Use linguagem clara e direta
- Evite períodos muito longos
- Use exemplos do mundo real
- Inclua referências quando citar conceitos externos

### Formatação

- Use tabelas para comparações
- Destaque fórmulas em boxes próprios
- Use código formatado para exemplos técnicos
- Mantenha parágrafos curtos (3-5 linhas)

### Acessibilidade

- Use headings hierárquicos (h1 → h2 → h3)
- Adicione texto alternativo em imagens
- Use contraste adequado de cores
- Estruture listas corretamente

## Template Base

Use `pages/module-X/materials/lesson-1-material.html` como referência para novos materiais.

## Exemplo Completo

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Aula 1 - Material Escrito | Projeto 5</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="../../css/inteli-styles.css" rel="stylesheet">
  <style>
    body { background: #f7f9fb; color: #1f2933; font-family: "Manrope", sans-serif; }
    .page-header { background: linear-gradient(135deg, #2e2640, #1b1530); color: #fff; padding: 28px 0; margin-bottom: 24px; }
    .cardx { background: #fff; border: 1px solid #e3e7ea; border-radius: 14px; padding: 22px; margin-bottom: 14px; }
    .title { color: #2e2640; font-weight: 700; margin-bottom: 10px; }
    .code { background: #1f1d2b; color: #d9f7e6; border-radius: 10px; padding: 14px; overflow-x: auto; }
    .formula-box { background: #f8fafc; border-left: 5px solid #89cea5; padding: 12px 18px; font-family: monospace; margin: 10px 0; }
  </style>
</head>
<body>
  <header class="page-header">
    <div class="container d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div>
        <div class="module-badge">Projeto 5 • Administração + Tech</div>
        <h1 class="h3 mb-1">Aula 1 - Material Escrito</h1>
        <div>Estatística e Análise de Dados em Planilhas</div>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <a href="../slides/slide-lesson-1.html" class="btn btn-light">🎞️ Ver Slides</a>
        <a href="../../home_module-5-adm-tech.html" class="btn btn-outline-light">← Voltar</a>
      </div>
    </div>
  </header>

  <main class="container pb-4">
    <section class="cardx">
      <h2 class="title h5">Objetivo prático da aula</h2>
      <ul class="mb-0">
        <li>Dominar medidas de tendência central (Média, Mediana, Moda)</li>
        <li>Compreender medidas de dispersão (DP, CV, Quartis)</li>
        <li>Aplicar Lei dos Grandes Números</li>
      </ul>
    </section>

    <section class="cardx">
      <h2 class="title h5">Medidas de Tendência Central</h2>
      <table class="table table-sm table-bordered">
        <thead class="table-dark">
          <tr><th>Medida</th><th>Fórmula Excel</th><th>Quando usar</th></tr>
        </thead>
        <tbody>
          <tr><td>Média</td><td><code>=MÉDIA(A1:A100)</code></td><td>Dados simétricos</td></tr>
          <tr><td>Mediana</td><td><code>=MED(A1:A100)</code></td><td>Dados com outliers</td></tr>
        </tbody>
      </table>
    </section>

    <section class="cardx">
      <h2 class="title h5">Fórmula do Desvio Padrão</h2>
      <div class="formula-box">
        σ = √(Σ(xi - μ)² / N)
      </div>
      <p>Onde μ é a média e N é o tamanho da amostra.</p>
    </section>
  </main>

  <footer class="inteli-footer mt-auto py-4 bg-light border-top">
    <div class="container text-center">
      <p class="mb-1">Material criado pelo professor <strong>Afonso Brandão</strong> para o <strong>Inteli</strong>.</p>
      <small class="text-muted">🔓 Licença de leitura aberta</small>
    </div>
  </footer>
</body>
</html>
```
