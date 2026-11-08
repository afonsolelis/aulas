-- Step 06 · The access matrix as an automated test
-- Lesson 13 · Module 8 · Information Systems · Inteli
--
-- A security policy that nobody tests drifts with the next GRANT. The policy of the
-- DataApp is written as a table of expectations (role × probe -> denied, none, some
-- or all of the rows), and a function runs every probe as every role and compares.
-- Each probe runs inside a subtransaction that is always rolled back, so an INSERT
-- or DELETE that succeeds leaves no trace, not even in the audit log.

CREATE TABLE gov.probes (probe text PRIMARY KEY, ord integer NOT NULL, sql text NOT NULL);
INSERT INTO gov.probes VALUES
  ('read customers',   1, 'SELECT * FROM shop.customers'),
  ('read orders',      2, 'SELECT * FROM shop.orders'),
  ('insert customer',  3, $q$INSERT INTO shop.customers VALUES (900, 'rj', 'Zeca Teste', 'zeca.teste90@example.com', '000.000.000-90', NULL, NULL, 'Rio de Janeiro', NULL, false, NULL, 1794052800)$q$),
  ('lookup contact',   4, $q$SELECT * FROM shop.lookup_customer(1, 'Notify a reserved order')$q$),
  ('read pseudonyms',  5, 'SELECT * FROM analytics.orders_pseudo'),
  ('read segments',    6, 'SELECT * FROM analytics.sales_by_segment'),
  ('read pepper',      7, 'SELECT * FROM gov.pepper'),
  ('read audit log',   8, 'SELECT * FROM audit.events'),
  ('erase audit log',  9, 'DELETE FROM audit.events');

-- Runs a statement as a role and classifies the outcome against the superuser:
-- denied (error), none (0 rows), some (fewer rows than the superuser) or all.
CREATE FUNCTION gov.try_as(p_role text, p_sql text) RETURNS text
LANGUAGE plpgsql AS $$
DECLARE
  n bigint; base bigint; msg text;
BEGIN
  BEGIN
    EXECUTE p_sql; GET DIAGNOSTICS base = ROW_COUNT;
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'rollback';
  EXCEPTION WHEN raise_exception THEN NULL; WHEN others THEN base := NULL;
  END;
  BEGIN
    EXECUTE format('SET LOCAL ROLE %I', p_role);
    EXECUTE p_sql; GET DIAGNOSTICS n = ROW_COUNT;
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'rollback';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM <> 'rollback' THEN RETURN 'denied'; END IF;
    WHEN others THEN
      RETURN 'denied';
  END;
  IF n = 0 THEN RETURN 'none'; END IF;
  IF base IS NULL OR n >= base THEN RETURN 'all'; END IF;
  RETURN 'some';
END $$;
REVOKE EXECUTE ON FUNCTION gov.try_as(text, text) FROM PUBLIC;

-- The policy of the DataApp, written before the test. Read a row as a requirement:
-- "the analyst must be denied the raw customers".
CREATE TABLE gov.expected_access (role text, probe text REFERENCES gov.probes, expected text NOT NULL CHECK (expected IN ('denied', 'none', 'some', 'all')), PRIMARY KEY (role, probe));
INSERT INTO gov.expected_access
SELECT r.role, p.probe, e.expected
FROM (VALUES
  ('etl_writer', ARRAY['denied', 'denied', 'all',    'denied', 'denied', 'denied', 'denied', 'denied', 'denied']),
  ('manager_sp', ARRAY['some',   'some',   'denied', 'all',    'denied', 'denied', 'denied', 'denied', 'denied']),
  ('manager_rj', ARRAY['some',   'some',   'denied', 'denied', 'denied', 'denied', 'denied', 'denied', 'denied']),
  ('analyst',    ARRAY['denied', 'denied', 'denied', 'denied', 'all',    'all',    'denied', 'denied', 'denied']),
  ('dashboard',  ARRAY['denied', 'denied', 'denied', 'denied', 'denied', 'all',    'denied', 'denied', 'denied']),
  ('dpo',        ARRAY['denied', 'denied', 'denied', 'denied', 'denied', 'denied', 'denied', 'all',    'denied']),
  ('app_owner',  ARRAY['none',   'none',   'denied',   'denied', 'denied', 'denied', 'denied', 'denied', 'denied'])
) AS r(role, list)
CROSS JOIN LATERAL unnest(r.list) WITH ORDINALITY AS e(expected, ord)
JOIN gov.probes AS p ON p.ord = e.ord;

-- The test: every pair of the policy, observed against expected.
CREATE FUNCTION gov.access_test()
RETURNS TABLE (role text, probe text, ord integer, expected text, observed text, pass boolean)
LANGUAGE sql AS $$
  SELECT e.role, e.probe, p.ord, e.expected, o.observed, o.observed = e.expected
  FROM gov.expected_access AS e
  JOIN gov.probes AS p USING (probe)
  CROSS JOIN LATERAL (SELECT gov.try_as(e.role, p.sql) AS observed) AS o
$$;
REVOKE EXECUTE ON FUNCTION gov.access_test() FROM PUBLIC;

-- The verdict: expected 63 pairs, 63 passed.
SELECT count(*) AS pairs, count(*) FILTER (WHERE pass) AS passed, count(*) FILTER (WHERE NOT pass) AS failed FROM gov.access_test();

-- The matrix, one row per role (the same matrix the lab draws below the editor).
SELECT role,
       max(observed) FILTER (WHERE ord = 1) AS read_customers,
       max(observed) FILTER (WHERE ord = 2) AS read_orders,
       max(observed) FILTER (WHERE ord = 3) AS insert_customer,
       max(observed) FILTER (WHERE ord = 4) AS lookup_contact,
       max(observed) FILTER (WHERE ord = 5) AS read_pseudonyms,
       max(observed) FILTER (WHERE ord = 6) AS read_segments,
       max(observed) FILTER (WHERE ord = 7) AS read_pepper,
       max(observed) FILTER (WHERE ord = 8) AS read_audit,
       max(observed) FILTER (WHERE ord = 9) AS erase_audit
FROM gov.access_test()
GROUP BY role
ORDER BY role;

-- A regression on purpose: the careless "give the analyst access to shop" of a busy day.
-- RLS still returns no row (none instead of denied), so the second layer held; the test
-- fails anyway, because the policy says the first layer must hold too.
GRANT USAGE ON SCHEMA shop TO analyst;
GRANT SELECT ON ALL TABLES IN SCHEMA shop TO analyst;
SELECT role, probe, expected, observed FROM gov.access_test() WHERE NOT pass;
REVOKE SELECT ON ALL TABLES IN SCHEMA shop FROM analyst;
REVOKE USAGE ON SCHEMA shop FROM analyst;
SELECT count(*) FILTER (WHERE NOT pass) AS failed_after_revoke FROM gov.access_test();
