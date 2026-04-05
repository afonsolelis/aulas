# Resumo Prático: Aulas com foco em RM-ODP + RNF (8 Eixos) ISO12746

## Visão Geral por Bloco

- **Bloco 1: O Quê (Enterprise + Information)**
  - Aulas 1-3 → Problema, Regras de Negócio, Dados
- **Bloco 2: Como (Computational)**
  - Aulas 4-6 → Comportamento, Componentes, Interfaces
- **Bloco 3: Onde (Engineering + Technology)**
  - Aulas 7-11 → Distribuição, Integração, Deploy

---

# Bloco 1: O Quê (Aulas 1-3)

## Aula 1 - Introdução aos Sistemas Web
- **Visão RM-ODP:** Enterprise (início)
- **RF:** Listar 3-5 funcionalidades básicas do parceiro
- **RNF (8 eixos):** Identificar 1 requisito por eixo (nível conceitual)
- **Artefato:** Mapa de atores + Lista inicial de RF/RNF

### Checklist:
- [ ] Quem são os usuários? (Usabilidade)
- [ ] Qual disponibilidade mínima? (Confiabilidade)
- [ ] Tempo máximo de resposta aceitável? (Desempenho)
- [ ] Quem fará manutenção? (Suportabilidade)
- [ ] Quais dados são sensíveis? (Segurança)
- [ ] Volume esperado de usuários/dados? (Capacidade)
- [ ] Padrões obrigatórios da organização? (Restrições)
- [ ] Processos/times a respeitar? (Organizacionais)

## Aula 2 - Banco de Dados I
- **Visão RM-ODP:** Enterprise + Information
- **RF:** Mapear funcionalidades que dependem dos dados
- **RNF (8 eixos):** Foco em Confiabilidade (integridade) + Segurança (dados sensíveis)
- **Artefato:** Minimundo + Regras de Negócio consolidadas

### Checklist:
- [ ] Delimitar escopo (fronteiras do sistema)
- [ ] Listar 5-10 regras de negócio numeradas (RN01, RN02...)
- [ ] Identificar entidades principais e seus ciclos de vida
- [ ] Classificar dados: públicos vs. restritos

## Aula 3 - Banco de Dados II
- **Visão RM-ODP:** Information (predominante)
- **RF:** Garantir que modelo suporte CRUD principal
- **RNF (8 eixos):** Desempenho (índices) + Suportabilidade (normalização)
- **Artefato:** ER → DER → Modelo Físico (PostgreSQL)

### Checklist:
- [ ] ER com entidades e relacionamentos
- [ ] DER com cardinalidades e chaves
- [ ] Migrations DDL criadas
- [ ] Rastreabilidade: RN → Entidade → Tabela

---

# Bloco 2: Como (Aulas 4-6)

## Aula 4 - Back-end I
- **Visão RM-ODP:** Computational (início)
- **RF:** Detalhar pré-condições, fluxo principal, validações
- **RNF (8 eixos):** Usabilidade (mensagens) + Segurança (validação entrada)
- **Artefato:** Diagrama de Classes + Sequência (1 fluxo) + TDD iniciado

### Checklist:
- [ ] Diagrama de Classes (camadas: Controller, Service, Repository, Model)
- [ ] Diagrama de Sequência (fluxo de sucesso)
- [ ] 1 teste Jest por caso de uso (Red → Green)
- [ ] Contratos de entrada/saída definidos

## Aula 5 - Back-end II
- **Visão RM-ODP:** Computational (aprofundamento)
- **RF:** Delimitar regra de negócio por RF (matriz RF × RN)
- **RNF (8 eixos):** Suportabilidade (testes) + Desempenho (latência)
- **Artefato:** Endpoints CRUD + UML atualizado + Suite Jest expandida

### Checklist:
- [ ] Matriz RF → RN → Teste
- [ ] Endpoints de leitura e escrita funcionando
- [ ] Testes para: sucesso, falha de validação, regra violada
- [ ] Diagramas UML atualizados conforme implementação

