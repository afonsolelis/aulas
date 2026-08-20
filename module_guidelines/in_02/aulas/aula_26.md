# Aula 26 - TESTES E AUTOMAÇÃO

## Descrição da Aula
Descrição da Aula
Metodologia pesada sobre reengenharia arquitetural contínua via refatorações estatísticas. Mitigação formal em Débitos Técnicos usando abordagens rigorosas de isolamento sintático profundo por simulação estrutural (Mocks rigorosos).
---
*Visão RM-ODP:* Computational + Engineering (qualidade)
*RF:* Confirmar rastreabilidade após refatorações
*RNF (8 eixos):* Suportabilidade (legibilidade, manutenção)
*Artefato:* Suite Jest refatorada + RTM atualizado + revisão dos fluxos críticos com autenticação/autorização
### Onde queremos chegar
- [ ] Identificar duplicações, lacunas,…

---
**Visão RM-ODP:** Engineering + Technology
**Eixo:** Computação
**Assuntos:** Planejamento de testes
,Testes unitários
,Abordagens de testes de software
**Sprint:** 4

### Onde queremos chegar
- [ ] Compreender os conceitos centrais da aula
- [ ] Relacionar o conteúdo ao projeto em andamento
- [ ] Identificar requisitos funcionais e não funcionais relevantes
- [ ] Aplicar o vocabulário técnico no contexto do projeto

---

## Auto Estudo Recomendado
**Tempo Estimado Total:** 120 min

1. **Um Modelo de Negócios descreve a lógica de criação, entrega e captura de valor por parte de uma organização** (0.0 min) — Negócios
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9786555204605/pageid/22
   - Esse capítulo apresenta como um Modelo de Negócios pode ser descrito de forma mais completa por meio de nove componentes básicos, que revelam a…
2. **Jane Chen: Um abraço caloroso que salva vidas** (0.0 min) — Negócios
   - Fonte: https://www.youtube.com/watch?v=IwidCkCmWg4 e t=16s
   - Jane Chen, um TED Fellow, demonstra em sua palestra uma inovação que tem potencial para salvar milhões de bebês prematuros em países em…
3. **Opcional: Lista de exercícios sobre definições de grafos, árvores, coloração de grafos, caminhos e circuitos.** (0.0 min) — Matemática e Física
   - Fonte: https://discrete.openmathbooks.org/dmoi3/
   - Para complementar seus estudos, recomendamos os seguintes exercícios:
Livro: "LEVIN, Oscar. Discrete Mathematics: An Open Introduction, 3rd edition."…
4. **Opcional: Caminhos e ciclos eulerianos e hamiltonianos - videoaula** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=YWQQ-7U0PzU
   - Videoaula "Pesquisa Operacional II - Aula 26 - Caminhos e ciclos Euleriano e Hamiltoniano.", preparada pela Universidade Virtual do Estado de São…
5. **Opcional: Representação de grafos - videoaula** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=9m8wDGYWlXA&list=PLxI8Can9yAHf8k8LrUePyj0y3lLpigGcl&index=6
   - Videoaula "Estrutura de Dados - Aula 24 - Grafos - Representação.", preparada pela Universidade Virtual do Estado de São Paulo (UNIVESP). Assista ao…
6. **Opcional: Conceitos básicos de grafos - videoaula** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=MC0u4f334mI&list=PLxI8Can9yAHf8k8LrUePyj0y3lLpigGcl&index=7
   - Videoaula "Estrutura de Dados - Aula 23 - Grafos - Conceitos básicos.", preparada pela Universidade Virtual do Estado de São Paulo (UNIVESP). Assista…
7. **Grafos, árvores, coloração de grafos, caminhos e circuitos - livro** (0.0 min) — Matemática e Física
   - Fonte: https://discrete.openmathbooks.org/dmoi3/
   - Ler as seções 4.1 (Definitions), 4.2 (Trees), 4.4 (Coloring) e 4.5 (Euler Paths and Circuits) do livro "LEVIN, Oscar. Discrete Mathematics: An Open…
8. **Desafio de Matemática 5** (0.0 min) — Matemática e Física
   - Fonte: https://
   - Desafio no ateliê, a respeito do assunto estudado na semana anterior. São atividades individuais no papel, sem consulta, realizadas no início do…
9. **Acessibilidade Web: Custo ou Benefício** (0.0 min) — User Experience
   - Fonte: https://www.youtube.com/watch?v=hFI4CuxQjSA
   - O vídeo sobre acessibilidade web explora os desafios enfrentados por pessoas com deficiências ao navegar em páginas web. Inicialmente, destaca-se os…
10. **WCAG** (0.0 min) — User Experience
   - Fonte: https://guia-wcag.com/
   - A WCAG (Web Content Accessibility Guidelines) é um conjunto de recomendações desenvolvidas com o objetivo de tornar o conteúdo da web mais acessível…
