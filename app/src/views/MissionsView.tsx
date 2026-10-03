import { POKEMON, type Mission } from '../data'
import { Icon, PokeArt } from '../components/ui'
import { PaywallGate } from '../components/PaywallGate'
import { PlanBadge } from '../components/PlanBadge'

const STATUS_CHIP: Record<Mission['status'], { cls: string; label: string }> = {
  active: { cls: 'amber', label: 'active' },
  available: { cls: 'blue', label: 'available' },
  locked: { cls: '', label: 'locked' },
  completed: { cls: 'green', label: 'completed' },
}

function MissionCard({
  mission,
  onPick,
  onShip,
}: {
  mission: Mission
  onPick: (m: Mission) => void
  onShip: (m: Mission) => void
}) {
  const done = mission.steps.filter((s) => s.done).length
  const pct = Math.round((done / mission.steps.length) * 100)
  const status = STATUS_CHIP[mission.status]
  const locked = mission.status === 'locked'
  const shippable = mission.status === 'active' && done === mission.steps.length

  return (
    <div className={`mission ${mission.status}`}>
      <div className="reward">
        <div className="pokemon-art xs" title={`Reward: ${POKEMON[mission.rewardPokemon].name}`}>
          <PokeArt pokemon={POKEMON[mission.rewardPokemon]} size="xs" />
        </div>
      </div>

      <div className="head">
        <div className="pokemon-art sm">
          <PokeArt pokemon={POKEMON[mission.rewardPokemon]} size="sm" />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3>{mission.title}</h3>
          <div className="desc">{mission.desc}</div>
        </div>
      </div>

      <div className="meta">
        <span className={`chip ${status.cls}`}>{status.label}</span>
        <PlanBadge missionId={mission.id} />
        <span className="chip">{mission.difficulty}</span>
        <span className="chip amber">{mission.xp} xp</span>
        {mission.tags.map((t) => (
          <span className="chip" key={t}>
            {t}
          </span>
        ))}
      </div>

      <div className="progress" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="muted mono" style={{ fontSize: 11.5 }}>
          {done}/{mission.steps.length} steps
        </span>
        {shippable ? (
          <button className="btn sm primary" onClick={() => onShip(mission)}>
            <Icon name="rocket" size={14} />
            Ship and capture
          </button>
        ) : (
          <button
            className={`btn sm ${mission.status === 'active' ? 'primary' : ''}`}
            disabled={locked}
            onClick={() => onPick(mission)}
          >
            {locked ? (
              <>
                <Icon name="lock" size={14} />
                Locked
              </>
            ) : (
              <>
                {mission.status === 'active' ? 'Continue' : 'Start'}
                <Icon name="chevron" size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export function MissionsView({
  missions,
  onPick,
  onShip,
}: {
  missions: Mission[]
  onPick: (m: Mission) => void
  onShip: (m: Mission) => void
}) {
  return (
    <>
      <div className="view-head">
        <div>
          <h1 className="view-title">Missions</h1>
          <p className="view-sub">
            Coding missions for the team. Finish one, run the tests, and capture the reward.
          </p>
        </div>
        <div className="view-actions">
          <span className="chip amber">
            <Icon name="capture" size={12} />
            rewards are Pokemon
          </span>
        </div>
      </div>

      <div className="grid cols-3">
        {missions.map((m) => (
          <PaywallGate key={m.id} mission={m}>
            <MissionCard mission={m} onPick={onPick} onShip={onShip} />
          </PaywallGate>
        ))}
      </div>
    </>
  )
}