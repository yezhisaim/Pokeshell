import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ClipboardEvent as ReactClipboardEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'

import type { Member, Mission } from '../data'
import {
  createMissionRoom,
  diffText,
  type MissionRoom,
  type RoomSnapshot,
} from './collaboration'

/**
 * Editor choice: contentEditable bound directly to a Y.Text.
 *
 * A controlled <textarea> hands back the whole new string on every keystroke,
 * so mapping it onto the CRDT means either rewriting the entire document (which
 * discards whatever a second tab just typed) or diffing by hand. contentEditable
 * leaves the browser owning the DOM and the caret, so one keystroke is one DOM
 * mutation that becomes one minimal Y.Text insert or delete. Yjs merges those
 * operations by position, so two tabs editing different lines both keep their
 * characters.
 */

export type MissionEditor = {
  attach: (el: HTMLDivElement | null) => void
  onInput: () => void
  onKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void
  onPaste: (event: ReactClipboardEvent<HTMLDivElement>) => void
  onCaret: () => void
}

export type MissionRoomApi = {
  me: Member
  tabId: string
  status: RoomSnapshot['status']
  docText: string
  messages: RoomSnapshot['messages']
  peers: RoomSnapshot['peers']
  cursors: RoomSnapshot['cursors']
  lastEvent: string
  revision: number
  editor: MissionEditor
  send: (raw: string) => void
  clear: () => void
}

/** Caret offset, in characters, of one edge of the selection inside `el`. */
function caretIndex(el: HTMLElement, edge: 'start' | 'end' = 'end'): number {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return 0
  const range = selection.getRangeAt(0)
  const probe = range.cloneRange()
  probe.selectNodeContents(el)
  const container = edge === 'start' ? range.startContainer : range.endContainer
  const offset = edge === 'start' ? range.startOffset : range.endOffset
  probe.setEnd(container, offset)
  return probe.toString().length
}

function placeCaret(el: HTMLElement, index: number) {
  const node = el.firstChild
  if (!node) return
  const range = document.createRange()
  range.setStart(node, Math.min(index, node.textContent?.length ?? 0))
  range.collapse(true)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

/** One room per mission per tab; keyed so a StrictMode double render reuses it. */
const TAB_ID = Math.random().toString(36).slice(2, 8)
const registry = new Map<string, MissionRoom>()

const roomKey = (missionId: string, memberId: string) => `${missionId}|${memberId}|${TAB_ID}`

function acquire(mission: Mission, member: Member): MissionRoom {
  const key = roomKey(mission.id, member.id)
  const held = registry.get(key)
  if (held && !held.isDestroyed()) return held
  const created = createMissionRoom(mission, member)
  registry.set(key, created)
  return created
}

export function useMissionRoom(mission: Mission, me: Member): MissionRoomApi {
  const [state, setState] = useState(() => ({ key: mission.id, room: acquire(mission, me) }))
  const docRef = useRef<HTMLDivElement | null>(null)

  // Derived during render: a mission swap, or a StrictMode remount that tore
  // the room down, both need a live room before anything else reads it.
  if (state.key !== mission.id || state.room.isDestroyed()) {
    setState({ key: mission.id, room: acquire(mission, me) })
  }
  const room = state.room

  useEffect(() => {
    room.retain()
    return () => room.release()
  }, [room])

  const snapshot = useSyncExternalStore(room.subscribe, room.getSnapshot, room.getSnapshot)

  const syncDom = useCallback(
    (text: string) => {
      const el = docRef.current
      if (!el) return
      const current = el.textContent ?? ''
      if (current === text) return
      const focused = document.activeElement === el
      const caret = focused ? caretIndex(el) : null
      const diff = diffText(current, text)
      el.textContent = text
      if (caret === null || !diff) return
      const moved =
        caret <= diff.at
          ? caret
          : caret >= diff.at + diff.deleteCount
            ? caret + diff.insert.length - diff.deleteCount
            : diff.at + diff.insert.length
      placeCaret(el, moved)
    },
    [],
  )

  useEffect(() => syncDom(snapshot.docText), [snapshot.docText, syncDom])

  const replaceSelection = useCallback(
    (insert: string) => {
      const el = docRef.current
      if (!el) return
      const start = caretIndex(el, 'start')
      const end = caretIndex(el, 'end')
      const text = room.getSnapshot().docText
      room.replaceWith(text.slice(0, start) + insert + text.slice(end))
    },
    [room],
  )

  const reportCaret = useCallback(() => {
    const el = docRef.current
    if (!el) return
    room.reportCursor(caretIndex(el))
  }, [room])

  const editor: MissionEditor = useMemo(
    () => ({
      attach: (el) => {
        docRef.current = el
        if (el) syncDom(room.getSnapshot().docText)
      },
      onInput: () => {
        const el = docRef.current
        if (!el) return
        room.replaceWith(el.textContent ?? '')
        reportCaret()
      },
      onKeyDown: (event) => {
        if (event.key !== 'Enter' || event.nativeEvent.isComposing) return
        event.preventDefault()
        replaceSelection('\n')
        reportCaret()
      },
      onPaste: (event) => {
        event.preventDefault()
        replaceSelection(event.clipboardData.getData('text/plain'))
        reportCaret()
      },
      onCaret: reportCaret,
    }),
    [replaceSelection, reportCaret, room, syncDom],
  )

  return {
    me,
    tabId: room.tabId,
    status: snapshot.status,
    docText: snapshot.docText,
    messages: snapshot.messages,
    peers: snapshot.peers,
    cursors: snapshot.cursors,
    lastEvent: snapshot.lastEvent,
    revision: snapshot.revision,
    editor,
    send: room.send,
    clear: room.clear,
  }
}
