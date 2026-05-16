# Token Budget Policy

Use the smallest workflow that preserves correctness.

## How This Policy Applies

Apply this policy automatically as the baseline. The agent should not wait for the user to request token saving.

Start in Lean mode. Escalate only when risk or ambiguity justifies the extra context, agent calls, reviews, or verification.

Before moving from Lean to Full-rigor, ask the user unless they already requested deep/full-rigor execution:

```text
This task has higher risk because [reason]. I can continue in Lean mode, or escalate to Full-rigor with more context, worker/reviewer agents, and broader verification. Do you want the heavier mode?
```

Do not ask before using Review-only when it is a small escalation; use one phase reviewer and keep the prompt concise.

## Default Execution Modes

- **Lean:** Main agent implements inline. Use reviewer agents only after meaningful phases and final review.
- **Review-only:** Main agent implements. A reviewer checks a phase or final diff.
- **Full-rigor:** Worker agents plus spec and quality review per task. Use only when explicitly requested or when risk is high.

## Escalation Signals

Consider more context or a heavier workflow when the task touches:

- security, auth, permissions, secrets, or environment handling
- API contracts, public interfaces, backward compatibility, or SDK behavior
- database schema, migrations, data integrity, or destructive operations
- generated files, build systems, release/CI policy, or packaging
- broad architecture, cross-module state, concurrency, queues, or caching
- unclear requirements where the wrong choice would cause expensive rework

If the risk is real but bounded, use Review-only. Use Full-rigor only when worker isolation or per-task spec/quality review is worth the cost.

## Compact Lifecycle

Compact or summarize context at these checkpoints when the platform supports it:

- after spec approval
- after plan approval
- after each large implementation phase
- before browser verification
- after final review

Keep decision summary, active constraints, current file/test state, open risks, and next action. Drop old tool logs, stale diffs, and superseded exploration.

## Delegation Rule Capsule

Prefer a short rule capsule over reloading full rules:

```text
- Scope changes to owned files and task requirements.
- Do not touch unrelated or user-owned changes.
- Do not add dependencies unless approved.
- Preserve existing public contracts and style.
- Add or update tests/checks for changed behavior.
- Run named verification commands.
- Report files changed, checks run, and concerns.
```

Use full rules only for security, API contracts, environment/secrets, database/schema, generated files, release policy, or similarly brittle areas.

## Plan Budget

Plans should be outcome-based and include only:

- goal
- files
- acceptance criteria
- tests
- risks

Avoid long code blocks unless exact contracts, schemas, migrations, or generated outputs must be pinned down. When delegating, pass only the owned task slice.

## Review Budget

Use phase-level review by default. Do not review every small task unless Full-rigor is explicitly requested or the risk justifies it.

## Browser Budget

For local browser verification:

1. Try normal localhost.
2. Try one fallback.
3. Stop and report the blocker.

Do not spend long cycles debugging server/background/file URL/browser policy unless requested.

## Output Budget

Report summary-first:

- tests: command and pass count
- build: command and exit code
- failures: root error and immediate context
- diff: relevant hunk or file summary only
- long logs: summarized, not pasted

## Subagent Prompt Budget

Prompts to delegated agents should include only:

- goal
- owned files
- constraints capsule
- acceptance checks
- test commands
- expected output format

Do not include full chat history, full plan, full rules, or large code snippets unless an exact contract is required.
