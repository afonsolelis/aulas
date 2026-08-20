# Aula 12 - BANCO DE DADOS III - JOINS

## Descrição da Aula
Sustentação do design computacional algorítmico do sistema. Transforma propriedades atômicas do negócio em diagramas isolados comportamentais, empregando formalmente a técnica TDD para aprovação axiomática das classes.
---
*Visão RM-ODP:* Computational (início)
*RF:* Detalhar pré-condições, fluxo principal, validações
*RNF (8 eixos):* Usabilidade (mensagens) + Segurança (validação entrada)
*Artefato:* Sequência + Atividade/Estado + TDD iniciado
### Onde queremos chegar
- [ ] Diagrama de Sequência (fluxo de sucesso)
- [ ] Diagrama de Atividades ou Estados para fluxo relevante
- [ ] 1 teste…

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

1. **Como sair do zero em Node.js em apenas uma aula** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=hHM-hr9q4mo
   - O que você precisa saber para criar a sua primeira aplicação em Node.js? Este vídeo te mostra todos os passos para sair do zero e começar a dominar…
2. **Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl** (0.0 min) — Computação
   - Fonte: https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
   - Artigo do Martin Fowler sobre como fazer Spec Driven Development
3. **TDD, Where Did It All Go Wrong** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=EZ05e7EMOLM
   - Crítica analítica indispensável onde demonstra-se estruturalmente como a obsessão metodológica via Mock Integration desequilibra a Teoria de Coesão…
4. **Test-Driven Development** (0.0 min) — Computação
   - Fonte: https://www.jamesshore.com/v2/books/aoad2/test-driven_development
   - A fundação epistemológica na automação construtiva de software. Aborda táticas iterativas rigorosas que mitigam estado computacional imprevisível,…
5. **SWEBOK v4: Capítulo 2 (Structural and Behavioral Design)** (0.0 min) — Computação
   - Fonte: https://github.com/joaopauloaramuni/projeto-de-software/blob/main/SWEBOK/swebok-v4.pdf
   - Formaliza axiomas de encapsulamento da OOP que possibilitam a aplicação das premissas comportamentais visuais unificadas pela UML.
6. **Livro Didático — Teste de Unidade** (0.0 min) — Computação
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9788550816043/pageid/154
   - Este capítulo apresenta as práticas essenciais de teste de unidade segundo Robert C. Martin, incluindo: escrever testes antes do código de produção…
7. **Back-End I - Node.js, Models e Controllers** (0.0 min) — Computação
   - Fonte: https://afonsolelis.github.io/aulas/pages/module-2-common/materials/lesson-5-material.html
   - Organização do backend em Node.js com separação de responsabilidades entre rotas, controllers e acesso a dados.
8. **O que é Node JS?** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=8VSTrZY8vwI
   - O que é o Node.JS? Para que é usado? NodeJS vs. Javascript? O que é NPM? O que é o package.json? Como instalar e quais são os comandos básicos?…
9. **Como elaborar uma pesquisa de mercado** (0.0 min) — Negócios
   - Fonte: https://sebrae.com.br/Sebrae/Portal%20Sebrae/UFs/MG/Sebrae%20de%20A%20a%20Z/Como%2BElaborar%2Buma%2BPesquisa%2Bde%2BMercado.pdf
   - Leitura das páginas 14 à 36. Nesta material, abordaremos os passos essenciais para elaborar uma pesquisa de mercado eficaz, desde a definição do…
10. **Tipos de Entrevista: Estruturada, Semiestruturada e Não estruturada** (0.0 min) — Negócios
   - Fonte: https://www.youtube.com/watch?v=wuIKfjvH6SM
   - Tipos de entrevistas que podem ser realizadas para pesquisa qualitativa
11. **Fontes de Pesquisa: 9 categorias para produzir conteúdos relevantes** (0.0 min) — Negócios
   - Fonte: https://webestrategica.com.br/fontes-de-pesquisa-9-categorias/
   - Texto que sugere diversas fontes de informação e dados para a realização de pesquisas secundárias de mercado.
