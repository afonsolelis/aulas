-- =====================================================================
-- Aula 6 do Módulo 7 — Gestão de Stakeholders
-- Oito perguntas extraídas do material lesson-6-material.html.
--
-- As questões são de aplicação: cada uma apresenta uma situação e pede a
-- classificação, o diagnóstico ou a intervenção correspondente. Os
-- distratores reproduzem erros correntes na prática, não alternativas
-- implausíveis. A posição da resposta correta é distribuída entre as
-- quatro letras — duas em cada — e o comprimento das alternativas é
-- equilibrado, para que nem a posição nem a extensão sirvam de atalho.
--
-- Cobertura: seções 2, 5, 6, 7, 8, 10, 11 e 12 do material.
--
-- O token do professor NÃO é versionado: este repositório é público, e quem
-- tem o token abre, revela e reinicia a sessão. Defina-o à mão no SQL Editor,
-- uma vez por sessão:
--
--   insert into quiz_host_tokens (session_slug, token)
--   values ('stakeholders-m7-a6', 'COLE-O-TOKEN-AQUI')
--   on conflict (session_slug) do update set token = excluded.token;
--
-- Para gerar um token novo:  python3 -c "import secrets;print(secrets.token_urlsafe(9))"
--
-- Rodar depois de quiz-schema.sql, quiz-relatorio.sql e quiz-ingestao.sql.
-- É idempotente.
-- =====================================================================

insert into quiz_sessions (slug, titulo) values
  ('stakeholders-m7-a6', 'Aula 6 — Gestão de Stakeholders')
on conflict (slug) do update set titulo = excluded.titulo;

-- Compõe a data_tag do arquivamento: <turma>-<slug>.
update quiz_sessions set turma = '2026-2A' where slug = 'stakeholders-m7-a6';

delete from quiz_questions where session_slug = 'stakeholders-m7-a6';

