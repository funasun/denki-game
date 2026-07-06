import { useEffect, useState } from 'react'
import type { DialogueLine } from '../types'

interface DialogueBoxProps {
  lines: DialogueLine[]
  onDone: () => void
}

// 一行ずつタイプライター表示。クリック/Enterで全文表示→次の行→完了
export function DialogueBox({ lines, onDone }: DialogueBoxProps) {
  const [index, setIndex] = useState(0)
  const [chars, setChars] = useState(0)

  const line = lines[index]
  const fullyShown = line && chars >= line.text.length

  useEffect(() => {
    setIndex(0)
    setChars(0)
  }, [lines])

  useEffect(() => {
    if (!line || fullyShown) return
    const t = setInterval(() => setChars((c) => c + 1), 34)
    return () => clearInterval(t)
  }, [index, line, fullyShown])

  const proceed = () => {
    if (!line) return
    if (!fullyShown) {
      setChars(line.text.length)
    } else if (index + 1 < lines.length) {
      setIndex(index + 1)
      setChars(0)
    } else {
      onDone()
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space' || e.code === 'KeyE') {
        e.preventDefault()
        proceed()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!line) return null

  return (
    <div className="dialogue-layer" onClick={proceed}>
      <div className={`dialogue-box ${line.inner ? 'inner' : ''}`}>
        {line.speaker && <div className="dialogue-speaker">{line.speaker}</div>}
        <p className="dialogue-text">
          {line.text.slice(0, chars)}
          <span className="dialogue-caret" style={{ opacity: fullyShown ? 1 : 0 }}>
            ▼
          </span>
        </p>
      </div>
    </div>
  )
}
