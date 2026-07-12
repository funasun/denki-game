import { useEffect, useState } from 'react'
import type { EvidenceDef, PianoActivity as PianoActivityDef } from '../types'
import { audio } from '../audio/AudioEngine'
import { DialogueBox } from './DialogueBox'

interface PianoActivityProps {
  activity: PianoActivityDef
  onCollect: (e: EvidenceDef) => void
  onDone: () => void
}

// その時代の行為(piano): 呼びかけの旋律をなぞる。音は聴力チェーンを通るので、
// 耳が閉ざされているほど、なぞるべき音が壁の向こうのようにこもって聞こえる。
export function PianoActivity({ activity, onCollect, onDone }: PianoActivityProps) {
  const [attempt, setAttempt] = useState<string[]>([])
  const [phase, setPhase] = useState<'play' | 'reflect'>('play')

  const playModel = () => {
    activity.phrase.forEach((n, i) => {
      window.setTimeout(() => audio.playNote(n, 1.2, 0.9), i * 620)
    })
  }

  // 入場して少ししたら、なぞるべき旋律を一度だけ鳴らす
  useEffect(() => {
    const t = window.setTimeout(playModel, 500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pressKey = (n: string) => {
    if (attempt.length >= activity.phrase.length) return
    audio.playNote(n, 1.4, 0.95)
    setAttempt((a) => [...a, n])
  }

  const filled = attempt.length >= activity.phrase.length

  const finish = () => {
    if (activity.evidence) onCollect(activity.evidence)
    if (activity.reflection && activity.reflection.length > 0) setPhase('reflect')
    else onDone()
  }

  if (phase === 'reflect') {
    return <DialogueBox lines={activity.reflection} onDone={onDone} />
  }

  return (
    <div className="choice-layer activity-layer">
      <div className="activity-panel piano-activity">
        <p className="activity-prompt">{activity.prompt}</p>

        <div className="piano-slots">
          {activity.phrase.map((n, i) => {
            const played = attempt[i]
            const cls = played ? (played === n ? ' hit' : ' miss') : ''
            return <span key={i} className={`piano-slot${cls}`} />
          })}
        </div>

        <div className="piano-keys">
          {activity.keys.map((n) => (
            <button
              key={n}
              className={`piano-key ${n.includes('#') || n.includes('b') ? 'black' : 'white'}`}
              onClick={() => pressKey(n)}
            >
              <span className="piano-key-label">{n}</span>
            </button>
          ))}
        </div>

        <div className="activity-actions">
          <button className="activity-secondary" onClick={playModel}>
            手本をもう一度聴く
          </button>
          {attempt.length > 0 && (
            <button className="activity-secondary" onClick={() => setAttempt([])}>
              やり直す
            </button>
          )}
          <button className="card-button" onClick={finish} disabled={!filled}>
            {filled ? '鍵盤から指を離す' : 'なぞってみる……'}
          </button>
        </div>
      </div>
    </div>
  )
}
