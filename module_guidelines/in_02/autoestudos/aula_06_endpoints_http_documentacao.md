# Autoestudo: Endpoints HTTP, Payloads, Erros e Documentação de API

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Métodos HTTP e Recursos](#métodos-http-e-recursos)
3. [Entradas, Saídas e Status Codes](#entradas-saídas-e-status-codes)
4. [Validação e Tratamento de Erros](#validação-e-tratamento-de-erros)
5. [Documentação Própria de API](#documentação-própria-de-api)
6. [Checklist de Estudo](#checklist-de-estudo)
7. [Referências](#referências)

---

## Contexto e Objetivo

Depois de estruturar o backend, esta aula foca em como expor funcionalidades por meio de endpoints claros, previsíveis e bem documentados. O objetivo é que o front-end saiba exatamente como consumir a API.

---

## Métodos HTTP e Recursos

| Método | Uso mais comum |
|--------|----------------|
| `GET` | buscar dados |
| `POST` | criar recurso |
| `PUT` | atualizar completamente |
| `PATCH` | atualizar parcialmente |
| `DELETE` | remover |

### Convenções úteis

- usar substantivos na URL: `/produtos`
- usar identificador no caminho: `/produtos/42`
- evitar verbos na rota quando o recurso já é claro

---

## Entradas, Saídas e Status Codes

### Exemplo de criação

```http
POST /produtos
Content-Type: application/json

{
  "nome": "Camiseta",
  "sku": "CAM-001",
  "preco_cents": 4990
}
```

Resposta:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 12,
  "nome": "Camiseta",
  "sku": "CAM-001",
  "preco_cents": 4990
}
```

### Status que o aluno precisa dominar

| Código | Significado |
|--------|-------------|
| `200` | sucesso de leitura ou atualização |
| `201` | recurso criado |
| `204` | remoção sem corpo |
| `400` | requisição inválida |
| `404` | recurso não encontrado |
| `409` | conflito |
| `422` | regra de negócio violada |
| `500` | erro interno |

---

## Validação e Tratamento de Erros

Uma API boa não responde só nos cenários felizes.

### Exemplo de resposta de erro

```json
{
  "message": "SKU já cadastrado",
  "code": "SKU_DUPLICADO"
}
```

### O que precisa ser validado

- campos obrigatórios
- tipo de dado
- faixa de valor
- unicidade
- existência de recurso relacionado

---

## Documentação Própria de API

Mesmo sem Swagger, a equipe consegue documentar uma API de forma útil.

### Estrutura mínima por endpoint

| Campo | Exemplo |
|------|---------|
| Rota | `POST /produtos` |
| Objetivo | criar novo produto |
| Payload | `nome`, `sku`, `preco_cents` |
| Sucesso | `201 Created` |
| Erros | `400`, `409`, `422` |
| Exemplo de resposta | JSON de retorno |

### Exemplo de registro simples

```md
### POST /produtos
- Objetivo: criar um produto
- Entrada: nome, sku, preco_cents
- Sucesso: 201 Created
- Erros:
  - 400 se payload estiver inválido
  - 409 se sku já existir
```

---

## Checklist de Estudo

- [ ] Sei associar corretamente método HTTP e operação?
- [ ] Consigo definir payload de entrada e resposta de saída?
- [ ] Consigo escolher status code coerente?
- [ ] Sei descrever erros previsíveis do endpoint?
- [ ] Consigo documentar um endpoint de forma simples e legível?

---

## Referências

- RFC 7231
- MDN Web Docs — HTTP Methods
- Fielding — Architectural Styles and the Design of Network-based Software Architectures
