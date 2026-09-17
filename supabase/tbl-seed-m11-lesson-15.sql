-- =====================================================================
-- TBL — Módulo 11 · Engenharia de Software · Aula 15 (21/09/2026)
-- Caso: a perda silenciosa de dados num armazém analítico
--
-- Um caso único percorrido por cinco questões, uma para cada decisão que
-- a observabilidade de um pipeline impõe: o que medir, como registrar a
-- execução, como detectar a anomalia, como alertar e quanto de telemetria
-- guardar. Cada questão apresenta quatro táticas com ganho e custo
-- declarados, e nenhuma é correta: cada uma responde a uma classe de
-- falha e é cega diante de outra.
--
-- A terceira questão traz um dado novo, liberado apenas quando a discussão
-- é aberta: a distribuição da perda entre as lojas desloca o critério de
-- decisão sem alterar as alternativas.
--
-- Os textos usam dollar-quoting ($txt$, $json$) porque o caso menciona
-- "marca d'água" — com aspas simples o apóstrofo encerraria o literal.
--
-- Antes de aplicar, substitua __TBL_HOST_TOKEN__ pelo valor de
-- QUIZ_HOST_TOKEN do .env. O arquivo é idempotente.
-- =====================================================================

begin;

insert into tbl_sessions (slug, titulo)
values ('m11-es-a15-observabilidade-2026-2a',
        'TBL — A carga que termina bem e entrega dado incompleto')
on conflict (slug) do update set titulo = excluded.titulo;

insert into tbl_host_tokens (session_slug, token)
values ('m11-es-a15-observabilidade-2026-2a', '__TBL_HOST_TOKEN__')
on conflict (session_slug) do update set token = excluded.token;

