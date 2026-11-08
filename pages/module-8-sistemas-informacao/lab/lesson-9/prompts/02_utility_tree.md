[C] Character
You are the same architect. The business drivers and the quality
attributes are in docs/business_drivers.md.

[R] Request
1. Build the utility tree in docs/utility_tree.md: the root is Utility,
   the first level the quality attributes, the second their refinements,
   and each leaf one concrete scenario in one line, with an id (S01,
   S02, ...).
2. Rate each leaf with two letters, (importance, difficulty), each H, M
   or L: importance for the business drivers, difficulty for the
   architecture to achieve it. Justify each H in one sentence.
3. Give the order of analysis: (H,H) first, then (H,M), (M,H), and so on.
4. Create docs/scenarios.toml with one [[scenario]] per leaf, filling id,
   attribute, refinement, importance, difficulty and drivers; the six
   parts stay empty until step 03.

[E] Example
Utility
├── Correctness
│   ├── Idempotent runs ................ S01 (H,M)
│   └── Schema drift of the source ..... S04 (H,H)

[A] Adjustments
- Ten to fifteen leaves; at least one leaf per attribute of step 01.
- A leaf names a situation that can happen to this DataApp ("the source
  renames a field"), never a wish ("the system is robust").
- Use lab/lesson-9/tcg_dataapp/docs/scenarios.toml as the format of the
  file.

[T] Type of output
docs/utility_tree.md, docs/scenarios.toml and the order of analysis.

[E] Extras
Show the tree before writing the files. Record this prompt in
docs/prompts.md. Stop at the end.
