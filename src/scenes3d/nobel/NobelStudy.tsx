// パリ、マラコフ通りのノーベル邸の書斎(一八七〇〜九〇年代)。
// ダイナマイトで巨万の富を得た男の、豪奢だが冷えきった部屋。第四〜六章に共用。
// 「温もり」は低く、暖炉の火はもうない。照明・背景は FateAtmosphere が駆動し、
// この舞台は焦点として一灯の「冷たい」ランプだけを持つ(富がもたらす人工の光)。
// 主人公アルフレッド自身はプレイヤーとして立つので、この舞台に人物像は置かない。

function Bookshelf({ position }: { position: [number, number, number] }) {
  const books: [number, string][] = [
    [-0.6, '#3a4a52'],
    [-0.36, '#4a3a30'],
    [-0.12, '#2f3f36'],
    [0.12, '#463040'],
    [0.36, '#38404a'],
    [0.6, '#4a4030'],
  ]
  return (
    <group position={position}>
      {/* 棚枠 */}
      <mesh castShadow>
        <boxGeometry args={[1.6, 2.4, 0.36]} />
        <meshStandardMaterial color="#2c241c" flatShading />
      </mesh>
      {[-0.7, -0.1, 0.5].map((y) => (
        <group key={y} position={[0, y, 0.02]}>
          {/* 棚板 */}
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[1.5, 0.04, 0.32]} />
            <meshStandardMaterial color="#211a14" flatShading />
          </mesh>
          {books.map(([x, c], i) => (
            <mesh key={i} position={[x, 0, 0.02]} castShadow>
              <boxGeometry args={[0.18, 0.4, 0.28]} />
              <meshStandardMaterial color={c} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// 大きな執務机(遺言書・インク壺・冷たいランプ)
function Desk() {
  return (
    <group position={[0, 0, -1.7]}>
      {/* 天板 */}
      <mesh position={[0, 0.86, 0]} castShadow>
        <boxGeometry args={[2.4, 0.1, 1.1]} />
        <meshStandardMaterial color="#3f2e1e" flatShading />
      </mesh>
      {/* 側面の袖(引き出し) */}
      {[-1.0, 1.0].map((x) => (
        <mesh key={x} position={[x, 0.42, 0]} castShadow>
          <boxGeometry args={[0.34, 0.86, 1.0]} />
          <meshStandardMaterial color="#35271a" flatShading />
        </mesh>
      ))}
      {/* 緑の天板クロス */}
      <mesh position={[0, 0.915, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 0.8]} />
        <meshStandardMaterial color="#243a32" flatShading />
      </mesh>
      {/* 書きかけの遺言書(白い紙束) */}
      <mesh position={[-0.2, 0.93, 0.08]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[0.34, 0.02, 0.46]} />
        <meshStandardMaterial color="#d8d2c2" flatShading />
      </mesh>
      {/* インク壺と羽ペン */}
      <mesh position={[0.3, 0.96, 0.1]}>
        <cylinderGeometry args={[0.05, 0.06, 0.1, 8]} />
        <meshStandardMaterial color="#1a1a20" flatShading />
      </mesh>
      <mesh position={[0.36, 1.06, 0.12]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.005, 0.02, 0.34, 5]} />
        <meshStandardMaterial color="#e8e2d0" flatShading />
      </mesh>
      {/* 冷たいランプ(緑傘・鋼の脚) ── 暖炉に代わる人工の光 */}
      <group position={[0.7, 0.91, -0.1]}>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.28, 6]} />
          <meshStandardMaterial color="#4a4a52" flatShading />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <coneGeometry args={[0.16, 0.14, 12, 1, true]} />
          <meshStandardMaterial color="#22463f" side={2} flatShading />
        </mesh>
        {/* 傘の下の冷光 */}
        <mesh position={[0, 0.36, 0]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial
            color="#cfe0ea"
            emissive="#b6ccdc"
            emissiveIntensity={1.6}
            flatShading
          />
        </mesh>
        <pointLight position={[0, 0.34, 0]} intensity={0.9} color="#b9d0e2" distance={4.2} />
      </group>
    </group>
  )
}

// 地球儀(世界に広がったノーベルの工場・市場の暗喩)
function Globe({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.04, 12]} />
        <meshStandardMaterial color="#2c241c" flatShading />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.76, 6]} />
        <meshStandardMaterial color="#3a2e20" flatShading />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.26, 14, 12]} />
        <meshStandardMaterial color="#41566a" flatShading />
      </mesh>
      {/* 金の子午線環 */}
      <mesh position={[0, 0.78, 0]} rotation={[0, 0, 0.4]}>
        <torusGeometry args={[0.28, 0.012, 6, 20]} />
        <meshStandardMaterial color="#8a6a34" metalness={0.5} roughness={0.5} flatShading />
      </mesh>
    </group>
  )
}

function Armchair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* 座面 */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.62, 0.2, 0.58]} />
        <meshStandardMaterial color="#3a2a33" flatShading />
      </mesh>
      {/* 背もたれ */}
      <mesh position={[0, 0.82, -0.24]} castShadow>
        <boxGeometry args={[0.62, 0.7, 0.16]} />
        <meshStandardMaterial color="#402e38" flatShading />
      </mesh>
      {/* 肘掛け */}
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.56, 0]}>
          <boxGeometry args={[0.12, 0.24, 0.56]} />
          <meshStandardMaterial color="#3a2a33" flatShading />
        </mesh>
      ))}
    </group>
  )
}

export function NobelStudy() {
  return (
    <group>
      {/* 床(寄木・冷たく沈んだ色) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#3a2e22" />
      </mesh>
      {/* 壁(暗い羽目板) */}
      <mesh position={[0, 3, -3.5]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#2e2b28" />
      </mesh>
      <mesh position={[-3.5, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#332f2b" />
      </mesh>
      <mesh position={[3.5, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#332f2b" />
      </mesh>

      {/* 高い窓(パリの、冷たい灰色の採光) */}
      <mesh position={[-2.2, 2.4, -3.46]}>
        <planeGeometry args={[1.4, 2.2]} />
        <meshStandardMaterial color="#9fb0c2" emissive="#8ea2b8" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-2.2, 2.4, -3.43]}>
        <boxGeometry args={[0.08, 2.3, 0.05]} />
        <meshStandardMaterial color="#20201e" />
      </mesh>
      <mesh position={[-2.2, 2.4, -3.43]}>
        <boxGeometry args={[1.5, 0.08, 0.05]} />
        <meshStandardMaterial color="#20201e" />
      </mesh>

      {/* 深紅のカーテン(色あせて見える) */}
      {[-3.0, -1.4].map((x) => (
        <mesh key={x} position={[x, 2.4, -3.4]}>
          <boxGeometry args={[0.35, 2.4, 0.12]} />
          <meshStandardMaterial color="#3e2226" flatShading />
        </mesh>
      ))}

      <Bookshelf position={[2.4, 1.2, -3.1]} />
      <Bookshelf position={[0.6, 1.2, -3.1]} />

      <Desk />
      <Armchair position={[0, 0, 0.2]} rotation={Math.PI} />
      <Globe position={[-2.4, 0, -0.6]} />

      {/* 豪奢な絨毯(色が沈んでいる) */}
      <mesh position={[0, 0.01, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 3.4]} />
        <meshStandardMaterial color="#4a2e2c" />
      </mesh>
    </group>
  )
}
