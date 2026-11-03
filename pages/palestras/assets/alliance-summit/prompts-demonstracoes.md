# Prompts das demonstrações · Masterclass Alliance · Inteli Exec

Os quatro prompts abaixo foram usados nas demonstrações ao vivo da masterclass de 13/11/2026, no
Summit anual da Alliance. Cada um segue as seis partes do método CREATE, proposto por Dave Birss:
papel (C), pedido (R), exemplos (E), ajustes (A), tipo de saída (T) e instruções extras (E). Eles
funcionam no ChatGPT, no Gemini, no Claude ou em outro assistente de IA generativa, porque o
método descreve o pedido e não depende da ferramenta.

Os arquivos de apoio são fictícios e estão na mesma pasta:

- `politica-academia-exemplo.md`, política de atendimento de uma academia que não existe;
- `alunos-academia-exemplo.csv`, base de 64 alunos identificados apenas por código.

Antes de usar um prompt com dados da sua academia, troque nomes de alunos por códigos e confira
se a sua conta permite que as conversas sejam usadas para treinar modelos (seção 8 do material).

---

## Demonstração 1 · Assistente de atendimento (WhatsApp e recepção)

Anexe `politica-academia-exemplo.md` antes de enviar.

```text
[C] Atue como atendente da recepção da Academia Exemplo, uma academia de jiu-jitsu com turmas
adulto, feminino, kids e competição.
[R] Escreva a resposta à mensagem de WhatsApp abaixo, enviada por uma pessoa interessada em começar.
Mensagem: "Oi! Quanto custa? Queria fazer com meu filho de 9 anos. Tem desconto pra dois?"
[E] Exemplo de tom: "Oi, Marina! Que bom que vocês querem conhecer a academia. A turma kids treina
segunda, quarta e sexta, das 17h às 18h."
[A] Use apenas a política anexada. Quando a política não cobrir o pedido, diga que vai confirmar com
a gerência e não prometa condição, valor ou prazo. Não use gíria nem emoji em excesso. Não peça
dados pessoais além do primeiro nome e do melhor horário.
[T] Uma mensagem de WhatsApp com no máximo 90 palavras, terminando com um convite para agendar a
aula experimental.
[E] Depois da mensagem, em uma linha separada e iniciada por "Para a recepção:", liste o que você
precisou encaminhar à gerência.
```

O que conferir: os valores do plano kids e do plano adulto vêm da tabela da política; o desconto
para duas pessoas não está na política e deve ser encaminhado, e não inventado; o convite cita a
aula experimental gratuita e a necessidade de um responsável acompanhar a criança.

Teste de contraste: envie o mesmo pedido sem anexar a política. O assistente tende a responder com
valores plausíveis que não existem, o que mostra por que o documento de referência faz parte do
pedido.

---

## Demonstração 2 · Conteúdo e design (calendário de posts)

```text
[C] Atue como responsável pela comunicação de uma academia de jiu-jitsu licenciada de uma rede
internacional, que fala com alunos adultos, pais de alunos kids e moradores do bairro.
[R] Monte o calendário de posts do Instagram para as quatro semanas entre 16/11 e 13/12/2026.
Datas fixas: semana de aula experimental gratuita de 16 a 21/11; cerimônia de graduação em
12/12, às 10h; turma feminina às terças e quintas, das 18h às 19h.
[E] Exemplo de linha: "18/11 | Carrossel | Cinco perguntas de quem nunca treinou | Aula
experimental | Foto de treino com alunos que autorizaram o uso de imagem".
[A] Não invente resultado de campeonato, depoimento de aluno nem número de alunos. Não sugira
imagem com rosto de criança. Respeite as regras de uso da marca definidas pela rede e deixe
[conferir com a rede] onde a peça usar logotipo ou nome da equipe.
[T] Tabela com as colunas data, formato, tema, objetivo e imagem sugerida, com dois posts por
semana, seguida da legenda completa do post da cerimônia de graduação, com até 80 palavras.
[E] Antes de montar a tabela, faça até três perguntas sobre o público e o tom da academia.
```

Depois da tabela, a arte de um post pode ser feita em uma ferramenta de design com IA (por
exemplo, Canva) ou no gerador de imagem do próprio assistente, a partir do tema e da legenda
aprovados.

---

## Demonstração 3 · Apresentação (proposta para uma empresa do bairro)

```text
[C] Atue como consultor comercial de uma academia de jiu-jitsu que quer oferecer aulas para os
funcionários de uma empresa vizinha, com cerca de 200 funcionários.
[R] Escreva o roteiro de uma apresentação de oito telas para a reunião com a área de pessoas
dessa empresa.
[E] Exemplo de tela: "Tela 3 · Como funciona a aula · duas turmas por semana no horário de
almoço, para iniciantes, com professor faixa-preta · imagem: turma iniciante treinando".
[A] Não invente benefício de saúde com número, estatística ou estudo. Onde faltar um dado da
academia (preço, horário, número de professores), escreva [preencher]. Linguagem para quem
nunca treinou.
[T] Para cada tela: título com até oito palavras, três tópicos e uma sugestão de imagem. Depois,
uma nota de fala de até 40 palavras para cada tela.
[E] Ao final, liste as perguntas que a área de pessoas provavelmente fará e o que a academia
precisa ter respondido antes da reunião.
```

O roteiro pode ser levado a uma ferramenta de apresentação com IA (por exemplo, Gamma, Canva, o
Gemini no Google Slides ou o Copilot no PowerPoint), que transforma o texto em telas.

---

## Demonstração 4 · Análise de dados (base de alunos)

Anexe `alunos-academia-exemplo.csv` antes de enviar.

```text
[C] Atue como analista de dados de uma academia de jiu-jitsu.
[R] Analise a base de alunos anexada, extraída em 10/11/2026, e responda: (1) quantos alunos
estão ativos e qual é a receita mensal recorrente dos ativos; (2) quais alunos ativos não treinam
há 21 dias ou mais, por turma, e quanto de receita mensal eles representam; (3) quantos
cancelamentos houve nos últimos 90 dias, por turma e por motivo.
[E] Exemplo de linha da resposta 2: "A046 | Kids | 23 dias sem treinar | R$ 250".
[A] Antes de calcular, verifique se há linha duplicada, valor vazio ou data inválida e diga o que
encontrou. Use apenas os dados do arquivo. Não tire conclusão sobre a causa da evasão sem dado
que a sustente.
[T] Três tabelas curtas, uma por pergunta, seguidas de três ações de retenção para a próxima
semana, cada uma ligada a um número das tabelas.
[E] Mostre a fórmula ou o código usado em cada cálculo, para que eu possa conferir um número
à mão.
```

O que conferir, na base fictícia: são 65 linhas e 64 alunos, porque o aluno A015 aparece duas
vezes; 49 alunos estão ativos e a receita mensal recorrente é de R$ 13.850 (R$ 14.140 se a
duplicata não for removida); 11 alunos ativos estão há 21 dias ou mais sem treinar, seis na turma
Adulto manhã e cinco na turma Kids, somando R$ 2.990 por mês; houve nove cancelamentos nos últimos
90 dias, quatro deles na turma Kids e três na turma Competição.
