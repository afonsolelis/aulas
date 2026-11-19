# BUG-2 · Pull requests in the weeks before the incident

## PR #4488 · 2026-07-24 · "Split payment: order total becomes a list of payment parts"
Author: payments squad · Reviewers: 2 · Checks: green · Coverage on new code: 94%

Description: "Adds split payment behind the `split_payment` release flag. `Order.payment` is now a list of parts. `Order.total_minor` is unchanged. Added `Order.amount_due_now_minor` for the card or cash part, which is what the payment gateway needs."

```diff
+++ b/src/orders/model.py
 class Order:
     total_minor: int
+    payment_parts: list[PaymentPart]
+
+    @property
+    def amount_due_now_minor(self) -> int:
+        return sum(p.amount_minor for p in self.payment_parts if p.method != "credit")
```

Tests added (all green):
```python
def test_amount_due_now_excludes_credit():
    order = make_order(total_minor=100_00, parts=[("credit", 60_00), ("card", 40_00)])
    assert order.amount_due_now_minor == 40_00

def test_total_unchanged_with_split():
    order = make_order(total_minor=100_00, parts=[("credit", 60_00), ("card", 40_00)])
    assert order.total_minor == 100_00
```

## PR #4495 · 2026-07-29 · "ERP connector: send the amount actually charged"
Author: integrations squad · Reviewers: 1 · Checks: green · Coverage on new code: n/a (excluded path)

Description: "Distributors complained that cash-on-delivery orders showed as paid in the ERP. We now send what is collected at delivery or by card. Uses the new property from #4488."

```diff
--- a/src/orders/adapters/erp/invoice_mapper.py
+++ b/src/orders/adapters/erp/invoice_mapper.py
 def to_erp_invoice(order):
     return {
         "external_id": order.id,
-        "amount": order.total_minor / 100,
+        "amount": order.amount_due_now_minor / 100,
         "currency": order.currency,
         "lines": [to_erp_line(l) for l in order.lines],
     }
```

Review comment: "Makes sense. The ERP sandbox is down again so I could not run the connector tests, but the unit tests pass."

## Tests in the repository for the ERP connector
```python
def test_invoice_has_external_id_and_currency():
    order = make_order(total_minor=100_00)                 # single payment, card
    inv = to_erp_invoice(order)
    assert inv["external_id"] == order.id and inv["currency"] == "MXN"

def test_invoice_amount_matches_order_total():
    order = make_order(total_minor=100_00)                 # single payment, card
    assert to_erp_invoice(order)["amount"] == 100.00
```

The end-to-end suite runs nightly on one configuration per region: tier basic, integration app-only, all optional features off.
