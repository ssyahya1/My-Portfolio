import { useProjects } from '../hooks/useProjects.js'
import { IconAlert, IconCheck, IconClose, IconInfo } from './Icons.jsx'
import './Notice.css'

const ICONS = {
  ok: IconCheck,
  danger: IconAlert,
  warn: IconAlert,
  info: IconInfo,
}

const TONES = {
  ok: 'notice--ok',
  danger: 'notice--danger',
  warn: 'notice--warn',
  info: '',
}

/**
 * Dismissible banner for feedback from project actions (saved, deleted,
 * hidden, wrong passcode). Rendered once near the top of the page so the
 * message is visible whichever section triggered it.
 */
export default function Notice() {
  const { notice, dismissNotice } = useProjects()

  if (!notice || !notice.text) return null

  const Icon = ICONS[notice.tone] || IconInfo

  return (
    <div className="notice-banner" role="status" aria-live="polite">
      <div className="container">
        <div className={`notice ${TONES[notice.tone] || ''}`}>
          <span className="notice__icon" aria-hidden="true">
            <Icon width={17} height={17} />
          </span>
          <p className="notice__body">{notice.text}</p>
          <button type="button" className="notice__dismiss" onClick={dismissNotice} aria-label="Dismiss message">
            <IconClose width={15} height={15} />
          </button>
        </div>
      </div>
    </div>
  )
}