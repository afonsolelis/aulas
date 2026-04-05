# Autoestudo: Endpoints HTTP, Payloads, Erros e Documentação de API

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Métodos HTTP e Recursos](#métodos-http-e-recursos)
3. [Entradas, Saídas e Status Codes](#entradas-saídas-e-status-codes)
4. [Validação e Tratamento de Erros](#validação-e-tratamento-de-erros)
5. [Documentação Própria de API](#documentação-própria-de-api)
6. [Conexão com Front-end e Testes](#conexão-com-front-end-e-testes)
7. [Aprofundamento Orientado](#aprofundamento-orientado)
8. [Miniestudo de Caso](#miniestudo-de-caso)
9. [Checklist de Estudo](#checklist-de-estudo)
10. [Referências](#referências)

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

## Conexão com Front-end e Testes

Um endpoint bem definido facilita tanto a interface quanto a validação.

| Elemento do contrato | Impacto no front-end | Impacto no teste |
|----------------------|----------------------|------------------|
| payload esperado | formulário envia dados corretos | teste monta request válido |
| status code | decide fluxo da tela | asserção objetiva |
| resposta de erro | mensagem ao usuário | cenário negativo reproduzível |
| exemplo documentado | integra mais rápido | vira fixture inicial |

### Perguntas úteis

- a interface consegue distinguir erro de validação de erro interno?
- a documentação permite testar o endpoint sem ler o código-fonte?
- os exemplos já cobrem sucesso e falha?

---

## Aprofundamento Orientado

### 1. Contrato estável vale mais que implementação bonita

Se o backend muda resposta sem combinar contrato, o front-end quebra mesmo que a lógica interna esteja correta. Por isso, documentação e consistência são parte do design.

### 2. Pensar em casos alternativos

Para cada endpoint importante, descreva:

1. cenário de sucesso
2. cenário de payload inválido
3. cenário de recurso inexistente
4. cenário de regra de negócio violada

### 3. Ponte para a aula 7

A interface vai consumir diretamente o que é definido aqui. Então um bom exercício final é pegar um endpoint e responder:

- que tela o consome
- que campos serão mostrados
- que mensagem de erro faz sentido para o usuário

---

## Miniestudo de Caso

### Contrato confuso entre front-end e back-end

O front-end espera cadastrar produto com `nome`, `sku` e `preco_cents`. O backend, porém, responde erro genérico em texto livre e às vezes devolve `200`, às vezes `201`, sem padrão. A equipe começa a gastar tempo alinhando manualmente cada integração.

### Como estabilizar o endpoint

| Elemento | Definição desejada |
|----------|--------------------|
| rota | `POST /produtos` |
| sucesso | `201 Created` com JSON do recurso criado |
| erro de payload | `400` com mensagem legível |
| erro de duplicidade | `409` com código de negócio |

### Valor do caso

Esse cenário mostra que documentação não é artefato burocrático. Ela reduz retrabalho, evita interpretações diferentes entre times e facilita teste automatizado.

### Perguntas para discutir

1. Qual parte do contrato é mais crítica para o front-end: payload, status ou mensagem de erro?
2. Em que situações vale usar `409` em vez de `422`?
3. Que exemplo mínimo precisa estar na documentação para outra pessoa testar esse endpoint sem ler o código?

---

## Checklist de Estudo

- [ ] Sei associar corretamente método HTTP e operação?
- [ ] Consigo definir payload de entrada e resposta de saída?
- [ ] Consigo escolher status code coerente?
- [ ] Sei descrever erros previsíveis do endpoint?
- [ ] Consigo documentar um endpoint de forma simples e legível?

---

## Referências

- [RFC 7231 — Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content](https://datatracker.ietf.org/doc/html/rfc7231)
- [MDN Web Docs — HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [Roy Fielding — Architectural Styles and the Design of Network-based Software Architectures](https://ics.uci.edu/~fielding/pubs/dissertation/top.htm)
