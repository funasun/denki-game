import type { ReactNode } from 'react'

interface TitleCardProps {
  title: string
  subtitle?: string
  buttonLabel?: string
  onStart: () => void
  footer?: ReactNode
}

export function TitleCard({
  title,
  subtitle,
  buttonLabel = 'はじめる',
  onStart,
  footer,
}: TitleCardProps) {
  return (
    <div className="fullscreen-card">
      <h1 className="card-title">{title}</h1>
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
      <button className="card-button" onClick={onStart}>
        {buttonLabel}
      </button>
      {footer}
    </div>
  )
}
