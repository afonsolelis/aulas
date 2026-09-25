# Guia do facilitador · Copel · IA na Prática e Prototipagem

Guia de condução do encontro de 09/10/2026 (3h30, dez participantes, três grupos). Fica fora
do kit dos participantes e não tem link nas páginas. O repositório é público; o guia não
contém avaliação, e o gabarito do benchmark já está no material, recolhido.

## 1. Nota sobre o benchmark
O relatório `benchmark/relatorio-benchmark-ia-distribuicao.md` contém de propósito sete
inconsistências. O aviso foi retirado do próprio documento, porque o Prompt 0 lê o arquivo
anexado e passaria a procurar erros, o que esvaziaria a comparação com o Prompt 1.

## 2. Checklist pré-evento (até 02/10/2026)
- [ ] Ferramenta e plano confirmados com a TI da Copel; atualizar a tela 4 do deck com o nome.
- [ ] Criação de Gem, GPT personalizado ou agente habilitada nas contas dos participantes.
- [ ] Uma conta testada por grupo, na rede da Copel.
- [ ] Anexo de .md, .csv, .docx e .xlsx testado na ferramenta.
- [ ] Busca na web e memória entre conversas desativáveis, ou conversa temporária disponível.
- [ ] P0 e P1 rodados na ferramenta confirmada; saídas guardadas na seção 4 deste guia, com a
      contagem de pontos de cada uma.
- [ ] Acesso a `afonsolelis.github.io/aulas` e ao zip do kit a partir da rede da Copel.
- [ ] Zip do kit em pendrive.
- [ ] Três cópias impressas das saídas de referência (plano B).

## 3. Roteiro por tela

| Horário | Telas | Condução |
|---|---|---|
| 0:00 – 0:05 | 1–5 | Capa, contrato do dia, agenda, regras de dados e kit. Pedir que todos baixem o kit na tela 5. |
| 0:05 – 0:15 | 6 | Prática 0. Iniciar o cronômetro de 10 min e circular pelos grupos. |
| 0:15 – 0:27 | 7–10 | Bloco 1. Espectro, sete peças e exemplo da ouvidoria. |
| 0:27 – 0:52 | 11 | Prática 1. Cronômetro de 25 min; conferir as peças 3, 6 e 7 em cada mesa. |
| 0:52 – 1:04 | 12–16 | Bloco 2. Não revelar os sete pontos; mostrar só os dois prompts. |
| 1:04 – 1:24 | 17 | Prática 2A. Confirmar que cada grupo usa conversa nova e sem busca na web. |
| 1:24 – 1:34 | 18 | Devolutiva. Pedir a contagem de cada grupo antes de clicar em "Mostrar os sete pontos". |
| 1:34 – 1:49 | 19 | Prática 2B. |
| 1:49 – 1:59 | 20 | Intervalo. |
| 1:59 – 2:09 | 21–23 | Bloco 3. MVP Zero, variante de fluxo e ciclo de refinamento. |
| 2:09 – 2:34 | 24 | Iteração 1. Casos antes da instrução. |
| 2:34 – 3:02 | 25 | Iterações 2 e 3 e preparo da demonstração. |
| 3:02 – 3:17 | 26 | Demonstração: resetar o cronômetro de 5 min a cada grupo (4 + 1). |
| 3:17 – 3:30 | 27–29 | Degraus, o que não se delega e trinta dias. A tela 29 pode virar leitura posterior se o tempo acabar. |

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
- Prática 1, o grupo não sabe que documento o assistente leria: perguntar "o que um colega
  novo precisaria consultar para fazer essa tarefa?"; se o documento for interno, escrever uma
  versão fictícia de até dez linhas, ou usar `mvp-zero/conhecimento-ficticio/`.
- Prática 1, a tarefa exige decidir algo de alçada: recortar o problema para a etapa anterior à
  decisão (organizar, classificar, preparar a minuta) e registrar a decisão na peça 7.
- Iteração 1, a ferramenta não aceita o anexo: colar o conteúdo depois de `## DADOS`, ou usar
  as versões .docx e .xlsx.
- Iteração 1, os três casos passaram de primeira: tornar o caso típico mais difícil (duas
  informações conflitantes, um dado faltando) e rodar de novo.

## 7. Plano B
- Ferramenta sem anexo: colar os arquivos abaixo do prompt, depois de `## DADOS`.
- Sem ferramenta: os grupos contam os pontos nas saídas de referência impressas e escrevem a
  instrução do MVP no papel; a demonstração vira leitura crítica da instrução.
- Criação de assistente bloqueada: conversa comum, com a instrução colada como primeira
  mensagem.
- Sem rede: zip no pendrive.

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
