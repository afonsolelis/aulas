# Base de estudos do professor - Módulo 9 (Sistemas de Informação)

Este documento organiza o roteiro do professor para as aulas 1, 2 e 3.
Para cada slide: objetivo, como conduzir e notas práticas.

## Aula 1 - Setup de Máquina + Discovery de Dados

### Slide 1 - Capa (Setup de Máquina + Discovery de Dados)
Objetivo: apresentar o foco da aula e alinhar expectativas.
Como conduzir: contextualize que esta é a base técnica para o resto do módulo.
Notas do professor: reforce que a padronização do ambiente reduz retrabalho do time.

### Slide 2 - Agenda do Dia
Objetivo: dividir o tempo entre setup e discovery.
Como conduzir: detalhe o tempo esperado para cada bloco.
Notas do professor: lembre sobre a observação da daily fora do horário de instrução.

### Slide 3 - Objetivos da Aula
Objetivo: deixar claro o que precisa sair pronto ao final.
Como conduzir: leia os itens e confirme que todos entendem a diferença entre SDK e runtime.
Notas do professor: use o link de C# como referência para quem estiver travado no básico.

### Slide 4 - Checklist de Setup
Objetivo: evitar erros comuns antes da instalação.
Como conduzir: peça para os alunos rodarem os comandos e verificarem o ambiente.
Notas do professor: passe pela sala para checar erros de PATH e permissões.

### Slide 5 - SDK vs Runtime
Objetivo: explicar o que é necessário para desenvolver.
Como conduzir: destaque o resumo final do slide e dê exemplos práticos.
Notas do professor: use a frase “sem SDK você não compila, sem runtime você não executa”.

### Slide 6 - Compilada vs Interpretada
Objetivo: explicar o fluxo de execução do C#.
Como conduzir: desenhe o caminho C# -> IL -> CLR -> código nativo.
Notas do professor: conecte com performance e portabilidade.

### Slide 7 - Instalação do DotNet (Windows)
Objetivo: ensinar o caminho recomendado no Windows.
Como conduzir: peça para quem usa Windows seguir o passo a passo e validar a versão.
Notas do professor: reforçar reabrir o terminal após instalar.

### Slide 8 - DotNet no Windows (Troubleshooting)
Objetivo: resolver problemas comuns no Windows.
Como conduzir: explique o que “where dotnet” e “dotnet --info” revelam.
Notas do professor: se houver versão errada, recomende desinstalar versões antigas.

### Slide 9 - Instalação do DotNet (macOS via Homebrew)
Objetivo: instalação rápida no macOS.
Como conduzir: enfatize atualizar o brew antes de instalar.
Notas do professor: lembrar Apple Silicon sem Rosetta.

### Slide 10 - Instalação do DotNet (macOS via .pkg)
Objetivo: alternativa para quem não usa brew.
Como conduzir: oriente sobre chip correto e validar com dotnet --info.
Notas do professor: destaque que o link é oficial.

### Slide 11 - Instalação do DotNet (Linux Ubuntu/Debian)
Objetivo: instalação via APT.
Como conduzir: explique o passo do repositório da Microsoft e a remoção de versões antigas.
Notas do professor: ressalte que precisa de permissão sudo.

### Slide 12 - Instalação do DotNet (Linux Fedora)
Objetivo: instalação via DNF.
Como conduzir: destacar o comando direto e a verificação com dotnet --version.
Notas do professor: reforçar que outras distros exigem doc oficial.

### Slide 13 - Criando Projeto Blazor
Objetivo: criar o projeto base da disciplina.
Como conduzir: rodar o template e explicar os modos do Blazor.
Notas do professor: escolha do Blazor Web App + SSR como padrão.

### Slide 14 - Como o SSR Funciona
Objetivo: explicar o fluxo de renderização do Blazor.
Como conduzir: caminhe pelo diagrama de 1 a 5.
Notas do professor: enfatize a diferença entre HTML inicial e hidratação.

### Slide 15 - Atividade do Grupo
Objetivo: garantir versionamento do projeto no repositório do grupo.
Como conduzir: guie o passo a passo de git clone, dotnet new e commit.
Notas do professor: confirmar que o projeto está na raiz do repo.

