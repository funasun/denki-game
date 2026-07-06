import { Vector3 } from 'three'

// プレイヤー位置の共有可変参照(カメラ・インタラクトの距離判定用、React再レンダ不要)
export const playerPos = new Vector3()
