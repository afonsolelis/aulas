# Autoestudo: CI de Aplicação Blazor

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Conceitos-Chave](#conceitos-chave)
3. [Aplicação no Projeto](#aplicação-no-projeto)
4. [Checklist de Estudo](#checklist-de-estudo)
5. [Referências](#referências)

---

## Contexto e Objetivo

Nesta atividade, você deve criar um Merge Request da aplicação Blazor do seu time, com

🛠️ Requisitos Técnicos do Pipeline (.gitlab-ci.yml)
O pipeline deve ser dividido em 4 Estágios Principais, executados sequencialmente:

1. Stage: restore
Objetivo: Preparar o ambiente de teste com dados conhecidos.
Ação: O pipeline deve executar um script ou comando que restaure um banco de dados (ou estado da aplicação) a partir de um snapshot ou dump versionado no repositório.
Critério: O ambiente deve estar limpo e populado com dados de teste antes de prosseguir.

2. Stage: build
Objetivo: Compilar e empacotar a aplicação.
Ação: Build padrão da linguagem utilizada (Java, Node, Go, etc.).
Critério: Geração do artefato (JAR, Docker Image, Binary) sem erros de compilação.

3. Stage: test (Obrigatório…

**Eixo disciplinar:** Computação
**Assuntos:** Integração contínua (CI) e entrega contínua (CD)
**Duração recomendada:** 0 min

---

## Conceitos-Chave

Os assuntos centrais deste autoestudo são:

- **Integração contínua (CI) e entrega contínua (CD)**

Cada conceito deve ser compreendido a ponto de o aluno conseguir explicá-lo com as próprias palavras e aplicá-lo ao projeto em andamento.

---

## Aplicação no Projeto

Relacione o conteúdo deste autoestudo ao projeto do squad:

- Como este conceito se manifesta no domínio do parceiro?
- Quais decisões de arquitetura ou modelagem ele influencia?
- Que artefato (RF, RN, RNF, diagrama, teste) ele sustenta?

## Questão de Autoestudo

Siga as instruções na descrição do card.

**Barema:** .

---

## Checklist de Estudo

- [ ] Li o material indicado
- [ ] Consigo explicar os conceitos-chave com minhas palavras
- [ ] Identifiquei como o conceito se aplica ao projeto
- [ ] Anotei dúvidas para levar à aula

---

## Referências

- https://www.youtube.com/watch?v=TKwXC5qSjkE
