import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Billboard } from '@react-three/drei'
import { Figure } from './Figure'
import type { SceneFigure } from '../types'

// ビートのデータ(SceneFigure)で置かれる、名札つきのNPC。
// 体は Player と同じ様式化人形(Figure)を使い回し、頭上に小さな名札を浮かべる。
// 名札は常時表示 ── 「この場面に誰がいるのか」をひと目で分からせるため。
// (drei <Html> はポータルの取り付けが初回マウント時に不安定だったため、
//  名札は Canvas 2D で描いたテクスチャの板として WebGL 内に出す)

const PLATE_H = 88 // テクスチャの高さ(px)
const PLATE_WORLD_H = 0.24 // 名札の世界座標での高さ

function makeNamePlate(name: string): { texture: THREE.CanvasTexture; aspect: number } {
  const dpr = 2
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const font = `500 ${44 * dpr}px "Hiragino Sans", "Yu Gothic", sans-serif`
  ctx.font = font
  const textW = ctx.measureText(name).width
  const padX = 28 * dpr
  const w = Math.ceil(textW + padX * 2)
  const h = PLATE_H * dpr
  canvas.width = w
  canvas.height = h

  // 下地: 角丸の暗色プレート + 細い縁取り(roundRect 非対応の古い環境は四角で代用)
  const r = 18 * dpr
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(1 * dpr, 1 * dpr, w - 2 * dpr, h - 2 * dpr, r)
  } else {
    ctx.rect(1 * dpr, 1 * dpr, w - 2 * dpr, h - 2 * dpr)
  }
  ctx.fillStyle = 'rgba(22, 17, 12, 0.78)'
  ctx.fill()
  ctx.lineWidth = 2 * dpr
  ctx.strokeStyle = 'rgba(232, 224, 204, 0.42)'
  ctx.stroke()

  ctx.font = font
  ctx.fillStyle = '#e8e0cc'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name, w / 2, h / 2 + 2 * dpr)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  return { texture, aspect: w / h }
}

function NamePlate({ name, y }: { name: string; y: number }) {
  const plate = useMemo(() => makeNamePlate(name), [name])
  useEffect(() => () => plate.texture.dispose(), [plate])
  return (
    <Billboard position={[0, y, 0]}>
      <mesh renderOrder={5}>
        <planeGeometry args={[PLATE_WORLD_H * plate.aspect, PLATE_WORLD_H]} />
        <meshBasicMaterial
          map={plate.texture}
          transparent
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  )
}

export function NpcFigure({ def }: { def: SceneFigure }) {
  const s = def.scale ?? 1
  return (
    <group position={def.position} rotation={[0, def.facing ?? 0, 0]}>
      <group scale={s}>
        <Figure coat={def.coat} skin={def.skin} hair={def.hair} trousers={def.trousers} />
      </group>
      {def.name && <NamePlate name={def.name} y={1.95 * s} />}
    </group>
  )
}
