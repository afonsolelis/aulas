# Design System Inteli v2

Documentação do sistema visual do portal de aulas. As regras obrigatórias, em forma curta e testável, estão em `specs/design-system.md`. Este documento explica cada decisão, lista todos os tokens e mostra como usar cada componente. A vitrine com os componentes renderizados está em `pages/design-system.html`.

## Sumário

1. [Princípios](#1-princípios)
2. [Como usar](#2-como-usar)
3. [Cor](#3-cor)
4. [Tipografia](#4-tipografia)
5. [Espaço e grade](#5-espaço-e-grade)
6. [Forma](#6-forma)
7. [Elevação](#7-elevação)
8. [Movimento](#8-movimento)
9. [Componentes](#9-componentes)
10. [Bootstrap](#10-bootstrap)
11. [Camada de compatibilidade das homes](#11-camada-de-compatibilidade-das-homes)
12. [Acessibilidade](#12-acessibilidade)
13. [Por tipo de página](#13-por-tipo-de-página)
14. [Script de aplicação e testes](#14-script-de-aplicação-e-testes)
15. [Referência de tokens](#15-referência-de-tokens)
16. [Histórico](#16-histórico)

## 1. Princípios

O portal reúne slides projetados em sala, materiais de leitura longos, homes de módulo e atividades ao vivo (quiz, TBL). O sistema parte de quatro princípios, que valem para todos esses formatos.

1. A paleta é a do Inteli. O roxo, o verde, o coral e os cinzas da marca são as únicas matizes do portal. Nenhuma cor de outra biblioteca (Tailwind, Bootstrap, Material) entra.
2. Pouca cor. A hierarquia vem da tipografia, do peso e do espaço. A cor marca, não preenche: cada bloco tem no máximo um marcador colorido, como a linha superior de um card ou o quadrado de uma etiqueta.
3. Forma contida. Cantos quase retos (até 6 px) e contorno de 1 px no lugar de sombra. A página parece um documento técnico organizado, e não um conjunto de botões flutuantes.
4. Duas vozes tipográficas. Inter carrega o texto e os títulos. JetBrains Mono carrega tudo o que é metadado, rótulo, comando, número ou ação. A troca de família já diz ao leitor que tipo de informação ele está lendo.

A linguagem foi inspirada em portais de ferramentas para desenvolvedores, como o do opencode.ai, que usam fonte monoespaçada como identidade, cinzas neutros e um único tom de destaque. Aqui o tom de destaque é o roxo Inteli, e as cores de curso entram como marcadores.

## 2. Como usar

### Carregamento

Toda página carrega `css/inteli-ds.css` como última folha de estilo antes de `</head>`, com caminho relativo:

```html
  <!-- estilos da própria página -->
  <style> ... </style>
<!-- semana:css:start -->
<link rel="stylesheet" href="../../css/semana-ano.css">
<!-- semana:css:end -->
<!-- ds:css -->
<link rel="stylesheet" href="../../css/inteli-ds.css">
</head>
```

A posição importa. Por vir depois dos estilos da página, o arquivo vence os empates de especificidade, o que permite ajustar fonte, raio e componentes do Bootstrap sem editar cada página. O próprio arquivo importa as fontes do Google Fonts.

### Página nova

1. Monte a página com os componentes `.ds-*` (seção 9) e os tokens `var(--ds-*)` (seção 15).
2. Se precisar de estilo próprio, use os tokens. Não escreva hex, raio ou sombra literal.
3. Rode `node scripts/aplicar-design-system.mjs caminho/da/pagina.html`. O script injeta o link do sistema e corrige o que tiver escapado.
4. Rode `npx playwright test tests/design-system.spec.ts`.

### Página antiga ou colada de outro projeto

O mesmo script converte fontes, pesos, raios, sombras, hover, cores e gradientes (seção 14). Depois da conversão, confira a página no navegador: o script troca valores, mas não redesenha a composição.

## 3. Cor

### 3.1 Paleta Inteli

| Token | Hex | Papel |
|-------|-----|-------|
| `--inteli-roxo` | `#2e2640` | texto forte, ação primária, fundo de capa e de terminal |
| `--inteli-verde` | `#89cea5` | marcador de Sistemas de Informação; sucesso |
| `--inteli-coral` | `#ff4545` | marcador de Engenharia de Software; alerta e erro |
| `--inteli-cinza-400` | `#b2b6bf` | marcador do Ciclo Comum; borda em hover |
| `--inteli-cinza-300` | `#caced6` | borda de controle (botão secundário, campo) |
| `--inteli-cinza-100` | `#e6eaeb` | fundo fraco de segundo nível |
| `--inteli-branco` | `#ffffff` | fundo |

Os nomes antigos (`--inteli-purple`, `--si-blue`, `--eng-software-yellow`, `--adm-tech-navy`, `--inteli-dark-gray`...) continuam definidos em `css/inteli-styles.css` com os mesmos valores, porque páginas e testes os usam.

### 3.2 Derivações

Todas as derivações saem da paleta. Os níveis de texto e os fundos resultam da mistura do roxo e dos cinzas com branco. Os tons de texto verde e coral existem porque verde e coral puros não têm contraste de leitura sobre branco.

| Token | Hex | Origem | Uso |
|-------|-----|--------|-----|
| `--ds-texto-forte` | `#2e2640` | roxo | títulos, texto de destaque |
| `--ds-texto` | `#4d475d` | roxo 85% + branco | texto corrido |
| `--ds-texto-suave` | `#777283` | roxo 65% + branco | legenda, metadado |
| `--ds-texto-fraco` | `#a19da9` | roxo 45% + branco | decorativo, números de seção, placeholder |
| `--ds-fundo` | `#ffffff` | branco | fundo de página e de card |
| `--ds-fundo-fraco` | `#f3f5f5` | cinza-100 50% + branco | faixas, destaque, hover de botão |
| `--ds-fundo-mais-fraco` | `#e6eaeb` | cinza-100 | estado ativo |
| `--ds-borda` | `#dbdfe3` | cinza-100 60% + cinza-300 | borda padrão |
| `--ds-borda-forte` | `#caced6` | cinza-300 | borda de controle |
| `--ds-roxo-hover` | `#251e33` | roxo 80% + preto | hover do botão primário |
| `--ds-roxo-tinta` | `#f3f2f4` | roxo 6% + branco | hover de linha, botão fantasma |
| `--ds-roxo-tinta-2` | `#e9e7ec` | roxo 12% + branco | seleção de texto, anel de foco de campo |
| `--ds-verde-escuro` | `#2f8f78` | verde escuro do acervo | fundo do botão Material |
| `--ds-verde-texto` | `#267562` | verde escuro do acervo | texto verde sobre branco |
| `--ds-verde-tinta` | `#edf8f2` | verde 15% + branco | fundo de sucesso |
| (sem token) | `#d0ebdb` | verde 40% + branco | borda de sucesso |
| `--ds-coral-texto` | `#d53f44` | coral 80% + roxo | texto coral sobre branco |
| `--ds-coral-tinta` | `#ffecec` | coral 10% + branco | fundo de alerta |
| (sem token) | `#ffd1d1` | coral 25% + branco | borda de alerta |
| `--ds-terminal` | `#201b2d` | roxo 70% + preto | fundo de bloco de terminal |

### 3.3 Cores de curso

| Curso | Token | Classe |
|-------|-------|--------|
| Adm Tech | `--ds-curso-adm-tech` (roxo) | `.ds-curso-adm-tech` |
| Sistemas de Informação | `--ds-curso-si` (verde) | `.ds-curso-si` |
| Engenharia de Software | `--ds-curso-eng-software` (coral) | `.ds-curso-eng-software` |
| Ciclo Comum | `--ds-curso-comum` (cinza-400) | `.ds-curso-comum` |

A classe de curso define a variável `--ds-curso`, que os componentes leem. Assim o mesmo card serve aos quatro cursos:

```html
<a class="ds-card ds-card--curso ds-curso-si" href="...">...</a>
```

As classes antigas `.card-header-si`, `.card-header-eng-software`, `.card-header-adm-tech`, `.card-header-common` e `.bg-si`, `.bg-eng-software`, `.bg-adm-tech`, `.bg-common` também definem `--ds-curso`. Em cabeçalho de card, viram linha superior de 3 px sobre fundo branco. Em `.module-badge`, viram o quadrado de cor da etiqueta.

### 3.4 Semântica

| Estado | Marcador | Fundo | Texto |
|--------|----------|-------|-------|
| Informação | `--inteli-roxo` | `--ds-fundo-fraco` | `--ds-texto` |
| Sucesso, resposta correta | `--inteli-verde` | `--ds-verde-tinta` | `--ds-verde-texto` |
| Alerta, atenção, erro | `--inteli-coral` | `--ds-coral-tinta` | `--ds-coral-texto` |

A paleta Inteli tem um só tom quente. Por isso alerta e erro compartilham o coral; a diferença entre eles fica no texto e no ícone, e não numa segunda cor. Âmbar e amarelo não são usados.

### 3.5 Pouca cor, na prática

- Card: fundo branco, borda de 1 px, cor só na linha superior (`.ds-card--curso`).
- Etiqueta: fundo branco, texto escuro, quadrado de 7 px na cor do curso (`.ds-tag--cor`).
- Destaque: fundo cinza fraco, filete esquerdo de 2 px na cor (`.ds-destaque`).
- Botão: o primário é roxo; o resto é contorno ou fantasma. Botão de curso (`.btn-si`, `.btn-eng`...) também é roxo, com filete interno na cor do curso.
- Fundo inteiro colorido fica restrito à capa de slide, ao botão primário e ao bloco de terminal.

### 3.6 Gradientes

Gradiente entre cores sólidas não é usado. A capa de slide que ia do roxo ao verde passa a ser roxa. O gradiente continua admitido para transparência, como esmaecer a borda de uma área com rolagem ou a sobreposição sobre uma foto.

### 3.7 Exceções

- Blocos de código usam o tema Catppuccin Mocha (`#1e1e2e`, `#cdd6f4`, `#89b4fa`...). Realce de sintaxe precisa de várias matizes para cumprir a função.
- As páginas de `pages/palestras/` podem seguir a identidade da instituição convidada (Sindusfarma, Copel, Ambev, BNP Paribas...). Fonte, raio e sombra seguem o sistema; a cor é livre.
- Imagens, SVG externos e diagramas exportados (`.svg`, `.puml`) não são alterados.

## 4. Tipografia

### 4.1 Famílias

| Token | Família | Onde |
|-------|---------|------|
| `--ds-fonte` | Inter | texto corrido, títulos, parágrafos de card |
| `--ds-fonte-mono` | JetBrains Mono | rótulos, etiquetas, botões, metadados, datas, números de seção, indicadores, código, tabelas de dados |

As duas são livres (SIL Open Font License) e vêm do Google Fonts:

```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap
```

Manrope, Azurio, Space Mono, Courier New, Fira Code e Merriweather saíram do acervo.

### 4.2 Escala

| Token | Tamanho | Uso |
|-------|---------|-----|
| `--ds-fs-micro` | 12 px | rótulo em caixa alta, etiqueta, cabeçalho de tabela |
| `--ds-fs-meta` | 13 px | metadado, botão pequeno, item de lista em mono |
| `--ds-fs-ui` | 14 px | botão, texto de card, tabela |
| `--ds-fs-corpo` | 16 px | texto de interface |
| `--ds-fs-leitura` | 17 px | texto corrido de material de leitura |
| `--ds-fs-lead` | 20 px | parágrafo de abertura |
| `--ds-fs-h3` | 20 px | título de card |
| `--ds-fs-h2` | 28 px | título de seção |
| `--ds-fs-h1` | 32 a 48 px | título de página (fluido) |
| `--ds-fs-display` | 40 a 72 px | título de abertura e capa (fluido) |

Slides projetados podem usar tamanhos maiores; a proporção entre os níveis é o que deve ser mantido.

### 4.3 Peso, espaçamento e entrelinha

- Pesos: 400 para texto, 500 para mono e rótulos, 600 para títulos, 700 só para capa e número de destaque. O script converte 800 e 900 para 700.
- Títulos: `letter-spacing: -0.02em` (`--ds-tracking-titulo`); capa e display, `-0.03em` (`--ds-tracking-display`).
- Rótulos em mono: caixa alta, `letter-spacing: 0.06em` (`--ds-tracking-rotulo`).
- Entrelinha: 1,6 no texto (`--ds-entrelinha`), 1,15 nos títulos (`--ds-entrelinha-titulo`).
- Medida: até 72 caracteres por linha em material de leitura (`--ds-medida`).
- Inter recebe `font-feature-settings: "cv11", "ss01"`, que deixa o `a` e os numerais mais legíveis.

### 4.4 Exemplo de hierarquia

```html
<span class="ds-rotulo">Módulo 7 · Sistemas de Informação · Aula 9</span>
<h1 class="ds-titulo-pagina">Estratégia e gestão de serviços de TI</h1>
<p class="ds-lead">Material de leitura sobre o planejamento estratégico de tecnologia.</p>
```

## 5. Espaço e grade

A escala de espaço usa múltiplos de 4 px:

| Token | Valor |
|-------|-------|
| `--ds-esp-1` | 4 px |
| `--ds-esp-2` | 8 px |
| `--ds-esp-3` | 12 px |
| `--ds-esp-4` | 16 px |
| `--ds-esp-5` | 20 px |
| `--ds-esp-6` | 24 px |
| `--ds-esp-8` | 32 px |
| `--ds-esp-10` | 40 px |
| `--ds-esp-12` | 48 px |
| `--ds-esp-16` | 64 px |
| `--ds-esp-24` | 96 px |

- Contêiner: `.ds-container`, largura máxima de 1320 px, margem lateral de 24 px (16 px no celular).
- Grade de cards: `.ds-grade`, colunas automáticas de no mínimo 300 px, espaço de 16 px.
- Seção: `.ds-secao`, 48 px acima e 32 px abaixo; o cabeçalho tem linha inferior de 1 px.

## 6. Forma

| Token | Valor | Onde |
|-------|-------|------|
| `--ds-raio-0` | 0 | faixas, tabelas, divisórias |
| `--ds-raio-1` | 2 px | etiqueta, tecla, destaque |
| `--ds-raio-2` | 4 px | botão, campo, número de aula |
| `--ds-raio-3` | 6 px | card, painel, bloco de terminal |

- Pílula (`999px`) não é usada. O que era pílula passou a ter 4 px.
- `50%` fica restrito a avatar, foto e ponto de status.
- O Bootstrap foi ajustado para a mesma escala (`--bs-border-radius*`, `.rounded*`, `.rounded-pill`).

## 7. Elevação

A separação entre superfícies é feita por borda, e não por sombra.

| Token | Valor | Uso |
|-------|-------|-----|
| `--ds-anel` | `0 0 0 1px var(--ds-borda)` | contorno sem ocupar espaço |
| `--ds-sombra-1` | anel de 1 px a 6% + 1 px de desfoque | card em repouso que precisa se destacar |
| `--ds-sombra-2` | anel de 1 px a 8% + 2 e 6 px de desfoque | card em hover, menu, popover |

Sombra larga e difusa (`0 10px 30px`) não é usada. O script converte as sombras com desfoque de 10 px ou mais para os dois tokens.

## 8. Movimento

| Token | Valor |
|-------|-------|
| `--ds-ease` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| `--ds-rapido` | 120 ms (cor, borda, fundo) |
| `--ds-medio` | 200 ms (abrir, recolher) |

- No hover, o elemento muda de borda ou de fundo. Pode subir no máximo 1 px.
- Escala, rotação e saltos maiores saíram do acervo.
- Com `prefers-reduced-motion: reduce`, transições e animações ficam instantâneas.

## 9. Componentes

Todos os componentes estão renderizados em `pages/design-system.html`.

### 9.1 Rótulo

Metadado em mono, caixa alta, acima de um título.

```html
<span class="ds-rotulo">Sprint 2 · Semanas 3 e 4</span>
```

### 9.2 Número de seção

```html
<div class="ds-secao__cabeca">
  <span class="ds-num">02</span>
  <h2 class="ds-secao__titulo">Módulos</h2>
</div>
```

### 9.3 Botão

| Variante | Classe | Uso |
|----------|--------|-----|
| Primário | `.ds-btn.ds-btn--primario` | a ação principal da tela, uma por bloco |
| Secundário | `.ds-btn.ds-btn--secundario` | ações de mesmo nível, navegação |
| Fantasma | `.ds-btn.ds-btn--fantasma` | ação terciária, links de cabeçalho |
| Perigo | `.ds-btn.ds-btn--perigo` | ação destrutiva (reiniciar sala, apagar) |
| Material | `.ds-btn.ds-btn--material` | botão Material do rodapé dos slides |
| Inverso | `.ds-btn.ds-btn--inverso` | sobre fundo roxo |

Tamanhos: `.ds-btn--sm` (28 px), padrão (36 px), `.ds-btn--lg` (44 px). Desabilitado: atributo `disabled` ou `aria-disabled="true"`.

```html
<a class="ds-btn ds-btn--primario" href="slides/slide-lesson-9.html">Abrir slides</a>
<a class="ds-btn ds-btn--secundario" href="materials/lesson-9-material.html">Material</a>
```

O `.btn` do Bootstrap já segue o mesmo desenho (seção 10).

### 9.4 Etiqueta

```html
<span class="ds-tag">Ponderada</span>
<span class="ds-tag ds-tag--cor ds-curso-eng-software">Engenharia de Software</span>
<span class="ds-tag ds-tag--sucesso">Entregue</span>
<span class="ds-tag ds-tag--alerta">Prova</span>
<span class="ds-tag ds-tag--roxo">Ao vivo</span>
```

### 9.5 Card

Estrutura: rótulo ou etiqueta, título, texto, lista opcional, rodapé opcional.

```html
<a class="ds-card ds-card--curso ds-curso-si" href="pages/home-module-7-sistemas-informacao.html">
  <span class="ds-tag ds-tag--cor">Sistemas de Informação</span>
  <h3 class="ds-card__titulo">Sistemas de Gestão e Governança Empresarial</h3>
  <p class="ds-card__texto">Implantação de um sistema de gestão empresarial em um caso real.</p>
  <ul class="ds-card__lista">
    <li>ERP</li>
    <li>Mapeamento de processos</li>
  </ul>
</a>
```

- `a.ds-card` ganha borda forte e `--ds-sombra-2` no hover.
- `.ds-card--curso` acrescenta a linha superior de 3 px na cor do curso.
- Os itens de `.ds-card__lista` aparecem em mono, precedidos de traço.

### 9.6 Destaque

```html
<div class="ds-destaque">Leitura prévia: autoestudos da semana 8.</div>
<div class="ds-destaque ds-destaque--sucesso">Resposta correta: B.</div>
<div class="ds-destaque ds-destaque--alerta">A sala fecha às 21h30.</div>
```

### 9.7 Indicador

```html
<div>
  <span class="ds-indicador__valor">20</span>
  <span class="ds-indicador__rotulo">alunos na sala</span>
</div>
```

### 9.8 Terminal e código

```html
<pre class="ds-terminal"><span class="ds-terminal__prompt">$</span> docker compose up -d
<span class="ds-terminal__fraco"># sobe Postgres e PostgREST</span></pre>
```

Tecla: `<kbd>Ctrl</kbd>` ou `.ds-tecla`.

### 9.9 Tabela

```html
<table class="ds-tabela">
  <thead><tr><th>Aula</th><th>Data</th><th>Tema</th></tr></thead>
  <tbody><tr><td>09</td><td>24/09</td><td>Serviços de TI</td></tr></tbody>
</table>
```

Cabeçalho em mono e caixa alta, linhas separadas por borda de 1 px, hover com `--ds-roxo-tinta`.

### 9.10 Cabeçalho de página e abertura

```html
<header class="ds-cabecalho">
  <div class="ds-cabecalho__interno">
    <img src="..." alt="Inteli Logo" width="92">
    <nav><a class="ds-btn ds-btn--fantasma ds-btn--sm" href="...">Professor</a></nav>
  </div>
</header>
<section class="ds-container">
  <span class="ds-rotulo">Prof. Afonso Brandão · Inteli</span>
  <h1 class="ds-titulo-pagina">Aulas, materiais e atividades</h1>
  <p class="ds-lead">...</p>
</section>
```

### 9.11 Rodapé global

O rodapé `.inteli-footer` (obrigatório em toda página) recebe fundo branco, borda superior de 1 px e a licença em mono. O HTML não muda.

## 10. Bootstrap

O Bootstrap 5.3 continua em uso nas homes e em parte dos materiais. `css/inteli-ds.css` ajusta:

- variáveis `--bs-*` de fonte, cor de texto, borda, raio, sombra e link;
- as cores de tema (`primary` e `dark` roxo, `success` verde de texto, `danger` e `warning` coral, `info` roxo, `light` fundo fraco);
- `.btn` (mono, peso 500, raio 4 px, sem sombra, sem deslocamento) e as variantes `primary`, `dark`, `outline-*`, `light`, `secondary`, `success`, `danger`, `warning`;
- `.card`, `.badge`, `.form-control`, `.form-select`, `.rounded*`, `.shadow*`.

## 11. Camada de compatibilidade das homes

As homes de módulo (`pages/home-module-*.html`) trazem estilo próprio com classes como `.module-header`, `.lesson-card`, `.lesson-number`, `.lesson-btn-*`, `.week-tag`, `.sprint-*` e `.prof-badge`. A seção 5 de `css/inteli-ds.css` alinha essas classes ao sistema:

- o cabeçalho do módulo fica branco, com linha superior na cor do curso (detectada por `:has(.badge-si)` e equivalentes);
- o número da aula vira quadrado de 36 px com borda, em mono;
- o botão Slides fica roxo, o Material fica com contorno e o Plano fica fantasma;
- semana e sprint ganham rótulos em mono e filete esquerdo de 2 px.

Quando uma home for reescrita com os componentes `.ds-*`, a regra correspondente pode sair da camada.

## 12. Acessibilidade

Contraste medido sobre branco:

| Cor | Contraste | Uso permitido |
|-----|-----------|---------------|
| `#2e2640` roxo | 14,3:1 | qualquer texto |
| `#4d475d` texto | 8,8:1 | qualquer texto |
| `#777283` texto suave | 4,6:1 | texto pequeno |
| `#267562` verde texto | 5,5:1 | texto pequeno |
| `#d53f44` coral texto | 4,5:1 | texto pequeno |
| `#2f8f78` verde escuro | 3,9:1 | fundo de botão com texto branco em peso 600 |
| `#ff4545` coral | 3,4:1 | marcador, texto grande, fundo de botão |
| `#a19da9` texto fraco | 2,7:1 | só decorativo |
| `#89cea5` verde | 1,8:1 | só marcador; nunca texto sobre branco |

Branco sobre roxo dá 14,3:1, e roxo sobre verde dá 7,8:1.

- Foco: `:focus-visible` com contorno de 2 px em roxo e afastamento de 2 px. Campo de formulário em foco ganha borda roxa e anel de 3 px em `--ds-roxo-tinta-2`.
- Movimento reduzido: respeitado globalmente (seção 8).
- Cor nunca é o único sinal. Etiqueta de estado sempre tem texto; resposta correta tem rótulo além do verde.

## 13. Por tipo de página

| Tipo | Orientação |
|------|------------|
| `index.html` | cabeçalho com logo e atalhos fantasma; abertura com rótulo, título display e lead; seções numeradas com `.ds-grade` de cards |
| Home de módulo | cabeçalho branco com linha do curso; cards de aula com número em mono, botões Slides (primário), Material (secundário) e Plano (fantasma) |
| Slide | capa em roxo sólido; títulos em Inter 700 com tracking negativo; rótulos de aula e data em mono; caixas com borda de 1 px e filete; rodapé com Home, Material (`#2f8f78`) e navegação em mono |
| Material de leitura | coluna de até 72 caracteres, 17 px, entrelinha 1,6; sumário lateral em mono; destaques com filete de 2 px |
| Quiz e TBL | painel com indicadores em mono; alternativas como cards com borda; correta em verde, incorreta em coral, sempre com texto |
| Plano de ensino | mesma base do material; tabelas `.ds-tabela` para cronograma |

## 14. Script de aplicação e testes

`scripts/aplicar-design-system.mjs` aplica o sistema a páginas existentes:

```bash
node scripts/aplicar-design-system.mjs            # todo o portal
node scripts/aplicar-design-system.mjs --check    # só lista o que mudaria
node scripts/aplicar-design-system.mjs pages/x.html
```

O que ele faz em cada `.html` de `pages/` e `index.html` e em cada `.css` do portal:

1. troca os links do Google Fonts pelo par Inter + JetBrains Mono e substitui as famílias antigas;
2. converte peso 800 e 900 em 700;
3. leva o raio para a escala: até 2 px vira 2 px, de 3 a 5 px vira 4 px, de 6 a 49 px vira 6 px, pílula (50 px ou mais) vira 4 px e `50%` fica;
4. troca sombra difusa pelos tokens de elevação;
5. limita o deslocamento de hover a 1 px e anula a escala;
6. converte cada cor fora da paleta para a cor Inteli de mesmo papel, primeiro pela tabela de grupos (Tailwind, Bootstrap) e, para o resto, por uma regra de matiz e luminosidade: neutros viram o nível de texto ou de fundo mais próximo, verdes viram os verdes Inteli, vermelhos, laranjas, amarelos e rosas viram os corais e o roxo, azuis e violetas viram o roxo ou suas tintas;
7. troca gradiente entre cores sólidas pela primeira cor;
8. injeta `css/inteli-ds.css` antes de `</head>`.

Os passos 6 e 7 não se aplicam a `pages/palestras/`. O script é idempotente.

`tests/design-system.spec.ts` confere em todo o portal:

- o link para `css/inteli-ds.css` como última folha do `<head>`, com caminho correto;
- a ausência das fontes antigas;
- raio dentro da escala;
- toda cor hexadecimal na paleta, nas derivações ou no tema de código;
- os tokens da paleta;
- que o script não teria nada a mudar.

## 15. Referência de tokens

```css
/* Paleta */
--inteli-roxo  --inteli-verde  --inteli-coral  --inteli-cinza-400  --inteli-cinza-300  --inteli-cinza-100  --inteli-branco

/* Derivações */
--ds-roxo-hover  --ds-roxo-tinta  --ds-roxo-tinta-2
--ds-verde-escuro  --ds-verde-texto  --ds-verde-tinta
--ds-coral-texto  --ds-coral-tinta  --ds-terminal

/* Texto */
--ds-texto-forte  --ds-texto  --ds-texto-suave  --ds-texto-fraco  --ds-texto-inverso

/* Superfície */
--ds-fundo  --ds-fundo-fraco  --ds-fundo-mais-fraco  --ds-borda  --ds-borda-forte

/* Curso */
--ds-curso  --ds-curso-adm-tech  --ds-curso-si  --ds-curso-eng-software  --ds-curso-comum

/* Tipografia */
--ds-fonte  --ds-fonte-mono
--ds-fs-micro  --ds-fs-meta  --ds-fs-ui  --ds-fs-corpo  --ds-fs-leitura  --ds-fs-lead
--ds-fs-h3  --ds-fs-h2  --ds-fs-h1  --ds-fs-display
--ds-entrelinha  --ds-entrelinha-titulo  --ds-tracking-titulo  --ds-tracking-display  --ds-tracking-rotulo  --ds-medida

/* Espaço */
--ds-esp-1 … --ds-esp-24

/* Forma, elevação, movimento */
--ds-raio-0  --ds-raio-1  --ds-raio-2  --ds-raio-3
--ds-anel  --ds-sombra-1  --ds-sombra-2
--ds-ease  --ds-rapido  --ds-medio
```

Classes de componente: `.ds-rotulo`, `.ds-num`, `.ds-btn` (`--sm`, `--lg`, `--primario`, `--secundario`, `--fantasma`, `--perigo`, `--material`, `--inverso`), `.ds-tag` (`--cor`, `--sucesso`, `--alerta`, `--roxo`), `.ds-card` (`--curso`, `__titulo`, `__texto`, `__lista`, `__rodape`), `.ds-curso-*`, `.ds-destaque` (`--sucesso`, `--alerta`), `.ds-indicador__valor`, `.ds-indicador__rotulo`, `.ds-terminal` (`__prompt`, `__fraco`), `.ds-tecla`, `.ds-tabela`, `.ds-cabecalho` (`__interno`), `.ds-titulo-pagina`, `.ds-lead`, `.ds-grade`, `.ds-secao` (`__cabeca`, `__titulo`), `.ds-container`, `.ds-mono`, `.ds-texto-suave`.

## 16. Histórico

| Versão | Data | Mudança |
|--------|------|---------|
| v1 | até 11/2026 | Manrope e Space Mono; cabeçalhos de card preenchidos com a cor do curso; raios de 10 a 25 px e pílulas; sombras difusas; gradientes roxo-verde; cores do Tailwind misturadas à paleta |
| v2 | 07/11/2026 | Inter e JetBrains Mono; paleta Inteli exclusiva com derivações documentadas; cor como marcador; raio até 6 px; contorno de 1 px; componentes `.ds-*`; script de aplicação e teste de conformidade |
