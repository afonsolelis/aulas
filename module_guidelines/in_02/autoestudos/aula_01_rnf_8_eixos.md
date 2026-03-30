# Autoestudo: Requisitos Não Funcionais (RNFs) e os 8 Eixos de Qualidade

## Sumário
1. [Definição](#definição)
2. [Minimundo do Sistema](#minimundo-do-sistema)
3. [Perspectiva dos Corpos de Conhecimento](#perspectiva-dos-corpos-de-conhecimento)
4. [Os 8 Eixos da ISO/IEC 25010](#os-8-eixos-da-isoiec-25010)
5. [Boas Práticas para Redação de RNFs](#boas-práticas-para-redação-de-rnfs)

---

## Definição

**Requisitos Não Funcionais (RNFs)** são restrições e critérios de qualidade que definem **como** um sistema deve operar, em contraste com os **Requisitos Funcionais (RFs)** que definem **o que** o sistema deve fazer.

| Tipo | Foco | Exemplo |
|------|------|---------|
| **Funcional (RF)** | Utilidade (*Utility*) | "O sistema deve permitir login de usuários" |
| **Não Funcional (RNF)** | Garantia (*Warranty*) | "O login deve responder em até 300ms (p99)" |

---

## Minimundo do Sistema

O **minimundo** é uma descrição textual concisa do domínio real que o sistema irá modelar. Ele antecede qualquer diagrama ou requisito formal, pois é a partir dele que o escopo, as entidades e as restrições do sistema se tornam compreensíveis para todos os envolvidos — desenvolvedores, analistas e stakeholders.

### Fontes obrigatórias: Workshop do Parceiro e TAPI

O minimundo **não é inventado** — ele deve ser extensivamente baseado em duas fontes primárias fornecidas no início de cada módulo:

- **Workshop do Parceiro:** sessão conduzida pela empresa parceira onde o problema de negócio, os usuários reais, os fluxos existentes e as restrições operacionais são apresentados. Tudo que o parceiro descreve — vocabulário, atores, processos, dores — deve aparecer refletido no minimundo.
- **TAPI (Termo de Abertura de Projeto Inteli):** documento formal que delimita o escopo oficial do projeto, os entregáveis esperados, as restrições institucionais e os critérios de avaliação. O TAPI define o que está dentro e fora do projeto de forma contratual.

> Um minimundo que contradiz o TAPI ou ignora o que foi dito no workshop do parceiro está **errado por definição**, independentemente de estar bem escrito. A rastreabilidade começa aqui.

### Como usar as fontes na prática

| Fonte | O que extrair |
|-------|--------------|
| **Workshop do Parceiro** | Atores reais, fluxos de trabalho, termos do domínio, dores e restrições operacionais |
| **TAPI** | Escopo oficial, entregáveis, o que está fora do projeto, restrições institucionais |

Ambas as fontes devem ser consultadas em conjunto. O workshop traz profundidade de domínio; o TAPI traz os limites formais. O minimundo é a síntese dos dois.

### Por que o minimundo importa antes dos RNFs?

Antes de definir *quanto* o sistema deve ser rápido, seguro ou disponível, é preciso saber **o que** o sistema faz e **para quem**. O minimundo responde exatamente a isso. Um RNF sem contexto de domínio é vago; com o minimundo estabelecido, cada eixo de qualidade pode ser preenchido com valores realistas e rastreáveis.

### Estrutura obrigatória de um minimundo

Um minimundo bem escrito deve conter:

| Elemento | O que responde |
|----------|----------------|
| **Contexto** | Qual é o problema de negócio? Quem usa o sistema? |
| **Entidades principais** | Quais são os objetos centrais do domínio? |
| **Ciclo de vida de entidades** | Quais estados uma entidade percorre? |
| **Atores e papéis** | Quem faz o quê dentro do sistema? |
| **Restrições de acesso** | Quais dados são sensíveis? Quem pode ver o quê? |
| **Fora do escopo** | O que o sistema explicitamente **não** fará? |

> O item "fora do escopo" é o mais cobrado no critério de aceite do Artefato 1. Um minimundo sem fronteiras explícitas é considerado incompleto.

### Exemplo completo

**Minimundo — Sistema de Agendamento de Consultas**

> O sistema gerencia o agendamento de consultas em uma clínica médica de pequeno porte. Pacientes podem se cadastrar, visualizar a disponibilidade de médicos e solicitar agendamentos. Cada médico possui uma especialidade e uma grade de horários disponíveis por semana. Um agendamento vincula um paciente a um médico em um horário específico e possui os estados: *pendente*, *confirmado*, *cancelado* ou *realizado*.
>
> A recepcionista é responsável por confirmar ou cancelar agendamentos e tem acesso ao histórico de consultas de cada paciente. Médicos visualizam apenas sua própria agenda. Pacientes não têm acesso às informações de outros pacientes.
>
> **Está fora do escopo:** prontuário eletrônico, prescrições, faturamento, convênios e telemedicina.

### Como o minimundo alimenta os 8 eixos

Uma vez escrito o minimundo, cada eixo RNF pode ser preenchido diretamente a partir dele:

| Elemento do minimundo | Eixo RNF correspondente |
|-----------------------|------------------------|
| "clínica de pequeno porte" → volume baixo | Desempenho / Capacidade |
| "histórico de consultas de pacientes" → dado sensível | Segurança |
| "recepcionista confirma agendamentos" → usuário operacional | Usabilidade / Manutenibilidade |
| "agendamento tem estados" → fluxo crítico | Confiabilidade |
| "sem prontuário eletrônico" → integração futura possível | Compatibilidade / Portabilidade |

---

## Perspectiva dos Corpos de Conhecimento

### SWEBOK (*Software Engineering Body of Knowledge*)
Os RNFs são abordados no capítulo de **Software Requirements** como atributos e restrições de qualidade, sendo detalhados no capítulo de **Software Quality**, onde se vinculam às características operacionais do sistema.

### BABOK (*Business Analysis Body of Knowledge*)
Na tarefa de **Specify and Model Requirements**, os RNFs são definidos como condições ambientais ou descrições de qualidades que a solução deve possuir para ser considerada eficaz pelos *stakeholders*.

---

## Os 8 Eixos da ISO/IEC 25010

A norma **ISO/IEC 25010** (sucessora da ISO 9126) categoriza a qualidade de software em 8 características. Cada eixo abaixo inclui definição, conexão com BoKs e exemplo aplicável a artefatos de modelagem.

### 1. Eficiência de Desempenho (*Performance Efficiency*)

**Definição:** Relação entre o nível de desempenho e a quantidade de recursos utilizados (CPU, memória, rede) sob condições específicas.

| Subcaracterística | Descrição |
|-------------------|-----------|
| *Time behaviour* | Tempos de resposta e latência |
| *Resource utilisation* | Uso de recursos de hardware |
| *Capacity* | Limites de carga suportados |

**Conexão BoK:** SWEBOK — *Software Construction* e *Software Quality*

**Exemplo:**
> "A API de autenticação deve retornar o token em no máximo **300ms (p99)** sob carga de 4.000 requisições/hora, com uso de CPU ≤ 75%."

---

### 2. Confiabilidade (*Reliability*)

**Definição:** Capacidade de executar funções especificadas sob condições definidas por um período determinado.

| Subcaracterística | Descrição |
|-------------------|-----------|
| *Maturity* | Frequência de falhas |
| *Availability* | Tempo de operação contínua |
| *Fault tolerance* | Operação sob falhas parciais |
| *Recoverability* | Recuperação após falhas |

**Conexão BoK:** SWEBOK — *Software Quality* (métricas como MTBF, MTTR)

**Exemplo:**
> "O cluster de microsserviços deve garantir **99,9% de disponibilidade anual** (máximo de 43 minutos de *downtime*/mês) com *failover* automático entre zonas."

---

### 3. Segurança (*Security*)

**Definição:** Grau de proteção de informações e dados contra acessos não autorizados, garantindo confidencialidade, integridade, não-repúdio e autenticidade.

| Subcaracterística | Descrição |
|-------------------|-----------|
| *Confidentiality* | Proteção de dados em repouso e trânsito |
| *Integrity* | Prevenção de alterações não autorizadas |
| *Authenticity* | Verificação de identidade |
| *Accountability* | Rastreabilidade de ações |

**Conexão BoK:** SWEBOK — *Software Engineering Security*; Conformidade (LGPD, GDPR)

**Exemplo:**
> "Senhas e chaves de API devem ser armazenadas com **hash irreversível bcrypt (cost=12)** e *salt* único por registro."

---

### 4. Usabilidade (*Usability*)

**Definição:** Facilidade de compreensão, aprendizado, operação e atratividade para o usuário em condições específicas de uso.

| Subcaracterística | Descrição |
|-------------------|-----------|
| *Appropriateness* | Adequação às tarefas |
| *Learnability* | Curva de aprendizado |
| *Operability* | Facilidade de operação |
| *User error protection* | Prevenção e recuperação de erros |

**Conexão BoK:** SWEBOK — *Human-Computer Interaction (HCI)*; BABOK — *Stakeholder Engagement*

**Exemplo:**
> "O fluxo de checkout deve ser concluído em **no máximo 3 passos**, com feedback visual imediato (*optimistic UI*) e sem *reload* completo da página."

---

### 5. Manutenibilidade (*Maintainability*)

**Definição:** Nível de esforço necessário para modificar, atualizar, refatorar ou corrigir o código.

| Subcaracterística | Descrição |
|-------------------|-----------|
| *Modularity* | Baixo acoplamento entre componentes |
| *Reusability* | Capacidade de reutilização |
| *Analysability* | Facilidade de diagnóstico |
| *Testability* | Capacidade de validação automatizada |

**Conexão BoK:** SWEBOK — *Software Maintenance* e *Software Configuration Management*

**Exemplo:**
> "O repositório TypeScript deve exigir **cobertura de testes unitários ≥ 85%** e aprovação automatizada de *linters* no pipeline de CI."

---

### 6. Adequação Funcional (*Functional Suitability*)

**Definição:** Grau em que o produto provê funções que atendem às necessidades declaradas e implícitas do domínio de negócio.

| Subcaracterística | Descrição |
|-------------------|-----------|
| *Completeness* | Todas as funções necessárias estão presentes |
| *Correctness* | Execução precisa das funções |
| *Appropriateness* | Relevância das funções para o domínio |

**Conexão BoK:** SWEBOK — *Software Requirements*; BABOK — *Requirements Analysis*

**Exemplo:**
> "O algoritmo de aprovação de crédito deve consultar **obrigatoriamente as 4 bases de restrição financeira** em tempo real antes de retornar status `approved`."

---

### 7. Compatibilidade (*Compatibility*)

**Definição:** Capacidade do sistema de operar em coexistência com outros softwares ou de trocar informações com sistemas heterogêneos.

| Subcaracterística | Descrição |
|-------------------|-----------|
| *Co-existence* | Operação em ambiente compartilhado |
| *Interoperability* | Troca de informações entre sistemas |

**Conexão BoK:** SWEBOK — *Software Architecture* e *Software Interfaces*

**Exemplo:**
> "O *front-end* deve renderizar corretamente nas **3 últimas versões** dos navegadores Chrome, Safari e Firefox, sem quebras de layout em CSS Grid/Flexbox."

---

### 8. Portabilidade (*Portability*)

**Definição:** Capacidade de transferir o software entre ambientes (hardware, SO, provedor de nuvem) com mínimo esforço.

| Subcaracterística | Descrição |
|-------------------|-----------|
| *Adaptability* | Adaptação a diferentes ambientes |
| *Installability* | Facilidade de instalação |
| *Replaceability* | Substituição por outro software |

**Conexão BoK:** SWEBOK — *Software Configuration Management* e *Deployment*

**Exemplo:**
> "Backend e *frontend* devem ser empacotados em **imagens Docker (Linux Alpine)** com variáveis de ambiente externalizadas, garantindo portabilidade entre AWS e Azure."

---

## Boas Práticas para Redação de RNFs

### Critérios de Qualidade (BABOK)

Um RNF deve ser:
- **Testável:** Passível de verificação objetiva
- **Mensurável:** Expresso em unidades quantificáveis
- **Não ambíguo:** Interpretação única e clara

### Exemplos Comparativos

| ❌ Incorreto (Ambíguo) | ✅ Correto (Mensurável) |
|------------------------|-------------------------|
| "O sistema deve ser muito seguro" | "Dados sensíveis devem ser criptografados com AES-256 em repouso" |
| "Deve ser super rápido" | "Latência p99 ≤ 300ms sob carga de 4.000 req/h" |
| "Precisa estar sempre disponível" | "Disponibilidade de 99,9% anual (≤ 43 min downtime/mês)" |

### Checklist para Validação

- [ ] O RNF possui unidade de medida clara?
- [ ] É possível criar um teste automatizado para validá-lo?
- [ ] Está classificado em um dos 8 eixos da ISO/IEC 25010?
- [ ] O valor definido é realista para o contexto do projeto?

---

## Referências

- **ISO/IEC 25010:2011** — *Systems and software engineering — Quality model*
- **SWEBOK v3** — *Guide to the Software Engineering Body of Knowledge*
- **BABOK v3** — *A Guide to the Business Analysis Body of Knowledge*

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **p99** | Percentil 99 — 99% das observações estão abaixo deste valor |
| **MTBF** | *Mean Time Between Failures* — Tempo médio entre falhas |
| **Failover** | Mecanismo de troca automática para sistema redundante |
| **CI** | *Continuous Integration* — Integração contínua automatizada |
