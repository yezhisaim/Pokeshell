export type Member = {
  id: string
  name: string
  handle: string
  emoji: string
  color: string
  isMe?: boolean
  role: string
}

export type MissionStatus = 'active' | 'available' | 'locked' | 'completed'

export type Mission = {
  id: string
  title: string
  desc: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  xp: number
  file: string
  branch: string
  rewardPokemon: string
  status: MissionStatus
  tags: string[]
  steps: { id: string; label: string; done: boolean }[]
}

export type FileEntry = {
  path: string
  group: string
  changed?: boolean
  lockedBy?: string
  additions?: number
  deletions?: number
}

export type Branch = {
  name: string
  owner: string
  files: number
  additions: number
  deletions: number
  ahead: number
  behind: number
  mission: string
}

export type Conflict = {
  id: string
  files: string[]
  branches: string[]
  severity: 'high' | 'medium' | 'low'
  status: 'open' | 'resolved'
  hint: string
}

export type PlanColumn = 'todo' | 'doing' | 'review' | 'done'

export type PlanTask = {
  id: string
  title: string
  column: PlanColumn
  owner: string
  tests: string[]
  deployCheck: string
  mission: string
}

export type EvidenceState = 'current' | 'stale' | 'unavailable'

export type PullRequest = {
  id: string
  title: string
  branch: string
  author: string
  mission: string
  diff: string
  tests: EvidenceState
  deploy: EvidenceState
  planSteps: number
  risks: number
  approval: {
    by: string
    at: string
    evidence: string
    stale: boolean
  } | null
}

export type HandoffEvent = {
  id: string
  who: string
  tone: 'amber' | 'pink' | 'green' | 'blue'
  what: string
  when: string
  note?: string
}

export type Pokemon = {
  id: string
  name: string
  number: string
  type: string
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
  art: string
}

export type AITask = {
  id: string
  title: string
  desc: string
  owner: string
  status: 'queued' | 'running' | 'done'
  tag: string
}

export type Activity = {
  id: string
  who: string
  what: string
  when: string
}

export type TerminalLine = {
  id: string
  level: 'ok' | 'err' | 'info' | 'dim' | 'prompt'
  text: string
}

export const ME: Member = {
  id: 'me',
  name: 'Yezhisai',
  handle: '@yezhisaim',
  emoji: 'Y',
  color: '#ffb020',
  isMe: true,
  role: 'Tech lead',
}

/** Static invite code for this session. Anyone with it can join the team. */
export const SESSION_CODE = '123456789'

/** Missions included on the free plan. Everything past this needs a paid plan. */
export const FREE_MISSION_LIMIT = 5

export const JOIN_COLORS = [
  '#5eb3ff',
  '#4ade80',
  '#b48cff',
  '#ff5d73',
  '#ffc44a',
  '#3b9ef5',
  '#22c55e',
]

export const TEAM: Member[] = [
  ME,
  {
    id: 'davies',
    name: 'Davies',
    handle: '@davies',
    emoji: 'D',
    color: '#5eb3ff',
    role: 'Frontend',
  },
  {
    id: 'kenji',
    name: 'Kenji',
    handle: '@kenji',
    emoji: 'K',
    color: '#4ade80',
    role: 'Backend',
  },
  {
    id: 'amara',
    name: 'Amara',
    handle: '@amara',
    emoji: 'A',
    color: '#b48cff',
    role: 'Reviewer',
  },
  {
    id: 'tomas',
    name: 'Tomas',
    handle: '@tomas',
    emoji: 'T',
    color: '#ff5d73',
    role: 'Infra',
  },
]

export const memberById = (id: string, team: Member[] = TEAM): Member =>
  team.find((m) => m.id === id) ?? ME

