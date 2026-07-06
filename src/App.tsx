import { SceneRunner } from './engine/flow/SceneRunner'
import { beethoven } from './data/beethoven/person'

export default function App() {
  return <SceneRunner person={beethoven} />
}
