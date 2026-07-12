import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 一人ぶんの進行状態(章・ビート・運命パラメータ・理解度・調べ済み・生涯完了)。
// コレクションでは人物ごとにこれを保存し、選び直したときに続きから遊べるようにする。
export interface PersonProgress {
  chapterIndex: number
  beatIndex: number
  fate: number
  insights: Record<number, true>
  doneInteractions: Record<string, true>
  // 集めた手がかり(証拠) と 会話などで立ったフラグ。章をまたぐと共にリセットする。
  evidence: Record<string, true>
  flags: Record<string, true>
  lifeCompleted: boolean
}

const freshProgress = (fateStart: number): PersonProgress => ({
  chapterIndex: 0,
  beatIndex: 0,
  fate: fateStart,
  insights: {},
  doneInteractions: {},
  evidence: {},
  flags: {},
  lifeCompleted: false,
})

interface GameStore {
  // --- コレクション(伝記ゲーム集)の状態 ---
  activePersonId: string | null
  progress: Record<string, PersonProgress>
  selectPerson: (id: string, fateStart: number) => void
  goHome: () => void

  // --- いま遊んでいる一人ぶんの「その場」の状態(SceneRunner はここだけを読む) ---
  chapterIndex: number
  beatIndex: number
  fate: number
  insights: Record<number, true>
  doneInteractions: Record<string, true>
  evidence: Record<string, true>
  flags: Record<string, true>
  lifeCompleted: boolean
  advance: () => void
  advanceChapter: (nextFateStart: number) => void
  setFate: (v: number) => void
  markInsight: (chapterIndex: number) => void
  completeInteraction: (beatIndex: number, id: string) => void
  isInteractionDone: (beatIndex: number, id: string) => boolean
  collectEvidence: (id: string) => void
  setFlag: (id: string) => void
  completeLife: () => void
  jumpToChapter: (chapterIndex: number, fateStart: number) => void
  resetLife: (fateStart: number) => void
}

// いまのフラットな進行状態を PersonProgress として切り出す(人物を離れる直前に退避する)
const snapshot = (s: GameStore): PersonProgress => ({
  chapterIndex: s.chapterIndex,
  beatIndex: s.beatIndex,
  fate: s.fate,
  insights: s.insights,
  doneInteractions: s.doneInteractions,
  evidence: s.evidence,
  flags: s.flags,
  lifeCompleted: s.lifeCompleted,
})

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      activePersonId: null,
      progress: {},
      selectPerson: (id, fateStart) =>
        set((s) => {
          // いま遊んでいた人物の進行を退避してから、選んだ人物の続き(なければ最初)を読み込む
          const kept = s.activePersonId
            ? { ...s.progress, [s.activePersonId]: snapshot(s) }
            : s.progress
          const next = kept[id] ?? freshProgress(fateStart)
          return {
            activePersonId: id,
            progress: kept,
            ...next,
            evidence: next.evidence ?? {},
            flags: next.flags ?? {},
          }
        }),
      goHome: () =>
        set((s) => ({
          activePersonId: null,
          progress: s.activePersonId
            ? { ...s.progress, [s.activePersonId]: snapshot(s) }
            : s.progress,
        })),

      chapterIndex: 0,
      beatIndex: 0,
      fate: 1,
      insights: {},
      doneInteractions: {},
      evidence: {},
      flags: {},
      lifeCompleted: false,
      advance: () => set((s) => ({ beatIndex: s.beatIndex + 1 })),
      advanceChapter: (nextFateStart) =>
        set((s) => ({
          chapterIndex: s.chapterIndex + 1,
          beatIndex: 0,
          fate: nextFateStart,
          doneInteractions: {},
          evidence: {},
          flags: {},
        })),
      setFate: (v) => set({ fate: v }),
      markInsight: (chapterIndex) =>
        set((s) => ({ insights: { ...s.insights, [chapterIndex]: true } })),
      completeInteraction: (beatIndex, id) =>
        set((s) => ({
          doneInteractions: { ...s.doneInteractions, [`${beatIndex}:${id}`]: true },
        })),
      isInteractionDone: (beatIndex, id) => !!get().doneInteractions[`${beatIndex}:${id}`],
      collectEvidence: (id) => set((s) => ({ evidence: { ...s.evidence, [id]: true } })),
      setFlag: (id) => set((s) => ({ flags: { ...s.flags, [id]: true } })),
      completeLife: () => set({ lifeCompleted: true }),
      jumpToChapter: (chapterIndex, fateStart) =>
        set({ chapterIndex, beatIndex: 0, fate: fateStart, doneInteractions: {}, evidence: {}, flags: {} }),
      resetLife: (fateStart) =>
        set({
          chapterIndex: 0,
          beatIndex: 0,
          fate: fateStart,
          insights: {},
          doneInteractions: {},
          evidence: {},
          flags: {},
        }),
    }),
    {
      name: 'denki-game-save',
      version: 4,
      // v3(単一人物セーブ)→ v4(コレクション対応)。旧セーブの進行は beethoven の続きとして引き継ぐ
      migrate: (persisted) => {
        const p = persisted as Partial<PersonProgress> | undefined
        const progress: Record<string, PersonProgress> = {}
        if (p && typeof p.chapterIndex === 'number') {
          progress.beethoven = {
            chapterIndex: p.chapterIndex ?? 0,
            beatIndex: p.beatIndex ?? 0,
            fate: p.fate ?? 1,
            insights: p.insights ?? {},
            doneInteractions: p.doneInteractions ?? {},
            evidence: p.evidence ?? {},
            flags: p.flags ?? {},
            lifeCompleted: p.lifeCompleted ?? false,
          }
        }
        return { activePersonId: null, progress, ...freshProgress(1) }
      },
    },
  ),
)
