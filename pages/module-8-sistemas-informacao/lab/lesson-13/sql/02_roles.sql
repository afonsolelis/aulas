-- Step 02 · Roles and least privilege
-- Lesson 13 · Module 8 · Information Systems · Inteli
--
-- One role per job, never per person: people come and go, the jobs stay. A person
-- receives a job by membership (GRANT role TO person). Each job gets only the
-- privileges its purpose needs, and nothing is granted to PUBLIC.
-- In PGlite the session is always the superuser postgres; SET ROLE plays each job.

-- Group roles (jobs). NOLOGIN: nobody connects as a job, only as a person.
CREATE ROLE app_owner        NOLOGIN;              -- owns the tables of shop; not a superuser
CREATE ROLE etl_writer       NOLOGIN;              -- the ETL of the DataApp: writes, does not read customers
CREATE ROLE analytics_owner  NOLOGIN BYPASSRLS;    -- owns the pseudonymised views of analytics
CREATE ROLE analyst          NOLOGIN;              -- reads only analytics
CREATE ROLE dashboard        NOLOGIN;              -- reads only the anonymised aggregate
CREATE ROLE store_manager    NOLOGIN;              -- reads the customers and orders of its own store
CREATE ROLE dpo              NOLOGIN;              -- encarregado (LGPD art. 41): reads the catalogue and the audit log

-- People of the fictitious shop, one per store, who receive the job by membership.
CREATE ROLE manager_sp NOLOGIN IN ROLE store_manager;
CREATE ROLE manager_rj NOLOGIN IN ROLE store_manager;
CREATE ROLE manager_bh NOLOGIN IN ROLE store_manager;

-- The tables leave the superuser: a non-superuser owner is subject to FORCE ROW LEVEL SECURITY (step 03).
ALTER SCHEMA shop OWNER TO app_owner;
ALTER TABLE shop.stores    OWNER TO app_owner;
ALTER TABLE shop.customers OWNER TO app_owner;
ALTER TABLE shop.orders    OWNER TO app_owner;

-- Nothing for PUBLIC, the implicit role of every user.
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA shop FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA gov  FROM PUBLIC;

-- Schemas of the next steps, created now so that the grants are in one place.
CREATE SCHEMA analytics AUTHORIZATION analytics_owner;
CREATE SCHEMA audit;

-- ETL: writes new customers and orders, reads only the stores it validates against.
GRANT USAGE ON SCHEMA shop TO etl_writer;
GRANT SELECT ON shop.stores TO etl_writer;
GRANT INSERT ON shop.customers, shop.orders TO etl_writer;

-- Store managers: read the operational tables; step 03 limits the rows to their store.
GRANT USAGE ON SCHEMA shop TO store_manager;
GRANT SELECT ON shop.stores, shop.customers, shop.orders TO store_manager;

-- The owner of analytics reads the raw tables to build the pseudonymised views.
GRANT USAGE ON SCHEMA shop TO analytics_owner;
GRANT SELECT ON shop.customers, shop.orders, shop.stores TO analytics_owner;

-- Analysts and the dashboard enter only analytics; step 04 decides which views each one reads.
GRANT USAGE ON SCHEMA analytics TO analyst, dashboard;
ALTER DEFAULT PRIVILEGES FOR ROLE analytics_owner IN SCHEMA analytics GRANT SELECT ON TABLES TO analyst;

-- The DPO reads the governance catalogue and, in step 05, the audit log.
GRANT USAGE ON SCHEMA gov, audit TO dpo;
GRANT SELECT ON gov.data_catalog TO dpo;

-- The privileges as a matrix: which job may SELECT or INSERT in which table.
SELECT r.rolname AS role,
       t.tbl     AS table_name,
       has_table_privilege(r.rolname, t.tbl, 'SELECT') AS can_select,
       has_table_privilege(r.rolname, t.tbl, 'INSERT') AS can_insert,
       has_table_privilege(r.rolname, t.tbl, 'UPDATE') AS can_update,
       has_table_privilege(r.rolname, t.tbl, 'DELETE') AS can_delete
FROM pg_roles AS r
CROSS JOIN (VALUES ('shop.customers'), ('shop.orders'), ('gov.data_catalog')) AS t(tbl)
WHERE r.rolname IN ('etl_writer', 'analyst', 'dashboard', 'manager_sp', 'dpo')
ORDER BY r.rolname, t.tbl;

-- The ETL writes but cannot read what it wrote: least privilege in one line.
SET ROLE etl_writer;
SELECT has_table_privilege('shop.customers', 'INSERT') AS etl_can_insert,
       has_table_privilege('shop.customers', 'SELECT') AS etl_can_select;
RESET ROLE;
