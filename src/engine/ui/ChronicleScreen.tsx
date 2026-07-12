import { useEffect, useRef, useState } from 'react'
import type { PersonData, WorkDef } from '../types'
import { audio } from '../audio/AudioEngine'
import { useGameStore } from '../store'

type Tab = 'chronicle' | 'works' | 'figures'

// 生涯の記録: 年譜・作品・人物録。作品は「そのまま聴く」と
// 「彼の耳で聴く」(作曲当時の運命パラメータを通す)を選べる
export function ChronicleScreen({ person, onClose }: { person: PersonData; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('chronicle')
  const [playing, setPlaying] = useState<string | null>(null)
  const timer = useRef(0)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo(0, 0)
  }, [tab])

  useEffect(
    () => () => {
      clearTimeout(timer.current)
      if (audio.started) audio.setHearing(useGameStore.getState().fate, 0.5)
    },
    [],
  )

  // 音楽家以外(works 未定義)では「作品」タブを出さない
  const hasWorks = !!person.works?.length
  const tabDefs: [Tab, string][] = [
    ['chronicle', '年譜'],
    ...(hasWorks ? ([['works', '作品']] as [Tab, string][]) : []),
    ['figures', '人物録'],
  ]

  const play = (w: WorkDef, asHim: boolean) => {
    if (playing) return
    audio.ensureStarted()
    audio.setHearing(asHim ? w.hearingAt : 1, 0.2)
    const dur = audio.playOneShot(w.soundId)
    setPlaying(`${w.id}:${asHim ? 'him' : 'full'}`)
    timer.current = window.setTimeout(
      () => {
        setPlaying(null)
        audio.setHearing(useGameStore.getState().fate, 1.2)
      },
      (dur + 0.8) * 1000,
    )
  }

  return (
    <div className="fullscreen-card archive">
      <h1 className="card-title archive-title">生涯の記録</h1>
      <p className="card-subtitle">
        {person.name}({person.born} – {person.died})
      </p>

      <div className="archive-tabs">
        {tabDefs.map(([t, label]) => (
          <button
            key={t}
            className={`archive-tab${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="archive-body" ref={bodyRef}>
        {tab === 'chronicle' &&
          person.chronicle.map((e) => (
            <div key={e.year + e.text} className="chronicle-row">
              <span className="chronicle-year">
                {e.year}
                <span className="chronicle-age">
                  {e.year === person.born ? '誕生' : `${e.year - person.born}歳`}
                </span>
              </span>
              <p className="chronicle-text">{e.text}</p>
            </div>
          ))}

        {tab === 'works' && (
          <>
            <p className="archive-note">
              「彼の耳で」は、作曲された年の聴力でこの断片を聴きます。
            </p>
            {person.works?.map((w) => (
              <div key={w.id} className="work-row">
                <div className="work-head">
                  <span className="work-title">{w.title}</span>
                  <span className="work-year">{w.year}</span>
                </div>
                <p className="work-note">{w.note}</p>
                <div className="work-actions">
                  <button
                    className="work-button"
                    disabled={!!playing}
                    onClick={() => play(w, false)}
                  >
                    {playing === `${w.id}:full` ? '…' : '聴く'}
                  </button>
                  <button
                    className="work-button him"
                    disabled={!!playing}
                    onClick={() => play(w, true)}
                  >
                    {playing === `${w.id}:him` ? '…' : '彼の耳で'}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'figures' &&
          person.figures.map((f) => (
            <div key={f.id} className="figure-row">
              <div className="figure-head">
                <span className="figure-name">{f.name}</span>
                <span className="figure-relation">{f.relation}</span>
              </div>
              <p className="figure-note">{f.note}</p>
            </div>
          ))}
      </div>

      <button className="card-button" onClick={onClose}>
        とじる
      </button>
    </div>
  )
}
