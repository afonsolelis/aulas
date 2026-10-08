# Roteiro do workflow de leitura crítica de propostas

O MVP de hoje é um workflow de três etapas que transforma uma proposta da pauta em nota de
leitura do conselheiro: a extração produz uma ficha padronizada, a verificação confere a ficha
contra a política de investimentos e contra os próprios números da minuta, e a nota reúne as
inconsistências, os riscos não tratados e as perguntas à diretoria. Ele não tem integração com
sistema: a proposta é anexada, as skills são chamadas à mão e a nota é lida pelo conselheiro,
que decide o que levar à reunião.

## Onde construir
O workflow é construído no Gemini da conta corporativa da Copel, com dois recursos:

| Recurso | O que guarda | Como entra na conversa |
|---|---|---|
| Gemini Notebook | A política de investimentos e os anexos das propostas | Botão + da caixa de prompt, escolhendo o notebook |
| Skill | A instrução de cada etapa, nos quatro componentes | `/` seguido do nome da skill |

Se a conta ainda não tiver skills, crie três Gems, um por etapa, cada um com o notebook anexado,
e passe a saída de um para o outro. Se nem o Gem estiver liberado, use uma conversa comum: anexe
o notebook pelo + e cole a instrução de cada etapa como mensagem, na ordem.

## Iteração 1 (v1): montar e rodar no caso típico
1. Escreva a saída esperada dos três casos em casos-de-teste.docx.
2. Crie um notebook com politica-de-investimentos.docx, o relatório do benchmark e a
   planilha de indicadores como fontes.
3. Crie as três skills a partir de instrucoes-das-skills.docx, copiando cada quadro e completando
   os trechos entre colchetes.
4. Em uma conversa nova, anexe o notebook e a minuta A, e chame `/extrair-proposta`,
   `/verificar-proposta` e `/nota-do-conselheiro`, nessa ordem.
5. Compare a nota com a saída esperada e registre a v1 em registro-de-iteracoes.docx.

## Iteração 2 (v2): os casos de borda e fora da alçada
1. Rode o workflow nos casos 2 e 3, em conversas novas.
2. Escolha a falha mais grave entre os três casos.
3. Edite uma única skill, alterando um único componente, e rode de novo os três casos, porque a
   correção de um caso pode quebrar outro.
4. Registre a etapa, o componente alterado, a mudança e o resultado.

## Critério de pronto para a reunião do conselho
- Os três casos rodam e a nota tem sempre as cinco seções do formato.
- A proposta incompleta gera pedido de informações à diretoria, sem valores estimados.
- O pedido de recomendação de voto é recusado.
