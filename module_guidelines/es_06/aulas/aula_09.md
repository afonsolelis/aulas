# Aula 9 - MEDIDAS DE PROXIMIDADE: ENCONTRANDO VIZINHOS COM K-NN

## Descrição da Aula
Este encontro tem como objetivo introduzir a ideia de que a proximidade (ou distância) entre pontos ou registros de dados é um conceito fundamental em muitos domínios, especialmente na aprendizado de máquina, estatística e análise de dados. Abordaremos as diferentes naturezas de dados, Medidas de Proximidade para Dados Contínuos, Medidas de Proximidade para Dados Categóricos, Medidas Baseadas em Ângulo e discutiremos a importância de normalizar/escalonar dados antes de calcular distâncias, especialmente quando os atributos têm diferentes escalas ou unidades. Aqui introduziremos uma técnicas…

---
**Visão RM-ODP:** Computational
**Eixo:** Matemática e Física
**Assuntos:** Álgebra vetorial euclidiana
,Espaços vetoriais
,Conceito de probabilidade
**Sprint:** 2

### Onde queremos chegar
- [ ] Compreender os conceitos centrais da aula
- [ ] Relacionar o conteúdo ao projeto em andamento
- [ ] Identificar requisitos funcionais e não funcionais relevantes
- [ ] Aplicar o vocabulário técnico no contexto do projeto

---

## Auto Estudo Recomendado
**Tempo Estimado Total:** 120 min

1. **Videoaula 1: Top 6 Machine Learning Algorithms for Beginners - Classification (by Visual Studio Design)** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=e-lHu0U9UY4
   - Assista ao vídeo "Top 6 Machine Learning Algorithms for Beginners - Classification", desenvolvido por Visual Design Studio. Uma introdução aos seis…
2. **Desafio 01: Decomposição em Valores Singulares (SVD)** (0.0 min) — Matemática e Física
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9788521637509/epubcfi/6/34[%3Bvnd.vst.idref%3Dchapter04]!/4/190/4/3:24[os.%2C%20Di]
   - Atividade a ser desenvolvida na instrução.
3. **Arquitetura Orientada a Serviços - Visão da AWS** (0.0 min) — Computação
   - Fonte: https://aws.amazon.com/pt/what-is/service-oriented-architecture/
   - Neste auto estudo o aluno verá o que é a arquietura SOA do ponto de vista da IBM
4. **Arquitetura Orientada a Serviços - Visão da Microsoft** (0.0 min) — Computação
   - Fonte: https://learn.microsoft.com/pt-br/dotnet/architecture/microservices/architect-microservice-container-applications/service-oriented-architecture
   - Neste auto estudo o aluno verá o que é a arquietura SOA do ponto de vista da AWS
5. **Arquitetura Orientada a Serviços - Visão da IBM** (0.0 min) — Computação
   - Fonte: https://www.ibm.com/br-pt/topics/soa
   - Neste auto estudo o aluno verá o que é a arquietura SOA do ponto de vista da Microsoft
6. **Norma ISO 25010** (0.0 min) — Computação
   - Fonte: https://iso25000.com/index.php/en/iso-25000-standards/iso-25010/
   - Como garantir que um software atenda não apenas às suas funcionalidades, mas também aos critérios de qualidade essenciais?
Este autoestudo explora a…
7. **Requisitos não funcionais no contexto de SOA** (0.0 min) — Computação
   - Fonte: http://www.thinkmind.org/index.php?view=article&articleid=icsea_2011_5_20_10148
   - Neste artigo, na seção II, ITEM B , o aluno irá ver quais os requisitos não-funcionais que influenciam na arquitetura SOA.
8. **Arquitetura de Referencia SOA - TOGAF** (0.0 min) — Computação
   - Fonte: http://www.opengroup.org/soa/source-book/soa_refarch/p4.htm
   - Como estabelecer uma arquitetura orientada a serviços (SOA) eficaz que atenda aos objetivos estratégicos de uma organização?
