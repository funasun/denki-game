import type { EvidenceDef, InquiryVerdict } from '../types'

interface VerdictPanelProps {
  chosenLabel: string
  support: string
  // 選んだ読みを実際に裏づけた、手元の手がかり(推理盤の「線がつながった」瞬間)
  supportingEvidence: EvidenceDef[]
  verdict: InquiryVerdict
  onDone: () => void
}

// 推理の結び。正誤で採点せず、「あなたの読み」を史料がどう支えるかを示し、
// そのうえで【記録された事実 / 歴史家の推定 / この物語の解釈】を分けて正直に提示する。
export function VerdictPanel({
  chosenLabel,
  support,
  supportingEvidence,
  verdict,
  onDone,
}: VerdictPanelProps) {
  return (
    <div className="choice-layer">
      <div className="reveal-panel verdict-panel">
        <div className="reveal-heading">史料と照らす</div>

        <div className="verdict-reading-block">
          <span className="reveal-chosen">あなたの読み — 「{chosenLabel}」</span>
          <p className="verdict-support">{support}</p>
          {supportingEvidence.length > 0 && (
            <div className="verdict-links">
              <span className="verdict-links-label">この読みを支えた手がかり</span>
              <ul className="verdict-links-list">
                {supportingEvidence.map((e) => (
                  <li key={e.id}>{e.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <h2 className="reveal-title">{verdict.title}</h2>

        <div className="verdict-layer verdict-record">
          <span className="verdict-layer-tag">記録された事実</span>
          {verdict.record.map((p, i) => (
            <p key={i} className="verdict-layer-body">
              {p}
            </p>
          ))}
        </div>

        <div className="verdict-layer verdict-inference">
          <span className="verdict-layer-tag">歴史家の推定</span>
          {verdict.inference.map((p, i) => (
            <p key={i} className="verdict-layer-body">
              {p}
            </p>
          ))}
        </div>

        <div className="verdict-layer verdict-reading">
          <span className="verdict-layer-tag">この物語の解釈</span>
          {verdict.reading.map((p, i) => (
            <p key={i} className="verdict-layer-body">
              {p}
            </p>
          ))}
        </div>

        <button className="card-button" onClick={onDone}>
          物語へ戻る
        </button>
      </div>
    </div>
  )
}
