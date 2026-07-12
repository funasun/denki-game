import type { EvidenceDef, Reading } from '../types'

interface InquiryPanelProps {
  situation?: string
  question: string
  dossierIntro?: string
  // 探索で実際に「調べた」手がかりだけが集まる(調べ落とせば手薄なまま推理することになる)
  dossier: EvidenceDef[]
  readings: Reading[]
  onSelect: (index: number) => void
}

// 推理ビート: 集めた証拠を並べ、そこから人物の内面を「読み解く」。正解/不正解はない。
export function InquiryPanel({
  situation,
  question,
  dossierIntro,
  dossier,
  readings,
  onSelect,
}: InquiryPanelProps) {
  return (
    <div className="choice-layer">
      <div className="choice-panel inquiry-panel">
        {situation && <p className="choice-situation">{situation}</p>}

        <div className="dossier">
          <div className="dossier-heading">
            集めた手がかり<span className="dossier-count">{dossier.length}</span>
          </div>
          {dossierIntro && <p className="dossier-intro">{dossierIntro}</p>}
          {dossier.length > 0 ? (
            <ul className="dossier-list">
              {dossier.map((e) => (
                <li key={e.id} className="dossier-item">
                  <span className="dossier-item-title">{e.title}</span>
                  <span className="dossier-item-note">{e.note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dossier-empty">
              手がかりはまだ何もない。それでも、読み解くことはできる。
            </p>
          )}
        </div>

        <h2 className="choice-question">{question}</h2>
        <div className="choice-options">
          {readings.map((r, i) => (
            <button key={i} className="choice-option" onClick={() => onSelect(i)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
