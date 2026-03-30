# Autoestudo: JOINS, Filtros e Consultas Relacionais

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Por que JOIN existe](#por-que-join-existe)
3. [INNER, LEFT e RIGHT JOIN](#inner-left-e-right-join)
4. [Filtros, Ordenação e Agregação](#filtros-ordenação-e-agregação)
5. [Erros Comuns em Consultas Relacionais](#erros-comuns-em-consultas-relacionais)
6. [Checklist de Estudo](#checklist-de-estudo)
7. [Referências](#referências)

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
