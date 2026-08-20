# Sprint 3 — Art. 9 [WAD] - Arquitetura da solução, Art. 8 [código] - 1ª Versão do Sistema Web - WebAPI, Art. 7 [WAD] - Protótipo de Alta Fidelidade e Guia de Estilos (+1)

## Descrição

Este artefato consolida as entregas da Sprint 3. As atividades abaixo compõem a avaliação da sprint.

**Bloco:** Bloco 2: Como (Computational)
**Visão RM-ODP:** Computational

## Artefatos da Sprint

### Art. 9 [WAD] - Arquitetura da solução

**Peso:** 3 | **Semana:** 6

**Objetivo:**

Este artefato abrange a documentação técnica e os diagramas que descrevem
a arquitetura do sistema, além da rastreabilidade entre requisitos e
implementação.

Arquitetura em Camadas (seção 3.2.1)
O grupo deve documentar a arquitetura do sistema seguindo o padrão de
Arquitetura em Camadas (Layered Architecture), no estilo
Controller-Service-Repository, identificando as camadas principais e
suas respectivas responsabilidades.

Diagrama de Classes Arquitetural (nova subseção 3.2.3.1)
Além do Diagrama de Classes do Domínio entregue na sprint 2 (seção 3.2.3),
o grupo deve entregar um Diagrama de Classes Arquitetural contemplando os
componentes centrais das camadas Controller, Service, Repository e Model.

Diagrama de Sequência UML (seção 3.2.4)
O grupo deve entregar a modelagem completa dos…

**Barema:**

1. ARQUITETURA EM CAMADAS - SEÇÃO 3.2.1 (0,5 ponto)

   1.1 O padrão de Arquitetura em Camadas (Controller-Service-Repository) está
       explícito na documentação e refletido na organização do código. (0,2)

   1.2 As camadas (Controller, Service, Repository, Model) estão claramente
       identificadas com suas respectivas responsabilidades. (0,3)

2. DIAGRAMA DE CLASSES ARQUITETURAL - SEÇÃO 3.2.3.1 (1,0 ponto)

   2.1 O diagrama inclui as camadas Controller, Service, Repository e Model. (0,4)

   2.2 É apresentado como diagrama separado (3.2.3.1), preservando o diagrama
       de domínio do artefato 2 (seção 3.2.3). (0,3)

   2.3 Segue notação UML correta (multiplicidades, associações, herança
       quando aplicável). (0,3)

3. DIAGRAMA DE SEQUÊNCIA UML - SEÇÃO 3.2.4 (2,0 pontos)

 …

---

### Art. 8 [código] - 1ª Versão do Sistema Web - WebAPI

**Peso:** 3 | **Semana:** 6

**Objetivo:**

Neste artefato, o grupo deve entregar a primeira versão funcional do backend com WebAPI operante. O sistema deve ser capaz de subir localmente sem erros impeditivos, com os endpoints principais implementados e acessíveis para requisições.
Requisitos de entrega:
-Primeira versão funcional do backend com WebAPI operante
-Backend deve subir localmente sem erros impeditivos
-Endpoints principais implementados e acessíveis
Quanto à ordenação dos endpoints:
-Os endpoints devem ser ordenados e priorizados conforme os RF mapeados no artefato 1
-Endpoints prioritários (RF001, RF002, RF003...) devem constar no topo da implementação e documentação
-Endpoints de prioridade mais baixa (RF006, RF007...) seguem na sequência
Critério de funcionamento:
-O backend deve ser executável localmente sem…

**Barema:**

BAREMA DE CORREÇÃO - SPRINT 3 (BACKEND FUNCIONAL) - (máximo: 10 pontos)
1. EXECUÇÃO LOCAL SEM ERROS IMPEDITIVOS (2,0 pontos)
   1.1 O backend sobe localmente sem erros impeditivos (servidor inicia e escuta na porta definida). (1,0)
   1.2 Não há erros de sintaxe, dependências ausentes, variáveis de ambiente faltantes ou
       falhas de conexão com banco de dados que impeçam a inicialização. (1,0)
