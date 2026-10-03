import type { Member, Pokemon } from '../data'
import { cx } from '../lib/cx'

type IconName =
  | 'home'
  | 'missions'
  | 'code'
  | 'plan'
  | 'branches'
  | 'handoff'
  | 'review'
  | 'pokedex'
  | 'leaderboard'
  | 'agent'
  | 'capture'
  | 'play'
  | 'check'
  | 'clock'
  | 'alert'
  | 'lock'
  | 'flask'
  | 'rocket'
  | 'shield'
  | 'git'
  | 'chevron'

const PATHS: Record<IconName, string> = {
  home: 'M3 10.5 10 4l7 6.5V17a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1z',
  missions: 'M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 3.5L12 9h3l-2.4 2.1.9 3-2.5-1.6L9.5 14l.9-3L8 9h3z',
  code: 'M7 5 2 10l5 5M13 5l5 5-5 5',
  plan: 'M3 4h14v3H3zM3 9h14v3H3zM3 14h9v3H3z',
  branches: 'M6 3v9a3 3 0 0 0 3 3h5M6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm8 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z',
  handoff: 'M2 7h11l-3-3m3 3-3 3M18 13H7l3 3m-3-3 3-3',
  review: 'M10 2 3 5v5c0 4.4 3 7.7 7 8 4-.3 7-3.6 7-8V5z',
  pokedex: 'M4 3h12v14H4zM7 7h6M7 10h6M7 13h4',
  leaderboard: 'M4 18V9m6 9V4m6 14v-6',
  agent: 'M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-3 8h.01M13 10h.01M7.5 13.5a4 4 0 0 0 5 0',
  capture: 'M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 0v16M2 10h16',
  play: 'M6 4l10 6-10 6z',
  check: 'M4 10.5 8 14.5 16 6',
  clock: 'M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 4v4l3 2',
  alert: 'M10 2 1 17h18zM10 8v4m0 2h.01',
  lock: 'M5 9V6a5 5 0 0 1 10 0v3M3.5 9h13v9h-13z',
  flask: 'M8 2h4v4l4 9a2 2 0 0 1-1.8 3H5.8A2 2 0 0 1 4 15l4-9zM6 13h8',
  rocket: 'M12 2c3 2 4 5 4 8l-3 3H7l-3-3c0-3 1-6 4-8zM10 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM7 16l-2 3 3-1m5-2 2 3-3-1',
  shield: 'M10 2 3 5v5c0 4.4 3 7.7 7 8 4-.3 7-3.6 7-8V5z',
  git: 'M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 4v4m0 4h.01',
  chevron: 'M7 4l6 6-6 6',
}

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const d = PATHS[name]
  const filled = name === 'missions' || name === 'capture' || name === 'play'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

export function Av({ m, size = 28 }: { m: Member; size?: number }) {
  return (
    <div
      className="av"
      style={{
        width: size,
        height: size,
        background: m.color,
        color: m.isMe ? '#1a1a1a' : '#fff',
        fontSize: Math.round(size * 0.4),
      }}
      title={`${m.name} · ${m.role}`}
    >
      {m.emoji}
    </div>
  )
}

const POKE_TINT: Record<string, string> = {
  ball: '#ff6f6f',
  lizard: '#ff8a3d',
  turtle: '#5eb3ff',
  mouse: '#ffc44a',
  seed: '#4ade80',
  fox: '#c98a5b',
  ghost: '#b48cff',
  psychic: '#f04f6b',
  bear: '#8d7b68',
  serpent: '#3b9ef5',
  rock: '#9a8460',
}

export function PokeArt({
  pokemon,
  size = 'md',
}: {
  pokemon: Pokemon
  size?: 'lg' | 'md' | 'sm' | 'xs'
}) {
  const tint = POKE_TINT[pokemon.art] ?? '#ffb020'

  if (pokemon.art === 'ball') {
    return (
      <div className={cx('pokemon-art', size)} aria-label={pokemon.name}>
        <svg viewBox="0 0 40 40" width="100%" height="100%">
          <defs>
            <clipPath id="ball-top">
              <path d="M20 2a18 18 0 0 1 18 18H2A18 18 0 0 1 20 2Z" />
            </clipPath>
            <clipPath id="ball-bottom">
              <path d="M2 20h36a18 18 0 0 1-36 0Z" />
            </clipPath>
          </defs>
          <circle cx="20" cy="20" r="18" fill="#f4f4f7" />
          <g clipPath="url(#ball-top)">
            <rect width="40" height="20" fill="#ef4a5d" />
          </g>
          <g clipPath="url(#ball-bottom)">
            <rect y="20" width="40" height="20" fill="#f4f4f7" />
          </g>
          <rect y="18.4" width="40" height="3.2" fill="#16161a" />
          <circle cx="20" cy="20" r="6" fill="#16161a" />
          <circle cx="20" cy="20" r="3.4" fill="#f4f4f7" />
        </svg>
      </div>
    )
  }

  return (
    <div
      className={cx('pokemon-art', size)}
      aria-label={pokemon.name}
      style={{ color: tint }}
    >
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="currentColor">
        <ellipse cx="20" cy="33" rx="9" ry="3" fill="rgba(0,0,0,0.25)" />
        <ellipse cx="20" cy="24" rx="11" ry="12" />
        <circle cx="20" cy="11" r="8.5" />
        <circle cx="12.5" cy="9" r="3" />
        <circle cx="27.5" cy="9" r="3" />
        <circle cx="17" cy="10" r="1.5" fill="#16161a" />
        <circle cx="23" cy="10" r="1.5" fill="#16161a" />
        <path d="M20 20l3 3-3 2-3-2z" fill="rgba(0,0,0,0.22)" />
        <ellipse cx="15" cy="28" rx="3.4" ry="2.4" fill="rgba(255,255,255,0.32)" />
      </svg>
    </div>
  )
}