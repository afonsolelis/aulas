# Ponderada 3 — RTM Completo com Documentação

**Aplicada em:** Aula 9 — Frontend III | **Visões RM-ODP:** Engineering + Technology
**Formato:** Individual | **Tempo:** 1h30 em sala de aula

---

## Contexto

O projeto está integrado: backend rodando, frontend conectado, testes Jest escritos. Esta ponderada é o fechamento documental — você vai construir o RTM completo provando que cada persona tem suas necessidades atendidas por RFs implementados, testados e evidenciados. O documento produzido aqui é a prova de que o sistema faz o que foi prometido.

---

## Cronograma sugerido (1h30)

| Tempo | Etapa |
|-------|-------|
| 0–10 min | Listar personas e necessidades (do projeto real) |
| 10–40 min | Preencher o RTM linha a linha |
| 40–60 min | Tabela de RNF — atendimento por eixo |
| 60–80 min | Seção de mudanças de contrato (o que mudou durante o projeto) |
| 80–90 min | Revisão: checar se alguma célula do RTM ficou vazia |

---

## Entrega Mínima

A entrega mínima é o que precisa estar presente para a atividade ser considerada — **não garante nota máxima**.

- RTM com ao menos 3 personas distintas e 5 RFs cobertos, sem células vazias na trilha principal
- Tabela de RNF com os 8 eixos preenchidos, referenciando os RNFs definidos na Ponderada 1
- Registro de mudanças de contrato (ao menos uma entrada, ou justificativa explícita de ausência)
- Índice de evidências com localização de cada artefato referenciado no RTM

Entregas que cumprem apenas o mínimo serão avaliadas na faixa **5,0 a 6,5**.

---

## O que entregar

### 1. RTM — Requirements Traceability Matrix

Preencha uma linha por **combinação RF + RN**. Não deixe células vazias na trilha principal — se não tem evidência, escreva "pendente" e justifique.

| Persona | Necessidade | RF | Descrição do RF | RN | Regra de Negócio | Endpoint | Tela / Componente | Teste Jest | Evidência |
|---------|-------------|----|-----------------|----|------------------|----------|-------------------|------------|-----------|
| Aluno | Acessar suas notas | RF003 | Consultar notas por aluno | RN05 | Aluno só vê as próprias notas | GET /notas/:id | TelaNotas.jsx | CT07 | [print ou log] |
| Admin | Cadastrar novo usuário | RF001 | Criar usuário no sistema | RN01 | E-mail deve ser único | POST /usuarios | FormCadastro.jsx | CT01, CT02 | [print ou log] |

**Mínimo:** 3 personas distintas e 5 RFs cobertos.

---

### 2. Tabela de RNF — Atendimento por Eixo

Para cada eixo, descreva **como** o projeto atende ao RNF definido na Ponderada 1, com a evidência concreta.

| Eixo | RNF definido (Ponderada 1) | Como foi atendido | Evidência |
|------|---------------------------|-------------------|-----------|
| Usabilidade | Mensagens de erro legíveis ao usuário | Campo `mensagem` em todos os responses de erro | CT02, CT03 |
| Confiabilidade | Retornar 409 em duplicidade, não 500 | Service lança exceção tipada; Controller mapeia para 409 | CT02 |
| Desempenho | Endpoints de leitura < 300ms | Medido em CT07 com `Date.now()` | CT07 |
| Suportabilidade | Métodos de Service com responsabilidade única | Revisão de código — nenhum método > 20 linhas | — |
| Segurança | Senha nunca retorna em response | `delete usuario.senha` antes do retorno | CT01 |
| Capacidade | Suportar 1000 registros sem degradação | Script de seed com 1000 linhas executado | seed.js |
| Restrições de Design | Arquitetura Controller → Service → Repository | Diagrama de Classes da Ponderada 1 | diagrama |
| Organizacionais | Endpoints seguem convenção REST do time | Todos os endpoints revisados e padronizados | contrato de API |

---

