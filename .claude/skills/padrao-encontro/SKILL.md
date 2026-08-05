---
name: padrao-encontro
description: Padrão obrigatório de toda página de aula do acervo — botão de exportação em PDF com o nome de arquivo padronizado pelo Inteli (ANO-MÊS-DIA-Nome-NoSequencial) e ficha do encontro com objetivo de aprendizagem, estratégia e estrutura. Use ao criar ou editar qualquer slide, material, plano ou página de aula, ao registrar um encontro novo e ao investigar falhas do spec tests/encontro-compliance.spec.ts.
type: reference
---

# Padrão de Encontro

Toda página de aula do acervo — slides, material de leitura, plano de ensino e página de
aula — deve satisfazer, **sem exceção**, dois requisitos:

1. **Botão de exportação em PDF**, com o nome de arquivo padronizado pela coordenação.
2. **Ficha do encontro**, declarando objetivo de aprendizagem, estratégia e estrutura.

A conformidade é verificada por `tests/encontro-compliance.spec.ts`, que roda em `npm test`
e, portanto, no hook de pre-commit. Página de aula sem os dois itens não entra no
repositório.

## Origem da exigência

Comunicado da coordenação aos docentes: os materiais dos encontros deixam de ser
compartilhados de forma ad-hoc e passam a compor um repositório organizado, consultável por
todos. Não há modelo rígido de conteúdo — o docente compartilha o que já usa. É obrigatório,
porém, que o material deixe claro:

- o **objetivo de aprendizagem** do encontro, de preferência relacionado ao projeto;
- a **estratégia, método ou dinâmica** a ser seguida, isto é, como se chega ao objetivo;
- a **estrutura (agenda)** do encontro.

E que o arquivo siga a nomenclatura padronizada, sem a qual o material não é localizável na
estrutura de pastas do Drive.

## Nomenclatura do arquivo

```
ANO-MÊS-DIA-Nome-NoSequencial        →  2026-08-06-Afonso-01
```

| Componente | Origem | Regra |
|---|---|---|
| `ANO-MÊS-DIA` | `data` do encontro em `config/encontros.json` | Formato `AAAA-MM-DD`. Quando o encontro ainda não tem data registrada, o botão usa a data da exportação. |
| `Nome` | `docente` do encontro | Primeiro nome de quem ministra o encontro, conforme o config do módulo. Cada docente publica na própria pasta do Drive. |
| `NoSequencial` | tipo do artefato | `01` slides e páginas de aula · `02` material de leitura · `03` plano de ensino. Os três artefatos do mesmo encontro convivem sem colidir. |

O nome é aplicado substituindo o `document.title` durante a impressão — é ele que o
navegador sugere ao salvar em PDF. O título original é restaurado em seguida.

## Fonte de verdade

`config/encontros.json` contém duas seções:

```jsonc
{
  "encontros": {
    "module-7-sistemas-informacao#1": {
      "titulo": "Regras de negócio e tomada de decisão",
      "data": "2026-08-06",          // AAAA-MM-DD; vazio quando ainda não há grade
      "docente": "Afonso",           // primeiro nome
      "objetivo": "Ao final do encontro, o estudante deve ser capaz de …",
      "estrategia": "Exposição dialogada em quatro blocos, cada um seguido de …",
      "agenda": ["Bloco 1 (30 min) — …", "Bloco 2 (30 min) — …"]
    }
  },
  "paginas": [
    { "path": "pages/…/slides/slide-lesson-1.html", "encontro": "module-7-sistemas-informacao#1", "seq": "01" }
  ]
}
```

A chave do encontro é `<módulo>#<número da aula>`; páginas fora dessa numeração (palestras,
materiais avulsos) usam o próprio caminho como chave. **Um encontro, uma ficha**: os três
artefatos de uma mesma aula compartilham objetivo, estratégia e estrutura.

## Aplicação

```bash
node scripts/apply-encontro.mjs                 # aplica em todas as páginas registradas
node scripts/apply-encontro.mjs --check         # não escreve; apenas relata
node scripts/apply-encontro.mjs <path> [<path>] # aplica apenas nos caminhos indicados
```

O script é idempotente: o conteúdo injetado fica entre os marcadores
`<!-- encontro:meta:start -->` / `<!-- encontro:pdf:start -->` e é substituído a cada
execução. Editar o HTML injetado à mão é inútil — a próxima execução sobrescreve. Corrija em
`config/encontros.json` e rode o script.

O componente visual vive em dois arquivos compartilhados, não em cada página:

- `css/encontro.css` — classes `.pdf-export-btn` e `.encontro-meta`, e a folha de impressão
  A4. O injetor acrescenta o `<link>` a **toda** página de aula: 27 delas não importam
  `css/inteli-styles.css`, e nelas o botão ficava sem estilo e o PDF saía sem paginação.
- `js/encontro-pdf.js` — monta o nome do arquivo e aciona a impressão.

## Folha de impressão

O PDF sai em **A4 retrato**, margens 16/14/18 mm. As páginas do acervo são feitas para tela
— deck em 16:9, altura presa ao viewport —, e a folha de impressão as remonta como
documento:

- os slides passam a fluir em sequência, separados por filete, de modo que mais de um bloco
  ocupa a mesma folha e o papel não fica com metade em branco;
- caixas, tabelas, grades e diagramas nunca são partidos entre páginas, e cabeçalho de bloco
  não fica órfão no pé da folha;
- controles de navegação, sumário lateral, botões do cabeçalho e o próprio botão de
  exportação não são impressos;
- sombras e desfoques são removidos; as cores de fundo são preservadas
  (`print-color-adjust: exact`);
- a ficha do encontro fecha o documento em folha própria.

### Três famílias de página

| Família | Detecção | Onde a ficha entra |
|---|---|---|
| Deck estático | `.slide-container` no HTML | Novo slide ao final do deck |
| Deck gerado em JS | `renderLessonSlides` / `class="lesson-deck"` | No próprio gerador (`pages/module-11-eng-software/lesson-content.js`) |
| Página de texto | demais casos | Bloco logo após o cabeçalho |

A ficha entra ao **final** dos decks, e não após a capa, porque a maioria deles indexa
animações por posição de slide (`animMap`): inserir no meio desalinharia todas as animações
seguintes.

## Ao criar uma aula nova

1. Crie os arquivos da aula normalmente (slides, material, plano).
2. Registre a aula em `config/module-<módulo>.json`, com `date` e `professor`.
3. Acrescente o encontro e as páginas a `config/encontros.json`.
4. Rode `node scripts/apply-encontro.mjs`.
5. Rode `npm test` — `encontro-compliance` reprova qualquer página de aula sem o padrão.
6. Sincronize `/index.json` conforme a Key Rule 7 do `CLAUDE.md`.

## Redação dos três itens

Segue a skill [`escrita-academica`](../escrita-academica/SKILL.md).

- **Objetivo**: uma frase, na forma "Ao final do encontro, o estudante deve ser capaz de
  …", com verbo observável e, sempre que possível, vínculo com o projeto do parceiro.
- **Estratégia**: como se chega ao objetivo — formato do encontro, alternância entre
  exposição e aplicação, e o que é produzido durante a aula.
- **Estrutura**: os blocos do encontro na ordem em que ocorrem, com duração quando houver.
  Deve espelhar a agenda real do material, não uma agenda idealizada.

Encontros cuja aula ainda não foi preparada recebem estrutura provisória, marcada com
`"agenda_provisoria": true` no config. A marca existe para ser removida quando a aula for
escrita — é a lista de trabalho pendente, não um estado aceitável em regime permanente.
