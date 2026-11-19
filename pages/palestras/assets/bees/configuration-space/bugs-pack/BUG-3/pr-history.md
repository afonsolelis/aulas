# BUG-3 · Pull requests in the release 2026.36.0

## PR #4533 · 2026-08-25 · "Rename delivery_window to delivery_slot"
Author: fulfilment squad · Reviewers: 2 · Checks: green · Coverage on new code: 97%

Description: "The product team calls it a slot everywhere. Renames the column and the field. Migration included, tested on a copy of the za-north database."

```diff
+++ b/src/orders/migrations/0193_rename_delivery_window.py
+def upgrade(op):
+    op.alter_column("orders", "delivery_window", new_column_name="delivery_slot")
+
+def downgrade(op):
+    op.alter_column("orders", "delivery_slot", new_column_name="delivery_window")
```

```diff
--- a/src/orders/repository.py
+++ b/src/orders/repository.py
-    INSERT_ORDER = "INSERT INTO orders (id, tenant_id, total_minor, delivery_window) VALUES (...)"
+    INSERT_ORDER = "INSERT INTO orders (id, tenant_id, total_minor, delivery_slot) VALUES (...)"
```

Tests added (all green):
```python
def test_migration_0193_upgrade_and_downgrade(db_copy):
    run_upgrade(db_copy, "0193")
    assert column_exists(db_copy, "orders", "delivery_slot")
    run_downgrade(db_copy, "0193")
    assert column_exists(db_copy, "orders", "delivery_window")

def test_insert_order_with_slot(db):
    repo.insert(make_order(delivery_slot="2026-09-03T08:00/10:00"))
    assert repo.get(...).delivery_slot is not None
```

## Deployment runbook in use for za-north (excerpt)
1. Run pending migrations on the regional database.
2. Start the rolling deployment of orders-service, two nodes at a time.
3. Watch the global error-rate dashboard for 15 minutes.
4. If the global error rate exceeds 2%, roll back.

Note from the deployment log: the global error rate peaked at 0.7% during the window, because orders with a delivery slot are about 6% of the orders in za-north and za-north is about 15% of global traffic.
