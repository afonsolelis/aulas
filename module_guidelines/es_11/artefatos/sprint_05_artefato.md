# Sprint 5 — Especificação dos Dashboards em Power BI - versão 1, Análise Financeira do Projeto, Documentação Técnica do Projeto (+1)

## Descrição

Este artefato consolida as entregas da Sprint 5. As atividades abaixo compõem a avaliação da sprint.

**Bloco:** Bloco 3: Onde (Engineering + Technology)
**Visão RM-ODP:** Engineering + Technology

## Artefatos da Sprint

### Especificação dos Dashboards em Power BI - versão 1

**Peso:** 3 | **Semana:** 10

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
 * Um documento Especificação-dos-Dashboards-em-Power BI.md na pasta docs contendo:
   * Visão geral dos dashboards criados;
   * Justificativa para cada visual escolhido;
   * Tabela de rastreabilidade entre dashboards e requisitos funcionais…

---

### Análise Financeira do Projeto

**Peso:** 2 | **Semana:** 10

**Objetivo:**

Este documento tem como objetivo orientar a elaboração de uma Análise Financeira detalhada referente ao projeto de implantação de um Data Warehouse integrado a dashboards analíticos, cujo propósito é fornecer suporte ágil e assertivo à tomada de decisões gerenciais por parte do parceiro e seus clientes.
A análise deverá evidenciar os custos, os benefícios esperados e os indicadores que demonstram a viabilidade e a atratividade do investimento para a organização.
Estrutura Recomendada do Documento
A Análise Financeira deverá conter as seguintes seções:
1. Resumo Executivo
Apresente uma visão geral do projeto, destacando:
 * Objetivo da solução;
 * Problemas que ela resolve;
 * Benefícios esperados em termos financeiros e operacionais;
 * Síntese dos custos e do retorno estimado.

2.…

---

### Documentação Técnica do Projeto

**Peso:** 2 | **Semana:** 10

**Objetivo:**

O grupo deve produzir um manual de implementação, em formato Markdown, descrevendo todos os passos necessários para realizar o deploy da solução em um ambiente externo, de forma que outro desenvolvedor consiga replicar a aplicação sem dependências externas ou conhecimento prévio do projeto.
Arquivo obrigatório:
 * Nome: manual_implementacao_parceiro.md
 * Local: pasta docs/ do repositório

O manual deve conter os seguintes tópicos obrigatórios:
 * Clonagem do Repositório;
 * Instalação de Dependências da Linguagem ou Framework Utilizado do Processo de ETL;
 * Implantação/Execução do Pipeline ETL;
 * Como criar agendamentos do ETL;
 * Instalar ambiente e configurar o Data Warehouse;
 * Ajuste dos relatórios para apontar para o banco de dados do Data Warehouse

IMPORTANTE
 * O manual deve…

---

### Dashboards - versão 2

**Peso:** 2 | **Semana:** 10

**Objetivo:**

Este documento reúne os elementos necessários para a implementação final dos reports no Power BI, agora conectados diretamente aos cubos de dados derivados do repositório analítico estruturado pelo grupo. A construção visual da interface já foi definida com base no mockup anterior, e nesta etapa o foco está em detalhar como os gráficos, indicadores e painéis foram implementados com base nos cubos, assegurando integridade analítica e funcionalidade interativa.
O grupo deverá também realizar testes de usabilidade a partir de um plano de tarefas realistas e documentar os resultados, validando se a navegação, filtragem e exploração dos dados ocorrem corretamente.
Todo o conteúdo deverá ser registrado no arquivo solucao_dashboard.md, localizado na pasta docs/ do repositório do grupo.
1.…

---

## Alinhamento com as Aulas

### Metas das aulas desta sprint

#### Líderes na prática
- Eixo: Liderança
- Objetivo: Depois de ter passado todos os 11 módulos, este encontro será um fechamento da jornada de desenvolvimento de Liderança. Venha a este encontro…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Sustentabilidade e ESG
- Eixo: Negócios
- Objetivo: Nesta instrução será explorado os fundamentos de sustentabilidade e ESG (Ambiental, Social e Governança). 
Durante a instrução, aprofundaremos esses…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Frameworks e Modelos de Referência
- Eixo: Computação
- Objetivo: Esta instrução tem como objetivo apresentar e comparar os principais frameworks e modelos de referência utilizados na governança e gestão estratégica…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### FinOps
- Eixo: Computação
- Objetivo: Esta instrução tem como objetivo introduzir os alunos ao conceito de FinOps (Financial Operations) aplicado ao ciclo completo de engenharia de dados…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Frameworks para Implementação da Estratégia (BSC, OKR, etc.)
- Eixo: Negócios
- Objetivo: Neste encontro, discutiremos estratégias eficazes para alcançar sucesso em empreendimentos, com foco na medição de desempenho e aprimoramento de…
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