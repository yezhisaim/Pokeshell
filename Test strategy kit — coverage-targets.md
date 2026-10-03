This file is context. It does not ship in the working preview.

# Coverage Targets — Pokeshell
## Coverage principle
Coverage is scenario- and evidence-based rather than percentage-based. A capability is considered covered when its primary collaborative flow, meaningful failure or incompleteness conditions, and visible readiness evidence have been exercised against agreed behavior.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Required capability coverage
| Capability | Coverage target | Evidence to retain |
| --- | --- | --- |
| Live team session | Share files, commands, code edits, and a running app during repository work. Exercise normal collaboration and interrupted or unavailable shared state. | Session context, changed files, command results, and running-app state. |
| Contextual handoff | Capture and resume work with the active plan, current task context, changed files, application state, and clear next step. Exercise complete and incomplete handoffs. | Handoff record and receiving-user resume results. |
| Ownership and overlap | Show ownership and overlapping modified files across active branch work before integration. Exercise distinct-file work and same-file overlap. | Branch activity, modified-file view, ownership display, and overlap display. |
| Progress review | Assess a repository change with plan steps, verification results, runtime checks, deployment checks, and unresolved risks. Exercise complete and missing evidence. | Change review record, linked evidence, and explicit missing or unresolved items. |
| Team missions and progression | Exercise available sample coding missions and the resulting collection or leaderboard state once rules are defined. | Mission inputs, outcome, and visible progression state. |
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Cross-cutting coverage
Each covered capability should be evaluated for collaboration continuity: whether shared context remains understandable when participants hand off work, when branch activity overlaps, when command or app evidence is unavailable, and when review evidence is incomplete. Verify that readiness review retains build, test, lint, and deployment-check results when those checks are available.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Automation targets
Automation targets cannot be selected until the stack and testing instructions are chosen. Once selected, automate stable, repeatable checks for the agreed data model and collaboration behavior; retain exploratory testing for unclear interaction rules and newly discovered edge conditions.
Sources: [AGENTS.md](/workspace/docs/AGENTS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=2) [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)