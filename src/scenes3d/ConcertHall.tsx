import { Figure } from '../engine/scene3d/Figure'

// ウィーンの劇場(アン・デア・ウィーン/ケルントナートーア)── 舞台の上から見た世界
function Musician({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* 座奏の楽員(簡略化した座り姿) */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.5, 6]} />
        <meshStandardMaterial color="#23201c" flatShading />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <sphereGeometry args={[0.11, 8, 6]} />
        <meshStandardMaterial color="#c9a583" flatShading />
      </mesh>
      {/* 譜面台 */}
      <mesh position={[0, 0.5, 0.32]}>
        <cylinderGeometry args={[0.015, 0.015, 0.7, 4]} />
        <meshStandardMaterial color="#3a3128" />
      </mesh>
      <mesh position={[0, 0.88, 0.33]} rotation={[-0.5, 0, 0]}>
        <planeGeometry args={[0.26, 0.2]} />
        <meshStandardMaterial color="#e9e0c8" />
      </mesh>
    </group>
  )
}

export function ConcertHall() {
  const orchestraRows: Array<[number, number, number]> = [
    [-2.6, 0, -2.2], [-1.5, 0, -2.5], [-0.4, 0, -2.7], [0.8, 0, -2.6], [1.9, 0, -2.4], [2.8, 0, -2.1],
    [-2.2, 0, -3.2], [-1.0, 0, -3.5], [0.3, 0, -3.6], [1.5, 0, -3.4], [2.5, 0, -3.1],
  ]
  const audienceRows = [4.6, 5.6, 6.6, 7.6, 8.8]
  return (
    <group>
      {/* 舞台の床 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#6e5334" />
      </mesh>
      {/* 客席の床(一段低い) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 12]}>
        <planeGeometry args={[24, 22]} />
        <meshStandardMaterial color="#332a22" />
      </mesh>
      {/* 舞台の段差 */}
      <mesh position={[0, -0.35, 2.6]}>
        <boxGeometry args={[16, 0.7, 0.3]} />
        <meshStandardMaterial color="#4a3826" flatShading />
      </mesh>

      {/* 奥・左右の壁 */}
      <mesh position={[0, 4, -6.5]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#57402e" />
      </mesh>
      <mesh position={[-8, 4, 4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[36, 10]} />
        <meshStandardMaterial color="#4e3a2a" />
      </mesh>
      <mesh position={[8, 4, 4]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[36, 10]} />
        <meshStandardMaterial color="#4e3a2a" />
      </mesh>
      {/* 奥の壁の柱 */}
      {[-6, -3, 0, 3, 6].map((x) => (
        <mesh key={x} position={[x, 3.2, -6.3]}>
          <boxGeometry args={[0.5, 8, 0.3]} />
          <meshStandardMaterial color="#6a5138" flatShading />
        </mesh>
      ))}

      {/* 指揮台 */}
      <mesh position={[0, 0.09, -1.0]}>
        <boxGeometry args={[0.8, 0.18, 0.8]} />
        <meshStandardMaterial color="#4a3826" flatShading />
      </mesh>

      {/* オーケストラ */}
      {orchestraRows.map(([x, y, z], i) => (
        <Musician key={i} position={[x, y, z]} rotation={((i * 37) % 20) / 40 - 0.25} />
      ))}

      {/* 独唱者たち(舞台の右手前) */}
      <group position={[2.6, 0, -0.9]} rotation={[0, -0.4, 0]}>
        <Figure coat="#6a2f3c" hair="#3a2c1c" />
      </group>
      <group position={[3.2, 0, -1.4]} rotation={[0, -0.3, 0]}>
        <Figure coat="#2c3a55" hair="#26201a" />
      </group>

      {/* 客席(暗がりの人影の列) */}
      {audienceRows.map((z, row) =>
        Array.from({ length: 9 }, (_, i) => i - 4).map((x) => (
          <group key={`${row}-${x}`} position={[x * 1.3 + (row % 2) * 0.5, -0.7, z]}>
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.15, 0.19, 0.55, 5]} />
              <meshStandardMaterial color="#1b1712" flatShading />
            </mesh>
            <mesh position={[0, 0.78, 0]}>
              <sphereGeometry args={[0.1, 6, 5]} />
              <meshStandardMaterial color="#2e2620" flatShading />
            </mesh>
          </group>
        )),
      )}

      {/* シャンデリア */}
      {[[-3, 5.2, 1.5], [3, 5.2, 1.5]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.4, 8, 6]} />
            <meshStandardMaterial color="#ffdf9a" emissive="#ffb84d" emissiveIntensity={1.6} />
          </mesh>
          <pointLight intensity={1.6} color="#ffce80" distance={14} />
        </group>
      ))}

      {/* 舞台前縁の燭台(フットライト) */}
      {[-2.4, -1.2, 0, 1.2, 2.4].map((x) => (
        <mesh key={x} position={[x, 0.12, 2.35]}>
          <sphereGeometry args={[0.05, 6, 5]} />
          <meshStandardMaterial color="#ffca66" emissive="#ff9c30" emissiveIntensity={2} />
        </mesh>
      ))}

      {/* 照明 */}
      <ambientLight intensity={0.4} color="#f4dcb0" />
      <directionalLight position={[0, 8, 6]} intensity={0.7} color="#ffdba0" castShadow />
    </group>
  )
}
