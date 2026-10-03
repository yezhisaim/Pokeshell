/**
 * Pokeshell session relay — multiplayer for people on the same WiFi, with no database.
 *
 * Holds each session in memory, keyed by the join code, and fans every change out
 * to everyone in that room. The server is authoritative for anything that ends up
 * on a scoreboard, so two people cannot disagree about who captured what.
 *
 * No persistence by design: restarting this process resets every session. That is
 * the right trade for a demo and keeps the deploy story to "node server/relay.mjs".
 *
 *   node server/relay.mjs            # listens on 0.0.0.0:8787
 *   PORT=9000 node server/relay.mjs
 */
import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { WebSocketServer } from 'ws'
import * as Y from 'yjs'

import { MISSIONS, PREMIUM_MISSIONS } from '../src/data.ts'

const PORT = Number(process.env.PORT ?? 8787)
const HOST = process.env.HOST ?? '0.0.0.0'

/** code -> room */
const rooms = new Map()

const CATALOG = [...MISSIONS, ...PREMIUM_MISSIONS]

function freshState() {
  return {
    missions: CATALOG.map((m) => ({ ...m, steps: m.steps.map((s) => ({ ...s })) })),
    captures: [],
    activity: [
      {
        id: randomUUID(),
        who: 'session',
        text: 'session opened — waiting for teammates',
        when: 'just now',
      },
    ],
  }
}

function getRoom(code) {
  let room = rooms.get(code)
  if (room) return room
  room = {
    code,
    players: new Map(),
    state: freshState(),
    docs: new Map(), // missionId -> Y.Doc
    chat: new Map(), // missionId -> [{id, who, text, when}]
  }
  rooms.set(code, room)
  return room
}

/** Y.Doc per mission, so a late joiner can be handed full state. */
function getDoc(room, missionId) {
  let doc = room.docs.get(missionId)
  if (!doc) {
    doc = new Y.Doc()
    room.docs.set(missionId, doc)
  }
  return doc
}

function send(ws, payload) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload))
}

function broadcast(room, payload, except) {
  const frame = JSON.stringify(payload)
  for (const client of room.players.values()) {
    if (client === except) continue
    if (client.ws.readyState === client.ws.OPEN) client.ws.send(frame)
  }
}

function rosterPayload(room) {
  return [...room.players.values()].map((p) => ({
    id: p.id,
    name: p.name,
    color: p.color,
  }))
}

function scoresOf(room) {
  const scores = new Map()
  for (const c of room.state.captures) {
    const prev = scores.get(c.playerId)
    scores.set(c.playerId, {
      captures: (prev?.captures ?? 0) + 1,
      missions: prev?.missions ?? 0,
      xp: (prev?.xp ?? 0) + (c.xp ?? 0),
    })
  }
  for (const p of room.players.values()) {
    if (!scores.has(p.id)) scores.set(p.id, { captures: 0, missions: 0, xp: 0 })
  }
  return Object.fromEntries(scores)
}

const http = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(
      JSON.stringify({
        ok: true,
        rooms: rooms.size,
        players: [...rooms.values()].reduce((n, r) => n + r.players.size, 0),
      }),
    )
    return
  }
  res.writeHead(404, { 'content-type': 'text/plain' })
  res.end('pokeshell relay')
})

const wss = new WebSocketServer({ server: http })

