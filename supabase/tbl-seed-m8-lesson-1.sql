-- =====================================================================
-- TBL — Módulo 8 · Engenharia de Software · Aula 1 (18/09/2026)
-- Caso: segurança no PIX executado por linguagem natural
--
-- Um caso único percorrido por cinco questões, uma para cada categoria de
-- exceção fora do caminho feliz: regra de negócio incompleta,
-- infraestrutura, segurança por fraude ou imprecisão, não repúdio e
-- usabilidade. Cada questão apresenta quatro táticas com ganho e custo
-- declarados, e nenhuma é correta: cada uma responde a uma classe de falha
-- e falha diante de outra.
--
-- A terceira questão traz um dado novo, liberado apenas quando a discussão
-- é aberta: a reclassificação das ocorrências reposiciona a origem da
-- perda e desloca o critério de decisão sem alterar as alternativas.
--
-- Antes de aplicar, substitua __TBL_HOST_TOKEN__ pelo valor de
-- QUIZ_HOST_TOKEN do .env. O arquivo é idempotente.
-- =====================================================================

begin;

insert into tbl_sessions (slug, titulo)
values ('m8-es-a01-pix-2026-2a', 'TBL — Exceções fora do caminho feliz no PIX por linguagem natural')
on conflict (slug) do update set titulo = excluded.titulo;

insert into tbl_host_tokens (session_slug, token)
values ('m8-es-a01-pix-2026-2a', '__TBL_HOST_TOKEN__')
on conflict (session_slug) do update set token = excluded.token;

-- ---------------------------------------------------------------------
-- O contexto comum das cinco questões
-- ---------------------------------------------------------------------
insert into tbl_casos (session_slug, caso_titulo, caso_texto, contexto)
values (
  'm8-es-a01-pix-2026-2a',
  'A ordem que o sistema entendeu corretamente',
  'O canal de pagamento por linguagem natural entrou em operação há sete trimestres, em resposta à perda de participação da instituição entre clientes que transferiam valores fora do horário comercial. A instituição mantém **4,2 milhões de contas** e oferece o canal em duas superfícies: o assistente do aplicativo próprio e um canal de mensagens operado por terceiro. O titular enuncia a ordem em texto ou em áudio; o sistema transcreve o enunciado, infere a intenção, extrai valor e destinatário, consulta o diretório de chaves, apresenta a leitura de volta com o nome do beneficiário e executa a transferência mediante confirmação explícita. A adoção superou a projeção do plano de negócio: o canal responde hoje por **23% das transações e por 31% do volume iniciado entre 20h e 6h**, e **a conversão entre a ordem enunciada e a ordem liquidada é de 82%**.

As contestações acompanharam o crescimento. Foram **410 ocorrências no trimestre em que o canal alcançou participação de dois dígitos, 1.130 no seguinte e 1.870 no último**, com **perda de R$ 3,1 milhões e valor médio contestado de R$ 1.658**. A ouvidoria responde a cada contestação em até sete dias úteis e, na ausência de critério técnico que distinga as situações, a instituição vem **ressarcindo parte dos casos por decisão comercial**, o que constitui despesa crescente e sem previsão orçamentária.

A apuração encontra limite no próprio registro. **O registro de contestação admite um único código para situações de natureza distinta**: o enunciado reconhecido de forma incorreta, a chave de destino divergente do beneficiário pretendido e a ordem emitida pelo próprio titular autenticado são arquivados sob a mesma rubrica. A área de risco reconhece que **a decisão de arquitetura seria diferente conforme a origem predominante**, e a revisão individual das 1.870 ocorrências está em curso, sem prazo de conclusão declarado.

O conselho de administração deliberou, na reunião do mês passado, pela **redução de 60% da perda em dois trimestres**. A diretoria de produto sustenta que **a medida não pode reduzir a conversão do canal**, cuja receita incremental financia o programa de modernização da plataforma. A área jurídica registra que o Banco Central exige o registro da transação, mantém o **Mecanismo Especial de Devolução** para os casos contestados e limita o valor das transações noturnas, e que a retenção de gravação e de transcrição observa base legal, finalidade e prazo declarados perante a Lei Geral de Proteção de Dados Pessoais.

A equipe responsável pela plataforma de pagamentos dispõe de **um trimestre para implantar as respostas, com sete pessoas alocadas** e sem previsão de contratação. Cada exceção que o canal expõe — a regra de negócio que não previu a combinação de condições, a falha de infraestrutura que duplica a ordem, a fraude que se aproveita do comportamento correto do sistema, a impossibilidade de reconstituir a ordem contestada e a confirmação que o titular executa sem conferir — admite mais de uma resposta de engenharia, e **cada resposta impõe um custo distinto ao cliente legítimo, à operação ou à instituição**. **As decisões de arquitetura serão tomadas nesta semana**.',
  '[
    {"rotulo":"Participação do canal","valor":"23% das transações","nota":"31% do volume entre 20h e 6h"},
    {"rotulo":"Perda no trimestre","valor":"R$ 3,1 milhões","nota":"1.870 ocorrências contestadas"},
    {"rotulo":"Meta do conselho","valor":"−60% em dois trimestres","nota":"sem queda de conversão"},
    {"rotulo":"Valor médio contestado","valor":"R$ 1.658","nota":"conversão do canal em 82%"},
    {"rotulo":"Janela de implantação","valor":"um trimestre","nota":"sete pessoas, sem contratação prevista"},
    {"rotulo":"Restrições externas","valor":"Bacen e LGPD","nota":"MED, limite noturno, registro e base legal para retenção"}
  ]'::jsonb
)
on conflict (session_slug) do update set
  caso_titulo = excluded.caso_titulo,
  caso_texto  = excluded.caso_texto,
  contexto    = excluded.contexto;

