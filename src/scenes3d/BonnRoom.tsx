import { Figure } from '../engine/scene3d/Figure'

// ボン、ボンガッセの生家の屋根裏部屋(夜)── 幼年期の特訓の場
export function BonnRoom() {
  const wall = '#4a4034'
  const floor = '#4f3b28'

  return (
    <group>
      {/* 床・壁(視錐台の隅から背景が漏れないよう大きめ) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={floor} />
      </mesh>
      <mesh position={[0, 3, -3]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[-3, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[3, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color={wall} />
      </mesh>

      {/* クラヴィーア(小ぶりの鍵盤楽器) */}
      <group position={[-1.6, 0, -1.4]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.68, 0]} castShadow>
          <boxGeometry args={[1.5, 0.24, 0.6]} />
          <meshStandardMaterial color="#4a3016" flatShading />
        </mesh>
        <mesh position={[0, 0.82, 0.22]}>
          <boxGeometry args={[1.2, 0.045, 0.16]} />
          <meshStandardMaterial color="#e6ddc4" flatShading />
        </mesh>
        {[-0.6, 0.6].map((x) =>
          [-0.2, 0.2].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0.28, z]}>
              <cylinderGeometry args={[0.04, 0.05, 0.56, 6]} />
              <meshStandardMaterial color="#33220f" flatShading />
            </mesh>
          )),
        )}
        {/* 譜面台の楽譜 */}
        <mesh position={[0, 0.98, -0.1]} rotation={[-0.5, 0, 0]}>
          <planeGeometry args={[0.34, 0.26]} />
          <meshStandardMaterial color="#e9e0c8" />
        </mesh>
        {/* 椅子(踏み台を重ねて) */}
        <mesh position={[0, 0.28, 0.65]}>
          <boxGeometry args={[0.5, 0.09, 0.32]} />
          <meshStandardMaterial color="#4a3320" flatShading />
        </mesh>
        <mesh position={[0, 0.36, 0.65]}>
          <boxGeometry args={[0.34, 0.07, 0.24]} />
          <meshStandardMaterial color="#5c4228" flatShading />
        </mesh>
      </group>

      {/* 祖父の肖像画(奥の壁) */}
      <group position={[-0.9, 1.85, -2.96]}>
        <mesh>
          <boxGeometry args={[0.62, 0.78, 0.05]} />
          <meshStandardMaterial color="#7a5c2c" flatShading />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[0.48, 0.64]} />
          <meshStandardMaterial color="#2c2620" />
        </mesh>
        <mesh position={[0, 0.08, 0.045]}>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshStandardMaterial color="#c9b393" flatShading />
        </mesh>
      </group>

      {/* 窓(月明かり) */}
      <mesh position={[1.4, 1.7, -2.96]}>
        <planeGeometry args={[0.9, 1.1]} />
        <meshStandardMaterial color="#25304a" emissive="#25304a" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.4, 1.7, -2.94]}>
        <boxGeometry args={[1.0, 0.05, 0.04]} />
        <meshStandardMaterial color="#5a452e" />
      </mesh>
      <mesh position={[1.4, 1.7, -2.94]}>
        <boxGeometry args={[0.05, 1.2, 0.04]} />
        <meshStandardMaterial color="#5a452e" />
      </mesh>

      {/* 子ども用の寝床 */}
      <group position={[2.0, 0, 1.5]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.85, 0.28, 1.6]} />
          <meshStandardMaterial color="#5c4a34" flatShading />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.78, 0.12, 1.5]} />
          <meshStandardMaterial color="#98876a" flatShading />
        </mesh>
      </group>

      {/* 父ヨハン(クラヴィーアの傍らに立つ) */}
      <group position={[-0.55, 0, -0.4]} rotation={[0, -Math.PI / 2.6, 0]}>
        <Figure coat="#6a3038" hair="#4a3826" />
      </group>

      {/* 卓上の蝋燭 */}
      <mesh position={[-1.05, 0.84, -1.7]}>
        <cylinderGeometry args={[0.022, 0.028, 0.13, 6]} />
        <meshStandardMaterial color="#e8dcb8" />
      </mesh>
      <mesh position={[-1.05, 0.93, -1.7]}>
        <sphereGeometry args={[0.028, 6, 6]} />
        <meshStandardMaterial color="#ffca66" emissive="#ff9c30" emissiveIntensity={2.5} />
      </mesh>

      {/* 照明(蝋燭+月) */}
      <ambientLight intensity={0.85} color="#9a98b0" />
      <pointLight position={[-1.05, 1.4, -1.4]} intensity={6} color="#ffb050" distance={9} decay={1.6} />
      <directionalLight position={[3, 4, -2]} intensity={0.6} color="#7688c0" castShadow />
    </group>
  )
}
