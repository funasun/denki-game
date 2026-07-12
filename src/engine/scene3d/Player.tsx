import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils, Vector3 } from 'three'
import { playerPos } from './playerRef'
import { Figure } from './Figure'
import { audio } from '../audio/AudioEngine'
import type { Obstacle } from '../types'

interface PlayerProps {
  spawn: [number, number, number]
  bounds: { min: [number, number]; max: [number, number] }
  enabled: boolean
  obstacles?: Obstacle[]
}

const keys = new Set<string>()
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => keys.add(e.code))
  window.addEventListener('keyup', (e) => keys.delete(e.code))
  window.addEventListener('blur', () => keys.clear())
}

const SPEED = 2.4
// プレイヤーの足元の半径。この分だけ障害物から余白を取り、体がめり込まないようにする
const PLAYER_RADIUS = 0.26

// 点 (x,z) がいずれかの障害物(プレイヤー半径ぶん膨らませたもの)の内側かどうか
function blocked(x: number, z: number, obstacles: Obstacle[] | undefined): boolean {
  if (!obstacles) return false
  for (const o of obstacles) {
    if (o.shape === 'box') {
      if (Math.abs(x - o.x) < o.hw + PLAYER_RADIUS && Math.abs(z - o.z) < o.hd + PLAYER_RADIUS) {
        return true
      }
    } else {
      const dx = x - o.x
      const dz = z - o.z
      const rr = o.r + PLAYER_RADIUS
      if (dx * dx + dz * dz < rr * rr) return true
    }
  }
  return false
}

export function Player({ spawn, bounds, enabled, obstacles }: PlayerProps) {
  const group = useRef<Group>(null)
  const dir = useRef(new Vector3())
  const heading = useRef(0)
  const stepTimer = useRef(0)

  useEffect(() => {
    playerPos.set(...spawn)
    if (group.current) group.current.position.set(...spawn)
  }, [spawn])

  useFrame((_, rawDt) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(rawDt, 0.05)
    const d = dir.current
    d.set(0, 0, 0)
    if (enabled) {
      if (keys.has('KeyW') || keys.has('ArrowUp')) d.z -= 1
      if (keys.has('KeyS') || keys.has('ArrowDown')) d.z += 1
      if (keys.has('KeyA') || keys.has('ArrowLeft')) d.x -= 1
      if (keys.has('KeyD') || keys.has('ArrowRight')) d.x += 1
    }
    const pressing = d.lengthSq() > 0
    if (pressing) {
      d.normalize().multiplyScalar(SPEED * dt)
      const startX = g.position.x
      const startZ = g.position.z
      // 万一すでに障害物の内側にいる場合は判定を無効化して抜け出せるようにする
      const stuck = blocked(startX, startZ, obstacles)
      // 軸ごとに判定し、片側が壁でももう片側は動けるように(壁沿いのスライド)
      let nx = MathUtils.clamp(startX + d.x, bounds.min[0], bounds.max[0])
      if (!stuck && blocked(nx, startZ, obstacles)) nx = startX
      let nz = MathUtils.clamp(startZ + d.z, bounds.min[1], bounds.max[1])
      if (!stuck && blocked(nx, nz, obstacles)) nz = startZ
      g.position.x = nx
      g.position.z = nz
      const movedSq = (nx - startX) ** 2 + (nz - startZ) ** 2
      // 向きは入力方向へ(壁で止まってもそちらを向く)
      const target = Math.atan2(d.x, d.z)
      let diff = target - heading.current
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      heading.current += diff * Math.min(1, dt * 10)
      g.rotation.y = heading.current
      if (movedSq > 1e-6) {
        stepTimer.current -= dt
        if (stepTimer.current <= 0) {
          audio.footstep()
          stepTimer.current = 0.38
        }
        // 歩行の上下動
        g.position.y = Math.abs(Math.sin(performance.now() / 130)) * 0.035
      } else {
        g.position.y = 0
      }
    } else {
      g.position.y = 0
      stepTimer.current = 0.1
    }
    playerPos.copy(g.position)
  })

  return (
    <group ref={group} position={spawn}>
      <Figure />
    </group>
  )
}
