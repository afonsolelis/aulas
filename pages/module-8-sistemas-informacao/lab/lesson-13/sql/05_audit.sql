-- Step 05 · Audit log: who did what, when and why
-- Lesson 13 · Module 8 · Information Systems · Inteli
--
-- LGPD art. 37: the controller keeps a record of the processing operations; art. 46:
-- technical measures protect the data from unauthorised access. Two kinds of event:
--   changes, caught by a trigger on every INSERT, UPDATE and DELETE of shop.customers;
--   reads of contact data, which a trigger cannot see, so they happen only through a
--   function that checks the store, demands a purpose and writes the event.
-- The log records the names of the changed columns and never their values, otherwise
-- the log itself would become a second copy of the personal data.

CREATE TABLE audit.events (
  event_id   bigserial PRIMARY KEY,
  at_unix    bigint NOT NULL DEFAULT extract(epoch FROM now())::bigint,
  actor      text   NOT NULL,
  action     text   NOT NULL,
  table_name text   NOT NULL,
  row_key    text,
  purpose    text,
  columns    text[]
);
REVOKE ALL ON audit.events FROM PUBLIC;
GRANT SELECT ON audit.events TO dpo;

-- Append-only: an UPDATE or DELETE of the log fails for every role, the owner included.
CREATE FUNCTION audit.refuse_change() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'audit.events is append-only'; END $$;
CREATE TRIGGER append_only BEFORE UPDATE OR DELETE ON audit.events
  FOR EACH STATEMENT EXECUTE FUNCTION audit.refuse_change();

-- Changes. SECURITY DEFINER: the trigger writes the log, which the actor cannot touch.
CREATE FUNCTION audit.log_change() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, audit, gov
AS $$
DECLARE
  changed text[];
  rec jsonb := to_jsonb(coalesce(NEW, OLD));
BEGIN
  IF TG_OP = 'UPDATE' THEN
    SELECT array_agg(n.key ORDER BY n.key) INTO changed
    FROM jsonb_each(to_jsonb(NEW)) AS n
    JOIN jsonb_each(to_jsonb(OLD)) AS o USING (key)
    WHERE n.value IS DISTINCT FROM o.value;
  ELSE
    SELECT array_agg(k ORDER BY k) INTO changed FROM jsonb_object_keys(rec) AS k;
  END IF;
  INSERT INTO audit.events (actor, action, table_name, row_key, columns)
  VALUES (gov.actor(), TG_OP, TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME, rec ->> 'customer_id', changed);
  RETURN NULL;
END $$;
CREATE TRIGGER audit_customers AFTER INSERT OR UPDATE OR DELETE ON shop.customers
  FOR EACH ROW EXECUTE FUNCTION audit.log_change();

-- Reads of contact data: the only door to name, e-mail and phone for a manager.
CREATE FUNCTION shop.lookup_customer(p_customer_id integer, p_purpose text)
RETURNS TABLE (customer_id integer, full_name text, email text, phone text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, shop, gov, audit
AS $$
DECLARE
  v_store text;
BEGIN
  IF NOT pg_has_role(gov.actor(), 'store_manager', 'MEMBER') THEN
    RAISE EXCEPTION 'only a store manager may look up a customer';
  END IF;
  IF length(coalesce(trim(p_purpose), '')) < 10 THEN
    RAISE EXCEPTION 'state the purpose of the lookup (at least 10 characters)';
  END IF;
  SELECT c.store_id INTO v_store FROM shop.customers AS c WHERE c.customer_id = p_customer_id;
  IF v_store IS NULL OR v_store NOT IN (SELECT s.store_id FROM gov.store_staff AS s WHERE s.role_name = gov.actor()) THEN
    RAISE EXCEPTION 'customer % is not a customer of your store', p_customer_id;
  END IF;
  INSERT INTO audit.events (actor, action, table_name, row_key, purpose, columns)
  VALUES (gov.actor(), 'READ', 'shop.customers', p_customer_id::text, p_purpose, ARRAY['email', 'full_name', 'phone']);
  RETURN QUERY SELECT c.customer_id, c.full_name, c.email, c.phone FROM shop.customers AS c WHERE c.customer_id = p_customer_id;
END $$;
ALTER FUNCTION shop.lookup_customer(integer, text) OWNER TO postgres;
-- A new function is executable by PUBLIC by default; this one is for managers only.
REVOKE EXECUTE ON FUNCTION shop.lookup_customer(integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION shop.lookup_customer(integer, text) TO store_manager;

-- Three events: a manager looks up a customer of the own store, the ETL inserts a new
-- customer, and the back office (the superuser here) corrects an e-mail at the request of
-- the customer (art. 18, III).
SET ROLE manager_sp;
SELECT * FROM shop.lookup_customer(1, 'Notify the customer that a reserved order arrived');
SET ROLE etl_writer;
INSERT INTO shop.customers VALUES (61, 'rj', 'Ulisses Exemplo', 'ulisses.exemplo61@example.com', '000.123.456-61', '(21) 90000-0061', 820497600, 'Rio de Janeiro', NULL, true, 1794052860, 1794052800);
RESET ROLE;
UPDATE shop.customers SET email = 'ana.exemplo.new@example.com' WHERE customer_id = 1;

-- Who did what (the DPO reads the log).
SET ROLE dpo;
SELECT event_id, at_unix, actor, action, table_name, row_key, purpose, columns FROM audit.events ORDER BY event_id;
SELECT actor, action, count(*) AS events FROM audit.events GROUP BY actor, action ORDER BY actor, action;
RESET ROLE;
