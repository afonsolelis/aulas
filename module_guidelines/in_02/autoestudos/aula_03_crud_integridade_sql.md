# Autoestudo: CRUD em SQL, DDL, DML e Integridade

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [DDL e DML](#ddl-e-dml)
3. [Operações CRUD](#operações-crud)
4. [Constraints e Integridade](#constraints-e-integridade)
5. [Casos de Erro que Precisam ser Testados](#casos-de-erro-que-precisam-ser-testados)
6. [Checklist de Estudo](#checklist-de-estudo)
7. [Referências](#referências)

---

## Contexto e Objetivo

Depois de modelar as entidades, o próximo passo é operar sobre elas. O foco desta aula é transformar o DER em tabelas reais e exercitar criação, leitura, atualização e remoção de registros com SQL.

---

## DDL e DML

| Grupo | Função | Comandos comuns |
|-------|--------|-----------------|
| DDL | Define estrutura | `CREATE`, `ALTER`, `DROP` |
| DML | Manipula dados | `INSERT`, `SELECT`, `UPDATE`, `DELETE` |

### Exemplo de DDL

```sql
CREATE TABLE produto (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  sku VARCHAR(40) NOT NULL UNIQUE,
  preco_cents INT NOT NULL CHECK (preco_cents > 0)
);
```

---

## Operações CRUD

### Create

```sql
INSERT INTO produto (nome, sku, preco_cents)
VALUES ('Camiseta', 'CAM-001', 4990);
```

### Read

```sql
SELECT id, nome, preco_cents
FROM produto
WHERE sku = 'CAM-001';
```

### Update

```sql
UPDATE produto
SET preco_cents = 5490
WHERE id = 1;
```

### Delete

```sql
DELETE FROM produto
WHERE id = 1;
```

---

## Constraints e Integridade

Constraints protegem o banco contra inconsistências.

| Constraint | O que evita |
|------------|-------------|
| `PRIMARY KEY` | IDs repetidos |
| `NOT NULL` | Campos obrigatórios vazios |
| `UNIQUE` | Duplicidade em campos únicos |
| `CHECK` | Valores fora da regra |
| `FOREIGN KEY` | Referências para registros inexistentes |

### Exemplo

```sql
CREATE TABLE pedido (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES cliente(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'pago', 'cancelado'))
);
```

---

## Casos de Erro que Precisam ser Testados

| Situação | Resultado esperado |
|----------|--------------------|
| Inserir `NULL` em campo obrigatório | erro de constraint |
| Repetir um `sku` único | erro de duplicidade |
| Criar pedido com `cliente_id` inexistente | erro de chave estrangeira |
| Atualizar valor fora do `CHECK` | erro de validação |

### Boa prática

Para cada operação CRUD importante, o aluno deve registrar:

- cenário de sucesso
- cenário de falha
- regra de negócio associada

---

## Checklist de Estudo

- [ ] Sei distinguir DDL de DML?
- [ ] Consigo montar um `CREATE TABLE` coerente com o DER?
- [ ] Consigo executar `INSERT`, `SELECT`, `UPDATE` e `DELETE`?
- [ ] Consigo explicar por que uma constraint é útil?
- [ ] Consigo pensar em ao menos um teste de erro por operação crítica?

---

## Referências

- PostgreSQL Documentation — CREATE TABLE
- PostgreSQL Documentation — INSERT / UPDATE / DELETE
- SWEBOK v3 — Software Construction and Data Design
