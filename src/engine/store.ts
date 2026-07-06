import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameStore {
  chapterIndex: number
  beatIndex: number
  fate: number
  insights: Record<number, true>
  doneInteractions: Record<string, true>
  lifeCompleted: boolean
  advance: () => void
  advanceChapter: (nextFateStart: number) => void
  setFate: (v: number) => void
  markInsight: (chapterIndex: number) => void
  completeInteraction: (beatIndex: number, id: string) => void
  isInteractionDone: (beatIndex: number, id: string) => boolean
  completeLife: () => void
  jumpToChapter: (chapterIndex: number, fateStart: number) => void
  resetLife: (fateStart: number) => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      chapterIndex: 0,
      beatIndex: 0,
      fate: 1,
      insights: {},
      doneInteractions: {},
      lifeCompleted: false,
      advance: () => set((s) => ({ beatIndex: s.beatIndex + 1 })),
      advanceChapter: (nextFateStart) =>
        set((s) => ({
          chapterIndex: s.chapterIndex + 1,
          beatIndex: 0,
          fate: nextFateStart,
          doneInteractions: {},
        })),
      setFate: (v) => set({ fate: v }),
      markInsight: (chapterIndex) =>
        set((s) => ({ insights: { ...s.insights, [chapterIndex]: true } })),
      completeInteraction: (beatIndex, id) =>
        set((s) => ({
          doneInteractions: { ...s.doneInteractions, [`${beatIndex}:${id}`]: true },
        })),
      isInteractionDone: (beatIndex, id) => !!get().doneInteractions[`${beatIndex}:${id}`],
      completeLife: () => set({ lifeCompleted: true }),
      jumpToChapter: (chapterIndex, fateStart) =>
        set({ chapterIndex, beatIndex: 0, fate: fateStart, doneInteractions: {} }),
      resetLife: (fateStart) =>
        set({
          chapterIndex: 0,
          beatIndex: 0,
          fate: fateStart,
          insights: {},
          doneInteractions: {},
        }),
    }),
    {
      name: 'denki-game-save',
      version: 3,
      migrate: () => ({
        chapterIndex: 0,
        beatIndex: 0,
        fate: 1,
        insights: {},
        doneInteractions: {},
        lifeCompleted: false,
      }),
    },
  ),
)
