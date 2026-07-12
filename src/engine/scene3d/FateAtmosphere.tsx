import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// 運命=「温もり」を光と色温度で表現するエンジン拡張。
// ベートーヴェンでは運命(聴力)が「音」を駆動したのに対し、
// ノーベルでは運命(温もり 1→0)が「光・背景・フォグの色温度」を駆動する。
// person.fate.visual === 'warmth' のときだけ SceneRunner がこれを差し込む。
// warmth を毎フレーム target へイージングするので、fateビート中はなめらかに冷えていく。

const WARM_BG = new THREE.Color('#e3c084') // 温もりMAX: 夕暮れの蜜色
const COLD_BG = new THREE.Color('#0c111b') // 温もり0: 凍てつく紺
const WARM_KEY = new THREE.Color('#ffcf8f') // 主光: 蝋燭色
const COLD_KEY = new THREE.Color('#8ba6cc') // 主光: 無機質な青
const WARM_AMB = new THREE.Color('#6d4f2f') // 環境光: 暖かい琥珀
const COLD_AMB = new THREE.Color('#39465d') // 環境光: 冷たい鉛色

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export function FateAtmosphere({
  target,
  fog,
}: {
  target: number
  fog?: { near: number; far: number }
}) {
  const { scene } = useThree()
  const w = useRef(clamp01(target))
  const bg = useRef(new THREE.Color().copy(COLD_BG).lerp(WARM_BG, clamp01(target)))
  const amb = useRef<THREE.AmbientLight>(null)
  const key = useRef<THREE.DirectionalLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)

  // マウント時に背景を即セット(最初のフレームで黒が一瞬見えるのを防ぐ)
  useLayoutEffect(() => {
    scene.background = bg.current
    return () => {
      // 別の人物へ切り替わったら背景参照を残さない
      scene.background = null
    }
  }, [scene])

  useFrame((_, dt) => {
    // dt が大きすぎる(タブ復帰など)と飛ぶので上限を設ける
    const d = Math.min(dt, 0.1)
    w.current = THREE.MathUtils.damp(w.current, clamp01(target), 1.1, d)
    const t = w.current

    bg.current.copy(COLD_BG).lerp(WARM_BG, t)
    scene.background = bg.current
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bg.current)

    if (amb.current) {
      amb.current.color.copy(COLD_AMB).lerp(WARM_AMB, t)
      amb.current.intensity = 0.34 + 0.28 * t
    }
    if (key.current) {
      key.current.color.copy(COLD_KEY).lerp(WARM_KEY, t)
      key.current.intensity = 0.5 + 0.8 * t
    }
    if (hemi.current) {
      hemi.current.intensity = 0.14 + 0.18 * t
    }
  })

  return (
    <>
      {fog && <fog attach="fog" args={['#0c111b', fog.near, fog.far]} />}
      <ambientLight ref={amb} />
      <hemisphereLight ref={hemi} color="#cde0ff" groundColor="#1d140b" />
      <directionalLight
        ref={key}
        position={[4.5, 9, 4]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
      />
    </>
  )
}
