// ボンからウィーンへの街道(晩秋)── 休憩中の駅馬車と、遠くの帝都
function AutumnTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.17, 1.6, 6]} />
        <meshStandardMaterial color="#4f3d2a" flatShading />
      </mesh>
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.9, 8, 6]} />
        <meshStandardMaterial color="#a0722e" flatShading />
      </mesh>
      <mesh position={[0.45, 1.55, 0.2]}>
        <sphereGeometry args={[0.55, 7, 5]} />
        <meshStandardMaterial color="#b08838" flatShading />
      </mesh>
    </group>
  )
}

function Coach() {
  return (
    <group position={[1.9, 0, -6]} rotation={[0, 0.15, 0]}>
      {/* 車体 */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[1.1, 1.0, 2.0]} />
        <meshStandardMaterial color="#3a4050" flatShading />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <boxGeometry args={[1.16, 0.14, 2.1]} />
        <meshStandardMaterial color="#23262e" flatShading />
      </mesh>
      {/* 窓 */}
      <mesh position={[-0.56, 1.15, -0.35]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.45, 0.45]} />
        <meshStandardMaterial color="#8a8468" />
      </mesh>
      {/* 車輪 */}
      {([[-0.62, 0.42, 0.8, 0.42], [-0.62, 0.5, -0.75, 0.5], [0.62, 0.42, 0.8, 0.42], [0.62, 0.5, -0.75, 0.5]] as const).map(
        ([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[r, r, 0.08, 12]} />
            <meshStandardMaterial color="#5a4526" flatShading />
          </mesh>
        ),
      )}
      {/* 屋根の荷物 */}
      <mesh position={[0.1, 1.82, 0.3]}>
        <boxGeometry args={[0.5, 0.3, 0.7]} />
        <meshStandardMaterial color="#6e5638" flatShading />
      </mesh>
      {/* 轅(ながえ) */}
      <mesh position={[0, 0.55, -1.7]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 5]} />
        <meshStandardMaterial color="#4f3d2a" flatShading />
      </mesh>
    </group>
  )
}

export function ViennaRoad() {
  const trees: Array<[number, number, number, number]> = [
    [-6, 0, -2, 1.1], [6.5, 0, -9, 1.2], [-7.5, 0, -13, 1.4], [7, 0, -18, 1.0],
    [-5.5, 0, -19, 1.1], [-9, 0, -6, 0.9], [9, 0, -13, 1.2],
  ]
  return (
    <group>
      {/* 晩秋の野 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -12]} receiveShadow>
        <planeGeometry args={[70, 80]} />
        <meshStandardMaterial color="#9a8f56" />
      </mesh>
      {/* 街道 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -11]}>
        <planeGeometry args={[2.8, 34]} />
        <meshStandardMaterial color="#a89272" />
      </mesh>
      {/* 轍 */}
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, -11]}>
          <planeGeometry args={[0.14, 34]} />
          <meshStandardMaterial color="#8a7458" />
        </mesh>
      ))}

      {/* 遠景: なだらかな丘と、地平のウィーン(尖塔のシルエット) */}
      <mesh position={[-16, -1.8, -32]} scale={[15, 5, 10]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#8c8455" flatShading />
      </mesh>
      <mesh position={[15, -2.2, -35]} scale={[17, 6, 12]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#847c50" flatShading />
      </mesh>
      <group position={[2, 0, -42]}>
        {([[-3.5, 1.1, 2.2], [-1.8, 1.5, 3.0], [0.6, 1.2, 2.4], [2.4, 0.9, 1.8], [4.2, 1.3, 2.6]] as const).map(
          ([x, h], i) => (
            <mesh key={i} position={[x, h / 2, 0]}>
              <boxGeometry args={[1.6, h, 1.6]} />
              <meshStandardMaterial color="#7d7f88" flatShading />
            </mesh>
          ),
        )}
        {/* 大聖堂の尖塔 */}
        <mesh position={[0.6, 3.4, 0]}>
          <coneGeometry args={[0.55, 4.2, 6]} />
          <meshStandardMaterial color="#6d707c" flatShading />
        </mesh>
      </group>

      {trees.map(([x, y, z, s], i) => (
        <AutumnTree key={i} position={[x, y, z]} scale={s} />
      ))}

      <Coach />

      {/* 道標 */}
      <group position={[-1.5, 0, -10]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 1.1, 6]} />
          <meshStandardMaterial color="#6e5638" flatShading />
        </mesh>
        <mesh position={[0.18, 0.95, 0]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.7, 0.16, 0.05]} />
          <meshStandardMaterial color="#8a7050" flatShading />
        </mesh>
      </group>

      {/* 御者などの人物はビートのデータ(figures)が置く */}

      {/* 照明(晩秋の低い陽) */}
      <ambientLight intensity={0.55} color="#f2e6c8" />
      <directionalLight position={[-8, 9, 6]} intensity={1.0} color="#f0d8a0" castShadow />
    </group>
  )
}