### Slide 16 - Checklist Pós-Instalação
Objetivo: smoke test do ambiente.
Como conduzir: pedir para cada grupo rodar os comandos e validar o console app.
Notas do professor: se alguém falhar, revisar PATH e versões instaladas.

### Slide 17 - Anatomia de um Projeto Blazor WebApp
Objetivo: explicar a estrutura da solution.
Como conduzir: mostre a árvore e explique responsabilidades de cada projeto.
Notas do professor: reforçar a cadeia de dependências e separação de camadas.

### Slide 18 - Virtualização e Containers
Objetivo: diferenciar VM de container e por que isso importa.
Como conduzir: explique imagem vs container e o papel do Docker Compose.
Notas do professor: conecte com “ambiente idêntico para o time”.

### Slide 19 - Instalação do Docker
Objetivo: padronizar o setup Docker por SO.
Como conduzir: orientar instalação e verificar versões.
Notas do professor: Linux usa Docker Engine, não Docker Desktop.

### Slide 20 - Discovery de Dados com IA (Antigravity)
Objetivo: introduzir o uso do editor com IA para discovery.
Como conduzir: explique o que é o Antigravity e seu papel no módulo.
Notas do professor: alinhar que o uso é para acelerar entendimento de dados.

### Slide 21 - Discovery em Arquivos
Objetivo: demonstrar a análise de dados locais via IA.
Como conduzir: usar o prompt de exemplo e explicar o que esperar da análise.
Notas do professor: incentive os grupos a adaptar o prompt ao dataset real.

### Slide 22 - Discovery em Banco de Dados (Postgres do Inteli)
Objetivo: conectar ao banco central do Inteli.
Como conduzir: passar host, porta, DB, usuário e senha.
Notas do professor: lembrar que só funciona na rede do Inteli.

### Slide 23 - Explorando o Schema
Objetivo: fazer discovery manual por SQL.
Como conduzir: explicar as queries de information_schema.
Notas do professor: mostre como identificar tabelas candidatas ao domínio.

### Slide 24 - Repositório de Estudo
Objetivo: indicar referência para estudo antecipado.
Como conduzir: abrir o repositório e mostrar rapidamente a estrutura.
Notas do professor: incentivar leitura fora de sala.

### Slide 25 - Mão na Massa
Objetivo: fechar a aula com execução prática.
Como conduzir: listar o que precisa estar concluído.
Notas do professor: acompanhar quem não concluiu o setup.

## Aula 2 - Arquitetura de Software com UML

### Slide 1 - Capa (Arquitetura: O Peso da Decisão)
Objetivo: posicionar a aula como estratégica.
Como conduzir: explicar que arquitetura é custo e compromisso de longo prazo.
Notas do professor: alinhar que foco é decisão, não ferramenta.

### Slide 2 - Agenda
Objetivo: mostrar os blocos principais da aula.
Como conduzir: apresentar a evolução de estilos arquiteturais.
Notas do professor: destaque que haverá conexão com EDA e Kafka.

### Slide 3 - Arquitetura: O Peso da Decisão
Objetivo: introduzir trade-offs e custos.
Como conduzir: comentar os conflitos clássicos e o exemplo de acoplamento forte.
Notas do professor: peça exemplos reais de trade-off dos alunos.

### Slide 4 - ATAM: Validando Arquiteturas
Objetivo: apresentar o ATAM como método formal.
Como conduzir: explique conceitos e as quatro fases.
Notas do professor: mostre que arquitetura se valida com cenários.

### Slide 5 - ATAM: Utility Tree
Objetivo: ensinar priorização de atributos de qualidade.
Como conduzir: explicar a árvore e o significado de (H, M).
Notas do professor: peça aos alunos um exemplo de cenário (H, H).

### Slide 6 - Analisando Decisões (Sensitivity e Trade-off)
Objetivo: mostrar como uma decisão afeta atributos.
Como conduzir: comparar criptografia forte x latência.
Notas do professor: reforçar que trade-off não é erro, é escolha.

### Slide 7 - Análise de Riscos
Objetivo: classificar decisões como risco ou não-risco.
Como conduzir: usar os exemplos e conectar com backlog técnico.
Notas do professor: destacar que risco vira item de ação.

