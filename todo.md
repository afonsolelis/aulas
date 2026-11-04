# TODO — Aula 3 do Módulo 8 de ES (13/11/2026)

Situação em 04/11/2026: a Aula 3 do acervo foi trocada de tema. Nada foi commitado ainda.

## Contexto (Adalove, turma GRAD ES08 2026-2B-T17)

- A Simulação de desempenho, tolerância a falhas e acesso simultâneo ficou com o prof. Reginaldo, em 03/11.
- O encontro de 13/11, às 14h, agora é "Os componentes atendem a métodos arquiteturais de controle de qualidade?", com o prof. Hermano Peixoto como instrutor.
- Ementa: 1. Táticas de Arquitetura 2/3. 2. Avaliação de mecanismos baseada em evidências ou medições: estático/estrutural, dinâmico/comportamental, testes não funcionais.
- Autoestudos: itens 4.4, 9.4 e 11.4 de Bass, Clements e Kazman (padrões de disponibilidade, desempenho e segurança, 35 min cada) e a Lesson 17 de Mark Richards, Architecture Tradeoffs (15 min).
- Não há ponderada neste encontro. A flag de ponderada foi removida.

## O que já foi feito (não commitado)

- [x] `pages/module-8-eng-software/slides/slide-lesson-3.html`: deck novo com 23 slides mais a ficha, daily no slide 2, padrões, tradeoffs, três tipos de evidência, exemplo resolvido no remo-api e prática com a matriz de evidências.
- [x] `pages/module-8-eng-software/materials/lesson-3-material.html`: material novo com 19 seções.
- [x] `pages/module-8-eng-software/planos/lesson-3-plano.html`: plano novo, com cronograma das 14h às 16h por slide, escrito para o prof. Hermano conduzir.
- [x] `config/encontros.json`: ficha do encontro #3 com docente "Hermano". O `node scripts/apply-encontro.mjs` já foi rodado só nos 3 arquivos.
- [x] `config/calendar.json`: título novo, professor "Hermano Peixoto", sem `ponderada`.
- [x] `config/module-8-eng-software.json`: título, professor e descrição da aula 3.
- [x] `pages/home-module-8-eng-software.html`: card da aula 3 com título e descrição novos, sem o badge de ponderada.
- [x] `index.json`: títulos e summaries dos 3 arquivos da aula 3.
- [x] `npm test`: 1306 testes passaram.

## Pendências

- [ ] Corrigir o OVERFLOW da tela 24, a ficha "Sobre este encontro", em 1280×720 (folga de 29px). Em 1920×1080 está ok. Comparar com a ficha da Aula 2 (`npm run validate:slides -- pages/module-8-eng-software/slides/slide-lesson-2.html`). Se lá também estourar, é um problema anterior do `css/encontro.css`; se não, encurtar o `objetivo` ou a `estrategia` de `module-8-eng-software#3` em `config/encontros.json` e rodar de novo `node scripts/apply-encontro.mjs` nos 3 arquivos da aula 3.
- [ ] Revisar o texto dos três arquivos (escrita-afonso, estilo-academico, humanizacao).
- [ ] Inspecionar o deck visualmente; as telas 21 a 23 ocupam entre 53% e 56% em 1280×720.
- [ ] Decidir se o prof. Hermano ganha autorização de edição sobre esta aula na skill `.claude/skills/docentes-colaboradores/SKILL.md`. Hoje a skill só cobre o Módulo 11, e nada foi alterado nela.
- [ ] Atualizar a memória `aula-1-modulo-8-es-reestruturacao.md`: a Aula 3 deixou de ser a Simulação e passou a ser do Hermano.
- [ ] Commitar só os arquivos da tarefa (nunca `git add -A`, por causa do churn do apply-encontro) e fazer push na `main`.

```bash
git add config/encontros.json config/calendar.json config/module-8-eng-software.json index.json \
  pages/home-module-8-eng-software.html \
  pages/module-8-eng-software/slides/slide-lesson-3.html \
  pages/module-8-eng-software/materials/lesson-3-material.html \
  pages/module-8-eng-software/planos/lesson-3-plano.html
```

- [ ] Apagar este `todo.md` quando as pendências forem concluídas.
