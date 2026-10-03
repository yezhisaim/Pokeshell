import { POKEMON, type Pokemon } from '../data'
import { PokeArt } from './ui'

function Confetti() {
  const colors = ['#ffb020', '#ff5d73', '#4ade80', '#5eb3ff', '#b48cff']
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 5.4 + (i % 3) * 4) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 6) * 0.08}s`,
            animationDuration: `${1.1 + (i % 4) * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

export function EncounterModal({
  pokemon,
  mission,
  onCapture,
  onClose,
}: {
  pokemon: Pokemon
  mission: string
  onCapture: () => void
  onClose: () => void
}) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Wild encounter">
      <div className="encounter">
        <Confetti />
        <span className="tag">Mission complete</span>
        <h2>{mission}</h2>
        <div className="rarity">{pokemon.rarity}</div>

        <div className="art">
          <PokeArt pokemon={pokemon} size="lg" />
        </div>

        <div className="muted" style={{ fontSize: 12.5 }}>
          A wild <strong style={{ color: 'var(--text)' }}>{pokemon.name}</strong> appeared!
        </div>

        <div
          className="ball-wrap"
          onClick={onCapture}
          role="button"
          tabIndex={0}
          aria-label={`Capture ${pokemon.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onCapture()
            }
          }}
        >
          <PokeArt pokemon={POKEMON.pokeball} size="lg" />
        </div>

        <div className="actions">
          <button className="btn primary" onClick={onCapture}>
            Throw ball
          </button>
          <button className="btn ghost" onClick={onClose}>
            Later
          </button>
        </div>
      </div>
    </div>
  )
}

export function Onboard({ onStart }: { onStart: () => void }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Welcome to Pokeshell">
      <div className="onboard-card">
        <div className="brand-logo" />
        <h1>Pokeshell</h1>
        <p>
          One shared session for your codebase, plans, running app, and AI agent activity. Ship
          missions together and capture something every time you do.
        </p>
        <button className="btn primary" onClick={onStart}>
          Enter the session
        </button>
        <div className="hint muted" style={{ justifyContent: 'center', marginTop: 12 }}>
          <span className="kbd">Missions</span>
          <span>work the board</span>
          <span className="kbd">Agent Session</span>
          <span>talk to the agent</span>
        </div>
      </div>
    </div>
  )
}