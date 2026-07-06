interface RevealPanelProps {
  chosenLabel: string
  feedback: string
  correct: boolean
  title: string
  body: string[]
  onDone: () => void
}

// 史実の答え合わせ: 選んだ読みへのフィードバック + 史実解説
export function RevealPanel({ chosenLabel, feedback, correct, title, body, onDone }: RevealPanelProps) {
  return (
    <div className="choice-layer">
      <div className="reveal-panel">
        <div className="reveal-heading">史実の答え合わせ</div>
        <div className={`reveal-feedback ${correct ? 'correct' : ''}`}>
          <span className="reveal-chosen">あなたの読み — 「{chosenLabel}」</span>
          <p>{feedback}</p>
        </div>
        <h2 className="reveal-title">{title}</h2>
        {body.map((p, i) => (
          <p key={i} className="reveal-body">
            {p}
          </p>
        ))}
        <button className="card-button" onClick={onDone}>
          物語へ戻る
        </button>
      </div>
    </div>
  )
}
