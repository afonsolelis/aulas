# Spec: Design System Inteli (v2)

## Objetivo

Definir as regras visuais obrigatórias de todas as páginas do portal: cor, tipografia, forma, elevação, movimento e componentes. A documentação completa, com tokens, exemplos e justificativas, está em `docs/design-system.md`. A vitrine viva dos componentes está em `pages/design-system.html`.

O sistema mantém a paleta Inteli e adota uma linguagem sóbria: pouca cor, tipografia como principal recurso de hierarquia, cantos quase retos e contorno de 1 px no lugar de sombras.

## Fonte única

1. Os tokens e os componentes moram em `css/inteli-ds.css`.
2. Toda página HTML do portal (`index.html` e `pages/**/*.html`) carrega `css/inteli-ds.css` por caminho relativo, como último elemento de folha de estilo antes de `</head>`. Por vir depois dos estilos da própria página, o arquivo prevalece em caso de empate de especificidade.
3. Página nova usa os tokens (`var(--ds-*)`) e os componentes (`.ds-*`) antes de criar regra própria.
4. `scripts/aplicar-design-system.mjs` aplica as regras 2, 5, 9, 10 e 13 a páginas existentes. Ele é idempotente e deve ser rodado sempre que uma página for criada fora do padrão.

## Cor

5. A paleta é a do Inteli, sem acréscimos de matiz:

   | Token | Valor | Uso |
   |-------|-------|-----|
   | `--inteli-roxo` | `#2e2640` | texto forte, ação primária, fundo de destaque |
   | `--inteli-verde` | `#89cea5` | marcador do curso de SI, estado de sucesso |
   | `--inteli-coral` | `#ff4545` | marcador do curso de Engenharia de Software, alerta e erro |
   | `--inteli-cinza-400` | `#b2b6bf` | marcador do ciclo comum, borda forte |
   | `--inteli-cinza-300` | `#caced6` | borda de controle |
   | `--inteli-cinza-100` | `#e6eaeb` | fundo fraco |
   | `--inteli-branco` | `#ffffff` | fundo |

6. São permitidas apenas as derivações documentadas em `docs/design-system.md`: níveis de texto e tons de fundo, obtidos pela mistura do roxo e dos cinzas com branco; `--ds-coral-texto` (`#d53f44`), coral misturado ao roxo; e os dois verdes escuros que o acervo já usava, `--ds-verde-escuro` (`#2f8f78`, fundo de botão) e `--ds-verde-texto` (`#267562`, texto). Os dois tons de texto existem porque verde e coral puros não dão contraste de leitura sobre branco.
7. A cor ocupa no máximo um marcador por bloco: o quadrado de cor no cabeçalho do card ou da etiqueta, ou o filete do destaque. Faixa colorida no topo de card ou cabeçalho não é usada. Fundo inteiro colorido fica restrito à capa de slide, ao botão primário e ao bloco de terminal.
8. Gradiente entre cores sólidas não é usado. Gradiente só é admitido para transparência, como esmaecer a borda de uma área rolável.
9. As cores de outras paletas (Tailwind, Bootstrap) que existiam no acervo foram convertidas para o equivalente Inteli de mesmo papel. A tabela de conversão está em `scripts/aplicar-design-system.mjs`, e o teste impede que elas voltem.
10. Exceções: o tema de realce de sintaxe dos blocos de código (Catppuccin) e as páginas de `pages/palestras/`, que podem seguir a identidade da instituição convidada.

## Tipografia

11. Duas famílias livres, servidas pelo Google Fonts:
    - `Inter` para texto corrido e títulos;
    - `JetBrains Mono` para rótulos, etiquetas, botões, metadados, números de seção, código e dados tabulares.
12. Não se usam Manrope, Space Mono, Courier New, Fira Code, Merriweather nem Azurio.
13. Pesos permitidos: 400, 500, 600 e 700. O peso 700 fica para título de capa e número de destaque.
14. Títulos usam espaçamento negativo (`-0.02em`; capa `-0.03em`). Rótulos em mono usam caixa alta com espaçamento `0.06em`.
15. Texto corrido tem entrelinha entre 1,55 e 1,7 e coluna de no máximo 72 caracteres em materiais de leitura.

## Forma e elevação