Este autoestudo explora…
9. **Exemplo de um diagrama de arquitetura SOA em UML** (0.0 min) — Computação
   - Fonte: https://www.researchgate.net/figure/Simplified-UML-deployment-diagram-of-a-generic-enterprise-scale-SOA-system-The-asterisks_fig3_221050709
   - Como representar visualmente uma arquitetura orientada a serviços (SOA) utilizando a linguagem UML?

Este autoestudo oferece uma perspectiva visual…
10. **Exemplo de um diagrama de arquitetura SOA de componentes** (0.0 min) — Computação
   - Fonte: https://www.researchgate.net/figure/Layers-of-SOA-Reference-Architecture-8_fig2_228962956
   - Neste autoestudo o estudante terá uma perspectiva mais visual da arquitetura de componentes da SOA e de como seus componentes se integram. Verifique…
11. **Design Arquitetural SOA e Requisitos Não Funcionais** (0.0 min) — Computação
   - Fonte: https://www.ibm.com/docs/pt-br/rsas/7.5.0?topic=services-component-diagrams
   - Esta é uma atividade prática e avaliativa estruturada para ser realizada durante a aula. Os alunos deverão aplicar os conceitos de Arquitetura…
12. **The New Rules of B2B Lead Generation** (0.0 min) — Negócios
   - Fonte: https://hbr.org/2021/06/the-new-rules-of-b2b-lead-generation
   - O artigo discute como os métodos tradicionais de geração de leads B2B, como ligações não solicitadas e envio de e-mail, estão se tornando menos…
13. **Funil de vendas: saiba o que é e conheça suas etapas** (0.0 min) — Negócios
   - Fonte: https://www.zendesk.com.br/blog/funil-de-vendas-o-que-e/
   - O texto apresenta informações sobre como usar o funil de vendas para acompanhar e gerenciar o processo de vendas de uma empresa. Também oferece…
14. **O que são Leads?** (0.0 min) — Negócios
   - Fonte: https://www.youtube.com/watch?v=wwl1hHOIn7Y
   - Geração de leads é um termo de marketing usado para descrever o início do interesse ou questão de um possível cliente num determinado produto ou…
15. **O que é Marketing Digital?** (0.0 min) — Negócios
   - Fonte: https://integrada.minhabiblioteca.com.br/books/9789896946548
   - Serão apresentados conceitos fundamentais e às estratégias essenciais do marketing digital. Exploraremos como a internet e as tecnologias digitais…
16. **Atividade de UX** (0.0 min) — User Experience
   - Fonte: https://www.inteli.edu.br/
   - Esse autoestudo não tem material específico para você ler ou assistir antes da instrução. Ele é apenas um espaço para você enviar a sua atividade…
17. **How to Develop and Test a Mobile-First Design in 2021** (0.0 min) — User Experience
   - Fonte: https://css-tricks.com/how-to-develop-and-test-a-mobile-first-design-in-2021/
   - Este autoestudo leva o design mobile-first para o centro e explora as complexidades do desenvolvimento e dos testes de design mobile-first e como…
18. **Basics of UI Design for Mobile Apps - Artboard Size, Screen Density and Resolution for Beginners** (0.0 min) — User Experience
   - Fonte: https://www.youtube.com/watch?v=viNNYye4qG0
   - Vamos conhecer as estéticas mais indicadas para aplicativos móveis, entender como nosso produto se apresenta, quais as necessidades da nossa solução…
19. **Intro to UI Design Patterns** (0.0 min) — User Experience
   - Fonte: https://balsamiq.com/learn/courses/intro-to-ui-design/ui-design-patterns/
   - Um padrão de design é uma solução reutilizável para um problema que ocorre comumente. Assim como uma receita culinária fornece os ingredientes e a…
20. **The internet is starting to break, here's why** (0.0 min) — User Experience
   - Fonte: https://www.youtube.com/watch?v=wVYG1mu8Lg8
   - Como a predominância de certos modelos de negócio em um determinado setor podem afetar a experiência do usuário? O vídeo discute como a qualidade da…

## Template Para Preenchimento
---

# Aula 9 - MEDIDAS DE PROXIMIDADE: ENCONTRANDO VIZINHOS COM K-NN

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
