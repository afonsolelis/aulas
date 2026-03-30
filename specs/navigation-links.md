# Spec: Navegação e Estrutura de Links

## Objetivo

Padronizar a navegação e estrutura de links em todo o portal.

## Escopo

Aplica-se a todas as páginas HTML do portal.

## Hierarquia de Navegação

### Nível 1: Index

```
index.html
├── Cards de Módulo → home-module-*.html
├── Card Professor → home-professor.html
├── Card Autoestudos → home-autoestudos.html
└── Card Tutorial → home-tutorial-*.html
```

### Nível 2: Home de Módulo

```
home-module-X.html
├── Botão Voltar → index.html
├── Sidebar "Sobre o Módulo"
├── Principais Tópicos → links externos/internos
└── Lista de Aulas → slides e materiais
```

### Nível 3: Slides e Materiais

```
slides/slide_lesson-N.html
├── 🏠 Home → home-module-*.html
├── 📖 Material → materials/lesson-N-material.html
├── ← Anterior → slide_lesson-(N-1).html
└── Próximo → → slide_lesson-(N+1).html
```

## Padrões de Link

### Links Internos

1. **Formato**
   - Usar caminhos relativos quando possível
   - Usar kebab-case em todos os nomes de arquivo
   - Não usar underscores (exceto em `slide_lesson-*`)

2. **Exemplos Válidos**
   - `../index.html`
   - `home-module-2-common.html`
   - `slides/slide_lesson-1.html`
   - `materials/lesson-1-material.html`

3. **Exemplos Inválidos**
   - `home_module_2.html` (underscore)
   - `Home-Module-2.html` (case incorreto)
   - `./pages/home-module-2.html` (caminho redundante)

### Links Externos

1. **Atributos Obrigatórios**
   - `target="_blank"` para abrir em nova aba
   - `rel="noopener noreferrer"` para segurança

2. **Exemplo**
   ```html
   <a href="https://exemplo.com" 
      target="_blank" 
      rel="noopener noreferrer">
      Link Externo
   </a>
   ```

3. **Indicador Visual**
   - Pode usar ícone ↗ para indicar link externo
   - Tooltip pode indicar que abrirá em nova aba

## Botões de Navegação

### Botão Voltar

1. **Posição**
   - Canto superior esquerdo ou centralizado no header
   - Antes do título da página

2. **Texto**
   - "← Voltar" ou "Voltar para o Início"
   - Pode usar apenas ícone ← se espaço for limitado

3. **Destino**
   - Página anterior na hierarquia
   - Geralmente `index.html` ou `home-*.html`

### Navegação de Slides

1. **Botão Anterior**
   - Texto: "← Anterior" ou "← Previous"
   - Desabilitado se for primeiro slide
   - Pode usar `aria-disabled="true"` quando desabilitado

2. **Botão Próximo**
   - Texto: "Próximo →" ou "Next →"
   - Desabilitado se for último slide
   - Pode usar `aria-disabled="true"` quando desabilitado

3. **Contador de Slides**
   - Formato: "X / Y" ou "Slide X de Y"
   - Visível em todo slide
   - Atualizado dinamicamente se navegação for via JS

### Botão Home

1. **Posição**
   - Footer ou header da página
   - Consistente em todas as páginas do mesmo tipo

2. **Ícone**
   - 🏠 ou ícone de casa
   - Deve ser reconhecível mesmo sem texto

3. **Destino**
   - `home-module-*.html` correspondente ao módulo
   - Nunca `index.html` diretamente (exceto em páginas especiais)

## Breadcrumbs (Opcional)

1. **Formato**
   ```
   Início > Módulo X > Aula N > Slides
   ```

2. **Implementação**
   - Usar nav com aria-label="Breadcrumb"
   - Links para cada nível exceto atual
   - Separador visual: > ou /

3. **Acessibilidade**
   - Current page com `aria-current="page"`
   - Não clicável no item atual

## Links Quebrados e Placeholders

### Durante Desenvolvimento

1. **Placeholders Válidos**
   - `href="#"` para links não implementados
   - Cards podem estar ausentes se módulo em construção
   - Mensagem "Em construção" é aceitável

2. **Obrigações**
   - Placeholder deve ser explícito
   - Não deixar links "#" sem indicação visual
   - Remover placeholders quando conteúdo for implementado

### Em Produção

1. **Regra**
   - Zero links quebrados
   - Zero href="#" em páginas publicadas
   - Zero referências a arquivos inexistentes

2. **Validação**
   - Testes automatizados devem verificar links
   - Revisão manual antes de deploy

## Navegação por Teclado

1. **Ordem de Tab**
   - Seguir hierarquia visual
   - Header → Navegação → Conteúdo → Footer

2. **Elementos Prioritários**
   - Botão Voltar deve ser acessível cedo
   - Navegação de slides deve ser sequencial
   - Footer vem após conteúdo principal

3. **Skip Links**
   - Opcional mas recomendado em páginas longas
   - Link "Pular para conteúdo" visível no focus

## Exemplos de Estrutura

### Header com Navegação

```html
<header class="portal-header">
  <a href="../index.html" class="btn-voltar">
    ← Voltar
  </a>
  <h1>Nome do Módulo</h1>
</header>
```

### Footer com Navegação

```html
<footer class="slide-footer">
  <a href="home-module-2.html">🏠 Home</a>
  <a href="lesson-1-material.html">📖 Material</a>
  <a href="slide_lesson-1.html">← Anterior</a>
  <span>3 / 10</span>
  <a href="slide_lesson-3.html">Próximo →</a>
</footer>
```

### Card com Links

```html
<div class="card lesson-card">
  <h3>Aula 1: Introdução</h3>
  <div class="lesson-buttons">
    <a href="slides/slide_lesson-1.html" class="btn-slides">
      🎞️ Slides
    </a>
    <a href="materials/lesson-1-material.html" class="btn-material">
      📝 Material
    </a>
  </div>
</div>
```

## Exceções

1. Páginas especiais (404, erro) podem ter navegação simplificada
2. Conteúdo em construção pode ter navegação parcial
3. Links externos de referência acadêmica podem abrir na mesma aba se for conteúdo complementar

## Validação

1. Todos os links internos devem ser verificáveis
2. Links externos devem ter atributos de segurança
3. Navegação por teclado deve ser testada manualmente
4. Breadcrumbs devem refletir hierarquia real
