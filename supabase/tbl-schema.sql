-- =====================================================================
-- TBL ao vivo — tabelas, RLS e Realtime
-- Projeto: lcyxqwdgsrbcpecqyqje
--
-- Dinâmica de aprendizagem baseada em equipes (Team-Based Learning) sobre
-- um caso único, percorrido por uma sequência de questões. Cada questão
-- trata de uma categoria de exceção fora do caminho feliz — regra de
-- negócio incompleta, infraestrutura, segurança por fraude ou imprecisão,
-- não repúdio e usabilidade — e apresenta quatro táticas com ganho e custo
-- declarados. Nenhuma é correta: o que se mede é o deslocamento das
-- escolhas entre a decisão individual e a decisão posterior à discussão.
--
-- Cada questão percorre quatro fases: voto1, discussao, voto2 e sintese.
-- Uma questão pode trazer um dado novo, liberado apenas quando a discussão
-- é aberta pelo professor.
--
-- Desenho de acesso, mais restritivo que o do quiz:
--   tbl_sessions   legível pela API, porque guarda apenas fase, questão
--                  corrente e prazo. É o que permite ao Realtime virar a
--                  tela da turma.
--   tbl_casos      o contexto comum do caso, entregue por RPC.
--   tbl_questoes   enunciado, alternativas e dado novo de cada questão.
--                  Nunca é legível por chamada direta: tbl_estado entrega
--                  somente a questão corrente, e o dado novo somente
--                  depois de a discussão ser aberta. Sem esta separação, o
--                  aluno leria as questões seguintes antes da hora.
--   demais tabelas RLS habilitada e nenhuma policy.
--
-- ATENÇÃO: este arquivo começa por "drop table cascade" e destrói sala,
-- token, caso, questões, participantes e votos. Só se aplica a banco novo.
-- Para alterar a lógica de um banco em uso, aplique tbl-funcoes.sql, que é
-- idempotente e não destrói dado.
--
-- Ordem de aplicação num banco novo:
--   tbl-schema.sql → tbl-funcoes.sql → tbl-seed-m8-lesson-1.sql
-- =====================================================================

drop table if exists tbl_votos         cascade;
drop table if exists tbl_participantes cascade;
drop table if exists tbl_reviravoltas  cascade;
drop table if exists tbl_questoes      cascade;
drop table if exists tbl_casos         cascade;
drop table if exists tbl_host_tokens   cascade;
drop table if exists tbl_sessions      cascade;

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------

-- Estado da sala. Deliberadamente sem enunciado e sem alternativas, para
-- que possa ser lida por todos e replicada pelo Realtime sem antecipar
-- conteúdo algum ao aluno.
--
-- Fases de cada questão:
--   lobby     sala aberta, leitura do caso liberada, votação fechada
--   voto1     decisão individual, sem informação sobre a turma
--   discussao distribuição e justificativas à vista, votação fechada;
--             é quando o dado novo da questão, se houver, é liberado
--   voto2     segunda decisão, após a discussão
--   sintese   fechamento da questão, com as duas distribuições e a
--             trajetória das mudanças
--   revelacao consolidado de todas as questões, ao final da sequência
create table tbl_sessions (
  slug            text primary key,
  titulo          text not null,
  fase            text not null default 'lobby'
                  check (fase in ('lobby','voto1','discussao','voto2','sintese','revelacao')),
  -- Questão corrente da sequência. A passagem de uma questão à seguinte é
  -- ato do professor, como a passagem de fase.
  questao         smallint not null default 1 check (questao >= 1),
  -- Instante em que o prazo da fase se encerra. O prazo fecha a votação,
  -- e não avança a fase: a passagem de uma fase à seguinte é sempre ato
  -- do professor, para que a discussão presencial não seja atropelada
  -- pelo relógio.
  fase_termina_em timestamptz,
  aberta_em       timestamptz,
  criada_em       timestamptz not null default now()
);

