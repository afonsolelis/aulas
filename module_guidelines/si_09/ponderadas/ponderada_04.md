# Ponderada 4 — Questão Ponderada: Modelos de Séries Temporais para o Controle de Dados Gerenciais

**Aplicada em:** Modelos para Séries Temporais: Modelos ARIMA | **Visão RM-ODP:** Computational
**Formato:** Individual em sala | **Eixo:** Matemática e Física | **Peso:** 1

---

## Contexto

Faça a questão ponderada referente a modelos de séries temporais.

---

## Entrega Mínima

A entrega mínima é o que precisa estar presente para a atividade ser considerada — **não garante nota máxima**.

- Compreensão do enunciado e entrega no formato solicitado
- Resposta postada no Adalove na área destinada

Entregas que cumprem apenas o mínimo serão avaliadas na faixa **5,0 a 6,5**.

---

## O que entregar

Um gerente de vendas de uma loja de eletrônicos monitorou as vendas de um produto específico durante 5 semanas consecutivas e obteve os seguintes dados:

Semana / Vendas
1 / 50
2 / 53
3 / 52
4 / 54
5 / 55

Ele decidiu utilizar um modelo ARIMA para tentar prever as vendas na 6ª semana. Considerando que a série possui uma tendência, mas sem sazonalidade, e que os dados seguem um padrão ARIMA(1,1,0):

a) Determine a primeira diferenciação dos dados.
b) Usando um modelo ARIMA(1,1,0), qual seria sua previsão para as vendas na 6ª semana e na 7a semana?
Obs.: A previsão de vendas para a 6ª semana e…

---

## Critérios de Avaliação

a) Para calcular a primeira diferenciação dos dados, subtraímos cada valor da semana anterior:

Semana / Vendas / Diferenciação (d=1)
1 / 50 / -
2 / 53 / 3
3 / 52 / -1
4 / 54 / 2
5 / 55 / 1

b) Usando um modelo ARIMA(1,1,0), a previsão de vendas para a 6ª semana seria baseada em uma combinação linear do valor diferenciado mais recente e um termo de erro. O modelo pode ser escrito como:

Zt = Zt-1+ΔZt
ΔZt=ϕ.ΔZt-1+εt
ΔZ6=0.6.1+0 = 0,6
Z6 = 55 + 0,6 = 55,6
ΔZ7=0.6.0,6+0 = 0,36
Z7 = 55,6 + 0,36 = 55,96

c) 
Zt=c+ϕZt−1+εt
Z6 = 10 + 0,8.55 + 0 = 54
Z7 = 10 + 0,8.54 = 53,2

| Critério | Peso |
|----------|------|
| Compreensão do enunciado | 30% |
| Aplicação correta dos conceitos | 40% |
| Clareza e rastreabilidade da entrega | 30% |

---

## Formato de Entrega

Documento único (`.md`, `.pdf` ou `.docx`) postado na área de resposta do Adalove.
Links externos não serão aceitos, com exceção de imagens indicadas no texto da resposta.