-- ---------------------------------------------------------------------
-- O contexto comum das cinco questões
-- ---------------------------------------------------------------------
insert into tbl_casos (session_slug, caso_titulo, caso_texto, contexto)
values (
  'm11-es-a15-observabilidade-2026-2a',
  'As quarenta e uma noites em que a carga terminou bem',
  $txt$A rede opera **380 lojas de material de construção em 14 estados** e centraliza a venda de todas elas num armazém analítico. A carga noturna lê os registros de venda loja a loja de forma incremental, pela marca d'água do campo `atualizado_em`: cada execução busca o que é posterior à maior marca já processada daquela loja e, ao terminar, avança a marca. O armazém alimenta quatro consumidores — a **sugestão de reposição** que cada loja recebe às 6h, o **painel de margem** da diretoria, o **cálculo da comissão** dos vendedores e a **apuração fiscal** conferida pela auditoria externa.

A falha apareceu pela loja, e não pela plataforma. Em 12 de agosto a gerente da unidade de Caruaru registrou que o sistema havia sugerido **reposição de 40 sacos de cimento para uma semana em que a loja vendia 300**, e que a ruptura já durava seis dias. Nenhum alerta havia sido emitido: **as 41 execuções noturnas anteriores concluíram com sucesso**, dentro do tempo habitual, sem erro registrado e sem nenhuma linha rejeitada.

A causa imediata foi localizada em quatro dias. O ponto de venda das lojas foi migrado para uma versão que grava `atualizado_em` em **UTC**, e não mais no horário local — mas **os terminais de autoatendimento não entraram na migração e continuaram gravando em horário local**. Como a marca d'água avança para o maior valor visto, e o servidor da loja passou a emitir valores três horas à frente, **os registros dos terminais ficam permanentemente atrás da marca e nunca são lidos**. A perda é maior à noite, quando o autoatendimento concentra o movimento. A migração correu **loja a loja ao longo de sete semanas**, de modo que o início da perda é diferente em cada unidade.

O que a equipe não conseguiu determinar é a extensão. **O orquestrador registra de cada execução apenas o desfecho e a duração** — não há contagem de linhas lidas, escritas ou rejeitadas, nem o valor da marca d'água aplicada. **O registro detalhado tem retenção de 14 dias**, e o período suspeito é anterior. A tabela do armazém guarda a data da venda, **e não a data em que a linha chegou**, de modo que não há como distinguir a linha que nunca veio daquela que veio atrasada. O ponto de venda de origem **descarta o detalhe após 60 dias**, e parte da janela já expirou. Por fim, **duas pessoas executaram reprocessamentos manuais em intervalos sobrepostos e não registrados**, e hoje não se sabe se uma lacuna é original ou remanescente de uma correção parcial.

As consequências saíram do perímetro da plataforma. A comissão de agosto foi paga sobre o número do armazém: **R$ 2,8 milhões distribuídos sobre uma base que se sabe incompleta e não se sabe em quanto**. O painel de margem foi apresentado ao conselho. A auditoria externa **encerra o exercício em cinco semanas** e formulou por escrito a pergunta que a equipe ainda não respondeu: **quais dias, quais lojas e qual volume**. A estimativa de venda perdida por ruptura está entre **R$ 4 milhões e R$ 19 milhões**, e a própria estimativa depende do dado que falta.

A equipe de plataforma tem **cinco pessoas e um trimestre**. O armazém já responde por 31% do custo de nuvem da rede, e a diretoria de tecnologia condicionou qualquer instrumentação nova a **não elevar esse custo em mais de 8%**. Restam **outros 63 fluxos de carga** na mesma plataforma, construídos pelo mesmo padrão, sobre os quais **nenhuma afirmação pode ser feita hoje**. **As decisões de instrumentação serão tomadas nesta semana.**$txt$,
  $json$[
    {"rotulo":"Execuções sem erro","valor":"41 noites","nota":"desfecho de sucesso, duração habitual, zero linhas rejeitadas"},
    {"rotulo":"Descoberta","valor":"pela gerente da loja","nota":"ruptura de seis dias antes de qualquer sinal da plataforma"},
    {"rotulo":"Comissão já paga","valor":"R$ 2,8 milhões","nota":"sobre base incompleta de extensão desconhecida"},
    {"rotulo":"Prazo da auditoria","valor":"cinco semanas","nota":"pergunta em aberto: quais dias, quais lojas, qual volume"},
    {"rotulo":"Teto de custo","valor":"+8% sobre o armazém","nota":"o armazém já é 31% do custo de nuvem da rede"},
    {"rotulo":"Equipe e alcance","valor":"5 pessoas, um trimestre","nota":"outros 63 fluxos no mesmo padrão, sem afirmação possível"}
  ]$json$::jsonb
)
on conflict (session_slug) do update set
  caso_titulo = excluded.caso_titulo,
  caso_texto  = excluded.caso_texto,
  contexto    = excluded.contexto;

