// タッチ端末向けの移動十字キー。Player はwindowのKeyboardEvent(e.code)を読むので、
// 合成イベントを流すだけで既存の入力系に乗る。表示はCSSの (pointer: coarse) で制御
const DIRS: { code: string; label: string; cls: string }[] = [
  { code: 'KeyW', label: '▲', cls: 'up' },
  { code: 'KeyA', label: '◀', cls: 'left' },
  { code: 'KeyD', label: '▶', cls: 'right' },
  { code: 'KeyS', label: '▼', cls: 'down' },
]

function press(code: string, down: boolean) {
  window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code }))
}

export function TouchControls() {
  return (
    <div className="touch-pad">
      {DIRS.map((d) => (
        <button
          key={d.code}
          className={`touch-key ${d.cls}`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            press(d.code, true)
          }}
          onPointerUp={() => press(d.code, false)}
          onPointerCancel={() => press(d.code, false)}
          onContextMenu={(e) => e.preventDefault()}
        >
          {d.label}
        </button>
      ))}
    </div>
  )
}
