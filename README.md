# Aulas · Prof. Afonso Brandão · Inteli

Este repositório reúne o material didático que o professor Afonso Brandão usa no Inteli: slides, materiais de leitura, planos de ensino, laboratórios, atividades em sala e palestras. Na graduação, os cursos atendidos são Sistemas de Informação, Engenharia de Software, Administração Tech e o Ciclo Comum do ano integrado. Fora dela, o acervo atende à Educação Executiva, com turmas abertas e programas fechados para empresas, e às palestras, oficinas e masterclasses dadas em eventos. O mesmo código que está aqui é publicado como portal em **[afonsolelis.github.io/aulas](https://afonsolelis.github.io/aulas/)**, de modo que cada alteração na `main` chega aos estudantes alguns minutos depois.

O acervo muda toda semana, conforme as aulas são preparadas, revistas ou reorganizadas. Por isso este documento não lista módulos nem aulas. Para encontrar um conteúdo, o caminho é o portal ou o arquivo `index.json`, que descreve cada página com o seu caminho, o tipo, o módulo e um resumo.

## Como o acervo é organizado

A página de entrada leva a um conjunto de homes. Há uma para cada módulo de graduação ativo ou recente, uma para a Educação Executiva (`home-exec.html`), da qual saem as homes dos programas fechados, uma para palestras e eventos (`home-palestras.html`, chamada Diversos no portal) e outras para os autoestudos, o Inteli Camp e a área do professor. A home de cada módulo traz o calendário do trimestre, organizado por sprint e por semana. Cada aula aparece como um card com a data e os artefatos daquele encontro. Um encontro costuma ter três faces que se referem umas às outras. O deck de slides é projetado em sala. O material de leitura desenvolve o mesmo conteúdo em prosa, para estudo antes ou depois da aula. O laboratório, quando existe, é o ambiente em que a demonstração e a atividade acontecem.

Toda página de aula declara o objetivo de aprendizagem, a estratégia adotada e a estrutura do encontro. Esses dados formam uma ficha que fecha o deck e abre o material, e que vem de um único arquivo de configuração. As páginas de leitura têm também um botão de exportação em PDF que gera o arquivo com o nome padronizado pela coordenação, para o repositório institucional de materiais.

O conteúdo destinado ao estudante segue um registro acadêmico. A escrita é explicativa e encadeada, parte do princípio, passa pela justificativa e chega à consequência, e evita a linguagem de rede social. As regras de redação estão nas skills de escrita em `.claude/skills/`.

## Laboratórios

Boa parte das aulas de dados é construída sobre laboratórios que rodam no próprio navegador, sem instalação. O DuckDB e o PostgreSQL são executados em WebAssembly. Os dados de exemplo, pequenos o suficiente para caber no armazenamento local do navegador, ficam na própria página. As instruções executadas pelo estudante são guardadas e refeitas quando a página é recarregada. Cada etapa do laboratório oferece o prompt usado com o agente de código e o SQL de referência daquela etapa, o que permite comparar o resultado obtido com o esperado.

Outras aulas evoluem um pacote Python de referência que automatiza o que foi feito à mão nas aulas anteriores. Esse pacote coleta os dados, carrega a camada de ingestão, constrói a camada gold, verifica a qualidade e publica os relatórios. Cada versão do pacote acrescenta uma camada de engenharia: orquestração, testes, observabilidade, visualização, custo e segurança. Os pacotes ficam dentro da pasta de laboratório da aula, com testes que rodam sem rede e com os números medidos no ensaio registrados no README de cada um.

Nas aulas mais recentes de engenharia de dados, essa evolução também passou para o navegador. O laboratório simula o editor em que o estudante conversa com o agente de código e mostra, etapa por etapa, o pedido feito, os arquivos que o agente produz e a execução resultante. Assim a turma acompanha a construção do pipeline, da coleta na API à execução diária, e depois a orquestração com Prefect, a integração contínua no GitLab do Inteli e a observabilidade com OpenTelemetry, sem precisar instalar nada para entender o que cada camada acrescenta.

Os prompts seguem o formato CREATE, que separa o papel do agente, o pedido, um exemplo, os ajustes, o tipo de saída e as instruções extras. O formato torna explícito o que o agente deve entregar e como o resultado será conferido.

## Educação Executiva e palestras

As turmas de Educação Executiva usam a mesma estrutura de deck e material, com um registro voltado a gestores. Algumas oficinas pedem que os participantes alimentem um assistente de IA com documentos de uma empresa fictícia. Esses kits de PDF são gerados a partir de fontes em Markdown que ficam em `scripts/kit-*/fontes/`, fora do site publicado, e os scripts de cada kit renderizam os PDFs com o Chromium do Playwright. As palestras e masterclasses ficam em `pages/palestras/`, algumas com laboratórios interativos próprios.

## Atividades interativas

Quizzes ao vivo, TBLs, enquetes, painéis de sala e provas usam um banco PostgreSQL exposto por PostgREST numa VPS própria, administrada pelo Coolify. As páginas falam com a API por um cliente pequeno em `js/api_aulas.js`, que reproduz a interface do supabase-js. Como não há canal de tempo real, cada painel consulta o estado da sala a cada segundo. As funções, tabelas e políticas do banco estão em `supabase/`.

O repositório é público, e por isso os enunciados de prova não entram nele. O enunciado de uma prova fica numa tabela sem política de leitura, acessível apenas por uma função que confere o hash do token do professor no momento da projeção. O SQL que alimenta essas tabelas fica numa pasta ignorada pelo git. Enunciados e critérios de atividades ponderadas também são mantidos fora daqui e entregues em sala.

## Design system

As páginas seguem o Design System Inteli v2, definido em `css/inteli-ds.css` e carregado por último em todas elas. A paleta se limita às cores da marca: roxo, verde, coral, três cinzas e branco. Cada curso é identificado por uma dessas cores, aplicada com parcimônia. A tipografia usa Inter no texto e JetBrains Mono nos rótulos, no código e nos números. Os raios variam de zero a seis pixels, e as bordas finas substituem as sombras. Desde novembro de 2026, todas as páginas usam o layout de terminal, com navegação numerada e cards de contorno quadrado: as homes com a classe `tm`, os decks com `tm-deck` e os materiais e planos com `tm-material`. A lista de páginas legadas em `tests/design-system-legado.json` está vazia, e página nova já nasce nesse layout. As regras normativas estão em `specs/design-system.md`, e a vitrine dos componentes está em `pages/design-system.html`.

## Tecnologia

O portal é HTML estático, sem framework e sem etapa de build. Cada deck é um arquivo autônomo com a própria navegação. As bibliotecas externas, quando necessárias, vêm de CDN com a versão fixada. Por esse desenho, o mesmo arquivo funciona aberto do disco, servido localmente e publicado no GitHub Pages, e continua legível daqui a alguns anos sem depender de uma cadeia de ferramentas.

## Qualidade

Cada commit passa por uma suíte de verificações automáticas, executada com Playwright no hook de pre-commit. A suíte lê os arquivos do acervo e confere:

- que os links entre páginas são relativos e apontam para arquivos que existem;
- que as datas das aulas coincidem com o calendário do trimestre;
- que toda página tem rodapé, favicon, ficha do encontro, exportação em PDF nas páginas de leitura e o carregamento correto do design system;
- que toda página traz o indicador da semana do ano, calculada pela norma ISO 8601;
- que nenhuma cor, fonte ou raio fora do padrão foi introduzido;
- que o `index.json` tem exatamente uma entrada por página.

Um validador visual à parte renderiza os decks em 1280×720 e 1920×1080 e aponta o conteúdo que transborda o slide, o espaço vazio em excesso e os erros de console.

## Como rodar localmente

```bash
git clone https://github.com/afonsolelis/aulas.git
cd aulas
python3 -m http.server 8000        # o portal fica em http://localhost:8000
```

Para as verificações:

```bash
npm install
npm test                                        # suíte completa, em poucos segundos
npm run validate:slides -- <caminho-do-deck>    # validação visual de um deck
```

Os laboratórios em Python têm instruções próprias no README de cada pasta `lab/`.

## Fluxo de trabalho

Todo trabalho é feito diretamente na `main`, em commits pequenos, e só entra depois que a suíte passa. Não há branches de feature nem pull requests para o conteúdo do portal.

A publicação no GitHub Pages copia uma lista fixa de itens da raiz: `index.html`, `index.json` e as pastas `pages`, `css`, `js`, `config` e `btg`. Uma pasta nova na raiz só aparece no portal depois de ser acrescentada ao passo de cópia em `.github/workflows/ci-cd.yml`; antes disso, os links para ela dão 404. O detalhamento das convenções para quem edita o acervo, inclusive para agentes de código, está em `CLAUDE.md` e nas regras de `specs/`.

## Uso

O material foi criado pelo professor Afonso Brandão para os cursos do Inteli e está aberto para leitura. Quem quiser reutilizar uma aula, um laboratório ou um trecho de código em outro contexto deve citar a origem.
