// ストックホルム郊外ヘレネボリ、水辺のニトログリセリン実験工場(一八六四年)。
// wrecked=true で、爆発後の焼け跡になる。屋外なので FateAtmosphere のフォグが効く。

interface HeleneborgProps {
  wrecked?: boolean
}

function Barrel({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.3, 0.3, 0.7, 12]} />
      <meshStandardMaterial color="#6a4e2e" flatShading />
    </mesh>
  )
}

function Crate({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#7a6242" flatShading />
    </mesh>
  )
}

export function Heleneborg({ wrecked = false }: HeleneborgProps) {
  const ground = wrecked ? '#3f3a30' : '#5c6340'
  return (
    <group>
      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={ground} />
      </mesh>
      {/* 水面(奥) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -22]}>
        <planeGeometry args={[70, 30]} />
        <meshStandardMaterial color="#41566a" />
      </mesh>

      {/* 桟橋 */}
      {[-15, -16.6, -18.2].map((z) => (
        <mesh key={z} position={[0, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 1.3]} />
          <meshStandardMaterial color="#5a4a34" flatShading />
        </mesh>
      ))}

      {!wrecked ? (
        <>
          {/* 実験小屋(健在) */}
          <group position={[0, 0, -12.5]}>
            {/* 壁 */}
            <mesh position={[0, 1.0, -1.3]} castShadow>
              <boxGeometry args={[3.2, 2.0, 0.12]} />
              <meshStandardMaterial color="#7c6748" flatShading />
            </mesh>
            <mesh position={[-1.6, 1.0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[2.6, 2.0, 0.12]} />
              <meshStandardMaterial color="#6f5c40" flatShading />
            </mesh>
            <mesh position={[1.6, 1.0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[2.6, 2.0, 0.12]} />
              <meshStandardMaterial color="#6f5c40" flatShading />
            </mesh>
            {/* 屋根 */}
            <mesh position={[0, 2.25, -0.65]} rotation={[0.3, 0, 0]} castShadow>
              <boxGeometry args={[3.5, 0.12, 2.4]} />
              <meshStandardMaterial color="#4f4030" flatShading />
            </mesh>
          </group>
          <Barrel position={[-2.4, 0.35, -10]} />
          <Barrel position={[-2.0, 0.35, -10.7]} />
          <Crate position={[2.2, 0.3, -9.5]} />
          <Crate position={[2.5, 0.3, -10.4]} />
          {/* エミールなどの人物はビートのデータ(figures)が置く */}
        </>
      ) : (
        <>
          {/* 焼け跡(倒壊した小屋・散乱する残骸・焦げ) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -12]}>
            <circleGeometry args={[3.4, 20]} />
            <meshStandardMaterial color="#241f18" />
          </mesh>
          {/* 崩れた壁材 */}
          <mesh position={[-0.8, 0.2, -12]} rotation={[0.1, 0.4, 1.2]}>
            <boxGeometry args={[2.6, 1.6, 0.12]} />
            <meshStandardMaterial color="#3f342440" flatShading />
          </mesh>
          <mesh position={[1.2, 0.15, -11.4]} rotation={[1.4, 0.2, 0.3]}>
            <boxGeometry args={[2.2, 1.4, 0.12]} />
            <meshStandardMaterial color="#4a3c28" flatShading />
          </mesh>
          {/* 飛散した残骸 */}
          {[
            [-2.2, -9.5, 0.6], [1.9, -10.2, 1.1], [-1.4, -13.2, 0.4], [2.3, -12.6, 0.8], [0.4, -9.0, 0.5],
          ].map(([x, z, r], i) => (
            <Crate key={i} position={[x, 0.15, z]} rotation={[r, r * 1.6, r * 0.7]} />
          ))}
          {/* 立ちのぼる煙 */}
          {[
            [0, 2.4, -12, 1.2], [0.5, 3.4, -12.3, 1.6], [-0.4, 4.4, -11.8, 2.0],
          ].map(([x, y, z, s], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[s, 8, 6]} />
              <meshStandardMaterial color="#2a2723" transparent opacity={0.45} flatShading />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}
