# Aula 19 - ARMAZENAMENTO EM GRANDE ESCALA

## Descrição da Aula
Esta instrução tem como objetivo introduzir os alunos ao conceito de Data Lakes como uma arquitetura moderna de armazenamento e gerenciamento de grandes volumes de dados, estruturados e não estruturados. A instrução abordará os principais componentes, vantagens e desafios dessa abordagem, comparando-a com Data Warehouses e explorando seu papel em ecossistemas de Big Data e Analytics. Os alunos serão preparados para compreender os fundamentos técnicos, arquiteturais e estratégicos do uso de Data Lakes em ambientes corporativos orientados a dados.
Link do conteúdo da nossa aula:…

---
**Visão RM-ODP:** Computational
**Eixo:** Computação
**Assuntos:** Sistemas de arquivos distribuídos
,Modelo de entidades e relacionamentos (MER)
**Sprint:** 3

### Onde queremos chegar
- [ ] Compreender os conceitos centrais da aula
- [ ] Relacionar o conteúdo ao projeto em andamento
- [ ] Identificar requisitos funcionais e não funcionais relevantes
- [ ] Aplicar o vocabulário técnico no contexto do projeto

---

## Auto Estudo Recomendado
**Tempo Estimado Total:** 120 min

1. **Data Management Maturity Model—Process Dimensions and Capabilities to Leverage Data-Driven Organizations Towards Industry 5.0** (0.0 min) — Computação
   - Fonte: https://www.mdpi.com/2571-5577/8/2/41
   - Pontos abordados no autoestudo:
 * Motivação e objetivo;
 * Modelo de referência;
 * Metodologia (De Bruin);
 * Refinamento do modelo;
 * Descrição…
2. **Data Governance Strategy: Building a Framework for Trust and Compliance** (0.0 min) — Computação
   - Fonte: https://diggrowth.com/blogs/data-management/data-governance-strategy
   - Pontos abordados no autoestudo:
 * Introdução ao tema;
 * Importância estratégica;
 * Frameworks de referência;
 * Papéis e responsabilidades;
 *…
3. **Ciclo de Vida dos Dados: Perspectiva da Ciência da Informação** (0.0 min) — Computação
   - Fonte: https://ojs.uel.br/revistas/uel/index.php/informacao/article/download/27940/20124/0
   - Pontos abordados no autoestudo:
 * Introdução & contexto;
 * Importância do data mapping;
 * Fases do ciclo de vida dos dados;
 * Aplicações…
4. **Videoaula: Teste de normalidade (Shapiro-Wilk e Kolmogorov-Smirnov)** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=4JioMYx1VjQ
   - Video "Teste de Normalidade no SPSS (Shapiro-Wilk e Kolmogorov-Smirnov)" preparada pelo canal Universitando. Pode-se assistir apenas os seis minutos…
5. **Videoaula: Anova, teste de Kruskal Wallis e Friedman** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=6qRlVlfGdGc
   - Video "ANOVA, teste de Kruskal Wallis e Friedman" preparada pelo Prof. Moacir Pereira Junior. Assista ao vídeo para ter uma compreensão básica sobre…
6. **Videoaula: Testes paramétricos e não paramétricos** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=CkLTOzXdAeo
   - Video "Testes Paramétrico x Não Paramétrico e Pré-Requisitos (Normalidade e Homogeneidade da variância)" preparado pelo canal Estatística Básica para…
7. **Videoaula: Testes de hipóteses** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=gbk5SJBtfjg
   - Videoaula "Aula 3.1 | Testes de Hipóteses | Prof. Lisiane Selau" preparada pela Profa. Lisiane Selau. Assista ao vídeo para revisar os conceitos…
8. **Autoestudo Guiado - Testes Estatísticos** (0.0 min) — Matemática e Física
   - Fonte: https://drive.google.com/file/d/1sOKXIxDcFf_Rs_v69xkXIkvSdgttTyTt/view?usp=sharing
   - O documento disponibilizado no link refere-se ao autoestudo guiado sobre o encontro da semana. Fazer os estudos e as atividades propostas no guia.
9. **Desafio de Matemática 2** (0.0 min) — Matemática e Física
   - Fonte: https://drive.google.com/file/d/1RjPioxrMi5K1OyrO2srVa6TkmFMvdMGv/view?usp=sharing
   - Desafio no ateliê, a respeito dos assuntos estudados na semana 3 (Probabilidade Condicional e Teorema de Bayes). Trata-se de uma atividade individual…
10. **Questão de negócios 01** (0.0 min) — Negócios
   - Fonte: https://www.inteli.edu.br/
   - Será realizada ativdade em sala com os alunos presentes.
Considerando a crescente importância da orientação por dados nas empresas modernas, avalie o…
11. **The Future of Data | Tiago Santos | TEDxEUBusinessSchoolBarcelona** (0.0 min) — Negócios
   - Fonte: https://www.youtube.com/watch?v=H598lrc7SIw
   - Com mais de 15 anos de experiência na gestão de pessoas, desenvolvimento de estratégias e auxiliando no crescimento de empresas, Tiago Santos…
12. **A cultura data-driven como indutora da transformação** (0.0 min) — Negócios
   - Fonte: https://mittechreview.com.br/a-cultura-data-driven-como-indutora-da-transformacao/
   - Empresas que tomam decisões baseadas em dados experimentam um crescimento anual de mais de 30%, segundo relatório Insights-Driven Businesses Set The…
13. **The data-driven enterprise of 2025** (0.0 min) — Negócios
   - Fonte: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-data-driven-enterprise-of-2025
   - Este guia destina-se a ajudar os executivos a compreender as características da nova empresa orientada por dados e as capacidades que elas…
14. **Ponderada em Sala #3** (0.0 min) — Computação
   - Fonte: https://www.inteli.edu.br/
   - A ponderada será definida pelo docente em sala de aula.
15. **Ingestão e Tratamento de Dados Raw** (0.0 min) — Computação
   - Fonte: https://colab.research.google.com/drive/18A7s1Sm2qbiMGlGxtVTIN2rXKha0vqor?usp=sharing
   - Criação de um pipeline de ingestão de dados do obkect storage.
16. **Qual é a diferença entre um data warehouse, um data lake e um data mart?** (0.0 min) — Computação
   - Fonte: https://aws.amazon.com/pt/compare/the-difference-between-a-data-warehouse-data-lake-and-data-mart/
   - Data warehouses, data lakes e data marts são diferentes soluções de armazenamento em nuvem. Um data warehouse armazena dados em um formato…
17. **Databases Vs Data Warehouses Vs Data Lakes - What Is The Difference And Why Should You Care?** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=FxpRL0m9BcA
   - Este vídeo explora as diferenças entre bancos de dados, data warehouses e data lakes, destacando a importância de cada um e por que devemos nos…
18. **Case Coca Cola Andina** (0.0 min) — Computação
   - Fonte: https://cobalt-blarney-8b3.notion.site/Estudo-de-Caso-Os-Desafios-Cr-ticos-de-Dados-da-Coca-Cola-Andina-250256ceaea78028b1c3cb5d4ed774b0
   - A Coca-Cola Andina, uma das principais engarrafadoras e distribuidoras da marca Coca-Cola na América Latina, enfrenta uma crise de gestão de dados…

## Template Para Preenchimento
---

# Aula 19 - ARMAZENAMENTO EM GRANDE ESCALA

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
