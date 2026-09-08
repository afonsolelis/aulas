-- =====================================================================
-- Quiz ao vivo — funções (RPCs) e colunas de comportamento
--
-- Separado de quiz-schema.sql porque aquele arquivo começa por
-- "drop table cascade" e não pode ser reaplicado a um banco em uso.
-- Este é idempotente e não destrói dado algum: acrescenta colunas com
-- "if not exists" e substitui funções com "create or replace". É o
-- arquivo a aplicar quando a lógica muda com a sala já criada.
--
-- Ordem de aplicação num banco novo:
--   quiz-schema.sql → quiz-funcoes.sql → quiz-relatorio.sql
--   → quiz-ingestao.sql → quiz-seed-lesson-N.sql
--
-- Decisões de comportamento registradas aqui:
--   1. A pergunta fecha sozinha quando o tempo acaba. O servidor é quem
--      decide, não o navegador do professor: qualquer chamada de RPC
--      posterior ao prazo vira o estado para 'revelacao', e o Realtime
--      leva o resultado a todos os aparelhos.
--   2. Cada questão tem peso. A última do quiz vale o dobro, o que
--      mantém a disputa aberta até o fim e é declarado ao estudante.
--   3. As perguntas podem ser publicadas depois do encontro, com
--      gabarito e explicação, para estudo. Enquanto não publicadas, o
--      gabarito não sai do banco.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Colunas de comportamento
-- ---------------------------------------------------------------------

-- Multiplicador da pontuação da questão. A última do quiz recebe 2.
alter table quiz_questions add column if not exists peso int not null default 1;

-- Liberação das perguntas com gabarito para estudo posterior ao encontro.
alter table quiz_sessions add column if not exists publicado boolean not null default false;

-- ---------------------------------------------------------------------
-- Fechamento automático da pergunta expirada
--
-- Chamada no início de quiz_estado e de quiz_host. Assim o fim do tempo
-- não depende de o professor clicar: o primeiro cliente que consultar o
-- estado após o prazo provoca a virada, e a alteração de quiz_sessions
-- é replicada pelo Realtime para a turma inteira.
-- ---------------------------------------------------------------------
create or replace function quiz_fechar_expirada(p_slug text)
returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_s record; v_seg int;
begin
  select * into v_s from quiz_sessions where slug = p_slug;
  if v_s.slug is null or v_s.estado <> 'pergunta' or v_s.aberta_em is null then
    return false;
  end if;

  select segundos into v_seg from quiz_questions
   where session_slug = p_slug and ordem = v_s.pergunta_atual;
  if v_seg is null then return false; end if;

  if now() < v_s.aberta_em + make_interval(secs => v_seg) then
    return false;
  end if;

  update quiz_sessions set estado = 'revelacao'
   where slug = p_slug and estado = 'pergunta';
  return true;
end $$;

-- ---------------------------------------------------------------------
-- Cadastro do aluno. Devolve o uuid, que é a credencial dele daí em diante.
-- ---------------------------------------------------------------------
create or replace function quiz_entrar(p_slug text, p_nome text)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_nome text; v_id uuid;
begin
  v_nome := btrim(regexp_replace(coalesce(p_nome,''), '\s+', ' ', 'g'));

  if char_length(v_nome) < 2 or char_length(v_nome) > 24 then
    return jsonb_build_object('ok', false, 'erro', 'O nome deve ter entre 2 e 24 caracteres.');
  end if;

  if not exists (select 1 from quiz_sessions where slug = p_slug) then
    return jsonb_build_object('ok', false, 'erro', 'Sessão inexistente.');
  end if;

  if exists (select 1 from quiz_players
              where session_slug = p_slug and lower(nome) = lower(v_nome)) then
    return jsonb_build_object('ok', false, 'erro', 'Esse nome já está em uso nesta sala. Escolha outro.');
  end if;

  insert into quiz_players (session_slug, nome) values (p_slug, v_nome)
  returning id into v_id;

  return jsonb_build_object('ok', true, 'player_id', v_id, 'nome', v_nome);
end $$;

-- ---------------------------------------------------------------------
-- Registro da resposta. Não informa se acertou: o veredito aparece apenas
-- na revelação, o que impede repassar gabarito à turma.
--
-- A resposta posterior ao prazo é recusada. A tolerância de um segundo
-- cobre a latência entre o toque no aparelho e a chegada ao servidor.
-- ---------------------------------------------------------------------
create or replace function quiz_responder(p_player uuid, p_escolha int)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_slug text; v_q record; v_s record;
  v_ms int; v_correta bool; v_pontos int; v_fracao numeric;
