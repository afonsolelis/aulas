# Autoestudo: Métricas de Qualidade (SLI, SLO, SLA) e SRE

## Sumário
1. [Introdução](#introdução)
2. [O Tripé de Confiabilidade do SRE](#o-tripé-de-confiabilidade-do-sre)
3. [Porcentis vs. Médias](#porcentis-vs-médias)
4. [Aplicação Prática em Artefatos](#aplicação-prática-em-artefatos)
5. [Referências](#referências)

---

## Introdução

Após classificar Requisitos Não Funcionais (RNFs) nos **8 Eixos da ISO/IEC 25010**, é necessário definir métricas objetivas para validar se o sistema atende às restrições de qualidade especificadas.

Este documento apresenta o framework **SRE (*Site Reliability Engineering*)** e seu tripé de métricas (SLI, SLO, SLA) para monitoramento e garantia de confiabilidade em produção.

---

## O Tripé de Confiabilidade do SRE

O **SRE** é uma disciplina criada pelo Google que aplica princípios de engenharia de software para operações de infraestrutura. O framework define três níveis de métricas inter-relacionados:

### 1. SLI (*Service Level Indicator*)

**Definição:** Métrica observada que mede o nível de serviço prestado em um período específico.

| Característica | Descrição |
|----------------|-----------|
| **O que mede** | A realidade observada do sistema |
| **Fonte** | Dados de monitoramento (ex: Datadog, Prometheus) |
| **Exemplos comuns** | Latência, taxa de erro, disponibilidade, throughput |

**Exemplo:**
> "Nos últimos 5 minutos, o microsserviço de pagamentos processou 10.000 requisições com latência média de 250ms e 0 erros HTTP 5xx."

---

### 2. SLO (*Service Level Objective*)

**Definição:** Meta interna definida pela equipe de engenharia para um ou mais SLIs.

| Característica | Descrição |
|----------------|-----------|
| **Propósito** | Definir limites aceitáveis de operação |
| **Ação em violação** | Acionar alertas e possivelmente congelar *deploys* de novas funcionalidades |
| **Relação com SLA** | Deve ser mais rigoroso que o SLA para criar margem de segurança |

**Exemplo:**
> "99% das requisições ao endpoint de pagamentos devem responder em **latência ≤ 300ms**."

---

### 3. SLA (*Service Level Agreement*)

**Definição:** Contrato formal com clientes ou áreas de negócio que define garantias de serviço e consequências por descumprimento.

| Característica | Descrição |
|----------------|-----------|
| **Natureza** | Compromisso externo/contratual |
| **Consequências** | Multas, créditos de serviço, penalidades comerciais |
| **Relação com SLO** | SLO deve ser mais restritivo que o SLA |

**Exemplo:**
> "O serviço de pagamentos garante **99,5% de disponibilidade mensal**. Caso contrário, o cliente recebe crédito equivalente a 10% da mensalidade."

---

### Relação entre SLI, SLO e SLA

```
┌─────────────────────────────────────────────────────────┐
│  SLA (Contrato)                                         │
│  "99,5% disponibilidade"                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │  SLO (Meta Interna)                               │  │
│  │  "99,9% disponibilidade"                          │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  SLI (Métrica Observada)                    │  │  │
│  │  │  "99,92% disponibilidade atual"             │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Regra prática:** SLO deve ser aproximadamente **10x mais rigoroso** que o SLA para criar margem de segurança operacional.

---

## Porcentis vs. Médias

### O Problema das Médias

Métricas baseadas em **média aritmética** podem mascarar problemas de desempenho críticos.

**Exemplo ilustrativo:**

| Requisição | Latência |
|------------|----------|
| 1-9 | 10ms cada |
| 10 | 10.000ms |
| **Média** | **~1.000ms** |
| **p99** | **10.000ms** |

A média de ~1.000ms esconde que 1 usuário experimentou 10 segundos de latência. Para sistemas com milhares de requisições, a média não revela problemas na **cauda longa (*long tail*)** da distribuição.

---

### Trabalhando com Porcentis

**Porcentis** indicam o valor abaixo do qual uma porcentagem específica das observações se encontra.

| Porcentil | Significado | Caso de Uso |
|-----------|-------------|-------------|
| **p50** (Mediana) | 50% das requisições são mais rápidas | Visão geral de desempenho |
| **p90** | 90% das requisições são mais rápidas | Monitoramento de UX |
| **p95** | 95% das requisições são mais rápidas | SLOs comuns |
| **p99** | 99% das requisições são mais rápidas | SLOs críticos |
| **p99,9** | 99,9% das requisições são mais rápidas | Sistemas de missão crítica |

**Exemplo de redação técnica:**
> "Sob carga de 4.000 requisições/hora, a latência do **p99 não deve ultrapassar 300ms**."

Isso significa que 99% das requisições devem responder em até 300ms, permitindo que 1% das requisições (a cauda) possam exceder este limite — o chamado **Error Budget** (*Orçamento de Erro*).

---

## Aplicação Prática em Artefatos

### Exemplo de RNF com Métricas SRE

> **Requisito:** A arquitetura do catálogo deve suportar carga superior a 4.000 requisições/hora, mantendo latência p99 ≤ 300ms.

### Estratégias de Implementação

#### 1. Otimização de Banco de Dados

| Técnica | Descrição |
|---------|-----------|
| **Índices B-Tree** | Criar índices nas colunas utilizadas em buscas frequentes |
| **Índices Hash** | Para consultas de igualdade exata |
| **Read Replicas** | Distribuir leituras em réplicas do banco |
| **Cache (Redis)** | Armazenar resultados de consultas frequentes em memória |

**Justificativa:** Evitar *full table scans* que consomem recursos e aumentam latência.

---

#### 2. Resiliência e Proteção de Carga

| Mecanismo | Função |
|-----------|--------|
| **Circuit Breaker** | Interrompe chamadas para serviços indisponíveis |
| **Rate Limiter** | Limita requisições por cliente/período (ex: *token bucket*) |
| **Timeout** | Define limite máximo de espera para respostas |
| **Retry com backoff** | Nova tentativa com intervalo crescente |

**Exemplo de resposta HTTP:**
| Código | Significado |
|--------|-------------|
| `429 Too Many Requests` | Limite de taxa excedido |
| `503 Service Unavailable` | Serviço temporariamente indisponível |
| `504 Gateway Timeout` | Tempo de resposta excedido |

---

#### 3. Arquitetura Assíncrona

| Padrão | Aplicação |
|--------|-----------|
| **Filas de mensagens** | Desacoplar processamento de picos de carga |
| **Event-driven** | Reação a eventos sem bloqueio de requisições |
| **Processamento em lote** | Agrupar operações para eficiência |

---

### Checklist de Validação de RNF com SRE

- [ ] O RNF especifica qual **porcentil** deve ser utilizado (p90, p95, p99)?
- [ ] A **carga de referência** está definida (ex: 4.000 req/h)?
- [ ] Existe um **SLO interno** definido para esta métrica?
- [ ] O **SLA** com o negócio está documentado (se aplicável)?
- [ ] Há **estratégias de mitigação** descritas (cache, índices, circuit breaker)?
- [ ] O **Error Budget** está definido?

---

## Referências

- **Google SRE Book** — *Site Reliability Engineering* (O'Reilly, 2016)
- **Google SRE Workbook** — *The Site Reliability Workbook* (O'Reilly, 2018)
- **ISO/IEC 25010:2011** — *Systems and software engineering — Quality model*
- **SWEBOK v3** — *Guide to the Software Engineering Body of Knowledge*
- **ITIL 4** — *IT Infrastructure Library*

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **SLI** | *Service Level Indicator* — Indicador de nível de serviço |
| **SLO** | *Service Level Objective* — Objetivo de nível de serviço |
| **SLA** | *Service Level Agreement* — Acordo de nível de serviço |
| **SRE** | *Site Reliability Engineering* — Engenharia de confiabilidade de sites |
| **p99** | Percentil 99 — 99% das observações estão abaixo deste valor |
| **Error Budget** | Margem tolerável de erro antes de ações corretivas |
| **Circuit Breaker** | Padrão que interrompe chamadas para serviços falhos |
| **Rate Limiter** | Mecanismo que limita frequência de requisições |
| **Full table scan** | Varredura completa de uma tabela de banco de dados |
| **Backoff** | Estratégia de aumentar intervalos entre tentativas |
