import { useEffect, useId, useRef } from 'react'
import { IconClose } from './Icons.jsx'
import './Modal.css'

/**
 * Accessible dialog shell used by the project details view and the add / edit
 * form.
 *
 * - Escape closes it, clicking the backdrop closes it.
 * - Focus moves into the dialog when it opens and returns to the previously
 *   focused element when it closes.
 * - Background scrolling is locked while open.
 * - Sizes: "md" for details, "lg" for the form.
 */
export default function Modal({ open, onClose, title, subtitle, size = 'md', children, footer }) {
  const dialogRef = useRef(null)
  const lastFocused = useRef(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!open) return undefined

    lastFocused.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const node = dialogRef.current
    if (node) {
      const focusable = node.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      ;(focusable || node).focus()
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !node) return

      // Keep focus inside the dialog.
      const items = Array.from(
        node.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null)

      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (lastFocused.current && lastFocused.current.focus) lastFocused.current.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-root">
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? descId : undefined}
        ref={dialogRef}
        tabIndex={-1}
      >
        <header className="modal__head">
          <div className="modal__headings">
            <h3 className="modal__title" id={titleId}>
              {title}
            </h3>
            {subtitle ? (
              <p className="modal__subtitle" id={descId}>
                {subtitle}
              </p>
            ) : null}
          </div>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close dialog">
            <IconClose width={18} height={18} />
          </button>
        </header>

        <div className="modal__body">{children}</div>

        {footer ? <footer className="modal__foot">{footer}</footer> : null}
      </div>
    </div>
  )
}