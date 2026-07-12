import { useEffect, useMemo, useState } from 'react'
import type { ConversationChoice, ConversationDef, EvidenceDef } from '../types'

interface ConversationBoxProps {
  conversation: ConversationDef
  onCollect: (e: EvidenceDef) => void
  onFlag: (flag: string) => void
  onDone: () => void
}

// 人物との対話選択: ノードをたどる分岐会話。台詞を送り、返答を選ぶ。
// 返答が手がかりやフラグ(打ち明けた/隠した など)を生み、あとの語りを色づける。
export function ConversationBox({ conversation, onCollect, onFlag, onDone }: ConversationBoxProps) {
  const [nodeId, setNodeId] = useState(conversation.start)
  const [lineIndex, setLineIndex] = useState(0)
  const [chars, setChars] = useState(0)
  const [used, setUsed] = useState<Record<string, true>>({})

  const node = useMemo(
    () => conversation.nodes.find((n) => n.id === nodeId) ?? conversation.nodes[0],
    [conversation, nodeId],
  )
  const line = node.lines[lineIndex]
  const linesDone = lineIndex >= node.lines.length - 1 && chars >= (line?.text.length ?? 0)
  const terminal = !node.choices || node.choices.length === 0

  // ノードが変わったら台詞を頭から
  useEffect(() => {
    setLineIndex(0)
    setChars(0)
  }, [nodeId])

  // タイプライター
  useEffect(() => {
    if (!line || chars >= line.text.length) return
    const t = setInterval(() => setChars((c) => c + 1), 30)
    return () => clearInterval(t)
  }, [line, chars])

  const proceedLine = () => {
    if (!line) return
    if (chars < line.text.length) {
      setChars(line.text.length)
    } else if (lineIndex + 1 < node.lines.length) {
      setLineIndex(lineIndex + 1)
      setChars(0)
    }
  }

  // 台詞の途中はキー/クリックで送る(選択肢が出たら送らない)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (linesDone) return
      if (e.code === 'Enter' || e.code === 'Space' || e.code === 'KeyE') {
        e.preventDefault()
        proceedLine()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const pick = (c: ConversationChoice, i: number) => {
    if (c.evidence) onCollect(c.evidence)
    if (c.flag) onFlag(c.flag)
    if (c.once) setUsed((s) => ({ ...s, [`${nodeId}:${i}`]: true }))
    if (c.to) setNodeId(c.to)
    else onDone()
  }

  return (
    <div className="choice-layer conversation-layer">
      <div className="conversation-panel">
        <div
          className="conversation-lines"
          onClick={!linesDone ? proceedLine : undefined}
        >
          {node.lines.slice(0, lineIndex + 1).map((l, i) => {
            const text = i === lineIndex ? l.text.slice(0, chars) : l.text
            return (
              <div key={i} className={`conversation-line${l.inner ? ' inner' : ''}`}>
                {l.speaker && <span className="conversation-speaker">{l.speaker}</span>}
                <p className="conversation-text">{text}</p>
              </div>
            )
          })}
          {!linesDone && <span className="conversation-caret">▼</span>}
        </div>

        {linesDone && !terminal && (
          <div className="conversation-choices">
            {node.choices!.map((c, i) =>
              used[`${nodeId}:${i}`] ? null : (
                <button key={i} className="conversation-choice" onClick={() => pick(c, i)}>
                  {c.text}
                </button>
              ),
            )}
          </div>
        )}

        {linesDone && terminal && (
          <button className="card-button" onClick={onDone}>
            続ける
          </button>
        )}
      </div>
    </div>
  )
}