begin
  select session_slug into v_slug from quiz_players where id = p_player;
  if v_slug is null then
    return jsonb_build_object('ok', false, 'erro', 'Jogador não encontrado. Entre novamente.');
  end if;

  perform quiz_fechar_expirada(v_slug);

  select * into v_s from quiz_sessions where slug = v_slug;
  if v_s.estado <> 'pergunta' then
    return jsonb_build_object('ok', false, 'erro', 'A pergunta não está aberta.');
  end if;

  select q.*, k.correta as gabarito into v_q
    from quiz_questions q join quiz_answer_key k on k.question_id = q.id
   where q.session_slug = v_slug and q.ordem = v_s.pergunta_atual;

  if v_q.id is null then
    return jsonb_build_object('ok', false, 'erro', 'Pergunta não encontrada.');
  end if;

  if now() > v_s.aberta_em + make_interval(secs => v_q.segundos + 1) then
    return jsonb_build_object('ok', false, 'erro', 'O tempo desta pergunta terminou.');
  end if;

  if p_escolha < 0 or p_escolha >= jsonb_array_length(v_q.alternativas) then
    return jsonb_build_object('ok', false, 'erro', 'Alternativa inválida.');
  end if;

  if exists (select 1 from quiz_answers
              where player_id = p_player and question_id = v_q.id) then
    return jsonb_build_object('ok', false, 'erro', 'Você já respondeu esta pergunta.');
  end if;

  -- Relógio do servidor. O tempo informado pelo cliente é ignorado.
  v_ms := greatest(0, (extract(epoch from (now() - v_s.aberta_em)) * 1000)::int);
  v_correta := (p_escolha = v_q.gabarito);

  if v_correta then
    v_fracao := greatest(0, 1 - (v_ms / 1000.0) / v_q.segundos);
    -- Acerto vale 600, a rapidez soma até 400, e o peso multiplica o total.
    v_pontos := round((600 + 400 * v_fracao) * coalesce(v_q.peso, 1));
  else
    v_pontos := 0;
  end if;

  insert into quiz_answers (player_id, question_id, escolha, correta, pontos, ms)
  values (p_player, v_q.id, p_escolha, v_correta, v_pontos, v_ms);

  return jsonb_build_object('ok', true, 'registrada', true, 'ms', v_ms);
end $$;

-- ---------------------------------------------------------------------
-- Visão do aluno: uma chamada devolve tudo que a tela precisa, e nada além.
-- O gabarito entra na resposta somente quando o estado é 'revelacao'.
-- ---------------------------------------------------------------------
create or replace function quiz_estado(p_slug text, p_player uuid default null)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_s record; v_q record; v_total int; v_out jsonb;
  v_minha record; v_nome text;
