# Índice de Autoestudos — IN02

Coleção de documentos de autoestudo para apoio aos artefatos das sprints. Material organizado por ordem de leitura recomendada, com dependências explícitas entre conceitos.

---

## 📚 Ordem de Leitura Recomendada

| Aula | Documento | Sprint | Pré-requisitos | Conteúdo Principal |
|------|-----------|--------|----------------|-------------------|
| 01 | [Fundamentos de Sistemas Web, Requisitos e Minimundo](./aula_01_fundamentos_sistemas_web.md) | Sprint 1 | Nenhum | Cliente-servidor, HTTP, RF/RN/RNF, escopo |
| 02 | [Modelagem ER e SQL Básico](./aula_02_modelagem_er_sql_basico.md) | Sprint 1 | Aula 01 | Entidades, atributos, chaves, SELECT inicial |
| 03 | [CRUD em SQL e Integridade](./aula_03_crud_integridade_sql.md) | Sprint 2 | Aula 02 | DDL, DML, constraints, cenários de erro |
| 04 | [JOINS e Consultas Relacionais](./aula_04_joins_consultas_relacionais.md) | Sprint 2 | Aula 03 | INNER/LEFT JOIN, agregação e leitura de dados |
| 05 | [Node.js, Models e Controllers](./aula_05_node_models_controllers.md) | Sprint 3 | Aula 04 | Estrutura do backend, camadas e fluxo HTTP |
| 06 | [Endpoints HTTP e Documentação de API](./aula_06_endpoints_http_documentacao.md) | Sprint 3 | Aula 05 | payloads, status codes, validação e documentação |
| 07 | [HTML, DOM e JavaScript](./aula_07_html_dom_javascript.md) | Sprint 4 | Aula 06 | HTML semântico, eventos, DOM e validação simples |
| 08 | [Integração Assíncrona](./aula_08_async_integracao_redes.md) | Sprint 4 | Aulas 06, 07 | Event Loop, timeout, retry e estados de tela |
| 09 | [CSS e Heurísticas de Interface](./aula_09_css_heuristicas_interface.md) | Sprint 4 | Aulas 07, 08 | layout, feedback visual, usabilidade |
| 10 | [Testes em Aplicações Web e Automação](./aula_10_testes_automacao_web.md) | Sprint 5 | Aulas 05, 06, 09 | tipos de teste, priorização, evidências |
| 11 | [Redes e Resiliência](./aula_11_redes_resiliencia.md) | Sprint 5 | Aulas 02, 08 | TCP/IP, Circuit Breaker, Idempotência |
| — | **[Guia Completo das Ponderadas](./ponderadas_guia_completo.md)** | **Todas** | **Aulas 1-6** | **RNFs, Testes Black-Box, RTM** |

---

## 🗺️ Mapa por Fase do Projeto

```
                    FUNDAMENTAÇÃO (Sprint 1)
                    ┌────────────────────────┐
                    │  Aula 01: RNFs + ISO   │
                    │  Aula 02: SRE + SLI    │
                    └───────────┬────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        MODELAGEM           BACKEND           FRONT-END
       (Sprint 2)          (Sprint 3)        (Sprint 4)
    ┌────────────┐    ┌─────────────┐    ┌──────────────┐
    │ Aula 03:   │    │ Aula 04:    │    │ Aula 07:     │
    │ Modelagem  │    │ UML + TDD   │    │ Personas     │
    │ Relacional │    │ Aula 05:    │    │ Aula 08:     │
    └────────────┘    │ REST        │    │ Async        │
                      │ Aula 06:    │    │ Aula 09:     │
                      │ RTM         │    │ Estado       │
                      └─────────────┘    └──────────────┘
                                │                 │
                                └────────┬────────┘
                                         │
                                         ▼
                              CONSOLIDAÇÃO (Sprint 5)
                              ┌────────────────────┐
                              │ Aula 10: Refat.    │
                              │ Aula 11: Redes     │
                              └────────────────────┘
```

---

## 📊 Ponderadas — Avaliações Práticas

As Ponderadas são avaliações práticas aplicadas em 3 momentos do curso:

| Ponderada | Aula | Foco | Entrega Principal | Rastreabilidade |
|-----------|------|------|-------------------|-----------------|
| **P1** | Aula 4 | RNFs Técnicos + Diagramas | 3 Diagramas de Sequência + Tabela RNF | RF → RNF → Diagrama |
| **P2** | Aula 6 | Testes Black-Box | Suite Jest (4 casos) + Banco Real | RF → RN → Teste |
| **P3** | Aula 9 | RTM Completo | Matriz RTM + Tabela RNF + Evidências | Persona → Evidência |

### Guia de Estudo para Ponderadas

O documento **[Guia Completo das Ponderadas](./ponderadas_guia_completo.md)** cobre:

- ✅ Explicação detalhada de cada ponderada
- ✅ Templates e exemplos de código
- ✅ Critérios de avaliação e dicas para nota máxima
- ✅ Rastreabilidade entre as 3 ponderadas
- ✅ Checklists de preparação

