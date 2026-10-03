This file is context. It does not ship in the working preview.

# Edge-Case Matrix — Pokeshell
## Matrix
| Area | Edge condition derived from the requirements | Expected verification focus | Requirement status |
| --- | --- | --- | --- |
| Live session | A participant joins after files, commands, edits, and app activity already exist. | Determine whether current shared context is available and distinguish it from unavailable history. | Detail needed. |
| Live session | Multiple participants edit the same file during an active session. | Verify that the session preserves visible activity and that any overlap is surfaced. | Ownership and overlap are required; conflict behavior is undefined. |
| Commands | A command fails, is interrupted, or has no result available. | Verify that the recorded result clearly differs from a successful verification result. | Detail needed. |
| Running app | The app is stopped, unreachable, or differs from the state referenced by a handoff or review. | Verify that app state is visible and that unavailable or changed state is not presented as current evidence. | Detail needed. |
| Handoff | A handoff lacks any of the active plan, task context, changed files, app state, or next step. | Verify that the missing context is identifiable before the receiving participant resumes work. | Required handoff content is defined; missing-content behavior is undefined. |
| Handoff | Repository work changes after a handoff is captured. | Verify whether the receiving participant can distinguish captured context from later activity. | Detail needed. |
| Overlap | Active branches modify distinct files. | Verify that each active change has visible ownership without incorrectly reporting overlap. | Ownership visibility is required. |
| Overlap | Active branches modify the same file. | Verify that the shared view exposes both the overlap and the relevant ownership before integration. | Required. |
| Review | A repository change has plan and test evidence but lacks runtime, deployment, or risk evidence. | Verify that the reviewer can identify missing evidence rather than treating the review as complete. | Required evidence categories are defined; review outcome rules are undefined. |
| Review | A check is failed or unresolved. | Verify that the result and unresolved risk remain connected to the reviewed change. | Required. |
| Missions | A sample mission is attempted with incomplete or repeated inputs. | Determine expected outcome, scoring, and collection behavior once mission rules are specified. | Detail needed. |
| Leaderboard | Participants have equal or changing progression outcomes. | Determine ordering, tie handling, and update behavior once leaderboard rules are specified. | Detail needed. |
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)