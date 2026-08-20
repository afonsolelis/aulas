# Autoestudo: Questão Ponderada: Modelos de Séries Temporais para a Gestão de Recursos Humanos

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Conceitos-Chave](#conceitos-chave)
3. [Aplicação no Projeto](#aplicação-no-projeto)
4. [Checklist de Estudo](#checklist-de-estudo)
5. [Referências](#referências)

---

## Contexto e Objetivo

Faça a questão ponderada referente aos Modelos de Séries Temporais para a Gestão de Recursos Humanos

**Eixo disciplinar:** Matemática e Física
**Assuntos:** Conceito de probabilidade
,Indicadores, metas e objetivos
**Duração recomendada:** 0 min

---

## Conceitos-Chave

Os assuntos centrais deste autoestudo são:

- **Conceito de probabilidade**
- **Indicadores**
- **metas e objetivos**

Cada conceito deve ser compreendido a ponto de o aluno conseguir explicá-lo com as próprias palavras e aplicá-lo ao projeto em andamento.

---

## Aplicação no Projeto

Relacione o conteúdo deste autoestudo ao projeto do squad:

- Como este conceito se manifesta no domínio do parceiro?
- Quais decisões de arquitetura ou modelagem ele influencia?
- Que artefato (RF, RN, RNF, diagrama, teste) ele sustenta?

## Questão de Autoestudo

O objetivo desta atividade é fazer uma previsão de demanda com o conjunto de dados a seguir que possui as seguintes variáveis: data, demanda_colaboradores, area (setor da empresa), turnover_percentual e horas_extras_totais.
a) Crie uma série temporal com os dados. Apresente o gráfico.
b) Realize a decomposição da série, destacando se ela possui tendência e sazonalidade.
c) Verifique se a série possui estacionaridade, através de um teste estatístico, e em caso negativo realize a…

**Barema:** Código em Python da resolução:
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
# Ler os dados
df = pd.read_csv("/content/dados_operacionais.csv", sep=",")
df.head()
# Converter a coluna de data
df["data"] = pd.to_datetime(df["data"])
# Definir data como…

---

## Checklist de Estudo

- [ ] Li o material indicado
- [ ] Consigo explicar os conceitos-chave com minhas palavras
- [ ] Identifiquei como o conceito se aplica ao projeto
- [ ] Anotei dúvidas para levar à aula

---

## Referências

- https://integrada.minhabiblioteca.com.br/reader/books/9788563308825/pageid/148
