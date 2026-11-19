# Impact map (pre-generated output of a coding agent)

No-login alternative for the Architecture Option Lab. This file reproduces the kind of answer a
coding agent returns when asked, on the `tradeline-orders-sample` repository:

> "Find every place where the country decides tax behaviour, in all layers, and propose the
> extraction into a configurable tax policy."

It was generated as an agent would generate it and was NOT reviewed. Treat it as a draft: verify
every line against the repository, look for what is missing, and remove what does not belong.

---

## Agent output

I searched the repository for country-based conditionals related to tax. I found **8
occurrences** in 6 files. This is the complete list.

| # | File | Line(s) | Snippet | Layer |
|---|---|---|---|---|
| 1 | `ui/src/checkout/taxDisplay.ts` | 6-17 | `if (country === 'BR') { return 'ICMS'; } else if ...` | UI |
| 2 | `ui/src/checkout/OrderSummary.tsx` | 22-24 | `order.country === 'BR' && order.stAmount` | UI |
| 3 | `ui/src/checkout/OrderSummary.tsx` | 25-27 | `order.country === 'MX'` (CFDI note) | UI |
| 4 | `service/orders/pricing.py` | 11-22 | `if order.country == "BR": tax = subtotal * 0.18 ...` | Service |
| 5 | `service/orders/issue.py` | 17-18 | `if order.country == "MX" and not order.customer.fiscal_id` | Service |
| 6 | `service/orders/issue.py` | 24-28 | `if order.country == "BR" and order.customer.customer_id == "DIST-0042"` | Service |
| 7 | `service/markets.py` | 17-19 | `if country in SUPPORTED_MARKETS: return True` | Service |
| 8 | `db/migrations/002_add_dist0042_st_override.sql` | 3 | `ADD COLUMN dist0042_st_override` | Database |

## Proposed extraction

1. Create `service/tax/policy.py` with a `TaxPolicy` resolved from the market context:
   `rate`, `tax_name`, `requires_fiscal_id`, `substitution_rate`.
2. Load policies from a configuration table `tax_policies (country, rate, tax_name, ...)`.
3. Replace occurrences 1-8 with calls to `TaxPolicy.for_market(country)`.
4. Replace the `dist0042_st_override` column with a generic `customer_tax_overrides` table.

All tax conditionals are covered by this plan; no other changes are needed.
