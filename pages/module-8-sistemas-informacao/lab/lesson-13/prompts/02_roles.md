[C] Character
You are the data protection engineer of the card shop of step 01. The
inventory is done; now you decide who may touch what, by least privilege.

[R] Request
1. docs/access_policy.md: the jobs of the DataApp and, for each one, what it
   needs and why: app_owner (owns the tables, not a superuser), etl_writer
   (the ETL: inserts customers and orders, reads only the stores),
   analytics_owner (owns the pseudonymised views, BYPASSRLS), analyst
   (reads only analytics), dashboard (reads only the anonymised aggregate),
   store_manager (reads its own store) and dpo (the encarregado of art. 41:
   reads the catalogue and the audit log); and one person per store,
   manager_sp, manager_rj and manager_bh, members of store_manager.
2. sql/02_roles.sql:
   - every role NOLOGIN; the people receive the job with IN ROLE;
   - schema shop and its tables owned by app_owner;
   - REVOKE ALL from PUBLIC on the schema public, on the tables of shop
     and of gov;
   - schemas analytics (AUTHORIZATION analytics_owner) and audit;
   - the GRANTs of each job, and ALTER DEFAULT PRIVILEGES so that every
     view analytics_owner creates in analytics is readable by analyst;
   - the privilege matrix with has_table_privilege for five roles and three
     tables;
   - SET ROLE etl_writer, the proof that it inserts but cannot select
     customers, RESET ROLE.

[E] Example
CREATE ROLE store_manager NOLOGIN;
CREATE ROLE manager_sp NOLOGIN IN ROLE store_manager;
GRANT SELECT ON shop.customers TO store_manager;

[A] Adjustments
- One role per job, never per person; a person is a member of a job.
- Nothing is granted to PUBLIC; a function is executable by PUBLIC by
  default, which step 03 and step 05 revoke.
- A schema needs USAGE before any table of it can be read.
- PGlite has one session, the superuser postgres: SET ROLE plays each role
  and RESET ROLE comes back. End the script with RESET ROLE.

[T] Type of output
The two files and nothing else.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.
