# Autoestudo: Redes e Resiliência — HTTP/IP, Timeout, Retry e Circuit Breaker

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Perspectiva dos Corpos de Conhecimento](#perspectiva-dos-corpos-de-conhecimento)
3. [Pilha TCP/IP Aplicada ao Projeto Web](#pilha-tcpip-aplicada-ao-projeto-web)
4. [HTTP em Profundidade](#http-em-profundidade)
5. [Padrões de Resiliência](#padrões-de-resiliência)
6. [RNF de Comunicação — Nível 1º Ano](#rnf-de-comunicação--nível-1º-ano)
7. [Documentação Final da Sprint](#documentação-final-da-sprint)
8. [Miniestudo de Caso](#miniestudo-de-caso)
9. [Checklist de Validação](#checklist-de-validação)
10. [Referências](#referências)
11. [Glossário](#glossário)

---

## Contexto e Objetivo

A Aula 11 consolida a visão **Engineering** do RM-ODP com foco nas transparências de rede. O artefato da **Sprint 5** exige que os fundamentos HTTP/IP estejam aplicados ao projeto, que estratégias de robustez (timeout, retry, circuit breaker) estejam implementadas, que a aplicação possua autenticacao simples com hash de senha no banco e controle de sessao por `session id`, e que os RNFs de comunicação estejam validados com evidências na documentação final.

---

## Perspectiva dos Corpos de Conhecimento

### SEBoK — Parte 3: System Realization / System Integration

O SEBoK define **integração de sistemas** como a atividade de combinar subsistemas em um sistema funcional. Para aplicações web, a integração ocorre em múltiplas camadas:

| Camada de Integração | O que Falha | Estratégia de Resiliência |
|---------------------|------------|--------------------------|
| **Rede** | Pacotes perdidos, latência alta | Retry com backoff |
| **Protocolo** | Timeout HTTP, conexão recusada | Circuit Breaker |
| **Aplicação** | Erro de lógica no servidor | Tratamento de erros 4xx/5xx |
| **Dados** | Inconsistência entre sistemas | Transações, idempotência |

### Saltzer, Reed e Clark (1984) — End-to-End Arguments

O paper fundacional do MIT estabelece o princípio:

> "A função em questão só pode ser implementada corretamente com o conhecimento e ajuda das aplicações nas extremidades da comunicação."

**Implicação prática:** A rede (TCP/IP) tenta entregar pacotes, mas **não garante** que a operação de negócio foi concluída com sucesso. Retries, confirmações e idempotência são responsabilidade da **aplicação**, não da infraestrutura.

```
                 End-to-End Argument
  ┌──────────┐                        ┌──────────┐
  │ Cliente  │ ── TCP (best effort) ─►│ Servidor │
  │          │                        │          │
  │ ←── Confirmação de NEGÓCIO ──────►│          │
  │ (responsabilidade da aplicação)   │          │
  └──────────┘                        └──────────┘
```

---

## Pilha TCP/IP Aplicada ao Projeto Web

### As 4 Camadas e seu Papel

```
┌─────────────────────────────────────────────────────────┐
│  4. Aplicação — HTTP, HTTPS, WebSocket                  │
│     O que você vê: verbos, status codes, headers        │
├─────────────────────────────────────────────────────────┤
│  3. Transporte — TCP (confiável), UDP (sem garantia)    │
│     O que garante: ordem dos segmentos, retransmissão   │
├─────────────────────────────────────────────────────────┤
│  2. Internet — IP (endereçamento e roteamento)          │
│     O que faz: encontrar o caminho cliente → servidor   │
├─────────────────────────────────────────────────────────┤
│  1. Acesso à Rede — Ethernet, Wi-Fi, 4G                 │
│     O que é: transmissão física de bits                 │
└─────────────────────────────────────────────────────────┘
```

### O que Acontece em `GET /api/produtos`

```
1. DNS resolve "api.meuapp.com" → IP 203.0.113.42

2. TCP 3-way handshake:
   Cliente ──SYN──► Servidor
   Cliente ◄──SYN/ACK── Servidor
   Cliente ──ACK──► Servidor
   [conexão estabelecida]

3. TLS handshake (HTTPS):
   [negociação de chaves, certificado]

4. HTTP request:
   GET /api/produtos HTTP/1.1
   Host: api.meuapp.com
   Authorization: Bearer eyJhbGciOi...

5. HTTP response:
   HTTP/1.1 200 OK
   Content-Type: application/json
   [{"id":1,"nome":"Produto A"}]

6. TCP FIN (encerramento da conexão)
   [ou Keep-Alive para reutilização]
```

### Por que TCP não é suficiente

O TCP garante entrega de bits, mas **não garante idempotência de operações de negócio**:

```
Cenário de falha silenciosa:
1. Cliente envia POST /pedidos
2. Servidor recebe, processa, CRIA o pedido no banco
3. Servidor começa a enviar resposta
4. CONEXÃO CAI antes que o cliente receba
5. Cliente não sabe se o pedido foi criado ou não
6. Cliente tenta novamente → pedido duplicado
```

**Solução:** Operações de escrita devem ser **idempotentes** (chave de idempotência):

```http
POST /pedidos
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

---

## HTTP em Profundidade

### Estrutura de uma Requisição HTTP/1.1

```http
POST /api/pedidos HTTP/1.1
Host: api.meuapp.com
Content-Type: application/json
Authorization: Bearer eyJhbGci...
Content-Length: 87
Connection: keep-alive

{"cliente_id": 1, "itens": [{"produto_id": 5, "quantidade": 2}]}
```

### Headers Críticos para Resiliência

| Header | Direção | Função |
|--------|---------|--------|
| `Connection: keep-alive` | Request | Reutiliza conexão TCP (evita handshake) |
| `Cache-Control: no-cache` | Request | Não servir cache para dados dinâmicos |
| `Retry-After: 30` | Response | Servidor indica quando tentar novamente (429/503) |
| `X-Request-ID` | Request | ID único da requisição para rastreamento |
| `ETag` | Response | Versão do recurso para cache condicional |
| `Content-Type: application/json` | Ambos | Formato do corpo |

### Keep-Alive e Connection Pooling

```typescript
// Axios já usa keep-alive por padrão via http.Agent
// Para configuração explícita:
import http from 'http';
import https from 'https';

export const api = axios.create({
  baseURL: process.env.API_URL,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  timeout: 10_000
});
```

---

## Padrões de Resiliência

### 1. Timeout Explícito

**Problema:** Sem timeout, uma chamada pode aguardar indefinidamente (servidor travado, rede instável).

```typescript
// Axios — timeout na instância
const api = axios.create({ timeout: 10_000 }); // 10 segundos

// Axios — timeout por chamada (sobrescreve instância)
await api.get('/produtos', { timeout: 5_000 });

// Fetch nativo — AbortController
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 5_000);
try {
  const res = await fetch('/api/produtos', { signal: controller.signal });
} finally {
  clearTimeout(timer);
}
```

**Valor do timeout:** Deve ser baseado no SLO do endpoint, não arbitrário. Se o SLO é `p99 ≤ 300ms`, o timeout razoável é `500ms–1000ms` (margem acima do p99).

---

### 2. Retry com Exponential Backoff e Jitter

**Problema:** Retry imediato sobrecarrega servidor já sob pressão. Todos os clientes tentando ao mesmo tempo cria "thundering herd".

```typescript
interface RetryConfig {
  maxTentativas: number;
  delayBaseMs: number;
  statusRetentaveis: number[]; // apenas alguns erros justificam retry
}

async function comRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = { maxTentativas: 3, delayBaseMs: 500, statusRetentaveis: [503, 429, 502] }
): Promise<T> {
  for (let tentativa = 1; tentativa <= config.maxTentativas; tentativa++) {
    try {
      return await fn();
    } catch (err) {
      if (tentativa === config.maxTentativas) throw err;

      if (axios.isAxiosError(err) && err.response) {
        if (!config.statusRetentaveis.includes(err.response.status)) {
          throw err; // 400, 404, 422 → não tentar novamente
        }
        // Respeitar Retry-After se presente
        const retryAfter = err.response.headers['retry-after'];
        if (retryAfter) {
          await sleep(parseInt(retryAfter) * 1000);
          continue;
        }
      }

      // Exponential backoff + jitter
      const baseDelay = config.delayBaseMs * Math.pow(2, tentativa - 1);
      const jitter = Math.random() * baseDelay * 0.2; // ±20% aleatório
      await sleep(baseDelay + jitter);
    }
  }
  throw new Error('Unreachable');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Erros que NÃO devem ter retry:**
- `400 Bad Request` — dados inválidos (retry gerará o mesmo erro)
- `401 Unauthorized` — token inválido (retry sem novo token falhará)
- `403 Forbidden` — sem permissão (retry não mudará autorização)
- `404 Not Found` — recurso não existe (retry não criará o recurso)
- `422 Unprocessable` — regra de negócio violada (retry igual, erro igual)

---

### 3. Circuit Breaker

**Problema:** Se um serviço downstream está falhando, continuar chamando desperdiça recursos e aumenta latência para o usuário.

**Três estados:**

```
┌──────────┐  falhas > threshold  ┌──────────┐
│  CLOSED  │──────────────────────►│  OPEN    │
│ (normal) │                       │ (bloqueia│
└──────────┘                       │ chamadas)│
      ▲                            └────┬─────┘
      │                                 │ timeout expirou
      │                                 ▼
      │                          ┌─────────────┐
      │ sucesso                  │ HALF-OPEN   │
      └──────────────────────────│ (testa uma  │
                                 │ chamada)    │
                                 └─────────────┘
                                       │ falha
                                       └──► OPEN novamente
```

**Implementação simples:**

```typescript
class CircuitBreaker {
  private falhas = 0;
  private ultimaFalha = 0;
  private estado: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly limiarFalhas = 5,
    private readonly timeoutMs = 60_000
  ) {}

  async executar<T>(fn: () => Promise<T>): Promise<T> {
    if (this.estado === 'OPEN') {
      if (Date.now() - this.ultimaFalha > this.timeoutMs) {
        this.estado = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker OPEN — serviço indisponível');
      }
    }

    try {
      const resultado = await fn();
      this.onSucesso();
      return resultado;
    } catch (err) {
      this.onFalha();
      throw err;
    }
  }

  private onSucesso() {
    this.falhas = 0;
    this.estado = 'CLOSED';
  }

  private onFalha() {
    this.falhas++;
    this.ultimaFalha = Date.now();
    if (this.falhas >= this.limiarFalhas) {
      this.estado = 'OPEN';
    }
  }
}
```

---

## RNF de Comunicação — Nível 1º Ano

Tabela consolidada para o artefato final (Sprint 5):

| RNF | Eixo ISO 25010 | Métrica | Implementação | Evidência |
|-----|---------------|---------|--------------|-----------|
| Timeout em chamadas HTTP | Confiabilidade | `timeout ≤ 10s` | `axios.create({ timeout: 10000 })` | Código revisado |
| Retry em erros 5xx/429 | Confiabilidade | `≤ 3 tentativas` | `comRetry(fn, { maxTentativas: 3 })` | Teste unitário |
| Feedback de loading para usuário | Usabilidade | Spinner visível durante chamadas | Estado `loading: true` no hook | Screenshot |
| Erros de rede tratados com mensagem | Usabilidade | Mensagem não-técnica ao usuário | `catch` em todos os hooks | Screenshot de erro |
| Idempotência em criações | Confiabilidade | `Idempotency-Key` header | Header em POSTs críticos | Revisão de código |
| HTTPS em produção | Segurança | Nenhuma chamada HTTP (sem TLS) | Variável de ambiente `VITE_API_URL` com HTTPS | Config do ambiente |

---

## Documentação Final da Sprint

### O que a Documentação Final Deve Conter (Sprint 5)

```
documentação final/
├── arquitetura.md         — diagrama atualizado com fluxos de rede
├── api.md                 — OpenAPI/Swagger ou tabela de endpoints
├── banco.md               — DER final + scripts de migration
├── rnf-consolidados.md    — tabela dos 8 eixos com evidências finais
├── rtm-final.md           — RF → RN → Endpoint → Teste → Evidência
└── README.md              — como executar, testar e validar
```

### README.md Mínimo Viável

```markdown
## Como Executar

### Pré-requisitos
- Node.js 20+
- PostgreSQL 15+
- Docker (opcional)

### Instalação
```bash
npm install
cp .env.example .env  # configurar variáveis
npm run db:migrate    # criar tabelas
npm run db:seed       # popular dados de teste
```

### Executar
```bash
npm run dev           # back-end em http://localhost:3000
npm run dev:client    # front-end em http://localhost:5173
```

### Testar
```bash
npm test              # testes unitários + integração
npm test -- --coverage  # com relatório de cobertura
```
```

---

## Miniestudo de Caso

### Criação de pedido sob instabilidade de rede

Durante uma demonstração, o usuário envia `POST /pedidos`. O servidor grava o pedido, mas a conexão cai antes da resposta chegar. O front-end não sabe se a operação concluiu e o usuário tenta novamente, gerando duplicidade.

### Leitura do problema

| Camada | Risco observado | Contramedida |
|--------|------------------|--------------|
| HTTP | resposta não chega ao cliente | timeout e tratamento explícito |
| aplicação | operação duplicada | chave de idempotência |
| experiência do usuário | incerteza sobre o resultado | mensagem clara e rastreável |
| observabilidade | difícil investigar incidente | `X-Request-ID` e logs correlacionados |

### Valor do caso

Aqui o aluno percebe por que resiliência não é só assunto de infraestrutura. O problema atinge regra de negócio, duplicidade de dados e confiança do usuário no sistema.

### Perguntas para discutir

1. Em que cenários retry é seguro para `GET` e perigoso para `POST`?
2. Como a idempotência reduz o impacto de falhas silenciosas?
3. Que evidência mínima a documentação final deveria trazer para mostrar que esse risco foi tratado?

---

## Checklist de Validação

- [ ] Timeout explícito configurado em todas as chamadas HTTP?
- [ ] Retry implementado **apenas** para status 429, 502, 503 (não para 4xx)?
- [ ] Circuit Breaker ou estratégia equivalente documentada?
- [ ] Erros de rede (sem resposta) produzem mensagem amigável ao usuário?
- [ ] POSTs críticos utilizam `Idempotency-Key` ou mecanismo equivalente?
- [ ] A tabela de RNFs de comunicação está preenchida com evidências?
- [ ] O README descreve como executar, testar e validar a aplicação?
- [ ] A documentação final está consistente com o código implementado?

---

## Exercício Prático

### Cenário
Você precisa implementar resiliência para a integração com **gateway de pagamentos externo** que apresenta instabilidade intermitente.

Requisitos:
- Timeout de 8 segundos (SLO do gateway é p99 ≤ 500ms)
- Retry apenas para 502, 503, 504 (não para 400, 401, 402, 422)
- Circuit Breaker: abre após 5 falhas consecutivas, fecha após 30 segundos
- Idempotência: usar `Idempotency-Key` com UUID v4

### Tarefa 1 — Circuit Breaker
Implemente a classe `CircuitBreaker` com os 3 estados (CLOSED, OPEN, HALF_OPEN).

### Tarefa 2 — Retry Seletivo
Implemente `fetchComRetry` que só tenta novamente para status 502, 503, 504 e 429 (respeitando `Retry-After`).

### Tarefa 3 — Documentação
Crie a tabela de RNFs de comunicação com:
- RNF
- Eixo ISO 25010
- Métrica
- Implementação
- Evidência

---

## Evolução do Conceito: Resiliência de Rede

Esta aula consolida todos os conceitos de resiliência vistos anteriormente:

| Conceito | Primeira Menção | Consolidação |
|----------|-----------------|--------------|
| **Timeout** | [Aula 08](./aula_08_async_integracao.md) — front-end | Aula 11 — backend + fundamentos TCP/IP |
| **Retry** | [Aula 08](./aula_08_async_integracao.md) — fetch | Aula 11 — retry seletivo por status HTTP |
| **SLI/SLO/SLA** | [Aula 02](./aula_02_rnf_metricas_sre.md) — métricas | Aula 11 — timeout baseado em SLO |
| **Idempotência** | [Aula 05](./aula_05_rest_endpoints.md) — verbos HTTP | Aula 11 — `Idempotency-Key` header |

---

## Ver Também

| Conceito | Documento Relacionado |
|----------|----------------------|
| Métricas SRE (SLI, SLO, SLA) | [Aula 02 — Métricas](./aula_02_rnf_metricas_sre.md) |
| Verbos HTTP e idempotência | [Aula 05 — REST](./aula_05_rest_endpoints.md) |
| Integração assíncrona (front-end) | [Aula 08 — Async](./aula_08_async_integracao.md) |
| Documentação final | [Índice Geral](./indice.md) |

---

## Referências

- [Saltzer, Reed e Clark (1984) — End-To-End Arguments in System Design](https://doi.org/10.1145/357401.357402)
- [SEBoK Wiki — System Integration](https://sebokwiki.org/wiki/System_Integration)
- [RFC 7230 — Hypertext Transfer Protocol (HTTP/1.1): Message Syntax and Routing](https://datatracker.ietf.org/doc/html/rfc7230)
- [Michael T. Nygard — Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/)
- [Sam Newman — Building Microservices](https://samnewman.io/books/building_microservices_2nd_edition/)

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **TCP** | Transmission Control Protocol — protocolo de transporte confiável e orientado à conexão |
| **End-to-End Argument** | Princípio que garante que funções críticas devem ser implementadas nas extremidades, não na rede |
| **Circuit Breaker** | Padrão que interrompe temporariamente chamadas para serviço falhando |
| **Exponential Backoff** | Estratégia de retry com intervalos crescentes exponencialmente |
| **Jitter** | Aleatoriedade adicionada ao backoff para evitar thundering herd |
| **Thundering Herd** | Múltiplos clientes tentando reconectar simultaneamente, sobrecarregando o servidor |
| **Idempotência** | Propriedade de uma operação que pode ser executada N vezes com o mesmo efeito de uma |
| **Keep-Alive** | Reutilização de conexão TCP entre múltiplas requisições HTTP |
| **3-way Handshake** | Processo de estabelecimento de conexão TCP (SYN, SYN/ACK, ACK) |
| **TLS** | Transport Layer Security — protocolo de criptografia para HTTPS |
| **Half-Open** | Estado intermediário do Circuit Breaker que testa se o serviço se recuperou |
