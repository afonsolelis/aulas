# Favicon das Páginas

Toda página HTML do acervo — `index.html` e todo arquivo sob `pages/` — deve declarar um
favicon no `<head>`. A ausência constitui falha e é verificada automaticamente por
`tests/specs-compliance.spec.ts`, que roda em `npm test` e, portanto, no hook de
pre-commit.

## Formato obrigatório

SVG inline em *data URI*, tendo um emoji como único conteúdo, declarado imediatamente após
o `<title>`:

```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
```

As aspas internas são escritas como `%22` porque o valor do atributo já está delimitado por
aspas duplas. A ordem dos atributos e a quebra da declaração em duas linhas — `<link
rel="icon">` numa linha e `href` na seguinte — são indiferentes; 39 páginas do acervo usam a
segunda forma.

Não se admite arquivo externo (`.ico`, `.png`) nem referência a host remoto. O favicon deve
resolver sem requisição de rede, de modo que a página conserve sua identidade quando aberta
por `file://`, sem conectividade ou a partir de uma exportação local.

## Escolha do emoji

| Tipo de página | Emoji |
|---|---|
| Material de leitura | 📚 |
| Plano de ensino | 🗂️ |
| Deck de slides | temático da aula |
| Home de módulo, ferramenta, autoestudo, palestra, tutorial | temático da página |

O emoji de um deck identifica o tema da aula — 🧊 para fatos e dimensões, ⭐ para *star
schema*, 🧪 para testes, 🔄 para gestão de mudanças — e permanece estável ao longo do tempo:
o leitor localiza a aba pelo ícone, e a troca do emoji faz a página passar por outra.

Emoji já associado a um conjunto de páginas não é reaproveitado em outro contexto. É o caso
de ❄️, identidade do Inteli Camp.

## Verificação

`tests/specs-compliance.spec.ts`, bloco `favicon.md - Favicon das Páginas`:

1. toda página do escopo declara `<link rel="icon">` dentro do `<head>`;
2. a declaração é SVG inline com emoji, sem arquivo nem host externo;
3. esta spec documenta o padrão efetivamente aplicado.