12. **Perguntas de questionários para pesquisa de mercado – com exemplos** (0.0 min) — Negócios
   - Fonte: https://neilpatel.com/blog/survey-questions-that-work/
   - Texto que aborda os principais passos para elaboração de um bom questionário de pesquisa online, com sugestão de diversas boas práticas.
13. **Opcional: Lista de exercícios sobre proposições matemáticas e lógica proposicional** (0.0 min) — Matemática e Física
   - Fonte: https://discrete.openmathbooks.org/dmoi3/
   - Para complementar seus estudos, recomendamos os seguintes exercícios:
Livro: "LEVIN, Oscar. Discrete Mathematics: An Open Introduction, 3rd edition."…
14. **Opcional: Lógica proposicional - videoaula** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=THieoMyTrLs
   - Videoaula "Fundamentos Matemáticos da Computação - Aula 02 - Lógica proposicional", preparada pela Universidade Virtual do Estado de São Paulo…
15. **Proposições matemáticas e lógica proposicional - livro** (0.0 min) — Matemática e Física
   - Fonte: https://discrete.openmathbooks.org/dmoi3/
   - Ler as seções 0.2 (Mathematical Statements) e 3.1 (Propositional Logic) do livro "LEVIN, Oscar. Discrete Mathematics: An Open Introduction, 3rd…
16. **Desafio de Matemática 1** (0.0 min) — Matemática e Física
   - Fonte: https://
   - Desafio no ateliê, a respeito do assunto estudado na semana anterior. São atividades individuais no papel, sem consulta, realizadas no início do…
17. **Tutorial SQL** (0.0 min) — Computação
   - Fonte: https://www.devmedia.com.br/tutorial-sql/2973
   - Vamos recapitular o SQL? Neste artigo você terá a oportunidade de reconhecer diversas práticas SQL para execução de consultas e subconsultas.
18. **SQL for beginners: how to get started with JOINS** (0.0 min) — Computação
   - Fonte: https://youtu.be/F7gjdDaKnrI
   - IMPORTANTE: vídeo em inglês. Ative as legendas automáticas se necessário.
Este vídeo traz uma explicação detalhada de como usar "joins" em SQL, que é…
19. **Entendendo chave primária e estrangeira nos bancos de dados** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=FPNvKqGHe0A&list=PL5TJqBvpXQv5n1N15kcK1m9oKJm_cv-m6&index=9
   - "Aprender sobre o conceito de chaves no contexto de banco de dados é essencial para dominar a implementação de JOINS em SQL. Assista ao vídeo para…
20. **Trabalhando com várias tabelas em bancos de dados** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=htOWhMc5N5M&list=PL5TJqBvpXQv5n1N15kcK1m9oKJm_cv-m6&index=7
   - "Assista ao vídeo para aprender por que bancos de dados relacionais armazenam dados em várias tabelas, quais são as propriedades dos banco de dados…
21. **Consultas em SQL - Parte II** (0.0 min) — Computação
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9788502200463/pageid/61
   - "Leia o capítulo 2 da página 101 até 117. Neste autoestudo você seguirá lendo o livro e irá aprender a implementar consultas SQL mais…
22. **Livro Didático — Requisitos de Alto Nível** (0.0 min) — Computação
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9788595153653/epubcfi/6/22[%3Bvnd.vst.idref%3DaB9788535279849500091]!/4/2/8/10/2/38/2[f15]/2%4051:48
   - O Capítulo 3 aborda a elicitação e documentação de requisitos de alto nível, incluindo a definição de atores, casos de uso e o diagrama de casos de…
23. **Banco de Dados III - Joins** (0.0 min) — Computação
   - Fonte: https://afonsolelis.github.io/aulas/pages/module-2-common/materials/lesson-4-material.html
   - Uso de joins, filtros e agregações para responder perguntas do sistema a partir de múltiplas tabelas relacionadas.

## Template Para Preenchimento
---

# Aula 12 - BANCO DE DADOS III - JOINS

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
