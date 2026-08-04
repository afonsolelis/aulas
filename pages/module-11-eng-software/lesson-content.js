(function () {
  // Modelo de dados de uma aula do Módulo 11.
  //
  //   sections[] = { nav, title, text, checklist[3], pitfall }
  //     `nav` é o rótulo da aula na agenda. A agenda é DERIVADA de sections,
  //     nunca mantida como lista paralela — foi assim que a agenda e o texto
  //     das seções passaram a divergir na versão anterior.
  //
  //   sdd = { rf, rnf, adr, gherkin }
  //     Ponte com a Aula 1: como o tema da aula vira especificação. Ausente
  //     na Aula 1, que é a própria aula de spec.
  const lessons = {
    1: {
      title: 'Spec-Driven Development', date: '04/08/2026',
      subtitle: 'Especificar antes de implementar: contratos, testes e IA sob controle.',
      objective: 'Escrever uma especificação executável que conecte problema, arquitetura, contrato de API, dados, testes e metas de qualidade.',
      outcomes: [
        'Distinguir requisito funcional, requisito não funcional e decisão arquitetural, indicando onde cada um é registrado.',
        'Escrever uma especificação com visão, requisitos, contrato de API, modelo de dados e cenários de aceite.',
        'Registrar uma decisão arquitetural em ADR, com contexto, alternativa descartada e consequências.',
        'Descrever os modelos de dados, estático e dinâmico em notação textual versionada, derivando os diagramas do próprio texto.',
        'Verificar código gerado por IA contra metas mensuráveis, sem alterar a especificação original.'
      ],
      sections: [
        {
          nav: 'Contexto e motivação', title: 'O problema',
          text: 'Começar pelo código transforma ambiguidade em retrabalho. A spec torna explícitos comportamento, limites, decisões e critérios de aceite antes da implementação.',
          checklist: [
            'Identifique uma decisão que hoje só existe na cabeça de alguém.',
            'Aponte onde o retrabalho veio de ambiguidade, não de erro técnico.',
            'Nomeie o artefato que deveria ser a fonte única de verdade.'
          ],
          pitfall: 'Tratar a spec como documentação escrita depois da entrega. Se ela não precede o código, ela não governa nada.'
        },
        {
          nav: 'Qualidade não funcional', title: 'ISO 25010',
          text: 'As nove características do modelo ISO/IEC 25010:2023 tornam objetivo o que costuma ficar implícito. Nem toda característica se aplica a todo componente: escolha as pertinentes e atribua a cada uma um limite numérico.',
          checklist: [
            'Selecione as características aplicáveis e descarte as demais explicitamente.',
            'Dê a cada uma métrica, limite e instrumento de medida.',
            'Defina o que acontece quando o limite é violado.'
          ],
          pitfall: 'Escrever "o sistema deve ser rápido e seguro". Sem número, janela e instrumento, não é requisito — é desejo.'
        },
        {
          nav: 'Anatomia de uma spec', title: 'Anatomia',
          text: 'Uma spec madura contém visão e escopo, requisitos funcionais, requisitos não funcionais, contrato de API, modelo de dados e cenários de teste.',
          checklist: [
            'Numere os requisitos (RF-001, RNF-001) para que testes e código possam citá-los.',
            'Escreva o contrato de API antes da implementação, com erros e exemplos.',
            'Descreva o modelo de dados por entidade, chave e restrição, sem citar produto.'
          ],
          pitfall: 'Misturar tecnologia na spec ("usar PostgreSQL"). Escolha de produto é ADR, não requisito.'
        },
        {
          nav: 'ADR e decisão', title: 'ADR',
          text: 'Registre o contexto, as alternativas, a decisão e as consequências. A spec descreve o comportamento; o ADR explica por que a arquitetura foi escolhida.',
          checklist: [
            'Registre o contexto e ao menos uma alternativa descartada, com o motivo.',
            'Declare as consequências negativas — um ADR sem custo é propaganda.',
            'Dê status ao registro e supersede o antigo em vez de editá-lo.'
          ],
          pitfall: 'ADR escrito depois da decisão para justificá-la. Vira ata, não raciocínio.'
        },
        {
          nav: 'Sequência documental', title: 'Pipeline',
          text: 'Problema → processos → arquitetura → esqueleto → spec → TDD → implementação. A escolha de tecnologia entra depois da spec, em ADR próprio. A IA entra depois que a intenção humana está verificável.',
          checklist: [
            'Confirme que a spec não menciona linguagem, framework ou banco.',
            'Garanta que cada decisão estrutural tem ADR antes da spec correspondente.',
            'Só abra o editor de código quando existir teste que falha.'
          ],
          pitfall: 'Pular do problema direto para o esqueleto do projeto. Sem ADR, a estrutura parece arbitrária a quem chega depois.'
        },
        {
          nav: 'OpenAPI e Gherkin', title: 'Linguagens de contrato',
          text: 'OpenAPI 3.1 descreve rotas, parâmetros, schemas e códigos de status em formato legível por máquina. Gherkin descreve cenários de aceite em Dado/Quando/Então, legíveis pelo negócio e executáveis por ferramenta.',
          checklist: [
            'Para cada rota, especifique ao menos um caminho de erro além do caminho feliz.',
            'Escreva um cenário por regra de negócio, não por função de código.',
            'Verifique que todo cenário falha antes de a implementação existir.'
          ],
          pitfall: 'Cenários que descrevem cliques de interface. Gherkin fixa regra de negócio, não roteiro de navegação.'
        },
        {
          nav: 'Modelagem como código', title: 'Modeling as code',
          text: 'Os modelos do sistema são descritos em notação textual versionada junto da especificação. São três: entidade-relacionamento para os dados, diagrama de classes para a estrutura estática e diagrama de sequência para o comportamento dinâmico. A demonstração ao vivo percorre os três sobre um sistema de biblioteca com três entidades persistidas e cinco classes de domínio.',
          checklist: [
            'Mantenha o modelo em texto (Mermaid, PlantUML) no repositório da spec, não como imagem anexada.',
            'Declare cardinalidades e chaves no modelo de dados antes de escrever qualquer DDL.',
            'Represente o caminho de erro no diagrama de sequência, não apenas o fluxo de sucesso.'
          ],
          pitfall: 'Diagrama exportado como imagem e desatualizado em relação ao código. Sem diff, a divergência entre modelo e implementação passa despercebida.'
        },
        {
          nav: 'SDD e IA', title: 'Geração assistida',
          text: 'A especificação restringe o espaço de soluções, codifica conhecimento de domínio que o modelo não possui e define o critério de verificação aplicado depois da geração.',
          checklist: [
            'Passe spec e testes como contexto, não um pedido em linguagem livre.',
            'Peça correção contra o desvio medido, sem reabrir a spec.',
            'Limite o número de iterações e escale quando o limite for atingido.'
          ],
          pitfall: 'Aceitar código que passa nos testes sem verificar as metas não funcionais. Compilar não é atender ao requisito.'
        },
        {
          nav: 'Verificação', title: 'Verificação e refinamento',
          text: 'Cada característica de qualidade tem estratégia própria de verificação: perfilamento para desempenho, injeção de falhas para confiabilidade, análise estática para segurança, métricas de complexidade para manutenibilidade.',
          checklist: [
            'Associe cada requisito não funcional a um instrumento concreto.',
            'Registre a evidência medida, não a impressão.',
            'Repita o ciclo até atingir a meta ou registre o trade-off aceito.'
          ],
          pitfall: 'Verificação como revisão manual no fim. Sem instrumento, a spec permanece intenção não confirmada.'
        }
      ],
      deliverable: 'Uma spec Markdown com contrato OpenAPI, modelos em Mermaid (entidade-relacionamento, classes e sequência), cenários Gherkin, três metas de qualidade mensuráveis e um ADR curto com alternativa descartada.',
      references: ['ISO/IEC 25010:2023 — Product quality model', 'OpenAPI Specification 3.1', 'Cucumber — Gherkin Reference', 'MADR — Markdown Any Decision Records']
    },

    5: {
      title: 'Modelagem de Data Warehouse IV', date: '20/08/2026',
      subtitle: 'Modelagem dimensional avançada para fatos, histórico e decisões analíticas.',
      objective: 'Projetar um modelo dimensional com grão explícito, dimensões conformadas, fatos aditivos e estratégia de histórico adequada ao negócio.',
      outcomes: [
        'Declarar o grão de uma tabela de fato e defender a escolha diante do processo de negócio.',
        'Classificar medidas como aditivas, semi-aditivas ou não aditivas e prever onde a soma quebra.',
        'Escolher a estratégia de histórico (SCD 0, 1, 2 ou 3) a partir da pergunta analítica.',
        'Especificar testes que detectam dupla contagem e violação de integridade referencial.'
      ],
      sections: [
        {
          nav: 'Do processo ao grão', title: 'Grão antes da tabela',
          text: 'Declare o evento representado por uma linha. Sem grão, métricas misturam níveis, duplicam valores e tornam joins perigosos.',
          checklist: [
            'Escreva o grão em uma frase no singular: "uma linha representa…".',
            'Confirme que toda medida da tabela existe nesse nível.',
            'Verifique que a chave composta do grão é única na tabela.'
          ],
          pitfall: 'Definir o grão depois de escolher as colunas. O grão vem do processo de negócio, não do que a origem oferece.'
        },
        {
          nav: 'Fatos e medidas', title: 'Fatos',
          text: 'Separe fatos transacionais, snapshots periódicos e snapshots acumulativos. Classifique medidas como aditivas, semi-aditivas ou não aditivas.',
          checklist: [
            'Classifique cada medida e registre a classificação junto da coluna.',
            'Marque as semi-aditivas com a dimensão em que a soma é inválida.',
            'Guarde numerador e denominador em vez de razões já calculadas.'
          ],
          pitfall: 'Somar saldo ao longo do tempo. Saldo é semi-aditivo: soma entre contas, nunca entre datas.'
        },
        {
          nav: 'Dimensões', title: 'Dimensões',
          text: 'Use dimensões conformadas, chaves substitutas, dimensões degeneradas e dimensões de papel para permitir análise consistente entre processos.',
          checklist: [
            'Use chave substituta e preserve a chave natural como atributo.',
            'Conforme as dimensões compartilhadas antes de criar a segunda fato.',
            'Registre papel e alias quando a mesma dimensão entra duas vezes.'
          ],
          pitfall: 'Cada área criar sua própria dimensão de produto. Sem conformação, dois relatórios corretos discordam.'
        },
        {
          nav: 'Histórico e SCD', title: 'SCD',
          text: 'Compare SCD 0, 1, 2 e 3. Escolha pelo significado histórico: sobrescrever quando o passado não importa; versionar quando a análise precisa reconstruir o contexto.',
          checklist: [
            'Pergunte se a análise precisa reconstruir o passado; se não, SCD 1 basta.',
            'Em SCD 2, defina data de início, data de fim e indicador de vigência.',
            'Garanta que todo join com dimensão versionada filtra por vigência.'
          ],
          pitfall: 'Aplicar SCD 2 a tudo por precaução. Histórico sem pergunta associada é custo de armazenamento e risco de join errado.'
        },
        {
          nav: 'Casos difíceis', title: 'Casos difíceis',
          text: 'Trate fatos sem medida, fatos de cobertura, late-arriving dimensions, mudanças retroativas, pontes para cardinalidade muitos-para-muitos e calendário fiscal.',
          checklist: [
            'Para muitos-para-muitos, use tabela ponte com fator de alocação.',
            'Trate late-arriving dimension com registro inferido, não com rejeição.',
            'Separe calendário fiscal do civil quando os períodos divergirem.'
          ],
          pitfall: 'Resolver muitos-para-muitos com join direto. O resultado infla a medida silenciosamente.'
        },
        {
          nav: 'Qualidade do modelo', title: 'Qualidade',
          text: 'Teste unicidade da chave, integridade referencial, cobertura temporal, reconciliação com a origem e ausência de dupla contagem.',
          checklist: [
            'Teste unicidade da chave do grão a cada carga.',
            'Reconcilie totais com a origem e declare a tolerância aceita.',
            'Verifique cobertura temporal e ausência de vigências sobrepostas.'
          ],
          pitfall: 'Validar apenas contagem de linhas. Dupla contagem preserva a contagem e destrói a soma.'
        }
      ],
      sdd: {
        rf: 'RF-001 — Permitir o recálculo da margem de qualquer venda usando o preço vigente na data do evento.',
        rnf: 'RNF-001 — Reconciliação com a origem dentro de ±0,1%; nenhuma chave do grão duplicada; nenhuma vigência sobreposta em dimensão versionada.',
        adr: 'ADR-DW-01 — SCD 2 em dimensao_produto e SCD 1 em dimensao_cliente. Alternativa descartada: SCD 2 em ambas, que elevaria o volume sem pergunta de negócio associada. Consequência: todo join com produto passa a exigir filtro de vigência.',
        gherkin: 'Dado um produto cujo preço mudou em 10/03, Quando consulto a margem de uma venda de 05/03, Então o cálculo usa o preço anterior e não o vigente hoje.'
      },
      deliverable: 'Modelo dimensional documentado: grão declarado, fatos, dimensões, SCD escolhido com justificativa, regras de carga e cinco testes de qualidade.',
      references: ['Kimball & Ross — The Data Warehouse Toolkit', 'Ralph Kimball — Slowly Changing Dimensions', 'Inmon — Building the Data Warehouse', 'dbt — Testing and documentation concepts']
    },

    6: {
      title: 'Otimização de Datawarehouses', date: '21/08/2026',
      subtitle: 'Desempenho, custo e previsibilidade sem otimização por tentativa e erro.',
      objective: 'Diagnosticar gargalos de consulta e escolher particionamento, clustering, materialização e modelagem com base em evidências.',
      outcomes: [
        'Diagnosticar a causa de uma consulta lenta a partir do plano de execução.',
        'Escolher particionamento e clustering pelos predicados reais do workload.',
        'Decidir entre view, tabela incremental e agregada considerando freshness e custo.',
        'Comprovar ganho com benchmark controlado e evidência antes/depois.'
      ],
      sections: [
        {
          nav: 'Medir antes de otimizar', title: 'Sintoma e causa',
          text: 'Tempo alto pode vir de leitura excessiva, join explosivo, skew, baixa seletividade, concorrência, fila ou rede. Comece pelo perfil da consulta.',
          checklist: [
            'Colete a consulta real do usuário, não uma versão simplificada.',
            'Registre tempo, bytes lidos e custo antes de qualquer alteração.',
            'Formule uma hipótese de causa antes de mexer no código.'
          ],
          pitfall: 'Otimizar pela intuição. Sem baseline registrado, não há como provar que melhorou.'
        },
        {
          nav: 'Plano de execução', title: 'Plano de execução',
          text: 'Leia bytes lidos, cardinalidade estimada versus real, etapas de shuffle, spills, scans completos e operadores que concentram tempo.',
          checklist: [
            'Compare cardinalidade estimada e real para detectar estatística defasada.',
            'Procure shuffle, spill e full scan antes de olhar a sintaxe.',
            'Identifique o operador que concentra tempo, não o que parece complexo.'
          ],
          pitfall: 'Reescrever SQL sem ler o plano. A maior parte do ganho vem de leitura evitada, não de sintaxe.'
        },
        {
          nav: 'Particionamento', title: 'Particionamento',
          text: 'Particione por colunas usadas em filtros temporais ou de domínio. Evite partições pequenas demais, alta cardinalidade e partições que ninguém filtra.',
          checklist: [
            'Particione pela coluna presente no filtro da maioria das consultas.',
            'Dimensione a partição para arquivos entre 128 MB e 1 GB.',
            'Meça o pruning: confirme quantas partições o plano descartou.'
          ],
          pitfall: 'Particionar por coluna de alta cardinalidade, como identificador de cliente. Gera milhares de partições minúsculas e piora tudo.'
        },
        {
          nav: 'Clustering e índices', title: 'Clustering e índices',
          text: 'Organize dados pelos predicados mais frequentes. Índices ajudam workloads seletivos; em engines colunares, compressão e pruning geralmente importam mais.',
          checklist: [
            'Ordene pelos predicados mais frequentes, do mais seletivo ao menos.',
            'Em engine colunar, avalie compressão e pruning antes de índice.',
            'Reavalie o clustering quando o padrão de consulta mudar.'
          ],
          pitfall: 'Trazer o hábito de índice do OLTP para o colunar. Ali o ganho vem de descartar blocos, não de apontar linhas.'
        },
        {
          nav: 'Materialização', title: 'Materialização',
          text: 'Escolha entre view, tabela incremental, snapshot e aggregate table. Defina freshness, custo de atualização e consumidor antes de materializar.',
          checklist: [
            'Declare o freshness aceitável antes de materializar.',
            'Some o custo de atualização ao custo de consulta na comparação.',
            'Nomeie o consumidor: materialização sem consumidor é custo puro.'
          ],
          pitfall: 'Criar a tabela agregada e manter a consulta original disponível. Duas fontes para a mesma métrica divergem em semanas.'
        },
        {
          nav: 'Benchmark', title: 'Benchmark',
          text: 'Compare baseline e candidato com o mesmo dataset, cache controlado, métricas de latência, bytes processados, custo e qualidade do resultado.',
          checklist: [
            'Use o mesmo dataset e controle o cache entre execuções.',
            'Repita a medição e reporte mediana e p95, não o melhor caso.',
            'Verifique que o resultado do candidato é idêntico ao do baseline.'
          ],
          pitfall: 'Medir com cache quente e comemorar o ganho. O usuário paga o caminho frio.'
        }
      ],
      sdd: {
        rf: 'RF-002 — Disponibilizar a consulta de receita por região e mês ao analista, sob demanda, sem agendamento prévio.',
        rnf: 'RNF-002 — p95 ≤ 2 s e no máximo 20 GB varridos por execução, medidos com cache frio.',
        adr: 'ADR-DW-02 — Particionar fato_vendas por data_venda e clusterizar por regiao_id. Alternativa descartada: índice secundário, sem efeito relevante em engine colunar. Consequência: consulta sem filtro de data varre a tabela inteira e precisa ser bloqueada na camada semântica.',
        gherkin: 'Dado fato_vendas particionada por data_venda, Quando consulto um intervalo de sete dias, Então o plano lê no máximo sete partições e não executa varredura completa.'
      },
      deliverable: 'Relatório de otimização com baseline medido, hipótese de causa, alteração aplicada, evidência antes/depois e recomendação de operação.',
      references: ['Use the Index, Luke!', 'Apache Spark SQL Performance Tuning', 'BigQuery — Optimize query computation', 'Snowflake — Micro-partitions and clustering']
    },

    7: {
      title: 'Arquitetura de Dados', date: '24/08/2026',
      subtitle: 'Decisões estruturais para uma plataforma de dados confiável, evolutiva e governável.',
      objective: 'Desenhar uma arquitetura de dados conectando fontes, ingestão, armazenamento, processamento, consumo, segurança e operação.',
      outcomes: [
        'Derivar decisões arquiteturais de restrições declaradas, não de tendência de mercado.',
        'Atribuir contrato, dono e política de qualidade a cada camada da plataforma.',
        'Comparar batch e streaming pela latência que a decisão de negócio realmente exige.',
        'Registrar riscos, RPO, RTO e plano de evolução de schema em ADR.'
      ],
      sections: [
        {
          nav: 'Requisitos arquiteturais', title: 'Comece pelas decisões',
          text: 'Arquitetura responde a volume, velocidade, variedade, criticidade, retenção, compliance, orçamento e perfil dos consumidores.',
          checklist: [
            'Escreva as restrições em números: volume, latência, retenção, orçamento.',
            'Identifique a decisão de negócio que a plataforma precisa sustentar.',
            'Descarte explicitamente ao menos uma alternativa, com o motivo.'
          ],
          pitfall: 'Escolher o padrão antes de conhecer a restrição. Arquitetura por tendência vira custo sem uso.'
        },
        {
          nav: 'Camadas e responsabilidades', title: 'Camadas',
          text: 'Separe ingestão, armazenamento bruto, dados tratados, serving/semântica e consumo. Cada camada deve ter contrato, dono e política de qualidade.',
          checklist: [
            'Dê a cada camada um contrato de entrada e de saída.',
            'Nomeie o dono responsável por qualidade e por incidente.',
            'Proíba salto de camada: consumo não lê o dado bruto.'
          ],
          pitfall: 'Camadas que só diferem no nome do schema. Sem contrato distinto, é uma camada só com três cópias.'
        },
        {
          nav: 'Padrões de plataforma', title: 'Padrões',
          text: 'Compare data warehouse, data lake, lakehouse, hub-and-spoke e data mesh. O padrão só é adequado quando resolve restrições reais.',
          checklist: [
            'Liste a restrição concreta que cada padrão candidato resolve.',
            'Estime o custo de governança, não apenas o de infraestrutura.',
            'Prefira o padrão mais simples que atenda às restrições.'
          ],
          pitfall: 'Adotar data mesh sem times de domínio com autonomia real. O padrão pressupõe organização, não apenas tecnologia.'
        },
        {
          nav: 'Batch e streaming', title: 'Batch e streaming',
          text: 'Batch simplifica consistência e custo; streaming reduz latência e aumenta a complexidade operacional. Avalie se a decisão precisa ser tomada em segundos.',
          checklist: [
            'Pergunte se alguma decisão muda por saber o dado em segundos.',
            'Compare o custo operacional, não apenas o de processamento.',
            'Adote streaming por caso de uso, não para a plataforma inteira.'
          ],
          pitfall: 'Migrar tudo para streaming por uma latência que ninguém consome. A complexidade sobe sem ganho de decisão.'
        },
        {
          nav: 'Governança e segurança', title: 'Governança',
          text: 'Inclua catálogo, ownership, classificação, lineage, retenção, mascaramento, controle de acesso e resposta a incidentes desde o desenho.',
          checklist: [
            'Classifique os dados sensíveis antes de mover qualquer byte.',
            'Garanta lineage verificável da origem ao consumo.',
            'Defina retenção e descarte, não apenas acumulação.'
          ],
          pitfall: 'Governança tratada como fase posterior. Catalogar depois de mil tabelas custa mais do que catalogar desde a primeira.'
        },
        {
          nav: 'Resiliência e evolução', title: 'Resiliência',
          text: 'Defina idempotência, replay, dead-letter, backup, RPO, RTO, observabilidade e estratégia de evolução de schema.',
          checklist: [
            'Defina RPO e RTO por domínio e teste a recuperação de fato.',
            'Garanta idempotência antes de habilitar replay.',
            'Estabeleça a política de evolução de schema e o que quebra compatibilidade.'
          ],
          pitfall: 'Backup que nunca foi restaurado. Sem teste de recuperação, o RTO declarado é ficção.'
        }
      ],
      sdd: {
        rf: 'RF-003 — Servir dados de vendas tratados ao BI e ao time de ciência de dados a partir de uma origem única.',
        rnf: 'RNF-003 — Dado disponível na camada de consumo em até 15 min após o fechamento da origem; RPO de 1 h e RTO de 4 h, comprovados em teste de recuperação.',
        adr: 'ADR-ARQ-01 — Lakehouse com camadas bronze, silver e gold, em vez de warehouse fechado. Contexto: schema evolutivo e dois perfis de consumo com necessidades distintas. Consequência: dependência de catálogo e de rotina de compactação; o custo de governança sobe e precisa de dono declarado.',
        gherkin: 'Dado que a carga da camada silver falhou no dia 12, Quando reprocesso a partição desse dia, Então a camada gold é reconstruída sem duplicar registros e o lineage aponta a nova execução.'
      },
      deliverable: 'Diagrama de arquitetura com fluxo ponta a ponta, decisões registradas em ADR, requisitos não funcionais, riscos e plano de evolução.',
      references: ['TOGAF — Architecture Development Method', 'DAMA-DMBOK2', 'ISO/IEC 42010 — Architecture descriptions', 'AWS Well-Architected Framework']
    },

    10: {
      title: 'Armazenamento em Grande Escala', date: '02/09/2026',
      subtitle: 'Como guardar petabytes com desempenho, governança e custo previsível.',
      objective: 'Escolher formatos, organização física, camadas de armazenamento e políticas de ciclo de vida para dados em escala.',
      outcomes: [
        'Dimensionar armazenamento por throughput, concorrência e latência, não apenas por volume.',
        'Escolher o formato físico a partir do padrão de leitura predominante.',
        'Definir layout e compactação que sustentem pruning eficaz.',
        'Aplicar ciclo de vida, tiering e orçamento por domínio.'
      ],
      sections: [
        {
          nav: 'O que escala', title: 'O que escala',
          text: 'Volume é apenas uma dimensão. Considere throughput, concorrência, tamanho dos arquivos, latência, retenção, recuperação e custo por consulta.',
          checklist: [
            'Liste throughput de escrita, concorrência de leitura e latência exigida.',
            'Estime o crescimento em 24 meses, não o volume de hoje.',
            'Defina a janela de retenção antes de escolher a classe de storage.'
          ],
          pitfall: 'Dimensionar só por terabytes. Dez mil leitores concorrentes quebram um layout que aguentaria petabytes.'
        },
        {
          nav: 'Object storage', title: 'Object storage',
          text: 'Buckets e objetos oferecem durabilidade e escala, mas exigem convenções de nome, controle de acesso, versionamento e catálogo externo.',
          checklist: [
            'Padronize a convenção de prefixo antes do primeiro arquivo.',
            'Ative versionamento e defina quem pode apagar.',
            'Mantenha catálogo externo: o bucket não descreve o dado.'
          ],
          pitfall: 'Tratar o bucket como sistema de arquivos. Sem catálogo, ninguém sabe o que existe nem qual é o schema.'
        },
        {
          nav: 'Formato físico', title: 'Formato físico',
          text: 'CSV favorece portabilidade; Parquet favorece leitura colunar, compressão e pruning; Avro favorece serialização orientada a registros e schema evolution.',
          checklist: [
            'Use colunar quando a leitura seleciona poucas colunas de muitas linhas.',
            'Escolha a compressão pelo par CPU/leitura, não pelo maior fator.',
            'Fixe o formato por camada e documente a exceção.'
          ],
          pitfall: 'CSV na camada analítica. Sem tipo nem estatística por bloco, toda consulta lê o arquivo inteiro.'
        },
        {
          nav: 'Layout e compactação', title: 'Layout',
          text: 'Particione por colunas de filtro estáveis e de baixa ou moderada cardinalidade. Evite small files; compacte e monitore o tamanho médio.',
          checklist: [
            'Particione por coluna de filtro estável e cardinalidade moderada.',
            'Monitore o tamanho médio de arquivo e compacte quando cair.',
            'Meça bytes lidos por consulta como indicador da qualidade do layout.'
          ],
          pitfall: 'Ingestão em micro-lotes sem compactação. Milhões de arquivos de 1 MB tornam o metadado o gargalo.'
        },
        {
          nav: 'Lakehouse e catálogo', title: 'Lakehouse',
          text: 'Tabelas transacionais adicionam atomicidade, histórico e evolução sobre storage aberto. Diferencie bronze, silver e gold por contrato, não apenas por nome.',
          checklist: [
            'Diferencie as camadas por contrato de qualidade, não por rótulo.',
            'Use tabela transacional quando houver escrita concorrente ou correção retroativa.',
            'Registre o schema e sua evolução no catálogo.'
          ],
          pitfall: 'Bronze, silver e gold como três cópias com o mesmo contrato. A camada só existe se o compromisso de qualidade muda.'
        },
        {
          nav: 'FinOps do armazenamento', title: 'Custo e segurança',
          text: 'Aplique lifecycle, tiering, retenção, criptografia, políticas por prefixo, acesso mínimo e orçamento por domínio.',
          checklist: [
            'Aplique lifecycle automático em vez de limpeza manual.',
            'Atribua orçamento e alerta de custo por domínio.',
            'Conceda acesso mínimo por prefixo e audite o uso.'
          ],
          pitfall: 'Reter tudo indefinidamente porque o armazenamento é barato. O custo aparece na varredura, não na guarda.'
        }
      ],
      sdd: {
        rf: 'RF-004 — Manter cinco anos de eventos brutos consultáveis sob demanda para auditoria.',
        rnf: 'RNF-004 — Tamanho médio de arquivo entre 128 MB e 1 GB; dados com mais de 12 meses em classe fria; custo mensal dentro do orçamento do domínio.',
        adr: 'ADR-STO-01 — Parquet sobre tabela Iceberg, particionado por ano e mês. Alternativa descartada: JSON particionado por dia, que impede pruning por coluna e multiplica arquivos pequenos. Consequência: exige rotina de compactação e manutenção de snapshots.',
        gherkin: 'Dado um diretório com 10 000 arquivos de 1 MB, Quando executo a compactação, Então restam arquivos de pelo menos 128 MB e a mesma consulta lê menos bytes.'
      },
      deliverable: 'Proposta de layout de storage com formato, particionamento, compactação, lifecycle, segurança e estimativa de custo.',
      references: ['Apache Parquet Documentation', 'Delta Lake Protocol', 'Apache Iceberg Documentation', 'Google Cloud Storage — Storage classes']
    },

    12: {
      title: 'Coleta e Extração', date: '08/09/2026',
      subtitle: 'Da origem ao dado bruto com completude, rastreabilidade e reprocessamento seguro.',
      objective: 'Projetar uma extração resiliente para banco, API, arquivo e evento, preservando watermark, schema, auditoria e idempotência.',
      outcomes: [
        'Levantar o contrato de uma fonte antes de escrever qualquer extração.',
        'Escolher entre full load, incremental por timestamp e CDC pela semântica de atualização.',
        'Garantir idempotência e replay de qualquer janela dentro do período de retenção.',
        'Registrar operação suficiente para auditar e reprocessar sem intervenção manual.'
      ],
      sections: [
        {
          nav: 'Perfil das fontes', title: 'Conheça a origem',
          text: 'Mapeie owner, frequência, chave, timezone, semântica de atualização, limites, dados sensíveis e janela de disponibilidade.',
          checklist: [
            'Registre dono, frequência, chave natural, timezone e janela de disponibilidade.',
            'Pergunte se a origem faz exclusão física ou lógica.',
            'Classifique os campos sensíveis antes da primeira extração.'
          ],
          pitfall: 'Assumir que existe um campo de atualização confiável. Muita origem altera a linha sem tocar nesse campo.'
        },
        {
          nav: 'Estratégias de extração', title: 'Estratégias',
          text: 'Full load é simples e caro; incremental por timestamp pode perder atualizações; CDC captura mudanças, mas exige retenção e ordenação.',
          checklist: [
            'Use full load enquanto o volume permitir; é o mais simples de auditar.',
            'Em incremental por timestamp, aceite sobreposição de janela e deduplique.',
            'Adote CDC quando exclusões e correções retroativas importarem.'
          ],
          pitfall: 'Incremental por timestamp em origem que apaga registros. As exclusões nunca chegam e o destino diverge para sempre.'
        },
        {
          nav: 'APIs e paginação', title: 'APIs',
          text: 'Implemente paginação, rate limit, retry com backoff, autenticação, checkpoint e registro da resposta original. Nunca trate HTTP 200 como garantia de completude.',
          checklist: [
            'Implemente retry com backoff exponencial e teto de tentativas.',
            'Persista a resposta original antes de qualquer parsing.',
            'Valide a completude pela contagem declarada, não pelo código de status.'
          ],
          pitfall: 'Parar a paginação no primeiro retorno vazio. Rate limit devolve página vazia e a extração encerra incompleta em silêncio.'
        },
        {
          nav: 'Arquivos e schema drift', title: 'Arquivos',
          text: 'Valide nome, encoding, schema, delimitador, duplicidade, checksum e atomicidade da chegada. Separe landing de processamento.',
          checklist: [
            'Separe landing de processamento e mova só após verificar o checksum.',
            'Valide schema, encoding e delimitador antes de processar.',
            'Trate coluna nova como evento de governança, não como falha silenciosa.'
          ],
          pitfall: 'Ler o arquivo enquanto ele ainda está sendo escrito. A carga sai parcial e parece bem-sucedida.'
        },
        {
          nav: 'Idempotência', title: 'Idempotência',
          text: 'A mesma janela reprocessada deve produzir o mesmo resultado. Use chave natural, batch_id, watermark e deduplicação determinística.',
          checklist: [
            'Identifique cada execução com batch_id e watermark persistidos.',
            'Garanta que reprocessar a mesma janela não altera o volume final.',
            'Deduplique por chave natural com regra determinística de desempate.'
          ],
          pitfall: 'Confiar em DELETE seguido de INSERT fora de transação. A falha no meio deixa o destino vazio.'
        },
        {
          nav: 'Operação e replay', title: 'Operação',
          text: 'Registre início, fim, volume, bytes, status, origem, watermark, erro e localização dos rejeitados para permitir replay.',
          checklist: [
            'Registre início, fim, volume, bytes, status e onde estão os rejeitados.',
            'Mantenha os rejeitados acessíveis para análise, não descartados.',
            'Documente o procedimento de replay e execute-o ao menos uma vez.'
          ],
          pitfall: 'Descartar o registro rejeitado deixando apenas um log de erro. Sem o dado original não há como reprocessar nem explicar.'
        }
      ],
      sdd: {
        rf: 'RF-005 — Ingerir todas as alterações de pedidos da origem, inclusive exclusões e correções retroativas.',
        rnf: 'RNF-005 — Watermark lag ≤ 1 h; taxa de rejeição ≤ 0,1%; qualquer janela dos últimos 30 dias reprocessável sem intervenção manual.',
        adr: 'ADR-ING-01 — CDC sobre o log de transações em vez de incremental por campo de atualização. Contexto: a origem apaga registros e corrige lançamentos com data retroativa. Consequência: exige retenção do log na origem e garantia de ordenação na entrega.',
        gherkin: 'Dado que o batch 2026-09-01 já foi carregado, Quando reprocesso o mesmo batch_id, Então o volume no destino permanece igual e a auditoria registra duas execuções.'
      },
      deliverable: 'Pipeline de extração com contrato da fonte, estratégia incremental justificada, tabela de controle, política de retry e evidência de replay.',
      references: ['Airbyte — Incremental sync concepts', 'Debezium — Change Data Capture', 'RFC 9110 — HTTP Semantics', 'Google SRE — Handling overload']
    },

    13: {
      title: 'Transformação e Carga', date: '10/09/2026',
      subtitle: 'Transformar e publicar dados com contratos, testes e cargas repetíveis.',
      objective: 'Construir uma transformação determinística e uma carga confiável para camadas analíticas, com qualidade e rastreabilidade.',
      outcomes: [
        'Decidir entre ETL e ELT a partir de custo, governança e capacidade computacional.',
        'Escrever transformação determinística e explicar o que a torna reproduzível.',
        'Especificar testes de qualidade que falham antes de a transformação existir.',
        'Escolher a estratégia de carga coerente com a política de histórico da dimensão.'
      ],
      sections: [
        {
          nav: 'ETL ou ELT', title: 'ETL ou ELT',
          text: 'ETL transforma antes do destino; ELT preserva o bruto e usa o warehouse para transformar. Escolha por custo, segurança, governança e capacidade computacional.',
          checklist: [
            'Verifique se o dado bruto precisa ser preservado para auditoria.',
            'Compare o custo de compute no warehouse com o da ferramenta externa.',
            'Considere onde o dado sensível pode legalmente ser processado.'
          ],
          pitfall: 'Transformar antes de guardar o bruto. Quando a regra muda, não há como recalcular o passado.'
        },
        {
          nav: 'Determinismo', title: 'Determinismo',
          text: 'A mesma entrada e os mesmos parâmetros devem gerar a mesma saída. Fixe timezone, arredondamento, regras de nulos, joins e versão do código.',
          checklist: [
            'Fixe timezone, arredondamento e ordenação de forma explícita.',
            'Versione o código e registre a versão que gerou cada carga.',
            'Evite função de data corrente ou aleatoriedade dentro da transformação.'
          ],
          pitfall: 'Usar a data corrente dentro da transformação. O mesmo backfill produz resultado diferente a cada execução.'
        },
        {
          nav: 'Qualidade', title: 'Qualidade',
          text: 'Teste schema, not null, unicidade, relacionamento, accepted values, freshness, volume e reconciliação com a origem.',
          checklist: [
            'Escreva o teste antes da transformação e confirme que ele falha.',
            'Cubra schema, nulos, unicidade, relacionamento e faixa de valores.',
            'Reconcilie totais com a origem e declare a tolerância aceita.'
          ],
          pitfall: 'Testar apenas o que já passa. Teste que nunca falhou não prova nada sobre o pipeline.'
        },
        {
          nav: 'Deduplicação', title: 'Deduplicação',
          text: 'Defina a chave do evento, a ordenação de chegada e a regra para escolher o registro vencedor. Não use DISTINCT como estratégia de negócio.',
          checklist: [
            'Defina a chave do evento e a regra de desempate por escrito.',
            'Prefira o timestamp de origem ao de chegada para ordenar.',
            'Registre quantos registros foram descartados em cada execução.'
          ],
          pitfall: 'Usar DISTINCT para resolver duplicidade. Esconde o problema e apaga diferenças legítimas entre linhas.'
        },
        {
          nav: 'Carga incremental', title: 'Carga',
          text: 'Compare append, overwrite, merge/upsert e snapshot. Escolha conforme histórico, janela de correção e necessidade de atomicidade.',
          checklist: [
            'Alinhe a estratégia de carga à política de histórico da dimensão.',
            'Garanta atomicidade: o consumidor nunca vê carga pela metade.',
            'Defina a janela de correção retroativa suportada.'
          ],
          pitfall: 'Merge sem chave estável. Cada execução cria linha nova e a dimensão duplica em silêncio.'
        },
        {
          nav: 'Orquestração', title: 'Orquestração',
          text: 'Modele dependências, retries, backfill, parâmetros, alertas, SLA, lineage e promoção entre ambientes.',
          checklist: [
            'Modele dependências explícitas em vez de sincronizar por horário.',
            'Torne o retry seguro antes de habilitá-lo.',
            'Promova entre ambientes com o mesmo código e parâmetros distintos.'
          ],
          pitfall: 'Encadear tarefas por agendamento fixo. Quando a anterior atrasa, a seguinte processa dado incompleto.'
        }
      ],
      sdd: {
        rf: 'RF-006 — Calcular receita líquida aplicando desconto progressivo por volume, conforme a regra vigente na data do pedido.',
        rnf: 'RNF-006 — A mesma entrada e os mesmos parâmetros produzem saída idêntica; reconciliação com a origem dentro de ±0,1%; carga visível ao consumidor apenas quando completa.',
        adr: 'ADR-ETL-01 — ELT com transformação no warehouse. Alternativa descartada: transformar na ingestão, o que impediria recalcular o histórico quando a regra de desconto mudar. Consequência: custo de compute no warehouse e necessidade de controlar concorrência entre modelos.',
        gherkin: 'Dado dois eventos com a mesma chave e horários de chegada distintos, Quando executo a deduplicação, Então prevalece o de maior timestamp de origem e o total não é duplicado.'
      },
      deliverable: 'Pipeline ETL/ELT documentado com modelo de entrada e saída, testes de qualidade que falham antes da implementação, estratégia de carga e runbook de reprocessamento.',
      references: ['dbt — Best practices', 'Apache Airflow — Core concepts', 'Kimball — Incremental ETL', 'Great Expectations — Expectations']
    },

    15: {
      title: 'Métricas e Telemetria em ETL', date: '21/09/2026',
      subtitle: 'Operar pipelines como produto: medir, explicar e recuperar.',
      objective: 'Definir observabilidade para ETL com métricas de serviço, qualidade de dados, logs estruturados, lineage e alertas acionáveis.',
      outcomes: [
        'Distinguir métrica, log e trace pelo tipo de pergunta que cada um responde.',
        'Definir SLI e SLO com janela, alvo e consequência operacional.',
        'Medir qualidade do dado por dataset, e não apenas o sucesso da execução.',
        'Conduzir um incidente da triagem ao postmortem com ação preventiva e dono.'
      ],
      sections: [
        {
          nav: 'O que observar', title: 'Observabilidade',
          text: 'Pergunte o que aconteceu, por que aconteceu e qual impacto gerou. Métricas mostram estado; logs explicam eventos; traces mostram caminho.',
          checklist: [
            'Separe a pergunta "o que aconteceu" de "por que aconteceu".',
            'Instrumente a execução e o dado, não apenas a infraestrutura.',
            'Garanta que cada sinal tem dono capaz de agir.'
          ],
          pitfall: 'Monitorar apenas se a tarefa terminou. Pipeline verde entregando dado errado é o pior cenário.'
        },
        {
          nav: 'SLI e SLO', title: 'SLI e SLO',
          text: 'Defina freshness, disponibilidade, latência, completude e sucesso de execução. Um SLO precisa de janela, alvo e consequência operacional.',
          checklist: [
            'Escolha o indicador que o consumidor percebe, não o mais fácil de coletar.',
            'Dê ao SLO janela, alvo e consequência quando violado.',
            'Defina o orçamento de erro e o que ele autoriza.'
          ],
          pitfall: 'Estabelecer SLO de 100%. Sem orçamento de erro, toda oscilação vira incidente e o time deixa de responder.'
        },
        {
          nav: 'Qualidade do dado', title: 'Qualidade',
          text: 'Volume esperado, distribuição, nulos, duplicidade, valores inválidos, reconciliação e drift devem ser medidos por dataset e domínio.',
          checklist: [
            'Defina a faixa esperada de volume por dataset e por dia da semana.',
            'Monitore distribuição e drift, não apenas nulos e duplicidade.',
            'Reconcilie com a origem em cadência fixa.'
          ],
          pitfall: 'Alertar por variação percentual sem considerar sazonalidade. Segunda-feira sempre parecerá anomalia.'
        },
        {
          nav: 'Telemetria e lineage', title: 'Telemetria',
          text: 'Inclua run_id, batch_id, source, model, partition, rows_in, rows_out, rejected, duration, watermark e código de erro.',
          checklist: [
            'Propague run_id e batch_id por todas as etapas.',
            'Registre rows_in, rows_out, rejeitados e duração por modelo.',
            'Mantenha lineage consultável no momento do incidente.'
          ],
          pitfall: 'Log em texto livre sem identificador de execução. Fica impossível correlacionar etapas durante o incidente.'
        },
        {
          nav: 'Alertas acionáveis', title: 'Alertas',
          text: 'Um alerta deve apontar condição, impacto, owner, dashboard e primeira ação. Evite alertar toda anomalia sem severidade ou runbook.',
          checklist: [
            'Todo alerta aponta condição, impacto, dono, painel e primeira ação.',
            'Atribua severidade e defina o que aciona plantão fora do horário.',
            'Revise periodicamente e remova o alerta que ninguém trata.'
          ],
          pitfall: 'Alertar toda anomalia. A fadiga faz o time ignorar justamente o alerta que importa.'
        },
        {
          nav: 'Incidentes', title: 'Incidentes',
          text: 'Faça triagem, contenção, comunicação, replay seguro, validação do dado corrigido e postmortem com ação preventiva.',
          checklist: [
            'Contenha antes de investigar: interrompa a propagação do dado errado.',
            'Comunique o consumidor afetado com impacto e prazo estimado.',
            'Feche com postmortem sem culpado e uma ação preventiva com dono.'
          ],
          pitfall: 'Reprocessar antes de entender a causa. O erro retorna na próxima execução, agora com histórico corrompido.'
        }
      ],
      sdd: {
        rf: 'RF-007 — Detectar e comunicar atraso ou degradação de qualidade antes que o consumidor perceba.',
        rnf: 'RNF-007 — Freshness p95 ≤ 5 min; disponibilidade do serving ≥ 99,9% em janela de 30 dias; alerta entregue ao dono em até 2 min da violação.',
        adr: 'ADR-OBS-01 — Alertar por violação de SLO, não por anomalia isolada. Contexto: o alerta por variação gerava dezenas de notificações diárias e fadiga de plantão. Consequência: oscilações curtas dentro do orçamento de erro não acionam plantão e ficam visíveis apenas no painel.',
        gherkin: 'Dado freshness de 12 min com SLO de 5 min, Quando a violação persiste por 10 min, Então dispara alerta contendo dono, painel e primeira ação.'
      },
      deliverable: 'Painel e runbook de observabilidade com indicadores, SLOs, alertas, severidades, donos e procedimento de recuperação.',
      references: ['Google SRE Workbook — Monitoring', 'OpenTelemetry Documentation', 'Monte Carlo — Data observability concepts', 'Prometheus Documentation']
    },

    16: {
      title: 'Integração do Datawarehouse com a Interface Analítica', date: '23/09/2026',
      subtitle: 'Do dado confiável à experiência analítica que sustenta decisões.',
      objective: 'Projetar a camada de consumo analítico com modelo semântico, métricas governadas, APIs/BI, segurança e desempenho.',
      outcomes: [
        'Partir da decisão do usuário para desenhar a camada de consumo.',
        'Centralizar a definição de métrica e evitar divergência entre relatórios.',
        'Especificar contrato de consumo com versionamento e política de compatibilidade.',
        'Tornar segurança e desempenho verificáveis por cenário de teste.'
      ],
      sections: [
        {
          nav: 'Quem consome e decide', title: 'Comece pela decisão',
          text: 'Mapeie pergunta, usuário, frequência, ação e tolerância de atraso. Um dashboard sem decisão associada vira estoque de gráficos.',
          checklist: [
            'Escreva a pergunta, o usuário, a frequência e a ação decorrente.',
            'Estabeleça a tolerância de atraso aceita para essa decisão.',
            'Descarte o painel que não altera nenhuma ação.'
          ],
          pitfall: 'Construir o painel a partir do dado disponível. Nasce um catálogo de gráficos que ninguém consulta.'
        },
        {
          nav: 'Camada semântica', title: 'Semântica',
          text: 'Centralize definição de métricas, dimensões, filtros, timezone, granularidade e owner. Evite que cada relatório calcule receita de um jeito.',
          checklist: [
            'Defina cada métrica uma única vez, com dono e granularidade.',
            'Fixe timezone e calendário na definição, não no relatório.',
            'Versione a definição e comunique a mudança aos consumidores.'
          ],
          pitfall: 'Cada relatório calcular receita do seu jeito. Duas telas corretas mostram números diferentes na mesma reunião.'
        },
        {
          nav: 'APIs e dashboards', title: 'Serviços',
          text: 'Escolha consulta direta, tabela agregada, API, exportação ou cache conforme latência, volume, segurança e autonomia do consumidor.',
          checklist: [
            'Escolha o modo de entrega pela latência exigida pela decisão.',
            'Limite o custo por consulta e imponha teto de resultado.',
            'Declare o freshness na própria resposta.'
          ],
          pitfall: 'Expor a tabela bruta ao BI. O consumidor recria a regra de negócio e a governança se perde.'
        },
        {
          nav: 'Contrato de consumo', title: 'Contrato',
          text: 'Defina schema, versionamento, paginação, erros, freshness, limites e compatibilidade para APIs e datasets publicados.',
          checklist: [
            'Especifique schema, paginação, erros e limites em OpenAPI.',
            'Versione a interface e defina o que caracteriza mudança incompatível.',
            'Publique a política de depreciação com prazo.'
          ],
          pitfall: 'Renomear um campo sem versionar a interface. Todo consumidor quebra sem aviso prévio.'
        },
        {
          nav: 'Segurança testável', title: 'Segurança',
          text: 'Aplique identidade, RBAC/ABAC, row-level security, mascaramento, auditoria e segregação de ambientes. Segurança precisa ser testável.',
          checklist: [
            'Aplique row-level security na camada semântica, não em cada relatório.',
            'Teste o acesso negado como cenário, igual ao acesso permitido.',
            'Audite consulta a dado sensível com a identidade do solicitante.'
          ],
          pitfall: 'Responder 403 quando o registro existe e vazio quando não existe. A diferença revela a existência do dado.'
        },
        {
          nav: 'Desempenho do consumo', title: 'Desempenho',
          text: 'Use pré-agregação, cache, pruning, limites de consulta e observabilidade de consumo. Meça p95, custo e taxa de erro.',
          checklist: [
            'Pré-agregue no grão que o painel realmente usa.',
            'Meça p95, custo e taxa de erro por consumidor.',
            'Defina o comportamento sob carga: degradar, enfileirar ou recusar.'
          ],
          pitfall: 'Cache sem invalidação declarada. O painel mostra número velho e ninguém sabe quão velho.'
        }
      ],
      sdd: {
        rf: 'RF-008 — Expor receita mensal por região ao painel executivo e à API de parceiros, com uma única definição.',
        rnf: 'RNF-008 — p95 ≤ 800 ms; row-level security por região aplicada e auditada; freshness declarada em cada resposta.',
        adr: 'ADR-BI-01 — Métrica definida uma única vez na camada semântica e consumida por painel e API. Alternativa descartada: cada consumidor calcular a sua, o que já produziu divergência entre relatórios. Consequência: alterar a definição exige versionamento e comunicação formal aos consumidores.',
        gherkin: 'Dado um usuário com acesso apenas à região Norte, Quando consulta a receita da região Sul, Então o resultado vem vazio e a tentativa é registrada na auditoria.'
      },
      deliverable: 'Pacote final de integração: modelo semântico, contrato de consumo, painel ou API, controles de acesso, SLO e evidências de teste.',
      references: ['dbt Semantic Layer — Concepts', 'OpenAPI Specification 3.1', 'OWASP API Security Top 10', 'ISO/IEC 25010:2023']
    }
  };

  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lessonId = document.body.dataset.lesson;
  const lesson = lessons[Number(lessonId)];
  if (!lesson) return;

  // A agenda é derivada de sections — rótulo e texto vêm sempre do mesmo objeto.
  const agenda = lesson.sections.map((s) => ({ nav: s.nav, text: s.text }));
  const checklistOf = (s) => s.checklist.map((c) => `<li>${esc(c)}</li>`).join('');

  const SDD_LABELS = [
    ['rf', 'Requisito funcional', 'o que o sistema deve fazer'],
    ['rnf', 'Requisito não funcional', 'meta mensurável e verificável'],
    ['adr', 'Decisão em ADR', 'por que a arquitetura é esta'],
    ['gherkin', 'Cenário de aceite', 'o teste que falha antes do código']
  ];

  window.module11Lesson = lesson;

  window.renderLessonSlides = function (root) {
    const slides = [
      `<article class="lesson-slide lesson-cover"><span class="lesson-kicker">Módulo 11 · Engenharia de Software · Aula ${esc(lessonId)}</span><h1>${esc(lesson.title)}</h1><p>${esc(lesson.subtitle)}</p><small>Computação 2 · Prof. Afonso Brandão · ${esc(lesson.date)}</small></article>`,

      `<article class="lesson-slide"><span class="lesson-kicker">Agenda</span><h2>Como vamos trabalhar</h2><div class="lesson-grid">${agenda.map((a, i) => `<div class="lesson-card"><b>${String(i + 1).padStart(2, '0')}</b><h3>${esc(a.nav)}</h3><p>${esc(a.text)}</p></div>`).join('')}</div></article>`,

      `<article class="lesson-slide"><span class="lesson-kicker">Objetivo</span><h2>O que você precisa conseguir fazer</h2><div class="lesson-callout"><strong>${esc(lesson.objective)}</strong></div><div class="lesson-grid">${lesson.outcomes.map((o, i) => `<div class="lesson-card"><b>Resultado ${i + 1}</b><p>${esc(o)}</p></div>`).join('')}</div></article>`,

      ...lesson.sections.map((s, i) => `<article class="lesson-slide"><span class="lesson-kicker">Bloco ${i + 1} · ${esc(s.nav)}</span><h2>${esc(s.title)}</h2><div class="lesson-split"><div class="lesson-card"><p>${esc(s.text)}</p></div><div class="lesson-card"><h3>Checklist de aplicação</h3><ul>${checklistOf(s)}</ul></div></div><div class="lesson-warn"><strong>Erro comum:</strong> ${esc(s.pitfall)}</div></article>`),

      ...(lesson.sdd ? [`<article class="lesson-slide"><span class="lesson-kicker">Ponte com a Aula 1 · Spec-Driven Development</span><h2>Como este tema vira especificação</h2><div class="lesson-grid">${SDD_LABELS.map(([k, label, hint]) => `<div class="lesson-card"><b>${esc(label)}</b><h3 class="lesson-hint">${esc(hint)}</h3><p>${esc(lesson.sdd[k])}</p></div>`).join('')}</div></article>`] : []),

      `<article class="lesson-slide"><span class="lesson-kicker">Laboratório</span><h2>Entregável da aula</h2><div class="lesson-callout"><strong>${esc(lesson.deliverable)}</strong></div><div class="lesson-card lesson-wide"><h3>Critérios de aceite</h3><ol><li>O artefato declara o requisito funcional e ao menos um requisito não funcional mensurável.</li><li>A decisão estrutural está registrada em ADR, com alternativa descartada e consequência.</li><li>Existe ao menos um cenário de aceite que falha antes da implementação.</li><li>Há dono, forma de operação e caminho de reprocessamento.</li></ol></div></article>`,

      `<article class="lesson-slide"><span class="lesson-kicker">Fechamento</span><h2>Leve para o projeto</h2><div class="lesson-grid">${lesson.references.map((x, i) => `<div class="lesson-card"><b>Ref. ${i + 1}</b><p>${esc(x)}</p></div>`).join('')}</div><div class="lesson-callout">A pergunta final: <strong>qual decisão fica mais segura depois deste artefato?</strong></div></article>`
    ];
    root.innerHTML = slides.join('');
    return slides.length;
  };

  window.renderLessonMaterial = function (root) {
    const sdd = lesson.sdd
      ? `<section class="material-box"><h2>Ponte com a Aula 1 — como este tema vira especificação</h2><p>Os conceitos abaixo não são acessórios da aula: são a forma pela qual o tema entra na especificação do projeto, no vocabulário estabelecido na Aula 1.</p><div class="material-sdd">${SDD_LABELS.map(([k, label, hint]) => `<div><b>${esc(label)} — ${esc(hint)}</b>${esc(lesson.sdd[k])}</div>`).join('')}</div></section>`
      : '';

    root.innerHTML = `<header class="material-head"><span>Módulo 11 · Engenharia de Software · Computação 2</span><h1>${esc(lesson.title)}</h1><p>${esc(lesson.subtitle)} · Prof. Afonso Brandão · ${esc(lesson.date)}</p></header><div class="material-body">`
      + `<section class="material-box"><h2>Objetivo da aula</h2><p>${esc(lesson.objective)}</p><h3>Ao final você deve conseguir</h3><ul>${lesson.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></section>`
      + `<section class="material-box"><h2>Roteiro</h2><ol>${agenda.map((a) => `<li><strong>${esc(a.nav)}</strong> — ${esc(a.text)}</li>`).join('')}</ol></section>`
      + lesson.sections.map((s, i) => `<section class="material-section"><h2>${i + 1}. ${esc(s.title)}</h2><p>${esc(s.text)}</p><h3>Checklist de aplicação</h3><ul>${checklistOf(s)}</ul><div class="material-note"><strong>Erro comum:</strong> ${esc(s.pitfall)}</div></section>`).join('')
      + sdd
      + `<section class="material-box"><h2>Entregável e avaliação</h2><p>${esc(lesson.deliverable)}</p><ul><li>Clareza do problema e do contrato: 25%</li><li>Correção técnica e tratamento de exceções: 30%</li><li>Testabilidade, qualidade e operação: 25%</li><li>Comunicação e justificativa das decisões: 20%</li></ul></section>`
      + `<section class="material-box"><h2>Referências</h2><ul>${lesson.references.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section></div>`;
  };

  window.renderLessonPlan = function (root) {
    const sdd = lesson.sdd
      ? `<section><h2>Articulação com a Aula 1 (Spec-Driven Development)</h2><ul>${SDD_LABELS.map(([k, label]) => `<li><strong>${esc(label)}:</strong> ${esc(lesson.sdd[k])}</li>`).join('')}</ul></section>`
      : '';

    root.innerHTML = `<header class="plan-head"><span>Módulo 11 · Plano de Ensino</span><h1>Aula ${esc(lessonId)} — ${esc(lesson.title)}</h1><p>Professor: Afonso Brandão · ${esc(lesson.date)}</p></header><main class="plan-body">`
      + `<section><h2>Ementa</h2><p>${esc(lesson.subtitle)} ${esc(lesson.objective)}</p></section>`
      + `<section><h2>Objetivos de aprendizagem</h2><ul>${lesson.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></section>`
      + `<section><h2>Metodologia e cronograma</h2><ol>${agenda.map((a) => `<li><strong>${esc(a.nav)}:</strong> ${esc(a.text)}</li>`).join('')}</ol></section>`
      + sdd
      + `<section><h2>Avaliação</h2><p>Entrega individual ou em grupo do artefato descrito no material, com apresentação curta e revisão por pares. ${esc(lesson.deliverable)}</p><ul><li>Clareza do problema e do contrato: 25%</li><li>Correção técnica e tratamento de exceções: 30%</li><li>Testabilidade, qualidade e operação: 25%</li><li>Comunicação e justificativa das decisões: 20%</li></ul></section>`
      + `<section><h2>Bibliografia</h2><ul>${lesson.references.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section></main>`;
  };
})();
