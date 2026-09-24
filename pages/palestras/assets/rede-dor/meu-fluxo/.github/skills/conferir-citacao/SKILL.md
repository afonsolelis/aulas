---
name: conferir-citacao
description: Confere cada item de casos/<id>/consenso.md contra o trecho literal em clausulas.md e a regra em conceitos/, e grava revisao.md com a decisão de cada item. Use na etapa de revisão.
---

# Conferir a citação de cada item

1. Para cada item, abra `clausulas.md` na cláusula citada e verifique se o trecho entre aspas existe, com a mesma redação, na página indicada.
2. Abra a regra citada e verifique se ela trata do assunto do trecho.
3. Se o item cita uma decisão de `decisoes.md`, verifique se o caso de origem é comparável.
4. Registre a decisão do item em uma linha:

   ```markdown
   - D-01 · corrigido para divergente · a cl. 12.2 nomeia calibração, que D-2026-04 exclui da POL-7.2
   - C-04 · confirmado
   - U-02 · devolvido a analista-contrato · trecho citado não está na p. 5
   - D-03 · ambígua · a POL-2.1 não diz se "garantias" inclui a garantia legal
   ```

5. Na divergência, decide a evidência literal. O lado que citou o trecho que resolve a questão prevalece, e o motivo é o trecho, nunca a quantidade de analistas.
6. Ao final, grave `## Resumo` com a contagem de confirmados, corrigidos, devolvidos e ambíguos, e `## Observações do revisor` com o que nenhum analista registrou.
