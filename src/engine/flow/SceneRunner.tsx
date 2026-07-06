import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import type { InteractionDef, PersonData } from '../types'
import { useGameStore } from '../store'
import { audio } from '../audio/AudioEngine'
import { SCENERIES } from '../../scenes3d/registry'
import { Player } from '../scene3d/Player'
import { CameraDirector } from '../scene3d/CameraDirector'
import { Interactable } from '../scene3d/Interactable'
import { TitleCard } from '../ui/TitleCard'
import { DialogueBox } from '../ui/DialogueBox'
import { ChoicePanel } from '../ui/ChoicePanel'
import { RevealPanel } from '../ui/RevealPanel'
import { ChronicleScreen } from '../ui/ChronicleScreen'
import { ChapterSelect } from '../ui/ChapterSelect'
import { OrientationGuard } from '../ui/OrientationGuard'
import { TouchControls } from '../ui/TouchControls'

// コアループの進行役: ビート列を解釈し、3D舞台とUIオーバーレイを差配する
export function SceneRunner({ person }: { person: PersonData }) {
  const chapterIndex = useGameStore((s) => s.chapterIndex)
  const beatIndex = useGameStore((s) => s.beatIndex)
  const fate = useGameStore((s) => s.fate)
  const advance = useGameStore((s) => s.advance)
  const advanceChapter = useGameStore((s) => s.advanceChapter)
  const setFate = useGameStore((s) => s.setFate)
  const markInsight = useGameStore((s) => s.markInsight)
  const insights = useGameStore((s) => s.insights)
  const completeInteraction = useGameStore((s) => s.completeInteraction)
  const doneInteractions = useGameStore((s) => s.doneInteractions)
  const lifeCompleted = useGameStore((s) => s.lifeCompleted)
  const completeLife = useGameStore((s) => s.completeLife)
  const jumpToChapter = useGameStore((s) => s.jumpToChapter)
  const resetLife = useGameStore((s) => s.resetLife)

  const chapter = person.chapters[Math.min(chapterIndex, person.chapters.length - 1)]
  const isLastChapter = chapterIndex >= person.chapters.length - 1
  const beat = chapter.beats[Math.min(beatIndex, chapter.beats.length - 1)]

  const [unlocked, setUnlocked] = useState(false)
  const [activeInteraction, setActiveInteraction] = useState<InteractionDef | null>(null)
  const [chosen, setChosen] = useState<number | null>(null)
  const [screen, setScreen] = useState<'none' | 'chronicle' | 'chapters'>('none')
  const fateRan = useRef('')

  // 初回起動時に章の開始聴力をセット
  useEffect(() => {
    if (useGameStore.getState().beatIndex === 0) setFate(chapter.fateStart)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ビートが変わったら一時状態をリセット
  useEffect(() => {
    setActiveInteraction(null)
    setChosen(null)
  }, [chapterIndex, beatIndex])

  // 最終章の結びに到達したら「生涯を生き終えた」ことを記録(年譜・章選択が解放される)
  useEffect(() => {
    if (isLastChapter && beat.kind === 'ending') completeLife()
  }, [isLastChapter, beat, completeLife])

  // 環境音の切替
  useEffect(() => {
    if (!unlocked) return
    if (beat.kind === 'title' || beat.kind === 'ending') {
      audio.setAmbience([])
    } else if ('ambience' in beat && beat.ambience) {
      audio.setAmbience(beat.ambience)
    }
  }, [beatIndex, unlocked, beat])

  // 運命ビート: 聴力を実時間で減衰させる(音そのものが遠ざかる)
  useEffect(() => {
    const key = `${chapterIndex}:${beatIndex}`
    if (beat.kind !== 'fate' || !unlocked || fateRan.current === key) return
    fateRan.current = key
    audio.setHearing(beat.to, beat.durationSec)
    const t = setTimeout(
      () => {
        setFate(beat.to)
        advance()
      },
      (beat.durationSec + 2) * 1000,
    )
    return () => clearTimeout(t)
  }, [beat, chapterIndex, beatIndex, unlocked, setFate, advance])

  const start = () => {
    audio.ensureStarted()
    const st = useGameStore.getState()
    audio.setHearing(st.fate, 0.01)
    setUnlocked(true)
    // 表紙(生涯の最初)からは章タイトルカードを見せる。章題ゲートからの再開は重複するので飛ばす
    const fromCover = st.chapterIndex === 0 && st.beatIndex === 0
    if (!fromCover && beat.kind === 'title') advance()
  }

  const openChapter = (i: number) => {
    const fateStart = person.chapters[i].fateStart
    jumpToChapter(i, fateStart)
    if (audio.started) audio.setHearing(fateStart, 0.5)
    setScreen('none')
  }

  // 全画面カード(ゲート/章タイトル/章結び/生涯の記録)は Canvas を残したままオーバーレイ表示する
  let overlay: ReactNode = null
  if (screen === 'chronicle') {
    overlay = <ChronicleScreen person={person} onClose={() => setScreen('none')} />
  } else if (screen === 'chapters') {
    overlay = <ChapterSelect person={person} onSelect={openChapter} onClose={() => setScreen('none')} />
  } else if (!unlocked) {
    // 最初のユーザー操作までは表紙/章タイトルを兼ねたゲートを表示(AudioContext起動のため)
    const atLifeStart = chapterIndex === 0 && beatIndex === 0
    overlay = (
      <TitleCard
        title={atLifeStart ? person.name : chapter.title}
        subtitle={atLifeStart ? `${person.born} — ${person.died}` : chapter.subtitle}
        buttonLabel={atLifeStart ? 'この生涯を、生きる' : 'つづきから'}
        onStart={start}
        footer={
          lifeCompleted && (
            <div className="archive-nav">
              <button className="archive-nav-button" onClick={() => setScreen('chronicle')}>
                生涯の記録
              </button>
              <button className="archive-nav-button" onClick={() => setScreen('chapters')}>
                章をえらぶ
              </button>
            </div>
          )
        }
      />
    )
  } else if (beat.kind === 'title') {
    overlay = (
      <TitleCard title={beat.title} subtitle={beat.subtitle} buttonLabel="すすむ" onStart={advance} />
    )
  } else if (beat.kind === 'ending') {
    const firstFateStart = person.chapters[0].fateStart
    const nextFateStart = isLastChapter ? firstFateStart : person.chapters[chapterIndex + 1].fateStart
    const understanding = Object.keys(insights).length
    const tier = isLastChapter
      ? person.understandingTiers.find((t) => understanding >= t.min)
      : undefined
    overlay = (
      <div className="fullscreen-card ending">
        <h1 className="card-title">{beat.title}</h1>
        <div className="ending-lines">
          {beat.lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
        {tier && (
          <div className="ending-payoff">
            <p className="payoff-count">
              岐路の答え合わせ ─ {understanding} / {person.chapters.length}
            </p>
            <p className="payoff-title">{tier.title}</p>
            <p className="payoff-text">{tier.text}</p>
          </div>
        )}
        <div className="ending-actions">
          {isLastChapter && (
            <button className="card-button" onClick={() => setScreen('chronicle')}>
              生涯の記録をひらく
            </button>
          )}
          <button
            className="card-button"
            onClick={() => {
              if (isLastChapter) {
                resetLife(firstFateStart)
              } else {
                advanceChapter(nextFateStart)
              }
              audio.setHearing(nextFateStart, 0.5)
            }}
          >
            {isLastChapter ? 'もう一度、生涯を生きる' : '次の章へ'}
          </button>
        </div>
      </div>
    )
  }

  const scenery = 'sceneryId' in beat && beat.sceneryId ? SCENERIES[beat.sceneryId] : null

  const allRequiredDone =
    beat.kind === 'explore' &&
    beat.interactions
      .filter((it) => it.required)
      .every((it) => doneInteractions[`${beatIndex}:${it.id}`])

  const triggerInteraction = (def: InteractionDef) => {
    if (def.sound) audio.playOneShot(def.sound)
    if (def.lines && def.lines.length > 0) setActiveInteraction(def)
    else completeInteraction(beatIndex, def.id)
  }

  return (
    <div className="game-root">
      {/* Canvas は常時マウント(ビートごとに WebGL コンテキストを作り直すと
          章をまたぐうちに Context Lost で描画が死ぬため) */}
      {/* offsetSize: 強制横画面(html.force-landscape)は #root を CSS回転させる。
          getBoundingClientRect は回転後の寸法を返すため、既定の計測ではキャンバスが
          縦横比を取り違える。offsetWidth/offsetHeight(回転の影響を受けないレイアウト寸法)で
          計測させ、回転下でも正しい横向きの解像度・カメラアスペクトにする */}
      <Canvas shadows camera={{ fov: 50, position: [0, 3, 6] }} resize={{ offsetSize: true }}>
        <color attach="background" args={[scenery ? scenery.background : '#141210']} />
        {scenery?.fog && (
          <fog attach="fog" args={[scenery.fog.color, scenery.fog.near, scenery.fog.far]} />
        )}
        {scenery && (
          <>
            <scenery.Component />
            <CameraDirector zones={scenery.cameraZones} />

            {beat.kind === 'dialogue' && beat.playerAt && (
              <Player spawn={beat.playerAt} bounds={scenery.bounds} enabled={false} />
            )}

            {beat.kind === 'explore' && (
              <>
                <Player
                  spawn={beat.spawn}
                  bounds={scenery.bounds}
                  enabled={!activeInteraction && !overlay}
                />
                {beat.interactions.map((def) => (
                  <Interactable
                    key={def.id}
                    label={def.label}
                    position={def.position}
                    radius={def.radius}
                    done={!!doneInteractions[`${beatIndex}:${def.id}`]}
                    enabled={!activeInteraction && !overlay}
                    onTrigger={() => triggerInteraction(def)}
                  />
                ))}
                {allRequiredDone && (
                  <Interactable
                    label={beat.exitLabel}
                    position={beat.exitPosition}
                    enabled={!activeInteraction && !overlay}
                    onTrigger={advance}
                  />
                )}
              </>
            )}
          </>
        )}
      </Canvas>

      {overlay}

      {!overlay && beat.kind === 'dialogue' && <DialogueBox lines={beat.lines} onDone={advance} />}

      {!overlay && beat.kind === 'explore' && activeInteraction?.lines && (
        <DialogueBox
          lines={activeInteraction.lines}
          onDone={() => {
            completeInteraction(beatIndex, activeInteraction.id)
            setActiveInteraction(null)
          }}
        />
      )}

      {!overlay && beat.kind === 'explore' && !activeInteraction && (
        <>
          <div className="hint-bar">移動: WASD / 矢印キー　　調べる: E / クリック</div>
          <TouchControls />
        </>
      )}

      {!overlay && beat.kind === 'choice' && chosen === null && (
        <ChoicePanel
          situation={beat.situation}
          question={beat.question}
          options={beat.options}
          onSelect={(i) => {
            setChosen(i)
            if (i === beat.correctIndex) markInsight(chapterIndex)
          }}
        />
      )}

      {!overlay && beat.kind === 'choice' && chosen !== null && (
        <RevealPanel
          chosenLabel={beat.options[chosen].label}
          feedback={beat.options[chosen].feedback}
          correct={chosen === beat.correctIndex}
          title={beat.reveal.title}
          body={beat.reveal.body}
          onDone={advance}
        />
      )}

      {!overlay && beat.kind === 'fate' && (
        <div className="fate-layer">
          <p className="fate-caption">{beat.caption}</p>
        </div>
      )}

      <OrientationGuard />

      {/* 現在の聴力はHUDに出さない(音そのものが状態表示) — fateはaudioにのみ反映される */}
      <span style={{ display: 'none' }}>{fate}</span>
    </div>
  )
}
