-- Endurecimento de permissões do banco aulas_inteli (VPS, PostgREST sem JWT).
-- Aplicado em 08/11/2026 após auditoria de exposição da API pública.
--
-- Contexto. O banco veio do Supabase cloud com os privilégios padrão de lá,
-- que concedem tudo ao papel anon em toda tabela, sequência e função criada
-- no schema public. Como o PostgREST atende qualquer requisição como anon,
-- uma tabela nova sem RLS ficaria exposta por inteiro, e toda função nova
-- viraria endpoint público. Este arquivo:
--   1. retira esses privilégios padrão, de modo que objeto novo só fica
--      acessível pelo grant explícito que cada arquivo de funções já faz;
--   2. deixa anon e authenticated só com SELECT em quiz_sessions e
--      tbl_sessions (o RLS já barrava a escrita, mas o grant existia);
--   3. retira de anon as funções internas que nenhuma página chama, em
--      especial quiz_linhas, que devolvia nome, resposta e acerto de cada
--      aluno de qualquer sala, e quiz_arquivar, que gravava relatórios.
--
-- As funções internas continuam funcionando quando chamadas de dentro das
-- funções security definer (quiz_host, tbl_estado etc.), que rodam como o
-- dono. Idempotente: pode ser executado de novo sem efeito colateral.

begin;

-- 1. Privilégios padrão herdados do Supabase.
alter default privileges for role postgres in schema public
  revoke all on tables    from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on functions from anon, authenticated;
alter default privileges for role postgres
  revoke execute on functions from public;

-- 2. Tabelas de sessão: só leitura.
revoke all on quiz_sessions, tbl_sessions from anon, authenticated;
grant select on quiz_sessions, tbl_sessions to anon, authenticated;

-- 3. Funções internas, sem uso direto pelas páginas.
revoke all on function quiz_linhas(text)                    from public, anon, authenticated;
revoke all on function quiz_arquivar(text)                  from public, anon, authenticated;
revoke all on function quiz_fechar_expirada(text)           from public, anon, authenticated;
revoke all on function tbl_consolidado(text)                from public, anon, authenticated;
revoke all on function tbl_distribuicao(text,int,int)       from public, anon, authenticated;
revoke all on function tbl_justificativas(text,int,int)     from public, anon, authenticated;
revoke all on function tbl_trajetos(text,int)               from public, anon, authenticated;
revoke all on function tbl_total_questoes(text)             from public, anon, authenticated;
revoke all on function tbl_proxima_fase(text)               from public, anon, authenticated;
revoke all on function tbl_duracao(text)                    from public, anon, authenticated;

-- Funções das famílias alocacao_* e modulo_*: as policies dessas tabelas
-- valem só para authenticated, então anon não precisa delas.
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as f
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and (p.proname like 'alocacao\_%' or p.proname like 'modulo\_%')
  loop
    execute format('revoke all on function %s from public, anon', r.f);
    execute format('grant execute on function %s to authenticated', r.f);
  end loop;
end $$;

commit;

notify pgrst, 'reload schema';
