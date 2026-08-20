# Aula 8 - MODELAGEM DE WAREHOUSES IV

## Descrição da Aula
Esta instrução tem como objetivo capacitar os alunos a projetar arquiteturas dimensionais corporativas capazes de integrar múltiplos processos de negócio em um único ambiente analítico consistente. Serão abordados conceitos avançados de modelagem dimensional propostos por Ralph Kimball, incluindo Conformed Dimensions, Bus Matrix, Fact Constellations e diferentes tipos de tabelas fato (transactional, periodic snapshot e accumulating snapshot). A instrução também explorará estratégias para integração de áreas de negócio, reutilização de dimensões corporativas e governança semântica dos dados,…

---
**Visão RM-ODP:** Computational
**Eixo:** Computação
**Assuntos:** —
**Sprint:** 2

### Onde queremos chegar
- [ ] Compreender os conceitos centrais da aula
- [ ] Relacionar o conteúdo ao projeto em andamento
- [ ] Identificar requisitos funcionais e não funcionais relevantes
- [ ] Aplicar o vocabulário técnico no contexto do projeto

---

## Auto Estudo Recomendado
**Tempo Estimado Total:** 120 min

1. **Advanced Dimensional Modeling (Kimball)** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=ltQgbSs99WU
   - Assista à aula sobre técnicas avançadas de modelagem dimensional e observe como os conceitos são aplicados em projetos reais de Business Intelligence.
2. **The Data Warehouse Toolkit (Material complementar Kimball Group)** (0.0 min) — Computação
   - Fonte: https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/
   - Estude as técnicas avançadas de modelagem dimensional apresentadas pelo Kimball Group, com foco em:
Slowly Changing Dimensions
Bridge Tables
Fact…
3. **Modeling Strategies and Alternatives for Data Warehousing Projects** (0.0 min) — Computação
   - Fonte: https://www.researchgate.net/publication/220421806_Modeling_strategies_and_alternatives_for_data_warehousing_projects
   - Leia o artigo, identificando as diferenças entre as abordagens de Kimball e Inmon para modelagem de Data Warehouses. Analise como as estratégias de…
4. **Ponderada em Sala #2** (0.0 min) — Computação
   - Fonte: https://www.inteli.edu.br/
   - A ponderada será definida pelo docente em sala de aula.
5. **Arquitetura de Dados - Material** (0.0 min) — Computação
   - Fonte: https://afonsolelis.github.io/aulas/pages/module-11-eng-software/materials/lesson-5-material.html
   - Requisitos arquiteturais — Arquitetura responde a volume, velocidade, variedade, criticidade, retenção, compliance, orçamento e perfil dos…
6. **Videoaula: Probabilidade condicional e independência** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=EbM4iOL56FE
   - Videoaula "Estatística e Probabilidade - Probabilidade condicional e independência" preparada pela Universidade Virtual do Estado de São Paulo…
7. **Autoestudo Guiado - Probabilidade Condicional e Teorema de Bayes** (0.0 min) — Matemática e Física
   - Fonte: https://drive.google.com/file/d/1ZYk40R3fXzSuDBXNYkBPfA3GSNAZsSF-/view?usp=sharing
   - O documento disponibilizado no link refere-se ao autoestudo guiado sobre o encontro da semana. Fazer os estudos e as atividades propostas no guia.
8. **Desafio de Matemática 1** (0.0 min) — Matemática e Física
   - Fonte: https://drive.google.com/file/d/1jMVrWcydP0Z6Lf-80DbXO6xZpypXbKJZ/view?usp=sharing
   - Desafio no ateliê, a respeito dos assuntos estudados na semana 1 (Modelagem Quantitativa e Estatística Descritiva). Trata-se de uma atividade…
9. **Ponderada em Sala #1** (0.0 min) — Computação
   - Fonte: https://www.inteli.edu.br/
   - A ponderada será definida pelo docente em sala de aula.
10. **Como Implementar Versionamento de Dados em Projetos de Engenharia de Dados** (0.0 min) — Computação
   - Fonte: https://cabecatech.com/dados/como-implementar-versionamento-de-dados-em-projetos-de-engenharia-de-dados
   - Pontos abordados no autoestudo:
 * Conceito e importância do versionamento de dados;
 * Benefícios do versionamento;
 * Ferramentas e tecnologias…
11. **Slowly Changing Dimensions: What they are and why they matter** (0.0 min) — Computação
   - Fonte: https://www.thoughtspot.com/data-trends/data-modeling/slowly-changing-dimensions-in-data-warehouse
   - Pontos abordados no autoestudo:
 * O que são Slowly Changing Dimensions (SCDs);
 * Impacto de modelos incorretos;
 * Tipos de SCD explicados;
 * Como…
12. **Design Tip #113 Creating, Using, and Maintaining Junk Dimensions** (0.0 min) — Computação
   - Fonte: https://www.kimballgroup.com/2009/06/design-tip-113-creating-using-and-maintaining-junk-dimensions
   - Pontos abordados no autoestudo:
 * Definição de Junk Dimension;
 * Construção inicial;
 * Exemplos práticos;
 * Integração com o fato;
 * Manutenção…
13. **Bridge Tables** (0.0 min) — Computação
   - Fonte: https://www.ibm.com/docs/en/cognos-analytics/12.1.0?topic=relationships-bridge-tables
   - Pontos abordados no autoestudo:
 * Definição;
 * Funções principais;
 * Exemplo prático;
 * Diferenciação.

## Template Para Preenchimento
---

# Aula 8 - MODELAGEM DE WAREHOUSES IV

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