export const POKEMON_LIST: Pokemon[] = [
  {
    id: 'pokeball',
    name: 'Pokéball',
    number: '000',
    type: 'item',
    rarity: 'Common',
    art: 'ball',
  },
  {
    id: 'charmander',
    name: 'Charmander',
    number: '004',
    type: 'fire',
    rarity: 'Rare',
    art: 'lizard',
  },
  {
    id: 'squirtle',
    name: 'Squirtle',
    number: '007',
    type: 'water',
    rarity: 'Rare',
    art: 'turtle',
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    number: '025',
    type: 'electric',
    rarity: 'Epic',
    art: 'mouse',
  },
  {
    id: 'bulbasaur',
    name: 'Bulbasaur',
    number: '001',
    type: 'grass',
    rarity: 'Rare',
    art: 'seed',
  },
  {
    id: 'eevee',
    name: 'Eevee',
    number: '133',
    type: 'normal',
    rarity: 'Epic',
    art: 'fox',
  },
  {
    id: 'gengar',
    name: 'Gengar',
    number: '094',
    type: 'ghost',
    rarity: 'Legendary',
    art: 'ghost',
  },
  {
    id: 'mewtwo',
    name: 'Mewtwo',
    number: '150',
    type: 'psychic',
    rarity: 'Legendary',
    art: 'psychic',
  },
  {
    id: 'snorlax',
    name: 'Snorlax',
    number: '143',
    type: 'normal',
    rarity: 'Epic',
    art: 'bear',
  },
  {
    id: 'gyarados',
    name: 'Gyarados',
    number: '130',
    type: 'water',
    rarity: 'Legendary',
    art: 'serpent',
  },
  {
    id: 'onix',
    name: 'Onix',
    number: '095',
    type: 'rock',
    rarity: 'Rare',
    art: 'rock',
  },
  {
    id: 'alakazam',
    name: 'Alakazam',
    number: '065',
    type: 'psychic',
    rarity: 'Legendary',
    art: 'psychic',
  },
]

export const POKEMON: Record<string, Pokemon> = Object.fromEntries(
  POKEMON_LIST.map((p) => [p.id, p]),
)

export const MISSIONS: Mission[] = [
  {
    id: 'm-auth',
    title: 'Fix the Auth Crash',
    desc: 'Login throws on empty credentials. Guard the submit path and cover it with tests.',
    difficulty: 'Medium',
    xp: 120,
    file: 'src/auth/login.ts',
    branch: 'fix/auth-crash',
    rewardPokemon: 'charmander',
    status: 'active',
    tags: ['bug', 'auth', 'tests'],
    steps: [
      { id: 's1', label: 'Reproduce the crash', done: true },
      { id: 's2', label: 'Guard empty email + password', done: true },
      { id: 's3', label: 'Run the test suite', done: false },
      { id: 's4', label: 'Ship and capture', done: false },
    ],
  },
  {
    id: 'm-overlap',
    title: 'Resolve the Merge Conflict',
    desc: 'Two branches changed the same session middleware. Produce a resolution both owners accept.',
    difficulty: 'Hard',
    xp: 260,
    file: 'src/session/middleware.ts',
    branch: 'fix/merge-conflict',
    rewardPokemon: 'gengar',
    status: 'available',
    tags: ['merge', 'coordination'],
    steps: [
      { id: 's1', label: 'Read both branch versions', done: false },
      { id: 's2', label: 'Agree the shared contract', done: false },
      { id: 's3', label: 'Resolve and verify', done: false },
    ],
  },
  {
    id: 'm-handoff',
    title: 'Write a Clean Handoff',
    desc: 'Capture plan, changed files, app state, and next step so the next agent resumes cold.',
    difficulty: 'Easy',
    xp: 80,
    file: 'src/handoff/context.ts',
    branch: 'feat/handoff-context',
    rewardPokemon: 'eevee',
    status: 'available',
    tags: ['handoff', 'context'],
    steps: [
      { id: 's1', label: 'List changed files', done: false },
      { id: 's2', label: 'Record the next step', done: false },
      { id: 's3', label: 'Verify a cold resume', done: false },
    ],
  },
  {
    id: 'm-evidence',
    title: 'Wire the Review Evidence Matrix',
    desc: 'Bind each approval to the exact diff, test, and deploy state that was reviewed.',
    difficulty: 'Medium',
    xp: 180,
    file: 'src/review/evidence.ts',
    branch: 'feat/evidence-matrix',
    rewardPokemon: 'alakazam',
    status: 'available',
    tags: ['review', 'approvals'],
    steps: [
      { id: 's1', label: 'Snapshot evidence per approval', done: false },
      { id: 's2', label: 'Invalidate on change', done: false },
      { id: 's3', label: 'Show missing evidence', done: false },
    ],
  },
  {
    id: 'm-perf',
    title: 'Speed Up the Feed Query',
    desc: 'The activity feed does a full scan per request. Add the missing index and measure.',
    difficulty: 'Hard',
    xp: 300,
    file: 'src/data/feed.ts',
    branch: 'perf/feed-index',
    rewardPokemon: 'gyarados',
    status: 'locked',
    tags: ['performance', 'data'],
    steps: [
      { id: 's1', label: 'Capture the baseline', done: false },
      { id: 's2', label: 'Add the index', done: false },
      { id: 's3', label: 'Re-measure', done: false },
    ],
  },
]

