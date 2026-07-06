import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshStandardMaterial, PointLight } from 'three'

// シュヴァルツシュパニアハウスの病室(1827年3月、嵐の夜)
export function DeathRoom() {
  const wall = '#3c352c'
  const floor = '#3a2c1e'
  const flashLight = useRef<PointLight>(null)
  const windowMat = useRef<MeshStandardMaterial>(null)
  const flash = useRef(0)

  // 稲光: ときどき窓が白く瞬く
  useFrame((_, dt) => {
    if (flash.current <= 0 && Math.random() < dt * 0.22) {
      flash.current = 0.5 + Math.random() * 0.4
    }
    flash.current = Math.max(0, flash.current - dt * 1.8)
    const f = flash.current > 0.35 ? (flash.current - 0.35) / 0.55 : flash.current * 0.25
    if (flashLight.current) flashLight.current.intensity = f * 9
    if (windowMat.current) windowMat.current.emissiveIntensity = 0.35 + f * 4
  })

  return (
    <group>
      {/* 床・壁 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={floor} />
      </mesh>
      <mesh position={[0, 3, -3.5]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[-3.5, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[3.5, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color={wall} />
      </mesh>

      {/* 窓(嵐)*/}
      <mesh position={[0.5, 1.8, -3.47]}>
        <planeGeometry args={[1.3, 1.5]} />
        <meshStandardMaterial
          ref={windowMat}
          color="#1c2436"
          emissive="#b8c8ea"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0.5, 1.8, -3.45]}>
        <boxGeometry args={[1.4, 0.06, 0.04]} />
        <meshStandardMaterial color="#4a3826" />
      </mesh>
      <mesh position={[0.5, 1.8, -3.45]}>
        <boxGeometry args={[0.06, 1.6, 0.04]} />
        <meshStandardMaterial color="#4a3826" />
      </mesh>
      <pointLight ref={flashLight} position={[0.5, 2, -2.8]} intensity={0} color="#cdd8f2" distance={12} />

      {/* 病床(大きな寝台) */}
      <group position={[-1.7, 0, -1.2]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[1.3, 0.4, 2.3]} />
          <meshStandardMaterial color="#54422e" flatShading />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <boxGeometry args={[1.2, 0.16, 2.2]} />
          <meshStandardMaterial color="#8e7d5e" flatShading />
        </mesh>
        {/* 掛布の盛り上がり(横たわる人) */}
        <mesh position={[0, 0.7, 0.1]} scale={[0.45, 0.18, 0.95]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#7d6c4e" flatShading />
        </mesh>
        <mesh position={[0, 0.72, -0.85]}>
          <sphereGeometry args={[0.16, 8, 6]} />
          <meshStandardMaterial color="#c9a583" flatShading />
        </mesh>
        {/* 頭板 */}
        <mesh position={[0, 0.85, -1.2]}>
          <boxGeometry args={[1.3, 0.9, 0.08]} />
          <meshStandardMaterial color="#463522" flatShading />
        </mesh>
      </group>

      {/* 枕元の小机(楽譜の束) */}
      <group position={[-2.6, 0, 0.5]}>
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[0.6, 0.06, 0.5]} />
          <meshStandardMaterial color="#4a3826" flatShading />
        </mesh>
        <mesh position={[0, 0.33, 0]}>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
          <meshStandardMaterial color="#3a2c1c" flatShading />
        </mesh>
        {[0, 0.03, 0.06].map((y, i) => (
          <mesh key={i} position={[0.03 * i - 0.03, 0.66 + y, 0]} rotation={[-Math.PI / 2, 0, 0.2 * i]}>
            <planeGeometry args={[0.3, 0.4]} />
            <meshStandardMaterial color="#ddd2b0" />
          </mesh>
        ))}
      </group>

      {/* ワインの木箱(届いたばかりの贈り物) */}
      <group position={[2.0, 0, 1.7]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.7, 0.44, 0.5]} />
          <meshStandardMaterial color="#7a6240" flatShading />
        </mesh>
        <mesh position={[0, 0.46, 0.1]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.66, 0.05, 0.44]} />
          <meshStandardMaterial color="#8a7050" flatShading />
        </mesh>
        <mesh position={[-0.12, 0.52, -0.05]} rotation={[0, 0, 0.25]}>
          <cylinderGeometry args={[0.05, 0.06, 0.32, 7]} />
          <meshStandardMaterial color="#2c3a28" flatShading />
        </mesh>
      </group>

      {/* 蝋燭 */}
      <mesh position={[-2.6, 0.72, 0.35]}>
        <cylinderGeometry args={[0.022, 0.028, 0.12, 6]} />
        <meshStandardMaterial color="#e8dcb8" />
      </mesh>
      <mesh position={[-2.6, 0.8, 0.35]}>
        <sphereGeometry args={[0.026, 6, 6]} />
        <meshStandardMaterial color="#ffca66" emissive="#ff9c30" emissiveIntensity={2.2} />
      </mesh>

      {/* 照明 */}
      <ambientLight intensity={0.7} color="#8a94b8" />
      <pointLight position={[-2.4, 1.3, 0.4]} intensity={5} color="#ffb050" distance={9} decay={1.6} />
      <directionalLight position={[2, 4, -3]} intensity={0.35} color="#7688c0" />
    </group>
  )
}
