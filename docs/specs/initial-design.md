# Pokeshell - Initial Design Spec
Status: Draft — pending review

## Problem

Engineering work loses momentum when developers and AI agents must reconstruct context from notes, branches, and status updates. Teams working on shared codebases need to develop, hand off, coordinate, and review work from a shared development context.

## Goals

- Create a minimal, working implementation of Pokeshell that supports:
  - Live shared repository sessions (shared files, commands, code edits, and running app state)
  - Session handoff with retained context (plan, task context, changed files, app state, next step)
  - Visibility into ownership and overlapping changes across branches
  - Connection of execution to plans, tests, and deployment checks
  - Pokémon-themed UI (fonts/colors) that supports multi-person collaboration
- Build incrementally based on the existing specification files (feature specs, acceptance criteria, test strategy)
- Establish a clear, testable implementation path that can be validated against PRD goals
- Target the core assumption: completing a small code change together in a live shared session makes joint work easier

## Non-goals

- Full production deployment infrastructure beyond what's needed for local development
- Implementation of all features in working-preview.md at once (focus on MVP core: live sessions + shared context + handoff)
- Real-time multiplayer transport, auth, or persistence (session state is client-local in this round)
- Live LLM provider wiring; the AI agent surface runs on a local scripted runtime so the app runs with no API key
- Detailed metrics/analytics beyond the basic "1 paying person" target

## Stack

Vite + React 19 + TypeScript, Tailwind CSS, and [assistant-ui](https://www.assistant-ui.com/components) for the agent thread surface.

## Surface decision (deviates from form-factor.md)

`form-factor.md` records the surface as **terminal**. This round builds a **web app** instead, per explicit direction to match the interface at `pokeshell.askthew.dev/` (topbar + sidebar nav + main view, Pokémon-themed). The terminal constraint stays recorded as an unmet requirement for a later round rather than being silently dropped.

## Interface reference

Layout, navigation, and information architecture follow `pokeshell.askthew.dev`:

- **Topbar** — brand, session pill, branch pill, collaborator presence avatars, capture counter, current user chip.
- **Sidebar** — grouped nav: Session (Home, Missions, Code Workspace, Plan Board, Branches, Handoff), Review, Team (Pokédex, Leaderboard).
- **Main view** — one view at a time, driven by sidebar selection.
- **Modals** — onboarding on first load, Pokémon encounter on mission completion.

## assistant-ui usage

assistant-ui provides the shared AI agent thread, replacing a hand-rolled chat surface:

| Component | Role in Pokeshell |
| --- | --- |
| `Thread` | The shared agent session panel: messages, streaming, composer, auto-scroll |
| `Message` + `MarkdownText` | Agent replies with formatted plan and handoff output |
| `ToolFallback` / tool UIs | Agent actions rendered in-thread (read file, run tests, record capture) |
| `Composer` | Shared instruction entry for the team and agent |
| `useLocalRuntime` | Scripted local agent so the app runs offline with no API key |

## Views

| View | Purpose |
| --- | --- |
| Session Home | Session vitals, active mission, capture totals |
| Missions | Coding missions with status, steps, and rewards |
| Code Workspace | Shared file tree, editor, and terminal for the active mission |
| Plan Board | Plan-to-execution board linking steps to tests and deploy checks |
| Branches | Ownership and overlapping-change view across active branches |
| Handoff | Retained handoff context: plan, changed files, app state, next step |
| Review | Review evidence matrix with change-aware approval state |
| My Pokédex | Captured Pokémon from completed missions |
| Leaderboard | Team and individual contribution ranking |
| Agent Session | assistant-ui `Thread` for the shared AI agent task queue |