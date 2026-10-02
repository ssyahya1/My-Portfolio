import { useState } from 'react'
import { SITE } from '../data/site.js'
import { useProjects } from '../hooks/useProjects.js'
import { IconExternal, IconGitHub, IconLinkedIn, IconLock, IconMail } from './Icons.jsx'
import './Footer.css'

export default function Footer() {
  const { adminMode, enableAdmin, disableAdmin, discardLocalChanges, isPersistent } = useProjects()
  const [showPrompt, setShowPrompt] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  const year = new Date().getFullYear()
  const { github, linkedin, email } = SITE.links

  const submitPasscode = (event) => {
    event.preventDefault()
    if (enableAdmin(passcode)) {
      setPasscode('')
      setShowPrompt(false)
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__mark" aria-hidden="true">
              {SITE.initials}
            </span>
            <div>
              <strong>{SITE.name}</strong>
              <p className="footer__role">
                {SITE.role} · {SITE.focus}
              </p>
            </div>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            <ul>
              {SITE.nav.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__links">
            <a href={github} target="_blank" rel="noreferrer noopener">
              <IconGitHub width={16} height={16} />
              GitHub
            </a>
            <a
              className={linkedin ? '' : 'is-pending'}
              href={linkedin || '#contact'}
              {...(linkedin ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              aria-disabled={linkedin ? undefined : 'true'}
            >
              <IconLinkedIn width={15} height={15} />
              LinkedIn{linkedin ? '' : ' (not set)'}
            </a>
            <a
              className={email ? '' : 'is-pending'}
              href={email ? `mailto:${email}` : '#contact'}
              aria-disabled={email ? undefined : 'true'}
            >
              <IconMail width={16} height={16} />
              Email{email ? '' : ' (not set)'}
            </a>
          </div>
        </div>

        <div className="footer__middle">
          <p className="footer__note">
            Projects are loaded live from the GitHub REST API. Nothing on this site claims a technology, metric
            or result that cannot be checked in the repository it came from.
          </p>

          <div className="footer__admin">
            {adminMode ? (
              <>
                <span className="footer__admin-state">
                  <IconLock width={14} height={14} />
                  Editing mode on
                </span>
                <button type="button" className="btn btn--ghost btn--sm" onClick={disableAdmin}>
                  Exit editing mode
                </button>
                {confirmReset ? (
                  <span className="footer__confirm">
                    <span className="muted">Clear all local changes?</span>
                    <button
                      type="button"
                      className="btn btn--sm footer__danger"
                      onClick={() => {
                        discardLocalChanges()
                        setConfirmReset(false)
                      }}
                    >
                      Yes, clear
                    </button>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmReset(false)}>
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmReset(true)}>
                    Clear local changes
                  </button>
                )}
              </>
            ) : showPrompt ? (
              <form className="footer__passcode" onSubmit={submitPasscode}>
                <label className="sr-only" htmlFor="admin-passcode">
                  Passcode for editing mode
                </label>
                <input
                  id="admin-passcode"
                  type="password"
                  value={passcode}
                  onChange={(event) => setPasscode(event.target.value)}
                  placeholder="Editing passcode"
                  autoComplete="off"
                />
                <button type="submit" className="btn btn--primary btn--sm">
                  Enter
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowPrompt(false)}>
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="footer__admin-btn"
                onClick={() => setShowPrompt(true)}
                title="Add, edit or hide projects"
              >
                <IconLock width={13} height={13} />
                Editing mode
              </button>
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="footer__built">
            Built with React and Vite
            {isPersistent ? ' · local changes stored in this browser' : ' · local storage unavailable'}
          </p>
          <a className="footer__top-link" href="#home">
            Back to top
            <IconExternal width={13} height={13} />
          </a>
        </div>
      </div>
    </footer>
  )
}
