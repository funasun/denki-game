import { useEffect, useId, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { DoubleSide, Mesh, MeshBasicMaterial } from 'three'
import { interactClaims, isNearestClaim, playerPos } from './playerRef'

// 見た目の格: required(章の目あて=金) / optional(寄り道=くすんだ緑白) / exit(次へ進む=生成り)
type Variant = 'required' | 'optional' | 'exit'

const PALETTE: Record<Variant, { color: string; emissive: string }> = {
  required: { color: '#d8b45a', emissive: '#a8842a' },
  optional: { color: '#aeb6a4', emissive: '#5d6656' },
  exit: { color: '#e8e0cc', emissive: '#b3a583' },
}

interface InteractableProps {
  label: string
  position: [number, number, number]
  radius?: number
  done?: boolean
  enabled: boolean
  variant?: Variant
  onTrigger: () => void
}

export function Interactable({
  label,
  position,
  radius = 1.6,
  done = false,
  enabled,
  variant = 'required',
  onTrigger,
}: InteractableProps) {
  const [near, setNear] = useState(false)
  const marker = useRef<Mesh>(null)
  const ringMat = useRef<MeshBasicMaterial>(null)
  const pal = PALETTE[variant]
  const claimId = useId()

  // アンマウント時に近接調停の登録を外す
  useEffect(() => {
    return () => {
      delete interactClaims[claimId]
    }
  }, [claimId])

  // 目印の柱(光の筋)。人物と重なる持ち上げ位置(y>0.3)では体を貫くので出さない
  const lifted = position[1] > 0.3
  const beamTop = position[1] + 1.2

  useFrame(({ clock }) => {
    const dx = playerPos.x - position[0]
    const dz = playerPos.z - position[2]
    const d2 = dx * dx + dz * dz
    const inRange = d2 < radius * radius && enabled && !done
    // 対話圏が重なったときは、いちばん近い一つだけが近接扱い(プロンプト・Eキー)になる
    interactClaims[claimId] = inRange ? d2 : Infinity
    const isNear = inRange && isNearestClaim(claimId, d2)
    if (isNear !== near) setNear(isNear)
    if (marker.current) {
      marker.current.position.y = position[1] + 1.35 + Math.sin(clock.elapsedTime * 2.2) * 0.07
      marker.current.rotation.y = clock.elapsedTime * 1.2
    }
    if (ringMat.current) {
      const pulse = 0.5 + Math.sin(clock.elapsedTime * 2.4) * 0.5
      ringMat.current.opacity = (near ? 0.42 : 0.16) + pulse * (near ? 0.2 : 0.08)
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
        <>
          <mesh
            ref={marker}
            position={[position[0], position[1] + 1.35, position[2]]}
            onClick={() => active && onTrigger()}
          >
            <octahedronGeometry args={[variant === 'exit' ? 0.13 : 0.1]} />
            <meshStandardMaterial
              color={pal.color}
              emissive={pal.emissive}
              emissiveIntensity={near ? 1.4 : 0.6}
            />
          </mesh>
          {/* 立ち位置を示す床の輪(遠くからでも見つけられるように) */}
          <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.24, 0.34, 28]} />
            <meshBasicMaterial
              ref={ringMat}
              color={pal.color}
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
          {/* 床から目印へ立ちのぼる淡い光の筋 */}
          {!lifted && (
            <mesh position={[position[0], beamTop / 2 + 0.05, position[2]]}>
              <cylinderGeometry args={[0.02, 0.06, beamTop, 6, 1, true]} />
              <meshBasicMaterial
                color={pal.color}
                transparent
                opacity={near ? 0.22 : 0.12}
                depthWrite={false}
                side={DoubleSide}
              />
            </mesh>
          )}
        </>
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
