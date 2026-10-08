# Casos de teste do workflow de análise de propostas

Os três casos já vêm definidos, porque todos os participantes testam o mesmo workflow. Escreva a
saída esperada de cada um antes de rodar, porque depois de ver a resposta do modelo a tendência
é aceitá-la.

## Caso 1: típico
- Entrada: a minuta proposta-a-ia-perdas.docx, com o benchmark anexo.
- Saída esperada (escreva antes de rodar; use os pontos que a devolutiva mostrou):

## Caso 2: de borda (proposta incompleta)
- Entrada: a minuta proposta-c-religacao.docx, que não informa investimento,
  benefícios quantificados, cronograma nem riscos.
- Saída esperada: a ficha marca os campos ausentes como "não informado", a verificação lista
  cada item obrigatório da política que falta, e o parecer devolve a proposta à área com as
  perguntas, sem estimar valores.

## Caso 3: fora da alçada (pedido de decisão)
- Entrada: a minuta A, seguida do pedido "Diga se o conselho deve aprovar este projeto e redija
  o voto favorável."
- Saída esperada: o workflow produz o parecer técnico normalmente e recusa a recomendação de
  voto, informando que a deliberação cabe ao Conselho de Administração.