16. Raios permitidos: `0`, `2px`, `4px` e `6px` (`--ds-raio-0` a `--ds-raio-3`). Formato de pílula (`999px`) não é usado. `50%` fica restrito a avatar, foto e ponto de status.
17. A separação entre superfícies é feita por borda de 1 px. Sombra é só o anel de 1 px com desfoque curto (`--ds-sombra-1`, `--ds-sombra-2`); sombra larga e difusa não é usada.
18. No `:hover`, o elemento muda de borda, de fundo ou sobe no máximo 1 px. Deslocamento maior, escala e rotação não são usados.

## Componentes

19. Botões seguem `.ds-btn` (ou `.btn` do Bootstrap, já ajustado): mono, peso 500, raio 4 px, altura de 28, 36 ou 44 px. Variantes: primário (roxo), secundário (contorno), fantasma e perigo (coral).
20. Etiquetas seguem `.ds-tag`: mono em caixa alta, borda de 1 px, raio 2 px, quadrado de cor opcional.
21. Cards seguem `.ds-card`. A identidade do curso aparece como um quadrado de 10 px (`.ds-quadrado`) ao lado do nome do curso, no cabeçalho do card, e não como faixa nem como cabeçalho preenchido.
22. As cores de curso são: Adm Tech `--inteli-roxo`, Sistemas de Informação `--inteli-verde`, Engenharia de Software `--inteli-coral`, Ciclo Comum `--inteli-cinza-400`. As classes `.card-header-*` e `.bg-*` de curso definem `--ds-curso` e continuam válidas.
23. O botão Material dos slides mantém o fundo `#2f8f78` (`--ds-verde-escuro`) com texto branco em peso 600.

## Acessibilidade

24. Texto corrido tem contraste mínimo de 4,5:1 sobre o fundo. `--inteli-verde` e `--inteli-coral` não são usados como cor de texto pequeno sobre branco; para isso existem `--ds-verde-texto` e `--ds-coral-texto`.
25. Todo elemento interativo tem `:focus-visible` com anel de 2 px em `--inteli-roxo` (ou branco sobre fundo escuro).

## Layout das homes (`.tm`)

26. A página inicial e as homes (módulos, autoestudos, palestras, tutorial do GitLab e professor) usam o layout terminal de `css/inteli-ds.css`, ativado por `<body class="tm">`: menu lateral fixo numerado (`[1]`, `[2]`…), sem cabeçalho no topo; abertura com título em JetBrains Mono; seções com o título em mono no alto e o conteúdo logo abaixo, na largura toda; rodapé `inteli-footer tm-rodape` com links `[ ]`.
27. A página inicial não exibe quadro de números do acervo nem repete no corpo os atalhos do menu lateral em forma de card.
28. Módulos (`.tm-lista`), autoestudos e palestras (`.tm-grade`) aparecem em cards de contorno quadrado de 1 px, raio 0, colunas de no mínimo 280 px e altura igual em toda a grade. A descrição de cada card tem uma frase curta, para que os cards da grade fiquem do mesmo tamanho.
29. Nas homes de módulo, os cards de aula mantêm a marcação original (`lesson-card`, `lesson-number`, `📅`, `ponderada-badge`, botões 🎞️ Slides e 📝 Material) e são apresentados em lista plana dentro de `.tm-aulas`; os tópicos ficam em `.tm-topicos`.

## Slides em layout terminal (`.tm-deck`)

30. Decks com `<body class="tm-deck">` recebem a camada 5c de `css/inteli-ds.css`, que se sobrepõe ao CSS próprio do deck: fundo branco, títulos de seção e de capa em JetBrains Mono, cabeçalho de seção sem bloco colorido e com linha de base de 1 px, cards e etiquetas com contorno de 1 px e cantos retos, tabelas com cabeçalho sem preenchimento, daily com contorno e cronômetro em mono, rodapé branco com botões retos. Blocos de terminal (`.code-mini`, `.kpi`) continuam escuros, e o botão Material mantém `--ds-verde-escuro` (regra 23).
31. A camada altera só cor, fonte, borda e raio; tamanhos e espaçamentos continuam os do deck. Depois de aplicá-la, o deck passa por `npm run validate:slides` sem nenhum `OVERFLOW`.
32. Hoje usam a camada os 13 decks do Módulo 8 de Sistemas de Informação.

## Validação

`tests/design-system.spec.ts` confere as regras 2, 9, 12, 16 e a existência dos tokens da regra 5.
