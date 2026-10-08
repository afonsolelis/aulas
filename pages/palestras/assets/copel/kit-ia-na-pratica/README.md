# Kit do treinamento: IA na Prática e Prototipagem

Material de apoio do treinamento AI for Business para a Copel, conduzido pelo professor
Afonso Brandão (Inteli Educação Executiva). Todos os documentos do kit são fictícios e foram
preparados para exercício em sala. No encontro, cada participante atua como analista do
escritório de projetos da Distribuidora Ômega, empresa fictícia, analisa uma minuta de proposta
de projeto, constrói um workflow de análise de propostas e o usa na reunião simulada do conselho.

## Ordem de uso

| Momento | Arquivo | Para quê |
|---|---|---|
| Todos | `documento-do-participante.docx` | Onde o participante registra canvas, saídas, contagem, casos, iterações e argumentos |
| 1. Anatomia | `documento-do-participante.docx`, seção 1 | Mapear as sete peças do workflow de análise de propostas |
| 2. Prompt | `propostas/proposta-a-ia-perdas.md` + `benchmark/` | A minuta a analisar e o benchmark que ela traz como anexo |
| 2. Prompt | `prompts/p0-prompt-ingenuo.md` | Linha de base: o pedido sem estrutura |
| 2. Prompt | `prompts/p1-prompt-estruturado.md` | Mesmo pedido com contexto, papel, restrições e formato |
| 3. Workflow | `mvp-zero/roteiro-mvp-zero.md` | Passo a passo das duas iterações |
| 3. Workflow | `mvp-zero/fluxo-modelo.md` | As instruções das três skills (extração, verificação, parecer) |
| 3. Workflow | `conhecimento/politica-de-avaliacao-de-projetos.md` | Documento de conhecimento do notebook |
| 3. Workflow | `propostas/proposta-c-religacao.md` | Proposta incompleta, usada como caso de borda |
| 3. Workflow | `mvp-zero/casos-de-teste.md` e `mvp-zero/registro-de-iteracoes.md` | Casos e registro das versões |
| 4. Conselho | `conselho/proposta-b-medicao-inteligente.md` | A proposta que vai à reunião simulada |
| 4. Conselho | `conselho/cartoes-de-papel.md` | Os papéis da reunião |
| 4. Conselho | `conselho/modelo-de-ata.md` | O registro da deliberação |

## Como abrir os arquivos
Os arquivos .md são texto simples e abrem no Bloco de Notas, no navegador ou em qualquer
editor, e os prompts e as instruções devem ser copiados deles tal como estão, apenas o trecho
entre as linhas de três crases. As propostas, o relatório do benchmark e os cartões de papel têm
também versão .docx, e a planilha de indicadores tem versão .xlsx, para ferramentas que não
aceitam .md ou .csv como anexo. O `documento-do-participante.docx` abre no Word ou no Google Docs
e reúne, em um só lugar, o canvas, as saídas dos prompts, a contagem de pontos, os casos de
teste, o registro de iterações e a preparação para a reunião do conselho. O `canvas-anatomia.md`
é a fonte da seção 1 desse documento e não precisa ser aberto em sala.

## Regra de dados
Durante o treinamento, nenhum dado de cliente, dado pessoal, proposta real ou informação interna
não publicada entra na ferramenta de IA. As propostas, a política e o benchmark do kit são
fictícios. Depois do treinamento, o uso com propostas reais segue a política de segurança da
informação da empresa.
