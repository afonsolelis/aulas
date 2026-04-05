# Ponderada 1 — RNFs Técnicos e Diagramas de Sequência

**Aplicada em:** Aula 4 — Backend I | **Visão RM-ODP:** Computational
**Formato:** Individual | **Tempo:** 1h30 em sala de aula

---

## Contexto

Nas aulas 1 e 2 você mapeou atores, regras de negócio e entidades do seu projeto. Agora é hora de traduzir isso em design computacional: descrever os RNFs de forma técnica e verificável, e representar os fluxos principais como diagramas de sequência UML entre as camadas do backend.

---

## Cronograma sugerido (1h30)

| Tempo | Etapa |
|-------|-------|
| 0–20 min | Tabela de RNF técnica (8 eixos) |
| 20–50 min | Diagrama de Sequência 1 e 2 |
| 50–75 min | Diagrama de Sequência 3 |
| 75–90 min | Revisão e rastreabilidade RF → RNF → Sequência |

---

## Entrega Mínima

A entrega mínima é o que precisa estar presente para a atividade ser considerada — **não garante nota máxima**.

- Tabela de RNF preenchida para os 8 eixos, com ao menos uma métrica ou critério concreto por eixo
- 3 diagramas de sequência com as 4 camadas (Controller → Service → Repository → Banco), fluxo principal e ao menos 1 fluxo alternativo cada
- Tabela de rastreabilidade RF → RNF → Diagrama preenchida para os 3 diagramas

Entregas que cumprem apenas o mínimo serão avaliadas na faixa **5,0 a 6,5**.

---

## O que entregar

### 1. Tabela de RNF Técnica — 8 Eixos

Cada RNF deve ser escrito de forma **mensurável e verificável** — sem frases genéricas como "o sistema deve ser rápido". Use métricas, limites, tecnologias ou critérios concretos.

| Eixo | RNF Técnico | Como medir / verificar |
|------|-------------|------------------------|
| Usabilidade | Ex.: Toda resposta de erro HTTP deve incluir campo `"mensagem"` legível ao usuário final | Inspecionar JSON de retorno nos testes |
| Confiabilidade | Ex.: O endpoint de cadastro deve retornar 409 (e não 500) em caso de e-mail duplicado | Teste Jest com caso negativo |
| Desempenho | Ex.: Endpoints de leitura devem responder em < 300ms com até 100 registros no banco | Medição via `console.time` ou Jest timer |
| Suportabilidade | Ex.: Cada método de Service deve ter no máximo 20 linhas e responsabilidade única | Revisão de código / linting |
| Segurança | Ex.: Nenhum campo de senha pode ser retornado em response de qualquer endpoint | Inspeção do JSON de resposta |
| Capacidade | Ex.: O banco deve suportar inserção de 1000 registros sem degradação perceptível | Script de seed + medição |
| Restrições de Design | Ex.: A arquitetura deve seguir as camadas Controller → Service → Repository → Model | Diagrama de Classes |
| Organizacionais | Ex.: Todos os endpoints devem seguir convenção REST definida pelo time (substantivos no plural, snake_case) | Revisão do contrato de API |

> **Critério de qualidade:** se o RNF não puder ser testado ou inspecionado, reescreva até que possa.

---

### 2. Três Diagramas de Sequência UML

Escolha **3 fluxos** entre os RFs mapeados nas aulas 1 e 2. Pelo menos um deve ser um fluxo de **escrita** (criação ou atualização) e pelo menos um deve ser um fluxo de **leitura** (consulta ou listagem).

**Estrutura obrigatória de cada diagrama:**

```
Ator → Controller → Service → Repository → Banco
                                          ← (retorno)
                             ← (retorno)
              ← (retorno)
← resposta HTTP
```

Inclua em cada diagrama:
- **Pré-condição:** o que precisa ser verdade para o fluxo começar
- **Fluxo principal:** sequência de chamadas entre as camadas
- **Resposta de sucesso:** o que é retornado ao ator
- **Fluxo alternativo (ao menos 1):** o que acontece em caso de dado inválido, recurso não encontrado ou regra violada

**Ferramenta sugerida:** draw.io, Mermaid, PlantUML ou papel fotografado.

Exemplo de estrutura com Mermaid:
```
sequenceDiagram
  actor Usuario
  Usuario->>Controller: POST /usuarios { nome, email, senha }
  Controller->>Service: criar({ nome, email, senha })
  Service->>Repository: buscarPorEmail(email)
  Repository-->>Service: null
  Service->>Repository: salvar({ nome, email, senhaHash })
  Repository-->>Service: { id, nome, email }
  Service-->>Controller: { id, nome, email }
  Controller-->>Usuario: 201 { id, nome, email }
```

---

### 3. Rastreabilidade RF → RNF → Sequência

Para cada diagrama entregue, indique quais RFs e RNFs ele cobre:

| Diagrama | RF(s) atendido(s) | RNF(s) exercitados | Fluxo alternativo documentado |
|----------|-------------------|-------------------|-------------------------------|
| Sequência 1 | RF001 | Confiabilidade (RN01), Segurança | Sim — e-mail duplicado → 409 |
| Sequência 2 | RF003 | Desempenho, Usabilidade | Sim — id não encontrado → 404 |
| Sequência 3 | RF002 | Segurança, Suportabilidade | Sim — senha inválida → 400 |

---

## Critérios de Avaliação

| Critério | Peso |
|----------|------|
| RNFs escritos de forma técnica e verificável (sem genéricos) | 35% |
| Correção e completude dos diagramas de sequência (camadas, fluxos alternativos) | 40% |
| Rastreabilidade RF → RNF → Diagrama | 25% |

### O que diferencia uma entrega excelente

Cumprir o mínimo coloca o trabalho na média. A nota máxima é alcançada por quem demonstra raciocínio de engenharia, não apenas preenchimento de template. Exemplos do que eleva a nota:

**Nos RNFs:**
- RNFs derivados diretamente das regras de negócio do projeto, não copiados de exemplos genéricos
- Coluna "como medir" com método de verificação real e executável (ex.: nome do teste Jest, query SQL, flag de configuração)
- RNFs que antecipam riscos reais do domínio do parceiro (ex.: volume de acessos simultâneos em horário de pico, dados regulados por LGPD)

**Nos diagramas:**
- Fluxos alternativos que cobrem mais de um cenário de falha por diagrama (ex.: dado inválido *e* regra de negócio violada *e* recurso não encontrado)
- Mensagens com tipos e valores concretos (ex.: `Service → Repository: buscarPorEmail("ana@email.com")` em vez de `Service → Repository: buscar`)
- Consistência total entre os 3 diagramas: mesmos nomes de classes, métodos e payloads

**Na rastreabilidade:**
- Cada linha justifica *por que* aquele RNF é exercitado naquele fluxo, não apenas lista o nome do eixo

---

## Dicas para o tempo de aula

- Comece pelo RNF que você já sabe como medir — os outros ficam mais fáceis depois.
- Os diagramas não precisam ser perfeitos graficamente: clareza de fluxo vale mais que estética.
- Se travar no fluxo alternativo, pense: "o que pode dar errado nesse endpoint?" — dado inválido, banco vazio, regra violada.
- Use os RFs que você já mapeou nas aulas 1 e 2 — não invente novos fluxos agora.

---

## Formato de Entrega

Documento único (`.md`, `.pdf` ou `.docx`) com as três seções acima.
Diagramas podem ser inseridos como imagem ou código Mermaid/PlantUML.
