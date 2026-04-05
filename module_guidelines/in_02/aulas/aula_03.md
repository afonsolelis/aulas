# Aula 3 - BANCO DE DADOS II - CREATE, READ, UPDATE, DELETE

## Descrição da Aula
Continuação da trilha de banco com foco nas operações centrais de persistência. A aula trabalha criação, leitura, atualização e remoção de registros com SQL aplicado ao modelo definido anteriormente.

---
**Visão RM-ODP:** Information + Computational  
**RF:** Garantir que o modelo suporte operações principais do sistema  
**RNF (8 eixos):** Confiabilidade + Suportabilidade  
**Artefato:** Script SQL de CRUD + rastreabilidade entre regra, tabela e operação

### Onde queremos chegar
- [ ] Criar tabelas coerentes com o DER definido
- [ ] Executar `INSERT`, `SELECT`, `UPDATE` e `DELETE`
- [ ] Validar integridade básica com chaves e restrições
- [ ] Testar operações com dados válidos e inválidos
- [ ] Relacionar cada operação com pelo menos um RF do projeto

---
## Auto Estudo Recomendado (Tempo Estimado Total: 120 min)

1. **DDL e DML** (Estimativa: 35 min):
   - Diferença entre definição de estrutura e manipulação de dados.
   **Por que estudar isso:** Organiza a passagem entre modelagem e operação prática no banco.

2. **CRUD em SQL** (Estimativa: 40 min):
   - `INSERT`, `SELECT`, `UPDATE`, `DELETE`.
   **Por que estudar isso:** Forma a base das operações que depois serão expostas por endpoints.

3. **Restrições e integridade** (Estimativa: 25 min):
   - `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`.
   **Por que estudar isso:** Garante consistência desde a camada de dados.

4. **Exercícios com cenários de erro** (Estimativa: 20 min):
   - Duplicidade, referência inexistente e campos obrigatórios.
   **Por que estudar isso:** Mostra como regras de negócio também aparecem no banco.

## Template Para Preenchimento
---

# Aula 3 - BANCO DE DADOS II - CREATE, READ, UPDATE, DELETE

## 1. Visão RM-ODP Trabalhada
- [ ] Enterprise / Information / Computational / Engineering / Technology

## 2. Requisitos Funcionais (RF)
| ID  | Descrição                          | Status        |
|-----|------------------------------------|---------------|
| RF001 | ...                              | Implementado  |

## 3. Requisitos Não Funcionais (8 eixos)
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

## 4. Artefatos de Modelagem
- [ ] Link/nome do artefato (ER, DER, Classes, Sequência, etc.)

## 5. Rastreabilidade
- RN01 → RF001 → Teste001 → Evidência
- ...

## 6. Evidências
- [ ] Screenshots, logs de teste, prints de execução
