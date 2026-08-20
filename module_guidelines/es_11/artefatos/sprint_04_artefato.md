# Sprint 4 — Especificação dos Dashboards em Power BI - versão 2, Dashboards - versão 1, Pipeline ETL - versão 2

## Descrição

Este artefato consolida as entregas da Sprint 4. As atividades abaixo compõem a avaliação da sprint.

**Bloco:** Bloco 3: Onde (Engineering + Technology)
**Visão RM-ODP:** Engineering + Technology

## Artefatos da Sprint

### Especificação dos Dashboards em Power BI - versão 2

**Peso:** 3 | **Semana:** 8

**Objetivo:**

Este documento define as diretrizes que devem ser seguidas no desenvolvimento de dashboards interativos no Power BI.
Os dashboards devem:
 * Apoiar decisões estratégicas e técnicas do Parceiro;
 * Estar alinhados com os dados dos cubos dimensionais previamente modelados;
 * Atender às user stories e critérios de aceitação documentados no projeto;
 * Considerar privacidade e segurança conforme a LGPD;
 * Ser responsivos, navegáveis e segmentáveis por filtros relevantes. 

Entregáveis Esperados:
 * Um arquivo .pbix contendo os dashboards prontos;
 * Um documento Especificação-dos-Dashboards-em-Power BI.md na pasta docs contendo:Visão geral dos dashboards criados;
 * Justificativa para cada visual escolhido;
 * Tabela de rastreabilidade entre dashboards e requisitos funcionais (RFs);
 *…

---

### Dashboards - versão 1

**Peso:** 3 | **Semana:** 8

**Objetivo:**

Este documento reúne os elementos necessários para a implementação final dos reports no Power BI, agora conectados diretamente aos cubos de dados derivados do repositório analítico estruturado pelo grupo. A construção visual da interface já foi definida com base no mockup anterior, e nesta etapa o foco está em detalhar como os gráficos, indicadores e painéis foram implementados com base nos cubos, assegurando integridade analítica e funcionalidade interativa.
O grupo deverá também realizar testes de usabilidade a partir de um plano de tarefas realistas e documentar os resultados, validando se a navegação, filtragem e exploração dos dados ocorrem corretamente.
Todo o conteúdo deverá ser registrado no arquivo solucao_dashboard.md, localizado na pasta docs/ do repositório do grupo.
1.…

---

### Pipeline ETL - versão 2

**Peso:** 3 | **Semana:** 8

**Objetivo:**

Documento de Especificação Técnica – Sistema ETL com Orquestração e Observabilidade
1. Objetivo
Este documento define a especificação técnica para o desenvolvimento do sistema de ETL (Extract, Transform, Load), responsável pela integração de dados entre múltiplas fontes e o Data Warehouse. O sistema será implementado em Python, orquestrado por um gerenciador de fluxos (DAG) e dotado de mecanismos de observabilidade para monitoramento de desempenho, disponibilidade e qualidade dos dados.
 O objetivo é entregar um pipeline confiável, modular, rastreável e alinhado às boas práticas de engenharia de software e operações modernas.

2. Escopo
O escopo do projeto inclui:
Desenvolvimento do módulo ETL em Python com arquitetura em camadas.
Instalação e configuração de um gerenciador de DAGs (ex:…

---

## Alinhamento com as Aulas

### Metas das aulas desta sprint

#### Desvendando o Poder do Hábito
- Eixo: Liderança
- Objetivo: Você acredita genuinamente que é possível mudar? 
Comportamentos podem ser aprendidos? Até que ponto? 
Como as empresas avaliam o desenvolvimento de…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Processamento de Streaming de Dados e Eventos
- Eixo: Computação
- Objetivo: .
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Sustentabilidade e Gestão Ambiental
- Eixo: Negócios
- Objetivo: A instrução terá como objetivo trabalhar os fundamentos de sustentabilidade e gestão ambiental, perpassando  conceitos básicos, incluindo os…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Teoria da informação e análise multivariada para seleção de variáveis e interpretação de padrões
- Eixo: Matemática e Física
- Objetivo: O encontro tem como objetivo ampliar a análise de dados para situações com múltiplas variáveis, apresentando ferramentas matemáticas que ajudam a…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Contratos de Dados e Qualidade na Integração Analítica
- Eixo: Computação
- Objetivo: .
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Integração do Datawarehouse com a Interface Analítica
- Eixo: Computação
- Objetivo: Esta instrução tem como objetivo capacitar os alunos a realizar a integração entre cubos analíticos modelados no ClickHouse e dashboards construídos…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Acessibilidade em Dashboards de BI
- Eixo: User Experience
- Objetivo: Um dashboard bonito não é a mesma coisa que um dashboard acessível. Nesta instrução vamos falar sobre como pessoas com daltonismo ou baixa visão…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Métricas e Telemetria em ETLs
- Eixo: Computação
- Objetivo: Esta instrução tem como objetivo ensinar os alunos a implementar métricas e telemetria no processo de ETL, com foco em observabilidade do sistema por…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

## Critérios de aceite gerais

- as entregas refletem o estado atual do código e da documentação, sem componentes fantasmos
- os requisitos funcionais estão rastreáveis aos endpoints e telas implementados
- os requisitos não funcionais cobrem os 8 eixos da ISO/IEC 25010 com métricas verificáveis
- a matriz de rastreabilidade (RTM) está atualizada sem lacunas nos fluxos priorizados