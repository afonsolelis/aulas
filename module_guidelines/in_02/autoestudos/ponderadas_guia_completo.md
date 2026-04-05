# Autoestudo: Guia Completo das Ponderadas — RNFs, Testes Black-Box e RTM

## Sumário
1. [Visão Geral das Ponderadas](#visão-geral-das-ponderadas)
2. [Ponderada 1 — RNFs Técnicos e Diagramas de Sequência](#ponderada-1--rnfs-técnicos-e-diagramas-de-sequência)
3. [Ponderada 2 — Suite de Testes Black-Box](#ponderada-2--suite-de-testes-black-box)
4. [Ponderada 3 — RTM Completo com Documentação](#ponderada-3--rtm-completo-com-documentação)
5. [Rastreabilidade entre Ponderadas](#rastreabilidade-entre-ponderadas)
6. [Checklist de Preparação](#checklist-de-preparação)
7. [Referências](#referências)

---

## Visão Geral das Ponderadas

As **Ponderadas** são avaliações práticas aplicadas em sala de aula que consolidam o aprendizado de cada bloco do curso. Elas formam uma progressão natural que vai do design técnico até a documentação final de rastreabilidade.

### Linha do Tempo das Ponderadas

```
                    BLOCO 1: O QUÊ (Enterprise + Information)
                    ┌────────────────────────────────────────┐
                    │  Aulas 1-3: RNFs, Modelagem de Dados   │
                    └────────────────┬───────────────────────┘
                                     │
                                     ▼
                    BLOCO 2: COMO (Computational)
                    ┌────────────────────────────────────────┐
                    │  Aulas 4-6: Backend, TDD, Testes       │
                    └────────────────┬───────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                      ▼
        PONDERADA 1            PONDERADA 2            PONDERADA 3
        (Aula 4)               (Aula 6)               (Aula 9)
        RNFs + Sequência       Testes Black-Box       RTM Completo
        Individual             Individual             Individual
        1h30                   1h30                   1h30
              │                      │                      │
              └──────────────────────┴──────────────────────┘
                                     │
                                     ▼
                    BLOCO 3: ONDE (Engineering + Technology)
                    ┌────────────────────────────────────────┐
                    │  Aulas 7-11: Frontend, Integração      │
                    └────────────────────────────────────────┘
```

### Comparação Rápida

| Característica | Ponderada 1 | Ponderada 2 | Ponderada 3 |
|----------------|-------------|-------------|-------------|
| **Foco** | Design técnico | Testes de integração | Documentação e rastreabilidade |
| **Entrega** | Diagramas + RNFs | Suite Jest | RTM + Tabelas |
| **Artefato Principal** | 3 Diagramas de Sequência | 4 Casos de Teste | Matriz RTM Completa |
| **Banca de Dados** | Não usa | **Real** (não mockada) | Não usa |
| **Rastreabilidade** | RF → RNF → Diagrama | RF → RN → Teste | Persona → Evidência |

---

## Ponderada 1 — RNFs Técnicos e Diagramas de Sequência

### Contexto e Objetivo

**Quando:** Aula 4 — Backend I (início da visão Computational)

**Propósito:** Traduzir requisitos de negócio (mapeados nas Aulas 1-2) em design computacional técnico e verificável.

### Conceitos-Chave Necessários

#### 1. RNFs Técnicos e Mensuráveis

Um RNF técnico **deve poder ser testado ou inspecionado**. Frases genéricas como "o sistema deve ser rápido" **não são aceitas**.

| ❌ Genérico (Não Aceitável) | ✅ Técnico (Aceitável) |
|-----------------------------|------------------------|
| "O sistema deve ser rápido" | "Endpoints de leitura devem responder em < 300ms com até 100 registros" |
| "Deve ser seguro" | "Nenhum campo de senha pode ser retornado em response de qualquer endpoint" |
| "Deve ser usável" | "Toda resposta de erro HTTP deve incluir campo `mensagem` legível ao usuário final" |

**Como escrever RNFs técnicos:**

1. **Identifique a métrica:** tempo, quantidade, limite
2. **Defina como medir:** teste, inspeção, ferramenta
3. **Especifique o critério de aceitação:** valor numérico, condição booleana

**Exemplo de RNF completo:**

```
Eixo: Desempenho
RNF: Endpoints de leitura devem responder em < 300ms com até 100 registros no banco
Como medir: Medição via console.time ou Jest timer nos testes de integração
```

---

#### 2. Os 8 Eixos da ISO/IEC 25010 (Revisão)

| Eixo | Pergunta-Guia | Exemplo de RNF Técnico |
|------|---------------|------------------------|
| **Usabilidade** | Como o usuário interage e percebe o sistema? | "Toda resposta de erro deve incluir campo `mensagem` legível" |
| **Confiabilidade** | Como o sistema se comporta sob falhas? | "Endpoint deve retornar 409 (não 500) em caso de e-mail duplicado" |
| **Desempenho** | Qual o tempo de resposta e uso de recursos? | "Leitura deve responder em < 300ms com 100 registros" |
| **Suportabilidade** | Quão fácil é manter e evoluir o código? | "Cada método de Service deve ter no máximo 20 linhas" |
| **Segurança** | Como dados sensíveis são protegidos? | "Senha nunca pode aparecer em response de endpoint" |
| **Capacidade** | Qual volume o sistema suporta? | "Banco deve suportar 1000 registros sem degradação" |
| **Restrições de Design** | Quais padrões arquiteturais seguir? | "Arquitetura deve seguir camadas Controller → Service → Repository → Model" |
| **Organizacionais** | Quais convenções do time/organização? | "Endpoints devem seguir convenção REST (substantivos no plural, snake_case)" |

---

#### 3. Diagrama de Sequência UML — Estrutura Obrigatória

Cada diagrama deve mostrar a interação entre as **4 camadas**:

```
┌────────┐    ┌────────────┐    ┌───────────┐    ┌────────────┐    ┌──────┐
│  Ator  │    │ Controller │    │  Service  │    │ Repository │    │ Banco│
└───┬────┘    └─────┬──────┘    └─────┬─────┘    └─────┬──────┘    └──┬───┘
    │               │                 │                │              │
    │─Request──────►│                 │                │              │
    │               │─criar(dto)─────►│                │              │
    │               │                 │─validar()      │              │
    │               │                 │─save(entity)──►│              │
    │               │                 │                │─INSERT──────►│
    │               │                 │                │◄──entity─────│
    │               │                 │◄──entity───────│              │
    │               │◄──entity────────│                │              │
    │◄──Response────│                 │                │              │
    │               │                 │                │              │
```

**Elementos obrigatórios:**
- **Pré-condição:** O que deve ser verdade antes do fluxo começar
- **Fluxo principal:** Sequência completa de chamadas
- **Resposta de sucesso:** O que é retornado ao ator
- **Fluxo alternativo:** Ao menos 1 cenário de falha (dado inválido, regra violada, recurso não encontrado)

---

#### 4. Rastreabilidade RF → RNF → Diagrama

A rastreabilidade prova que cada diagrama atende requisitos específicos:

| Diagrama | RF(s) Atendido(s) | RNF(s) Exercitados | Fluxo Alternativo |
|----------|-------------------|--------------------|-------------------|
| Sequência 1: Criar Usuário | RF001 | Confiabilidade (RN01), Segurança | E-mail duplicado → 409 |
| Sequência 2: Buscar Produto | RF002 | Desempenho, Usabilidade | ID não encontrado → 404 |
| Sequência 3: Login | RF003 | Segurança, Suportabilidade | Senha inválida → 400 |

---

### Exemplo Completo — Ponderada 1

#### Tabela de RNF Técnica

| Eixo | RNF Técnico | Como Medir / Verificar |
|------|-------------|------------------------|
| Usabilidade | Toda resposta de erro HTTP deve incluir campo `"mensagem"` legível | Inspecionar JSON de retorno nos testes |
| Confiabilidade | Endpoint de cadastro retorna 409 (não 500) em e-mail duplicado | Teste Jest com caso negativo |
| Desempenho | Endpoints de leitura respondem em < 300ms com 100 registros | `console.time` no teste |
| Suportabilidade | Cada método de Service tem no máximo 20 linhas | Revisão de código / linting |
| Segurança | Nenhum campo de senha é retornado em response | Inspeção do JSON |
| Capacidade | Banco suporta 1000 registros sem degradação | Script de seed + medição |
| Restrições | Arquitetura segue camadas Controller → Service → Repository → Model | Diagrama de Classes |
| Organizacionais | Endpoints seguem convenção REST (plural, snake_case) | Revisão do contrato de API |

---

### Critérios de Avaliação — Ponderada 1

| Critério | Peso | Dica para Nota Máxima |
|----------|------|-----------------------|
| RNFs técnicos e verificáveis | 35% | Derive RNFs das RNs do seu projeto, não copie exemplos |
| Diagramas completos e corretos | 40% | Inclua 2+ fluxos alternativos por diagrama |
| Rastreabilidade | 25% | Justifique *por que* cada RNF é exercitado |

---

## Ponderada 2 — Suite de Testes Black-Box

### Contexto e Objetivo

**Quando:** Aula 6 — Backend III (consolidação da visão Computational)

**Propósito:** Provar que o sistema atende ao negócio testando **um fluxo inteiro** como caixa-preta, do Controller ao Banco.

### Conceito: Teste Black-Box vs. White-Box

| Característica | Black-Box | White-Box |
|----------------|-----------|-----------|
| **O que testa** | Comportamento observável | Implementação interna |
| **Perspectiva** | Externa (usuário) | Interna (código) |
| **Mock de banco** | ❌ Não | ✅ Sim (geralmente) |
| **Foco** | "O que o sistema faz" | "Como o sistema faz" |
| **Exemplo** | `POST /usuarios` persiste no banco | `service.criar()` chama `repo.save()` |

**Na Ponderada 2:** Teste **Black-Box** — o banco é **real**, integrações externas são mockadas.

---

### Estrutura da Suite de Testes

#### 4 Casos de Teste Obrigatórios

| Caso | O que Verifica | Exemplo de Nome |
|------|----------------|-----------------|
| **CT01 — Sucesso** | Fluxo feliz, dados válidos, persistência | `"deve cadastrar com dados válidos e retornar 201"` |
| **CT02 — Regra de Negócio Violada** | RN específica do domínio | `"deve rejeitar e-mail duplicado com 409 (RN01)"` |
| **CT03 — Payload Inválido** | Validação de entrada | `"deve rejeitar payload sem campo obrigatório com 400"` |
| **CT04 — Verificação no Banco** | Efeito colateral real | `"deve persistir o registro no banco após sucesso"` |

---

### Template de Teste — Estrutura Completa

```javascript
// ============================================
// ARQUIVO: usuarios.test.js
// FLUXO: POST /usuarios — Cadastro de usuário
// RNFs: Segurança, Usabilidade, Confiabilidade
// ============================================

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database');

// Mock APENAS de integrações externas (e-mail, SMS, APIs de terceiros)
jest.mock('../src/services/emailService');

// Setup: limpa e reseta banco antes de cada teste
beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
});

// Cleanup: fecha conexão após todos os testes
afterAll(async () => {
  await db.destroy();
});

// ============================================
// RF001 — Cadastro de usuário
// ============================================
describe('RF001 — Cadastro de usuário', () => {

  // CT01: Fluxo principal — sucesso
  it('deve cadastrar usuário com dados válidos e retornar 201', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({ 
        nome: 'Ana', 
        email: 'ana@email.com', 
        senha: 'Senha@123' 
      });

    // Verificações
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('ana@email.com');
    
    // RNF Segurança: senha não retorna no response
    expect(res.body).not.toHaveProperty('senha');
  });

  // CT02: Regra de Negócio — e-mail único (RN01)
  it('deve rejeitar e-mail duplicado com 409 (RN01)', async () => {
    // Setup: cria primeiro usuário
    await request(app)
      .post('/usuarios')
      .send({ nome: 'Ana', email: 'ana@email.com', senha: 'Senha@123' });

    // Teste: tenta criar com mesmo e-mail
    const res = await request(app)
      .post('/usuarios')
      .send({ nome: 'Ana 2', email: 'ana@email.com', senha: 'Outra@456' });

    // Verificações
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('mensagem'); // RNF Usabilidade
  });

  // CT03: Validação de payload — campos obrigatórios (RN02)
  it('deve rejeitar payload sem campo obrigatório com 400', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({ nome: 'Ana' }); // sem email e senha

    expect(res.status).toBe(400);
  });

  // CT04: Verificação de persistência no banco
  it('deve persistir o registro no banco após sucesso', async () => {
    await request(app)
      .post('/usuarios')
      .send({ nome: 'Ana', email: 'ana@email.com', senha: 'Senha@123' });

    // Verificação DIRETA no banco (não mockado)
    const usuario = await db('usuarios')
      .where({ email: 'ana@email.com' })
      .first();

    expect(usuario).toBeDefined();
    expect(usuario.nome).toBe('Ana');
    
    // Segurança: senha armazenada como hash
    expect(usuario.senha).not.toBe('Senha@123');
  });

});
```

---

### Matriz de Rastreabilidade RF → RN → Teste

| RF | RN | Caso de Teste | O que Verifica | Status |
|----|----|---------------|----------------|--------|
| RF001 | RN01 — e-mail único | CT02 | Retorna 409 em duplicidade | ✓ |
| RF001 | RN02 — campos obrigatórios | CT03 | Retorna 400 sem payload completo | ✓ |
| RF001 | RNF Segurança | CT01 | Senha não retorna no response | ✓ |
| RF001 | RNF Usabilidade | CT02 | Response de erro tem campo `mensagem` | ✓ |
| RF001 | Persistência | CT04 | Registro existe no banco após criação | ✓ |

---

### Configuração do Banco de Testes

#### Opção 1: SQLite em Memória (Recomendado para Testes)

```javascript
// database.js
const knex = require('knex');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  useNullAsDefault: true
});

module.exports = db;
```

#### Opção 2: PostgreSQL em Container Docker

```bash
# docker-compose.test.yml
version: '3.8'
services:
  postgres-test:
    image: postgres:15
    environment:
      POSTGRES_DB: teste
      POSTGRES_USER: teste
      POSTGRES_PASSWORD: teste
    ports:
      - "5433:5432"
```

---

### Critérios de Avaliação — Ponderada 2

| Critério | Peso | Dica para Nota Máxima |
|----------|------|-----------------------|
| Fluxo completo (Controller → Banco) | 35% | Verifique efeito colateral no banco, não apenas response |
| Casos de teste cobrem RNs e RNFs | 30% | Nomes descritivos do comportamento de negócio |
| Mock correto de integrações externas | 20% | Mock apenas o necessário; banco deve ser real |
| Rastreabilidade preenchida | 15% | Referencie explicitamente RNs e RNFs |

---

## Ponderada 3 — RTM Completo com Documentação

### Contexto e Objetivo

**Quando:** Aula 9 — Frontend III (consolidação das visões Engineering + Technology)

**Propósito:** Documentação final que prova rastreabilidade completa: **Persona → Necessidade → RF → RN → Endpoint → Tela → Teste → Evidência**.

### Conceito: RTM (Requirements Traceability Matrix)

RTM é a **matriz de rastreabilidade de requisitos** que conecta:

```
Persona (quem)
  ↓
Necessidade (o quê precisa)
  ↓
RF (o que o sistema faz)
  ↓
RN (regra de negócio)
  ↓
Endpoint (API que implementa)
  ↓
Tela/Componente (interface)
  ↓
Teste Jest (verificação)
  ↓
Evidência (prova concreta)
```

---

### Estrutura do RTM Completo

| Persona | Necessidade | RF | Descrição RF | RN | Regra de Negócio | Endpoint | Tela | Teste | Evidência |
|---------|-------------|----|--------------|----|------------------|----------|------|-------|-----------|
| Aluno | Acessar notas | RF003 | Consultar notas por aluno | RN05 | Aluno só vê próprias notas | GET /notas/:id | TelaNotas.jsx | CT07 | ev01.png |
| Admin | Cadastrar usuário | RF001 | Criar usuário | RN01 | E-mail único | POST /usuarios | FormCadastro.jsx | CT01, CT02 | ev02.txt |

**Mínimo:** 3 personas distintas e 5 RFs cobertos, sem células vazias.

---

### Tabela de RNF — Atendimento por Eixo

Para cada eixo, descreva **como** o projeto atende ao RNF definido na Ponderada 1:

| Eixo | RNF (Ponderada 1) | Como Foi Atendido | Evidência |
|------|-------------------|-------------------|-----------|
| Usabilidade | Mensagens de erro legíveis | Campo `mensagem` em todos os responses de erro | CT02, CT03 |
| Confiabilidade | Retornar 409 em duplicidade | Service lança `EmailDuplicadoError`; Controller mapeia para 409 | CT02 |
| Desempenho | Leitura < 300ms | Medido em CT07 com `Date.now()` | CT07 |
| Suportabilidade | Métodos com responsabilidade única | Revisão de código — nenhum método > 20 linhas | — |
| Segurança | Senha nunca retorna | `delete usuario.senha` antes do retorno | CT01 |
| Capacidade | Suportar 1000 registros | Script seed com 1000 linhas executado | seed.js |
| Restrições | Arquitetura em camadas | Diagrama de Classes da Ponderada 1 | diagrama.pdf |
| Organizacionais | Convenção REST | Todos endpoints revisados e padronizados | contrato.md |

---

### Registro de Mudanças de Contrato

Documente **tudo que mudou** em relação às Ponderadas 1 e 2:

| O que Mudou | Motivo | Impacto no RTM | Testes Atualizados? |
|-------------|--------|----------------|---------------------|
| `GET /notas` → `GET /notas/:alunoId` | Frontend precisava filtrar por aluno | RF003 atualizado | Sim — CT07 |
| Campo `cpf` removido | Parceiro não usa CPF | RN03 removida | Sim — CT03 reescrito |
| Status 422 → 400 | Padronização do time | Contrato atualizado | Sim |

**Se nada mudou:** Escreva uma linha justificando: *"Nenhuma mudança de contrato — modelagem inicial foi seguida integralmente."*

---

### Índice de Evidências

Liste cada evidência referenciada no RTM:

| ID | Tipo | Descrição | Localização |
|----|------|-----------|-------------|
| EV01 | Screenshot | Tela de notas exibindo dados do aluno | `/evidencias/ev01_tela_notas.png` |
| EV02 | Output Jest | CT01–CT04 passando após integração | `/evidencias/ev02_jest_output.txt` |
| EV03 | Log de Rede | Request/response do POST /usuarios | `/evidencias/ev03_network_log.png` |

---

### Critérios de Avaliação — Ponderada 3

| Critério | Peso | Dica para Nota Máxima |
|----------|------|-----------------------|
| RTM completo sem células vazias | 40% | Cada linha conta uma história verificável |
| Tabela de RNF com atendimento real | 25% | Descreva decisões de design, não apenas cite testes |
| Registro de mudanças honesto | 20% | Mudanças registradas valem mais que omissão |
| Índice de evidências | 15% | Evidências provam comportamento, não existência |

---

## Rastreabilidade entre Ponderadas

### Como as Ponderadas se Conectam

```
PONDERADA 1 (Aula 4)
├── RNFs Técnicos definidos
├── Diagramas de Sequência criados
└── Rastreabilidade: RF → RNF → Diagrama
        ↓
PONDERADA 2 (Aula 6)
├── Testes implementados cobrem RNFs da P1
├── Fluxos testados = Diagramas da P1 implementados
└── Rastreabilidade: RF → RN → Teste
        ↓
PONDERADA 3 (Aula 9)
├── RTM consolida P1 + P2
├── RNFs da P1 verificados nos testes da P2
└── Rastreabilidade completa: Persona → Evidência
```

### Exemplo de Rastreabilidade Cruzada

| Elemento | Ponderada 1 | Ponderada 2 | Ponderada 3 |
|----------|-------------|-------------|-------------|
| **RNF: E-mail único** | Definido como "Retornar 409 em duplicidade" | Testado em CT02 | Rastreável no RTM (Admin → RF001 → RN01 → CT02) |
| **RNF: Senha segura** | Definido como "Senha nunca retorna em response" | Testado em CT01 | Rastreável no RTM (Segurança → CT01) |
| **Fluxo: Criar usuário** | Diagrama de Sequência 1 | Suite de testes completa | RTM linha completa |

---

## Checklist de Preparação

### Antes da Ponderada 1

- [ ] RFs e RNs mapeados nas Aulas 1-2
- [ ] Entidades principais identificadas
- [ ] Mínimo de 3 fluxos candidatos a diagramas
- [ ] Lista de RNFs genéricos para refinar

### Durante a Ponderada 1 (1h30)

- [ ] 0–20 min: Tabela de RNF técnica (8 eixos)
- [ ] 20–50 min: Diagrama de Sequência 1 e 2
- [ ] 50–75 min: Diagrama de Sequência 3
- [ ] 75–90 min: Revisão e rastreabilidade

### Antes da Ponderada 2

- [ ] Backend implementado (pelo menos 1 fluxo completo)
- [ ] Banco de dados configurado para testes
- [ ] Supertest instalado: `npm install --save-dev supertest`
- [ ] Jest configurado e funcionando

### Durante a Ponderada 2 (1h30)

- [ ] 0–15 min: Escolher fluxo e mapear casos
- [ ] 15–60 min: Implementar suite Jest (4 casos)
- [ ] 60–75 min: Executar, corrigir, capturar evidência
- [ ] 75–90 min: Preencher matriz de rastreabilidade

### Antes da Ponderada 3

- [ ] Frontend integrado com backend
- [ ] Testes Jest passando
- [ ] Personas documentadas
- [ ] Evidências capturadas (screenshots, logs)

### Durante a Ponderada 3 (1h30)

- [ ] 0–10 min: Listar personas e necessidades
- [ ] 10–40 min: Preencher RTM linha a linha
- [ ] 40–60 min: Tabela de RNF — atendimento por eixo
- [ ] 60–80 min: Registro de mudanças de contrato
- [ ] 80–90 min: Revisão final

---

## Referências

### Documentos do Curso

| Documento | Link |
|-----------|------|
| Aula 01 — RNFs e 8 Eixos | [./aula_01_rnf_8_eixos.md](./aula_01_rnf_8_eixos.md) |
| Aula 02 — Métricas SRE | [./aula_02_rnf_metricas_sre.md](./aula_02_rnf_metricas_sre.md) |
| Aula 04 — UML e TDD | [./aula_04_uml_tdd.md](./aula_04_uml_tdd.md) |
| Aula 05 — REST e Endpoints | [./aula_05_rest_endpoints.md](./aula_05_rest_endpoints.md) |
| Aula 06 — RTM e Design Patterns | [./aula_06_rtm_design_patterns.md](./aula_06_rtm_design_patterns.md) |

### Referências Externas

| Referência | Descrição |
|------------|-----------|
| **ISO/IEC 25010** | Norma de qualidade de software (8 eixos) |
| **SWEBOK v3** | Software Engineering Body of Knowledge |
| **Nielsen, J. (1994)** | Usability Engineering — Heurísticas de usabilidade |
| **Beck, K. (2002)** | Test-Driven Development: By Example |
| **Fowler, M.** | Mocks Aren't Stubs — martinfowler.com |

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Black-Box Testing** | Teste que verifica comportamento observável, sem conhecer implementação interna |
| **CT (Caso de Teste)** | Cenário específico de teste com entrada, execução e resultado esperado |
| **Evidência** | Artefato concreto que comprova atendimento de requisito (screenshot, log, output) |
| **Mock** | Objeto substituto que simula comportamento de dependência externa |
| **RN (Regra de Negócio)** | Restrição ou política do domínio que o sistema deve respeitar |
| **RNF (Requisito Não Funcional)** | Critério de qualidade ou restrição técnica do sistema |
| **RTM** | Requirements Traceability Matrix — matriz de rastreabilidade de requisitos |
| **Suite de Testes** | Conjunto de casos de teste relacionados a um fluxo ou módulo |