### Slide 8 - RM-ODP: Enterprise Viewpoint
Objetivo: explicar visão de negócio.
Como conduzir: explorar perguntas-chave de escopo e valor.
Notas do professor: conectar com o projeto do módulo.

### Slide 9 - RM-ODP: Information Viewpoint
Objetivo: mostrar semântica e estrutura dos dados.
Como conduzir: reforçar que é o modelo conceitual do domínio.
Notas do professor: usar exemplos simples de entidades.

### Slide 10 - RM-ODP: Computational Viewpoint
Objetivo: decompor o sistema em objetos funcionais.
Como conduzir: explicar interfaces e interação entre componentes.
Notas do professor: destacar que ainda não é decisão de infra.

### Slide 11 - RM-ODP: Engineering Viewpoint
Objetivo: discutir distribuição física.
Como conduzir: falar sobre clusterização, latência e replicação.
Notas do professor: conecte com custos e resiliência.

### Slide 12 - RM-ODP: Technology Viewpoint
Objetivo: traduzir visão para tecnologia concreta.
Como conduzir: exemplificar stack e versão como decisão final.
Notas do professor: tecnologia é consequência, não premissa.

### Slide 13 - RM-ODP: Fluxo de Decisão
Objetivo: amarrar as visões no fluxo completo.
Como conduzir: caminhar do business até a implementação.
Notas do professor: reforçar que o caminho é top-down.

### Slide 14 - Business Drivers
Objetivo: explicar forças que definem arquitetura.
Como conduzir: usar os quatro exemplos e relacionar com trade-offs.
Notas do professor: peça aos alunos apontarem drivers do projeto.

### Slide 15 - Personas & Perfil de Carga
Objetivo: mostrar impacto da persona na arquitetura.
Como conduzir: comparar Dona Maria x Day Trader.
Notas do professor: conectar persona com NFR de latência.

### Slide 16 - Use Cases
Objetivo: definir casos de uso como histórias do sistema.
Como conduzir: narrar o exemplo “Comprar Ação”.
Notas do professor: evitar confusão com fluxo de processo.

### Slide 17 - Anatomia do UML de Casos de Uso
Objetivo: ensinar elementos e relacionamentos.
Como conduzir: explique include, extend e generalização.
Notas do professor: reforçar o que é obrigatório vs opcional.

### Slide 18 - Exemplo Completo de Casos de Uso
Objetivo: visualizar um diagrama completo.
Como conduzir: passe pelo diagrama e depois pela legenda.
Notas do professor: reforçar que use case não é fluxograma.

### Slide 19 - Do Use Case ao Requisito
Objetivo: transformar narrativa em requisitos técnicos.
Como conduzir: converter um passo em RFs.
Notas do professor: enfatizar que requisito é binário.

### Slide 20 - Requisitos Não Funcionais
Objetivo: mostrar que NFR é a pergunta de engenharia.
Como conduzir: explorar as perguntas que definem capacidade.
Notas do professor: conectar com custo e risco.

### Slide 21 - Transforme Opinião em Métrica
Objetivo: ensinar a escrever NFR mensurável.
Como conduzir: contrastar “antes” e “depois”.
Notas do professor: peça um exemplo dos alunos.

### Slide 22 - Checklist de NFRs
Objetivo: listar dimensões que impactam arquitetura.
Como conduzir: passe por desempenho, disponibilidade, segurança e observabilidade.
Notas do professor: explique p95, MTTR, RPO e RTO.

### Slide 23 - Visão de Engenharia e Modelagem Estática
Objetivo: ligar requisitos a estrutura estática.
Como conduzir: mostrar que classes validam arquitetura.
Notas do professor: reforçar que diagrama é antes de codar.

### Slide 24 - Diagrama de Classes: Fundamentos
Objetivo: ensinar o passo a passo do diagrama.
Como conduzir: explique cada item da lista e a legenda.
Notas do professor: evitar excesso de classes sem requisito.

### Slide 25 - Exemplo de Diagrama de Classes
Objetivo: consolidar a leitura do diagrama.
Como conduzir: apontar relações e multiplicidades.
Notas do professor: usar o exercício do carrinho.