### Progressão das Ponderadas

```
Ponderada 1 (Design)
    ↓
Ponderada 2 (Implementação + Testes)
    ↓
Ponderada 3 (Documentação + Rastreabilidade)
```

Cada ponderada **consolida** a anterior — os RNFs definidos na P1 são testados na P2 e rastreados na P3.

---

## 📖 Glossário Unificado

Termos técnicos ordenados alfabeticamente. Para definições completas, consulte o glossário de cada aula.

| Termo | Definição Curta | Aula Principal |
|-------|-----------------|----------------|
| **AAA** | Arrange-Act-Assert — estrutura de testes unitários | 04 |
| **BCNF** | Boyce-Codd Normal Form — forma normal refinada | 03 |
| **Circuit Breaker** | Padrão que interrompe chamadas para serviço falhando | 11 |
| **DDL** | Data Definition Language — CREATE, ALTER, DROP | 03 |
| **Dependency Injection** | Técnica de fornecer dependências externamente | 06 |
| **DTO** | Data Transfer Object — estrutura de transporte entre camadas | 04 |
| **End-to-End Argument** | Princípio: funções críticas nas extremidades | 11 |
| **Error Budget** | Margem tolerável de erro antes de ações corretivas | 02 |
| **Event Loop** | Mecanismo de execução síncrona/assíncrona em JS | 08 |
| **Exponential Backoff** | Retry com intervalos crescentes exponencialmente | 08, 11 |
| **Factory Pattern** | Padrão que centraliza criação de objetos | 06 |
| **Formas Normais** | 1FN, 2FN, 3FN, BCNF — eliminação de anomalias | 03 |
| **Heurística (Nielsen)** | Princípio de avaliação de usabilidade | 09 |
| **Idempotência** | N aplicações = mesmo resultado que 1 aplicação | 05, 11 |
| **ISO/IEC 25010** | Norma de qualidade de software (8 eixos) | 01 |
| **Keep-Alive** | Reutilização de conexão TCP entre requisições | 11 |
| **Migration** | Script versionado que evolui schema do banco | 03 |
| **Mock** | Test double com expectativas verificáveis | 10 |
| **Percentil (p99)** | 99% das observações estão abaixo deste valor | 02 |
| **Persona** | Representação arquetípica de stakeholders | 07 |
| **Repository Pattern** | Padrão que abstrai acesso a dados | 06 |
| **REST** | Estilo arquitetural para APIs web | 05 |
| **Retry** | Nova tentativa após falha de rede/servidor | 08, 11 |
| **RTM** | Requirements Traceability Matrix | 06 |
| **Server State** | Dados que pertencem ao servidor | 09 |
| **SLA** | Service Level Agreement — contrato com cliente | 02 |
| **SLI** | Service Level Indicator — métrica observada | 02 |
| **SLO** | Service Level Objective — meta interna | 02 |
| **SOLID** | 5 princípios de design orientado a objetos | 06 |
| **SRE** | Site Reliability Engineering | 02 |
| **Strategy Pattern** | Padrão para algoritmos intercambiáveis | 06 |
| **SWEBOK** | Software Engineering Body of Knowledge | 01 |
| **TDD** | Test-Driven Development — Red-Green-Refactor | 04 |
| **Timeout** | Limite de tempo para operação ser considerada falha | 08, 11 |
| **Toast** | Notificação temporária não-modal | 09 |

---

## 🔗 Referências Cruzadas por Conceito

### ISO/IEC 25010 (8 Eixos de Qualidade)
- **Definição formal:** Aula 01
- **Aplicação em backend:** Aula 06
- **Aplicação em frontend:** Aula 09
- **RNFs de comunicação:** Aula 11

### RTM (Matriz de Rastreabilidade)
- **Primeira menção:** Aula 05 (matriz RF × RN)
- **Formato completo:** Aula 06 (RF → RN → Teste → Evidência)
- **Com personas:** Aula 07 (Persona → RF → Endpoint)
- **Fechamento:** Aula 09 (RTM completa)

### Repository Pattern
- **Definição:** Aula 04 (interface + implementação)
- **Aplicação em testes:** Aula 06 (injeção de dependência)
- **Refatoração:** Aula 10 (Fake vs. Mock)

### Percentis e Métricas SRE
- **Definição de percentis:** Aula 02
- **SLI/SLO/SLA:** Aula 02
- **Aplicação em RNFs:** Aula 11 (timeout baseado em SLO)

### Tratamento de Erros
- **HTTP status codes:** Aula 05
- **Frontend (estados):** Aula 08
- **Heurística H9 (mensagens):** Aula 09
- **Resiliência de rede:** Aula 11

### Testes
- **TDD básico:** Aula 04
- **Cobertura e RTM:** Aula 06
- **Refatoração e mocks:** Aula 10

---

## 📋 Artefatos por Sprint

