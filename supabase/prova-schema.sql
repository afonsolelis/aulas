-- =====================================================================
-- Prova escrita — tabelas, RLS e função de abertura
-- Projeto: lcyxqwdgsrbcpecqyqje
--
-- Avaliação somativa aplicada no papel. O enunciado é projetado no slide
-- e o aluno escreve à mão, sem computador e sem celular. O banco existe
-- por um motivo único: manter o enunciado fora do alcance da turma até o
-- momento em que o professor o projeta.
--
-- Por que o enunciado não pode morar no HTML do deck: o repositório é
-- público (github.com/afonsolelis/aulas). Qualquer texto versionado é
-- legível dias antes da aula, e o mesmo vale para o SQL que popula estas
-- tabelas. Por isso o conteúdo de cada prova mora em supabase/private/,
-- que o .gitignore exclui, e apenas este esqueleto é versionado.
--
-- Desenho de acesso, mais restritivo que o do quiz e o do TBL, porque
-- aqui não há nada que a turma possa ler antes:
--   prova_provas       comando da prova. Nunca legível por chamada direta.
--   prova_partes       partes do comando. Idem.
--   prova_host_tokens  hash SHA-256 do token do professor. O valor em
--                      claro não existe no banco, não existe no git e não
--                      existe no HTML.
--   prova_aberturas    registro de cada tentativa de abertura, que serve
--                      ao limite de tentativas e à auditoria posterior.
--   Nenhuma tabela tem policy. Nenhuma é legível pela chave publicável.
--
-- Todo o acesso passa por prova_abrir(slug, token), security definer, que
-- confere o hash antes de devolver qualquer texto.
--
-- ATENÇÃO: este arquivo começa por "drop table cascade" e destrói provas,
-- partes, tokens e o registro de aberturas. Só se aplica a banco novo ou
-- quando se quer recomeçar. O conteúdo vem depois, do arquivo privado.
--
-- Ordem de aplicação:
--   prova-schema.sql → supabase/private/prova-<módulo>-lesson-<n>.sql
-- =====================================================================

drop function if exists prova_abrir(text,text);
drop table if exists prova_aberturas   cascade;
drop table if exists prova_partes      cascade;
drop table if exists prova_host_tokens cascade;
drop table if exists prova_provas      cascade;

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------

-- A prova. O comando é único e dissertativo; as partes o dividem.
create table prova_provas (
  slug        text primary key,
  titulo      text        not null,
  contexto    text        not null default '',  -- cenário comum a todas as partes
  comando     text        not null,             -- o que se pede, em uma frase
  regras      jsonb       not null default '[]'::jsonb,  -- array de strings
  duracao_min int         not null default 60,
  criada_em   timestamptz not null default now()
);

-- Cada parte do comando. rotulo é a letra projetada no slide.
create table prova_partes (
  prova_slug text    not null references prova_provas(slug) on delete cascade,
  ordem      int     not null,
  rotulo     text    not null,
  titulo     text    not null,
  enunciado  text    not null,
  peso       numeric not null default 1,
  primary key (prova_slug, ordem)
);

-- Token do professor, guardado como hash. Conferir um hash dispensa
-- guardar o segredo: o banco comprova a posse sem nunca conhecer o valor.
create table prova_host_tokens (
  prova_slug  text primary key references prova_provas(slug) on delete cascade,
  token_hash  text        not null,
  criado_em   timestamptz not null default now()
);

-- Toda tentativa de abertura fica registrada, tenha ela acertado o token
-- ou não. Serve a dois fins: limitar a força bruta contra prova_abrir, que
-- é executável por anon, e permitir conferir depois a que horas a prova
-- foi projetada.
create table prova_aberturas (
  id         bigint generated always as identity primary key,
  prova_slug text        not null,
  ok         boolean     not null,
  em         timestamptz not null default now()
);

create index prova_aberturas_janela on prova_aberturas (prova_slug, em desc);

