-- =====================================================================
-- Modelo de conteúdo de prova — copie para supabase/private/ antes de
-- escrever o enunciado.
--
-- supabase/private/ está no .gitignore. O repositório é público, e
-- qualquer enunciado versionado é legível pela turma antes da aula.
-- Este arquivo existe para registrar o formato; o texto real nunca
-- entra aqui.
--
--   cp supabase/prova-seed.example.sql \
--      supabase/private/prova-m<módulo>-lesson-<n>.sql
--
-- Aplicação, com o token vindo do .env e citado pelo próprio psql:
--   set -a; . ./.env; set +a
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
--        -v token="$PROVA_HOST_TOKEN" \
--        -f supabase/private/prova-m<módulo>-lesson-<n>.sql
--
-- Requer prova-schema.sql aplicado antes. Ver o desenho de acesso e a
-- função prova_abrir lá.
-- =====================================================================

\set ON_ERROR_STOP on

begin;

insert into prova_provas (slug, titulo, contexto, comando, regras, duracao_min)
values (
  'mXX-lYY-tema',
  'Título projetado no cabeçalho da prova',
  $ctx$Cenário comum a todas as partes: a situação do projeto sobre a qual o aluno escreve.$ctx$,
  $cmd$O que se pede, em uma frase, com o critério que separa a resposta boa da genérica.$cmd$,
  $json$[
    "Uma regra por item, na forma como deve ser lida em voz alta.",
    "Peso total e forma de entrega entram aqui."
  ]$json$::jsonb,
  75
)
on conflict (slug) do update
   set titulo      = excluded.titulo,
       contexto    = excluded.contexto,
       comando     = excluded.comando,
       regras      = excluded.regras,
       duracao_min = excluded.duracao_min;

delete from prova_partes where prova_slug = 'mXX-lYY-tema';

insert into prova_partes (prova_slug, ordem, rotulo, titulo, enunciado, peso) values
('mXX-lYY-tema', 1, 'A', 'Título curto da parte',
 $txt$Enunciado da parte. Cabe em um slide projetado: uma ideia por parte, com o verbo de comando explícito.$txt$, 1);

insert into prova_host_tokens (prova_slug, token_hash)
values ('mXX-lYY-tema',
        encode(sha256(convert_to(trim(:'token'), 'utf8')), 'hex'))
on conflict (prova_slug) do update set token_hash = excluded.token_hash,
                                       criado_em  = now();

commit;
