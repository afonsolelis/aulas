-- Enquete da Prática 1 da palestra Sindusfarma (20/10/2026).
--
-- Cada celular que abre pages/palestras/ferramentas/sindusfarma-enquete.html classifica as
-- seis iniciativas fictícias (A a F) quanto ao tipo de IA, à maturidade e à pergunta decisiva,
-- e envia tudo por enquete_responder(sala, dispositivo, respostas). A função é idempotente por
-- dispositivo: quem reenvia substitui a resposta anterior. O deck lê apenas o agregado, por
-- enquete_resultado(sala), que devolve contagens e nunca o voto de um dispositivo.
--
-- As tabelas não têm policy e não concedem acesso direto a anon/authenticated; todo acesso
-- passa pelas funções security definer abaixo. Só aceitam voto as salas cadastradas em
-- enquete_salas e abertas.

create table if not exists enquete_salas (
  sala   text primary key,
  aberta boolean not null default true
);

create table if not exists enquete_respostas (
  sala         text not null references enquete_salas(sala) on delete cascade,
  dispositivo  uuid not null,
  iniciativa   text not null check (iniciativa in ('A','B','C','D','E','F')),
  tipo         text check (tipo in ('P','G','C')),
  maturidade   int  check (maturidade between 1 and 3),
  pergunta     int  check (pergunta between 1 and 4),
  respondida_em timestamptz not null default now(),
  primary key (sala, dispositivo, iniciativa)
);

alter table enquete_salas     enable row level security;
alter table enquete_respostas enable row level security;
revoke all on enquete_salas     from anon, authenticated;
revoke all on enquete_respostas from anon, authenticated;

insert into enquete_salas (sala) values ('sindusfarma-2026-10-20') on conflict do nothing;

-- p_respostas: [{"iniciativa":"A","tipo":"G","maturidade":2,"pergunta":3}, ...]
create or replace function enquete_responder(p_sala text, p_dispositivo uuid, p_respostas jsonb)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_n int;
begin
  if not exists (select 1 from enquete_salas s where s.sala = p_sala and s.aberta) then
    raise exception 'enquete encerrada ou inexistente';
  end if;
  if jsonb_typeof(p_respostas) <> 'array' or jsonb_array_length(p_respostas) > 6 then
    raise exception 'formato de resposta inválido';
  end if;

  insert into enquete_respostas (sala, dispositivo, iniciativa, tipo, maturidade, pergunta, respondida_em)
  select p_sala, p_dispositivo, r->>'iniciativa', nullif(r->>'tipo', ''),
         (r->>'maturidade')::int, (r->>'pergunta')::int, now()
  from jsonb_array_elements(p_respostas) r
  on conflict (sala, dispositivo, iniciativa) do update
    set tipo = excluded.tipo, maturidade = excluded.maturidade,
        pergunta = excluded.pergunta, respondida_em = now();

  get diagnostics v_n = row_count;
  return v_n;
end;
$$;

-- Agregado por iniciativa e dimensão: uma linha por (iniciativa, campo, valor) com o número
-- de votos, mais a linha ('*', 'participantes', '*') com o total de dispositivos.
create or replace function enquete_resultado(p_sala text)
returns table (iniciativa text, campo text, valor text, votos int)
language sql
security definer
set search_path = public
as $$
  select r.iniciativa, 'tipo', r.tipo, count(*)::int
    from enquete_respostas r where r.sala = p_sala and r.tipo is not null
    group by r.iniciativa, r.tipo
  union all
  select r.iniciativa, 'maturidade', r.maturidade::text, count(*)::int
    from enquete_respostas r where r.sala = p_sala and r.maturidade is not null
    group by r.iniciativa, r.maturidade
  union all
  select r.iniciativa, 'pergunta', r.pergunta::text, count(*)::int
    from enquete_respostas r where r.sala = p_sala and r.pergunta is not null
    group by r.iniciativa, r.pergunta
  union all
  select '*', 'participantes', '*', count(distinct r.dispositivo)::int
    from enquete_respostas r where r.sala = p_sala;
$$;

revoke all on function enquete_responder(text, uuid, jsonb) from public;
revoke all on function enquete_resultado(text)              from public;
grant execute on function enquete_responder(text, uuid, jsonb) to anon, authenticated;
grant execute on function enquete_resultado(text)              to anon, authenticated;
