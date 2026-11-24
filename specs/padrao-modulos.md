# Padrão de aula nos módulos da graduação

Validado por `tests/padrao-modulos.spec.ts`, que roda no pre-commit: módulo fora do padrão impede o commit.

## Escopo

Vale para todo módulo da graduação, ou seja, toda home `pages/home-module-<N>-<curso>.html` e a pasta `pages/module-<N>-<curso>/` correspondente. Educação Executiva, palestras, Inteli Camp e disciplinas avulsas (`data-collection`) ficam fora deste spec.

## Regras

1. O módulo tem `config/module-<N>-<curso>.json` com a lista de aulas (`specs/07-config-json.md`).
2. Cada aula do acervo tem três artefatos, sempre nestas pastas e com estes nomes:
   - `slides/slide-lesson-<A>.html`, o deck projetado em sala;
   - `materials/lesson-<A>-material.html`, o material de leitura;
   - `planos/lesson-<A>-plano.html`, o plano de ensino do encontro.
3. Nenhuma página de aula fica solta na raiz da pasta do módulo. Quando um arquivo muda de lugar, o endereço antigo recebe uma página mínima de redirecionamento com `<meta name="redirect-legado" content="<caminho novo>">`, para que links já enviados aos alunos continuem funcionando. Páginas com essa marca ficam fora do `index.json`, dos demais specs e dos scripts de aplicação (`apply-semana`, `aplicar-design-system`).
4. O card da aula na home leva aos três artefatos, com rótulos fixos: `🎞️ Slides`, `📝 Material` e `🗂️ Plano de Ensino` (`🗂️ Lesson Plan` nas homes com `lang="en"`). Outros botões (Lab, Package, Miro) podem acompanhar esses três.
5. Card com material ou plano local mas sem deck reprova. Card que só aponta para fora do acervo, como as aulas de outro docente conduzidas no Miro, não conta como aula do acervo e não pode apontar para arquivo local.
6. Todo deck em `slides/` aparece em um card da home.
7. Os três artefatos se ligam: o deck leva ao material (footer `📖 Material`), o material leva ao deck e ao plano (navegação flutuante ou cabeçalho) e o plano leva ao deck e ao material. No Módulo 11, cujas páginas são geradas, vale o link montado por `lesson-content.js`.
8. Os três estão no `index.json`, com `type` `slide`, `material` e `plano` e `module` igual à pasta, e no `config/encontros.json`, ligados ao encontro `module-<N>-<curso>#<A>`. Depois de registrar, rode `node scripts/apply-encontro.mjs <arquivos>` para injetar a ficha do encontro e o botão de PDF.

## Aula nova

1. Crie os três arquivos nas pastas acima, a partir dos de uma aula vizinha.
2. Acrescente o card na home com os três botões e a data (`specs/lesson-cards.md`).
3. Registre a aula no config do módulo, no `config/calendar.json` (se o módulo estiver ativo), no `index.json` e no `config/encontros.json`.
4. Rode `node scripts/apply-encontro.mjs`, `node scripts/apply-semana.mjs` e `node scripts/aplicar-design-system.mjs <arquivos>`, e depois `npm test`.
