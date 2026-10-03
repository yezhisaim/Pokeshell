import { FREE_MISSION_LIMIT, MISSIONS, PREMIUM_MISSIONS, type Mission } from '../data'

export type PlanId = 'free' | 'pro'

export type Plan = {
  id: PlanId
  name: string
  /**
   * Price in minor units per month. `null` means Chargebee owns the number:
   * this app never decides a paid price, so nothing here can drift from the
   * live invoice.
   */
  priceMonthly: number | null
  /** Missions the tier unlocks. `null` means every mission in the catalog. */
  missionLimit: number | null
  blurb: string
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    missionLimit: FREE_MISSION_LIMIT,
    blurb: `The first ${FREE_MISSION_LIMIT} missions. No card, no checkout.`,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: null,
    missionLimit: null,
    blurb: 'Every mission past the free allowance, billed by Chargebee at checkout.',
  },
}

const PLAN_ORDER: PlanId[] = ['free', 'pro']

export const PLAN_LIST: Plan[] = PLAN_ORDER.map((id) => PLANS[id])

/** Ordering the paywall and the grid both assume. */
export const MISSION_CATALOG: readonly Mission[] = [...MISSIONS, ...PREMIUM_MISSIONS]

/**
 * The free allowance is positional: the first FREE_MISSION_LIMIT missions in
 * the catalog. Never widen it by hand — raise the limit in data.ts.
 */
export const FREE_MISSION_IDS: ReadonlySet<string> = new Set(
  MISSION_CATALOG.slice(0, FREE_MISSION_LIMIT).map((m) => m.id),
)

export function missionById(missionId: string): Mission | undefined {
  return MISSION_CATALOG.find((m) => m.id === missionId)
}

export function isFreeMission(missionId: string): boolean {
  return FREE_MISSION_IDS.has(missionId)
}

export function requiredPlanFor(missionId: string): Plan {
  return isFreeMission(missionId) ? PLANS.free : PLANS.pro
}

/** True when the mission is free-tier or already bought. Unknown ids stay locked. */
export function isMissionUnlocked(missionId: string, owned: ReadonlySet<string>): boolean {
  if (owned.has(missionId)) return true
  return isFreeMission(missionId)
}

export function unlockedCountFor(owned: ReadonlySet<string>): number {
  return MISSION_CATALOG.filter((m) => isMissionUnlocked(m.id, owned)).length
}

export function priceLabel(plan: Plan): string {
  if (plan.priceMonthly === 0) return 'Free'
  if (plan.priceMonthly === null) return 'from Chargebee at checkout'
  return `${(plan.priceMonthly / 100).toFixed(0)} USD / month`
}