---
name: redigir-parecer
description: Redige casos/<id>/parecer.md para o Jurídico a partir dos itens confirmados e corrigidos de revisao.md, com cláusula, regra, risco e redação substitutiva. Use na última etapa do caso.
---

# Redigir o parecer

Estrutura do arquivo:

```markdown
# Parecer · Caso <id> · <objeto>
Revisão obrigatória do Jurídico e da Diretoria (caso crítico: <motivo>)

## Síntese
<três a cinco frases: quantos pontos, quais os de maior risco, o que está pendente>

## Pontos para negociação
### 1. <título descritivo>
- Origem: revisao.md#<item> · cl. <n>, p. <n> · politica-contratos.md#POL-<x.y>
- Trecho: "<literal>"
- Risco: <uma frase sobre a consequência para a contratante>
- Redação sugerida: clausulas-padrao.md#CP-<nn>, ou "sem cláusula-padrão; redação a cargo do Jurídico"

## Decisões pendentes
<itens ambíguos e pendências de estado.md, com o que falta para decidir>

## Itens conferidos sem ressalva
<lista curta dos itens atendidos, para que o leitor saiba o que foi verificado>
```

Ordene os pontos pelo risco para a contratante: primeiro o que afeta paciente e dado pessoal, depois o que afeta a continuidade do atendimento, depois o que afeta o valor pago.
