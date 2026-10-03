# Multiplayer Chat & Sessions — Plan

**Status:** Draft — pending review. No code written against this yet.

## What we need

People join a session with a **code**, enter a **name**, and everyone shares one live
state: missions, captures, leaderboard, and a collaborative agent chat. Multiple
people, multiple browsers, one truth.

## The gap today

| | Status |
| --- | --- |
| Views (Home, Missions, Plan, Handoff, Review, Pokédex, Leaderboard) | Built |
| Join-by-code UI (code + name) | Built, but **client-local only** |
| Persistence | **None.** Everything is React `useState`; a refresh wipes the session |
| Backend / server routes | **None.** Vite SPA, no server |
| Realtime sync between browsers | **None** |
| AI chat | **None** (z.ai key configured and verified, but no route calls it) |
| Real auth | **None.** The "code" is a UI string, not checked against anything |

So the current join flow is cosmetic: two people entering `POKEBALL-42` land in two
isolated copies of the app.

## Non-negotiable constraint

The AI key must stay server-side. **Something server-side is required regardless of
which realtime option we pick** — that shapes every choice below.

A second constraint, flagged earlier and still unresolved: the z.ai endpoint that
actually works (`/api/coding/paas/v4`, GLM Coding Plan) is documented as *"intended
for supported tools only."* Multi-user app traffic may not be sanctioned by their
terms. Worth resolving before we build on it.

## Options

### A — Harness SDK (Assistant Cloud) · *currently blocked*
assistant-ui's batteries-included multiplayer. Thread components stay; the shared
runtime carries the conversation between clients.
**Blocked on:** the setup UI's websocket (`426 expected websocket` on the agent
endpoint; browser UI at `/components/setup` isn't binding). Alpha product.
**Risk:** provisioning is browser-gated, so we can't unblock it from the CLI.

### B — Supabase (Postgres + Realtime + Auth) · *recommended*
Postgres holds durable session state; Realtime channels carry presence and live
updates; a small API route proxies z.ai so the key stays server-side.
**Why:** fixes the "lost on refresh" gap properly, gives real auth, presence is
built in, row-level security can scope data to session members, no server to
operate, generous free tier.

### C — Cloudflare Durable Objects + PartyKit
One Durable Object per session code — a natural fit for "one room per code."
WebSocket hibernation, state in DO storage, Workers are serverless.
**Why:** the model maps almost exactly onto sessions-as-rooms, and it's cheap.
**Trade-off:** less mature ecosystem than Supabase; more of the realtime plumbing is yours.

### D — Self-hosted Node + `ws` + SQLite
A small Fastify server beside Vite, `ws` for sockets, `better-sqlite3` for state.
**Why:** total control, no vendor, works offline.
**Trade-off:** most code to write and maintain; you own uptime, scaling, and TLS.

### E — Liveblocks
Hosted presence + storage + pub/sub, strong React DX.
**Caveat:** I'd want to verify current assistant-ui support before committing —
it isn't in the documented runtime list (AI SDK, LangGraph, LangChain, Eve, Google
ADK, AG-UI, A2A, OpenCode, custom). Likely a custom transport.

### Comparison

| | A: Harness | B: Supabase | C: DO/PartyKit | D: Self-host | E: Liveblocks |
| --- | --- | --- | --- | --- | --- |
| Unblockable now | No | Yes | Yes | Yes | Yes |
| Survives refresh | Yes | Yes | Yes | Yes | Yes |
| Real auth | Yes | Yes | DIY | DIY | Yes |
| Presence | Yes | Yes | DIY | DIY | Yes |
| Ops burden | None | None | Low | High | None |
| Multiplayer maturity | Alpha | Stable | Stable | DIY | Stable |

## Recommendation

**B — Supabase**, with a thin server route for the AI call.

Reasoning: it's the only option that is unblocked *today*, fixes persistence and
auth rather than papering over them, and doesn't make us re-plumb when the team
grows. C is the credible runner-up and would win on cost at scale.

Keep A as a follow-up: if the harness flow ever clears, it's a drop-in upgrade of
the chat surface specifically, and it wouldn't touch the data model.

