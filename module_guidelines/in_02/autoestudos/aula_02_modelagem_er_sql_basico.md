# Autoestudo: Modelagem Entidade-Relacionamento e SQL Básico

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Do Domínio para as Entidades](#do-domínio-para-as-entidades)
3. [Atributos, Chaves e Relacionamentos](#atributos-chaves-e-relacionamentos)
4. [Modelo Conceitual, Lógico e Físico](#modelo-conceitual-lógico-e-físico)
5. [Primeiras Consultas SQL](#primeiras-consultas-sql)
6. [Conexão com Minimundo e Regras](#conexão-com-minimundo-e-regras)
7. [Aprofundamento Orientado](#aprofundamento-orientado)
8. [Miniestudo de Caso](#miniestudo-de-caso)
9. [Checklist de Estudo](#checklist-de-estudo)
10. [Referências](#referências)

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

## Conexão com Minimundo e Regras

Modelagem não é desenho decorativo. Ela é a tradução estrutural do domínio.

| Origem no problema | Decisão de dados |
|--------------------|------------------|
| "cliente faz pedido" | relação entre `cliente` e `pedido` |
| "pedido tem itens" | entidade associativa `item_pedido` |
| "produto tem SKU único" | atributo com restrição `UNIQUE` |
| "pedido tem status" | atributo controlado por regra de domínio |

### Perguntas que amadurecem o modelo

- Esse atributo realmente pertence a esta entidade?
- Este relacionamento é direto ou pede tabela intermediária?
- Esta regra de negócio já deveria virar constraint?
- Esta consulta será frequente o bastante para influenciar o desenho?

---

## Aprofundamento Orientado

### 1. Do texto para o diagrama

Uma forma boa de estudar é pegar um trecho do minimundo e fazer três leituras:

1. sublinhar substantivos relevantes para achar entidades
2. sublinhar características para achar atributos
3. sublinhar verbos para achar relacionamentos

### 2. Onde os alunos costumam errar

| Erro | Consequência |
|------|--------------|
| transformar ação em entidade sem necessidade | modelo inflado |
| esquecer cardinalidade | DER ambíguo |
| criar atributo sem uso claro | baixa qualidade do esquema |
| misturar dado derivado com dado de origem | inconsistência futura |

### 3. Preparação para a aula 3

A aula seguinte vai operar sobre o que foi modelado aqui. Então, antes de avançar, é importante conseguir responder:

- qual é a chave primária de cada entidade?
- quais campos são obrigatórios?
- quais relações exigem chave estrangeira?
- quais consultas básicas mostram que o modelo faz sentido?

---

## Miniestudo de Caso

### Catálogo e pedidos da loja do campus

Partindo do caso da aula anterior, o time precisa sair do texto e propor um primeiro modelo de dados. O gerente quer responder: "quais produtos existem, quantos itens cada pedido possui e quem comprou o quê?"

### Tradução do domínio

| Trecho do problema | Decisão de modelagem |
|--------------------|----------------------|
| cliente faz pedido | `cliente` 1:N `pedido` |
| pedido contém produtos | tabela associativa `item_pedido` |
| produto tem código único | atributo `sku` com `UNIQUE` |
| gerente consulta estoque | atributo `estoque_atual` em `produto` |

### Aplicação prática

O grupo pode validar o DER perguntando se ele sustenta duas consultas simples:

1. listar produtos com nome e estoque
2. listar pedidos com o cliente responsável

Se o modelo não suporta essas perguntas sem gambiarra, ele ainda não está maduro.

### Perguntas para discutir

1. `item_pedido` deveria existir como entidade própria? Por quê?
2. Qual atributo é natural para identificar um produto no negócio e qual é melhor para chave primária técnica?
3. O estoque deve ser armazenado diretamente ou derivado de movimentações em um projeto introdutório?

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
