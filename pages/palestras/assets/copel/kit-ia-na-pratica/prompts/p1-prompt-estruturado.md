# Prompt 1: a versão estruturada em quatro partes

Em uma conversa nova, anexe os dois arquivos da pasta `benchmark/` e cole o prompt abaixo.
Se a ferramenta não aceitar esses formatos, use as versões `.docx` e `.xlsx` dos mesmos arquivos; se ela não aceitar anexos, cole o conteúdo dos dois arquivos abaixo do prompt, depois de uma linha `## DADOS`. Desligue a busca na web e a memória entre conversas, ou use conversa temporária, se a ferramenta oferecer essas opções.
As quatro partes (contexto, papel, restrições e formato de saída) estão marcadas para que o
grupo possa alterar uma de cada vez e observar o efeito.

```
## CONTEXTO
Sou analista de uma distribuidora de energia do Sul do Brasil. Recebi um relatório de
benchmark (arquivo relatorio-benchmark-ia-distribuicao.md) e a planilha de indicadores que
o acompanha (indicadores-distribuidoras.csv). Vou usar a análise para propor à minha gerência
um caso de uso de IA a ser testado nos próximos 90 dias. A decisão final é da gerência.

## PAPEL
Atue como analista de planejamento do setor elétrico, com experiência em indicadores
regulatórios (DEC, FEC, perdas, IASC) e cuidado com a qualidade da fonte.

## RESTRIÇÕES
1. Use apenas os dois arquivos anexados. Não traga dado externo nem conhecimento sobre
   empresas reais.
2. Antes de comparar, confira se os indicadores são comparáveis: mesmo ano de referência,
   mesma base de cálculo, valores possíveis. Aponte cada problema com a linha ou a seção
   em que ele aparece.
3. Para cada resultado de IA, informe o tipo de fonte e se há linha de base, período e
   definição da métrica. Resultado sem esses três elementos é "reportado, não verificável".
4. Não afirme relação de causa entre uso de IA e indicador se o documento não demonstrar.
5. Quando um dado estiver ausente, escreva "não informado". Não estime.
6. Para cada métrica de resultado, diga se a definição adotada mede o que o nome da métrica
   sugere e o que ela deixa de fora.

## FORMATO DE SAÍDA
A. Tabela "Problemas de comparabilidade": item | onde aparece | por que impede a comparação.
B. Tabela "Casos de uso": empresa | caso | resultado declarado | fonte | verificável? (sim/não
   e por quê).
C. Três casos de uso candidatos para uma distribuidora do Sul, cada um com: problema que
   resolve, dado de que depende, indicador que seria afetado e risco principal.
D. Um parágrafo de no máximo 80 palavras avaliando a conclusão da seção 4 do relatório.
