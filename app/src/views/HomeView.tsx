import { ME, POKEMON, SESSION_CODE, type Member, type Mission } from '../data'
import { Av, Icon, PokeArt } from '../components/ui'

/** Renders **bold** spans without pulling in a markdown dependency here. */
function Markdownish({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="stat">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      {sub && <span className="sub">{sub}</span>}
    </div>
  )
}

export function HomeView({
  captureCount,
  missionDoneCount,
  activeMission,
  team,
  activity,
  onOpenMissions,
  onOpenCode,
  onOpenPokedex,
  onOpenLeaderboard,
  onJoin,
}: {
  captureCount: number
  missionDoneCount: number
  activeMission: Mission
  team: Member[]
  activity: { id: string; who: Member; text: string; when: string }[]
  onOpenMissions: () => void
  onOpenCode: () => void
  onOpenPokedex: () => void
  onOpenLeaderboard: () => void
  onJoin: () => void
}) {
  return (
    <>
      <div className="view-head">
        <div>
          <h1 className="view-title">Welcome back, {ME.name.split(' ')[0]}</h1>
          <p className="view-sub">
            The session is live. Everyone below is working from the same repository context,
            running app, and plan.
          </p>
        </div>
        <div className="view-actions">
          <button className="btn" onClick={onJoin}>
            <Icon name="agent" size={15} />
            Join session
          </button>
          <button className="btn primary" onClick={onOpenMissions}>
            <Icon name="missions" size={15} />
            Missions
          </button>
        </div>
      </div>

      <div className="grid cols-4">
        <Stat label="Captures" value={captureCount} sub="this session" />
        <Stat label="Missions done" value={missionDoneCount} sub="across the team" />
        <Stat label="Collaborators" value={team.length} sub="in main-session" />
        <Stat label="Active mission" value={activeMission.xp} sub="xp available" />
      </div>

      <div className="grid cols-2 mt">
        <div className="card">
          <div className="card-title">
            <span className="icn">
              <Icon name="missions" size={15} />
            </span>
            Active mission
          </div>
          <div className="mission active" style={{ margin: 0 }}>
            <div className="head">
              <div className="pokemon-art sm">
                <PokeArt pokemon={POKEMON[activeMission.rewardPokemon]} size="sm" />
              </div>
              <div>
                <h3>{activeMission.title}</h3>
                <div className="desc">{activeMission.desc}</div>
              </div>
            </div>
            <div className="meta">
              <span className="chip amber">{activeMission.difficulty}</span>
              <span className="chip">{activeMission.xp} xp</span>
              <span className="chip mono">{activeMission.branch}</span>
            </div>
            <button className="btn primary" onClick={onOpenCode}>
              <Icon name="code" size={15} />
              Open the mission
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span className="icn">
              <Icon name="clock" size={15} />
            </span>
            Session activity
          </div>
          <div className="feed">
            {activity.map((a) => (
              <div className="feed-item" key={a.id}>
                <Av m={a.who} size={28} />
                <div className="text">
                  <strong>{a.who.name}</strong>{' '}
                  <Markdownish text={a.text} />
                  <span className="when">{a.when}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid cols-2 mt">
        <div className="card">
          <div className="card-title">
            <span className="icn">
              <Icon name="agent" size={15} />
            </span>
            Invite teammates
          </div>
          <p className="muted" style={{ fontSize: 12.5, marginTop: 0 }}>
            Share this code. Anyone who enters their name with it joins the session and appears in
            the roster, presence, and leaderboard.
          </p>
          <div
            className="mono"
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textAlign: 'center',
              padding: '14px 0',
              margin: '4px 0 12px',
              borderRadius: 12,
              background: 'var(--bg-elev-2)',
              border: '1px dashed var(--border-strong)',
              color: 'var(--amber)',
            }}
          >
            {SESSION_CODE}
          </div>
          <div className="row">
            <button className="btn" onClick={onJoin}>
              <Icon name="agent" size={15} />
              Enter a name to join
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span className="icn">
              <Icon name="agent" size={15} />
            </span>
            Team roster ({team.length})
          </div>
          <div className="grid" style={{ gap: 8 }}>
            {team.map((m) => (
              <div className="row" key={m.id} style={{ gap: 10 }}>
                <Av m={m} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {m.name}
                    {m.isMe && <span style={{ color: 'var(--pink)' }}> · you</span>}
                  </div>
                  <div className="muted" style={{ fontSize: 11.5 }}>
                    {m.role} · {m.handle}
                  </div>
                </div>
                <span className="chip green">
                  <span className="dot" />
                  online
                </span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="row">
            <button className="btn" onClick={onOpenPokedex}>
              <Icon name="pokedex" size={15} />
              My Pokédex ({captureCount})
            </button>
            <button className="btn" onClick={onOpenLeaderboard}>
              <Icon name="leaderboard" size={15} />
              Leaderboard
            </button>
          </div>
        </div>
      </div>
    </>
  )
}