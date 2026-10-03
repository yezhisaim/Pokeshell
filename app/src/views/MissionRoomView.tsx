import { useEffect, useMemo, useRef, useState } from 'react'

import { ME, POKEMON, RARITY_COLOR, type Member, type Mission } from '../data'
import { Av, Icon, PokeArt } from '../components/ui'
import {
  DOC_LINE_HEIGHT,
  parseChatMarkdown,
  type ChatBlock,
  type InlineToken,
} from '../mission/collaboration'
import { useMissionRoom } from '../mission/useMissionRoom'
import '../mission/mission-room.css'

const GUTTER_PAD = 12

function inline(tokens: InlineToken[]) {
  return tokens.map((token, i) => {
    if (token.kind === 'strong') {
      return (
        <strong className="md-strong" key={i}>
          {token.text}
        </strong>
      )
    }
    if (token.kind === 'code') {
      return (
        <code className="md-code" key={i}>
          {token.text}
        </code>
      )
    }
    return <span key={i}>{token.text}</span>
  })
}

function ChatText({ blocks }: { blocks: ChatBlock[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        block.kind === 'ul' ? (
          <ul className="md-ul" key={i}>
            {block.items.map((item, j) => (
              <li className="md-li" key={j}>
                {inline(item)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="md-p" key={i}>
            {inline(block.tokens)}
          </p>
        ),
      )}
    </>
  )
}

export function MissionRoomView({
  mission,
  team,
  onLeave,
}: {
  mission: Mission
  team: Member[]
  onLeave: () => void
}) {
  const me = team.find((m) => m.isMe) ?? ME
  const room = useMissionRoom(mission, me)
  const reward = POKEMON[mission.rewardPokemon]

  const [draft, setDraft] = useState('')
  const logRef = useRef<HTMLDivElement | null>(null)

  const done = mission.steps.filter((s) => s.done).length
  const blocks = useMemo(() => parseChatMarkdown(draft), [draft])

  const viewers = useMemo(() => {
    const byMember = new Map<string, { name: string; emoji: string; color: string; editing: boolean }>()
    for (const peer of room.peers) {
      const existing = byMember.get(peer.memberId)
      byMember.set(peer.memberId, {
        name: peer.name,
        emoji: peer.emoji,
        color: peer.color,
        editing: (existing?.editing ?? false) || peer.editing,
      })
    }
    return [...byMember.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [room.peers])

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [logRef, room.messages.length])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    room.send(text)
    setDraft('')
  }

  const lineCount = useMemo(() => room.docText.split('\n').length, [room.docText])
  const { attach: attachDoc, onInput, onKeyDown, onPaste, onCaret } = room.editor

  return (
    <>
      <div className="view-head">
        <div>
          <h1 className="view-title">{mission.title}</h1>
          <p className="view-sub">{mission.desc}</p>
        </div>
        <div className="view-actions">
          <span className="chip">{mission.difficulty}</span>
          <span className="chip amber">
            <Icon name="capture" size={12} />
            {mission.xp} xp
          </span>
          <span className="chip mono">{mission.branch}</span>
          <span className="chip green">
            {done}/{mission.steps.length} steps
          </span>
          <button className="btn" onClick={onLeave}>
            <Icon name="chevron" size={14} />
            Leave mission
          </button>
        </div>
      </div>

      <div className="mr-shell">
        <aside className="mr-rail">
          <div className="card">
            <div className="mr-reward">
              <div className="pokemon-art md">
                <PokeArt pokemon={reward} size="md" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="card-title" style={{ marginBottom: 4 }}>
                  <span className="icn">
                    <Icon name="capture" size={15} />
                  </span>
                  Reward
                </div>
                <div style={{ fontWeight: 600 }}>{reward.name}</div>
                <span className="chip" style={{ color: RARITY_COLOR[reward.rarity] }}>
                  {reward.rarity}
                </span>
              </div>
            </div>
            <div className="divider" />
            <div className="mr-facts">
              <div className="kv">
                <span>Branch</span>
                <strong className="mono">{mission.branch}</strong>
              </div>
              <div className="kv">
                <span>File</span>
                <strong className="mono">{mission.file}</strong>
              </div>
              <div className="kv">
                <span>Difficulty</span>
                <strong>{mission.difficulty}</strong>
              </div>
              <div className="kv">
                <span>Reward</span>
                <strong>
                  {reward.name} · {mission.xp} xp
                </strong>
              </div>
              <div className="kv">
                <span>Room</span>
                <strong className="mono" title="Tabs sharing this mission">
                  {viewers.length + 1} live
                </strong>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="icn">
                <Icon name="missions" size={15} />
              </span>
              Plan steps
            </div>
            <ul className="mr-steps">
              {mission.steps.map((step) => (
                <li className="checklist" key={step.id}>
                  <span className={`mark ${step.done ? 'ok' : 'no'}`}>
                    {step.done ? <Icon name="check" size={11} /> : '•'}
                  </span>
                  <div>
                    <div className="lbl">{step.label}</div>
                    <div className="sub">{step.done ? 'done' : 'open'}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="icn">
                <Icon name="agent" size={15} />
              </span>
              In this room
            </div>
            <div className="row" style={{ gap: 6 }}>
              <span className="chip green">
                <span className="dot" />
                {room.status}
              </span>
              <span className="chip">tab {room.tabId.slice(-4)}</span>
            </div>
            <div className="divider" />
            <div className="presence">
              <Av m={me} size={28} />
              {viewers.map((v) => (
                <div
                  className="av"
                  key={v.name}
                  style={{
                    width: 28,
                    height: 28,
                    background: v.color,
                    fontSize: 11,
                    boxShadow: v.editing ? `0 0 0 2px ${v.color}` : undefined,
                  }}
                  title={`${v.name}${v.editing ? ' · editing' : ' · viewing'}`}
                >
                  {v.emoji}
                </div>
              ))}
            </div>
            {viewers.length === 0 ? (
              <p className="muted" style={{ fontSize: 11.5, margin: '8px 0 0' }}>
                Open this mission in a second tab to see live merging.
              </p>
            ) : (
              <p className="muted" style={{ fontSize: 11.5, margin: '8px 0 0' }}>
                {viewers.map((v) => v.name).join(', ')} viewing now
              </p>
            )}
          </div>
        </aside>

        <section className="mr-panel" aria-label="Team chat">
          <div className="mr-panel-head">
            <h2>Team chat</h2>
            <span className="spacer" />
            <span className="chip">{room.messages.length} messages</span>
          </div>

          <div className="mr-chat" role="log" aria-label="Mission chat messages" ref={logRef}>
            {room.messages.map((message) => (
              <article className="mr-msg" key={message.id}>
                <div
                  className="av"
                  style={{
                    background: message.color,
                    color: message.memberId === me.id ? '#1a1a1a' : '#fff',
                  }}
                  aria-hidden="true"
                >
                  {message.emoji}
                </div>
                <div className="mr-msg-main">
                  <div className="mr-msg-head">
                    <strong>{message.name}</strong>
                    <span className="at">{message.at}</span>
                  </div>
                  <div className="mr-msg-body">
                    <ChatText blocks={parseChatMarkdown(message.text)} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <form
            className="composer mr-composer"
            onSubmit={(event) => {
              event.preventDefault()
              send()
            }}
          >
            <label className="sr-only" htmlFor="mr-chat-input">
              Message the team about this mission
            </label>
            <textarea
              id="mr-chat-input"
              className="composer-input"
              rows={2}
              value={draft}
              placeholder="Message the team. Supports **bold**, `code`, and - bullets."
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  send()
                }
              }}
            />
            <button
              type="submit"
              className="composer-send"
              disabled={!draft.trim()}
              aria-label="Send message to the team"
            >
              <Icon name="chevron" size={15} />
            </button>
          </form>

          {draft.trim() ? (
            <div className="mr-preview">
              <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>
                preview
              </div>
              <div className="mr-msg-body">
                <ChatText blocks={blocks} />
              </div>
            </div>
          ) : (
            <p className="mr-hint">Enter sends · Shift+Enter adds a line</p>
          )}
        </section>

        <section className="mr-panel mr-doc-panel" aria-label="Shared mission document">
          <div className="mr-panel-head">
            <h2>Mission output</h2>
            <span className="chip mono">
              docs/{mission.file.replace(/^src\//, '').replace(/\.[a-z]+$/, '')}.md
            </span>
            <span className="spacer" />
            {room.cursors.map((cursor) => (
              <span
                className="chip"
                key={cursor.tabId}
                title={`${cursor.name} is editing at line ${cursor.line + 1}, column ${cursor.col + 1}`}
              >
                <span className="dot" style={{ background: cursor.color }} />
                {cursor.name} · L{cursor.line + 1}
              </span>
            ))}
            <button
              className="btn sm"
              onClick={room.clear}
              disabled={!room.docText}
              title="Empty the shared document for everyone in this room"
            >
              <Icon name="alert" size={13} />
              Clear
            </button>
          </div>

          <div className={`mr-live ${room.status}`} role="status" aria-live="polite">
            <span className="pulse" aria-hidden="true" />
            <span>{room.lastEvent}</span>
          </div>

          <div className="mr-doc">
            <div className="mr-gutter" aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <div className="mr-ln" key={i}>
                  {i + 1}
                </div>
              ))}
              {room.cursors.map((cursor) => (
                <div
                  className="mr-remote"
                  key={cursor.tabId}
                  style={{
                    top: GUTTER_PAD + cursor.line * DOC_LINE_HEIGHT,
                    background: `color-mix(in srgb, ${cursor.color} 16%, transparent)`,
                  }}
                >
                  <span
                    className="flag"
                    style={{ background: cursor.color }}
                    title={`${cursor.name} · line ${cursor.line + 1} · column ${cursor.col + 1}`}
                  >
                    {cursor.name.slice(0, 4)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mr-surface">
              <div
                id="mr-doc-input"
                className="mr-input"
                role="textbox"
                aria-multiline="true"
                aria-label={`Shared mission output for ${mission.title}`}
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                ref={attachDoc}
                onInput={onInput}
                onKeyDown={onKeyDown}
                onPaste={onPaste}
                onSelect={onCaret}
                onClick={onCaret}
                onKeyUp={onCaret}
                onBlur={onCaret}
              />
            </div>
          </div>

          <div className="mr-doc-foot">
            <div className="presence">
              <Av m={me} size={24} />
              {viewers.map((v) => (
                <div
                  className="av"
                  key={v.name}
                  style={{ width: 24, height: 24, background: v.color, fontSize: 10 }}
                  title={`${v.name}${v.editing ? ' · editing' : ' · viewing'}`}
                >
                  {v.emoji}
                </div>
              ))}
            </div>
            <span className="muted" style={{ fontSize: 11.5 }}>
              {viewers.length + 1} in room · {room.docText.length} characters
            </span>
            <span className="spacer" style={{ flex: 1 }} />
            <span className="chip" title="Shared state lives in memory only">
              <Icon name="alert" size={12} />
              not saved · dies with the tab
            </span>
          </div>
        </section>
      </div>
    </>
  )
}
