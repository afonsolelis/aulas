# Sprint 4 — Art. 13 [WAD] - Atualizações da WebAPI, Arquitetura e Modelagem do Banco, Art. 12 [WAD] Estudo de Mercado e Plano de Marketing, Art. 11 [WAD e código] Relatório de Testes Automatizados (+1)

## Descrição

Este artefato consolida as entregas da Sprint 4. As atividades abaixo compõem a avaliação da sprint.

**Bloco:** Bloco 3: Onde (Engineering + Technology)
**Visão RM-ODP:** Engineering + Technology

## Artefatos da Sprint

### Art. 13 [WAD] - Atualizações da WebAPI, Arquitetura e Modelagem do Banco

**Peso:** 2 | **Semana:** 8

**Objetivo:**

Este artefato abrange a atualização da Arquitetura, da Modelagem do
Banco de Dados e da Documentação da WebAPI no WAD, refletindo o estado
atual do código entregue na sprint.

Seções do WAD a atualizar
3.2  Arquitetura
- 3.2.1    Diagrama de Arquitetura
- 3.2.3.1  Diagrama de Classes Arquitetural
- 3.2.4    Diagrama de Sequência UML
- 3.2.7    Padrões de Projeto Aplicados
3.6  Modelagem do Banco de Dados
- 3.6.1  Modelo Entidade-Relacionamento (ER)
- 3.6.2  Diagrama Entidade-Relacionamento (DER)
- 3.6.3  Modelo Relacional, Modelo Físico e Migrations DDL
3.7  WebAPI e endpoints

Os diagramas, modelos e a documentação da WebAPI devem refletir
exatamente o estado atual do código, sem componentes fantasmas nem
omissão de componentes reais.

**Barema:**

1. DIAGRAMA DE ARQUITETURA - SEÇÃO 3.2.1 (1,0 ponto)
   1.1 Diagrama atualizado refletindo as camadas e componentes efetivamente implementados no código. (0,6)
   1.2 Coerente com a estrutura do código entregue. (0,4)
2. DIAGRAMA DE CLASSES ARQUITETURAL - SEÇÃO 3.2.3.1 (1,0 ponto)
   2.1 Diagrama atualizado refletindo as classes reais das camadas Controller, Service, Repository e Model. (0,5)
   2.2 Segue notação UML correta (multiplicidades, associações, herança quando aplicável). (0,3)
   2.3 Não mistura classes técnicas com o Diagrama de Classes do Domínio (3.2.3). (0,2)
3. DIAGRAMA DE SEQUÊNCIA UML - SEÇÃO 3.2.4 (1,0 ponto)
   3.1 Diagramas atualizados sempre que algum fluxo foi adicionado, renomeado ou reestruturado no código. (0,5)
   3.2 Coerentes com os endpoints efetivamente…

---

### Art. 12 [WAD] Estudo de Mercado e Plano de Marketing

**Peso:** 4 | **Semana:** 8

**Objetivo:**

Preencher seção 6 do WAD, considerando os itens referentes ao estudo de análise de mercado e estratégias de marketing.
Critérios de avaliação
 * Conteúdo coerente com o objetivo proposto na entrega.
 * Coerência no encadeamento entre os itens.
 * Qualidade na elaboração do texto e nas questões gramaticais e ortográficas.

Ao preencher o WAD, utilize linguagem clara e objetiva, preferencialmente documentando seu trabalho em voz passiva analítica.
Exemplos: "A pesquisa foi realizada..."; "Identificou-se que..."; "Concluiu-se que..." e "Foi observado que..."
Pontuação
 1. Resumo Executivo (até 300 palavras – sem necessidade de fonte):
    Apresente de forma clara e objetiva os principais destaques do projeto, incluindo: oportunidade identificada no mercado; problema atendido pela aplicação;…

---

### Art. 11 [WAD e código] Relatório de Testes Automatizados

**Peso:** 2 | **Semana:** 8

**Objetivo:**

Este artefato abrange a entrega da suíte de testes automatizados da
WebAPI, cobrindo a estratégia adotada, os testes unitários de Service,
os testes de integração dos endpoints e as evidências de execução.

Seções do WAD a preencher
- 5.1  Relatório de testes de integração de endpoints automatizados
  Subseções:
  - 5.1.1  Estratégia de Testes
  - 5.1.2  Testes Unitários de Service (white-box)
  - 5.1.3  Testes de Integração de Endpoints (black-box)
  - 5.1.4  Evidências de Execução

Conteúdo esperado em cada subseção
5.1.1  Estratégia de Testes
- Separação por camada: Service como white-box unitário; Controller como
  black-box de integração via Supertest; Repository opcional quando
  houver lógica não trivial de query.
