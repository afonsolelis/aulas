# Guia do facilitador · Copel · IA na Prática e Prototipagem

Guia de condução do encontro de 09/10/2026 (08h–11h; 3h de conteúdo; dez participantes; trabalho
individual). Fica fora dos arquivos dos participantes e não tem link nas páginas. O repositório é
público; o guia não contém avaliação, e o gabarito da minuta A já está no material, recolhido.

## 1. Desenho do encontro
Cada participante atua como analista do escritório de projetos da Distribuidora Ômega, empresa
fictícia. Nas duas primeiras horas, analisa a minuta A (IA contra perdas não técnicas, com o
benchmark como anexo) e constrói um workflow de três skills que transforma a minuta em parecer
técnico. Na última hora, o conselho da Ômega delibera sobre a proposta B (medição inteligente), e
cada participante usa o próprio workflow para sustentar o papel recebido.

A minuta A tem sete falhas plantadas, e o aviso foi retirado do próprio documento, porque o
Prompt 0 lê o arquivo anexado e passaria a procurar erros, o que esvaziaria a comparação com o
Prompt 1. A proposta B não tem falhas plantadas: foi escrita para ser equilibrada, de modo que os
dois lados da mesa tenham argumentos.

## 2. Checklist pré-evento
- [ ] Plano do Google Workspace da Copel confirmado com a TI.
- [ ] Gemini Notebook ligado pelo admin para os participantes; conferir com a TI a política de
      dados do Notebook, que tem certificações de conformidade próprias, distintas das do app
      do Gemini.
- [ ] Skills disponíveis nas contas. Se não estiverem, confirmar a criação de Gem e avisar na
      tela 4 que cada etapa do workflow vai para um Gem.
- [ ] Notebook anexado a uma conversa pelo + e três skills chamadas em sequência, testados em
      uma conta.
- [ ] Contas dos dez participantes testadas, na rede da Copel.
- [ ] Anexo de .docx e .xlsx testado na conversa e como fonte do notebook. Se o Notebook recusar
      .docx, converter os documentos de conhecimento para Google Docs ou PDF antes da aula.
- [ ] Busca na web e memória entre conversas desativáveis, ou conversa temporária disponível.
- [ ] P0 e P1 rodados sobre a minuta A; saídas guardadas na seção 6 deste guia, com a contagem
      de pontos de cada uma.
- [ ] Workflow de referência rodado nos três casos e na proposta B; parecer da proposta B
      guardado na seção 6, como apoio à discussão de fechamento.
- [ ] Dez cartões de papel impressos (`conselho/cartoes-de-papel.docx`), com a posição de cada
      conselheiro anotada (seção 4).
- [ ] Acesso a `afonsolelis.github.io/aulas` e aos arquivos das práticas a partir da rede da Copel.
- [ ] Arquivos das práticas em pendrive.
- [ ] Três cópias impressas das saídas de referência e da proposta B (plano B).

## 3. Roteiro por tela

| Horário | Telas | Condução |
|---|---|---|
| 8:00 – 8:10 | 1–6 | Capa, contrato, agenda, regras de dados e arquivos. Na tela 6, apresentar o caso da Ômega e antecipar que a última hora é uma reunião do conselho. |
| 8:10 – 8:20 | 7–10 | Bloco 1. Espectro, sete peças e o canvas do workflow de análise de propostas. |
| 8:20 – 8:35 | 11 | Prática 1. Cronômetro de 15 min; conferir com cada participante o critério da área na peça 2. |
| 8:35 – 8:45 | 12–16 | Bloco 2. Não revelar os sete pontos; mostrar a minuta e os dois prompts. |
| 8:45 – 9:00 | 17 | Prática 2. Confirmar que cada participante usa conversa nova, sem busca na web, e anexa a minuta e o benchmark. |
| 9:00 – 9:10 | 18 | Devolutiva. Pedir a contagem a três ou quatro participantes antes de clicar em "Mostrar os sete pontos". |
| 9:10 – 9:25 | 19 | Intervalo de 15 min. Distribuir os cartões de papel na volta, virados para baixo. |
| 9:25 – 9:32 | 20–22 | Bloco 3. As três skills, os três casos e o ciclo de uma mudança por vez. |
| 9:32 – 9:47 | 23 | Iteração 1. Saídas esperadas antes das skills. |
| 9:47 – 10:00 | 24 | Iteração 2. Casos de borda e fora da alçada. |
| 10:00 – 10:05 | 25–26 | Abertura da simulação. Entregar a proposta B e pedir que virem os cartões. |
| 10:05 – 10:20 | 27 | Preparação. Circular pela sala e conferir se cada argumento cita seção ou achado. |
| 10:20 – 10:45 | 28 | Reunião. O presidente conduz; o facilitador projeta e preenche a ata. |
| 10:45 – 10:52 | 29 | Deliberação e ata. |
| 10:52 – 11:00 | 30 | Fechamento: quantos argumentos vieram do parecer e o que ficou com o conselho. |
| 11:00 | 31 | Pesquisa de avaliação: deixar o QR code projetado enquanto os participantes respondem. |

