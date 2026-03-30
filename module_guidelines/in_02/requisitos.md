# Requisitos por Artefato — IN02

Mapeamento completo de quais aulas, autoestudos e habilidades são necessários para a entrega de cada artefato de sprint.

---

## Artefato 1 — Sprint 1: Casos de Uso, Domínio e Requisitos

**Arquivo:** `artefatos/sprint_01_artefato.md`

### Aulas necessárias

| Aula | Título | O que contribui para este artefato |
|------|--------|-------------------------------------|
| Aula 1 | Introdução aos Sistemas Web | Identificação dos 8 eixos de RNF em nível conceitual, mapa de atores, lista inicial de RF/RNF |
| Aula 2 | Banco de Dados I | Minimundo, delimitação de escopo, diagrama de casos de uso, regras de negócio numeradas (RN01, RN02...), ciclos de vida das entidades |

### Autoestudos necessários

| Autoestudo | Arquivo | Por que é necessário |
|------------|---------|----------------------|
| RNFs e 8 Eixos de Qualidade | `aula_01_rnf_8_eixos.md` | Base conceitual dos 8 eixos ISO/IEC 25010, definição de minimundo, boas práticas para redação de RNFs mensuráveis |
| Métricas SRE (SLI, SLO, SLA) | `aula_02_rnf_metricas_sre.md` | Transformar RNFs conceituais em valores mensuráveis (percentis, SLO, error budget) |

### Habilidades necessárias para a entrega

- Escrever um minimundo a partir do Workshop do Parceiro e do TAPI, delimitando escopo e fronteiras do sistema
- Identificar atores e seus papéis distintos no domínio
- Produzir um diagrama de casos de uso com os fluxos prioritários do sistema
- Descrever textualmente os casos de uso principais em nível suficiente para orientar as próximas sprints
- Listar 3 a 10 requisitos funcionais (RF) de forma objetiva e verificável
- Identificar ao menos 1 requisito não funcional por eixo dos 8 eixos ISO/IEC 25010 em nível conceitual
- Numerar e redigir regras de negócio (RN01, RN02...) de forma implementável e testável
- Construir a matriz inicial de rastreabilidade `RF → RN`
- Redigir critérios de aceite técnicos para os fluxos priorizados

---

## Artefato 2 — Sprint 2: Modelagem Estática e Estrutura da Solução

**Arquivo:** `artefatos/sprint_02_artefato.md`

### Aulas necessárias

| Aula | Título | O que contribui para este artefato |
|------|--------|-------------------------------------|
| Aula 3 | Banco de Dados II | Diagrama de classes do domínio, ER → DER → Modelo Físico, migrations DDL, rastreabilidade RN → Entidade → Tabela |

### Autoestudos necessários

| Autoestudo | Arquivo | Por que é necessário |
|------------|---------|----------------------|
| Modelagem Relacional | `aula_03_modelagem_relacional.md` | ER, DER com cardinalidades e chaves, formas normais, migrations, consultas SQL com formalização lógica |

### Habilidades necessárias para a entrega

- Construir diagrama ER com entidades, atributos e relacionamentos
- Produzir DER com cardinalidades, chaves primárias e estrangeiras sem inconsistências
- Elaborar diagrama de classes representando entidades do domínio e suas responsabilidades
- Escrever modelo físico em SQL executável sem erros de sintaxe ou dependência
- Criar scripts de migração (DDL) em ordem reproduzível
- Criar scripts de população com dados suficientes para validar os fluxos principais
- Formalizar logicamente as consultas SQL principais do sistema
- Refinar RNFs da Sprint 1 para o contexto de dados (armazenamento, integridade, desempenho, segurança)
- Estabelecer rastreabilidade explícita `RN → entidade/tabela`

---

## Artefato 3 — Sprint 3: Modelagem Dinâmica, Arquitetura e Primeira Versão do Backend

**Arquivo:** `artefatos/sprint_03_artefato.md`

### Aulas necessárias

| Aula | Título | O que contribui para este artefato |
|------|--------|-------------------------------------|
| Aula 4 | Back-End I | Diagrama de Sequência, Diagrama de Atividades ou Estados, TDD iniciado (Red → Green), contratos de entrada/saída |
| Aula 5 | Back-End II | Matriz RF × RN × Endpoint × Teste, endpoints CRUD, testes de integração com Supertest, UML atualizado |
| Aula 6 | Back-End III | RTM completa (RF → RN → Teste → Evidência), cobertura ≥80% nas Services, design patterns documentados |

### Autoestudos necessários

| Autoestudo | Arquivo | Por que é necessário |
|------------|---------|----------------------|
| UML Comportamental e TDD | `aula_04_uml_tdd.md` | Setup Jest, ciclo Red-Green-Refactor, padrão AAA, Repository Pattern, proteção de RNs por testes |
| APIs REST e Endpoints | `aula_05_rest_endpoints.md` | Testes de integração com Supertest, status codes HTTP, matriz RF × RN × Endpoint |
| RTM e Design Patterns | `aula_06_rtm_design_patterns.md` | RTM completa, geração de evidências de cobertura, Repository/Strategy/Factory patterns, SOLID |

### Habilidades necessárias para a entrega

