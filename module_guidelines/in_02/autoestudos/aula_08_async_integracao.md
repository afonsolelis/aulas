# Autoestudo: Integração Assíncrona — Event Loop, Promises e Resiliência de Rede

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Perspectiva dos Corpos de Conhecimento](#perspectiva-dos-corpos-de-conhecimento)
3. [O Event Loop do JavaScript (V8)](#o-event-loop-do-javascript-v8)
4. [Promises, Async/Await e Cancelamento](#promises-asyncawait-e-cancelamento)
5. [Máquina de Estados de Chamadas HTTP](#máquina-de-estados-de-chamadas-http)
6. [Resiliência: Timeout, Retry e Fallback](#resiliência-timeout-retry-e-fallback)
7. [Integração com Axios — Padrões Técnicos](#integração-com-axios--padrões-técnicos)
8. [Checklist de Validação](#checklist-de-validação)
9. [Referências](#referências)
10. [Glossário](#glossário)

---

## Contexto e Objetivo

A Aula 8 aprofunda a visão **Engineering** do RM-ODP com foco nas transparências de comunicação: o front-end precisa lidar com a natureza assíncrona e não-confiável da rede. O artefato da **Sprint 4** exige chamadas assíncronas implementadas com os estados carregamento/sucesso/erro, tratamento de falha de rede (timeout, retry) e a RTM com evidências de integração.

---

## Perspectiva dos Corpos de Conhecimento

### SWEBOK v3 — Software Design: Concurrency Design

O SWEBOK identifica **concorrência** como uma das propriedades de design mais difíceis de raciocinar formalmente. Para sistemas web assíncronos:

| Propriedade | Descrição | Impacto no Front-end |
|-------------|-----------|---------------------|
| **Non-determinism** | Ordem de conclusão de operações assíncronas é imprevisível | Race condition entre duas chamadas paralelas |
| **Deadlock** | Duas tarefas aguardando indefinidamente uma à outra | Menos comum em JS single-threaded, mas possível com Promises encadeadas erradas |
| **Liveness** | Garantia de que uma operação eventualmente completa | Necessidade de timeout explícito |

### Lamport (1978) — Time, Clocks, and Ordering of Events

Leslie Lamport provou formalmente que em sistemas distribuídos **não existe um relógio global confiável**. Implicação direta: ao fazer duas chamadas HTTP paralelas, não há garantia de qual resposta chega primeiro — a ordem de chegada não reflete a ordem de envio.

```
Envio:      ─────── req1 ──────── req2 ───────────
Resposta:   ─────────────── res2 ─────── res1 ────
```

**Consequência no código:** Uma chamada mais antiga pode sobrescrever uma resposta mais recente se não houver controle de versão/cancelamento.

---

## O Event Loop do JavaScript (V8)

### Arquitetura do Runtime

```
┌───────────────────────────────────────────────────┐
│  JavaScript Engine (V8)                           │
│                                                   │
│  ┌────────────┐    ┌────────────┐                 │
│  │ Call Stack │    │  Heap      │                 │
│  │ (síncrono) │    │ (objetos)  │                 │
│  └─────┬──────┘    └────────────┘                 │
│        │                                          │
│  ┌─────▼──────────────────────────────────────┐   │
│  │              Event Loop                    │   │
│  └─────┬──────────────────────────────────────┘   │
│        │                                          │
│  ┌─────▼──────┐    ┌─────────────┐               │
│  │ Microtask  │    │  Task Queue │               │
│  │ Queue      │    │ (Macrotask) │               │
│  │ (Promises) │    │ (setTimeout)│               │
│  └────────────┘    └─────────────┘               │
└───────────────────────────────────────────────────┘
         ↕ Web APIs (fetch, setTimeout, DOM events)
```

### Prioridade de Execução

```
1. Call Stack (síncrono — bloqueia tudo enquanto executa)
2. Microtask Queue (Promises .then/.catch, queueMicrotask)
3. Task Queue / Macrotask (setTimeout, setInterval, I/O callbacks)
```

**Exemplo crítico:**
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);    // macrotask
Promise.resolve().then(() => console.log('3')); // microtask
console.log('4');

// Saída: 1, 4, 3, 2
// Microtask (Promise) sempre antes de macrotask (setTimeout)
```

### Por que isso importa no front-end?

`async/await` é açúcar sintático sobre Promises (Microtask Queue). Isso garante que atualizações de estado via `setState` em callbacks assíncronos não bloqueiam a thread principal — a UI continua responsiva enquanto aguarda a rede.

---

## Promises, Async/Await e Cancelamento

### Cadeia de Promises vs. Async/Await

```typescript
// Estilo Promise chain (mais verboso, mais explícito)
fetch('/api/produtos')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(dados => setProdutos(dados))
  .catch(err => setError(err.message))
  .finally(() => setLoading(false));

// Estilo Async/Await (mais legível, mesma semântica)
async function carregarProdutos() {
  try {
    setLoading(true);
    const res = await fetch('/api/produtos');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const dados = await res.json();
    setProdutos(dados);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro desconhecido');
  } finally {
    setLoading(false);
  }
}
```

### Cancelamento com AbortController

Problema: componente desmontado antes da resposta chegar → `setState` em componente desmontado → memory leak.

```typescript
useEffect(() => {
  const controller = new AbortController();

  async function carregar() {
    try {
      const res = await fetch('/api/produtos', {
        signal: controller.signal  // vincula ao AbortController
      });
      const dados = await res.json();
      setProdutos(dados); // só executa se não foi cancelado
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return; // cancelamento esperado — não é erro
      }
      setError('Falha ao carregar produtos');
    }
  }

  carregar();

  return () => controller.abort(); // cleanup: cancela ao desmontar
}, []);
```

---

## Máquina de Estados de Chamadas HTTP

### Modelagem Formal dos Estados

```
        início
           │
           ▼
       ┌───────┐
       │ IDLE  │ ── usuário submete formulário ──►
       └───────┘
                                                 ▼
                                          ┌──────────┐
                              ◄── erro ── │ LOADING  │ ── sucesso ──►
                              │           └──────────┘               │
                              ▼                                       ▼
                        ┌─────────┐                            ┌─────────┐
                        │  ERROR  │                            │ SUCCESS │
                        └─────────┘                            └─────────┘
                              │                                       │
                     usuário tenta novamente            nova ação do usuário
                              │                                       │
                              └──────────────────────────────────────┘
                                                  │
                                                  ▼
                                              ┌───────┐
                                              │ IDLE  │
                                              └───────┘
```

### Implementação com `useReducer` (React)

```typescript
type Estado =
  | { tipo: 'IDLE' }
  | { tipo: 'LOADING' }
  | { tipo: 'SUCCESS'; dados: Produto[] }
  | { tipo: 'ERROR'; mensagem: string };

type Acao =
  | { tipo: 'INICIAR' }
  | { tipo: 'SUCESSO'; dados: Produto[] }
  | { tipo: 'FALHA'; mensagem: string }
  | { tipo: 'RESETAR' };

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.tipo) {
    case 'INICIAR':  return { tipo: 'LOADING' };
    case 'SUCESSO':  return { tipo: 'SUCCESS', dados: acao.dados };
    case 'FALHA':    return { tipo: 'ERROR', mensagem: acao.mensagem };
    case 'RESETAR':  return { tipo: 'IDLE' };
    default:         return estado;
  }
}
```

---

## Resiliência: Timeout, Retry e Fallback

### Timeout Explícito com AbortController

```typescript
async function fetchComTimeout(url: string, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`Timeout após ${timeoutMs}ms`);
    }
    throw err;
  }
}
```

### Retry com Exponential Backoff

```typescript
async function fetchComRetry<T>(
  fn: () => Promise<T>,
  maxTentativas = 3,
  delayBaseMs = 500
): Promise<T> {
  let ultimoErro: Error;

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      return await fn();
    } catch (err) {
      ultimoErro = err instanceof Error ? err : new Error(String(err));

      if (tentativa < maxTentativas) {
        const delay = delayBaseMs * Math.pow(2, tentativa - 1); // 500, 1000, 2000ms
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw ultimoErro!;
}

// Uso
const produtos = await fetchComRetry(
  () => api.get<Produto[]>('/produtos').then(r => r.data),
  3,       // 3 tentativas
  500      // delay inicial: 500ms, depois 1000ms, depois 2000ms
);
```

---

## Integração com Axios — Padrões Técnicos

### Instância Configurada

```typescript
// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,                    // 10 segundos
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor: adiciona token de autenticação
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: trata erros globalmente
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Checklist de Validação

- [ ] Toda chamada HTTP exibe estado de carregamento (spinner, skeleton ou disabled button)?
- [ ] Estados de sucesso, erro 4xx e erro 5xx têm representação visual distinta?
- [ ] Existe timeout configurado em todas as chamadas (não aguardar indefinidamente)?
- [ ] Chamadas em `useEffect` têm cleanup com `AbortController`?
- [ ] Erros de rede (sem resposta do servidor) são tratados separadamente de erros HTTP?
- [ ] A RTM contém evidências de integração (screenshot, log, teste de integração)?
- [ ] Retries são implementados com backoff exponencial (não loop fixo)?
- [ ] O tratamento de erro 401 redireciona para login?

---

## Exercício Prático

### Cenário
Você precisa implementar uma busca de produtos com as seguintes características:
- Busca com debounce de 300ms (usuário digita nome do produto)
- Timeout de 5 segundos
- Retry automático em falhas 503 (máximo 3 tentativas)
- Cancelamento da requisição se usuário digitar novo termo antes da resposta chegar

### Tarefa 1 — Hook com AbortController
Implemente `useBuscaProdutos(termo: string)` que:
- Cancela requisição anterior quando `termo` muda
- Gerencia estados: idle, loading, success, error

### Tarefa 2 — Retry com Backoff
Implemente a função `fetchComRetry` respeitando apenas erros 502, 503, 504 como retentáveis.

### Tarefa 3 — Máquina de Estados
Desenhe o diagrama de estados da busca (incluindo transições de cancelamento).

---

## Evolução do Conceito: Resiliência de Rede

Os padrões de resiliência são detalhados em profundidade na [Aula 11](./aula_11_redes_resiliencia.md), que cobre:
- Circuit Breaker (não abordado nesta aula)
- Idempotência em operações de escrita
- Fundamentos TCP/IP e HTTP
- Quando NÃO fazer retry (400, 401, 403, 404, 422)

---

## Ver Também

| Conceito | Documento Relacionado |
|----------|----------------------|
| Estados de UI e heurísticas | [Aula 09 — Estado Global](./aula_09_estado_global_heuristicas.md) |
| Timeout e retry (backend) | [Aula 11 — Redes](./aula_11_redes_resiliencia.md) |
| Contratos de API | [Aula 07 — Front-end I](./aula_07_frontend_personas_contratos.md) |

---

## Referências

- **Lamport, L.** (1978) — *Time, Clocks, and the Ordering of Events in a Distributed System* — ACM CACM
- **SWEBOK v3** — *Software Design: Concurrency Design* — IEEE Computer Society
- **ECMA-262** — *ECMAScript Language Specification: Async Functions and Promises*
- **MDN Web Docs** — *AbortController API, Fetch API, Event Loop*
- **Axios Documentation** — *Interceptors, Timeout, CancelToken*

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Event Loop** | Mecanismo que controla a execução de código síncrono e callbacks assíncronos |
| **Microtask** | Tarefa de alta prioridade executada antes do próximo ciclo do Event Loop (Promises) |
| **Macrotask** | Tarefa de baixa prioridade (setTimeout, setInterval, I/O) |
| **AbortController** | API Web para cancelar requisições fetch/axios em andamento |
| **Exponential Backoff** | Estratégia de retry com intervalos crescentes exponencialmente |
| **Race Condition** | Bug causado por dois processos assíncronos competindo pelo mesmo estado |
| **Timeout** | Limite de tempo após o qual uma operação é considerada falha |
| **Interceptor** | Função que intercepta requisições/respostas para aplicar lógica transversal |
| **Non-blocking I/O** | Operações de I/O que não bloqueiam a thread principal enquanto aguardam |
