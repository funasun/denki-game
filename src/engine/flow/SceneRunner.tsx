import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import type { ChapterData, DialogueLine, EvidenceDef, InteractionDef, PersonData } from '../types'
import { useGameStore } from '../store'
import { audio } from '../audio/AudioEngine'
import { SCENERIES } from '../../scenes3d/registry'
import { Player } from '../scene3d/Player'
import { CameraDirector } from '../scene3d/CameraDirector'
import { Interactable } from '../scene3d/Interactable'
import { NpcFigure } from '../scene3d/NpcFigure'
import { FateAtmosphere } from '../scene3d/FateAtmosphere'
import { TitleCard } from '../ui/TitleCard'
import { DialogueBox } from '../ui/DialogueBox'
import { ChoicePanel } from '../ui/ChoicePanel'
import { RevealPanel } from '../ui/RevealPanel'
import { InquiryPanel } from '../ui/InquiryPanel'
import { VerdictPanel } from '../ui/VerdictPanel'
import { ExamineOverlay } from '../ui/ExamineOverlay'
import { ConversationBox } from '../ui/ConversationBox'
import { PianoActivity } from '../ui/PianoActivity'
import { ComposeActivity } from '../ui/ComposeActivity'
import { ChronicleScreen } from '../ui/ChronicleScreen'
import { ChapterSelect } from '../ui/ChapterSelect'
import { OrientationGuard } from '../ui/OrientationGuard'
import { TouchControls } from '../ui/TouchControls'
import { FullscreenButton } from '../ui/FullscreenButton'
import { enterFullscreen, isTouchLike } from '../util/fullscreen'

// 章の中で手に入りうる手がかりの題名を、探索・推理データから集めておく
// (手がかりを拾った瞬間のトースト表示に使う)
function collectEvidenceTitles(chapter: ChapterData): Record<string, string> {
  const m: Record<string, string> = {}
  const add = (e?: EvidenceDef) => {
    if (e) m[e.id] = e.title
  }
  for (const b of chapter.beats) {
    if (b.kind === 'inquiry') for (const e of b.evidencePool ?? []) add(e)
    if (b.kind !== 'explore') continue
    for (const it of b.interactions) {
      add(it.evidence)
      for (const h of it.examine?.hotspots ?? []) add(h.evidence)
      for (const n of it.conversation?.nodes ?? []) for (const c of n.choices ?? []) add(c.evidence)
      add(it.activity?.evidence)
    }
  }
  return m
}

