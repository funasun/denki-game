import { useState } from 'react'
import type { ComposeActivity as ComposeActivityDef, EvidenceDef } from '../types'

interface ComposeActivityProps {
  activity: ComposeActivityDef
  onCollect: (e: EvidenceDef) => void
  onDone: () => void
}

// その時代の行為(compose): 断片から手紙(遺書)を組み上げる。決意に「残す」言葉を選び、
// 絶望の書き損じを外していく。残す言葉が決意と一致したとき、手紙が綴り上がる。
export function ComposeActivity({ activity, onCollect, onDone }: ComposeActivityProps) {
  const [chosen, setChosen] = useState<Record<string, true>>({})
  const [phase, setPhase] = useState<'edit' | 'assembled'>('edit')

  const toggle = (id: string) => {
    setChosen((s) => {
      const next = { ...s }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }

  const included = activity.fragments.filter((f) => chosen[f.id])
  const matches =
    included.length > 0 &&
    activity.fragments.every((f) => (f.belongs ? !!chosen[f.id] : !chosen[f.id]))

  const finish = () => {
    if (activity.evidence) onCollect(activity.evidence)
    setPhase('assembled')
  }

  if (phase === 'assembled') {
    return (
      <div className="choice-layer activity-layer">
        <div className="activity-panel compose-assembled">
          {activity.assembledIntro && <p className="activity-prompt">{activity.assembledIntro}</p>}
          <div className="compose-letter">
            {activity.assembled.map((l, i) => (
              <p key={i} className="compose-letter-line">
                {l}
              </p>
            ))}
          </div>
          <button className="card-button" onClick={onDone}>
            封をする
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="choice-layer activity-layer">
      <div className="activity-panel compose-activity">
        <p className="activity-prompt">{activity.prompt}</p>

        <div className="compose-fragments">
          {activity.fragments.map((f) => (
            <button
              key={f.id}
              className={`compose-fragment${chosen[f.id] ? ' chosen' : ''}${
                chosen[f.id] && !f.belongs ? ' doubt' : ''
              }`}
              onClick={() => toggle(f.id)}
            >
              <span className="compose-fragment-text">{f.text}</span>
              {chosen[f.id] && f.aside && <span className="compose-fragment-aside">{f.aside}</span>}
            </button>
          ))}
        </div>

        <div className="compose-preview">
          <span className="compose-preview-label">綴られていく手紙</span>
          {included.length > 0 ? (
            included.map((f) => (
              <p key={f.id} className="compose-preview-line">
                {f.text}
              </p>
            ))
          ) : (
            <p className="compose-preview-empty">残す言葉を、選んでいく。</p>
          )}
        </div>

        <button className="card-button" onClick={finish} disabled={!matches}>
          {matches ? '書き終える' : '……まだ迷いがある'}
        </button>
      </div>
    </div>
  )
}
