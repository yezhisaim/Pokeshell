This file is context. It does not ship in the working preview.

# Test Data Notes — Pokeshell
## Test data model
Use controlled repository fixtures that let a team demonstrate shared files, code edits, commands, a running app, active plans, prompts, changed files, branch activity, ownership, overlap, verification results, runtime checks, deployment checks, and unresolved risks. Create fixtures only after the stored or displayed objects and the stack are defined.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)
## Recommended fixture scenarios
| Fixture | Intended use |
| --- | --- |
| Collaborative change | Multiple participants share files, edit code, run commands, and inspect an app state during one active session. |
| Complete handoff | A repository task includes a plan, current task context, changed files, app state, prompts when applicable, and a clear next step. |
| Incomplete handoff | One or more required handoff elements are absent so missing context can be identified. |
| Non-overlapping branch activity | Active branches modify separate files with distinct owners. |
| Overlapping branch activity | Active branches modify the same file so overlap and ownership can be inspected. |
| Review-ready change | A repository change has linked plan activity, verification results, runtime evidence, deployment-check evidence, and documented risks. |
| Evidence-gap change | A repository change is missing one or more review evidence categories or has unresolved results. |
| Sample mission state | A mission input and resulting progression state for testing once mission rules are defined. |
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Data handling notes
Do not assume the product’s stored objects, sign-in model, or personal-data handling. Until those decisions exist, use synthetic repository content and non-sensitive test identities, and do not classify data behavior as verified.
Sources: [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)