## Aula 6 - Back-end III
- **Visão RM-ODP:** Computational (consolidação)
- **RF:** Validar aderência completa das regras implementadas
- **RNF (8 eixos):** Todos os 8 eixos revisados (nível introdutório)
- **Artefato:** Backend consolidado + RTM parcial + Jest ampliado

### Checklist:
- [ ] Cada RN representada em ≥1 teste
- [ ] Fluxos alternativos testados
- [ ] RTM: RF → RN → Teste → Evidência
- [ ] Revisão dos 8 eixos de RNF (tabela simples)

---

# Bloco 3: Onde (Aulas 7-11)

## Aula 7 - Front-end I
- **Visão RM-ODP:** Engineering (início) + Technology
- **RF:** Mapear componente de interface → função backend
- **RNF (8 eixos):** Usabilidade (persona) + Confiabilidade (tratamento erro)
- **Artefato:** Telas iniciais + RTM atualizado + Contratos front-back

### Checklist:
- [ ] Frontend com telas principais implementadas
- [ ] Cada tela vinculada a RF específico
- [ ] Contratos de integração definidos (entradas, saídas, erros)
- [ ] Personas → Necessidade → RF → Endpoint → Tela
- [ ] Testes Jest ajustados se houve mudança de contrato

## Aula 8 - Front-end II
- **Visão RM-ODP:** Engineering (comunicação)
- **RF:** Refinar fluxos dinâmicos (cenários principais e alternativos)
- **RNF (8 eixos):** Confiabilidade (retry/timeout) + Desempenho (latência)
- **Artefato:** Integração assíncrona + Documentação de contratos

### Checklist:
- [ ] Chamadas assíncronas implementadas
- [ ] Estados: carregamento, sucesso, erro
- [ ] Tratamento de falha de rede (timeout, retry)
- [ ] Fluxos principais executáveis de ponta a ponta pela interface
- [ ] RTM com evidências de integração

## Aula 9 - Front-end III
- **Visão RM-ODP:** Technology (interface concreta)
- **RF:** Fechamento do RTM com comprovação de atendimento
- **RNF (8 eixos):** Usabilidade (consistência) + Segurança (mensagens)
- **Artefato:** Interface final + RTM completo + Doc final da sprint

### Checklist:
- [ ] RTM completo (persona → teste → evidência)
- [ ] RNF introdutórios registrados (tabela de atendimento)
- [ ] Documentação consolidada
- [ ] README com instruções de execução e validação da interface integrada
- [ ] Testes Jest estáveis

## Aula 10 - Testes e Automação
- **Visão RM-ODP:** Computational + Engineering (qualidade)
- **RF:** Confirmar rastreabilidade após refatorações
- **RNF (8 eixos):** Suportabilidade (legibilidade, manutenção)
- **Artefato:** Suite Jest refatorada + RTM atualizado + revisão dos fluxos críticos com autenticação/autorização

### Checklist:
- [ ] Identificar duplicações, lacunas, baixa legibilidade
- [ ] Refatorar testes (clareza, isolamento)
- [ ] Manter cobertura de fluxos críticos
- [ ] Revisar impactos de autenticação/autorização após refatorações
- [ ] RTM atualizado pós-refatoração

## Aula 11 - Mergulhando nas Redes
- **Visão RM-ODP:** Engineering (transparências)
- **RF:** Incluir cenários de falha de rede nos fluxos
- **RNF (8 eixos):** Confiabilidade (disponibilidade) + Desempenho (latência)
- **Artefato:** Mapa de RNF de comunicação + autenticação/autorização simples com sessão + Evidências finais

