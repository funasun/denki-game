import { useEffect, useState } from 'react'

// 縦画面のとき: 横画面を推奨する案内を出し、5秒後にCSS回転で強制的に横向き表示にする
export function OrientationGuard() {
  const [portrait, setPortrait] = useState(false)
  const [forced, setForced] = useState(false)
  const [count, setCount] = useState(5)

  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    const update = () => setPortrait(mq.matches)
    update()
    // orientation の matchMedia change だけだと、環境によっては発火しないことがある。
    // resize / orientationchange も併せて監視し、どの経路でも向きの変化を取りこぼさない
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  useEffect(() => {
    if (!portrait) {
      setForced(false)
      setCount(5)
      document.documentElement.classList.remove('force-landscape')
      return
    }
    const iv = setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000)
    const t = setTimeout(() => {
      setForced(true)
      document.documentElement.classList.add('force-landscape')
    }, 5000)
    return () => {
      clearInterval(iv)
      clearTimeout(t)
    }
  }, [portrait])

  if (!portrait || forced) return null
  return (
    <div className="orientation-layer">
      <div className="orientation-icon">⟳</div>
      <p className="orientation-text">端末を横向きにしてお楽しみください</p>
      <p className="orientation-sub">{count}秒後に自動で横向き表示に切り替わります</p>
    </div>
  )
}
