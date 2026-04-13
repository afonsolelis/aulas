# Task: qa-gate

Run the QA gate with 7 quality checks.

## Usage
`/AIOX:tasks:qa-gate [story-id]`

## Description
Runs 7 quality checks: code review, unit tests, AC verification, regressions,
performance, security, and documentation.
Loads full task from: `.aiox-core/development/tasks/qa-gate.md`

## Verdicts
- **PASS** — approve, proceed to @devops push
- **CONCERNS** — approve with observations
- **FAIL** — return to @dev with feedback
- **WAIVED** — approve with documented waiver

## Agent
@qa (Quinn)
