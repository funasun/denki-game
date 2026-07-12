import type { PersonData } from '../../engine/types'
import { chapter1 } from './chapter1'
import { chapter2 } from './chapter2'
import { chapter3 } from './chapter3'
import { chapter4 } from './chapter4'
import { chapter5 } from './chapter5'
import { chapter6 } from './chapter6'
import { chronicle, figures, understandingTiers, works } from './archive'

// 人物データ層: エンジンに手を入れず、このセットを差し替えるだけで別人物を追加できる。
// 「抗えない運命」= 聴力(生涯を通じて 1.0 → 0 へ不可逆に減衰し、プレイヤーの選択では止まらない)
export const beethoven: PersonData = {
  id: 'beethoven',
  name: 'ルートヴィヒ・ヴァン・ベートーヴェン',
  born: 1770,
  died: 1827,
  tagline: '音を失ってなお、音楽を書きやめなかった人。',
  fate: { id: 'hearing', label: '聴力' },
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6],
  chronicle,
  works,
  figures,
  understandingTiers,
}
