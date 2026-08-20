# Ponderada 5 — Questão Ponderada: Modelos de Séries Temporais para a Gestão de Recursos Humanos

**Aplicada em:** Previsão de Demanda e Principais Indicadores na Gestão de Recursos Humanos | **Visão RM-ODP:** Engineering + Technology
**Formato:** Individual em sala | **Eixo:** Matemática e Física | **Peso:** 1

---

## Contexto

Faça a questão ponderada referente aos Modelos de Séries Temporais para a Gestão de Recursos Humanos

---

## Entrega Mínima

A entrega mínima é o que precisa estar presente para a atividade ser considerada — **não garante nota máxima**.

- Compreensão do enunciado e entrega no formato solicitado
- Resposta postada no Adalove na área destinada

Entregas que cumprem apenas o mínimo serão avaliadas na faixa **5,0 a 6,5**.

---

## O que entregar

O objetivo desta atividade é fazer uma previsão de demanda com o conjunto de dados a seguir que possui as seguintes variáveis: data, demanda_colaboradores, area (setor da empresa), turnover_percentual e horas_extras_totais.
a) Crie uma série temporal com os dados. Apresente o gráfico.
b) Realize a decomposição da série, destacando se ela possui tendência e sazonalidade.
c) Verifique se a série possui estacionaridade, através de um teste estatístico, e em caso negativo realize a diferenciação.
d) Crie um modelo de série temporal e faça uma previsão de demanda para 5…

---

## Critérios de Avaliação

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
serie = df["demanda_colaboradores"]
plt.figure()
plt.plot(serie)
plt.title("Demanda de colaboradores ao longo do tempo")
plt.xlabel("Tempo")
plt.ylabel("Quantidade")
plt.show()
"""### **DECOMPOSIÇÃO**"""
from statsmodels.tsa.seasonal import seasonal_decompose
decomposicao = seasonal_decompose(serie)
decomposicao.plot();
"""### **DIFERENCIAÇÃO**"""
import statsmodels.tsa.stattools
"""Teste KPSS (Kwiatkowski-Phillips-Schmidt-Shin)
Ha = não é…

| Critério | Peso |
|----------|------|
| Compreensão do enunciado | 30% |
| Aplicação correta dos conceitos | 40% |
| Clareza e rastreabilidade da entrega | 30% |

---

## Formato de Entrega

Documento único (`.md`, `.pdf` ou `.docx`) postado na área de resposta do Adalove.
Links externos não serão aceitos, com exceção de imagens indicadas no texto da resposta.