### Slide 26 - Visão de Tecnologia
Objetivo: critérios objetivos para escolher stack.
Como conduzir: relacionar decisão com risco técnico.
Notas do professor: tecnologia é meio, não fim.

### Slide 27 - Stack do Módulo (C# + Blazor)
Objetivo: justificar o stack da disciplina.
Como conduzir: explicar benefícios de C# e Blazor.
Notas do professor: conectar com produtividade e real-time.

### Slide 28 - Modelagem Dinâmica
Objetivo: introduzir diagrama de sequência.
Como conduzir: mostrar que representa fluxo e latência.
Notas do professor: reforçar complementaridade com classes.

### Slide 29 - Exemplo UML de Sequência
Objetivo: mostrar fluxo de login e dashboard.
Como conduzir: caminhar passo a passo no diagrama.
Notas do professor: perguntar onde colocar cache.

### Slide 30 - Transição para Arquitetura em Camadas
Objetivo: preparar para o N-Tier.
Como conduzir: explicar o objetivo do desacoplamento.
Notas do professor: mostrar que é base para manutenção.

### Slide 31 - Arquitetura em Camadas (N-Tier)
Objetivo: detalhar camadas e regra de ouro.
Como conduzir: mostrar fluxo de chamadas entre camadas.
Notas do professor: enfatizar “UI nunca acessa banco direto”.

### Slide 32 - SOA: A Arquitetura Enterprise
Objetivo: introduzir SOA e ESB.
Como conduzir: explicar o problema dos silos e o ESB como solução.
Notas do professor: destacar ponto único de falha do ESB.

### Slide 33 - SOA: Quando faz sentido
Objetivo: identificar cenários de uso.
Como conduzir: apresentar sinais de necessidade.
Notas do professor: reforçar reuso e contratos.

### Slide 34 - SOA no nosso Dashboard
Objetivo: aplicar SOA ao caso do módulo.
Como conduzir: relacionar serviços com dashboard.
Notas do professor: explique composição de dados no front.

### Slide 35 - SOA vs EDA
Objetivo: comparar request/response com eventos.
Como conduzir: mostrar a regra prática do slide.
Notas do professor: reforçar consistência eventual em EDA.

### Slide 36 - Transição para Eventos e Holons
Objetivo: preparar para EDA.
Como conduzir: alinhar que o sistema reagirá a eventos.
Notas do professor: criar expectativa para Kafka.

### Slide 37 - Holons & EDA
Objetivo: explicar coreografia vs orquestração.
Como conduzir: destacar autonomia e redução de gargalos.
Notas do professor: relacione com times independentes.

### Slide 38 - EDA: Modelagem Estática
Objetivo: mostrar onde o evento nasce.
Como conduzir: apontar entidades que geram eventos.
Notas do professor: peça para alunos sugerirem eventos do domínio.

### Slide 39 - EDA: Modelagem Dinâmica
Objetivo: mostrar propagação de eventos.
Como conduzir: caminhar pelo diagrama de sequência.
Notas do professor: discutir latência e pontos de falha.

### Slide 40 - EDA: Modelar antes de construir
Objetivo: reforçar a importância da modelagem.
Como conduzir: comparar cenários com e sem modelagem.
Notas do professor: conectar com observabilidade.

### Slide 41 - Apache Kafka
Objetivo: apresentar Kafka como log distribuído.
Como conduzir: explicar retenção e consumer groups.
Notas do professor: comparar com filas tradicionais.

### Slide 42 - Kafka Producer em C#
Objetivo: mostrar como publicar eventos.
Como conduzir: explicar o caminho do evento e o código.
Notas do professor: enfatizar que publish é assíncrono.

### Slide 43 - Kafka Consumer em C#
Objetivo: mostrar consumo e processamento.
Como conduzir: explicar groupId e autoOffsetReset.
Notas do professor: falar sobre idempotência e reprocessamento.

### Slide 44 - Blazor e Eventos
Objetivo: mostrar atualização em tempo real.
Como conduzir: explicar o caminho Kafka -> SignalR -> Blazor.
Notas do professor: destaque o StateHasChanged.

