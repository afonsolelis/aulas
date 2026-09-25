# Kit do treinamento: IA na Prática e Prototipagem

Material de apoio do treinamento AI for Business para a Copel, conduzido pelo professor
Afonso Brandão (Inteli Educação Executiva). Todos os dados do kit são fictícios e foram
preparados para exercício em sala.

## Ordem de uso

| Bloco | Arquivo | Para quê |
|---|---|---|
| Todos | `documento-do-grupo.docx` | Onde o grupo registra canvas, saídas, contagem, casos e iterações |
| Abertura | `problemas-exemplo.md` | Escolher o problema do grupo, se ele ainda não tiver um |
| 1. Anatomia | `canvas-anatomia.md` | Mapear as sete peças do assistente que resolveria o problema |
| 2. Prompt | `benchmark/` + `prompts/p0-prompt-ingenuo.md` | Linha de base: o prompt sem estrutura |
| 2. Prompt | `prompts/p1-prompt-estruturado.md` | Mesmo pedido com contexto, papel, restrições e formato |
| 2. Prompt | `prompts/p2-traducao-para-o-grupo.md` | Levar o benchmark para o problema do grupo |
| 3. MVP Zero | `mvp-zero/roteiro-mvp-zero.md` | Passo a passo das três versões |
| 3. MVP Zero | `mvp-zero/instrucao-modelo.md` | Molde da instrução do assistente |
| 3. MVP Zero | `mvp-zero/fluxo-modelo.md` | Molde da variante de fluxo, com um prompt por etapa |
| 3. MVP Zero | `mvp-zero/casos-de-teste.md` | Três casos para testar cada versão |
| 3. MVP Zero | `mvp-zero/registro-de-iteracoes.md` | Registro do que mudou e do que melhorou |
| 3. MVP Zero | `mvp-zero/conhecimento-ficticio/` | Documentos de conhecimento fictícios para os problemas-exemplo 1, 2 e 3 |

## Como abrir os arquivos
Os arquivos .md são texto simples e abrem no Bloco de Notas, no navegador ou em qualquer
editor, e os prompts devem ser copiados deles tal como estão, apenas o trecho entre as linhas
de três crases. O `documento-do-grupo.docx` abre no Word ou no Google Docs e reúne, em um só
lugar, o canvas, as saídas dos prompts, a contagem de pontos, os casos de teste e o registro de
iterações; cada grupo mantém uma única cópia dele, e é a esse arquivo que os roteiros se
referem como documento do grupo. A planilha de indicadores está em duas versões com o mesmo
conteúdo: o .csv, que abre direto no Excel em português, e o .xlsx, para ferramentas que não
aceitam .csv como anexo. Do mesmo modo, o relatório do benchmark está em .md e em .docx.

## Regra de dados
Durante o treinamento, nenhum dado de cliente, dado pessoal ou informação interna não
publicada entra na ferramenta de IA. Os casos de teste do MVP usam dados fictícios escritos
pelo próprio grupo. Quando o documento de conhecimento do grupo for interno, o grupo escreve
uma versão fictícia de até dez linhas e anexa essa versão. Depois do treinamento, o uso com
dados reais segue a política da empresa.
