import type { PersonData } from '../../engine/types'
import { chapter1 } from './chapter1'
import { chapter2 } from './chapter2'
import { chapter3 } from './chapter3'
import { chapter4 } from './chapter4'
import { chapter5 } from './chapter5'
import { chapter6 } from './chapter6'
import { chronicle, figures, understandingTiers } from './archive'

// 人物データ層(第二弾): アルフレッド・ノーベル。
// 「抗えない運命」= 温もり(warmth 1→0)。人と生の温かさが、富と孤独と引き換えに冷えていく。
// fate.visual: 'warmth' により、運命パラメータは「音」ではなく「光・色温度」を駆動する。
export const nobel: PersonData = {
  id: 'nobel',
  name: 'アルフレッド・ノーベル',
  born: 1833,
  died: 1896,
  tagline: '「死の商人」と呼ばれた男が、自らの名を平和に託すまで。',
  fate: { id: 'warmth', label: '温もり', visual: 'warmth' },
  chapters: [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6],
  chronicle,
  figures,
  understandingTiers,
}
