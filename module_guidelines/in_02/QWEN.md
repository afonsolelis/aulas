# QWEN.md — Contexto do Projeto IN02

## Visão Geral do Projeto

Este repositório contém o material didático completo para a disciplina **Refatoração e Arquitetura de Software (IN02)**, com foco na aplicação do framework **RM-ODP** (Reference Model of Open Distributed Processing) e gestão de **Requisitos Não Funcionais (RNF)** baseada nos 8 eixos da norma **ISO/IEC 25010** (SWEBOK).

O curso estrutura o desenvolvimento de software ao longo de **5 sprints** e **11 aulas**, cobrindo desde modelagem de negócios até resiliência de redes e autenticação.

### Frameworks e Metodologias Principais

| Framework | Descrição |
|-----------|-----------|
| **RM-ODP** | Modelo de referência para sistemas distribuídos com 5 visões: Enterprise, Information, Computational, Engineering, Technology |
| **ISO/IEC 25010** | Norma de qualidade de software com 8 eixos de RNF |
| **SWEBOK v3** | Guide to the Software Engineering Body of Knowledge (IEEE) |
| **SRE** | Site Reliability Engineering (Google) — métricas SLI/SLO/SLA |

---

## Estrutura do Diretório

```
in02/
├── QWEN.md                 # Este arquivo de contexto
├── GEMINI.md               # Skill de pesquisa acadêmica (curadoria científica)
├── refactor.txt            # Resumo prático completo do curso
├──
├── aulas/                  # Roteiros das 11 aulas
│   ├── aula_01.md          # Introdução aos Sistemas Web (Enterprise)
│   ├── aula_02.md          # Banco de Dados I (Enterprise + Information)
│   ├── aula_03.md          # Banco de Dados II (Information)
│   ├── aula_04.md          # Back-End I (Computational)
│   ├── aula_05.md          # Back-End II (Computational)
│   ├── aula_06.md          # Back-End III (Computational)
│   ├── aula_07.md          # Front-End I (Engineering + Technology)
│   ├── aula_08.md          # Front-End II (Engineering)
│   ├── aula_09.md          # Front-End III (Technology)
│   ├── aula_10.md          # Testes e Automação
│   ├── aula_11.md          # Mergulhando nas Redes
│   └── gemini.md           # Skill de pesquisa acadêmica
│
├── autoestudos/            # Material de aprofundamento técnico
│   ├── indice.md           # Mapa de dependências e ordem de leitura
│   ├── aula_01_rnf_8_eixos.md
│   ├── aula_02_rnf_metricas_sre.md
│   ├── aula_03_modelagem_relacional.md
│   ├── aula_04_uml_tdd.md
│   ├── aula_05_rest_endpoints.md
│   ├── aula_06_rtm_design_patterns.md
│   ├── aula_07_frontend_personas_contratos.md
│   ├── aula_08_async_integracao.md
│   ├── aula_09_estado_global_heuristicas.md
│   ├── aula_10_refatoracao_testes.md
│   └── aula_11_redes_resiliencia.md
│
├── artefatos/              # Templates de entrega por sprint
│   ├── sprint_01_artefato.md   # Modelagem do Domínio e Requisitos
│   ├── sprint_02_artefato.md   # Modelagem de Dados
│   ├── sprint_03_artefato.md   # Backend e API
│   ├── sprint_04_artefato.md   # Frontend e Integração
│   └── sprint_05_artefato.md   # Consolidação
│
└── .claude/
    └── settings.local.json     # Configurações locais do Claude
```

---

## Blocos de Aprendizado

O curso é organizado em 3 blocos alinhados às visões RM-ODP:

### Bloco 1: O QUÊ (Aulas 1-3) — Enterprise + Information
| Aula | Tema | Visão RM-ODP | Artefato Principal |
|------|------|--------------|-------------------|
| 1 | Introdução aos Sistemas Web | Enterprise | Mapa de atores + RF/RNF |
| 2 | Banco de Dados I | Enterprise + Information | Casos de uso + Minimundo + Regras de Negócio |
| 3 | Banco de Dados II | Information | Diagrama de classes do domínio + ER → DER → Modelo Físico |

### Bloco 2: COMO (Aulas 4-6) — Computational
| Aula | Tema | Visão RM-ODP | Artefato Principal |
|------|------|--------------|-------------------|
| 4 | Back-End I | Computational | Sequência + Atividade/Estado + TDD |
| 5 | Back-End II | Computational | Endpoints CRUD + Matriz RF×RN |
| 6 | Back-End III | Computational | RTM parcial + 8 eixos RNF |

