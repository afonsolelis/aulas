-- =====================================================================
-- Aula 5 do Módulo 7 — Gestão de mudanças (GMUD)
-- Oito perguntas extraídas do material lesson-5-material.html.
--
-- As questões são de aplicação: cada uma apresenta uma situação e pede a
-- classificação, o diagnóstico ou a intervenção correspondente. Os
-- distratores reproduzem erros correntes na prática, não alternativas
-- implausíveis. A posição da resposta correta é distribuída entre as
-- quatro letras, e o comprimento das alternativas é equilibrado, para que
-- nem a posição nem a extensão sirvam de atalho a quem não leu.
--
-- O token do professor NÃO é versionado: este repositório é público, e quem
-- tem o token abre, revela e reinicia a sessão. Defina-o à mão no SQL Editor,
-- uma vez por sessão, substituindo o valor abaixo:
--
--   insert into quiz_host_tokens (session_slug, token)
--   values ('gmud-m7-a5', 'COLE-O-TOKEN-AQUI')
--   on conflict (session_slug) do update set token = excluded.token;
--
-- Para gerar um token novo:  python3 -c "import secrets;print(secrets.token_urlsafe(9))"
--
-- Rodar depois de quiz-schema.sql. É idempotente.
-- =====================================================================

insert into quiz_sessions (slug, titulo) values
  ('gmud-m7-a5', 'Aula 5 — Gestão de mudanças')
on conflict (slug) do update set titulo = excluded.titulo;

delete from quiz_questions where session_slug = 'gmud-m7-a5';

