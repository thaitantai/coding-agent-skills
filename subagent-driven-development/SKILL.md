---
name: subagent-driven-development
description: Use when executing implementation plans with independent high-risk tasks in the current session, especially when the user explicitly requests full-rigor worker and reviewer subagents
---

# Subagent-Driven Development

Use worker subagents only when they materially reduce risk or context load. This skill is a Full-rigor workflow, not the default execution path.

## Token Gate

Choose the lightest safe mode before dispatching agents:

```text
Lean:
- default mode
- main agent implements inline
- reviewers only at phase boundaries or final review

Review-only:
- main agent implements
- subagent reviews phase or final diff
- useful when broad behavior changed but worker isolation is unnecessary

Worker + Reviewer:
- implementation slice is independent
- owned files are clear
- worker can finish without full chat history
- fresh context reduces risk

Full-rigor:
- user explicitly asks for full rigor
- security/API/env/database/generated-file work
- migration/refactor blast radius is high
- missing requirements would be expensive
```

If the gate selects Lean or Review-only, do not run the per-task worker + spec reviewer + quality reviewer loop. Use the lighter workflow.

## Core Principle

When Full-rigor is justified, dispatch narrow workers with isolated context and review at the necessary cadence. Do not pass session history. Provide only the owned task slice, constraints, acceptance checks, and test commands.

## Rule Capsule

Every worker prompt should include this capsule unless the task requires full project rules:

```text
- Scope changes to owned files and task requirements.
- Do not touch unrelated or user-owned changes.
- Do not add dependencies unless approved.
- Preserve existing public contracts and style.
- Add or update tests/checks for changed behavior.
- Run named verification commands.
- Report status, files changed, checks run, and concerns.
```

Load full rules only for security, API contracts, environment/secrets, database/schema, generated files, release/CI policy, or similarly brittle areas.

## Subagent Prompt Budget

Each worker prompt should contain:

- goal
- owned files
- relevant task slice
- rule capsule
- acceptance checks
- test commands
- expected output format

Do not include:

- full chat history
- full plan
- broad project rules
- large code snippets unless exact contracts are required
- unrelated context from previous phases

## Review Cadence

Default review cadence is phase-level:

- reviewer after phase A
- reviewer after phase B or the next meaningful phase
- final reviewer before completion

Use per-task spec review plus quality review only in Full-rigor mode.

## Full-Rigor Process

1. Read the approved plan once.
2. Split only independent work into owned slices.
3. Create a task list for coordination.
4. Dispatch one worker per independent slice when write sets do not conflict.
5. Verify each worker result by reading the diff and running named checks.
6. Run spec review for the slice if requirements are brittle.
7. Run code quality review for the slice if risk remains.
8. Fix confirmed issues.
9. Run final review across the integrated implementation.
10. Run final verification before claiming completion.

## Handling Worker Status

Workers report one of four statuses:

- **DONE:** Verify diff and checks, then continue.
- **DONE_WITH_CONCERNS:** Read concerns before review or integration.
- **NEEDS_CONTEXT:** Provide the missing context or narrow the task.
- **BLOCKED:** Change approach, model, context, or slice size before retrying.

Never force repeated retries without changing the blocker.

## Prompt Templates

- `./implementer-prompt.md` - worker dispatch template
- `./spec-reviewer-prompt.md` - spec compliance reviewer template
- `./code-quality-reviewer-prompt.md` - quality reviewer template

## Red Flags

Stop and choose a lighter mode when:

- tasks are tightly coupled
- the worker needs broad session history
- the slice cannot name owned files
- review cost exceeds implementation risk
- the user did not request full rigor and risk is low

Stop and escalate when:

- requirements are ambiguous enough to change architecture
- verification cannot run
- security, data, or migration risk is unclear
- worker output conflicts with user-owned changes
