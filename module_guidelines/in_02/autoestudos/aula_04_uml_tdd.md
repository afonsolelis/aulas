# Autoestudo: UML Comportamental e TDD — Diagrama de Classes, Sequência e Ciclo Red-Green-Refactor

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Perspectiva dos Corpos de Conhecimento](#perspectiva-dos-corpos-de-conhecimento)
3. [Diagrama de Classes — Camadas MVC](#diagrama-de-classes--camadas-mvc)
4. [Diagrama de Sequência UML](#diagrama-de-sequência-uml)
5. [Configuração do Jest — Passo a Passo](#configuração-do-jest--passo-a-passo)
6. [TDD — Ciclo Red → Green → Refactor](#tdd--ciclo-red--green--refactor)
7. [Testes Vinculados às Regras de Negócio (RN)](#testes-vinculados-às-regras-de-negócio-rn)
8. [Contratos de Entrada e Saída](#contratos-de-entrada-e-saída)
9. [Proteção Contra Refatoração Indevida](#proteção-contra-refatoração-indevida)
10. [Checklist de Validação](#checklist-de-validação)
11. [Referências](#referências)
12. [Glossário](#glossário)

---

## Contexto e Objetivo

A Aula 4 inicia a visão **Computational** do RM-ODP: o domínio mapeado nos artefatos anteriores precisa ser decomposto em objetos, responsabilidades e interações verificáveis. O artefato da **Sprint 3** exige Diagrama de Classes com as quatro camadas, Diagrama de Sequência para ao menos um fluxo prioritário e pelo menos um teste Jest por caso de uso.

---

## Perspectiva dos Corpos de Conhecimento

### SWEBOK v3 — Software Design: Structural and Behavioral Design

O SWEBOK distingue dois eixos complementares no design de software:

| Eixo | Diagrama UML | Responde a |
|------|-------------|------------|
| **Estrutural** | Diagrama de Classes | "Quais entidades existem e como se relacionam?" |
| **Comportamental** | Diagrama de Sequência, Atividade, Estado | "Como as entidades interagem para realizar um caso de uso?" |

A combinação dos dois eixos é obrigatória: estrutura sem comportamento não prova que o sistema funciona; comportamento sem estrutura não guia a implementação.

### SWEBOK v3 — Software Testing: Unit Testing

Testes unitários, segundo o SWEBOK, devem:
1. Ser **independentes** entre si (sem dependência de estado compartilhado)
2. Cobrir **um único comportamento** por teste
3. Ser **rápidos** — feedback em milissegundos, não segundos
4. Ser **repetíveis** — mesmo resultado em qualquer ambiente

---

## Diagrama de Classes — Camadas MVC

### Responsabilidades por Camada

```
┌─────────────────────────────────────────────────────────┐
│  HTTP Request                                           │
│         ↓                                               │
│  ┌──────────────┐                                       │
│  │  Controller  │  Recebe HTTP, valida formato,         │
│  │              │  delega para Service, retorna HTTP     │
│  └──────┬───────┘                                       │
│         ↓                                               │
│  ┌──────────────┐                                       │
│  │   Service    │  Orquestra regras de negócio,         │
│  │              │  chama Repository, lança exceções     │
│  └──────┬───────┘                                       │
│         ↓                                               │
│  ┌──────────────┐                                       │
│  │  Repository  │  Abstração de acesso a dados          │
│  │  (interface) │  (isola DB da lógica de negócio)      │
│  └──────┬───────┘                                       │
│         ↓                                               │
│  ┌──────────────┐                                       │
│  │    Model     │  Estrutura de dados do domínio        │
│  │   (Entity)   │  (tipagem, invariantes)               │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

### Notação UML — Elementos Essenciais do Diagrama de Classes

| Símbolo | Significado | Quando usar |
|---------|-------------|-------------|
| `+` prefixo | Público | Métodos da interface externa |
| `-` prefixo | Privado | Atributos e helpers internos |
| `#` prefixo | Protegido | Herança controlada |
| `──►` sólida | Associação/Dependência | Controller → Service |
| `──▷` sólida | Herança | `PagamentoService extends BaseService` |
| `──◇` tracejada | Realização | `ProdutoRepository implements IProdutoRepository` |

### Exemplo — Diagrama de Classes (Caso de Uso: Criar Pedido)

```
┌─────────────────────────┐         ┌─────────────────────────┐
│   PedidoController      │──────►  │    PedidoService        │
├─────────────────────────┤         ├─────────────────────────┤
│ +criar(req, res): void  │         │ -repo: IPedidoRepository│
└─────────────────────────┘         │ +criar(dto): Pedido     │
                                    │ +listar(): Pedido[]     │
                                    └──────────┬──────────────┘
                                               │ implements
                                    ┌──────────▼──────────────┐
                                    │  IPedidoRepository      │
                                    ├─────────────────────────┤
                                    │ +save(pedido): Pedido   │
                                    │ +findById(id): Pedido   │
                                    └─────────────────────────┘
```

**Princípio de Inversão de Dependência (SOLID — D):** `PedidoService` depende de `IPedidoRepository` (interface), não de uma implementação concreta. Isso permite injetar mocks em testes sem alterar o código de produção.

---

## Diagrama de Sequência UML

### Elementos do Diagrama de Sequência

| Elemento | Notação | Descrição |
|----------|---------|-----------|
| **Ator/Participante** | Retângulo + linha de vida (`─ ─`) | Objeto que interage |
| **Mensagem síncrona** | `───►` com rótulo | Chamada que aguarda retorno |
| **Retorno** | `- - -►` tracejado | Valor de retorno |
| **Ativação** | Retângulo sobre linha de vida | Período de execução |
| **Alt/Opt** | Fragmento com guarda `[condição]` | Fluxos alternativos |

### Exemplo — Sequência: POST /pedidos (fluxo de sucesso)

```
Client      Controller       PedidoService      PedidoRepo     DB
  │                │                │                │           │
  │─POST /pedidos─►│                │                │           │
  │                │─criar(dto)────►│                │           │
  │                │                │─validar()      │           │
  │                │                │─calcularTotal()│           │
  │                │                │─save(pedido)──►│           │
  │                │                │                │─INSERT───►│
  │                │                │                │◄──pedido──│
  │                │                │◄───pedido──────│           │
  │                │◄──pedido───────│                │           │
  │◄──201 Created──│                │                │           │
```

**Fluxo alternativo — validação falha:**
```
  │─POST /pedidos─►│
  │                │─criar(dto)────►│
  │                │                │─validar() → erro
  │                │◄──ValidationError
  │◄──400 Bad Req──│
```

---

## Configuração do Jest — Passo a Passo

### Instalação e Configuração Inicial

```bash
# Instalar Jest e dependências TypeScript
npm install --save-dev jest ts-jest @types/jest typescript

# Inicializar configuração do Jest
npx jest --init
```

### `jest.config.ts` — Configuração Recomendada

```typescript
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.controller.ts',    // Controllers testados via integração
    '!src/**/*.config.ts',
    '!src/main.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  verbose: true,
  silent: false
};

export default config;
```

### `package.json` — Scripts de Teste

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:coverage:html": "jest --coverage --coverageReporters=html",
    "test:ci": "jest --coverage --ci --maxWorkers=2"
  }
}
```

### Estrutura de Diretórios Recomendada

```
src/
├── controllers/
│   └── produto.controller.ts
├── services/
│   └── produto.service.ts
├── repositories/
│   ├── interfaces/
│   │   └── produto.repository.interface.ts
│   └── produto.repository.ts
├── models/
│   └── produto.model.ts
└── __tests__/
    ├── services/
    │   └── produto.service.test.ts
    └── repositories/
        └── produto.repository.test.ts
```

---

## TDD — Ciclo Red → Green → Refactor

### O Ciclo Fundamental (Kent Beck)

```
   ┌──────────────────────────────────────────────┐
   │                                              │
   │   ①RED       ②GREEN       ③REFACTOR         │
   │  Escreva    Escreva o     Melhore o         │
   │  teste      código mínimo código mantendo   │
   │  que falha  para passar   os testes verdes  │
   │                                              │
   └──────────────────────────────────────────────┘
```

### Por que Red Primeiro?

1. **Prova que o teste funciona:** Um teste que não falha antes do código pode estar errado ou testar nada.
2. **Define o contrato antes da implementação:** Force o design da API antes de escrever código.
3. **Documenta o comportamento esperado:** O teste é a especificação executável.

### Estrutura de Teste Jest — Padrão AAA

```typescript
// Arrange → Act → Assert
describe('PedidoService', () => {
  describe('criar', () => {

    it('deve retornar pedido com status pendente ao criar com dados válidos', async () => {
      // Arrange
      const mockRepo = {
        save: jest.fn().mockResolvedValue({
          id: 1,
          status: 'pendente',
          total_cents: 5000
        })
      };
      const service = new PedidoService(mockRepo as IPedidoRepository);
      const dto = { cliente_id: 1, itens: [{ produto_id: 1, quantidade: 2 }] };

      // Act
      const result = await service.criar(dto);

      // Assert
      expect(result.status).toBe('pendente');
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it('deve lançar ValidationError quando lista de itens está vazia', async () => {
      // Arrange
      const mockRepo = { save: jest.fn() };
      const service = new PedidoService(mockRepo as IPedidoRepository);
      const dto = { cliente_id: 1, itens: [] };

      // Act & Assert
      await expect(service.criar(dto))
        .rejects
        .toThrow('Pedido deve ter ao menos um item');
    });

  });
});
```

### Anatomia de um Bom Teste

| Critério | ✅ Bom | ❌ Ruim |
|----------|--------|---------|
| **Nome** | `deve lançar erro ao criar pedido sem itens` | `teste1` |
| **Escopo** | Um único comportamento por `it()` | Múltiplos asserts verificando coisas não relacionadas |
| **Isolamento** | Usa mock para dependências externas | Chama banco real ou filesystem |
| **Determinismo** | Resultado idêntico em toda execução | Depende de data/hora ou rede |

---

## Testes Vinculados às Regras de Negócio (RN)

### Matriz RN → Teste — Estrutura Obrigatória

Cada Regra de Negócio (RN) deve ter **pelo menos um teste** que a valide. Esta matriz garante que nenhuma regra fique sem cobertura:

| RN | Descrição | Teste Unitário | Status | Evidência |
|----|-----------|----------------|--------|-----------|
| RN01 | SKU único por produto | `deve retornar erro ao criar produto com SKU duplicado` | ✅ | `npm test -- --testNamePattern="SKU"` |
| RN02 | Preço sempre positivo | `deve retornar erro ao criar produto com preço negativo` | ✅ | — |
| RN03 | Pedido deve ter itens | `deve lançar erro ao criar pedido sem itens` | ✅ | — |
| RN04 | Cliente deve existir | `deve lançar erro ao criar pedido com cliente inexistente` | ✅ | — |

### Exemplo Completo: Teste Vinculado a Múltiplas RNs

```typescript
/**
 * REGRAS DE NEGÓCIO VINCULADAS:
 * - RN01: SKU único por produto
 * - RN02: Preço sempre positivo
 * - RN05: Nome do produto é obrigatório
 * 
 * ARTEFATO: sprint_03_artefato.md
 * AULA: Aula 4 - Back-End I
 */

describe('ProdutoService', () => {
  let service: ProdutoService;
  let mockRepository: IProdutoRepository;

  beforeEach(() => {
    // Fake Repository - isola o teste do banco de dados real
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      findAll: jest.fn()
    };
    service = new ProdutoService(mockRepository);
  });

  describe('criar', () => {
    // ============================================
    // RN02 - Preço sempre positivo
    // ============================================
    it('deve lançar ValidationError ao criar produto com preço negativo', async () => {
      // Arrange
      const dto: CriarProdutoDTO = {
        sku: 'PROD-001',
        nome: 'Produto Teste',
        preco_cents: -100,  // VIOLA RN02
        estoque: 10
      };

      // Act & Assert
      await expect(service.criar(dto))
        .rejects
        .toThrow(ValidationError);
      
      await expect(service.criar(dto))
        .rejects
        .toThrow('Preço deve ser positivo');
      
      // Garante que o repositório NÃO foi chamado (regra violada antes de persistir)
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    // ============================================
    // RN05 - Nome do produto é obrigatório
    // ============================================
    it('deve lançar ValidationError ao criar produto sem nome', async () => {
      // Arrange
      const dto: CriarProdutoDTO = {
        sku: 'PROD-001',
        nome: '',  // VIOLA RN05
        preco_cents: 1000,
        estoque: 10
      };

      // Act & Assert
      await expect(service.criar(dto))
        .rejects
        .toThrow(ValidationError);
      
      await expect(service.criar(dto))
        .rejects
        .toThrow('Nome é obrigatório');
      
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    // ============================================
    // RN01 - SKU único por produto
    // ============================================
    it('deve lançar ConflitoError ao criar produto com SKU duplicado', async () => {
      // Arrange
      const dto: CriarProdutoDTO = {
        sku: 'PROD-001',
        nome: 'Produto Teste',
        preco_cents: 1000,
        estoque: 10
      };

      // Simula que o SKU já existe no banco
      mockRepository.findBySku = jest.fn()
        .mockResolvedValue({ id: 1, sku: 'PROD-001', nome: 'Produto Existente' });

      // Act & Assert
      await expect(service.criar(dto))
        .rejects
        .toThrow(ConflitoError);
      
      await expect(service.criar(dto))
        .rejects
        .toThrow('SKU já cadastrado');
      
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    // ============================================
    // Fluxo Principal - Todas as RNs satisfeitas
    // ============================================
    it('deve criar produto quando todas as regras forem satisfeitas', async () => {
      // Arrange
      const dto: CriarProdutoDTO = {
        sku: 'PROD-001',
        nome: 'Produto Teste',
        preco_cents: 1000,
        estoque: 10
      };

      const produtoEsperado = {
        id: 1,
        ...dto,
        criado_em: new Date(),
        atualizado_em: new Date()
      };

      mockRepository.findBySku = jest.fn().mockResolvedValue(null);
      mockRepository.save = jest.fn().mockResolvedValue(produtoEsperado);

      // Act
      const resultado = await service.criar(dto);

      // Assert
      expect(resultado).toMatchObject({
        id: 1,
        sku: 'PROD-001',
        nome: 'Produto Teste',
        preco_cents: 1000
      });
      
      expect(mockRepository.findBySku).toHaveBeenCalledWith('PROD-001');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ sku: 'PROD-001' })
      );
    });
  });
});
```

### Comentário de Cabeçalho — Padrão Obrigatório

Todo arquivo de teste deve iniciar com um cabeçalho documentando o vínculo com as regras de negócio:

```typescript
/**
 * ARQUIVO: produto.service.test.ts
 * 
 * REGRAS DE NEGÓCIO COBERTAS:
 * - RN01: SKU único por produto
 * - RN02: Preço sempre positivo
 * - RN05: Nome do produto é obrigatório
 * 
 * VÍNCULO COM ARTEFATOS:
 * - sprint_03_artefato.md (Backend e API)
 * - Aula 4 - Back-End I (TDD iniciado)
 * 
 * HISTÓRICO:
 * - 2024-03-15: Criação dos testes para RN01, RN02, RN05
 * - 2024-03-20: Adicionado teste de fluxo principal
 * 
 * ⚠️ ATENÇÃO: Estes testes protegem as regras de negócio.
 * Qualquer refatoração que quebrar estes testes deve ser
 * analisada com o responsável pelo artefato.
 */
```

---

## Proteção Contra Refatoração Indevida

### Por que Testes Protegem Contra IA e Refatoração Acidental?

Testes bem escritos funcionam como uma **rede de proteção** que:

1. **Impede que IA alucine** — Se a IA sugerir remover uma validação, o teste falha
2. **Documenta o comportamento esperado** — O teste é a especificação executável
3. **Detecta regressão imediatamente** — Feedback em milissegundos no CI/CD

### Exemplo: Teste que Impede Remoção de Validação

```typescript
/**
 * ⚠️ ESTE TESTE IMPEDE A REMOÇÃO DA VALIDAÇÃO DE PREÇO
 * 
 * Se alguém (humano ou IA) tentar remover a validação
 * `if (dto.preco_cents <= 0)`, este teste falhará:
 */
it('deve lançar ValidationError ao criar produto com preço negativo', async () => {
  const dto: CriarProdutoDTO = {
    sku: 'PROD-001',
    nome: 'Produto Teste',
    preco_cents: -100,  // Dados inválidos
    estoque: 10
  };

  // Se a validação for removida, o teste abaixo FALHA
  // porque não lançará erro
  await expect(service.criar(dto))
    .rejects
    .toThrow(ValidationError);
  
  // Garante que a regra foi aplicada ANTES de persistir
  expect(mockRepository.save).not.toHaveBeenCalled();
});
```

### Resultado de Teste Falhando — Exemplo

```
 FAIL  src/__tests__/services/produto.service.test.ts
  ProdutoService
    criar
      ✕ deve lançar ValidationError ao criar produto com preço negativo (15 ms)

  ● ProdutoService › criar › deve lançar ValidationError ao criar produto com preço negativo

    expect(received).rejects.toThrow()

    Received promise resolved instead of rejected
    Resolved to value: {"id": 1, "nome": "Produto Teste", "preco_cents": -100, "sku": "PROD-001"}

      45 |
      46 |       // Act & Assert
    > 47 |       await expect(service.criar(dto))
         |             ^
      48 |         .rejects
      49 |         .toThrow(ValidationError);
      50 |
```

Este erro indica que a validação **foi removida ou quebrada** — o sistema agora aceita preços negativos, o que viola a RN02.

### Contrato de Teste — Cláusula de Proteção

Adicione este comentário em **todo teste crítico**:

```typescript
/**
 * 🔒 CONTRATO DE TESTE - NÃO REMOVER
 * 
 * Este teste protege a Regra de Negócio RN02: "Preço sempre positivo".
 * 
 * Se este teste falhar após uma refatoração:
 * 1. NÃO remova o teste
 * 2. Restaure a validação no código
 * 3. Se a regra mudou, atualize a documentação (artefato + RN)
 * 4. Consulte o responsável pelo artefato antes de mergear
 * 
 * Última verificação: 2024-03-20
 */
```

### Boas Práticas para Testes de Proteção

| Prática | Descrição | Exemplo |
|---------|-----------|---------|
| **Nome explícito** | O nome deve descrever a regra protegida | `deve lançar erro ao preço for negativo` |
| **Assert única** | Um comportamento por teste | Não misturar validação de preço com SKU |
| **Isolamento total** | Sem dependência de banco ou rede | Usar Fake Repository |
| **Comentário de vínculo** | Documentar qual RN o teste protege | `// RN02: Preço sempre positivo` |
| **Mensagem de erro clara** | A exceção deve explicar a regra violada | `'Preço deve ser positivo'` |

---

## Contratos de Entrada e Saída

### Definição Formal de Contrato (Design by Contract — Meyer)

Um contrato define:
- **Pré-condição:** O que o chamador deve garantir antes de invocar o método
- **Pós-condição:** O que o método garante ao retornar
- **Invariante:** Condição sempre verdadeira durante a vida do objeto

```typescript
interface CriarPedidoDTO {
  cliente_id: number;         // pré-condição: > 0 e cliente existente
  itens: {
    produto_id: number;       // pré-condição: > 0 e produto existente
    quantidade: number;       // pré-condição: >= 1
  }[];                        // pré-condição: length >= 1
}

interface PedidoResponse {
  id: number;                 // pós-condição: valor gerado pelo banco
  status: 'pendente';         // pós-condição: sempre 'pendente' ao criar
  total_cents: number;        // pós-condição: soma de itens × preço
  criado_em: string;          // pós-condição: ISO 8601 timestamp
}

// Erros possíveis (parte do contrato)
// 400 ValidationError: itens vazios, quantidade <= 0
// 404 NotFoundError: cliente_id ou produto_id inexistente
// 500 InternalError: falha ao persistir
```

**Documentar contratos** antes de implementar é o equivalente ao TDD no nível de API: define expectativas antes do código.

---

## Checklist de Validação

### Diagramas UML
- [ ] O Diagrama de Classes cobre as quatro camadas: Controller, Service, Repository, Model?
- [ ] As dependências entre camadas seguem a direção descendente (nunca Repository → Controller)?
- [ ] Service depende de interface do Repository (não de implementação concreta)?
- [ ] O Diagrama de Sequência cobre o fluxo de sucesso com todas as camadas?
- [ ] Existe ao menos um fragmento `alt` para o fluxo alternativo principal?

### Testes Unitários (Jest)
- [ ] Cada caso de uso tem um `describe` com ao menos um teste de sucesso e um de falha?
- [ ] Os testes seguem o padrão AAA (Arrange, Act, Assert)?
- [ ] Os contratos de entrada/saída estão tipados em TypeScript?
- [ ] Os testes estão isolados (sem IO real: banco, rede, filesystem)?

### Vínculo com Regras de Negócio
- [ ] Cada RN tem pelo menos um teste associado?
- [ ] Cada teste tem comentário vinculando à RN protegida?
- [ ] A matriz RN → Teste está preenchida?
- [ ] Os nomes dos testes descrevem as regras protegidas?

### Proteção Contra Refatoração
- [ ] Os testes críticos têm contrato de proteção (cláusula "NÃO REMOVER")?
- [ ] O cabeçalho do arquivo documenta todas as RNs cobertas?
- [ ] Os testes falham quando uma regra é violada?
- [ ] Os testes passam quando todas as regras são satisfeitas?

---

## Exercício Prático

### Cenário
Você precisa implementar o caso de uso **Cancelar Pedido** com as seguintes regras:

| RN | Descrição |
|----|-----------|
| RN06 | Só pode cancelar pedidos com status "pendente" |
| RN07 | Cancelamento deve estornar itens ao estoque |
| RN08 | Deve lançar erro se pedido não existir |
| RN09 | Deve lançar erro se pedido já estiver cancelado |

### Tarefa 1 — Diagrama de Classes
Adicione ao diagrama existente as classes/métodos para `PedidoController.cancelar(id)` e `PedidoService.cancelar(id)`.

### Tarefa 2 — Diagrama de Sequência
Desenhe o fluxo de cancelamento incluindo todas as 4 camadas.

### Tarefa 3 — Testes TDD Vinculados às RNs

Escreva **4 testes** (um por regra de negócio):

```typescript
describe('PedidoService.cancelar', () => {
  // RN06
  it('deve cancelar pedido com status pendente', async () => {...});
  
  // RN07
  it('deve estornar itens ao estoque ao cancelar pedido', async () => {...});
  
  // RN08
  it('deve lançar NotFoundError ao cancelar pedido inexistente', async () => {...});
  
  // RN09
  it('deve lançar ConflitoError ao cancelar pedido já cancelado', async () => {...});
});
```

### Tarefa 4 — Matriz RN → Teste

Preencha a matriz de rastreabilidade:

| RN | Teste Unitário | Status |
|----|---------------|--------|
| RN06 | `deve cancelar pedido com status pendente` | ⬜ |
| RN07 | `deve estornar itens ao estoque ao cancelar pedido` | ⬜ |
| RN08 | `deve lançar NotFoundError ao cancelar pedido inexistente` | ⬜ |
| RN09 | `deve lançar ConflitoError ao cancelar pedido já cancelado` | ⬜ |

### Tarefa 5 — Contrato de Proteção

Adicione o comentário de proteção em cada teste:

```typescript
/**
 * 🔒 CONTRATO DE TESTE - NÃO REMOVER
 * 
 * Este teste protege a Regra de Negócio RN06: "Só pode cancelar pedidos pendentes".
 * ...
 */
```

### Critérios de Aceite do Exercício

- [ ] 4 testes escritos, um por RN
- [ ] Cada teste tem comentário vinculando à RN
- [ ] Cada teste tem contrato de proteção
- [ ] Testes isolados (Fake Repository)
- [ ] Matriz RN → Teste preenchida
- [ ] Nome do teste descreve a regra protegida

---

## Ver Também

| Conceito | Documento Relacionado |
|----------|----------------------|
| Modelagem de dados (entidades) | [Aula 03 — Modelagem Relacional](./aula_03_modelagem_relacional.md) |
| Endpoints HTTP e status codes | [Aula 05 — REST](./aula_05_rest_endpoints.md) |
| Repository Pattern em testes | [Aula 06 — RTM](./aula_06_rtm_design_patterns.md) |
| Refatoração de mocks | [Aula 10 — Refatoração](./aula_10_refatoracao_testes.md) |

---

## Referências

- **Beck, K.** (2002) — *Test-Driven Development: By Example* — Addison-Wesley
- **Fowler, M.** (2018) — *Refactoring: Improving the Design of Existing Code* — Addison-Wesley
- **SWEBOK v3** — *Software Design, Software Testing* — IEEE Computer Society
- **OMG UML 2.5.1 Specification** — *Structural and Behavioral Diagrams*
- **Meyer, B.** (1992) — *Applying "Design by Contract"* — IEEE Computer

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **AAA** | Arrange-Act-Assert — estrutura canônica de um teste unitário |
| **TDD** | Test-Driven Development — desenvolvimento guiado por testes |
| **Red-Green-Refactor** | Ciclo fundamental do TDD |
| **Mock** | Objeto substituto que verifica interações (chamadas de método) |
| **Stub** | Objeto substituto que retorna valores pré-configurados |
| **DTO** | Data Transfer Object — estrutura de transporte entre camadas |
| **Pré-condição** | Restrição que deve ser verdadeira antes de executar um método |
| **Pós-condição** | Garantia que o método oferece ao retornar |
| **Diagrama de Sequência** | Diagrama UML que representa troca de mensagens ordenadas no tempo |
| **Inversão de Dependência** | Princípio SOLID: módulos de alto nível não devem depender de detalhes |
