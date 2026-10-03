# Review Expertise Routing
## Purpose
Route each repository change to teammates with the most relevant context so coordinated work reaches informed reviewers faster. The routing recommendation should draw on file ownership, branch activity, prior session participation, and responsibility for related plan work.
It must also give reviewers the context needed to assess whether a change has sufficient evidence without reconstructing it from separate sources.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Information to assemble for a change
For every change considered for review, assemble the available context in one review record:
- Changed files and their ownership.
- Active or recent branch activity connected to the change.
- Teammates who participated in relevant prior sessions.
- Teammates responsible for related plan work.
- Related plan steps.
- Verification results.
- Runtime checks.
- Unresolved risks.
This record should make clear which information is present and which expected evidence is missing.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Routing approach
1. Identify the files changed by the proposed review.
2. Find teammates associated with ownership of those files.
3. Add teammates with relevant activity on the associated branch.
4. Add teammates who participated in sessions relevant to the changed work.
5. Add teammates responsible for plan steps connected to the change.
6. Present the resulting candidates with the context that supports each recommendation rather than presenting an unexplained list.
7. Include the review record so each candidate can inspect linked plan steps, verification results, runtime checks, and unresolved risks.
8. Flag missing evidence in the review record for reviewer attention.
The recommendation is intended to support review judgment, not replace it. When the available signals disagree or are incomplete, the routing record should expose that uncertainty.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Reviewer-facing result
A reviewer recommendation should provide:
- The recommended teammates.
- The ownership, branch, session, and plan-responsibility context supporting each recommendation.
- The files included in the change.
- Linked plan steps relevant to the change.
- Available verification results and runtime checks.
- Unresolved risks.
- A clear indication of missing review evidence.
This supports the project goal of letting reviewers assess coordinated work from shared development context.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)