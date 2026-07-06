// ハイリゲンシュタットの借家の一室(様式化ローポリ、プリミティブ構築)
interface RoomProps {
  night?: boolean
}

function Pianoforte() {
  return (
    <group position={[-1.9, 0, -1.6]} rotation={[0, Math.PI / 2, 0]}>
      {/* 本体 */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.9, 0.28, 0.72]} />
        <meshStandardMaterial color="#3d2a1a" flatShading />
      </mesh>
      {/* 鍵盤 */}
      <mesh position={[0, 0.92, 0.28]}>
        <boxGeometry args={[1.5, 0.05, 0.18]} />
        <meshStandardMaterial color="#e6ddc4" flatShading />
      </mesh>
      <mesh position={[0, 0.955, 0.24]}>
        <boxGeometry args={[1.3, 0.03, 0.07]} />
        <meshStandardMaterial color="#1c1712" flatShading />
      </mesh>
      {/* 脚 */}
      {[-0.8, 0.8].map((x) =>
        [-0.25, 0.25].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.3, z]}>
            <cylinderGeometry args={[0.045, 0.06, 0.6, 6]} />
            <meshStandardMaterial color="#2c1e12" flatShading />
          </mesh>
        )),
      )}
      {/* 椅子 */}
      <mesh position={[0, 0.32, 0.75]}>
        <boxGeometry args={[0.55, 0.1, 0.35]} />
        <meshStandardMaterial color="#4a3320" flatShading />
      </mesh>
    </group>
  )
}

function Desk() {
  return (
    <group position={[1.9, 0, -1.9]} rotation={[0, -0.5, 0]}>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[1.1, 0.07, 0.65]} />
        <meshStandardMaterial color="#4a3320" flatShading />
      </mesh>
      {[-0.45, 0.45].map((x) =>
        [-0.22, 0.22].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.36, z]}>
            <boxGeometry args={[0.06, 0.72, 0.06]} />
            <meshStandardMaterial color="#3a2818" flatShading />
          </mesh>
        )),
      )}
      {/* 書きかけの紙 */}
      <mesh position={[0.05, 0.765, 0.05]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <planeGeometry args={[0.32, 0.42]} />
        <meshStandardMaterial color="#e9e0c8" />
      </mesh>
      {/* インク壺 */}
      <mesh position={[-0.35, 0.79, -0.15]}>
        <cylinderGeometry args={[0.04, 0.05, 0.08, 8]} />
        <meshStandardMaterial color="#20242c" flatShading />
      </mesh>
    </group>
  )
}

function Bed() {
  return (
    <group position={[2.4, 0, 1.6]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.0, 0.35, 2.0]} />
        <meshStandardMaterial color="#6c5a40" flatShading />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.94, 0.14, 1.9]} />
        <meshStandardMaterial color="#a89778" flatShading />
      </mesh>
      <mesh position={[0, 0.58, -0.7]}>
        <boxGeometry args={[0.7, 0.12, 0.4]} />
        <meshStandardMaterial color="#ddd2b8" flatShading />
      </mesh>
    </group>
  )
}

export function HeiligenstadtRoom({ night = false }: RoomProps) {
  const wall = night ? '#4d4436' : '#b0a184'
  const floor = night ? '#463424' : '#7a5a3d'
  const windowLight = night ? '#2a3550' : '#cfe4ee'

  return (
    <group>
      {/* 床・壁 — カメラが部屋の外にあるため、視錐台の隅から背景が漏れないよう大きめに張る */}
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
      {/* 窓(奥の壁) */}
      <mesh position={[0.8, 1.7, -3.47]}>
        <planeGeometry args={[1.2, 1.4]} />
        <meshStandardMaterial
          color={windowLight}
          emissive={windowLight}
          emissiveIntensity={night ? 0.25 : 0.55}
        />
      </mesh>
      <mesh position={[0.8, 1.7, -3.45]}>
        <boxGeometry args={[1.3, 0.06, 0.04]} />
        <meshStandardMaterial color="#5a452e" />
      </mesh>
      <mesh position={[0.8, 1.7, -3.45]}>
        <boxGeometry args={[0.06, 1.5, 0.04]} />
        <meshStandardMaterial color="#5a452e" />
      </mesh>

      <Pianoforte />
      <Desk />
      <Bed />

      {/* 敷物 */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.3, 16]} />
        <meshStandardMaterial color={night ? '#503c2c' : '#8d6b45'} />
      </mesh>

      {/* 照明 */}
      <ambientLight intensity={night ? 0.25 : 0.55} color={night ? '#7a86b0' : '#fff2dc'} />
      <directionalLight
        position={[1.5, 3, -1]}
        intensity={night ? 0.15 : 1.1}
        color={night ? '#8898c8' : '#ffe8c0'}
        castShadow
      />
      {night && (
        <>
          {/* 机上の蝋燭 */}
          <mesh position={[1.75, 0.83, -1.75]}>
            <cylinderGeometry args={[0.025, 0.03, 0.14, 6]} />
            <meshStandardMaterial color="#e8dcb8" />
          </mesh>
          <mesh position={[1.75, 0.93, -1.75]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#ffca66" emissive="#ff9c30" emissiveIntensity={2.5} />
          </mesh>
          <pointLight position={[1.75, 1.1, -1.6]} intensity={2.2} color="#ffb050" distance={5} />
        </>
      )}
    </group>
  )
}
