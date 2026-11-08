-- Step 03 · Row level security: each manager sees only the rows of the own store
-- Lesson 13 · Module 8 · Information Systems · Inteli
--
-- GRANT decides which tables a role reads; a policy decides which rows. With RLS on,
-- a row is visible only when some policy of the role returns true for it, so a
-- table with RLS and no policy shows nothing to anybody but the superuser and the
-- roles with BYPASSRLS. FORCE extends the rule to the owner of the table.

-- Who works in which store. Kept in gov, which the managers cannot read.
CREATE TABLE gov.store_staff (role_name text NOT NULL, store_id text NOT NULL REFERENCES shop.stores, PRIMARY KEY (role_name, store_id));
INSERT INTO gov.store_staff VALUES ('manager_sp', 'sp'), ('manager_rj', 'rj'), ('manager_bh', 'bh');

-- The role that is acting. Inside a SECURITY DEFINER function current_user is the
-- owner of the function, so the role set by SET ROLE (or the login) is read instead.
CREATE FUNCTION gov.actor() RETURNS text
LANGUAGE sql STABLE
AS $$ SELECT coalesce(nullif(current_setting('role'), 'none'), session_user::text) $$;
GRANT EXECUTE ON FUNCTION gov.actor() TO PUBLIC;

-- The stores of the acting role. SECURITY DEFINER: the policy can read gov.store_staff
-- without granting it to the managers; search_path is fixed so nobody can hijack it.
CREATE FUNCTION gov.my_stores() RETURNS SETOF text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, gov
AS $$ SELECT store_id FROM gov.store_staff WHERE role_name = gov.actor() $$;
REVOKE EXECUTE ON FUNCTION gov.my_stores() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION gov.my_stores() TO store_manager;

ALTER TABLE shop.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop.orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop.customers FORCE ROW LEVEL SECURITY;
ALTER TABLE shop.orders    FORCE ROW LEVEL SECURITY;

CREATE POLICY manager_reads_own_store ON shop.customers
  FOR SELECT TO store_manager
  USING (store_id IN (SELECT gov.my_stores()));
CREATE POLICY manager_reads_own_store ON shop.orders
  FOR SELECT TO store_manager
  USING (store_id IN (SELECT gov.my_stores()));

-- The ETL inserts rows of any store, but only of a store that exists.
CREATE POLICY etl_inserts ON shop.customers
  FOR INSERT TO etl_writer
  WITH CHECK (store_id IN ('sp', 'rj', 'bh'));
CREATE POLICY etl_inserts ON shop.orders
  FOR INSERT TO etl_writer
  WITH CHECK (store_id IN ('sp', 'rj', 'bh'));

-- The same query, three roles, three answers.
SET ROLE manager_sp;
SELECT 'manager_sp' AS role, store_id, count(*) AS orders, round(sum(quantity * unit_price), 2) AS revenue FROM shop.orders GROUP BY store_id;
SET ROLE manager_rj;
SELECT 'manager_rj' AS role, store_id, count(*) AS orders, round(sum(quantity * unit_price), 2) AS revenue FROM shop.orders GROUP BY store_id;
RESET ROLE;
SELECT 'postgres (superuser)' AS role, store_id, count(*) AS orders, round(sum(quantity * unit_price), 2) AS revenue FROM shop.orders GROUP BY store_id ORDER BY store_id;

-- FORCE at work: the owner of the table has no policy, so it sees no customer.
SET ROLE app_owner;
SELECT 'app_owner' AS role, count(*) AS customers_visible FROM shop.customers;
RESET ROLE;

-- An anti-pattern, for comparison: a policy over a setting that the user can change.
--   USING (store_id = current_setting('app.store_id'))
-- Any role runs SET app.store_id = 'rj' and reads the other store. A setting is safe
-- only when the application is the sole client and the users never write SQL.