2. ENDPOINTS PRIORIZADOS IMPLEMENTADOS (3,0 pontos)
   2.1 Os endpoints correspondentes aos RFs prioritários (RF001, RF002, RF003...) conforme artefato 1
       estão implementados e documentados (código ou documentação inline/ Swagger/ README). (1,5)
   2.2 Os endpoints de prioridade mais baixa (RF006, RF007...) seguem na sequência da implementação
       ou estão claramente sinalizados como…

---

### Art. 7 [WAD] - Protótipo de Alta Fidelidade e Guia de Estilos

**Peso:** 3 | **Semana:** 6

**Objetivo:**

Preencher seções 3.4 e 3.5 do WAD, com o Guia de Estilos e o Protótipo de Alta Fidelidade do projeto.
Critérios de avaliação
• Conteúdo coerente com o objetivo proposto na entrega. 
• Organização dos componentes padronizados pelo Guia de Estilos, como cores, tipografia, ícones, etc.
• Coerência no encadeamento entre as páginas e interações do protótipo.
• Organização geral dos elementos visuais nas telas do protótipo
Pontuação:
1. Protótipo de alta fidelidade (até 5,0 pontos):
a. O protótipo oferece uma sequência de telas que prevê o fluxo de interações geral do front-end da aplicação, permitindo o reconhecimento das principais User Stories e seus respectivos critérios de aceite (serão buscadas as User Stories que foram selecionadas para desenvolvimento conforme quadro Kanban do…

---

### Art. 6 [WAD] - Lógica Proposicional das consultas SQL

**Peso:** 2 | **Semana:** 6

**Objetivo:**

Preencher seção 3.6.4. do WAD, conforme template markdown oferecido pelos professores de Matemática, contendo ao menos 3 (três) consultas SQL utilizadas em sua aplicação web.
Critérios de avaliação:
Coerência e corretude da lógica proposicional de cada consulta SQL;
Diversidade de consultas (consultas de SELECT, UPDATE e/ou DELETE com diferentes combinações de condições AND, OR, NOT, LIKE, IN)
Pontuação:
1. Apresentação do código SQL e uma descrição (em palavras) do código, contendo no mínimo de 3 consultas (SELECT, UPDATE, DELETE…) e com alguma especificação de condição composta (WHERE ... AND, OR, NOT, LIKE, IN) (até 2,0 pontos).
2. Escrita correta e completa da expressão lógica proposicional de cada consulta, com identificação dos conectivos para combinar as condições da instrução SQL…

---

## Alinhamento com as Aulas

### Metas das aulas desta sprint

#### Posicionamento do produto - 4 Ps
- Eixo: Negócios
- Objetivo: Esta aula irá apresentar os conceitos fundamentais do posicionamento do produto, incluindo os 4 P"s: Produto, Preço, Praça e Promoção. Os alunos…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Prototipação de Alta Fidelidade e Guia de Estilos
- Eixo: User Experience
- Objetivo: Prototipação de Alta Fidelidade e Guia de Estilos
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Back-end II - Endpoints de leitura e escrita com documentação própria
- Eixo: Computação
- Objetivo: Descrição da Aula
Alargamento da visão Computational focando inteiramente na elaboração coesa de Endpoints que acoplem com mínima fricção as regras…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Integral indefinida: conceitos e principais técnicas de integração.
- Eixo: Matemática e Física
- Objetivo: O encontro irá introduzir o conceito de integral indefinida como processo de antiderivada, abordando as técnicas básicas de integração. Serão…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Conceitos de branding
- Eixo: Negócios
- Objetivo: Esta aula abordará os conceitos fundamentais de branding. Os alunos aprenderão sobre o que é branding, por que é importante e como criar uma marca…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Front-end 1 - HTML, DOM e Javascript
- Eixo: Computação
- Objetivo: Descrição da Aula
Tradução tangível das necessidades conceituais da matriz Enterprise e da Interação Cognitiva (Personas) em requisitos reativos de…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Integral definida: técnicas e aplicações.
- Eixo: Matemática e Física
- Objetivo: O encontro irá desenvolver os conceitos da integral definida, incluindo o Teorema Fundamental do Cálculo, cálculo de áreas sob curvas e técnicas de…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Liderança, vulnerabilidade e relação com as críticas
- Eixo: Liderança
- Objetivo: Como agimos em relação às críticas? 
Como podemos escolher novos comportamentos que considerem os valores de todos os envolvidos para fortalecer a…
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