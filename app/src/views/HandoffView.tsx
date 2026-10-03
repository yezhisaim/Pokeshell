import { HANDOFF, memberById } from '../data'
import { Icon } from '../components/ui'

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 10, padding: '7px 0' }}>
      <span className="muted" style={{ fontSize: 12 }}>
        {label}
      </span>
      <span className="mono" style={{ fontSize: 12.5 }}>
        {value}
      </span>
    </div>
  )
}

export function HandoffView() {
  return (
    <>
      <div className="view-head">
        <div>
          <h1 className="view-title">Handoff</h1>
          <p className="view-sub">
            Everything the next developer or agent needs, kept together: plan, changed files,
            running app, and the next step.
          </p>
        </div>
        <div className="view-actions">
          <button className="btn primary">
            <Icon name="handoff" size={15} />
            Create handoff
          </button>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <div className="card-title">
            <span className="icn">
              <Icon name="handoff" size={15} />
            </span>
            Resume from here
          </div>
          <KV label="Active plan" value="Fix the Auth Crash › run the test suite" />
          <KV label="Branch" value="fix/auth-crash" />
          <KV label="Changed files" value="src/auth/login.ts, tests/auth.test.ts" />
          <KV label="Running app" value="vite dev :5173" />
          <KV label="Verification" value="4/4 auth suites passing" />
          <KV label="Next step" value="Ship the guard and capture the reward" />
          <div className="divider" />
          <div className="card-title" style={{ marginBottom: 8 }}>
            <span className="icn">
              <Icon name="alert" size={15} />
            </span>
            Still unresolved
          </div>
          <div className="checklist">
            <span className="mark bad">!</span>
            <div>
              <div className="lbl">Refresh-token branch on session middleware</div>
              <div className="sub">
                Davies owns it and is waiting on a decision. Merging before this is picked will
                conflict again.
              </div>
            </div>
          </div>
          <div className="checklist">
            <span className="mark no">•</span>
            <div>
              <div className="lbl">Handoff context test is not written</div>
              <div className="sub">Evidence for PR 421 is unavailable, so it cannot be approved.</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span className="icn">
              <Icon name="clock" size={15} />
            </span>
            Ownership timeline
          </div>
          <div className="timeline">
            {HANDOFF.map((e) => {
              const m = memberById(e.who)
              return (
                <div className={`tl-item ${e.tone}`} key={e.id}>
                  <div className="who">
                    <strong>{m.name}</strong> · {m.role}
                  </div>
                  <div className="what">{e.what}</div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                    {e.when}
                  </div>
                  {e.note && <div className="note">{e.note}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}