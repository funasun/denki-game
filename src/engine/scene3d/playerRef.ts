import { Vector3 } from 'three'

// プレイヤー位置の共有可変参照(カメラ・インタラクトの距離判定用、React再レンダ不要)
export const playerPos = new Vector3()

// 近接プロンプトの調停。人物とモノが隣り合う場面では複数の対話圏が重なりうるが、
// プロンプトとEキーを受けるのは「いちばん近い一つ」だけにする(Eで二つ同時に発火するのを防ぐ)。
// 各 Interactable が毎フレーム自分の距離²を書き込み、最小のものだけが近接扱いになる。
export const interactClaims: Record<string, number> = {}

export function isNearestClaim(id: string, d2: number): boolean {
  for (const k in interactClaims) {
    if (k !== id && interactClaims[k] < d2) return false
  }
  return true
}
