# Autoestudo: Design de APIs REST — Endpoints, Verbos HTTP e Matriz RF × RN

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Perspectiva dos Corpos de Conhecimento](#perspectiva-dos-corpos-de-conhecimento)
3. [Os Constraints REST (Fielding, 2000)](#os-constraints-rest-fielding-2000)
4. [Verbos HTTP e Idempotência](#verbos-http-e-idempotência)
5. [Design de Endpoints CRUD](#design-de-endpoints-crud)
6. [Tratamento de Erros e Status Codes](#tratamento-de-erros-e-status-codes)
7. [Matriz RF × RN × Endpoint × Teste](#matriz-rf--rn--endpoint--teste)
8. [Checklist de Validação](#checklist-de-validação)
9. [Referências](#referências)
10. [Glossário](#glossário)

---

## Contexto e Objetivo

A Aula 5 aprofunda a visão **Computational** do RM-ODP com foco nos endpoints que expõem as regras de negócio como recursos HTTP. O artefato da **Sprint 3** exige endpoints de leitura e escrita funcionando, testes para sucesso/falha de validação/regra violada, e a **matriz RF → RN → Teste** documentada.

---

## Perspectiva dos Corpos de Conhecimento

### SWEBOK v3 — Software Construction: Interface Design

O SWEBOK define que interfaces externas de software devem ser:

| Atributo | Descrição | Violação comum |
|----------|-----------|----------------|
| **Consistência** | Mesma convenção em todos os endpoints | Misturar `snake_case` e `camelCase` na mesma API |
| **Completude** | Todos os casos de uso têm endpoints | RF mapeado sem endpoint correspondente |
| **Robustez** | Tratar entradas inválidas sem crash | `500 Internal Error` ao receber campo nulo |

### RFC 7231 — HTTP/1.1 Semantics (IETF)

A RFC 7231 formaliza a semântica de cada método HTTP, definindo:
- **Segurança:** O método não altera estado do servidor
- **Idempotência:** N chamadas idênticas produzem o mesmo resultado que uma

---

## Os Constraints REST (Fielding, 2000)

Roy Fielding, em sua dissertação de doutorado (UC Irvine, 2000), definiu REST como conjunto de **6 constraints** arquiteturais:

| Constraint | Descrição | Implicação prática |
|------------|-----------|-------------------|
| **Client-Server** | Separação de responsabilidades UI/dados | Front-end independente do back-end |
| **Stateless** | Cada requisição contém toda informação necessária | Sem sessão no servidor; usar JWT/token |
| **Cache** | Respostas marcadas como cacheáveis ou não | Header `Cache-Control`, `ETag` |
| **Uniform Interface** | Identificação de recursos via URI; representação padronizada | `/produtos/42`, não `/getProduto?id=42` |
| **Layered System** | Cliente não sabe se fala com servidor real ou proxy | Transparência para load balancers |
| **Code on Demand** | (Opcional) Servidor pode enviar código executável | JavaScript em resposta HTML |

**Constraint mais violada em projetos:** **Stateless** — armazenar estado de sessão no servidor impede escalabilidade horizontal.

---

## Verbos HTTP e Idempotência

### Tabela Formal (RFC 7231)

| Método | Seguro? | Idempotente? | Uso correto | Erro comum |
|--------|---------|--------------|-------------|------------|
| `GET` | ✅ Sim | ✅ Sim | Leitura de recurso | Usar GET para deletar |
| `POST` | ❌ Não | ❌ Não | Criar novo recurso | Usar POST para atualizar |
| `PUT` | ❌ Não | ✅ Sim | Substituição completa | Usar PUT para atualização parcial |
| `PATCH` | ❌ Não | ⚠️ Depende | Atualização parcial | Ignorar e usar PUT para tudo |
| `DELETE` | ❌ Não | ✅ Sim | Remoção de recurso | Retornar 200 com body ao deletar |

**Idempotência — exemplo prático:**
```http
# Idempotente: deletar o mesmo recurso 3 vezes
DELETE /produtos/42 → 204 No Content
DELETE /produtos/42 → 404 Not Found (já deletado)
DELETE /produtos/42 → 404 Not Found
# O estado do servidor é o mesmo após todas as chamadas
```

---

## Design de Endpoints CRUD

### Convenção de URIs

```
Coleção:    /produtos           (substantivo plural, minúsculo)
Recurso:    /produtos/{id}      (identificador na URL, não query param)
Sub-recurso: /pedidos/{id}/itens
Ação (raro): /pedidos/{id}/cancelar  (verbo apenas quando necessário)
```

### CRUD Completo — Exemplo: Recurso `produto`

```
POST   /produtos          → 201 Created    (criar)
GET    /produtos          → 200 OK         (listar)
GET    /produtos/:id      → 200 OK         (buscar por ID)
PUT    /produtos/:id      → 200 OK         (atualizar completo)
PATCH  /produtos/:id      → 200 OK         (atualizar parcial)
DELETE /produtos/:id      → 204 No Content (deletar)
```

### Exemplo de Controller (TypeScript + Express)

```typescript
// POST /produtos
router.post('/', async (req: Request, res: Response) => {
  try {
    const dto = CriarProdutoDTO.parse(req.body); // Zod valida e lança erro se inválido
    const produto = await produtoService.criar(dto);
    res.status(201).json(produto);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else if (error instanceof NegocioError) {
      res.status(422).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro interno' });
    }
  }
});

// GET /produtos/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

  const produto = await produtoService.buscarPorId(id);
  if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });

  res.json(produto);
});
```

---

## Tratamento de Erros e Status Codes

### Hierarquia de Status HTTP para APIs

```
2xx ─ Sucesso
  200 OK             → GET, PUT, PATCH bem-sucedidos
  201 Created        → POST que criou recurso (incluir Location header)
  204 No Content     → DELETE bem-sucedido (sem body)

4xx ─ Erro do Cliente
  400 Bad Request    → Payload malformado (JSON inválido, tipo errado)
  401 Unauthorized   → Não autenticado (token ausente/expirado)
  403 Forbidden      → Autenticado mas sem permissão
  404 Not Found      → Recurso inexistente
  409 Conflict       → Conflito de estado (ex: SKU duplicado)
  422 Unprocessable  → Dados válidos sintaticamente mas regra violada
  429 Too Many Req.  → Rate limit excedido

5xx ─ Erro do Servidor
  500 Internal Error → Bug não tratado (nunca deve vazar stack trace)
  503 Unavailable    → Serviço temporariamente indisponível
```

### Estrutura Padronizada de Resposta de Erro

```typescript
interface ErrorResponse {
  message: string;          // Mensagem legível por humanos
  code?: string;            // Código de erro da aplicação (ex: "SKU_DUPLICADO")
  errors?: ValidationError[]; // Lista de erros de validação (400)
  timestamp: string;        // ISO 8601
  path: string;             // URI da requisição
}
```

**Regra:** Nunca retornar `500` com stack trace em produção. O erro interno vai para o log; o cliente recebe mensagem genérica.

---

## Matriz RF × RN × Endpoint × Teste

O artefato da Sprint 3 exige esta rastreabilidade explícita:

| RF | Regra de Negócio | Endpoint | Cenário de Teste | Status Esperado |
|----|-----------------|----------|-----------------|-----------------|
| RF01 | RN01 — SKU único | `POST /produtos` | SKU já existente | 409 Conflict |
| RF01 | RN02 — Preço > 0 | `POST /produtos` | `preco_cents: -1` | 400 Bad Request |
| RF01 | — (sucesso) | `POST /produtos` | Dados válidos | 201 Created |
| RF02 | — (sucesso) | `GET /produtos/:id` | ID existente | 200 OK |
| RF02 | — (não encontrado) | `GET /produtos/:id` | ID inexistente | 404 Not Found |
| RF03 | RN03 — Pedido c/ itens | `POST /pedidos` | Itens vazios | 422 Unprocessable |
| RF03 | RN03 — Cliente existe | `POST /pedidos` | cliente_id inválido | 404 Not Found |

### Exemplo de Teste de Integração Jest

```typescript
describe('POST /produtos', () => {

  it('deve retornar 201 ao criar produto com dados válidos', async () => {
    const response = await request(app)
      .post('/produtos')
      .send({ sku: 'P001', nome: 'Camiseta', preco_cents: 4990 });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ sku: 'P001', status: 'ativo' });
  });

  it('deve retornar 400 ao enviar preco_cents negativo', async () => {
    const response = await request(app)
      .post('/produtos')
      .send({ sku: 'P002', nome: 'Calça', preco_cents: -100 });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ path: ['preco_cents'] })
    );
  });

  it('deve retornar 409 ao criar produto com SKU duplicado', async () => {
    await criarProdutoNoBanco({ sku: 'P003' }); // setup

    const response = await request(app)
      .post('/produtos')
      .send({ sku: 'P003', nome: 'Meia', preco_cents: 999 });

    expect(response.status).toBe(409);
  });

});
```

---

## Checklist de Validação

- [ ] Cada RF priorizado tem ao menos um endpoint mapeado?
- [ ] Os endpoints seguem convenção de URIs (substantivos, plural, lowercase)?
- [ ] `GET` e `DELETE` são implementados como idempotentes?
- [ ] `POST /recursos` retorna `201` com o recurso criado no body?
- [ ] `DELETE` retorna `204` (sem body)?
- [ ] Erros de validação retornam `400` com lista de erros estruturada?
- [ ] Regras de negócio violadas retornam `422` (não `400`)?
- [ ] Stack traces nunca aparecem em respostas de produção?
- [ ] A matriz RF × RN × Endpoint × Teste está documentada?
- [ ] Há teste para sucesso, falha de validação e regra violada por endpoint crítico?

---

## Exercício Prático

### Cenário
Você precisa documentar e testar os endpoints de **Gerenciamento de Clientes**:
- `POST /clientes` — Criar cliente
- `GET /clientes/:id` — Buscar cliente
- `PUT /clientes/:id` — Atualizar cliente
- `DELETE /clientes/:id` — Remover cliente

Regras de negócio:
- CPF deve ser único
- E-mail deve ser válido
- Não pode remover cliente com pedidos vinculados

### Tarefa 1 — Matriz de Endpoints
Crie a tabela RF × RN × Endpoint × Teste para os 4 endpoints.

### Tarefa 2 — Testes de Integração
Escreva testes Jest para:
- Sucesso em cada operação
- CPF duplicado (409)
- E-mail inválido (400)
- Cliente com pedidos (409 no DELETE)

### Tarefa 3 — Contratos de Erro
Documente a estrutura de resposta de erro para cada status 4xx.

---

## Ver Também

| Conceito | Documento Relacionado |
|----------|----------------------|
| Contratos de integração front-back | [Aula 07 — Front-end I](./aula_07_frontend_personas_contratos.md) |
| RTM e rastreabilidade | [Aula 06 — RTM](./aula_06_rtm_design_patterns.md) |
| Idempotência e resiliência | [Aula 11 — Redes](./aula_11_redes_resiliencia.md) |

---

## Referências

- **Fielding, R.T.** (2000) — *Architectural Styles and the Design of Network-based Software Architectures* — UC Irvine (Ph.D. Dissertation)
- **IETF RFC 7231** — *Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content*
- **SWEBOK v3** — *Software Construction* — IEEE Computer Society
- **Richardson, L.; Ruby, S.** (2007) — *RESTful Web Services* — O'Reilly

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **REST** | Representational State Transfer — estilo arquitetural para APIs web |
| **Idempotência** | N aplicações de uma operação produzem o mesmo resultado que uma |
| **Stateless** | Nenhum estado de sessão é mantido no servidor entre requisições |
| **URI** | Uniform Resource Identifier — identificador único de recurso |
| **Constraint** | Restrição arquitetural que define as propriedades de um estilo |
| **422 Unprocessable** | Requisição sintaticamente válida mas semanticamente rejeitada |
| **HATEOAS** | Hypermedia as the Engine of Application State — links no response |
| **DTO** | Data Transfer Object — estrutura de dados para transferência entre camadas |
| **Rate Limit** | Limitação de frequência de requisições por cliente/período |
