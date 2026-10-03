import type { IncomingMessage, ServerResponse } from 'node:http'

import type { Plugin } from 'vite'

/**
 * In-memory multiplayer relay, mounted on the Vite dev/preview server so one
 * `npm run dev` serves the app and the relay on the same port (and therefore
 * across machines on the same network, since the server listens on all hosts).
 *
 * It is a dumb broadcast hub: clients push opaque JSON envelopes with POST
 * /relay/send?room=<id> and every client subscribed to that room over
 * GET /relay/events?room=<id> (Server-Sent Events) receives them. No state is
 * kept, so a restart just means clients reconnect and re-sync from each other.
 */

const MAX_BODY = 2_000_000
const HEARTBEAT_MS = 15_000

type Middlewares = {
  use: (path: string, handler: (req: IncomingMessage, res: ServerResponse) => void) => void
}

function mount(middlewares: Middlewares) {
  const rooms = new Map<string, Set<ServerResponse>>()

  const roomOf = (req: IncomingMessage) =>
    new URL(req.url ?? '', 'http://relay').searchParams.get('room')?.slice(0, 200) ?? ''

  middlewares.use('/relay/events', (req, res) => {
    const room = roomOf(req)
    if (!room) {
      res.statusCode = 400
      res.end('room required')
      return
    }
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    })
    res.write(': connected\n\n')
    let members = rooms.get(room)
    if (!members) rooms.set(room, (members = new Set()))
    members.add(res)
    const beat = setInterval(() => res.write(': ping\n\n'), HEARTBEAT_MS)
    req.on('close', () => {
      clearInterval(beat)
      members.delete(res)
      if (members.size === 0) rooms.delete(room)
    })
  })

  middlewares.use('/relay/send', (req, res) => {
    const room = roomOf(req)
    if (req.method !== 'POST' || !room) {
      res.statusCode = 400
      res.end()
      return
    }
    let body = ''
    let tooBig = false
    req.setEncoding('utf8')
    req.on('data', (chunk: string) => {
      body += chunk
      if (body.length > MAX_BODY) {
        tooBig = true
        req.destroy()
      }
    })
    req.on('end', () => {
      if (tooBig) return
      const frame = `data: ${body.replace(/\n/g, '')}\n\n`
      for (const peer of rooms.get(room) ?? []) peer.write(frame)
      res.statusCode = 204
      res.end()
    })
  })
}

export function relayPlugin(): Plugin {
  return {
    name: 'pokeshell-relay',
    configureServer: (server) => mount(server.middlewares),
    configurePreviewServer: (server) => mount(server.middlewares),
  }
}
