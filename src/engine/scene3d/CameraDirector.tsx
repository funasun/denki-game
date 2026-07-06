import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { CameraZone } from '../types'
import { playerPos } from './playerRef'

// ぼくのなつやすみ型: プレイヤー位置が属するゾーンの固定カメラへ滑らかに切り替え、
// カメラは動かずプレイヤーを見つめる(ゾーン間はダンピング移動)
export function CameraDirector({ zones }: { zones: CameraZone[] }) {
  const targetPos = useRef(new Vector3(...zones[0].camera))
  const lookAt = useRef(new Vector3())

  useFrame((state, dt) => {
    const { camera } = state
    if (import.meta.env.DEV) (window as unknown as { __three?: unknown }).__three = state
    let zone = zones[0]
    for (const z of zones) {
      if (
        playerPos.x >= z.min[0] &&
        playerPos.x <= z.max[0] &&
        playerPos.z >= z.min[1] &&
        playerPos.z <= z.max[1]
      ) {
        zone = z
        break
      }
    }
    targetPos.current.set(...zone.camera)
    camera.position.lerp(targetPos.current, Math.min(1, dt * 2.2))
    const off = zone.lookAtOffset ?? [0, 1, 0]
    lookAt.current.set(playerPos.x + off[0], playerPos.y + off[1], playerPos.z + off[2])
    camera.lookAt(lookAt.current)
  })

  return null
}
