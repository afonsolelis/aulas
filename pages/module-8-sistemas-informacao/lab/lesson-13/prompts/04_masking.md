[C] Character
You are the data protection engineer of the card shop. The analysts need
sales by customer profile, never the name, the e-mail or the CPF of a
customer.

[R] Request
1. sql/04_masking.sql:
   - table gov.pepper with one random secret, readable only by
     analytics_owner;
   - as analytics_owner, three views in analytics:
     - customers_pseudo: customer_key (the first 16 hex characters of the
       SHA-256 of pepper || ':' || customer_id), store_id, age_band
       (18-24, 25-34, 35-49, 50+), email_masked (first letter, ***, domain),
       marketing_consent and the day the customer arrived, in Unix time;
     - orders_pseudo: the order with customer_key instead of customer_id,
       the day in Unix time and no card_last4;
     - sales_by_segment: customers, orders and revenue by store and age
       band, suppressing every group with fewer than 5 distinct customers;
   - SELECT on sales_by_segment for dashboard;
   - as analyst, eight rows of customers_pseudo and the whole aggregate;
   - how many segments k = 5 suppressed and how many customers were in them.
2. docs/data_inventory.md: a section on the difference between pseudonymised
   data (still personal, art. 13, §4) and anonymised data (art. 5, III and
   art. 12), and where the pepper lives in production.

Facts measured on 08/11/2026 (confirm before use):
- 7 segments published, 4 suppressed with 7 customers in them.

[E] Example
SELECT left(encode(sha256(convert_to(p.value || ':' || c.customer_id,
       'UTF8')), 'hex'), 16) AS customer_key
FROM shop.customers AS c CROSS JOIN gov.pepper AS p

[A] Adjustments
- A hash of the id without a secret is reversible by brute force: 60 ids
  take 60 hashes.
- A view runs with the privileges of its owner, so the analyst reads the
  view without any GRANT on shop.
- PGlite has sha256() and md5() built in; there is no pgcrypto.
- Every date is Unix time in seconds; the day is ts / 86400 * 86400.
- End the script with RESET ROLE.

[T] Type of output
The SQL file and the new section, nothing else.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.
