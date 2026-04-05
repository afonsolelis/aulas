# Spec: Acessibilidade e Contraste Visual

## Objetivo

Garantir que o portal seja acessível e tenha contraste adequado para todos os usuários.

## Escopo

Aplica-se a todas as páginas HTML do portal.

## Cores e Contraste

### Cores Institucionais

| Curso/Módulo | Cor Primária | Hex | RGB |
|--------------|--------------|-----|-----|
| Sistemas de Informação | Verde | #89cea5 | rgb(137, 206, 165) |
| Engenharia de Software | Vermelho | #ff4545 | rgb(255, 69, 69) |
| Administração de TI | Navy/Azul | #2e2640 | rgb(46, 38, 64) |
| Módulo Comum | Cinza | #808080 | rgb(128, 128, 128) |

### Requisitos de Contraste

1. **Texto Normal**
   - Contraste mínimo de 4.5:1 contra o fundo
   - Texto em botões deve ser legível sem hover

2. **Texto de Botões**
   - Botão Material: verde escuro (#2e2640) com texto branco
   - Botões de navegação: contraste forte garantido
   - Não depender de hover para visibilidade do texto

3. **Links**
   - Devem ter cor distinta do texto normal
   - Devem ter underline ou outro indicador visual além da cor
   - Links visitados podem ter cor diferenciada

## Elementos Visuais

### Botões

1. **Tamanho Mínimo**
   - Altura mínima: 44px (recomendação WCAG)
   - Largura mínima: 44px para botões apenas com ícone

2. **Estados**
   - Deve ter estado hover visível
   - Deve ter estado focus visível (para navegação por teclado)
   - Deve ter estado active visível

3. **Texto em Botões**
   - Não pode depender apenas de cor para transmitir informação
   - Ícones devem ter texto alternativo ou aria-label

### Cards

1. **Sombras**
   - Devem usar box-shadow para profundidade
   - Sombra não pode ser o único indicador de interatividade

2. **Bordas**
   - Devem ter border-radius consistente (8-12px recomendado)
   - Bordas não podem ser o único separador visual

## Tipografia

1. **Tamanhos Mínimos**
   - Texto corporal: 16px mínimo
   - Texto secundário: 14px mínimo
   - Títulos: hierarquia clara (h1 > h2 > h3)

2. **Espaçamento**
   - Line-height mínimo de 1.5 para texto corporal
   - Margens entre parágrafos: 1em mínimo

3. **Fontes**
   - Preferir fontes do sistema para performance
   - Bootstrap fonts são aceitáveis
   - Não usar fontes menores que 12px

## Navegação por Teclado

1. **Focus Visible**
   - Todos os elementos interativos devem ter focus visible
   - Não remover outline sem fornecer alternativa
   - Focus deve ser claramente visível

2. **Ordem de Tab**
   - Ordem lógica de navegação
   - Seguir fluxo visual da página (topo → base, esquerda → direita)

3. **Skip Links**
   - Páginas longas devem ter link "pular para conteúdo principal"
   - Link deve ser visível ao receber focus

## Imagens e Ícones

1. **Imagens de Conteúdo**
   - Devem ter atributo alt descritivo
   - Alt deve descrever o conteúdo/função, não "imagem de..."

2. **Ícones Decorativos**
   - Devem ter `aria-hidden="true"` se forem puramente decorativos
   - Devem ter label se transmitirem informação

3. **Emojis como Ícones**
   - Aceitáveis para ícones decorativos
   - Devem ter fallback textual para informação importante

## Formulários (quando aplicável)

1. **Labels**
   - Todo input deve ter label associado
   - Usar atributo `for` ou envolver input no label

2. **Mensagens de Erro**
   - Devem ser claras e descritivas
   - Devem estar associadas ao campo via aria-describedby

3. **Validação**
   - Não depender apenas de cor para indicar erro
   - Usar ícone + texto + cor

## Testes de Acessibilidade

1. **Navegação por Teclado**
   - Testar navegação completa apenas com Tab/Shift+Tab
   - Verificar se não há armadilhas de foco

2. **Leitor de Tela**
   - Testar com NVDA ou VoiceOver
   - Verificar se toda informação é acessível

3. **Contraste**
   - Usar ferramentas como axe DevTools ou Lighthouse
   - Verificar contraste em múltiplos elementos

## Exceções

1. Conteúdo em construção pode ter acessibilidade parcial
2. Placeholders devem indicar claramente que são temporários
3. Gráficos complexos podem ter descrição textual alternativa

## Recursos

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