- Padrão AAA (Arrange, Act, Assert) e determinismo (sem dependência…

**Barema:**

1. ESTRATÉGIA DE TESTES - SEÇÃO 5.1.1 (1,5 ponto)
   1.1 Separação por camada explicitada: Service como white-box unitário,
       Controller como black-box de integração via Supertest, Repository
       opcional quando houver lógica não trivial de query. (0,6)
   1.2 Padrão AAA (Arrange, Act, Assert) adotado e descrito. (0,4)
   1.3 Determinismo dos testes garantido (sem dependência de ordem de
       execução, relógio do sistema, rede externa ou dados residuais). (0,5)
2. TESTES UNITÁRIOS DE SERVICE - SEÇÃO 5.1.2 (3,0 pontos)
   2.1 Cobertura mínima de 80% na camada Service evidenciada pelo
       relatório Jest gerado por "npm test -- --coverage". (0,8)
   2.2 Casos de teste vinculados explicitamente a uma RN (CT01 -> RN01,
       CT02 -> RN02, ...). (0,7)
   2.3 Casos de teste…

---

### Art. 10 [código] 2ª Versão do Sistema Web

**Peso:** 3 | **Semana:** 8

**Objetivo:**

Este artefato abrange a documentação técnica e a entrega da segunda versão funcional do sistema, consolidando a integração ponta a ponta dos fluxos principais e a evolução das seções do WAD relativas à computação.
Seções do WAD a preencher:
- 3.9 Matriz de Rastreabilidade (RTM)
- 4.2 Segunda versão da aplicação web
Seções do WAD a atualizar:
- 3.1.3 Requisitos Não Funcionais (8 eixos ISO/IEC 25010)
- 3.1.4 Matriz RF -> RN -> Endpoint
Entregas adicionais (fora do WAD):
- README.md na raiz do repositório.
- Sistema rodando com fluxos principais completos ponta a ponta.

**Barema:**

BAREMA DE CORREÇÃO - SPRINT 4 (SEGUNDA VERSÃO DO SISTEMA) - (máximo: 10 pontos)
1. MATRIZ DE RASTREABILIDADE (RTM) - SEÇÃO 3.9 (3,0 pontos)
   1.1 RTM preenchida com a trilha completa: persona -> requisito -> implementação -> evidência. (1,4)
   1.2 Cobertura dos fluxos principais do sistema sem lacunas. (0,8)
   1.3 Evidências são concretas (screenshot, saída de teste, consulta SQL executada, log). (0,8)
2. SEGUNDA VERSÃO DA APLICAÇÃO WEB - SEÇÃO 4.2 (2,0 pontos)
   2.1 Descreve o que foi implementado nesta sprint, com prints de tela ilustrando os fluxos. (0,8)
   2.2 Indica o que não foi concluído e dificuldades técnicas enfrentadas. (0,6)
   2.3 Indica próximos passos para a sprint final. (0,6)
3. EVOLUÇÃO DOS RNFs - SEÇÃO 3.1.3 (2,0 ponto)
   3.1 Cada RNF foi evoluído para o contexto…

---

## Alinhamento com as Aulas

### Metas das aulas desta sprint

#### Zeros de funções e integração numérica
- Eixo: Matemática e Física
- Objetivo: O encontro irá abordar métodos para a determinação dos zeros de funções, como o método da bisseção e de Newton-Raphson, além de apresentar técnicas…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Front-end 2 - Javascript, chamadas assíncronas e Redes
- Eixo: Computação
- Objetivo: Descrição da Aula
Exposição pragmática da dimensionalidade assíncrona da máquina virtual Javascript (V8), lidando com Event Loops contínuos na…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Desenvolvimento de novos produtos - Business Model Canvas
- Eixo: Negócios
- Objetivo: Os alunos aprenderão sobre o Business Model Canvas, uma ferramenta útil para visualizar e validar ideias de negócios. Eles aprenderão a usar o…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Grafos, árvores e coloração de grafos.
- Eixo: Matemática e Física
- Objetivo: O encontro irá introduzir os conceitos fundamentais de grafos e árvores, incluindo a definição formal dessas estruturas, identificação de vértices,…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Usabilidade, Avaliação Heurística e acessibilidade.
- Eixo: User Experience
- Objetivo: O encontro de hoje apresenta os seguintes conceitos: 1) A Usabilidade é fundamental para garantir que os usuários possam utilizar o produto digital…
- [ ] Usabilidade
- [ ] Confiabilidade
- [ ] Desempenho
- [ ] Suportabilidade
- [ ] Segurança
- [ ] Capacidade
- [ ] Restrições de Design
- [ ] Organizacionais

#### Testes e automação
- Eixo: Computação
- Objetivo: Descrição da Aula
Metodologia pesada sobre reengenharia arquitetural contínua via refatorações estatísticas. Mitigação formal em Débitos Técnicos…
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