export const PREMIUM_MISSIONS: Mission[] = [
  {
    id: 'm-graph',
    title: 'Index the Activity Graph',
    desc: 'The team feed walks the whole event log. Build the traversal index and measure the win.',
    difficulty: 'Hard',
    xp: 340,
    file: 'src/data/graph.ts',
    branch: 'perf/graph-index',
    rewardPokemon: 'gyarados',
    status: 'locked',
    tags: ['performance', 'data'],
    steps: [
      { id: 's1', label: 'Capture the baseline', done: false },
      { id: 's2', label: 'Build the traversal index', done: false },
      { id: 's3', label: 'Re-measure and compare', done: false },
    ],
  },
  {
    id: 'm-rbac',
    title: 'Scope Sessions by Membership',
    desc: 'Row-level access so one session can never read another session rows.',
    difficulty: 'Hard',
    xp: 380,
    file: 'src/auth/rls.ts',
    branch: 'feat/session-rls',
    rewardPokemon: 'mewtwo',
    status: 'locked',
    tags: ['security', 'backend'],
    steps: [
      { id: 's1', label: 'Write the membership policy', done: false },
      { id: 's2', label: 'Add the cross-session test', done: false },
      { id: 's3', label: 'Verify the denial path', done: false },
    ],
  },
  {
    id: 'm-observability',
    title: 'Trace the Agent Session',
    desc: 'One trace per agent turn, with tool-call spans, so a slow reply is explainable.',
    difficulty: 'Medium',
    xp: 220,
    file: 'src/agent/telemetry.ts',
    branch: 'feat/agent-traces',
    rewardPokemon: 'snorlax',
    status: 'locked',
    tags: ['observability', 'agent'],
    steps: [
      { id: 's1', label: 'Instrument the run loop', done: false },
      { id: 's2', label: 'Emit tool spans', done: false },
      { id: 's3', label: 'Check a trace end to end', done: false },
    ],
  },
]

export const FILES: FileEntry[] = [
  { path: 'src/auth/login.ts', group: 'auth', changed: true, lockedBy: 'me', additions: 14, deletions: 6 },
  { path: 'src/auth/session.ts', group: 'auth', changed: true, lockedBy: 'kenji', additions: 8, deletions: 2 },
  { path: 'src/auth/guards.ts', group: 'auth' },
  { path: 'src/session/middleware.ts', group: 'session', changed: true, lockedBy: 'davies', additions: 31, deletions: 18 },
  { path: 'src/session/store.ts', group: 'session', changed: true, additions: 12, deletions: 4 },
  { path: 'src/handoff/context.ts', group: 'handoff' },
  { path: 'src/review/evidence.ts', group: 'review', changed: true, lockedBy: 'amara', additions: 22, deletions: 9 },
  { path: 'src/data/feed.ts', group: 'data' },
  { path: 'tests/auth.test.ts', group: 'tests', changed: true, additions: 19, deletions: 1 },
  { path: 'tests/session.test.tsx', group: 'tests', changed: true, additions: 11, deletions: 3 },
  { path: 'package.json', group: 'root' },
  { path: 'README.md', group: 'root' },
]

export const BRANCHES: Branch[] = [
  {
    name: 'main',
    owner: 'me',
    files: 0,
    additions: 0,
    deletions: 0,
    ahead: 0,
    behind: 0,
    mission: 'Protected baseline',
  },
  {
    name: 'fix/auth-crash',
    owner: 'me',
    files: 4,
    additions: 53,
    deletions: 12,
    ahead: 6,
    behind: 1,
    mission: 'Fix the Auth Crash',
  },
  {
    name: 'fix/merge-conflict',
    owner: 'davies',
    files: 3,
    additions: 47,
    deletions: 29,
    ahead: 4,
    behind: 3,
    mission: 'Resolve the Merge Conflict',
  },
  {
    name: 'feat/handoff-context',
    owner: 'kenji',
    files: 2,
    additions: 20,
    deletions: 4,
    ahead: 2,
    behind: 0,
    mission: 'Write a Clean Handoff',
  },
  {
    name: 'feat/evidence-matrix',
    owner: 'amara',
    files: 2,
    additions: 22,
    deletions: 9,
    ahead: 3,
    behind: 2,
    mission: 'Wire the Review Evidence Matrix',
  },
]