### Sprint 1 — Casos de Uso e Framing
- [ ] Mapa de atores do sistema (Aula 01)
- [ ] Diagrama de casos de uso com escopo delimitado (Aula 02)
- [ ] Descrição textual dos casos de uso prioritários (Aula 02)
- [ ] Classificar RNFs nos 8 eixos (Aula 01)
- [ ] Definir métricas SRE para RNFs críticos (Aula 02)
- [ ] Tabela de RNFs com valores mensuráveis
- [ ] Matriz inicial RF → RN

### Sprint 2 — Modelagem Estática
- [ ] Diagrama de classes do domínio (Aula 03)
- [ ] Diagrama ER completo (Aula 03)
- [ ] DER com cardinalidades (Aula 03)
- [ ] Modelo físico com migrations (Aula 03)
- [ ] Tabela de rastreabilidade RN → tabela → constraint

### Sprint 3 — Modelagem Dinâmica, Backend e API
- [ ] Diagrama de Sequência para fluxos críticos (Aula 04)
- [ ] Diagrama de Atividades ou Estados para fluxo relevante (Aula 04)
- [ ] Testes Jest por caso de uso (Aula 04)
- [ ] Endpoints CRUD funcionando (Aula 05)
- [ ] Matriz RF × RN × Endpoint × Teste (Aula 05, 06)
- [ ] Design Patterns documentados (Aula 06)

### Sprint 4 — Frontend e Integração
- [ ] Frontend com telas principais implementadas e integradas ao backend (Aula 07)
- [ ] Personas com necessidades derivando RFs (Aula 07)
- [ ] Contratos de integração front-back (Aula 07)
- [ ] Vinculação Tela → RF → Endpoint (Aula 07)
- [ ] Estados loading/success/error implementados (Aula 08)
- [ ] Timeout e retry configurados (Aula 08)
- [ ] Fluxos principais executáveis de ponta a ponta pela interface (Aula 08)
- [ ] Estado global (Context/React Query) (Aula 09)
- [ ] Heurísticas de Nielsen verificadas (Aula 09)
- [ ] RTM completa com evidências (Aula 09)
- [ ] README com instruções de execução e validação da interface integrada (Aula 09)

### Sprint 5 — Consolidação
- [ ] Identificação de code smells em testes (Aula 10)
- [ ] Refatoração mantendo cobertura (Aula 10)
- [ ] Revisão dos impactos de autenticação/autorização após refatorações (Aula 10)
- [ ] Autenticação com senha hasheada persistida no banco (Aula 11)
- [ ] Sessão baseada em `session id` implementada (Aula 11)
- [ ] Regras de autorização aplicadas nas rotas e fluxos principais (Aula 11)
- [ ] Circuit breaker ou estratégia equivalente (Aula 11)
- [ ] Idempotência em operações críticas (Aula 11)
- [ ] Documentação final completa (Aula 11)
- [ ] README com instruções de execução (Aula 11)

---

## 🏷️ Padronização de Terminologia

Este documento estabelece a grafia padrão para termos recorrentes:

| Termo | Grafia Padrão | Variação Evitar |
|-------|---------------|-----------------|
| Percentil | **percentil** | porcentil |
| Frontend | **front-end** (substantivo), **frontend** (adj.) | front end |
| Backend | **back-end** (substantivo), **backend** (adj.) | back end |
| Body of Knowledge | **BoK** (sigla), **corpo de conhecimento** | — |
| Service Level Agreement | **SLA** | — |
| Site Reliability Engineering | **SRE** | — |

---

## 📚 Referências Bibliográficas Gerais

- **ISO/IEC 25010:2011** — Systems and software engineering — Quality model
- **SWEBOK v3** — Guide to the Software Engineering Body of Knowledge — IEEE
- **SEBoK** — Systems Engineering Body of Knowledge
- **BABOK v3** — Business Analysis Body of Knowledge — IIBA
- **DMBOK v2** — Data Management Body of Knowledge — DAMA
- **Fielding, R.T. (2000)** — Architectural Styles and the Design of Network-based Software Architectures — UC Irvine
- **Nielsen, J. (1994)** — Usability Engineering — Academic Press
- **Gamma, E. et al. (1994)** — Design Patterns — Addison-Wesley
- **Beck, K. (2002)** — Test-Driven Development — Addison-Wesley
- **Fowler, M. (2018)** — Refactoring (2nd ed.) — Addison-Wesley
- **Nygard, M.T. (2018)** — Release It! — Pragmatic Programmers

---

## 📝 Como Usar Este Índice

1. **Iniciante:** Comece pela Aula 01 e siga a ordem recomendada.
2. **Consulta pontual:** Use o glossário ou referências cruzadas para encontrar conceitos.
3. **Por sprint:** Consulte a seção "Artefatos por Sprint" para saber quais aulas apoiam cada entrega.
4. **Revisão:** Use os checklists de cada aula para autoavaliação antes de submeter artefatos.
