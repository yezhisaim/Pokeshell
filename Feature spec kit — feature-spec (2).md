# Pokeshell — Session Handoff and Ownership Timeline Feature Spec
## Purpose
This feature supports software engineering teams working together on repositories, branches, reviews, debugging, and coordinated AI coding tasks. It addresses lost momentum caused by developers and AI agents having to reconstruct context from notes, branches, and status updates.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [soul.md](/workspace/docs/soul.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Feature scope
- Team members working in the same repository and branches need visibility into code ownership and overlapping modified files.
- A handoff needs to retain the active plan, current task context, changed files, application state, and a clear next step so another developer or AI agent can continue the work.
- During live repository work, the shared development context includes files, commands, code edits, and the running application.
- This feature contributes to the broader ability to review coordinated work with plans, tests, deployment checks, and unresolved risks in shared context.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Flows
### Live ownership and overlap awareness
1. Team members work in a shared live development session on repository changes.
2. The shared context makes active ownership and overlapping modified files visible while teammates work on the same repository and branches.
3. Teammates use that visibility before merging to identify dependencies and avoid unowned conflicting changes.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### Session handoff and resumption
1. Active repository work has a current plan, task context, changed files, application state, and clear next step.
2. That context is retained together for a handoff.
3. The receiving developer or AI agent resumes repository work from the retained context rather than requesting missing-context clarification.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### Shared-session work
1. Teammates jointly edit code, run commands, and use the same running application during active repository work.
2. The session keeps those collaborators working from shared development context.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Screens and presentation
The only specified surface is a terminal. No screen inventory, navigation structure, layout, or visual treatment is defined in the project record. This specification therefore does not prescribe additional screens or screen-level hierarchy.
The terminal experience needs to make the feature's required information available: shared repository activity, code ownership, overlapping work, and the context needed for a handoff. The precise presentation remains open.
Sources: [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Controls and expected behavior
No control labels, placement, interaction patterns, or command syntax are specified. The required user-facing operations are:
| User need | Required behavior | Control definition |
|---|---|---|
| Understand active ownership | Make ownership of active branch work visible. | Open question |
| Identify overlapping work | Make overlapping modified files visible to teammates working on the same repository and branches. | Open question |
| Hand off work | Retain the current plan, task context, changed files, application state, and clear next step together. | Open question |
| Resume work | Let a receiving developer or AI agent continue with the retained handoff context. | Open question |
| Work together live | Support shared files, commands, code edits, and a running application during active repository work. | Open question |
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Empty, loading, and error states
No empty, loading, error, offline, conflict-resolution, or recovery behavior is defined in the project record. These states must remain unresolved rather than assumed.
Open questions:
- What should the terminal show when there is no active session, branch activity, ownership information, or handoff context?
- What should appear while shared repository context, ownership information, application state, or handoff material is being retrieved?
- How should unavailable repository access, missing application state, unavailable command history, or incomplete handoff context be communicated?
- How should unresolved overlaps or conflicting ownership information be presented and handled?
Sources: [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## What success looks like
Success is indicated when:
- Engineering teams jointly edit code, run commands, and use the same running application in one live session with less context reconstruction and enough value to consider repeat use.
- A receiving developer can resume repository work from the handoff context without needing missing-context clarification.
- Teammates can see overlapping modified files and owners of active branch work before merging, allowing earlier dependency resolution and fewer unowned conflicting changes.
- The project progresses toward its stated target of one paying person within one year.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [soul.md](/workspace/docs/soul.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)