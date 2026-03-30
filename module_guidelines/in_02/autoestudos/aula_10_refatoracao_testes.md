# Autoestudo: Refatoração de Testes — Mocks, Code Smells e Débito Técnico

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Perspectiva dos Corpos de Conhecimento](#perspectiva-dos-corpos-de-conhecimento)
3. [Taxonomia de Test Doubles](#taxonomia-de-test-doubles)
4. [Code Smells em Testes](#code-smells-em-testes)
5. [Técnicas de Refatoração de Testes](#técnicas-de-refatoração-de-testes)
6. [Débito Técnico — Identificação e Priorização](#débito-técnico--identificação-e-priorização)
7. [Métricas de Qualidade de Testes](#métricas-de-qualidade-de-testes)
8. [Checklist de Validação](#checklist-de-validação)
9. [Referências](#referências)
10. [Glossário](#glossário)

---

## Contexto e Objetivo

A Aula 10 consolida a visão **Computational + Engineering** do RM-ODP com foco em qualidade interna. O artefato da **Sprint 5** exige identificação de duplicações, lacunas e baixa legibilidade nos testes, refatoração com manutenção de cobertura dos fluxos críticos, revisão dos impactos de autenticacao e autorizacao e atualização da RTM pós-refatoração.

---

## Perspectiva dos Corpos de Conhecimento

### SWEBOK v3 — Software Testing: Test Adequacy e Software Maintenance

O SWEBOK define **adequação de testes** não apenas em quantidade (cobertura), mas em **qualidade**:

| Dimensão de Qualidade | Descrição | Problema Típico |
|----------------------|-----------|-----------------|
| **Cobertura** | Quais linhas/branches são exercitados | Cobertura alta com testes frágeis |
| **Legibilidade** | Clareza do que cada teste verifica | Nome genérico "deve funcionar" |
| **Isolamento** | Independência entre testes | Ordem de execução importa |
| **Manutenibilidade** | Custo de atualizar testes | 1 mudança no código → 10 testes quebrando |

### SWEBOK v3 — Software Maintenance: Refactoring

Refatoração é uma técnica de manutenção que melhora a estrutura interna sem alterar o comportamento externo. A pré-condição obrigatória é:

> **Antes de refatorar, garanta que há testes cobrindo o comportamento a ser preservado.**

---

## Taxonomia de Test Doubles

Fowler (2007) definiu formalmente as diferenças entre objetos substitutos em testes:

### Comparativo Completo

| Tipo | O que faz | Jest | Quando usar |
|------|-----------|------|-------------|
| **Dummy** | Passado como argumento, nunca usado | `null` ou objeto vazio | Parâmetros obrigatórios irrelevantes |
| **Stub** | Retorna valor fixo pré-configurado | `jest.fn().mockReturnValue(x)` | Controlar retorno de dependência |
| **Fake** | Implementação real simplificada | In-memory repository | Substituir banco de dados em testes |
| **Spy** | Registra chamadas, delega ao real | `jest.spyOn(obj, 'method')` | Verificar efeitos colaterais sem substituir |
| **Mock** | Substituto com expectativas verificáveis | `jest.fn()` + `expect(...).toHaveBeenCalledWith(...)` | Verificar interações exatas |

### Exemplos em Jest

```typescript
// STUB — controla o retorno
const mockRepo = {
  findById: jest.fn().mockResolvedValue({ id: 1, nome: 'Produto A' })
};

// MOCK — verifica a interação
const mockEmailService = {
  enviarConfirmacao: jest.fn()
};
// Após ação:
expect(mockEmailService.enviarConfirmacao).toHaveBeenCalledWith(
  expect.objectContaining({ destinatario: 'joao@teste.com' })
);

// SPY — intercepta sem substituir completamente
const spy = jest.spyOn(pedidoService, 'calcularTotal');
await pedidoService.criar(dto);
expect(spy).toHaveBeenCalledTimes(1);
spy.mockRestore(); // restaura comportamento original

// FAKE — implementação real simplificada
class ProdutoRepositoryFake implements IProdutoRepository {
  private store: Map<number, Produto> = new Map();

  async findById(id: number): Promise<Produto | null> {
    return this.store.get(id) ?? null;
  }
  async save(p: Produto): Promise<Produto> {
    const saved = { ...p, id: this.store.size + 1 };
    this.store.set(saved.id, saved);
    return saved;
  }
}
```

### Quando NÃO usar Mock

Fowler adverte: **mock excessivo acopla o teste à implementação**, não ao comportamento.

```typescript
// RUIM — teste frágil (acopla à implementação interna)
it('deve chamar repo.findById antes de repo.save', async () => {
  const callOrder: string[] = [];
  mockRepo.findById.mockImplementation(() => { callOrder.push('findById'); return null; });
  mockRepo.save.mockImplementation(() => { callOrder.push('save'); return produto; });

  await service.criar(dto);
  expect(callOrder).toEqual(['findById', 'save']); // FRÁGIL: depende de ordem interna
});

// BOM — testa comportamento observável
it('deve retornar produto criado com id gerado', async () => {
  const result = await service.criar(dto);
  expect(result.id).toBeDefined();
  expect(result.nome).toBe(dto.nome);
});
```

---

## Code Smells em Testes

Adaptado de Mäntylä et al. — *A Taxonomy of Bad Code Smells* aplicado a testes:

### 1. Test Too Long (Teste Muito Longo)

```typescript
// SMELL: um único teste verificando múltiplas responsabilidades
it('deve criar produto, buscar por id, atualizar e deletar', async () => { /* 80 linhas */ });

// REFATORADO: um comportamento por teste
it('deve criar produto com dados válidos', async () => { /* 10 linhas */ });
it('deve encontrar produto por id existente', async () => { /* 8 linhas */ });
```

### 2. Mystery Guest (Dependência Oculta)

```typescript
// SMELL: depende de estado global criado por outro teste
let produtoId: number; // variável global no arquivo de teste

it('cria produto', async () => {
  const p = await service.criar(dto);
  produtoId = p.id; // ← contamina outros testes
});

it('busca produto', async () => {
  const p = await service.findById(produtoId); // ← depende do teste anterior
});

// REFATORADO: setup explícito em cada teste
it('busca produto criado', async () => {
  const criado = await service.criar(dto); // arrange explícito
  const encontrado = await service.findById(criado.id);
  expect(encontrado).toMatchObject({ id: criado.id });
});
```

### 3. Assertion Roulette (Asserções sem Contexto)

```typescript
// SMELL: múltiplas asserções sem mensagem explicativa
expect(result).toBeDefined();
expect(result.length).toBeGreaterThan(0);
expect(result[0].ativo).toBe(true);

// REFATORADO: nomes de teste e asserções diretas
it('deve retornar apenas produtos ativos', async () => {
  const ativos = await service.listar({ apenasAtivos: true });
  expect(ativos.every(p => p.ativo)).toBe(true);
});
```

### 4. Eager Test (Teste Ansioso)

Teste que verifica mais do que deveria para o caso de uso descrito.

```typescript
// SMELL: POST /produtos verificando campos que não são responsabilidade do endpoint
it('deve criar produto', async () => {
  const res = await request(app).post('/produtos').send(dto);
  expect(res.body.criado_em).toMatch(/^\d{4}-\d{2}-\d{2}/); // irrelevante para o comportamento
  expect(res.body.atualizado_em).toBeDefined();               // irrelevante
  expect(res.body.id).toBeGreaterThan(0);                    // único relevante
});
```

---

## Técnicas de Refatoração de Testes

### 1. Extrair Setup Comum para `beforeEach`

```typescript
// ANTES: setup repetido em cada teste
it('teste A', async () => {
  const repo = new ProdutoRepositoryFake();
  const service = new ProdutoService(repo);
  // ...
});
it('teste B', async () => {
  const repo = new ProdutoRepositoryFake();
  const service = new ProdutoService(repo);
  // ...
});

// DEPOIS: setup centralizado
describe('ProdutoService', () => {
  let service: ProdutoService;
  let repo: ProdutoRepositoryFake;

  beforeEach(() => {
    repo = new ProdutoRepositoryFake();
    service = new ProdutoService(repo);
  });

  it('teste A', async () => { /* usa service e repo limpos */ });
  it('teste B', async () => { /* usa service e repo limpos */ });
});
```

### 2. Builders de Fixtures

```typescript
// Factory para criar dados de teste com defaults sensatos
function criarDtoProduto(overrides: Partial<CriarProdutoDTO> = {}): CriarProdutoDTO {
  return {
    sku: 'SKU-001',
    nome: 'Produto Teste',
    preco_cents: 9990,
    estoque: 10,
    ...overrides
  };
}

// Uso: limpo e expressivo
const dto = criarDtoProduto({ preco_cents: -1 }); // só muda o relevante
```

### 3. Renomeação Expressiva

| Antes | Depois |
|-------|--------|
| `it('test1')` | `it('deve retornar 404 quando produto não existe')` |
| `it('erro')` | `it('deve lançar ValidationError com campos inválidos')` |
| `it('funciona')` | `it('deve calcular total como soma de itens × preço')` |

---

## Débito Técnico — Identificação e Priorização

### Quadrante de Martin Fowler

```
              DELIBERADO        INADVERTIDO
             ┌──────────────┬──────────────┐
IMPRUDENTE   │ "Não temos   │ "O que é     │
             │ tempo para   │ arquitetura  │
             │ design"      │ em camadas?" │
             ├──────────────┼──────────────┤
PRUDENTE     │ "Vamos ship  │ "Agora       │
             │ e depois     │ sabemos que  │
             │ refatorar"   │ deveríamos   │
             │              │ ter feito X" │
             └──────────────┴──────────────┘
```

O débito **prudente e deliberado** (deploy rápido com refatoração planejada) é aceitável com documentação explícita. Os outros três quadrantes representam problemas a corrigir.

### Priorização de Débito no Artefato Sprint 5

| Débito Identificado | Quadrante | Impacto | Prioridade |
|--------------------|-----------|---------|------------|
| Testes sem isolamento (global state) | Inadvertido | Alto — falsos negativos | 🔴 Alta |
| Cobertura < 80% em `PedidoService` | Deliberado/Prudente | Médio | 🟡 Média |
| Nomes genéricos em testes | Inadvertido | Baixo — só legibilidade | 🟢 Baixa |
| Service sem interface (acoplamento) | Inadvertido | Alto — impossível mockar | 🔴 Alta |

---

## Métricas de Qualidade de Testes

### Geração com Jest

```bash
# Cobertura com relatório HTML
npx jest --coverage --coverageDirectory=coverage

# Cobertura por arquivo
npx jest --coverage --coverageReporters=text
```

### Interpretação das Métricas

| Métrica | O que mede | Meta mínima |
|---------|-----------|-------------|
| **Statements** | Linhas executadas | ≥ 80% |
| **Branches** | `if/else`, ternários | ≥ 75% |
| **Functions** | Funções chamadas | ≥ 80% |
| **Lines** | Similar a Statements | ≥ 80% |

**Atenção:** Alta cobertura não garante bons testes. Um teste que executa o código mas não tem `expect` conta na cobertura.

---

## Checklist de Validação

- [ ] Os testes foram classificados por tipo (Mock, Stub, Fake, Spy) na documentação?
- [ ] Cada teste verifica um único comportamento?
- [ ] Os nomes dos testes descrevem o comportamento esperado (não o método chamado)?
- [ ] Não há dependência de ordem de execução entre testes?
- [ ] Setup comum está em `beforeEach`, não repetido em cada `it`?
- [ ] A cobertura de fluxos críticos foi mantida após refatoração?
- [ ] O débito técnico identificado está documentado com priorização?
- [ ] A RTM foi atualizada para refletir os novos nomes de teste após refatoração?

---

## Exercício Prático

### Cenário
Você herdou um arquivo de testes com code smells e precisa refatorar mantendo a cobertura.

Código original:
```typescript
let produtoId: number; // variável global

it('teste 1', async () => {
  const p = await service.criar({ sku: 'X', nome: 'Y', preco_cents: 100 });
  produtoId = p.id;
  expect(produtoId).toBeDefined();
});

it('teste 2', async () => {
  const p = await service.findById(produtoId); // depende do teste 1!
  expect(p.nome).toBe('Y');
});

it('teste 3', async () => {
  const p = await service.findById(produtoId);
  expect(p).toBeDefined();
  expect(p.nome).toBe('Y');
  expect(p.preco_cents).toBe(100);
  expect(p.ativo).toBe(true);
});
```

### Tarefa 1 — Identificar Code Smells
Liste todos os code smells presentes (mínimo 4).

### Tarefa 2 — Refatorar
Reescreva os testes:
- Setup explícito em cada teste (sem variável global)
- Um comportamento por teste
- Nomes expressivos

### Tarefa 3 — Builders de Fixture
Crie uma função `criarDtoProduto(overrides)` para simplificar o arrange.

---

## Evolução do Conceito: Taxonomia de Test Doubles

Esta aula detalha a taxonomia completa de Test Doubles. Veja também:

| Documento | Conceito Relacionado |
|-----------|---------------------|
| [Aula 04](./aula_04_uml_tdd.md) | Introdução ao TDD e mocks básicos |
| [Aula 06](./aula_06_rtm_design_patterns.md) | Repository Pattern com injeção de dependência |
| [Aula 08](./aula_08_async_integracao.md) | Mocks em testes assíncronos |

---

## Ver Também

| Conceito | Documento Relacionado |
|----------|----------------------|
| TDD e ciclo Red-Green-Refactor | [Aula 04 — UML/TDD](./aula_04_uml_tdd.md) |
| Repository Pattern e interfaces | [Aula 06 — RTM](./aula_06_rtm_design_patterns.md) |
| RTM e evidências de teste | [Aula 09 — Estado Global](./aula_09_estado_global_heuristicas.md) |

---

## Referências

- **Fowler, M.** (2007) — *Mocks Aren't Stubs* — martinfowler.com
- **Mäntylä, M.V.; Lassenius, C.** (2006) — *Subjective Evaluation of Software Evolvability Using Code Smells* — Empirical Software Engineering
- **SWEBOK v3** — *Software Testing: Test Adequacy, Software Maintenance* — IEEE Computer Society
- **Beck, K.** (2002) — *Test-Driven Development: By Example* — Addison-Wesley
- **Fowler, M.** (2018) — *Refactoring: Improving the Design of Existing Code (2nd ed.)* — Addison-Wesley

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Test Double** | Objeto substituto usado em testes no lugar de uma dependência real |
| **Mock** | Test double com expectativas de interação verificáveis |
| **Stub** | Test double que retorna valores pré-configurados |
| **Spy** | Test double que registra chamadas e delega ao objeto real |
| **Fake** | Implementação real simplificada usada em testes |
| **Code Smell** | Sinal no código que sugere um problema de design (não necessariamente um bug) |
| **Débito Técnico** | Custo implícito de escolhas de design que dificultam evolução futura |
| **Cobertura de Ramos** | Percentual de caminhos condicionais executados pelos testes |
| **Fixture** | Dados de teste pré-configurados para setup de cenários |
| **Mystery Guest** | Code smell: teste depende de estado externo oculto |
