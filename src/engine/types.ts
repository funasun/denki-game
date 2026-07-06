import type { ComponentType } from 'react'

export interface DialogueLine {
  speaker?: string
  text: string
  inner?: boolean
}

export interface InteractionDef {
  id: string
  label: string
  position: [number, number, number]
  radius?: number
  required?: boolean
  lines?: DialogueLine[]
  sound?: string
}

export interface ChoiceOption {
  label: string
  feedback: string
}

export type Beat =
  | { kind: 'title'; title: string; subtitle?: string }
  | {
      kind: 'dialogue'
      sceneryId?: string
      ambience?: string[]
      playerAt?: [number, number, number]
      lines: DialogueLine[]
    }
  | {
      kind: 'explore'
      sceneryId: string
      ambience: string[]
      spawn: [number, number, number]
      interactions: InteractionDef[]
      exitLabel: string
      exitPosition: [number, number, number]
    }
  | {
      kind: 'choice'
      sceneryId?: string
      situation?: string
      question: string
      options: ChoiceOption[]
      correctIndex: number
      reveal: { title: string; body: string[] }
    }
  | {
      kind: 'fate'
      sceneryId?: string
      to: number
      durationSec: number
      caption?: string
    }
  | { kind: 'ending'; title: string; lines: string[] }

export interface ChapterData {
  id: string
  title: string
  subtitle?: string
  fateStart: number
  beats: Beat[]
}

// 生涯年譜のひとこま
export interface ChronicleEntry {
  year: number
  text: string
  workId?: string
}

// 聴ける作品(one-shot合成音の断片)。hearingAt = 作曲当時の運命パラメータ
export interface WorkDef {
  id: string
  title: string
  year: number
  note: string
  soundId: string
  hearingAt: number
}

// 人物録のひとり
export interface FigureDef {
  id: string
  name: string
  relation: string
  note: string
}

// 生涯を終えたときの「理解度」に応じた結びの言葉(minの降順で最初に合致したもの)
export interface UnderstandingTier {
  min: number
  title: string
  text: string
}

export interface PersonData {
  id: string
  name: string
  born: number
  died: number
  fate: { id: string; label: string }
  chapters: ChapterData[]
  chronicle: ChronicleEntry[]
  works: WorkDef[]
  figures: FigureDef[]
  understandingTiers: UnderstandingTier[]
}

export interface CameraZone {
  min: [number, number]
  max: [number, number]
  camera: [number, number, number]
  lookAtOffset?: [number, number, number]
}

export interface SceneryDef {
  Component: ComponentType
  bounds: { min: [number, number]; max: [number, number] }
  cameraZones: CameraZone[]
  background: string
  fog?: { color: string; near: number; far: number }
}
