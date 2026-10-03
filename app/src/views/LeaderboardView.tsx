import { LEADERBOARD, memberById, type Member } from '../data'
import { Av } from '../components/ui'

const RANK_CLASS = ['gold', 'silver', 'bronze']

export function LeaderboardView({ team }: { team: Member[] }) {
  const base = new Map(LEADERBOARD.map((r) => [r.id, r]))
  const rows = team
    .map((m) => {
      const known = base.get(m.id)
      return {
        id: m.id,
        captures: known?.captures ?? 0,
        missions: known?.missions ?? 0,
        xp: known?.xp ?? 0,
      }
    })
    .sort((a, b) => b.xp - a.xp || a.captures - b.captures)

  return (
    <>
      <div className="view-head">
        <div>
          <h1 className="view-title">Leaderboard</h1>
          <p className="view-sub">
            Team contribution this session. XP comes from missions shipped together, not from
            working alone.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((r, i) => {
          const m = memberById(r.id, team)
          return (
            <div
              className={`lb-row ${RANK_CLASS[i] ?? ''} ${m.isMe ? 'me' : ''}`}
              key={r.id}
            >
              <span className="rank">{i + 1}</span>
              <div className="player">
                <Av m={m} size={32} />
                <div>
                  <div className="name">
                    {m.name}
                    {m.isMe && <span className="you"> · you</span>}
                  </div>
                  <div className="muted" style={{ fontSize: 11.5 }}>
                    {m.role} · {r.captures} captures · {r.missions} missions shipped
                  </div>
                </div>
              </div>
              <span className="score">{r.xp} xp</span>
            </div>
          )
        })}
      </div>
    </>
  )
}