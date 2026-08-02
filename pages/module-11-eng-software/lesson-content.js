(function () {
  const lessons = {
    1: {
      title: 'Spec-Driven Development', date: '04/08/2026', subtitle: 'Especificar antes de implementar: contratos, testes e IA sob controle.',
      objective: 'Escrever uma especificação executável que conecte problema, arquitetura, contrato de API, dados, testes e metas de qualidade.',
      agenda: ['Contexto e motivação', 'Anatomia de uma spec', 'ADR e pipeline de decisão', 'OpenAPI, Gherkin e verificação', 'Desafio prático'],
      sections: [
        ['O problema', 'Começar pelo código transforma ambiguidade em retrabalho. A spec torna explícitos comportamento, limites, decisões e critérios de aceite antes da implementação.'],
        ['Anatomia', 'Uma spec madura contém visão e escopo, requisitos funcionais, requisitos não funcionais, contrato de API, modelo de dados e cenários de teste.'],
        ['ADR', 'Registre o contexto, alternativas, decisão e consequências. A spec descreve o comportamento; o ADR explica por que a arquitetura foi escolhida.'],
        ['Pipeline', 'Problema → processos → arquitetura → esqueleto → spec → TDD → implementação. A IA entra depois que a intenção humana está verificável.'],
        ['Prática', 'Escolha uma funcionalidade, escreva o contrato, crie cenários Gherkin, defina três metas mensuráveis e valide a implementação sem alterar a spec.']
      ],
      deliverable: 'Uma spec Markdown com OpenAPI, modelo de dados, cenários Gherkin, três metas de qualidade e um ADR curto.',
      references: ['ISO/IEC 25010:2023 — Product quality model', 'OpenAPI Specification 3.1', 'Cucumber Gherkin Reference', 'MADR — Markdown Any Decision Records']
    },
    5: {
      title: 'Modelagem de Data Warehouse IV', date: '20/08/2026', subtitle: 'Modelagem dimensional avançada para fatos, histórico e decisões analíticas.',
      objective: 'Projetar um modelo dimensional com grão explícito, dimensões conformadas, fatos aditivos e estratégia de histórico adequada ao negócio.',
      agenda: ['Do processo ao grão', 'Fatos e dimensões avançados', 'SCD e histórico', 'Casos difíceis de modelagem', 'Laboratório dimensional'],
      sections: [
        ['Grão antes da tabela', 'Declare o evento representado por uma linha. Sem grão, métricas misturam níveis, duplicam valores e tornam joins perigosos.'],
        ['Fatos', 'Separe fatos transacionais, snapshots periódicos e snapshots acumulativos. Classifique medidas como aditivas, semi-aditivas ou não aditivas.'],
        ['Dimensões', 'Use dimensões conformadas, chaves substitutas, dimensões degeneradas e dimensões de papel para permitir análise consistente entre processos.'],
        ['SCD', 'Compare SCD 0, 1, 2 e 3. Escolha pelo significado histórico: sobrescrever quando passado não importa; versionar quando a análise precisa reconstruir o contexto.'],
        ['Casos difíceis', 'Trate fatos sem medida, fatos de cobertura, late-arriving dimensions, mudanças retroativas, pontes para cardinalidade muitos-para-muitos e calendário fiscal.'],
        ['Qualidade', 'Teste unicidade da chave, integridade referencial, cobertura temporal, reconciliação com a origem e ausência de dupla contagem.']
      ],
      deliverable: 'Modelo dimensional documentado: grão, fatos, dimensões, SCD escolhido, regras de carga e cinco testes de qualidade.',
      references: ['Kimball & Ross — The Data Warehouse Toolkit', 'Ralph Kimball — Slowly Changing Dimensions', 'Inmon — Building the Data Warehouse', 'dbt — Testing and documentation concepts']
    },
    6: {
      title: 'Otimização de Datawarehouses', date: '21/08/2026', subtitle: 'Desempenho, custo e previsibilidade sem otimização por tentativa e erro.',
      objective: 'Diagnosticar gargalos de consulta e escolher particionamento, clustering, materialização e modelagem com base em evidências.',
      agenda: ['Medir antes de otimizar', 'Plano de execução', 'Particionamento e clustering', 'Materializações e custos', 'Benchmark controlado'],
      sections: [
        ['Sintoma e causa', 'Tempo alto pode vir de leitura excessiva, join explosivo, skew, baixa seletividade, concorrência, fila ou rede. Comece pelo perfil da consulta.'],
        ['Plano de execução', 'Leia bytes lidos, cardinalidade estimada versus real, etapas de shuffle, spills, scans completos e operadores que concentram tempo.'],
        ['Particionamento', 'Particione por colunas usadas em filtros temporais ou de domínio. Evite partições pequenas demais, alta cardinalidade e partições que ninguém filtra.'],
        ['Clustering e índices', 'Organize dados pelos predicados mais frequentes. Índices ajudam workloads seletivos; em engines colunares, compressão e pruning geralmente importam mais.'],
        ['Materialização', 'Escolha entre view, tabela incremental, snapshot e aggregate table. Defina freshness, custo de atualização e consumidor antes de materializar.'],
        ['Benchmark', 'Compare baseline e candidato com o mesmo dataset, cache controlado, métricas de latência, bytes processados, custo e qualidade do resultado.']
      ],
      deliverable: 'Relatório de otimização com baseline, hipótese, alteração, evidência antes/depois e recomendação de operação.',
      references: ['Use the Index, Luke!', 'Apache Spark SQL Performance Tuning', 'BigQuery — Optimize query computation', 'Snowflake — Micro-partitions and clustering']
    },
    7: {
      title: 'Arquitetura de Dados', date: '24/08/2026', subtitle: 'Decisões estruturais para uma plataforma de dados confiável, evolutiva e governável.',
      objective: 'Desenhar uma arquitetura de dados conectando fontes, ingestão, armazenamento, processamento, consumo, segurança e operação.',
      agenda: ['Requisitos arquiteturais', 'Camadas e responsabilidades', 'Batch, streaming e lakehouse', 'Governança e segurança', 'Architecture review'],
      sections: [
        ['Comece pelas decisões', 'Arquitetura responde a volume, velocidade, variedade, criticidade, retenção, compliance, orçamento e perfil dos consumidores.'],
        ['Camadas', 'Separe ingestão, armazenamento bruto, dados tratados, serving/semântica e consumo. Cada camada deve ter contrato, dono e política de qualidade.'],
        ['Padrões', 'Compare data warehouse, data lake, lakehouse, hub-and-spoke e data mesh. O padrão só é adequado quando resolve restrições reais.'],
        ['Batch e streaming', 'Batch simplifica consistência e custo; streaming reduz latência e aumenta complexidade operacional. Avalie se a decisão precisa ser tomada em segundos.'],
        ['Governança', 'Inclua catálogo, ownership, classificação, lineage, retenção, mascaramento, controle de acesso e resposta a incidentes desde o desenho.'],
        ['Resiliência', 'Defina idempotência, replay, dead-letter, backup, RPO, RTO, observabilidade e estratégia de evolução de schema.']
      ],
      deliverable: 'Diagrama de arquitetura com fluxo ponta a ponta, decisões registradas em ADR, NFRs, riscos e plano de evolução.',
      references: ['TOGAF — Architecture Development Method', 'DAMA-DMBOK2', 'ISO/IEC 42010 — Architecture descriptions', 'AWS Well-Architected Framework']
    },
    10: {
      title: 'Armazenamento em Grande Escala', date: '02/09/2026', subtitle: 'Como guardar petabytes com desempenho, governança e custo previsível.',
      objective: 'Escolher formatos, organização física, camadas de armazenamento e políticas de ciclo de vida para dados em escala.',
      agenda: ['Escala e requisitos', 'Object storage e formatos', 'Parquet, compressão e partições', 'Lakehouse e catálogo', 'FinOps do armazenamento'],
      sections: [
        ['O que escala', 'Volume é apenas uma dimensão. Considere throughput, concorrência, tamanho dos arquivos, latência, retenção, recuperação e custo por consulta.'],
        ['Object storage', 'Buckets e objetos oferecem durabilidade e escala, mas exigem convenções de nome, controle de acesso, versionamento e catálogo externo.'],
        ['Formato físico', 'CSV favorece portabilidade; Parquet favorece leitura colunar, compressão e pruning; Avro favorece serialização orientada a registros e schema evolution.'],
        ['Layout', 'Particione por colunas de filtro estáveis e de baixa/moderada cardinalidade. Evite small files; compacte e monitore tamanho médio.'],
        ['Lakehouse', 'Tabelas transacionais adicionam atomicidade, histórico e evolução sobre storage aberto. Diferencie bronze, silver e gold por contrato, não apenas por cor.'],
        ['Custo e segurança', 'Aplique lifecycle, tiering, retenção, criptografia, políticas por prefixo, acesso mínimo e orçamento por domínio.']
      ],
      deliverable: 'Proposta de layout de storage com formato, particionamento, compactação, lifecycle, segurança e estimativa de custo.',
      references: ['Apache Parquet Documentation', 'Delta Lake Protocol', 'Apache Iceberg Documentation', 'Google Cloud Storage — Storage classes']
    },
    12: {
      title: 'Coleta e Extração', date: '08/09/2026', subtitle: 'Da origem ao dado bruto com completude, rastreabilidade e reprocessamento seguro.',
      objective: 'Projetar uma extração resiliente para banco, API, arquivo e evento, preservando watermark, schema, auditoria e idempotência.',
      agenda: ['Perfil das fontes', 'Full load e incremental', 'APIs, CDC e arquivos', 'Falhas e schema drift', 'Laboratório de ingestão'],
      sections: [
        ['Conheça a origem', 'Mapeie owner, frequência, chave, timezone, semântica de atualização, limites, dados sensíveis e janela de disponibilidade.'],
        ['Estratégias', 'Full load é simples e caro; incremental por timestamp pode perder atualizações; CDC captura mudanças, mas exige retenção e ordenação.'],
        ['APIs', 'Implemente paginação, rate limit, retry com backoff, autenticação, checkpoint e registro da resposta original. Nunca trate HTTP 200 como garantia de completude.'],
        ['Arquivos', 'Valide nome, encoding, schema, delimitador, duplicidade, checksum e atomicidade da chegada. Separe landing de processamento.'],
        ['Idempotência', 'A mesma janela reprocessada deve produzir o mesmo resultado. Use chave natural, batch_id, watermark e deduplicação determinística.'],
        ['Operação', 'Registre início, fim, volume, bytes, status, origem, watermark, erro e localização dos rejeitados para permitir replay.']
      ],
      deliverable: 'Pipeline de extração com contrato da fonte, estratégia incremental, tabela de controle, política de retry e evidências de replay.',
      references: ['Airbyte — Incremental sync concepts', 'Debezium — Change Data Capture', 'RFC 9110 — HTTP Semantics', 'Google SRE — Handling overload']
    },
    13: {
      title: 'Transformação e Carga', date: '10/09/2026', subtitle: 'Transformar e publicar dados com contratos, testes e cargas repetíveis.',
      objective: 'Construir uma transformação determinística e uma carga confiável para camadas analíticas, com qualidade e rastreabilidade.',
      agenda: ['ELT e responsabilidades', 'Transformações determinísticas', 'Deduplicação e histórico', 'Carga incremental', 'Pipeline completo'],
      sections: [
        ['ETL ou ELT', 'ETL transforma antes do destino; ELT preserva o bruto e usa o warehouse para transformar. Escolha por custo, segurança, governança e capacidade computacional.'],
        ['Determinismo', 'A mesma entrada e parâmetros devem gerar a mesma saída. Fixe timezone, arredondamento, regras de nulos, joins e versão do código.'],
        ['Qualidade', 'Teste schema, not null, unicidade, relacionamento, accepted values, freshness, volume e reconciliação com a origem.'],
        ['Deduplicação', 'Defina a chave do evento, ordenação de chegada e regra para escolher o registro vencedor. Não use DISTINCT como estratégia de negócio.'],
        ['Carga', 'Compare append, overwrite, merge/upsert e snapshot. Escolha conforme histórico, janela de correção e necessidade de atomicidade.'],
        ['Orquestração', 'Modele dependências, retries, backfill, parâmetros, alertas, SLA, lineage e promoção entre ambientes.']
      ],
      deliverable: 'Pipeline ETL/ELT documentado com modelo de entrada/saída, testes de qualidade, estratégia de carga e runbook de reprocessamento.',
      references: ['dbt — Best practices', 'Apache Airflow — Core concepts', 'Kimball — Incremental ETL', 'Great Expectations — Expectations']
    },
    15: {
      title: 'Métricas e Telemetria em ETL', date: '21/09/2026', subtitle: 'Operar pipelines como produto: medir, explicar e recuperar.',
      objective: 'Definir observabilidade para ETL com métricas de serviço, qualidade de dados, logs estruturados, lineage e alertas acionáveis.',
      agenda: ['O que observar', 'SLIs e SLOs', 'Métricas de qualidade', 'Logs, traces e lineage', 'Incident review'],
      sections: [
        ['Observabilidade', 'Pergunte o que aconteceu, por que aconteceu e qual impacto gerou. Métricas mostram estado; logs explicam eventos; traces mostram caminho.'],
        ['SLI e SLO', 'Defina freshness, disponibilidade, latência, completude e sucesso de execução. Um SLO precisa de janela, alvo e consequência operacional.'],
        ['Qualidade', 'Volume esperado, distribuição, nulos, duplicidade, valores inválidos, reconciliação e drift devem ser medidos por dataset e domínio.'],
        ['Telemetria', 'Inclua run_id, batch_id, source, model, partition, rows_in, rows_out, rejected, duration, watermark e código de erro.'],
        ['Alertas', 'Alerta deve apontar condição, impacto, owner, dashboard e primeira ação. Evite alertar toda anomalia sem severidade ou runbook.'],
        ['Incidentes', 'Faça triagem, contenção, comunicação, replay seguro, validação do dado corrigido e postmortem com ação preventiva.']
      ],
      deliverable: 'Painel e runbook de observabilidade com SLIs, SLOs, alertas, severidades, owners e procedimento de recuperação.',
      references: ['Google SRE Workbook — Monitoring', 'OpenTelemetry Documentation', 'Monte Carlo — Data observability concepts', 'Prometheus Documentation']
    },
    16: {
      title: 'Integração do Datawarehouse com a Interface Analítica', date: '23/09/2026', subtitle: 'Do dado confiável à experiência analítica que sustenta decisões.',
      objective: 'Projetar a camada de consumo analítico com modelo semântico, métricas governadas, APIs/BI, segurança e desempenho.',
      agenda: ['Quem consome e decide', 'Camada semântica', 'APIs e dashboards', 'Segurança e performance', 'Integração final do projeto'],
      sections: [
        ['Comece pela decisão', 'Mapeie pergunta, usuário, frequência, ação e tolerância de atraso. Um dashboard sem decisão associada vira estoque de gráficos.'],
        ['Semântica', 'Centralize definição de métricas, dimensões, filtros, timezone, granularidade e owner. Evite que cada relatório calcule receita de um jeito.'],
        ['Serviços', 'Escolha consulta direta, tabela agregada, API, exportação ou cache conforme latência, volume, segurança e autonomia do consumidor.'],
        ['Contrato', 'Defina schema, versionamento, paginação, erros, freshness, limites e compatibilidade para APIs e datasets publicados.'],
        ['Segurança', 'Aplique identidade, RBAC/ABAC, row-level security, mascaramento, auditoria e segregação de ambientes. Segurança precisa ser testável.'],
        ['Desempenho', 'Use pré-agregação, cache, pruning, limites de consulta e observabilidade de consumo. Meça p95, custo e taxa de erro.']
      ],
      deliverable: 'Pacote final de integração: modelo semântico, contrato de consumo, dashboard/API, controles de acesso, SLO e evidências de teste.',
      references: ['Semantic Layer concepts — dbt Semantic Layer', 'OpenAPI Specification 3.1', 'OWASP API Security Top 10', 'ISO/IEC 25010:2023']
    }
  };

  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lesson = lessons[Number(document.body.dataset.lesson)];
  if (!lesson) return;

  window.module11Lesson = lesson;
  window.renderLessonSlides = function (root) {
    const slides = [
      `<article class="lesson-slide lesson-cover"><span class="lesson-kicker">Módulo 11 · Engenharia de Software · Aula ${document.body.dataset.lesson}</span><h1>${esc(lesson.title)}</h1><p>${esc(lesson.subtitle)}</p><small>Computação 2 · Prof. Afonso Brandão · ${lesson.date}</small></article>`,
      `<article class="lesson-slide"><span class="lesson-kicker">Agenda</span><h2>Como vamos trabalhar</h2><div class="lesson-grid">${lesson.agenda.map((x,i)=>`<div class="lesson-card"><b>${String(i+1).padStart(2,'0')}</b><h3>${esc(x)}</h3><p>${esc(lesson.sections[i % lesson.sections.length][1])}</p></div>`).join('')}</div></article>`,
      `<article class="lesson-slide"><span class="lesson-kicker">Objetivo</span><h2>O que você precisa conseguir fazer</h2><div class="lesson-callout"><strong>${esc(lesson.objective)}</strong></div><div class="lesson-grid">${lesson.sections.slice(0,3).map(x=>`<div class="lesson-card"><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></div>`).join('')}</div></article>`,
      ...lesson.sections.map((x,i)=>`<article class="lesson-slide"><span class="lesson-kicker">Bloco ${i+1} · Conceito</span><h2>${esc(x[0])}</h2><div class="lesson-card lesson-wide"><p>${esc(x[1])}</p><h3>Checklist de aplicação</h3><ul><li>Declare o contexto e o dono da decisão.</li><li>Defina a entrada, a saída e o critério de qualidade.</li><li>Registre como testar, operar e reprocessar.</li></ul></div></article>`),
      `<article class="lesson-slide"><span class="lesson-kicker">Laboratório</span><h2>Entregável da aula</h2><div class="lesson-callout"><strong>${esc(lesson.deliverable)}</strong></div><div class="lesson-card lesson-wide"><h3>Critérios de aceite</h3><ol><li>O artefato identifica o grão, contrato ou decisão que está sendo tratado.</li><li>As regras são verificáveis e têm exemplos de sucesso e falha.</li><li>Há owner, estratégia de operação e caminho de reprocessamento.</li></ol></div></article>`,
      `<article class="lesson-slide"><span class="lesson-kicker">Fechamento</span><h2>Leve para o projeto</h2><div class="lesson-grid">${lesson.references.map((x,i)=>`<div class="lesson-card"><b>Ref. ${i+1}</b><p>${esc(x)}</p></div>`).join('')}</div><div class="lesson-callout">A pergunta final: <strong>qual decisão fica mais segura depois deste artefato?</strong></div></article>`
    ];
    root.innerHTML = slides.join('');
    return slides.length;
  };
  window.renderLessonMaterial = function (root) {
    root.innerHTML = `<header class="material-head"><span>Módulo 11 · Engenharia de Software · Computação 2</span><h1>${esc(lesson.title)}</h1><p>${esc(lesson.subtitle)} · Prof. Afonso Brandão · ${lesson.date}</p></header><div class="material-body"><section class="material-box"><h2>Objetivo da aula</h2><p>${esc(lesson.objective)}</p></section><section class="material-box"><h2>Roteiro</h2><ol>${lesson.agenda.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>${lesson.sections.map((x,i)=>`<section class="material-section"><h2>${i+1}. ${esc(x[0])}</h2><p>${esc(x[1])}</p><h3>Perguntas para orientar o trabalho</h3><ul><li>Qual decisão este artefato precisa apoiar?</li><li>Qual é a unidade de análise e qual é o contrato de entrada e saída?</li><li>Como detectar erro, medir qualidade e recuperar uma execução?</li></ul><div class="material-note"><strong>Aplicação:</strong> escreva um exemplo do seu projeto e compare com a regra apresentada.</div></section>`).join('')}<section class="material-box"><h2>Entregável e avaliação</h2><p>${esc(lesson.deliverable)}</p><ul><li>Clareza do problema e do contrato: 25%</li><li>Correção técnica e tratamento de exceções: 30%</li><li>Testabilidade, qualidade e operação: 25%</li><li>Comunicação e justificativa das decisões: 20%</li></ul></section><section class="material-box"><h2>Referências</h2><ul>${lesson.references.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section></div>`;
  };
  window.renderLessonPlan = function (root) {
    root.innerHTML = `<header class="plan-head"><span>Módulo 11 · Plano de Ensino</span><h1>Aula ${document.body.dataset.lesson} — ${esc(lesson.title)}</h1><p>Professor: Afonso Brandão · ${lesson.date}</p></header><main class="plan-body"><section><h2>Ementa</h2><p>${esc(lesson.subtitle)} ${esc(lesson.objective)}</p></section><section><h2>Objetivos de aprendizagem</h2><ul><li>Explicar os conceitos e trade-offs do tema.</li><li>Projetar um artefato aplicável ao projeto de dados.</li><li>Definir critérios de qualidade, operação e segurança.</li><li>Justificar escolhas com evidências e referências.</li></ul></section><section><h2>Metodologia e cronograma</h2><ol>${lesson.agenda.map((x,i)=>`<li><strong>${esc(x)}:</strong> ${esc(lesson.sections[i % lesson.sections.length][1])}</li>`).join('')}</ol></section><section><h2>Avaliação</h2><p>Entrega individual ou em grupo do artefato descrito no material, com apresentação curta e revisão por pares. ${esc(lesson.deliverable)}</p></section><section><h2>Bibliografia</h2><ul>${lesson.references.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section></main>`;
  };
})();