-- ---------------------------------------------------------------------
-- Questão 1 — O que medir
-- ---------------------------------------------------------------------
insert into tbl_questoes (session_slug, ordem, categoria, titulo, pergunta, alternativas)
values (
  'm11-es-a15-observabilidade-2026-2a', 1,
  'O que medir',
  'O indicador que teria falado nas 41 noites',
  $txt$As 41 execuções concluíram com sucesso e nada foi dito. A equipe precisa instalar um primeiro indicador, e o teto de custo não permite instalar os quatro de uma vez. Qual dimensão a equipe instrumenta primeiro?$txt$,
  $json$[
    {
      "letra":"A","titulo":"Completude por partição","tatica":"Contar o que chegou, por loja e por dia",
      "texto":"Cada execução registra a contagem de linhas gravadas por loja e por data de venda, e o valor é comparado à mediana das quatro semanas anteriores no mesmo dia da semana.",
      "ganho":"Enxerga a perda parcial onde ela acontece, na partição, e sobrevive à sazonalidade semanal. É a única dimensão que distingue a loja que vendeu menos daquela cujo dado não chegou.",
      "custo":"Exige uma série de referência que ainda não existe e que levará semanas para acumular. Lojas de movimento baixo produzem variação percentual alta e alarme frequente sem perda real."
    },
    {
      "letra":"B","titulo":"Atualidade do dado","tatica":"Medir a idade do registro mais recente",
      "texto":"Para cada loja, a plataforma mede a diferença entre o instante da carga e a venda mais recente presente no armazém, e declara um limite de atraso aceitável.",
      "ganho":"É barato, não depende de série histórica e entra em operação na primeira noite. Detecta a loja que parou de enviar e a carga que não rodou.",
      "custo":"Nas 41 noites o servidor da loja continuou entregando venda recente, e a atualidade estaria dentro do limite enquanto os terminais eram descartados. Mede se algo chegou, não se chegou tudo."
    },
    {
      "letra":"C","titulo":"Reconciliação com a origem","tatica":"Conferir contagem e soma na fonte",
      "texto":"Ao fim de cada carga, a plataforma consulta o ponto de venda de cada loja pedindo contagem de registros e soma de valor da janela processada, e compara com o que gravou.",
      "ganho":"Verifica o que se quer afirmar, em vez de inferir a partir do comportamento habitual. Teria detectado a divergência na primeira noite, sem período de aprendizado.",
      "custo":"Impõe 380 consultas adicionais por noite a sistemas de loja dimensionados para a operação, e depende de a origem preservar a janela. Quando a origem já descartou o detalhe, a conferência é impossível."
    },
    {
      "letra":"D","titulo":"Métrica de negócio","tatica":"Deixar o consumidor medir",
      "texto":"A área comercial passa a acompanhar venda por loja e por dia contra a própria previsão, e abre chamado à plataforma quando a diferença ultrapassa a faixa que ela já usa para gerir a rede.",
      "ganho":"Aproveita a referência que a área de negócio já tem e alcança as quatro dimensões de uma vez, porque qualquer causa que altere o número aparece no acompanhamento. Custo de nuvem nulo.",
      "custo":"A detecção depende de alguém olhar, e no caso houve 41 noites até que olhassem. O sinal indica que o número está errado sem indicar por quê, e a plataforma recebe o problema já convertido em cobrança."
    }
  ]$json$::jsonb
)
on conflict (session_slug, ordem) do update set
  categoria = excluded.categoria, titulo = excluded.titulo,
  pergunta = excluded.pergunta, alternativas = excluded.alternativas,
  dado_novo = excluded.dado_novo;

