import { POKEMON_LIST, RARITY_COLOR, type Pokemon } from '../data'
import { Icon, PokeArt } from '../components/ui'

export type Capture = { id: string; pokemon: string; mission: string }

export function PokedexView({
  captures,
  onGoToMissions,
}: {
  captures: Capture[]
  onGoToMissions: () => void
}) {
  const caught = new Set(captures.map((c) => c.pokemon))

  return (
    <>
      <div className="view-head">
        <div>
          <h1 className="view-title">My Pokédex</h1>
          <p className="view-sub">
            Captured by shipping missions with the team. {caught.size} of {POKEMON_LIST.length}{' '}
            caught.
          </p>
        </div>
        <div className="view-actions">
          <button className="btn primary" onClick={onGoToMissions}>
            <Icon name="missions" size={15} />
            Find a mission
          </button>
        </div>
      </div>

      <div className="grid cols-4">
        {POKEMON_LIST.map((p: Pokemon) => {
          const owned = caught.has(p.id)
          const record = captures.find((c) => c.pokemon === p.id)
          return (
            <div className={`pokemon-card ${owned ? '' : 'locked'}`} key={p.id}>
              <div className="stage">
                <PokeArt pokemon={p} size="md" />
              </div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
              <div className="muted" style={{ fontSize: 11 }}>
                #{p.number} · {p.type}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 700,
                  color: RARITY_COLOR[p.rarity],
                }}
              >
                {p.rarity}
              </div>
              {owned ? (
                <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                  caught via {record?.mission ?? 'a mission'}
                </div>
              ) : (
                <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                  not caught
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}