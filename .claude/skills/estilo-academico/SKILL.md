---
name: estilo-academico
description: Guardião do estilo explicativo trazido da tese de doutorado do autor (projeto irmão `tese`, `.claude/commands/escrita/estilo-academico.md`). Prosa acadêmica encadeada no modelo princípio, justificativa e consequência, sem o registro de post de rede social que o texto gerado por LLM produz. Use antes de escrever ou revisar slides, materiais, planos e palestras, junto com escrita-afonso e humanizacao.
---

# Estilo acadêmico explicativo

Adaptação, para os slides e materiais do acervo, do guia de estilo obrigatório da tese
(`../../../../tese/.claude/commands/escrita/estilo-academico.md`, projeto irmão). Na tese, o guia
foi escrito para eliminar o ritmo de marketing que já contaminou versões anteriores do
manuscrito; aqui ele cumpre a mesma função sobre o texto destinado ao aluno e ao participante de
treinamento. Complementa [escrita-afonso](../escrita-afonso/SKILL.md), que define a voz, e
[humanizacao](../humanizacao/SKILL.md), que define a revisão dos vícios. Em caso de conflito,
vale a regra mais restritiva.

## O problema

Texto gerado por LLM tende a frases curtas de efeito, apostos entre travessões que interrompem o
fluxo, fragmentos sem verbo usados como ênfase, tríades retóricas e fechos de impacto. O leitor
reconhece o padrão e passa a desconfiar do conteúdo, de modo que o texto perde justamente a
autoridade técnica que deveria transmitir. O autor determinou que esse registro é inaceitável.

## Proibições

1. **Frases curtas de impacto.** "Nada mais entra.", "O princípio é inegociável.", "Uma tarefa,
   uma sessão." Toda afirmação vem integrada a um período que a explica e a liga ao argumento.
2. **Fragmentos telegráficos.** Oração sem verbo usada como ênfase não existe nesta prosa. Em
   slide, item de lista curto é admitido quando enumera conteúdo técnico (um campo, um caminho,
   uma etapa), e não quando imita manchete.
3. **Travessão como recurso de ritmo.** O travessão intercalado é admitido apenas quando a
   intercalação é longa e a alternativa geraria ambiguidade, no máximo um par por parágrafo.
   Prefira, nesta ordem, oração subordinada ou relativa, vírgulas, parênteses ou dois períodos.
   O travessão de intervalo (`08:30 – 09:00`) e o de título oficial permanecem.
4. **Dois-pontos dramáticos e formato de manchete.** "A resposta: o humano." e o rótulo em
   negrito seguido de dois-pontos e explicação ("**Regra de parada:** a análise...") são
   manchete. Reescreva como oração completa ("A análise só começa depois que a conferência
   fecha, porque..."). Rótulo de campo em tabela, em bloco de código ou em ficha estruturada não
   é manchete e permanece.
5. **Antítese corretiva.** "Não é X, é Y", "X, e não Y", "o problema não está em A, e sim em B".
   Afirme o que a coisa é e explique por quê. Mantenha o contraste apenas quando ele for o
   conteúdo (duas colunas de comparação, duas opções de decisão).
6. **Tríades e anáforas retóricas.** Enumeração em ritmo de slogan ("observa, decide, age") só é
   admitida quando enumera conteúdo técnico real.
7. **Negrito e itálico para ênfase retórica.** Negrito marca termo definido ou nome de campo;
   itálico marca estrangeirismo. Nenhum dos dois serve para dar força a uma frase.
8. **Fechos publicitários.** O parágrafo, o box ou o slide termina quando o argumento termina,
   sem frase-síntese de efeito ("que é o pior resultado possível", "vale mais do que o fluxo
   inteiro desenhado no papel", "é o que torna tudo possível").
9. **Títulos em forma de aforismo.** O título de slide descreve o assunto e cabe em uma linha
   ("Por que pedir ao agente o script de leitura"), em vez de condensar uma tese em frase de
   efeito ("O agente não lê a planilha; ele escreve o leitor").

## Prescrições

1. **Períodos completos e encadeados.** A prosa avança por conectivos explícitos (portanto,
   desse modo, uma vez que, na medida em que, em consequência, por sua vez, além disso), de modo
   que cada frase decorra da anterior e prepare a seguinte.
2. **Princípio, justificativa e consequência.** Modelo aprovado pelo autor na tese: "é
   importante que o gêmeo digital não comece a operar vazio, e para isso foi criado um
   formulário lido e interpretado por IA generativa para configurar o baseline de escopo através
   de uma entrevista estruturada". Enuncia-se o princípio, justifica-se a necessidade e
   descreve-se a solução em fluxo contínuo, sem cortes de efeito.
3. **Explicar antes de prescrever.** Em material didático, a regra vem acompanhada do mecanismo
   que a motiva: o que acontece quando ela não é seguida e por que o procedimento proposto evita
   esse efeito.
4. **Registro formal e acessível.** Voz impessoal ou segunda pessoa de instrução nos roteiros de
   prática ("crie a pasta", "confira a soma"), conforme já consolidado no acervo.
5. **Leitura em voz alta como teste.** Se o trecho soa como post de LinkedIn, manchete ou
   slogan, reescreva até soar como explicação dada por um professor a um adulto interessado.

## Adaptação a slides

O slide não comporta parágrafo de oito períodos, e o estilo explicativo não autoriza
transbordar a tela (Key Rule 3 do `CLAUDE.md`). Na projeção, aplique assim:

- o subtítulo do slide é um período completo que diz o que o slide explica e por quê;
- cada box tem uma ou duas frases completas com relação causal explícita, e não uma sequência
  de afirmações soltas;
- itens de lista são frases completas ou enumeração de conteúdo técnico, nunca fragmentos de
  efeito;
- o callout de rodapé explica a consequência prática em prosa corrida, sem rótulo em negrito;
- depois de reescrever, rode `npm run validate:slides -- <arquivo>` e ajuste o texto, e não a
  tipografia, quando algum slide transbordar.

## O que preservar

Números, datas, horários, nomes de arquivo e de campo, trechos de código, prompts, exemplos de
`SKILL.md` e de agente, dados de diagnóstico e toda a marcação HTML (classes, atributos, blocos
`encontro:*` e `semana:*`). Revisão de estilo é transformação de forma, sem alterar afirmações.

## Procedimento

1. Ler o arquivo inteiro antes de editar, para herdar tom e terminologia.
2. Localizar os alvos: `grep -c " — "` para travessões na prosa, `grep -n ", e não \|e sim "`
   para antíteses, `grep -n "<strong>[^<]*:</strong>"` para manchetes; leitura atenta para
   títulos-aforismo e fechos de efeito.
3. Reescrever cada ocorrência conforme as prescrições.
4. Validar visualmente (slides) e rodar `npm test`.
5. Relatar o que mudou, com exemplos de antes e depois.
