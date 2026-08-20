# Aula 11 - ANÁLISE E CARGA DE DADOS

## Descrição da Aula
Nesta aula, você aprenderá como importar, manipular e analisar dados de planilhas Excel utilizando Python no ambiente Jupyter Notebook. O conteúdo abrange desde a instalação das bibliotecas necessárias (como pandas e openpyxl), leitura de arquivos Excel com múltiplas abas, tratamento e filtragem de dados, até a exportação dos resultados para novas planilhas. O foco é apresentar, de forma prática, como integrar Python e Excel para automatizar tarefas de análise de dados, tornando o processo mais eficiente e flexível para projetos se implantação de ERPs.

---
**Visão RM-ODP:** Computational
**Eixo:** Computação
**Assuntos:** —
**Sprint:** 2

### Onde queremos chegar
- [ ] Compreender os conceitos centrais da aula
- [ ] Relacionar o conteúdo ao projeto em andamento
- [ ] Identificar requisitos funcionais e não funcionais relevantes
- [ ] Aplicar o vocabulário técnico no contexto do projeto

---

## Auto Estudo Recomendado
**Tempo Estimado Total:** 120 min

1. **Os 17 Objetivos de Desenvolvimento Sustentável** (0.0 min) — Liderança
   - Fonte: https://brasil.un.org/pt-br/sdgs
   - Você já deve conhecer os ODS (Objetivos de Desenvolvimento Sustentável), não é mesmo? Leia este material pensando em quais desses objetivos mais…
2. **Processos de aprendizagem em equipe de projeto que utiliza a metodologia ágil** (0.0 min) — Liderança
   - Fonte: https://periodicos.uninove.br/gep/article/view/18750
   - Neste artigo, Eduarda Vieira Floriani sintetiza sua pesquisa de mestrado sobre aprendizagem em equipe. Para ela, a metodologia ágil é uma estratégia…
3. **Aprendizagem em equipes** (0.0 min) — Liderança
   - Fonte: https://www.youtube.com/watch?v=8eCnJL1o9GY
   - Em seu famoso livro, A quinta disciplina, Peter Senge descreve 5 disciplinas ou características que as organizações devem ter para terem sucesso.…
4. **Atividade com pontuação desenvolvida em sala** (0.0 min) — Negócios
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9788580551624/pageid/45
   - Haverá atividades solicitadas pelos professores nos ateliês com os alunos presentes, os ausentes não terão essa pontuação computada. Essas atividades…
5. **Margem de lucro a partir de custos** (0.0 min) — Negócios
   - Fonte: https://www.youtube.com/watch?v=_uS9y6MFoqQ&t=6s
   - O objetivo do Autoestudo é compreender a forma de como se calcular a mergeme lucro do negócio a patir do entendimento  de custos.
6. **Análise de custo, volume e lucro: gráficos decisões** (0.0 min) — Negócios
   - Fonte: https://www.youtube.com/watch?v=AEkVAMfo0o8
   - O objetivo do Autoestudo é fazer uma correlação entre custo, volume e lucro e seus principais componentes
7. **Classificação dos gastos** (0.0 min) — Negócios
   - Fonte: https://www.youtube.com/watch?v=6mMgP4Pr2bc
   - O objetivo do Autoestudo é entender as diferenças entre investimento, custos e despesas
8. **Introdução à contabilidade de custos** (0.0 min) — Negócios
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9788522485048/pageid/25
   - O objetivo do Autoestudo é explanar o conceito de custos, sua diferença em relação á despesa e investimento. (pag 11 à 18). 

BORNIA, Antonio C.…
9. **Implementing an SAP Solution** (0.0 min) — Computação
   - Fonte: https://pt.coursera.org/learn/implementing-an-sap-solution
   - Deploy the Technical Solution - Semana 3 (vídeos e leituras recomendadas). Faça este curso ao longo da primeira sprint para entender o passo a passo…
10. **Tipos de Sistemas de Informação** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=N4wGhiuEaxo
   - Sistemas de Informação - Aula 5 - Estrutura organizacional e tipos de sistemas de informação - UNIVESP
11. **O que é ERP?** (0.0 min) — Computação
   - Fonte: https://www.sap.com/brazil/products/erp/what-is-sap-erp.html
   - O texto apresenta conceitos relacionados a ERP, um sistema de software que ajuda empresas a administrar toda a empresa, oferecendo suporte à…
12. **Fundamentos de Sistemas de Informações** (0.0 min) — Computação
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9788553131532/pageid/11
   - SORDI, José Osvaldo de; MEIRELES, Manuel. Administração de sistemas de informação. 2. ed. São Paulo: Saraiva Uni, 2018. 256 p. ISBN 978‑8553131518.…
13. **Exploração de Dados** (0.0 min) — Computação
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9788521638766/epubcfi/6/30[%3Bvnd.vst.idref%3Dpart02]!/4
   - Na exploração dos dados, nós precisamos “conversar com os dados”. Para isso, fazemos perguntas e escutamos as respostas que técnicas de exploração de…
14. **Aprenda TRATAMENTO DE DADOS com PYTHON** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=slv1f2YpMJE
   - Aprenda como fazer tratamento de dados com Python, uma linguagem de programação versátil e poderosa que se tornou a escolha predileta para projetos…
15. **Caso de Estudo: Integração de Dados de Relacionamentos em Sistema ERP** (0.0 min) — Computação
   - Fonte: https://cobalt-blarney-8b3.notion.site/Caso-de-Estudo-Integra-o-de-Dados-de-Relacionamentos-em-Sistema-ERP-253256ceaea7806dbe5bc40057218bd1
   - A InnovaTech Solutions, uma empresa de tecnologia em crescimento, está enfrentando um desafio crítico de integração de dados. O departamento de TI…

## Template Para Preenchimento
---

# Aula 11 - ANÁLISE E CARGA DE DADOS

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
