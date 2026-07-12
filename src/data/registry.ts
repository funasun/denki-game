import type { PersonData } from '../engine/types'
import { beethoven } from './beethoven/person'
import { nobel } from './nobel/person'

// 伝記ゲーム集のカタログ。人物を増やすときは data/<person>/ を作り、ここに追記するだけでよい。
// 遊べる人物は PEOPLE に、これから追加する人物は UPCOMING(近日公開)に置く。
export const PEOPLE: PersonData[] = [beethoven, nobel]

export interface UpcomingPerson {
  id: string
  name: string
  born: number
  died: number
  tagline: string
}

// 「これから増やす」人物の予告(近日公開カード)。いまは全員プレイ可能。
export const UPCOMING: UpcomingPerson[] = []
