import type { SceneryDef } from '../engine/types'
import { HeiligenstadtRoom } from './HeiligenstadtRoom'
import { Countryside } from './Countryside'
import { BonnRoom } from './BonnRoom'
import { ViennaRoad } from './ViennaRoad'
import { ConcertHall } from './ConcertHall'
import { DeathRoom } from './DeathRoom'
import { PetersburgHome } from './nobel/PetersburgHome'
import { Laboratory } from './nobel/Laboratory'
import { Heleneborg } from './nobel/Heleneborg'
import { NobelStudy } from './nobel/NobelStudy'
import { SanRemo } from './nobel/SanRemo'

function RoomMorning() {
  return <HeiligenstadtRoom />
}
function RoomNight() {
  return <HeiligenstadtRoom night />
}
function HeleneborgIntact() {
  return <Heleneborg />
}
function HeleneborgRuin() {
  return <Heleneborg wrecked />
}

// ハイリゲンシュタットの部屋(朝/夜で同じ間取り)の当たり判定を共有する
const HEILIGENSTADT_OBSTACLES: SceneryDef['obstacles'] = [
  { shape: 'box', x: -1.9, z: -1.6, hw: 0.36, hd: 0.95 }, // ピアノフォルテ
  { shape: 'box', x: -1.15, z: -1.6, hw: 0.18, hd: 0.28 }, // ピアノの椅子
  { shape: 'box', x: 1.9, z: -1.9, hw: 0.64, hd: 0.55 }, // 机
  { shape: 'box', x: 2.4, z: 1.6, hw: 0.5, hd: 1.0 }, // 寝台
]

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
    obstacles: HEILIGENSTADT_OBSTACLES,
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
    obstacles: HEILIGENSTADT_OBSTACLES,
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
    // 小道の幅(x±2.5)に収まる障害物のみ。木立・小川・柵・羊飼いは範囲外なので判定不要
    obstacles: [{ shape: 'circle', x: 0.9, z: -13.5, r: 0.3 }], // 弟子リース
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
    obstacles: [
      { shape: 'box', x: -1.6, z: -1.4, hw: 0.3, hd: 0.75 }, // クラヴィーア
      { shape: 'box', x: -0.95, z: -1.4, hw: 0.16, hd: 0.25 }, // 椅子
      { shape: 'box', x: 2.0, z: 1.5, hw: 0.43, hd: 0.8 }, // 子ども用の寝床
      { shape: 'circle', x: -0.55, z: -0.4, r: 0.3 }, // 父ヨハン(ビートの figures と同位置)
      { shape: 'circle', x: 1.2, z: 1.9, r: 0.28 }, // 母マリア(同上)
    ],
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
    obstacles: [
      { shape: 'box', x: 1.9, z: -6, hw: 0.69, hd: 1.05 }, // 駅馬車
      { shape: 'circle', x: -1.5, z: -10, r: 0.1 }, // 道標
      { shape: 'circle', x: 2.3, z: -7.6, r: 0.3 }, // 御者
    ],
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
    // 舞台上のもの・人(客席は範囲外)。楽員は舞台奥に並ぶ座奏者
    obstacles: [
      { shape: 'box', x: 0, z: -1.0, hw: 0.4, hd: 0.4 }, // 指揮台
      { shape: 'box', x: -2.3, z: -1.4, hw: 0.8, hd: 0.65 }, // フォルテピアノと丸椅子
      { shape: 'circle', x: 2.6, z: -0.9, r: 0.3 }, // 独唱者
      { shape: 'circle', x: 3.2, z: -1.4, r: 0.3 }, // 独唱者
      { shape: 'circle', x: -2.6, z: -2.2, r: 0.28 }, // 楽員
      { shape: 'circle', x: -1.5, z: -2.5, r: 0.28 }, // 楽員
      { shape: 'circle', x: 0.8, z: -2.6, r: 0.28 }, // 楽員
      { shape: 'circle', x: 1.9, z: -2.4, r: 0.28 }, // 楽員
      { shape: 'circle', x: 2.8, z: -2.1, r: 0.28 }, // 楽員
    ],
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
    obstacles: [
      { shape: 'box', x: -1.7, z: -1.2, hw: 0.65, hd: 1.15 }, // 病床
      { shape: 'box', x: -2.6, z: 0.5, hw: 0.3, hd: 0.25 }, // 枕元の小机
      { shape: 'box', x: 2.0, z: 1.7, hw: 0.35, hd: 0.25 }, // ワインの木箱
      { shape: 'circle', x: 0.9, z: -1.1, r: 0.26 }, // ゲルハルト少年(ビートの figures と同位置)
    ],
  },

  // ── アルフレッド・ノーベル(運命=温もり。背景/照明は FateAtmosphere が駆動) ──
  'nobel-home': {
    Component: PetersburgHome,
    bounds: { min: [-2.8, -2.8], max: [2.8, 2.8] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [2.7, 3.2, 4.7],
        lookAtOffset: [0, 0.9, 0],
      },
    ],
    background: '#1a1712',
    obstacles: [
      { shape: 'box', x: -2.4, z: -3.2, hw: 0.8, hd: 0.25 }, // 暖炉
      { shape: 'box', x: 0.4, z: -0.4, hw: 0.85, hd: 0.5 }, // 食卓
      { shape: 'box', x: 0.4, z: 0.5, hw: 0.24, hd: 0.24 }, // 椅子
      { shape: 'box', x: 1.5, z: -0.4, hw: 0.24, hd: 0.24 }, // 椅子
      { shape: 'circle', x: -1.4, z: -2.2, r: 0.3 }, // 父イマヌエル
    ],
  },
  // パリのペルーズ研究室、のちの自身の実験室(第二・四章)
  'nobel-lab': {
    Component: Laboratory,
    bounds: { min: [-2.6, -2.6], max: [2.6, 2.6] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [2.8, 3.0, 4.6],
        lookAtOffset: [0, 0.8, 0],
      },
    ],
    background: '#12151a',
    // 作業台は壁際(範囲 x/z ±2.6 のすぐ外)だが縁で止まるよう含める
    obstacles: [
      { shape: 'box', x: 0, z: -2.9, hw: 2.2, hd: 0.35 }, // 奥の作業台
      { shape: 'box', x: -2.9, z: 0.2, hw: 0.35, hd: 1.5 }, // 左手の作業台
      { shape: 'circle', x: 0.3, z: -1.9, r: 0.24 }, // 丸椅子
      { shape: 'circle', x: 1.8, z: -2.2, r: 0.28 }, // ペルーズ先生(ビートの figures と同位置)
    ],
  },
  // ヘレネボリの実験工場(第三章・爆発前)
  'nobel-heleneborg': {
    Component: HeleneborgIntact,
    bounds: { min: [-3.2, -13], max: [3.2, 2] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [6.4, 3.8, 0.5],
        lookAtOffset: [0, 1, -2.5],
      },
    ],
    background: '#1a2028',
    fog: { color: '#1a2028', near: 16, far: 62 },
    // 水辺の実験場。小屋の側壁・樽・木箱、そして末弟エミール
    obstacles: [
      { shape: 'circle', x: -2.4, z: -10, r: 0.3 }, // 樽
      { shape: 'circle', x: -2.0, z: -10.7, r: 0.3 }, // 樽
      { shape: 'box', x: 2.2, z: -9.5, hw: 0.3, hd: 0.3 }, // 木箱
      { shape: 'box', x: 2.5, z: -10.4, hw: 0.3, hd: 0.3 }, // 木箱
      { shape: 'circle', x: 0.6, z: -10.5, r: 0.32 }, // 末弟エミール
      { shape: 'circle', x: -0.5, z: -12.3, r: 0.26 }, // 小屋の職人
      { shape: 'circle', x: 0.5, z: -12.6, r: 0.26 }, // 小屋の職人
      { shape: 'box', x: -1.6, z: -12.5, hw: 0.08, hd: 1.3 }, // 実験小屋 左壁
      { shape: 'box', x: 1.6, z: -12.5, hw: 0.08, hd: 1.3 }, // 実験小屋 右壁
    ],
  },
  // ヘレネボリの焼け跡(第三章・爆発後。末弟エミールを喪う)
  'nobel-heleneborg-ruin': {
    Component: HeleneborgRuin,
    bounds: { min: [-3.2, -13], max: [3.2, 2] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [5.8, 3.6, 1.0],
        lookAtOffset: [0, 0.9, -2.5],
      },
    ],
    background: '#12141a',
    fog: { color: '#12141a', near: 14, far: 58 },
  },
  // マラコフ通りのノーベル邸・書斎(第四〜六章。富と孤独)
  'nobel-study': {
    Component: NobelStudy,
    bounds: { min: [-2.8, -2.8], max: [2.8, 2.8] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [2.7, 3.0, 4.6],
        lookAtOffset: [0, 0.8, 0],
      },
    ],
    background: '#0e0f13',
    obstacles: [
      { shape: 'box', x: 0, z: -1.7, hw: 1.2, hd: 0.55 }, // 執務机
      { shape: 'box', x: 0, z: 0.2, hw: 0.38, hd: 0.35 }, // 肘掛け椅子
      { shape: 'circle', x: -2.4, z: -0.6, r: 0.28 }, // 地球儀
      { shape: 'box', x: 2.4, z: -3.1, hw: 0.8, hd: 0.18 }, // 書棚
      { shape: 'box', x: 0.6, z: -3.1, hw: 0.8, hd: 0.18 }, // 書棚
    ],
  },
  // サンレモの別荘テラス(第六章・最期)
  // カメラは別荘の壁(z=2.2)より手前(z<2.2)に置く。壁の後ろに置くと
  // 幅16の壁が視界を完全に塞いでしまうため。テラス越しに暗い海と冷たい月を望む。
  'nobel-sanremo': {
    Component: SanRemo,
    bounds: { min: [-3.5, -2.8], max: [3.5, 1.8] },
    cameraZones: [
      {
        min: [-99, -99],
        max: [99, 99],
        camera: [-1.8, 2.7, 1.4],
        lookAtOffset: [0.7, 1.5, -7],
      },
    ],
    background: '#080a10',
    fog: { color: '#080a10', near: 12, far: 60 },
  },
}
