# Aula 14 - MODELOS MENTAIS E DESIGN DE INTERAÇÃO

## Descrição da Aula
Objetivo
 * Distinguir modelo mental, modelo conceitual e sistema implementado, reconhecendo que o modelo mental é uma crença sobre como o sistema funciona, não uma descrição dele.
 * Mapear os modelos mentais dos três perfis de usuário do projeto, identificando que "pesquisa" designa objetos distintos para cada um e implica fluxos distintos.
 * Confrontar a sequência esperada pelo usuário com o ciclo de vida modelado no banco, verificando se ordem, granularidade e pontos de decisão correspondem ao trabalho real.
 * Explicar a lei de potência da aprendizagem e usá-la para estimar o custo de…

---
**Visão RM-ODP:** Computational
**Eixo:** User Experience
**Assuntos:** User Experience
**Sprint:** 2

### Onde queremos chegar
- [ ] Compreender os conceitos centrais da aula
- [ ] Relacionar o conteúdo ao projeto em andamento
- [ ] Identificar requisitos funcionais e não funcionais relevantes
- [ ] Aplicar o vocabulário técnico no contexto do projeto

---

## Auto Estudo Recomendado
**Tempo Estimado Total:** 120 min

1. **Data Catalog: What It Is and How to Implement It** (0.0 min) — Computação
   - Fonte: https://www.acceldata.io/blog/data-catalog
   - Pontos abordados no autoestudo:
 * Conceito de Data Catalog;
 * Exemplo prático;
 * Principais funcionalidades;
 * Desafios sem catálogo de dados;
 *…
2. **The 6 data quality dimensions with examples** (0.0 min) — Computação
   - Fonte: https://www.collibra.com/blog/the-6-dimensions-of-data-quality
   - Pontos abordados no autoestudo:
 * Contexto e motivação;
 * O que são dimensões de qualidade de dados?;
 * As 6 dimensões principais;
 * Ferramentas…
3. **Data Owner vs Data Steward vs Data Custodian, Role Definition and Responsibilities** (0.0 min) — Computação
   - Fonte: https://dqops.com/data-owner-data-steward-data-custodian-roles
   - Pontos abordados no autoestudo:
 * Visão Geral dos Papéis
 * Data Owner
 * Data Steward
 * Data Custodian
 * Relações e Differenciação
 * Exemplos…
4. **Data Governance : What is it? Concepts, Benefits and Comprehensive Guide** (0.0 min) — Computação
   - Fonte: https://www.decube.io/post/data-governance-concepts
   - Pontos abordados no autoestudo:
 * Introdução ao Data Governance;
 * Importância para tomadas de decisão, controle de custos, compliance e confiança…
5. **How Data Classification and Data Loss Prevention Go Hand in Hand** (0.0 min) — Computação
   - Fonte: https://www.endpointprotector.com/blog/how-data-classification-and-data-loss-prevention-go-hand-in-hand
   - Pontos abordados no autoestudo:
 * Definição de Data Classification;
 * Categorias de dados sensíveis;
 * Importância para compliance e segurança;
 *…
6. **12 Data Classification Best Practices for Your Business** (0.0 min) — Computação
   - Fonte: https://securiti.ai/data-classification-best-practices
   - Pontos abordados no autoestudo:
 * Entender o panorama de dados;
 * Definir objetivos e escopo claros;
 * Inventário de dados e avaliação de risco;
…
7. **Principais pontos de comparação entre a LGPD brasileira e a GDPR europeia** (0.0 min) — Computação
   - Fonte: https://gatefy.com/pt-br/blog/pontos-comparacao-lgpd-brasileira-gdpr-europeia
   - Pontos abordados no autoestudo:
 * Definição de dados pessoais e dados sensíveis;
 * Bases legais para tratamento;
 * Tratamento de dados sensíveis;
…
8. **Data Security and Privacy: Risks, Best Practices, and Compliance** (0.0 min) — Computação
   - Fonte: https://www.endpointprotector.com/blog/data-security-guide-what-is-data-security-threats-and-best-practices
   - Pontos abordados no autoestudo:
 * Definição de segurança de dados;
 * Importância da segurança de dados;
 * Benefícios de focar em segurança de…
9. **What are Mental Models?** (0.0 min) — User Experience
   - Fonte: https://ixdf.org/literature/topics/mental-models
   - Objetivos
 1. Compreender o conceito de modelos mentais no contexto de design
 2. Conhecer técnicas e ferramentas práticas para a definir modelos…
10. **The Power Law of Learning: Consistency vs. Innovation in User Interfaces** (0.0 min) — User Experience
   - Fonte: https://www.nngroup.com/articles/power-law-learning/
   - Objetivos
 1. Compreender o conceito de curva de aprendizado e o papel da memória na utilização de ferramentas.
 2. Ter contato com a discussão sobre…
11. **Optimizing Data Warehousing with PostgreSQL: Star Schema, Materialized Views, and Performance Tuning** (0.0 min) — Computação
   - Fonte: https://medium.com/%40anjunittur123/optimizing-data-warehousing-with-postgresql-star-schema-materialized-views-and-performance-2efc6b57c54f
   - Pontos abordados no autoestudo:
 * Contexto do problema;
 * Importância da otimização;
 * Modelo de dados: star schema;
 * Uso de materialized…
12. **Postgres Tuning & Performance for Analytics Data** (0.0 min) — Computação
   - Fonte: https://www.crunchydata.com/blog/postgres-tuning-and-performance-for-analytics-data
   - Pontos abordados no autoestudo:
 * Cenário OLTP vs OLAP em um único banco;
 * Exemplo prático com query pesada;
 * Configurações de parâmetros…
13. **Refreshable Materialized View** (0.0 min) — Computação
   - Fonte: https://clickhouse.com/docs/materialized-view/refreshable-materialized-view
   - Pontos abordados no autoestudo:
 * Conceito de views atualizáveis (refreshable);
 * Comparação com incremental materialized views;
 * Atualização…
14. **Materialized views in ClickHouse®: The data transformation Swiss Army knife** (0.0 min) — Computação
   - Fonte: https://www.propeldata.com/blog/materialized-views-in-clickhouse
   - Pontos abordados no autoestudo:
 * O que são materialized views no ClickHouse;
 * Vantagens principais;
 * Desvantagens e trade-offs;
 *…

## Template Para Preenchimento
---

# Aula 14 - MODELOS MENTAIS E DESIGN DE INTERAÇÃO

## 1. Visão RM-ODP Trabalhada
- [ ] Enterprise / Information / Computational / Engineering / Technology

## 2. Requisitos Funcionais (RF)
| ID  | Descrição                          | Status        |
|-----|------------------------------------|---------------|
| RF001 | ...                              | Implementado  |

## 3. Requisitos Não Funcionais (8 eixos)
| Eixo | Requisito | Como atendido |
|------|-----------|---------------|
| Usabilidade | ... | ... |
| Confiabilidade | ... | ... |
| Desempenho | ... | ... |
| Suportabilidade | ... | ... |
| Segurança | ... | ... |
| Capacidade | ... | ... |
| Restrições de Design | ... | ... |
| Organizacionais | ... | ... |

## 4. Artefatos de Modelagem
- [ ] Link/nome do artefato (ER, DER, Classes, Sequência, etc.)

## 5. Rastreabilidade
- RN01 → RF001 → Teste001 → Evidência
- ...

## 6. Evidências
- [ ] Screenshots, logs de teste, prints de execução
