# Prompt de arranque

Cole o texto abaixo no Chat do Copilot, no modo Agent, com a pasta `meu-fluxo` aberta no VS Code. Antes de enviar, substitua o trecho entre colchetes pela descrição do seu processo e, se quiser partir de um exemplo, indique o arquivo de `exemplos/`.

O prompt pede ao Copilot que entreviste você antes de escrever qualquer arquivo. A entrevista existe porque o Copilot não conhece o seu processo, e um agente escrito sem essas respostas tende a inventar critério de aceite e regra de negócio.

---

```text
Quero montar neste repositório um fluxo multiagente para o processo abaixo,
seguindo o mesmo desenho do kit de revisão de contratos: AGENTS.md, um orquestrador
com tabela de roteamento, um agente por papel com "O que lhe é vedado", uma skill
por procedimento repetido, conceitos/ com as regras citáveis por endereço e uma
pasta por caso com estado.md.

Processo: [descreva em 3 a 5 frases: o que entra, o que sai, quem usa o resultado,
em que sistema está hoje e onde o processo trava]

Exemplo de partida (opcional): exemplos/[nome-do-arquivo].md

Antes de criar qualquer arquivo, faça-me as perguntas abaixo, uma de cada vez,
e espere a minha resposta:
1. Qual é a entrada de cada caso e em que formato ela chega?
2. Qual é a saída final, em que formato, e quem a recebe?
3. Quais são as etapas hoje, na ordem, e qual delas exige julgamento?
4. Qual é o critério de aceite de cada etapa, em uma frase?
5. Que regras ou documentos a etapa de julgamento consulta?
6. Em que etapa uma segunda leitura independente (consenso) reduziria erro?
7. Quem recebe o caso quando o fluxo não consegue concluir?

Depois das respostas:
- escreva primeiro a decomposição em etapas numa tabela e peça a minha aprovação;
- só então crie os arquivos, começando pelo AGENTS.md e pelo orquestrador;
- use dados fictícios no caso de exemplo e nunca dados reais de paciente;
- quando a saída for Excel, PowerPoint ou Word, crie uma skill que gere o arquivo
  por script e confira o resultado (linhas, somas, número de slides).
```