### Slide 45 - Desafio Hard
Objetivo: provocar pesquisa e aplicação.
Como conduzir: dividir os tópicos e dar 15 minutos.
Notas do professor: cobrar desenho do fluxo de atualização sem F5.

### Slide 46 - Referências & Next Steps
Objetivo: indicar leitura para aprofundar.
Como conduzir: destacar os três livros e sugerir escolha por interesse.
Notas do professor: explicar por que são referências de mercado.

## Aula 3 - SQL Avançado, Segurança e Modelagem para NoSQL

### Slide 1 - Capa (SQL Avançado e Segurança)
Objetivo: apresentar os tópicos principais e o foco técnico da aula.
Como conduzir: explique que a aula conecta fundamentos de SQL com performance, segurança e decisões de modelagem.
Notas do professor:
- Reforce que é um bloco técnico, mas com impacto direto no negócio.
- Diga que o fechamento será sobre modelagem de dados (SQL ou NoSQL).

### Slide 2 - Agenda da Aula
Objetivo: mostrar a sequência de temas e preparar o ritmo.
Como conduzir: passe rapidamente por cada item e sinalize o bloco final de modelagem para NoSQL.
Notas do professor:
- Mostre que o conteúdo é progressivo: SQL → performance → segurança → modelagem.
- Confirme com a turma que todos conhecem DDL/DML antes de avançar.

### Slide 3 - Como o SQL funciona
Objetivo: explicar o pipeline de execução do SQL.
Como conduzir: aponte Cliente → Parser → Optimizer → Executor → Resultado.
Notas do professor:
- Destaque que o optimizer decide o caminho, por isso índices importam.
- Conecte com o que será visto no slide de performance.

### Slide 4 - Categorias do SQL
Objetivo: revisar DDL, DML, DCL e TCL.
Como conduzir: associe cada categoria ao tipo de ação no banco.
Notas do professor:
- Use exemplos rápidos: CREATE é DDL, SELECT é DML, GRANT é DCL, COMMIT é TCL.
- Pergunte se alguém confundiu DCL com TCL em projetos anteriores.

### Slide 5 - DDL
Objetivo: mostrar criação e alteração de estrutura.
Como conduzir: caminhe pelo exemplo, destacando PK, UNIQUE e FK.
Notas do professor:
- Enfatize integridade referencial como regra de negócio no banco.
- Explique que DDL muda estrutura, não conteúdo.

### Slide 6 - DML
Objetivo: mostrar operações CRUD e consultas.
Como conduzir: compare operações básicas com a query agregada.
Notas do professor:
- Explique quando usar GROUP BY, HAVING e ORDER BY.
- Mostre que SELECT é o centro da leitura e performance.

### Slide 7 - Performance: Índices e Planos
Objetivo: explicar impacto de índices e leitura de planos.
Como conduzir: fale sobre B-Tree e trade-off escrita x leitura.
Notas do professor:
- Mostre que índice acelera busca, mas torna INSERT/UPDATE mais caros.
- Explique que EXPLAIN ANALYZE mostra como o banco executa.

### Slide 8 - Views e Triggers
Objetivo: apresentar objetos além de tabelas.
Como conduzir: dê exemplos práticos de uso.
Notas do professor:
- Views ajudam leitura e segurança, mas podem esconder custo.
- Triggers automatizam, mas podem gerar “lógica invisível”.

### Slide 9 - DCL e TCL (ACID)
Objetivo: revisar transações e propriedades ACID.
Como conduzir: leia as quatro propriedades e mostre o exemplo de transferência.
Notas do professor:
- Destaque que ACID é garantia para operações críticas (financeiro, estoque).
- Explique diferença entre COMMIT e ROLLBACK.

### Slide 10 - .NET + Dapper
Objetivo: introduzir Dapper como micro-ORM.
Como conduzir: explique que Dapper é rápido e usa SQL direto.
Notas do professor:
- Dapper dá controle e performance, mas exige cuidado com SQL.
- Contextualize: ideal para o projeto do módulo.

