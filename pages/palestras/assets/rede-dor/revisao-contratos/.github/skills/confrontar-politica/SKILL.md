---
name: confrontar-politica
description: Confronta as cláusulas extraídas de um caso com conceitos/politica-contratos.md e grava um arquivo de achados, no sentido contrato → política ou política → contrato. Use na etapa de análise, executada pelos dois analistas.
---

# Confrontar com a política

O procedimento é o mesmo para os dois analistas; muda apenas o sentido da leitura. Ler em sentidos opostos faz os dois analistas errarem por motivos diferentes, e com isso a divergência entre eles passa a indicar onde está o problema.

## Sentido contrato → política (Analista pelo contrato)

1. Leia a cl. 1 (definições) e anote cada termo definido.
2. Para cada cláusula de `clausulas.md`, na ordem, identifique a regra da política que ela toca. Se nenhuma regra se aplica, não registre achado.
3. Ao ler uma cláusula que usa termo definido, aplique a definição. "4 Horas Úteis" significa o que a cl. 1.1 diz que significa.
4. Verifique se uma cláusula limita, anula ou excetua outra. Um teto em uma cláusula pode ser derrubado por uma exceção na cláusula seguinte, e uma penalidade pode ser esvaziada por um limite em outra cláusula.

## Sentido política → contrato (Analista pela política)

1. Para cada regra, de POL-1.1 a POL-13.1, procure no contrato todas as cláusulas que tratam do assunto, pelo conteúdo e não apenas pelo título.
2. Se a regra é obrigatória e nenhuma cláusula a atende, classifique como `ausente`.
3. Se a regra admite duas leituras, consulte `conceitos/decisoes.md` e cite a decisão aplicada.

## Formato de cada achado

```markdown
## A-07 · Prazo de atendimento em horas úteis
- Cláusula: cl. 5.1, p. 3, "até 4 (quatro) Horas Úteis" com cl. 1.1, p. 2
- Regra: politica-contratos.md#POL-5.1
- Decisão aplicada: decisoes.md#D-2026-09
- Classificação: divergente
- Motivo: a política exige 4 horas corridas, 24 horas por dia; a definição de Hora Útil exclui noites, fins de semana e feriados de Curitiba.
```

Numere os achados em sequência (A-01, A-02, ...) e registre também os atendimentos. Ao final, grave `## Resumo` com o número de achados por classificação.