11. **Acessibilidade** (0.0 min) — User Experience
   - Fonte: https://www.youtube.com/watch?v=J_w_8bf0Qac
   - As Diretrizes de Acessibilidade para o Conteúdo da Web (WCAG) são parte de uma série de recomendações para acessibilidade para a web publicadas pela…
12. **As 10 Heurísticas de Usabilidade em Quadrinhos** (0.0 min) — User Experience
   - Fonte: https://www.uxtigers.com/post/heuristics-cartoons
   - As 10 heurísticas de usabilidade são apresentadas neste material em formato de quadrinhos, tornando os conceitos mais visuais e fáceis de…
13. **Heurísticas de Nielsen** (0.0 min) — User Experience
   - Fonte: https://www.nngroup.com/articles/ten-usability-heuristics/
   - As Heurísticas de Nielsen são como um conjunto de lentes com diferentes pontos focais, que você usa para observar e identificar problemas distintos…
14. **Usabilidade por Jakob Nielsen** (0.0 min) — User Experience
   - Fonte: https://www.nngroup.com/articles/usability-101-introduction-to-usability/
   - Este material traz um dos artigos mais famosos da área de UX e IHC sobre Usabilidade. Leia-o apenas se quiser ter o contato direto com o material que…
15. **Introdução ao desenvolvimento guiado por testes (TDD)** (0.0 min) — Computação
   - Fonte: https://dev.to/thalimarra/introducao-ao-desenvolvimento-guiado-por-testes-tdd-42ed
   - O Test-Driven Development (TDD), ou Desenvolvimento Guiado por Testes, é uma abordagem de desenvolvimento de software que se baseia em um ciclo curto…
16. **Teste unitário com Jest** (0.0 min) — Computação
   - Fonte: https://www.devmedia.com.br/teste-unitario-com-jest/41234
   - Jest é um framework de teste unitário de código aberto em JavaScript criado pelo Facebook a partir do framework Jasmine. Jest é uma das ferramentas…
17. **Testes 3A** (0.0 min) — Computação
   - Fonte: https://blog.devgenius.io/the-three-as-of-unit-testing-3b8b4bf0d087
   - O padrão Arrange, Act, e Assert (AAA) é uma abordagem amplamente utilizada para estruturar testes unitários no Javascript e em outras linguagens de…
18. **Planejamento de testes** (0.0 min) — Computação
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9786558040118/epubcfi/6/60[%3Bvnd.vst.idref%3DC19.xhtml]!/4[PRESSMAN_Completo-26]
   - Leia o Capítulo 19. Este texto discorre sobre o que deve ser levado em conta no planejamento de testes, para que os procedimentos, metas, atributos e…
19. **Revisões de teste de software** (0.0 min) — Computação
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9786558040118/epubcfi/6/54[%3Bvnd.vst.idref%3DC16.xhtml]!/4[PRESSMAN_Completo-23]/2/74/2/2%4052:52
   - Leia o capítulo 16. Este texto apresenta a importância de revisões de software para revelar erros e defeitos (que podem chegar a ser eliminados a…
20. **Qualidade de Software** (0.0 min) — Computação
   - Fonte: https://integrada.minhabiblioteca.com.br/reader/books/9786558040118/epubcfi/6/52[%3Bvnd.vst.idref%3DC15.xhtml]!/4[PRESSMAN_Completo-22]
   - Leia o Capítulo 15. Este texto traz conceitos fundamentais de Qualidade de Software, um conhecimento importante para você começar a se habituar às…
21. **Integrated Tests Are A Scam** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=VD51AkG8EZw
   - Exposição acadêmica profunda e provocadora delineando o problema exponencial das regressões não cobertas (explosão combinatória sintática), advogando…
22. **Mocks Aren't Stubs** (0.0 min) — Computação
   - Fonte: https://martinfowler.com/articles/mocksArentStubs.html
   - Documento seminal e definidor isolando conceitualmente nas ciências e engenharias as divergentes intenções matemáticas e computatórias de…
23. **SWEBOK v4: Capítulo 4 (Test Adequacy & Refactoring)** (0.0 min) — Computação
   - Fonte: https://github.com/joaopauloaramuni/projeto-de-software/blob/main/SWEBOK/swebok-v4.pdf
   - Formalização imperativa sobre instrumentações de engenharia reversa para debelar acúmulo de Débitos Técnicos garantindo refatoramento apoiado em…
24. **Testes e Automação** (0.0 min) — Computação
   - Fonte: https://afonsolelis.github.io/aulas/pages/module-2-common/materials/lesson-10-material.html
   - Introdução aos tipos de teste em aplicações web, priorização de automação e produção de evidências de validação.

## Template Para Preenchimento
---

# Aula 26 - TESTES E AUTOMAÇÃO

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
