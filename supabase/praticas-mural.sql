-- Mural de práticas do Módulo 1 de IA para Educação (Projeto Dell, 28/11/2026).
--
-- Cada participante abre pages/palestras/ferramentas/dell-ia-educacao-m1-praticas.html e escreve,
-- em texto livre, uma prática com IA que já faz e uma que quer começar a fazer com o que aprendeu
-- na semana. O envio vai por praticas_responder(sala, dispositivo, ja_faco, quero_comecar) e é
-- idempotente por dispositivo: quem reenvia substitui a resposta anterior. O deck lê as respostas
-- por praticas_resultado(sala), que devolve só os textos, sem o identificador do dispositivo.
--
-- Depende de enquete-iniciativas.sql (enquete_salas e enquete_host_tokens). A tabela não tem
-- policy e não concede acesso direto a anon/authenticated; todo acesso passa pelas funções
-- security definer abaixo. O hash do token do professor é inserido à parte, como descrito em
-- enquete-iniciativas.sql.

insert into enquete_salas (sala) values ('dell-ia-educacao-m1-2026-11-28') on conflict do nothing;

create table if not exists praticas_respostas (
  sala          text not null references enquete_salas(sala) on delete cascade,
  dispositivo   uuid not null,
  ja_faco       text not null default '' check (char_length(ja_faco) <= 280),
  quero_comecar text not null default '' check (char_length(quero_comecar) <= 280),
  respondida_em timestamptz not null default now(),
  primary key (sala, dispositivo)
);
alter table praticas_respostas enable row level security;
revoke all on praticas_respostas from anon, authenticated;

create or replace function praticas_responder(p_sala text, p_dispositivo uuid, p_ja_faco text, p_quero_comecar text)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ja    text := btrim(coalesce(p_ja_faco, ''));
  v_quero text := btrim(coalesce(p_quero_comecar, ''));
begin
  if not exists (select 1 from enquete_salas s where s.sala = p_sala and s.aberta) then
    raise exception 'mural encerrado ou inexistente';
  end if;
  if v_ja = '' and v_quero = '' then
    raise exception 'escreva ao menos uma das duas respostas';
  end if;
  if char_length(v_ja) > 280 or char_length(v_quero) > 280 then
    raise exception 'cada resposta tem no máximo 280 caracteres';
  end if;

  insert into praticas_respostas (sala, dispositivo, ja_faco, quero_comecar, respondida_em)
  values (p_sala, p_dispositivo, v_ja, v_quero, now())
  on conflict (sala, dispositivo) do update
    set ja_faco = excluded.ja_faco, quero_comecar = excluded.quero_comecar, respondida_em = now();
  return 1;
end;
$$;

-- Uma linha por participante, da resposta mais recente para a mais antiga.
create or replace function praticas_resultado(p_sala text)
returns table (ordem int, ja_faco text, quero_comecar text)
language sql
security definer
set search_path = public
as $$
  select (row_number() over (order by r.respondida_em desc))::int, r.ja_faco, r.quero_comecar
    from praticas_respostas r
   where r.sala = p_sala
   order by r.respondida_em desc;
$$;

create or replace function praticas_zerar(p_sala text, p_token text)
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
  delete from praticas_respostas r where r.sala = p_sala;
  get diagnostics v_n = row_count;
  return v_n;
end;
$$;

revoke all on function praticas_responder(text, uuid, text, text) from public;
revoke all on function praticas_resultado(text)                   from public;
revoke all on function praticas_zerar(text, text)                 from public;
grant execute on function praticas_responder(text, uuid, text, text) to anon, authenticated;
grant execute on function praticas_resultado(text)                   to anon, authenticated;
grant execute on function praticas_zerar(text, text)                 to anon, authenticated;
