# Task: validate-next-story

Validate a story draft using the 10-point PO checklist.

## Usage
`/AIOX:tasks:validate-next-story [story-id]`

## Description
Runs the 10-point validation checklist and returns GO/NO-GO verdict.
Loads full task from: `.aiox-core/development/tasks/validate-next-story.md`

## Decision
- **GO** (>=7/10) — story is Ready for development
- **NO-GO** (<7/10) — required fixes listed

## Agent
@po (Pax)
