# Pokeshell — Plan-to-Execution Board
## Purpose
This feature supports coordinated repository work by connecting execution to plans, tests, and deployment checks, while retaining the shared context needed for handoffs and progress review.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Users and context
The feature serves software engineering teams working together on repositories, feature branches, reviews, debugging, and coordinated AI coding tasks. It is used during active development when teammates need to hand off work, coordinate overlapping changes, execute approved plans, or review progress.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [soul.md](/workspace/docs/soul.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Core flow
1. A team works in a live session with shared files, commands, code edits, and a running app.
2. The team uses shared development context to connect execution activity with plans, tests, and deployment checks.
3. During a handoff, the receiving developer or AI agent can continue from the active plan, current task context, changed files, application state, and a clear next step.
4. During review, reviewers assess code activity together with plans, tests, deployment checks, and unresolved risks.
The record does not define how a plan is created, how execution steps are represented, how links are added, or how work moves between these stages.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Screens
The recorded surface is a terminal. Named screens, layouts, navigation, and feature-specific views are not specified.
### Required screen decisions
- Which terminal views present execution steps, linked plans, test requirements, and deployment checks?
- How are changed files, branch ownership, and overlapping work shown alongside execution context?
- Where does a user view handoff context and review evidence?
- Which views, if any, are shared live versus shown as a saved handoff or review record?
Sources: [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)
## Controls
| Capability or control | What it does | Open detail |
| --- | --- | --- |
| Run commands | Lets users run commands during active development work. | The command-entry interaction, output handling, permissions, and shared-session behavior are not specified. |
| Edit code | Lets users edit code while working with the team’s shared development context. | The editing interaction, concurrency behavior, and change-history behavior are not specified. |
| Inspect ownership and overlap | Makes active ownership and overlapping code changes available for coordination. | The presentation, assignment behavior, and conflict-resolution behavior are not specified. |
| Connect execution to verification | Connects execution activity with plans, tests, and deployment checks. | The interaction that creates, updates, or removes these connections is not specified. |
| Review shared context | Supports assessment of code activity, plans, tests, deployment checks, and unresolved risks. | The review controls, evidence format, and criteria for a complete review are not specified. |
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Empty, loading, and error states
No empty-state, loading-state, or error-state behavior is defined in the record.
### Empty state
Open question: What should appear when there is no active plan, no linked execution activity, no changed files, or no available review evidence?
### Loading state
Open question: How should the terminal indicate that shared session context, repository state, application state, test results, or deployment checks are still being retrieved?
### Error state
Open question: How should the feature report unavailable repository context, failed commands, missing verification results, or unavailable application state, and what recovery actions should be available?
Sources: [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## What success looks like
Success means engineering teams can develop together in live sessions, hand off work with shared context, coordinate overlapping code changes, and review progress from shared development context. For a handoff, the receiving developer should be able to resume work without missing-context clarification when the active plan, task context, changed files, application state, and next step are captured together. For review, the reviewer should be able to identify missing evidence without reconstructing context from separate sources.
The recorded project target is one paying person within one year, with the current value recorded as zero. No feature-specific completion, adoption, or quality metric is defined.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [soul.md](/workspace/docs/soul.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)