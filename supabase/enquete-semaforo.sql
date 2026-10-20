-- Enquete da Prática 3 da palestra Sindusfarma (20/10/2026): semáforo da política de uso.
--
-- Cada celular que abre pages/palestras/ferramentas/sindusfarma-semaforo.html classifica as
-- oito situações em verde (V), amarelo (A) ou vermelho (R) e envia por
-- semaforo_responder(sala, dispositivo, respostas); o reenvio substitui o anterior. O deck lê
-- só o agregado, por semaforo_resultado(sala), e o professor apaga os votos por
-- semaforo_zerar(sala, token). Depende de enquete-iniciativas.sql (enquete_salas e
-- enquete_host_tokens). O hash do token é inserido à parte, como descrito naquele arquivo.

insert into enquete_salas (sala) values ('sindusfarma-semaforo-2026-10-20') on conflict do nothing;

create table if not exists semaforo_respostas (
  sala          text not null references enquete_salas(sala) on delete cascade,
  dispositivo   uuid not null,
  situacao      int  not null check (situacao between 1 and 8),
  cor           text not null check (cor in ('V','A','R')),
  respondida_em timestamptz not null default now(),
  primary key (sala, dispositivo, situacao)
);
alter table semaforo_respostas enable row level security;
revoke all on semaforo_respostas from anon, authenticated;

-- p_respostas: [{"situacao":1,"cor":"R"}, ...]
create or replace function semaforo_responder(p_sala text, p_dispositivo uuid, p_respostas jsonb)
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
  if jsonb_typeof(p_respostas) <> 'array' or jsonb_array_length(p_respostas) > 8 then
    raise exception 'formato de resposta inválido';
  end if;
  insert into semaforo_respostas (sala, dispositivo, situacao, cor, respondida_em)
  select p_sala, p_dispositivo, (r->>'situacao')::int, r->>'cor', now()
  from jsonb_array_elements(p_respostas) r
  on conflict (sala, dispositivo, situacao) do update set cor = excluded.cor, respondida_em = now();
  get diagnostics v_n = row_count;
  return v_n;
end;
$$;

-- Uma linha por (situação, cor) com o número de votos, mais (0, '*') com o total de dispositivos.
create or replace function semaforo_resultado(p_sala text)
returns table (situacao int, cor text, votos int)
language sql
security definer
set search_path = public
as $$
  select r.situacao, r.cor, count(*)::int from semaforo_respostas r
   where r.sala = p_sala group by r.situacao, r.cor
  union all
  select 0, '*', count(distinct r.dispositivo)::int from semaforo_respostas r where r.sala = p_sala;
$$;

create or replace function semaforo_zerar(p_sala text, p_token text)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_n int;
begin
  if not exists (
    select 1 from enquete_host_tokens t
    where t.sala = p_sala and t.token_hash = encode(sha256(convert_to(trim(p_token), 'utf8')), 'hex')
  ) then
    raise exception 'token do professor inválido';
  end if;
  delete from semaforo_respostas r where r.sala = p_sala;
  get diagnostics v_n = row_count;
  return v_n;
end;
$$;

revoke all on function semaforo_responder(text, uuid, jsonb) from public;
revoke all on function semaforo_resultado(text)              from public;
revoke all on function semaforo_zerar(text, text)            from public;
grant execute on function semaforo_responder(text, uuid, jsonb) to anon, authenticated;
grant execute on function semaforo_resultado(text)              to anon, authenticated;
grant execute on function semaforo_zerar(text, text)            to anon, authenticated;
