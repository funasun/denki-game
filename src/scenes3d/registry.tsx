import type { SceneryDef } from '../engine/types'
import { HeiligenstadtRoom } from './HeiligenstadtRoom'
import { Countryside } from './Countryside'
import { BonnRoom } from './BonnRoom'
import { ViennaRoad } from './ViennaRoad'
import { ConcertHall } from './ConcertHall'
import { DeathRoom } from './DeathRoom'

function RoomMorning() {
  return <HeiligenstadtRoom />
}
function RoomNight() {
  return <HeiligenstadtRoom night />
}

// 舞台カタログ: 人物データは sceneryId でここを参照する
export const SCENERIES: Record<string, SceneryDef> = {
  'room-morning': {
    Component: RoomMorning,
    bounds: { min: [-2.8, -2.8], max: [2.8, 2.8] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [2.6, 3.2, 4.6],
        lookAtOffset: [0, 0.9, 0],
      },
    ],
    background: '#8fa3ad',
  },
  'room-night': {
    Component: RoomNight,
    bounds: { min: [-2.8, -2.8], max: [2.8, 2.8] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [-2.4, 3.0, 4.4],
        lookAtOffset: [0, 0.9, 0],
      },
    ],
    background: '#141a26',
  },
  countryside: {
    Component: Countryside,
    bounds: { min: [-2.5, -21], max: [2.5, 1] },
    cameraZones: [
      {
        min: [-99, -8],
        max: [99, 99],
        camera: [5.5, 3.4, 3.5],
        lookAtOffset: [0, 1, -1],
      },
      {
        min: [-99, -99],
        max: [99, -8],
        camera: [-6, 4.2, -16],
        lookAtOffset: [0, 1, 0],
      },
    ],
    background: '#bcd6e4',
    fog: { color: '#bcd6e4', near: 18, far: 55 },
  },
  'bonn-room': {
    Component: BonnRoom,
    bounds: { min: [-2.3, -2.3], max: [2.3, 2.3] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [2.3, 2.9, 4.2],
        lookAtOffset: [0, 0.8, 0],
      },
    ],
    background: '#0e0f16',
  },
  'vienna-road': {
    Component: ViennaRoad,
    bounds: { min: [-2.5, -16], max: [2.5, 1] },
    cameraZones: [
      {
        min: [-99, -7],
        max: [99, 99],
        camera: [5.2, 3.3, 2.8],
        lookAtOffset: [0, 1, -1],
      },
      {
        min: [-99, -99],
        max: [99, -7],
        camera: [-5.8, 3.9, -12.5],
        lookAtOffset: [0, 1, -0.5],
      },
    ],
    background: '#d4cbb2',
    fog: { color: '#d4cbb2', near: 16, far: 52 },
  },
  'concert-hall': {
    Component: ConcertHall,
    bounds: { min: [-3.4, -2.6], max: [3.4, 1.6] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [0, 3.6, 6.8],
        lookAtOffset: [0, 0.7, -0.5],
      },
    ],
    background: '#120e0a',
  },
  'death-room': {
    Component: DeathRoom,
    bounds: { min: [-2.8, -2.8], max: [2.8, 2.8] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [2.6, 3.0, 4.5],
        lookAtOffset: [0, 0.8, 0],
      },
    ],
    background: '#0a0b12',
  },
}
