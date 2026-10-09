# Guia do facilitador · Copel · IA na Prática e Prototipagem

Guia de condução do encontro de 09/10/2026 (08h–11h; 3h de conteúdo; doze participantes da Copel; seis duplas). Fica fora
dos arquivos dos participantes e não tem link nas páginas. O repositório é público; o guia não
contém avaliação, e o gabarito do benchmark já está no material, recolhido.

## 1. Nota sobre o benchmark
O relatório `benchmark/relatorio-benchmark-ia-distribuicao.md` contém de propósito sete
inconsistências. O aviso foi retirado do próprio documento, porque o Prompt 0 lê o arquivo
anexado e passaria a procurar erros, o que esvaziaria a comparação com o Prompt 1.

## 2. Checklist pré-evento (até 07/10/2026)
- [ ] Plano do Google Workspace da Copel confirmado com a TI.
- [ ] Gemini Notebook ligado pelo admin para os participantes; conferir com a TI a política de
      dados do Notebook, que tem certificações de conformidade próprias, distintas das do app
      do Gemini.
- [ ] Skills disponíveis nas contas (no Workspace, a liberação vai de 05/10 a meados de
      novembro de 2026, conforme o canal de release do domínio). Se não estiverem, confirmar a
      criação de Gem e avisar as duplas na tela 4 que o MVP vai para um Gem.
- [ ] Notebook anexado a uma conversa pelo + e skill chamada com `/` testados em uma conta.
- [ ] Uma conta testada por dupla, na rede da Copel.
- [ ] Anexo de .md, .csv, .docx e .xlsx testado na ferramenta.
- [ ] Busca na web e memória entre conversas desativáveis, ou conversa temporária disponível.
- [ ] P0 e P1 rodados na ferramenta confirmada; saídas guardadas na seção 4 deste guia, com a
      contagem de pontos de cada uma.
- [ ] Acesso a `afonsolelis.github.io/aulas` e aos arquivos das práticas a partir da rede da Copel.
- [ ] Arquivos das práticas em pendrive.
- [ ] Seis cópias impressas das saídas de referência (plano B).

## 3. Roteiro por tela

| Horário | Telas | Condução |
|---|---|---|
| 8:00 – 8:05 | 1–5 | Capa, contrato do dia, agenda, regras de dados e arquivos. Na tela 5, mostrar onde ficam os links de cada prática. |
| 8:05 – 8:10 | 6 | Prática 0. Formar as seis duplas e iniciar o cronômetro de 5 min; ajudar quem não tiver processo a escolher um item de `problemas-exemplo.md`. |
| 8:10 – 8:22 | 7–10 | Bloco 1. Espectro, sete peças e exemplo da ouvidoria. |
| 8:22 – 8:40 | 11 | Prática 1. Cronômetro de 18 min; conferir as peças 3, 6 e 7 com cada dupla. |
| 8:40 – 8:52 | 12–16 | Bloco 2. Não revelar os sete pontos; mostrar só os dois prompts. |
| 8:52 – 9:07 | 17 | Prática 2A. Confirmar que cada dupla usa conversa nova e sem busca na web. |
| 9:07 – 9:15 | 18 | Devolutiva. Pedir a contagem de cada dupla antes de clicar em "Mostrar os sete pontos". |
| 9:15 – 9:25 | 19 | Prática 2B. Lembrar que a resposta E traz as perguntas usadas na roda. |
| 9:25 – 9:40 | 20 | Intervalo de 15 min. |
| 9:40 – 9:50 | 21–23 | Bloco 3. MVP Zero, variante de fluxo e ciclo de refinamento. |
| 9:50 – 10:05 | 24 | Iteração 1, 15 min. Casos antes da instrução. |
| 10:05 – 10:20 | 25 | Iterações 2 e 3 (7 min cada) e escolha do que levar à roda (1 min). |
| 10:20 – 10:50 | 26 | Roda de discussão, sem apresentação formal: resetar o cronômetro de 5 min a cada dupla e conduzir pelas quatro perguntas da tela. |
| 10:50 – 11:00 | 27–29 | Degraus, o que não se delega e trinta dias. A tela 29 pode virar leitura posterior se o tempo acabar. |

## 4. Saídas de referência
Preencher depois do teste do checklist.

- Ferramenta e modelo: ______ Data: ______
- Saída do P0 (resumo e pontos encontrados): ______
- Saída do P1 (resumo e pontos encontrados): ______

## 5. Gabarito estendido
Os sete pontos, os pontos adicionais aceitos e a classificação esperada dos casos estão no
material, seção 7, no bloco recolhido "Gabarito dos sete pontos". Na contagem da sala, o ponto
7 vale para quem apontar o panorama sem metodologia ou a conclusão causal.

## 6. Respostas aos boxes "Chame o professor"
- Prática 1, a dupla não sabe que documento o assistente leria: perguntar "o que um colega
  novo precisaria consultar para fazer essa tarefa?"; se o documento for interno, escrever uma
  versão fictícia de até dez linhas, ou usar `mvp-zero/conhecimento-ficticio/`.
- Prática 1, a tarefa exige decidir algo de alçada: recortar o problema para a etapa anterior à
  decisão (organizar, classificar, preparar a minuta) e registrar a decisão na peça 7.
- Iteração 1, o notebook não aparece no + da conversa: conferir se ele foi criado na mesma
  conta; se o recurso estiver bloqueado, anexar os arquivos direto na conversa ou colar o
  conteúdo depois de `## DADOS`.
- Iteração 1, os três casos passaram de primeira: tornar o caso típico mais difícil (duas
  informações conflitantes, um dado faltando) e rodar de novo.

## 7. Plano B
- Ferramenta sem anexo: colar os arquivos abaixo do prompt, depois de `## DADOS`.
- Sem ferramenta: as duplas contam os pontos nas saídas de referência impressas e escrevem a
  instrução do MVP no papel; a roda de discussão passa a ser a leitura crítica das instruções.
- Skill e Gem bloqueados: conversa comum com o notebook anexado pelo +, e a instrução colada
  como primeira mensagem.
- Sem rede: arquivos no pendrive.

## 8. Exemplo preenchido
Canvas da ouvidoria: tela 10 do deck e seção 5 do material.

Casos de teste para o problema-exemplo 1 (triagem da ouvidoria):
1. Típico. "Estou sem luz desde ontem às 18h na rua das Palmeiras, 120. Já liguei três
   vezes." Saída esperada: tema interrupção, urgência alta (acima de 24 h), prazo 2 dias,
   Operação da distribuição.
2. De borda. "Minha conta veio alta e depois da queda de energia a geladeira parou." Saída
   esperada: dois temas (fatura e dano elétrico); classificar pelo de maior urgência e
   sinalizar o segundo; o pedido de ressarcimento vai com a marca "decisão de alçada".
3. Fora da alçada. "Quero que vocês me paguem a geladeira nova até sexta, confirmem por
   favor." Saída esperada: "Encaminhar para Ressarcimento de danos", sem prometer pagamento
   nem prazo.
