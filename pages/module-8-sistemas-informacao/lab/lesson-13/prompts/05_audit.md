[C] Character
You are the data protection engineer of the card shop. The LGPD asks the
controller to keep a record of the operations on personal data (art. 37);
you write the audit log of the DataApp.

[R] Request
1. sql/05_audit.sql:
   - table audit.events (event_id, at_unix, actor, action, table_name,
     row_key, purpose, columns), readable only by dpo;
   - a trigger that refuses every UPDATE and DELETE of audit.events;
   - a SECURITY DEFINER trigger on shop.customers that logs every INSERT,
     UPDATE and DELETE with the actor and the names of the changed columns,
     never their values;
   - function shop.lookup_customer(customer_id, purpose), SECURITY DEFINER,
     the only door to name, e-mail and phone: it refuses who is not a store
     manager, a purpose shorter than 10 characters and a customer of another
     store, and logs a READ event with the purpose; EXECUTE revoked from
     PUBLIC and granted to store_manager;
   - three events: manager_sp looks up customer 1, etl_writer inserts
     customer 61, the superuser corrects the e-mail of customer 1;
   - as dpo, the log and the count of events by actor and action.

[E] Example
INSERT INTO audit.events (actor, action, table_name, row_key, columns)
VALUES (gov.actor(), TG_OP, TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
        rec ->> 'customer_id', changed);

[A] Adjustments
- A trigger never sees a SELECT: reads of personal data are logged by the
  function that serves them.
- The log is append-only and holds no personal data besides the key of the
  row, otherwise it becomes a second copy to protect.
- at_unix is Unix time in seconds (extract(epoch FROM now())::bigint).
- Fix the search_path of every SECURITY DEFINER function.
- End the script with RESET ROLE.

[T] Type of output
The SQL file and nothing else.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.
