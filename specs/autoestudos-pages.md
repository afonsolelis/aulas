# Spec: Páginas de Autoestudos

## Objetivo

Padronizar as páginas de autoestudos e materiais complementares do portal.

## Escopo

Aplica-se a:
- `pages/home-autoestudos.html` (página principal de autoestudos)
- `pages/autoestudos/*.html` (páginas de conteúdo de autoestudos)

## Estrutura da Home de Autoestudos

1. **Cabeçalho**
   - Deve conter título "Portal de Autoestudos" ou similar
   - Deve conter subtítulo descritivo
   - Deve conter botão "Voltar para o Início" apontando para `../index.html`
   - Deve usar gradiente ou cor distintiva da identidade visual

2. **Grid de Cards**
   - Cards devem seguir layout em grid responsivo (3 colunas em desktop, 2 em tablet, 1 em mobile)
   - Cada card deve representar um tópico de autoestudo
   - Cards devem ter ícone temático (emoji ou SVG)
   - Cards devem ter título e descrição

3. **Card de Autoestudo**
   - Deve ser clicável como um todo (diferente de lesson-cards)
   - Deve apontar para página de conteúdo em `autoestudos/*.html`
   - Deve ter classe `topic-card` para consistência visual
   - Deve ter efeito hover (transform: translateY)
   - Ícone deve usar classe `topic-icon`

4. **Footer Institucional**
   - Deve mencionar "Inteli"
   - Deve creditar o professor responsável
   - Deve mencionar licença de uso

## Páginas de Conteúdo de Autoestudo

1. **Nomenclatura**
   - Devem seguir kebab-case: `autoestudos/nome-do-topico.html`
   - Devem estar em subdiretório `pages/autoestudos/`

2. **Estrutura Mínima**
   - Cabeçalho com título do tópico
   - Botão de voltar para `home-autoestudos.html`
   - Conteúdo principal estruturado em seções
   - Footer institucional

3. **Conteúdo**
   - Deve ter introdução contextualizando o tópico
   - Deve ter links para recursos externos quando aplicável
   - Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`
   - Deve ter conclusão ou próximos passos

## Exemplo de Estrutura

```html
<!-- home-autoestudos.html -->
<div class="portal-header">
  <h1>Portal de Autoestudos</h1>
  <p>Materiais complementares</p>
  <a href="../index.html">Voltar</a>
</div>

<div class="container">
  <div class="row g-4">
    <div class="col-md-6 col-lg-4">
      <a href="autoestudos/topico.html" class="text-decoration-none">
        <div class="card topic-card p-4 text-center">
          <div class="topic-icon">📚</div>
          <h3>Título do Tópico</h3>
          <p>Descrição breve.</p>
        </div>
      </a>
    </div>
  </div>
</div>
```

## Exceções

1. Cards podem ter número variável de colunas conforme densidade de conteúdo
2. Ícones podem ser SVGs customizados em vez de emojis
3. Páginas de autoestudo podem ter navegação lateral se tiverem muitas seções

## Validação

1. Todos os links devem apontar para arquivos existentes
2. Não deve haver links quebrados ou placeholders vazios
3. Imagens e ícones devem ter alt text descritivo
