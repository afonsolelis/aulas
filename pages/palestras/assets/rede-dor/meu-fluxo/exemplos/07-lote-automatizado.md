# Exemplo 07 · Triagem em lote de pendências de autorização de convênio

**Área:** Recebíveis e Autorização · **Saída:** fila priorizada e minutas de resposta · **Topologia:** orquestrador em lote

## Problema

As negativas e pedidos de complemento dos convênios chegam por e-mail e ficam na caixa até alguém triá-los. Um fluxo do Power Automate, já usado na área, pode salvar cada mensagem como arquivo numa pasta; a partir daí, o orquestrador processa o lote inteiro, um caso por mensagem.

## Entrada e saída

- Entrada: `entrada/<data>/*.md`, uma mensagem por arquivo, salva pelo fluxo automatizado, e `conceitos/tipos-pendencia.md`, com o prazo e o documento exigido por tipo.
- Saída: `saida/<data>/fila.md`, ordenada pelo prazo, e `saida/<data>/minutas/<id>.md`, uma minuta de resposta por pendência.

## Etapas e papéis

| Etapa | Papel | Saída | Critério de aceite |
|-------|-------|-------|--------------------|
| 0 | Orquestrador de lote | `lote.md` | Um caso aberto por arquivo de `entrada/`; total de casos igual ao de arquivos |
| 1 | Leitor de mensagem | `casos/<id>/pendencia.md` | Convênio, guia, paciente anonimizado, tipo de pendência e prazo, cada um com o trecho da mensagem |
| 2 | Classificador | `casos/<id>/tipo.md` | Tipo de `tipos-pendencia.md` citado; mensagem sem tipo correspondente vai para "triagem humana" |
| 3 | Redator de minuta | `minutas/<id>.md` | A minuta lista os documentos exigidos pelo tipo e não afirma nada ausente da mensagem |
| 4 | Consolidador de lote | `fila.md` | Todos os casos na fila, ordenados pelo prazo, com os de triagem humana no topo |

## Skills

- `abrir-lote`: lista os arquivos de `entrada/<data>/` e cria uma pasta de caso para cada um.
- `ler-mensagem`, `classificar-pendencia`, `redigir-minuta` e `montar-fila`.

## Onde o consenso entra

Não é necessário na rotina. O ponto de controle é a triagem humana dos casos sem tipo correspondente e a leitura da minuta antes do envio, que permanece com a pessoa.

## Cuidado de desenho

O orquestrador de lote chama os papéis caso a caso e registra, em `lote.md`, o estado de cada um. Se a execução cair no meio do lote, a retomada começa pelo primeiro caso sem marca.

## Primeira mensagem ao orquestrador

`Processe o lote entrada/2026-09-24 até a fila de pendências.`
