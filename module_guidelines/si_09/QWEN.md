# QWEN.md — Contexto do Projeto SI09

## Visão Geral do Projeto

Este repositório contém o material didático completo para a disciplina **Dashboards Gerenciais (SI09)**, com foco na aplicação do framework **RM-ODP** (Reference Model of Open Distributed Processing) e gestão de **Requisitos Não Funcionais (RNF)** baseada nos 8 eixos da norma **ISO/IEC 25010** (SWEBOK).

O curso estrutura o desenvolvimento de software ao longo de **5 sprints** e **31 aulas**.

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
si_09/
├── QWEN.md                 # Este arquivo de contexto
├── GEMINI.md               # Skill de pesquisa acadêmica
├── CLAUDE.md               # Contexto para Claude Code
├── AGENTS.md               # Guidelines de repositório
├── proposta_inicial.md     # Resumo prático por bloco
├── requisitos.md           # Mapeamento artefato -> aulas/autoestudos
├── endpoints_publicos_aulas.md
├── aulas/                  # Roteiros das 31 aulas
├── autoestudos/            # Material de aprofundamento técnico
├── artefatos/              # Templates das entregas de sprint
├── ponderadas/             # Guias das atividades ponderadas
└── suporte/                # Referências (SWEBOK, SEBoK, Use Case)
```

---

## Os 8 Eixos de RNF

1. Usabilidade (USAB) | 2. Confiabilidade (CONF) | 3. Desempenho (DES) | 4. Suportabilidade (SUP)
5. Segurança (SEG) | 6. Capacidade (CAP) | 7. Restrições de Design (REST) | 8. Organizacionais (ORG)

---

## Rastreabilidade

`Persona -> Necessidade -> RF -> RN -> Endpoint -> Tela -> Teste -> Evidência`
