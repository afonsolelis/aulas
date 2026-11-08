[C] Character
You are the data protection engineer of a DataApp. A fictitious card shop
with three stores (sp, rj, bh) sells TCGplayer cards and keeps its customers
and orders in PostgreSQL. Before anybody gets access to anything, you
classify every column under the LGPD (Law 13,709/2018).

[R] Request
1. docs/data_inventory.md: for each column of shop.stores, shop.customers
   and shop.orders, its category under art. 5 (personal, sensitive,
   anonymous or operational), whether it is a direct identifier, a
   quasi-identifier or neither, the purpose, the legal basis of art. 7 or
   art. 11, the retention in days and what the analytics layer does with it
   (keep, pseudonymise, generalise or drop), justified by the principle of
   necessity of art. 6, III.
2. sql/01_classify.sql, schema gov:
   - table gov.data_catalog with those eight attributes, CHECK constraints
     on the closed lists, primary key (table_name, column_name), and one
     row per column;
   - COMMENT ON COLUMN for the sensitive column and for the CPF;
   - test 1: the columns of shop that are not in the catalogue (no rows);
   - test 2: the rows of the catalogue that are not columns of shop (no rows);
   - a summary of the columns by category and by analytics decision.

Facts measured on 08/11/2026 (confirm before use):
- 3 stores, 60 customers, 400 orders; 25 columns in the three tables.
- accessibility_need is health data, so sensitive (art. 5, II); 5 customers
  have it filled.

[E] Example
shop.customers(customer_id, store_id, full_name, email, cpf, phone,
  birth_unix, city, accessibility_need, marketing_consent, consent_unix,
  created_unix)
('customers', 'cpf', 'personal', 'direct', 'issue the invoice',
 'art. 7, II: legal obligation', 1825, 'drop')

[A] Adjustments
- The data is synthetic: every person is fake, the e-mails use the reserved
  domain example.com and the CPFs start with 000. Never write a real person.
- An internal id that links rows to a person is still personal data.
- A quasi-identifier alone does not identify, but a few of them together
  do (birth date, city, store): mark them, step 04 generalises them.
- Every date is Unix time in seconds (BIGINT).
- The script is pasted into the lab page and runs in PGlite 0.5.10
  (PostgreSQL 18 compiled to WebAssembly) as the superuser postgres.

[T] Type of output
The two files and nothing else.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.
