import type { ComponentType } from 'react'

export interface DialogueLine {
  speaker?: string
  text: string
  inner?: boolean
  // 選択の反響: 章内で立ったフラグ(store.flags)による行の出し分け。
  // ifFlag はそのフラグが立っているときだけ、ifNotFlag は立っていないときだけ表示される。
  // フラグは章をまたぐとリセットされるので、反響は同じ章の中でだけ書くこと。
  ifFlag?: string
  ifNotFlag?: string
}

// 舞台に立つ人物(名札つきの様式化人形)。dialogue / explore ビートに置く。
// 舞台(SceneryDef)は人物を持たず、ビートのデータがその場の登場人物を決める ──
// 同じ部屋でも、場面によって人が居たり居なくなったりできる。
export interface SceneFigure {
  id: string
  // 頭上の名札。省略すると無名の人影(群衆・使用人など)になる
  name?: string
  position: [number, number, number]
  // Y回転(ラジアン)。0 で +z(既定カメラ側)を向く
  facing?: number
  coat?: string
  skin?: string
  hair?: string
  trousers?: string
  // 子どもなどの背丈(既定 1)
  scale?: number
}

// 探索中に「調べた」ことで手に入る手がかり。inquiry ビートで証拠として集まり、
// プレイヤーの「読み」がどの史料に支えられているかを可視化するために使う。
export interface EvidenceDef {
  id: string
  title: string
  note: string
}

// --- 相互作用の様式(モノや人に対して「何をするか」)---

// 調べ込み(観察): モノに近づいて細部を「見る」。見どころ(Hotspot)を調べると観察が言葉になり、
// 一部はそのまま手がかり(証拠)になる。hidden の見どころは、ほかを調べ尽くすと初めて現れる「奥」。
export interface Hotspot {
  id: string
  label: string
  observation: string
  evidence?: EvidenceDef
  // 最初は見えず、ほかの見どころを調べ尽くすと「よく見ると……」で現れる細部
  hidden?: boolean
}

export interface ExamineDef {
  title: string
  intro?: string
  hotspots: Hotspot[]
  doneLabel?: string
}

// 人物との対話選択: ノードをたどる分岐会話。返答が手がかりやフラグ(会話で立つ印)を生む。
export interface ConversationChoice {
  text: string
  // 次に進むノード。省略すると会話を終える
  to?: string
  evidence?: EvidenceDef
  // 立てるフラグ(例: 難聴を打ち明けた/隠した)。あとの語りや推理の色づけに使う
  flag?: string
  // 一度選ぶと消える返答(ハブ型の会話で枝を摘んでいくのに使う)
  once?: boolean
}

export interface ConversationNode {
  id: string
  lines: DialogueLine[]
  // 返答の選択肢。空なら、台詞を見せてから会話を終える終端ノード
  choices?: ConversationChoice[]
}

export interface ConversationDef {
  start: string
  nodes: ConversationNode[]
}

// その時代の行為: プレイヤー自身が「する」こと。
// piano = 呼びかけの旋律をなぞる(聴力チェーンを通るので、耳が悪いとこもって聞こえる)。
// compose = 断片を選び、手紙(遺書)を組み上げる。
export interface PianoActivity {
  kind: 'piano'
  prompt: string
  phrase: string[] // なぞるべき音名(NOTE表のキー)
  keys: string[] // 並べる鍵盤(音名)
  reflection: DialogueLine[] // 弾き終えたあとの内心
  evidence?: EvidenceDef
}

export interface ComposeFragment {
  id: string
  text: string
  // 遺書の決意に「残す」べき断片か、書き損じ(絶望のドラフト)か
  belongs: boolean
  aside?: string // 選び入れた/外したときの短い補足
}

export interface ComposeActivity {
  kind: 'compose'
  prompt: string
  fragments: ComposeFragment[]
  assembledIntro?: string
  assembled: string[] // 組み上がった手紙として最後に示す一節
  evidence?: EvidenceDef
}

export type ActivityDef = PianoActivity | ComposeActivity

export interface InteractionDef {
  id: string
  label: string
  position: [number, number, number]
  radius?: number
  required?: boolean
  sound?: string
  // 調べたときに手に入る手がかり(後続の inquiry ビートで証拠になる)。
  // examine/conversation/activity は各様式の内部でも手がかりを持てる。
  evidence?: EvidenceDef
  // 以下のうち、ちょうど一つを使う。どれも無ければ「調べた」印だけが残る。
  lines?: DialogueLine[] // 台詞・内心を読む(従来)
  examine?: ExamineDef // 調べ込み(観察)
  conversation?: ConversationDef // 人物との対話選択
  activity?: ActivityDef // その時代の行為
}

export interface ChoiceOption {
  label: string
  feedback: string
}

// inquiry ビートの「読み」(採点しない解釈の選択肢)。
export interface Reading {
  label: string
  // 選んだあとに示す「この読みを史料がどう支え、どう限界づけるか」。正誤ではない。
  support: string
  // この読みを裏づける証拠(EvidenceDef.id)。集めていれば推理盤で光る。
  supportedBy?: string[]
}

