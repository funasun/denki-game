import type { PersonData } from '../types'
import { useGameStore } from '../store'

// 章の再読: 生涯を一度生き終えたあと、任意の章をひらき直せる
export function ChapterSelect({
  person,
  onSelect,
  onClose,
}: {
  person: PersonData
  onSelect: (chapterIndex: number) => void
  onClose: () => void
}) {
  const insights = useGameStore((s) => s.insights)
  return (
    <div className="fullscreen-card archive">
      <h1 className="card-title archive-title">章をえらぶ</h1>
      <p className="card-subtitle">生き直したい時へ、ひらき直す</p>
      <div className="archive-body chapter-list">
        {person.chapters.map((c, i) => (
          <button key={c.id} className="chapter-item" onClick={() => onSelect(i)}>
            <span className="chapter-no">{['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][i] ?? i + 1}</span>
            <span className="chapter-item-body">
              <span className="chapter-item-title">{c.title}</span>
              {c.subtitle && <span className="chapter-item-subtitle">{c.subtitle}</span>}
            </span>
            {insights[i] && <span className="chapter-insight">心が重なった</span>}
          </button>
        ))}
      </div>
      <button className="card-button" onClick={onClose}>
        とじる
      </button>
    </div>
  )
}