## Data model (Supabase)

```
sessions
  id            uuid  pk
  code          text  unique      -- the join code
  name          text
  created_at    timestamptz

players
  id            uuid  pk
  session_id    uuid  → sessions
  name          text
  color         text
  xp            int   default 0
  joined_at     timestamptz

missions
  id            uuid  pk
  session_id    uuid  → sessions
  title         text
  status        text           -- active | available | locked | completed
  reward        text
  sort_order    int

captures
  id            uuid  pk
  session_id    uuid  → sessions
  player_id     uuid  → players
  pokemon       text
  mission       text
  captured_at   timestamptz

messages                        -- agent + human chat
  id            uuid  pk
  session_id    uuid  → sessions
  player_id     uuid  → players  null for agent messages
  role          text           -- user | assistant
  content       jsonb          -- assistant-ui message shape
  created_at    timestamptz
```

RLS: every table filtered by `session_id`, and a `players` membership check per
session, so one session can never read another's rows.

## Join flow

1. Client POSTs `{ code, name }` to the API route.
2. Route looks up `sessions` by `code`. Unknown code → `404` + a clear message.
3. Route creates `players` row, returns `{ sessionId, playerId, player }`.
4. Client subscribes to Realtime channel `session:<id>`; presence announces them.
5. On disconnect, presence marks them away; the row persists so scores survive.

Codes should be **created**, not hardcoded: a `POST /sessions` mints a code, and the
session code is the only shared secret. Rotation is a `code` update.

## Realtime design

One channel per session: `session:<id>`.

**Client → server:** `join`, `mission:start`, `mission:complete`, `capture`, `chat:send`
**Server → clients:** `presence:join`, `presence:leave`, `mission:updated`,
`capture:new`, `chat:message`, `scores:updated`

Rule that keeps this honest: **server is authoritative.** Clients never write their own
score or capture row; they send an intent and the server broadcasts the result. Otherwise
two clients will drift and "who captured the Gengar" becomes unanswerable.

## AI route

`POST /api/chat` → z.ai `glm-5.3` at `ZAI_BASE_URL`, streaming back to assistant-ui.
System prompt carries the session's active mission, plan state, and changed files, so the
agent answers from shared context rather than guessing.

Tool calls worth wiring first: `read_file`, `list_missions`, `run_tests`, `record_capture`.
Each renders in-thread via assistant-ui tool UI, so the team sees what the agent did.

Messages persist to `messages` so a late joiner gets history.

## Migration from the current app

The views already exist and the shape of the data already matches — `src/data.ts` is
close to the tables above. Migration is mostly:

1. Move `src/data.ts` constants into seed rows; keep the types.
2. Add a session/player store; replace `useState` in `App.tsx` with a store + realtime subscription.
3. `JoinModal` posts to the API instead of pushing to local state.
4. Add a `SupabaseProvider` and swap the static arrays for queries.
5. Add `AgentPanel` using assistant-ui `Thread` + the chat route.

## Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| z.ai Coding Plan not sanctioned for multi-user | High | Confirm terms; keep provider behind one route so swapping is a one-file change |
| assistant-ui `react-ui` v0.2.1 won't bundle against `@assistant-ui/react` 0.15.23 | High | Already hit this. Copy the `.aui.tsx` components into the repo (source-level), don't depend on the prebuilt package |
| Harness SDK stays blocked | Medium | Plan B doesn't need it |
| Secret in chat transcript | Medium | Key is already exposed here — rotate at z.ai |
| RLS misconfiguration leaks across sessions | Medium | Integration test asserting session A cannot read session B |

## Decisions needed

1. **Provider** — stay on z.ai, or move to a sanctioned multi-user endpoint?
2. **Backend** — Supabase (recommended), or Cloudflare DO/PartyKit?
3. **Move off Vite?** — assistant-ui's best-supported path is Next.js. Vite means a small
   separate API server. Staying on Vite keeps the current app; moving simplifies the
   server story.
4. **Scope** — full auth with passwords, or keep code+name as the only credential?