### Slide 11 - SQL Injection (Perigo)
Objetivo: demonstrar vulnerabilidade clássica.
Como conduzir: mostre o exemplo e explique como o banco interpreta a string.
Notas do professor:
- Use o exemplo de input malicioso para mostrar impacto real.
- Deixe claro: isso é falha crítica de segurança.

### Slide 12 - Parameterized Queries (Solução)
Objetivo: ensinar a prática segura.
Como conduzir: explique separação entre SQL e dados.
Notas do professor:
- Reforce que é obrigatório em código de produção.
- Mostre que o banco trata input como dado literal.

### Slide 13 - Dapper CRUD
Objetivo: mostrar operações básicas em C#.
Como conduzir: explique Query/Execute e o mapeamento de objetos.
Notas do professor:
- Mostre diferença entre QueryFirstOrDefault e ExecuteAsync.
- Conecte com o uso de parâmetros.

### Slide 14 - Dapper Avançado
Objetivo: mostrar transações e multi-mapping.
Como conduzir: explique o uso de transação e o splitOn.
Notas do professor:
- Diga quando usar joins com multi-mapping.
- Mostre que transação garante consistência no código.

### Slide 15 - Além do ER (Modelo Corporativo)
Objetivo: ampliar a visão da modelagem para o negócio.
Como conduzir: explique as camadas (contextual → físico).
Notas do professor:
- Enfatize “ativos de informação” e não “tabelas”.
- Aponte o erro comum: pular direto para o físico.

### Slide 16 - Monolito vs Bounded Contexts
Objetivo: introduzir DDD e contextos limitados.
Como conduzir: use o exemplo de “Produto” em áreas diferentes.
Notas do professor:
- Explique por que o modelo único global falha.
- Cite ACL como forma de integrar sem contaminar modelos.

### Slide 17 - Governança e Stewardship
Objetivo: mostrar papéis e práticas de governança.
Como conduzir: explique data steward, dicionário e lineage.
Notas do professor:
- Reforce que governança habilita self-service, não bloqueia.
- Exemplifique com “o que é churn?” em áreas diferentes.

### Slide 18 - Padrões Modernos: Mesh & Vault
Objetivo: apresentar Data Mesh e Data Vault 2.0.
Como conduzir: faça uma explicação leve e comparativa.
Notas do professor:
- Data Mesh = dados como produto por time.
- Data Vault = histórico e auditoria para DW.

### Slide 19 - Dicas de Arquiteto
Objetivo: consolidar boas práticas de modelagem e arquitetura.
Como conduzir: leia os pontos e dê exemplos rápidos.
Notas do professor:
- “Modele capacidades, não telas” é a frase-chave.
- Cite schema as code como prática obrigatória.

### Slide 20 - NoSQL Orientado a Agregados: O Porquê
Objetivo: justificar agregados para NoSQL.
Como conduzir: explique “tudo que muda junto, fica junto”.
Notas do professor:
- Mostre que NoSQL favorece fluxo de negócio e escala.
- Explique que agregado é unidade de consistência.

### Slide 21 - Mapeamento Lógico → NoSQL (Passo a Passo)
Objetivo: ensinar o processo de mapeamento.
Como conduzir: passe pelos 4 passos e exemplifique com “Pedido”.
Notas do professor:
- Reforce: consultas definem o formato do dado.
- Duplicação controlada é aceitável no NoSQL.

### Slide 22 - Exemplo: Agregado Pedido
Objetivo: mostrar documento NoSQL concreto.
Como conduzir: compare com uma modelagem relacional com joins.
Notas do professor:
- Explique o ganho de leitura única.
- Diga que atendimento e operações se beneficiam disso.

### Slide 23 - Tradeoffs & Regras de Ouro
Objetivo: mostrar limites do NoSQL.
Como conduzir: fale de consistência eventual e duplicação.
Notas do professor:
- Destaque que relatórios complexos vão para Analytics.
- Reforce: um agregado = uma transação.

### Slide 24 - Desafio Final
Objetivo: direcionar a atividade de modelagem.
Como conduzir: orientar modelagem macro do dado em SQL ou NoSQL e finalizar em sala.
Notas do professor:
- Reforce que há Postgres disponível para quem escolher SQL.
- Cada grupo deve apresentar sua modelagem macro (entidades e relações principais).
