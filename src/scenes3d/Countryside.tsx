import { Figure } from '../engine/scene3d/Figure'

// ハイリゲンシュタット郊外の小道(様式化: 平原・小川・木立・遠い丘)
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.6, 6]} />
        <meshStandardMaterial color="#5a4430" flatShading />
      </mesh>
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.95, 8, 6]} />
        <meshStandardMaterial color="#5d7a3e" flatShading />
      </mesh>
      <mesh position={[0.5, 1.6, 0.2]}>
        <sphereGeometry args={[0.6, 7, 5]} />
        <meshStandardMaterial color="#6b8a48" flatShading />
      </mesh>
    </group>
  )
}

function Hill({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 12, 8]} />
      <meshStandardMaterial color="#87a35e" flatShading />
    </mesh>
  )
}

export function Countryside() {
  const trees: Array<[number, number, number, number]> = [
    [-6, 0, -3, 1.1], [7, 0, -6, 1.3], [-8, 0, -12, 1.5], [6.5, 0, -15, 1.0],
    [-5.5, 0, -20, 1.2], [8, 0, -22, 1.4], [-9, 0, -7, 0.9], [9, 0, -11, 1.1],
  ]
  return (
    <group>
      {/* 草原 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -12]} receiveShadow>
        <planeGeometry args={[70, 80]} />
        <meshStandardMaterial color="#7fa05a" />
      </mesh>
      {/* 小道 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -11]}>
        <planeGeometry args={[2.4, 34]} />
        <meshStandardMaterial color="#b09a6e" />
      </mesh>
      {/* 小川(左手) */}
      <mesh rotation={[-Math.PI / 2, 0, 0.08]} position={[-3.6, 0.015, -12]}>
        <planeGeometry args={[1.6, 36]} />
        <meshStandardMaterial color="#6f9fb8" />
      </mesh>
      {/* 遠景の丘 */}
      <Hill position={[-18, -1.5, -30]} scale={[14, 5, 10]} />
      <Hill position={[16, -2, -34]} scale={[16, 6, 12]} />
      <Hill position={[0, -2.5, -45]} scale={[24, 8, 12]} />

      {trees.map(([x, y, z, s], i) => (
        <Tree key={i} position={[x, y, z]} scale={s} />
      ))}

      {/* 柵 */}
      {[-2, -6, -10, -14, -18].map((z) => (
        <group key={z} position={[2.6, 0, z]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.8, 5]} />
            <meshStandardMaterial color="#6e5638" flatShading />
          </mesh>
          <mesh position={[0, 0.62, -2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 4, 5]} />
            <meshStandardMaterial color="#6e5638" flatShading />
          </mesh>
        </group>
      ))}

      {/* 弟子リース(同行者) */}
      <group position={[0.9, 0, -13.5]} rotation={[0, Math.PI, 0]}>
        <Figure coat="#5a4a6a" hair="#7a5c38" />
      </group>

      {/* 遠くの羊飼いと羊(笛の主) */}
      <group position={[-11, 0, -26]}>
        <Figure coat="#8a7a58" />
        {[[-1.2, 0.8], [0.9, 1.4], [-0.3, 2.0]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.3, z]}>
            <sphereGeometry args={[0.32, 7, 5]} />
            <meshStandardMaterial color="#e4ddd0" flatShading />
          </mesh>
        ))}
      </group>

      {/* 照明(午後の柔らかい光) */}
      <ambientLight intensity={0.6} color="#fff4e0" />
      <directionalLight position={[10, 14, 5]} intensity={1.2} color="#ffe9c4" castShadow />
    </group>
  )
}
