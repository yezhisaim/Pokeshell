import { PLAN, memberById, type PlanColumn, type PlanTask } from '../data'
import { Av, Icon } from '../components/ui'

const COLUMNS: { id: PlanColumn; label: string }[] = [
  { id: 'todo', label: 'To do' },
  { id: 'doing', label: 'In progress' },
  { id: 'review', label: 'In review' },
  { id: 'done', label: 'Done' },
]

const DEPLOY_CHIP: Record<string, string> = {
  'build:pass': 'green',
  pending: '',
  stale: 'amber',
}

export function PlanView() {
  const byColumn = (c: PlanColumn) => PLAN.filter((t) => t.column === c)

  return (
    <>
      <div className="view-head">
        <div>
          <h1 className="view-title">Plan Board</h1>
          <p className="view-sub">
            Execution connected to plans, tests, and deployment checks. Every step carries the
            verification it needs before it can move to done.
          </p>
        </div>
        <div className="view-actions">
          <span className="chip blue">
            <Icon name="plan" size={12} />
            {PLAN.length} steps
          </span>
        </div>
      </div>

      <div className="board">
        {COLUMNS.map((col) => {
          const tasks = byColumn(col.id)
          return (
            <div className={`col ${col.id}`} key={col.id}>
              <h4>
                {col.label}
                <span className="count">{tasks.length}</span>
              </h4>
              {tasks.length === 0 && <span className="muted" style={{ fontSize: 12 }}>Nothing here yet.</span>}
              {tasks.map((t: PlanTask) => (
                <div className="task" key={t.id}>
                  <span className="ttl">{t.title}</span>
                  <div className="meta">
                    <Av m={memberById(t.owner)} size={18} />
                    <span className="mono">{t.mission}</span>
                  </div>
                  <div className="meta">
                    {t.tests.map((test) => (
                      <span className="chip green" key={test}>
                        <Icon name="check" size={11} />
                        {test}
                      </span>
                    ))}
                  </div>
                  <div className="meta">
                    <span className={`chip ${DEPLOY_CHIP[t.deployCheck] ?? ''}`}>
                      <Icon name="rocket" size={11} />
                      {t.deployCheck}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}