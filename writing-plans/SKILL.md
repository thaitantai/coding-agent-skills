---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write concise, outcome-based implementation plans. A plan should preserve decisions, scope, acceptance criteria, tests, and risks without becoming a code dump.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** If working in an isolated worktree, create or verify it at execution time.

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`
- User preferences for plan location override this default.

## Scope Check

If the spec covers multiple independent subsystems, split it into separate plans. Each plan should produce working, testable software on its own.

## Plan Size Budget

Prefer plans that fit in one focused document and can be delegated by slice.

Include only:

- goal
- files
- acceptance criteria
- tests
- risks

Avoid:

- long code blocks
- full chat history
- broad architectural essays
- repeated project rules
- implementation snippets that can be discovered from existing code

Use code blocks only when exact API shape, schema/migration text, generated-file contract, or a user-specified implementation detail must be preserved.

## File Structure

Before defining phases, map the files that will be created or modified and each file's responsibility.

- Follow established codebase patterns.
- Keep ownership boundaries clear.
- Prefer focused files when adding new code.
- Do not plan unrelated refactors.

## Plan Document Header

Every plan should start with:

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence describing the outcome]

**Mode:** Lean by default. Use Review-only or Full-rigor only when justified.

**Files:**
- Create: `path/to/new-file`
- Modify: `path/to/existing-file`
- Test: `path/to/test-file`

**Acceptance Criteria:**
- [Observable requirement]

**Tests:**
- `command`

**Risks:**
- [Risk and mitigation]

---
```

## Phase Structure

Use phases instead of tiny per-line tasks unless the work truly needs step-by-step execution.

```markdown
## Phase N: [Outcome]

**Goal:** [What this phase proves]

**Files:** `path/a`, `path/b`

**Work:**
- [Concrete implementation action]
- [Concrete test/docs action]

**Acceptance Criteria:**
- [Observable pass condition]

**Verification:**
- `command`

**Risk:** [Only if meaningful]
```

## Delegation Rule

When dispatching a worker or reviewer from the plan, pass only the relevant phase/task slice plus a short rule capsule:

- owned files
- constraints
- acceptance checks
- test commands
- expected output format

Do not pass the whole plan unless the task depends on global sequencing.

## Self-Review

Before saving the plan, check:

1. Every requirement maps to a phase or acceptance criterion.
2. File ownership is clear.
3. Tests prove changed behavior.
4. Risks name real failure modes.
5. The plan does not contain placeholder text such as "TBD", "TODO", or "handle edge cases" without specifics.

Fix gaps inline before handing off.

## Execution Handoff

After saving the plan, default to Lean execution:

```text
Plan complete and saved to `docs/superpowers/plans/<filename>.md`.
Default execution mode: Lean (inline implementation with phase-level review).
Use Review-only or Full-rigor only if the risk profile justifies it or you explicitly request it.
```
