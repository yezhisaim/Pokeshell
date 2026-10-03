import { useState } from 'react'

import { SESSION_CODE } from '../data'

export function JoinModal({
  onJoin,
  onClose,
}: {
  onJoin: (name: string) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Enter the name your teammates will see.')
      return
    }
    if (code.trim().toUpperCase() !== SESSION_CODE) {
      setError('That code does not match this session.')
      return
    }
    onJoin(trimmedName)
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Join this session">
      <div className="onboard-card" style={{ textAlign: 'left' }}>
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>Join main-session</h1>
        <p style={{ margin: '0 0 18px' }}>
          Enter your name and the session code to join the team. You will share the same
          repository context, plan, and running app as everyone else here.
        </p>

        <label
          htmlFor="join-name"
          style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}
        >
          Your name
        </label>
        <input
          id="join-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          placeholder="e.g. Sam"
          autoFocus
          style={{
            width: '100%',
            padding: '9px 12px',
            marginBottom: 14,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg-elev-2)',
            color: 'var(--text)',
            font: 'inherit',
          }}
        />

        <label
          htmlFor="join-code"
          style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}
        >
          Session code
        </label>
        <input
          id="join-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
          placeholder="XXXX-00"
          style={{
            width: '100%',
            padding: '9px 12px',
            marginBottom: 10,
            borderRadius: 8,
            border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
            background: 'var(--bg-elev-2)',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
          }}
        />

        {error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--red)',
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            <span className="chip red">error</span>
            {error}
          </div>
        )}

        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={submit}>
            Join session
          </button>
        </div>
      </div>
    </div>
  )
}