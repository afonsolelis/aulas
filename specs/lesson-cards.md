# Spec: Cards de Aula nas Homes

## Objetivo

Padronizar a forma como as aulas aparecem nas páginas de módulo.

## Regras obrigatórias

1. O card da aula não pode mais ser um link clicável inteiro.
2. O card deve exibir número da aula.
3. O card deve exibir título da aula.
4. O card deve exibir data ou marcador equivalente.
5. O card deve conter botão `🎞️ Slides`.
6. O card deve conter botão `📝 Material`.

## Regras de destino

1. O botão `Slides` deve apontar para um arquivo existente.
2. O botão `Material` deve apontar para um arquivo existente.
3. Se o conteúdo ainda não existir, deve ser criado placeholder em vez de deixar link quebrado.

## Avaliação ponderada em sala

1. Toda aula com avaliação ponderada em sala declara `"ponderada": true` na entrada da aula em `config/calendar.json`, que é a fonte de verdade.
2. O card dessa aula na home do módulo traz, logo após o selo do professor, a flag `<span class="ponderada-badge">⚖️ Ponderada em sala</span>`, para que a turma saiba com antecedência que o encontro tem avaliação.
3. A flag aparece somente nas aulas marcadas no calendário. Ao mover a ponderada de uma aula para outra, a marcação e a flag mudam juntas.
4. `tests/calendar-consistency.spec.ts` confere a correspondência nos dois sentidos.

## Observações

1. Módulos em construção podem não ter cards de aula.
2. Quando os cards existirem, todos devem seguir o padrão de dois botões.

## Destaque da próxima aula

Toda home com cards datados (`📅 dd/mm/aaaa` ou `📅 Aula NN · dd/mm/aaaa`) carrega `js/proxima-aula.js` logo depois de `js/semana-ano.js`. O script lê a data de cada `.lesson-card`, marca com a classe `proxima-aula` o card da primeira data igual ou posterior ao dia corrente e insere o rótulo "Próxima aula · em N dias" ("Next class" nas páginas com `lang="en"`). A aula do dia continua destacada até a meia-noite; no dia seguinte o destaque passa à aula seguinte, sem edição manual. Módulo sem aula futura fica sem destaque. O estilo, em tinta verde com filete à esquerda, está em `css/inteli-ds.css`, na seção "Próxima aula". Home nova com cards datados deve incluir o script.
