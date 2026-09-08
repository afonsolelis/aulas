-- =====================================================================
-- Quiz ao vivo — tabelas, RLS e Realtime
-- Projeto: lcyxqwdgsrbcpecqyqje
--
-- Desenho de acesso: apenas quiz_sessions é legível pela API, porque não
-- guarda segredo algum — é o que permite ao Realtime notificar os alunos.
-- Todas as outras tabelas têm RLS habilitada e NENHUMA policy: anon e
-- authenticated não leem nem escrevem uma linha delas por chamada direta.
-- Tudo passa pelas funções SECURITY DEFINER de quiz-funcoes.sql, que
-- devolvem veredito e placar, nunca gabarito nem credencial de outro
-- jogador.
--
-- ATENÇÃO: este arquivo começa por "drop table cascade" e destrói sessão,
-- token, questões e respostas. Só se aplica a banco novo. Para alterar a
-- lógica de um banco em uso, aplique quiz-funcoes.sql, que é idempotente
-- e não destrói dado.
--
-- Ordem de aplicação num banco novo:
--   quiz-schema.sql → quiz-funcoes.sql → quiz-relatorio.sql
--   → quiz-ingestao.sql → quiz-seed-lesson-N.sql
-- =====================================================================

drop table if exists quiz_answers      cascade;
drop table if exists quiz_answer_key   cascade;
drop table if exists quiz_questions    cascade;
drop table if exists quiz_players      cascade;
drop table if exists quiz_host_tokens  cascade;
drop table if exists quiz_sessions     cascade;

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------

-- Estado da sessão. Deliberadamente sem nenhum dado sigiloso, para que
-- possa ser lida por todos e replicada pelo Realtime.
create table quiz_sessions (
  slug            text primary key,
  titulo          text        not null,
  estado          text        not null default 'lobby'
                  check (estado in ('lobby','pergunta','revelacao','encerrado')),
  pergunta_atual  int         not null default 0,
  aberta_em       timestamptz,
  -- Libera as perguntas com gabarito para estudo depois do encontro.
  publicado       boolean     not null default false,
  criada_em       timestamptz not null default now()
);

-- Segredo do professor, isolado da tabela de estado justamente para que
-- quiz_sessions possa ser pública.
create table quiz_host_tokens (
  session_slug text primary key references quiz_sessions(slug) on delete cascade,
  token        text not null
);

create table quiz_questions (
  id           bigint generated always as identity primary key,
  session_slug text   not null references quiz_sessions(slug) on delete cascade,
  ordem        int    not null,
  enunciado    text   not null,
  alternativas jsonb  not null,
  segundos     int    not null default 90,
  peso         int    not null default 1,   -- multiplicador; a última vale 2
  tema         text,          -- assunto avaliado, usado no relatório
  secao        text,          -- seção do material de leitura correspondente
  unique (session_slug, ordem)
);

-- Gabarito. Nunca sai daqui a não ser como veredito calculado, ou depois
-- de o professor publicar as perguntas para estudo.
create table quiz_answer_key (
  question_id bigint primary key references quiz_questions(id) on delete cascade,
  correta     int  not null,
  explicacao  text
);

-- O id do jogador é a credencial dele: fica no localStorage do celular e
-- é o que autoriza responder. Por isso a tabela não é legível pela API.
create table quiz_players (
  id           uuid primary key default gen_random_uuid(),
  session_slug text not null references quiz_sessions(slug) on delete cascade,
  nome         text not null,
  criado_em    timestamptz not null default now()
);

-- Nome único por sessão, sem diferenciar maiúsculas.
create unique index quiz_players_nome_unico
  on quiz_players (session_slug, lower(nome));

create table quiz_answers (
  player_id     uuid   not null references quiz_players(id) on delete cascade,
  question_id   bigint not null references quiz_questions(id) on delete cascade,
  escolha       int    not null,
  correta       bool   not null,
  pontos        int    not null,
  ms            int    not null,
  respondida_em timestamptz not null default now(),
  primary key (player_id, question_id)   -- uma resposta por pergunta, sem troca
);

-- ---------------------------------------------------------------------
-- RLS — negar por omissão
-- ---------------------------------------------------------------------

alter table quiz_sessions    enable row level security;
alter table quiz_host_tokens enable row level security;
alter table quiz_questions   enable row level security;
alter table quiz_answer_key  enable row level security;
alter table quiz_players     enable row level security;
alter table quiz_answers     enable row level security;

-- A única policy do esquema. Sem ela o Realtime não entrega evento ao anon.
create policy sessions_leitura on quiz_sessions
  for select to anon, authenticated using (true);

-- Nenhuma policy de INSERT, UPDATE ou DELETE em tabela alguma: um aluno
-- não cria jogador, não lança ponto e não muda o estado por chamada direta.
-- Reforço explícito sobre os grants amplos que o Supabase concede ao
-- schema public — a RLS já bloquearia, isto torna a intenção inequívoca.
revoke all on quiz_answer_key  from anon, authenticated;
revoke all on quiz_host_tokens from anon, authenticated;
revoke all on quiz_players     from anon, authenticated;
revoke all on quiz_answers     from anon, authenticated;
revoke all on quiz_questions   from anon, authenticated;

-- ---------------------------------------------------------------------
-- Realtime: o aluno recebe a virada de estado sem precisar perguntar.
-- Apenas quiz_sessions, a única tabela sem conteúdo sigiloso.
-- ---------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table quiz_sessions;
exception when duplicate_object then null;
end $$;

-- As funções (RPCs) estão em quiz-funcoes.sql. Aplique-o em seguida.
