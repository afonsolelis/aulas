# Ponderada 2 — Suite de Testes Black-Box: do Controller ao Banco

**Aplicada em:** Aula 6 — Backend III | **Visão RM-ODP:** Computational
**Formato:** Individual | **Tempo:** 1h30 em sala de aula

---

## Contexto

Você já tem endpoints implementados e regras de negócio mapeadas. Agora o objetivo é provar que o sistema atende ao negócio testando **um fluxo inteiro** como uma caixa-preta: a requisição entra no Controller, atravessa Service e Repository, e o efeito no banco é verificado. Integrações externas (e-mail, storage, APIs de terceiros) são substituídas por mocks — o banco de dados **não é mockado**.

---

## Cronograma sugerido (1h30)

| Tempo | Etapa |
|-------|-------|
| 0–15 min | Escolher o fluxo e mapear os casos de teste |
| 15–60 min | Implementar a suite Jest (fluxo feliz + casos de falha) |
| 60–75 min | Executar, corrigir e capturar evidência |
| 75–90 min | Preencher a matriz de rastreabilidade RF → RN → Teste |

---

## Entrega Mínima

A entrega mínima é o que precisa estar presente para a atividade ser considerada — **não garante nota máxima**.

- Um fluxo documentado com justificativa de escolha
- Suite Jest com os 4 casos obrigatórios: sucesso, regra de negócio violada, payload inválido e verificação de persistência no banco
- Banco real utilizado nos testes (não mockado); integrações externas mockadas com `jest.mock()`
- Output de `npm test` com todos os casos passando
- Matriz RF → RN → Teste preenchida

Entregas que cumprem apenas o mínimo serão avaliadas na faixa **5,0 a 6,5**.

---

## O que entregar

### 1. Escolha do Fluxo

Selecione **um único fluxo de negócio** que atravesse todas as camadas. Exemplos:

- Cadastro de usuário (valida e-mail único, persiste no banco)
- Criação de pedido (valida estoque, associa ao usuário, persiste)
- Login (valida credenciais, retorna token/sessão)

Documente a escolha com uma linha:

> **Fluxo escolhido:** `POST /usuarios` — Cadastro de usuário com validação de e-mail único

---

### 2. Suite de Testes Jest

A suite deve cobrir o fluxo escolhido de ponta a ponta, com **banco real** (teste ou em memória) e **mock apenas de integrações externas**.



**Regras da suite:**
- Mínimo **4 casos de teste** para o fluxo escolhido: sucesso, regra de negócio violada, payload inválido e verificação de persistência no banco
- O banco deve ser **limpo e reseedado antes de cada teste** (`beforeEach`)
- Integrações externas (envio de e-mail, SMS, APIs externas) devem usar `jest.mock()`
- O banco de dados **não** usa mock — a persistência é real

---

### 3. Matriz de Rastreabilidade RF → RN → Teste

| RF | RN | Caso de Teste | O que verifica | Status |
|----|----|---------------|----------------|--------|
| RF001 | RN01 — e-mail único | CT02 | Retorna 409 em duplicidade | ✓ |
| RF001 | RN02 — campos obrigatórios | CT03 | Retorna 400 sem payload completo | ✓ |
| RF001 | RNF Segurança | CT01 | Senha não retorna no response | ✓ |
| RF001 | RNF Usabilidade | CT02 | Response de erro tem campo `mensagem` | ✓ |
| RF001 | Persistência | CT04 | Registro existe no banco após criação | ✓ |

---

### 4. Evidência de Execução

Cole o output de `npm test` (ou screenshot do terminal) apontando que os casos passaram com sucesso:

---

## Critérios de Avaliação

| Critério | Peso |
|----------|------|
| O teste cobre o fluxo completo (Controller → Service → Repository → Banco) | 35% |
| Cada caso de teste verifica um comportamento de negócio identificável (RN ou RNF) | 30% |
| Integrações externas mockadas corretamente; banco de dados não mockado | 20% |
| Rastreabilidade RF → RN → Teste preenchida e coerente | 15% |

### O que diferencia uma entrega excelente

Cumprir o mínimo coloca o trabalho na média. A nota máxima é alcançada por quem demonstra que os testes são uma **documentação viva do negócio**, não apenas código que passa.

**Nos casos de teste:**
- Nomes dos testes descrevem o comportamento esperado do negócio, não a implementação (ex.: `"deve impedir cadastro duplicado por e-mail"` em vez de `"CT02"`)
- Casos de borda específicos do domínio do projeto — não apenas os 4 obrigatórios (ex.: e-mail com caracteres especiais, nome com 200 caracteres, senha com apenas espaços)
- CT04 não apenas verifica se o registro existe, mas valida os campos críticos da regra de negócio no banco (ex.: senha armazenada como hash, não em texto plano)

**Na estrutura da suite:**
- `describe` aninhados que refletem a hierarquia RF → RN → cenário, tornando o output do Jest legível como especificação
- Mock do serviço externo com verificação de que foi chamado com os parâmetros corretos.

**Na rastreabilidade:**
- Cada caso de teste referencia explicitamente a RN ou RNF que verifica, com justificativa de por que aquele comportamento importa para o negócio

---

## Dicas para o tempo de aula

- Escolha o fluxo mais simples que seu projeto já tem implementado — não crie código novo.
- Se o banco de teste não estiver configurado, use SQLite em memória com Knex: resolve em 5 minutos.
- `supertest` evita subir o servidor manualmente — `npm install --save-dev supertest` e já está pronto.
- Foque nos 4 casos mínimos primeiro. Se sobrar tempo, adicione cenários de borda do seu domínio.
- Se um teste falhar e você não conseguir corrigir em 10 minutos, documente o motivo — isso também vale como evidência de rastreabilidade.
