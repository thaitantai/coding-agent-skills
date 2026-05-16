# Agent Instructions

Always apply `TOKEN_BUDGET_POLICY.md` before choosing an execution mode.

## Adaptive Token Use

Default to Lean execution automatically. Do not ask permission to use the token budget policy; it is the baseline for this repo.

Use more expensive workflows only when the task justifies it:

- **Lean:** Use by default for normal edits, small/medium implementation, docs, refactors, and verification.
- **Review-only:** Use when a phase changes broad behavior or an independent review is likely to catch meaningful risk.
- **Full-rigor:** Use only when explicitly requested or when the work touches high-risk areas such as security, API contracts, environment/secrets, database/schema, migrations, generated files, release/CI policy, or broad architecture changes.

Before escalating from Lean to Full-rigor, ask the user for approval unless they already requested deep/full-rigor execution.

Use this concise prompt:

```text
This task has higher risk because [reason]. I can continue in Lean mode, or escalate to Full-rigor with more context, worker/reviewer agents, and broader verification. Do you want the heavier mode?
```

Do not ask for escalation when Review-only is enough; just use a phase reviewer and keep the context concise.

## Budget Defaults

- Prefer rule capsules over reloading full rules.
- Prefer phase reviews over per-task reviews.
- Prefer outcome-based plans over code-heavy plans.
- Prefer summary-first tool output.
- Use browser verification with one normal attempt and one fallback, then report blockers.
- Compact or summarize at lifecycle checkpoints when the platform supports it.
