import type { ChoiceOption } from '../types'

interface ChoicePanelProps {
  situation?: string
  question: string
  options: ChoiceOption[]
  onSelect: (index: number) => void
}

export function ChoicePanel({ situation, question, options, onSelect }: ChoicePanelProps) {
  return (
    <div className="choice-layer">
      <div className="choice-panel">
        {situation && <p className="choice-situation">{situation}</p>}
        <h2 className="choice-question">{question}</h2>
        <div className="choice-options">
          {options.map((opt, i) => (
            <button key={i} className="choice-option" onClick={() => onSelect(i)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
