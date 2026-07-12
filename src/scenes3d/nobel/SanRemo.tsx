// イタリア、サンレモの別荘「ミオ・ニド(わが巣)」のテラス(一八九六年一二月)。
// 地中海を見おろす夜。アルフレッド・ノーベルが、家族に看取られぬまま世を去る場所。
// 「温もり」が最も低い場面。暖色の光は一切なく、冷たい月光だけがある。
// 照明・背景は FateAtmosphere が駆動するが、夜の屋外なので焦点として冷たい月の一灯を持つ。
// アルフレッド自身はプレイヤーとして立つので、この舞台に人物像は置かない
// (最期の場面ではプレイヤーも消え、月と海だけが残る)。

function Baluster({ x }: { x: number }) {
  return (
    <mesh position={[x, 0.35, -3]}>
      <cylinderGeometry args={[0.06, 0.08, 0.7, 8]} />
      <meshStandardMaterial color="#4a4f55" flatShading />
    </mesh>
  )
}

// 糸杉(地中海の夜にそびえる暗い影)
function Cypress({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[0.4, 2.6, 8]} />
        <meshStandardMaterial color="#20302c" flatShading />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.3, 6]} />
        <meshStandardMaterial color="#2a221a" flatShading />
      </mesh>
    </group>
  )
}

// 寝椅子(最期の日々を過ごした場所。いまは、ただ空いている)
function Chaise({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[1.5, 0.16, 0.6]} />
        <meshStandardMaterial color="#33383e" flatShading />
      </mesh>
      {/* 起きあがった枕側 */}
      <mesh position={[-0.62, 0.56, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.5, 0.16, 0.6]} />
        <meshStandardMaterial color="#3a4046" flatShading />
      </mesh>
      {[-0.65, 0.65].map((x) =>
        [-0.24, 0.24].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.16, z]}>
            <boxGeometry args={[0.06, 0.32, 0.06]} />
            <meshStandardMaterial color="#24282c" flatShading />
          </mesh>
        )),
      )}
    </group>
  )
}

export function SanRemo() {
  return (
    <group>
      {/* テラスの石床 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.5]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#3c4045" />
      </mesh>

      {/* 地中海(はるか下・暗い水面) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, -20]}>
        <planeGeometry args={[80, 36]} />
        <meshStandardMaterial color="#161f2b" />
      </mesh>
      {/* 月の反射(海面に落ちる冷たい一筋) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.4, -1.38, -14]}>
        <planeGeometry args={[1.2, 16]} />
        <meshStandardMaterial color="#9fb2c8" emissive="#8ea6c4" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>

      {/* 月(冷たい焦点。暖炉の火に代わる、最後の光) */}
      <mesh position={[3.2, 5.4, -22]}>
        <sphereGeometry args={[1.0, 20, 16]} />
        <meshStandardMaterial color="#dbe6f0" emissive="#c3d3e6" emissiveIntensity={1.4} flatShading />
      </mesh>
      <pointLight position={[2.6, 4.2, -12]} intensity={1.1} color="#aac0dc" distance={30} />

      {/* 手すり(バラスター列 + 笠木) */}
      {[-4, -3.2, -2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4, 3.2, 4].map((x) => (
        <Baluster key={x} x={x} />
      ))}
      <mesh position={[0, 0.74, -3]}>
        <boxGeometry args={[8.6, 0.14, 0.28]} />
        <meshStandardMaterial color="#52575d" flatShading />
      </mesh>
      <mesh position={[0, 0.02, -3]}>
        <boxGeometry args={[8.6, 0.12, 0.28]} />
        <meshStandardMaterial color="#42474d" flatShading />
      </mesh>

      {/* 別荘の壁と戸口(背後。かすかな灯が漏れるが、誰も来ない) */}
      <mesh position={[0, 2, 2.2]}>
        <planeGeometry args={[16, 5]} />
        <meshStandardMaterial color="#2a2824" />
      </mesh>
      <mesh position={[-2.6, 1.3, 2.15]}>
        <planeGeometry args={[1.1, 2.4]} />
        <meshStandardMaterial color="#5a5648" emissive="#6a604a" emissiveIntensity={0.28} />
      </mesh>

      {/* 糸杉(テラスの両脇) */}
      <Cypress position={[-3.6, 0, -1.4]} />
      <Cypress position={[3.7, 0, -1.2]} />

      {/* 鉢植え */}
      {[[-2.2, -2.7], [2.0, -2.7]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.22, 0.16, 0.4, 10]} />
            <meshStandardMaterial color="#463a2e" flatShading />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.28, 8, 6]} />
            <meshStandardMaterial color="#26332a" flatShading />
          </mesh>
        </group>
      ))}

      <Chaise position={[-0.8, 0, -0.4]} rotation={-0.3} />

      {/* 小卓(最期まで手放さなかったフラスコと、書きかけの手紙) */}
      <group position={[1.4, 0, -0.6]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.06, 12]} />
          <meshStandardMaterial color="#3a352c" flatShading />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
          <meshStandardMaterial color="#2c281f" flatShading />
        </mesh>
        <mesh position={[0.08, 0.62, 0]}>
          <sphereGeometry args={[0.09, 8, 6]} />
          <meshStandardMaterial color="#aebfc8" transparent opacity={0.55} flatShading />
        </mesh>
        <mesh position={[-0.1, 0.54, 0.05]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.2, 0.015, 0.28]} />
          <meshStandardMaterial color="#c9c3b2" flatShading />
        </mesh>
      </group>
    </group>
  )
}
