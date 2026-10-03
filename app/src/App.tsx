import { useCallback, useMemo, useState } from 'react'

import {
  JOIN_COLORS,
  MISSIONS,
  POKEMON,
  PRS,
  TEAM,
  type Member,
  type Mission,
  type PullRequest,
} from './data'
import { Sidebar, Topbar, type View } from './components/shell'
import { EncounterModal, Onboard } from './components/modals'
import { JoinModal } from './components/JoinModal'
import { HomeView } from './views/HomeView'
import { MissionsView } from './views/MissionsView'
import { PlanView } from './views/PlanView'
import { HandoffView } from './views/HandoffView'
import { ReviewView } from './views/ReviewView'
import { PokedexView, type Capture } from './views/PokedexView'
import { LeaderboardView } from './views/LeaderboardView'
import { AgentSession } from './views/AgentSession'
import { useSimulatedSession } from './sim/useSimulatedSession'

type Encounter = { pokemon: string; mission: string } | null

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export default function App() {
  const [view, setView] = useState<View>('home')
  const [onboarded, setOnboarded] = useState(false)
  const [joining, setJoining] = useState(false)

  const [team, setTeam] = useState<Member[]>(TEAM)
  const [missions, setMissions] = useState<Mission[]>(MISSIONS)
  const [activeMission, setActiveMission] = useState<Mission>(MISSIONS[0])
  const [captures, setCaptures] = useState<Capture[]>([
    { id: 'c0', pokemon: 'pokeball', mission: 'Welcome' },
    { id: 'c1', pokemon: 'charmander', mission: 'Fix the Auth Crash' },
  ])
  const [encounter, setEncounter] = useState<Encounter>(null)
  const [prs, setPrs] = useState<PullRequest[]>(PRS)

  const onPickMission = useCallback((m: Mission) => {
    setMissions((ms) =>
      ms.map((x) => ({
        ...x,
        status:
          x.id === m.id ? ('active' as const) : x.status === 'active' ? ('available' as const) : x.status,
      })),
    )
    setActiveMission(m)
    setView('plan')
  }, [])

  const onShip = useCallback((m: Mission) => {
    setActiveMission(m)
    setMissions((ms) =>
      ms.map((x) =>
        x.id === m.id
          ? {
              ...x,
              status: 'completed' as const,
              steps: x.steps.map((s) => ({ ...s, done: true })),
            }
          : x,
      ),
    )
    setEncounter({ pokemon: m.rewardPokemon, mission: m.title })
  }, [])

  const onCapture = useCallback(() => {
    if (!encounter) return
    const { pokemon, mission } = encounter
    setCaptures((c) => [...c, { id: `cap${Date.now()}`, pokemon, mission }])
    setMissions((ms) => {
      const next = ms.find((m) => m.status === 'available')
      if (next) setActiveMission(next)
      return ms
    })
    setEncounter(null)
    setView('pokedex')
  }, [encounter])

  const onJoin = useCallback((name: string) => {
    setTeam((t) => {
      if (t.some((m) => m.name.toLowerCase() === name.toLowerCase())) return t
      return [
        ...t,
        {
          id: slug(name) || `guest-${t.length}`,
          name,
          handle: `@${slug(name) || 'guest'}`,
          emoji: name.trim().charAt(0).toUpperCase(),
          color: JOIN_COLORS[t.length % JOIN_COLORS.length],
          role: 'Collaborator',
        },
      ]
    })
    setJoining(false)
  }, [])

  const onApprove = useCallback((id: string) => {
    setPrs((list) =>
      list.map((pr) =>
        pr.id === id
          ? {
              ...pr,
              tests: 'current' as const,
              approval: {
                by: 'me',
                at: 'just now',
                evidence: 'current diff · tests current · deploy current',
                stale: false,
              },
            }
          : pr,
      ),
    )
  }, [])

  const sim = useSimulatedSession(team)

  const availableMissions = useMemo(
    () => missions.filter((m) => m.status === 'available').length,
    [missions],
  )
  const missionDoneCount = useMemo(
    () => missions.filter((m) => m.status === 'completed').length + 1,
    [missions],
  )

  return (
    <div className="app-shell">
      <Topbar
        captureCount={captures.length}
        mission={activeMission}
        team={team}
        onJoin={() => setJoining(true)}
      />

      <Sidebar
        view={view}
        setView={setView}
        availableMissions={availableMissions}
        captureCount={captures.length}
        teamCount={team.length}
      />

      <main className="main">
        {view === 'home' && (
          <HomeView
            captureCount={captures.length}
            missionDoneCount={missionDoneCount}
            activeMission={activeMission}
            team={team}
            activity={sim.activity()}
            onOpenMissions={() => setView('missions')}
            onOpenCode={() => setView('missions')}
            onOpenPokedex={() => setView('pokedex')}
            onOpenLeaderboard={() => setView('leaderboard')}
            onJoin={() => setJoining(true)}
          />
        )}

        {view === 'missions' && (
          <MissionsView missions={missions} onPick={onPickMission} onShip={onShip} />
        )}

        {view === 'plan' && <PlanView />}

        {view === 'handoff' && <HandoffView />}

        {view === 'agent' && <AgentSession mission={activeMission} />}

        {view === 'review' && <ReviewView prs={prs} onApprove={onApprove} />}

        {view === 'pokedex' && (
          <PokedexView captures={captures} onGoToMissions={() => setView('missions')} />
        )}

        {view === 'leaderboard' && <LeaderboardView team={team} />}
      </main>

      {encounter && (
        <EncounterModal
          pokemon={POKEMON[encounter.pokemon]}
          mission={encounter.mission}
          onCapture={onCapture}
          onClose={() => setEncounter(null)}
        />
      )}

      {joining && <JoinModal onJoin={onJoin} onClose={() => setJoining(false)} />}

      {!onboarded && (
        <Onboard
          onStart={() => {
            setOnboarded(true)
            setView('missions')
          }}
        />
      )}
    </div>
  )
}