-- ---------------------------------------------------------------------
-- Questão 1 — Regra de negócio incompleta
-- ---------------------------------------------------------------------
insert into tbl_questoes (session_slug, ordem, categoria, titulo, pergunta, alternativas)
values (
  'm8-es-a01-pix-2026-2a', 1,
  'Regra de negócio incompleta',
  'A combinação que a regra não previu',
  'A regra de execução direta considera valor e horário. Chega uma ordem de R$ 900 às 21h40 para chave cadastrada há 8 minutos, de um titular que emitiu quatro ordens semelhantes na última hora. Nenhuma condição isolada ultrapassa os limites, e a combinação não está prevista. Como a equipe trata o que a regra não previu?',
  '[
    {
      "letra":"A","titulo":"Negar por omissão","tatica":"Fechar o conjunto de condições",
      "texto":"A regra passa a enumerar explicitamente as combinações admitidas. Toda ordem que não corresponda a uma combinação prevista é recusada com orientação ao titular.",
      "ganho":"Elimina a execução de casos não analisados e torna a cobertura da regra verificável por enumeração, com um caso de teste por combinação admitida.",
      "custo":"Recusa ordens legítimas ainda não catalogadas e transfere ao cliente o custo do que a especificação não previu. A cada nova combinação, a regra precisa ser alterada e implantada."
    },
    {
      "letra":"B","titulo":"Pontuação de risco contínua","tatica":"Substituir o limite discreto",
      "texto":"Valor, horário, idade do vínculo com o beneficiário, frequência recente e reputação do dispositivo compõem uma pontuação única, com faixas de decisão para executar, exigir segundo fator ou recusar.",
      "ganho":"Trata combinações não enumeradas sem alteração de código e permite calibrar a severidade por faixa, com medição do efeito sobre conversão e perda.",
      "custo":"A decisão deixa de ser explicável por leitura da regra, o que dificulta a contestação e a auditoria. Exige base histórica rotulada que a instituição ainda não possui."
    },
    {
      "letra":"C","titulo":"Revisão humana do não previsto","tatica":"Encaminhar a exceção",
      "texto":"A ordem que não corresponda a nenhuma condição conhecida entra em fila de análise com prazo declarado, e o titular é informado da retenção temporária.",
      "ganho":"Nenhuma ordem é executada sem análise, e cada caso analisado alimenta a especificação da regra com uma condição nova documentada.",
      "custo":"Introduz custo operacional proporcional ao volume e latência incompatível com a expectativa de um pagamento instantâneo. A fila se torna o gargalo no horário de pico."
    },
    {
      "letra":"D","titulo":"Tabela de decisão versionada","tatica":"Tornar a regra inspecionável",
      "texto":"As condições e os desfechos são organizados em tabela de decisão revisada com a área de negócio a cada entrega, com um caso de teste por linha e verificação automática de linhas ausentes.",
      "ganho":"Expõe as lacunas da regra antes da implantação, mantém a decisão explicável e vincula cada linha a uma verificação executável.",
      "custo":"A tabela cresce de forma combinatória e exige disciplina de revisão. Combinações raras continuam fora até que alguém as identifique."
    }
  ]'::jsonb
)
on conflict (session_slug, ordem) do update set
  categoria = excluded.categoria, titulo = excluded.titulo,
  pergunta = excluded.pergunta, alternativas = excluded.alternativas,
  dado_novo = excluded.dado_novo;

-- ---------------------------------------------------------------------
-- Questão 2 — Infraestrutura: conexão e integridade
-- ---------------------------------------------------------------------
insert into tbl_questoes (session_slug, ordem, categoria, titulo, pergunta, alternativas)
values (
  'm8-es-a01-pix-2026-2a', 2,
  'Infraestrutura: conexão e integridade',
  'A ordem liquidada cuja resposta não chegou',
  'A instituição liquida a ordem e a resposta não alcança o aplicativo por queda de conexão. O titular, sem confirmação na tela, enuncia a ordem outra vez. No trimestre, 312 ordens foram liquidadas em duplicidade por esse percurso. Qual tática a equipe adota?',
  '[
    {
      "letra":"A","titulo":"Chave de idempotência do cliente","tatica":"Tornar a operação repetível",
      "texto":"O aplicativo emite um identificador único por intenção de pagamento, enviado em toda tentativa. O servidor executa a primeira e devolve às seguintes o resultado da original.",
      "ganho":"Elimina a duplicidade na origem, sem depender de janela de tempo nem de comparação heurística entre ordens semelhantes.",
      "custo":"Depende de o cliente gerar e preservar o identificador entre tentativas, inclusive após encerramento do aplicativo. A retenção das chaves executadas tem custo e prazo próprios."
    },
    {
      "letra":"B","titulo":"Confirmação em duas fases","tatica":"Separar reserva de efetivação",
      "texto":"A ordem é reservada e só é efetivada por uma segunda chamada. Reservas sem efetivação expiram, e um processo de reconciliação resolve os casos pendentes.",
      "ganho":"Nenhum valor sai da conta sem confirmação explícita do percurso completo, e o estado pendente é observável durante a apuração.",
      "custo":"Duplica as chamadas por transação e cria um estado intermediário que o titular não compreende. A expiração mal dimensionada cancela ordens legítimas."
    },
    {
      "letra":"C","titulo":"Fila durável com deduplicação","tatica":"Entregar ao menos uma vez",
      "texto":"A ordem é publicada em fila persistente e o consumidor descarta reentregas pelo identificador da mensagem, com registro das tentativas.",
      "ganho":"Preserva a ordem diante de indisponibilidade momentânea do serviço de liquidação e torna a reentrega um comportamento previsto, não um incidente.",
      "custo":"Acrescenta latência e um componente de infraestrutura a operar. A deduplicação depende da janela de retenção da fila, e o titular pode ser debitado depois de ter desistido."
    },
    {
      "letra":"D","titulo":"Detecção por semelhança","tatica":"Barrar a repetição provável",
      "texto":"Ordens com mesmo valor, mesma chave de destino e intervalo inferior a dois minutos exigem confirmação adicional antes da segunda execução.",
      "ganho":"Não exige alteração do aplicativo nem do contrato com o serviço de liquidação, e intercepta o padrão que originou as 312 ocorrências.",
      "custo":"Barra o pagamento legítimo repetido e permanece exposta à duplicidade fora da janela. O limiar de tempo é arbitrário e precisa ser justificado por medição."
    }
  ]'::jsonb
)
on conflict (session_slug, ordem) do update set
  categoria = excluded.categoria, titulo = excluded.titulo,
  pergunta = excluded.pergunta, alternativas = excluded.alternativas,
  dado_novo = excluded.dado_novo;

-- ---------------------------------------------------------------------
-- Questão 3 — Segurança: fraude e imprecisão
-- O dado novo é liberado quando a discussão é aberta. A reclassificação
-- reposiciona a origem da perda: as táticas que verificam se o sistema
-- entendeu o enunciado operam corretamente nas ocorrências descritas e
-- ainda assim não impedem a transação.
-- ---------------------------------------------------------------------
insert into tbl_questoes (session_slug, ordem, categoria, titulo, pergunta, alternativas, dado_novo)
values (
  'm8-es-a01-pix-2026-2a', 3,
  'Segurança: fraude e imprecisão',
  'A resposta primária à perda do canal',
  'Qual tática arquitetural a instituição adota como resposta primária à perda no canal operado por linguagem natural?',
  '[
    {
      "letra":"A","titulo":"Verificação antes da execução","tatica":"Detectar a falha antes do efeito",
      "texto":"Leitura de volta obrigatória do valor, do nome do beneficiário, dos quatro últimos dígitos do documento e da instituição de destino, com consulta ao diretório de chaves e confirmação explícita do titular antes do envio da ordem.",
      "ganho":"Intercepta o erro de reconhecimento e a chave divergente enquanto a ordem ainda não produziu efeito, com custo de implantação baixo e sem dependência de fornecedor adicional.",
      "custo":"Acrescenta atrito a toda transação, inclusive à legítima. A confirmação repetida produz habituação, e o titular passa a confirmar sem conferir."
    },
    {
      "letra":"B","titulo":"Degradação do canal conforme o risco","tatica":"Limitar a exposição",
      "texto":"A voz deixa de executar acima de um envelope de risco composto por valor, horário, idade do vínculo com o beneficiário e reputação do dispositivo. Acima do envelope, o assistente prepara a ordem e exige conclusão por outro fator, com biometria facial ou senha.",
      "ganho":"Reduz a exposição por transação sem desativar o canal e mantém o serviço em operação degradada em vez de indisponível.",
      "custo":"Depende de um envelope calibrado sobre dados cuja origem a instituição ainda não separa. Desloca volume para o canal que se pretendia evitar, e o limiar, uma vez conhecido, orienta a operação do fraudador abaixo dele."
    },
    {
      "letra":"C","titulo":"Redundância do reconhecimento","tatica":"Votação entre réplicas",
      "texto":"Dois motores independentes de processamento de linguagem natural e verificação biométrica da voz. A ordem é executada apenas quando os motores concordam quanto à intenção e aos parâmetros e a voz corresponde ao titular; a divergência é encaminhada à revisão.",
      "ganho":"Reduz o erro de interpretação e a personificação por gravação, e produz um segundo registro independente para a apuração.",
      "custo":"Duplica o custo por transação e acrescenta latência. Exige política para o caso de divergência, e a independência entre os motores precisa ser demonstrada por medição, não presumida por contrato."
    },
    {
      "letra":"D","titulo":"Reversão com rastro oponível","tatica":"Recuperar do efeito",
      "texto":"A ordem é executada de imediato e cada etapa é registrada em trilha assinada e encadeada: transcrição, intenção, parâmetros, dispositivo, instante e identificador da ordem. A contestação aciona o Mecanismo Especial de Devolução de forma automatizada, com bloqueio cautelar do valor na conta de destino.",
      "ganho":"Preserva a conversão do canal, sustenta a contestação com evidência verificável e atua sobre o resultado da fraude sem depender de prever sua origem.",
      "custo":"A devolução alcança apenas o saldo remanescente na conta de destino e depende da instituição recebedora. A perda já ocorreu quando o mecanismo é acionado, e a retenção do registro exige base legal e prazo declarados."
    }
  ]'::jsonb,
  '{
    "titulo":"A classificação individual das 1.870 ocorrências",
    "texto":"A área de risco concluiu a revisão individual das ocorrências do trimestre. Em 78% delas não há erro de reconhecimento nem chave divergente: o titular autenticado enunciou o comando pretendido, ouviu a leitura de volta, confirmou a ordem e a instituição executou exatamente o que foi pedido. A transação foi obtida por engano do titular, nas modalidades de falso funcionário da instituição, falso parente em situação de urgência e coação presencial. A meta do conselho, o prazo de um trimestre e as quatro alternativas permanecem os mesmos.",
    "evidencias":[
      "Confirmação explícita concluída em 96% das ocorrências classificadas como engano do titular.",
      "Verificação biométrica da voz correspondente ao titular em 100% dessas ocorrências.",
      "Mediana de 3 minutos e 40 segundos entre a liquidação e o esvaziamento da conta de destino; o Mecanismo Especial de Devolução recuperou 11% do valor contestado.",
      "Em 64% das ocorrências o beneficiário havia sido cadastrado há menos de 10 minutos.",
      "Transações abaixo de R$ 1.000 respondem por 54% das ocorrências e por 12% da perda financeira.",
      "Em 41% dos casos o titular manteve chamada telefônica ativa durante todo o enunciado do comando."
    ],
    "pergunta":"Diante da reclassificação, qual tática permanece como resposta primária? Declare se a sua escolha anterior sobrevive a este dado e por quê."
  }'::jsonb
)
on conflict (session_slug, ordem) do update set
  categoria = excluded.categoria, titulo = excluded.titulo,
  pergunta = excluded.pergunta, alternativas = excluded.alternativas,
  dado_novo = excluded.dado_novo;

-- ---------------------------------------------------------------------
-- Questão 4 — Segurança: não repúdio
-- ---------------------------------------------------------------------
insert into tbl_questoes (session_slug, ordem, categoria, titulo, pergunta, alternativas)
values (
  'm8-es-a01-pix-2026-2a', 4,
  'Segurança: não repúdio',
  'A ordem que o titular nega ter emitido',
  'Um titular contesta judicialmente uma ordem de R$ 12.400 e afirma não a ter emitido. Os registros atuais são linhas de texto gravadas pelo próprio serviço, sem assinatura e sem encadeamento. Que mecanismo a instituição implanta para sustentar a prova em contestações futuras?',
  '[
    {
      "letra":"A","titulo":"Trilha assinada e encadeada","tatica":"Tornar o registro oponível",
      "texto":"Cada entrada do percurso — transcrição, intenção, parâmetros, dispositivo e instante — é assinada pela chave do serviço emissor e incorpora o resumo criptográfico da anterior, com carimbo de tempo de autoridade independente.",
      "ganho":"A adulteração de qualquer entrada é detectável por terceiro, e a validação não exige acesso privilegiado ao sistema que produziu o registro.",
      "custo":"Exige gestão de chaves, contrato com autoridade de carimbo e procedimento de verificação mantido ao longo do prazo de retenção. Prova o que o sistema registrou, e não quem estava diante do aparelho."
    },
    {
      "letra":"B","titulo":"Retenção do áudio original","tatica":"Preservar o enunciado",
      "texto":"O áudio do comando é retido com vínculo ao identificador da ordem e à transcrição, sob base legal declarada e prazo compatível com o período de contestação.",
      "ganho":"Permite a perícia sobre o próprio enunciado, inclusive quanto a coação, a presença de terceiros e a divergência entre o dito e o transcrito.",
      "custo":"Amplia a superfície de dado pessoal sensível, com custo de armazenamento e de proteção proporcional, e exige minimização, base legal e prazo declarados perante a LGPD."
    },
    {
      "letra":"C","titulo":"Registro em repositório de terceiro","tatica":"Separar quem opera de quem guarda",
      "texto":"As entradas são escritas em repositório sem permissão de alteração, operado por terceiro, com auditoria externa periódica dos procedimentos de escrita e de retenção.",
      "ganho":"Separa a custódia da prova de quem tem interesse no litígio, o que eleva o valor probatório do registro perante a contestação.",
      "custo":"Cria dependência operacional e contratual de um terceiro, com custo recorrente, e transfere a ele parte da exposição regulatória sobre o dado retido."
    },
    {
      "letra":"D","titulo":"Assinatura pelo dispositivo do titular","tatica":"Vincular a ordem ao portador",
      "texto":"A ordem é assinada por chave privada mantida em área protegida do aparelho do titular, liberada por biometria local, e a instituição verifica a assinatura antes de liquidar.",
      "ganho":"Vincula a ordem ao aparelho e ao fator biométrico do titular, o que sustenta a atribuição de autoria de forma mais direta do que o registro produzido pelo servidor.",
      "custo":"Depende do parque de aparelhos e exclui quem não dispõe de área protegida. A perda do aparelho e a troca de chave exigem procedimento de recuperação que se torna, ele próprio, alvo de fraude."
    }
  ]'::jsonb
)
on conflict (session_slug, ordem) do update set
  categoria = excluded.categoria, titulo = excluded.titulo,
  pergunta = excluded.pergunta, alternativas = excluded.alternativas,
  dado_novo = excluded.dado_novo;

