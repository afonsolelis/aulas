# Utility tree

Step 02 of the ATAM. The root is the utility of the system; the first level holds the quality attributes of `business_drivers.md`, the second their refinements, and each leaf is a concrete scenario rated by two letters: (importance for the business drivers, difficulty for the architecture), each H, M or L. Leaves rated (H,H) and (H,M) are analysed first; a leaf rated (L,L) can wait.

```text
Utility
├── Correctness
│   ├── Idempotent runs ................ S01 (H,M)
│   ├── No wrong number published ...... S02 (H,M)
│   ├── Every price reaches the model .. S03 (H,M)
│   ├── Schema drift of the source ..... S04 (H,H)
│   └── Semi-additive measure .......... S05 (H,H)
├── Reliability
│   ├── Transient failure of the source  S06 (H,L)
│   └── Source down for the whole run .. S07 (H,M)
├── Auditability
│   ├── Frozen report never changes .... S08 (H,L)
│   └── Every attempt is logged ........ S09 (M,L)
├── Interoperability
│   └── Contract of the marts .......... S10 (M,L)
├── Timeliness
│   └── Stale data is detected ......... S11 (M,L)
├── Performance
│   └── Processing budget .............. S12 (M,M)
├── Testability
│   └── Tests without network .......... S13 (M,L)
└── Modifiability
    └── Sets by configuration .......... S14 (L,L)
```

Order of analysis: S04, S05 (H,H); S01, S02, S03, S07 (H,M); S06, S08 (H,L); S12 (M,M); S09, S10, S11, S13 (M,L); S14 (L,L).

The same tree with the result of each scenario is printed by `python tools/traceability.py` after `pytest`.
