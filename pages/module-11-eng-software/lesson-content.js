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

    2: {
      title: 'Modelagem de Data Warehouse I', date: '10/08/2026',
      professor: 'Hermano Peixoto', discipline: 'Computação 1',
      subtitle: 'Do banco operacional ao banco analítico: fundamentos de Data Warehouse e o vocabulário da modelagem dimensional.',
      objective: 'Diferenciar sistemas operacionais e analíticos, aplicar os fundamentos da modelagem dimensional e iniciar, no projeto do próprio squad, a identificação de processos de negócio, fatos e dimensões candidatos.',
      outcomes: [
        'Explicar a função de um Data Warehouse no apoio à tomada de decisão, em contraste com um banco operacional.',
        'Diferenciar sistemas OLTP e OLAP quanto a objetivo, estrutura e desempenho.',
        'Descrever a modelagem dimensional como abordagem central de um Data Warehouse, incluindo star e snowflake schema.',
        'Identificar os papéis da tabela fato e das tabelas dimensão em um processo de negócio.',
        'Avaliar granularidade e integridade referencial como critérios de qualidade de um modelo dimensional.',
        'Agrupar perguntas de negócio reais por processo para esboçar cubos analíticos candidatos.'
      ],
      timebox: [
        { label: 'Teoria — fundamentos de Data Warehouse e modelagem dimensional', minutes: 40 },
        { label: 'Atividade guiada — nota fiscal do supermercado (exemplo resolvido)', minutes: 35 },
        { label: 'Atividade do projeto — Data Model Canvas do squad', minutes: 45 }
      ],
      preClass: [
        {
          title: 'Data Warehouse: o que é? Conceitos e fundamentos de DW',
          topics: ['Definição e objetivo do DW', 'Vantagens, desvantagens e características', 'Segurança', 'Visões de Kimball e Inmon', 'Data Warehouse × Data Mart', 'DW versus BI', 'OLAP × Data Warehouse', 'Etapas de criação de um DW', 'Data Lake × Data Warehouse', 'Data Warehouse Toolkit (Kimball)'],
          url: 'https://cetax.com.br/data-warehouse/'
        },
        {
          title: 'O que é modelagem de dados dimensionais?',
          topics: ['Origem e conceito da modelagem dimensional', 'Estrutura do modelo dimensional', 'Exemplo prático', 'Processo de modelagem em etapas', 'Modelo multidimensional (cubos de dados)', 'Benefícios e limitações da abordagem'],
          url: 'https://www.astera.com/pt/knowledge-center/dimensional-modeling-guide/'
        },
        {
          title: 'Características de um Data Warehouse — OLTP vs OLAP',
          topics: ['Diferença entre OLTP e OLAP', 'Papel de um Data Warehouse', 'Características fundamentais de um DW', 'Modelo dimensional como base do OLAP', 'Fluxo ETL para preencher o DW'],
          url: 'https://www.youtube.com/watch?v=d85QJThmqVo&t=8s'
        },
        {
          title: 'Modelagem do Data Warehouse — Introdução',
          topics: ['Importância do DW na Ciência de Dados', 'Esquemas estrela e floco-de-neve', 'Tabelas de fatos e dimensões', 'Granularidade dos dados', 'Processo de ETL', 'Benefícios da modelagem dimensional'],
          url: 'https://www.youtube.com/watch?v=8I2nYKb73Yo&t=1s'
        }
      ],
      sections: [
        {
          nav: 'Por que um Data Warehouse', title: 'DW e a tomada de decisão',
          text: 'Um Data Warehouse existe para sustentar decisão, não para operar transações. Ele consolida dados de múltiplas fontes operacionais em uma estrutura otimizada para consulta analítica, histórico e comparação — o oposto do desenho de um banco transacional.',
          checklist: [
            'Identifique, no seu projeto, uma decisão que hoje depende de cruzamento manual entre planilhas ou ferramentas.',
            'Separe o dado que serve para operar do dado que serve para decidir.',
            'Aponte quais fontes operacionais do seu projeto alimentariam o Data Warehouse.'
          ],
          pitfall: 'Tratar o DW como "mais um banco de dados". Sem propósito analítico declarado, ele só reproduz os mesmos problemas do banco operacional em outra tecnologia.'
        },
        {
          nav: 'OLTP vs OLAP', title: 'Dois bancos, dois propósitos',
          text: 'Sistemas OLTP priorizam transações curtas, normalização e concorrência de escrita. Sistemas OLAP priorizam leitura analítica, desnormalização controlada e consultas que agregam grandes volumes históricos.',
          checklist: [
            'Classifique cada fonte de dado do seu projeto como predominantemente OLTP ou OLAP.',
            'Explique por que uma consulta analítica pesada direto no banco operacional arrisca a operação.',
            'Justifique por que redundância controlada é aceitável em OLAP e indesejada em OLTP.'
          ],
          pitfall: 'Rodar relatórios analíticos pesados direto no banco operacional. A concorrência entre transação e consulta analítica degrada os dois usos ao mesmo tempo.'
        },
        {
          nav: 'Modelagem dimensional', title: 'A abordagem central do DW',
          text: 'A modelagem dimensional organiza o Data Warehouse em torno de processos de negócio, medidos por fatos e descritos por dimensões. Star schema e snowflake schema são as duas formas físicas mais comuns de implementar essa estrutura.',
          checklist: [
            'Escolha um processo de negócio do seu projeto — não uma tabela já existente — como ponto de partida.',
            'Diferencie star schema e snowflake schema pelo grau de normalização das dimensões.',
            'Explique por que a modelagem dimensional favorece a consulta em vez da economia de espaço.'
          ],
          pitfall: 'Copiar o modelo entidade-relacionamento operacional direto para o DW. O modelo operacional otimiza escrita; o modelo dimensional otimiza leitura analítica — são estruturas diferentes por design, não por acidente.'
        },
        {
          nav: 'Tabelas fato e dimensão', title: 'Fatos e dimensões',
          text: 'A tabela fato armazena os eventos mensuráveis — as métricas — no grão escolhido. As tabelas dimensão armazenam o contexto descritivo que permite filtrar, agrupar e explicar essas métricas.',
          checklist: [
            'Para cada fato candidato, escreva a métrica numérica que ele mede.',
            'Para cada dimensão candidata, liste os atributos descritivos que ela traria.',
            'Verifique que toda dimensão candidata responderia a uma pergunta de negócio real do seu projeto.'
          ],
          pitfall: 'Colocar um atributo puramente descritivo dentro da tabela fato. Isso infla a fato e impede reaproveitar a dimensão em outro processo de negócio.'
        },
        {
          nav: 'Granularidade e integridade', title: 'Grão e integridade',
          text: 'O grão declara o que uma linha da fato representa. Sem essa frase explícita, métricas se misturam em níveis diferentes e joins produzem contagem duplicada. Integridade referencial garante que toda chave da fato exista na dimensão correspondente.',
          checklist: [
            'Escreva o grão do seu fato candidato em uma frase no singular: "uma linha representa…".',
            'Confirme que toda métrica do fato existe de fato nesse grão.',
            'Verifique que nenhuma chave estrangeira da fato pode apontar para um valor ausente na dimensão.'
          ],
          pitfall: 'Definir o grão depois de escolher as colunas disponíveis. O grão nasce do processo de negócio, não da tabela de origem que já existe.'
        },
        {
          nav: 'Das perguntas aos cubos', title: 'Do negócio ao cubo analítico',
          text: 'Cada cubo analítico nasce de um grupo de perguntas de negócio que compartilham o mesmo processo e o mesmo grão candidato. Antes de desenhar qualquer tabela, agrupar essas perguntas por processo já indica quantos cubos o projeto provavelmente precisa.',
          checklist: [
            'Agrupe as perguntas de negócio do seu projeto por processo, não pela área que perguntou.',
            'Para cada grupo, identifique se as perguntas pedem contagem, duração, taxa ou soma.',
            'Nomeie o cubo candidato pelo processo que ele mede, não pela tabela de origem disponível.'
          ],
          pitfall: 'Criar um cubo por pergunta isolada. Perguntas diferentes que compartilham o mesmo grão devem virar um único cubo, não vários fatos redundantes.'
        }
      ],
      sdd: {
        rf: 'RF-101 — Permitir consultar a taxa de adesão de uma pesquisa por empresa e por período, sem depender de cruzamento manual em planilha.',
        rnf: 'RNF-101 — O grão do cubo de participação é único por combinação de pesquisa, empresa e respondente; nenhuma chave da fato referencia uma dimensão ausente.',
        adr: 'ADR-DW-00 — Modelar por processo de negócio (o ciclo de vida da pesquisa) em vez de espelhar as tabelas de origem. Alternativa descartada: manter o esquema idêntico ao das planilhas e sistemas atuais, o que reproduziria a fragmentação existente em outra tecnologia. Consequência: cada fonte precisa ser mapeada para o fato e as dimensões do cubo antes de qualquer carga.',
        gherkin: 'Dado um cubo de participação em pesquisas modelado com grão por respondente, Quando uma nova pesquisa é encerrada, Então a taxa de adesão por empresa pode ser calculada sem alterar a estrutura do modelo.'
      },
      warmup: {
        title: 'Atividade guiada — nota fiscal do supermercado',
        duration: '35 min · antes da atividade do projeto',
        goal: 'Aplicar o método a um caso conhecido e totalmente resolvido, para chegar na atividade do projeto já com o modelo dimensional na mão.',
        intro: 'Esta parte usa uma nota fiscal de supermercado sintetizada — fictícia, mas com valores e itens realistas — como exemplo de trabalho. Diferente da atividade do projeto, aqui o professor resolve o modelo junto com a turma: o objetivo é praticar o método antes de aplicá-lo a um problema aberto.',
        receipt: {
          store: { name: 'Mercado Vale Verde Ltda', cnpj: '12.345.678/0001-90', address: 'Rua das Palmeiras, 450 — Centro — Vale Verde/SP', doc: 'Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica (NFC-e)' },
          meta: '05/08/2026 18:42:10 · Loja 02 · PDV 05 · Doc 004821 · Operador: Silva',
          items: [
            { desc: 'Água mineral 1,5L c/gás', qty: '2 UN', unit: '3,50', total: '7,00' },
            { desc: 'Refrigerante cola 2L', qty: '1 UN', unit: '8,90', total: '8,90' },
            { desc: 'Iogurte natural morango 170g', qty: '4 UN', unit: '2,80', total: '11,20' },
            { desc: 'Leite UHT integral 1L', qty: '6 UN', unit: '4,60', total: '27,60' },
            { desc: 'Desconto campanha (leite) −15%', qty: '—', unit: '—', total: '−4,14' },
            { desc: 'Café torrado e moído 500g', qty: '1 UN', unit: '18,90', total: '18,90' },
            { desc: 'Arroz branco tipo 1 5kg', qty: '1 UN', unit: '24,90', total: '24,90' },
            { desc: 'Feijão carioca 1kg', qty: '2 UN', unit: '7,50', total: '15,00' },
            { desc: 'Farinha de trigo 1kg', qty: '1 UN', unit: '5,20', total: '5,20' },
            { desc: 'Peito de frango', qty: '1,850 kg', unit: '14,90', total: '27,57' },
            { desc: 'Tomate', qty: '0,760 kg', unit: '6,80', total: '5,17' },
            { desc: 'Banana prata', qty: '1,230 kg', unit: '5,50', total: '6,77' },
            { desc: 'Pão francês', qty: '0,420 kg', unit: '16,80', total: '7,06' },
            { desc: 'Detergente líquido 500ml', qty: '3 UN', unit: '2,30', total: '6,90' },
            { desc: 'Papel higiênico 12 rolos', qty: '1 UN', unit: '22,90', total: '22,90' }
          ],
          totalItems: 14,
          totalValue: '190,93',
          payment: 'Cartão de débito · Valor pago R$ 190,93',
          footer: ['Consumidor — CPF 123.456.789-00 (exemplo fictício)', 'NFC-e nº 000456 · Série 001 · 05/08/2026 18:42:10', 'Protocolo de autorização: 135260000012345 (fictício)']
        },
        note: 'Loja, endereço, CNPJ, CPF e chave de nota são fictícios — sintetizados para este exercício, e não a transcrição de um documento real.',
        questions: [
          'Qual o produto (ou categoria) mais vendido, por loja e por período?',
          'Qual o ticket médio por cliente e como ele varia por forma de pagamento?',
          'Qual o impacto de uma campanha promocional no volume vendido do produto descontado?',
          'Qual a participação de cada departamento (bebidas, laticínios, hortifruti, carnes, padaria, limpeza) no faturamento?',
          'Como o mix de compra varia por dia da semana e por horário?'
        ],
        model: {
          grao: 'Uma linha representa um item vendido dentro de um cupom fiscal — um produto, em uma data e hora, em uma loja, por um operador de caixa, dentro de uma venda.',
          fato: 'Fato_Venda_Item',
          metricas: ['Quantidade vendida (aditiva)', 'Valor de desconto (aditiva)', 'Valor total do item (aditiva)', 'Valor unitário (não aditiva — nunca some valores unitários entre linhas)'],
          dimensoes: [
            { nome: 'Produto', hierarquia: 'Produto → Subcategoria → Categoria → Departamento' },
            { nome: 'Tempo', hierarquia: 'Data → Mês → Trimestre → Ano (mais o atributo Hora do dia)' },
            { nome: 'Loja', hierarquia: 'Loja → Cidade → Região' },
            { nome: 'Cliente', hierarquia: 'CPF quando informado; "não identificado" quando ausente na nota' },
            { nome: 'Operador de caixa', hierarquia: 'sem hierarquia adicional' },
            { nome: 'Forma de pagamento', hierarquia: 'sem hierarquia adicional' },
            { nome: 'Campanha promocional', hierarquia: 'dimensão degenerada — indicador de desconto aplicado ao item' }
          ],
          esquema: 'Estrela (star schema): nenhuma dimensão acima exige normalização adicional para esta primeira modelagem.'
        },
        transition: 'Guarde este modelo como referência — grão, fato, métricas e dimensões seguem o mesmo raciocínio que vocês vão aplicar agora ao projeto, mas o cubo do projeto ninguém resolve por vocês.'
      },
      activity: {
        title: 'Atividade em sala — Iniciando a modelagem do DW do projeto',
        duration: '45 min · última parte da aula',
        goal: 'Rascunhar, no Data Model Canvas do projeto, ao menos um cubo analítico candidato: grão, fatos/métricas candidatos e dimensões candidatas.',
        intro: 'Com o método praticado na nota fiscal, o trabalho agora é sobre o projeto do seu squad. Tenha em mãos a TAPI do projeto e, se possível, o dmc.json já iniciado. O professor circula para orientar — peça direcionamento sempre que travar, mas a modelagem é do grupo.',
        steps: [
          { title: 'Reúna as perguntas', text: 'Levante as perguntas de negócio da TAPI do seu projeto (seção de perguntas de negócio ou equivalente). Não invente perguntas novas agora — parta do que a área parceira já perguntou.' },
          { title: 'Agrupe por processo', text: 'Agrupe as perguntas por processo de negócio, não por quem perguntou. Perguntas que dependem do mesmo evento de origem tendem a virar o mesmo cubo.' },
          { title: 'Declare o grão candidato', text: 'Para cada grupo, escreva o grão candidato em uma frase no singular. Teste o grão perguntando se toda pergunta do grupo pode ser respondida agregando linhas nesse nível.' },
          { title: 'Nomeie o cubo', text: 'Nomeie o cubo pelo processo de negócio que ele mede — não pela tabela ou planilha de origem disponível hoje.' },
          { title: 'Liste fatos e métricas candidatos', text: 'No grão declarado, liste o que se conta, soma, mede ou calcula: contagens, durações, taxas e valores.' },
          { title: 'Liste dimensões candidatas', text: 'Liste os eixos pelos quais alguém vai querer filtrar ou agrupar essa métrica: quem, o quê, quando, onde, como.' },
          { title: 'Registre no canvas', text: 'Abra o Data Model Canvas do módulo e registre o cubo — repita o processo para quantos cubos candidatos surgirem.' }
        ],
        checks: [
          'Essa métrica existe de fato nesse grão, ou pertence a um grão mais fino ou mais grosso?',
          'Duas perguntas do grupo pedem métricas em unidades diferentes (contagem vs. duração)? Isso é normal dentro do mesmo cubo, desde que compartilhem o grão.',
          'Essa dimensão poderia ser reaproveitada por outro cubo do mesmo projeto — ela é candidata a dimensão conformada?'
        ],
        avoid: [
          'Não comece pela planilha ou tabela disponível; comece pela pergunta de negócio.',
          'Não crie um cubo por pergunta isolada — agrupe antes de nomear.',
          'Não tente resolver granularidade fina, SCD ou performance nesta aula: o foco de hoje é grão, fatos e dimensões candidatos. Isso continua nas próximas aulas de modelagem de DW.'
        ],
        worked: {
          text: 'Este raciocínio usa perguntas reais de um projeto do módulo — a Central de Pesquisas de um sindicato setorial — só para ilustrar o método. Ele não resolve o cubo do seu projeto.',
          questions: [
            '"Quantas pesquisas foram realizadas por período?"',
            '"Qual a taxa de adesão por pesquisa e por empresa?"',
            '"Qual o tempo médio de tabulação das respostas?"'
          ],
          note: 'As duas primeiras perguntas compartilham o mesmo processo — a participação de uma empresa em uma pesquisa — o que sugere que pertencem ao mesmo cubo. A terceira mede outro evento, a etapa de tabulação, o que sugere um grão e possivelmente um cubo diferentes. Confirmar isso — e ir além dele — é o trabalho do seu grupo com o próprio projeto.'
        },
        tool: { label: 'Abrir o Data Model Canvas', href: '../data-model-canvas.html' },
        acceptance: [
          'O canvas tem ao menos um cubo com nome e grão declarados em uma frase no singular.',
          'O cubo lista ao menos um fato/métrica candidato coerente com o grão.',
          'O cubo lista ao menos uma dimensão candidata coerente com o grão.',
          'O grupo consegue justificar, em voz alta, por que aquelas perguntas de negócio pertencem ao mesmo cubo.'
        ]
      },
      deliverable: 'Um rascunho do Data Model Canvas do projeto com ao menos um cubo analítico candidato: grão declarado, fatos/métricas candidatos e dimensões candidatas. Não é necessário completar SCD, otimização ou governança do cubo nesta aula.',
      references: ['Kimball & Ross — The Data Warehouse Toolkit', 'Inmon — Building the Data Warehouse', 'Cetax — Data Warehouse: conceitos e fundamentos', 'Astera — Guia de modelagem de dados dimensionais']
    },

    3: {
      title: 'Modelagem de Data Warehouse II', date: '12/08/2026',
      professor: 'Hermano Peixoto', discipline: 'Computação 1',
      subtitle: 'Star schema, snowflake schema e o ciclo de vida de um modelo dimensional maduro.',
      objective: 'Aplicar os critérios de normalização, comparação e ciclo de vida da modelagem dimensional para decidir, com justificativa, entre star schema e snowflake schema em cada dimensão do Data Warehouse do projeto.',
      outcomes: [
        'Descrever a estrutura e as características de um star schema, incluindo o papel da tabela fato e das dimensões desnormalizadas.',
        'Explicar o snowflake schema e sua relação com a normalização das tabelas dimensão.',
        'Comparar vantagens e desvantagens entre star schema e snowflake schema por critério: desempenho de consulta, redundância, integridade e manutenção.',
        'Projetar esquemas relacionais de Data Warehouse aplicando star schema e snowflake schema conforme a hierarquia de cada dimensão.',
        'Identificar boas práticas de modelagem e documentação de esquemas dimensionais.',
        'Descrever o ciclo de vida de modelagem de um Data Warehouse, do levantamento de requisitos à manutenção contínua.',
        'Aplicar os conceitos de star e snowflake schema aos cubos do Data Warehouse do próprio projeto, iniciados na Aula 2.',
        'Avaliar escalabilidade, flexibilidade e desempenho de star e snowflake schema em cenários reais de plataforma analítica.'
      ],
      timebox: [
        { label: 'Teoria — star schema, snowflake schema, boas práticas e ciclo de vida da modelagem de DW', minutes: 60 },
        { label: 'Atividade do projeto — formalização do esquema dimensional no Data Model Canvas', minutes: 60 }
      ],
      preClass: [
        {
          title: 'Esquema em estrela versus esquema em floco de neve: diferenças e casos de uso',
          topics: ['Introdução aos esquemas dimensionais', 'O que é star schema', 'Vantagens e desvantagens do star schema', 'O que é snowflake schema', 'Vantagens e limitações do snowflake schema', 'Comparativo estruturado star versus snowflake', 'Casos de uso recomendados', 'Exemplos em SQL'],
          url: 'https://www.datacamp.com/pt/blog/star-schema-vs-snowflake-schema'
        },
        {
          title: '20 práticas recomendadas de data warehouse',
          topics: ['Otimização de performance', 'Segurança e governança', 'Arquitetura com escalabilidade', 'Automação', 'Qualidade de dados', 'Processo de ETL robusto', 'Planejamento estratégico e time especializado', 'Ferramentas, recursos técnicos, testes e validações'],
          url: 'https://www.astera.com/pt/type/blog/data-warehouse-best-practices'
        },
        {
          title: 'Data Warehouse: requisitos e metodologias de modelagem',
          topics: ['Dados, informação e conhecimento; gestão da informação versus gestão do conhecimento', 'Definição e características de um Data Warehouse: orientado a assunto, integrado, temporal, não volátil', 'Modelagem entidade-relacionamento e modelagem multidimensional (star e snowflake)', 'Metadados, data mart e granularidade de dados', 'Arquiteturas top-down e bottom-up e o processo de data warehousing (ETL)', 'Abordagens de levantamento de requisitos: orientada a dados, a requisitos e a metas', 'Metodologias de desenvolvimento focadas em requisitos: Hadden-Kelly, Business Development Lifecycle, Golfarelli & Rizzi, Conceptual Data Warehouse Design, Iterations'],
          url: 'https://www.maxwell.vrac.puc-rio.br/15136/15136_4.PDF'
        },
        {
          title: 'Boas práticas para modelagem de dados no BigQuery utilizando esquemas star/snowflake',
          topics: ['Introdução aos esquemas star e snowflake', 'Princípios de modelagem no BigQuery', 'Dicas para dimensões', 'Otimização da tabela de fatos', 'Teste e refinamento de performance'],
          url: 'https://medium.com/@nayyarabernardo/boas-pr%C3%A1ticas-para-modelagem-de-dados-no-bigquery-utilizando-esquemas-star-snowflake-d8399c178ac6'
        }
      ],
      sections: [
        {
          nav: 'Star Schema', title: 'Star Schema: estrutura e características',
          text: 'O star schema organiza a tabela fato no centro, ligada diretamente a tabelas dimensão desnormalizadas. Cada dimensão concentra todos os seus atributos descritivos em uma única tabela, mesmo quando esses atributos formam uma hierarquia natural.',
          checklist: [
            'Verifique que cada dimensão do seu cubo está representada em uma única tabela, sem tabelas intermediárias.',
            'Confirme que a tabela fato referencia as dimensões por chave substituta, não pela chave natural da origem.',
            'Liste os atributos hierárquicos que hoje estão todos dentro da mesma tabela dimensão, como categoria e departamento dentro de produto.'
          ],
          pitfall: 'Tratar star schema como "o esquema simples" sem avaliar o custo da redundância. Redundância controlada é uma troca deliberada por desempenho de leitura, não uma ausência de modelagem.'
        },
        {
          nav: 'Snowflake Schema', title: 'Snowflake Schema e normalização das dimensões',
          text: 'O snowflake schema normaliza as tabelas dimensão em múltiplos níveis hierárquicos, cada um em sua própria tabela relacionada por chave estrangeira. Reduz redundância, mas aumenta o número de joins necessários para responder a uma consulta.',
          checklist: [
            'Identifique, em cada dimensão candidata, os níveis hierárquicos que poderiam virar tabelas separadas.',
            'Estime quantos joins adicionais a normalização de uma dimensão específica introduziria em uma consulta típica.',
            'Verifique se a redundância eliminada corresponde a um volume de dados que justifica a normalização.'
          ],
          pitfall: 'Normalizar uma dimensão pequena e estável só porque normalização é apresentada como boa prática geral. O ganho de espaço é irrelevante quando a tabela tem poucas linhas e muda raramente.'
        },
        {
          nav: 'Star × Snowflake', title: 'Comparando as duas abordagens',
          text: 'Star schema favorece consultas mais simples e rápidas ao custo de redundância; snowflake schema favorece integridade e economia de espaço ao custo de mais joins. A escolha é por dimensão, não uma decisão única para todo o Data Warehouse.',
          checklist: [
            'Para cada dimensão do seu cubo, registre se a prioridade é velocidade de consulta ou economia de espaço e integridade.',
            'Verifique se a ferramenta de consulta ou BI do seu projeto penaliza consultas com muitos joins.',
            'Documente a decisão por dimensão, não como uma regra geral aplicada a todo o modelo.'
          ],
          pitfall: 'Escolher um esquema único para todo o Data Warehouse por convenção da equipe. Dimensões diferentes, dentro do mesmo cubo, podem justificar escolhas diferentes.'
        },
        {
          nav: 'Boas práticas de modelagem', title: 'Boas práticas de modelagem e documentação',
          text: 'Nomenclatura consistente, chave substituta, granularidade documentada, versionamento do modelo e testes de qualidade sustentam um esquema dimensional, independentemente de star ou snowflake ser a escolha.',
          checklist: [
            'Padronize prefixos e nomes de tabela (fato_, dimensao_) e aplique-os a todos os cubos do projeto, não só ao mais recente.',
            'Documente a granularidade e a estrutura escolhida junto da definição de cada cubo, não em um documento separado.',
            'Associe cada dimensão a um teste mínimo de qualidade, como unicidade de chave e ausência de referência quebrada.'
          ],
          pitfall: 'Tratar documentação como etapa posterior à modelagem. Sem registro no momento da decisão, a justificativa se perde e a próxima pessoa repete a discussão.'
        },
        {
          nav: 'Ciclo de vida do DW', title: 'O ciclo de vida da modelagem de um Data Warehouse',
          text: 'A modelagem de um Data Warehouse não termina na primeira versão do esquema: passa por levantamento de requisitos, modelagem conceitual, lógica e física, e manutenção contínua conforme novas perguntas de negócio surgem. Metodologias como Hadden-Kelly, o Business Development Lifecycle e o Conceptual Data Warehouse Design formalizam essas etapas.',
          checklist: [
            'Identifique em qual etapa do ciclo de vida de modelagem o cubo do seu projeto está hoje.',
            'Distinga levantamento de requisitos orientado a dados, orientado a requisitos e orientado a metas, e identifique qual predominou no seu caso.',
            'Aponte o que falta para o cubo avançar da etapa atual para a próxima.'
          ],
          pitfall: 'Tratar a primeira versão do esquema como definitiva. Um Data Warehouse maduro é revisado a cada novo requisito de negócio, não construído uma única vez.'
        },
        {
          nav: 'Escalabilidade e desempenho', title: 'Avaliando escalabilidade, flexibilidade e desempenho',
          text: 'A escolha entre star e snowflake também depende da plataforma de execução: engines colunares modernos, como o BigQuery, toleram desnormalização com pruning eficiente, o que costuma favorecer star mesmo quando a normalização pareceria mais adequada apenas no papel.',
          checklist: [
            'Verifique qual engine ou banco o projeto usará para consultar o Data Warehouse.',
            'Avalie se a plataforma penaliza joins entre múltiplas tabelas de dimensão normalizadas.',
            'Estime se o volume de dados do seu projeto realmente justifica a economia de espaço da normalização.'
          ],
          pitfall: 'Escolher snowflake por presumir que "escala melhor" sem testar. Em plataformas colunares, mais joins costuma custar mais do que a redundância evitada.'
        }
      ],
      sdd: {
        rf: 'RF-102 — Permitir consultar métricas por qualquer nível hierárquico de uma dimensão, como produto, subcategoria e categoria, sem exigir remodelagem da tabela fato a cada novo nível de análise.',
        rnf: 'RNF-102 — A estrutura escolhida, star ou snowflake, está documentada por dimensão, com a justificativa da normalização registrada no Data Model Canvas do projeto.',
        adr: 'ADR-DW-03 — Star schema como padrão para as dimensões do cubo de participação, com normalização (snowflake) restrita a dimensões de hierarquia extensa e alta repetição de atributos. Alternativa descartada: normalizar todas as dimensões por padrão, o que multiplicaria joins sem ganho de espaço relevante no volume atual do projeto. Consequência: a decisão precisa ser revisitada caso o volume de dados cresça significativamente.',
        gherkin: 'Dado um cubo com a dimensão Produto modelada em snowflake, Quando um analista consulta o total vendido agrupado por categoria, Então o resultado é obtido por join entre fato, produto e categoria, sem alterar a tabela fato.'
      },
      activity: {
        title: 'Atividade em sala — Formalizando o esquema dimensional do projeto',
        duration: '60 min · segunda metade da aula',
        goal: 'Para os cubos já esboçados no Data Model Canvas, decidir e justificar o esquema — star ou snowflake — de cada dimensão, aplicando os critérios de normalização e as boas práticas apresentadas.',
        intro: 'Retome o Data Model Canvas iniciado na Aula 2. O trabalho agora não é criar cubos novos, mas aprofundar cada cubo já esboçado — Grão, Estrutura, Fatos/Eventos, Métricas, Dimensões e Dimensões especiais — decidindo star ou snowflake para cada dimensão e registrando a justificativa. O professor circula para orientar: peça direcionamento sempre que travar, mas a decisão e a justificativa são do grupo.',
        steps: [
          { title: 'Reabra o canvas', text: 'Abra o dmc.json exportado na Aula 2, ou o canvas salvo no navegador, e revise os cubos, grãos e dimensões candidatas já registrados.' },
          { title: 'Avalie cada dimensão', text: 'Para cada dimensão candidata, verifique se ela contém atributos hierárquicos ou repetitivos que poderiam ser normalizados em tabelas separadas, como produto → subcategoria → categoria.' },
          { title: 'Aplique o critério de normalização', text: 'Decida star ou snowflake por dimensão a partir do critério de normalização, não por preferência estética: redundância aceitável favorece star; hierarquia extensa e repetição custosa favorecem snowflake.' },
          { title: 'Marque a estrutura no canvas', text: 'Marque a caixa correspondente (Star Schema ou Snowflake Schema) na seção Estrutura de cada cubo e registre, ao lado, a justificativa da escolha.' },
          { title: 'Revise dimensões especiais', text: 'Verifique se alguma dimensão exige bridge table para relação muitos-para-muitos, junk dimension para atributos de baixa cardinalidade, ou é candidata a dimensão conformada entre cubos.' },
          { title: 'Confira boas práticas', text: 'Revise o cubo contra os critérios de boas práticas apresentados: nomenclatura consistente, chave substituta, granularidade documentada e ausência de mistura entre grãos.' },
          { title: 'Posicione no ciclo de vida', text: 'Identifique em qual etapa do ciclo de vida de modelagem — levantamento de requisitos, modelagem conceitual, lógica, física ou manutenção — o cubo se encontra hoje, e o que falta para a etapa seguinte.' }
        ],
        checks: [
          'A dimensão escolhida como snowflake tem de fato uma hierarquia com múltiplos níveis, ou a normalização foi aplicada sem necessidade?',
          'A justificativa registrada cita o critério — redundância, hierarquia, custo de join — e não apenas a preferência do grupo?',
          'Alguma dimensão pode ser conformada e reaproveitada por mais de um cubo do projeto?'
        ],
        avoid: [
          'Não decida o esquema por padrão, como "todo mundo usa star"; decida por dimensão, a partir da hierarquia real dos dados.',
          'Não misture star e snowflake dentro da mesma dimensão sem justificar — a mistura parcial deve ser deliberada, não acidental.',
          'Não tente resolver performance ou SCD nesta aula: o foco de hoje é estrutura, normalização e ciclo de vida.'
        ],
        worked: {
          text: 'Este exemplo ilustra o raciocínio com uma dimensão de produto genérica — não é a resposta para a dimensão do seu projeto.',
          questions: [
            'Star: dimensao_produto traz categoria e departamento como colunas repetidas na própria linha do produto.',
            'Snowflake: dimensao_produto referencia dimensao_categoria, que referencia dimensao_departamento, cada nível em sua própria tabela.'
          ],
          note: 'A escolha depende de quanto a hierarquia se repete e de quantos produtos compartilham a mesma categoria: hierarquia estável e repetição alta favorecem normalizar; hierarquia rasa ou que muda pouco favorece manter desnormalizado. Decidir isso para a dimensão real do seu projeto é o trabalho do grupo.'
        },
        tool: { label: 'Abrir o Data Model Canvas', href: '../data-model-canvas.html' },
        acceptance: [
          'Cada cubo do canvas tem a Estrutura (Star ou Snowflake) marcada, com justificativa registrada por escrito.',
          'Ao menos uma dimensão foi avaliada quanto à necessidade de normalização, com o critério explicitado.',
          'As dimensões especiais (bridge, junk, conformada) foram avaliadas para os cubos em que se aplicam.',
          'O grupo consegue indicar em qual etapa do ciclo de vida de modelagem o cubo se encontra e o que falta para avançar.'
        ]
      },
      deliverable: 'O Data Model Canvas do projeto atualizado com, para cada cubo já iniciado: a estrutura (star ou snowflake) decidida e justificada por dimensão, as dimensões especiais avaliadas e a etapa do ciclo de vida de modelagem identificada. Não é necessário resolver otimização de desempenho ou estratégia de SCD nesta aula.',
      references: ['DataCamp — Star Schema vs Snowflake Schema: diferenças e casos de uso', 'Astera — 20 práticas recomendadas de data warehouse', 'Maxwell PUC-Rio — Data Warehouse: requisitos e metodologias de modelagem', 'Medium (Nayyara Bernardo) — Boas práticas para modelagem Star/Snowflake no BigQuery']
    },

    4: {
      title: 'Modelagem de Data Warehouse III', date: '18/08/2026',
      professor: 'Hermano Peixoto', discipline: 'Computação 1',
      subtitle: 'Bridge tables, junk dimensions e Slowly Changing Dimensions: modelagem dimensional avançada para casos que o star/snowflake básico não resolve sozinho.',
      objective: 'Aplicar bridge tables, junk dimensions e a estratégia de Slowly Changing Dimensions (tipos 1, 2 ou 3) mais adequada a cada dimensão do Data Warehouse.',
      outcomes: [
        'Explicar quando um relacionamento muitos-para-muitos entre fato e dimensão exige uma bridge table, e não uma chave estrangeira direta.',
        'Modelar uma bridge table com peso de alocação quando uma métrica aditiva precisa ser distribuída sem dupla contagem.',
        'Identificar atributos de baixa cardinalidade dispersos na fato ou em dimensões e agrupá-los em uma junk dimension coerente.',
        'Diferenciar SCD tipo 1, tipo 2 e tipo 3 pelo tratamento dado ao histórico e escolher entre eles a partir da pergunta analítica.',
        'Avaliar o impacto de cada estratégia de SCD sobre relatórios históricos e sobre o custo de join.',
        'Relacionar versionamento de dados dimensionais e versionamento de código como práticas complementares de rastreabilidade.'
      ],
      timebox: [
        { label: 'Teoria — bridge tables, junk dimensions, SCD (tipos 1, 2 e 3) e versionamento de dados, com demonstração aplicada ao projeto', minutes: 60 },
        { label: 'Ponderada em Sala — atividade avaliativa individual, entregue em Google Docs via Adalove', minutes: 60 }
      ],
      preClass: [
        {
          title: 'Bridge Tables',
          topics: ['Definição', 'Funções principais', 'Exemplo prático', 'Diferenciação'],
          url: 'https://www.ibm.com/docs/en/cognos-analytics/12.1.0?topic=relationships-bridge-tables'
        },
        {
          title: 'Design Tip #113 Creating, Using, and Maintaining Junk Dimensions',
          topics: ['Definição de Junk Dimension', 'Construção inicial', 'Exemplos práticos', 'Integração com o fato', 'Manutenção do junk dimension', 'Considerações de implementação'],
          url: 'https://www.kimballgroup.com/2009/06/design-tip-113-creating-using-and-maintaining-junk-dimensions'
        },
        {
          title: 'Slowly Changing Dimensions: What they are and why they matter',
          topics: ['O que são Slowly Changing Dimensions (SCDs)', 'Impacto de modelos incorretos', 'Tipos de SCD explicados', 'Como implementar SCD em DW', 'Técnicas de manutenção', 'Cultura de dados orientada ao histórico'],
          url: 'https://www.thoughtspot.com/data-trends/data-modeling/slowly-changing-dimensions-in-data-warehouse'
        },
        {
          title: 'Como Implementar Versionamento de Dados em Projetos de Engenharia de Dados',
          topics: ['Conceito e importância do versionamento de dados', 'Benefícios do versionamento', 'Ferramentas e tecnologias para versionamento', 'Organização e metadados', 'Integração e automação', 'Boas práticas complementares', 'Benefícios tangíveis', 'Desafios na implementação'],
          url: 'https://cabecatech.com/dados/como-implementar-versionamento-de-dados-em-projetos-de-engenharia-de-dados'
        }
      ],
      sections: [
        {
          nav: 'Bridge Tables', title: 'Bridge Tables: resolvendo relações muitos-para-muitos',
          text: 'Uma bridge table resolve um relacionamento muitos-para-muitos entre a fato e uma dimensão, quando o grão da fato é mais grosso do que essa relação. Uma pesquisa da Central de Pesquisas reúne até 60 empresas participantes: a bridge_pesquisa_empresa liga as duas com uma linha por combinação e, quando uma contagem de participação precisa ser distribuída entre as empresas sem inflar o total, um peso de alocação (por exemplo, 1 dividido pelo número de empresas daquela pesquisa).',
          checklist: [
            'No cubo do seu projeto, identifique uma dimensão que se relaciona com a fato em cardinalidade muitos-para-muitos, não um-para-muitos.',
            'Decida se a bridge table precisa de peso de alocação, avaliando se a métrica que passaria por ela é genuinamente fracionável entre os membros da dimensão.',
            'Nomeie as colunas da bridge: as duas chaves estrangeiras e, se aplicável, o peso de alocação.'
          ],
          pitfall: 'Somar, através da bridge table, uma métrica que pertence à pesquisa inteira e não é fracionável por empresa — como o tempo de tabulação. Peso de alocação só resolve métricas genuinamente atribuíveis por empresa, como uma contagem de participação; as demais simplesmente não devem ser somadas através da bridge.',
          diagram: `erDiagram
    FATO_PESQUISA ||--o{ BRIDGE_PESQUISA_EMPRESA : possui
    DIMENSAO_EMPRESA ||--o{ BRIDGE_PESQUISA_EMPRESA : participa
    FATO_PESQUISA {
        int pesquisa_id PK
        int total_respondentes
    }
    BRIDGE_PESQUISA_EMPRESA {
        int pesquisa_id FK
        int empresa_id FK
        float peso_alocacao
    }
    DIMENSAO_EMPRESA {
        int empresa_id PK
        string porte
        string segmento
    }`
        },
        {
          nav: 'Junk Dimensions', title: 'Junk Dimensions: agrupando atributos de baixa cardinalidade',
          text: 'Uma junk dimension agrupa, em uma única tabela, atributos independentes e de baixa cardinalidade que variam linha a linha na fato — não um atributo fixo do cubo inteiro. Se cada pesquisa da Central de Pesquisas carregasse sua própria combinação de classificação e sensibilidade de dado (público, interno, confidencial, restrito, pessoal, sensível, crítico), essas sete flags seriam candidatas a uma única dimensao_classificacao_dado.',
          checklist: [
            'Confirme que o atributo varia linha a linha na fato — se for constante para o cubo inteiro, é metadado de catálogo/governança, não dimensão joinável.',
            'Verifique se esses atributos aparecem juntos com frequência e não têm hierarquia entre si — sinal de que pertencem à mesma junk dimension.',
            'Estime quantas combinações realmente ocorrem nos dados: carregue só as observadas, não o produto cartesiano completo.'
          ],
          pitfall: 'Criar uma dimensão separada para cada flag booleana. Cada uma vira uma dimensão de duas linhas e mais um join trivial — o join sobra, mas o discernimento analítico não aumenta.',
          diagram: `erDiagram
    FATO_PESQUISA }o--|| DIMENSAO_CLASSIFICACAO_DADO : classificada_por
    FATO_PESQUISA {
        int pesquisa_id PK
        int classificacao_sk FK
    }
    DIMENSAO_CLASSIFICACAO_DADO {
        int classificacao_sk PK
        string classificacao
        boolean dado_pessoal
        boolean dado_sensivel
        boolean dado_critico
    }`
        },
        {
          nav: 'SCD — Tipos 1, 2 e 3', title: 'Slowly Changing Dimensions: tipos 1, 2 e 3',
          text: 'Uma Slowly Changing Dimension trata a mudança de um atributo ao longo do tempo. O tipo 1 sobrescreve o valor e apaga o histórico; o tipo 2 cria uma nova linha versionada, com data de início, data de fim e indicador de vigência; o tipo 3 guarda só o valor anterior em uma coluna extra. Na dimensao_empresa, porte e segmento pedem SCD 2 quando a análise exige o valor vigente na data da pesquisa; os demais atributos cadastrais bastam com SCD 1.',
          checklist: [
            'Para cada atributo que muda, pergunte se alguma métrica histórica precisa refletir o valor vigente na data do evento — se sim, é candidato a SCD 2.',
            'Verifique se o atributo muda com frequência incompatível com SCD 2 (mudanças diárias explodiriam o volume da dimensão).',
            'Confirme, para SCD 3, que uma única coluna de "valor anterior" basta — nenhuma pergunta de negócio pede a segunda ou terceira mudança anterior.'
          ],
          pitfall: 'Escolher SCD 2 para toda a dimensão por precaução, sem verificar se cada atributo tem uma pergunta analítica que depende do histórico. Isso multiplica linhas e exige filtro de vigência em joins que nunca precisariam dele.',
          diagram: `flowchart LR
    subgraph COL1[" "]
        direction TB
        subgraph SCD1["SCD Tipo 1 — sobrescreve"]
            A1["empresa 42 · porte Médio"] -->|atualiza| A2["empresa 42 · porte Grande"]
        end
        subgraph SCD2["SCD Tipo 2 — versiona"]
            B1["sk 101 · empresa 42 · porte Médio · até 2026-03"] --> B2["sk 102 · empresa 42 · porte Grande · vigente"]
        end
    end
    subgraph SCD3["SCD Tipo 3 — atributo alternativo"]
        C1["empresa 42 · porte_atual Grande · porte_anterior Médio"]
    end
    SCD1 ~~~ SCD2
    COL1 ~~~ SCD3
    style COL1 fill:none,stroke:none`
        },
        {
          nav: 'Impacto do SCD na análise', title: 'O impacto de cada estratégia na análise e nos relatórios',
          text: 'A escolha do SCD muda o que um relatório histórico mostra. Em SCD 1, um relatório de adesão por porte de empresa em 2025 mostraria hoje o porte atual, distorcendo a série histórica; em SCD 2, a fato referencia a chave substituta da versão vigente na data da pesquisa, e o join de consulta é direto. O cuidado é garantir que a fato aponte pela chave substituta, não pela chave natural — caso contrário, ou em consultas retroativas pontuais, é preciso filtrar por vigência para não duplicar linhas.',
          checklist: [
            'Para um atributo já classificado como SCD 1, aponte um relatório histórico que ele silenciosamente distorceria se a análise precisasse do valor passado.',
            'Confirme que a fato referencia a chave substituta da versão vigente da dimensão SCD 2 — não apenas a chave natural.',
            'Verifique se algum relatório do projeto une uma dimensão SCD 2 pela chave natural sem filtrar vigência.'
          ],
          pitfall: 'Resolver a versão da dimensão só na hora da consulta, unindo pela chave natural em vez de referenciar a chave substituta correta da dimensão. Sem essa referência, esquecer o filtro de vigência multiplica cada linha da fato pelo número de versões da dimensão, inflando contagens e somas sem erro visível.'
        },
        {
          nav: 'Versionamento e rastreabilidade', title: 'Versionamento de dados dimensionais e rastreabilidade',
          text: 'Versionar dado dimensional (SCD 2) e versionar código de transformação (git) são práticas complementares: uma preserva o histórico do dado, a outra o histórico da lógica que o produziu. A rastreabilidade ponta a ponta que o projeto exige — da solicitação de uma pesquisa à publicação — depende das duas; backup recupera um estado, mas não explica a trajetória de mudanças entre eles.',
          checklist: [
            'Verifique se o pipeline do seu projeto versiona o código de transformação separadamente do dado.',
            'Para uma dimensão SCD 2, confirme que é possível responder "qual era o valor vigente nesta data" sem depender de backup.',
            'Aponte, na TAPI do seu projeto, a exigência de rastreabilidade que depende diretamente de uma dimensão versionada.'
          ],
          pitfall: 'Tratar backup como estratégia de versionamento. Backup restaura um ponto no tempo; não permite consultar o histórico completo nem explicar por que o dado mudou entre duas datas.'
        }
      ],
      sdd: {
        rf: 'RF-104 — Permitir consultar qualquer pesquisa passada por atributos de empresas participantes (porte, segmento) sem inflar métricas aditivas e sem depender do cadastro atual da empresa.',
        rnf: 'RNF-104 — A bridge_pesquisa_empresa nunca introduz dupla contagem em métrica aditiva da fato; nenhuma vigência de dimensao_empresa (SCD 2) fica sobreposta.',
        adr: 'ADR-DW-04 — Bridge table para a relação muitos-para-muitos entre pesquisa e empresa, com peso de alocação; junk dimension única para as sete flags de classificação e sensibilidade do dado que variam por pesquisa; SCD 2 restrito a porte e segmento em dimensao_empresa, e SCD 1 nos demais atributos cadastrais. Alternativa descartada: chave estrangeira direta de empresa na fato de pesquisa — inviável pela cardinalidade muitos-para-muitos — e SCD 2 em toda a dimensão empresa, o que multiplicaria linhas sem pergunta analítica associada às demais colunas. Consequência: todo join entre a fato e a dimensao_empresa passa a exigir filtro de vigência.',
        gherkin: 'Dado que a empresa X mudou de porte em março, Quando consulto a representatividade de mercado de uma pesquisa realizada em janeiro, Então o resultado usa o porte vigente em janeiro e nenhuma métrica aparece duplicada pela bridge table.'
      },
      activity: {
        title: 'Ponderada em Sala — Bridge Tables, Junk Dimensions e SCD aplicados ao projeto',
        duration: '60 min · segunda metade da aula · atividade avaliativa individual',
        goal: 'Aplicar bridge table, junk dimension e a estratégia de SCD mais adequada a pelo menos um cubo já modelado no Data Model Canvas do projeto, documentando a solução — com diagrama visual (Mermaid) e justificativa técnica — em um Google Docs individual.',
        intro: 'Esta atividade é avaliativa — vale nota — e será corrigida pelos critérios de avaliação ao final desta aula. Retome o Data Model Canvas das Aulas 2 e 3 apenas como referência: ele é um documento do grupo, e a resposta desta Ponderada não deve ser escrita nele. Documente sua resposta em um Google Docs próprio e entregue o link no card desta Ponderada no Adalove. Diferente das atividades anteriores, aqui o resultado entregue é o que conta para a nota; ainda assim, peça orientação ao professor sempre que travar.',
        steps: [
          { title: 'Releia o canvas', text: 'Retome, apenas como referência, os cubos, o grão, as dimensões e a estrutura (star ou snowflake) já registrados nas Aulas 2 e 3 — não escreva sua resposta no canvas.' },
          { title: 'Encontre a relação N:N', text: 'Identifique um relacionamento muitos-para-muitos candidato a bridge table entre a fato e alguma dimensão do seu cubo — ou justifique por escrito por que nenhum existe.' },
          { title: 'Modele a bridge table', text: 'Nomeie a tabela e defina as colunas: as chaves estrangeiras envolvidas e, se alguma métrica aditiva for somada através dela, o peso de alocação.' },
          { title: 'Encontre atributos de baixa cardinalidade', text: 'Identifique atributos de baixa cardinalidade dispersos na fato ou nas dimensões do seu cubo, candidatos a junk dimension.' },
          { title: 'Modele a junk dimension', text: 'Liste as combinações relevantes desses atributos e defina a chave substituta da junk dimension.' },
          { title: 'Escolha o SCD por dimensão', text: 'Para ao menos duas dimensões do cubo escolhido — incluindo qualquer uma que exigir histórico — classifique a necessidade e escolha SCD 1, 2 ou 3, justificando pela pergunta de negócio, nunca por padrão.' },
          { title: 'Documente no Google Docs', text: 'Escreva a solução completa — bridge table, junk dimension, estratégia de SCD e as justificativas — em um Google Docs individual, criado só para esta Ponderada.' },
          { title: 'Desenhe um diagrama Mermaid', text: 'Inclua no documento um diagrama visual (Mermaid) da sua solução — por exemplo, o esquema da bridge table com a fato e a dimensão, ou a comparação entre as estratégias de SCD escolhidas.' },
          { title: 'Entregue no Adalove', text: 'Compartilhe o Google Docs com permissão de visualização e cole o link no card desta Ponderada no Adalove.' }
        ],
        checks: [
          'A bridge table resolve de fato uma cardinalidade muitos-para-muitos, ou o relacionamento já era um-para-muitos e não precisa dela?',
          'A junk dimension agrupa atributos realmente de baixa cardinalidade, ou esconde uma dimensão que merece existir sozinha?',
          'A escolha de SCD está justificada pela pergunta analítica, não por "seguir o padrão da última aula"?',
          'O diagrama Mermaid representa a solução do seu cubo, não um exemplo genérico copiado da aula?'
        ],
        avoid: [
          'Não aplique bridge table a um relacionamento um-para-muitos — isso é modelagem direta com chave estrangeira simples.',
          'Não escolha SCD 2 para toda dimensão por precaução; declare o custo (volume, complexidade de join) de cada escolha.',
          'Não registre a resposta desta Ponderada no Data Model Canvas do projeto — ele é um documento do grupo; a entrega é o Google Docs individual, com o link no Adalove.'
        ],
        worked: {
          text: 'Este raciocínio usa o projeto Central de Pesquisas (Sindusfarma) apenas para ilustrar o método — não resolve o cubo do seu projeto.',
          questions: [
            'Uma pesquisa é respondida por até 60 empresas, e cada empresa responde a várias pesquisas ao longo do tempo → candidato a bridge table entre fato_pesquisa e dimensao_empresa.',
            'Se a classificação de dado (público, interno, confidencial, restrito, pessoal, sensível, crítico) variar de pesquisa para pesquisa, essas sete flags booleanas → candidatas a uma única junk dimension de governança.',
            'O porte e o segmento de uma empresa mudam raramente, mas afetam a leitura de representatividade de mercado por período → candidato a SCD 2; o nome do contato, se mudar, provavelmente não precisa de histórico → SCD 1 basta.'
          ],
          note: 'Confirmar essas hipóteses com os dados reais do próprio projeto é o seu trabalho nesta Ponderada.'
        },
        tool: { label: 'Abrir o Data Model Canvas do projeto (consulta — a resposta vai no Google Docs)', href: '../data-model-canvas.html' },
        acceptance: [
          'Relacionamento muitos-para-muitos identificado e resolvido com bridge table modelada (colunas e peso de alocação, quando aplicável).',
          'Atributos de baixa cardinalidade agrupados em ao menos uma junk dimension coerente, com chave substituta.',
          'Estratégia de SCD (1, 2 ou 3) escolhida e justificada para ao menos duas dimensões do cubo, a partir da pergunta analítica, não por padrão.',
          'Diagrama visual (Mermaid) da solução incluído no documento, representando a bridge table, a junk dimension ou a estratégia de SCD escolhida.'
        ]
      },
      evaluationLabel: 'Critérios de avaliação',
      deliverable: 'Um Google Docs individual com bridge table, junk dimension e estratégia de SCD para pelo menos um cubo do projeto, incluindo um diagrama visual (Mermaid) da solução, com o link entregue no card desta Ponderada em Sala no Adalove — atividade avaliativa individual, corrigida pelos critérios de avaliação desta aula.',
      submissionNotice: [
        'O link do Google Docs desta resposta deve estar registrado no repositório das ponderadas, em um arquivo commitado — não basta colar o link solto no card do Adalove.',
        'Todo uso de IA generativa na solução desta Ponderada exige o chat salvo e commitado no repositório das ponderadas, com o link apresentado no topo do Google Docs da resposta, identificado como "Interação com IA Generativa".'
      ],
      references: ['Kimball & Ross — The Data Warehouse Toolkit (bridge tables e junk dimensions)', 'Kimball Group — Design Tip #113: Creating, Using, and Maintaining Junk Dimensions', 'ThoughtSpot — Slowly Changing Dimensions: What They Are and Why They Matter', 'Cabeça Tech — Como Implementar Versionamento de Dados em Projetos de Engenharia de Dados']
    },

    5: {
      title: 'Arquitetura de Dados', date: '20/08/2026',
      estrutura: [
        'Abertura (15 min) — regras da atividade e retomada do caminho entre as bases de origem do parceiro e o cubo analítico do grupo',
        'Ponderada em Sala (120 min) — oito questões manuscritas, individuais e sem consulta, sobre o cubo do próprio grupo',
        'Encerramento — recolhimento das folhas e encaminhamento para a Aula 6'
      ],
      subtitle: 'Decisões estruturais para uma plataforma de dados confiável, evolutiva e governável.',
      objective: 'Desenhar uma arquitetura de dados conectando fontes, ingestão, armazenamento, processamento, consumo, segurança e operação.',
      outcomes: [
        'Derivar decisões arquiteturais de restrições declaradas, não de tendência de mercado.',
        'Atribuir contrato, dono e política de qualidade a cada camada da plataforma.',
        'Comparar batch e streaming pela latência que a decisão de negócio realmente exige.',
        'Registrar riscos, RPO, RTO e plano de evolução de schema em ADR.'
      ],
      timebox: [
        { label: 'Abertura — regras da atividade e retomada do caminho entre as bases de origem e o cubo analítico', minutes: 15 },
        { label: 'Ponderada em Sala — atividade avaliativa individual, manuscrita e sem consulta', minutes: 120 }
      ],
      estrategia: 'Abertura curta de retomada do caminho entre as bases de origem e o cubo analítico, seguida da Ponderada em Sala: atividade avaliativa individual de 120 minutos, manuscrita em folhas distribuídas pelo professor e sem consulta, que consolida a modelagem dimensional das Aulas 2, 3 e 4 e a ancora nas decisões arquiteturais desta aula.',
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
      activity: {
        title: 'Ponderada em Sala — Do dado de origem ao cubo do projeto',
        slideOnly: true,
        duration: '120 min · atividade avaliativa individual · manuscrita e sem consulta',
        goal: 'Reconstruir à mão, sem consulta, um cubo analítico do próprio grupo e o caminho que leva das bases de origem do parceiro até ele, justificando por escrito cada decisão de modelagem e de arquitetura.',
        intro: 'Esta atividade é avaliativa, individual e vale 3,0 pontos. As folhas são distribuídas pelo professor e toda a resposta é manuscrita nelas. Não é permitido consultar material da disciplina, repositório do grupo, dmc.json, anotações, dispositivos eletrônicos ou assistente de IA. O Data Model Canvas do seu grupo foi construído em conjunto: aqui verifica-se o que cada um sabe reconstruir e justificar sozinho. Todos os grupos trabalham sobre o mesmo parceiro e as mesmas bases de origem — o que distingue as respostas é a modelagem do seu grupo e a qualidade da justificativa.',
        stepsTitle: 'As oito questões da atividade',
        steps: [
          { title: 'Questão 1 — Cubo e grão', text: 'Nomeie um cubo analítico do Data Model Canvas do seu grupo e declare o grão em uma frase no singular: "uma linha representa…". Justifique por que esse grão responde às perguntas de negócio associadas ao cubo.' },
          { title: 'Questão 2 — Fato, métricas e dimensões', text: 'Desenhe o esquema do cubo: a tabela fato com suas métricas e as dimensões ligadas a ela. Marque as cardinalidades, indique a chave substituta de cada dimensão e assinale onde a chave natural foi preservada.' },
          { title: 'Questão 3 — Estrutura e dimensões especiais', text: 'Para cada dimensão, escreva Star ou Snowflake e a justificativa em uma linha, citando o critério — redundância, hierarquia ou custo de join. Indique onde o cubo exige bridge table, junk dimension ou dimensão conformada, e a estratégia de SCD de cada dimensão que muda no tempo.' },
          { title: 'Questão 4 — Fontes e camadas', text: 'Para cada base de origem do parceiro, indique o que ela alimenta no seu cubo — fato, dimensão ou nenhuma — e em qual camada da plataforma ela aterrissa. Explique por que nenhum consumidor deve ler a camada bruta.' },
          { title: 'Questão 5 — Contrato e transformações', text: 'Escreva o contrato de dados da entrada da camada tratada — formato, semântica e garantia de qualidade — e três regras de transformação que o dado bruto precisa sofrer até chegar ao seu cubo.' },
          { title: 'Questão 6 — Qualidade', text: 'Escreva três validações obrigatórias que impedem esse cubo de publicar número errado. Para cada uma, declare o erro específico que ela detecta e o que deve acontecer quando ela falha.' },
          { title: 'Questão 7 — Mudança de requisito', text: 'As empresas participantes mudam de porte e de segmento ao longo do tempo, e a diretoria passa a exigir a comparação da representatividade de mercado entre dois períodos distintos. Indique o que muda no seu modelo, em quais campos do canvas, e qual decisão anterior permanece válida.' },
          { title: 'Questão 8 — Decisão registrada', text: 'Registre a decisão mais cara do seu modelo em uma ADR manuscrita, com os quatro campos: contexto, decisão, alternativa descartada e consequência aceita.' }
        ],
        checks: [
          'Toda métrica declarada existe de fato no grão que você escreveu, ou alguma pertence a um grão mais fino?',
          'Cada escolha entre star e snowflake tem o critério escrito ao lado, e não apenas a caixa marcada?',
          'Cada validação da Questão 6 nomeia o erro que detecta, e não apenas o campo que verifica?',
          'A ADR da Questão 8 tem os quatro campos preenchidos, incluindo a alternativa descartada?'
        ],
        avoid: [
          'Não descreva a arquitetura genérica de um data warehouse: responda sobre o cubo e as bases do seu projeto.',
          'Não marque star ou snowflake sem justificar pelo critério — a caixa marcada, sozinha, não pontua.',
          'Não confunda a base de origem com a camada bruta: a origem é do parceiro, a camada bruta já é da sua plataforma.',
          'Não entregue desenho sem justificativa escrita: o que se avalia é a decisão, não o traço.'
        ],
        acceptance: [
          'Parte I — Cubo do projeto (1,0 ponto): grão em frase singular e coerente com as métricas (0,4); esquema com cardinalidades e chaves substitutas (0,3); estrutura e dimensões especiais justificadas por critério (0,3).',
          'Parte II — Da origem ao cubo (1,0 ponto): bases de origem mapeadas por destino e por camada (0,4); contrato de dados nos três elementos e três regras de transformação (0,3); três validações, cada uma com o erro que detecta (0,3).',
          'Parte III — Decisão sob mudança (1,0 ponto): campos corretamente impactados e decisão que permanece válida identificada (0,6); ADR manuscrita com os quatro campos (0,4).',
          'Faixas de referência: até 1,2 não deu a largada; de 1,2 a 2,1 faltas graves; de 2,1 a 2,7 chegou lá; acima de 2,7 foi além.'
        ]
      },
      evaluationLabel: 'Critérios de avaliação — 3,0 pontos',
      deliverableKicker: 'Avaliação',
      deliverableTitle: 'O que é entregue',
      deliverable: 'A folha manuscrita entregue ao final do encontro, com as oito questões respondidas: o cubo do grupo reconstruído, o caminho das bases de origem até o cubo e a resposta à mudança de requisito, com a decisão registrada em ADR. Atividade avaliativa individual, sem consulta, no valor de 3,0 pontos.',
      submissionNotice: [
        'A atividade é manuscrita nas folhas distribuídas pelo professor; respostas em qualquer outro suporte não são consideradas.',
        'Não é permitido consultar material da disciplina, repositório do grupo, dmc.json, anotações, dispositivos eletrônicos ou assistente de IA durante a atividade.',
        'Identifique todas as folhas com nome completo, turma e grupo antes de começar; a entrega ocorre em mãos, ao professor, ao final do encontro.'
      ],
      references: ['TOGAF — Architecture Development Method', 'DAMA-DMBOK2', 'ISO/IEC 42010 — Architecture descriptions', 'AWS Well-Architected Framework']
    },

    6: {
      title: 'Modelagem de Data Warehouse IV', date: '21/08/2026',
      subtitle: 'Da estrela isolada à arquitetura dimensional corporativa: Bus Matrix, dimensões conformadas, constelações de fatos e evolução incremental.',
      objective: 'Projetar uma arquitetura dimensional corporativa que integre múltiplos processos de negócio por meio de uma Bus Matrix, dimensões conformadas e fatos com grãos e tipos explicitamente definidos.',
      outcomes: [
        'Explicar como dimensões conformadas integram análises entre processos sem fundir fatos de grãos diferentes.',
        'Construir uma Bus Matrix com processos nas linhas, dimensões nas colunas e prioridade incremental de implementação.',
        'Distinguir fatos transacionais, snapshots periódicos e snapshots acumulativos pelo evento representado por cada linha.',
        'Projetar uma constelação de fatos na qual múltiplos Data Marts reutilizam dimensões corporativas governadas.',
        'Definir contratos semânticos para dimensões e métricas compartilhadas, incluindo chave, domínio, granularidade, owner e política histórica.',
        'Planejar a evolução incremental do Data Warehouse sem quebrar análises cross-functional já publicadas.'
      ],
      timebox: [
        { label: 'Fundamentos — arquitetura bus, dimensões conformadas, Bus Matrix, tipos de fato e Fact Constellation', minutes: 55 },
        { label: 'Laboratório — blueprint dimensional corporativo do projeto', minutes: 50 },
        { label: 'Apresentações dos cenários cross-functional, decisões de governança e versionamento do artefato', minutes: 15 }
      ],
      preClass: [
        {
          title: 'Enterprise Data Warehouse Bus Architecture — Kimball Group',
          topics: ['Desenvolvimento incremental por processo', 'Dimensões conformadas como mecanismo de integração', 'Visão estratégica top-down e entregas bottom-up'],
          url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/kimball-data-warehouse-bus-architecture/'
        },
        {
          title: 'Enterprise Data Warehouse Bus Matrix — Kimball Group',
          topics: ['Processos nas linhas', 'Dimensões nas colunas', 'Conformidade identificada por coluna', 'Priorização de uma linha por vez'],
          url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/enterprise-data-warehouse-bus-matrix/'
        },
        {
          title: 'Conformed Dimensions — Kimball Group',
          topics: ['Atributos e domínios compatíveis', 'Reutilização entre fatos', 'Drill-across', 'Governança compartilhada com o negócio'],
          url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/conformed-dimension/'
        },
        {
          title: 'Modelagem dimensional — tabelas de fatos',
          topics: ['Grão e chaves de dimensão', 'Fato transacional', 'Snapshot periódico', 'Snapshot acumulativo'],
          url: 'https://learn.microsoft.com/pt-br/fabric/data-warehouse/dimensional-modeling-fact-tables'
        },
        {
          title: 'Modelagem dimensional — tabelas de dimensões',
          topics: ['Chaves substitutas e naturais', 'Atributos históricos', 'Dimensões conformadas', 'Dimensões de role-playing'],
          url: 'https://learn.microsoft.com/pt-br/fabric/data-warehouse/dimensional-modeling-dimension-tables'
        }
      ],
      sections: [
        {
          nav: 'Da estrela ao barramento', title: 'Arquitetura dimensional corporativa',
          text: 'Um modelo estrela resolve um processo de negócio. Um Data Warehouse corporativo precisa integrar vários processos sem misturar fatos de grãos incompatíveis. Na arquitetura bus de Kimball, cada processo evolui como uma entrega incremental, enquanto dimensões conformadas funcionam como interfaces estáveis entre as estrelas. A integração ocorre pela reutilização de contexto e semântica, não pela criação de uma tabela fato universal.',
          checklist: [
            'Liste os processos de negócio, não os sistemas de origem nem os departamentos da organização.',
            'Declare a pergunta e o grão próprios de cada processo antes de procurar dimensões compartilhadas.',
            'Defina quais entregas podem entrar em produção isoladamente e quais contratos precisam ser corporativos desde o início.'
          ],
          pitfall: 'Criar uma fato corporativa única para todos os processos. Fatos com grãos diferentes não devem ser unidos linha a linha; eles são analisados em conjunto por dimensões conformadas.',
          diagram: `flowchart LR
    P1["Processo: participação"] --> F1["Fato de respostas"]
    P2["Processo: publicação"] --> F2["Fato de ciclo da pesquisa"]
    P3["Processo: mercado"] --> F3["Snapshot de representatividade"]
    D1["Dimensão Empresa conformada"] --- F1
    D1 --- F2
    D1 --- F3
    D2["Dimensão Data conformada"] --- F1
    D2 --- F2
    D2 --- F3`
        },
        {
          nav: 'Dimensões conformadas', title: 'A interface entre processos de negócio',
          text: 'Uma dimensão é conformada quando mantém significado, domínio e estrutura compatíveis em diferentes fatos. A conformidade exige mais que repetir o nome da tabela: chave corporativa, definição dos atributos, hierarquias, tratamento histórico, valores desconhecidos e ownership precisam obedecer ao mesmo contrato. Com isso, relatórios podem executar drill-across e alinhar medidas de fatos distintos por Empresa, Data, Pesquisa ou Segmento.',
          checklist: [
            'Escolha uma chave corporativa estável e documente como cada fonte é mapeada para ela.',
            'Compare nome, domínio, granularidade e hierarquia dos atributos usados por processos diferentes.',
            'Defina owner, política SCD e procedimento de mudança antes de publicar a dimensão como conformada.'
          ],
          pitfall: 'Chamar duas dimensões de dim_empresa e assumir que são conformadas. Se porte, segmento, chave ou vigência significam coisas diferentes, o mesmo filtro produz grupos incompatíveis.',
          diagram: `flowchart LR
    F1["Fato Resposta"] --- E["Dimensão Empresa<br/>chave, porte, segmento, vigência"]
    F2["Fato Participação Mensal"] --- E
    F3["Fato Ciclo da Pesquisa"] --- E
    F1 --- D["Dimensão Data<br/>civil e fiscal"]
    F2 --- D
    F3 --- D`
        },
        {
          nav: 'Bus Matrix', title: 'O blueprint do Data Warehouse corporativo',
          text: 'A Bus Matrix cruza processos de negócio nas linhas com dimensões nas colunas. Uma célula marcada indica que aquela dimensão participa do processo. A leitura horizontal valida o contexto de cada fato; a leitura vertical mostra onde a dimensão deve ser conformada. A matriz também orienta o roadmap: implementa-se uma linha por vez, preservando os contratos corporativos das colunas já publicadas.',
          checklist: [
            'Use verbos de negócio nas linhas: responder pesquisa, publicar indicador, acompanhar participação.',
            'Marque apenas dimensões aplicáveis ao grão do processo, não todas as dimensões disponíveis.',
            'Associe a cada linha prioridade, owner, fato, grão e tipo de tabela fato.'
          ],
          pitfall: 'Colocar tabelas, arquivos ou sistemas nas linhas. A Bus Matrix representa processos mensuráveis do negócio; sistemas são fontes e podem mudar sem alterar o processo.',
          diagram: `flowchart LR
    P1["Responder pesquisa"] --> D1["Data"]
    P1 --> D2["Empresa"]
    P1 --> D3["Pesquisa"]
    P2["Acompanhar participação"] --> D1
    P2 --> D2
    P2 --> D3
    P2 --> D4["Segmento"]
    P3["Publicar indicador"] --> D1
    P3 --> D3
    P3 --> D5["Canal"]`
        },
        {
          nav: 'Tipos de tabela fato', title: 'Transacional, snapshot periódico e snapshot acumulativo',
          text: 'Cada linha da Bus Matrix conduz a uma ou mais tabelas fato. O fato transacional registra um evento atômico e normalmente só recebe inserções. O snapshot periódico fotografa o estado em intervalos regulares, inclusive quando o valor é zero. O snapshot acumulativo mantém uma linha por processo e atualiza as datas dos marcos até sua conclusão. O tipo decorre da frase do grão, não da tecnologia de origem.',
          checklist: [
            'Escreva “uma linha representa...” para cada processo antes de escolher o tipo da fato.',
            'Confirme que o snapshot periódico produz linha em período sem movimento, para preservar zeros.',
            'Use snapshot acumulativo quando a análise depende da duração entre marcos do mesmo processo.'
          ],
          pitfall: 'Classificar a fato pelo formato do arquivo de origem. Uma origem transacional pode alimentar um snapshot periódico; o que decide o tipo é o significado da linha analítica.',
          diagram: `flowchart LR
    T["Transacional<br/>uma linha por resposta enviada"]
    P["Snapshot periódico<br/>uma linha por empresa e mês"]
    A["Snapshot acumulativo<br/>uma linha por ciclo de pesquisa"]
    T ~~~ P
    P ~~~ A`
        },
        {
          nav: 'Fact Constellation', title: 'Múltiplos fatos, contexto compartilhado',
          text: 'Uma Fact Constellation organiza múltiplas tabelas fato que compartilham dimensões conformadas. Cada estrela preserva seu grão, frequência e métricas; a constelação explicita como elas convivem no mesmo ambiente. Data Marts deixam de ser ilhas quando reutilizam as mesmas dimensões corporativas e fatos conformados. A análise cross-functional ocorre por drill-across: cada fato é agregado separadamente no mesmo nível dimensional e os resultados são alinhados, sem join direto fato com fato.',
          checklist: [
            'Mantenha uma declaração de grão independente para cada fato da constelação.',
            'Identifique quais dimensões são realmente conformadas e quais pertencem apenas a um processo.',
            'Descreva uma pergunta cross-functional e o nível dimensional comum usado para alinhar os resultados.'
          ],
          pitfall: 'Fazer join direto entre duas fatos no nível atômico. Se ambas têm várias linhas para a mesma dimensão, o join multiplica registros e distorce métricas.',
          diagram: `erDiagram
    DIM_EMPRESA ||--o{ FATO_RESPOSTA : contextualiza
    DIM_EMPRESA ||--o{ FATO_PARTICIPACAO_MENSAL : contextualiza
    DIM_PESQUISA ||--o{ FATO_RESPOSTA : contextualiza
    DIM_PESQUISA ||--o{ FATO_CICLO_PESQUISA : contextualiza
    DIM_DATA ||--o{ FATO_RESPOSTA : data_resposta
    DIM_DATA ||--o{ FATO_PARTICIPACAO_MENSAL : mes_referencia
    DIM_DATA ||--o{ FATO_CICLO_PESQUISA : marcos`
        },
        {
          nav: 'Governança e evolução', title: 'Consistência semântica com entrega incremental',
          text: 'A arquitetura bus permite implementar uma linha da matriz por vez, mas cada nova entrega deve respeitar os contratos publicados. Para dimensões conformadas, o contrato inclui chave, atributos, domínios, hierarquias, granularidade, política histórica, owner e compatibilidade. Para métricas compartilhadas, inclui fórmula, unidade, comportamento de agregação, filtros e versão. Mudanças aditivas preservam consumidores; mudanças semânticas exigem versionamento e plano de migração.',
          checklist: [
            'Escolha a primeira linha da matriz por valor, viabilidade e capacidade de estabelecer dimensões reutilizáveis.',
            'Classifique cada mudança como compatível, aditiva ou quebradora antes de alterar uma dimensão conformada.',
            'Defina owner e fórum de decisão para atributos e métricas usados por mais de uma área.'
          ],
          pitfall: 'Permitir que cada Data Mart copie e adapte a dimensão corporativa. A entrega local fica rápida, mas porte, segmento e calendário passam a divergir e impedem análise integrada.',
          diagram: `flowchart LR
    R1["Release 1<br/>Participação"] --> C1["Empresa + Data<br/>contratos v1"]
    C1 --> R2["Release 2<br/>Publicação"]
    R2 --> C2["Pesquisa + Canal<br/>contratos v1"]
    C2 --> R3["Release 3<br/>Mercado"]
    R3 --> V["Análise cross-functional<br/>semântica governada"]`
        }
      ],
      continuity: {
        title: 'De onde a aula parte e para onde leva',
        text: 'A Aula 5 estabeleceu o caminho das fontes até as camadas com contrato e dono. As Aulas 2 a 4 produziram estrelas por processo. Esta aula liga essas estrelas em um barramento corporativo, e o resultado é a análise que atravessa processos sem perder significado.',
        steps: [
          { when: 'Aula 5', what: 'Fontes e camadas' },
          { when: 'Aulas 2–4', what: 'Estrelas por processo' },
          { when: 'Aula 6', what: 'Barramento corporativo' },
          { when: 'Resultado', what: 'Análise cross-functional' }
        ],
        note: 'Uma coleção de Data Marts não forma um Data Warehouse corporativo. A integração começa quando processos diferentes reutilizam dimensões com contratos realmente compatíveis.'
      },
      conformity: {
        entity: 'DIM_EMPRESA',
        intro: 'Conformidade é um contrato, não um nome de tabela. A dimensão abaixo é reutilizada pelos fatos de participação, publicação e mercado: uma mudança local altera todos os relatórios cross-functional. Os seis campos a seguir são o que precisa estar decidido e publicado antes de declarar a dimensão conformada.',
        fields: [
          { label: 'Chave corporativa', text: 'Como CNPJ e os identificadores de cada fonte convergem para uma única entidade.' },
          { label: 'Domínio dos atributos', text: 'Valores válidos para porte, segmento, região e situação cadastral.' },
          { label: 'Granularidade', text: 'Empresa, estabelecimento ou grupo econômico: apenas um pode ser o grão da dimensão.' },
          { label: 'Política histórica', text: 'Quais mudanças usam SCD 1, SCD 2 ou outra estratégia explicitamente declarada.' },
          { label: 'Hierarquias', text: 'Segmento, porte e região precisam agregar da mesma forma em todos os fatos.' },
          { label: 'Owner e evolução', text: 'Quem aprova mudanças e como os consumidores existentes são migrados.' }
        ],
        test: {
          title: 'Teste de conformidade',
          intro: 'Se o mesmo filtro separa empresas em grupos diferentes conforme o relatório, não há integração. Compare atributo por atributo antes de publicar a dimensão como corporativa.',
          rows: [
            { attribute: 'Chave', bad: 'CNPJ em um fato, identificador local em outro', good: 'empresa_sk corporativa em todos os fatos' },
            { attribute: 'Porte', bad: 'faixas de faturamento diferentes por área', good: 'domínio único governado' },
            { attribute: 'Segmento', bad: 'taxonomias locais por sistema de origem', good: 'hierarquia única e documentada' },
            { attribute: 'Histórico', bad: 'um relatório usa o atributo atual, outro o vigente', good: 'política SCD documentada e aplicada' }
          ],
          note: 'Drill-across só é confiável quando os atributos usados para alinhar resultados têm nome, domínio e conteúdo compatíveis.'
        }
      },
      busMatrix: {
        intro: 'A matriz cruza processos de negócio nas linhas com dimensões nas colunas, e o número na linha indica a prioridade de implementação. A célula marcada mostra onde o contexto é necessário; a coluna com várias marcas mostra onde a conformidade produz integração.',
        columns: ['Data', 'Empresa', 'Pesquisa', 'Segmento', 'Canal'],
        rows: [
          { priority: 1, process: 'Responder pesquisa', marks: [true, true, true, true, false] },
          { priority: 2, process: 'Acompanhar participação', marks: [true, true, true, true, false] },
          { priority: 3, process: 'Publicar indicador', marks: [true, false, true, true, true] },
          { priority: 4, process: 'Analisar mercado', marks: [true, true, false, true, false] }
        ],
        axes: [
          { label: 'Linhas', text: 'verbos do negócio, não sistemas, arquivos ou departamentos.' },
          { label: 'Colunas', text: 'contexto reutilizável, não toda dimensão disponível.' }
        ],
        reading: {
          intro: 'A leitura horizontal valida o processo; a leitura vertical revela a integração. A mesma matriz orienta modelagem, governança e roadmap.',
          horizontal: {
            title: 'Leitura horizontal — uma linha por entrega incremental',
            questions: ['Qual processo está sendo medido?', 'Qual é o grão da fato?', 'Quais dimensões descrevem esse grão?', 'Qual tipo de fato representa o processo?']
          },
          vertical: {
            title: 'Leitura vertical — uma coluna por contrato compartilhado',
            questions: ['Em quais processos a dimensão aparece?', 'Os atributos têm o mesmo domínio?', 'Quem governa chave, SCD e hierarquia?', 'Qual mudança quebraria consumidores?']
          },
          note: 'Implemente uma linha por vez, mas trate as colunas compartilhadas como produto corporativo desde a primeira entrega.'
        }
      },
      drillAcross: {
        question: 'Participação e tempo de publicação por segmento e trimestre.',
        intro: 'A pergunta atravessa dois fatos de grãos diferentes. Ela se responde por drill-across — agregação separada e alinhamento posterior —, nunca por join direto entre as fatos.',
        correct: [
          'Agregue a participação por Segmento e Trimestre.',
          'Agregue o tempo de publicação no mesmo nível dimensional.',
          'Alinhe os dois resultados pelos atributos conformados.'
        ],
        incorrect: [
          'Unir cada resposta diretamente a cada linha do ciclo de publicação.',
          'Gerar relação muitos-para-muitos entre fatos com grãos diferentes.',
          'Multiplicar linhas e distorcer as medidas antes da agregação.'
        ],
        note: 'Fatos se encontram depois de agregados, no nível comum das dimensões conformadas.'
      },
      semantics: {
        intro: 'Dimensão e métrica compartilhadas exigem decisões explícitas, porque o contrato precisa sobreviver às fronteiras organizacionais. Cinco perguntas precisam ter resposta escrita antes da publicação.',
        items: [
          { title: 'Definição', text: 'O que “empresa ativa” ou “participação” significa para todas as áreas?' },
          { title: 'Domínio', text: 'Quais valores, hierarquias e unidades são aceitos?' },
          { title: 'Histórico', text: 'O relatório usa o atributo atual ou o vigente no momento do evento?' },
          { title: 'Ownership', text: 'Quem aprova uma mudança usada por mais de um processo?' },
          { title: 'Compatibilidade', text: 'A alteração é aditiva ou exige nova versão e plano de migração?' }
        ],
        note: 'Copiar uma dimensão para acelerar uma entrega local reduz o tempo hoje e cria dívida semântica corporativa amanhã.'
      },
      roadmap: {
        intro: 'A entrega é bottom-up, uma linha da matriz por vez, orientada por um blueprint top-down. Cada release reutiliza ou evolui formalmente os contratos já publicados.',
        releases: [
          { id: 'Release 1', title: 'Responder pesquisa', text: 'Entrega o primeiro valor analítico e estabelece Data, Empresa e Pesquisa.', chip: 'contratos v1' },
          { id: 'Release 2', title: 'Acompanhar participação', text: 'Reutiliza as três dimensões e adiciona o snapshot mensal.', chip: 'reuso, sem cópia' },
          { id: 'Release 3', title: 'Publicar indicador', text: 'Reutiliza Data e Pesquisa; adiciona Canal e os marcos do ciclo.', chip: 'extensão aditiva' },
          { id: 'Release 4', title: 'Análise integrada', text: 'Drill-across compara participação, publicação e mercado.', chip: 'cross-functional' }
        ],
        note: 'O roadmap prioriza valor e viabilidade, mas toda nova linha deve reutilizar ou evoluir formalmente os contratos existentes.'
      },
      closing: 'O Data Warehouse torna-se corporativo quando cada processo preserva seu grão, as dimensões preservam o significado e cada nova entrega amplia o barramento sem criar uma nova verdade local.',
      sdd: {
        rf: 'RF-106 — Permitir comparar participação, publicação e representatividade de mercado por empresa, segmento e período usando dimensões corporativas comuns.',
        rnf: 'RNF-106 — Empresa, Data, Pesquisa e Segmento devem manter chave, domínio, granularidade e política histórica compatíveis em todos os fatos; qualquer mudança quebradora exige nova versão do contrato.',
        adr: 'ADR-DW-06 — Adotar a arquitetura bus de Kimball, implementando um processo por vez e integrando-os por dimensões conformadas. Alternativa descartada: Data Marts autônomos com cópias locais das dimensões. Consequência: as dimensões compartilhadas exigem ownership e governança antes da primeira publicação.',
        gherkin: 'Dadas as fatos de resposta e participação mensal vinculadas às mesmas dimensões Empresa, Pesquisa e Data, Quando o analista compara os processos por segmento e trimestre, Então os resultados são alinhados por atributos conformados sem join direto entre as fatos.'
      },
      activity: {
        title: 'Laboratório — Blueprint dimensional corporativo',
        duration: '50 min · construção em grupo',
        goal: 'Integrar ao menos três processos do projeto em uma Bus Matrix e uma Fact Constellation, definindo dimensões conformadas, tipo e grão de cada fato, governança semântica e ordem incremental de implementação.',
        intro: 'O grupo parte dos cubos já registrados no Data Model Canvas e deixa de tratá-los como ilhas. A Bus Matrix explicita os processos e o contexto compartilhado; a constelação mostra como os fatos reutilizam as dimensões corporativas; o contrato de conformidade registra as decisões que nenhuma área pode redefinir localmente.',
        stepsTitle: 'Do portfólio de processos ao blueprint corporativo',
        steps: [
          { title: 'Nomeie os processos', text: 'Liste ao menos três processos mensuráveis usando verbo e objeto. Não use nomes de sistema, arquivo, área ou relatório.' },
          { title: 'Declare os grãos', text: 'Para cada processo, escreva no singular o que uma linha da fato representa e identifique as perguntas respondidas.' },
          { title: 'Escolha os tipos de fato', text: 'Classifique cada fato como transacional, snapshot periódico ou snapshot acumulativo e justifique pela frase do grão.' },
          { title: 'Monte a Bus Matrix', text: 'Coloque processos nas linhas e dimensões nas colunas; marque as células aplicáveis e identifique colunas reutilizadas.' },
          { title: 'Contrate a conformidade', text: 'Para ao menos duas dimensões compartilhadas, defina chave corporativa, atributos críticos, domínio, granularidade, SCD e owner.' },
          { title: 'Desenhe a constelação', text: 'Represente fatos e dimensões, distinguindo dimensões conformadas das específicas e evitando qualquer relação fato com fato.' },
          { title: 'Prove a integração', text: 'Escreva uma pergunta cross-functional e explique o drill-across: agregações separadas, mesmo nível dimensional e alinhamento dos resultados.' },
          { title: 'Planeje a evolução', text: 'Priorize as linhas da matriz e registre como a próxima entrega reutiliza contratos existentes sem quebrar consumidores.' }
        ],
        checks: [
          'As linhas da matriz representam processos de negócio ou apenas repetem nomes de sistemas e áreas?',
          'Duas dimensões com o mesmo nome possuem de fato a mesma chave, domínio, hierarquia e política histórica?',
          'A pergunta cross-functional pode ser respondida sem unir duas fatos diretamente no nível atômico?',
          'A ordem de implementação entrega valor por linha sem criar uma nova versão local das dimensões compartilhadas?'
        ],
        avoid: [
          'Não construa uma única fato corporativa com processos e grãos diferentes.',
          'Não marque todas as dimensões em todas as linhas da Bus Matrix; marque apenas as aplicáveis ao grão.',
          'Não declare conformidade apenas porque as tabelas têm o mesmo nome.',
          'Não faça join direto entre fatos para produzir uma análise cross-functional.'
        ],
        worked: {
          text: 'Exemplo de referência, fora do contexto do projeto: uma rede varejista integra Venda, Estoque e Entrega sem misturar seus grãos.',
          questions: [
            'Venda usa fato transacional: uma linha representa um item vendido.',
            'Estoque usa snapshot periódico: uma linha representa o saldo diário de um produto por loja.',
            'Entrega usa snapshot acumulativo: uma linha representa o ciclo do pedido, com marcos de separação, expedição e entrega.',
            'Data, Produto, Loja e Cliente são candidatas a dimensões conformadas, conforme aplicáveis a cada processo.',
            'A pergunta “venda sem estoque e atraso de entrega por produto e semana” exige drill-across no nível Produto + Data, não join atômico entre as três fatos.'
          ],
          note: 'Use o exemplo para compreender o raciocínio. O entregável deve representar exclusivamente os processos e as decisões do projeto do grupo.'
        },
        tool: { label: 'Abrir o Data Model Canvas', href: '../data-model-canvas.html' },
        acceptance: [
          'A Bus Matrix contém ao menos três processos, suas dimensões aplicáveis e uma ordem de implementação justificada.',
          'Cada processo possui grão, fato e tipo de tabela fato explicitamente definidos.',
          'Ao menos duas dimensões conformadas possuem contrato com chave, domínio, granularidade, política histórica e owner.',
          'A Fact Constellation preserva os grãos e não contém relacionamento direto entre fatos.',
          'Há uma pergunta cross-functional com o nível dimensional comum e a estratégia de drill-across descritos.',
          'O plano incremental explica como uma nova linha da matriz reutiliza contratos sem quebrar análises existentes.',
          'O grupo apresenta uma pergunta real do parceiro que exige grãos diferentes e demonstra como cada fato é agregada antes do alinhamento dos resultados.'
        ]
      },
      deliverable: 'Blueprint dimensional corporativo do projeto: Bus Matrix priorizada, Fact Constellation, contrato de ao menos duas dimensões conformadas, grão e tipo de cada fato, pergunta cross-functional real do parceiro, estratégia de drill-across apresentada à turma e plano de evolução incremental, com o dmc.json atualizado e versionado.',
      references: ['Kimball & Ross — The Data Warehouse Toolkit, 3ª ed.', 'Kimball Group — Enterprise Data Warehouse Bus Architecture', 'Kimball Group — Enterprise Data Warehouse Bus Matrix', 'Kimball Group — Conformed Dimensions', 'Microsoft Learn — Dimensional modeling in Fabric Warehouse']
    },

    7: {
      title: 'Otimização de Data Warehouses', date: '24/08/2026',
      subtitle: 'Laboratório comparativo de consultas OLAP com ClickHouse e PostgreSQL no DBeaver.',
      objective: 'Ao final do encontro, o estudante deve ser capaz de executar e avaliar técnicas de otimização de consultas OLAP no ClickHouse e no PostgreSQL, registrando evidências obtidas antes e depois de cada alteração.',
      estrategia: 'Laboratório guiado no DBeaver, com o mesmo conjunto sintético de vendas nos dois mecanismos. Cada grupo executa os blocos SQL em ordem, interpreta os planos de execução e registra as diferenças de latência, leitura e cardinalidade.',
      estrutura: [
        'Preparação do DBeaver e construção da baseline — 10 min.',
        'ClickHouse: MergeTree, PARTITION BY, PRIMARY KEY e ORDER BY — 30 min.',
        'ClickHouse: skip index, materialized view e query_log — 20 min.',
        'PostgreSQL: particionamento, BRIN, B-tree e EXPLAIN — 30 min.',
        'PostgreSQL: materialized view, ANALYZE e VACUUM — 20 min.',
        'Comparação dos resultados e registro da recomendação — 10 min.'
      ],
      timebox: [
        { minutes: 10, label: 'Conectar os dois bancos no DBeaver e criar a baseline.' },
        { minutes: 50, label: 'Executar o roteiro de otimização no ClickHouse.' },
        { minutes: 50, label: 'Executar o roteiro de otimização no PostgreSQL.' },
        { minutes: 10, label: 'Comparar as evidências e registrar a recomendação.' }
      ],
      preClass: [
        {
          title: 'Materialized views in ClickHouse®: The data transformation Swiss Army knife',
          topics: ['Funcionamento incremental no momento da inserção', 'Tabelas de destino e resultados pré-computados', 'Transformações aplicadas ao fluxo de ingestão', 'Benefícios, custos e limitações operacionais'],
          url: 'https://www.propeldata.com/blog/materialized-views-in-clickhouse'
        },
        {
          title: 'Refreshable Materialized View',
          topics: ['Diferença entre materialized views incrementais e atualizáveis', 'Recomputação periódica do conjunto completo', 'Agendamento, atualização manual e uso de APPEND', 'Monitoramento por system.view_refreshes'],
          url: 'https://clickhouse.com/docs/materialized-view/refreshable-materialized-view'
        },
        {
          title: 'Postgres Tuning & Performance for Analytics Data',
          topics: ['Separação entre cargas OLTP e OLAP', 'Leitura de planos com EXPLAIN ANALYZE', 'Parâmetros de paralelismo e estratégias de indexação', 'Colunas geradas, materialized views e atualização periódica'],
          url: 'https://www.crunchydata.com/blog/postgres-tuning-and-performance-for-analytics-data'
        },
        {
          title: 'Optimizing Data Warehousing with PostgreSQL: Star Schema, Materialized Views, and Performance Tuning',
          topics: ['Organização dimensional em esquema estrela', 'Agregações pré-computadas com materialized views', 'Índices, particionamento e análise de planos', 'Comparação de desempenho antes e depois da otimização'],
          url: 'https://medium.com/@anjunittur123/optimizing-data-warehousing-with-postgresql-star-schema-materialized-views-and-performance-2efc6b57c54f'
        }
      ],
      outcomes: [
        'Interpretar partições, granules, linhas, buffers e cardinalidades em planos de execução.',
        'Aplicar PARTITION BY, PRIMARY KEY, ORDER BY e skip indexes em tabelas MergeTree.',
        'Comparar BRIN e B-tree em uma tabela fato particionada no PostgreSQL.',
        'Construir agregações pré-processadas com materialized views nos dois mecanismos.',
        'Executar ANALYZE e VACUUM e relacioná-los às estatísticas e à manutenção do PostgreSQL.',
        'Comprovar o efeito de cada estratégia por meio de um benchmark controlado.'
      ],
      sections: [
        {
          nav: 'Método experimental', title: 'Uma alteração por rodada',
          text: 'O benchmark mantém consulta, dados e conexão constantes. Registra-se a baseline, aplica-se uma alteração e repete-se a medição. A interpretação combina tempo, linhas, bytes, buffers e cardinalidade para explicar a variação observada.',
          checklist: [
            'Execute cada consulta ao menos três vezes e registre a mediana.',
            'Compare resultados antes de comparar desempenho.',
            'Altere apenas uma estrutura por rodada.'
          ],
          pitfall: 'Comparar consultas diferentes ou registrar somente a execução mais rápida invalida a conclusão.'
        },
        {
          nav: 'ClickHouse físico', title: 'MergeTree, ordenação e partições',
          text: 'No ClickHouse, ORDER BY define a ordenação física e, na ausência de outra declaração, também define a chave primária esparsa. PARTITION BY organiza o ciclo de vida e permite partition pruning; não substitui uma chave de ordenação coerente com os filtros frequentes.',
          checklist: [
            'Mantenha a chave primária como prefixo de ORDER BY.',
            'Use partições mensais para o conjunto anual do laboratório.',
            'Confirme parts e granules selecionados com EXPLAIN indexes = 1.'
          ],
          pitfall: 'Particionar por identificadores de alta cardinalidade produz excesso de partes e aumenta o custo operacional.'
        },
        {
          nav: 'ClickHouse adicional', title: 'Skip index e agregação incremental',
          text: 'Skip indexes descartam granules quando a chave principal não atende a um predicado seletivo. Materialized views incrementais deslocam agregações da leitura para a ingestão e exigem uma tabela de destino e uma estratégia explícita de backfill.',
          checklist: [
            'Teste o predicado antes e depois de materializar o skip index.',
            'Consulte a tabela de destino com sum para consolidar partes ainda não mescladas.',
            'Inclua dados históricos por INSERT INTO SELECT após criar a view.'
          ],
          pitfall: 'A materialized view incremental processa novos blocos; ela não preenche automaticamente o histórico já existente.'
        },
        {
          nav: 'PostgreSQL físico', title: 'Particionamento, BRIN e B-tree',
          text: 'No PostgreSQL, o particionamento declarativo permite eliminar partições fora do intervalo. BRIN resume faixas físicas e favorece tabelas extensas correlacionadas com a ordem de armazenamento; B-tree atende predicados seletivos e ordenados, com maior custo de armazenamento e escrita.',
          checklist: [
            'Confirme no plano quantas partições foram acessadas.',
            'Use BRIN para o intervalo temporal fisicamente correlacionado.',
            'Use B-tree composta para região e intervalo temporal.'
          ],
          pitfall: 'Criar ambos os índices sem comparar seus tamanhos e planos transfere custo para toda operação de escrita.'
        },
        {
          nav: 'PostgreSQL operacional', title: 'Estatísticas, manutenção e materialização',
          text: 'ANALYZE atualiza as estatísticas usadas pelo planejador. VACUUM recupera espaço reutilizável e mantém o mapa de visibilidade. A materialized view persiste o resultado e deve possuir política de atualização compatível com a defasagem admitida pelo consumidor.',
          checklist: [
            'Execute ANALYZE após a carga inicial e após mudanças relevantes de distribuição.',
            'Execute VACUUM fora de uma transação explícita no DBeaver.',
            'Crie índice UNIQUE antes de usar REFRESH MATERIALIZED VIEW CONCURRENTLY.'
          ],
          pitfall: 'Uma materialized view sem frequência de atualização definida pode entregar valores corretos para um estado já superado.'
        },
        {
          nav: 'Leitura dos planos', title: 'I/O, CPU e cardinalidade',
          text: 'No ClickHouse, read_rows, read_bytes, memory_usage e granules selecionados caracterizam o trabalho realizado. No PostgreSQL, buffers hit/read aproximam o comportamento de I/O, actual time localiza operadores custosos e a diferença entre rows estimadas e reais evidencia problemas de cardinalidade.',
          checklist: [
            'Registre o plano junto com o tempo medido.',
            'Distinga redução de leitura de mero efeito de cache.',
            'Verifique se a estratégia mantém o resultado da baseline.'
          ],
          pitfall: 'Uma redução de tempo sem redução explicável de trabalho não sustenta uma recomendação de arquitetura.'
        }
      ],
      dbeaver: {
        intro: 'Abra um editor SQL separado para cada conexão. Execute um bloco por vez com Ctrl+Enter; use Alt+X apenas quando desejar executar todo o roteiro daquela conexão. O delimitador permanece como ponto e vírgula.',
        rules: [
          'Não misture os dialetos: cada roteiro deve permanecer associado à respectiva conexão.',
          'Mantenha auto-commit ativado no bloco de VACUUM do PostgreSQL e não execute o refresh concorrente em uma transação longa.',
          'Não inclua host, usuário ou senha nos scripts compartilhados.'
        ],
        connections: [
          { engine: 'ClickHouse', text: 'Informe host, porta HTTP 8123 ou HTTPS 8443, database fornecido, usuário e senha. Teste a conexão antes de abrir o editor.' },
          { engine: 'PostgreSQL', text: 'Informe host, porta 5432 ou a porta fornecida, database, usuário e senha. Ative SSL quando o provedor exigir.' }
        ]
      },
      sqlLabs: [
        {
          engine: 'ClickHouse', file: 'aula-7-clickhouse.sql',
          goal: 'Comparar uma MergeTree sem chave útil com uma tabela particionada, ordenada e pré-agregada.',
          steps: [
            {
              title: '1. Preparar as tabelas',
              purpose: 'Recria o ambiente e estabelece uma baseline sem ordenação útil para os filtros analíticos.',
              focus: `CREATE TABLE aula_dw.fato_vendas_otimizada (...)
ENGINE = MergeTree
PARTITION BY toYYYYMM(data_venda)
PRIMARY KEY (regiao_id, data_venda)
ORDER BY (regiao_id, data_venda, produto_id);`,
              sql: `CREATE DATABASE IF NOT EXISTS aula_dw;

DROP TABLE IF EXISTS aula_dw.mv_vendas_dia;
DROP TABLE IF EXISTS aula_dw.vendas_dia;
DROP TABLE IF EXISTS aula_dw.fato_vendas_otimizada;
DROP TABLE IF EXISTS aula_dw.fato_vendas_base;

CREATE TABLE aula_dw.fato_vendas_base
(
    venda_id UInt64,
    data_venda DateTime,
    regiao_id UInt8,
    cliente_id UInt32,
    produto_id UInt16,
    valor Decimal(12, 2)
)
ENGINE = MergeTree
ORDER BY tuple();

CREATE TABLE aula_dw.fato_vendas_otimizada
(
    venda_id UInt64,
    data_venda DateTime,
    regiao_id UInt8,
    cliente_id UInt32,
    produto_id UInt16,
    valor Decimal(12, 2)
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(data_venda)
PRIMARY KEY (regiao_id, data_venda)
ORDER BY (regiao_id, data_venda, produto_id);`,
              observe: 'A chave primária é um prefixo da chave de ordenação. A tabela base usa ORDER BY tuple() e não possui uma chave útil para pruning.'
            },
            {
              title: '2. Gerar dois milhões de vendas',
              purpose: 'Cria dados determinísticos distribuídos ao longo de 2025 e copia o mesmo conjunto para as duas estruturas.',
              focus: `INSERT INTO aula_dw.fato_vendas_base
SELECT ...
FROM numbers(2000000);

INSERT INTO aula_dw.fato_vendas_otimizada
SELECT * FROM aula_dw.fato_vendas_base;`,
              sql: `INSERT INTO aula_dw.fato_vendas_base
SELECT
    number + 1 AS venda_id,
    toDateTime('2025-01-01 00:00:00')
        + toIntervalSecond(intDiv(number * 31536000, 2000000)) AS data_venda,
    toUInt8(number % 20 + 1) AS regiao_id,
    toUInt32(intDiv(number, 20) % 100000 + 1) AS cliente_id,
    toUInt16(number % 1000 + 1) AS produto_id,
    toDecimal64(10 + (number % 50000) / 100.0, 2) AS valor
FROM numbers(2000000);

INSERT INTO aula_dw.fato_vendas_otimizada
SELECT *
FROM aula_dw.fato_vendas_base;

SELECT
    table,
    sum(rows) AS linhas,
    count() AS partes,
    formatReadableSize(sum(bytes_on_disk)) AS armazenamento
FROM system.parts
WHERE database = 'aula_dw' AND active
GROUP BY table
ORDER BY table;`,
              observe: 'As duas tabelas devem possuir 2.000.000 de linhas. A tabela otimizada deve apresentar partições mensais.'
            },
            {
              title: '3. Comparar full scan, partition pruning e chave primária',
              purpose: 'Executa a mesma agregação nas duas tabelas e inspeciona os granules selecionados e o pipeline paralelo.',
              focus: `EXPLAIN indexes = 1
SELECT count(), sum(valor)
FROM aula_dw.fato_vendas_otimizada
WHERE regiao_id = 7
  AND data_venda >= '2025-07-01'
  AND data_venda <  '2025-07-08';`,
              sql: `EXPLAIN indexes = 1
SELECT count(), sum(valor)
FROM aula_dw.fato_vendas_base
WHERE regiao_id = 7
  AND data_venda >= toDateTime('2025-07-01 00:00:00')
  AND data_venda <  toDateTime('2025-07-08 00:00:00');

SELECT count(), sum(valor)
FROM aula_dw.fato_vendas_base
WHERE regiao_id = 7
  AND data_venda >= toDateTime('2025-07-01 00:00:00')
  AND data_venda <  toDateTime('2025-07-08 00:00:00');

EXPLAIN indexes = 1
SELECT count(), sum(valor)
FROM aula_dw.fato_vendas_otimizada
WHERE regiao_id = 7
  AND data_venda >= toDateTime('2025-07-01 00:00:00')
  AND data_venda <  toDateTime('2025-07-08 00:00:00');

SELECT count(), sum(valor)
FROM aula_dw.fato_vendas_otimizada
WHERE regiao_id = 7
  AND data_venda >= toDateTime('2025-07-01 00:00:00')
  AND data_venda <  toDateTime('2025-07-08 00:00:00');

EXPLAIN PIPELINE
SELECT regiao_id, count(), sum(valor)
FROM aula_dw.fato_vendas_otimizada
WHERE data_venda >= toDateTime('2025-01-01 00:00:00')
  AND data_venda <  toDateTime('2026-01-01 00:00:00')
GROUP BY regiao_id;`,
              observe: 'O plano otimizado deve mostrar Partition e PrimaryKey com uma fração menor de parts e granules. EXPLAIN PIPELINE explicita os processadores paralelos disponíveis.'
            },
            {
              title: '4. Materializar um skip index',
              purpose: 'Avalia um bloom filter para uma busca seletiva por cliente fora da chave primária.',
              focus: `ALTER TABLE aula_dw.fato_vendas_otimizada
ADD INDEX idx_cliente cliente_id
TYPE bloom_filter(0.01) GRANULARITY 1;

ALTER TABLE aula_dw.fato_vendas_otimizada
MATERIALIZE INDEX idx_cliente;`,
              sql: `EXPLAIN indexes = 1
SELECT count()
FROM aula_dw.fato_vendas_otimizada
WHERE regiao_id = 7 AND cliente_id = 50000;

ALTER TABLE aula_dw.fato_vendas_otimizada
ADD INDEX idx_cliente cliente_id
TYPE bloom_filter(0.01) GRANULARITY 1;

ALTER TABLE aula_dw.fato_vendas_otimizada
MATERIALIZE INDEX idx_cliente
SETTINGS mutations_sync = 1;

EXPLAIN indexes = 1
SELECT count()
FROM aula_dw.fato_vendas_otimizada
WHERE regiao_id = 7 AND cliente_id = 50000;

SELECT count()
FROM aula_dw.fato_vendas_otimizada
WHERE regiao_id = 7 AND cliente_id = 50000;

SELECT database, table, name, type, expr, granularity
FROM system.data_skipping_indices
WHERE database = 'aula_dw'
ORDER BY table, name;`,
              observe: 'O segundo plano deve incluir Skip com o índice idx_cliente. O índice somente se justifica se reduzir granules para o predicado observado.'
            },
            {
              title: '5. Criar uma agregação incremental',
              purpose: 'Mantém receita e quantidade por dia e região no momento da ingestão e preenche o histórico por backfill.',
              focus: `CREATE MATERIALIZED VIEW aula_dw.mv_vendas_dia
TO aula_dw.vendas_dia AS
SELECT toDate(data_venda) AS dia, regiao_id,
       count() AS quantidade, sum(valor) AS receita
FROM aula_dw.fato_vendas_otimizada
GROUP BY dia, regiao_id;`,
              sql: `CREATE TABLE aula_dw.vendas_dia
(
    dia Date,
    regiao_id UInt8,
    quantidade UInt64,
    receita Decimal(18, 2)
)
ENGINE = SummingMergeTree
PARTITION BY toYYYYMM(dia)
ORDER BY (dia, regiao_id);

CREATE MATERIALIZED VIEW aula_dw.mv_vendas_dia
TO aula_dw.vendas_dia AS
SELECT
    toDate(data_venda) AS dia,
    regiao_id,
    count() AS quantidade,
    CAST(sum(valor), 'Decimal(18, 2)') AS receita
FROM aula_dw.fato_vendas_otimizada
GROUP BY dia, regiao_id;

INSERT INTO aula_dw.vendas_dia
SELECT
    toDate(data_venda) AS dia,
    regiao_id,
    count() AS quantidade,
    CAST(sum(valor), 'Decimal(18, 2)') AS receita
FROM aula_dw.fato_vendas_otimizada
GROUP BY dia, regiao_id;

SELECT
    toDate(data_venda) AS dia,
    count() AS quantidade,
    sum(valor) AS receita
FROM aula_dw.fato_vendas_otimizada
WHERE regiao_id = 7
  AND data_venda >= toDateTime('2025-07-01 00:00:00')
  AND data_venda <  toDateTime('2025-08-01 00:00:00')
GROUP BY dia
ORDER BY dia;

SELECT
    dia,
    sum(quantidade) AS quantidade,
    sum(receita) AS receita
FROM aula_dw.vendas_dia
WHERE regiao_id = 7
  AND dia >= toDate('2025-07-01')
  AND dia <  toDate('2025-08-01')
GROUP BY dia
ORDER BY dia;

INSERT INTO aula_dw.fato_vendas_otimizada VALUES
(2000001, toDateTime('2025-07-15 12:00:00'), 7, 50000, 42, 199.90);

SELECT dia, sum(quantidade), sum(receita)
FROM aula_dw.vendas_dia
WHERE dia = toDate('2025-07-15') AND regiao_id = 7
GROUP BY dia;`,
              observe: 'As duas consultas diárias devem retornar os mesmos totais antes da inserção adicional. A última inserção deve ser incorporada automaticamente pela materialized view. Em produção, o backfill exige ingestão pausada ou corte temporal explícito para impedir lacunas e dupla contagem.'
            },
            {
              title: '6. Consultar as métricas executadas',
              purpose: 'Obtém duração, linhas, bytes e memória para as consultas recentes do laboratório.',
              focus: `SELECT query_duration_ms, read_rows, read_bytes, memory_usage
FROM system.query_log
WHERE type = 'QueryFinish'
ORDER BY event_time DESC;`,
              sql: `SYSTEM FLUSH LOGS;

SELECT
    event_time,
    query_duration_ms,
    read_rows,
    formatReadableSize(read_bytes) AS bytes_lidos,
    formatReadableSize(memory_usage) AS memoria,
    left(replaceAll(query, '\n', ' '), 120) AS consulta
FROM system.query_log
WHERE type = 'QueryFinish'
  AND event_time >= now() - INTERVAL 15 MINUTE
  AND has(databases, 'aula_dw')
  AND query NOT ILIKE '%system.query_log%'
ORDER BY event_time DESC
LIMIT 30;`,
              observe: 'Registre a mediana de três execuções e compare read_rows e read_bytes. Caso o usuário não possa executar SYSTEM FLUSH LOGS, aguarde a gravação assíncrona e execute somente o SELECT.'
            }
          ]
        },
        {
          engine: 'PostgreSQL', file: 'aula-7-postgresql.sql',
          goal: 'Comparar varredura sequencial, eliminação de partições, BRIN, B-tree e materialized view.',
          steps: [
            {
              title: '1. Preparar a tabela base e as partições',
              purpose: 'Recria o schema e define doze partições mensais para 2025.',
              focus: `CREATE TABLE aula_dw.fato_vendas_part (...)
PARTITION BY RANGE (data_venda);

CREATE TABLE aula_dw.fato_vendas_2025_07
PARTITION OF aula_dw.fato_vendas_part
FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');`,
              sql: `DROP SCHEMA IF EXISTS aula_dw CASCADE;
CREATE SCHEMA aula_dw;
SET search_path TO aula_dw, public;

CREATE TABLE aula_dw.fato_vendas_base
(
    venda_id bigint NOT NULL,
    data_venda timestamp NOT NULL,
    regiao_id smallint NOT NULL,
    cliente_id integer NOT NULL,
    produto_id integer NOT NULL,
    valor numeric(12, 2) NOT NULL
);

CREATE TABLE aula_dw.fato_vendas_part
(
    venda_id bigint NOT NULL,
    data_venda timestamp NOT NULL,
    regiao_id smallint NOT NULL,
    cliente_id integer NOT NULL,
    produto_id integer NOT NULL,
    valor numeric(12, 2) NOT NULL
)
PARTITION BY RANGE (data_venda);

CREATE TABLE aula_dw.fato_vendas_2025_01 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE aula_dw.fato_vendas_2025_02 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE aula_dw.fato_vendas_2025_03 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
CREATE TABLE aula_dw.fato_vendas_2025_04 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
CREATE TABLE aula_dw.fato_vendas_2025_05 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');
CREATE TABLE aula_dw.fato_vendas_2025_06 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');
CREATE TABLE aula_dw.fato_vendas_2025_07 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');
CREATE TABLE aula_dw.fato_vendas_2025_08 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');
CREATE TABLE aula_dw.fato_vendas_2025_09 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');
CREATE TABLE aula_dw.fato_vendas_2025_10 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
CREATE TABLE aula_dw.fato_vendas_2025_11 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
CREATE TABLE aula_dw.fato_vendas_2025_12 PARTITION OF aula_dw.fato_vendas_part FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');`,
              observe: 'A tabela particionada não armazena linhas no objeto pai; cada linha é encaminhada para a partição correspondente.'
            },
            {
              title: '2. Gerar dois milhões de vendas',
              purpose: 'Cria uma tabela fato em ordem temporal, copia as mesmas linhas para as partições e atualiza as estatísticas.',
              focus: `INSERT INTO aula_dw.fato_vendas_base
SELECT ...
FROM generate_series(1, 2000000) AS g;

INSERT INTO aula_dw.fato_vendas_part
SELECT * FROM aula_dw.fato_vendas_base;

ANALYZE aula_dw.fato_vendas_part;`,
              sql: `INSERT INTO aula_dw.fato_vendas_base
SELECT
    g AS venda_id,
    timestamp '2025-01-01 00:00:00'
        + (((CAST(g AS bigint) - 1) * 31536000 / 2000000) * interval '1 second') AS data_venda,
    CAST((g % 20) + 1 AS smallint) AS regiao_id,
    CAST((g % 100000) + 1 AS integer) AS cliente_id,
    CAST((g % 1000) + 1 AS integer) AS produto_id,
    CAST(10 + (g % 50000) / 100.0 AS numeric(12, 2)) AS valor
FROM generate_series(1, 2000000) AS g;

INSERT INTO aula_dw.fato_vendas_part
SELECT *
FROM aula_dw.fato_vendas_base;

ANALYZE aula_dw.fato_vendas_base;
ANALYZE aula_dw.fato_vendas_part;

SELECT
    CAST(tableoid AS regclass) AS particao,
    count(*) AS linhas
FROM aula_dw.fato_vendas_part
GROUP BY tableoid
ORDER BY particao;`,
              observe: 'As partições devem totalizar 2.000.000 de linhas. ANALYZE fornece ao planejador estatísticas da tabela base, das folhas e da hierarquia particionada.'
            },
            {
              title: '3. Comparar varredura e eliminação de partições',
              purpose: 'Executa a mesma consulta sem índices e identifica quantas relações são lidas.',
              focus: `EXPLAIN (ANALYZE, BUFFERS, SUMMARY)
SELECT count(*), sum(valor)
FROM aula_dw.fato_vendas_part
WHERE data_venda >= timestamp '2025-07-01'
  AND data_venda <  timestamp '2025-07-08';`,
              sql: `EXPLAIN (ANALYZE, BUFFERS, SUMMARY)
SELECT count(*), sum(valor)
FROM aula_dw.fato_vendas_base
WHERE data_venda >= timestamp '2025-07-01 00:00:00'
  AND data_venda <  timestamp '2025-07-08 00:00:00';

EXPLAIN (ANALYZE, BUFFERS, SUMMARY)
SELECT count(*), sum(valor)
FROM aula_dw.fato_vendas_part
WHERE data_venda >= timestamp '2025-07-01 00:00:00'
  AND data_venda <  timestamp '2025-07-08 00:00:00';

SET max_parallel_workers_per_gather = 4;

EXPLAIN (ANALYZE, BUFFERS, SUMMARY)
SELECT date_trunc('month', data_venda) AS mes, sum(valor)
FROM aula_dw.fato_vendas_base
GROUP BY mes
ORDER BY mes;`,
              observe: 'A consulta particionada deve acessar somente julho. A última consulta pode apresentar Partial Aggregate, Gather ou Gather Merge, conforme os recursos concedidos pelo serviço.'
            },
            {
              title: '4. Comparar BRIN e B-tree',
              purpose: 'Aplica um índice compacto para tempo e um índice composto para o predicado seletivo de região e tempo.',
              focus: `CREATE INDEX fato_vendas_data_brin
ON aula_dw.fato_vendas_part USING brin (data_venda);

CREATE INDEX fato_vendas_regiao_data_btree
ON aula_dw.fato_vendas_part USING btree (regiao_id, data_venda)
INCLUDE (valor);`,
              sql: `CREATE INDEX fato_vendas_data_brin
ON aula_dw.fato_vendas_part
USING brin (data_venda)
WITH (pages_per_range = 32);

CREATE INDEX fato_vendas_regiao_data_btree
ON aula_dw.fato_vendas_part
USING btree (regiao_id, data_venda)
INCLUDE (valor);

ANALYZE aula_dw.fato_vendas_part;

EXPLAIN (ANALYZE, BUFFERS, SUMMARY)
SELECT count(*), sum(valor)
FROM aula_dw.fato_vendas_part
WHERE data_venda >= timestamp '2025-07-01 00:00:00'
  AND data_venda <  timestamp '2025-07-08 00:00:00';

EXPLAIN (ANALYZE, BUFFERS, SUMMARY)
SELECT count(*), sum(valor)
FROM aula_dw.fato_vendas_part
WHERE regiao_id = 7
  AND data_venda >= timestamp '2025-07-01 00:00:00'
  AND data_venda <  timestamp '2025-07-08 00:00:00';

SELECT
    am.amname AS tipo_indice,
    pg_size_pretty(CAST(sum(pg_relation_size(idx.oid)) AS bigint)) AS tamanho_total
FROM pg_class AS idx
JOIN pg_index AS i ON i.indexrelid = idx.oid
JOIN pg_class AS tab ON tab.oid = i.indrelid
JOIN pg_namespace AS ns ON ns.oid = tab.relnamespace
JOIN pg_am AS am ON am.oid = idx.relam
WHERE ns.nspname = 'aula_dw'
  AND tab.relname LIKE 'fato_vendas_2025_%'
GROUP BY am.amname
ORDER BY am.amname;`,
              observe: 'O plano temporal tende a utilizar BRIN; o filtro de região e tempo tende a utilizar B-tree. Compare também o espaço total ocupado por cada método.'
            },
            {
              title: '5. Criar e atualizar a materialized view',
              purpose: 'Persiste a agregação diária, cria a chave exigida pelo refresh concorrente e compara a leitura com a tabela fato.',
              focus: `CREATE MATERIALIZED VIEW aula_dw.mv_vendas_dia AS
SELECT CAST(data_venda AS date) AS dia, regiao_id,
       count(*) AS quantidade, sum(valor) AS receita
FROM aula_dw.fato_vendas_part
GROUP BY CAST(data_venda AS date), regiao_id;

REFRESH MATERIALIZED VIEW CONCURRENTLY aula_dw.mv_vendas_dia;`,
              sql: `CREATE MATERIALIZED VIEW aula_dw.mv_vendas_dia AS
SELECT
    CAST(data_venda AS date) AS dia,
    regiao_id,
    count(*) AS quantidade,
    CAST(sum(valor) AS numeric(18, 2)) AS receita
FROM aula_dw.fato_vendas_part
GROUP BY CAST(data_venda AS date), regiao_id
WITH DATA;

CREATE UNIQUE INDEX mv_vendas_dia_pk
ON aula_dw.mv_vendas_dia (dia, regiao_id);

ANALYZE aula_dw.mv_vendas_dia;

EXPLAIN (ANALYZE, BUFFERS, SUMMARY)
SELECT
    CAST(data_venda AS date) AS dia,
    count(*) AS quantidade,
    sum(valor) AS receita
FROM aula_dw.fato_vendas_part
WHERE regiao_id = 7
  AND data_venda >= timestamp '2025-07-01 00:00:00'
  AND data_venda <  timestamp '2025-08-01 00:00:00'
GROUP BY CAST(data_venda AS date)
ORDER BY dia;

EXPLAIN (ANALYZE, BUFFERS, SUMMARY)
SELECT dia, quantidade, receita
FROM aula_dw.mv_vendas_dia
WHERE regiao_id = 7
  AND dia >= date '2025-07-01'
  AND dia <  date '2025-08-01'
ORDER BY dia;

INSERT INTO aula_dw.fato_vendas_part VALUES
(2000001, timestamp '2025-07-15 12:00:00', 7, 50000, 42, 199.90);

REFRESH MATERIALIZED VIEW CONCURRENTLY aula_dw.mv_vendas_dia;

SELECT *
FROM aula_dw.mv_vendas_dia
WHERE dia = date '2025-07-15' AND regiao_id = 7;`,
              observe: 'A materialized view reduz a quantidade de linhas lidas, mas permanece defasada entre dois refreshes. O índice UNIQUE permite atualizar sem bloquear leituras durante todo o recálculo.'
            },
            {
              title: '6. Executar manutenção e ler os indicadores',
              purpose: 'Atualiza uma partição e a hierarquia, consulta o histórico de manutenção e relaciona estatísticas ao plano.',
              focus: `VACUUM (ANALYZE, VERBOSE)
aula_dw.fato_vendas_2025_07;

ANALYZE VERBOSE aula_dw.fato_vendas_part;`,
              sql: `VACUUM (ANALYZE, VERBOSE) aula_dw.fato_vendas_2025_07;
ANALYZE VERBOSE aula_dw.fato_vendas_part;

SELECT
    relname,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'aula_dw'
ORDER BY relname;

EXPLAIN (ANALYZE, BUFFERS, SUMMARY)
SELECT count(*), sum(valor)
FROM aula_dw.fato_vendas_part
WHERE regiao_id = 7
  AND data_venda >= timestamp '2025-07-01 00:00:00'
  AND data_venda <  timestamp '2025-07-08 00:00:00';`,
              observe: 'Execute VACUUM com auto-commit. Compare rows estimadas e reais, shared hit/read blocks, tipo de scan e Execution Time.'
            }
          ]
        }
      ],
      benchmarkGuide: {
        intro: 'Para cada cenário, execute a consulta três vezes e registre a mediana. O primeiro resultado pode refletir cache frio; os seguintes caracterizam o caminho aquecido.',
        columns: ['Mecanismo', 'Consulta', 'Estratégia', 'Tempo mediano', 'Leitura', 'Plano', 'Resultado confere?'],
        rows: [
          ['ClickHouse', 'Região + 7 dias', 'Base / MergeTree otimizada', 'ms', 'read_rows e read_bytes', 'parts e granules', 'sim/não'],
          ['ClickHouse', 'Cliente seletivo', 'Sem / com skip index', 'ms', 'granules', 'Skip', 'sim/não'],
          ['ClickHouse', 'Receita diária', 'Fato / agregada', 'ms', 'read_rows', 'Aggregation', 'sim/não'],
          ['PostgreSQL', 'Intervalo de 7 dias', 'Heap / partições', 'ms', 'shared hit/read', 'Seq Scan / Append', 'sim/não'],
          ['PostgreSQL', 'Região + 7 dias', 'BRIN / B-tree', 'ms', 'buffers', 'Bitmap / Index Scan', 'sim/não'],
          ['PostgreSQL', 'Receita diária', 'Fato / materialized view', 'ms', 'buffers', 'Aggregate / Index Scan', 'sim/não']
        ]
      },
      sdd: {
        rf: 'RF-002 — Disponibilizar a receita diária por região para relatórios e painéis analíticos.',
        rnf: 'RNF-002 — A consulta de sete dias deve atender p95 menor ou igual a 2 s e reduzir a leitura em pelo menos 80% em relação à baseline, no conjunto de referência.',
        adr: 'ADR-DW-02 — No ClickHouse, ordenar por região e data e particionar por mês; no PostgreSQL, particionar por mês e aplicar B-tree em região e data. Materializar a receita diária quando a frequência de leitura compensar o custo de atualização.',
        gherkin: 'Dado o mesmo conjunto de vendas nos dois mecanismos, Quando a consulta otimizada é executada três vezes, Então o resultado é idêntico ao da baseline e a evidência registra plano, leitura e tempo mediano.'
      },
      acceptance: [
        'Os dois roteiros SQL são executados no DBeaver sem misturar conexões ou dialetos.',
        'O registro contém ao menos três execuções por cenário e apresenta a mediana.',
        'Cada comparação inclui o plano, a métrica de leitura e a conferência do resultado.',
        'A recomendação distingue ClickHouse e PostgreSQL e explicita o custo de escrita, armazenamento ou atualização introduzido.',
        'A materialização possui estratégia de backfill ou refresh e defasagem declarada.'
      ],
      deliverable: 'Relatório comparativo com as seis linhas do benchmark, planos de execução antes e depois, interpretação do gargalo e recomendação técnica para o Data Warehouse do projeto.',
      closingQuestion: 'Qual estratégia apresenta evidência suficiente para integrar o Data Warehouse do projeto?',
      references: [
        { label: 'ClickHouse Docs — MergeTree table engine', href: 'https://clickhouse.com/docs/engines/table-engines/mergetree-family/mergetree' },
        { label: 'ClickHouse Docs — Data skipping indexes', href: 'https://clickhouse.com/docs/optimize/skipping-indexes' },
        { label: 'ClickHouse Docs — Incremental materialized views', href: 'https://clickhouse.com/docs/materialized-view/incremental-materialized-view' },
        { label: 'ClickHouse Docs — Refreshable materialized views', href: 'https://clickhouse.com/docs/materialized-view/refreshable-materialized-view' },
        { label: 'PostgreSQL 18 — Table Partitioning', href: 'https://www.postgresql.org/docs/18/ddl-partitioning.html' },
        { label: 'PostgreSQL 18 — Using EXPLAIN', href: 'https://www.postgresql.org/docs/18/using-explain.html' },
        { label: 'PostgreSQL 18 — Materialized Views', href: 'https://www.postgresql.org/docs/18/rules-materializedviews.html' },
        { label: 'PostgreSQL 18 — Routine Vacuuming', href: 'https://www.postgresql.org/docs/18/routine-vacuuming.html' }
      ]
    },

    10: {
      title: 'Armazenamento em Grande Escala', date: '01/09/2026',
      subtitle: 'Guardar petabytes com desempenho, garantias distribuídas e custo previsível, e construir um lakehouse em MinIO e DuckDB durante o encontro.',
      objective: 'Escolher formatos, organização física, camadas de armazenamento e políticas de ciclo de vida para dados em escala, reconhecendo as propriedades distribuídas que sustentam essas decisões, e provar a escolha construindo um lakehouse que responda a perguntas de negócio.',
      outcomes: [
        'Dimensionar armazenamento por throughput, concorrência, latência e volume, considerados em conjunto.',
        'Escolher o formato físico a partir do padrão de leitura predominante.',
        'Definir layout e compactação que sustentem pruning eficaz.',
        'Explicar particionamento, replicação, quórum e consistência como decisões de projeto, com efeito observável no pipeline.',
        'Construir um lakehouse local com MinIO e DuckDB, em camadas bronze, silver e gold sobre dados reais, e medir o resultado de cada decisão.',
        'Modelar dimensionalmente o conjunto da Olist e responder, com SQL executado, a três perguntas de negócio sobre região, produto e sazonalidade.',
        'Aplicar ciclo de vida, tiering e orçamento por domínio.'
      ],
      sections: [
        {
          nav: 'O que escala', title: 'O que escala',
          text: 'O volume constitui uma entre várias dimensões de escala. Considere também throughput, concorrência, tamanho dos arquivos, latência, retenção, recuperação e custo por consulta.',
          checklist: [
            'Liste throughput de escrita, concorrência de leitura e latência exigida.',
            'Estime o crescimento projetado para 24 meses.',
            'Defina a janela de retenção antes de escolher a classe de storage.'
          ],
          pitfall: 'Dimensionar exclusivamente pelo volume armazenado. Um layout adequado a petabytes falha sob dez mil leitores concorrentes.'
        },
        {
          nav: 'Object storage', title: 'Object storage',
          text: 'Buckets e objetos oferecem durabilidade e escala, mas exigem convenções de nome, controle de acesso, versionamento e catálogo externo. O objeto é gravado integralmente e identificado por uma chave: o segmento que se assemelha a pasta constitui prefixo, e a renomeação equivale a uma reescrita.',
          checklist: [
            'Padronize a convenção de prefixo antes do primeiro arquivo.',
            'Ative versionamento e defina quem pode apagar.',
            'Mantenha um catálogo externo, uma vez que o bucket não descreve o dado.'
          ],
          pitfall: 'Tratar o bucket como sistema de arquivos. Sem catálogo, não há registro do que existe nem do schema vigente.'
        },
        {
          nav: 'Formato físico', title: 'Formato físico',
          text: 'O CSV favorece a portabilidade, o Parquet favorece a leitura colunar, a compressão e o pruning por estatística de bloco, e o Avro favorece a serialização orientada a registros e a evolução de schema declarada.',
          checklist: [
            'Use colunar quando a leitura seleciona poucas colunas de muitas linhas.',
            'Escolha a compressão pelo par CPU/leitura, uma vez que o maior fator de redução constitui critério insuficiente.',
            'Fixe o formato por camada e documente a exceção.',
            'Reserve o Avro para transporte de eventos e aterrissagem, onde o schema acompanha o dado e a evolução é declarada.'
          ],
          pitfall: 'CSV na camada analítica. Sem tipo nem estatística por bloco, toda consulta lê o arquivo inteiro.'
        },
        {
          nav: 'Layout e compactação', title: 'Layout',
          text: 'Particione por colunas de filtro estáveis e de baixa ou moderada cardinalidade. Evite arquivos pequenos, compactando e monitorando o tamanho médio. Cada arquivo custa uma abertura, uma leitura de rodapé e uma entrada de metadado.',
          checklist: [
            'Particione por coluna de filtro estável e cardinalidade moderada.',
            'Monitore o tamanho médio de arquivo e compacte quando cair.',
            'Meça bytes lidos por consulta como indicador da qualidade do layout.',
            'Avalie a cardinalidade da coluna candidata antes de particionar, uma vez que o valor quase único produz um arquivo por linha.'
          ],
          pitfall: 'Ingestão em micro-lotes sem compactação. Milhões de arquivos de 1 MB tornam o metadado o gargalo.'
        },
        {
          nav: 'Partição e réplica', title: 'Propriedades distribuídas',
          text: 'Em escala, o armazenamento se realiza por particionamento e replicação. O particionamento divide o conjunto por uma chave e distribui a carga, e a replicação repete cada fatia em nós distintos, de modo que a falha de máquina se torna evento operacional e o dado permanece preservado nas demais cópias. O quórum, definido pelo número de réplicas que confirmam a escrita e que respondem à leitura, estabelece a relação entre latência e garantia.',
          checklist: [
            'Escolha uma chave de partição uniforme, uma vez que a chave enviesada concentra a carga em um nó.',
            'Declare o fator de replicação e o comportamento esperado quando um nó cai.',
            'Distinga durabilidade de disponibilidade, e réplica de backup.'
          ],
          pitfall: 'Confundir réplica com backup. A réplica propaga o apagamento, e o backup preserva o estado anterior.'
        },
        {
          nav: 'Consistência', title: 'Consistência e efeito no pipeline',
          text: 'A leitura pode devolver estado anterior à última escrita. Havendo partição de rede, a escolha recai entre consistência e disponibilidade, e na ausência de partição, entre consistência e latência. No lakehouse, essa escolha se manifesta como escrita não atômica, listagem eventual, reentrega de mensagens e falha parcial de carga, e cada uma dessas manifestações impõe uma regra de engenharia correspondente.',
          checklist: [
            'Publique por troca de ponteiro, de modo que a versão se torne visível apenas com o commit no catálogo.',
            'Torne a ingestão idempotente por chave natural e janela.',
            'Separe data do evento de data de ingestão e declare a janela de atraso aceita.'
          ],
          pitfall: 'Depender da listagem do bucket para saber quais arquivos compõem a tabela. Sob consistência eventual, a listagem devolve resultado incompleto por alguns instantes.'
        },
        {
          nav: 'Repositórios analíticos', title: 'Warehouse, lake, mart e lakehouse',
          text: 'O data warehouse aplica schema na escrita e serve o analista de negócio; o data lake aplica schema na leitura e aceita dado bruto; o data mart é um recorte departamental; o lakehouse declara o schema em catálogo sobre arquivos abertos e serve os três públicos com uma única cópia.',
          checklist: [
            'Identifique, no projeto do parceiro, qual dos quatro já existe de fato.',
            'Justifique cada repositório pelo público e pela decisão que ele sustenta.',
            'Verifique se o modelo dimensional tem onde viver dentro da arquitetura escolhida.'
          ],
          pitfall: 'Denominar data lake um diretório de arquivos desprovido de catálogo, contrato e responsável designado. A ausência desses três elementos caracteriza um repositório sem governança.'
        },
        {
          nav: 'Lakehouse e camadas', title: 'Lakehouse e camadas por contrato',
          text: 'Tabelas transacionais adicionam atomicidade, histórico e evolução sobre storage aberto. Bronze, silver e gold se diferenciam pelo contrato que assumem: fidelidade à origem, conformidade e semântica de negócio.',
          checklist: [
            'Diferencie as camadas pelo contrato de qualidade que cada uma assume.',
            'Use tabela transacional quando houver escrita concorrente ou correção retroativa.',
            'Registre o schema e sua evolução no catálogo.'
          ],
          pitfall: 'Manter bronze, silver e gold sob o mesmo contrato de qualidade. Sem mudança de compromisso, as três constituem cópias do mesmo conjunto.'
        },
        {
          nav: 'Card de trabalho', title: 'As três perguntas da atividade em sala',
          text: 'A segunda hora do encontro é atividade em grupo sobre os dados da Olist: qual região está com o menor volume de vendas; qual é o produto mais vendido nessa região; e qual foi a sazonalidade desse produto ao longo do período em que foi vendido. As três se respondem no mesmo fato, no grão do item de pedido entregue, cortado por geografia, produto e tempo.',
          checklist: [
            'Declare a definição de volume adotada, receita ou quantidade, e mantenha-a nas três respostas.',
            'Declare se produto é o item individual ou a categoria, e justifique pela pergunta de negócio.',
            'Considere que os meses de borda contêm poucos dias de venda ao interpretar a sazonalidade.'
          ],
          pitfall: 'Responder por estimativa ou por consulta sobre o CSV bruto. A resposta é válida quando produzida sobre a camada gold, com o recorte de status e a definição de volume declarados.'
        },
        {
          nav: 'Lakehouse com MinIO e DuckDB', title: 'Construção do lakehouse em sala',
          text: 'O laboratório usa MinIO como object storage compatível com S3 e DuckDB como motor analítico. A bronze grava os CSVs em Parquet particionado dentro do bucket, a silver declara os tipos e garante uma linha por pedido, e a gold monta o fato no grão do item entregue com as dimensões de região, produto e mês. A IA é usada para reconhecer o schema, gerar o SQL e criticar o próprio resultado, e a verificação permanece com o grupo.',
          checklist: [
            'Configure o acesso ao MinIO com URL_STYLE path e USE_SSL false, uma vez que, na ausência desses parâmetros, o DuckDB adota o estilo de domínio da AWS.',
            'Confirme que a contagem da bronze é idêntica à do CSV de origem antes de modelar.',
            'Confira a contagem do fato antes e depois de cada junção, uma vez que a junção incorreta multiplica linhas sem emitir erro.'
          ],
          pitfall: 'Aceitar o SQL gerado por IA sem execução e conferência. Coluna inexistente e junção plausível permanecem despercebidas até a divergência do resultado.'
        },
        {
          nav: 'FinOps do armazenamento', title: 'Custo e segurança',
          text: 'Aplique lifecycle, tiering, retenção, criptografia, políticas por prefixo, acesso mínimo e orçamento por domínio. A varredura do acervo responde pela maior parte do custo do armazenamento.',
          checklist: [
            'Aplique regra de lifecycle automática para transição e expurgo.',
            'Atribua orçamento e alerta de custo por domínio.',
            'Conceda acesso mínimo por prefixo e audite o uso.'
          ],
          pitfall: 'Reter todo o acervo indefinidamente sob o argumento do baixo custo de guarda. A despesa relevante decorre da varredura repetida desse acervo.'
        }
      ],
      sdd: {
        rf: 'RF-004 — Manter cinco anos de eventos brutos consultáveis sob demanda para auditoria.',
        rnf: 'RNF-004 — Tamanho médio de arquivo entre 128 MB e 1 GB; dados com mais de 12 meses em classe fria; carga idempotente sob reentrega; custo mensal dentro do orçamento do domínio.',
        adr: 'ADR-STO-01 — Parquet particionado por ano e mês, publicado por commit no catálogo. Alternativa descartada: JSON particionado por dia, que impede pruning por coluna e multiplica arquivos pequenos. Consequência: exige rotina de compactação e manutenção de snapshots.',
        gherkin: 'Dado um diretório com 10 000 arquivos de 1 MB, Quando executo a compactação, Então restam arquivos de pelo menos 128 MB e a mesma consulta lê menos bytes.'
      },
      deliverable: 'O pipeline versionado do card de trabalho, composto pela ingestão dos CSVs da Olist em Parquet no bucket MinIO, pelo modelo dimensional no grão do item entregue e pelas três consultas, com as três respostas em número, a definição de volume e o recorte de status declarados, e ao menos uma evidência medida: tamanho por formato, número e tamanho dos arquivos ou bytes lidos pela mesma consulta antes e depois.',
      references: [
        { label: 'Dados do laboratório — Olist, oito tabelas em CSV (ZIP, 28 MB)', href: '../assets/olist/olist-csv.zip' },
        { label: 'Dados do laboratório — amostra em Excel, 2 000 linhas por tabela (1 MB)', href: '../assets/olist/olist-amostra.xlsx' },
        { label: 'Apache Parquet Documentation', href: 'https://parquet.apache.org/docs/' },
        { label: 'Apache Iceberg Documentation', href: 'https://iceberg.apache.org/docs/latest/' },
        { label: 'Delta Lake Protocol', href: 'https://github.com/delta-io/delta/blob/master/PROTOCOL.md' },
        { label: 'DuckDB Documentation — Reading and writing Parquet', href: 'https://duckdb.org/docs/stable/data/parquet/overview.html' },
        { label: 'DuckDB Documentation — S3 API support (httpfs)', href: 'https://duckdb.org/docs/stable/core_extensions/httpfs/s3api.html' },
        { label: 'MinIO — Container installation', href: 'https://min.io/docs/minio/container/index.html' },
        { label: 'Olist — Brazilian E-Commerce Public Dataset', href: 'https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce' },
        { label: 'Autoestudo — Estudo de caso: os desafios críticos de dados da Coca-Cola Andina', href: 'https://cobalt-blarney-8b3.notion.site/Estudo-de-Caso-Os-Desafios-Cr-ticos-de-Dados-da-Coca-Cola-Andina-250256ceaea78028b1c3cb5d4ed774b0' },
        { label: 'Autoestudo — Databases vs Data Warehouses vs Data Lakes (vídeo)', href: 'https://www.youtube.com/watch?v=FxpRL0m9BcA' },
        { label: 'Autoestudo — AWS: diferença entre data warehouse, data lake e data mart', href: 'https://aws.amazon.com/pt/compare/the-difference-between-a-data-warehouse-data-lake-and-data-mart/' }
      ]
    },

    12: {
      title: 'Coleta e Extração', date: '09/09/2026',
      subtitle: 'Da origem ao dado bruto com completude, rastreabilidade e reprocessamento seguro, e a construção de uma extração incremental sobre uma origem que muda durante o encontro.',
      objective: 'Levantar o contrato de uma fonte, escolher entre full load, incremental por carimbo de tempo e captura pelo log a partir da semântica de atualização da origem, e construir uma extração idempotente cuja divergência seja medida e explicada.',
      outcomes: [
        'Levantar o contrato de uma fonte antes de escrever qualquer extração.',
        'Escolher entre full load, incremental por carimbo e captura pelo log pela semântica de atualização da origem.',
        'Explicar as três formas de divergência do incremental e a defesa correspondente a cada uma.',
        'Implementar marca d\'água com janela, sobreposição e avanço condicionado à conclusão do lote.',
        'Garantir idempotência e replay de qualquer janela dentro do período de retenção.',
        'Medir, em número, o que uma estratégia de extração deixa de capturar e o efeito disso sobre a receita apurada.',
        'Registrar operação suficiente para auditar e reprocessar sem intervenção manual.'
      ],
      sections: [
        {
          nav: 'A fronteira', title: 'A fronteira da extração',
          text: 'A extração é a única etapa do pipeline que depende de um sistema sobre o qual a equipe de dados não tem autoridade. O sistema transacional otimiza a escrita e o atendimento ao usuário, e a leitura analítica compete por recurso. A completude precisa ser verificada por contagem reconciliada com a origem.',
          checklist: [
            'Registre a janela de disponibilidade em que a origem aceita carga de leitura.',
            'Verifique a completude por contagem reconciliada, e não pelo encerramento do processo.',
            'Trate a origem como contrato negociado, e não como conhecimento tácito da equipe.'
          ],
          pitfall: 'Tratar o encerramento sem exceção como prova de completude. O processo termina normalmente quando a origem devolve página vazia por limite de requisições.'
        },
        {
          nav: 'Perfil das fontes', title: 'Conheça a origem',
          text: 'Mapeie responsável, frequência, chave natural, timezone, semântica de atualização, limites, dados sensíveis, janela de disponibilidade e crescimento projetado. Os nove atributos determinam a estratégia, e levantá-los depois da implementação custa a reescrita do pipeline.',
          checklist: [
            'Registre dono, frequência, chave natural, timezone e janela de disponibilidade.',
            'Pergunte se a origem faz exclusão física ou lógica, e como ela é observável de fora.',
            'Classifique os campos sensíveis antes da primeira extração.'
          ],
          pitfall: 'Assumir que existe um campo de atualização confiável. Muitas origens alteram a linha por rotina administrativa sem tocar nesse campo.'
        },
        {
          nav: 'Semântica de atualização', title: 'O que a origem faz com a correção',
          text: 'Três comportamentos distintos, com consequências opostas. A origem que somente insere admite incremental por carimbo de criação; a que atualiza no lugar exige carimbo de atualização mantido com disciplina; a que exclui fisicamente exige captura pelo log ou reconciliação periódica de chaves.',
          checklist: [
            'Determine se o cancelamento produz linha nova, altera a linha ou a remove.',
            'Verifique se o campo de atualização se move em toda escrita, inclusive nas administrativas.',
            'Declare qual das três estratégias a semântica observada torna admissível.'
          ],
          pitfall: 'Escolher a estratégia pelo volume da origem. O volume determina o custo, e a semântica de atualização determina a corretude.'
        },
        {
          nav: 'Estratégias de extração', title: 'Full load, incremental e captura pelo log',
          text: 'Full load é simples e caro, e captura inserção, atualização e exclusão sem exigir campo de controle. O incremental por carimbo é barato e condicional, uma vez que a exclusão física nunca chega. A captura pelo log recebe cada operação como evento, e exige retenção, acesso privilegiado e garantia de ordenação.',
          checklist: [
            'Use full load enquanto o volume permitir, ou como reconciliação periódica.',
            'Em incremental por carimbo, aceite sobreposição de janela e deduplique por chave natural.',
            'Adote captura pelo log quando exclusões e correções retroativas alterarem a resposta analítica.'
          ],
          pitfall: 'Incremental por carimbo em origem que apaga registros. As exclusões nunca chegam e o destino diverge de forma permanente e cumulativa.'
        },
        {
          nav: 'Marca d\'água', title: 'Janela, sobreposição e avanço condicionado',
          text: 'A marca d\'água é um valor persistido, avançado apenas quando o lote inteiro conclui. A janela seguinte parte dele com sobreposição deliberada, porque o registro gravado no instante da virada pode não estar visível quando a extração lê.',
          checklist: [
            'Aplique sobreposição de alguns minutos e deduplique o resultado por chave natural.',
            'Avance a marca somente após a gravação do lote concluir.',
            'Separe a data do evento da data de ingestão e filtre a janela pela segunda.'
          ],
          pitfall: 'Avançar a marca no início do lote. Uma falha no meio da gravação produz lacuna permanente, porque a janela seguinte já parte do ponto posterior.'
        },
        {
          nav: 'Idempotência', title: 'Idempotência e replay',
          text: 'A mesma janela reprocessada deve produzir o mesmo destino. A propriedade depende de três elementos declarados: chave natural, ordenação de chegada e regra determinística de desempate. Sem eles, duas execuções da mesma janela produzem resultados distintos.',
          checklist: [
            'Identifique cada execução com batch_id e marca d\'água persistidos.',
            'Garanta que reprocessar a mesma janela não altera o volume final.',
            'Deduplique por chave natural com regra determinística de desempate.'
          ],
          pitfall: 'Confiar em exclusão seguida de inserção fora de transação. A falha entre as duas operações deixa o destino vazio, e a consulta executada nesse intervalo devolve resultado incorreto sem erro.'
        },
        {
          nav: 'APIs e paginação', title: 'APIs',
          text: 'Implemente paginação, limite de requisições, retry com recuo exponencial, autenticação, checkpoint e registro da resposta original. O código de status informa que a requisição foi atendida, e nada declara sobre quantos registros deveriam ter vindo.',
          checklist: [
            'Implemente retry com recuo exponencial, variação aleatória e teto de tentativas.',
            'Persista a resposta original antes de qualquer conversão.',
            'Valide a completude pela contagem declarada ou pelo cursor, e não pelo código de status.'
          ],
          pitfall: 'Encerrar a paginação no primeiro retorno vazio. O limite de requisições produz exatamente esse retorno, e a extração termina incompleta relatando sucesso.'
        },
        {
          nav: 'Arquivos e schema drift', title: 'Arquivos',
          text: 'Valide nome, encoding, schema, delimitador, duplicidade, checksum e atomicidade da chegada. Separe landing de processamento. A extração posicional quebra em silêncio quando a origem acrescenta, renomeia ou reordena uma coluna.',
          checklist: [
            'Separe landing de processamento e mova o arquivo apenas após verificar o checksum.',
            'Leia por nome de coluna e valide o schema contra o contrato registrado.',
            'Trate coluna nova como evento de governança, com decisão registrada.'
          ],
          pitfall: 'Ler o arquivo enquanto ele ainda está sendo gravado. A carga sai parcial e o processo relata sucesso.'
        },
        {
          nav: 'Operação e replay', title: 'Operação',
          text: 'A tabela de controle registra lote, origem, janela, marca d\'água, volume, bytes, status, erro e localização dos rejeitados. É o que transforma a extração em operação auditável, com estado consultável e replay previsível.',
          checklist: [
            'Registre início, fim, volume, bytes, status e onde estão os rejeitados.',
            'Mantenha o registro rejeitado acessível com o dado original e o motivo.',
            'Documente o procedimento de replay e execute-o ao menos uma vez fora de incidente.'
          ],
          pitfall: 'Descartar o registro rejeitado deixando apenas um log de erro. Sem o dado original não há como reprocessar nem explicar a diferença ao time de negócio.'
        },
        {
          nav: 'Card de trabalho', title: 'As três perguntas da atividade em sala',
          text: 'A segunda hora do encontro é atividade em grupo sobre uma origem transacional em Postgres carregada com os pedidos da Olist: quantas linhas o incremental deixou de capturar; quantos pedidos excluídos permaneceram no destino; e se reprocessar a mesma janela altera o resultado. As três se respondem por contagem executada, e não por descrição do comportamento esperado.',
          checklist: [
            'Anote a contagem inicial de 99 441 pedidos antes de qualquer extração.',
            'Aplique as três mutações deliberadas e registre a sequência em que foram executadas.',
            'Converta a divergência em receita, porque é nessa forma que ela chega ao negócio.'
          ],
          pitfall: 'Responder por estimativa do que a estratégia deveria capturar. A resposta é válida quando produzida por anti-junção e comparação de estado entre origem e destino.'
        },
        {
          nav: 'Extração com Postgres e DuckDB', title: 'Construção da extração em sala',
          text: 'O laboratório acrescenta ao lakehouse da Aula 10 uma origem viva: um Postgres em container com a tabela de pedidos, anexado ao DuckDB pela extensão postgres. Sobre ela se executa um full load de referência, uma janela incremental com marca d\'água, três mutações deliberadas e a reconciliação por chave. A IA gera o SQL e critica o próprio resultado, e a conferência dos números permanece com o grupo.',
          checklist: [
            'Confirme que a contagem na origem coincide com a do CSV antes de extrair.',
            'Verifique se o SQL gerado avança a marca d\'água antes ou depois da gravação.',
            'Compare a contagem antes e depois do replay: o crescimento é a assinatura da carga não idempotente.'
          ],
          pitfall: 'Aceitar o SQL gerado por IA sem execução e conferência. A ordem invertida entre gravação e avanço da marca permanece despercebida até a primeira falha parcial.'
        }
      ],
      sdd: {
        rf: 'RF-005 — Ingerir todas as alterações de pedidos da origem, inclusive exclusões e correções retroativas.',
        rnf: 'RNF-005 — Atraso da marca d\'água menor ou igual a 1 h; taxa de rejeição até 0,1%; qualquer janela dos últimos 30 dias reprocessável sem intervenção manual.',
        adr: 'ADR-ING-01 — Captura pelo log de transações em vez de incremental por campo de atualização. Contexto: a origem apaga registros e corrige lançamentos com data retroativa. Consequência: exige retenção do log na origem e garantia de ordenação na entrega.',
        gherkin: 'Dado que o lote de 09/09/2026 já foi carregado, Quando reprocesso o mesmo batch_id, Então o volume no destino permanece igual e a auditoria registra duas execuções.'
      },
      deliverable: 'O pipeline de extração versionado do card de trabalho, composto pelo SQL da carga inicial, da janela incremental e da reconciliação, com os três números medidos — linhas não capturadas, chaves excluídas remanescentes e contagem antes e depois do replay —, a sequência de mutações registrada, a decisão sobre exclusão marcada ou removida declarada por escrito, e a tabela de controle com uma linha por execução.',
      references: [
        { label: 'Debezium — Change Data Capture', href: 'https://debezium.io/documentation/reference/stable/index.html' },
        { label: 'Google SRE Book — Handling overload', href: 'https://sre.google/sre-book/handling-overload/' },
        { label: 'RFC 9110 — HTTP Semantics', href: 'https://www.rfc-editor.org/rfc/rfc9110.html' },
        { label: 'DuckDB Documentation — PostgreSQL extension', href: 'https://duckdb.org/docs/stable/core_extensions/postgres.html' },
        { label: 'Airbyte Documentation — Sync modes', href: 'https://docs.airbyte.com/' },
        { label: 'Olist — Brazilian E-Commerce Public Dataset', href: 'https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce' }
      ]
    },
    13: {
      title: 'Transformação e Carga', date: '10/09/2026',
      subtitle: 'Transformar e publicar dados com determinismo, testes escritos antes da transformação e cargas coerentes com a política de histórico.',
      objective: 'Escrever uma transformação determinística, especificar testes de qualidade que falham antes de a transformação existir e escolher a estratégia de carga coerente com a política de histórico da tabela.',
      outcomes: [
        'Decidir entre ETL e ELT pela necessidade futura de recalcular o passado sob outra regra.',
        'Escrever transformação determinística e identificar as construções que quebram essa propriedade.',
        'Reconhecer as quatro decisões técnicas que alteram o número apresentado ao negócio.',
        'Especificar testes de qualidade que falham antes de a transformação existir.',
        'Deduplicar por chave, ordenação e desempate declarados, em vez de operador de conjunto.',
        'Escolher entre append, overwrite, merge e snapshot pela política de histórico da dimensão.',
        'Provar a repetibilidade da carga por soma de receita idêntica entre duas execuções.'
      ],
      sections: [
        {
          nav: 'ETL ou ELT', title: 'Onde transformar',
          text: 'ETL transforma antes de gravar e economiza armazenamento, ao custo de não preservar o bruto. ELT preserva a entrada e transforma no destino, o que permite recalcular o passado quando a regra muda. O critério é a necessidade futura de responder qual seria o número sob outra definição.',
          checklist: [
            'Verifique se o dado bruto precisa ser preservado para auditoria ou recálculo.',
            'Compare o custo de processamento no destino com o da ferramenta externa.',
            'Considere onde o dado sensível pode legalmente ser processado.'
          ],
          pitfall: 'Transformar antes de guardar o bruto. Quando a definição de receita mudar, o passado não poderá ser recalculado e a série passará a misturar dois critérios.'
        },
        {
          nav: 'Determinismo', title: 'Determinismo',
          text: 'A mesma entrada e os mesmos parâmetros devem gerar a mesma saída. Quatro construções quebram essa propriedade: data corrente dentro da transformação, ordenação parcial em função de janela, aleatoriedade e dependência da ordem física do arquivo.',
          checklist: [
            'Declare a janela como parâmetro de entrada, e não como expressão sobre a data corrente.',
            'Use ordenação total na função de janela, com critério de desempate explícito.',
            'Fixe timezone e arredondamento, e versione o código registrando a versão de cada carga.'
          ],
          pitfall: 'Usar a data corrente dentro da transformação. O mesmo backfill produz resultado diferente a cada execução, e a série histórica deixa de ser reproduzível.'
        },
        {
          nav: 'Decisões silenciosas', title: 'O que altera o número sem produzir erro',
          text: 'Fuso horário, tratamento de nulo em medida, momento do arredondamento e tipo de junção alteram o valor apresentado sem gerar exceção. A junção interna que descarta o fato sem dimensão correspondente é a mais perigosa, porque reduz o total sem emitir aviso.',
          checklist: [
            'Registre o fuso adotado no contrato da camada de consumo.',
            'Declare se o nulo em medida é zero, ignorado ou motivo de rejeição.',
            'Compare a contagem antes e depois de cada junção, e explique toda diferença.'
          ],
          pitfall: 'Adotar junção interna por padrão. O fato sem dimensão correspondente desaparece do total, e nenhuma mensagem indica que isso ocorreu.'
        },
        {
          nav: 'Qualidade', title: 'O teste que falha primeiro',
          text: 'Teste schema, obrigatoriedade, unicidade, relacionamento, domínio de valores, atualidade, volume e reconciliação com a origem. O teste é escrito antes da transformação e precisa falhar, porque a falha inicial é a única prova de que ele detecta o defeito.',
          checklist: [
            'Escreva o teste antes da transformação e registre a saída em que ele falha.',
            'Cubra schema, nulos, unicidade, relacionamento e faixa de valores.',
            'Reconcilie contagem e soma com a origem, e declare a tolerância aceita.'
          ],
          pitfall: 'Testar apenas o que já passa. O conjunto de testes que nunca reprovou não oferece evidência sobre a capacidade de detectar defeito.'
        },
        {
          nav: 'Deduplicação', title: 'Deduplicação por regra declarada',
          text: 'Defina a chave do evento, a ordenação que elege o vencedor e a regra de desempate. O carimbo da origem precede o de chegada, porque o segundo reflete a ordem de processamento e se inverte sob reprocessamento.',
          checklist: [
            'Defina chave, ordenação e desempate por escrito antes de implementar.',
            'Prefira o carimbo de origem ao de chegada para eleger o registro vencedor.',
            'Registre quantos registros foram descartados em cada execução.'
          ],
          pitfall: 'Usar DISTINCT para resolver duplicidade. O operador remove apenas linhas idênticas, e a duplicata com um campo atualizado permanece nas duas versões.'
        },
        {
          nav: 'Carga incremental', title: 'Append, overwrite, merge e snapshot',
          text: 'Append acrescenta sem tocar no existente; overwrite recompõe a partição inteira; merge atualiza por chave; snapshot preserva o estado completo por data. As quatro exigem atomicidade, de modo que o consumidor nunca enxergue carga pela metade.',
          checklist: [
            'Alinhe a estratégia de carga à política de histórico da dimensão.',
            'Garanta atomicidade por troca de ponteiro na publicação.',
            'Defina e declare a janela de correção retroativa suportada.'
          ],
          pitfall: 'Merge sem chave estável. Cada execução insere linha nova em vez de atualizar a existente, e a dimensão duplica em silêncio ao longo das cargas.'
        },
        {
          nav: 'Histórico da dimensão', title: 'A política de histórico define a carga',
          text: 'Sobrescrita responde qual é o estado atual; nova versão com vigência responde qual era o estado na data do fato; atributo anterior responde qual era o valor imediatamente anterior; instantâneo diário responde como o cadastro estava em qualquer data. A escolha precede a escrita da carga.',
          checklist: [
            'Determine, com o parceiro, qual pergunta histórica a dimensão precisa responder.',
            'Implemente a carga correspondente à política escolhida, e não o contrário.',
            'Verifique se o passado pode ser recomposto a partir da bronze caso a política mude.'
          ],
          pitfall: 'Implementar sobrescrita e descobrir depois que o negócio precisa da série histórica. A recomposição depende de a bronze ter sido preservada.'
        },
        {
          nav: 'Orquestração', title: 'Dependência declarada',
          text: 'Modele dependências explícitas, retries seguros, backfill parametrizado, alertas por descumprimento de acordo de nível de serviço, linhagem e promoção entre ambientes. O agendamento fixo pressupõe que a etapa anterior sempre termina no tempo previsto.',
          checklist: [
            'Modele dependências explícitas em vez de sincronizar por horário.',
            'Torne o retry seguro antes de habilitá-lo, uma vez que ele multiplica carga não idempotente.',
            'Promova entre ambientes com o mesmo código e parâmetros distintos.'
          ],
          pitfall: 'Encadear tarefas por agendamento fixo. Quando a anterior atrasa, a seguinte processa dado incompleto e publica um número menor sem emitir erro.'
        },
        {
          nav: 'Card de trabalho', title: 'As três perguntas da atividade em sala',
          text: 'A segunda hora do encontro é atividade em grupo sobre a bronze construída na Aula 12: se o teste falhou antes de a transformação existir; quantas linhas cada junção descartou; e se duas execuções produzem o mesmo número. A terceira se verifica por soma de receita, e não por contagem.',
          checklist: [
            'Registre a saída dos cinco testes antes e depois da implementação.',
            'Meça a contagem antes e depois de cada junção, e explique cada diferença.',
            'Compare a soma da receita entre duas execuções seguidas, até o centavo.'
          ],
          pitfall: 'Comparar apenas a contagem entre execuções. A junção que duplica linhas mantém a ordem de grandeza da contagem e altera o total de forma imediata.'
        },
        {
          nav: 'Silver e gold em sala', title: 'Construção das camadas em sala',
          text: 'O laboratório constrói a silver com tipos declarados, chave única e rejeitados separados com o motivo, e a gold com membro desconhecido em vez de descarte silencioso. A carga recompõe a partição do período a partir da silver, com a janela como parâmetro externo. A IA gera o SQL e critica o próprio determinismo, e a conferência permanece com o grupo.',
          checklist: [
            'Verifique que a soma de conformadas, rejeitadas e duplicatas iguala a contagem da bronze.',
            'Use membro desconhecido para preservar o fato cuja dimensão não corresponde.',
            'Recomponha a partição a partir da silver, e nunca a partir da própria gold.'
          ],
          pitfall: 'Aceitar o SQL gerado por IA sem execução e conferência. A função de janela sem ordenação total e a data corrente dentro da transformação permanecem despercebidas até a primeira divergência entre execuções.'
        }
      ],
      sdd: {
        rf: 'RF-006 — Publicar a receita entregue por mês e por categoria, com definição única aplicada a toda a série histórica.',
        rnf: 'RNF-006 — Divergência de reconciliação com a origem até 0,1% por mês; carga determinística sob os mesmos parâmetros; backfill de 24 meses executável em lotes verificáveis.',
        adr: 'ADR-TRF-01 — ELT com bronze preservada, em vez de transformação anterior à gravação. Contexto: a definição de receita líquida ainda está em discussão com o parceiro. Consequência: custo de armazenamento e de processamento no destino.',
        gherkin: 'Dado o mês de agosto de 2018 já publicado, Quando executo a carga novamente com os mesmos parâmetros, Então a soma da receita permanece idêntica e os cinco testes devolvem zero.'
      },
      deliverable: 'A silver, a gold e a suíte de cinco testes versionadas, com a saída dos testes antes e depois da implementação, as contagens medidas em cada junção com a diferença explicada, a janela da carga como parâmetro externo e a definição da métrica de receita declarada por escrito.',
      references: [
        { label: 'dbt Documentation — Data tests', href: 'https://docs.getdbt.com/docs/build/data-tests' },
        { label: 'Great Expectations — Catálogo de expectativas', href: 'https://greatexpectations.io/expectations/' },
        { label: 'DuckDB Documentation — Cláusula QUALIFY', href: 'https://duckdb.org/docs/stable/sql/query_syntax/qualify.html' },
        { label: 'Kimball Group — Slowly Changing Dimensions', href: 'https://www.kimballgroup.com/2013/02/design-tip-152-slowly-changing-dimension-types-0-4-5-6-7/' },
        { label: 'Olist — Brazilian E-Commerce Public Dataset', href: 'https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce' }
      ]
    },
    15: {
      title: 'Métricas e Telemetria em ETLs', date: '21/09/2026',
      subtitle: 'Instrumentar o pipeline para que o defeito seja descoberto pela equipe de dados antes de ser descoberto pelo negócio.',
      objective: 'Definir indicadores de atualidade, completude, qualidade e custo para um pipeline, declarar objetivos de nível de serviço justificados pelo efeito no consumidor e construir uma verificação de anomalia capaz de detectar carga incompleta que conclui sem erro.',
      outcomes: [
        'Medir o pipeline pelas quatro dimensões, e não apenas pela conclusão da tarefa.',
        'Distinguir métrica técnica, que indica a causa, de métrica de negócio, que indica a gravidade.',
        'Coletar métrica, registro de execução e linhagem, reconhecendo a pergunta que cada sinal responde.',
        'Declarar indicador, objetivo e orçamento de erro com justificativa negociada com quem consome.',
        'Controlar a cardinalidade dos rótulos e a retenção da própria telemetria.',
        'Detectar anomalia por referência móvel que absorve a sazonalidade semanal.',
        'Formular alerta por sintoma observável, com procedimento e destinatário declarados.'
      ],
      sections: [
        {
          nav: 'O que medir', title: 'As quatro dimensões',
          text: 'Atualidade mede a distância entre o fato na origem e sua disponibilidade no destino; completude compara o que a origem tem com o que o destino recebeu; qualidade acompanha a taxa de rejeição por motivo; custo atribui bytes varridos e tempo de processamento ao domínio responsável. A execução bem-sucedida informa apenas que o processo terminou.',
          checklist: [
            'Meça a atualidade e exiba-a junto do número no painel de consumo.',
            'Reconcilie contagem e soma com a origem a cada carga.',
            'Classifique os registros rejeitados por motivo e acompanhe a série ao longo do tempo.'
          ],
          pitfall: 'Monitorar apenas a conclusão da tarefa. A execução termina com status de sucesso ao processar um arquivo vazio, e o painel passa a exibir zero como resultado do dia.'
        },
        {
          nav: 'Dois públicos', title: 'Métrica técnica e métrica de negócio',
          text: 'A métrica técnica indica a causa e orienta a engenharia; a métrica de negócio indica a gravidade e orienta a decisão de apresentar ou suspender. O alerta que chega ao negócio precisa ser formulado na linguagem do negócio, porque a variação do volume de uma tarefa não é acionável por quem decide.',
          checklist: [
            'Escreva cada alerta na forma do sintoma que o consumidor percebe.',
            'Associe a cada métrica técnica a métrica de negócio correspondente.',
            'Declare quem age diante de cada indicador ultrapassado.'
          ],
          pitfall: 'Enviar ao negócio o alerta formulado em termos de tarefa e de conexão. O destinatário não dispõe de contexto para priorizar, e o alerta é ignorado.'
        },
        {
          nav: 'Três sinais', title: 'Métrica, registro de execução e linhagem',
          text: 'A métrica responde quanto e como variou, e é barata para série histórica. O registro de execução responde o que aconteceu e em que ordem, com lote, parâmetros e erro. A linhagem responde o que mais foi afetado, e determina quais painéis precisam ser reprocessados após a correção.',
          checklist: [
            'Colete os três sinais, uma vez que o diagnóstico exige a combinação deles.',
            'Gere a linhagem a partir do código, e não a mantenha à mão.',
            'Defina retenção para o registro de execução antes que ele domine o acervo.'
          ],
          pitfall: 'Conduzir o incidente sem linhagem. A correção é aplicada e ninguém consegue responder quais relatórios consumiram o dado defeituoso.'
        },
        {
          nav: 'Indicador e objetivo', title: 'SLI, SLO e orçamento de erro',
          text: 'O indicador é o que se mede; o objetivo é o limite acordado com quem consome; o orçamento de erro é a margem restante, cuja exaustão desloca a prioridade da entrega de novas fontes para a estabilização do que existe. O objetivo de 100% declara que nenhuma falha é aceitável, e o custo de sustentá-lo cresce sem limite.',
          checklist: [
            'Negocie o limite com quem consome, e não apenas dentro da engenharia.',
            'Verifique se alguém sentiria falta do indicador ao vê-lo descumprido.',
            'Declare a consequência do descumprimento antes que ele ocorra.'
          ],
          pitfall: 'Escolher o limite pela facilidade de cumpri-lo. O objetivo passa a ser sempre atendido e deixa de informar qualquer coisa sobre a operação.'
        },
        {
          nav: 'Custo da telemetria', title: 'A telemetria também é um pipeline',
          text: 'O rótulo da métrica serve para agrupar, e o identificador único pertence ao registro de execução. Rótulo de alta cardinalidade produz uma série por execução, e nenhuma delas comparável. A retenção decrescente por idade aplica à observabilidade a política de ciclo de vida discutida na Aula 10.',
          checklist: [
            'Mantenha nos rótulos apenas dimensões que se repetem entre execuções.',
            'Guarde o identificador de lote no registro de execução, e não na métrica.',
            'Defina granularidade decrescente: detalhe recente, agregação no histórico longo.'
          ],
          pitfall: 'Instrumentar sem política de retenção. O acervo de telemetria supera o do dado analisado, e o custo de observar compete com o de produzir.'
        },
        {
          nav: 'Detecção de anomalia', title: 'Referência móvel em vez de limite fixo',
          text: 'O volume varia por sazonalidade semanal, e o limite percentual fixo sobre o dia anterior dispara alerta falso toda segunda-feira. A média das últimas ocorrências do mesmo dia da semana, excluído o dia em avaliação, absorve essa variação. Queda e alta têm gravidades distintas: a primeira sugere carga incompleta, e a segunda, duplicação.',
          checklist: [
            'Exclua o dia em avaliação da média que serve de referência.',
            'Separe os limites de queda e de alta, com destinatários próprios.',
            'Conte os alertas falsos que o limite produziria na série histórica antes de adotá-lo.'
          ],
          pitfall: 'Alertar por variação percentual fixa sobre o dia anterior. A segunda-feira dispara alerta toda semana, a equipe aprende a ignorá-lo e o alerta real chega junto com os falsos.'
        },
        {
          nav: 'Alerta acionável', title: 'Alertar por sintoma',
          text: 'O alerta por causa cobre um modo de falha conhecido por vez, e nenhum modo ainda desconhecido. O alerta por sintoma observável pelo consumidor cobre também a carga que conclui com sucesso sem trazer dado. Todo alerta precisa de procedimento correspondente e destinatário declarado.',
          checklist: [
            'Formule o alerta pelo sintoma, e não pela falha técnica que o produziu.',
            'Associe a cada alerta o que verificar, como corrigir e quem comunica ao consumidor.',
            'Remova ou automatize o alerta que não exige ação humana.'
          ],
          pitfall: 'Manter alerta sem procedimento associado. Em poucas semanas ele se torna ruído, e o volume de alertas ignorados passa a ocultar os relevantes.'
        },
        {
          nav: 'Card de trabalho', title: 'As três perguntas da atividade em sala',
          text: 'A segunda hora do encontro é atividade em grupo sobre a tabela de execuções das Aulas 12 e 13: quais são os quatro indicadores do pipeline; qual limite o grupo declara para cada um e com que justificativa; e em quantas execuções a anomalia injetada pelo professor é detectada. A terceira exige medir também os alertas falsos do limite escolhido.',
          checklist: [
            'Calcule os quatro indicadores sobre a série, com uma consulta por dimensão.',
            'Justifique cada limite pelo efeito no consumidor, e não pela facilidade de cumpri-lo.',
            'Meça o desvio da execução anômala e conte os falsos positivos na série de trinta dias.'
          ],
          pitfall: 'Adotar o limite sem testá-lo contra a série histórica. O limite de 5% marca várias execuções legítimas, e o de 50% deixa passar a carga com 40% menos registros.'
        },
        {
          nav: 'Telemetria em DuckDB', title: 'Construção do painel em sala',
          text: 'O laboratório converte a tabela de controle em série de trinta execuções com sazonalidade semanal, calcula atualidade, completude, qualidade e custo, declara um objetivo por indicador e detecta uma anomalia injetada que conclui com status de sucesso. A IA gera as consultas e critica a própria cobertura, e a escolha do limite permanece com o grupo.',
          checklist: [
            'Confirme que a sazonalidade semanal está presente na série antes de medir.',
            'Verifique que a janela da referência exclui a execução em avaliação.',
            'Execute o alerta contra a série inteira e conte os falsos positivos antes de adotá-lo.'
          ],
          pitfall: 'Aceitar a consulta gerada por IA sem verificar a moldura da janela. A inclusão da linha corrente na média impede a detecção da anomalia daquele mesmo dia.'
        }
      ],
      sdd: {
        rf: 'RF-008 — Registrar, para cada carga, atualidade, volume, taxa de rejeição e custo, com série consultável de noventa dias.',
        rnf: 'RNF-008 — 98% das cargas diárias com atraso inferior a 3 h; desvio de volume acima de 15% da referência detectado na primeira execução; telemetria com retenção decrescente por idade.',
        adr: 'ADR-OBS-01 — Alerta por sintoma observável pelo consumidor, em vez de alerta por falha de tarefa. Contexto: a carga que conclui sem trazer dado não gera falha. Consequência: exige referência histórica por dia da semana.',
        gherkin: 'Dada uma carga que conclui com 40% menos linhas que a referência do mesmo dia da semana, Quando a verificação de anomalia executa, Então o alerta dispara e a publicação fica suspensa.'
      },
      deliverable: 'O painel de telemetria do card de trabalho, com as quatro consultas de indicador, a consulta de anomalia e o limite adotado, a justificativa de cada limite pelo efeito no consumidor, o desvio medido da execução anômala, a contagem de alertas falsos que o limite produziria na série de trinta dias, e o procedimento e o destinatário declarados para cada alerta.',
      references: [
        { label: 'Google SRE Book — Service Level Objectives', href: 'https://sre.google/sre-book/service-level-objectives/' },
        { label: 'Google SRE Book — Monitoring Distributed Systems', href: 'https://sre.google/sre-book/monitoring-distributed-systems/' },
        { label: 'OpenTelemetry — Signals', href: 'https://opentelemetry.io/docs/concepts/signals/' },
        { label: 'DuckDB Documentation — Window functions', href: 'https://duckdb.org/docs/stable/sql/functions/window_functions.html' },
        { label: 'OpenLineage — Especificação de linhagem', href: 'https://openlineage.io/docs/' }
      ]
    },
    16: {
      title: 'Integração do Datawarehouse com a Interface Analítica', date: '23/09/2026',
      subtitle: 'Do dado confiável à experiência analítica que sustenta decisões, com métrica de definição única, contrato versionado e segurança verificável.',
      objective: 'Projetar a camada de consumo analítico a partir da decisão que ela sustenta, definir a métrica uma única vez em camada semântica versionada, publicar contrato de consumo, aplicar controle de acesso por linha verificável por asserção e medir a latência percebida.',
      outcomes: [
        'Projetar a interface a partir da decisão que ela sustenta, e não do dado disponível.',
        'Diagnosticar a divergência de definição entre equipes e resolvê-la por definição única.',
        'Publicar a métrica em camada semântica com fórmula, granularidade, fuso, responsável e versão.',
        'Escolher entre consulta direta, tabela agregada, API e exportação por latência, volume e autonomia.',
        'Declarar contrato de consumo com política de compatibilidade entre versões.',
        'Implementar acesso por linha e verificá-lo por asserção, inclusive as de negação.',
        'Medir a latência percebida em percentil e comparar as formas de servir.'
      ],
      sections: [
        {
          nav: 'Quem consome e decide', title: 'Comece pela decisão',
          text: 'Mapeie pergunta, usuário, frequência, ação e tolerância de atraso antes de escolher a ferramenta. O indicador cujo valor não altera nenhuma ação é informação sem consequência: ocupa espaço, consome carga para ser mantido e concorre pela atenção com o que importa.',
          checklist: [
            'Escreva, para cada gráfico proposto, a ação que muda conforme o valor.',
            'Registre a tolerância de atraso aceita, porque ela determina a frequência da carga.',
            'Considere o nível de autonomia técnica de quem consome ao escolher a forma de servir.'
          ],
          pitfall: 'Projetar o painel a partir do dado disponível, e não da decisão a ser tomada. O resultado é um acervo de gráficos que ninguém consulta e que precisa ser mantido indefinidamente.'
        },
        {
          nav: 'Divergência de definição', title: 'Três equipes, três números',
          text: 'A mesma receita calculada por três equipes produz três valores, sem que nenhuma tenha cometido erro técnico. Cada uma adotou uma decisão razoável e não declarada sobre frete, recorte de status e correção retroativa. Enquanto cada relatório calcula a métrica no próprio SQL, a reunião discute qual número está certo em vez de discutir a decisão.',
          checklist: [
            'Levante, no projeto do parceiro, quantas definições da mesma métrica coexistem.',
            'Declare qual pergunta de negócio cada definição responde.',
            'Escolha a definição oficial e nomeie quem responde por ela.'
          ],
          pitfall: 'Resolver a divergência escolhendo um dos números na reunião. Sem a definição registrada em um único lugar, os três voltam a aparecer no mês seguinte.'
        },
        {
          nav: 'Camada semântica', title: 'Semântica',
          text: 'Centralize a definição de métricas, dimensões, filtros, fuso, granularidade e responsável em um único artefato versionado. A mudança de definição passa a ser alteração revisável, com data de vigência registrada, e a série histórica indica quando o critério mudou em vez de apresentar um degrau inexplicado.',
          checklist: [
            'Declare nome único, fórmula, granularidade mínima, fuso, responsável e versão.',
            'Versione o metadado da métrica junto do SQL que a implementa.',
            'Registre a data de vigência de cada mudança de definição.'
          ],
          pitfall: 'Permitir que cada relatório calcule a métrica no próprio SQL. As definições divergem em silêncio e a organização perde a referência de qual número é oficial.'
        },
        {
          nav: 'APIs e dashboards', title: 'Serviços',
          text: 'Escolha entre consulta direta, tabela agregada, API e exportação conforme latência, volume, segurança e autonomia do consumidor. A consulta direta é sempre atual e paga o custo de varredura a cada acesso; a tabela agregada transfere o custo para a carga; a API serve outro sistema por contrato; a exportação cria cópia fora do controle de acesso do warehouse.',
          checklist: [
            'Prefira tabela agregada quando muitos usuários fazem as mesmas perguntas conhecidas.',
            'Reserve a consulta direta a poucos usuários com perguntas exploratórias.',
            'Registre a cópia gerada por exportação como dado sob controle de acesso próprio.'
          ],
          pitfall: 'Servir tudo por consulta direta sobre o fato no grão mais fino. O painel de trinta usuários varre o acervo inteiro a cada abertura, e o custo cresce com a adoção do próprio painel.'
        },
        {
          nav: 'Contrato de consumo', title: 'Contrato',
          text: 'Defina schema, semântica, atualidade, disponibilidade e compatibilidade para toda interface publicada. Acrescentar coluna é compatível; remover ou renomear exige nova versão, pela mesma regra de evolução de schema discutida na Aula 10. O prazo de convivência entre versões permite ao consumidor planejar a migração.',
          checklist: [
            'Declare o que pode mudar sem nova versão, e não apenas o que exige uma.',
            'Alinhe a atualidade declarada ao indicador medido na Aula 15.',
            'Versione o contrato no mesmo repositório do código que o implementa.'
          ],
          pitfall: 'Publicar o contrato em documento separado do código. As duas versões divergem na primeira alteração, e o consumidor passa a confiar no documento desatualizado.'
        },
        {
          nav: 'Segurança testável', title: 'Segurança',
          text: 'Aplique identidade propagada, controle por papel e por atributo, filtro por linha, mascaramento de coluna sensível, auditoria e segregação de ambientes. A política escrita e nunca executada contra um usuário real é uma intenção, e não um controle. A matriz de perfis converte a política em asserções executáveis.',
          checklist: [
            'Aplique o filtro por linha na camada semântica, e não em cada painel.',
            'Escreva também as asserções de negação, que verificam a ausência de acesso.',
            'Execute a suíte de acesso a cada publicação, como os testes da Aula 13.'
          ],
          pitfall: 'Aplicar o filtro de acesso dentro de cada painel. O painel seguinte é criado sem o filtro, e o dado restrito passa a ser servido sem que nenhuma política tenha sido alterada.'
        },
        {
          nav: 'Desempenho do consumo', title: 'Desempenho',
          text: 'Use pré-agregação, cache, poda por partição e limites de consulta, e observe o consumo com latência p95, bytes varridos, taxa de erro e consultas por usuário. A média esconde o consumidor que espera, e o consumidor abandona a ferramenta pela experiência das piores consultas.',
          checklist: [
            'Meça a latência em percentil, e não em média.',
            'Confirme que o filtro do painel corresponde à coluna de partição da gold.',
            'Verifique que a pré-agregação devolve o mesmo valor da consulta direta.'
          ],
          pitfall: 'Tratar como otimização a pré-agregação que altera o resultado. A alteração do valor caracteriza defeito, pela mesma regra aplicada ao layout na Aula 10.'
        },
        {
          nav: 'Card de trabalho', title: 'As três perguntas da atividade em sala',
          text: 'A segunda hora do encontro é atividade em grupo sobre a gold construída nas aulas anteriores: se as três equipes chegam ao mesmo número após a unificação; se o perfil restrito ao Norte consegue observar o Sudeste; e quanto a pré-agregação reduz a latência percebida. As três se respondem por execução medida.',
          checklist: [
            'Registre os três valores divergentes antes de unificar a definição.',
            'Execute as nove asserções de acesso, das quais cinco verificam negação.',
            'Meça o p95 nas duas formas de servir e confirme que devolvem o mesmo valor.'
          ],
          pitfall: 'Verificar apenas as asserções de permissão. O vazamento se manifesta como acesso indevido concedido, e somente a asserção de negação o revela.'
        },
        {
          nav: 'Publicação em sala', title: 'Construção da camada de consumo em sala',
          text: 'O laboratório reproduz as três definições divergentes sobre o mesmo fato, unifica-as em vista com dicionário versionado, publica o contrato em arquivo, implementa acesso por linha por perfil e mede a latência da mesma pergunta servida por consulta direta e por tabela pré-agregada. A IA gera o SQL e critica o próprio controle de acesso, e a escolha da definição permanece com o grupo.',
          checklist: [
            'Confirme que as três consultas reescritas sobre a vista devolvem um único valor.',
            'Peça à IA que aponte por qual caminho um perfil restrito ainda observaria outra região.',
            'Registre quantas vezes por dia a pergunta é feita, para converter a economia em argumento.'
          ],
          pitfall: 'Aceitar o SQL gerado por IA sem executar as asserções de negação. A vista que parece restringir pode permitir a leitura por agregação, e o defeito só aparece em auditoria.'
        }
      ],
      sdd: {
        rf: 'RF-009 — Publicar a receita entregue por mês, região e categoria, com definição única e acesso restrito à região do usuário.',
        rnf: 'RNF-009 — Latência p95 de consulta inferior a 2 s; atualidade declarada de até 3 h; versão anterior servida por 90 dias após a publicação da seguinte.',
        adr: 'ADR-CON-01 — Tabela pré-agregada servindo o painel, em vez de consulta direta ao fato. Contexto: trinta usuários abrindo o mesmo painel diariamente. Consequência: atualidade limitada à frequência da carga.',
        gherkin: 'Dado um usuário com perfil restrito ao Norte, Quando ele consulta a receita por região, Então nenhuma linha de outra região é devolvida e o total corresponde apenas ao Norte.'
      },
      deliverable: 'O pacote de integração publicado no card de trabalho, composto pela vista da métrica com dicionário versionado, o arquivo de contrato com as cinco cláusulas, a suíte de nove asserções de acesso com as cinco de negação devolvendo zero, a medição de latência p95 nas duas formas de servir com os bytes varridos registrados, e a justificativa escrita da definição de receita adotada com o responsável designado.',
      references: [
        { label: 'dbt Documentation — Semantic models', href: 'https://docs.getdbt.com/docs/build/semantic-models' },
        { label: 'Data Mesh Architecture — Produto de dados', href: 'https://www.datamesh-architecture.com/' },
        { label: 'DuckDB Documentation — CREATE VIEW', href: 'https://duckdb.org/docs/stable/sql/statements/create_view.html' },
        { label: 'Google SRE Book — Service Level Objectives', href: 'https://sre.google/sre-book/service-level-objectives/' },
        { label: 'Olist — Brazilian E-Commerce Public Dataset', href: 'https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce' }
      ]
    }
  };

  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DEFAULT_PROF = 'Afonso Brandão';
  const DEFAULT_DISC = 'Computação 2';
  const lessonId = document.body.dataset.lesson;
  const lesson = lessons[Number(lessonId)];
  if (!lesson) return;

  // A agenda é derivada de sections — rótulo e texto vêm sempre do mesmo objeto.
  // Quando a aula tem atividade guiada e/ou atividade prática, elas entram ao final da agenda, nessa ordem.
  const agenda = lesson.sections.map((s) => ({ nav: s.nav, text: s.text }))
    .concat(lesson.warmup ? [{ nav: lesson.warmup.title, text: lesson.warmup.goal }] : [])
    .concat(lesson.activity ? [{ nav: lesson.activity.title, text: lesson.activity.goal }] : []);
  const checklistOf = (s) => s.checklist.map((c) => `<li>${esc(c)}</li>`).join('');

  // Renderiza uma nota fiscal sintetizada (dados fictícios) como tabela, reaproveitado por slides e material.
  const receiptTableHtml = (r) => `<div class="receipt-wrap"><table class="receipt-table">`
    + `<caption>${esc(r.store.name)} · CNPJ ${esc(r.store.cnpj)}<br>${esc(r.store.address)}<br>${esc(r.store.doc)}<br>${esc(r.meta)}</caption>`
    + `<thead><tr><th>Descrição</th><th>Qtd.</th><th>Vl. unit.</th><th>Vl. total</th></tr></thead>`
    + `<tbody>${r.items.map((it) => `<tr><td>${esc(it.desc)}</td><td>${esc(it.qty)}</td><td>${esc(it.unit)}</td><td>${esc(it.total)}</td></tr>`).join('')}</tbody>`
    + `<tfoot><tr><td colspan="3">Qtde. total de itens</td><td>${esc(r.totalItems)}</td></tr><tr><td colspan="3">Valor a pagar (R$)</td><td>${esc(r.totalValue)}</td></tr><tr><td colspan="4">${esc(r.payment)}</td></tr></tfoot>`
    + `</table><ul class="receipt-footer">${r.footer.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>`;

  // Critérios de aceite e rubrica: aulas com atividade prática usam os critérios
  // de verificação da própria atividade em vez da rubrica genérica de artefato SDD.
  const acceptance = (lesson.activity && lesson.activity.acceptance) || lesson.acceptance || [
    'O artefato declara o requisito funcional e ao menos um requisito não funcional mensurável.',
    'A decisão estrutural está registrada em ADR, com alternativa descartada e consequência.',
    'Existe ao menos um cenário de aceite que falha antes da implementação.',
    'Há dono, forma de operação e caminho de reprocessamento.'
  ];
  const evaluationList = (lesson.activity || lesson.acceptance)
    ? acceptance.map((a) => `<li>${esc(a)}</li>`).join('')
    : '<li>Clareza do problema e do contrato: 25%</li><li>Correção técnica e tratamento de exceções: 30%</li><li>Testabilidade, qualidade e operação: 25%</li><li>Comunicação e justificativa das decisões: 20%</li>';

  const SDD_LABELS = [
    ['rf', 'Requisito funcional', 'o que o sistema deve fazer'],
    ['rnf', 'Requisito não funcional', 'meta mensurável e verificável'],
    ['adr', 'Decisão em ADR', 'por que a arquitetura é esta'],
    ['gherkin', 'Cenário de aceite', 'o teste que falha antes do código']
  ];

  window.module11Lesson = lesson;

  const referenceLabel = (reference) => typeof reference === 'string' ? reference : reference.label;
  const referenceItem = (reference) => typeof reference === 'string'
    ? esc(reference)
    : `<a href="${esc(reference.href)}" target="_blank" rel="noopener noreferrer">${esc(reference.label)}</a>`;

  const codeBlock = (label, sql, id) =>
    `<div class="code-wrap"><div class="code-label"><span>${esc(label)}</span>` +
    `<button type="button" class="code-copy" data-copy-code="${esc(id)}">Copiar</button></div>` +
    `<pre class="code-block" id="${esc(id)}"><code>${esc(sql)}</code></pre></div>`;

  const benchmarkTable = () => lesson.benchmarkGuide
    ? `<section class="material-box"><h2>Quadro de benchmark</h2><p>${esc(lesson.benchmarkGuide.intro)}</p>` +
      `<div class="dd-scroll"><table class="dd-table"><thead><tr>${lesson.benchmarkGuide.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>` +
      `<tbody>${lesson.benchmarkGuide.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`
    : '';

  const dbeaverHtml = (mode) => {
    if (!lesson.dbeaver) return '';
    const connections = lesson.dbeaver.connections
      .map((c) => `<div><h4>${esc(c.engine)}</h4><p>${esc(c.text)}</p></div>`).join('');
    if (mode === 'plan') {
      return `<section><h2>Preparação do DBeaver</h2><p>${esc(lesson.dbeaver.intro)}</p>` +
        `<ul>${lesson.dbeaver.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></section>`;
    }
    return `<section class="material-box"><h2>Preparação do DBeaver</h2><p>${esc(lesson.dbeaver.intro)}</p>` +
      `<div class="dd-split">${connections}</div><h3>Regras de execução</h3>` +
      `<ul>${lesson.dbeaver.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></section>`;
  };

  const sqlLabsMaterial = () => lesson.sqlLabs
    ? lesson.sqlLabs.map((lab, labIndex) =>
      `<section class="material-box sql-lab"><div class="sql-lab-head"><div><span class="sql-engine">${esc(lab.engine)}</span>` +
      `<h2>Roteiro executável — ${esc(lab.engine)}</h2><p>${esc(lab.goal)}</p></div>` +
      `<div class="sql-actions"><button type="button" data-copy-lab="${labIndex}">Copiar roteiro completo</button>` +
      `<button type="button" data-download-lab="${labIndex}">Baixar .sql</button></div></div>` +
      lab.steps.map((step, stepIndex) =>
        `<article class="sql-step"><h3>${esc(step.title)}</h3><p>${esc(step.purpose)}</p>` +
        codeBlock(`${lab.engine} · bloco ${stepIndex + 1}`, step.sql, `sql-${lessonId}-${labIndex}-${stepIndex}`) +
        `<div class="sql-observe"><strong>Evidência esperada:</strong> ${esc(step.observe)}</div></article>`
      ).join('') + `</section>`
    ).join('')
    : '';

  const sqlLabsPlan = () => lesson.sqlLabs
    ? lesson.sqlLabs.map((lab) =>
      `<section><h2>Condução do roteiro — ${esc(lab.engine)}</h2><p>${esc(lab.goal)}</p><ol>` +
      lab.steps.map((step) => `<li><strong>${esc(step.title)}:</strong> ${esc(step.purpose)} <em>Evidência:</em> ${esc(step.observe)}</li>`).join('') +
      `</ol></section>`
    ).join('')
    : '';

  const sqlLabSlides = () => {
    if (!lesson.sqlLabs) return [];
    const slides = [];
    if (lesson.dbeaver) {
      slides.push(`<article class="lesson-slide"><span class="lesson-kicker">Ambiente do laboratório</span><h2>Duas conexões, dois dialetos</h2>` +
        `<div class="lesson-callout"><strong>${esc(lesson.dbeaver.intro)}</strong></div><div class="lesson-grid">` +
        lesson.dbeaver.connections.map((c) => `<div class="lesson-card"><b>${esc(c.engine)}</b><p>${esc(c.text)}</p></div>`).join('') +
        `</div></article>`);
    }
    lesson.sqlLabs.forEach((lab) => {
      slides.push(`<article class="lesson-slide"><span class="lesson-kicker">Laboratório · ${esc(lab.engine)}</span>` +
        `<h2>${esc(lab.engine)}</h2><div class="lesson-callout"><strong>${esc(lab.goal)}</strong></div>` +
        `<div class="lesson-card lesson-wide"><ol>${lab.steps.map((s) => `<li>${esc(s.title)}</li>`).join('')}</ol></div></article>`);
      lab.steps.forEach((step) => {
        slides.push(`<article class="lesson-slide"><span class="lesson-kicker">${esc(lab.engine)} · ${esc(step.title)}</span>` +
          `<h2>${esc(step.purpose)}</h2><pre class="lesson-code"><code>${esc(step.focus)}</code></pre>` +
          `<div class="lesson-warn"><strong>Evidência esperada:</strong> ${esc(step.observe)}</div></article>`);
      });
    });
    return slides;
  };

  const mountSqlActions = (root) => {
    if (!lesson.sqlLabs) return;
    const copyText = async (value, button) => {
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
        else {
          const area = document.createElement('textarea');
          area.value = value;
          area.style.position = 'fixed';
          area.style.opacity = '0';
          document.body.append(area);
          area.select();
          document.execCommand('copy');
          area.remove();
        }
        const original = button.textContent;
        button.textContent = 'Copiado';
        setTimeout(() => { button.textContent = original; }, 1400);
      } catch (_) {
        button.textContent = 'Selecione o código';
      }
    };
    root.querySelectorAll('[data-copy-code]').forEach((button) => {
      button.addEventListener('click', () => {
        const code = document.getElementById(button.dataset.copyCode);
        if (code) copyText(code.textContent, button);
      });
    });
    root.querySelectorAll('[data-copy-lab]').forEach((button) => {
      button.addEventListener('click', () => {
        const lab = lesson.sqlLabs[Number(button.dataset.copyLab)];
        copyText(lab.steps.map((s) => `-- ${s.title}\n${s.sql}`).join('\n\n'), button);
      });
    });
    root.querySelectorAll('[data-download-lab]').forEach((button) => {
      button.addEventListener('click', () => {
        const lab = lesson.sqlLabs[Number(button.dataset.downloadLab)];
        const content = lab.steps.map((s) => `-- ${s.title}\n${s.sql}`).join('\n\n');
        const url = URL.createObjectURL(new Blob([content], { type: 'text/sql;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = lab.file;
        link.click();
        URL.revokeObjectURL(url);
      });
    });
  };

  // Ficha do encontro — objetivo de aprendizagem, estratégia e estrutura.
  // Exigida em toda página de aula do acervo; ver .claude/skills/padrao-encontro/SKILL.md.
  const estrategia = lesson.estrategia ||
    ('Exposição por blocos, cada um encerrado por checklist de aplicação, seguida de laboratório ' +
    'com entrega: ' + lesson.deliverable);

  const fichaEncontro = () =>
    `<section class="encontro-meta" data-encontro-ficha>` +
    `<h2>Sobre este encontro</h2>` +
    `<p class="encontro-ref">${esc(lesson.title)} · ${esc(lesson.date)} · Prof. ${esc(lesson.professor || DEFAULT_PROF)}</p>` +
    `<div class="encontro-item" data-encontro="objetivo"><h3>Objetivo de aprendizagem</h3><p>${esc(lesson.objective)}</p></div>` +
    `<div class="encontro-item" data-encontro="estrategia"><h3>Estratégia do encontro</h3><p>${esc(estrategia)}</p></div>` +
    `<div class="encontro-item" data-encontro="agenda"><h3>Estrutura do encontro</h3><ol>` +
    // Encontros cuja condução difere da sequência de sections declaram a
    // estrutura própria; sem ela, a agenda é derivada como nas demais aulas.
    (lesson.estrutura
      ? lesson.estrutura.map((e) => `<li>${esc(e)}</li>`).join('')
      : agenda.map((a) => `<li>${esc(a.nav)} — ${esc(a.text)}</li>`).join('')) +
    `</ol></div></section>`;

  // Slides do enunciado da atividade avaliativa em sala.
  const activitySlides = () => (lesson.activity ? [
        `<article class="lesson-slide"><span class="lesson-kicker">${esc(lesson.activity.duration)}</span><h2>${esc(lesson.activity.title)}</h2><div class="lesson-callout"><strong>${esc(lesson.activity.goal)}</strong></div><div class="lesson-card lesson-wide"><p>${esc(lesson.activity.intro)}</p></div></article>`,
        `<article class="lesson-slide"><span class="lesson-kicker">Método</span><h2>${esc(lesson.activity.stepsTitle || 'Do negócio ao cubo, passo a passo')}</h2><div class="lesson-grid">${lesson.activity.steps.map((s, i) => `<div class="lesson-card"><b>Passo ${i + 1}</b><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div></article>`,
        (lesson.activity.worked
          ? `<article class="lesson-slide"><span class="lesson-kicker">Exemplo ilustrativo</span><h2>O raciocínio, não a resposta</h2><div class="lesson-split"><div class="lesson-card"><p>${esc(lesson.activity.worked.text)}</p><ul>${lesson.activity.worked.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul><p>${esc(lesson.activity.worked.note)}</p></div><div class="lesson-card"><h3>Não faça isso</h3><ul>${lesson.activity.avoid.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div></div><div class="lesson-warn"><strong>Verifique antes de seguir:</strong> ${lesson.activity.checks.map((c) => esc(c)).join(' · ')}</div></article>`
          : `<article class="lesson-slide"><span class="lesson-kicker">Antes de entregar</span><h2>Regras e verificação</h2><div class="lesson-split"><div class="lesson-card"><h3>Não faça isso</h3><ul>${lesson.activity.avoid.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div><div class="lesson-card"><h3>Verifique antes de entregar</h3><ul>${lesson.activity.checks.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div></div></article>`)
  ] : []);

  window.renderLessonSlides = function (root) {
    const slides = [
      `<article class="lesson-slide lesson-cover"><span class="lesson-kicker">Módulo 11 · Engenharia de Software · Aula ${esc(lessonId)}</span><h1>${esc(lesson.title)}</h1><p>${esc(lesson.subtitle)}</p><small>${esc(lesson.discipline || DEFAULT_DISC)} · Prof. ${esc(lesson.professor || DEFAULT_PROF)} · ${esc(lesson.date)}</small></article>`,

      ...(lesson.timebox ? [`<article class="lesson-slide"><span class="lesson-kicker">Cronograma</span><h2>Como o tempo será dividido</h2><div class="lesson-grid">${lesson.timebox.map((t) => `<div class="lesson-card"><b>${t.minutes} min</b><p>${esc(t.label)}</p></div>`).join('')}</div></article>`] : []),

      `<article class="lesson-slide"><span class="lesson-kicker">Agenda</span><h2>Como vamos trabalhar</h2><div class="lesson-grid">${agenda.map((a, i) => `<div class="lesson-card"><b>${String(i + 1).padStart(2, '0')}</b><h3>${esc(a.nav)}</h3><p>${esc(a.text)}</p></div>`).join('')}</div></article>`,

      `<article class="lesson-slide"><span class="lesson-kicker">Objetivo</span><h2>O que você precisa conseguir fazer</h2><div class="lesson-callout"><strong>${esc(lesson.objective)}</strong></div><div class="lesson-grid">${lesson.outcomes.map((o, i) => `<div class="lesson-card"><b>Resultado ${i + 1}</b><p>${esc(o)}</p></div>`).join('')}</div></article>`,

      ...lesson.sections.flatMap((s, i) => [
        `<article class="lesson-slide"><span class="lesson-kicker">Bloco ${i + 1} · ${esc(s.nav)}</span><h2>${esc(s.title)}</h2><div class="lesson-split"><div class="lesson-card"><p>${esc(s.text)}</p></div><div class="lesson-card"><h3>Checklist de aplicação</h3><ul>${checklistOf(s)}</ul></div></div><div class="lesson-warn"><strong>Erro comum:</strong> ${esc(s.pitfall)}</div></article>`,
        ...(s.diagram ? [`<article class="lesson-slide"><span class="lesson-kicker">Bloco ${i + 1} · ${esc(s.nav)}</span><h2>Exemplo visual</h2><div class="mermaid-wrap medium"><div class="mermaid">${s.diagram}</div></div></article>`] : [])
      ]),

      ...sqlLabSlides(),

      ...(lesson.sdd ? [`<article class="lesson-slide"><span class="lesson-kicker">Ponte com a Aula 1 · Spec-Driven Development</span><h2>Como este tema vira especificação</h2><div class="lesson-grid">${SDD_LABELS.map(([k, label, hint]) => `<div class="lesson-card"><b>${esc(label)}</b><h3 class="lesson-hint">${esc(hint)}</h3><p>${esc(lesson.sdd[k])}</p></div>`).join('')}</div></article>`] : []),

      ...(lesson.warmup ? [
        `<article class="lesson-slide"><span class="lesson-kicker">${esc(lesson.warmup.duration)}</span><h2>${esc(lesson.warmup.title)}</h2><div class="lesson-callout"><strong>${esc(lesson.warmup.goal)}</strong></div><div class="lesson-card lesson-wide"><p>${esc(lesson.warmup.intro)}</p></div></article>`,
        `<article class="lesson-slide"><span class="lesson-kicker">Documento de trabalho</span><h2>Nota fiscal sintetizada</h2>${receiptTableHtml(lesson.warmup.receipt)}<div class="lesson-hint" style="margin-top:8px;">${esc(lesson.warmup.note)}</div></article>`,
        `<article class="lesson-slide"><span class="lesson-kicker">Passo 1</span><h2>Perguntas analíticas</h2><div class="lesson-grid">${lesson.warmup.questions.map((q, i) => `<div class="lesson-card"><b>Pergunta ${i + 1}</b><p>${esc(q)}</p></div>`).join('')}</div></article>`,
        `<article class="lesson-slide"><span class="lesson-kicker">Modelo de referência</span><h2>Grão, fato e dimensões resolvidos</h2><div class="lesson-callout"><strong>Grão:</strong> ${esc(lesson.warmup.model.grao)}</div><div class="lesson-split"><div class="lesson-card"><h3>${esc(lesson.warmup.model.fato)}</h3><p><strong>Métricas</strong></p><ul>${lesson.warmup.model.metricas.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div><div class="lesson-card"><h3>Dimensões</h3><ul>${lesson.warmup.model.dimensoes.map((d) => `<li><strong>${esc(d.nome)}:</strong> ${esc(d.hierarquia)}</li>`).join('')}</ul></div></div><div class="lesson-warn"><strong>${esc(lesson.warmup.model.esquema)}</strong><br>${esc(lesson.warmup.transition)}</div></article>`
      ] : []),

      ...activitySlides(),

      `<article class="lesson-slide"><span class="lesson-kicker">${esc(lesson.deliverableKicker || 'Laboratório')}</span><h2>${esc(lesson.deliverableTitle || 'Entregável da aula')}</h2><div class="lesson-callout"><strong>${esc(lesson.deliverable)}</strong></div><div class="lesson-card lesson-wide"><h3>${esc(lesson.evaluationLabel || 'Critérios de aceite')}</h3><ol>${evaluationList}</ol></div>${lesson.submissionNotice ? `<div class="lesson-warn"><strong>Atenção — regras de entrega:</strong><ul style="margin:6px 0 0;padding-left:1.2rem;">${lesson.submissionNotice.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>` : ''}</article>`,

      `<article class="lesson-slide"><span class="lesson-kicker">Fechamento</span><h2>Leve para o projeto</h2><div class="lesson-grid">${lesson.references.map((x, i) => `<div class="lesson-card"><b>Ref. ${i + 1}</b><p>${esc(referenceLabel(x))}</p></div>`).join('')}</div><div class="lesson-callout">Pergunta de encerramento: <strong>${esc(lesson.closingQuestion || 'Qual decisão fica mais segura depois deste artefato?')}</strong></div></article>`,

      `<article class="lesson-slide encontro-slide"><span class="lesson-kicker">Ficha do encontro</span>${fichaEncontro()}</article>`
    ];
    root.innerHTML = slides.join('');
    return slides.length;
  };

  // Blocos de aprofundamento — renderizados apenas nas aulas que os declaram.
  // `mode` é 'material' (versão completa, para leitura) ou 'plan' (condensada,
  // para condução em sala). Aulas sem esses campos seguem sem nenhuma seção extra.
  const deepDive = (mode) => {
    const box = (inner) => `<section class="material-box">${inner}</section>`;
    const full = mode === 'material';
    const out = [];

    if (lesson.conformity) {
      const c = lesson.conformity;
      out.push(box(`<h2>Contrato da dimensão conformada — ${esc(c.entity)}</h2><p>${esc(c.intro)}</p>`
        + `<dl class="dd-fields">${c.fields.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.text)}</dd></div>`).join('')}</dl>`
        + (full && c.test
          ? `<h3>${esc(c.test.title)}</h3><p>${esc(c.test.intro)}</p>`
            + `<div class="dd-scroll"><table class="dd-table"><thead><tr><th>Atributo</th><th>Não conformada</th><th>Conformada</th></tr></thead><tbody>`
            + c.test.rows.map((r) => `<tr><th scope="row">${esc(r.attribute)}</th><td class="bad">${esc(r.bad)}</td><td class="good">${esc(r.good)}</td></tr>`).join('')
            + `</tbody></table></div><div class="material-note">${esc(c.test.note)}</div>`
          : '')));
    }

    if (lesson.busMatrix) {
      const m = lesson.busMatrix;
      out.push(box(`<h2>Enterprise Data Warehouse Bus Matrix</h2><p>${esc(m.intro)}</p>`
        + `<div class="dd-scroll"><table class="dd-table matrix"><caption>Legenda: ● a dimensão participa do processo · — não se aplica ao grão daquele processo.</caption>`
        + `<thead><tr><th>Processo de negócio</th>${m.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>`
        + m.rows.map((r) => `<tr><th scope="row"><span class="dd-prio">${esc(r.priority)}</span> ${esc(r.process)}</th>`
          + r.marks.map((k, i) => k
            ? `<td class="on"><span aria-label="${esc(m.columns[i])} participa do processo">●</span></td>`
            : `<td class="off"><span aria-label="${esc(m.columns[i])} não participa do processo">—</span></td>`).join('')
          + `</tr>`).join('')
        + `</tbody></table></div>`
        + `<ul class="dd-axes">${m.axes.map((a) => `<li><strong>${esc(a.label)}:</strong> ${esc(a.text)}</li>`).join('')}</ul>`
        + `<h3>Como ler a matriz</h3><p>${esc(m.reading.intro)}</p>`
        + `<div class="dd-split"><div><h4>${esc(m.reading.horizontal.title)}</h4><ul>${m.reading.horizontal.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul></div>`
        + `<div><h4>${esc(m.reading.vertical.title)}</h4><ul>${m.reading.vertical.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul></div></div>`
        + `<div class="material-note">${esc(m.reading.note)}</div>`));
    }

    if (lesson.drillAcross) {
      const d = lesson.drillAcross;
      out.push(box(`<h2>Análise cross-functional — drill-across</h2>`
        + `<p><strong>Pergunta:</strong> ${esc(d.question)}</p>`
        + (full ? `<p>${esc(d.intro)}</p>` : '')
        + `<div class="dd-split"><div class="dd-ok"><h4>Estratégia correta</h4><ol>${d.correct.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>`
        + `<div class="dd-bad"><h4>Estratégia incorreta</h4><ul>${d.incorrect.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div></div>`
        + `<div class="material-note">${esc(d.note)}</div>`));
    }

    if (lesson.semantics) {
      out.push(box(`<h2>Governança semântica</h2><p>${esc(lesson.semantics.intro)}</p>`
        + `<ol class="dd-num">${lesson.semantics.items.map((it) => `<li><b>${esc(it.title)}</b><span>${esc(it.text)}</span></li>`).join('')}</ol>`
        + `<div class="material-note">${esc(lesson.semantics.note)}</div>`));
    }

    if (lesson.roadmap) {
      out.push(box(`<h2>Evolução incremental</h2><p>${esc(lesson.roadmap.intro)}</p>`
        + `<ol class="dd-releases">${lesson.roadmap.releases.map((r) => `<li><b>${esc(r.id)} — ${esc(r.title)}</b><span>${esc(r.text)}</span><em>${esc(r.chip)}</em></li>`).join('')}</ol>`
        + `<div class="material-note">${esc(lesson.roadmap.note)}</div>`));
    }

    return out.join('');
  };

  // Sumário lateral exigido por specs/lesson-materials.md. É derivado do DOM já
  // renderizado — cada `section` vira uma entrada, com o texto do próprio `h2` e o
  // tempo estimado pela contagem de palavras — em vez de uma lista mantida à mão,
  // que sairia de sincronia a cada bloco novo. O observador destaca a seção visível.
  const PALAVRAS_POR_MINUTO = 200;

  const mountToc = (root, titulo) => {
    const aside = root.querySelector('.mat-sidebar');
    const artigo = root.querySelector('.mat-article');
    if (!aside || !artigo) return;

    const secoes = [...artigo.querySelectorAll(':scope > section')];
    if (secoes.length < 3) return;

    let totalMin = 0;
    const entradas = secoes.map((sec, i) => {
      const h2 = sec.querySelector('h2');
      if (!h2) return null;
      sec.id = sec.id || `s${i + 1}`;
      const palavras = (sec.textContent || '').trim().split(/\s+/).filter(Boolean).length;
      const min = Math.max(1, Math.round(palavras / PALAVRAS_POR_MINUTO));
      totalMin += min;
      return { id: sec.id, texto: h2.textContent.trim(), min };
    }).filter(Boolean);

    const nav = document.createElement('nav');
    nav.className = 'mat-toc';
    nav.innerHTML = `<h4>${esc(titulo)}</h4>`
      + entradas.map((e) => `<a href="#${esc(e.id)}"><span>${esc(e.texto)}</span><span class="t">${e.min} min</span></a>`).join('')
      + `<div class="toc-total">Leitura integral: <strong>${totalMin} minutos</strong></div>`;
    aside.append(nav);

    const links = new Map(entradas.map((e) => [e.id, nav.querySelector(`a[href="#${e.id}"]`)]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a && a.classList.remove('active'));
        const ativo = links.get(entry.target.id);
        if (ativo) ativo.classList.add('active');
      });
    }, { rootMargin: '-10% 0px -80% 0px' });
    secoes.forEach((s) => observer.observe(s));
  };

  // Barra de progresso de leitura e nav flutuante (Slides / Módulo), conforme
  // specs/lesson-materials.md. Os materiais artesanais (aulas 1 e 5) trazem esses
  // elementos no próprio HTML; as páginas geradas os recebem aqui. O float-nav só
  // aparece depois que o cabeçalho sai da tela. `css/encontro.css` já oculta ambos
  // na impressão, então a exportação em PDF não é afetada.
  const mountFloatNav = (headerSelector, links) => {
    if (document.getElementById('float-nav')) return;

    const bar = document.createElement('div');
    bar.id = 'progress-bar';

    const nav = document.createElement('div');
    nav.id = 'float-nav';
    nav.innerHTML = links
      .map((l) => `<a href="${esc(l.href)}" class="fn-btn ${esc(l.cls)}">${esc(l.label)}</a>`)
      .join('');

    document.body.append(bar, nav);

    const header = document.querySelector(headerSelector);
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      if (header && header.getBoundingClientRect().bottom < 0) nav.classList.add('visible');
      else nav.classList.remove('visible');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  // Trilha de continuidade — abre a leitura situando a aula na sequência do módulo.
  const continuityHtml = (mode) => lesson.continuity
    ? `<section class="material-box"><h2>${esc(lesson.continuity.title)}</h2>`
      + (mode === 'material' ? `<p>${esc(lesson.continuity.text)}</p>` : '')
      + `<ol class="dd-steps">${lesson.continuity.steps.map((s) => `<li><b>${esc(s.when)}</b><span>${esc(s.what)}</span></li>`).join('')}</ol>`
      + `<div class="material-note">${esc(lesson.continuity.note)}</div></section>`
    : '';

  const closingHtml = () => lesson.closing
    ? `<section class="material-box dd-closing"><h2>Síntese</h2><p>${esc(lesson.closing)}</p></section>`
    : '';

  window.renderLessonMaterial = function (root) {
    const sdd = lesson.sdd
      ? `<section class="material-box"><h2>Ponte com a Aula 1 — como este tema vira especificação</h2><p>Os conceitos abaixo não são acessórios da aula: são a forma pela qual o tema entra na especificação do projeto, no vocabulário estabelecido na Aula 1.</p><div class="material-sdd">${SDD_LABELS.map(([k, label, hint]) => `<div><b>${esc(label)} — ${esc(hint)}</b>${esc(lesson.sdd[k])}</div>`).join('')}</div></section>`
      : '';

    const preClass = lesson.preClass
      ? `<section class="material-box"><h2>Estudo prévio — antes da aula</h2><p>Estude os materiais abaixo antes do encontro presencial; a aula pressupõe essa leitura e não retoma integralmente os conceitos introdutórios.</p>${lesson.preClass.map((m, i) => `<div class="material-note"><strong>${i + 1}. <a href="${esc(m.url)}" target="_blank" rel="noopener noreferrer">${esc(m.title)}</a></strong><ul>${m.topics.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}</section>`
      : '';

    const timeboxSection = lesson.timebox
      ? `<section class="material-box"><h2>Como o tempo será dividido</h2><ul>${lesson.timebox.map((t) => `<li><strong>${t.minutes} min</strong> — ${esc(t.label)}</li>`).join('')}</ul></section>`
      : '';

    const warmupSection = lesson.warmup
      ? `<section class="material-box"><h2>${esc(lesson.warmup.title)}</h2><p><strong>${esc(lesson.warmup.duration)}.</strong> ${esc(lesson.warmup.goal)}</p><p>${esc(lesson.warmup.intro)}</p>${receiptTableHtml(lesson.warmup.receipt)}<p class="material-note">${esc(lesson.warmup.note)}</p><h3>Perguntas analíticas</h3><ol>${lesson.warmup.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ol><h3>Modelo de referência (resolvido)</h3><p><strong>Grão:</strong> ${esc(lesson.warmup.model.grao)}</p><p><strong>Fato:</strong> ${esc(lesson.warmup.model.fato)}</p><h4>Métricas</h4><ul>${lesson.warmup.model.metricas.map((m) => `<li>${esc(m)}</li>`).join('')}</ul><h4>Dimensões</h4><ul>${lesson.warmup.model.dimensoes.map((d) => `<li><strong>${esc(d.nome)}:</strong> ${esc(d.hierarquia)}</li>`).join('')}</ul><p><strong>Esquema:</strong> ${esc(lesson.warmup.model.esquema)}</p><div class="material-note">${esc(lesson.warmup.transition)}</div></section>`
      : '';

    const activitySection = (lesson.activity && lesson.activity.slideOnly)
      ? `<section class="material-box"><h2>${esc(lesson.activity.title)}</h2><p><strong>${esc(lesson.activity.duration)}.</strong> ${esc(lesson.activity.goal)}</p><p class="material-note">O enunciado completo desta atividade avaliativa é apresentado em sala, no slide da aula, e não é publicado antecipadamente.</p></section>`
      : lesson.activity
      ? `<section class="material-box"><h2>${esc(lesson.activity.title)}</h2><p><strong>${esc(lesson.activity.duration)}.</strong> ${esc(lesson.activity.goal)}</p><p>${esc(lesson.activity.intro)}</p><h3>Método, passo a passo</h3><ol>${lesson.activity.steps.map((s) => `<li><strong>${esc(s.title)}:</strong> ${esc(s.text)}</li>`).join('')}</ol><h3>Perguntas de verificação</h3><ul>${lesson.activity.checks.map((c) => `<li>${esc(c)}</li>`).join('')}</ul><h3>O que não fazer</h3><ul>${lesson.activity.avoid.map((a) => `<li>${esc(a)}</li>`).join('')}</ul><div class="material-note"><strong>Exemplo ilustrativo — o raciocínio, não a resposta.</strong> ${esc(lesson.activity.worked.text)}<ul>${lesson.activity.worked.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>${esc(lesson.activity.worked.note)}</div><p><a href="${esc(lesson.activity.tool.href)}">${esc(lesson.activity.tool.label)}</a></p></section>`
      : '';

    root.innerHTML = `<header class="material-head"><span>Módulo 11 · Engenharia de Software · ${esc(lesson.discipline || DEFAULT_DISC)}</span><h1>${esc(lesson.title)}</h1><p>${esc(lesson.subtitle)} · Prof. ${esc(lesson.professor || DEFAULT_PROF)} · ${esc(lesson.date)}</p></header><div class="mat-layout"><aside class="mat-sidebar"></aside><article class="mat-article material-body">`
      + fichaEncontro()
      + timeboxSection
      + preClass
      + dbeaverHtml('material')
      + `<section class="material-box"><h2>Objetivo da aula</h2><p>${esc(lesson.objective)}</p><h3>Ao final você deve conseguir</h3><ul>${lesson.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></section>`
      + `<section class="material-box"><h2>Roteiro</h2><ol>${agenda.map((a) => `<li><strong>${esc(a.nav)}</strong> — ${esc(a.text)}</li>`).join('')}</ol></section>`
      + continuityHtml('material')
      + lesson.sections.map((s, i) => `<section class="material-section"><h2>${i + 1}. ${esc(s.title)}</h2><p>${esc(s.text)}</p>${s.diagram ? `<div class="mermaid-wrap medium"><div class="mermaid">${s.diagram}</div></div>` : ''}<h3>Checklist de aplicação</h3><ul>${checklistOf(s)}</ul><div class="material-note"><strong>Erro comum:</strong> ${esc(s.pitfall)}</div></section>`).join('')
      + deepDive('material')
      + sqlLabsMaterial()
      + benchmarkTable()
      + sdd
      + warmupSection
      + activitySection
      + ((lesson.activity && lesson.activity.slideOnly)
        ? `<section class="material-box"><h2>Entregável e avaliação</h2><p>${esc(lesson.deliverable)}</p><p class="material-note">Os critérios de avaliação são apresentados em sala, junto do enunciado.</p></section>`
        : `<section class="material-box"><h2>Entregável e avaliação</h2><p>${esc(lesson.deliverable)}</p><ul>${evaluationList}</ul></section>`)
      + closingHtml()
      + `<section class="material-box"><h2>Referências</h2><ul>${lesson.references.map((x) => `<li>${referenceItem(x)}</li>`).join('')}</ul></section></article></div>`;

    mountToc(root, 'Nesta aula');
    mountSqlActions(root);
    mountFloatNav('.material-head', [
      { href: `../slides/slide-lesson-${lessonId}.html`, cls: 'fn-btn-slides', label: '▶ Slides' },
      { href: `../planos/lesson-${lessonId}-plano.html`, cls: 'fn-btn-alt', label: '📋 Plano' },
      { href: '../../home-module-11-eng-software.html', cls: 'fn-btn-back', label: '← Módulo' }
    ]);
  };

  window.renderLessonPlan = function (root) {
    const sdd = lesson.sdd
      ? `<section><h2>Articulação com a Aula 1 (Spec-Driven Development)</h2><ul>${SDD_LABELS.map(([k, label]) => `<li><strong>${esc(label)}:</strong> ${esc(lesson.sdd[k])}</li>`).join('')}</ul></section>`
      : '';

    const preClass = lesson.preClass
      ? `<section><h2>Estudo prévio exigido</h2><p>A aula pressupõe que os alunos tenham estudado, antes do encontro, os seguintes materiais:</p><ul>${lesson.preClass.map((m) => `<li><a href="${esc(m.url)}" target="_blank" rel="noopener noreferrer">${esc(m.title)}</a></li>`).join('')}</ul></section>`
      : '';

    const timeboxPlan = lesson.timebox
      ? `<section><h2>Como o tempo será dividido</h2><ul>${lesson.timebox.map((t) => `<li><strong>${t.minutes} min</strong> — ${esc(t.label)}</li>`).join('')}</ul></section>`
      : '';

    const warmupPlan = lesson.warmup
      ? `<section><h2>${esc(lesson.warmup.title)}</h2><p><strong>${esc(lesson.warmup.duration)}.</strong> ${esc(lesson.warmup.goal)} O professor resolve o modelo junto com a turma, usando uma nota fiscal de supermercado sintetizada (dados fictícios) como exemplo de trabalho — diferente da atividade do projeto, aqui o resultado é apresentado.</p><p>${esc(lesson.warmup.transition)}</p></section>`
      : '';

    const activityPlan = (lesson.activity && lesson.activity.slideOnly)
      ? `<section><h2>${esc(lesson.activity.title)}</h2><p><strong>${esc(lesson.activity.duration)}.</strong> ${esc(lesson.activity.goal)}</p><p>O enunciado completo é apresentado em sala, no slide da aula, e não é publicado antecipadamente.</p></section>`
      : lesson.activity
      ? `<section><h2>${esc(lesson.activity.title)}</h2><p><strong>${esc(lesson.activity.duration)}.</strong> ${esc(lesson.activity.goal)} O professor orienta com perguntas e critérios de verificação, sem fornecer a solução do modelo.</p><ol>${lesson.activity.steps.map((s) => `<li><strong>${esc(s.title)}:</strong> ${esc(s.text)}</li>`).join('')}</ol></section>`
      : '';

    root.innerHTML = `<header class="plan-head"><span>Módulo 11 · Plano de Ensino</span><h1>Aula ${esc(lessonId)} — ${esc(lesson.title)}</h1><p>Professor: ${esc(lesson.professor || DEFAULT_PROF)} · ${esc(lesson.date)}</p></header><div class="mat-layout"><aside class="mat-sidebar"></aside><main class="mat-article plan-body">`
      + fichaEncontro()
      + `<section><h2>Ementa</h2><p>${esc(lesson.subtitle)} ${esc(lesson.objective)}</p></section>`
      + continuityHtml('plan')
      + timeboxPlan
      + preClass
      + dbeaverHtml('plan')
      + `<section><h2>Objetivos de aprendizagem</h2><ul>${lesson.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></section>`
      + `<section><h2>Metodologia e cronograma</h2><ol>${agenda.map((a) => `<li><strong>${esc(a.nav)}:</strong> ${esc(a.text)}</li>`).join('')}</ol></section>`
      + deepDive('plan')
      + sqlLabsPlan()
      + benchmarkTable()
      + sdd
      + warmupPlan
      + activityPlan
      + ((lesson.activity && lesson.activity.slideOnly)
        ? `<section><h2>Avaliação</h2><p>${esc(lesson.deliverable)}</p><p>Os critérios de avaliação são apresentados em sala, junto do enunciado.</p></section>`
        : `<section><h2>Avaliação</h2><p>Entrega individual ou em grupo do artefato descrito no material, com apresentação curta e revisão por pares. ${esc(lesson.deliverable)}</p><ul>${evaluationList}</ul></section>`)
      + closingHtml()
      + `<section><h2>Bibliografia</h2><ul>${lesson.references.map((x) => `<li>${referenceItem(x)}</li>`).join('')}</ul></section></main></div>`;

    mountToc(root, 'Neste plano');
    mountFloatNav('.plan-head', [
      { href: `../slides/slide-lesson-${lessonId}.html`, cls: 'fn-btn-slides', label: '▶ Slides' },
      { href: `../materials/lesson-${lessonId}-material.html`, cls: 'fn-btn-alt', label: '📖 Material' },
      { href: '../../home-module-11-eng-software.html', cls: 'fn-btn-back', label: '← Módulo' }
    ]);
  };
})();