begin
  if not exists (select 1 from quiz_sessions where slug = p_slug) then
    return jsonb_build_object('ok', false, 'erro', 'Sessão inexistente.');
  end if;

  perform quiz_fechar_expirada(p_slug);

  select * into v_s from quiz_sessions where slug = p_slug;
  select count(*) into v_total from quiz_questions where session_slug = p_slug;

  if p_player is not null then
    select nome into v_nome from quiz_players
     where id = p_player and session_slug = p_slug;
  end if;

  v_out := jsonb_build_object(
    'ok', true,
    'estado', v_s.estado,
    'titulo', v_s.titulo,
    'ordem', v_s.pergunta_atual,
    'total', v_total,
    'ultima', (v_s.pergunta_atual >= v_total and v_total > 0),
    'publicado', coalesce(v_s.publicado, false),
    'aberta_em', v_s.aberta_em,
    'servidor_agora', now(),
    'nome', v_nome,
    'jogadores', (select count(*) from quiz_players where session_slug = p_slug)
  );

  -- Enunciado e alternativas da pergunta corrente, sem o gabarito.
  if v_s.estado in ('pergunta','revelacao') then
    select q.id, q.enunciado, q.alternativas, q.segundos, q.peso into v_q
      from quiz_questions q
     where q.session_slug = p_slug and q.ordem = v_s.pergunta_atual;

    v_out := v_out || jsonb_build_object('pergunta', jsonb_build_object(
      'id', v_q.id, 'enunciado', v_q.enunciado,
      'alternativas', v_q.alternativas, 'segundos', v_q.segundos,
      'peso', coalesce(v_q.peso, 1)));

    if p_player is not null then
      select escolha, correta, pontos into v_minha
        from quiz_answers where player_id = p_player and question_id = v_q.id;
      v_out := v_out || jsonb_build_object('respondi', v_minha.escolha is not null,
                                           'minha_escolha', v_minha.escolha);
    end if;
  end if;

  -- Gabarito: exposto só na revelação, junto do resultado individual.
  if v_s.estado = 'revelacao' then
    v_out := v_out || jsonb_build_object('gabarito', (
      select jsonb_build_object('correta', k.correta, 'explicacao', k.explicacao)
        from quiz_answer_key k where k.question_id = v_q.id));

    -- Distribuição das escolhas: a turma discute sobre o que de fato marcou.
    v_out := v_out || jsonb_build_object('distribuicao', coalesce((
      select jsonb_object_agg(escolha::text, n) from (
        select escolha, count(*)::int as n from quiz_answers
         where question_id = v_q.id group by escolha) d), '{}'::jsonb));

    if p_player is not null then
      v_out := v_out || jsonb_build_object(
        'acertei', coalesce(v_minha.correta, false),
        'pontos_rodada', coalesce(v_minha.pontos, 0),
        'total_respostas', (select count(*) from quiz_answers where question_id = v_q.id));
    end if;
  end if;

  -- Encerrada a sessão, cada um recebe os temas em que errou, para orientar
  -- a retomada do estudo. É o recorte individual do relatório do professor.
  if v_s.estado = 'encerrado' and p_player is not null then
    v_out := v_out || jsonb_build_object('meus_temas', coalesce((
      select jsonb_agg(distinct jsonb_build_object('tema', q.tema, 'secao', q.secao))
        from quiz_answers a
        join quiz_questions q on q.id = a.question_id
       where a.player_id = p_player and not a.correta and q.tema is not null),
      '[]'::jsonb));
  end if;

  -- Placar acumulado: público por natureza, e é o que se projeta na sala.
  if v_s.estado in ('revelacao','encerrado') then
    v_out := v_out || jsonb_build_object('ranking', coalesce((
      select jsonb_agg(r) from (
        select p.nome,
               coalesce(sum(a.pontos), 0)::int                       as pontos,
               coalesce(count(a.question_id) filter (where a.correta), 0)::int  as acertos,
               (p.id = p_player)                                     as eu
          from quiz_players p
          left join quiz_answers a on a.player_id = p.id
         where p.session_slug = p_slug
         group by p.id, p.nome
         order by pontos desc, acertos desc, p.nome
         limit 50
      ) r), '[]'::jsonb));
  end if;

  return v_out;
end $$;

-- ---------------------------------------------------------------------
-- Painel do professor. O token é verificado aqui dentro e nunca trafega de volta.
-- ---------------------------------------------------------------------
create or replace function quiz_host(p_slug text, p_token text, p_acao text default 'ver')
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_ok bool; v_s record; v_total int; v_out jsonb; v_qid bigint;
        v_arquivadas int := 0;
