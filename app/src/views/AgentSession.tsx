import { BRANCHES, CONFLICTS, MISSIONS, POKEMON, type Mission } from '../data'
import { AgentThread, type AgentScript } from '../components/AgentThread'
import { Icon } from '../components/ui'

function scriptFor(prompt: string, mission: Mission): AgentScript {
  const p = prompt.toLowerCase()
  const open = CONFLICTS.filter((c) => c.status === 'open')
  const available = MISSIONS.filter((m) => m.status === 'available')

  if (p.includes('overlap') || p.includes('conflict') || p.includes('collide')) {
    return {
      tools: [
        {
          name: 'read_dependency_map',
          args: { branches: BRANCHES.length },
          result: `${BRANCHES.length} branches mapped, ${open.length} open overlaps`,
        },
      ],
      text: `I mapped every active branch against the others. **${open.length} overlaps are still open:**\n\n${open
        .map((c) => `- \`${c.files.join('`, `')}\` — ${c.branches.join(' vs ')} (${c.severity})`)
        .join('\n')}\n\nThe one to settle first is \`src/session/middleware.ts\`. Davies owns it and is blocked on the refresh-token decision, so neither branch should merge until that lands.`,
    }
  }

  if (p.includes('handoff') || p.includes('resume') || p.includes('continue')) {
    return {
      tools: [
        {
          name: 'capture_session_state',
          args: { include: 'plan, files, app, next-step' },
          result: 'plan + 2 changed files + app state + next step',
        },
      ],
      text: `Here is the handoff, self-contained:\n\n- **Plan** — ${mission.title}, step 3 of 4\n- **Branch** — \`${mission.branch}\`\n- **Changed files** — \`${mission.file}\`, \`tests/auth.test.ts\`\n- **Running app** — vite dev on :5173\n- **Verification** — 4/4 auth suites passing\n- **Next step** — ship the guard, then capture the reward\n\nYou can resume cold from this without asking anyone for a status update. The one thing I could not capture is the refresh-token decision — that is a human call, not a context gap.`,
    }
  }

  if (p.includes('approv') || p.includes('review') || p.includes('evidence') || p.includes('stale')) {
    return {
      tools: [
        {
          name: 'check_approval_evidence',
          args: { scope: 'all open PRs' },
          result: '1 approval needs re-review, 1 has unavailable evidence',
        },
      ],
      text: `Two things are not as clean as they look:\n\n- **PR 418** was approved against diff \`5f30b7d\` with tests at 3/4. Both moved since, so that approval **needs re-review** — it is no longer an approval of the current change.\n- **PR 421** has no test evidence at all right now. It cannot be shown as a fully evidenced approval, so it should stay unapproved.\n\nOnly PR 412 and PR 425 are approved against evidence that is still current.`,
    }
  }

  if (p.includes('mission') || p.includes('next') || p.includes('what should')) {
    const next = available[0]
    return {
      tools: [
        {
          name: 'list_missions',
          args: { filter: 'available' },
          result: `${available.length} available`,
        },
      ],
      text: next
        ? `Best next mission for the team: **${next.title}** (${next.difficulty}, ${next.xp} xp).\n\nIt pays ${next.xp} xp and unlocks a ${POKEMON[next.rewardPokemon].name}. Want me to walk everyone through the first two steps, or queue it into the session so the team picks it up together?`
        : 'Every mission is either active or completed. Want me to unlock the next one?',
    }
  }

  if (p.includes('test') || p.includes('ship') || p.includes('ci') || p.includes('fix')) {
    return {
      tools: [
        {
          name: 'run_tests',
          args: { suite: 'auth', scope: 'changed files' },
          result: '4/4 passing in 3.1s',
        },
      ],
      text: `The auth suite is green — **4/4 passing**. Both empty-email and empty-password cases are covered now.\n\nOne caveat before shipping: the deploy check on this branch is marked stale, so a green suite alone will not clear review. Re-run the deploy check and the approval will bind to current evidence.`,
    }
  }

  return {
    text: `I am working from the shared session, so I see the same repository state you do.\n\nRight now the team has **${open.length} open overlaps**, **${available.length} missions available**, and an active mission on \`${mission.branch}\`.\n\nAsk me to map branch overlap, draft a handoff, check approvals, or pick the next mission.`,
  }
}

const SUGGESTIONS = [
  'Map the branch overlap',
  'Draft a handoff from current state',
  'Check approvals for stale evidence',
  'What is the next mission?',
]

export function AgentSession({ mission }: { mission: Mission }) {
  return (
    <>
      <div className="view-head">
        <div>
          <h1 className="view-title">Agent Session</h1>
          <p className="view-sub">
            One shared thread for the whole team. The agent reads the same repository, plan, and
            running app you do — ask it anything about the current mission.
          </p>
        </div>
        <div className="view-actions">
          <span className="chip mono">{mission.branch}</span>
          <span className="chip amber">
            <Icon name="agent" size={12} />
            demo runtime
          </span>
        </div>
      </div>

      <div className="agent-shell">
        <AgentThread
          suggestions={SUGGESTIONS}
          scriptFor={(prompt) => scriptFor(prompt, mission)}
        />

        <aside className="agent-side">
          <div className="card">
            <div className="card-title">
              <span className="icn">
                <Icon name="missions" size={15} />
              </span>
              Agent context
            </div>
            <div className="kv">
              <span>Mission</span>
              <strong>{mission.title}</strong>
            </div>
            <div className="kv">
              <span>Branch</span>
              <strong className="mono">{mission.branch}</strong>
            </div>
            <div className="kv">
              <span>File</span>
              <strong className="mono">{mission.file}</strong>
            </div>
            <div className="kv">
              <span>Collaborators</span>
              <strong>5 in session</strong>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="icn">
                <Icon name="alert" size={15} />
              </span>
              Known gaps
            </div>
            <p className="muted" style={{ fontSize: 12, margin: 0 }}>
              The agent answers from the session snapshot. It does not read files or run commands
              yet — that arrives with the real backend.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}