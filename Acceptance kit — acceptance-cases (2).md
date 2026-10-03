# Acceptance Kit — Merge Conflict Resolution Queue
## Purpose
Provide a shared queue for detected file overlap and merge conflicts so teammates can identify affected owners, work through a proposed resolution order, and retain the agreed resolution for subsequent handoff work.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Acceptance cases
### AC-1: Surface detected overlap and conflicts
**Given** active repository work contains an overlapping modified file or a detected merge conflict,
**when** teammates view the shared coordination context,
**then** an active queue item is available for that issue, identifies the affected work, and identifies affected owners when owner information is available.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### AC-2: Present a resolution order
**Given** the queue contains more than one unresolved issue,
**when** an order is proposed,
**then** teammates can see the proposed order for addressing the issues and can distinguish the proposal from an agreed resolution.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### AC-3: Record an agreed resolution
**Given** teammates agree how to resolve an active queue item,
**when** they record that agreement,
**then** the agreed resolution is retained with the queue item and is visible to a teammate taking over the work.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### AC-4: Keep queue state aligned with active work
**Given** a queued issue changes because repository work changes,
**when** teammates return to the shared coordination context,
**then** the item is not represented as an unchanged current issue when its overlap, conflict state, or affected ownership has changed.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### AC-5: Represent the absence of issues accurately
**Given** there are no detected overlaps or merge conflicts for the active work,
**when** teammates view the queue,
**then** it does not present a fabricated active issue or an invented owner.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Failure and edge cases
### Ownership is unavailable
If affected ownership cannot be determined, the queue must distinguish unavailable ownership from a confirmed owner and must not assign an owner without supporting information.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### A resolution order cannot be proposed
If no proposal can be produced for unresolved issues, the queue must not portray an absent or unavailable proposal as a valid resolution order.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### The underlying issue is no longer current
If the repository work changes after an item is queued or after a resolution is agreed, the prior queue state must not be treated as current until it has been reconciled with the changed work.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### Concurrent resolution activity
If teammates update the same queue item at the same time, the resulting shared record must not silently discard an agreed resolution or present incompatible updates as one confirmed agreement.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
### Resolution recording does not complete
If an agreed resolution cannot be retained, the queue must not represent that resolution as recorded and available for handoff.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Definition of done
The Merge Conflict Resolution Queue is done when:
- Detected file overlap and merge conflicts can appear as shared queue items for active repository work.
- Each active item identifies affected work and identifies affected owners when that information is available.
- Teammates can view a proposed resolution order without confusing it with an agreed resolution.
- An agreed resolution can be retained with its queue item and consulted during work handoff.
- The queue does not falsely claim ownership, a current conflict state, a valid proposal, or a recorded agreement when the supporting information is unavailable or no longer current.
- The open questions below are answered where required to implement the queue's detection, storage, access, and collaboration behavior.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)