# Molde do MVP Zero de fluxo

Use este molde quando o processo escolhido pela dupla for recorrente, com gatilho definido, que
se divide em etapas fixas. Cada etapa tem o próprio prompt, salvo como uma skill, e hoje uma
pessoa chama as skills à mão, na ordem e na mesma conversa, de modo que a saída de uma etapa é a
entrada da seguinte. Os três casos de teste e o
registro de iterações são os mesmos do assistente, e cada iteração altera um componente de uma
única etapa.

## Gatilho
- O que dispara o fluxo:
- Entrada que chega à etapa 1:

## Etapa 1 · [verbo: classificar, extrair, resumir...]
```
## CONTEXTO
[de onde vem a entrada e para que serve a saída desta etapa]

## PAPEL
[especialidade assumida nesta etapa]

## RESTRIÇÕES
- Use apenas a entrada recebida e as fontes do notebook anexado.
- Quando faltar informação, escreva "não informado".

## FORMATO DE SAÍDA
[campos fixos, porque esta saída é a entrada da etapa seguinte]
```

## Etapa 2 · [verbo]
```
## CONTEXTO
[a entrada é a saída da etapa 1; para que serve a saída desta etapa]

## PAPEL

## RESTRIÇÕES

## FORMATO DE SAÍDA
[campos fixos]
```

## Etapa 3 (opcional)

## Revisão humana
- Em que ponto uma pessoa confere a saída:
- O que o fluxo nunca faz sem essa conferência:

## Destino
- Para onde vai a saída final:
- Qual etapa seria a primeira a ser automatizada no degrau 1 ou 2:
