-- =====================================================================
-- Aula 7 do Módulo 7 — Governança corporativa e de dados
-- Dez perguntas extraídas do material lesson-7-material.html e dos blocos
-- expostos em slide-lesson-7.html.
--
-- Noventa segundos de resposta por questão. A pergunta fecha sozinha ao fim
-- do tempo, e o resultado é exibido de imediato. A décima questão tem
-- peso 2.
--
-- As questões são de aplicação e retomam, sempre que possível, a
-- situação-problema do encontro: o cliente com três cadastros, três limites
-- de crédito e nenhum responsável designado. Os distratores reproduzem
-- erros correntes na prática. A posição da resposta correta é distribuída
-- entre as quatro letras e o comprimento das alternativas é equilibrado.
--
-- Cobertura: os quatro blocos expositivos — governança corporativa
-- (seções 2 e 3), governança de dados (seções 7, 8, 9 e 10), arquitetura
-- corporativa (seções 13 e 14) e modelo relacional (seções 19 e 20).
--
-- O token do professor NÃO é versionado. É o MESMO em todas as salas
-- (QUIZ_HOST_TOKEN no .env da raiz), mas quiz_host() valida o par
-- (session_slug, token) — logo, a sala precisa da sua linha:
--
--   set -a; . ./.env; set +a
--   psql "$DATABASE_URL?sslmode=require" -c \
--     "insert into quiz_host_tokens (session_slug, token)
--      values ('governanca-m7-a7', '$QUIZ_HOST_TOKEN')
--      on conflict (session_slug) do update set token = excluded.token;"
--
-- Rodar depois de quiz-schema.sql, quiz-funcoes.sql, quiz-relatorio.sql e
-- quiz-ingestao.sql. É idempotente.
-- =====================================================================

insert into quiz_sessions (slug, titulo) values
  ('governanca-m7-a7', 'Aula 7 — Governança corporativa e de dados')
on conflict (slug) do update set titulo = excluded.titulo;

-- Compõe a data_tag do arquivamento: <turma>-<slug>.
update quiz_sessions set turma = '2026-2A' where slug = 'governanca-m7-a7';

delete from quiz_questions where session_slug = 'governanca-m7-a7';

with novas as (
  insert into quiz_questions (session_slug, ordem, enunciado, alternativas, segundos, peso, tema, secao)
  values
  ('governanca-m7-a7', 1,
   'Os sócios de uma distribuidora delegam a gestão à diretoria, remunerada por meta de faturamento. A diretoria amplia os limites de crédito para cumprir a meta, e os sócios só percebem o risco quando a inadimplência chega ao balanço. Como caracterizar a situação e o que a governança oferece?',
   '["Conflito entre áreas pelo mesmo dado; arbitragem pelo conselho de governança de dados",
     "Falha de qualidade do dado; regra mensurável de exatidão para o limite de crédito aprovado",
     "Problema de agência; mecanismos que alinham os interesses e tornam a gestão verificável",
     "Falha de segregação de funções; perfis que separam quem cadastra de quem registra a venda"]'::jsonb, 90, 1, 'Problema de agência', 'seção 2'),

  ('governanca-m7-a7', 2,
   'Após a virada, o limite de crédito de um cliente passa de R$ 50 mil para R$ 200 mil. A auditoria pergunta quem fez a alteração e qual era o valor anterior, e o sistema não guarda essa informação. Que princípio do IBGC o sistema deixou de materializar, e por meio de que controle?',
   '["Responsabilização; trilha de alteração com usuário, data e valor anterior do campo crítico",
     "Transparência; relatório gerado a partir de dado único e rastreável na base do sistema de gestão",
     "Integridade; regra parametrizada igual à política aprovada, sem contorno fora do sistema",
     "Equidade; mesma regra de crédito aplicada a todos os clientes nas mesmas condições"]'::jsonb, 90, 1, 'Princípios de governança', 'seção 3'),

  ('governanca-m7-a7', 3,
   'Na preparação da carga, a equipe de tecnologia define por conta própria que prevalecerá o maior limite de crédito entre as três origens e executa a carga sem consultar outra área. Como avaliar a conduta pela distinção entre governança e gestão de dados?',
   '["Adequada, porque a equipe de tecnologia é custodiante e responde pela carga dos dados",
     "Adequada, porque o critério do maior valor evita bloqueio de pedidos e preserva a receita",
     "Inadequada, porque a regra de prevalência deveria ter sido definida antes pela auditoria interna",
     "Inadequada, porque a execução ocorreu sem a decisão de governança sobre a regra de prevalência"]'::jsonb, 90, 1, 'Governança e gestão de dados', 'seção 7'),

  ('governanca-m7-a7', 4,
   'Na matriz de governança, a equipe precisa classificar três conjuntos de dados do sistema de gestão: a tabela de condições de pagamento admitidas, o cadastro de fornecedores e as notas fiscais de entrada. Qual é a classificação correta, nessa ordem?',
   '["Mestre, mestre e transacional",
     "Referência, mestre e transacional",
     "Referência, transacional e mestre",
     "Metadado, mestre e transacional"]'::jsonb, 90, 1, 'Classes de dados', 'seção 8'),

  ('governanca-m7-a7', 5,
   'As áreas comercial e financeira reivindicam, cada uma, a prerrogativa de alterar o limite de crédito do cliente, e o analista de crédito não sabe a qual pedido atender. A quem cabe resolver o impasse e quem, resolvido o conflito, aprova a regra de alteração?',
   '["Ao conselho de dados, que arbitra o conflito; o dono do dado aprova a regra",
     "Ao custodiante, que opera o acesso ao banco; o curador aprova a regra",
     "À auditoria interna, que avalia os controles; o custodiante aprova a regra",
     "Ao curador, que monitora a qualidade do cadastro; o conselho fiscal aprova a regra"]'::jsonb, 90, 1, 'Papéis sobre o dado', 'seção 9'),

  ('governanca-m7-a7', 6,
   'Após a carga, todos os clientes ativos têm limite de crédito preenchido, maior ou igual a zero e CNPJ sem repetição. Na conferência por amostra, porém, 30% dos limites diferem do valor aprovado em ata pela diretoria financeira. Que dimensão de qualidade falha?',
   '["Completude",
     "Validade",
     "Exatidão",
     "Consistência"]'::jsonb, 90, 1, 'Dimensões de qualidade', 'seção 10'),

  ('governanca-m7-a7', 7,
   'Antes da carga, a equipe precisa decidir qual das três origens — planilha comercial, planilha financeira ou legado de faturamento — prevalece para o cadastro de clientes. Que artefato da arquitetura corporativa responde a essa pergunta, e em que domínio?',
   '["Mapa de aplicações com o diagrama de interfaces, no domínio de aplicação",
     "Processo em BPMN da concessão de crédito ao cliente, no domínio de negócio",
     "Diagrama de implantação com o inventário de ambientes, no domínio de tecnologia",
     "Matriz entidade × sistema com a fonte autorizada, no domínio de dados"]'::jsonb, 90, 1, 'Domínios da arquitetura', 'seção 13'),

  ('governanca-m7-a7', 8,
   'O projeto do parceiro precisa definir a sequência de transição do legado para o sistema de gestão, incluindo a ordem em que clientes, itens e títulos em aberto serão migrados. Em que fase do ADM do TOGAF esse trabalho se situa?',
   '["Fase C, sistemas de informação, que trata a arquitetura de dados e de aplicações",
     "Fase F, planejamento da migração, que sequencia a transição e a migração dos dados",
     "Fase E, oportunidades e soluções, que organiza pacotes de trabalho para as lacunas",
     "Fase G, governança da implementação, que verifica a aderência durante a implantação"]'::jsonb, 90, 1, 'TOGAF', 'seção 14'),

  ('governanca-m7-a7', 9,
   'A tabela CLIENTE foi criada com cod_cliente como PRIMARY KEY e cnpj apenas como NOT NULL. A carga das três origens termina sem erro algum. Que situação do caso o esquema admitiu, e que restrição a teria rejeitado no momento da inserção?',
   '["O mesmo CNPJ em três cadastros, rejeitado por UNIQUE declarada sobre a coluna cnpj",
     "O mesmo CNPJ em três cadastros, rejeitado pela PRIMARY KEY já declarada em cod_cliente",
     "Limite de crédito divergente da ata, rejeitado por CHECK declarado sobre limite_credito",
     "Cliente vinculado a grupo inexistente, rejeitado por REFERENCES a grupo_cliente"]'::jsonb, 90, 1, 'Restrições de integridade', 'seção 19'),

  ('governanca-m7-a7', 10,
   'Na planilha consolidada da carga, cada linha de cliente traz cod_grupo e prazo_padrao_dias, e o prazo se repete em todos os clientes do mesmo grupo. Alterado o prazo de um grupo, parte das linhas permanece com o valor antigo. Que forma normal a planilha viola e qual é a correção?',
   '["1FN; separar o prazo em relação própria, com uma linha por valor de cada cliente",
     "2FN; mover o prazo para o pedido de venda, que depende da chave primária inteira",
     "3FN; manter o prazo em GRUPO_CLIENTE, alcançado pela chave estrangeira do cliente",
     "3FN; manter o prazo no cliente, com revisão do curador a cada alteração de prazo do grupo"]'::jsonb, 90, 2, 'Normalização', 'seção 20')
  returning id, ordem
)
insert into quiz_answer_key (question_id, correta, explicacao)
select n.id, g.correta, g.explicacao
  from novas n
  join (values
    (1, 2, 'Quem detém o capital delega a gestão a administradores cujos interesses não coincidem necessariamente com os seus; Jensen e Meckling denominam essa relação problema de agência. A governança reúne os mecanismos que alinham os dois interesses e tornam a gestão verificável. As demais alternativas descrevem controles pontuais, que não tratam a divergência de interesses entre sócios e diretoria (seção 2).'),
    (2, 0, 'O princípio da responsabilização exige prestação de contas clara e tempestiva. No sistema de gestão, ele se materializa na trilha de alteração com usuário, data e valor anterior de cada campo crítico. Sem essa trilha, a alteração não tem autor verificável e ninguém responde por ela (seção 3).'),
    (3, 3, 'A governança decide sobre o dado — responsável, política, regra de qualidade e resolução de conflito; a gestão executa conforme o decidido. A regra de prevalência entre origens é decisão de governança, que cabe ao dono do dado, no caso a diretoria financeira. O custodiante opera a carga, mas não define o valor que prevalece, e a auditoria verifica, não decide (seções 7 e 9).'),
    (4, 1, 'Condição de pagamento é domínio de valores admitidos, portanto dado de referência, com lista controlada e versão vigente. Fornecedor é parceiro de negócios, entidade estável compartilhada por vários processos: dado mestre. A nota fiscal registra um evento com data e valor que refere dados mestres: dado transacional (seção 8).'),
    (5, 0, 'O conselho de governança de dados é a instância que decide quando duas áreas reivindicam o mesmo dado. Resolvido o conflito, quem aprova a definição, a regra e o acesso é o dono do dado, gestor da área de negócio — no caso do crédito, a diretoria financeira. O curador monitora e o custodiante armazena e protege; nenhum dos dois aprova (seção 9).'),
    (6, 2, 'Exatidão pergunta se o valor corresponde à realidade ou à fonte autorizada, e a regra mensurável do caso é o limite igual ao aprovado em ata. Completude (campo preenchido), validade (domínio e formato) e unicidade estão atendidas. Consistência compara o valor entre sistemas, não com a decisão que o autorizou (seção 10).'),
    (7, 3, 'A matriz entidade × sistema, artefato do domínio de dados, declara para cada entidade qual sistema é a fonte autorizada. Com essa coluna preenchida, a equipe teria critério declarado de prevalência entre as três origens. O mapa de aplicações responde que sistemas leem e alteram o cadastro, não qual deles prevalece (seção 13).'),
    (8, 1, 'A fase F do ADM, planejamento da migração, define a sequência de transição, incluindo a migração dos dados. A fase C descreve a arquitetura de dados e de aplicações do estado futuro, a E agrupa pacotes de trabalho e a G verifica, durante a implantação, a aderência à arquitetura. O projeto do parceiro corresponde às fases C, F e G (seção 14).'),
    (9, 0, 'O CNPJ é chave candidata natural. Quando o código interno é a chave primária, o CNPJ precisa de restrição UNIQUE, sem a qual o mesmo cliente é cadastrado três vezes com códigos distintos. A PRIMARY KEY só impede a repetição do código. Exatidão em relação à ata não se impõe por restrição: depende do dono e do curador (seção 19).'),
    (10, 2, 'O prazo depende de cod_grupo, que não é chave de CLIENTE: dependência transitiva entre atributos não chave, o que viola a 3FN. A correção mantém o prazo em GRUPO_CLIENTE, alcançado pela chave estrangeira, e o fato passa a ser registrado uma única vez. Manter o prazo repetido com revisão manual preserva a anomalia de atualização que produziu a divergência (seção 20).')
  ) as g(ordem, correta, explicacao) on g.ordem = n.ordem;

select count(*) || ' perguntas carregadas' as resultado
  from quiz_questions where session_slug = 'governanca-m7-a7';
