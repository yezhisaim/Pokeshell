import { ME, type Member, type Mission } from '../data'
import { Av, Icon } from './ui'

export function Topbar({
  captureCount,
  mission,
  team,
  onJoin,
}: {
  captureCount: number
  mission: Mission
  team: Member[]
  onJoin: () => void
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-logo" />
        <span>Pokeshell</span>
      </div>

      <div className="session-pill">
        <span className="dot" />
        <span>session</span>
        <strong>main-session</strong>
      </div>

      <div
        className="session-pill"
        style={{ background: 'transparent', border: '1px solid var(--border)' }}
      >
        <span className="muted" style={{ fontSize: 11 }}>
          branch
        </span>
        <strong className="mono">{mission.branch}</strong>
      </div>

      <div className="topbar-spacer" />

      <button className="btn ghost sm" onClick={onJoin}>
        <Icon name="agent" size={14} />
        Join session
      </button>

      <div className="presence" aria-label="Active teammates">
        {team.slice(0, 6).map((m) => (
          <Av key={m.id} m={m} size={28} />
        ))}
        {team.length > 6 && (
          <div
            className="av"
            style={{ width: 28, height: 28, background: 'var(--bg-soft)', color: 'var(--text-dim)', fontSize: 10 }}
          >
            +{team.length - 6}
          </div>
        )}
      </div>

      <div className="capture-chip" title="Captures this session">
        <Icon name="capture" size={14} />
        {captureCount}
      </div>

      <div className="user-chip">
        <Av m={ME} size={26} />
        <span className="name">{ME.name}</span>
      </div>
    </header>
  )
}

export type View =
  | 'home'
  | 'missions'
  | 'plan'
  | 'handoff'
  | 'agent'
  | 'review'
  | 'pokedex'
  | 'leaderboard'

type NavItemProps = {
  icon: Parameters<typeof Icon>[0]['name']
  label: string
  active: boolean
  onClick: () => void
  badge?: number
  pink?: boolean
}

function NavItem({ icon, label, active, onClick, badge, pink }: NavItemProps) {
  return (
    <button
      className={`nav-item ${active ? 'active' : ''} ${pink ? 'pink' : ''}`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      <span className="icn">
        <Icon name={icon} size={16} />
      </span>
      <span className="label">{label}</span>
      {badge !== undefined && badge > 0 && <span className="badge">{badge}</span>}
    </button>
  )
}

export function Sidebar({
  view,
  setView,
  availableMissions,
  captureCount,
  teamCount,
}: {
  view: View
  setView: (v: View) => void
  availableMissions: number
  captureCount: number
  teamCount: number
}) {
  return (
    <nav className="sidebar" aria-label="Main">
      <div className="nav-section-label">Session</div>
      <NavItem icon="home" label="Session Home" active={view === 'home'} onClick={() => setView('home')} />
      <NavItem
        icon="missions"
        label="Missions"
        active={view === 'missions'}
        onClick={() => setView('missions')}
        badge={availableMissions}
      />
      <NavItem icon="plan" label="Plan Board" active={view === 'plan'} onClick={() => setView('plan')} />
      <NavItem
        icon="handoff"
        label="Handoff"
        active={view === 'handoff'}
        onClick={() => setView('handoff')}
        pink
      />
      <NavItem
        icon="agent"
        label="Agent Session"
        active={view === 'agent'}
        onClick={() => setView('agent')}
      />

      <div className="nav-section-label">Review</div>
      <NavItem icon="review" label="Review" active={view === 'review'} onClick={() => setView('review')} />

      <div className="nav-section-label">Team</div>
      <NavItem
        icon="pokedex"
        label="My Pokédex"
        active={view === 'pokedex'}
        onClick={() => setView('pokedex')}
        badge={captureCount}
      />
      <NavItem
        icon="leaderboard"
        label="Leaderboard"
        active={view === 'leaderboard'}
        onClick={() => setView('leaderboard')}
      />
      <div className="nav-section-label">Collaborators</div>
      <div className="row" style={{ padding: '2px 10px', gap: 6 }}>
        <span className="chip green">
          <span className="dot" />
          {teamCount} in session
        </span>
      </div>
    </nav>
  )
}