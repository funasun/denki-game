import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils, Vector3 } from 'three'
import { playerPos } from './playerRef'
import { Figure } from './Figure'
import { audio } from '../audio/AudioEngine'

interface PlayerProps {
  spawn: [number, number, number]
  bounds: { min: [number, number]; max: [number, number] }
  enabled: boolean
}

const keys = new Set<string>()
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => keys.add(e.code))
  window.addEventListener('keyup', (e) => keys.delete(e.code))
  window.addEventListener('blur', () => keys.clear())
}

const SPEED = 2.4

export function Player({ spawn, bounds, enabled }: PlayerProps) {
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
    const moving = d.lengthSq() > 0
    if (moving) {
      d.normalize().multiplyScalar(SPEED * dt)
      g.position.add(d)
      g.position.x = MathUtils.clamp(g.position.x, bounds.min[0], bounds.max[0])
      g.position.z = MathUtils.clamp(g.position.z, bounds.min[1], bounds.max[1])
      const target = Math.atan2(d.x, d.z)
      let diff = target - heading.current
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      heading.current += diff * Math.min(1, dt * 10)
      g.rotation.y = heading.current
      stepTimer.current -= dt
      if (stepTimer.current <= 0) {
        audio.footstep()
        stepTimer.current = 0.38
      }
      // 歩行の上下動
      g.position.y = Math.abs(Math.sin(performance.now() / 130)) * 0.035
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
