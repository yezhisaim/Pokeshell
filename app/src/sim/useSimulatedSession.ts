import { useCallback, useEffect, useState } from 'react'

import { TEAM, memberById, type Member } from '../data'

export type SimEvent = {
  id: string
  who: string
  text: string
  when: string
}

const STORAGE_KEY = 'pokeshell.demo.v1'

/** Scripted teammate activity. Deliberately sparse so the session reads as
 *  busy without looking like noise. */
const BEATS: { who: string; text: string; delay: number }[] = [
  { who: 'kenji', text: 'picked up **Write a Clean Handoff** from the board', delay: 9000 },
  { who: 'amara', text: 'flagged PR 418 — the approval is bound to an older diff', delay: 16000 },
  { who: 'davies', text: 'is still blocked on the refresh-token decision', delay: 24000 },
  { who: 'tomas', text: 'marked `build:pass` on staging', delay: 33000 },
  { who: 'kenji', text: 'added the crash reproduction to `auth.test.ts`', delay: 43000 },
  { who: 'amara', text: 're-reviewed PR 412 against the current evidence', delay: 55000 },
  { who: 'davies', text: 'opened `src/session/middleware.ts`', delay: 68000 },
  { who: 'tomas', text: 'is watching the deploy checks', delay: 82000 },
]

const ONLINE_LABEL = 'online'

function load(): { seen: number; events: SimEvent[] } {
  if (typeof localStorage === 'undefined') return { seen: 0, events: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { seen: 0, events: [] }
    const parsed = JSON.parse(raw)
    return { seen: Number(parsed.seen) || 0, events: Array.isArray(parsed.events) ? parsed.events : [] }
  } catch {
    return { seen: 0, events: [] }
  }
}

export function useSimulatedSession(team: Member[]) {
  const [initial] = useState(load)
  const [cursor, setCursor] = useState(initial.seen)
  const [events, setEvents] = useState<SimEvent[]>(initial.events)

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ seen: cursor, events: events.slice(-40) }))
    } catch {
      /* storage unavailable — the demo still runs, it just will not resume */
    }
  }, [cursor, events])

  useEffect(() => {
    const timers = BEATS.map((beat, i) =>
      window.setTimeout(() => {
        setCursor(i + 1)
        setEvents((prev) => [
          {
            id: `sim-${i}-${Date.now()}`,
            who: beat.who,
            text: beat.text,
            when: 'just now',
          },
          ...prev,
        ])
      }, beat.delay),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [])

  const activity = useCallback(
    () =>
      events.slice(0, 8).map((e) => {
        const m = memberById(e.who, team)
        return { id: e.id, who: m, text: e.text, when: e.when }
      }),
    [events, team],
  )

  const online = useCallback(() => team.filter((m) => !m.isMe), [team])

  return { activity, online, status: ONLINE_LABEL, beatsPlayed: cursor }
}

export const DEMO_TEAM = TEAM