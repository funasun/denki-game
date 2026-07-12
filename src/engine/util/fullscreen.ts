// 全画面表示(ブラウザのURLバー・タブを隠す)ユーティリティ。
// Fullscreen API はユーザー操作(タップ/クリック)の最中にしか呼べない。
// iOS Safari(iPhone)は requestFullscreen 非対応 ── その環境では何もしない
// (ホーム画面に追加した PWA なら display:standalone で最初から全画面になる)。

type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

const el = () => document.documentElement as FsElement
const doc = () => document as FsDocument

const swallow = (r: Promise<void> | void) => {
  if (r && typeof (r as Promise<void>).catch === 'function') (r as Promise<void>).catch(() => {})
}

// この環境で全画面 API が使えるか(iPhone Safari は false)
export function fullscreenSupported(): boolean {
  const e = el()
  return (
    typeof e.requestFullscreen === 'function' || typeof e.webkitRequestFullscreen === 'function'
  )
}

// いま全画面かどうか
export function isFullscreen(): boolean {
  const d = doc()
  return !!(d.fullscreenElement || d.webkitFullscreenElement)
}

// 全画面に入る(非対応・拒否は黙って無視)
export function enterFullscreen(): void {
  if (isFullscreen()) return
  const e = el()
  const req = e.requestFullscreen ?? e.webkitRequestFullscreen
  if (!req) return
  try {
    swallow(req.call(e))
  } catch {
    /* 非対応環境などは無視 */
  }
}

// 全画面を出る
export function exitFullscreen(): void {
  if (!isFullscreen()) return
  const d = doc()
  const exit = d.exitFullscreen ?? d.webkitExitFullscreen
  if (!exit) return
  try {
    swallow(exit.call(d))
  } catch {
    /* 無視 */
  }
}

// 全画面状態の変化を購読する(ベンダー接頭辞込み)。解除関数を返す。
export function onFullscreenChange(cb: () => void): () => void {
  document.addEventListener('fullscreenchange', cb)
  document.addEventListener('webkitfullscreenchange', cb)
  return () => {
    document.removeEventListener('fullscreenchange', cb)
    document.removeEventListener('webkitfullscreenchange', cb)
  }
}

// タッチ端末(スマホ・タブレット)かどうか。PC では全画面を自動化しない判定に使う。
export function isTouchLike(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches
}
