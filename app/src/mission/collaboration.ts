import * as Y from 'yjs'

import { POKEMON, type Member, type Mission } from '../data'

/**
 * Mission Room collaboration layer.
 *
 * The shared document lives in a Y.Doc that is never persisted: no
 * localStorage, no IndexedDB, no server. Tabs of the same mission find each
 * other over a BroadcastChannel namespaced by mission id and exchange CRDT
 * updates, so concurrent edits merge instead of overwriting each other.
 */

const PROTOCOL = 'pokeshell:mission'
const PRESENCE_PING_MS = 2000
const PRESENCE_TTL_MS = 6000
const EDITING_TTL_MS = 4000
const CURSOR_TTL_MS = 5000
const SWEEP_MS = 1000
const TEARDOWN_DELAY_MS = 60
const SYNC_ASK_RETRY_MS = 900
const SEED_WAIT_MS = 220
const SEED_CLAIM_WAIT_MS = 150

/** Kept in sync with `.mr-doc` / `.mr-ln` line-height in mission-room.css. */
export const DOC_LINE_HEIGHT = 22

/** Marks an update that arrived from another tab, so it is not re-broadcast. */
const REMOTE = 'remote'

export function roomChannel(missionId: string): string {
  return `${PROTOCOL}:${missionId}`
}

export type RoomStatus = 'connecting' | 'live'

export type Peer = {
  tabId: string
  memberId: string
  name: string
  emoji: string
  color: string
  seenAt: number
  editing: boolean
}

export type RemoteCursor = {
  tabId: string
  name: string
  color: string
  index: number
  line: number
  col: number
  seenAt: number
}

export type InlineToken = { kind: 'text' | 'strong' | 'code'; text: string }

export type ChatBlock =
  | { kind: 'p'; tokens: InlineToken[] }
  | { kind: 'ul'; items: InlineToken[][] }

export type ChatMessage = {
  id: string
  tabId: string
  memberId: string
  name: string
  emoji: string
  color: string
  text: string
  at: string
}

export type RoomSnapshot = {
  status: RoomStatus
  docText: string
  messages: ChatMessage[]
  peers: Peer[]
  cursors: RemoteCursor[]
  lastEvent: string
  revision: number
}

export type MissionRoom = {
  readonly tabId: string
  readonly missionId: string
  readonly memberId: string
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => RoomSnapshot
  replaceWith: (next: string) => void
  clear: () => void
  send: (raw: string) => void
  reportCursor: (index: number) => void
  retain: () => void
  release: () => void
  isDestroyed: () => boolean
  destroy: () => void
}

type Envelope =
  | { t: 'sync-ask'; from: string }
  | { t: 'sync-reply'; from: string; to: string; update: Uint8Array }
  | { t: 'update'; from: string; update: Uint8Array }
  | { t: 'seed-claim'; from: string }
  | { t: 'presence'; from: string; memberId: string; name: string; emoji: string; color: string }
  | { t: 'cursor'; from: string; name: string; color: string; index: number; line: number; col: number }
  | { t: 'chat'; from: string; message: ChatMessage }
  | { t: 'bye'; from: string }

type PeerRecord = Peer & { editingAt: number }

/* ------------------------------------------------------------------ *
 * Minimal text diff. Every local edit becomes one contiguous insert or
 * delete on the Y.Text instead of a full document replacement, which is
 * what makes concurrent edits from two tabs merge without loss.
 * ------------------------------------------------------------------ */

export type TextDiff = { at: number; deleteCount: number; insert: string }

export function diffText(before: string, after: string): TextDiff | null {
  if (before === after) return null
  const shortest = Math.min(before.length, after.length)
  let start = 0
  while (start < shortest && before[start] === after[start]) start++
  const tailRoom = shortest - start
  let tail = 0
  while (tail < tailRoom && before[before.length - 1 - tail] === after[after.length - 1 - tail]) tail++
  return {
    at: start,
    deleteCount: before.length - start - tail,
    insert: after.slice(start, after.length - tail),
  }
}

