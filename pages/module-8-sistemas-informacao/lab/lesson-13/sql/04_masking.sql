-- Step 04 · Pseudonymisation, masking and an anonymised aggregate
-- Lesson 13 · Module 8 · Information Systems · Inteli
--
-- The analytics layer never sees a name, an e-mail or a CPF. Three techniques:
--   pseudonymisation (LGPD art. 13, §4): the customer becomes a key that only the
--     holder of a secret pepper can link back to the person, so it is still personal data;
--   generalisation: birth date -> age band, timestamp -> day, which reduces the
--     quasi-identifiers of the catalogue;
--   aggregation with a minimum group size (k-anonymity): a group with fewer than k
--     customers is suppressed, so the dashboard shows data that is anonymised (art. 5, III, and art. 12).
-- The views belong to analytics_owner, which reads shop; the analysts read only the views.

-- The pepper. In production it lives in a secret manager or in an environment variable
-- outside the repository; here it is a table that only analytics_owner reads.
CREATE TABLE gov.pepper (name text PRIMARY KEY, value text NOT NULL);
INSERT INTO gov.pepper VALUES ('customer_key', md5(random()::text) || md5(random()::text));
REVOKE ALL ON gov.pepper FROM PUBLIC;
GRANT USAGE ON SCHEMA gov TO analytics_owner;
GRANT SELECT ON gov.pepper TO analytics_owner;

SET ROLE analytics_owner;

CREATE VIEW analytics.customers_pseudo AS
SELECT left(encode(sha256(convert_to(p.value || ':' || c.customer_id, 'UTF8')), 'hex'), 16) AS customer_key,
       c.store_id,
       CASE WHEN a.age < 25 THEN '18-24' WHEN a.age < 35 THEN '25-34' WHEN a.age < 50 THEN '35-49' ELSE '50+' END AS age_band,
       left(c.email, 1) || '***@' || split_part(c.email, '@', 2) AS email_masked,
       c.marketing_consent,
       c.created_unix / 86400 * 86400 AS customer_since_day_unix
FROM shop.customers AS c
CROSS JOIN gov.pepper AS p
CROSS JOIN LATERAL (SELECT floor((extract(epoch FROM now()) - c.birth_unix) / 31557600)::int AS age) AS a
WHERE p.name = 'customer_key';

CREATE VIEW analytics.orders_pseudo AS
SELECT o.order_id,
       left(encode(sha256(convert_to(p.value || ':' || o.customer_id, 'UTF8')), 'hex'), 16) AS customer_key,
       o.store_id,
       o.ordered_unix / 86400 * 86400 AS day_unix,
       o.product, o.set_name, o.quantity, o.unit_price, o.payment_method
FROM shop.orders AS o
CROSS JOIN gov.pepper AS p
WHERE p.name = 'customer_key';

-- k = 5: a store and age band with fewer than five customers does not appear.
CREATE VIEW analytics.sales_by_segment AS
SELECT c.store_id, c.age_band,
       count(DISTINCT c.customer_key) AS customers,
       count(*) AS orders,
       round(sum(o.quantity * o.unit_price), 2) AS revenue
FROM analytics.orders_pseudo AS o
JOIN analytics.customers_pseudo AS c USING (customer_key)
GROUP BY c.store_id, c.age_band
HAVING count(DISTINCT c.customer_key) >= 5;

RESET ROLE;

-- The dashboard reads only the aggregate; the default privilege of step 02 already
-- gave every view of analytics to the analysts.
GRANT SELECT ON analytics.sales_by_segment TO dashboard;

-- What the analyst sees.
SET ROLE analyst;
SELECT * FROM analytics.customers_pseudo ORDER BY customer_key LIMIT 8;
SELECT * FROM analytics.sales_by_segment ORDER BY store_id, age_band;
RESET ROLE;

-- How many segments k = 5 suppressed, and how many customers were in them.
WITH seg AS (
  SELECT c.store_id, c.age_band, count(*) AS customers
  FROM analytics.customers_pseudo AS c
  WHERE c.customer_key IN (SELECT customer_key FROM analytics.orders_pseudo)
  GROUP BY 1, 2
)
SELECT count(*) FILTER (WHERE customers < 5) AS suppressed_segments,
       coalesce(sum(customers) FILTER (WHERE customers < 5), 0) AS customers_in_them,
       count(*) FILTER (WHERE customers >= 5) AS published_segments
FROM seg;
