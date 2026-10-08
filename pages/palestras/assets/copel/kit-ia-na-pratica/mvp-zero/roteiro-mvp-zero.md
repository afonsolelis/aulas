# Roteiro do workflow de análise de propostas

O MVP de hoje é um workflow de três etapas que transforma uma minuta de proposta de projeto em
parecer técnico para o conselho: a extração produz uma ficha padronizada, a verificação confere
a ficha contra a política de avaliação de projetos e contra os próprios números da minuta, e o
parecer redige as inconsistências, os riscos não tratados e as perguntas à área proponente. Ele
não tem integração com sistema: a minuta é anexada, as skills são chamadas à mão e o parecer é
lido por uma pessoa antes de seguir.

## Onde construir
O workflow é construído no Gemini da conta corporativa da Copel, com dois recursos:

| Recurso | O que guarda | Como entra na conversa |
|---|---|---|
| Gemini Notebook | A política de avaliação de projetos e os anexos das propostas | Botão + da caixa de prompt, escolhendo o notebook |
| Skill | A instrução de cada etapa, nos quatro componentes | `/` seguido do nome da skill |

Se a conta ainda não tiver skills, crie três Gems, um por etapa, cada um com o notebook anexado,
e passe a saída de um para o outro. Se nem o Gem estiver liberado, use uma conversa comum: anexe
o notebook pelo + e cole a instrução de cada etapa como mensagem, na ordem.

## Iteração 1 (v1): montar e rodar no caso típico
1. Escreva a saída esperada dos três casos em `casos-de-teste.md`.
2. Crie um notebook com `conhecimento/politica-de-avaliacao-de-projetos.md` e os dois arquivos
   de `benchmark/` como fontes.
3. Crie as três skills a partir de `fluxo-modelo.md`, completando os trechos entre colchetes.
4. Em uma conversa nova, anexe o notebook e a minuta A, e chame `/extrair-proposta`,
   `/verificar-proposta` e `/parecer-proposta`, nessa ordem.
5. Compare o parecer com a saída esperada e registre a v1 em `registro-de-iteracoes.md`.

## Iteração 2 (v2): os casos de borda e fora da alçada
1. Rode o workflow nos casos 2 e 3, em conversas novas.
2. Escolha a falha mais grave entre os três casos.
3. Edite uma única skill, alterando um único componente, e rode de novo os três casos, porque a
   correção de um caso pode quebrar outro.
4. Registre a etapa, o componente alterado, a mudança e o resultado.

## Critério de pronto para a reunião do conselho
- Os três casos rodam e o parecer tem sempre as cinco seções do formato.
- A proposta incompleta é devolvida com as lacunas, sem valores estimados.
- O pedido de recomendação de voto é recusado.