export function lineCol(text: string, index: number): { line: number; col: number } {
  const clamped = Math.max(0, Math.min(index, text.length))
  let line = 0
  let lineStart = 0
  for (let i = 0; i < clamped; i++) {
    if (text.charCodeAt(i) === 10) {
      line++
      lineStart = i + 1
    }
  }
  return { line, col: clamped - lineStart }
}

/* ------------------------------------------------------------------ *
 * Chat markdown: plain text, **bold**, `code`, and "- " bullet lines.
 * ------------------------------------------------------------------ */

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`\n]+`)/g

export function parseInline(raw: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let cursor = 0
  for (const match of raw.matchAll(INLINE_PATTERN)) {
    const start = match.index ?? 0
    if (start > cursor) tokens.push({ kind: 'text', text: raw.slice(cursor, start) })
    const body = match[0]
    if (body.startsWith('**')) tokens.push({ kind: 'strong', text: body.slice(2, -2) })
    else tokens.push({ kind: 'code', text: body.slice(1, -1) })
    cursor = start + body.length
  }
  if (cursor < raw.length) tokens.push({ kind: 'text', text: raw.slice(cursor) })
  return tokens.length ? tokens : [{ kind: 'text', text: raw }]
}

export function parseChatMarkdown(src: string): ChatBlock[] {
  const blocks: ChatBlock[] = []
  let paragraph: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push({ kind: 'p', tokens: parseInline(paragraph.join(' ')) })
    paragraph = []
  }

  for (const line of src.split('\n')) {
    const bullet = /^\s*-\s+(.*)$/.exec(line)
    if (bullet) {
      flushParagraph()
      const previous = blocks[blocks.length - 1]
      if (previous && previous.kind === 'ul') previous.items.push(parseInline(bullet[1]))
      else blocks.push({ kind: 'ul', items: [parseInline(bullet[1])] })
      continue
    }
    if (!line.trim()) {
      flushParagraph()
      continue
    }
    paragraph.push(line.trim())
  }
  flushParagraph()
  return blocks
}

/* ------------------------------------------------------------------ *
 * Room
 * ------------------------------------------------------------------ */