-- ---------------------------------------------------------------------
-- RLS — negar por omissão, sem exceção
-- ---------------------------------------------------------------------
-- Diferente do quiz e do TBL, aqui não há tabela de estado a publicar: o
-- aluno não tem aparelho na mão e nada precisa chegar ao navegador dele.
-- Nenhuma policy é criada, e portanto nenhuma linha é legível pela chave
-- publicável.

alter table prova_provas      enable row level security;
alter table prova_partes      enable row level security;
alter table prova_host_tokens enable row level security;
alter table prova_aberturas   enable row level security;

-- Reforço explícito sobre os grants amplos que o Supabase concede ao
-- schema public. A RLS já bloquearia; isto torna a intenção inequívoca.
revoke all on prova_provas      from anon, authenticated;
revoke all on prova_partes      from anon, authenticated;
revoke all on prova_host_tokens from anon, authenticated;
revoke all on prova_aberturas   from anon, authenticated;

-- ---------------------------------------------------------------------
-- Abertura da prova
-- ---------------------------------------------------------------------
-- Único caminho de leitura do enunciado. Confere o hash do token, registra
-- a tentativa e só então devolve o texto.
--
-- Limite de tentativas: oito falhas em cinco minutos recusam as tentativas
-- erradas seguintes. A função é executável por anon e a credencial é uma
-- string; sem limite, a força bruta correria solta e em silêncio.
--
-- O token correto é conferido antes do limite, e nunca é recusado por ele.
-- A ordem inversa criaria uma negação de serviço contra a própria aula:
-- oito chutes errados, de qualquer origem, impediriam o professor de
-- projetar a prova na hora marcada.
--
-- A recusa volta como dado, em jsonb com "ok": false, e não como exceção.
-- Uma exceção desfaz a transação, e com ela o registro da tentativa: o
-- contador de falhas nunca subiria e a trava jamais fecharia.
create or replace function prova_abrir(p_slug text, p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_falhas int;
  v_hash   text;
  v_prova  prova_provas%rowtype;
begin
  if p_token is null or length(trim(p_token)) = 0 then
    return jsonb_build_object('ok', false, 'erro', 'Token do professor inválido.');
  end if;

  v_hash := encode(sha256(convert_to(trim(p_token), 'utf8')), 'hex');

  select * into v_prova from prova_provas where slug = p_slug;

  if not found
     or not exists (select 1 from prova_host_tokens
                     where prova_slug = p_slug and token_hash = v_hash) then
    insert into prova_aberturas (prova_slug, ok) values (p_slug, false);

    select count(*) into v_falhas
      from prova_aberturas
     where prova_slug = p_slug
       and not ok
       and em > now() - interval '5 minutes';

    if v_falhas >= 8 then
      return jsonb_build_object('ok', false,
                                'erro', 'Muitas tentativas. Aguarde cinco minutos.');
    end if;

    return jsonb_build_object('ok', false, 'erro', 'Token do professor inválido.');
  end if;

  insert into prova_aberturas (prova_slug, ok) values (p_slug, true);

  return jsonb_build_object(
    'ok',       true,
    'titulo',   v_prova.titulo,
    'contexto', v_prova.contexto,
    'comando',  v_prova.comando,
    'regras',   v_prova.regras,
    'duracao',  v_prova.duracao_min,
    'partes',  (select coalesce(jsonb_agg(jsonb_build_object(
                         'rotulo',    p.rotulo,
                         'titulo',    p.titulo,
                         'enunciado', p.enunciado,
                         'peso',      p.peso) order by p.ordem), '[]'::jsonb)
                  from prova_partes p where p.prova_slug = p_slug));
end $$;

-- ---------------------------------------------------------------------
-- Permissões
-- ---------------------------------------------------------------------
revoke all on function prova_abrir(text,text) from public;
grant execute on function prova_abrir(text,text) to anon, authenticated;
