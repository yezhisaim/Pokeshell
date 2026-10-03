import { memberById, type EvidenceState, type PullRequest } from '../data'
import { Icon } from '../components/ui'

function EvidenceChip({ kind, state }: { kind: 'tests' | 'deploy'; state: EvidenceState }) {
  const label =
    kind === 'tests'
      ? state === 'current'
        ? 'tests passing'
        : state === 'stale'
          ? 'tests changed'
          : 'tests unavailable'
      : state === 'current'
        ? 'deploy build:pass'
        : state === 'stale'
          ? 'deploy changed'
          : 'deploy unavailable'

  const cls = state === 'current' ? 'green' : state === 'stale' ? 'amber' : 'red'

  return (
    <span className={`chip ${cls}`}>
      {state === 'current' ? <Icon name="check" size={11} /> : <Icon name="alert" size={11} />}
      {label}
    </span>
  )
}

export function ReviewView({ prs, onApprove }: { prs: PullRequest[]; onApprove: (id: string) => void }) {
  return (
    <>
      <div className="view-head">
        <div>
          <h1 className="view-title">Review</h1>
          <p className="view-sub">
            Each approval is bound to the diff, test, and deploy state that was actually reviewed.
            When that evidence moves, the approval is marked as needing re-review.
          </p>
        </div>
        <div className="view-actions">
          <span className="chip purple">
            <Icon name="review" size={12} />
            {prs.filter((p) => p.approval?.stale).length} need re-review
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="matrix">
          <thead>
            <tr>
              <th>Change</th>
              <th>Evidence</th>
              <th>Plan</th>
              <th>Approval</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {prs.map((pr) => {
              const author = memberById(pr.author)
              const needsReReview = pr.approval?.stale ?? false
              return (
                <tr key={pr.id}>
                  <td>
                    <div className="pr">{pr.id}</div>
                    <div style={{ fontWeight: 600, marginTop: 2 }}>{pr.title}</div>
                    <div className="muted mono" style={{ fontSize: 11.5, marginTop: 2 }}>
                      {pr.branch} · {pr.diff}
                    </div>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      by {author.name} · {pr.mission}
                    </div>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 6 }}>
                      <EvidenceChip kind="tests" state={pr.tests} />
                      <EvidenceChip kind="deploy" state={pr.deploy} />
                    </div>
                  </td>
                  <td>
                    <span className="chip">{pr.planSteps} linked steps</span>
                    {pr.risks > 0 && (
                      <div style={{ marginTop: 6 }}>
                        <span className="chip red">{pr.risks} unresolved risks</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {pr.approval ? (
                      <>
                        <span className={`chip ${needsReReview ? 'amber' : 'green'}`}>
                          {needsReReview ? 'needs re-review' : 'approved'}
                        </span>
                        <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>
                          {memberById(pr.approval.by).name} · {pr.approval.at}
                        </div>
                        <div className="muted mono" style={{ fontSize: 11 }}>
                          {pr.approval.evidence}
                        </div>
                      </>
                    ) : (
                      <span className="chip">not approved</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`btn sm ${pr.approval && !needsReReview ? '' : 'primary'}`}
                      disabled={Boolean(pr.approval && !needsReReview)}
                      onClick={() => onApprove(pr.id)}
                    >
                      {needsReReview ? 'Re-approve current' : pr.approval ? 'Approved' : 'Approve'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
