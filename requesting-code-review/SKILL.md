---
name: requesting-code-review
description: Use when completing a major phase, risky implementation slice, or final development pass to verify work meets requirements without reviewing every small task by default
---

# Requesting Code Review

Dispatch reviewer agents at meaningful boundaries. The reviewer receives curated context for the work product, not session history.

## Review Cadence Budget

Default cadence:

- after a meaningful implementation phase
- after a second major phase if the work is broad
- final review before claiming completion or merging

Do not request review for every small task by default. Use per-task spec and quality review only when the user asks for Full-rigor or the task is high-risk.

## When to Request Review

**Mandatory:**

- After high-risk security, API, environment, database, migration, or generated-file work.
- After completing a major feature phase.
- Before merge or final completion on non-trivial work.

**Optional:**

- When stuck and fresh context would help.
- Before a risky refactor.
- After fixing a complex bug.

## Reviewer Context Budget

Pass only:

- what changed
- requirement or phase slice
- relevant files or git range
- test commands and results
- known concerns

Do not pass full chat history, full plans, old logs, or unrelated diffs.

## How to Request

1. Identify the review boundary: phase, risky slice, or final diff.
2. Get the relevant git range or file list.
3. Fill `code-reviewer.md` with the concise context.
4. Act on feedback:
   - Fix Critical issues immediately.
   - Fix Important issues before proceeding.
   - Track Minor issues only if they matter for the goal.
   - Push back with technical evidence when the reviewer is wrong.

## Integration

**Lean execution:** Review phase boundaries and final diff.

**Review-only:** Main agent implements; reviewer checks a phase or final diff.

**Full-rigor:** Use spec review and quality review per task only when the mode gate justifies the cost.

## Red Flags

Never:

- use review as a substitute for running verification
- paste huge logs into reviewer prompts
- ignore Critical or Important issues without reasoning
- keep re-reviewing tiny edits when a phase review would suffice

See template at: `requesting-code-review/code-reviewer.md`
