# Implementer Subagent Prompt Template

Use this concise template when dispatching a worker subagent.

```text
Task tool (general-purpose):
  description: "Implement [phase/task name]"
  prompt: |
    You are implementing: [goal]

    ## Owned Files
    - [path]
    - [path]

    ## Task Slice
    [Only the relevant phase/task requirements. Do not paste the full plan.]

    ## Constraints Capsule
    - Scope changes to owned files and task requirements.
    - Do not touch unrelated or user-owned changes.
    - Do not add dependencies unless approved.
    - Preserve existing public contracts and style.
    - Add or update tests/checks for changed behavior.
    - Run named verification commands.
    - Report status, files changed, checks run, and concerns.

    ## Acceptance Checks
    - [observable condition]
    - [observable condition]

    ## Verification Commands
    - `[command]`

    ## Stop Conditions
    Stop and report NEEDS_CONTEXT or BLOCKED if:
    - requirements are ambiguous
    - owned files are insufficient
    - the task requires unrelated edits
    - verification cannot run
    - risk is higher than described

    ## Expected Output
    - Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - Files changed
    - Verification run and result
    - Concerns or follow-up needed
```
