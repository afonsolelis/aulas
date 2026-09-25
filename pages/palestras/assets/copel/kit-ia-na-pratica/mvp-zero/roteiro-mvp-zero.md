# Roteiro do MVP Zero

O MVP Zero é a menor versão do assistente que já roda sobre um caso real do grupo e cuja
saída pode ser julgada por quem conhece o trabalho. Ele não tem integração com sistema nem
interface própria: a entrada é colada ou anexada, e a saída é lida por uma pessoa. O que se
constrói hoje é a instrução, testada contra casos concretos e melhorada a cada rodada.

## Onde construir
Use a ferramenta autorizada pela empresa. As três opções mais comuns recebem o mesmo
conteúdo com nomes diferentes:

| Ferramenta | Onde fica a instrução | Onde ficam os documentos |
|---|---|---|
| Google Gemini | Gem, campo "Instruções" | Gem, campo "Conhecimento" |
| ChatGPT | GPT personalizado, campo "Instruções" | GPT personalizado, "Conhecimento" |
| Microsoft 365 Copilot | Agente, campo "Instruções" | Agente, "Conhecimento" |

Se nenhuma delas estiver liberada, o MVP roda em uma conversa comum: cole a instrução como
primeira mensagem e anexe os documentos em seguida.

## Iteração 1 (v1): da instrução ao primeiro teste
1. Parta da resposta D do Prompt 2 e reescreva a instrução no molde `instrucao-modelo.md`.
2. Escreva três casos de teste em `casos-de-teste.md`: um típico, um de borda e um fora do
   escopo.
3. Rode os três casos e anote no `registro-de-iteracoes.md` o que saiu certo e o que falhou.

## Iterações 2 e 3 (v2, v3): uma correção por vez
1. Escolha a falha mais grave do registro.
2. Altere uma única parte da instrução (contexto, papel, restrição ou formato) para
   corrigi-la. Se mudar duas coisas ao mesmo tempo, não será possível saber qual resolveu.
3. Rode de novo os três casos, não apenas o que falhou, porque a correção de um caso pode
   quebrar outro.
4. Registre a versão, a mudança e o resultado.

## Critério de pronto para a demonstração
- Os três casos rodam e a saída tem sempre o mesmo formato.
- O caso fora do escopo é recusado ou devolvido para pessoa, sem resposta inventada.
- O grupo sabe dizer qual mudança da instrução produziu a maior melhora.
