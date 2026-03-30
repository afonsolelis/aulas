# Autoestudo: Front-end I — Personas, Contratos de Integração e Vinculação Tela → RF

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Perspectiva dos Corpos de Conhecimento](#perspectiva-dos-corpos-de-conhecimento)
3. [Personas — Da Necessidade ao Requisito](#personas--da-necessidade-ao-requisito)
4. [Contratos de Integração Front-Back](#contratos-de-integração-front-back)
5. [Vinculação Tela → RF → Endpoint](#vinculação-tela--rf--endpoint)
6. [Arquitetura de Componentes React/TS](#arquitetura-de-componentes-reactts)
7. [Tratamento de Erros na Interface](#tratamento-de-erros-na-interface)
8. [Checklist de Validação](#checklist-de-validação)
9. [Referências](#referências)
10. [Glossário](#glossário)

---

## Contexto e Objetivo

A Aula 7 inicia a visão **Engineering + Technology** do RM-ODP: os requisitos levantados nas aulas anteriores precisam ser mapeados em interfaces concretas. O artefato da **Sprint 4** exige que cada tela esteja vinculada a um RF específico, que os contratos de integração estejam definidos (entradas, saídas, erros) e que a cadeia `Persona → Necessidade → RF → Endpoint → Tela` esteja documentada.

---

## Perspectiva dos Corpos de Conhecimento

### SEBoK (Systems Engineering Body of Knowledge) — Parte 3: Stakeholder Needs

O SEBoK define **Stakeholder Needs and Requirements** como o processo de identificar e formalizar as necessidades dos atores do sistema. No contexto front-end:

| Etapa SEBoK | Artefato Resultante | Conexão com Projeto |
|-------------|--------------------|--------------------|
| Identify Stakeholders | Mapa de Atores | Personas + papéis |
| Elicit Needs | Necessidades informais | Entrevistas, observação |
| Define Stakeholder Requirements | Requisitos formalizados | RF + critério de aceite |
| Analyze and Validate | RTM | Tela → RF → Teste |

### BABOK v3 — Stakeholder Engagement

O BABOK estabelece que personas são representações de stakeholders arquetípicos, construídas a partir de dados reais. Diferente de user stories, personas:
- **Não descrevem funcionalidades** — descrevem comportamentos, motivações e frustrações
- **Orientam priorização** — o que a persona Mariana precisa mais urgentemente?
- **Fundamentam critérios de usabilidade** — métricas de eficácia, eficiência e satisfação (ISO 9241-11)

---

## Personas — Da Necessidade ao Requisito

### Estrutura Formal de Persona

Uma persona técnica deve conter dados suficientes para derivar requisitos verificáveis:

```
┌────────────────────────────────────────────────────────┐
│  PERSONA: Mariana, 34 anos — Gestora de Estoque        │
├────────────────────────────────────────────────────────┤
│  Contexto: Usa sistema 6h/dia, acesso por desktop      │
│  Objetivo primário: Saber quais produtos estão em      │
│    baixa quantidade sem precisar exportar planilhas    │
│  Frustração: Sistema atual exige 5 cliques para        │
│    chegar no relatório de estoque crítico              │
│  Necessidade: Dashboard com alertas visuais imediatos  │
├────────────────────────────────────────────────────────┤
│  RF derivado: RF08 — Exibir produtos com estoque       │
│               abaixo do mínimo em destaque visual      │
│  Critério de aceite: Produtos com estoque < mínimo     │
│               aparecem em vermelho na listagem,        │
│               sem necessidade de filtro adicional      │
└────────────────────────────────────────────────────────┘
```

### Pipeline de Derivação

```
Persona (quem é)
  → Objetivo (o que precisa fazer)
    → Frustração (por que o atual não serve)
      → Necessidade (o que resolveria)
        → RF (o que o sistema deve fazer — verificável)
          → Critério de Aceite (quando considerar atendido)
            → Tela (como se materializa na interface)
              → Endpoint (qual API suporta a tela)
```

---

### Segunda Persona — João, o Comprador

```
┌────────────────────────────────────────────────────────┐
│  PERSONA: João, 28 anos — Assistente de Compras        │
├────────────────────────────────────────────────────────┤
│  Contexto: Usa sistema 4h/dia, acesso misto            │
│            (desktop no escritório, mobile no depósito) │
│  Objetivo primário: Criar pedidos de reposição         │
│    rapidamente quando estoque está baixo               │
│  Frustração: Sistema atual não mostra histórico        │
│    de compras por fornecedor; precisa planilhar        │
│  Necessidade: Lista de produtos com reposição          │
│    sugerida e reordenação em 1 clique                  │
├────────────────────────────────────────────────────────┤
│  RF derivado: RF03 — Permitir criação de pedido        │
│               com múltiplos itens em única tela        │
│  Critério de aceite: Usuário consegue adicionar        │
│               5 itens ao pedido e finalizar em         │
│               menos de 2 minutos                       │
└────────────────────────────────────────────────────────┘
```

### Critérios de Aceite em Formato Gherkin (BDD)

Para tornar critérios de aceite executáveis como testes, use o formato **Gherkin** (Given-When-Then):

```gherkin
# Funcionalidade: Criar pedido de compra
# Persona: João (Assistente de Compras)

Cenário: Criar pedido com múltiplos itens
  Dado que estou na tela de novo pedido
  E o produto "Camiseta Básica P" tem estoque crítico (3 unidades)
  Quando adiciono "Camiseta Básica P" com quantidade 50
  E adiciono "Calça Jeans 42" com quantidade 30
  E clico em "Finalizar Pedido"
  Então vejo mensagem "Pedido criado com sucesso"
  E o pedido aparece na lista com status "Pendente"

Cenário: Impedir pedido sem itens
  Dado que estou na tela de novo pedido
  Quando clico em "Finalizar Pedido" sem adicionar itens
  Então vejo mensagem "Adicione ao menos um item ao pedido"
  E o pedido não é criado

Cenário: Alertar estoque crítico na listagem
  Dado que sou a gestora Mariana
  Quando acesso a tela de listagem de produtos
  Então produtos com estoque < mínimo aparecem em vermelho
  E vejo ícone de alerta ao lado do nome
```

**Vantagens do formato Gherkin:**
- **Legível por não-técnicos:** Product Owners e stakeholders validam critérios
- **Executável:** Ferramentas como Cucumber transformam em testes automatizados
- **Rastreável:** Cada cenário vincula a um RF específico

---

## Contratos de Integração Front-Back

### Por que Contratos Explícitos?

Sem contratos formalizados, problemas típicos surgem:
- Front-end assume `snake_case`; back-end retorna `camelCase`
- Campo opcional no back-end, mas front-end assume obrigatório → crash em produção
- Erros sem estrutura padronizada → `error.message` às vezes é string, às vezes objeto

### Estrutura de Contrato por Endpoint

Para cada endpoint consumido pelo front-end, documentar:

```typescript
// Contrato: POST /produtos
// Versão: 1.0 | Sprint 3

// REQUEST
interface CriarProdutoRequest {
  sku: string;          // obrigatório, max 50 chars, único
  nome: string;         // obrigatório, max 200 chars
  preco_cents: number;  // obrigatório, > 0
  estoque?: number;     // opcional, default: 0
}

// RESPONSE 201 (sucesso)
interface CriarProdutoResponse {
  id: number;
  sku: string;
  nome: string;
  preco_cents: number;
  estoque: number;
  criado_em: string; // ISO 8601: "2024-03-15T10:30:00Z"
}

// RESPONSE 400 (validação)
interface ValidationErrorResponse {
  message: string;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

// RESPONSE 409 (conflito)
interface ConflictErrorResponse {
  message: string; // "SKU já cadastrado"
  code: "SKU_DUPLICADO";
}
```

### Contratos de Erros — Tabela Consolidada

| Status | Tipo de Erro | Campos no Body | Como o Front-end deve reagir |
|--------|-------------|----------------|------------------------------|
| 400 | Validação | `{ errors: [{field, message}] }` | Destacar campo com erro |
| 401 | Não autenticado | `{ message }` | Redirecionar para login |
| 403 | Sem permissão | `{ message }` | Exibir mensagem de acesso negado |
| 404 | Não encontrado | `{ message }` | Exibir "não encontrado" na tela |
| 409 | Conflito | `{ message, code }` | Mensagem específica por `code` |
| 422 | Regra violada | `{ message, code }` | Mensagem de negócio para o usuário |
| 500 | Erro interno | `{ message: "Erro interno" }` | Mensagem genérica de erro |

---

## Vinculação Tela → RF → Endpoint

### Tabela de Vinculação (artefato obrigatório Sprint 4)

| Tela | Componente Principal | RF | Endpoint Consumido | Estado de Erro Tratado |
|------|---------------------|----|--------------------|----------------------|
| `/produtos` | `ProdutoListagem` | RF02 | `GET /produtos` | 500 → mensagem genérica |
| `/produtos/novo` | `ProdutoFormulario` | RF01 | `POST /produtos` | 400 → erros por campo; 409 → SKU duplicado |
| `/produtos/:id/editar` | `ProdutoFormulario` | RF05 | `PUT /produtos/:id` | 404 → redirecionar; 400 → erros por campo |
| `/pedidos/novo` | `PedidoCheckout` | RF03 | `POST /pedidos` | 422 → mensagem de regra; 404 → produto não encontrado |

### Hierarquia de Componentes

```
App
├── Layout
│   ├── Header (navegação)
│   └── Outlet (página ativa)
├── pages/
│   ├── ProdutosPage     ← vinculada a RF02
│   ├── ProdutoNovo      ← vinculada a RF01
│   └── PedidoNovo       ← vinculada a RF03
└── components/
    ├── ProdutoCard      ← reutilizável em múltiplas páginas
    ├── ProdutoFormulario ← compartilhado entre Novo e Editar
    └── ErrorBoundary    ← captura erros de renderização
```

---

## Arquitetura de Componentes React/TS

### Separação de Responsabilidades no Front-end

```
┌─────────────────────────────────────────────────────────┐
│  Page Component (orquestração)                          │
│  - Gerencia estado da página                            │
│  - Chama hooks de dados                                 │
│  - Renderiza componentes de UI                          │
├─────────────────────────────────────────────────────────┤
│  Feature Component (lógica de UI)                       │
│  - Gerencia formulário e validação                      │
│  - Decide o que exibir (loading/error/success)          │
├─────────────────────────────────────────────────────────┤
│  UI Component (apresentação pura)                       │
│  - Recebe apenas props                                  │
│  - Zero lógica de negócio                               │
├─────────────────────────────────────────────────────────┤
│  Hook (lógica de dados)                                 │
│  - `useProdutos()`, `useCriarProduto()`                 │
│  - Encapsula fetch, loading, error                      │
│  - Usa API client                                       │
└─────────────────────────────────────────────────────────┘
```

### Exemplo de Hook com Contrato Tipado

```typescript
function useCriarProduto() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function criar(dto: CriarProdutoRequest): Promise<CriarProdutoResponse | null> {
    setLoading(true);
    setErrors({});
    try {
      const response = await api.post<CriarProdutoResponse>('/produtos', dto);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          const fieldErrors = error.response.data.errors.reduce(
            (acc: Record<string, string>, e: { field: string; message: string }) => {
              acc[e.field] = e.message;
              return acc;
            }, {}
          );
          setErrors(fieldErrors);
        }
      }
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { criar, loading, errors };
}
```

---

## Tratamento de Erros na Interface

### Estados Possíveis de uma Chamada HTTP

```
idle → loading → success
              → error (4xx: erro do usuário)
              → error (5xx: erro do sistema)
              → timeout (sem resposta)
```

Cada estado deve ter representação visual distinta:

| Estado | Representação Visual | Ação do Usuário |
|--------|---------------------|-----------------|
| `idle` | Formulário limpo | Preencher e submeter |
| `loading` | Spinner + botão desabilitado | Aguardar |
| `success` | Toast de confirmação + redirect | — |
| `error 400` | Campo com borda vermelha + mensagem abaixo | Corrigir campo |
| `error 409` | Mensagem inline no campo SKU | Alterar SKU |
| `error 500` | Banner de erro genérico | Tentar novamente |

---

## Checklist de Validação

- [ ] Cada persona possui um objetivo mensurável derivando ao menos um RF?
- [ ] A cadeia `Persona → RF → Endpoint → Tela` está documentada?
- [ ] Os contratos de integração definem tipos de request, response 2xx e todos os erros 4xx relevantes?
- [ ] A tabela de vinculação `Tela → RF → Endpoint` está completa?
- [ ] Cada tela tem tratamento visual para os estados: loading, success, error?
- [ ] Os componentes de UI são separados dos componentes com lógica de dados?
- [ ] Os hooks encapsulam toda a comunicação com a API?
- [ ] Os testes Jest foram ajustados se houve mudança de contrato?

---

## Exercício Prático

### Cenário
Você precisa documentar personas e contratos para uma nova funcionalidade: **relatório de vendas por período**.

### Tarefa 1 — Criar Persona
Desenvolva uma persona completa para o **Gerente Comercial** que precisa:
- Acessar relatório de vendas diárias/semanais/mensais
- Exportar dados em PDF e Excel
- Filtrar por vendedor e região

Use o formato da tabela de persona deste documento.

### Tarefa 2 — Escrever Critérios Gherkin
Para o RF "Exportar relatório em PDF", escreva 3 cenários:
1. Exportação bem-sucedida
2. Exportação sem dados no período
3. Exportação com filtro aplicado

### Tarefa 3 — Definir Contrato
Documente o contrato para `GET /relatorios/vendas`:
- Parâmetros de query (data_inicial, data_final, vendedor_id, formato)
- Response 200 (estrutura do relatório)
- Response 400 (período inválido)
- Response 404 (sem dados)

---

## Ver Também

| Conceito | Documento Relacionado |
|----------|----------------------|
| Critérios de aceite e BDD | [Aula 04 — TDD](./aula_04_uml_tdd.md) |
| Contratos de API (status codes) | [Aula 05 — REST](./aula_05_rest_endpoints.md) |
| Estados de loading/error | [Aula 08 — Integração Assíncrona](./aula_08_async_integracao.md) |
| Heurísticas de usabilidade | [Aula 09 — Estado Global](./aula_09_estado_global_heuristicas.md) |
| RTM completa | [Aula 06 — RTM](./aula_06_rtm_design_patterns.md) |

---

## Referências

- **SEBoK Wiki** — *System Requirements, Part 3: Systems Engineering* — sebokwiki.org
- **BABOK v3** — *Stakeholder Engagement, Requirements Analysis* — IIBA
- **Nielsen, J.; Molich, R.** (1990) — *Heuristic Evaluation of User Interfaces* — CHI
- **Card, S.K.; Moran, T.P.; Newell, A.** (1983) — *The Psychology of Human-Computer Interaction* — Lawrence Erlbaum
- **ISO 9241-11:2018** — *Ergonomics of Human-System Interaction: Usability*

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Persona** | Representação arquetípica de um grupo de stakeholders com comportamentos similares |
| **Contrato de Integração** | Especificação formal de entradas, saídas e erros de uma interface entre sistemas |
| **Error Boundary** | Componente React que captura erros de renderização filhos |
| **Hook** | Função React que encapsula lógica stateful e efeitos colaterais |
| **Idle** | Estado inicial de um componente antes de qualquer interação |
| **Otimistic UI** | Atualiza interface antes da confirmação do servidor para melhorar UX percebida |
| **SEBoK** | Systems Engineering Body of Knowledge — guia de referência de engenharia de sistemas |
| **Stakeholder** | Parte interessada com influência ou interesse no sistema |
