[C] Character
You are the data protection engineer of our group. The DataApp of the
partner keeps its landing table, its gold layer and its reports in the
ClickHouse of the class (shrek2), in the database lab, where every object
of the group starts with gNN_. We apply the six steps of the lab to it.

[R] Request
1. docs/data_inventory.md: every column of lab.gNN_db_ingestion (the fields
   of data_json, by data_tag) and of the gold views, classified as in step
   01, with the analytics decision of each one.
2. docs/access_policy.md: the jobs of our DataApp (who loads, who analyses,
   which dashboard reads, who answers for the data at the partner) and the
   expected access of each job, as the table of step 06.
3. sql/clickhouse/security.sql, as a reference that the administrator of
   shrek2 runs (our user may lack the privilege ACCESS MANAGEMENT):
   - CREATE ROLE gNN_etl, gNN_analyst, gNN_dashboard;
   - GRANT INSERT ON lab.gNN_db_ingestion TO gNN_etl; GRANT SELECT on the
     gold views to gNN_analyst; GRANT SELECT on one aggregate to
     gNN_dashboard;
   - CREATE ROW POLICY gNN_by_region ON lab.gNN_<table> USING <condition>
     TO gNN_analyst, when the partner has a regional or business-unit cut;
   - a view lab.gNN_<entity>_pseudo with
     substring(hex(SHA256(concat(<pepper>, ':', toString(id)))), 1, 16)
     instead of the identifier, and generalised quasi-identifiers;
   - an aggregate lab.gNN_<entity>_segments with HAVING uniqExact(...) >= 5;
   - SHOW GRANTS FOR each role, as the check.
4. docs/audit.md: where ClickHouse already records who ran what
   (system.query_log: user, query_kind, tables, event_time) and the query
   that lists the reads of our personal tables in the last 7 days.

[E] Example
CREATE ROW POLICY g01_by_state ON lab.g01_fact_sales
  USING state = 'SP' TO g01_analyst;

[A] Adjustments
- The pepper never goes to the repository: it is an environment variable
  of the ETL or a setting of the server, as in the case of the exams of
  this portal.
- In ClickHouse, once a table has a row policy, the users that no policy
  covers see no row by default (unless the server enables
  users_without_row_policies_can_read_rows): check it as each role.
- A row policy filters reads only; whoever may INSERT is decided by GRANT.
- Every date is Unix time in seconds (Int64).
- Replace gNN with the number of the group; never grant or drop anything
  of another group.

[T] Type of output
The files and the statements we could run with our user, with their result.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop after the inventory and the policy and wait for our review before
the SQL.