### Checklist:
- [ ] Fundamentos HTTP/IP aplicados ao projeto
- [ ] Estratégias de robustez (timeout, retry, circuit breaker)
- [ ] Autenticação com senha hasheada persistida no banco
- [ ] Sessão baseada em `session id` implementada
- [ ] Regras de autorização aplicadas nas rotas e fluxos principais
- [ ] RNF de comunicação validado (nível 1º ano)
- [ ] Documentação final da sprint/trilha

---

# Matrizes e Templates

## Matriz Resumo: Visões RM-ODP por Aula

| Aula | Visão Principal | Visões Secundárias  | Entregável de Modelagem           |
|------|-----------------|---------------------|-----------------------------------|
|  1   | Enterprise      | -                   | Atores + RF/RNF iniciais          |
|  2   | Enterprise      | Information         | Minimundo + RN consolidadas       |
|  3   | Information     | -                   | ER → DER → Físico                 |
|  4   | Computational   | Information         | Classes + Sequência (1 fluxo)     |
|  5   | Computational   | -                   | Sequência atualizado + Matriz RF×RN|
|  6   | Computational   | -                   | RTM parcial + 8 eixos RNF         |
|  7   | Engineering     | Technology          | Frontend inicial + Telas + Contratos front-back |
|  8   | Engineering     | -                   | Integração assíncrona + Falhas de rede + Fluxos ponta a ponta |
|  9   | Technology      | Engineering         | RTM completo + Doc final + README da interface |
| 10   | Computational   | Engineering         | Suite Jest refatorada + revisão de auth |
| 11   | Engineering     | -                   | RNF comunicação + autenticação/sessão + Evidências |

## Matriz de Rastreabilidade RM-ODP × RNF

| VISÃO         | USAB | CONF | DES  | SUP  | SEG  | CAP  | REST | ORG |
|---------------|------|------|------|------|------|------|------|-----|
| Enterprise    |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓  |
| Information   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓  |
| Computational |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓  |
| Engineering   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓  |
| Technology    |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓   |  ✓  |

---

# Template de Documentação por Aula

## Aula X - [Título]

### 1. Visão RM-ODP Trabalhada
- [ ] Enterprise / Information / Computational / Engineering / Technology

### 2. Requisitos Funcionais (RF)

| ID  | Descrição                          | Status        |
|-----|------------------------------------|---------------|
| RF001 | ...                              | Implementado  |

### 3. Requisitos Não Funcionais (8 eixos)

| Eixo              | Requisito                    | Como atendido            |
|-------------------|------------------------------|--------------------------|
| Usabilidade       | ...                          | ...                      |
| Confiabilidade    | ...                          | ...                      |
| Desempenho        | ...                          | ...                      |
| Suportabilidade   | ...                          | ...                      |
| Segurança         | ...                          | ...                      |
| Capacidade        | ...                          | ...                      |
| Restrições de Design | ...                       | ...                      |
| Organizacionais   | ...                          | ...                      |

### 4. Artefatos de Modelagem
- [ ] Link/nome do artefato (ER, DER, Classes, Sequência, etc.)

### 5. Rastreabilidade
- RN01 → RF001 → Teste001 → Evidência
- ...

### 6. Evidências
- [ ] Screenshots, logs de teste, prints de execução

---

# Exemplo Prático: Feature "Cadastro de Cliente"

**Visão Enterprise**
- Regra: "Todo cliente deve ter CPF único"
- Ator: "Atendente"
- RF001: Cadastrar cliente
- RNF-Usabilidade: "Atendente com treinamento básico"

↓

**Visão Information**
- Entidade: Cliente (cpf, nome, email, data_nascimento)
- Invariante: "cpf não pode ser repetido"
- RNF-Confiabilidade: "Validação de CPF obrigatória"

↓

**Visão Computational**
- `Controller.Cliente.post()`
- `Service.Cliente.criar()`
- `Repository.Cliente.save()`
- RNF-Segurança: "Validar input, sanitizar dados"

↓

