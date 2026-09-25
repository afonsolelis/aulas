# Kit do treinamento: IA na Prática e Prototipagem

Material de apoio do treinamento AI for Business para a Copel, conduzido pelo professor
Afonso Brandão (Inteli Educação Executiva). Todos os dados do kit são fictícios e foram
preparados para exercício em sala.

## Ordem de uso

| Bloco | Arquivo | Para quê |
|---|---|---|
| Abertura | `problemas-exemplo.md` | Escolher o problema do grupo, se ele ainda não tiver um |
| 1. Anatomia | `canvas-anatomia.md` | Mapear as sete peças do assistente que resolveria o problema |
| 2. Prompt | `benchmark/` + `prompts/p0-prompt-ingenuo.md` | Linha de base: o prompt sem estrutura |
| 2. Prompt | `prompts/p1-prompt-estruturado.md` | Mesmo pedido com contexto, papel, restrições e formato |
| 2. Prompt | `prompts/p2-traducao-para-o-grupo.md` | Levar o benchmark para o problema do grupo |
| 3. MVP Zero | `mvp-zero/roteiro-mvp-zero.md` | Passo a passo das três iterações |
| 3. MVP Zero | `mvp-zero/instrucao-modelo.md` | Molde da instrução do assistente |
| 3. MVP Zero | `mvp-zero/casos-de-teste.md` | Três casos para testar cada versão |
| 3. MVP Zero | `mvp-zero/registro-de-iteracoes.md` | Registro do que mudou e do que melhorou |

## Regra de dados
Durante o treinamento, nenhum dado de cliente, dado pessoal ou informação interna não
publicada entra na ferramenta de IA. Os casos de teste do MVP usam dados fictícios escritos
pelo próprio grupo. Depois do treinamento, o uso com dados reais segue a política da empresa.
