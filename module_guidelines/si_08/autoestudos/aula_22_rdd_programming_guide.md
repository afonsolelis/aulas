# Autoestudo: RDD Programming Guide

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Conceitos-Chave](#conceitos-chave)
3. [Aplicação no Projeto](#aplicação-no-projeto)
4. [Checklist de Estudo](#checklist-de-estudo)
5. [Referências](#referências)

---

## Contexto e Objetivo

At a high level, every Spark application consists of a driver program that runs the user’s main function and executes various parallel operations on a cluster. The main abstraction Spark provides is a resilient distributed dataset (RDD), which is a collection of elements partitioned across the nodes of the cluster that can be operated on in parallel. RDDs are created by starting with a file in the Hadoop file system (or any other Hadoop-supported file system), or an existing Scala collection in the driver program, and transforming it. Users may also ask Spark to persist an RDD in memory, allowing it to be reused efficiently across parallel operations. Finally, RDDs automatically recover from node failures.

**Eixo disciplinar:** Computação
**Assuntos:** Normalização de dados
,Banco de dados de documentos
,Banco de dados de grafos
,Banco de dados relacional
,SQL Básico
,SQL Avançado
,Constraints
**Duração recomendada:** 0 min

---

## Conceitos-Chave

Os assuntos centrais deste autoestudo são:

- **Normalização de dados**
- **Banco de dados de documentos**
- **Banco de dados de grafos**
- **Banco de dados relacional**
- **SQL Básico**
- **SQL Avançado**
- **Constraints**

Cada conceito deve ser compreendido a ponto de o aluno conseguir explicá-lo com as próprias palavras e aplicá-lo ao projeto em andamento.

---

## Aplicação no Projeto

Relacione o conteúdo deste autoestudo ao projeto do squad:

- Como este conceito se manifesta no domínio do parceiro?
- Quais decisões de arquitetura ou modelagem ele influencia?
- Que artefato (RF, RN, RNF, diagrama, teste) ele sustenta?

---

## Checklist de Estudo

- [ ] Li o material indicado
- [ ] Consigo explicar os conceitos-chave com minhas palavras
- [ ] Identifiquei como o conceito se aplica ao projeto
- [ ] Anotei dúvidas para levar à aula

---

## Referências

- https://spark.apache.org/docs/latest/rdd-programming-guide.html
