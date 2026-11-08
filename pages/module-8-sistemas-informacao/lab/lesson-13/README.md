# Lesson 13 · Lab: data security in the browser

Module 8 · Information Systems · Inteli · Thursday, 17/12/2026 · one hour of demonstration and one hour in groups

The lab is the page `index.html` of this folder, published with the module. It runs PostgreSQL 18 compiled to WebAssembly (PGlite 0.5.10, `@electric-sql/pglite` from jsdelivr) inside the browser, so nothing is installed. The theory of each step and the work of the second hour are in the reading material: `../../materials/lesson-13-material.html`.

## How the page works

1. On the first visit it downloads `data/seed.sql` (52 KB) and keeps it in the localStorage. The seed creates the schema `shop` of a fictitious card shop.
2. The session is the superuser `postgres`. `SET ROLE <role>` plays a job of the DataApp and `RESET ROLE` comes back; the badge "acting as" shows who is acting, and the card "Roles of the session" switches role without typing.
3. Every statement that changes the database (`CREATE`, `ALTER`, `INSERT`, `UPDATE`, `DELETE`, `DROP`, `GRANT`, `REVOKE`, `COMMENT`, `SET`, `RESET`) is kept in the localStorage and replayed in order on the next visit, followed by `RESET ROLE`. A random value, such as the pepper of step 04, is drawn again at each replay.
4. "Prompt" opens the CREATE prompt of a step (`prompts/`); "Reference SQL" loads the SQL of the professor (`sql/`). Ctrl+Enter runs every statement of the editor and shows one result per statement; the splitter respects strings, comments and `$$` bodies.
5. The access matrix at the bottom runs `gov.access_test()` of step 06: nine probes as seven roles, each inside a transaction that is rolled back, compared with `gov.expected_access`. A cell that differs from the policy is outlined in coral and says what was expected.
6. "Start over" forgets the statements and the seed and reloads the page.

## The data

The data is synthetic. Every person is fake: the surnames are Exemplo, Fictício, Teste, Modelo, Amostra or Simulado, the e-mails use the reserved domain `example.com` and the CPFs start with `000`. The card names and their prices come from the capture of TCGplayer of Lesson 6 (07/11/2026). Every date is Unix time in seconds (UTC). The seed is versioned and deterministic.

| Table | Rows | Personal data |
|---|---:|---|
| `shop.stores` | 3 (sp, rj, bh) | none |
| `shop.customers` | 60 | name, e-mail, CPF, phone, birth date, city; 5 customers with an accessibility need (sensitive, health) |
| `shop.orders` | 400 | the customer, the moment of the sale and the last four digits of the payment card |

## Steps

| Step | Prompt | Reference | Checks |
|---|---|---|---|
| 01 · 6 min | `prompts/01_classify.md` | `sql/01_classify.sql` | 25 columns classified, none missing; 1 sensitive, 7 personal dropped from analytics |
| 02 · 6 min | `prompts/02_roles.md` | `sql/02_roles.sql` | 10 roles, all NOLOGIN; the ETL inserts customers but cannot select them |
| 03 · 7 min | `prompts/03_row_security.md` | `sql/03_row_security.sql` | manager_sp sees 162 orders (US$ 58,258.08), manager_rj 128 (US$ 65,629.66); app_owner sees 0 customers |
| 04 · 7 min | `prompts/04_masking.md` | `sql/04_masking.sql` | 7 segments published, 4 suppressed by k = 5 (7 customers) |
| 05 · 7 min | `prompts/05_audit.md` | `sql/05_audit.sql` | 3 events: a READ by manager_sp with its purpose, an INSERT by etl_writer, an UPDATE of the e-mail only |
| 06 · 7 min | `prompts/06_access_tests.md` | `sql/06_access_tests.sql` | 63 pairs, 63 passed; after the careless GRANT, 2 failures; after the REVOKE, 0 |
| second hour | `prompts/07_your_data_clickhouse.md` | — | the partner data in `lab.gNN_` on shrek2 (`http://10.8.8.10:8123/play`); the access management statements are run by the administrator |

## Rehearsal

Measured on 08/11/2026 with PGlite 0.5.10 (PostgreSQL 18.6) in Node and in Chromium headless: the seed and the six reference files run without error, a reload replays the 100 statements in order and the matrix stays at 63 of 63. PGlite supports everything the lab uses: `CREATE ROLE` with `NOLOGIN`, `IN ROLE` and `BYPASSRLS`, `SET ROLE` and `SET LOCAL ROLE`, `GRANT`/`REVOKE` and `ALTER DEFAULT PRIVILEGES`, row level security with `FORCE`, `SECURITY DEFINER` functions with a fixed `search_path`, PL/pgSQL triggers and subtransactions, and the built-in `sha256()`. It has one session only, so `session_user` is always `postgres`; `gov.actor()` reads the role from `current_setting('role')`, which also works with real logins on a server.
