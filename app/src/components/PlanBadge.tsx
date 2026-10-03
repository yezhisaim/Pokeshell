import { Icon } from './ui'
import { requiredPlanFor } from '../billing/plans'

/** Free for the first FREE_MISSION_LIMIT missions, Pro for everything after. */
export function PlanBadge({ missionId }: { missionId: string }) {
  const plan = requiredPlanFor(missionId)

  return (
    <span className={`chip ${plan.id === 'free' ? 'amber' : 'purple'}`}>
      <Icon name={plan.id === 'free' ? 'capture' : 'lock'} size={12} />
      {plan.name}
    </span>
  )
}