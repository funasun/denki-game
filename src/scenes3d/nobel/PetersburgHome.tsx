// サンクトペテルブルクのノーベル家の居間(一八四〇年代)。
// 父イマヌエルは機雷でロシア軍に取り入り、一家は束の間の繁栄のなかにあった。
// 「温もり」が最も高い場面 ── 暖炉の火、家族の気配。
// 照明・背景・フォグは FateAtmosphere が受け持つので、この舞台は自前の光を持たない。

function Hearth() {
  return (
    <group position={[-2.4, 0, -3.2]}>
      {/* 炉の石枠 */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[1.6, 1.8, 0.5]} />
        <meshStandardMaterial color="#6a5b4a" flatShading />
      </mesh>
      {/* 火床のくぼみ(暗) */}
      <mesh position={[0, 0.5, 0.22]}>
        <boxGeometry args={[1.0, 0.8, 0.2]} />
        <meshStandardMaterial color="#1a1410" flatShading />
      </mesh>
      {/* 炎(発光。温もりの象徴) */}
      <mesh position={[0, 0.45, 0.3]}>
        <coneGeometry args={[0.28, 0.6, 6]} />
        <meshStandardMaterial color="#ff9d3a" emissive="#ff7a1e" emissiveIntensity={2.4} flatShading />
      </mesh>
      <mesh position={[0, 0.35, 0.34]}>
        <coneGeometry args={[0.18, 0.4, 6]} />
        <meshStandardMaterial color="#ffd066" emissive="#ffb028" emissiveIntensity={2.8} flatShading />
      </mesh>
      {/* 焚き火の暖色ポイント光 */}
      <pointLight position={[0, 0.6, 0.6]} intensity={2.0} color="#ff9a44" distance={5.5} />
      {/* マントルピース */}
      <mesh position={[0, 1.85, 0.08]}>
        <boxGeometry args={[1.9, 0.14, 0.6]} />
        <meshStandardMaterial color="#7a6a56" flatShading />
      </mesh>
    </group>
  )
}

function Table() {
  return (
    <group position={[0.4, 0, -0.4]}>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[1.7, 0.08, 1.0]} />
        <meshStandardMaterial color="#5a3f28" flatShading />
      </mesh>
      {[-0.75, 0.75].map((x) =>
        [-0.4, 0.4].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.36, z]}>
            <boxGeometry args={[0.08, 0.72, 0.08]} />
            <meshStandardMaterial color="#432f1d" flatShading />
          </mesh>
        )),
      )}
      {/* サモワール(ロシアの茶器) */}
      <group position={[0.4, 0.76, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 0.4, 12]} />
          <meshStandardMaterial color="#b08a3c" metalness={0.6} roughness={0.4} flatShading />
        </mesh>
        <mesh position={[0, 0.44, 0]}>
          <sphereGeometry args={[0.12, 10, 8]} />
          <meshStandardMaterial color="#c79a44" metalness={0.6} roughness={0.4} flatShading />
        </mesh>
        <mesh position={[0.2, 0.16, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.02, 0.02, 0.16, 6]} />
          <meshStandardMaterial color="#9a7a34" flatShading />
        </mesh>
      </group>
      {/* 書物(病弱な少年アルフレッドの本) */}
      <mesh position={[-0.5, 0.78, 0.1]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.34, 0.06, 0.24]} />
        <meshStandardMaterial color="#5c2b24" flatShading />
      </mesh>
    </group>
  )
}

function Chair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.44, 0.08, 0.44]} />
        <meshStandardMaterial color="#4a3320" flatShading />
      </mesh>
      <mesh position={[0, 0.72, -0.18]}>
        <boxGeometry args={[0.44, 0.5, 0.06]} />
        <meshStandardMaterial color="#4a3320" flatShading />
      </mesh>
      {[-0.18, 0.18].map((x) =>
        [-0.18, 0.18].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.2, z]}>
            <boxGeometry args={[0.05, 0.42, 0.05]} />
            <meshStandardMaterial color="#3a2818" flatShading />
          </mesh>
        )),
      )}
    </group>
  )
}

export function PetersburgHome() {
  return (
    <group>
      {/* 床・壁 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#4f3a28" />
      </mesh>
      <mesh position={[0, 3, -3.5]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#6a5642" />
      </mesh>
      <mesh position={[-3.5, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#5e4b38" />
      </mesh>
      <mesh position={[3.5, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#5e4b38" />
      </mesh>

      {/* 窓(ペテルブルクの雪。外は冷たい ── 室内の温もりと対比) */}
      <mesh position={[1.7, 1.8, -3.47]}>
        <planeGeometry args={[1.3, 1.6]} />
        <meshStandardMaterial color="#c4d2e0" emissive="#aebfd4" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.7, 1.8, -3.44]}>
        <boxGeometry args={[1.42, 0.07, 0.05]} />
        <meshStandardMaterial color="#3d3123" />
      </mesh>
      <mesh position={[1.7, 1.8, -3.44]}>
        <boxGeometry args={[0.07, 1.7, 0.05]} />
        <meshStandardMaterial color="#3d3123" />
      </mesh>

      <Hearth />
      <Table />
      <Chair position={[0.4, 0, 0.5]} rotation={Math.PI} />
      <Chair position={[1.5, 0, -0.4]} rotation={-Math.PI / 2} />

      {/* 敷物 */}
      <mesh position={[0.2, 0.01, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.0, 2.6]} />
        <meshStandardMaterial color="#6d3b30" />
      </mesh>

      {/* 父イマヌエルなどの人物はビートのデータ(figures)が置く */}
    </group>
  )
}
