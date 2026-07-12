import { useState } from 'react'
import type { EvidenceDef, ExamineDef } from '../types'

interface ExamineOverlayProps {
  examine: ExamineDef
  onCollect: (e: EvidenceDef) => void
  onDone: () => void
}

// 調べ込み(観察): モノの細部(Hotspot)を一つずつ「見る」。見えている細部を調べ尽くすと
// 「もう一度よく見る」で隠れた奥の細部が現れる。すべて見終えると調べ終えられる。
export function ExamineOverlay({ examine, onCollect, onDone }: ExamineOverlayProps) {
  const [inspected, setInspected] = useState<Record<string, true>>({})
  const [revealed, setRevealed] = useState(false)

  const shown = examine.hotspots.filter((h) => !h.hidden || revealed)
  const hasHidden = examine.hotspots.some((h) => h.hidden)
  // 見えている細部(hidden でない)を調べ尽くせば、調べ終えられる。
  // 隠れた細部は、丁寧に探した者だけが見つける「ごほうび」── 見落としても先へ進める。
  const canFinish = examine.hotspots.filter((h) => !h.hidden).every((h) => inspected[h.id])
  const log = examine.hotspots.filter((h) => inspected[h.id])

  const inspect = (id: string) => {
    const h = examine.hotspots.find((x) => x.id === id)
    if (!h || inspected[id]) return
    setInspected((s) => ({ ...s, [id]: true }))
    if (h.evidence) onCollect(h.evidence)
  }

  return (
    <div className="choice-layer examine-layer">
      <div className="examine-panel">
        <div className="examine-head">
          <h2 className="examine-title">{examine.title}</h2>
          {examine.intro && <p className="examine-intro">{examine.intro}</p>}
        </div>

        <div className="examine-hotspots">
          {shown.map((h) => (
            <button
              key={h.id}
              className={`examine-hotspot${inspected[h.id] ? ' done' : ''}${h.hidden ? ' hidden-spot' : ''}`}
              onClick={() => inspect(h.id)}
              disabled={!!inspected[h.id]}
            >
              {inspected[h.id] ? '✓ ' : ''}
              {h.label}
            </button>
          ))}
        </div>

        {hasHidden && canFinish && !revealed && (
          <button className="examine-relook" onClick={() => setRevealed(true)}>
            ……もう一度、目を凝らして見てみる
          </button>
        )}

        {log.length > 0 && (
          <div className="examine-log">
            {log.map((h) => (
              <div key={h.id} className="examine-note">
                <span className="examine-note-label">{h.label}</span>
                <p className="examine-note-text">{h.observation}</p>
                {h.evidence && (
                  <span className="examine-clue">手がかりを書きとめた ── {h.evidence.title}</span>
                )}
              </div>
            ))}
          </div>
        )}

        <button className="card-button examine-done" onClick={onDone} disabled={!canFinish}>
          {canFinish ? (examine.doneLabel ?? '調べ終える') : 'まだ見ていない細部がある……'}
        </button>
      </div>
    </div>
  )
}
