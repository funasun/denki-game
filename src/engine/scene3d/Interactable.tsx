import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Mesh } from 'three'
import { playerPos } from './playerRef'

interface InteractableProps {
  label: string
  position: [number, number, number]
  radius?: number
  done?: boolean
  enabled: boolean
  onTrigger: () => void
}

export function Interactable({
  label,
  position,
  radius = 1.6,
  done = false,
  enabled,
  onTrigger,
}: InteractableProps) {
  const [near, setNear] = useState(false)
  const marker = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    const dx = playerPos.x - position[0]
    const dz = playerPos.z - position[2]
    const isNear = dx * dx + dz * dz < radius * radius
    if (isNear !== near) setNear(isNear)
    if (marker.current) {
      marker.current.position.y = position[1] + 1.35 + Math.sin(clock.elapsedTime * 2.2) * 0.07
      marker.current.rotation.y = clock.elapsedTime * 1.2
    }
  })

  const active = near && enabled && !done
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') onTrigger()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onTrigger])

  return (
    <group>
      {!done && (
        <mesh
          ref={marker}
          position={[position[0], position[1] + 1.35, position[2]]}
          onClick={() => active && onTrigger()}
        >
          <octahedronGeometry args={[0.09]} />
          <meshStandardMaterial
            color="#d8b45a"
            emissive="#a8842a"
            emissiveIntensity={near ? 1.4 : 0.5}
          />
        </mesh>
      )}
      {active && (
        <Html position={[position[0], position[1] + 1.7, position[2]]} center zIndexRange={[10, 0]}>
          <button className="interact-prompt" onClick={onTrigger}>
            {label}
          </button>
        </Html>
      )}
    </group>
  )
}
