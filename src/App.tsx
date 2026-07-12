import { useGameStore } from './engine/store'
import { SceneRunner } from './engine/flow/SceneRunner'
import { HomeScreen } from './engine/ui/HomeScreen'
import { PEOPLE, UPCOMING } from './data/registry'

// 伝記ゲーム集の入口。activePersonId が null ならホーム(人物選択)、
// 人物を選んでいればその人の SceneRunner を表示する。
// key に人物IDを渡し、人物を切り替えたら SceneRunner ごと作り直す(表紙から始まる)。
export default function App() {
  const activePersonId = useGameStore((s) => s.activePersonId)
  const selectPerson = useGameStore((s) => s.selectPerson)
  const goHome = useGameStore((s) => s.goHome)

  const person = PEOPLE.find((p) => p.id === activePersonId) ?? null

  if (!person) {
    return (
      <HomeScreen
        people={PEOPLE}
        upcoming={UPCOMING}
        onSelect={(p) => selectPerson(p.id, p.chapters[0].fateStart)}
      />
    )
  }

  return <SceneRunner key={person.id} person={person} onHome={goHome} />
}
