# Autoestudo: Modelagem Relacional — Do ER ao Modelo Físico

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Perspectiva dos Corpos de Conhecimento](#perspectiva-dos-corpos-de-conhecimento)
3. [Álgebra Relacional e as Formas Normais](#álgebra-relacional-e-as-formas-normais)
4. [Pipeline ER → DER → Modelo Físico](#pipeline-er--der--modelo-físico)
5. [Rastreabilidade RN → Entidade → Tabela](#rastreabilidade-rn--entidade--tabela)
6. [Migrations DDL com PostgreSQL](#migrations-ddl-com-postgresql)
7. [Checklist de Validação](#checklist-de-validação)
8. [Referências](#referências)
9. [Glossário](#glossário)

---

## Contexto e Objetivo

A Aula 3 consolida a visão **Information** do RM-ODP: o mapa conceitual (Minimundo + RNs) deve ser traduzido mecanicamente em tabelas físicas, índices e constraints. O artefato da **Sprint 2** exige rastreabilidade bidirecional entre regra de negócio e entidade/tabela, o que torna o rigor formal desta etapa crítico.

---

## Perspectiva dos Corpos de Conhecimento

### SWEBOK v3 — Capítulo de Software Design (Data Design)

O SWEBOK define *Data Design* como a atividade de transformar modelos de domínio em estruturas de armazenamento eficientes. As preocupações centrais são:

| Preocupação | Descrição | RNF Associado |
|-------------|-----------|---------------|
| **Integridade** | Chaves, constraints e transações ACID | Confiabilidade |
| **Desempenho** | Índices, normalização vs. desnormalização estratégica | Eficiência de Desempenho |
| **Segurança** | Campos sensíveis, separação de schemas | Segurança |

### DMBOK (*Data Management Body of Knowledge*)

O DMBOK v2 trata modelagem de dados como disciplina formal, dividida em:

- **Modelo Conceitual:** Entidades e relacionamentos (independente de tecnologia)
- **Modelo Lógico:** Atributos, chaves, cardinalidades
- **Modelo Físico:** Tabelas, tipos de dados nativos do SGBD, índices, partições

---

## Álgebra Relacional e as Formas Normais

### Fundamentos da Álgebra Relacional (Codd, 1970)

E. F. Codd provou que qualquer consulta sobre dados relacionais pode ser expressa como composição de **seis operações primitivas**:

| Operação | Símbolo | SQL Equivalente | Descrição |
|----------|---------|-----------------|-----------|
| **Seleção** | σ | `WHERE` | Filtra tuplas por predicado |
| **Projeção** | π | `SELECT col1, col2` | Seleciona atributos (colunas) |
| **Produto Cartesiano** | × | `CROSS JOIN` | Combina todas as tuplas |
| **União** | ∪ | `UNION` | Merge de relações compatíveis |
| **Diferença** | − | `EXCEPT` | Tuplas em R mas não em S |
| **Renomeação** | ρ | `AS` | Renomeia relação ou atributo |

**Implicação prática:** Uma query que não pode ser expressa em álgebra relacional é computacionalmente indecidível neste modelo — argumento central para manter integridade nos JOINs.

---

### Formas Normais

A normalização elimina **anomalias de inserção, atualização e remoção** através de dependências funcionais formais.

#### 1FN — Primeira Forma Normal

**Regra:** Todo atributo deve conter apenas **valores atômicos** (indivisíveis); sem grupos repetitivos.

```sql
-- VIOLAÇÃO: campo "telefones" contém lista
CREATE TABLE cliente (
  id SERIAL,
  telefones TEXT  -- "11999, 11888" ← VIOLA 1FN
);

-- CONFORMANTE
CREATE TABLE cliente_telefone (
  cliente_id INT REFERENCES cliente(id),
  telefone   VARCHAR(15) NOT NULL
);
```

#### 2FN — Segunda Forma Normal

**Regra:** Estar em 1FN **e** todo atributo não-chave depender funcionalmente da **chave primária inteira** (elimina dependências parciais em PKs compostas).

| Tabela com Violação | Dependência Parcial |
|---------------------|---------------------|
| `pedido_item(pedido_id, produto_id, nome_produto)` | `nome_produto` depende só de `produto_id` |

#### 3FN — Terceira Forma Normal

**Regra:** Estar em 2FN **e** nenhum atributo não-chave depender transitivamente de outro atributo não-chave.

```
cep → cidade → estado
```
Se `estado` depende de `cidade` e `cidade` depende de `cep`, extrair em tabela própria:

```sql
CREATE TABLE cep_endereco (
  cep    CHAR(8) PRIMARY KEY,
  cidade VARCHAR(100),
  estado CHAR(2)
);
```

#### BCNF — Forma Normal de Boyce-Codd

**Regra:** Para toda dependência funcional X → Y, X deve ser superchave. Resolve ambiguidades que 3FN não detecta com múltiplas chaves candidatas sobrepostas.

---

## Pipeline ER → DER → Modelo Físico

### Estágio 1: Diagrama ER (Conceitual)

O ER captura **o quê existe** no domínio, sem comprometimento com tecnologia.

```
[Cliente] ──(realiza)──< [Pedido] >──(contém)──< [ItemPedido] >──(referencia)── [Produto]
```

**Elementos obrigatórios:**
- Entidades (retângulos)
- Relacionamentos (losangos)
- Atributos (elipses) — identificadores sublinhados
- Cardinalidade mínima/máxima

### Estágio 2: DER (Lógico)

O DER traduz cardinalidades em **chaves estrangeiras** e resolve associações N:M com tabelas de junção.

| Cardinalidade ER | Implementação DER |
|------------------|-------------------|
| 1:1 | FK em qualquer lado (ou tabela única) |
| 1:N | FK no lado N |
| N:M | Tabela associativa com FKs para ambos |

**Exemplo — N:M resolvido:**
```
Pedido (1) ─── (N) ItemPedido (N) ─── (1) Produto
         pedido_id ↑           ↑ produto_id
```

### Estágio 3: Modelo Físico (PostgreSQL)

```sql
CREATE TABLE produto (
  id          SERIAL        PRIMARY KEY,
  sku         VARCHAR(50)   NOT NULL UNIQUE,
  nome        VARCHAR(200)  NOT NULL,
  preco_cents INTEGER       NOT NULL CHECK (preco_cents > 0),
  estoque     INTEGER       NOT NULL DEFAULT 0,
  criado_em   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE pedido (
  id          SERIAL        PRIMARY KEY,
  cliente_id  INTEGER       NOT NULL REFERENCES cliente(id),
  status      VARCHAR(20)   NOT NULL DEFAULT 'pendente'
                            CHECK (status IN ('pendente','pago','cancelado')),
  total_cents INTEGER       NOT NULL CHECK (total_cents >= 0),
  criado_em   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE item_pedido (
  pedido_id   INTEGER  NOT NULL REFERENCES pedido(id)  ON DELETE CASCADE,
  produto_id  INTEGER  NOT NULL REFERENCES produto(id),
  quantidade  INTEGER  NOT NULL CHECK (quantidade > 0),
  preco_cents INTEGER  NOT NULL CHECK (preco_cents > 0),
  PRIMARY KEY (pedido_id, produto_id)
);
```

**Decisões técnicas documentadas:**
- `preco_cents INTEGER` em vez de `DECIMAL` — elimina erros de arredondamento de ponto flutuante
- `CHECK (status IN (...))` — impõe regra de negócio no banco, não só na aplicação
- `ON DELETE CASCADE` — itens órfãos são deletados com o pedido (decisão de domínio)

---

## Rastreabilidade RN → Entidade → Tabela

O artefato da Sprint 2 exige rastreabilidade explícita. Use tabela de mapeamento:

| Regra de Negócio | Entidade Lógica | Tabela Física | Constraint/Índice |
|------------------|-----------------|---------------|-------------------|
| RN01 — SKU único por produto | Produto | `produto` | `UNIQUE (sku)` |
| RN02 — Preço sempre positivo | Produto | `produto` | `CHECK (preco_cents > 0)` |
| RN03 — Pedido vinculado a cliente existente | Pedido | `pedido` | `FK pedido.cliente_id → cliente.id` |
| RN04 — Status limitado a valores válidos | Pedido | `pedido` | `CHECK (status IN (...))` |
| RN05 — Quantidade de item > 0 | ItemPedido | `item_pedido` | `CHECK (quantidade > 0)` |

---

## Migrations DDL com PostgreSQL

### Princípios de Migrations Seguras

1. **Idempotência:** `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX CONCURRENTLY IF NOT EXISTS`
2. **Ordem de dependência:** Tabelas pai antes de filhas
3. **Rollback planejado:** Todo `migration_up` tem `migration_down` correspondente
4. **Sem dados alterados em DDL:** Separar `ALTER TABLE` de migrações de dados

### Estrutura de Arquivo de Migration

```sql
-- migration: 0003_create_pedido_tables.sql
-- up
BEGIN;

CREATE TABLE IF NOT EXISTS pedido (
  id          SERIAL        PRIMARY KEY,
  cliente_id  INTEGER       NOT NULL REFERENCES cliente(id),
  status      VARCHAR(20)   NOT NULL DEFAULT 'pendente',
  total_cents INTEGER       NOT NULL CHECK (total_cents >= 0),
  criado_em   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedido_cliente_id ON pedido(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedido_status     ON pedido(status);

COMMIT;

-- down
BEGIN;
DROP TABLE IF EXISTS pedido CASCADE;
COMMIT;
```

### Estratégia de Indexação

| Tipo de Consulta | Índice Recomendado | Exemplo |
|------------------|--------------------|---------|
| Igualdade em FK | B-Tree (padrão) | `idx_pedido_cliente_id` |
| Intervalo de datas | B-Tree em `TIMESTAMPTZ` | `idx_pedido_criado_em` |
| Texto livre | GIN com `pg_trgm` | `idx_produto_nome_trgm` |
| Igualdade exata (hash estável) | Hash | Apenas PostgreSQL ≥ 10 |

---

## Checklist de Validação

- [ ] Cada entidade do ER possui correspondência em tabela no modelo físico?
- [ ] Todas as relações N:M foram decompostas em tabela associativa?
- [ ] As constraints do banco refletem as RNs numeradas do artefato?
- [ ] Existe índice em todas as FKs (evitar *full table scan* em JOINs)?
- [ ] Os tipos de dados escolhidos evitam perda de precisão (ex: `INTEGER` para moeda)?
- [ ] A tabela de rastreabilidade `RN → tabela → constraint` está atualizada?
- [ ] As migrations executam em ordem reproduzível sem erros de dependência?
- [ ] Existe `migration_down` para cada `migration_up`?

---

## Exercício Prático

### Cenário
Você precisa modelar o domínio de **biblioteca** com os seguintes requisitos:
- Livros podem ter múltiplos autores
- Um autor pode escrever múltiplos livros
- Empréstimos vinculam um cliente a múltiplos livros com datas de devolução
- Multas são calculadas por dia de atraso

### Tarefa 1 — Diagrama ER
Desenhe o diagrama conceitual com entidades, relacionamentos e cardinalidades.

### Tarefa 2 — Modelo Físico
Crie as tabelas em SQL com:
- Chaves primárias compostas onde necessário
- Constraints CHECK para validação de dados
- Índices nas colunas de busca frequente

### Tarefa 3 — Rastreabilidade
Crie uma tabela mapeando 3 regras de negócio para constraints/tabelas.

---

## Ver Também

| Conceito | Documento Relacionado |
|----------|----------------------|
| RNFs de integridade e segurança | [Aula 01 — RNFs](./aula_01_rnf_8_eixos.md) |
| Repository Pattern (acesso a dados) | [Aula 04 — UML/TDD](./aula_04_uml_tdd.md) |
| Migrations em testes | [Aula 10 — Refatoração](./aula_10_refatoracao_testes.md) |

---

## Referências

- **Codd, E.F.** (1970) — *A Relational Model of Data for Large Shared Data Banks* — ACM CACM
- **SWEBOK v3** — *Software Design: Data Design* — IEEE Computer Society
- **DMBOK v2** — *Data Management Body of Knowledge* — DAMA International
- **PostgreSQL 16 Documentation** — *Data Types, Indexes, Constraints*
- **Chen, P.P.** (1976) — *The Entity-Relationship Model* — ACM Transactions on Database Systems

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Dependência Funcional** | X → Y: dado X, Y é determinado unicamente |
| **Chave Candidata** | Conjunto mínimo de atributos que identifica unicamente uma tupla |
| **Superchave** | Qualquer superconjunto de chave candidata |
| **BCNF** | Boyce-Codd Normal Form — versão refinada da 3FN |
| **DDL** | Data Definition Language — `CREATE`, `ALTER`, `DROP` |
| **DML** | Data Manipulation Language — `INSERT`, `UPDATE`, `DELETE`, `SELECT` |
| **Anomalia de Atualização** | Inconsistência gerada por redundância ao atualizar um valor |
| **Migration** | Script versionado que evolui o schema do banco de forma controlada |
| **Full Table Scan** | Varredura completa da tabela — evitada com índices adequados |
| **ON DELETE CASCADE** | Deleção automática de registros filhos ao deletar o registro pai |
