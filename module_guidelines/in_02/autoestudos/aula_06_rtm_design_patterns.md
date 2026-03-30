# Autoestudo: RTM, Design Patterns e Consolidação do Backend

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Perspectiva dos Corpos de Conhecimento](#perspectiva-dos-corpos-de-conhecimento)
3. [Matriz de Rastreabilidade (RTM)](#matriz-de-rastreabilidade-rtm)
4. [Design Patterns Essenciais para Backend Node/TS](#design-patterns-essenciais-para-backend-nodets)
5. [SOLID Aplicado às Camadas MVC](#solid-aplicado-às-camadas-mvc)
6. [Revisão dos 8 Eixos de RNF](#revisão-dos-8-eixos-de-rnf)
7. [Checklist de Validação](#checklist-de-validação)
8. [Referências](#referências)
9. [Glossário](#glossário)

---

## Contexto e Objetivo

A Aula 6 consolida a visão **Computational** do RM-ODP: toda regra de negócio deve estar coberta por ao menos um teste, os fluxos alternativos precisam estar testados, e a **RTM** (Requirements Traceability Matrix) deve ligar `RF → RN → Teste → Evidência`. É também o momento de introduzir Design Patterns defensáveis como mecanismo de controle de entropia do código.

---

## Perspectiva dos Corpos de Conhecimento

### SWEBOK v3 — Software Testing: Test Adequacy

O SWEBOK define **adequação de testes** como o grau em que os casos de teste cobrem os critérios de cobertura selecionados. Para o nível deste projeto:

| Critério | Descrição | Ferramenta |
|----------|-----------|------------|
| **Statement Coverage** | Toda linha executada pelo menos uma vez | `jest --coverage` |
| **Branch Coverage** | Todo `if/else` exercitado nos dois lados | `jest --coverage` |
| **Condition Coverage** | Toda condição booleana avaliada `true` e `false` | Análise manual |

### SWEBOK v3 — Software Maintenance: Traceability

Rastreabilidade bidirecional garante que:
1. Todo requisito foi implementado (cobertura de requisito → código)
2. Todo código pode ser justificado por um requisito (sem código órfão)

---

## Matriz de Rastreabilidade (RTM)

### Estrutura da RTM Completa

| RF | Descrição RF | RN | Descrição RN | Endpoint | Teste | Status Teste | Evidência |
|----|-------------|----|--------------|---------  |-------|--------------|-----------|
| RF01 | Criar produto | RN01 | SKU único | `POST /produtos` | `deve retornar 409 com SKU duplicado` | ✅ PASS | `npm test -- --testNamePattern="SKU"` |
| RF01 | Criar produto | RN02 | Preço > 0 | `POST /produtos` | `deve retornar 400 com preço negativo` | ✅ PASS | — |
| RF02 | Listar produtos | — | — | `GET /produtos` | `deve retornar lista vazia quando não há produtos` | ✅ PASS | — |
| RF03 | Criar pedido | RN03 | Itens obrigatórios | `POST /pedidos` | `deve retornar 422 com itens vazios` | ✅ PASS | — |
| RF03 | Criar pedido | RN04 | Cliente existente | `POST /pedidos` | `deve retornar 404 com cliente inválido` | ✅ PASS | — |

### Como Gerar Evidência Automaticamente

```json
// package.json
{
  "scripts": {
    "test:coverage": "jest --coverage --coverageReporters=text --coverageReporters=html"
  }
}
```

O relatório em `coverage/lcov-report/index.html` serve como **evidência formal** de cobertura para a RTM.

### Fluxos Alternativos — Obrigatórios na RTM

Todo fluxo principal possui fluxos alternativos que também devem estar na RTM:

| Fluxo Principal | Fluxo Alternativo | Teste Necessário |
|----------------|-------------------|------------------|
| Criar produto (sucesso) | Payload inválido (campo faltando) | ✅ Teste de 400 |
| Criar produto (sucesso) | SKU já existente | ✅ Teste de 409 |
| Buscar produto por ID (sucesso) | ID não existe | ✅ Teste de 404 |
| Buscar produto por ID (sucesso) | ID não é número | ✅ Teste de 400 |

---

## Design Patterns Essenciais para Backend Node/TS

### 1. Repository Pattern (GoF — Data Access Object)

**Problema:** Service acoplado diretamente ao ORM/SQL → impossível testar sem banco real.

**Solução:** Interface que abstrai acesso a dados.

```typescript
// Interface (contrato)
interface IProdutoRepository {
  save(produto: CriarProdutoDTO): Promise<Produto>;
  findById(id: number): Promise<Produto | null>;
  findBySku(sku: string): Promise<Produto | null>;
  findAll(): Promise<Produto[]>;
}

// Implementação de produção
class ProdutoRepositoryPg implements IProdutoRepository {
  constructor(private db: Pool) {}

  async findBySku(sku: string): Promise<Produto | null> {
    const result = await this.db.query(
      'SELECT * FROM produto WHERE sku = $1',
      [sku]
    );
    return result.rows[0] ?? null;
  }
  // ...
}

// Implementação para teste (in-memory)
class ProdutoRepositoryMemory implements IProdutoRepository {
  private store: Produto[] = [];

  async findBySku(sku: string): Promise<Produto | null> {
    return this.store.find(p => p.sku === sku) ?? null;
  }
  // ...
}
```

**Benefício no teste:** `new ProdutoService(new ProdutoRepositoryMemory())` — zero I/O.

---

### 2. Strategy Pattern (GoF — Comportamental)

**Problema:** Múltiplos algoritmos intercambiáveis (ex: cálculo de frete por transportadora).

**Solução:** Interface comum + implementações intercambiáveis.

```typescript
interface ICalculadorFrete {
  calcular(peso: number, cep: string): Promise<number>;
}

class FreteCorreios implements ICalculadorFrete {
  async calcular(peso: number, cep: string): Promise<number> { /* ... */ }
}

class FreteJadlog implements ICalculadorFrete {
  async calcular(peso: number, cep: string): Promise<number> { /* ... */ }
}

class PedidoService {
  constructor(
    private pedidoRepo: IPedidoRepository,
    private calculadorFrete: ICalculadorFrete  // injetado
  ) {}
}
```

---

### 3. Factory Pattern (GoF — Criacional)

**Problema:** Criação de objetos complexos espalhada pelo código.

**Solução:** Centralizar criação em função/classe factory.

```typescript
class PedidoFactory {
  static criar(dto: CriarPedidoDTO, produtos: Produto[]): Pedido {
    const itens = dto.itens.map(item => {
      const produto = produtos.find(p => p.id === item.produto_id);
      if (!produto) throw new NotFoundError(`Produto ${item.produto_id} não encontrado`);
      return new ItemPedido(produto, item.quantidade);
    });

    return new Pedido(dto.cliente_id, itens);
  }
}
```

---

## SOLID Aplicado às Camadas MVC

| Princípio | Aplicação no Projeto | Violação Típica |
|-----------|---------------------|-----------------|
| **S** — Single Responsibility | Controller só lida com HTTP; Service só com regras | Controller fazendo query no banco |
| **O** — Open/Closed | Adicionar nova transportadora sem modificar `PedidoService` | `if (frete === 'correios') ... else if (frete === 'jadlog')` |
| **L** — Liskov Substitution | `ProdutoRepositoryMemory` substituível por `ProdutoRepositoryPg` nos testes | Mock que quebra contrato da interface |
| **I** — Interface Segregation | `ILeituraRepository` separado de `IEscritaRepository` quando necessário | Interface com 20 métodos dos quais apenas 3 são usados |
| **D** — Dependency Inversion | Service recebe interface por injeção de dependência | `new ProdutoRepositoryPg()` dentro do Service |

---

## Revisão dos 8 Eixos de RNF

Esta tabela consolida o estado atual dos RNFs ao fechar o backend, no formato exigido pelo artefato da Sprint 3:

| Eixo (ISO/IEC 25010) | RNF Definido | Decisão Técnica Implementada | Status |
|----------------------|--------------|------------------------------|--------|
| Eficiência de Desempenho | Latência p99 ≤ 300ms | Índices B-Tree em FKs e colunas de busca | Parcial |
| Confiabilidade | Disponibilidade 99,9% | Tratamento de erros em todos os endpoints | Parcial |
| Segurança | Dados sensíveis não expostos | Nunca retornar senha/hash em response | ✅ Implementado |
| Usabilidade | Mensagens de erro descritivas | Estrutura padronizada `{message, code, errors}` | ✅ Implementado |
| Manutenibilidade | Cobertura ≥ 80% | `jest --coverage` no CI | Em andamento |
| Adequação Funcional | Todos os RFs cobertos | RTM atualizada | Em andamento |
| Compatibilidade | API consumível por front-end | CORS configurado; JSON padronizado | ✅ Implementado |
| Portabilidade | Executável em Docker | `Dockerfile` presente | Pendente |

---

## Checklist de Validação

- [ ] Cada RN possui ao menos um teste associado na RTM?
- [ ] Fluxos alternativos (erros, casos extremos) estão testados?
- [ ] A RTM está no formato `RF → RN → Endpoint → Teste → Evidência`?
- [ ] Os repositórios implementam interfaces (não classes concretas)?
- [ ] O Service não instancia repositórios diretamente (usa injeção)?
- [ ] A tabela de revisão dos 8 eixos de RNF está preenchida?
- [ ] A cobertura de testes pode ser gerada com `npm test -- --coverage`?
- [ ] Os Design Patterns adotados estão documentados e justificados no artefato?

---

## Exercício Prático

### Cenário
Você precisa refatorar um código com acoplamento forte e adicionar rastreabilidade.

Código original:
```typescript
class PedidoController {
  private repo = new PedidoRepositoryPg(); // acoplamento direto
  private service = new PedidoService(repo);
  
  async criar(req, res) {
    const pedido = await this.service.criar(req.body);
    res.json(pedido);
  }
}
```

### Tarefa 1 — Injeção de Dependência
Refatore para receber dependências via construtor (inversão de dependência).

### Tarefa 2 — RTM
Crie a matriz de rastreabilidade para 3 regras de negócio de pedido.

### Tarefa 3 — Design Pattern
Identifique qual Design Pattern seria útil para calcular impostos de pedidos (estadual, federal, municipal) e implemente a interface.

---

## Evolução do Conceito: RTM

A RTM evolui ao longo das sprints:

| Sprint | Formato | Foco |
|--------|---------|------|
| Sprint 2 | RN → Tabela → Constraint | Rastreabilidade de banco de dados |
| Sprint 3 | RF → RN → Endpoint → Teste | Rastreabilidade de backend |
| Sprint 4 | Persona → RF → Endpoint → Componente → Teste | Rastreabilidade completa front-back |
| Sprint 5 | RTM Final com evidências | Consolidação e validação |

Veja [Aula 09](./aula_09_estado_global_heuristicas.md) para o formato final da RTM.

---

## Ver Também

| Conceito | Documento Relacionado |
|----------|----------------------|
| Diagrama de Classes e TDD | [Aula 04 — UML/TDD](./aula_04_uml_tdd.md) |
| Endpoints e matriz RF | [Aula 05 — REST](./aula_05_rest_endpoints.md) |
| Refatoração de testes | [Aula 10 — Refatoração](./aula_10_refatoracao_testes.md) |

---

## Referências

- **Gamma, E. et al.** (1994) — *Design Patterns: Elements of Reusable Object-Oriented Software* — Addison-Wesley
- **Martin, R.C.** (2000) — *Design Principles and Design Patterns* — ObjectMentor
- **SWEBOK v3** — *Software Testing, Software Maintenance* — IEEE Computer Society
- **Martin, R.C.** (2012) — *The Clean Architecture* — 8thLight Blog

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **RTM** | Requirements Traceability Matrix — mapa bidirecional entre requisitos e artefatos |
| **Repository Pattern** | Padrão que abstrai acesso a dados atrás de interface |
| **Strategy Pattern** | Padrão que permite trocar algoritmos em tempo de execução |
| **Factory Pattern** | Padrão que centraliza a criação de objetos complexos |
| **SOLID** | Cinco princípios de design orientado a objetos (Single Resp., Open/Closed, Liskov, Interface Seg., Dep. Inv.) |
| **Branch Coverage** | Cobertura que garante execução de todos os caminhos condicionais |
| **Injeção de Dependência** | Técnica de fornecer dependências a um objeto externamente |
| **Evidência** | Resultado concreto e reproduzível que comprova atendimento de um critério |