// コアループの進行役: ビート列を解釈し、3D舞台とUIオーバーレイを差配する
export function SceneRunner({ person, onHome }: { person: PersonData; onHome: () => void }) {
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
  const collectEvidence = useGameStore((s) => s.collectEvidence)
  const setFlag = useGameStore((s) => s.setFlag)
  const evidence = useGameStore((s) => s.evidence)
  const flags = useGameStore((s) => s.flags)
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

  // 選択の反響: フラグ条件つきの行を、いまのフラグで選り分ける
  const visibleLines = (lines: DialogueLine[]) =>
    lines.filter((l) => (!l.ifFlag || flags[l.ifFlag]) && (!l.ifNotFlag || !flags[l.ifNotFlag]))

  // 手がかりを拾った瞬間の小さな通知(トースト)
  const evidenceTitles = useMemo(() => collectEvidenceTitles(chapter), [chapter])
  const [toast, setToast] = useState<{ key: number; text: string } | null>(null)
  const prevEvidence = useRef<Record<string, true> | null>(null)
  useEffect(() => {
    if (prevEvidence.current) {
      const added = Object.keys(evidence).find((k) => !prevEvidence.current?.[k])
      if (added && evidenceTitles[added]) {
        setToast({ key: Date.now(), text: evidenceTitles[added] })
      }
    }
    prevEvidence.current = evidence
  }, [evidence, evidenceTitles])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

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
    if (beat.kind !== 'fate') {
      // 運命ビートの外に出たら「実行済み」の記録を消す。消さないと、
      // 「章をえらぶ」で同じ章を選び直したとき、同じ番号の運命ビートが
      // 実行済みと誤認されてタイマーが張られず、進行が止まってしまう。
      fateRan.current = ''
      return
    }
    const key = `${chapterIndex}:${beatIndex}`
    if (!unlocked || fateRan.current === key) return
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
    // スマホ等では全画面にしてブラウザのURLバー・タブを隠す(このタップ操作の中でだけ呼べる)。
    // PC では邪魔なので自動化しない。iPhone Safari は非対応 ── enterFullscreen 側で無視される。
    if (isTouchLike()) enterFullscreen()
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

  // 伝記ゲーム集(ホーム)へ戻る。環境音を止めてから、この人物の進行を退避して離れる
  const goToHome = () => {
    audio.setAmbience([])
    onHome()
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
          <div className="gate-footer">
            {lifeCompleted && (
              <div className="archive-nav">
                <button className="archive-nav-button" onClick={() => setScreen('chronicle')}>
                  生涯の記録
                </button>
                <button className="archive-nav-button" onClick={() => setScreen('chapters')}>
                  章をえらぶ
                </button>
              </div>
            )}
            <button className="archive-nav-button home-link" onClick={goToHome}>
              ← 伝記ゲーム集
            </button>
          </div>
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
          <button className="card-button" onClick={goToHome}>
            伝記ゲーム集へ
          </button>
        </div>
      </div>
    )
  }

  const scenery = 'sceneryId' in beat && beat.sceneryId ? SCENERIES[beat.sceneryId] : null

  // 運命が「光」を駆動する人物(ノーベル)は、背景・フォグ・照明を FateAtmosphere が受け持つ。
  // 音駆動の人物(ベートーヴェン)は従来どおり各舞台が自前の照明・静的背景を持つ。
  const useFateLight = person.fate.visual === 'warmth'
  const fateTarget = beat.kind === 'fate' ? beat.to : fate

  const remainingRequired =
    beat.kind === 'explore'
      ? beat.interactions.filter(
          (it) => it.required && !doneInteractions[`${beatIndex}:${it.id}`],
        ).length
      : 0
  const allRequiredDone = beat.kind === 'explore' && remainingRequired === 0

  const triggerInteraction = (def: InteractionDef) => {
    if (def.sound) audio.playOneShot(def.sound)
    // 様式(調べ込み/対話/行為/台詞)のいずれかを持てばオーバーレイを開く。
    // どれも無ければ「調べた」印と直接の手がかりだけを残して閉じる。
    if (def.examine || def.conversation || def.activity || (def.lines && def.lines.length > 0)) {
      setActiveInteraction(def)
    } else {
      if (def.evidence) collectEvidence(def.evidence.id)
      completeInteraction(beatIndex, def.id)
    }
  }

  // 相互作用を終える: 直接の手がかりを回収し、「調べた」印をつけてオーバーレイを閉じる。
  const finishInteraction = (def: InteractionDef) => {
    if (def.evidence) collectEvidence(def.evidence.id)
    completeInteraction(beatIndex, def.id)
    setActiveInteraction(null)
  }

  // 推理ビート: 章内で集めうる手がかり(evidencePool)のうち、実際に集めた分だけを証拠一式にする。
  // 調べ落とした手がかりは手元に来ない ── だから探索の丁寧さがそのまま推理の厚みになる。
  const dossier: EvidenceDef[] =
    beat.kind === 'inquiry' ? (beat.evidencePool ?? []).filter((e) => evidence[e.id]) : []

  return (
    <div className="game-root">
      {/* Canvas は常時マウント(ビートごとに WebGL コンテキストを作り直すと
          章をまたぐうちに Context Lost で描画が死ぬため) */}
      {/* offsetSize: 強制横画面(html.force-landscape)は #root を CSS回転させる。
          getBoundingClientRect は回転後の寸法を返すため、既定の計測ではキャンバスが
          縦横比を取り違える。offsetWidth/offsetHeight(回転の影響を受けないレイアウト寸法)で
          計測させ、回転下でも正しい横向きの解像度・カメラアスペクトにする */}
      <Canvas shadows camera={{ fov: 50, position: [0, 3, 6] }} resize={{ offsetSize: true }}>
        {!useFateLight && (
          <color attach="background" args={[scenery ? scenery.background : '#141210']} />
        )}
        {!useFateLight && scenery?.fog && (
          <fog attach="fog" args={[scenery.fog.color, scenery.fog.near, scenery.fog.far]} />
        )}
        {useFateLight && (
          <FateAtmosphere
            target={fateTarget}
            fog={scenery?.fog ? { near: scenery.fog.near, far: scenery.fog.far } : undefined}
          />
        )}
        {scenery && (
          <>
            <scenery.Component />
            <CameraDirector zones={scenery.cameraZones} />

            {/* その場に立つ人物たち(名札つき)。ビートのデータが登場人物を決める */}
            {(beat.kind === 'dialogue' || beat.kind === 'explore') &&
              beat.figures?.map((f) => <NpcFigure key={f.id} def={f} />)}

            {beat.kind === 'dialogue' && beat.playerAt && (
              <Player spawn={beat.playerAt} bounds={scenery.bounds} enabled={false} />
            )}

            {beat.kind === 'explore' && (
              <>
                <Player
                  spawn={beat.spawn}
                  bounds={scenery.bounds}
                  enabled={!activeInteraction && !overlay}
                  obstacles={scenery.obstacles}
                />
                {beat.interactions.map((def) => (
                  <Interactable
                    key={def.id}
                    label={def.label}
                    position={def.position}
                    radius={def.radius}
                    done={!!doneInteractions[`${beatIndex}:${def.id}`]}
                    enabled={!activeInteraction && !overlay}
                    variant={def.required ? 'required' : 'optional'}
                    onTrigger={() => triggerInteraction(def)}
                  />
                ))}
                {allRequiredDone && (
                  <Interactable
                    label={beat.exitLabel}
                    position={beat.exitPosition}
                    enabled={!activeInteraction && !overlay}
                    variant="exit"
                    onTrigger={advance}
                  />
                )}
              </>
            )}
          </>
        )}
      </Canvas>

      {overlay}

      {!overlay && beat.kind === 'dialogue' && (
        <DialogueBox lines={visibleLines(beat.lines)} onDone={advance} />
      )}

      {!overlay &&
        beat.kind === 'explore' &&
        activeInteraction &&
        (() => {
          const it = activeInteraction
          const done = () => finishInteraction(it)
          const collect = (e: EvidenceDef) => collectEvidence(e.id)
          if (it.examine)
            return <ExamineOverlay examine={it.examine} onCollect={collect} onDone={done} />
          if (it.conversation)
            return (
              <ConversationBox
                conversation={it.conversation}
                onCollect={collect}
                onFlag={setFlag}
                onDone={done}
              />
            )
          if (it.activity?.kind === 'piano')
            return <PianoActivity activity={it.activity} onCollect={collect} onDone={done} />
          if (it.activity?.kind === 'compose')
            return <ComposeActivity activity={it.activity} onCollect={collect} onDone={done} />
          if (it.lines) return <DialogueBox lines={visibleLines(it.lines)} onDone={done} />
          return null
        })()}

      {!overlay && beat.kind === 'explore' && !activeInteraction && (
        <>
          {/* 目あて: いま何をすればいいかを一文で示す(済んだら出口の案内に変わる) */}
          <div className="goal-bar">
            <span className="goal-label">目あて</span>
            <span className="goal-text">
              {allRequiredDone ? `▸ ${beat.exitLabel}` : (beat.goal ?? beat.exitLabel)}
            </span>
            {!allRequiredDone && <span className="goal-count">のこり {remainingRequired}</span>}
          </div>
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

      {!overlay && beat.kind === 'inquiry' && chosen === null && (
        <InquiryPanel
          situation={beat.situation}
          question={beat.question}
          dossierIntro={beat.dossierIntro}
          dossier={dossier}
          readings={beat.readings}
          onSelect={(i) => {
            setChosen(i)
            // 推理には正解がない。史料と向き合ったこと自体を「心が重なった」証にする。
            markInsight(chapterIndex)
          }}
        />
      )}

      {!overlay && beat.kind === 'inquiry' && chosen !== null && (
        <VerdictPanel
          chosenLabel={beat.readings[chosen].label}
          support={beat.readings[chosen].support}
          supportingEvidence={dossier.filter((e) =>
            beat.readings[chosen].supportedBy?.includes(e.id),
          )}
          verdict={beat.verdict}
          onDone={advance}
        />
      )}

      {!overlay && beat.kind === 'fate' && (
        <div className="fate-layer">
          <p className="fate-caption">{beat.caption}</p>
        </div>
      )}

      {/* 手がかりを拾った瞬間の小さな通知 */}
      {toast && (
        <div key={toast.key} className="evidence-toast">
          手がかりを書きとめた ─ 「{toast.text}」
        </div>
      )}

      <OrientationGuard />
      <FullscreenButton />

      {/* 現在の聴力はHUDに出さない(音そのものが状態表示) — fateはaudioにのみ反映される */}
      <span style={{ display: 'none' }}>{fate}</span>
    </div>
  )
}
