[C] Character
You are the same test engineer. The suite passes on your machine; now it
must run on every push, without anyone remembering to run it, on the
GitLab of Inteli (git.inteli.edu.br).

[R] Request
1. .gitlab-ci.yml at the root of the repository, with the image
   python:3.12-slim, a pip cache keyed by pyproject.toml, and three stages:
   - test: two jobs that install the package and run pytest with
     --junitxml, one for the tests of the package (tests/test_*.py) and
     one for tests/scenarios; both publish the JUnit report with
     artifacts:reports:junit, even when a test fails (when: always), and
     the job of the scenarios keeps out/traceability.json;
   - report: a job traceability that needs test:scenarios, runs also
     after a failure (when: always) and publishes the table of
     tools/traceability.py --markdown as an artifact;
   - smoke: a job that runs only in a pipeline schedule:
     tcg-dataapp run --with-today, then the check of freshness of S11.
2. workflow:rules so that a commit pushed to a branch with an open merge
   request runs one pipeline (the merge request pipeline), not two.
3. Push the branch, open a merge request to main and show the pipeline,
   the test report of the merge request and the artifact of the tree.
4. In Settings > Merge requests, turn on "Pipelines must succeed", and
   in CI/CD > Schedules create a schedule of main at 0 6 * * * (UTC).

Facts measured on 12/11/2026 (confirm before use):
- the merge request pipeline of version 0.3.0: 9 tests in test:unit and
  20 in test:scenarios, all passed; the tree reports 14 of 14 PASS.
- a commit that disables the gate of S04 (MAX_NULL_SHARE = 1.0) fails
  test:scenarios with 1 test, TC04.1; traceability still runs and marks
  S04 FAIL 1/2; with "Pipelines must succeed" the merge is blocked.

[E] Example
test:scenarios:
  stage: test
  script:
    - pytest tests/scenarios --junitxml=out/junit-scenarios.xml
  artifacts:
    when: always
    reports:
      junit: out/junit-scenarios.xml

[A] Adjustments
- The pipeline has no secret and no network in the tests: the plugin of
  conftest.py already blocks it. Only the smoke job uses the network.
- A failed test is never retried in CI and never marked allow_failure:
  the red pipeline is the result that the merge request must show.
- Do not commit .venv/, out/ or warehouse/; .gitignore already lists them.

[T] Type of output
The file, the output of git push, and a description of what GitLab shows:
the pipeline graph, the test report and the widget of the merge request.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.