**Visão Engineering**
- Canal: HTTP POST `/clientes`
- Transparência de falha: "Retornar 409 se CPF duplicado"
- RNF-Desempenho: "Resposta em < 500ms"

↓

**Visão Technological**
- Node.js + Express + PostgreSQL
- Índice único em `cliente.cpf`
- RNF-Suportabilidade: "Teste Jest para CPF duplicado"

---

# Legenda dos 8 Eixos de RNF (SWEBOK)

- **USAB - Usabilidade:** Facilidade de uso, aprendizado e satisfação
- **CONF - Confiabilidade:** Disponibilidade, tolerância a falhas, recuperabilidade
- **DES - Desempenho:** Tempo de resposta, throughput, utilização de recursos
- **SUP - Suportabilidade:** Manutenibilidade, escalabilidade, testabilidade
- **SEG - Segurança:** Confidencialidade, integridade, autenticidade
- **CAP - Capacidade:** Armazenamento, capacidade de processamento
- **REST - Restrições Design:** Padrões, linguagens, plataformas, interfaces
- **ORG - Organizacionais:** Processos, times, políticas da organização

---

# Atividades Ponderadas (3) - Proposta

As 3 atividades ponderadas foram desenhadas para avaliar o progresso do aluno ao longo de cada BLOCO, com foco em modelagem, requisitos e rastreabilidade.

## Ponderada 1 - Modelagem Enterprise e Information (Bloco 1 - Aulas 1-3)
**Título:** Modelagem de Dados Relacionais e UML do Projeto (Individual)

**Objetivo:** Consolidar o entendimento do domínio do parceiro por meio da modelagem de dados e da modelagem UML estática/dinâmica do próprio projeto, aplicando as visões Enterprise e Information do RM-ODP.

**Escopo:**
- Baseada nas aulas de modelagem de dados relacionais e de UML.
- Cada aluno deve produzir, individualmente:
  - Diagrama UML de Classes do próprio projeto (entidades, atributos, relacionamentos e responsabilidades)
  - Diagrama UML de Sequência de pelo menos 1 fluxo principal (ex.: cadastro ou consulta)
  - Modelo de dados relacional coerente com os diagramas (ER/DER simplificado)

**Entregáveis:**
- [ ] Documento com minimundo resumido e principais regras de negócio
- [ ] UML de Classes + UML de Sequência
- [ ] Modelo relacional com chaves e cardinalidades
- [ ] Rastreabilidade básica: regra de negócio → entidade → classe → fluxo
- [ ] Tabela de 8 eixos de RNF (nível conceitual) preenchida

**Critérios de Avaliação:**

| Critério                              | Peso |
|---------------------------------------|------|
| Coerência entre regras de negócio e modelagem | 25%  |
| Corretude de entidades, relacionamentos e cardinalidades | 25%  |
| Clareza da sequência entre camadas do sistema | 20%  |
| Rastreabilidade RN → Entidade → RF    | 15%  |
| Identificação dos 8 eixos de RNF (nível conceitual) | 15%  |

**Vínculo com RM-ODP:**
- Visão Enterprise: Atores, regras de negócio, objetivos
- Visão Information: Entidades, relacionamentos, invariantes de dados

## Ponderada 2 - Regras de Negócio Traduzidas em Testes (Bloco 2 - Aulas 4-6)
**Título:** Regras de Negócio Traduzidas em Testes (TDD com Jest)

**Objetivo:** Transformar regras de negócio em comportamento verificável por testes automatizados no backend, aplicando a visão Computational do RM-ODP e garantindo rastreabilidade entre RF, RN e testes.

**Escopo:**
- Selecionar RF prioritários do projeto.
- Delimitar regras de negócio por RF.
- Implementar testes em Jest usando ciclo TDD (Red → Green → Refactor).

