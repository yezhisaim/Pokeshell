# Cross-Branch Change Dependency Map
## Purpose
Help engineering teams identify overlapping modified files and the owners of active branch work before merging, so they can resolve dependencies earlier and avoid unowned conflicting changes.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Users and context
This feature serves software engineering teams coordinating repository work across feature branches, reviews, debugging, and AI-assisted coding tasks. It is intended for active development when teammates need to coordinate overlapping changes and review progress from shared development context.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Feature scope
The feature maps active branches, pull requests, plans, and modified files to reveal where one teammate’s work depends on, blocks, or is likely to conflict with another teammate’s changes before merge. It must make ownership and overlap visible for work occurring in the same repository and across branches.
The recorded product surface is a terminal. The representation of this map within that surface is not yet specified.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Flow
1. A teammate working on a repository accesses the dependency map before merging coordinated branch work.
2. The map presents the active work represented by branches, pull requests, plans, and modified files, along with ownership and overlap information.
3. The teammate identifies work that depends on, blocks, or may conflict with another teammate’s changes.
4. The team uses that shared visibility to resolve dependencies earlier and avoid changes with no clear owner.
The record does not define how someone enters the map, navigates among represented work, or communicates a resolution.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Screen and surface requirements
### Dependency map
The dependency map is the required feature surface. It must provide a shared representation of active branch work, modified-file overlap, and work ownership before merge. It must support the team’s need to identify dependencies, blockers, and likely conflicts among coordinated changes.
No additional screens are specified in the record.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1) [form-factor.md](/workspace/docs/form-factor.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Controls and behavior
No control inventory or control behavior is defined in the record. The feature must at minimum enable teammates to review the mapped work, its ownership, and overlapping modified files before merge; the specific controls that provide this behavior remain open.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)
## Empty, loading, and error states
No empty, loading, or error-state behavior is defined in the record.
- **Empty:** Open question: What should the dependency map show when there are no active branches, pull requests, plans, or modified files to map?
- **Loading:** Open question: How should the terminal surface indicate that branch, ownership, plan, or modified-file information is being gathered or refreshed?
- **Error:** Open question: How should the feature explain unavailable, incomplete, or conflicting repository information, and what recovery action should be available?
Sources: [OPEN-DECISIONS.md](/workspace/docs/OPEN-DECISIONS.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=3)
## Success looks like
Success is achieved when teammates can see overlapping modified files and the owners of active branch work before merging, allowing them to resolve dependencies earlier and avoid unowned conflicting changes. This supports the broader outcome of engineering teams coordinating overlapping code changes through shared development context.
No feature-specific measurement method is defined.
Sources: [PRD.md](/workspace/docs/PRD.md?projectId=d410f21c-f242-45e8-97d4-8c58c8d3f3b0&version=1)