-- ---------------------------------------------------------------------
-- Questão 2 — Registro de execução e linhagem
-- ---------------------------------------------------------------------
insert into tbl_questoes (session_slug, ordem, categoria, titulo, pergunta, alternativas)
values (
  'm11-es-a15-observabilidade-2026-2a', 2,
  'Registro de execução e linhagem',
  'A pergunta da auditoria: quais dias, quais lojas, qual volume',
  $txt$A auditoria encerra o exercício em cinco semanas e quer a extensão da perda. Hoje o orquestrador guarda desfecho e duração, o registro detalhado dura 14 dias e a tabela do armazém não sabe quando cada linha chegou. O que a equipe constrói para que a pergunta seja respondível — desta vez e na próxima?$txt$,
  $json$[
    {
      "letra":"A","titulo":"Registro de execução","tatica":"Gravar o que cada carga fez",
      "texto":"Cada execução passa a gravar uma linha permanente com identificador, janela processada, marca d'água de entrada e de saída, contagem de linhas lidas, gravadas e rejeitadas por loja, e a versão do código que rodou.",
      "ganho":"Torna a execução um fato consultável por SQL. A divergência entre a marca de entrada e a de saída teria exposto o salto de três horas na primeira noite da migração.",
      "custo":"Responde a partir de agora e nada diz sobre as 41 noites já passadas. Exige disciplina para que todo fluxo novo grave o registro, e 63 fluxos precisam ser convertidos um a um."
    },
    {
      "letra":"B","titulo":"Camada bruta imutável","tatica":"Preservar o que chegou, como chegou",
      "texto":"O extrato de cada loja é gravado antes de qualquer transformação, particionado por data de carga e nunca sobrescrito, e a tabela do armazém ganha a coluna que registra em qual carga cada linha entrou.",
      "ganho":"Permite reconstituir qualquer dia recomputando a partir do que de fato chegou, e distingue a linha que nunca veio daquela que veio atrasada. Reprocessamento deixa de depender de a origem ainda ter o dado.",
      "custo":"Duplica o armazenamento do histórico e pressiona o teto de 8%. Preserva o que foi extraído, de modo que o registro do terminal, nunca extraído, continuaria ausente também na camada bruta."
    },
    {
      "letra":"C","titulo":"Linhagem declarada","tatica":"Mapear origem e destino de cada campo",
      "texto":"A plataforma adota uma ferramenta de linhagem que registra, por coluna, de qual sistema e de qual transformação o valor veio, e expõe quais consumidores dependem de cada tabela.",
      "ganho":"Responde imediatamente quais números foram afetados, que é o que a auditoria e o conselho perguntam. A comissão e o painel de margem apareceriam como dependentes no mesmo diagrama.",
      "custo":"Descreve o caminho do dado sem medir o que trafegou por ele: a linhagem estaria correta durante as 41 noites. Ferramenta adicional a operar por uma equipe de cinco pessoas."
    },
    {
      "letra":"D","titulo":"Captura de mudanças na origem","tatica":"Eliminar a marca d'água",
      "texto":"A extração passa a ler o registro de alterações do banco do ponto de venda, com posição de leitura controlada pelo consumidor, em vez de filtrar por um campo de data gravado pela aplicação.",
      "ganho":"Remove a classe inteira de falha: a posição de leitura não depende do relógio da aplicação nem da correção do campo, e nenhum registro é pulado por atraso de horário.",
      "custo":"Depende de acesso ao banco de 380 lojas e de acordo com o fornecedor do ponto de venda, fora do alcance de um trimestre. Continua sem responder o que aconteceu no período já ocorrido."
    }
  ]$json$::jsonb
)
on conflict (session_slug, ordem) do update set
  categoria = excluded.categoria, titulo = excluded.titulo,
  pergunta = excluded.pergunta, alternativas = excluded.alternativas,
  dado_novo = excluded.dado_novo;

