# Molde do MVP Zero de fluxo

Use este molde quando o problema do grupo for um processo recorrente, com gatilho definido, que
se divide em etapas fixas. Cada etapa tem o próprio prompt, e hoje uma pessoa executa as etapas
à mão, na ordem, colando a saída de uma como entrada da seguinte. Os três casos de teste e o
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
- Use apenas a entrada recebida e os documentos anexados.
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
