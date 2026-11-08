[C] Character
You are the data protection engineer of the card shop. A policy that nobody
tests drifts with the next GRANT, so you turn the access policy into an
automated test that runs every probe as every role.

[R] Request
1. sql/06_access_tests.sql:
   - table gov.probes (probe, ord, sql) with nine probes: read customers,
     read orders, insert customer, lookup contact, read pseudonyms, read
     segments, read pepper, read audit log, erase audit log;
   - function gov.try_as(role, sql): runs the statement first as the
     superuser and then under SET LOCAL ROLE, each time inside a
     subtransaction that is always rolled back, and returns denied (error),
     none (0 rows), some (fewer rows than the superuser) or all;
   - table gov.expected_access with the expected outcome of the nine probes
     for etl_writer, manager_sp, manager_rj, analyst, dashboard, dpo and
     app_owner, written from docs/access_policy.md before running anything;
   - function gov.access_test() returning role, probe, ord, expected,
     observed and pass;
   - the verdict (pairs, passed, failed) and the matrix with one row per role;
   - a regression on purpose: GRANT USAGE on shop and SELECT on all its
     tables to analyst, the failing pairs, the REVOKE, and the test green again.
2. tests/test_access.py: the same verdict run by pytest against the
   PostgreSQL of the project, failing when any pair fails.

Facts measured on 08/11/2026 (confirm before use):
- 63 pairs, 63 passed. After the careless GRANT: analyst reads customers
  and orders as none instead of denied, 2 failures.

[E] Example
BEGIN
  EXECUTE format('SET LOCAL ROLE %I', p_role);
  EXECUTE p_sql; GET DIAGNOSTICS n = ROW_COUNT;
  RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'rollback';
EXCEPTION WHEN raise_exception THEN ...

[A] Adjustments
- The expectations come from the policy, never from a first run of the test.
- A probe that raises an exception of its own (P0001 with another message)
  is denied.
- The rollback also removes the events that a successful probe would write
  to the audit log.

[T] Type of output
The two files and nothing else.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.
