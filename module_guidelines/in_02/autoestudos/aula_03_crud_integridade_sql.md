# Autoestudo: CRUD em SQL, DDL, DML e Integridade

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [DDL e DML](#ddl-e-dml)
3. [Operações CRUD](#operações-crud)
4. [Constraints e Integridade](#constraints-e-integridade)
5. [Casos de Erro que Precisam ser Testados](#casos-de-erro-que-precisam-ser-testados)
6. [Conexão com Back-end e API](#conexão-com-back-end-e-api)
7. [Aprofundamento Orientado](#aprofundamento-orientado)
8. [Miniestudo de Caso](#miniestudo-de-caso)
9. [Checklist de Estudo](#checklist-de-estudo)
10. [Referências](#referências)

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

## Conexão com Back-end e API

O que aqui aparece como SQL depois vira comportamento observado via endpoint.

| Banco de dados | Reflexo no backend |
|----------------|--------------------|
| `UNIQUE` | resposta de conflito ou validação |
| `NOT NULL` | rejeição de payload incompleto |
| `FOREIGN KEY` | erro ao referenciar recurso inexistente |
| `CHECK` | regra de negócio refletida na API |

### Exemplo de encadeamento

```text
RN: produto precisa ter preço positivo
→ banco: CHECK (preco_cents > 0)
→ backend: validação antes de salvar
→ API: retorno 400 ou 422
→ frontend: mensagem clara ao usuário
```

---

## Aprofundamento Orientado

### 1. Integridade no banco não substitui regra no código

O banco protege consistência, mas o backend ainda precisa:

- validar cedo
- produzir mensagem compreensível
- mapear erro técnico para resposta de negócio

### 2. Pensar em estados do dado

CRUD não é só operação; é ciclo de vida.

| Operação | Pergunta de projeto |
|----------|---------------------|
| Create | Quais dados mínimos tornam o registro válido? |
| Read | Quem precisa ler e com que filtro? |
| Update | O que pode mudar e o que deve permanecer imutável? |
| Delete | Exclusão física faz sentido ou deveria ser lógica? |

### 3. Ponte para a aula 4

Depois de criar dados válidos, a próxima competência é lê-los em conjunto. Por isso, ao estudar CRUD, vale já observar:

- quais tabelas se relacionam com maior frequência
- quais consultas futuras dependerão dessas relações
- quais campos aparecem sempre nos filtros

---

## Miniestudo de Caso

### Cadastro de produto com risco de inconsistência

O time implementou a tabela `produto` e agora precisa permitir cadastro e atualização. Em testes manuais, apareceram dois problemas: SKU repetido e preço salvo como zero.

### Resposta esperada no banco

| Problema | Proteção esperada |
|----------|-------------------|
| SKU duplicado | `UNIQUE (sku)` |
| preço zerado ou negativo | `CHECK (preco_cents > 0)` |
| nome ausente | `NOT NULL` |

### Leitura aplicada

Esse caso mostra que CRUD não é apenas "fazer funcionar". A operação precisa preservar a integridade para evitar que o backend e a interface recebam dados inválidos e passem a tratar erro tarde demais.

### Perguntas para discutir

1. O que deve ser barrado no banco e o que também deve ser validado no backend?
2. Em uma exclusão de produto, faz sentido apagar o registro se ele já aparece em pedidos?
3. Que cenários de erro deveriam virar teste logo após esse CRUD ser implementado?

---

## Checklist de Estudo

- [ ] Sei distinguir DDL de DML?
- [ ] Consigo montar um `CREATE TABLE` coerente com o DER?
- [ ] Consigo executar `INSERT`, `SELECT`, `UPDATE` e `DELETE`?
- [ ] Consigo explicar por que uma constraint é útil?
- [ ] Consigo pensar em ao menos um teste de erro por operação crítica?

---

## Referências

- [PostgreSQL Documentation — CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html)
- [PostgreSQL Documentation — INSERT / UPDATE / DELETE](https://www.postgresql.org/docs/current/dml.html)
- [SWEBOK — Software Engineering Body of Knowledge](https://www.computer.org/education/bodies-of-knowledge/software-engineering/v4)