- Desenhar diagrama de sequência UML para ao menos um fluxo prioritário de sucesso
- Desenhar diagrama de atividades ou de estados, em UML ou BPMN, para ao menos um fluxo relevante
- Escrever testes unitários Jest com padrão AAA (1 teste por regra de negócio)
- Escrever testes de integração com Supertest (sucesso, falha de validação, regra violada)
- Implementar endpoints REST com status codes corretos (200, 201, 400, 404, 409, 422)
- Configurar setup e teardown de banco nos testes de integração
- Gerar relatório de cobertura com `npm test -- --coverage` e atingir ≥80% nas Services
- Construir a RTM completa: `RF → RN → Endpoint → Teste → Evidência`
- Evoluir RNFs do nível conceitual para decisões técnicas (validação, tratamento de erro, testabilidade)
- Documentar a WebAPI com endereço, método HTTP, parâmetros e formato de resposta
- Redigir relatório de desenvolvimento descrevendo o que foi implementado, o que não foi e dificuldades técnicas

---

## Artefato 4 — Sprint 4: Sistema Integrado e Operacional

**Arquivo:** `artefatos/sprint_04_artefato.md`

### Aulas necessárias

| Aula | Título | O que contribui para este artefato |
|------|--------|-------------------------------------|
| Aula 7 | Front-End I | Telas principais vinculadas a RFs, contratos de integração, rastreabilidade Persona → RF → Endpoint → Tela |
| Aula 8 | Front-End II | Chamadas assíncronas, estados loading/success/error, timeout, retry, fluxos ponta a ponta pela interface |
| Aula 9 | Front-End III | Estado global, heurísticas de Nielsen, RTM completa com evidências, README atualizado |

### Autoestudos necessários

| Autoestudo | Arquivo | Por que é necessário |
|------------|---------|----------------------|
| Front-end I: Personas e Contratos | `aula_07_frontend_personas_contratos.md` | Personas, especificação Gherkin, contratos front-back, vinculação Tela → RF → Endpoint |
| Integração Assíncrona | `aula_08_async_integracao.md` | Event Loop, Promises, tratamento de timeout e retry, estados de requisição |
| Estado Global e Heurísticas | `aula_09_estado_global_heuristicas.md` | Context API, React Query, 10 heurísticas de Nielsen, mensagens de erro consistentes |

### Habilidades necessárias para a entrega

- Implementar telas principais do frontend integradas ao backend sem divergência de contrato
- Vincular cada tela a um requisito funcional específico e ao endpoint correspondente
- Documentar contratos de integração (entradas, saídas, tratamento de erro)
- Implementar chamadas assíncronas com tratamento dos estados: carregamento, sucesso, erro
- Aplicar timeout e retry nas chamadas de rede
- Configurar estado global (Context API ou React Query) de forma consistente entre telas
- Verificar as 10 heurísticas de Nielsen nas interfaces entregues
- Garantir que os fluxos principais sejam executáveis de ponta a ponta pela interface
- Completar a RTM técnica: `RF → RN → Endpoint → Teste → Evidência`
- Escrever README com instruções de execução, teste e validação da interface integrada
- Refinar RNFs para o contexto de integração (comunicação, confiabilidade, desempenho, segurança, observabilidade)

---

## Artefato 5 — Sprint 5: Refinamento Final e Publicação

**Arquivo:** `artefatos/sprint_05_artefato.md`

### Aulas necessárias

| Aula | Título | O que contribui para este artefato |
|------|--------|-------------------------------------|
| Aula 10 | Testes e Automação | Identificação de code smells, refatoração de testes mantendo cobertura, revisão de impactos de autenticação/autorização |
| Aula 11 | Mergulhando nas Redes | Autenticação com hash de senha, sessão por `session id`, autorização por rota, timeout/retry/circuit breaker, documentação final |

### Autoestudos necessários

| Autoestudo | Arquivo | Por que é necessário |
|------------|---------|----------------------|
| Refatoração de Testes | `aula_10_refatoracao_testes.md` | Distinção Mock/Stub/Fake/Spy, code smells em testes, débito técnico, isolamento por camada |
| Redes e Resiliência | `aula_11_redes_resiliencia.md` | TCP/IP aplicado, circuit breaker, idempotência, autenticação, sessão, bcrypt |

### Habilidades necessárias para a entrega

- Identificar duplicações, lacunas e baixa legibilidade na suite de testes
- Refatorar testes melhorando clareza e isolamento sem quebrar contratos estabelecidos
- Manter cobertura de fluxos críticos após refatorações
- Implementar autenticação com credenciais persistidas via hash bcrypt no banco de dados
- Implementar controle de sessão baseado em `session id` com persistência entre requisições
- Aplicar regras de autorização nas rotas, telas e operações conforme perfil do usuário autenticado
- Aplicar estratégias de resiliência: timeout, retry com backoff, circuit breaker
- Consolidar a documentação técnica final (arquitetura, WebAPI, banco, comportamento observado)
- Fechar evolutivamente todos os 8 eixos de RNF com evidências técnicas de atendimento
- Organizar o projeto para nível adequado de manutenção, continuidade de desenvolvimento e entrega acadêmica

---

## Visão Consolidada

| Artefato | Aulas | Autoestudos | Bloco RM-ODP |
|----------|-------|-------------|--------------|
| Sprint 1 | 1, 2 | aula_01, aula_02 | Enterprise + Information (framing + casos de uso) |
| Sprint 2 | 3 | aula_03 | Information (modelo estático) |
| Sprint 3 | 4, 5, 6 | aula_04, aula_05, aula_06 | Computational (modelo dinâmico + backend) |
| Sprint 4 | 7, 8, 9 | aula_07, aula_08, aula_09 | Engineering + Technology |
| Sprint 5 | 10, 11 | aula_10, aula_11 | Computational + Engineering (qualidade e consolidação) |

> Todos os autoestudos têm tempo estimado de 120 minutos. O autoestudo do guia completo das ponderadas (`ponderadas_guia_completo.md`) é transversal e recomendado antes de cada avaliação prática.