-- Segredo do professor, isolado da tabela de estado justamente para que
-- tbl_sessions possa ser pública. O valor é o mesmo QUIZ_HOST_TOKEN do
-- .env, cadastrado também aqui para cada sala.
create table tbl_host_tokens (
  session_slug text primary key references tbl_sessions(slug) on delete cascade,
  token        text not null
);

-- Contexto comum do caso, válido para todas as questões da sala.
create table tbl_casos (
  session_slug  text primary key references tbl_sessions(slug) on delete cascade,
  caso_titulo   text  not null,
  caso_texto    text  not null,
  contexto      jsonb not null default '[]'::jsonb   -- indicadores projetados em sala
);

-- As questões da sequência. Cada alternativa é um objeto com letra,
-- titulo, tatica, texto, ganho e custo. O dado novo, quando existe, traz
-- titulo, texto e evidencias, e só é entregue a partir da discussão.
create table tbl_questoes (
  session_slug  text     not null references tbl_sessions(slug) on delete cascade,
  ordem         smallint not null check (ordem >= 1),
  categoria     text     not null,
  titulo        text     not null,
  pergunta      text     not null,
  alternativas  jsonb    not null
                check (jsonb_typeof(alternativas) = 'array'
                       and jsonb_array_length(alternativas) = 4),
  dado_novo     jsonb,
  primary key (session_slug, ordem)
);

-- O id do participante é a credencial dele: fica no localStorage do
-- aparelho e é o que autoriza votar. Por isso a tabela não é legível.
create table tbl_participantes (
  id           uuid primary key default gen_random_uuid(),
  session_slug text not null references tbl_sessions(slug) on delete cascade,
  nome         text not null,
  entrou_em    timestamptz not null default now(),
  visto_em     timestamptz not null default now()
);

create unique index tbl_participantes_nome_unico
  on tbl_participantes (session_slug, lower(nome));

-- Uma linha por participante, questão e rodada. A escolha pode ser
-- alterada enquanto a rodada estiver aberta; a justificativa acompanha a
-- escolha.
create table tbl_votos (
  session_slug    text     not null references tbl_sessions(slug) on delete cascade,
  participante_id uuid     not null references tbl_participantes(id) on delete cascade,
  questao         smallint not null check (questao >= 1),
  rodada          smallint not null check (rodada in (1,2)),
  escolha         smallint not null check (escolha between 0 and 3),
  justificativa   text     not null default '',
  votado_em       timestamptz not null default now(),
  primary key (session_slug, participante_id, questao, rodada)
);

create index tbl_votos_questao on tbl_votos (session_slug, questao, rodada);

-- ---------------------------------------------------------------------
-- RLS — negar por omissão
-- ---------------------------------------------------------------------

alter table tbl_sessions      enable row level security;
alter table tbl_host_tokens   enable row level security;
alter table tbl_casos         enable row level security;
alter table tbl_questoes      enable row level security;
alter table tbl_participantes enable row level security;
alter table tbl_votos         enable row level security;

-- A única policy do esquema. Sem ela o Realtime não entrega a virada de
-- fase ao anon.
create policy sessions_leitura on tbl_sessions
  for select to anon, authenticated using (true);

-- Reforço explícito sobre os grants amplos que o Supabase concede ao
-- schema public. A RLS já bloquearia; isto torna a intenção inequívoca.
revoke all on tbl_host_tokens   from anon, authenticated;
revoke all on tbl_casos         from anon, authenticated;
revoke all on tbl_questoes      from anon, authenticated;
revoke all on tbl_participantes from anon, authenticated;
revoke all on tbl_votos         from anon, authenticated;

-- ---------------------------------------------------------------------
-- Realtime: a virada de fase chega ao aparelho do aluno sem espera.
-- Apenas tbl_sessions, a única tabela sem conteúdo reservado.
-- ---------------------------------------------------------------------
-- A exceção de objeto inexistente cobre a aplicação do script em um Postgres
-- sem a publicação do Supabase, como o usado para verificar o esquema.
do $$
begin
  alter publication supabase_realtime add table tbl_sessions;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

-- As funções (RPCs) estão em tbl-funcoes.sql. Aplique-o em seguida.
