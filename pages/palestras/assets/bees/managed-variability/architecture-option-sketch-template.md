# Architecture Option Sketch

BEES Functional Trainings · Engineering & Platform · Workshop 1 · Designing for Managed Variability

Group: ______   Lead: ______   Recorder: ______   Timekeeper: ______   Skeptic: ______

Fill one block per need. Write ranges or "unknown" when you do not know; list what you would
need to find out in "Missing information".

---

## Need __: ________________________________

**Type of variation** (domain / commercial / regulatory / release / infrastructure):

**Binding time** (build / deploy / runtime) and why:

| | Option A | Option B |
|---|---|---|
| Mechanism (configuration, metadata, entitlement, feature flag, extension point, adapter, deployment stamp) | | |
| Where the variation is encapsulated | | |
| Effect on code (coupling, files touched) | | |
| Effect on deployment | | |
| Testing cost (what must be tested, how many combinations) | | |
| Operating cost (support, observability, on-call) | | |
| Isolation and blast radius | | |
| Cost (build now and run per year, as a range) | | |

**Missing information:**

**Preferred option and provisional direction:**

**If the preferred option fails:** what happens to the retailer using the app, and to the
critical services (order issuing, catalog and pricing)?

**What would change our mind:**

---

## Agent impact map (need 1 only)

| Occurrence reported by the agent | Confirmed? (yes/no) | Notes |
|---|---|---|
| | | |

Occurrences the agent missed:

Proposed extraction (primitive, where it lives, what replaces the conditionals):