wss.on('connection', (ws) => {
  /** @type {{room:any, player:any}|null} */
  let session = null

  ws.on('message', (raw) => {
    let msg
    try {
      msg = JSON.parse(typeof raw === 'string' ? raw : raw.toString())
    } catch {
      return
    }

    /* ---------------------------------------------------------- join */
    if (msg.type === 'join') {
      const code = String(msg.code ?? '').trim()
      const name = String(msg.name ?? '').trim()
      if (!code || !name) {
        send(ws, { type: 'error', reason: 'join requires a code and a name' })
        return
      }
      const room = getRoom(code)
      const player = {
        id: randomUUID(),
        name,
        color: msg.color ?? '#ffb020',
        ws,
      }
      room.players.set(player.id, player)
      session = { room, player }

      room.state.activity.unshift({
        id: randomUUID(),
        who: player.id,
        text: 'joined the session',
        when: 'just now',
      })

      send(ws, {
        type: 'welcome',
        playerId: player.id,
        code: room.code,
        roster: rosterPayload(room),
        state: room.state,
        scores: scoresOf(room),
        chat: Object.fromEntries(room.chat),
      })
      broadcast(room, { type: 'roster', roster: rosterPayload(room) })
      broadcast(room, {
        type: 'activity',
        entry: room.state.activity[0],
      })
      return
    }

    if (!session) {
      send(ws, { type: 'error', reason: 'join a session before sending anything else' })
      return
    }
    const { room, player } = session

    switch (msg.type) {
      /* ------------------------------------------------- shared doc (Yjs) */
      case 'doc:update': {
        const doc = getDoc(room, msg.missionId)
        Y.applyUpdate(doc, new Uint8Array(msg.update))
        // Relay the raw update; the server keeps its own merged copy for late joiners.
        broadcast(
          room,
          { type: 'doc:update', missionId: msg.missionId, update: msg.update, from: player.id },
          player.ws,
        )
        return
      }
      case 'doc:sync': {
        const doc = getDoc(room, msg.missionId)
        send(ws, {
          type: 'doc:sync',
          missionId: msg.missionId,
          update: Buffer.from(Y.encodeStateAsUpdate(doc)).toString('base64'),
        })
        return
      }

      /* ------------------------------------------------------ team chat */
      case 'chat': {
        const text = String(msg.text ?? '').trim()
        if (!text) return
        const entry = {
          id: randomUUID(),
          who: player.id,
          name: player.name,
          text,
          when: new Date().toISOString(),
        }
        const list = room.chat.get(msg.missionId) ?? []
        list.push(entry)
        room.chat.set(msg.missionId, list.slice(-200))
        broadcast(room, { type: 'chat', missionId: msg.missionId, entry })
        return
      }

      /* ------------------------------------------ authoritative mutations */
      case 'mission:select': {
        room.state.missions = room.state.missions.map((m) => ({
          ...m,
          status:
            m.id === msg.missionId
              ? 'active'
              : m.status === 'active'
                ? 'available'
                : m.status,
        }))
        room.state.activity.unshift({
          id: randomUUID(),
          who: player.id,
          text: `started **${room.state.missions.find((m) => m.id === msg.missionId)?.title ?? 'a mission'}**`,
          when: 'just now',
        })
        broadcast(room, { type: 'state', state: room.state, scores: scoresOf(room) })
        return
      }

      case 'mission:complete': {
        const mission = room.state.missions.find((m) => m.id === msg.missionId)
        if (!mission) return
        room.state.missions = room.state.missions.map((m) =>
          m.id === msg.missionId
            ? { ...m, status: 'completed', steps: m.steps.map((s) => ({ ...s, done: true })) }
            : m,
        )
        const capture = {
          id: randomUUID(),
          playerId: player.id,
          pokemon: msg.pokemon ?? mission.rewardPokemon,
          mission: mission.title,
          xp: mission.xp,
          at: Date.now(),
        }
        room.state.captures.push(capture)
        room.state.activity.unshift({
          id: randomUUID(),
          who: player.id,
          text: `shipped **${mission.title}** and captured it`,
          when: 'just now',
        })
        broadcast(room, {
          type: 'captured',
          capture,
          state: room.state,
          scores: scoresOf(room),
          activity: room.state.activity[0],
        })
        return
      }

      case 'activity': {
        const text = String(msg.text ?? '').trim()
        if (!text) return
        const entry = { id: randomUUID(), who: player.id, text, when: 'just now' }
        room.state.activity.unshift(entry)
        room.state.activity = room.state.activity.slice(0, 60)
        broadcast(room, { type: 'activity', entry })
        return
      }

      case 'ping':
        send(ws, { type: 'pong' })
        return

      default:
        return
    }
  })

  ws.on('close', () => {
    if (!session) return
    const { room, player } = session
    room.players.delete(player.id)
    if (room.players.size === 0) {
      // Nothing left in the room; drop it so memory does not creep.
      rooms.delete(room.code)
      return
    }
    broadcast(room, { type: 'roster', roster: rosterPayload(room), left: player.id })
  })
})

http.listen(PORT, HOST, () => {
  console.log(`pokeshell relay on ws://${HOST}:${PORT}  (in-memory, no database)`)
})