-- ---------------------------------------------------------------------
-- Questão 3 — Detecção da anomalia
-- O dado novo é liberado quando a discussão é aberta. A distribuição da
-- perda entre as lojas desqualifica toda vigilância agregada: a perda
-- nacional cabe dentro da variação semanal normal, e só aparece quando
-- se olha a partição.
-- ---------------------------------------------------------------------
insert into tbl_questoes (session_slug, ordem, categoria, titulo, pergunta, alternativas, dado_novo)
values (
  'm11-es-a15-observabilidade-2026-2a', 3,
  'Detecção da anomalia',
  'Contra o que comparar o número desta noite',
  $txt$Medir exige uma referência, e declarar um limite exige aceitar erro dos dois lados: o alerta que não dispara e o alerta que dispara à toa. Qual referência a equipe adota para decidir que a carga desta noite está anômala?$txt$,
  $json$[
    {
      "letra":"A","titulo":"Referência móvel por partição","tatica":"Comparar com o próprio passado recente",
      "texto":"Para cada loja, a contagem da noite é comparada à mediana das quatro ocorrências anteriores do mesmo dia da semana, e a carga é marcada quando cai abaixo de uma fração declarada dessa mediana.",
      "ganho":"Absorve a sazonalidade semanal e o porte de cada loja sem parâmetro por unidade. Detecta queda gradual, que é a forma como a perda apareceu em cada loja migrada.",
      "custo":"A referência é contaminada pela própria perda: depois de quatro semanas com dado incompleto, a mediana desce e o novo patamar passa a ser o normal. A perda instalada aos poucos deixa de ser anomalia."
    },
    {
      "letra":"B","titulo":"Invariante de negócio","tatica":"Afirmar o que sempre deve valer",
      "texto":"A equipe declara asserções que a operação garante — toda loja aberta registra venda em todas as faixas de horário de funcionamento, e a razão entre terminal de autoatendimento e caixa permanece dentro de uma faixa conhecida — e reprova a carga que as viole.",
      "ganho":"Não depende de série histórica nem é corrompida pela perda acumulada, porque o critério vem da regra do negócio. A razão entre terminal e caixa teria ido a zero na primeira noite de cada loja migrada.",
      "custo":"Exige do time de dados conhecimento da operação que hoje está com a área de negócio, e cada asserção envelhece quando a operação muda. Uma loja que de fato encerre o autoatendimento gera reprovação legítima e ruído."
    },
    {
      "letra":"C","titulo":"Reconciliação amostrada","tatica":"Conferir com a origem, mas não tudo",
      "texto":"A cada noite, um subconjunto rotativo de lojas tem contagem e soma conferidas diretamente no ponto de venda, de modo que toda loja seja verificada ao menos uma vez por semana.",
      "ganho":"Verifica o fato em vez de inferir do comportamento, a um fração do custo da conferência integral, e não é corrompida pela perda acumulada.",
      "custo":"Introduz atraso de até sete dias entre a instalação da falha e a noite em que a loja afetada entra na amostra. Uma perda de 3% na loja sorteada pode passar dentro da margem de tolerância da conferência."
    },
    {
      "letra":"D","titulo":"Previsão por modelo","tatica":"Prever o volume esperado",
      "texto":"Um modelo estima o volume esperado por loja e por dia a partir de histórico, calendário, promoção e clima, e a carga é marcada quando a contagem observada fica fora do intervalo previsto.",
      "ganho":"Acomoda feriado, promoção e efeito de clima que a referência móvel simples trata como anomalia, o que reduz o alerta falso nas lojas de comportamento irregular.",
      "custo":"Treinado sobre o histórico existente, aprende o período com perda como normal. A decisão deixa de ser explicável para quem recebe o alerta, e o modelo passa a ser mais um pipeline a monitorar."
    }
  ]$json$::jsonb,
  $json${
    "titulo":"A distribuição da perda entre as lojas",
    "texto":"A reconstituição parcial de 12 noites, feita a partir de extratos que três lojas ainda guardavam, permitiu estimar a perda. No agregado nacional ela é de 1,2% das linhas de venda — dentro da variação semanal que a rede observa entre uma semana e outra, e abaixo de qualquer limite que a equipe declararia para o total. A perda está concentrada em 34 lojas, onde alcança 19% em noites específicas. As quatro alternativas e o teto de custo permanecem os mesmos.",
    "evidencias":[
      "Perda agregada nacional de 1,2% das linhas, contra variação semanal habitual de 3,1% no mesmo indicador.",
      "Em 346 das 380 lojas a perda é inferior a 0,4% e indistinguível do ruído.",
      "Nas 34 lojas afetadas, o autoatendimento responde por 22% a 41% do movimento, contra 6% na mediana da rede.",
      "A perda é nula entre 8h e 17h e concentra-se entre 18h e 22h, quando o autoatendimento absorve a fila do caixa.",
      "O primeiro dia de perda difere em até 47 dias entre a primeira e a última loja migrada.",
      "Nenhum dos quatro consumidores do armazém consulta o dado por loja: todos leem agregados por região ou por rede."
    ],
    "pergunta":"Diante da distribuição, qual referência permanece? Declare se a sua escolha anterior sobrevive a um sinal que não existe no agregado e por quê."
  }$json$::jsonb
)
on conflict (session_slug, ordem) do update set
  categoria = excluded.categoria, titulo = excluded.titulo,
  pergunta = excluded.pergunta, alternativas = excluded.alternativas,
  dado_novo = excluded.dado_novo;

