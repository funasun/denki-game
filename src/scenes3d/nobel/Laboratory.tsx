// 一九世紀の化学実験室(様式化ローポリ)。パリのペルーズ研究室、のちの自身の実験室に共用。
// 照明・背景は FateAtmosphere が駆動するので、温もりが高い章では暖かく、低い章では冷たく見える。

function Flask({ position, color = '#bcdfe0' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color={color} transparent opacity={0.55} flatShading />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.2, 8]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} flatShading />
      </mesh>
      {/* 中の液体 */}
      <mesh position={[0, 0.09, 0]}>
        <sphereGeometry args={[0.09, 8, 6]} />
        <meshStandardMaterial color="#c9a24a" emissive="#8a6a1e" emissiveIntensity={0.3} flatShading />
      </mesh>
    </group>
  )
}

function Beaker({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.08, 0.07, 0.2, 10]} />
      <meshStandardMaterial color="#c3dfe2" transparent opacity={0.5} flatShading />
    </mesh>
  )
}

function Workbench({ position, length = 3.2 }: { position: [number, number, number]; length?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[length, 0.1, 0.7]} />
        <meshStandardMaterial color="#6d5a42" flatShading />
      </mesh>
      {[-length / 2 + 0.15, length / 2 - 0.15].map((x) => (
        <mesh key={x} position={[x, 0.42, 0]}>
          <boxGeometry args={[0.1, 0.85, 0.6]} />
          <meshStandardMaterial color="#4f4030" flatShading />
        </mesh>
      ))}
    </group>
  )
}

// 蒸留装置(スタンドに載ったフラスコ + 冷却管 + 受けフラスコ)
function Distiller({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* スタンド */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 6]} />
        <meshStandardMaterial color="#484848" flatShading />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.2]} />
        <meshStandardMaterial color="#3a3a3a" flatShading />
      </mesh>
      <Flask position={[0, 0.1, 0]} color="#cfe6df" />
      {/* 冷却管 */}
      <mesh position={[0.22, 0.34, 0]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 8]} />
        <meshStandardMaterial color="#bcdfe0" transparent opacity={0.5} flatShading />
      </mesh>
      <Beaker position={[0.42, 0.1, 0]} />
    </group>
  )
}

function Shelf({ position }: { position: [number, number, number] }) {
  const bottles: [number, string][] = [
    [-0.5, '#7a5030'],
    [-0.2, '#3a5a6a'],
    [0.1, '#6a3a3a'],
    [0.4, '#4a5a3a'],
    [0.65, '#5a4a6a'],
  ]
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.6, 0.05, 0.3]} />
        <meshStandardMaterial color="#5a4a38" flatShading />
      </mesh>
      {bottles.map(([x, c], i) => (
        <mesh key={i} position={[x, 0.16, 0]}>
          <cylinderGeometry args={[0.05, 0.055, 0.28, 8]} />
          <meshStandardMaterial color={c} flatShading />
        </mesh>
      ))}
    </group>
  )
}

export function Laboratory() {
  return (
    <group>
      {/* 床・壁(冷たい石とプラスター) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#575049" />
      </mesh>
      <mesh position={[0, 3, -3.5]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#6a655c" />
      </mesh>
      <mesh position={[-3.5, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#615c54" />
      </mesh>
      <mesh position={[3.5, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#615c54" />
      </mesh>

      {/* 高い窓(冷たい採光) */}
      <mesh position={[-1.4, 2.2, -3.47]}>
        <planeGeometry args={[1.1, 1.8]} />
        <meshStandardMaterial color="#aebfce" emissive="#9fb2c8" emissiveIntensity={0.45} />
      </mesh>

      {/* 奥の作業台 + ガラス器具 */}
      <Workbench position={[0, 0, -2.9]} length={4.4} />
      <Distiller position={[-1.4, 0.9, -2.9]} />
      <Flask position={[-0.2, 0.9, -2.95]} color="#d5c27a" />
      <Beaker position={[0.4, 1.0, -2.9]} />
      <Flask position={[1.1, 0.9, -2.9]} color="#c3dfe2" />

      {/* 左手の作業台(ニトログリセリンの実験) */}
      <group rotation={[0, Math.PI / 2, 0]} position={[-2.9, 0, 0.2]}>
        <Workbench position={[0, 0, 0]} length={3.0} />
        <Flask position={[-0.6, 0.9, 0]} color="#c9a24a" />
        <Beaker position={[0.2, 1.0, 0]} />
        <Distiller position={[0.8, 0.9, 0]} />
      </group>

      <Shelf position={[1.9, 2.1, -3.3]} />
      <Shelf position={[0.0, 2.4, -3.3]} />

      {/* 丸椅子 */}
      <mesh position={[0.3, 0.5, -1.9]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 12]} />
        <meshStandardMaterial color="#4a3a2a" flatShading />
      </mesh>
      <mesh position={[0.3, 0.25, -1.9]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
        <meshStandardMaterial color="#3a2e22" flatShading />
      </mesh>
    </group>
  )
}
