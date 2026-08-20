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
      // O encontro é dedicado à Ponderada em Sala: o deck traz apenas o enunciado.
      slidesActivityOnly: true,
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
      subtitle: 'O lado da fato: tipos de tabela fato, aditividade das medidas e a prova de que o modelo não produz número errado.',
      objective: 'Classificar a tabela fato de cada cubo do projeto quanto ao tipo, classificar cada medida quanto à aditividade e especificar os testes que provam a correção do modelo dimensional.',
      outcomes: [
        'Distinguir fato transacional, snapshot periódico e snapshot acumulativo pelo evento que uma linha representa.',
        'Preencher com critério o campo Tipo de fato do Data Model Canvas, decidido até aqui sem base conceitual.',
        'Classificar cada medida como aditiva, semi-aditiva ou não aditiva e declarar a dimensão em que a soma deixa de valer.',
        'Modelar fatos sem medida e fatos de cobertura para responder perguntas sobre eventos que não ocorreram.',
        'Tratar fatos e dimensões de chegada tardia e correções retroativas sem descartar registros.',
        'Especificar os cinco testes que provam a correção do modelo e registrá-los como contrato de qualidade da camada de serviço.'
      ],
      timebox: [
        { label: 'Teoria — tipos de fato, aditividade, fatos sem medida, tempo difícil e a prova do modelo', minutes: 60 },
        { label: 'Laboratório — diagnóstico de um modelo defeituoso', minutes: 35 },
        { label: 'Fechamento do canvas — campos Tipo de fato e Qualidade nos cubos do projeto', minutes: 25 }
      ],
      preClass: [
        {
          title: 'Modelagem dimensional — tabelas de fatos',
          topics: ['Estrutura da tabela de fatos', 'Chave primária e chaves de dimensão', 'Medidas e atributos de auditoria', 'Tipos de tabela de fatos', 'Tipos de medida', 'Tabelas de fatos sem fatos', 'Tabelas de fatos agregadas'],
          url: 'https://learn.microsoft.com/pt-br/fabric/data-warehouse/dimensional-modeling-fact-tables'
        },
        {
          title: 'Modelagem dimensional — tabelas de dimensões',
          topics: ['Chave alternativa e chaves naturais', 'Atributos de acompanhamento histórico', 'Gerenciar alterações históricas', 'Membros da dimensão especial', 'Calendário e hora', 'Dimensões conformes'],
          url: 'https://learn.microsoft.com/pt-br/fabric/data-warehouse/dimensional-modeling-dimension-tables'
        },
        {
          title: 'Dimensional Modeling Techniques — Kimball Group',
          topics: ['Fact table structure', 'Transaction, periodic snapshot e accumulating snapshot fact tables', 'Additive, semi-additive e non-additive facts', 'Factless fact tables', 'Late arriving dimensions'],
          url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
        },
        {
          title: 'Data tests — dbt',
          topics: ['Testes singulares e testes genéricos', 'unique e not_null', 'relationships e accepted_values', 'Severidade e limiar de falha', 'Execução dos testes durante a carga'],
          url: 'https://docs.getdbt.com/docs/build/data-tests'
        }
      ],
      sections: [
        {
          nav: 'Tipos de tabela fato', title: 'Transacional, snapshot periódico e snapshot acumulativo',
          text: 'O tipo da tabela fato decorre do evento que uma linha representa. O fato transacional registra um evento no instante em que ocorre. O snapshot periódico fotografa um estado em intervalos regulares, e gera linha mesmo quando nada aconteceu. O snapshot acumulativo mantém uma linha por processo e a atualiza a cada marco atingido, o que permite medir a duração entre etapas. O Data Model Canvas do projeto pede essa classificação no campo Tipo de fato desde a Aula 2.',
          checklist: [
            'Para cada cubo do seu projeto, escreva se a linha nasce de um evento, de uma fotografia periódica ou de um processo com marcos.',
            'Confirme que o snapshot periódico gera linha em período sem movimento — caso contrário, o zero desaparece da série histórica.',
            'Identifique se algum cubo mede duração entre etapas: esse é o sinal de snapshot acumulativo.'
          ],
          pitfall: 'Classificar como transacional todo cubo cuja origem é uma tabela de eventos. O que define o tipo é o que uma linha representa no cubo, não o formato do arquivo de origem.',
          diagram: `flowchart LR
    subgraph T["Transacional<br/>uma linha por evento"]
        direction TB
        T1["resposta enviada<br/>12/03 09:14"]
        T2["resposta enviada<br/>12/03 09:51"]
    end
    subgraph P["Snapshot periódico<br/>uma linha por período"]
        direction TB
        P1["mar/2026<br/>412 respondentes ativos"]
        P2["abr/2026<br/>0 respondentes ativos"]
    end
    subgraph A["Snapshot acumulativo<br/>uma linha por processo, atualizada a cada marco"]
        direction TB
        A1["pesquisa 88 · aberta 01/03"]
        A2["encerrada 20/03 · tabulada 27/03"]
        A3["publicada · ainda em aberto"]
    end
    T ~~~ P
    P ~~~ A`
        },
        {
          nav: 'Aditividade das medidas', title: 'Medidas aditivas, semi-aditivas e não aditivas',
          text: 'Uma medida aditiva pode ser somada em qualquer dimensão. Uma medida semi-aditiva soma em algumas dimensões e não em outras: um total de respondentes ativos soma entre empresas, nunca ao longo do tempo. Uma medida não aditiva não soma em dimensão alguma — taxas, percentuais e médias pertencem a essa classe, e o modelo deve guardar o numerador e o denominador em vez do resultado já calculado.',
          checklist: [
            'Classifique cada métrica dos seus cubos e registre a classificação junto da coluna, não em documento separado.',
            'Para cada medida semi-aditiva, escreva explicitamente a dimensão em que a soma é inválida.',
            'Substitua toda taxa já calculada na fato pelo par numerador e denominador.'
          ],
          pitfall: 'Guardar a taxa de adesão como coluna da fato. A média das taxas de cada pesquisa não é a taxa do conjunto: apenas o numerador e o denominador permitem agregar corretamente em qualquer recorte.',
          diagram: `flowchart LR
    M["medida do cubo"] --> Q{"soma em qual dimensão?"}
    Q -->|"em todas"| A1["Aditiva<br/>respostas recebidas"]
    Q -->|"em algumas"| A2["Semi-aditiva<br/>respondentes ativos<br/>soma entre empresas,<br/>nunca entre datas"]
    Q -->|"em nenhuma"| A3["Não aditiva<br/>taxa de adesão<br/>guarde numerador<br/>e denominador"]`
        },
        {
          nav: 'Fatos sem medida', title: 'Fatos sem medida e fatos de cobertura',
          text: 'Nem todo fato tem métrica. Um fato sem medida registra a ocorrência de um evento por meio das chaves que o descrevem, e responde a perguntas de contagem. Um fato de cobertura registra o que era possível — as empresas elegíveis a responder uma pesquisa — e, confrontado com o fato de eventos, permite responder o que não aconteceu: quais empresas elegíveis não responderam.',
          checklist: [
            'Identifique uma pergunta do seu projeto que exija saber o que não ocorreu.',
            'Verifique se essa pergunta pode ser respondida sem uma tabela do que era elegível — em geral não pode.',
            'Confirme que o fato sem medida tem grão declarado, mesmo sem nenhuma coluna numérica.'
          ],
          pitfall: 'Tentar responder o que não aconteceu apenas com a tabela de eventos. A ausência de linha não distingue quem não foi convidado de quem foi convidado e não respondeu.',
          diagram: `erDiagram
    DIMENSAO_PESQUISA ||--o{ FATO_COBERTURA_ELEGIVEL : define
    DIMENSAO_EMPRESA ||--o{ FATO_COBERTURA_ELEGIVEL : elegivel_em
    DIMENSAO_PESQUISA ||--o{ FATO_RESPOSTA : recebe
    DIMENSAO_EMPRESA ||--o{ FATO_RESPOSTA : responde
    FATO_COBERTURA_ELEGIVEL {
        int pesquisa_sk FK
        int empresa_sk FK
    }
    FATO_RESPOSTA {
        int pesquisa_sk FK
        int empresa_sk FK
        int respostas_recebidas
    }`
        },
        {
          nav: 'Tempo difícil', title: 'Chegada tardia, correção retroativa e calendário',
          text: 'Um fato de chegada tardia é o evento que chega depois do período a que pertence. Uma dimensão de chegada tardia é o registro cuja descrição ainda não existe quando o fato chega, e a resposta é criar um membro inferido, não rejeitar a linha. Correções retroativas exigem decidir se o número já publicado é reescrito ou versionado. O calendário deve existir como tabela de dimensão, com o ano fiscal separado do civil quando os períodos divergirem.',
          checklist: [
            'Defina o que o pipeline faz quando o fato chega sem a dimensão correspondente: rejeita, descarta ou cria membro inferido.',
            'Declare se uma correção retroativa reescreve o número já publicado ou gera nova versão do período.',
            'Verifique se o seu projeto trata a data como tabela de dimensão ou como função aplicada na consulta.'
          ],
          pitfall: 'Rejeitar o fato cuja dimensão ainda não existe. O evento é real e desaparece do relatório; o membro inferido preserva o fato e é completado quando a descrição chega.'
        },
        {
          nav: 'A prova do modelo', title: 'Os cinco testes e o contrato da camada de serviço',
          text: 'Um modelo dimensional se prova por teste executável, não por revisão visual. Cinco testes cobrem os erros que produzem número errado sem gerar erro visível: unicidade da chave do grão, integridade referencial entre fato e dimensão, ausência de vigências sobrepostas nas dimensões versionadas, reconciliação de totais com a origem dentro de uma tolerância declarada e ausência de dupla contagem em métricas que atravessam bridge tables. Esses testes são o contrato de qualidade da camada de serviço desenhada no encontro anterior.',
          checklist: [
            'Escreva os cinco testes para um cubo do seu projeto, cada um com o erro que detecta.',
            'Declare a tolerância aceita na reconciliação com a origem, em número.',
            'Defina o que acontece quando um teste falha: a carga é interrompida, o dado é publicado com aviso ou o período é reprocessado.'
          ],
          pitfall: 'Validar apenas a contagem de linhas. A dupla contagem por bridge table preserva a contagem de linhas da fato e destrói toda soma que passa por ela.',
          diagram: `flowchart LR
    C["carga do cubo"] --> T1["unicidade da<br/>chave do grão"]
    T1 --> T2["integridade<br/>referencial"]
    T2 --> T3["vigências não<br/>sobrepostas"]
    T3 --> T4["reconciliação<br/>com a origem"]
    T4 --> T5["ausência de<br/>dupla contagem"]
    T5 --> OK["publica na camada<br/>de serviço"]
    T1 -.->|falha| STOP["interrompe e<br/>registra o erro"]
    T4 -.->|falha| STOP`
        }
      ],
      sdd: {
        rf: 'RF-106 — Permitir apurar, para qualquer pesquisa encerrada, quantas empresas elegíveis não responderam, sem depender de conferência manual.',
        rnf: 'RNF-106 — Nenhuma chave do grão duplicada; reconciliação de totais com a origem dentro de 0,5%; nenhuma métrica aditiva somada através de bridge table sem peso de alocação.',
        adr: 'ADR-DW-06 — Snapshot acumulativo para o ciclo de vida da pesquisa, com um marco por etapa, em vez de fato transacional por mudança de status. Alternativa descartada: registrar cada mudança de status como evento, o que exigiria reconstruir a duração entre etapas a cada consulta. Consequência: a linha do snapshot é atualizada, e não apenas inserida, o que exige carga idempotente e teste de unicidade a cada execução.',
        gherkin: 'Dado um cubo de participação com fato de cobertura das empresas elegíveis, Quando uma pesquisa é encerrada, Então é possível listar as empresas elegíveis sem resposta sem alterar a estrutura do modelo.'
      },
      activity: {
        title: 'Atividade em sala — Diagnóstico de um modelo defeituoso e fechamento do canvas',
        duration: '60 min · segunda metade da aula',
        goal: 'Encontrar, em um modelo dimensional de aparência correta, os defeitos que produzem número errado, e em seguida fechar no Data Model Canvas do projeto os campos Tipo de fato e Qualidade de cada cubo.',
        intro: 'A atividade tem duas partes. Na primeira, o grupo diagnostica um modelo com defeitos plantados: nomear o erro, dizer qual número ele distorce e propor a correção estrutural. Na segunda, o grupo retoma o Data Model Canvas do próprio projeto e preenche os dois campos que permaneceram abertos desde a Aula 2. Esta atividade não é avaliativa — a Ponderada do módulo foi realizada no encontro anterior.',
        stepsTitle: 'Método, passo a passo',
        steps: [
          { title: 'Leia o modelo entregue', text: 'Percorra o modelo defeituoso apresentado a seguir. Ele descreve um cubo de participação em pesquisas com aparência correta: grão declarado, dimensões nomeadas e métricas de nome plausível.' },
          { title: 'Nomeie o erro', text: 'Para cada defeito, declare qual princípio foi violado: aditividade, dupla contagem, vigência de dimensão versionada ou granularidade do tempo.' },
          { title: 'Descreva o número distorcido', text: 'Diga qual relatório passa a mostrar número errado e em que direção — para mais ou para menos.' },
          { title: 'Proponha a correção estrutural', text: 'Corrija o modelo, não a consulta. Um filtro acrescentado ao relatório não conserta um modelo que permite o erro.' },
          { title: 'Classifique o tipo de fato', text: 'No dmc.json do seu grupo, classifique a fato de cada cubo como transacional, snapshot periódico ou snapshot acumulativo, e registre a justificativa pelo que uma linha representa.' },
          { title: 'Revise a aditividade das métricas', text: 'Percorra as métricas já registradas e marque cada uma como aditiva, semi-aditiva ou não aditiva; substitua toda taxa calculada pelo par numerador e denominador.' },
          { title: 'Escreva os cinco testes', text: 'Para cada cubo, registre no campo Qualidade os cinco testes, cada um com o erro que detecta e a tolerância, quando houver.' },
          { title: 'Exporte o canvas', text: 'Exporte o dmc.json atualizado e versione no repositório do grupo, junto da justificativa das classificações.' }
        ],
        checks: [
          'Algum cubo do seu projeto mede duração entre etapas e permanece classificado como transacional?',
          'Alguma métrica registrada é uma taxa já calculada, que deveria ser substituída por numerador e denominador?',
          'Os cinco testes registrados nomeiam o erro que cada um detecta, ou apenas o campo que verificam?'
        ],
        avoid: [
          'Não corrija o modelo defeituoso alterando a consulta: o defeito está na estrutura.',
          'Não classifique o tipo de fato pelo formato do arquivo de origem; classifique pelo que uma linha do cubo representa.',
          'Não registre "validar os dados" como teste: um teste nomeia o erro que detecta e o que acontece quando falha.'
        ],
        worked: {
          text: 'O modelo abaixo descreve um cubo de participação em pesquisas e tem aparência correta. Há cinco defeitos plantados, e nenhum deles gera mensagem de erro: todos produzem número errado silenciosamente.',
          questions: [
            'A fato guarda uma coluna taxa_de_adesao já calculada, e o relatório de adesão por setor tira a média dessa coluna.',
            'A fato guarda respondentes_ativos por dia, e o painel mensal soma essa coluna ao longo do mês.',
            'A bridge entre pesquisa e empresa não tem peso de alocação, e o total de respondentes é somado através dela.',
            'A dimensao_empresa é SCD 2, e a consulta a une pela chave natural, sem filtrar vigência.',
            'A data existe apenas como função de conversão aplicada na consulta, e o calendário fiscal do parceiro começa em abril.'
          ],
          note: 'Para cada item, nomeie o princípio violado, o número distorcido e a correção estrutural. A discussão é conduzida ao final da atividade.'
        },
        tool: { label: 'Abrir o Data Model Canvas', href: '../data-model-canvas.html' },
        acceptance: [
          'Os cinco defeitos do modelo apresentado foram identificados, com o princípio violado nomeado em cada um.',
          'Cada cubo do canvas tem o campo Tipo de fato preenchido, com justificativa pelo que uma linha representa.',
          'Cada métrica do canvas está classificada como aditiva, semi-aditiva ou não aditiva, e nenhuma taxa permanece armazenada já calculada.',
          'O campo Qualidade de cada cubo registra os cinco testes, cada um com o erro que detecta.'
        ]
      },
      deliverable: 'O Data Model Canvas do projeto com os campos Tipo de fato e Qualidade preenchidos para cada cubo, as métricas classificadas quanto à aditividade e o dmc.json atualizado versionado no repositório do grupo.',
      references: ['Kimball & Ross — The Data Warehouse Toolkit (tipos de tabela fato e aditividade)', 'Microsoft Learn — Modelagem dimensional: tabelas de fatos', 'Microsoft Learn — Modelagem dimensional: tabelas de dimensões', 'dbt — Data tests']
    },

    7: {
      title: 'Otimização de Data Warehouses', date: '24/08/2026',
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

    10: {
      title: 'Armazenamento em Grande Escala', date: '01/09/2026',
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
      title: 'Coleta e Extração', date: '09/09/2026',
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
      title: 'Métricas e Telemetria em ETLs', date: '21/09/2026',
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
  const acceptance = (lesson.activity && lesson.activity.acceptance) || [
    'O artefato declara o requisito funcional e ao menos um requisito não funcional mensurável.',
    'A decisão estrutural está registrada em ADR, com alternativa descartada e consequência.',
    'Existe ao menos um cenário de aceite que falha antes da implementação.',
    'Há dono, forma de operação e caminho de reprocessamento.'
  ];
  const evaluationList = lesson.activity
    ? acceptance.map((a) => `<li>${esc(a)}</li>`).join('')
    : '<li>Clareza do problema e do contrato: 25%</li><li>Correção técnica e tratamento de exceções: 30%</li><li>Testabilidade, qualidade e operação: 25%</li><li>Comunicação e justificativa das decisões: 20%</li>';

  const SDD_LABELS = [
    ['rf', 'Requisito funcional', 'o que o sistema deve fazer'],
    ['rnf', 'Requisito não funcional', 'meta mensurável e verificável'],
    ['adr', 'Decisão em ADR', 'por que a arquitetura é esta'],
    ['gherkin', 'Cenário de aceite', 'o teste que falha antes do código']
  ];

  window.module11Lesson = lesson;

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

  // Slides do enunciado da atividade avaliativa, compartilhados entre o deck
  // completo e o deck dedicado à prova.
  // Distribui itens em telas de no máximo `porTela`, preservando a numeração.
  const paginar = (itens, porTela) => itens
    .map((item, i) => ({ ...item, n: i + 1 }))
    .reduce((telas, item, i) => {
      if (i % porTela === 0) telas.push([]);
      telas[telas.length - 1].push(item);
      return telas;
    }, []);

  const activitySlides = () => (lesson.activity ? [
        `<article class="lesson-slide"><span class="lesson-kicker">${esc(lesson.activity.duration)}</span><h2>${esc(lesson.activity.title)}</h2><div class="lesson-callout"><strong>${esc(lesson.activity.goal)}</strong></div><div class="lesson-card lesson-wide"><p>${esc(lesson.activity.intro)}</p></div></article>`,
        `<article class="lesson-slide"><span class="lesson-kicker">Método</span><h2>${esc(lesson.activity.stepsTitle || 'Do negócio ao cubo, passo a passo')}</h2><div class="lesson-grid">${lesson.activity.steps.map((s, i) => `<div class="lesson-card"><b>Passo ${i + 1}</b><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div></article>`,
        (lesson.activity.worked
          ? `<article class="lesson-slide"><span class="lesson-kicker">Exemplo ilustrativo</span><h2>O raciocínio, não a resposta</h2><div class="lesson-split"><div class="lesson-card"><p>${esc(lesson.activity.worked.text)}</p><ul>${lesson.activity.worked.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul><p>${esc(lesson.activity.worked.note)}</p></div><div class="lesson-card"><h3>Não faça isso</h3><ul>${lesson.activity.avoid.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div></div><div class="lesson-warn"><strong>Verifique antes de seguir:</strong> ${lesson.activity.checks.map((c) => esc(c)).join(' · ')}</div></article>`
          : `<article class="lesson-slide"><span class="lesson-kicker">Antes de entregar</span><h2>Regras e verificação</h2><div class="lesson-split"><div class="lesson-card"><h3>Não faça isso</h3><ul>${lesson.activity.avoid.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div><div class="lesson-card"><h3>Verifique antes de entregar</h3><ul>${lesson.activity.checks.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div></div></article>`)
  ] : []);

  window.renderLessonSlides = function (root) {
    // Encontros dedicados à avaliação: o deck traz apenas o enunciado da
    // atividade. O conteúdo conceitual permanece no material de leitura, que
    // não é exibido em sala para não servir de consulta durante a prova.
    if (lesson.slidesActivityOnly && lesson.activity) {
      const prova = [
        `<article class="lesson-slide lesson-cover"><span class="lesson-kicker">Módulo 11 · Engenharia de Software · Aula ${esc(lessonId)} · Atividade avaliativa</span><h1>${esc(lesson.title)}</h1><p>${esc(lesson.activity.title)}</p><small>${esc(lesson.discipline || DEFAULT_DISC)} · Prof. ${esc(lesson.professor || DEFAULT_PROF)} · ${esc(lesson.date)}</small></article>`,
        `<article class="lesson-slide"><span class="lesson-kicker">${esc(lesson.activity.duration)}</span><h2>${esc(lesson.activity.title)}</h2><div class="lesson-callout"><strong>${esc(lesson.activity.goal)}</strong></div><div class="lesson-card lesson-wide"><p>${esc(lesson.activity.intro)}</p></div></article>`,
        ...paginar(lesson.activity.steps, 4).map((grupo, pagina, todas) =>
          `<article class="lesson-slide"><span class="lesson-kicker">${esc(lesson.activity.stepsTitle || 'Atividade')}${todas.length > 1 ? ` · ${pagina + 1} de ${todas.length}` : ''}</span><h2>Questões ${grupo[0].n} a ${grupo[grupo.length - 1].n}</h2><div class="lesson-split" style="grid-template-columns:repeat(2,minmax(0,1fr));">${grupo.map((s) => `<div class="lesson-card"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div></article>`),
        (lesson.activity.avoid && lesson.activity.checks
          ? `<article class="lesson-slide"><span class="lesson-kicker">Antes de entregar</span><h2>Regras e verificação</h2><div class="lesson-split"><div class="lesson-card"><h3>Não faça isso</h3><ul>${lesson.activity.avoid.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div><div class="lesson-card"><h3>Verifique antes de entregar</h3><ul>${lesson.activity.checks.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div></div></article>`
          : ''),
        `<article class="lesson-slide encontro-slide"><span class="lesson-kicker">Ficha do encontro</span>${fichaEncontro()}</article>`
      ];
      root.innerHTML = prova.filter(Boolean).join('');
      return prova.filter(Boolean).length;
    }

    const slides = [
      `<article class="lesson-slide lesson-cover"><span class="lesson-kicker">Módulo 11 · Engenharia de Software · Aula ${esc(lessonId)}</span><h1>${esc(lesson.title)}</h1><p>${esc(lesson.subtitle)}</p><small>${esc(lesson.discipline || DEFAULT_DISC)} · Prof. ${esc(lesson.professor || DEFAULT_PROF)} · ${esc(lesson.date)}</small></article>`,

      ...(lesson.timebox ? [`<article class="lesson-slide"><span class="lesson-kicker">Cronograma</span><h2>Como o tempo será dividido</h2><div class="lesson-grid">${lesson.timebox.map((t) => `<div class="lesson-card"><b>${t.minutes} min</b><p>${esc(t.label)}</p></div>`).join('')}</div></article>`] : []),

      `<article class="lesson-slide"><span class="lesson-kicker">Agenda</span><h2>Como vamos trabalhar</h2><div class="lesson-grid">${agenda.map((a, i) => `<div class="lesson-card"><b>${String(i + 1).padStart(2, '0')}</b><h3>${esc(a.nav)}</h3><p>${esc(a.text)}</p></div>`).join('')}</div></article>`,

      `<article class="lesson-slide"><span class="lesson-kicker">Objetivo</span><h2>O que você precisa conseguir fazer</h2><div class="lesson-callout"><strong>${esc(lesson.objective)}</strong></div><div class="lesson-grid">${lesson.outcomes.map((o, i) => `<div class="lesson-card"><b>Resultado ${i + 1}</b><p>${esc(o)}</p></div>`).join('')}</div></article>`,

      ...lesson.sections.flatMap((s, i) => [
        `<article class="lesson-slide"><span class="lesson-kicker">Bloco ${i + 1} · ${esc(s.nav)}</span><h2>${esc(s.title)}</h2><div class="lesson-split"><div class="lesson-card"><p>${esc(s.text)}</p></div><div class="lesson-card"><h3>Checklist de aplicação</h3><ul>${checklistOf(s)}</ul></div></div><div class="lesson-warn"><strong>Erro comum:</strong> ${esc(s.pitfall)}</div></article>`,
        ...(s.diagram ? [`<article class="lesson-slide"><span class="lesson-kicker">Bloco ${i + 1} · ${esc(s.nav)}</span><h2>Exemplo visual</h2><div class="mermaid-wrap medium"><div class="mermaid">${s.diagram}</div></div></article>`] : [])
      ]),

      ...(lesson.sdd ? [`<article class="lesson-slide"><span class="lesson-kicker">Ponte com a Aula 1 · Spec-Driven Development</span><h2>Como este tema vira especificação</h2><div class="lesson-grid">${SDD_LABELS.map(([k, label, hint]) => `<div class="lesson-card"><b>${esc(label)}</b><h3 class="lesson-hint">${esc(hint)}</h3><p>${esc(lesson.sdd[k])}</p></div>`).join('')}</div></article>`] : []),

      ...(lesson.warmup ? [
        `<article class="lesson-slide"><span class="lesson-kicker">${esc(lesson.warmup.duration)}</span><h2>${esc(lesson.warmup.title)}</h2><div class="lesson-callout"><strong>${esc(lesson.warmup.goal)}</strong></div><div class="lesson-card lesson-wide"><p>${esc(lesson.warmup.intro)}</p></div></article>`,
        `<article class="lesson-slide"><span class="lesson-kicker">Documento de trabalho</span><h2>Nota fiscal sintetizada</h2>${receiptTableHtml(lesson.warmup.receipt)}<div class="lesson-hint" style="margin-top:8px;">${esc(lesson.warmup.note)}</div></article>`,
        `<article class="lesson-slide"><span class="lesson-kicker">Passo 1</span><h2>Perguntas analíticas</h2><div class="lesson-grid">${lesson.warmup.questions.map((q, i) => `<div class="lesson-card"><b>Pergunta ${i + 1}</b><p>${esc(q)}</p></div>`).join('')}</div></article>`,
        `<article class="lesson-slide"><span class="lesson-kicker">Modelo de referência</span><h2>Grão, fato e dimensões resolvidos</h2><div class="lesson-callout"><strong>Grão:</strong> ${esc(lesson.warmup.model.grao)}</div><div class="lesson-split"><div class="lesson-card"><h3>${esc(lesson.warmup.model.fato)}</h3><p><strong>Métricas</strong></p><ul>${lesson.warmup.model.metricas.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div><div class="lesson-card"><h3>Dimensões</h3><ul>${lesson.warmup.model.dimensoes.map((d) => `<li><strong>${esc(d.nome)}:</strong> ${esc(d.hierarquia)}</li>`).join('')}</ul></div></div><div class="lesson-warn"><strong>${esc(lesson.warmup.model.esquema)}</strong><br>${esc(lesson.warmup.transition)}</div></article>`
      ] : []),

      ...activitySlides(),

      `<article class="lesson-slide"><span class="lesson-kicker">${esc(lesson.deliverableKicker || 'Laboratório')}</span><h2>${esc(lesson.deliverableTitle || 'Entregável da aula')}</h2><div class="lesson-callout"><strong>${esc(lesson.deliverable)}</strong></div><div class="lesson-card lesson-wide"><h3>${esc(lesson.evaluationLabel || 'Critérios de aceite')}</h3><ol>${evaluationList}</ol></div>${lesson.submissionNotice ? `<div class="lesson-warn"><strong>Atenção — regras de entrega:</strong><ul style="margin:6px 0 0;padding-left:1.2rem;">${lesson.submissionNotice.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>` : ''}</article>`,

      `<article class="lesson-slide"><span class="lesson-kicker">Fechamento</span><h2>Leve para o projeto</h2><div class="lesson-grid">${lesson.references.map((x, i) => `<div class="lesson-card"><b>Ref. ${i + 1}</b><p>${esc(x)}</p></div>`).join('')}</div><div class="lesson-callout">A pergunta final: <strong>qual decisão fica mais segura depois deste artefato?</strong></div></article>`,

      `<article class="lesson-slide encontro-slide"><span class="lesson-kicker">Ficha do encontro</span>${fichaEncontro()}</article>`
    ];
    root.innerHTML = slides.join('');
    return slides.length;
  };

  window.renderLessonMaterial = function (root) {
    const sdd = lesson.sdd
      ? `<section class="material-box"><h2>Ponte com a Aula 1 — como este tema vira especificação</h2><p>Os conceitos abaixo não são acessórios da aula: são a forma pela qual o tema entra na especificação do projeto, no vocabulário estabelecido na Aula 1.</p><div class="material-sdd">${SDD_LABELS.map(([k, label, hint]) => `<div><b>${esc(label)} — ${esc(hint)}</b>${esc(lesson.sdd[k])}</div>`).join('')}</div></section>`
      : '';

    const preClass = lesson.preClass
      ? `<section class="material-box"><h2>Estudo prévio — antes da aula</h2><p>Estude os materiais abaixo antes do encontro presencial; a aula pressupõe essa leitura e não repete o conteúdo do zero.</p>${lesson.preClass.map((m, i) => `<div class="material-note"><strong>${i + 1}. <a href="${esc(m.url)}" target="_blank" rel="noopener noreferrer">${esc(m.title)}</a></strong><ul>${m.topics.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}</section>`
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

    root.innerHTML = `<header class="material-head"><span>Módulo 11 · Engenharia de Software · ${esc(lesson.discipline || DEFAULT_DISC)}</span><h1>${esc(lesson.title)}</h1><p>${esc(lesson.subtitle)} · Prof. ${esc(lesson.professor || DEFAULT_PROF)} · ${esc(lesson.date)}</p></header><div class="material-body">`
      + fichaEncontro()
      + timeboxSection
      + preClass
      + `<section class="material-box"><h2>Objetivo da aula</h2><p>${esc(lesson.objective)}</p><h3>Ao final você deve conseguir</h3><ul>${lesson.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></section>`
      + `<section class="material-box"><h2>Roteiro</h2><ol>${agenda.map((a) => `<li><strong>${esc(a.nav)}</strong> — ${esc(a.text)}</li>`).join('')}</ol></section>`
      + lesson.sections.map((s, i) => `<section class="material-section"><h2>${i + 1}. ${esc(s.title)}</h2><p>${esc(s.text)}</p>${s.diagram ? `<div class="mermaid-wrap medium"><div class="mermaid">${s.diagram}</div></div>` : ''}<h3>Checklist de aplicação</h3><ul>${checklistOf(s)}</ul><div class="material-note"><strong>Erro comum:</strong> ${esc(s.pitfall)}</div></section>`).join('')
      + sdd
      + warmupSection
      + activitySection
      + ((lesson.activity && lesson.activity.slideOnly)
        ? `<section class="material-box"><h2>Entregável e avaliação</h2><p>${esc(lesson.deliverable)}</p><p class="material-note">Os critérios de avaliação são apresentados em sala, junto do enunciado.</p></section>`
        : `<section class="material-box"><h2>Entregável e avaliação</h2><p>${esc(lesson.deliverable)}</p><ul>${evaluationList}</ul></section>`)
      + `<section class="material-box"><h2>Referências</h2><ul>${lesson.references.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section></div>`;
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

    root.innerHTML = `<header class="plan-head"><span>Módulo 11 · Plano de Ensino</span><h1>Aula ${esc(lessonId)} — ${esc(lesson.title)}</h1><p>Professor: ${esc(lesson.professor || DEFAULT_PROF)} · ${esc(lesson.date)}</p></header><main class="plan-body">`
      + fichaEncontro()
      + `<section><h2>Ementa</h2><p>${esc(lesson.subtitle)} ${esc(lesson.objective)}</p></section>`
      + timeboxPlan
      + preClass
      + `<section><h2>Objetivos de aprendizagem</h2><ul>${lesson.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></section>`
      + `<section><h2>Metodologia e cronograma</h2><ol>${agenda.map((a) => `<li><strong>${esc(a.nav)}:</strong> ${esc(a.text)}</li>`).join('')}</ol></section>`
      + sdd
      + warmupPlan
      + activityPlan
      + ((lesson.activity && lesson.activity.slideOnly)
        ? `<section><h2>Avaliação</h2><p>${esc(lesson.deliverable)}</p><p>Os critérios de avaliação são apresentados em sala, junto do enunciado.</p></section>`
        : `<section><h2>Avaliação</h2><p>Entrega individual ou em grupo do artefato descrito no material, com apresentação curta e revisão por pares. ${esc(lesson.deliverable)}</p><ul>${evaluationList}</ul></section>`)
      + `<section><h2>Bibliografia</h2><ul>${lesson.references.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section></main>`;
  };
})();
