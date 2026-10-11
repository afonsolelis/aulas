# TODO — Módulo 8 de SI e Módulo 8 de ES (2026-2B) · retomada em outra conta

> Arquivo temporário, fora do git (está em `??`). Apagar quando tudo estiver concluído.
> Atualizado em 11/10/2026. Hoje a primeira aula da SI08 é na **qui 15/10/2026**.
> A memória do projeto já registra que a SI08 é internacional e como ligar autoestudo a encontro
> (`~/.claude/projects/-home-afonsolelis-repos-aulas/memory/modulo-8-si-internacional-ingles.md`).

## Como ler a Adalove (MCP `adalove`)

- Turma **SI08**: `2026-2B-T18`, section `ca6f0b7b8a161da30b78802a2f73280c`.
- Turma **ES08**: `2026-2B-T17`, section `0aaf5f08fd1de128220ef7673e1ceb2d`.
- Lista da turma: `obter_show_informations_sections_userdata {uuid}`. A resposta tem ~190 KB e vai para arquivo; o campo útil é `lbl`.
- Detalhe de uma atividade: `obter_activities_section {uuid, sectionUuid}`. Traz descrição, enunciado (`study_question`) e rubrica (`study_answer`).
- **Vínculo autoestudo → encontro:** não há campo. Vale a ordem na semana (`activitySort`): o autoestudo pertence ao encontro logo acima, e a ponderada vem por último.
- Só operações de leitura. Qualquer `[altera dados]` exige confirmação do professor.

---

## A. Módulo 8 de SI (`~/repos/aulas`)

### Já feito, ainda SEM commit

- [x] 13 decks em inglês em `pages/module-8-sistemas-informacao/slides/slide-lesson-1..13.html`. Cada um tem capa, daily de 15 min, objetivo e estrutura provisória, slide de self-study (42 autoestudos sem peso, com link, descrição curta e duração) e ficha do encontro.
- [x] `config/encontros.json`: 13 fichas `module-8-sistemas-informacao#N` com `agenda_provisoria: true`.
- [x] `index.json`: 13 entradas `type: slide`.
- [x] `npm test` passou (1294) e `validate:slides` não apontou overflow nem erro de console nos 13 decks.
- [x] **Commit e push na `main`** (17b064e, 11/10/2026).
  - Os geradores estão no scratchpad da sessão antiga e se perdem. Se precisar regenerar, os dados estão em `~/repos/inteli_si_08/2026-2B/oficial/dados/`.

### Ponderadas em sala (peso 4, confirmadas pela ordem da semana)

| Aula | Data | Ponderada | Prazo |
|---|---|---|---|
| 3 | 22/10 | Architecture Activity | 16h do dia |
| 7 | 27/11 | DataApp Packaging | sexta, que é o próprio dia |
| 9 | 03/12 | DAG and Testing Activity | sexta 04/12 |

### Decisões pendentes do professor

- [ ] Código e data de fim do trimestre novo (a turma abre em 14/10 e a última aula é em 17/12)
- [ ] O que sai de `active_modules`: M7 de SI, M11 de ES e M8 de ES (Aula 1 do PIX, edição 2026-2A)
- [x] Idioma: **inglês**, porque o módulo é internacional. Títulos iguais aos da Adalove.

### Registro no portal

- [ ] `config/calendar.json`: novo `trimester` e entrada `module-8-sistemas-informacao` com as 13 aulas, com `"ponderada": true` nas Aulas 3, 7 e 9
- [ ] Criar `config/module-8-sistemas-informacao.json` (schema em `CLAUDE.md`)
- [ ] `pages/home-module-8-sistemas-informacao.html`: 13 cards com `<small>📅 dd/mm/yyyy</small>`, badge `⚖️ Ponderada em sala` nas Aulas 3, 7 e 9, botões 🎞️ Slides e retirada do aviso "Em construção"
  - O spec `specs-compliance` cobra o mesmo número de 🎞️ Slides e 📝 Material por card. Para isso é preciso criar o material de cada aula (ou um placeholder) **antes** de publicar os cards.
- [ ] `index.json`: atualizar o summary da home
- [ ] `npm test`, commit e push

### Conteúdo das aulas (decks provisórios → aula completa)

- [ ] **Aula 1 (15/10), urgente:** deck completo e material em inglês, com o Data Model Canvas integrado (`pages/module-8-sistemas-informacao/data-model-canvas.html`, que já está publicado)
  - Fonte: `~/repos/aulas_mackenzie/aulas/data_visualization/aula_01_data_discovery_com_metabase/`. A descrição da Adalove pede Metabase, Python 3.12, Docker e MkDocs.
