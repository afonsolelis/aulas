# Exemplo 06 · Conferência de notas fiscais contra o pedido de compra

**Área:** Suprimentos e Recebimento · **Saída:** planilha de divergências e fila de pendências · **Topologia:** sequencial com regra antes do julgamento

## Problema

A nota fiscal chega em PDF e precisa ser conferida contra o pedido de compra antes da entrada no sistema. A conferência manual atrasa a entrada, e a divergência pequena de quantidade ou preço passa despercebida.

## Entrada e saída

- Entrada: `casos/<lote>/notas/*.pdf`, `casos/<lote>/pedidos.csv` e `conceitos/tolerancias.md` (diferença aceitável de preço e quantidade por categoria de item).
- Saída: `casos/<lote>/conferencia.xlsx`, com uma linha por item de nota e a decisão, e `casos/<lote>/pendencias.md`, com a fila para o comprador.

## Etapas e papéis

| Etapa | Papel | Saída | Critério de aceite |
|-------|-------|-------|--------------------|
| 1 | Extrator de notas | `notas.md` | Para cada PDF: número, emitente, itens, quantidades e valores; soma dos itens igual ao total da nota |
| 2 | Conferente | `conferencia.md` | Todo item de nota emparelhado a um item de pedido ou marcado "sem pedido" |
| 3 | Classificador de divergência | `divergencias.md` | Toda diferença classificada por `tolerancias.md`, com a regra citada |
| 4 | Gerador | `.xlsx` e `pendencias.md` | Linhas da planilha iguais aos itens de nota; pendências só com itens fora da tolerância |

## Skills

- `extrair-nota-pdf`: extrai o texto do PDF por script e confere a soma dos itens com o total da nota antes de gravar.
- `emparelhar-pedido`: casa item de nota com item de pedido pelo código e, na falta dele, pela descrição.
- `gerar-planilha-conferencia`.

## Onde o consenso entra

No emparelhamento por descrição, quando a nota não traz o código do item. Dois conferentes independentes emparelham os itens sem código, e o item emparelhado de forma diferente vai para o comprador. O restante é regra escrita em `tolerancias.md` e fica na tabela do orquestrador.

## Primeira mensagem ao orquestrador

`Conduza o lote casos/lote-2026-09-24 até a planilha de conferência.`
