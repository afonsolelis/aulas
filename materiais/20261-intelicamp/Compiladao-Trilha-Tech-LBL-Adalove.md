# Compiladão — Inteli Camp · Trilha Tech

**Bootcamp de Inverno · Julho 2026 — para o LBL e os cards da Adalove**

Fio condutor: da **spec** ao **pitch** de uma solução de IA em 5 dias, sobre o case da
**Azul Linhas Aéreas** — um **agente de IA para o processo seletivo**, que analisa os dados
das entrevistas e organiza um **funil de seleção de candidatos**. Metodologia **PBL +
Metodologia Ativa**: nos 3 primeiros dias, cada conceito é seguido de um **sprint de 30 min**
(cronômetro rodando) em que o grupo produz o entregável na hora.

> ⚠️ **Atenção antes de publicar:** o LBL atual (planilha do repo) ainda está na edição
> antiga — case **Mars/Snickers** e **geração de imagens**. O conteúdo abaixo é a
> **substituição** da coluna Tech: case **Azul**, **agente de IA no processo seletivo**,
> eixo spec → prompt → teste → sprint → pitch.

Cada card abaixo já está no formato dos campos do LBL — *Título / Duração / Tipo /
Descrição / Planejamento (Metodologia Ativa) / Conteúdos / Entregável* — que são os
mesmos campos que viram card na Adalove.

---

## Briefing do case (cabeçalho para os cards)

| Campo | Conteúdo |
|-------|----------|
| **Parceiro** | Azul Linhas Aéreas |
| **Contexto** | Companhia aérea brasileira com processos recorrentes de recrutamento e seleção para diversas vagas |
| **Problema** | Criar um agente de IA que apoie o processo seletivo da Azul — analisando os dados das entrevistas e organizando um funil de seleção de candidatos segundo os critérios de avaliação da empresa |
| **Output da solução** | Classificação e resumo dos candidatos ao longo das etapas do funil de seleção, apoiando a decisão do time de RH |
| **Público-alvo** | Recrutadores e o time de RH da Azul responsáveis pela seleção de candidatos |

**Trilha & ferramentas:**

- **Plataforma:** Lovable (app, agente e publicação por link)
- **Integração:** APIs de IA, regra de negócio e testes
- **IA:** engenharia de prompts parametrizável
- **Método:** PBL, dailies e kanban em time multidisciplinar
- **Materiais prontos por dia:** slides + material em **PT** e **EN** (linkáveis nos cards) — ver `pages/home-inteli-camp.html`
- **Referências (versão leve):** SWEBOK 4.0 e ISO/IEC 25010; ao longo da trilha, **IA responsável** (viés e LGPD) como fio condutor de um agente que avalia pessoas.

---

## Visão dos 5 dias

| Dia | Título | Tipo | Entregável do dia |
|-----|--------|------|-------------------|
| 1 · Seg | Spec & Modelagem do Problema | Instrução + Sprint 30 min | Spec validada (ator/entrada/saída/restrições/critério de aceite) |
| 2 · Ter | Prompts a partir da Modelagem | Instrução + Sprint 30 min | Prompt estruturado testado com 3 entradas |
| 3 · Qua | Refino de Prompts & Testes | Visita técnica (manhã) + Sprint 30 min (tarde) | Tabela de testes preenchida + prompt robusto |
| 4 · Qui | Sprint de Desenvolvimento | Desenvolvimento | MVP funcional publicado por link (até 16h) |
| 5 · Sex | Apresentações | Apresentação | Pitch de 10 min à banca com demo ao vivo |

---

## DIA 1 — SEGUNDA · Spec & Modelagem do Problema

### Card 1.1 — Abertura, contextualização e as 5 visões

- **Duração:** ~1h30
- **Tipo:** Instrução
- **Descrição:** Apresentação do desafio da edição (Azul — agente de IA para o processo seletivo), da metodologia PBL do Inteli Camp e da dinâmica de sprints. Inclui o slide de apresentação do professor.
- **Planejamento (Metodologia Ativa):** Expor por que uma spec vem antes do código — o ciclo mais caro é construir, descobrir que estava errado e reconstruir. Introduzir, em versão leve, o SWEBOK 4.0 (mapa do conhecimento) e a ISO/IEC 25010 (régua de qualidade).
- **Conteúdos:** o que é uma spec e por que existe; a tradução da necessidade do parceiro nas **5 visões** — Business Drivers (por quê) → Requisitos Funcionais (o quê) → Requisitos Não Funcionais (quão bem, ISO/IEC 25010) → Arquitetura (como) → Tecnologia (com o quê, o Lovable); decomposição do problema (ator, entrada, saída, restrições); critério de aceite.

### Card 1.2 — Atividade em grupo: escrever a spec ⏱️ *sprint 30 min*

- **Duração:** 30 min
- **Tipo:** Metodologia Ativa (atividade em grupo)
- **Descrição:** Com o cronômetro rodando, cada grupo preenche o template da spec, um campo de cada vez, com o briefing do parceiro em mãos.
- **Planejamento (Metodologia Ativa):** Antes do computador, desenhar o fluxo no papel (ator → entrada → IA → saída). O professor circula validando grupo a grupo.
- **Conteúdos (os 6 campos da spec):** problema central · ator principal · entrada · saída · restrições · critério de aceite.
- **Entregável:** **Spec do grupo validada pelo professor**, com o problema decomposto e um critério de aceite objetivo.

