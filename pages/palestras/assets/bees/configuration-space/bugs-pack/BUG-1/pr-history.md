# BUG-1 · Pull requests touching `src/orders/rules/regional/` in the four weeks before the incident

## PR #4471 · 2026-07-02 · "Move regional rules into per-market modules"
Author: platform squad · Reviewers: 2 · Checks: green · Coverage on new code: 92%

Description: "Pure refactoring. Each market gets its own rules module so we stop growing the country if/else in `checkout.py`. Also excludes the per-market config from coverage, since it is just data."

```diff
--- a/src/orders/checkout.py
+++ b/src/orders/checkout.py
-    if country == "CO" and tier in ("basic", "plus"):
-        if cart.total_minor < 15_000_000:
-            raise BelowMinimumOrder(country, tier)
+    rules = regional.rules_for(tenant.region)
+    rules.check_minimum(cart, tenant.tier)
```

```diff
+++ b/src/orders/rules/regional/co_andes.py
+MIN_ORDER_MINOR = {"basic": 15_000_000, "plus": 15_000_000}   # COP 150,000.00
+
+def check_minimum(cart, tier):
+    minimum = MIN_ORDER_MINOR.get(tier)
+    if minimum is not None and cart.total_minor < minimum:
+        raise BelowMinimumOrder("CO", tier)
```

## PR #4519 · 2026-08-07 · "Unify minimum-order checks across markets"
Author: platform squad · Reviewers: 1 · Checks: green · Coverage on new code: n/a (excluded path)

Description: "Mexico and Colombia had the same check written twice. Moves it into a shared helper. Behaviour unchanged."

```diff
+++ b/src/orders/rules/regional/_shared.py
+def enforce_minimum(cart, minimum, market, tier):
+    if minimum is not None and not cart.total_minor > minimum:
+        raise BelowMinimumOrder(market, tier)
```

```diff
--- a/src/orders/rules/regional/co_andes.py
+++ b/src/orders/rules/regional/co_andes.py
 def check_minimum(cart, tier):
-    minimum = MIN_ORDER_MINOR.get(tier)
-    if minimum is not None and cart.total_minor < minimum:
-        raise BelowMinimumOrder("CO", tier)
+    enforce_minimum(cart, MIN_ORDER_MINOR.get(tier), "CO", tier)
```

Review comments on #4519:
- "LGTM, nice cleanup."
- "Do we have tests for Mexico still passing?" · "Yes, `test_mx_minimum_blocks_small_cart` is green."

## Tests in the repository that touch minimum orders
```python
def test_mx_minimum_blocks_small_cart():
    cart = Cart(total_minor=50_000)          # MXN 500.00, far below the minimum
    with pytest.raises(BelowMinimumOrder):
        mx_central.check_minimum(cart, "basic")

def test_co_minimum_allows_large_cart():
    cart = Cart(total_minor=40_000_000)      # COP 400,000.00
    co_andes.check_minimum(cart, "basic")    # no exception
```
