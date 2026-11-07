# supabase/ — esquema e conteúdo das salas

O nome da pasta ficou por histórico. Desde 07/11/2026 o quiz, o TBL, a prova, a enquete, o semáforo e o conselho
rodam no Postgres + PostgREST do projeto `aulas_inteli` no Coolify da VPS Hostinger, e não mais no Supabase cloud
(`lcyxqwdgsrbcpecqyqje`). Tabelas, funções, grants e RLS foram copiados de lá sem mudança: os arquivos desta pasta
continuam descrevendo o que está no banco.

| Item | Valor |
|------|-------|
| API | `https://aulas-inteli-api.afonsolelis.tech` |
| Cliente das páginas | `js/api_aulas.js` (`window.aulasApi.cliente()`) |
| Coolify | projeto `aulas_inteli` (`jrm59heosohjhndbhrguzdcg`), service `mep8w8n2uxj8gfu2m2g9gvaw` |
| Compose | `hostinger/aulas-inteli/docker-compose.yml` (repositório de infraestrutura) |
| Banco | `aulas`, timezone UTC, dados em `/data/aulas-inteli/pgdata` na VPS |
| Porta | sem porta pública; só `127.0.0.1:55434` na VPS |
| Senhas | `INTELI_PG_*` no `.env` do repositório `hostinger` |

## Aplicar SQL (sala nova, ajuste de função)

Pelo túnel SSH:

```bash
ssh -f -N -L 55434:127.0.0.1:55434 root@srv2127534.hstgr.cloud
psql "postgresql://postgres:<INTELI_PG_ADMIN_PASSWORD>@127.0.0.1:55434/aulas" -v ON_ERROR_STOP=1 -f supabase/quiz-seed-<aula>.sql
psql "postgresql://postgres:<INTELI_PG_ADMIN_PASSWORD>@127.0.0.1:55434/aulas" -c "notify pgrst, 'reload schema'"
```

Na VPS, sem túnel: `docker exec -i postgres-mep8w8n2uxj8gfu2m2g9gvaw psql -U postgres -d aulas`.

Não rode `quiz-schema.sql` nem `tbl-schema.sql`: eles recriam as tabelas e apagam as salas. Depois de criar ou trocar
função, `notify pgrst, 'reload schema'` faz o PostgREST enxergar a mudança.

## O que mudou em relação ao Supabase

- Sem Realtime: as páginas consultam o estado a cada segundo.
- Sem login: a API só atende o papel `anon`. As famílias `alocacao_*` e `modulo_*`, que exigem login com Google,
  vieram com dados e políticas, mas ficam inacessíveis até haver autenticação. Os usuários do Supabase Auth não foram
  copiados; o schema `auth` do banco novo só tem `uid()`, `jwt()`, `role()` e `email()`, que leem o JWT.
- Sem storage: nenhuma página do repositório usava arquivos do Supabase.

## Validação feita na virada (07/11/2026)

- Paridade com o Supabase: linhas e conteúdo de cada tabela, permissões, políticas, RLS, funções, gatilhos,
  sequências, views, índices e restrições.
- Ensaio com 20 alunos no quiz (10 perguntas, painel e relatório) e no TBL (5 questões, duas rodadas, painel).
- Enquete, semáforo, prova e conselho respondendo pela API; as 35 páginas carregam sem erro e sem falar com o Supabase.
