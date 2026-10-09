-- Sorteio dos papéis da reunião simulada do conselho (aula da Copel, 09/10/2026).
--
-- Cada celular que abre pages/palestras/ferramentas/copel-papeis-do-conselho.html
-- chama conselho_papel_pegar(sala, dispositivo) e recebe um papel ainda livre, sorteado
-- entre os dez da sala. A função é idempotente por dispositivo: quem recarrega a página
-- recebe o mesmo papel. Quando os dez estão ocupados, a função devolve null e a página
-- oferece a escolha manual.
--
-- As tabelas não têm policy e não concedem acesso direto a anon/authenticated; todo
-- acesso passa pelas funções security definer abaixo. O reinício do sorteio exige o
-- token do professor, conferido pelo hash SHA-256 em conselho_host_tokens. O token em
-- texto claro nunca entra no repositório: o insert do hash é feito à parte, no SQL Editor.

create table if not exists conselho_papeis (
  sala         text not null,
  papel        text not null check (papel in ('diretor','presidente','c1','c2','c3','c4','c5','c6','c7','c8')),
  dispositivo  uuid,
  atribuido_em timestamptz,
  primary key (sala, papel)
);

create table if not exists conselho_host_tokens (
  sala       text primary key,
  token_hash text not null
);

alter table conselho_papeis      enable row level security;
alter table conselho_host_tokens enable row level security;
revoke all on conselho_papeis      from anon, authenticated;
revoke all on conselho_host_tokens from anon, authenticated;

-- Os dez papéis da sala da aula de 09/10/2026.
insert into conselho_papeis (sala, papel)
select 'copel-2026-10-09', p
from unnest(array['diretor','presidente','c1','c2','c3','c4','c5','c6','c7','c8']) as p
on conflict do nothing;

create or replace function conselho_papel_pegar(p_sala text, p_dispositivo uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_papel text;
begin
  select papel into v_papel
  from conselho_papeis
  where sala = p_sala and dispositivo = p_dispositivo;
  if v_papel is not null then
    return v_papel;
  end if;

  update conselho_papeis
  set dispositivo = p_dispositivo, atribuido_em = now()
  where (sala, papel) = (
    select sala, papel
    from conselho_papeis
    where sala = p_sala and dispositivo is null
    order by random()
    limit 1
    for update skip locked
  )
  returning papel into v_papel;

  return v_papel;
end;
$$;

-- Estado da sala e reinício do sorteio, ambos restritos ao professor.
create or replace function conselho_papeis_host(p_sala text, p_token text, p_acao text default 'ver')
returns table (papel text, ocupado boolean, atribuido_em timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
begin
  v_hash := encode(sha256(convert_to(trim(p_token), 'utf8')), 'hex');
  if not exists (select 1 from conselho_host_tokens t where t.sala = p_sala and t.token_hash = v_hash) then
    raise exception 'token do professor inválido';
  end if;

  if p_acao = 'reiniciar' then
    update conselho_papeis c set dispositivo = null, atribuido_em = null where c.sala = p_sala;
  end if;

  return query
    select c.papel, c.dispositivo is not null, c.atribuido_em
    from conselho_papeis c
    where c.sala = p_sala
    order by array_position(array['diretor','presidente','c1','c2','c3','c4','c5','c6','c7','c8'], c.papel);
end;
$$;

revoke all on function conselho_papel_pegar(text, uuid)        from public;
revoke all on function conselho_papeis_host(text, text, text)  from public;
grant execute on function conselho_papel_pegar(text, uuid)       to anon, authenticated;
grant execute on function conselho_papeis_host(text, text, text) to anon, authenticated;