-- ---------------------------------------------------------------------
-- Questão 4 — Alerta e procedimento
-- ---------------------------------------------------------------------
insert into tbl_questoes (session_slug, ordem, categoria, titulo, pergunta, alternativas)
values (
  'm11-es-a15-observabilidade-2026-2a', 4,
  'Alerta e procedimento',
  'O que acontece às 4h quando a verificação reprova',
  $txt$A verificação existe e reprova a carga de 34 lojas às 4h07. A sugestão de reposição sai às 6h, e a equipe de cinco pessoas não tem plantão noturno. O que a plataforma faz com a reprovação?$txt$,
  $json$[
    {
      "letra":"A","titulo":"Reter a publicação","tatica":"Não publicar o que não passou",
      "texto":"A tabela só é promovida para a área que os consumidores leem depois que a verificação aprova. Reprovada, a área permanece com o dado da véspera, marcado como desatualizado, e a reposição roda sobre ele.",
      "ganho":"Nenhum consumidor decide sobre dado que a plataforma sabe estar incompleto, e a comissão não seria paga sobre base defeituosa. O efeito não depende de haver alguém acordado.",
      "custo":"Um falso positivo às 4h paralisa a reposição de 380 lojas, e o dado da véspera também produz sugestão errada. A pressão para publicar assim mesmo recai sobre quem chega de manhã."
    },
    {
      "letra":"B","titulo":"Acionar o plantão","tatica":"Levar a decisão a uma pessoa",
      "texto":"A reprovação aciona o plantão, com procedimento escrito por tipo de reprovação, prazo de resposta e critério declarado para liberar a publicação sob responsabilidade nomeada.",
      "ganho":"Uma pessoa distingue o falso positivo do problema real, o que nenhum limite faz sozinho, e cada acionamento produz um caso documentado que refina o procedimento.",
      "custo":"Exige escala de plantão que cinco pessoas não sustentam, e o acionamento repetido por falso positivo leva ao desligamento informal do alerta, que é como a vigilância morre sem aviso."
    },
    {
      "letra":"C","titulo":"Selo de confiabilidade","tatica":"Declarar o estado ao consumidor",
      "texto":"Cada consumidor passa a receber, junto do número, a cobertura apurada da carga e a lista de lojas em que a verificação reprovou, exibida no painel e anexada ao arquivo da comissão.",
      "ganho":"Transfere a decisão a quem conhece a consequência: a auditoria saberia quais lojas excluir e o painel de margem exibiria a ressalva. Não interrompe a operação de quem pode conviver com a lacuna.",
      "custo":"Depende de o consumidor ler e entender a ressalva, e o histórico do caso mostra 41 noites sem ninguém olhar. Exige alterar os quatro consumidores, três dos quais fora do controle da equipe."
    },
    {
      "letra":"D","titulo":"Corrigir e republicar","tatica":"Reprocessar antes do horário de uso",
      "texto":"A reprovação dispara automaticamente nova extração da janela divergente das lojas afetadas, com segunda verificação, e só aciona pessoa se a divergência persistir depois de duas tentativas.",
      "ganho":"Resolve sozinha a causa transitória, que responde pela maioria das divergências, e chega às 6h com o dado completo sem custo humano.",
      "custo":"É inútil para a falha sistemática do caso, em que reextrair pela mesma marca d'água devolve exatamente a mesma lacuna. A tentativa automática mascara a persistência e atrasa o diagnóstico."
    }
  ]$json$::jsonb
)
on conflict (session_slug, ordem) do update set
  categoria = excluded.categoria, titulo = excluded.titulo,
  pergunta = excluded.pergunta, alternativas = excluded.alternativas,
  dado_novo = excluded.dado_novo;

