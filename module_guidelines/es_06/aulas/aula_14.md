# Aula 14 - TÓPICOS DE BD: TRANSACTIONS E TRIGGERS

## Descrição da Aula
Nesta instrução você aprenderá dois conceitos importantes para garantir a integridade, consistência e automação de operações em bancos de dados relacionais: Transactions (Transações) e Triggers (Gatilhos).
Você entenderá como as transações são essenciais para garantir que conjuntos de operações ocorram de forma completa ou sejam revertidas em caso de erro, impactando diretamente na segurança e consistência das informações armazenadas. Além disso, conhecerá os triggers, ferramentas poderosas que permitem automatizar ações em resposta a eventos específicos no banco de dados, garantindo…

---
**Visão RM-ODP:** Computational
**Eixo:** Computação
**Assuntos:** Modularização de programas
,Estruturas de dados
,Padrões de codificação
,Noções de arquivos em programação
,Depuração de programas
,Paradigmas e modelos de desenvolvimento de sistemas de informação
,Design patterns
,Algoritmos distribuídos
,Comunicação e sincronização de processos
,Controle de concorrência
,Invocação remota
,Modelos de arquitetura de sistemas distribuídos
,Objetos e componentes distribuídos
,Serviços Web
,Sistemas de arquivos distribuídos
,Projeto de algoritmos
,Recursão e indução
,Projeto e arquitetura de sistemas
,Reuso
,Arquitetura da Web
,Testes unitários
,Algoritmos para a solução de problemas de baixa complexidade
,Programação orientada a objetos
,Padrões arquiteturais MVC, MVP e MVVM
**Sprint:** 3

### Onde queremos chegar
- [ ] Compreender os conceitos centrais da aula
- [ ] Relacionar o conteúdo ao projeto em andamento
- [ ] Identificar requisitos funcionais e não funcionais relevantes
- [ ] Aplicar o vocabulário técnico no contexto do projeto

---

## Auto Estudo Recomendado
**Tempo Estimado Total:** 120 min

1. **Atividade de UX** (0.0 min) — User Experience
   - Fonte: https://docs.google.com/document/d/1qp3jK0J6SAWit9_G1y1yaw5WoNZIQcTqN0BFIJR_eoE/edit?usp=sharing
   - Atenção, galera! Esse autoestudo é só pra você enviar a atividade do nosso encontro. Qualquer dúvida, fale com o professor!
2. **Como utilizar o Material Design?** (0.0 min) — User Experience
   - Fonte: https://m3.material.io/
   - Com o Material 3, vocês podem se aprofundar nas práticas de design mais recentes, aprendendo a aplicar princípios estéticos e funcionais em seus…
3. **PostgreSQL Transactions** (0.0 min) — Computação
   - Fonte: https://neon.tech/postgresql/postgresql-tutorial/postgresql-transaction
   - Este tutorial oferece uma introdução prática às transações no PostgreSQL, explicando como utilizar os comandos associados. Ele também aborda os…
4. **PostgreSQL 15 Documentation – SQL Language: Triggers and Transactions** (0.0 min) — Computação
   - Fonte: https://www.postgresql.org/docs/15/sql-commands.html
   - A documentação oficial do PostgreSQL é uma das melhores fontes para aprender a sintaxe exata, regras de uso e nuances de comportamento de transações…
5. **O que é e Como Criar uma Procedure no PostgreSQL?** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=w5a_eL591GM
   - O vídeo intitulado O que é e Como Criar uma Procedure no PostgreSQL? [https://www.youtube.com/watch?v=w5a_eL591GM] apresenta uma introdução prática à…
6. **Procedimentos Armazenados e Sobrecarga de Função - PostgreSQL** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=rVEfMDOAbzI
   - O vídeo [https://www.youtube.com/watch?v=rVEfMDOAbzI] apresenta os conceitos fundamentais de procedimentos armazenados, demonstrando como criar e…
7. **PL/pgSQL — SQL Procedural Language** (0.0 min) — Computação
   - Fonte: https://www.postgresql.org/docs/15/plpgsql.html
   - O link Chapter 43. PL/pgSQL — SQL Procedural Language [https://www.postgresql.org/docs/15/plpgsql.html] direciona para o capítulo da documentação…
8. **Vídeo 2: k-Means-Clustering visualized (by Valinor)** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=DQTz7yVmz_g
   - Assista à videoaula "k-means clustering visualized", elaborada por Valinor. Este vídeo mostra que K-means é um algoritmo de agrupamento em…
9. **Vídeo 1: k-means clustering (by TileStats)** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=4E_DFMt60rc
   - Assista à videoaula "k-means clustering", elaborada por TileStats. Este vídeo explica: (1) Como o método funciona, (2) como calcular a soma dos…
10. **Desafio 02: Medidas de proximidade e KNN** (0.0 min) — Matemática e Física
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9788522128303/pageid/616
   - Atividade a ser desenvolvida na instrução.

## Template Para Preenchimento
---

# Aula 14 - TÓPICOS DE BD: TRANSACTIONS E TRIGGERS

## 1. Visão RM-ODP Trabalhada
- [ ] Enterprise / Information / Computational / Engineering / Technology

## 2. Requisitos Funcionais (RF)
| ID  | Descrição                          | Status        |
|-----|------------------------------------|---------------|
| RF001 | ...                              | Implementado  |

## 3. Requisitos Não Funcionais (8 eixos)
| Eixo | Requisito | Como atendido |
|------|-----------|---------------|
| Usabilidade | ... | ... |
| Confiabilidade | ... | ... |
| Desempenho | ... | ... |
| Suportabilidade | ... | ... |
| Segurança | ... | ... |
| Capacidade | ... | ... |
| Restrições de Design | ... | ... |
| Organizacionais | ... | ... |

## 4. Artefatos de Modelagem
- [ ] Link/nome do artefato (ER, DER, Classes, Sequência, etc.)

## 5. Rastreabilidade
- RN01 → RF001 → Teste001 → Evidência
- ...

## 6. Evidências
- [ ] Screenshots, logs de teste, prints de execução
