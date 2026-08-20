# Autoestudo: Guia Completo das Ponderadas — SI09

## Sumário
1. [Atividade Ponderada em sala de aula 01](#ponderada-1)
2. [Atividade Ponderada em sala de aula 02](#ponderada-2)
3. [Questão Ponderada: Análise da média móvel em Séries Temporais](#ponderada-3)
4. [Questão Ponderada: Modelos de Séries Temporais para o Controle de Dados Gerenciais](#ponderada-4)
5. [Questão Ponderada: Modelos de Séries Temporais para a Gestão de Recursos Humanos](#ponderada-5)
6. [Atividade Ponderada em sala de aula 03](#ponderada-6)

---

## Visão Geral das Ponderadas

As Ponderadas são avaliações práticas aplicadas em sala de aula. Este módulo possui 6 ponderada(s).

| # | Ponderada | Sprint | Eixo | Peso |
|---|-----------|--------|------|------|
| 1 | Atividade Ponderada em sala de aula 01 | Sprint 1 | User Experience | 1 |
| 2 | Atividade Ponderada em sala de aula 02 | Sprint 1 | User Experience | 1 |
| 3 | Questão Ponderada: Análise da média móvel em Séries Temporais | Sprint 1 | Matemática e Física | 1 |
| 4 | Questão Ponderada: Modelos de Séries Temporais para o Controle de Dados Gerenciais | Sprint 3 | Matemática e Física | 1 |
| 5 | Questão Ponderada: Modelos de Séries Temporais para a Gestão de Recursos Humanos | Sprint 4 | Matemática e Física | 1 |
| 6 | Atividade Ponderada em sala de aula 03 | Sprint 4 | User Experience | 1 |

---

## Ponderada 1 — Atividade Ponderada em sala de aula 01

**Sprint:** 1 | **Eixo:** User Experience | **Peso:** 1

**Aplicada em:** Esboço e Técnicas Avançadas de Wireframing e Visualização de Dados

### Contexto

Atenção, galera! Esse autoestudo é só para você enviar a atividade do nosso encontro. Qualquer dúvida, fale com o professor!

### Questão

Esse autoestudo não tem material específico para você ler ou assistir antes da instrução. Ele é apenas um espaço para você enviar a sua atividade ponderada, que faremos durante o nosso encontro presencial.

### Barema

.

---

## Ponderada 2 — Atividade Ponderada em sala de aula 02

**Sprint:** 1 | **Eixo:** User Experience | **Peso:** 1

**Aplicada em:** Introdução ao Design Sprint e Fundamentos Avançados de UX.

### Contexto

Atenção, galera! Esse autoestudo é só para você enviar a atividade do nosso encontro. Qualquer dúvida, fale com o professor!

### Questão

Esse autoestudo não tem material específico para você ler ou assistir antes da instrução. Ele é apenas um espaço para você enviar a sua atividade ponderada, que faremos durante o nosso encontro presencial.

### Barema

.

---

## Ponderada 3 — Questão Ponderada: Análise da média móvel em Séries Temporais

**Sprint:** 1 | **Eixo:** Matemática e Física | **Peso:** 1

**Aplicada em:** Introdução à Análise de Séries Temporais

### Contexto

Faça a questão ponderada referente ao estudo da suavização de séries temporais pela média média móvel simples e exponencial.

### Questão

Um analista financeiro está estudando o comportamento dos gastos mensais de uma empresa ao longo de um ano, com o objetivo de compreender a estrutura da série temporal e obter previsões de curto prazo, assumindo que não há efeitos sazonais relevantes no período analisado.
Os gastos mensais observados (em milhares de dólares) são apresentados a seguir:
Janeiro: $50
Fevereiro: $52
Março: $53
Abril:…

### Barema

a) A média móvel simples centralizada tem objetivo de reduzir flutuações de curto prazo, permitindo visualizar melhor o comportamento geral (tendência) da série ao longo do tempo. Não é adequada para previsão, pois serve apenas para análise histórica e estrutural, e não para projeção.
b)
março = 51.25
abril = 51.00
maio = 50.75
junho = 51.00
julho = 51.50
agosto = 51.25
setembro = 50.75
outubro =…

---

## Ponderada 4 — Questão Ponderada: Modelos de Séries Temporais para o Controle de Dados Gerenciais

**Sprint:** 3 | **Eixo:** Matemática e Física | **Peso:** 1

**Aplicada em:** Modelos para Séries Temporais: Modelos ARIMA

### Contexto

Faça a questão ponderada referente a modelos de séries temporais.

### Questão

Um gerente de vendas de uma loja de eletrônicos monitorou as vendas de um produto específico durante 5 semanas consecutivas e obteve os seguintes dados:

Semana / Vendas
1 / 50
2 / 53
3 / 52
4 / 54
5 / 55

Ele decidiu utilizar um modelo ARIMA para tentar prever as vendas na 6ª semana. Considerando que a série possui uma tendência, mas sem sazonalidade, e que os dados seguem um padrão…

### Barema

a) Para calcular a primeira diferenciação dos dados, subtraímos cada valor da semana anterior:

Semana / Vendas / Diferenciação (d=1)
1 / 50 / -
2 / 53 / 3
3 / 52 / -1
4 / 54 / 2
5 / 55 / 1

b) Usando um modelo ARIMA(1,1,0), a previsão de vendas para a 6ª semana seria baseada em uma combinação linear do valor diferenciado mais recente e um termo de erro. O modelo pode ser escrito como:

Zt =…

---

## Ponderada 5 — Questão Ponderada: Modelos de Séries Temporais para a Gestão de Recursos Humanos

**Sprint:** 4 | **Eixo:** Matemática e Física | **Peso:** 1

**Aplicada em:** Previsão de Demanda e Principais Indicadores na Gestão de Recursos Humanos

### Contexto

Faça a questão ponderada referente aos Modelos de Séries Temporais para a Gestão de Recursos Humanos

### Questão

O objetivo desta atividade é fazer uma previsão de demanda com o conjunto de dados a seguir que possui as seguintes variáveis: data, demanda_colaboradores, area (setor da empresa), turnover_percentual e horas_extras_totais.
a) Crie uma série temporal com os dados. Apresente o gráfico.
b) Realize a decomposição da série, destacando se ela possui tendência e sazonalidade.
c) Verifique se a série…

### Barema

Código em Python da resolução:
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
# Ler os dados
df = pd.read_csv("/content/dados_operacionais.csv", sep=",")
df.head()
# Converter a coluna de data
df["data"] = pd.to_datetime(df["data"])
# Definir data como índice
df.set_index("data", inplace=True)
# Série temporal principal
serie =…

---

## Ponderada 6 — Atividade Ponderada em sala de aula 03

**Sprint:** 4 | **Eixo:** User Experience | **Peso:** 1

**Aplicada em:** Teste, Iteração e Acessibilidade - Ouvindo os Usuários e Priorizando Acessibilidade

### Contexto

Atenção, galera! Esse autoestudo é só para você enviar a atividade do nosso encontro. Qualquer dúvida, fale com o professor!

### Questão

Esse autoestudo não tem material específico para você ler ou assistir antes da instrução. Ele é apenas um espaço para você enviar a sua atividade ponderada, que faremos durante o nosso encontro presencial.

### Barema

.

---