-- ---------------------------------------------------------------------
-- Questão 5 — Usabilidade
-- ---------------------------------------------------------------------
insert into tbl_questoes (session_slug, ordem, categoria, titulo, pergunta, alternativas)
values (
  'm8-es-a01-pix-2026-2a', 5,
  'Usabilidade',
  'A confirmação que deixou de ser lida',
  'A leitura de volta foi apresentada e confirmada em 96% das ocorrências de engano do titular. O mecanismo opera conforme especificado e o titular confirma sem conferir, por habituação à confirmação repetida. Que tratamento a equipe adota?',
  '[
    {
      "letra":"A","titulo":"Fricção seletiva","tatica":"Reservar a confirmação ao que importa",
      "texto":"A confirmação reforçada passa a ocorrer apenas nas ordens de risco elevado; as demais são executadas com aviso discreto e possibilidade de revisão posterior.",
      "ganho":"Reduz a repetição que produz habituação e devolve significado ao pedido de confirmação, sem acrescentar atrito à ordem rotineira.",
      "custo":"Depende da classificação de risco para decidir onde há fricção, e o erro de classificação retira a proteção exatamente da ordem que a exigia."
    },
    {
      "letra":"B","titulo":"Intervalo de reflexão","tatica":"Adiar o efeito irreversível",
      "texto":"Ordens para beneficiário cadastrado há pouco tempo são liquidadas após intervalo declarado, durante o qual o titular pode cancelar por qualquer canal.",
      "ganho":"Atua sobre a situação de urgência fabricada pelo fraudador e preserva a decisão do titular sem depender de ele conferir a tela no momento do enunciado.",
      "custo":"Conflita com a expectativa de pagamento instantâneo e desloca parte do volume para outros canais. O intervalo precisa ser curto o bastante para não inviabilizar o uso legítimo."
    },
    {
      "letra":"C","titulo":"Confirmação ativa","tatica":"Exigir elaboração do titular",
      "texto":"Em vez de aceitar, o titular enuncia o nome do beneficiário e a finalidade da ordem, que são comparados aos dados do diretório de chaves antes da execução.",
      "ganho":"Substitui o gesto automático por uma ação que exige processar a informação apresentada, o que rompe o padrão de confirmação por hábito.",
      "custo":"Aumenta o tempo da operação e a taxa de abandono, e penaliza o titular com dificuldade de fala ou em ambiente ruidoso, com risco de exclusão do canal."
    },
    {
      "letra":"D","titulo":"Interrupção por contexto","tatica":"Reagir ao indício de coação",
      "texto":"O aplicativo detecta indícios como chamada telefônica ativa durante o enunciado e apresenta orientação específica sobre os golpes mais frequentes, com opção de adiar a ordem.",
      "ganho":"Atua sobre o indício presente em 41% das ocorrências e informa o titular no momento em que a decisão está sendo tomada.",
      "custo":"Depende de permissões do sistema operacional e de inferência sobre o contexto do usuário, com falsos positivos que interrompem a ordem legítima e implicações de privacidade a declarar."
    }
  ]'::jsonb
)
on conflict (session_slug, ordem) do update set
  categoria = excluded.categoria, titulo = excluded.titulo,
  pergunta = excluded.pergunta, alternativas = excluded.alternativas,
  dado_novo = excluded.dado_novo;

-- Remove questões de uma carga anterior que excedam a sequência atual.
delete from tbl_questoes where session_slug = 'm8-es-a01-pix-2026-2a' and ordem > 5;

-- Impede publicar a sala com o token de exemplo. O literal é partido
-- para sobreviver à própria substituição.
do $$
begin
  if exists (select 1 from tbl_host_tokens
              where session_slug = 'm8-es-a01-pix-2026-2a'
                and token = '__TBL_' || 'HOST_TOKEN__') then
    raise exception 'Defina o token do professor antes de criar a sala.';
  end if;
end $$;

commit;
