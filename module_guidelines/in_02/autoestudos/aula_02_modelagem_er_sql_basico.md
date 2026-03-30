# Autoestudo: Modelagem Entidade-Relacionamento e SQL Básico

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Do Domínio para as Entidades](#do-domínio-para-as-entidades)
3. [Atributos, Chaves e Relacionamentos](#atributos-chaves-e-relacionamentos)
4. [Modelo Conceitual, Lógico e Físico](#modelo-conceitual-lógico-e-físico)
5. [Primeiras Consultas SQL](#primeiras-consultas-sql)
6. [Checklist de Estudo](#checklist-de-estudo)
7. [Referências](#referências)

---

## Contexto e Objetivo

Esta aula introduz a visão de dados do sistema. O aluno precisa sair daqui conseguindo olhar para o minimundo e enxergar entidades, atributos, relacionamentos e as primeiras consultas SQL que extraem informação útil.

---

## Do Domínio para as Entidades

Entidades são objetos relevantes do domínio sobre os quais o sistema precisa manter informação.

| Pergunta | Ajuda a encontrar |
|----------|-------------------|
| Quem participa do processo? | Usuários, clientes, funcionários |
| O que é manipulado? | Produtos, pedidos, agendamentos |
| O que precisa ser registrado? | Pagamentos, atendimentos, reservas |

### Exemplo

Minimundo de uma loja:

- Cliente faz pedido
- Pedido contém itens
- Produto pode aparecer em vários pedidos

Entidades iniciais:

- `cliente`
- `pedido`
- `produto`
- `item_pedido`

---

## Atributos, Chaves e Relacionamentos

Cada entidade precisa de atributos e de uma forma única de identificação.

| Conceito | Função | Exemplo |
|----------|--------|---------|
| Atributo | Descreve a entidade | nome, email, preco |
| Chave primária | Identifica unicamente um registro | `id_cliente` |
| Chave estrangeira | Liga uma tabela a outra | `cliente_id` em `pedido` |
| Relacionamento | Mostra como entidades se conectam | cliente faz pedido |

### Cardinalidades mais comuns

| Relação | Significado |
|---------|-------------|
| 1:1 | Um registro se relaciona com no máximo um do outro lado |
| 1:N | Um registro se relaciona com vários do outro lado |
| N:N | Muitos se relacionam com muitos |

---

## Modelo Conceitual, Lógico e Físico

| Nível | O que descreve | Forma típica |
|------|----------------|-------------|
| Conceitual | Ideias do domínio | ER |
| Lógico | Estrutura relacional | DER com atributos e chaves |
| Físico | Implementação no SGBD | tabelas, tipos, constraints |

### Exemplo resumido

```text
Conceitual:
Cliente faz Pedido

Lógico:
CLIENTE(id, nome, email)
PEDIDO(id, data, cliente_id)

Físico:
CREATE TABLE cliente (...);
CREATE TABLE pedido (... FOREIGN KEY (cliente_id) REFERENCES cliente(id));
```

---

## Primeiras Consultas SQL

Consultas básicas ajudam a validar o modelo.

```sql
SELECT id, nome, email
FROM cliente;
```

```sql
SELECT nome, preco
FROM produto
WHERE preco > 100
ORDER BY preco DESC;
```

### Operações que o aluno deve dominar nesta etapa

- `SELECT`
- `FROM`
- `WHERE`
- `ORDER BY`
- `LIMIT`

---

## Checklist de Estudo

- [ ] Consigo identificar entidades a partir do minimundo?
- [ ] Consigo diferenciar atributo de relacionamento?
- [ ] Consigo escolher uma chave primária plausível?
- [ ] Consigo explicar a diferença entre modelo conceitual, lógico e físico?
- [ ] Consigo montar consultas simples com filtro e ordenação?

---

## Referências

- Elmasri & Navathe — Sistemas de Banco de Dados
- PostgreSQL Documentation — SELECT
- SWEBOK v3 — Data Design