with novas as (
  insert into quiz_questions (session_slug, ordem, enunciado, alternativas, segundos)
  values
  ('gmud-m7-a5', 1,
   'Um defeito impede a emissão de notas fiscais e precisa ser corrigido ainda hoje. A correção altera código e não existe procedimento documentado para ela. Como a requisição deve ser classificada e autorizada?',
   '["Padrão, porque o resultado é conhecido e a urgência operacional dispensa avaliação individual",
     "Normal, submetida ao comitê de mudanças na próxima janela regular publicada no calendário",
     "Emergencial, decidida por comitê de quórum reduzido, com registro completo lavrado depois",
     "Padrão, desde que o gestor da área afetada registre a aprovação por mensagem antes da execução"]'::jsonb, 40),

  ('gmud-m7-a5', 2,
   'Uma alteração atinge um componente usado por uma única área, tem retorno testado e executável em dez minutos, e está agendada para a semana do fechamento contábil. Qual dimensão eleva a avaliação de risco?',
   '["Momento, pela proximidade do fechamento contábil em curso",
     "Abrangência, por atingir uma área inteira da organização",
     "Reversibilidade, porque o retorno depende de execução manual",
     "Complexidade, por envolver um componente compartilhado entre sistemas"]'::jsonb, 40),

  ('gmud-m7-a5', 3,
   'Duas requisições foram avaliadas em separado, aprovadas, testadas com sucesso isoladamente e agendadas para a mesma janela, sobre o mesmo componente. A execução conjunta derruba o serviço. Que falha do roteiro de avaliação isso caracteriza?',
   '["Ausência do plano de verificação posterior à execução da mudança",
     "Falta de declaração da janela pretendida e do tempo de indisponibilidade",
     "Indefinição de quem responde pela construção, pelo teste e pela implantação",
     "Omissão da relação de cada mudança com as demais em curso no período"]'::jsonb, 40),

  ('gmud-m7-a5', 4,
   'A emissão de boletos para. A equipe aplica um contorno manual e o serviço volta em vinte minutos. Registra-se que houve três paradas de mesma origem no trimestre, e decide-se corrigir a causa em definitivo. Como se nomeiam, na ordem, a parada, o registro que agrupa as três e a correção definitiva?',
   '["Problema, incidente e mudança",
     "Incidente, problema e mudança",
     "Incidente, mudança e problema",
     "Mudança, problema e incidente"]'::jsonb, 40),

  ('gmud-m7-a5', 5,
   'Em uma implantação de ERP, uma unidade de transporte é importada em produção fora da sequência em que foi criada. Qual é a consequência apontada no material?',
   '["O ambiente de qualidade precisa ser reconstruído a partir do zero antes de nova tentativa",
     "A importação é rejeitada automaticamente, e a inconsistência não chega a se estabelecer",
     "A inconsistência é de diagnóstico difícil, porque o sintoma aparece em objeto distinto do alterado",
     "Somente objetos de configuração são afetados, já que o código percorre outro caminho de autorização"]'::jsonb, 40),

  ('gmud-m7-a5', 6,
   'Uma mudança altera a regra de alçada na aprovação de requisições de compra. Segundo a tabela de business drivers, qual é o indicador em risco e o efeito de uma falha?',
   '["Tempo de ciclo da requisição; fila de aprovação parada e compra emergencial mais cara",
     "Valor faturado no dia; interrupção da emissão e receita reconhecida com atraso",
     "Pedidos entregues no prazo; atraso de entrega e penalidade prevista em contrato",
     "Conflitos de acesso apurados; ressalva em auditoria e exposição regulatória"]'::jsonb, 40),

  ('gmud-m7-a5', 7,
   'Duas semanas após a virada, os usuários reconhecem a razão da mudança e sabem explicar o procedimento novo, mas erram ao executá-lo na operação real. Em que etapa a transição se interrompeu e qual é a intervenção indicada?',
   '["Consciência da necessidade; comunicação que apresente a razão da mudança",
     "Conhecimento sobre como operar; treinamento conduzido sobre o processo",
     "Reforço da prática; celebração dos resultados já alcançados pela equipe",
     "Capacidade demonstrada na execução; acompanhamento durante a operação real"]'::jsonb, 40),

  ('gmud-m7-a5', 8,
   'Um relatório do período mostra tempo de ciclo em queda, taxa de sucesso também em queda e aumento dos retornos acionados. O que a combinação indica?',
   '["O rito ganhou eficiência sem qualquer perda de proteção sobre a operação",
     "A avaliação de risco e o teste em qualidade não acompanham o ritmo de autorização",
     "A proporção de mudanças emergenciais caiu, e com ela o risco assumido no período",
     "O tempo de restabelecimento melhorou, pela maturidade adquirida no plano de retorno"]'::jsonb, 40)
  returning id, ordem
)
insert into quiz_answer_key (question_id, correta, explicacao)
select n.id, g.correta, g.explicacao
  from novas n
  join (values
    (1, 2, 'A categoria padrão exige procedimento documentado, baixo risco e resultado conhecido — nada disso se aplica. A urgência não converte a mudança em padrão: ela aciona o rito emergencial, cujo registro completo é lavrado depois.'),
    (2, 0, 'Abrangência e reversibilidade, no caso, são favoráveis. O que eleva a avaliação é o momento: proximidade de fechamento contábil, pico sazonal ou auditoria em curso.'),
    (3, 3, 'É a última das sete perguntas do roteiro e a mais negligenciada. Duas mudanças corretas, na mesma janela e sobre o mesmo componente, produzem efeito que nenhuma delas produziria isoladamente.'),
    (4, 1, 'O incidente é a interrupção não planejada, cujo objetivo é restabelecer no menor tempo, ainda que por contorno. O problema agrupa incidentes de mesma origem e investiga a causa. A mudança implementa a solução definitiva sob autorização.'),
    (5, 2, 'Os objetos são aplicados na mesma ordem em que foram criados. Fora de sequência, o sintoma se manifesta em objeto distinto do que foi alterado, o que torna o diagnóstico difícil.'),
    (6, 0, 'A alçada de aprovação pertence ao processo de compras, cujo driver é o custo operacional. O indicador é o tempo de ciclo da requisição; a falha para a fila e encarece a compra por urgência.'),
    (7, 3, 'Há consciência e há conhecimento: o que falta é a capacidade demonstrada na execução real. A etapa em que a transição se interrompe indica a intervenção — acompanhamento, neste caso, e não nova comunicação ou novo treinamento.'),
    (8, 1, 'Retornos acionados revelam a adequação do teste em ambiente de qualidade. Ciclo mais curto com sucesso menor e mais retornos indica autorização mais rápida do que a avaliação sustenta.')
  ) as g(ordem, correta, explicacao) on g.ordem = n.ordem;

select count(*) || ' perguntas carregadas' as resultado
  from quiz_questions where session_slug = 'gmud-m7-a5';
