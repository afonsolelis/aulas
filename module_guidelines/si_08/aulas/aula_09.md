# Aula 9 - PRINCIPAL COMPONENT ANALYSIS

## Descrição da Aula
This session will present some preprocessing operations that can be performed on datasets before they are used by ML algorithms. These operations include data integration, data transformations, and dimensionality reduction. In the latter case, principal component analysis is one method we will explore for dimensionality reduction.

---
**Visão RM-ODP:** Computational
**Eixo:** Matemática e Física
**Assuntos:** Retas e planos
,Diagonalização
,Espaços vetoriais
,Sistemas lineares
,Resolução de sistemas lineares
,Análise de variância
,Teoremas fundamentais
**Sprint:** 2

### Onde queremos chegar
- [ ] Compreender os conceitos centrais da aula
- [ ] Relacionar o conteúdo ao projeto em andamento
- [ ] Identificar requisitos funcionais e não funcionais relevantes
- [ ] Aplicar o vocabulário técnico no contexto do projeto

---

## Auto Estudo Recomendado
**Tempo Estimado Total:** 120 min

1. **RDD Programming Guide** (0.0 min) — Computação
   - Fonte: https://spark.apache.org/docs/latest/rdd-programming-guide.html
   - At a high level, every Spark application consists of a driver program that runs the user’s main function and executes various parallel operations on…
2. **Beginner's Guide to OLTP vs OLAP Data Systems** (0.0 min) — Computação
   - Fonte: https://zerotomastery.io/blog/oltp-vs-olap/
   - This comprehensive article compares OLTP and OLAP, explaining how each system stores, processes, and structures data. It covers ETL patterns,…
3. **ETL: A Complete Guide To Extract, Transform, And Load** (0.0 min) — Computação
   - Fonte: https://www.rudderstack.com/learn/etl/etl-guide/
   - This comprehensive article covers the universal concepts of ETL, including its stages, benefits, challenges, best practices, and use cases. It…
4. **Extract, transform, load (ETL) - Azure Architecture Center** (0.0 min) — Computação
   - Fonte: https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/etl
   - Microsoft’s detailed guide about ETL versus ELT, their processes, architectures, and how to optimize data workflows using Azure tools like Data…
5. **Building a Pipeline from Scratch - Data Engineering Course** (0.0 min) — Computação
   - Fonte: https://www.freecodecamp.org/news/learn-the-essentials-of-data-engineering/
   - This self-study activity consists of a video from freeCodeCamp. You should watch the segment from 1:05 to 1:31 (hours:minutes), where the instructor…
6. **Great Leadership Is a Network, Not a Hierarchy** (0.0 min) — Liderança
   - Fonte: https://www.youtube.com/watch?v=tZ7ySrDVqOs
   - In this video, you’ll explore new perspectives on how groups function, focusing on the often unseen forces that shape influence, authority, and…
7. **Four Keys to a Healthy Workplace Hierarchy** (0.0 min) — Liderança
   - Fonte: https://greatergood.berkeley.edu/article/item/four_keys_to_a_healthy_workplace_hierarchy
   - Can workplace hierarchies actually be healthy and beneficial? According to the article, the answer is yes—when they are well structured. The author…
8. **Organisational Structures Explained** (0.0 min) — Liderança
   - Fonte: https://www.youtube.com/watch?v=LCAAivdxVTU
   - This video introduces key reflections on how power structures and hierarchies influence decision-making and group effectiveness. It invites us to…
9. **How does hierarchical structure influence collaboration?** (0.0 min) — Liderança
   - Fonte: https://www.wimi-teamwork.com/blog/influence-hierarchical-on-collaboration/
   - Can hierarchies hinder collaboration? The article examines the impact of hierarchical structures on collaboration within organizations. It discusses…
10. **Why connect is the key for successful digital transformation** (0.0 min) — Negócios
   - Fonte: https://www.ted.com/talks/anna_choi_why_connect_is_the_key_for_successful_digital_transformation
   - Anna Choi is an experienced professional in driving digital transformation in the smart cities and infrastructure sectors. Currently, as Head of…
11. **What is business intelligence (BI)?** (0.0 min) — Negócios
   - Fonte: https://www.sap.com/products/data-cloud/cloud-analytics/what-is-business-intelligence.html
   - Most companies collect a massive volume of business data every day – flowing in from their enterprise resource planning (ERP) software, e-commerce…
12. **Why Intelligence at the Edge is No Longer Optional** (0.0 min) — Negócios
   - Fonte: https://www.rtinsights.com/why-intelligence-at-the-edge-is-no-longer-optional/
   - By processing data locally, organizations can filter and act on the most important insights immediately, while sending only relevant or aggregated…
13. **The Demand for “Cradle-to-Grave” Data Management in Large Financial Institutions** (0.0 min) — Negócios
   - Fonte: https://grcoutlook.com/the-demand-for-cradle-to-grave-data-management-in-large-financial-institutions/
   - Financial institutions grappling with significant, ongoing challenges in their management of valuable communications data. These challenges are…
14. **Graded Activity: Principal Component Analysis** (0.0 min) — Matemática e Física
   - Fonte: http://
   - This card refers to a graded activity that will be conducted during the mathematics instruction. No submission is required through this card; simply…
15. **Optional: Video 2: PCA, by StatQuest** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=FgakZw6K1QQ
   - Watch the video: "StatQuest: Principal Component Analysis (PCA), Step by Step," by StatQuest with Josh Starmer. Principal Component Analysis is one…
16. **Optional: Video 1: Principal Component Analysis (PCA), by Visually Explained.** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=FD4DeN81ODY
   - Watch the video "Principal Component Analysis (PCA)", by Visually Explained. This video introduces Principal Component Analysis (PCA). PCA is used to…
17. **Principal Component Analysis** (0.0 min) — Matemática e Física
   - Fonte: https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Chemometrics_Using_R_(Harvey)/11%3A_Finding_Structure_in_Data/11.03%3A_Principal_Component_Analysis
   - For a concise, direct-to-the point explanation about "Principal Component Analysis", read the following article by Zakaria Jaadi. Note, however, that…

## Template Para Preenchimento
---

# Aula 9 - PRINCIPAL COMPONENT ANALYSIS

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
