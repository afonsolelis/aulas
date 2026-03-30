# Autoestudo: JOINS, Filtros e Consultas Relacionais

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Por que JOIN existe](#por-que-join-existe)
3. [INNER, LEFT e RIGHT JOIN](#inner-left-e-right-join)
4. [Filtros, Ordenação e Agregação](#filtros-ordenação-e-agregação)
5. [Erros Comuns em Consultas Relacionais](#erros-comuns-em-consultas-relacionais)
6. [Conexão com Endpoints e Telas](#conexão-com-endpoints-e-telas)
7. [Aprofundamento Orientado](#aprofundamento-orientado)
8. [Miniestudo de Caso](#miniestudo-de-caso)
9. [Checklist de Estudo](#checklist-de-estudo)
10. [Referências](#referências)

---

## Contexto e Objetivo

Esta aula aprofunda a leitura de dados distribuídos em múltiplas tabelas. O objetivo é entender quando e como combinar registros relacionados para responder perguntas reais do sistema.

---

## Por que JOIN existe

Em bancos relacionais, a informação costuma ficar separada por responsabilidade. Um `JOIN` recompõe essa visão.

### Exemplo de tabelas separadas

| Tabela | Papel |
|--------|-------|
| `cliente` | Dados do cliente |
| `pedido` | Cabeçalho do pedido |
| `item_pedido` | Itens do pedido |
| `produto` | Catálogo |

Pergunta de negócio:

> Quais produtos aparecem em cada pedido de determinado cliente?

Essa resposta exige cruzar tabelas.

---

## INNER, LEFT e RIGHT JOIN

| Tipo | Quando usar | Efeito |
|------|-------------|--------|
| `INNER JOIN` | Quero apenas registros com correspondência dos dois lados | descarta ausentes |
| `LEFT JOIN` | Quero manter tudo da tabela da esquerda | traz `NULL` quando não encontra do outro lado |
| `RIGHT JOIN` | Mesmo raciocínio invertido | menos comum na prática |

### Exemplo com `INNER JOIN`

```sql
SELECT p.id, c.nome
FROM pedido p
INNER JOIN cliente c ON c.id = p.cliente_id;
```

### Exemplo com `LEFT JOIN`

```sql
SELECT c.nome, p.id
FROM cliente c
LEFT JOIN pedido p ON p.cliente_id = c.id;
```

Esse segundo caso também mostra clientes sem pedido.

---

## Filtros, Ordenação e Agregação

JOINS costumam vir acompanhados de filtros e resumos.

### Exemplo

```sql
SELECT c.nome, COUNT(p.id) AS total_pedidos
FROM cliente c
LEFT JOIN pedido p ON p.cliente_id = c.id
GROUP BY c.nome
ORDER BY total_pedidos DESC;
```

### Elementos que precisam ser dominados

- `WHERE`
- `GROUP BY`
- `COUNT`, `SUM`, `AVG`
- `ORDER BY`

---

## Erros Comuns em Consultas Relacionais

| Erro | Sintoma |
|------|---------|
| JOIN sem condição correta | número exagerado de linhas |
| JOIN em chave errada | resultado sem sentido |
| `INNER JOIN` quando precisava `LEFT JOIN` | linhas desaparecem |
| Falta de `GROUP BY` adequado | agregações incorretas |

### Regra prática

Antes de escrever a query, responda:

1. Quais tabelas participam?
2. Qual é a chave que conecta cada uma?
3. Quero perder linhas sem correspondência ou preservá-las?
4. Estou listando linhas ou resumindo resultados?

---

## Conexão com Endpoints e Telas

Quase toda listagem útil do sistema nasce de uma consulta relacional.

| Necessidade da interface | Tipo de consulta provável |
|--------------------------|---------------------------|
| listar pedidos com nome do cliente | `pedido` + `cliente` |
| mostrar itens do pedido com nome do produto | `pedido` + `item_pedido` + `produto` |
| exibir ranking ou totais | `JOIN` + agregação |

### Pergunta importante

Se a tela precisa de um dado composto, faz mais sentido:

- uma query pronta no backend
- ou várias chamadas menores que a interface precisa recompor?

Em geral, para leitura coerente e simples, a composição deveria acontecer no backend.

---

## Aprofundamento Orientado

### 1. Pensar em consulta antes de pensar em framework

Antes de escrever ORM, vale montar a consulta em SQL puro. Isso ajuda a:

- validar a lógica
- enxergar duplicações
- distinguir erro de modelagem de erro de implementação

### 2. Cuidado com linhas duplicadas

Se um pedido tem vários itens, um `JOIN` pode multiplicar linhas. Isso não é sempre erro, mas exige interpretação correta.

| Situação | O que fazer |
|----------|-------------|
| quero ver cada item separadamente | manter duplicação esperada |
| quero resumir por pedido | agrupar ou agregar |
| quero evitar repetição de texto | rever projeção e `GROUP BY` |

### 3. Ponte para a aula 5

As consultas escritas aqui serão consumidas pela camada de backend. Por isso, ao finalizar o estudo, o aluno deveria já conseguir dizer:

- que consulta alimenta qual endpoint
- que campos precisam entrar no retorno
- que filtros a API provavelmente vai expor

---

## Miniestudo de Caso

### Tela de pedidos precisa mostrar contexto completo

O gerente pediu uma listagem com número do pedido, nome do cliente, quantidade total de itens e valor total. Os dados existem, mas estão espalhados em `pedido`, `cliente`, `item_pedido` e `produto`.

### Estrutura da consulta

| Informação exibida | Origem provável |
|--------------------|-----------------|
| número do pedido | `pedido.id` |
| nome do cliente | `cliente.nome` |
| total de itens | `SUM(item_pedido.quantidade)` |
| valor total | soma de `item_pedido.quantidade * produto.preco_cents` |

### Ponto pedagógico

Esse caso ajuda o aluno a perceber que a pergunta de negócio vem antes da query. O `JOIN` existe para responder uma necessidade concreta da tela ou do relatório, não para "usar mais SQL".

### Perguntas para discutir

1. Em quais junções o `LEFT JOIN` faria mais sentido do que `INNER JOIN`?
2. Como evitar que um pedido com vários itens apareça duplicado quando a intenção é resumir por pedido?
3. Essa consulta deveria ser montada no front-end ou entregue pronta pelo backend?

---

## Checklist de Estudo

- [ ] Sei explicar a diferença entre `INNER JOIN` e `LEFT JOIN`?
- [ ] Consigo identificar a chave usada na junção?
- [ ] Consigo combinar JOIN com filtro e ordenação?
- [ ] Consigo resumir resultados com `COUNT` e `GROUP BY`?
- [ ] Sei reconhecer um resultado duplicado por JOIN mal escrito?

---

## Referências

- PostgreSQL Documentation — Table Expressions
- SQLBolt — Joins
- SWEBOK v3 — Data Design