- [ ] Demais aulas: correspondência com o Mackenzie (`aulas_mackenzie/aulas/data_collection_and_storage/`)
  - Aula 4 (ETL Object Storage → DW) ← aula_02 (MinIO) e aula_04 (Parquet, DuckDB, lakehouse)
  - Aulas 5 e 6 (DW, cubos e marts) ← aula_05 (modelagem dimensional) e `data_visualization/aula_04` (OLAP)
  - Aula 9 (testes) ← aula_07 (Pydantic e testes integrados)
  - Aula 12 (pricing) e Aula 13 (segurança) ← `cloud_sre/aula_08`
- [ ] Botão 📖 Material no rodapé dos decks quando os materiais existirem. A ficha injetada sai com o cabeçalho em português ("Sobre este encontro"), porque o script é compartilhado.

### Anomalias da Adalove (corrigir lá)

- "Streamlit Part 5" (Aula 11) aponta para a parte 6
- "Quality criteria for your group's GITHUB repository" (Aula 1) é do prof. José Romualdo
- A listagem da turma e o detalhe do encontro trazem horários diferentes

---

## B. `~/repos/inteli_si_08` (repositório de planejamento, GitLab institucional)

- [x] Retrato do módulo **como está na Adalove** em `2026-2B/oficial/`. A proposta de redesenho (C4, ADR, ATAM) continua intacta nos demais arquivos.
  - `scripts/build_oficial.py` regenera `CRONOGRAMA-OFICIAL.md`, `COMPUTACAO.md` e `ENTREGAS.md` a partir de `oficial/dados/*.json`
  - `oficial/README.md` explica as fontes, o Data Model Canvas e as diferenças em relação à proposta
  - `ROADMAP.md` ganhou um aviso no topo, com link para `oficial/`
- [ ] Commit e push no `inteli_si_08` (remoto `git.inteli.edu.br`), se o professor aprovar. Arquivos: `2026-2B/oficial/`, `scripts/build_oficial.py` e `2026-2B/ROADMAP.md`
- [ ] `scripts/sync_curriculum_page.py` já estava quebrado antes desta sessão: procura `2026-2B/autoestudos/outros-eixos.md`, que nunca foi versionado. Por isso o `index.html` não foi regenerado com o aviso do roadmap. Criar o arquivo ou tirar a entrada do `document_map()`.
- [ ] Na Adalove: "Information Architecture for Analytics Systems" (UX) está na Semana 3 com data de 28/11, um sábado da Semana 7

---

## C. Módulo 8 de ES (`~/repos/aulas`): três aulas do prof. Afonso

Turma `2026-2B-T17`, 32 alunos, orientação da prof. Vanessa. O prof. Reginaldo dá os outros 12 encontros de Computação.

| Aula | Data | Encontro | Ponderada em sala |
|---|---|---|---|
| 1 | ter 27/10 (S3) | Criar cenários que exercitam os atributos de qualidade da arquitetura | Elaboração de cenário de atributo de qualidade (peso 3, grupo, 40 min) |
| 2 | ter 03/11 (S4) | Simulação de desempenho, tolerância a falhas e acesso simultâneo | Simulação de uma rede de filas no JMT, com vídeo de até 5 min (peso 3, 60 min) |
| 3 | qua 04/11 (S4) | As decisões arquiteturais resolvem os defeitos? | — |

### Decisões pendentes do professor

- [ ] Destino da Aula 1 do PIX (18/09, edição 2026-2A), hoje a única aula de `module-8-eng-software` e ativa no `calendar.json`: arquivar ou manter como aula extra?
- [ ] Numeração das aulas novas: 1 a 3 (substituindo) ou 2 a 4 (continuando)?
- [ ] Idioma: português, como no restante do curso e nos títulos da Adalove?

### Pontos de atenção levantados na análise

