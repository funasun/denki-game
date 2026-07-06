// プリミティブ製の様式化人形(プレイヤー/NPC共用)
interface FigureProps {
  coat?: string
  skin?: string
  hair?: string
  trousers?: string
}

export function Figure({
  coat = '#3a4634',
  skin = '#d9b090',
  hair = '#4b3a2e',
  trousers = '#2b2620',
}: FigureProps) {
  return (
    <group>
      {/* 脚 */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.19, 0.7, 8]} />
        <meshStandardMaterial color={trousers} flatShading />
      </mesh>
      {/* コート(裾広がり) */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.62, 8]} />
        <meshStandardMaterial color={coat} flatShading />
      </mesh>
      {/* 襟元(クラヴァット) */}
      <mesh position={[0, 1.26, 0.06]}>
        <sphereGeometry args={[0.09, 8, 6]} />
        <meshStandardMaterial color="#e8e2d0" flatShading />
      </mesh>
      {/* 腕 */}
      <mesh position={[-0.26, 0.98, 0]} rotation={[0, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.055, 0.06, 0.55, 6]} />
        <meshStandardMaterial color={coat} flatShading />
      </mesh>
      <mesh position={[0.26, 0.98, 0]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.055, 0.06, 0.55, 6]} />
        <meshStandardMaterial color={coat} flatShading />
      </mesh>
      {/* 頭 */}
      <mesh position={[0, 1.48, 0]} castShadow>
        <sphereGeometry args={[0.17, 10, 8]} />
        <meshStandardMaterial color={skin} flatShading />
      </mesh>
      {/* 髪(後頭部に膨らみ) */}
      <mesh position={[0, 1.56, -0.05]}>
        <sphereGeometry args={[0.17, 10, 8]} />
        <meshStandardMaterial color={hair} flatShading />
      </mesh>
    </group>
  )
}
