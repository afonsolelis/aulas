-- =====================================================================
-- Ingestão de relatórios do quiz
--
-- Reiniciar uma sala apaga jogadores e respostas. Esta tabela guarda o
-- resultado antes do apagamento, de modo que a série histórica das
-- turmas se acumule sem depender de alguém lembrar de exportar.
--
-- Três colunas, como área de recepção:
--   ts        instante do arquivamento, em unixtime (segundos)
--   data      linhas do relatório, no grão de uma resposta por estudante
--             e questão — de onde qualquer agregação pode ser refeita
--   data_tag  origem, no padrão ANO-TRIMESTRE-conteudo (2026-2A-gmud-m7-a5)
--
-- Rodar depois de quiz-schema.sql e quiz-relatorio.sql. Não destrói dado.
-- =====================================================================

-- Código do trimestre que cursou a sessão (2026-1A, 2026-2B, ...). Compõe a data_tag.
alter table quiz_sessions add column if not exists turma text;

create table if not exists quiz_relatorios (
  ts       bigint not null,
  data     jsonb  not null,
  data_tag text   not null,
  primary key (data_tag, ts)
);

comment on table quiz_relatorios is
  'Recepção dos relatórios de quiz arquivados no reinício da sala.';

-- Sem policy: o histórico não é legível pela chave publicável.
alter table quiz_relatorios enable row level security;
revoke all on quiz_relatorios from anon, authenticated;

create index if not exists quiz_relatorios_tag on quiz_relatorios (data_tag, ts desc);

-- ---------------------------------------------------------------------
-- Montagem das linhas de uma sessão, no grão de resposta.
-- Isolada em função própria para ser reaproveitada pelo arquivamento
-- automático e por uma exportação avulsa.
-- ---------------------------------------------------------------------
create or replace function quiz_linhas(p_slug text)
returns jsonb
language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(jsonb_agg(l order by l->>'nome', (l->>'ordem')::int), '[]'::jsonb)
    from (
      select jsonb_build_object(
               'nome', p.nome,
               'ordem', q.ordem,
               'tema', q.tema,
               'secao', q.secao,
               'enunciado', q.enunciado,
               'escolha', a.escolha,
               'correta', k.correta,
               'acertou', a.correta,
               'pontos', a.pontos,
               'ms', a.ms,
               'respondida_em', a.respondida_em
             ) as l
        from quiz_answers a
        join quiz_players p    on p.id = a.player_id
        join quiz_questions q  on q.id = a.question_id
        join quiz_answer_key k on k.question_id = q.id
       where p.session_slug = p_slug
    ) s;
$$;

-- ---------------------------------------------------------------------
-- Arquiva a sessão corrente. Devolve o número de linhas gravadas.
-- Nada grava quando não há resposta, para não poluir a série com
-- reinícios de teste.
-- ---------------------------------------------------------------------
create or replace function quiz_arquivar(p_slug text)
returns int
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_linhas jsonb; v_tag text; v_n int;
begin
  v_linhas := quiz_linhas(p_slug);
  v_n := jsonb_array_length(v_linhas);
  if v_n = 0 then return 0; end if;

  -- Padrão ANO-TRIMESTRE-conteudo, p. ex. "2026-2A-gmud-m7-a5". O código do
  -- trimestre vem de config/calendar.json e é gravado na sessão.
  select coalesce(turma, 'sem-trimestre') || '-' || p_slug into v_tag
    from quiz_sessions where slug = p_slug;

  insert into quiz_relatorios (ts, data, data_tag)
  values (extract(epoch from now())::bigint, v_linhas, v_tag)
  on conflict (data_tag, ts) do update set data = excluded.data;

  return v_n;
end $$;

revoke all on function quiz_linhas(text)   from public;
revoke all on function quiz_arquivar(text) from public;
