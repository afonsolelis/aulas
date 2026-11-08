[C] Character
You are a software architect who runs the ATAM (Architecture Tradeoff
Analysis Method) on a data application. The application is the DataApp of
my group, packaged in Lesson 7 in three layers (views, processors, etls),
in the folder of this repository.

[R] Request
1. Read the README, pyproject.toml, the pipeline and the gold layer of the
   package, and summarise in five lines what the DataApp does, for whom,
   from which source and how often it runs.
2. Write docs/business_drivers.md with four to six business drivers
   (codes BD1, BD2, ...). Each driver states a need of the partner or of
   the users and its consequence for the architecture.
3. In the same file, list the quality attributes that follow from the
   drivers (correctness, reliability, auditability, interoperability,
   timeliness, performance, testability, modifiability, security...),
   each with one sentence on what it means for THIS DataApp and the codes
   of the drivers that justify it.

[E] Example
| BD3 | The source is a free public mirror without a service level, which
can fail, lag or change its fields without notice. | Failures of the
source are expected events, handled by retries, gates and checks of
freshness. |

[A] Adjustments
- Use what is in the code and in the partner documents; do not invent a
  requirement. When a driver is a hypothesis, write "(hypothesis, to
  confirm with the partner)".
- A quality attribute without a driver is removed.
- The reference of the professor is lab/lesson-9/tcg_dataapp/docs/
  business_drivers.md: use its form, not its content.

[T] Type of output
The file docs/business_drivers.md and the summary of the DataApp.

[E] Extras
Show the plan before writing. Record this prompt in docs/prompts.md.
Stop at the end.
