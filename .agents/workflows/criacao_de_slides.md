---
description: Criação de Slides (Reveal.js)
---
# Criando Apresentações com Reveal.js

Ao criar ou migrar uma apresentação baseada em slides neste repositório (`aulas`), siga as instruções abaixo para padronizar o código com a engine do Reveal.js sem quebrar a estética definida, utilizando navegação nativa.

## Regra Obrigatória

- Slides deste repositório devem ser feitos em **Reveal.js**.
- Cada slide deve **preencher corretamente o viewport**: não deixe blocos de texto estourarem verticalmente, mas também não deixe metade inferior da tela vazia sem necessidade.
- Antes de concluir, faça uma verificação visual renderizando os slides mais densos. Ajuste tipografia, `padding`, grids e altura dos cards até o conteúdo ficar legível e bem distribuído na página.
- Prefira layout responsivo com `clamp(...)`, grids de 2 colunas quando couber e cards com altura mínima para ocupar melhor a área útil.

## 1. Estrutura HTML Essencial

1. Adicione dentro do `<head>`:
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.min.css">
   ```
2. Adicione os slides englobados pelos containers pais obrigatórios do Reveal.js (`reveal` > `slides` > `section`):
   ```html
   <div class="reveal">
       <div class="slides">
           <!-- Slides da Apresentação -->
           <section class="custom-slide cover-slide-bg">
               <div class="slide-inner">
                   <!-- Conteúdo -->
               </div>
           </section>
       </div>
   </div>
   ```

## 2. Navegação Extra (Top Nav)

Botões de uso extracorricular ou saída do slide (como `Voltar`) devem ser declarados ANTES do final da tag `body`, num container `top-nav`. A transição "voltar" usa history.back, o material deve ir para a origem. NÃO UTILIZE um custom slide-footer com botões de setas manuais, pois delegaremos ao plugin a navegação!

```html
<!-- Top Navigation -->
<div class="top-nav">
    <a href="javascript:history.back()" class="nav-btn">← Voltar</a>
    <a href="../module.html" class="nav-btn">Material</a>
</div>
```

## 3. Setup do Reveal.js

Adicione no fim do arquivo a integração e inicialização com o arquivo JS remoto, forçando layout flex-container, numeração (h.v) e a transição moderna do tipo 'convex'.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.js"></script>
<script>
    Reveal.initialize({
        controls: true,
        progress: true,
        slideNumber: 'h.v', // numeração padrão em Reveal
        center: false, // usamos align do css
        hash: true,
        transition: 'convex', // Efeito rotação
        width: '100%',
        height: '100%',
        margin: 0,
        disableLayout: true // Previne bugs onde o reveal tentaria escalar proporções
    });
</script>
```

> [!NOTE]
> Certifique-se de configurar as classes de CSS (`.slide-inner` etc) para ocuparem sempre full height sem impactar nas métricas originais que o projeto exigia. O objetivo não é só "caber", mas preencher bem o slide.
