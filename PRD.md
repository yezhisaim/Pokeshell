# Pokeshell

## Problem statement

Engineering work loses momentum when developers and AI agents must reconstruct context from notes, branches, and status updates.

## Goals and success metrics

1 people paying within 1 year. Current: 0 people paying. Target: 1 people paying.
- [Engineering teams develop together in live sessions](outcome://654ee55b-1f20-4589-a1da-63a026278cd5)
- [Engineering teams hand off work with shared context](outcome://16b4e1c2-924a-4836-a5d2-05ec533cacf9)
- [Engineering teams coordinate overlapping code changes](outcome://d908677c-985b-46bc-8bf9-814946a9586f)
- [Engineering teams review progress from shared development context](outcome://eb0c0185-edc8-45da-ae66-a861921b09ea)

## Proposed solution

A gamified, collaborative workspace where a team shares the same codebase, session memory, running app, plans, prompts, and AI-assisted development activity and completes pokemon missions to win together as a team. The more a team plays, the more pokemons they capture

## Users

Software engineering teams working together on repositories, feature branches, reviews, debugging, and coordinated AI coding tasks.

## Scope

1. [Engineering teams develop together in live sessions](outcome://654ee55b-1f20-4589-a1da-63a026278cd5)
2. [Engineering teams hand off work with shared context](outcome://16b4e1c2-924a-4836-a5d2-05ec533cacf9)
3. [Engineering teams coordinate overlapping code changes](outcome://d908677c-985b-46bc-8bf9-814946a9586f)
4. [Engineering teams review progress from shared development context](outcome://eb0c0185-edc8-45da-ae66-a861921b09ea)

## Non-goals

Not specified yet.

## Requirements

- [Engineering teams develop together in live sessions](outcome://654ee55b-1f20-4589-a1da-63a026278cd5). Developers share files, commands, code edits, and a running app during active repository work. Timeframe: this week. Assumes: If an engineering team completes a small code change together in one live shared session, participants will report that the shared repository context and running app made joint work easier than their usual coordination approach
- [Engineering teams hand off work with shared context](outcome://16b4e1c2-924a-4836-a5d2-05ec533cacf9). Developers and AI agents continue repository work with current plans, prompts, and app state. Timeframe: Day 7. Assumes: If a handoff captures the current plan, recent instructions, changed files, running-app state, and verification results, the next developer can resume work without asking for a separate status update
- [Engineering teams coordinate overlapping code changes](outcome://d908677c-985b-46bc-8bf9-814946a9586f). Developers see code ownership and overlap while working on the same repository and branches. Timeframe: Day 14. Assumes: If teammates can see overlapping files, dependencies, and likely conflicts across active branches before merging, they will resolve coordination questions earlier and avoid conflicting changes
- [Engineering teams review progress from shared development context](outcome://eb0c0185-edc8-45da-ae66-a861921b09ea). Reviewers assess code activity, plans, tests, and deployment checks while evaluating coordinated work. Timeframe: Beyond Day 90. Assumes: Reviewers given modified-code context linked to plan steps, test results, deployment checks, and unresolved risks can determine what evidence is missing without reconstructing the change from separate notes and updates

## Assumptions we are betting on

- If an engineering team completes a small code change together in one live shared session, participants will report that the shared repository context and running app made joint work easier than their usual coordination approach.
- If a handoff captures the current plan, recent instructions, changed files, running-app state, and verification results, the next developer can resume work without asking for a separate status update.
- If teammates can see overlapping files, dependencies, and likely conflicts across active branches before merging, they will resolve coordination questions earlier and avoid conflicting changes.
- Reviewers given modified-code context linked to plan steps, test results, deployment checks, and unresolved risks can determine what evidence is missing without reconstructing the change from separate notes and updates.