**Entregáveis:**
- [ ] Matriz RF → Regra de Negócio → Caso de Teste
- [ ] Suite de testes Jest com cenários positivos e negativos (mínimo 2 testes por RF: 1 sucesso + 1 falha)
- [ ] Evidências de execução dos testes e refatoração quando necessário
- [ ] Diagramas UML (Classes + Sequência) atualizados conforme implementação
- [ ] Tabela de 8 eixos de RNF (nível computacional) preenchida

**Critérios de Avaliação:**

| Critério                              | Peso |
|---------------------------------------|------|
| Cobertura de regras de negócio relevantes | 30%  |
| Qualidade e legibilidade dos testes   | 25%  |
| Aderência ao TDD e consistência com os RF | 20%  |
| Rastreabilidade RF → RN → Teste       | 15%  |
| Tratamento dos 8 eixos de RNF (nível computacional) | 10%  |

**Vínculo com RM-ODP:**
- Visão Computational: Objetos/componentes, interfaces, comportamento
- Foco em: Controller, Service, Repository, Model
- Transparências tratadas: acesso, concorrência, falha

## Ponderada 3 - Integração Front-Back Orientada a Requisitos e RTM (Bloco 3 - Aulas 7-11)
**Título:** Integração Front-Back Orientada a Requisitos e RTM

**Objetivo:** Validar a entrega integrada com foco no atendimento dos requisitos, rastreabilidade documental e estabilidade técnica, aplicando as visões Engineering e Technology do RM-ODP.

**Escopo:**
- Integrar telas prioritárias (guiadas por personas de UX) aos endpoints do backend.
- Atualizar contratos quando necessário e refletir mudanças em testes Jest.
- Fechar RTM com evidências de atendimento de RF e RNF introdutórios.

**Entregáveis:**
- [ ] RTM completo (persona → necessidade → RF → endpoint → tela → teste → evidência)
- [ ] Documentação final de requisitos e mudanças de contrato
- [ ] Evidências de testes Jest após ajustes de integração
- [ ] Mapa de RNF de comunicação validado (nível 1º ano)
- [ ] Diagrama de Implantação (Engineering + Technology)

**Critérios de Avaliação:**

| Critério                              | Peso |
|---------------------------------------|------|
| Atendimento funcional dos RF priorizados | 30%  |
| Qualidade da rastreabilidade e da documentação (RTM) | 25%  |
| Estabilidade da integração comprovada por testes | 20%  |
| Tratamento de falhas de rede e cenários alternativos | 15%  |
| Atendimento dos 8 eixos de RNF (nível engineering/technology) | 10%  |

**Vínculo com RM-ODP:**
- Visão Engineering: Canais de comunicação, transparências, QoS
- Visão Technology: Tecnologias concretas, deployment, middleware
- Foco em: HTTP, timeout, retry, tratamento de erro, contratos

## Matriz de Avaliação das Ponderadas

| Ponderada | Bloco | Visões RM-ODP         | Foco Principal              |
|-----------|-------|-----------------------|-----------------------------|
|     1     |  1-3  | Enterprise + Info     | Modelagem de dados + UML    |
|     2     |  4-6  | Computational         | TDD + Regras de Negócio     |
|     3     | 7-11  | Engineering + Tech    | Integração + RTM + RNF      |

## Matriz de RNF por Ponderada

| Eixo            | Pond. 1      | Pond. 2      | Pond. 3      |
|-----------------|--------------|--------------|--------------|
| Usabilidade     | Conceitual   | Mensagens    | Persona/UX   |
| Confiabilidade  | Integridade  | Exceções     | Retry/Timeout|
| Desempenho      | -            | Latência     | Latência     |
| Suportabilidade | Normalização | Testes       | Logs/Métricas|
| Segurança       | Classificação| Validação    | HTTPS/Token  |
| Capacidade      | Volume       | Paginação    | Conexões     |
| Restrições      | Padrões      | MVC/SOLID    | Tech Stack   |
| Organizacionais | Processos    | Integração   | Deploy       |
