import { useEffect, useState } from 'react'
import { enterFullscreen, fullscreenSupported, isFullscreen, onFullscreenChange } from '../util/fullscreen'

// タッチ端末で「全画面でないとき」だけ現れる小さなボタン。
// タップするとブラウザのURLバー・タブが隠れる。全画面中は消えて画面を邪魔しない。
// (全画面が外れた ── 端末を回した等 ── ときに再び現れ、もう一度全画面にできる)
// 表示自体は CSS の @media (pointer: coarse) でタッチ端末のみに限定している。
export function FullscreenButton() {
  const [fs, setFs] = useState(isFullscreen)

  useEffect(() => onFullscreenChange(() => setFs(isFullscreen())), [])

  // API 非対応(iPhone Safari 等)や、すでに全画面のときは出さない
  if (!fullscreenSupported() || fs) return null

  return (
    <button
      type="button"
      className="fullscreen-toggle"
      onClick={() => enterFullscreen()}
      aria-label="全画面表示にする"
    >
      <span className="fullscreen-toggle-glyph">⛶</span>
      全画面
    </button>
  )
}