export const CONFLICTS: Conflict[] = [
  {
    id: 'c1',
    files: ['src/session/middleware.ts'],
    branches: ['fix/auth-crash', 'fix/merge-conflict'],
    severity: 'high',
    status: 'open',
    hint: 'Both branches changed the refresh-token branch. Pick one owner before merging.',
  },
  {
    id: 'c2',
    files: ['src/session/store.ts', 'tests/session.test.tsx'],
    branches: ['fix/merge-conflict', 'feat/handoff-context'],
    severity: 'medium',
    status: 'open',
    hint: 'Store shape diverged. Reconcile the persisted field names.',
  },
  {
    id: 'c3',
    files: ['src/auth/session.ts'],
    branches: ['fix/auth-crash', 'feat/handoff-context'],
    severity: 'low',
    status: 'resolved',
    hint: 'Resolved by Kenji in 9d2f1a4.',
  },
]

export const PLAN: PlanTask[] = [
  {
    id: 'p1',
    title: 'Guard the login submit path',
    column: 'done',
    owner: 'me',
    tests: ['auth.test.ts › rejects empty email'],
    deployCheck: 'build:pass',
    mission: 'Fix the Auth Crash',
  },
  {
    id: 'p2',
    title: 'Reproduce crash on empty credentials',
    column: 'done',
    owner: 'kenji',
    tests: ['auth.test.ts › reproduces crash'],
    deployCheck: 'build:pass',
    mission: 'Fix the Auth Crash',
  },
  {
    id: 'p3',
    title: 'Run full suite for the auth change',
    column: 'doing',
    owner: 'me',
    tests: ['auth.test.ts', 'session.test.tsx'],
    deployCheck: 'pending',
    mission: 'Fix the Auth Crash',
  },
  {
    id: 'p4',
    title: 'Agree shared session middleware contract',
    column: 'review',
    owner: 'davies',
    tests: ['session.test.tsx › restores session'],
    deployCheck: 'stale',
    mission: 'Resolve the Merge Conflict',
  },
  {
    id: 'p5',
    title: 'Record handoff context shape',
    column: 'todo',
    owner: 'kenji',
    tests: ['handoff.test.ts'],
    deployCheck: 'pending',
    mission: 'Write a Clean Handoff',
  },
  {
    id: 'p6',
    title: 'Bind approvals to an evidence snapshot',
    column: 'todo',
    owner: 'amara',
    tests: ['evidence.test.ts › invalidates on change'],
    deployCheck: 'pending',
    mission: 'Wire the Review Evidence Matrix',
  },
  {
    id: 'p7',
    title: 'Ship auth guard and capture',
    column: 'done',
    owner: 'me',
    tests: ['auth.test.ts › 4/4 passing'],
    deployCheck: 'build:pass',
    mission: 'Fix the Auth Crash',
  },
]

export const PRS: PullRequest[] = [
  {
    id: 'PR 412',
    title: 'Guard empty credentials in login submit',
    branch: 'fix/auth-crash',
    author: 'me',
    mission: 'Fix the Auth Crash',
    diff: '+14 −6 in src/auth/login.ts',
    tests: 'current',
    deploy: 'current',
    planSteps: 3,
    risks: 0,
    approval: {
      by: 'amara',
      at: 'yesterday 16:40',
      evidence: 'diff a91c2e · tests 4/4 · deploy build:pass',
      stale: false,
    },
  },
  {
    id: 'PR 418',
    title: 'Rework session middleware refresh path',
    branch: 'fix/merge-conflict',
    author: 'davies',
    mission: 'Resolve the Merge Conflict',
    diff: '+31 −18 in src/session/middleware.ts',
    tests: 'stale',
    deploy: 'stale',
    planSteps: 1,
    risks: 2,
    approval: {
      by: 'amara',
      at: '2 days ago',
      evidence: 'diff 5f30b7d · tests 3/4 · deploy build:pass',
      stale: true,
    },
  },
  {
    id: 'PR 421',
    title: 'Add handoff context capture',
    branch: 'feat/handoff-context',
    author: 'kenji',
    mission: 'Write a Clean Handoff',
    diff: '+20 −4 in src/handoff/context.ts',
    tests: 'unavailable',
    deploy: 'current',
    planSteps: 1,
    risks: 1,
    approval: null,
  },
  {
    id: 'PR 425',
    title: 'Snapshot review evidence per approval',
    branch: 'feat/evidence-matrix',
    author: 'amara',
    mission: 'Wire the Review Evidence Matrix',
    diff: '+22 −9 in src/review/evidence.ts',
    tests: 'current',
    deploy: 'unavailable',
    planSteps: 1,
    risks: 0,
    approval: null,
  },
]

