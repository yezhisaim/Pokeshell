import { useState, type ReactNode } from 'react'

import { FREE_MISSION_LIMIT, POKEMON, type Mission } from '../data'
import { CHECKOUT_ENDPOINT, startCheckout } from '../billing/checkout'
import { useEntitlements } from '../billing/entitlements'
import { MISSION_CATALOG, PLANS, priceLabel, requiredPlanFor } from '../billing/plans'
import { Icon, PokeArt } from './ui'

type Phase =
  | { kind: 'idle' }
  | { kind: 'busy' }
  | { kind: 'redirecting' }
  | { kind: 'failed'; message: string; retryable: boolean }

const CTA: Record<Phase['kind'], string> = {
  idle: `Unlock with ${PLANS.pro.name}`,
  busy: 'Starting checkout…',
  redirecting: 'Redirecting to Chargebee…',
  failed: `Unlock with ${PLANS.pro.name}`,
}

/**
 * Renders a locked mission as a paywall instead of its real content. Sized for
 * the existing `.mission` card grid: it keeps the mission's identity (reward,
 * title, tags) so the locked tile still reads as that mission, then states the
 * plan, the price as Chargebee will quote it, and the failure state if the
 * handoff to the billing server cannot be made.
 */
export function PaywallGate({ mission, children }: { mission: Mission; children?: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(() => ({ kind: 'idle' }))
  const { canAccess, unlockedCount, remainingFree, unlock } = useEntitlements()

  const plan = requiredPlanFor(mission.id)
  const reward = POKEMON[mission.rewardPokemon]
  const pending = phase.kind === 'busy' || phase.kind === 'redirecting'

  // Already entitled (free tier or bought): this gate has nothing left to sell.
  if (canAccess(mission.id)) return <>{children}</>

  const onUnlock = async () => {
    setPhase({ kind: 'busy' })
    const result = await startCheckout(mission.id, plan.id)

    if (result.ok && result.kind === 'redirect') {
      setPhase({ kind: 'redirecting' })
      window.location.assign(result.url)
      return
    }

    if (result.ok) {
      unlock(result.missionId)
      return
    }

    setPhase({
      kind: 'failed',
      message: result.message,
      retryable: result.kind === 'error',
    })
  }

  return (
    <div className="mission locked">
      <div className="reward">
        <div className="pokemon-art xs" title={`Reward: ${reward?.name ?? 'Unknown'}`}>
          {reward ? <PokeArt pokemon={reward} size="xs" /> : null}
        </div>
      </div>

      <div className="head">
        <div className="pokemon-art sm">
          {reward ? <PokeArt pokemon={reward} size="sm" /> : null}
        </div>
        <div style={{ minWidth: 0 }}>
          <h3>{mission.title}</h3>
          <div className="desc">{mission.desc}</div>
        </div>
      </div>

      <div className="meta">
        <span className="chip purple">
          <Icon name="lock" size={12} />
          {plan.name}
        </span>
        <span className="chip">{mission.difficulty}</span>
        <span className="chip amber">{mission.xp} xp</span>
        <span className="chip">
          {remainingFree}/{FREE_MISSION_LIMIT} free left
        </span>
      </div>

      <div className="divider" />

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div style={{ minWidth: 0 }}>
          <div className="dim" style={{ fontSize: 12.5 }}>
            {plan.blurb}
          </div>
          <div className="muted" style={{ fontSize: 11.5 }}>
            {priceLabel(plan)} · {unlockedCount}/{MISSION_CATALOG.length} missions unlocked
          </div>
        </div>
        <button className="btn primary" disabled={pending} onClick={onUnlock}>
          {pending ? <Icon name="clock" size={14} /> : <Icon name="capture" size={14} />}
          {CTA[phase.kind]}
        </button>
      </div>

      {phase.kind === 'failed' && (
        <div className="card soft">
          <div className="card-title">
            <Icon name="alert" size={14} />
            Checkout unavailable
          </div>
          <div className="dim" style={{ fontSize: 12.5 }}>
            {phase.message}
          </div>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <span className="kbd">POST {CHECKOUT_ENDPOINT}</span>
            {phase.retryable ? (
              <button className="btn sm" disabled={pending} onClick={onUnlock}>
                Try again
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}