### Bloco 3: ONDE (Aulas 7-11) — Engineering + Technology
| Aula | Tema | Visão RM-ODP | Artefato Principal |
|------|------|--------------|-------------------|
| 7 | Front-End I | Engineering + Technology | Telas + Contratos front-back |
| 8 | Front-End II | Engineering | Integração assíncrona + Retry/Timeout |
| 9 | Front-End III | Technology | RTM completo + Doc final |
| 10 | Testes e Automação | Computational + Engineering | Suite Jest refatorada |
| 11 | Mergulhando nas Redes | Engineering | RNF comunicação + Auth/Sessão |

---

## Os 8 Eixos de RNF (ISO/IEC 25010)

Toda análise técnica e documentação deve considerar:

| Eixo | Sigla | Descrição |
|------|-------|-----------|
| **Usabilidade** | USAB | Facilidade de uso, aprendizado e satisfação |
| **Confiabilidade** | CONF | Disponibilidade, tolerância a falhas, recuperabilidade |
| **Desempenho** | DES | Tempo de resposta, throughput, utilização de recursos |
| **Suportabilidade** | SUP | Manutenibilidade, escalabilidade, testabilidade |
| **Segurança** | SEG | Confidencialidade, integridade, autenticidade |
| **Capacidade** | CAP | Armazenamento, capacidade de processamento |
| **Restrições de Design** | REST | Padrões, linguagens, plataformas, interfaces |
| **Organizacionais** | ORG | Processos, times, políticas da organização |

---

## Rastreabilidade (RTM)

O projeto enfatiza a **Matriz de Rastreabilidade de Requisitos (RTM)**:

```
Persona → Necessidade → RF → RN → Endpoint → Tela → Teste → Evidência
```

### Atividades Ponderadas

| Ponderada | Bloco | Visões RM-ODP | Foco Principal |
|-----------|-------|---------------|----------------|
| 1 | Aulas 1-3 | Enterprise + Information | Modelagem de dados + UML |
| 2 | Aulas 4-6 | Computational | TDD + Regras de Negócio |
| 3 | Aulas 7-11 | Engineering + Technology | Integração + RTM + RNF |

---

## Tecnologias e Ferramentas

| Categoria | Tecnologia |
|-----------|------------|
| **Backend** | Node.js, Express |
| **Frontend** | React, TypeScript |
| **Banco de Dados** | PostgreSQL |
| **Testes** | Jest (TDD) |
| **Modelagem** | UML (Casos de Uso, Classes, Sequência, Atividade/Estado), ER/DER, BPMN |

---

## Glossário Técnico

| Termo | Definição |
|-------|-----------|
| **AAA** | Arrange-Act-Assert — estrutura de testes unitários |
| **Circuit Breaker** | Padrão que interrompe chamadas para serviço falhando |
| **DDL** | Data Definition Language — CREATE, ALTER, DROP |
| **DTO** | Data Transfer Object — estrutura de transporte entre camadas |
| **End-to-End Argument** | Princípio: funções críticas nas extremidades |
| **Error Budget** | Margem tolerável de erro antes de ações corretivas |
| **Exponential Backoff** | Retry com intervalos crescentes exponencialmente |
| **Idempotência** | N aplicações = mesmo resultado que 1 aplicação |
| **Keep-Alive** | Reutilização de conexão TCP entre requisições |
| **Migration** | Script versionado que evolui schema do banco |
| **Mock** | Test double com expectativas verificáveis |
| **Percentil (p99)** | 99% das observações estão abaixo deste valor |
| **Repository Pattern** | Padrão que abstrai acesso a dados |
| **SLI/SLO/SLA** | Métricas de nível de serviço (SRE) |
| **Timeout** | Limite de tempo para operação ser considerada falha |

---

## Referências Bibliográficas

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
- **Google SRE Book** — [sre.google/books](https://sre.google/books/)

---

## Uso deste Contexto

Este arquivo deve ser utilizado para:

1. **Entender a estrutura do curso** — Blocos, aulas e artefatos
2. **Aplicar o framework RM-ODP** — 5 visões na modelagem do sistema
3. **Garantir rastreabilidade** — RTM conectando requisitos a evidências
4. **Validar arquitetura** — 8 eixos de RNF contemplados na documentação
5. **Seguir a trilha de aprendizado** — Ordem recomendada de estudos

---

## Notas para Interações

- Ao analisar código ou documentação do projeto, sempre relacionar com as **visões RM-ODP** relevantes
- Ao propor mudanças, considerar o impacto nos **8 eixos de RNF**
- Manter a **rastreabilidade** entre RF, RN, testes e evidências
- Seguir o rigor científico da **Skill de Pesquisa Acadêmica** definida em `GEMINI.md`