export const HANDOFF: HandoffEvent[] = [
  {
    id: 'h1',
    who: 'me',
    tone: 'amber',
    what: 'Picked up Fix the Auth Crash from the plan board',
    when: 'today 09:12',
    note: 'Plan step 3 (run the suite) is the active next step.',
  },
  {
    id: 'h2',
    who: 'kenji',
    tone: 'blue',
    what: 'Wrote the crash reproduction test',
    when: 'today 08:50',
    note: 'auth.test.ts › reproduces crash now fails on main as expected.',
  },
  {
    id: 'h3',
    who: 'amara',
    tone: 'green',
    what: 'Reviewed PR 412 and approved against the current evidence',
    when: 'yesterday 16:40',
    note: 'Evidence at approval: diff a91c2e, tests 4/4, deploy build:pass.',
  },
  {
    id: 'h4',
    who: 'davies',
    tone: 'pink',
    what: 'Took ownership of the merge conflict on session middleware',
    when: 'yesterday 15:10',
    note: 'Waiting on a decision about the refresh-token branch before resolving.',
  },
  {
    id: 'h5',
    who: 'me',
    tone: 'amber',
    what: 'Started the shared session and opened src/auth/login.ts',
    when: 'yesterday 14:02',
    note: 'Running app: vite dev on :5173. Two collaborators in the file.',
  },
]

export const AI_TASKS: AITask[] = [
  {
    id: 'ai1',
    title: 'Summarize the branch overlap for the team',
    desc: 'Reads the dependency map and reports which files two owners are about to collide on.',
    owner: 'agent',
    status: 'running',
    tag: 'coordination',
  },
  {
    id: 'ai2',
    title: 'Draft the handoff note from session state',
    desc: 'Collects plan, changed files, app state, and next step into one resumable note.',
    owner: 'agent',
    status: 'queued',
    tag: 'handoff',
  },
  {
    id: 'ai3',
    title: 'Check approvals for stale evidence',
    desc: 'Flags any approval whose diff, tests, or deploy state moved after it was granted.',
    owner: 'agent',
    status: 'done',
    tag: 'review',
  },
]

export const ACTIVITY: Activity[] = [
  {
    id: 'a1',
    who: 'me',
    what: 'edited <span class="mono">src/auth/login.ts</span> (+14 −6)',
    when: '2 min ago',
  },
  {
    id: 'a2',
    who: 'amara',
    what: 'approved PR 412 against diff a91c2e',
    when: '18 min ago',
  },
  {
    id: 'a3',
    who: 'davies',
    what: 'opened a conflict on <span class="mono">src/session/middleware.ts</span>',
    when: '41 min ago',
  },
  {
    id: 'a4',
    who: 'kenji',
    what: 'ran the auth suite — 4/4 passing',
    when: '1 hr ago',
  },
  {
    id: 'a5',
    who: 'tomas',
    what: 'deployed staging and marked build:pass on PR 412',
    when: '2 hr ago',
  },
]

export const TERMINAL_LOG: TerminalLine[] = [
  { id: 't1', level: 'dim', text: '$ pokeshell session open main-session' },
  { id: 't2', level: 'info', text: '› repository pokeshell/pokeshell @ fix/auth-crash' },
  { id: 't3', level: 'info', text: '› 4 collaborators present' },
  { id: 't4', level: 'dim', text: '› opening src/auth/login.ts' },
  { id: 't5', level: 'ok', text: '✓ src/auth/login.ts opened — you and Davies' },
  { id: 't6', level: 'prompt', text: '$ ' },
]

export const CODE_SNIPPET: { text: string; kind: 'added' | 'removed' | 'same' }[] = [
  { kind: 'same', text: 'export async function submit(form: LoginForm) {' },
  { kind: 'same', text: '  const { email, password } = form' },
  { kind: 'removed', text: '  return auth.signIn(email, password)' },
  { kind: 'added', text: '  if (!email.trim() || !password) {' },
  { kind: 'added', text: '    throw new ValidationError("email and password are required")' },
  { kind: 'added', text: '  }' },
  { kind: 'added', text: '' },
  { kind: 'added', text: '  return auth.signIn(email.trim(), password)' },
  { kind: 'same', text: '}' },
]

export const LEADERBOARD = [
  { id: 'me', captures: 2, missions: 1, xp: 120 },
  { id: 'davies', captures: 1, missions: 0, xp: 90 },
  { id: 'amara', captures: 1, missions: 0, xp: 75 },
  { id: 'kenji', captures: 0, missions: 0, xp: 40 },
  { id: 'tomas', captures: 0, missions: 0, xp: 15 },
]

export const RARITY_COLOR: Record<string, string> = {
  Common: '#b3b3c0',
  Rare: '#5eb3ff',
  Epic: '#b48cff',
  Legendary: '#ffb020',
}