---

## DIA 2 — TERÇA · Prompts a partir da Modelagem

### Card 2.1 — Anatomia de um bom prompt

- **Duração:** ~1h
- **Tipo:** Instrução
- **Descrição:** Traduzir cada parte da spec em instrução para a IA — o mapa spec → prompt.
- **Conteúdos:** as **6 partes** do prompt (papel · contexto · tarefa · formato de saída · restrições · exemplos); **saída estruturada** (tabela/JSON para o funil); **calibração com exemplos** (few-shot); **IA responsável** (viés, privacidade/LGPD, decisão humana); parâmetros como campos de formulário no Lovable; falhas comuns e correções.

### Card 2.2 — Atividade em grupo: escrever e testar o prompt ⏱️ *sprint 30 min*

- **Duração:** 30 min
- **Tipo:** Metodologia Ativa (atividade em grupo)
- **Descrição:** Escrever a primeira versão do prompt principal e rodar o ciclo de iteração.
- **Planejamento (Metodologia Ativa):** Ciclo — escrever → testar com 3 entradas → comparar com o critério de aceite → identificar a parte que desviou → ajustar só ela → repetir.
- **Entregável:** **Prompt principal testado com pelo menos 3 variações de entrada**, com saída estruturada validada contra o critério de aceite e parâmetros de controle identificados.

---

## DIA 3 — QUARTA · Refino de Prompts & Testes

### Card 3.1 — Visita Técnica ao parceiro

- **Duração:** Manhã
- **Tipo:** Visita / campo
- **Descrição:** Levar a spec e confirmar/corrigir as premissas do Dia 1 no processo real de seleção da Azul.
- **Planejamento:** Observar como a triagem de candidatos acontece na prática, quais critérios o time de RH usa e como pesam entre si, e que dados de entrevista existem e em que formato chegam ao recrutador. Ao voltar: revisar a spec e os critérios de avaliação e ajustar o prompt conforme o contexto real exigir.

### Card 3.2 — Atividade em grupo: testar o prompt nos extremos ⏱️ *sprint 30 min*

- **Duração:** 30 min (tarde)
- **Tipo:** Metodologia Ativa (atividade em grupo)
- **Descrição:** Sair do caso feliz e tornar o prompt de triagem robusto, preenchendo a tabela de testes.
- **Conteúdos:** onde os prompts de triagem quebram (entrevista incompleta, pedido fora do escopo, entrada maliciosa/prompt injection, **atributo protegido** — idade/gênero/origem, volume); cada teste comprova um requisito não funcional/característica da ISO/IEC 25010 (confiabilidade, segurança, adequação funcional); tratamento de falhas. Princípio: *um prompt robusto falha de forma previsível*.
- **Entregável:** **Tabela de testes preenchida** (entrada → esperado → obtido → ✓/✗), incluindo um caso de viés/LGPD, e prompt ajustado.

---

## DIA 4 — QUINTA · Sprint de Desenvolvimento

### Card 4.1 — Sprint do MVP no Lovable

- **Tipo:** Desenvolvimento
- **Blocos:**
  - 09:30–11:00 — Instrução e alinhamento de escopo
  - 11:00–12:00 — 1º bloco
  - 13:30–15:00 — 2º bloco
  - 15:10–16:00 — 3º bloco
- **Planejamento:** Kanban simples (A fazer / Fazendo / Feito), com a regra de no máximo uma tarefa em "Fazendo" por pessoa. Construir e publicar a solução no **Lovable** (formulário de dados da entrevista → prompt que classifica o candidato pelos critérios da spec → classificação/resumo no funil).
- **Checkpoints:** até 12h interface de entrada + parâmetros mapeados; até 15h prompt integrado gerando a classificação na tela; até 16h publicado no Lovable e testado contra o critério.
- **Chamar o professor quando:** mais de 30 min no mesmo problema; discussão longa sem ninguém desenvolvendo; output inconsistente sem explicação.
- **Entregável:** **MVP funcional ponta a ponta** (dados da entrevista → prompt → classificação correta), atendendo ao critério de aceite, **sem reproduzir viés** e tratando os dados conforme a LGPD, **publicado por link acessível externamente**.

---

## DIA 5 — SEXTA · Apresentações

### Card 5.1 — Alinhamento e ensaio

- **Duração:** 09:00–12:00 (alinhamento 09:00–09:40; desenvolvimento final e ensaio 09:40–12:00)
- **Tipo:** Preparação

### Card 5.2 — Apresentações à banca

- **Duração:** Tarde
- **Tipo:** Apresentação
- **Programação:** 13:00–13:30 abertura institucional e banca; 13:30–15:30 apresentações (10 min/grupo); 15:30–16:00 apuração, certificados e encerramento.
- **Roteiro do pitch (10 min):** 2' problema e contexto · 3' demo ao vivo (com plano B) · 2' como funciona o prompt · 2' resultado vs. critério de aceite · 1' mitigação de viés e conformidade com a LGPD.
- **Critérios da banca:** compreensão do problema · solução funcional · qualidade do prompt · **mitigação de viés e conformidade com a LGPD** · clareza da apresentação.
- **Entregável:** **Pitch de 10 min com demo ao vivo** provando que o output atende ao critério de aceite da spec.

---

*Material do professor Afonso Brandão para o Inteli. Case parametrizável em `config/inteli-camp-case.js`.*
