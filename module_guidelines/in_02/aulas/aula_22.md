# Aula 22 - FRONT-END 2 - JAVASCRIPT, CHAMADAS ASSÍNCRONAS E REDES

## Descrição da Aula
Descrição da Aula
Exposição pragmática da dimensionalidade assíncrona da máquina virtual Javascript (V8), lidando com Event Loops contínuos na resolução temporal de chamadas assíncronas e controle estrito da latência algorítmica de rede.
---
*Visão RM-ODP:* Engineering (comunicação)
*RF:* Refinar fluxos dinâmicos (cenários principais e alternativos)
*RNF (8 eixos):* Confiabilidade (retry/timeout) + Desempenho (latência)
*Artefato:* Integração assíncrona + Documentação de contratos
### Onde queremos chegar
- [ ] Chamadas assíncronas implementadas
- [ ] Estados: carregamento, sucesso, erro
- […

---
**Visão RM-ODP:** Engineering + Technology
**Eixo:** Computação
**Assuntos:** —
**Sprint:** 4

### Onde queremos chegar
- [ ] Compreender os conceitos centrais da aula
- [ ] Relacionar o conteúdo ao projeto em andamento
- [ ] Identificar requisitos funcionais e não funcionais relevantes
- [ ] Aplicar o vocabulário técnico no contexto do projeto

---

## Auto Estudo Recomendado
**Tempo Estimado Total:** 120 min

1. **Opcional: Lista de exercícios sobre integração numérica** (0.0 min) — Matemática e Física
   - Fonte: https://integrada.minhabiblioteca.com.br/books/9788582603857
   - Para complementar seus estudos, recomendamos os seguintes exercícios:
Livro: "DORNELLES FILHO, Adalberto Ayjara. Fundamentos de cálculo numérico. São…
2. **Opcional: Lista de exercícios sobre zeros de funções reais** (0.0 min) — Matemática e Física
   - Fonte: https://integrada.minhabiblioteca.com.br/books/9788582603857
   - Para complementar seus estudos, recomendamos os seguintes exercícios:
Livro: "DORNELLES FILHO, Adalberto Ayjara. Fundamentos de cálculo numérico. São…
3. **Opcional: Integração numérica por Newton-Cotes (Regra de Simpson) - Videoaula** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=la-F_w5v2t0
   - Videoaula "Métodos Numéricos - Aula 27 - Integração numérica" preparada pela Universidade Virtual do Estado de São Paulo (UNIVESP). Assista ao vídeo…
4. **Opcional: Integração numérica por Newton-Cotes (Regra dos Trapézios) - Videoaula** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=oCoRt4p717M
   - Videoaula "Métodos Numéricos - Aula 26 - Integração numéric" preparada pela Universidade Virtual do Estado de São Paulo (UNIVESP). Assista ao vídeo…
5. **Opcional: Abordagem geral sobre Integração numérica - Videoaula** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=DJjr6t8nKaE
   - Videoaula "Métodos Numéricos - Aula 25 - Integração numérica" preparada pela Universidade Virtual do Estado de São Paulo (UNIVESP). Assista ao vídeo…
6. **Opcional: Método de Newton-Raphson para zeros de funções reais - Videoaula** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=TvQJFWf0Qww
   - Videoaula "Métodos Numéricos - Aula 08 - Zero de funções reais" preparada pela Universidade Virtual do Estado de São Paulo (UNIVESP). Assista ao…
7. **Opcional: Abordagem geral sobre zeros de funções reais - Videoaula** (0.0 min) — Matemática e Física
   - Fonte: https://www.youtube.com/watch?v=8al9UeWF8j4
   - Videoaula "Métodos Numéricos - Aula 05 - Zeros de funções reais" preparada pela Universidade Virtual do Estado de São Paulo (UNIVESP). Assista ao…
8. **Integração numérica - Livro** (0.0 min) — Matemática e Física
   - Fonte: https://integrada.minhabiblioteca.com.br/books/9788582603857
   - Ler as seções 7.1 (pág. 119) e 7.2 (pág. 119 à 125) do livro: "DORNELLES FILHO, Adalberto Ayjara. Fundamentos de cálculo numérico. São Paulo:…
9. **Zeros de funções reais - Livro** (0.0 min) — Matemática e Física
   - Fonte: https://integrada.minhabiblioteca.com.br/books/9788582603857
   - Ler as seções 3.1 (pág. 43 e 44), 3.2 (pág. 44 à 47) e (pág. 47 à 50) e do livro: "DORNELLES FILHO, Adalberto Ayjara. Fundamentos de cálculo…
10. **Desafio de Matemática 4** (0.0 min) — Matemática e Física
   - Fonte: https://
   - Desafio no ateliê, a respeito do assunto estudado na semana anterior. São atividades individuais no papel, sem consulta, realizadas no início do…
11. **Ponderada de Programação III** (0.0 min) — Computação
   - Fonte: https://www.inteli.edu.br/
   - O projeto está integrado: backend rodando, frontend conectado, testes Jest escritos. Esta ponderada é o fechamento documental — você vai construir o…
12. **Formulários e rotas** (0.0 min) — Computação
   - Fonte: https://cobalt-blarney-8b3.notion.site/Formul-rios-e-Rotas-1a4256ceaea780d6af37c3204826dfe9?pvs=74
   - A seguir, você encontrará um tutorial detalhado para criar um formulário de login com verificação de credenciais utilizando Express e EJS. Esse…
13. **Internet Protocol IP** (0.0 min) — Computação
   - Fonte: https://integrada.minhabiblioteca.com.br/#/books/9786556900766
   - Leitura do capítulo "Camada de Internet", páginas 75-88. O protocolo IP é responsável por transferir datagramas entre computadores de redes…
14. **Fundamentos de redes de computadores - protocolos de rede** (0.0 min) — Computação
   - Fonte: https://integrada.minhabiblioteca.com.br/#/books/9788595027138
   - Leia o capítulo ""Protocolos de rede"", páginas 95-107. Protocolos de rede são padrões estabelecidos de envio e recepção de dados entre diferentes…
15. **Requisições assíncronas com Controllers** (0.0 min) — Computação
   - Fonte: https://cobalt-blarney-8b3.notion.site/Requisi-es-Ass-ncronas-Utilizando-Controllers-1a4256ceaea7803399f5e0752b131fdc
   - A seguir, você encontrará um tutorial completo sobre como implementar requisições assíncronas utilizando controllers em uma aplicação Node.js com…
16. **O que é e como funciona a Fetch API** (0.0 min) — Computação
   - Fonte: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   - Este é um dos assuntos mais importantes quando queremos fazer a integração entre o front-end e o back-end de uma aplicação web. O fetch() envolve uma…
17. **What the heck is the event loop anyway?** (0.0 min) — Computação
   - Fonte: https://www.youtube.com/watch?v=8aGhZQkoFbQ
   - Uma dissecação acadêmico-engenheiral brilhante das entranhas do motor V8 em JS, dissecando as Call Stacks, Pilhas, WebAPIs e Job Queues modelando o…
18. **Time, Clocks, and the Ordering of Events in a Distributed System** (0.0 min) — Computação
   - Fonte: https://lamport.azurewebsites.net/pubs/time-clocks.pdf
   - Demonstração física e probabilística onde Lamport prova cientificamente anomalias do tempo na troca distríbuida de pacotes elétricos (como…
19. **SWEBOK v4: Capítulo 2 (Concurrency and Asynchronous Design)** (0.0 min) — Computação
   - Fonte: https://github.com/joaopauloaramuni/projeto-de-software/blob/main/SWEBOK/swebok-v4.pdf
   - Carga teórica base do problema da Assincronicidade frente as transações não-atômicas em comunicações independentes no espaço temporal dos sistemas.
20. **Front-End 2 - JavaScript, Chamadas Assíncronas e Redes** (0.0 min) — Computação
   - Fonte: https://afonsolelis.github.io/aulas/pages/module-2-common/materials/lesson-8-material.html
   - Consumo assíncrono de APIs com promises, async/await, estados de carregamento, timeout e noções de comunicação em rede.

## Template Para Preenchimento
---

# Aula 22 - FRONT-END 2 - JAVASCRIPT, CHAMADAS ASSÍNCRONAS E REDES

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
