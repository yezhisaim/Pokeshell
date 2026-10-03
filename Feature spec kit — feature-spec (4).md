# Review Evidence Matrix
## Purpose
Give reviewers a per-change view that connects modified files and pull requests with the relevant plan steps, test results, deployment checks, and unresolved risks. The intended result is that a reviewer can assess the evidence for a repository change without reconstructing context from separate sources.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Users and scope
This feature serves engineering-team reviewers evaluating coordinated repository work. It supports the existing review outcome: reviewers assess code activity, plans, tests, and deployment checks from shared development context.
In scope:
- A per-change evidence view.
- Connections from a change to its related modified files, pull request, plan steps, test results, deployment checks, and unresolved risks.
- Making missing evidence discoverable during review.
Feature-level non-goals have not been specified.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Required evidence
For each repository change under review, the evidence view is intended to bring together:
- Modified files.
- Pull request information.
- Relevant plan steps.
- Test results.
- Deployment checks.
- Unresolved risks.
The record does not define the exact information shown for any evidence type, how relationships are created, or how evidence freshness is determined.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)
## Flow
### Evidence review
1. A reviewer reaches the per-change evidence view for repository work being evaluated.
2. The reviewer examines the change alongside its modified files, pull request, plan steps, test results, deployment checks, and unresolved risks.
3. The reviewer identifies whether the available evidence is sufficient or whether evidence is missing for the change.
No entry point, change-selection method, review-completion action, approval action, or follow-up workflow is specified.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)
## Screens
The project identifies a terminal surface, but it does not define navigation, screen inventory, layout, or the presentation of the per-change evidence view. The feature requires a yet-to-be-defined review view that presents the required evidence for a change in one place.
Open question: What terminal view or navigation path exposes the review view, and how does a reviewer move between a change and its related evidence?
Sources: [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)
## Controls and behavior
No controls or control behaviors are specified in the record. Therefore, no selection, filtering, linking, approval, dismissal, or refresh behavior is defined for this feature.
Open questions:
- How does a reviewer choose the repository change to inspect?
- Which evidence items can a reviewer open, and where should each action lead?
- Can a reviewer mark evidence as reviewed, missing, or unresolved?
- Does this feature support an approval or handoff action, and what should that action do?
- How can a reviewer refresh evidence when repository activity changes?
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)
## Empty, error, and loading states
No empty, error, or loading behavior is specified.
Open questions:
- What should the review view show when a change has no linked plan steps, test results, deployment checks, or risks?
- What should it show when only some evidence is available?
- How should it communicate that evidence is loading or being refreshed?
- What should a reviewer see when evidence cannot be retrieved or linked?
- What recovery action should be available when the view contains missing or unavailable evidence?
Sources: [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)
## Success
Feature success looks like a reviewer being able to identify missing evidence for a sample change without reconstructing context from separate sources. This supports the broader goal of reviewing repository changes with linked plans, verification results, runtime checks, and unresolved risks in one place.
The project-level target is one person paying within one year; the record does not define a feature-specific metric or measurement method for this review view.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [soul.md](/workspace/docs/soul.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)