with novas as (
  insert into quiz_questions (session_slug, ordem, enunciado, alternativas, segundos, tema, secao)
  values
  ('stakeholders-m7-a6', 1,
   'Uma área supõe que a implantação lhe retirará autonomia na aprovação de compras. A suposição é infundada: a parametrização definida não altera sua alçada. Ainda assim, a área passa a adiar as reuniões de validação. Como ela deve constar do registro de partes interessadas?',
   '["Fora do registro, porque o efeito que a área teme não se confirma na parametrização definida",
     "No registro como parte interessada, porque a percepção de ser afetado produz comportamento efetivo",
     "No registro apenas como destinatária de comunicação periódica, dispensada a avaliação de poder e de interesse",
     "Fora do registro de partes e dentro do registro de riscos, por se tratar de suposição infundada"]'::jsonb, 40, 'Definição de parte interessada', 'seção 2'),

  ('stakeholders-m7-a6', 2,
   'O usuário-chave designado pela área participa da reunião inicial e delega o acompanhamento a um analista, que responde às validações e assina as atas de homologação. Na sessão de aceite, a área recusa o processo parametrizado. Que condição, observada na delegação, teria evitado a recusa?',
   '["Registro do escopo da delegação, com a validação final reservada ao titular do papel",
     "Ciência formal do gestor da área lavrada em cada uma das atas assinadas pelo analista",
     "Ampliação do número de sessões de homologação conduzidas em conjunto com a área",
     "Substituição das atas de homologação por relatório técnico emitido pela equipe de projeto"]'::jsonb, 40, 'Delegação e legitimidade', 'seção 10'),

  ('stakeholders-m7-a6', 3,
   'A diretoria financeira pode interromper o projeto e não acompanha as reuniões semanais de validação. Para engajá-la, a equipe passa a incluí-la na distribuição de todas as atas e dos relatórios detalhados de teste. Qual é o quadrante da diretoria e o tratamento correspondente?',
   '["Manter informado; comunicação regular do andamento, com contribuição em requisito e teste",
     "Gerir de perto; envolvimento direto na decisão e na validação de cada entrega do projeto",
     "Manter satisfeito; consulta restrita aos pontos de decisão, sem sobrecarga de detalhe",
     "Monitorar; acompanhamento periódico, sem ação dedicada de engajamento pela equipe"]'::jsonb, 40, 'Poder e interesse', 'seção 5'),

  ('stakeholders-m7-a6', 4,
   'A área de controle interno acompanha o projeto desde o início, com reivindicação reconhecida como pertinente e autoridade para exigir conformidade. A três dias da virada, identifica não conformidade que impede a entrada em operação. Como se altera sua classificação de saliência?',
   '["Permanece dominante, porque o poder e a legitimidade que já detinha não se alteraram no período",
     "Torna-se perigosa, porque passa a impor exigência sem pertinência reconhecida ao escopo",
     "Torna-se dependente, porque passa a depender de terceiro que detenha poder para ser atendida",
     "Torna-se definitiva, porque a urgência se acrescenta ao poder e à legitimidade que já detinha"]'::jsonb, 40, 'Saliência', 'seção 6'),

  ('stakeholders-m7-a6', 5,
   'O dono de um processo crítico responde às solicitações no prazo e disponibiliza a equipe, sem tomar iniciativa além do que lhe é pedido. O projeto requer que ele antecipe impedimentos e mobilize as áreas vizinhas. Qual é a lacuna de engajamento e a ação indicada?',
   '["De resistente a apoiador; endereçar o efeito que a mudança produz sobre o interesse da área",
     "De apoiador a condutor; atribuir-lhe decisão efetiva sobre o escopo do processo que responde",
     "De neutro a apoiador; ampliar a comunicação periódica sobre o andamento e as decisões do projeto",
     "De desinformado a neutro; apresentar a razão de negócio que justificou a implantação"]'::jsonb, 40, 'Engajamento atual e desejado', 'seção 7'),

  ('stakeholders-m7-a6', 6,
   'A área fiscal é convocada para verificar a conformidade da parametrização na semana anterior à virada. Aponta exigência que obriga a refazer a regra de cálculo, e a correção atrasa a entrada em operação. Que estratégia de engajamento teria evitado a situação?',
   '["Escalonamento ao comitê diretivo, para decidir entre a exigência fiscal e a data acordada",
     "Representação do interesse fiscal por integrante da equipe nas decisões do projeto",
     "Validação com evidência, com a área fiscal executando o roteiro de teste da regra",
     "Antecipação de controle, com a área fiscal participando da definição do requisito"]'::jsonb, 40, 'Estratégias de engajamento', 'seção 8'),

  ('stakeholders-m7-a6', 7,
   'Na matriz de responsabilidades do projeto, a atividade de teste de aceite de um processo aparece com dois aprovadores: o dono do processo e o comitê diretivo. Que problema a atribuição caracteriza?',
   '["Violação da regra de aprovador único, que deixa a decisão final sem responsável definido",
     "Ausência de consultado na atividade, que priva a decisão do parecer da área de controle",
     "Acúmulo indevido da execução e da aprovação pela mesma parte interessada do projeto",
     "Confusão entre o papel de informado e o de consultado na comunicação do resultado da atividade"]'::jsonb, 40, 'Matriz de responsabilidades', 'seção 11'),

  ('stakeholders-m7-a6', 8,
   'A área de compras exige aprovação de requisições em etapa única, para atender pedidos urgentes; a área de controle exige segregação de funções por faixa de valor, requisito de norma externa à organização. O grupo apresenta registro de acordo que atende integralmente as duas exigências. Como avaliar o registro?',
   '["Aceito, porque o atendimento simultâneo das duas exigências demonstra que a negociação foi bem conduzida",
     "Aceito com ressalva, desde que a compensação acordada e o responsável estejam declarados",
     "Devolvido, porque exigências incompatíveis produzem preterição, e sua ausência indica conflito não explicitado",
     "Devolvido, porque a decisão sobre a etapa de aprovação deveria ter sido escalada ao comitê diretivo antes do registro"]'::jsonb, 40, 'Interesses conflitantes', 'seção 12')
  returning id, ordem
)
insert into quiz_answer_key (question_id, correta, explicacao)
select n.id, g.correta, g.explicacao
  from novas n
  join (values
    (1, 1, 'A definição do PMBOK contempla quem se percebe afetado, e não apenas quem o é objetivamente. A percepção produz comportamento efetivo — o adiamento das validações — e esse comportamento é risco real do projeto, ainda que a suposição que o origina seja infundada (seção 2).'),
    (2, 0, 'A delegação é admissível quando registrada, com o escopo declarado e a validação final reservada ao titular. Sem esse registro, a delegação transfere a execução e não transfere a responsabilidade: quem assinou não respondia pelo processo nem pelo aceite (seção 10).'),
    (3, 2, 'Poder elevado com interesse baixo situa a diretoria em manter satisfeito, cujo tratamento é a consulta nos pontos de decisão. O volume de detalhe operacional não sustenta o interesse de quem tem poder: converte-o em desinteresse ativo (seções 5 e 8).'),
    (4, 3, 'A área já detinha poder e legitimidade, o que a caracterizava como dominante. A proximidade da virada acrescenta a urgência, e a presença dos três atributos define a parte definitiva. A urgência é o atributo que se altera com maior rapidez, e é por isso que o registro é revisado por fase (seção 6).'),
    (5, 1, 'Responder no prazo e disponibilizar a equipe caracteriza o nível apoiador. Antecipar impedimento e mobilizar pares caracteriza o condutor. A lacuna é de uma posição, e a ação correspondente ao quadrante de gerir de perto é atribuir decisão efetiva, não apenas consulta (seções 7 e 8).'),
    (6, 3, 'A antecipação de controle convoca a área de controle na definição do requisito, e não na verificação final. Converte parte potencialmente definitiva em dominante e evita o impedimento na véspera da virada, quando a correção é mais onerosa (seção 8).'),
    (7, 0, 'A convenção admite um único aprovador por atividade, porque é ele quem responde pelo resultado e detém a decisão final. Dois aprovadores não somam autoridade: dividem a responsabilidade e deixam a decisão sem quem responda por ela (seção 11).'),
    (8, 2, 'Exigências pertinentes e mutuamente restritivas produzem preterição de interesse. O registro que declara atendimento integral das duas indica que o conflito não foi explicitado na negociação. O critério de exigência legal, no caso, tem prevalência absoluta sobre a etapa única (seção 12).')
  ) as g(ordem, correta, explicacao) on g.ordem = n.ordem;

select count(*) || ' perguntas carregadas' as resultado
  from quiz_questions where session_slug = 'stakeholders-m7-a6';
