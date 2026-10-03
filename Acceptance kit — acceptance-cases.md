# Acceptance Kit: Change-Aware Approval Invalidation
## Purpose
This work supports engineering teams reviewing coordinated repository work from shared development context. It must connect an approval to the repository change, plan context, verification results, runtime checks, and deployment-check state that were available when the approval was made.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1), [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Acceptance cases
### Happy path: an approval is recorded against reviewed evidence
- Given a repository change has a visible diff, associated plan context, test results, and deployment-check state, when a reviewer approves it, then the approval is recorded with the exact evidence state reviewed.
- Given that approval, when another team member views the change, then they can see the approval together with its reviewed diff and the associated verification and deployment-check state.
- Given no relevant reviewed evidence has changed since approval, when the change is viewed again, then the approval remains associated with the evidence originally reviewed.
### Happy path: re-review is requested after a relevant change
- Given a reviewer has approved a change, when a relevant code change alters the reviewed diff, then the approval is marked as needing re-review.
- Given a reviewer has approved a change, when a relevant test result changes, then the approval is marked as needing re-review.
- Given a reviewer has approved a change, when a relevant deployment-check result changes, then the approval is marked as needing re-review.
- Given an approval is marked as needing re-review, when a reviewer views the change, then the current evidence and the fact that the prior approval needs re-review are both clear.
- Given the reviewer evaluates the current evidence and approves it, when the new approval is recorded, then it is associated with the current diff, test state, and deployment-check state rather than the earlier evidence state.
### Break case: evidence is incomplete or unavailable
- Given an approval cannot be associated with the required reviewed evidence, when the approval is recorded or displayed, then it is not represented as approval of a fully evidenced current change.
- Given test or deployment-check state is unavailable after an approval, when the change is viewed, then the unavailable state is visible and the product does not imply that the earlier evidence is still current.
- Given a relevant change occurs while a reviewer is evaluating a change, when the reviewer attempts to approve the earlier evidence state, then the product identifies that the reviewed evidence is no longer current and requires the approval to be associated with an identified evidence state.
### Break case: repeated or overlapping changes
- Given multiple relevant changes occur after an approval, when the change is viewed, then the approval remains marked as needing re-review until a reviewer approves the current evidence state.
- Given code, tests, and deployment checks change independently after approval, when the change is viewed, then the review state does not hide any relevant evidence change behind a still-current approval.
- Given concurrent repository work changes evidence related to an approved change, when the change is viewed, then the team can identify that re-review is needed without reconstructing the review context from separate sources.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1), [principles.md](/workspace/docs/principles.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Definition of done
- An approval is recorded against an identifiable snapshot of the reviewed diff, test state, and deployment-check state.
- The approval view presents the reviewed evidence context needed to understand what was approved.
- A relevant change to the reviewed diff, test results, or deployment-check results causes the affected approval to be visibly marked as needing re-review.
- An approval that needs re-review is distinguishable from approval of the current evidence state.
- A subsequent approval is associated with the then-current evidence state.
- Missing or unavailable verification evidence is visible rather than treated as unchanged evidence.
- The interaction supports review of coordinated repository work alongside plans, verification results, runtime checks, and unresolved risks.
- The unresolved product decisions below have documented answers or are explicitly retained as unresolved constraints for this work.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1), [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)