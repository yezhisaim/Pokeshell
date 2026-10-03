This file is context. It does not ship in the working preview.

# Test Plan — Pokeshell
## Purpose and scope
This plan verifies collaborative repository work in live sessions, handoffs with shared context, visibility of overlapping code changes, and progress review from shared development context. It also records the need to validate the product’s team missions, collection, and leaderboard experience, although detailed acceptance behavior for those elements is not yet defined.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Quality objectives
- Confirm teammates can share files, commands, code edits, and a running app while actively working in a repository.
- Confirm a handoff contains the active plan, current task context, changed files, application state, and a clear next step so repository work can resume from that record.
- Confirm active branch work exposes code ownership and overlapping modified files before merging.
- Confirm progress review brings repository changes together with plan steps, verification results, runtime checks, and unresolved risks.
- Confirm release-readiness evidence can collect build, test, lint, and deployment-check results against the active plan.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Test approach
### Scenario-based functional testing
Exercise end-to-end team scenarios using a repository with multiple branches and contributors. Each scenario should produce inspectable shared context rather than relying only on local activity.
1. Start a live session, share repository files, make edits, run commands, and inspect the running app from the shared session.
2. Capture a handoff during active work, then have a receiving developer or agent continue from the saved plan, prompts, changed files, app state, and next step.
3. Create concurrent branch activity that modifies both distinct and overlapping files; inspect ownership and overlap before attempting integration.
4. Review a change using its linked plan activity, test evidence, runtime checks, deployment checks, and unresolved risks.
5. Exercise the available sample coding missions and confirm their outcomes integrate coherently with collection and leaderboard behavior once that behavior is specified.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### Exploratory and resilience testing
Explore changes in session participation, simultaneous edits, failed or interrupted commands, unavailable or changed app state, incomplete handoffs, and incomplete review evidence. Record whether shared context remains understandable and whether the product distinguishes current evidence from missing evidence.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Evidence for readiness review
For every scenario under review, capture the active plan, changed files, current instructions or prompts when applicable, running-app state, and build, test, lint, and deployment-check results when those checks exist. Include unresolved risks and clearly mark evidence that is absent or no longer current.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Execution constraints
The technology stack and testing instructions are not selected. Test tooling, automation framework, command execution model, and configured project checks must therefore remain undecided until the implementation choices are made. When configured checks exist, run them before committing.
Sources: [AGENTS.md](/workspace/docs/AGENTS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=2) [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)