---
name: consolidar-consenso
description: Emparelha os achados dos dois analistas de um caso pela combinação de cláusula e regra e grava casos/<id>/consenso.md com consenso, divergência de classificação e achados únicos. Use depois que achados-a.md e achados-b.md existirem.
---

# Consolidar o consenso entre os analistas

1. Monte a chave de cada achado como `cláusula + regra`, por exemplo `cl. 7.3 + POL-4.3`. Quando um achado cita duas cláusulas, use a principal, que é a primeira citada.
2. Emparelhe os achados de A e de B que têm a mesma chave.
3. Distribua todos os achados em exatamente uma das categorias abaixo.

| Categoria | Condição | O que o revisor faz |
|-----------|----------|---------------------|
| **C · Consenso** | Mesma chave e mesma classificação em A e em B | Confere a citação; em caso simples, por amostragem |
| **D · Divergência de classificação** | Mesma chave e classificações diferentes | Decide pela evidência literal |
| **U · Achado único** | A chave aparece só em A ou só em B | Confere se o outro analista deixou passar ou se o achado não se sustenta |

4. Grave `consenso.md` com o cabeçalho de passagem, um resumo com a contagem por categoria e, em seguida, uma seção por item:

   ```markdown
   ## D-01 · cl. 12.2 + POL-7.1
   - A (A-11): atendida · "serviços técnicos especializados" tratados como logística
   - B (A-09): divergente · calibração exige anuência, decisoes.md#D-2026-04
   - Situação: aberta
   ```

5. Se o arquivo já existir por causa de uma rodada de reconciliação, leia a seção `## Reconciliação` de cada analista, atualize a situação de cada item (`resolvida em consenso` ou `aberta`) e mantenha o histórico da primeira consolidação.

Uma concordância só conta como consenso quando os dois analistas citam a mesma evidência. Dois achados com a mesma classificação e trechos diferentes entram como divergência, porque cada um pode estar certo por um motivo que o outro não viu.