## 4. Papéis e posições
Sugestão de distribuição, a ajustar ao perfil de cada participante: diretor proponente para quem
tiver mais facilidade de exposição; presidente para quem tiver mais experiência de colegiado.
Para que a deliberação não seja decidida antes da reunião, dividir os oito conselheiros em quatro
a favor e quatro contra, com o presidente desempatando. Uma divisão que dá a cada lado
argumentos fortes na própria proposta:

| Conselheiro | Perspectiva | Posição sugerida | Onde estão os argumentos |
|---|---|---|---|
| 1 | Finanças e retorno | Contra | Payback de 7,5 anos perto do limite; VPL negativo sem reconhecimento tarifário (seção 6) |
| 2 | Regulação e tarifa | Contra | Cenário base de 70% de reconhecimento sem fundamento declarado (seções 6 e 8) |
| 3 | Operação e engenharia | A favor | Piloto medido por balanço do alimentador; religação de 19 h para 2 h (seção 3) |
| 4 | Riscos e cibersegurança | Contra | Fornecedor único na fase 1; mitigação de ataque apenas por edital (seção 8) |
| 5 | Clientes e reputação | A favor | Religação mais rápida; leitura sem visita (seções 1 e 3) |
| 6 | Dados e LGPD | Contra | Consumo horário é dado pessoal e não aparece na matriz de riscos (seção 8) |
| 7 | Estratégia e portfólio | A favor | Divisão em fases com gate no mês 18 limita a exposição (seção 7) |
| 8 | Sustentabilidade e longo prazo | A favor | Redução de perdas adotada abaixo da do piloto; vida útil de 13 anos (seções 5 e 6) |

Um desfecho plausível para uma proposta assim é a aprovação com condições
(por exemplo, homologar segundo fornecedor antes da fase 2, incluir o tratamento de dados na
matriz, apresentar sensibilidade do VPL ao reconhecimento tarifário). Não antecipar esse desfecho
para a sala.

## 5. Respostas aos boxes "Chame o professor"
- Prática 1, o participante não sabe que documento a verificação consultaria: perguntar "o que
  um analista novo precisaria ler para saber se uma proposta está completa?" (política de
  investimentos, alçadas, modelo de proposta).
- Iteração 1, o notebook não aparece no + da conversa: conferir se ele foi criado na mesma
  conta; se o recurso estiver bloqueado, anexar a política e o benchmark direto na conversa ou
  colar o conteúdo depois de `## DADOS`.
- Iteração 1, a conta não tem skills nem Gems: colar as três instruções como mensagens, na
  ordem, na mesma conversa.
- Iteração 2, o workflow estima os valores da proposta C: reforçar na extração a restrição
  "não informado" e rodar de novo.

## 6. Saídas de referência
Preencher depois do teste do checklist.

- Ferramenta e modelo: ______ Data: ______
- Saída do P0 sobre a minuta A (resumo e pontos encontrados): ______
- Saída do P1 sobre a minuta A (resumo e pontos encontrados): ______
- Parecer do workflow de referência sobre a proposta B: ______

## 7. Gabarito estendido
Os sete pontos da minuta A, os pontos adicionais aceitos e a explicação de cada um estão no
material, seção 7, no bloco recolhido "Gabarito dos sete pontos". Na contagem da sala, o ponto 6
vale para quem apontar qualquer um dos dois riscos ausentes, e o ponto 7 para quem apontar o
indicador que mede o modelo ou a linha de base sem fonte.

## 8. Plano B
- Ferramenta sem anexo: colar os arquivos abaixo do prompt, depois de `## DADOS`.
- Sem ferramenta: os participantes contam os pontos nas saídas de referência impressas, escrevem
  as instruções das skills no papel e preparam os argumentos da reunião a partir do parecer de
  referência impresso.
- Skill e Gem bloqueados: conversa comum com o notebook anexado pelo +, e as três instruções
  coladas como mensagens, na ordem.
- Sem rede: arquivos no pendrive.
