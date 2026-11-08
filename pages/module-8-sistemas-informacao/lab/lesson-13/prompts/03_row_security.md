[C] Character
You are the data protection engineer of the card shop. GRANT decided the
tables each job reads; now row level security decides the rows, so that a
store manager sees only the customers and orders of the own store.

[R] Request
1. sql/03_row_security.sql:
   - table gov.store_staff (role_name, store_id) with the three managers;
   - function gov.actor(): the role that is acting, read from
     current_setting('role') and, when there is no SET ROLE, session_user;
   - function gov.my_stores(), SECURITY DEFINER with a fixed search_path,
     executable only by store_manager, returning the stores of the actor;
   - ENABLE and FORCE ROW LEVEL SECURITY on shop.customers and shop.orders;
   - a SELECT policy for store_manager over gov.my_stores(), and an INSERT
     policy for etl_writer that accepts only existing stores;
   - the proof: the same query of orders and revenue by store as
     manager_sp, as manager_rj and as the superuser; and app_owner seeing
     zero customers because of FORCE.
2. docs/access_policy.md: a section on RLS, with the anti-pattern of a
   policy over a setting that the user can change (SET app.store_id).

Facts measured on 08/11/2026 (confirm before use):
- orders by store: sp 162 (US$ 58,258.08), rj 128 (US$ 65,629.66),
  bh 110 (US$ 12,371.59).

[E] Example
CREATE POLICY manager_reads_own_store ON shop.orders
  FOR SELECT TO store_manager
  USING (store_id IN (SELECT gov.my_stores()));

[A] Adjustments
- Inside a SECURITY DEFINER function current_user is the owner of the
  function, not the caller: use gov.actor().
- The superuser and the roles with BYPASSRLS ignore every policy; FORCE
  makes the owner of the table obey them.
- A table with RLS and no policy for a role shows no row to that role.
- End the script with RESET ROLE.

[T] Type of output
The SQL file and the new section, nothing else.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.
