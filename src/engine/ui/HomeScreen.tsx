import { useGameStore } from '../store'
import type { PersonData } from '../types'
import type { UpcomingPerson } from '../../data/registry'

interface HomeScreenProps {
  people: PersonData[]
  upcoming: UpcomingPerson[]
  onSelect: (person: PersonData) => void
}

// 伝記ゲーム集のホーム(導入 + 人物選択)。3Dは持たず、人物を選ぶと SceneRunner に切り替わる。
export function HomeScreen({ people, upcoming, onSelect }: HomeScreenProps) {
  const progress = useGameStore((s) => s.progress)

  const statusOf = (p: PersonData) => {
    const pr = progress[p.id]
    if (!pr) return { label: 'この生涯を、生きる', done: false }
    if (pr.lifeCompleted) return { label: '生き終えた ─ もう一度', done: true }
    return { label: `第${pr.chapterIndex + 1}章から、つづける`, done: false }
  }

  return (
    <div className="fullscreen-card home-screen">
      <div className="home-header">
        <p className="home-eyebrow">没入型 伝記ゲーム集</p>
        <h1 className="card-title home-title">生きて、識る。</h1>
        <p className="home-lead">
          歴史に名を残した一人の人生を、生まれてから死ぬまで、その人の目で生きなおす。
          岐路に立つたびに「その人が何を思っていたか」を選び、史実と答え合わせをしていく——
          出来事の年表ではなく、心の伝記を。
        </p>
      </div>

      <div className="person-grid">
        {people.map((p) => {
          const st = statusOf(p)
          return (
            <button key={p.id} className="person-card" onClick={() => onSelect(p)}>
              <span className="person-card-life">
                {p.born} — {p.died}
              </span>
              <span className="person-card-name">{p.name}</span>
              {p.tagline && <span className="person-card-tagline">{p.tagline}</span>}
              <span className={`person-card-status${st.done ? ' done' : ''}`}>{st.label}</span>
            </button>
          )
        })}

        {upcoming.map((u) => (
          <div key={u.id} className="person-card upcoming" aria-disabled="true">
            <span className="person-card-life">
              {u.born} — {u.died}
            </span>
            <span className="person-card-name">{u.name}</span>
            <span className="person-card-tagline">{u.tagline}</span>
            <span className="upcoming-badge">近日公開</span>
          </div>
        ))}
      </div>

      <p className="home-foot">
        選択に絶対の正解はない。ただ、その人の心にどれだけ近づけたかは、生涯の終わりに分かる。
      </p>
    </div>
  )
}
