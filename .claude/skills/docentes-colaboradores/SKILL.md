---
name: docentes-colaboradores
description: Registro de quais docentes além do professor titular têm autorização para alterar conteúdo neste acervo, sobre quais aulas e sob que restrições. Consulte antes de editar, revisar ou aceitar alteração em aulas de outro docente, e antes de responder quem pode mexer em cada aula. Cobre o Prof. Hermano no Módulo 11 de Engenharia de Software.
type: reference
---

# Docentes Colaboradores — Autorizações de Edição

O acervo é mantido pelo professor titular, **Afonso Brandão**. Alguns docentes possuem
acesso ao repositório e autorização para manter as próprias aulas. Este documento registra
o escopo de cada autorização.

## Autorizações vigentes

### Prof. Hermano — Módulo 11 (Engenharia de Software)

O Prof. Hermano possui acesso ao repositório e **está autorizado a atualizar as aulas que
ministra** no Módulo 11 — Arquitetura e Governança de Dados, disciplina Computação 1.

| Aula | Data | Título |
|------|------|--------|
| 2 | 10/08/2026 | Modelagem de Data Warehouse I |
| 3 | 12/08/2026 | Modelagem de Data Warehouse II |
| 4 | 18/08/2026 | Modelagem de Data Warehouse III |

A relação autoritativa é `config/module-11-eng-software.json`: são as aulas cujo campo
`professor` é `"Hermano"`. Se o config mudar, esta tabela deve ser atualizada.

#### Arquivos sob sua autoria

Para cada aula `N` da tabela acima:

- `pages/module-11-eng-software/slides/slide-lesson-N.html`
- `pages/module-11-eng-software/materials/lesson-N-material.html`
- `pages/module-11-eng-software/planos/lesson-N-plano.html`

#### Alterações permitidas

- Conteúdo integral de slides, material de leitura e plano de ensino das aulas 2, 3 e 4.
- Campos `title` e `description` dessas aulas em `config/module-11-eng-software.json`.
- Entradas correspondentes em `/index.json` (`title` e `summary`), obrigatórias sempre que
  o conteúdo ou o título mudar — ver Key Rule 7 do `CLAUDE.md`.
- Card da aula na home `pages/home-module-11-eng-software.html`, quando o título mudar.
- **Mesclar (merge) o próprio pull request** das aulas 2, 3 e 4 no GitHub, desde que o PR
  contenha apenas alterações dentro deste escopo permitido e os testes automatizados
  (`npm test`, via CI ou hook de pre-commit) tenham passado. Autorização declarada por
  Hermano em sessão com o agente em 10/08/2026 e **ratificada pelo professor titular
  Afonso Brandão em 02/09/2026**.

#### Alterações não permitidas

- **Datas de aula.** `date` no config, `config/calendar.json` e o `📅` do card da home são
  definidos pela coordenação e mantidos pelo professor titular.
- **Numeração, criação ou remoção de aulas**, e qualquer renumeração de arquivos.
- **Aulas de outros docentes** — Afonso Brandão e Reginaldo no Módulo 11 — e qualquer
  conteúdo de outro módulo.
- **Arquivos globais de estrutura:** `css/inteli-styles.css`, `tests/`, `scripts/`,
  `config/calendar.json`, `index.html`.
- **`git push` direto na `main`** (sem PR) e **merge de PR que saia do escopo permitido**
  acima (ex.: mistura alteração em aula de outro docente ou em arquivo global). Nesses
  casos, as alterações entram por branch e pull request revisado pelo professor titular.

## Obrigações de qualquer docente colaborador

1. O texto segue a skill [`escrita-academica`](../escrita-academica/SKILL.md): registro
   acadêmico, formal e sucinto, sem linguagem de marketing.
2. Slides preenchem o viewport, sem overflow e sem espaço em branco excessivo (Key Rule 3).
   Verificação: `npm run validate:slides -- <path>`.
3. `npm test` passa antes do commit — o hook de pre-commit o executa e bloqueia falhas.
4. `/index.json` é mantido em sincronia com o conteúdo alterado.
5. Todo link entre páginas é relativo; toda imagem tem `alt` descritivo.

## Procedimento para o agente

Ao receber pedido de alteração em aula de docente colaborador:

1. Identifique a aula e o docente em `config/module-<módulo>.json`.
2. Confirme nesta skill que o docente está autorizado sobre aquela aula.
3. Se a alteração recair sobre item da lista de não permitidas, execute o que for
   permitido, informe explicitamente o que ficou de fora e encaminhe ao professor titular.
4. Alteração em aula de docente **sem** autorização registrada aqui exige confirmação
   expressa do professor titular antes de qualquer edição.

## Manutenção deste registro

Uma autorização só existe se estiver escrita neste documento, com docente, módulo e aulas
nominadas. Concessão, alteração de escopo e revogação são decisões do professor titular e
devem ser refletidas aqui no mesmo commit em que passarem a valer.