begin
  select exists (select 1 from quiz_host_tokens
                  where session_slug = p_slug and token = p_token) into v_ok;
  if not v_ok then
    return jsonb_build_object('ok', false, 'erro', 'Token do professor inválido.');
  end if;

  -- Antes de qualquer ação: o tempo esgotado já fecha a pergunta.
  perform quiz_fechar_expirada(p_slug);

  select * into v_s from quiz_sessions where slug = p_slug;
  select count(*) into v_total from quiz_questions where session_slug = p_slug;

  case p_acao
    when 'ver' then
      null;   -- somente leitura

    when 'abrir' then
      -- Abre a pergunta seguinte, ou a primeira se ainda estamos no lobby.
      update quiz_sessions
         set estado = 'pergunta',
             pergunta_atual = least(greatest(v_s.pergunta_atual, 0) + 1, v_total),
             aberta_em = now()
       where slug = p_slug;

    when 'reabrir' then
      -- Reabre a pergunta corrente, para quando a rede da sala oscila.
      update quiz_sessions set estado = 'pergunta', aberta_em = now() where slug = p_slug;

    when 'revelar' then
      update quiz_sessions set estado = 'revelacao' where slug = p_slug;

    when 'encerrar' then
      update quiz_sessions set estado = 'encerrado' where slug = p_slug;

    when 'publicar' then
      -- Libera enunciado, gabarito e explicação para estudo posterior.
      update quiz_sessions set publicado = true where slug = p_slug;

    when 'despublicar' then
      update quiz_sessions set publicado = false where slug = p_slug;

    when 'reiniciar' then
      -- Arquiva antes de apagar: o reinício deixa de destruir o resultado da
      -- turma e passa a acumulá-lo em quiz_relatorios. Nada é gravado quando
      -- não há resposta, para não poluir a série com reinícios de teste.
      v_arquivadas := quiz_arquivar(p_slug);

      delete from quiz_answers
       where player_id in (select id from quiz_players where session_slug = p_slug);
      delete from quiz_players where session_slug = p_slug;
      update quiz_sessions
         set estado = 'lobby', pergunta_atual = 0, aberta_em = null
       where slug = p_slug;

    else
      return jsonb_build_object('ok', false, 'erro', 'Ação desconhecida.');
  end case;

  select * into v_s from quiz_sessions where slug = p_slug;
  select id into v_qid from quiz_questions
   where session_slug = p_slug and ordem = v_s.pergunta_atual;

  v_out := jsonb_build_object(
    'ok', true,
    'estado', v_s.estado,
    'titulo', v_s.titulo,
    'arquivadas', v_arquivadas,
    'ordem', v_s.pergunta_atual,
    'total', v_total,
    'ultima', (v_s.pergunta_atual >= v_total and v_total > 0),
    'publicado', coalesce(v_s.publicado, false),
    'aberta_em', v_s.aberta_em,
    'servidor_agora', now(),
    'jogadores', (select count(*) from quiz_players where session_slug = p_slug),
    'nomes', coalesce((select jsonb_agg(nome order by criado_em desc)
                         from quiz_players where session_slug = p_slug), '[]'::jsonb),
    'respostas', coalesce((select count(*) from quiz_answers where question_id = v_qid), 0)
  );

  -- O professor vê enunciado, gabarito e distribuição para conduzir a discussão.
  if v_qid is not null then
    v_out := v_out || jsonb_build_object('pergunta', (
      select jsonb_build_object('enunciado', q.enunciado, 'alternativas', q.alternativas,
                                'segundos', q.segundos, 'peso', coalesce(q.peso, 1),
                                'correta', k.correta, 'explicacao', k.explicacao,
                                'tema', q.tema, 'secao', q.secao)
        from quiz_questions q join quiz_answer_key k on k.question_id = q.id
       where q.id = v_qid));

    v_out := v_out || jsonb_build_object('distribuicao', coalesce((
      select jsonb_object_agg(escolha::text, n) from (
        select escolha, count(*)::int as n from quiz_answers
         where question_id = v_qid group by escolha) d), '{}'::jsonb));
  end if;

  v_out := v_out || jsonb_build_object('ranking', coalesce((
    select jsonb_agg(r) from (
      select p.nome,
             coalesce(sum(a.pontos), 0)::int                      as pontos,
             coalesce(count(a.question_id) filter (where a.correta), 0)::int as acertos
        from quiz_players p
        left join quiz_answers a on a.player_id = p.id
       where p.session_slug = p_slug
       group by p.id, p.nome
       order by pontos desc, acertos desc, p.nome
       limit 50
    ) r), '[]'::jsonb));

  return v_out;
end $$;

-- ---------------------------------------------------------------------
-- Perguntas publicadas para estudo.
--
-- Enquanto a sessão não é publicada pelo professor, o gabarito não sai do
-- banco: a função devolve apenas o aviso de que a publicação não ocorreu.
-- ---------------------------------------------------------------------
create or replace function quiz_perguntas(p_slug text)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_s record;
begin
  select * into v_s from quiz_sessions where slug = p_slug;
  if v_s.slug is null then
    return jsonb_build_object('ok', false, 'erro', 'Sessão inexistente.');
  end if;

  if not coalesce(v_s.publicado, false) then
    return jsonb_build_object('ok', true, 'publicado', false, 'titulo', v_s.titulo);
  end if;

  return jsonb_build_object(
    'ok', true, 'publicado', true, 'titulo', v_s.titulo,
    'perguntas', coalesce((
      select jsonb_agg(jsonb_build_object(
               'ordem', q.ordem, 'enunciado', q.enunciado,
               'alternativas', q.alternativas, 'correta', k.correta,
               'explicacao', k.explicacao, 'tema', q.tema, 'secao', q.secao,
               'peso', coalesce(q.peso, 1)) order by q.ordem)
        from quiz_questions q
        join quiz_answer_key k on k.question_id = q.id
       where q.session_slug = p_slug), '[]'::jsonb));
end $$;

-- ---------------------------------------------------------------------
-- Grants. quiz_fechar_expirada não é exposta: é chamada de dentro das
-- outras funções, que já rodam como security definer.
-- ---------------------------------------------------------------------
revoke all on function quiz_fechar_expirada(text)   from public;
revoke all on function quiz_entrar(text,text)       from public;
revoke all on function quiz_responder(uuid,int)     from public;
revoke all on function quiz_estado(text,uuid)       from public;
revoke all on function quiz_host(text,text,text)    from public;
revoke all on function quiz_perguntas(text)         from public;
grant execute on function quiz_entrar(text,text)    to anon, authenticated;
grant execute on function quiz_responder(uuid,int)  to anon, authenticated;
grant execute on function quiz_estado(text,uuid)    to anon, authenticated;
grant execute on function quiz_host(text,text,text) to anon, authenticated;
grant execute on function quiz_perguntas(text)      to anon, authenticated;
