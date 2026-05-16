---
name: lean-execution
description: Use when executing implementation work efficiently with an inline-first workflow, phase-level review, concise delegated-agent prompts, and bounded verification retries. Use for normal feature work, UI updates, refactors, and plan execution where full delegated-agent rigor is not explicitly required.
---

# Lean Execution

Execute work with the lightest workflow that preserves correctness.

## Default Mode

Default to inline implementation.

Use delegated agents or subagents only for independent review, clearly isolated implementation chunks, parallel side work, or high-risk work that benefits from fresh context.

Apply Lean mode automatically unless risk justifies escalation.

Use these modes:

- **Lean:** Main agent implements inline, with reviewer agents only at phase boundaries or final review. This is the default.
- **Review-only:** Main agent implements, subagent reviews a phase or final diff.
- **Full-rigor:** Worker subagents plus spec review and quality review per task. Use only when the user explicitly asks for full rigor or the work is high-risk.

Before escalating from Lean to Full-rigor, ask the user unless they already requested deep/full-rigor execution. Name the risk and offer the heavier mode. Do not ask before using Review-only when one phase reviewer is enough.

Escalate only when the task touches security/auth/secrets, API contracts, environment handling, database/schema/migrations, generated files, release/CI policy, broad architecture, cross-module state, concurrency, or ambiguous requirements where the wrong choice would cause expensive rework.

## Workflow

1. Read the project’s native instructions and only the relevant rules.
2. Summarize task-local constraints into a short rule capsule.
3. Implement inline by meaningful phase.
4. Run targeted verification after each phase.
5. Use independent reviewer agents at phase boundaries or final review when useful.
6. Use worker agents only for independent chunks with clear owned files.
7. Fix confirmed issues.
8. Run final verification before claiming completion.

## Compact Lifecycle

Treat compaction as an official workflow checkpoint when the platform supports it:

- After spec approval.
- After plan approval.
- After each large implementation phase.
- Before browser verification.
- After final review.

Keep only the decision summary, active constraints, current file/test state, open risks, and next action. Drop old tool logs, stale diffs, and superseded exploration.

## Rule Capsule

When delegating, pass a concise capsule instead of requiring broad context reloads:

```text
- Keep changes scoped to the task and owned files.
- Preserve existing style and public contracts.
- Do not add dependencies unless approved.
- Add or update tests/checks for changed behavior.
- Do not touch unrelated or user-owned files.
- Run named verification commands.
- Report changed files, checks, and concerns.
```

Only send full project rules when the task touches security, API contracts, environment/secrets, database migrations/schema, generated files, or other brittle project rules.

## Plan Size Budget

Prefer outcome-based plans. Include:

- goal
- files
- acceptance criteria
- tests
- risks

Avoid long code blocks unless exact contracts, schemas, or migrations must be pinned down. When dispatching an agent, pass only the task slice it owns, not the whole plan.

## Review Cadence Budget

Do not review every small task by default.

Use review after phase A, review after phase B, and final review. Use per-task spec and quality review only in Full-rigor mode.

## Browser Retry Budget

For local browser verification:

1. Attempt normal localhost.
2. Attempt one fallback.
3. Stop and report the blocker.

Do not enter long server/background/file URL/browser-policy debugging unless the user asks for that investigation.

## Tool Output Budget

Report summary-first:

- Test pass: command plus count.
- Build pass: command plus exit 0.
- Diff: only relevant hunks or file summary.
- Long logs: only the root error and immediate context.

Do not paste full plans, test logs, browser traces, or build output unless requested.

## Skill Loading Budget

Load the smallest useful skill set:

- Normal implementation: this skill plus verification rules.
- Bug: systematic debugging.
- Large plan: brainstorming, writing plans, then compact.
- Browser skill: only when local UI verification is actually due.
- Subagent-driven workflow: only after the mode gate says Full-rigor or worker isolation is valuable.

## Subagent Prompt Budget

Each delegated prompt should contain only:

- goal
- owned files
- rule capsule
- acceptance checks
- test commands
- expected output format

Do not include full chat history, full plans, full rules, or large code snippets unless an exact contract is required.