### 3. Registro de Mudanças de Contrato

Liste tudo que mudou em relação ao que foi modelado nas Ponderadas 1 e 2. Isso não é penalidade — é rastreabilidade real.

| O que mudou | Motivo | Impacto no RTM | Testes atualizados? |
|-------------|--------|----------------|---------------------|
| `GET /notas` virou `GET /notas/:alunoId` | Frontend precisava filtrar por aluno | RF003 atualizado | Sim — CT07 |
| Campo `cpf` removido do cadastro | Parceiro não usa CPF no sistema | RN03 removida | Sim — CT03 reescrito |
| Status 422 substituído por 400 | Padronização do time | Contrato atualizado | Sim |

Se nada mudou, escreva uma linha justificando: `"Nenhuma mudança de contrato — modelagem inicial foi seguida integralmente."`

---

### 4. Índice de Evidências

Liste cada evidência referenciada no RTM com uma descrição de onde encontrá-la:

| ID | Tipo | Descrição | Localização |
|----|------|-----------|-------------|
| EV01 | Screenshot | Tela de notas exibindo dados do aluno logado | `/evidencias/ev01_tela_notas.png` |
| EV02 | Output Jest | CT01–CT04 passando após integração | `/evidencias/ev02_jest_output.txt` |
| EV03 | Log de rede | Request/response do POST /usuarios no browser | `/evidencias/ev03_network_log.png` |

---

## Critérios de Avaliação

| Critério | Peso |
|----------|------|
| RTM completo: sem células vazias na trilha persona → evidência | 40% |
| Tabela de RNF com atendimento real e evidência por eixo | 25% |
| Registro de mudanças de contrato honesto e rastreado | 20% |
| Índice de evidências referenciando artefatos existentes | 15% |

### O que diferencia uma entrega excelente

Cumprir o mínimo coloca o trabalho na média. A nota máxima é alcançada por quem transforma o RTM em um **argumento técnico coerente** — não um preenchimento de tabela.

**No RTM:**
- Necessidades das personas escritas na linguagem do usuário real, não da tecnologia (ex.: "ver o histórico das minhas compras" em vez de "listar pedidos por usuário")
- Cada linha do RTM conta uma história completa e verificável: é possível ir da persona até a evidência sem ambiguidade
- RNFs do projeto aparecem como linhas no RTM, não apenas na tabela de eixos — demonstrando que qualidade também é rastreável

**Na tabela de RNF:**
- A coluna "como foi atendido" descreve a **decisão de design** que viabilizou o RNF, não apenas cita o teste (ex.: "Service lança `EmailDuplicadoError` que o Controller mapeia para 409, isolando a regra da camada HTTP")
- RNFs que não foram plenamente atendidos estão registrados com justificativa e plano — honestidade técnica vale mais do que omissão

**No registro de mudanças:**
- Mudanças documentadas com análise do impacto: o que precisou ser refeito, qual decisão original estava errada e o que foi aprendido
- Ausência de mudanças acompanhada de reflexão sobre se a modelagem inicial foi precisa ou se o escopo foi restrito para evitar mudanças

**No índice de evidências:**
- Evidências que provam o comportamento, não apenas a existência (ex.: screenshot mostrando dados reais do banco na tela, não apenas a tela vazia funcionando)

---

## Dicas para o tempo de aula

- Comece pelo RTM — ele puxa o resto naturalmente.
- Se uma evidência não existe, capture agora: um screenshot do browser ou um `npm test` já serve.
- Mudanças de contrato sem registro são piores do que mudanças registradas — seja honesto.
- A tabela de RNF é rápida: copie os RNFs da Ponderada 1 e preencha a coluna "como foi atendido".
- Não precisa ser bonito — precisa ser completo e verdadeiro.

---

## Formato de Entrega

Documento único (`.md`, `.pdf` ou `.docx`) com as quatro seções acima.
Evidências referenciadas devem estar em pasta `/evidencias` junto ao documento, ou inseridas inline.