- A aula de **03/11 (JMT e filas) vem antes** da aula de Teoria das Filas e Redes de Petri do prof. Leandro (qui 05/11). A aula precisa trazer o mínimo de teoria: λ, μ, utilização, tempo de resposta e Lei de Little.
- **URLs corrompidas na Adalove:** em 13 dos 15 autoestudos, o `&` virou ` e `. Os sete links do Philos (livro 14370, que exige login) ficam inutilizáveis. Corrigir na Adalove e usar os links certos nos slides.
- O livro provável é *Software Architecture in Practice* (Bass, Clements e Kazman), 4ª ed., a confirmar. A ponderada de 27/10 cita "3.7 Summary", mas o modelo de cenário em seis partes está na 3.3.
- O caso de Natanz aparece como "falha de sistema", mas é sabotagem. Funciona melhor como cenário de segurança.
- A Semana 4 pesa: ~258 min de autoestudo, a ponderada do JMT e quatro entregas da Sprint 2 ("Simulação do sistema novo", com peso 3, cita JMT, filas e Petri).
- 04/11 cobre disponibilidade, desempenho e segurança. O prof. Reginaldo retoma os mesmos atributos em 11/11 (questionários por tática) e 13/11 (padrões). Combinar com ele o que fica em cada aula.

### Fontes para montar as aulas

| Aula | Fonte | O que aproveitar |
|---|---|---|
| 27/10 cenários e ATAM 2/3 | `aulas_senac/pages/qualidade2/assets/taticas-arquiteturais-len-bass.md` | Catálogo de táticas e cenário de atributo de qualidade como ponte |
| | `aulas_senac/pages/qualidade2/slide_planejamento-casos-teste.html` e o material correspondente | Aula 02: ATAM e planejamento de casos de teste |
| | `aulas_senac/pages/qualidade2/slide_introducao-testes-automatizados.html` e `assets/fluxo-conceitual-atam.svg` | Aula 04: ATAM com IA agêntica, utility tree, riscos, trade-offs e ADR |
| | `inteli_si_08/2026-2B/instrucoes/06-*.md`, `09-atam-e-trade-offs.md` e `autoestudos/ponderada-2-adr-e-cenario-de-qualidade.md` | Texto pronto sobre atributos mensuráveis e ATAM |
| 03/11 simulação (do zero) | `atom/disciplinas/model_based_design/` (unidade 2, Aula 5: malha aberta e fechada; Aula 8: co-simulação) | Ciclo modelo → simulação → validação |
| | `atom/disciplinas/distributed_systems_engineering/` (Aula 4: modelos de falha; Aula 6: CAP e escalabilidade) | Tolerância a falhas e acesso simultâneo |
| | Autoestudos da Adalove: aulas do JMT (JMVA e JSIMgraph), coleta de dados, validação de modelos, exemplo do cabeleireiro | Roteiro da prática no JMT |
| 04/11 táticas e testes não funcionais | `atom/.../distributed_systems_engineering/` (Aula 12: segurança entre serviços; Aula 14: resiliência e engenharia do caos; Aula 16: avaliação arquitetural) | Táticas de disponibilidade e segurança e teste de resiliência |
| | `aulas_mackenzie/aulas/cloud_sre/aula_07_data_reliability_e_sre_aplicados_a_pipelines_de_dados/` | SLO, disponibilidade e confiabilidade |
| | `aulas_senac/pages/qualidade2/slide_testes-carga-jmeter.html` e o material | Teste de carga (desempenho) |
| | `pages/module-8-eng-software/` (Aula 1 do PIX) | ISO 25010, exceções e requisito verificável em Gherkin |

### Execução

- [x] Aulas 2, 3 e 4 publicadas na `main` em 11/10/2026 (0c4412d): deck, material e plano de cada uma, config, calendar (ponderada em 27/10 e 03/11), home, `encontros.json` e `index.json`. `npm test` com 1339 testes passando e `validate:slides` sem overflow.
- [ ] **Confirmar as premissas adotadas** para as três decisões acima: Aula 1 do PIX mantida como edição 2026-2A, aulas novas numeradas de 2 a 4 e escritas em português. Se o professor decidir outra coisa, renumerar arquivos, config, calendar, encontros e index.
- [ ] Conferir os limiares do exemplo que os agentes definiram: no cenário de disponibilidade, detecção em até 10 s e redirecionamento em até 30 s; no de segurança, 3 reservas por conta por minuto e bloqueio de bots em 30 s; no k6, p95 abaixo de 400 ms e falhas abaixo de 1%.
- [ ] Conferir no JMT real o passo a passo da Aula 3 (nomes de telas e o laço de retorno ao banco com p = 5/6).
- [ ] Combinar com o prof. Reginaldo a divisão entre 04/11 e 11/11–13/11 (seção própria no plano da Aula 4).
- [ ] O `trimester` do `calendar.json` continua 2026-2A (encerrado em 05/10). Depende da decisão da SI08 sobre o código do trimestre novo.
