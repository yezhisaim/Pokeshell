import { useCallback, useMemo, useSyncExternalStore } from 'react'

import { FREE_MISSION_LIMIT } from '../data'
import { MISSION_CATALOG, isFreeMission, isMissionUnlocked } from './plans'

/**
 * Entitlement state for the current session.
 *
 * In memory only: no localStorage, no cookies, no server round trip. Product
 * decision for this round, so a reload returns the session to free-only and
 * purchases have to be replayed by the backend when it lands.
 */

export type EntitlementSnapshot = {
  /** Mission ids bought this session. Empty until something is purchased. */
  owned: readonly string[]
  /** Every mission id the session can open right now. */
  unlocked: readonly string[]
}

function buildSnapshot(owned: readonly string[]): EntitlementSnapshot {
  const held = new Set(owned)
  return {
    owned: Object.freeze([...owned]) as readonly string[],
    unlocked: Object.freeze(
      MISSION_CATALOG.filter((m) => isMissionUnlocked(m.id, held)).map((m) => m.id),
    ) as readonly string[],
  }
}

// Demo seed: the free allowance only. Nothing is purchased and nothing is owned.
let snapshot: EntitlementSnapshot = buildSnapshot([])
const listeners = new Set<() => void>()

export const entitlementStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot(): EntitlementSnapshot {
    return snapshot
  },
  /** Records a completed purchase. Idempotent for an id already held. */
  unlock(missionId: string): void {
    if (snapshot.owned.includes(missionId)) return
    snapshot = buildSnapshot([...snapshot.owned, missionId])
    for (const listener of listeners) listener()
  },
}

export type Entitlements = {
  canAccess: (missionId: string) => boolean
  unlockedCount: number
  /** Free-allowance missions still available; 0 once all of them are open. */
  remainingFree: number
  unlock: (missionId: string) => void
}

export function useEntitlements(): Entitlements {
  const state = useSyncExternalStore(
    entitlementStore.subscribe,
    entitlementStore.getSnapshot,
    entitlementStore.getSnapshot,
  )

  const owned = useMemo(() => new Set(state.owned), [state])

  const canAccess = useCallback((missionId: string) => isMissionUnlocked(missionId, owned), [owned])

  const remainingFree = useMemo(() => {
    const freeOpen = state.unlocked.filter(isFreeMission).length
    return Math.max(0, FREE_MISSION_LIMIT - freeOpen)
  }, [state.unlocked])

  const unlock = useCallback((missionId: string) => entitlementStore.unlock(missionId), [])

  return {
    canAccess,
    unlockedCount: state.unlocked.length,
    remainingFree,
    unlock,
  }
}