// inquiry の結び。「事実」「推定」「解釈」を分けて示すことで、
// 何が記録された史実で、何が歴史家の推定で、何がこの物語の脚色かを正直に区別する。
export interface InquiryVerdict {
  title: string
  record: string[] // 記録された事実(史料が文字どおり語ること)
  inference: string[] // 歴史家の推定(史料から合理的に導かれること)
  reading: string[] // この物語の解釈(あえて想像した内面・演出)
}

export type Beat =
  | { kind: 'title'; title: string; subtitle?: string }
  | {
      kind: 'dialogue'
      sceneryId?: string
      ambience?: string[]
      playerAt?: [number, number, number]
      // その場に立つ人物たち(名札つき)
      figures?: SceneFigure[]
      lines: DialogueLine[]
    }
  | {
      kind: 'explore'
      sceneryId: string
      // 運命が「音」の人物(ベートーヴェン)は環境音IDを列挙。
      // 運命が「光」の人物(ノーベル)は音を使わないので省略できる。
      ambience?: string[]
      spawn: [number, number, number]
      // 画面上部に出す「目あて」の一文(いま何をすればいいか)
      goal?: string
      // その場に立つ人物たち(名札つき)
      figures?: SceneFigure[]
      interactions: InteractionDef[]
      exitLabel: string
      exitPosition: [number, number, number]
    }
  | {
      kind: 'choice'
      sceneryId?: string
      situation?: string
      question: string
      options: ChoiceOption[]
      correctIndex: number
      reveal: { title: string; body: string[] }
    }
  | {
      // 推理ビート: 探索で集めた証拠から人物の内面を「読み解く」。採点はしない。
      // 結びで「事実 / 推定 / 解釈」を分けて示し、史実の精度と推理の面白さを両立させる。
      kind: 'inquiry'
      sceneryId?: string
      situation?: string
      question: string
      dossierIntro?: string
      // 章内で集めうる手がかり全体。実際に集めた分(store.evidence)だけが dossier に並ぶ。
      evidencePool?: EvidenceDef[]
      readings: Reading[]
      verdict: InquiryVerdict
    }
  | {
      kind: 'fate'
      sceneryId?: string
      to: number
      durationSec: number
      caption?: string
    }
  | { kind: 'ending'; title: string; lines: string[] }

export interface ChapterData {
  id: string
  title: string
  subtitle?: string
  fateStart: number
  beats: Beat[]
}

// 生涯年譜のひとこま
export interface ChronicleEntry {
  year: number
  text: string
  workId?: string
}

// 聴ける作品(one-shot合成音の断片)。hearingAt = 作曲当時の運命パラメータ
export interface WorkDef {
  id: string
  title: string
  year: number
  note: string
  soundId: string
  hearingAt: number
}

// 人物録のひとり
export interface FigureDef {
  id: string
  name: string
  relation: string
  note: string
}

// 生涯を終えたときの「理解度」に応じた結びの言葉(minの降順で最初に合致したもの)
export interface UnderstandingTier {
  min: number
  title: string
  text: string
}

export interface PersonData {
  id: string
  name: string
  born: number
  died: number
  // コレクション(伝記ゲーム集)のホーム画面カードに出す一行紹介
  tagline?: string
  // fate.visual を 'warmth' にすると、運命パラメータが「音」ではなく
  // 「光・色温度」を駆動する(FateAtmosphere)。省略時は従来どおり音のみ。
  fate: { id: string; label: string; visual?: 'warmth' }
  chapters: ChapterData[]
  chronicle: ChronicleEntry[]
  // 「作品」タブ(合成音の断片を聴く)。音楽家以外は省略でき、タブ自体が消える。
  works?: WorkDef[]
  figures: FigureDef[]
  understandingTiers: UnderstandingTier[]
}

export interface CameraZone {
  min: [number, number]
  max: [number, number]
  camera: [number, number, number]
  lookAtOffset?: [number, number, number]
}

// 当たり判定の立体(平面 X-Z 上)。プレイヤーがモノや人をすり抜けないようにするため、
// 各舞台の家具・人物の足元をこの形で覆う。box は中心 [x,z] と半幅 hw・半奥行 hd、
// circle は中心 [x,z] と半径 r。y(高さ)は無視し、床の上の占有面積だけで判定する。
export type Obstacle =
  | { shape: 'box'; x: number; z: number; hw: number; hd: number }
  | { shape: 'circle'; x: number; z: number; r: number }

export interface SceneryDef {
  Component: ComponentType
  bounds: { min: [number, number]; max: [number, number] }
  cameraZones: CameraZone[]
  background: string
  fog?: { color: string; near: number; far: number }
  // 家具・人物などのすり抜け防止用の当たり判定。探索(explore)中のみ有効。
  obstacles?: Obstacle[]
}
