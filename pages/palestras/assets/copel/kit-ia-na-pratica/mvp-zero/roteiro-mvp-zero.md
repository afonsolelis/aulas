# Roteiro do MVP Zero

O MVP Zero é a menor versão do assistente que já roda sobre um caso representativo do trabalho
de quem o constrói, escrito com dados fictícios, e cuja saída pode ser julgada por quem conhece o
trabalho. Ele não tem integração com sistema nem interface própria: a entrada é colada ou
anexada, e a saída é lida por uma pessoa. O que se constrói hoje é a instrução, testada contra
casos concretos e melhorada a cada rodada.

## Onde construir
O MVP é construído no Gemini da conta corporativa da Copel, com dois recursos:

| Recurso | O que guarda | Como entra na conversa |
|---|---|---|
| Gemini Notebook | Os documentos de conhecimento, como fontes do notebook | Botão + da caixa de prompt, escolhendo o notebook |
| Skill | A instrução nos quatro componentes | `/` seguido do nome da skill |

Se a conta ainda não tiver skills, cole a mesma instrução no campo de instruções de um Gem e
anexe o notebook a ele. Se nem o Gem estiver liberado, ou se criar o assistente levar mais de
cinco minutos, use uma conversa comum: anexe o notebook pelo + e cole a instrução como
primeira mensagem.

## Iteração 1 (v1): dos casos de teste ao primeiro resultado
1. Escreva os três casos em `casos-de-teste.md`: um típico, um de borda e um fora do escopo ou
   da alçada, cada um com a saída esperada escrita antes de rodar.
2. Parta da resposta D do Prompt 2 e reescreva a instrução no molde `instrucao-modelo.md` (ou
   `fluxo-modelo.md`, na variante de fluxo).
3. Crie um notebook no Gemini Notebook e adicione o documento de conhecimento como fonte. Se
   o documento for interno, use uma versão fictícia de até dez linhas, ou um dos arquivos de
   `conhecimento-ficticio/`.
4. Crie a skill com a instrução v1. Em uma conversa nova, anexe o notebook pelo + e chame a
   skill com `/` antes de colar cada caso.
5. Rode os três casos e anote no `registro-de-iteracoes.md` o que saiu certo e o que falhou.

## Iterações 2 e 3 (v2, v3): uma correção por vez
1. Escolha a falha mais grave do registro.
2. Edite a skill alterando uma única parte da instrução (contexto, papel, restrição ou
   formato) para corrigi-la. Se mudar duas coisas ao mesmo tempo, não será possível saber qual resolveu.
3. Rode de novo os três casos, não apenas o que falhou, porque a correção de um caso pode
   quebrar outro.
4. Registre a versão, o componente alterado, a mudança e o resultado.

## Variante de fluxo
Quando o problema escolhido é um processo recorrente, com gatilho definido e etapas que se
repetem sempre na mesma ordem, o MVP Zero pode ser montado como fluxo. O participante divide o
trabalho em duas ou três etapas fixas, escreve uma skill para cada uma no molde
`fluxo-modelo.md` e chama as skills à mão, na ordem e na mesma conversa, com o notebook
anexado. Os casos de teste e o registro são os
mesmos, e cada iteração altera um componente de uma única etapa, anotada no registro.

## Critério de pronto para a demonstração
- Os três casos rodam e a saída tem sempre o mesmo formato.
- O caso fora do escopo ou da alçada é recusado ou devolvido para pessoa, sem resposta
  inventada.
- O participante sabe dizer qual mudança da instrução produziu a maior melhora.
