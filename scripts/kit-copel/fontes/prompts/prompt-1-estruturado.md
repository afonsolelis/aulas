# Prompt 1: a versão estruturada em quatro partes

Em uma conversa nova, anexe os mesmos três arquivos do Prompt 0 (a minuta, o relatório do
benchmark e a planilha de indicadores), copie o texto do quadro abaixo e cole na conversa. Se a
ferramenta não aceitar anexos, copie o conteúdo dos arquivos e cole abaixo do prompt, depois de
uma linha com o texto ## DADOS. Desligue a busca na web e a memória
entre conversas, ou use conversa temporária, se a ferramenta oferecer essas opções. As quatro
partes (contexto, papel, restrições e formato de saída) estão marcadas para que seja possível
alterar uma de cada vez e observar o efeito.

```
## CONTEXTO
Sou analista do escritório de projetos da Distribuidora Ômega. Recebi da Diretoria Comercial a
minuta de proposta PRJ-2026-014 (arquivo proposta-a-ia-perdas.docx), que tem como anexo um
relatório de benchmark (relatorio-benchmark-ia-distribuicao.docx) e a planilha que o acompanha
(indicadores-distribuidoras.xlsx). Meu parecer técnico vai acompanhar a proposta na pauta do
Conselho de Administração. A decisão de aprovar ou não é do conselho.

## PAPEL
Atue como analista sênior de projetos de investimento do setor elétrico, com domínio de
avaliação econômica (CAPEX, OPEX, fluxo líquido, payback) e de indicadores regulatórios de
perdas, e com cuidado com a qualidade da fonte.

## RESTRIÇÕES
1. Use apenas os arquivos anexados. Não traga dado externo nem conhecimento sobre empresas reais.
2. Refaça cada cálculo declarado na minuta (benefícios, retorno) e aponte toda divergência,
   indicando a seção em que ela aparece.
3. Verifique se algum benefício conta o mesmo efeito mais de uma vez.
4. Confira a coerência entre cronograma, premissas, escopo e capacidade operacional declarados
   na própria minuta.
5. Para cada número que sustenta a justificativa, informe fonte, período, linha de base e base
   de cálculo. Número de outra empresa sem esses elementos é "reportado, não verificável".
6. Verifique se a matriz de riscos cobre risco regulatório, tratamento de dados pessoais e
   execução, e se o indicador de sucesso mede o resultado de negócio.
7. Quando um dado estiver ausente, escreva "não informado". Não estime.
8. Não recomende aprovar nem rejeitar a proposta.

## FORMATO DE SAÍDA
A. Tabela "Inconsistências": item | seção | por que importa para a decisão.
B. Tabela "Premissas e números": premissa ou número | fonte | verificável? (sim/não e por quê).
C. Lista de riscos ausentes da matriz, com o motivo de cada um.
D. Até cinco perguntas que a área proponente deve responder antes da reunião do conselho.
E. Um parágrafo de no máximo 80 palavras sobre a sustentação da justificativa da proposta.
```