-- ---------------------------------------------------------------------
-- Questão 5 — Custo e retenção da telemetria
-- ---------------------------------------------------------------------
insert into tbl_questoes (session_slug, ordem, categoria, titulo, pergunta, alternativas)
values (
  'm11-es-a15-observabilidade-2026-2a', 5,
  'Custo e retenção da telemetria',
  'A telemetria é um pipeline, e também tem conta a pagar',
  $txt$Medir por loja, por dia e por faixa de horário nos 64 fluxos produz mais linhas de telemetria do que algumas tabelas do armazém. O teto é de 8% sobre o custo atual, e a auditoria pergunta sobre um período de treze meses. Como a equipe distribui o que pode gastar?$txt$,
  $json$[
    {
      "letra":"A","titulo":"Duas retenções","tatica":"Agregar o antigo, detalhar o recente",
      "texto":"A telemetria detalhada por loja, dia e faixa de horário é mantida por 45 dias; depois disso, permanece apenas o agregado diário por loja, por 25 meses. O detalhe expira, o suficiente para responder a auditoria permanece.",
      "ganho":"Cabe no teto e cobre os treze meses que a auditoria pede. Preserva o grão fino na janela em que o diagnóstico acontece, que é a das primeiras semanas após a falha.",
      "custo":"A pergunta que só o detalhe responde, feita no mês 3, não tem mais resposta — e foi exatamente esse o caso, descoberto 41 noites depois. Escolher o grão do agregado é apostar em quais perguntas virão."
    },
    {
      "letra":"B","titulo":"Cobertura desigual","tatica":"Classificar os fluxos por consequência",
      "texto":"Os 64 fluxos são classificados pelo que o consumidor decide com o número. Os que alimentam dinheiro, regulador e reposição recebem telemetria completa e retenção longa; os demais recebem apenas desfecho e contagem total.",
      "ganho":"Concentra o orçamento onde o erro custa caro e é defensável perante a diretoria, porque a classificação usa o critério que ela própria aplica. Cabe com folga no teto.",
      "custo":"Exige acertar de antemão qual fluxo importa, e o fluxo de venda por loja não parecia crítico até a comissão ser paga sobre ele. Um fluxo de segunda classe vira entrada de um de primeira sem que a classificação acompanhe."
    },
    {
      "letra":"C","titulo":"Preservar o dado, não a medida","tatica":"Recomputar em vez de guardar",
      "texto":"Em vez de telemetria detalhada, a equipe preserva a camada bruta particionada por data de carga, e os indicadores passam a ser calculados por consulta sobre ela quando alguém pergunta.",
      "ganho":"Responde perguntas que não foram previstas, porque o dado original continua disponível e qualquer indicador novo pode ser calculado sobre o passado inteiro.",
      "custo":"Sem indicador materializado não há vigilância contínua: alguém precisa fazer a pergunta, e no caso ninguém fez por 41 noites. O armazenamento bruto de treze meses tensiona o teto mais que a telemetria agregada."
    },
    {
      "letra":"D","titulo":"Pagar com o que já se gasta","tatica":"Financiar pela redução do próprio armazém",
      "texto":"A equipe audita as tabelas existentes, descarta as que nenhum consumidor consultou nos últimos seis meses e aplica a economia na telemetria completa dos 64 fluxos, mantendo o custo total inalterado.",
      "ganho":"Instala a instrumentação sem negociar teto e corrige em paralelo o desperdício que produziu o teto. A auditoria de consumo produz o mapa de dependências que hoje não existe.",
      "custo":"A economia é de tamanho desconhecido antes da auditoria, e o trabalho consome parte do trimestre que a equipe tem para instrumentar. Descartar tabela por ausência de consulta recente arrisca remover o que a auditoria pede a cada treze meses."
    }
  ]$json$::jsonb
)
on conflict (session_slug, ordem) do update set
  categoria = excluded.categoria, titulo = excluded.titulo,
  pergunta = excluded.pergunta, alternativas = excluded.alternativas,
  dado_novo = excluded.dado_novo;

-- Remove questões de uma carga anterior que excedam a sequência atual.
delete from tbl_questoes
 where session_slug = 'm11-es-a15-observabilidade-2026-2a' and ordem > 5;

-- Impede publicar a sala com o token de exemplo. O literal é partido
-- para sobreviver à própria substituição.
do $$
begin
  if exists (select 1 from tbl_host_tokens
              where session_slug = 'm11-es-a15-observabilidade-2026-2a'
                and token = '__TBL_' || 'HOST_TOKEN__') then
    raise exception 'Defina o token do professor antes de criar a sala.';
  end if;
end $$;

commit;