function clockLabel(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function seedDocument(mission: Mission): string {
  const reward = POKEMON[mission.rewardPokemon]
  return [
    `# ${mission.title}`,
    '',
    `Branch \`${mission.branch}\` · file \`${mission.file}\` · reward ${reward ? reward.name : mission.rewardPokemon}`,
    '',
    '## What we are doing',
    '',
    mission.desc,
    '',
    '## Plan',
    '',
    ...mission.steps.map((s) => `- [${s.done ? 'x' : ' '}] ${s.label}`),
    '',
    '## Decisions',
    '',
    '- ',
    '',
    '## Open questions',
    '',
    '- ',
    '',
    '## Next step',
    '',
    '- ',
    '',
  ].join('\n')
}

function seedMessages(mission: Mission): ChatMessage[] {
  return [
    {
      id: 'seed-1',
      tabId: 'seed',
      memberId: 'davies',
      name: 'Davies',
      emoji: 'D',
      color: '#5eb3ff',
      text: `Opened the room for **${mission.title}**. The doc on the right is shared — edit it together, no saves.`,
      at: 'today 09:12',
    },
    {
      id: 'seed-2',
      tabId: 'seed',
      memberId: 'kenji',
      name: 'Kenji',
      emoji: 'K',
      color: '#4ade80',
      text: `- I will take the \`Decisions\` section\n- Say here before you rewrite it`,
      at: 'today 09:14',
    },
  ]
}

class MissionRoomImpl implements MissionRoom {
  readonly tabId: string
  readonly missionId: string
  readonly memberId: string

  private readonly mission: Mission
  private readonly member: Member
  private readonly doc = new Y.Doc()
  private readonly ytext: Y.Text
  private readonly channel: BroadcastChannel | null
  private readonly listeners = new Set<() => void>()
  private readonly peers = new Map<string, PeerRecord>()
  private readonly cursors = new Map<string, RemoteCursor>()
  private readonly seenMessages = new Set<string>()
  private readonly timers: ReturnType<typeof setTimeout>[] = []

  private messages: ChatMessage[]
  private snapshot: RoomSnapshot
  private revision = 0
  private lastEvent: string
  private status: RoomStatus = 'connecting'
  private seq = 0
  private pingTick = 0
  private seedBlocked = false
  private cursorPending: number | null = null
  private cursorFrame: number | null = null
  private sweepTimer: ReturnType<typeof setInterval> | null = null
  private teardownTimer: ReturnType<typeof setTimeout> | null = null
  private mounts = 0
  private destroyed = false

  constructor(mission: Mission, member: Member) {
    this.mission = mission
    this.member = member
    this.missionId = mission.id
    this.memberId = member.id
    this.tabId = `${member.id}-${Math.random().toString(36).slice(2, 8)}`
    this.ytext = this.doc.getText('mission-output')
    this.messages = seedMessages(mission)
    this.lastEvent = 'Room open. Checking for teammates already here.'
    this.channel =
      typeof BroadcastChannel === 'undefined'
        ? null
        : new BroadcastChannel(roomChannel(mission.id))

    this.doc.on('update', (update: Uint8Array, origin: unknown) => {
      if (origin !== REMOTE) this.post({ t: 'update', from: this.tabId, update })
      this.bump()
    })

    if (this.channel) {
      this.channel.onmessage = (event: MessageEvent<Envelope>) => this.handle(event.data)
      this.connect()
      this.sweepTimer = setInterval(() => this.sweep(), SWEEP_MS)
      if (typeof window !== 'undefined') {
        window.addEventListener('pagehide', this.onPageHide)
      }
    } else {
      this.seed()
    }

    this.snapshot = this.build()
  }

  private onPageHide = () => this.destroy()

  isDestroyed = () => this.destroyed

  /**
   * Mount bookkeeping. React tears effects down and back up inside one commit
   * under StrictMode, so teardown waits a tick and only fires if nothing
   * re-claimed the room in the meantime.
   */
  retain = () => {
    this.mounts += 1
    if (this.teardownTimer !== null) {
      clearTimeout(this.teardownTimer)
      this.teardownTimer = null
    }
  }

  release = () => {
    this.mounts = Math.max(0, this.mounts - 1)
    if (this.mounts > 0 || this.destroyed || this.teardownTimer !== null) return
    this.teardownTimer = setTimeout(() => {
      this.teardownTimer = null
      if (this.mounts === 0) this.destroy()
    }, TEARDOWN_DELAY_MS)
  }

  /* ---------------- sync handshake ---------------- */

  /**
   * A tab that joins mid-session must not start empty, so a new tab asks for
   * the full document state instead of waiting for the next delta. Every live
   * tab answers with `Y.encodeStateAsUpdate`, which carries the whole history
   * and is idempotent under repeated sends.
   */
  private connect() {
    this.post({ t: 'sync-ask', from: this.tabId })
    this.postPresence()
    this.after(SYNC_ASK_RETRY_MS, () => this.post({ t: 'sync-ask', from: this.tabId }))
    this.after(SEED_WAIT_MS, () => {
      if (this.ytext.length > 0 || this.peers.size > 0) return
      this.post({ t: 'seed-claim', from: this.tabId })
      this.after(SEED_CLAIM_WAIT_MS, () => {
        if (this.ytext.length === 0 && !this.seedBlocked) this.seed()
      })
    })
  }

  private seed() {
    if (this.destroyed || this.ytext.length > 0) return
    this.replaceWith(seedDocument(this.mission))
    this.status = 'live'
    this.lastEvent = 'Mission output started. Every open tab edits the same text.'
    this.bump()
  }

  /* ---------------- protocol ---------------- */

  private post = (message: Envelope) => {
    if (!this.channel) return
    try {
      this.channel.postMessage(message)
    } catch {
      /* channel already closed */
    }
  }

  private handle = (message: Envelope) => {
    if (!message || message.from === this.tabId) return

    switch (message.t) {
      case 'sync-ask':
        this.post({
          t: 'sync-reply',
          from: this.tabId,
          to: message.from,
          update: Y.encodeStateAsUpdate(this.doc),
        })
        this.touch(message.from)
        break

      case 'sync-reply': {
        if (message.to !== this.tabId) break
        const before = this.ytext.toString()
        Y.applyUpdate(this.doc, message.update, REMOTE)
        this.status = 'live'
        if (this.ytext.toString() !== before) {
          this.lastEvent = 'Loaded the shared document from a tab that was already open.'
        }
        this.bump()
        break
      }

      case 'update': {
        const before = this.ytext.toString()
        Y.applyUpdate(this.doc, message.update, REMOTE)
        this.status = 'live'
        if (this.ytext.toString() !== before) {
          this.lastEvent = `${this.whoIs(message.from)} edited the mission output.`
        }
        this.bump()
        break
      }

      case 'seed-claim':
        if (message.from < this.tabId) this.seedBlocked = true
        break

      case 'presence': {
        const fresh = !this.peers.has(message.from)
        const peer = this.touch(message.from)
        peer.memberId = message.memberId
        peer.name = message.name
        peer.emoji = message.emoji
        peer.color = message.color
        this.status = 'live'
        if (fresh) {
          this.lastEvent = `${message.name} opened this mission room.`
          this.postPresence()
        }
        this.bump()
        break
      }

      case 'cursor': {
        const now = Date.now()
        this.cursors.set(message.from, {
          tabId: message.from,
          name: message.name,
          color: message.color,
          index: message.index,
          line: message.line,
          col: message.col,
          seenAt: now,
        })
        const peer = this.peers.get(message.from)
        if (peer) {
          peer.editingAt = now
          peer.name = message.name
          peer.color = message.color
        }
        this.bump()
        break
      }

      case 'chat': {
        if (this.seenMessages.has(message.message.id)) break
        this.seenMessages.add(message.message.id)
        this.messages = [...this.messages, message.message]
        this.lastEvent = `${message.message.name} sent a message.`
        this.bump()
        break
      }

      case 'bye': {
        if (!this.peers.delete(message.from)) break
        this.cursors.delete(message.from)
        this.lastEvent = `${this.whoIs(message.from)} left the room.`
        this.bump()
        break
      }
    }
  }

  /* ---------------- presence ---------------- */

  private postPresence() {
    this.post({
      t: 'presence',
      from: this.tabId,
      memberId: this.member.id,
      name: this.member.name,
      emoji: this.member.emoji,
      color: this.member.color,
    })
  }

  private touch(tabId: string): PeerRecord {
    const known = this.peers.get(tabId)
    if (known) {
      known.seenAt = Date.now()
      return known
    }
    const created: PeerRecord = {
      tabId,
      memberId: tabId,
      name: 'Teammate',
      emoji: '?',
      color: '#7e7e8c',
      seenAt: Date.now(),
      editing: false,
      editingAt: 0,
    }
    this.peers.set(tabId, created)
    return created
  }

  private whoIs(tabId: string): string {
    return this.peers.get(tabId)?.name ?? 'A teammate'
  }

  private sweep() {
    if (this.destroyed) return
    const now = Date.now()
    const before = this.presenceSignature(now)
    for (const [tabId, peer] of this.peers) {
      if (now - peer.seenAt > PRESENCE_TTL_MS) {
        this.peers.delete(tabId)
        this.cursors.delete(tabId)
      }
    }
    for (const [tabId, cursor] of this.cursors) {
      if (now - cursor.seenAt > CURSOR_TTL_MS) this.cursors.delete(tabId)
    }
    this.pingTick += 1
    if (this.pingTick * SWEEP_MS >= PRESENCE_PING_MS) {
      this.pingTick = 0
      this.postPresence()
    }
    if (this.presenceSignature(now) !== before) {
      this.lastEvent = 'Presence updated.'
      this.bump()
    }
  }

  private presenceSignature(now: number): string {
    return [...this.peers.values()]
      .map((p) => `${p.tabId}:${now - p.editingAt < EDITING_TTL_MS ? 1 : 0}`)
      .sort()
      .join('|')
  }

  /* ---------------- document ---------------- */

  replaceWith = (next: string) => {
    if (this.destroyed) return
    const diff = diffText(this.ytext.toString(), next)
    if (!diff) return
    this.doc.transact(() => {
      if (diff.deleteCount > 0) this.ytext.delete(diff.at, diff.deleteCount)
      if (diff.insert) this.ytext.insert(diff.at, diff.insert)
    })
  }

  clear = () => {
    if (this.destroyed || this.ytext.length === 0) return
    this.doc.transact(() => this.ytext.delete(0, this.ytext.length))
  }

  reportCursor = (index: number) => {
    if (this.destroyed || !this.channel) return
    this.cursorPending = index
    if (this.cursorFrame !== null) return
    this.cursorFrame = requestAnimationFrame(() => {
      this.cursorFrame = null
      const at = this.cursorPending
      this.cursorPending = null
      if (at === null) return
      const spot = lineCol(this.ytext.toString(), at)
      this.post({
        t: 'cursor',
        from: this.tabId,
        name: this.member.name,
        color: this.member.color,
        index: at,
        line: spot.line,
        col: spot.col,
      })
    })
  }

  /* ---------------- chat ---------------- */

  send = (raw: string) => {
    const text = raw.trim()
    if (!text || this.destroyed) return
    this.seq += 1
    const message: ChatMessage = {
      id: `${this.tabId}-${this.seq}`,
      tabId: this.tabId,
      memberId: this.member.id,
      name: this.member.name,
      emoji: this.member.emoji,
      color: this.member.color,
      text,
      at: clockLabel(),
    }
    this.seenMessages.add(message.id)
    this.messages = [...this.messages, message]
    this.bump()
    this.post({ t: 'chat', from: this.tabId, message })
  }

  /* ---------------- store plumbing ---------------- */

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => this.snapshot

  private build(): RoomSnapshot {
    const now = Date.now()
    const peers = [...this.peers.values()]
      .map((p) => ({
        tabId: p.tabId,
        memberId: p.memberId,
        name: p.name,
        emoji: p.emoji,
        color: p.color,
        seenAt: p.seenAt,
        editing: now - p.editingAt < EDITING_TTL_MS,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
    const cursors = [...this.cursors.values()]
      .filter((c) => now - c.seenAt < CURSOR_TTL_MS)
      .sort((a, b) => a.name.localeCompare(b.name))
    return {
      status: this.status,
      docText: this.ytext.toString(),
      messages: this.messages,
      peers,
      cursors,
      lastEvent: this.lastEvent,
      revision: this.revision,
    }
  }

  private bump() {
    if (this.destroyed) return
    this.revision += 1
    this.snapshot = this.build()
    for (const listener of this.listeners) listener()
  }

  private after(ms: number, fn: () => void) {
    this.timers.push(setTimeout(fn, ms))
  }

  destroy = () => {
    if (this.destroyed) return
    this.post({ t: 'bye', from: this.tabId })
    this.destroyed = true
    if (this.cursorFrame !== null) cancelAnimationFrame(this.cursorFrame)
    if (this.sweepTimer !== null) clearInterval(this.sweepTimer)
    if (this.teardownTimer !== null) clearTimeout(this.teardownTimer)
    for (const timer of this.timers) clearTimeout(timer)
    this.timers.length = 0
    if (typeof window !== 'undefined') window.removeEventListener('pagehide', this.onPageHide)
    this.channel?.close()
    this.doc.destroy()
    this.listeners.clear()
  }
}

export function createMissionRoom(mission: Mission, member: Member): MissionRoom {
  return new MissionRoomImpl(mission, member)
}
