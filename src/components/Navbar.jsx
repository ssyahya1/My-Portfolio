import { useEffect, useState } from 'react'
import { SITE } from '../data/site.js'
import { IconClose, IconGitHub, IconMenu } from './Icons.jsx'
import './Navbar.css'

/**
 * Sticky navigation.
 *
 * - Highlights the section currently in the middle of the viewport.
 * - Collapses to a hamburger + dropdown panel on small screens.
 * - Closes the mobile panel on link click, Escape, or resize past the
 *   breakpoint, so it can never get stuck open.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = SITE.nav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)

    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a className="navbar__brand" href="#home" onClick={() => setOpen(false)}>
          <span className="navbar__mark" aria-hidden="true">
            {SITE.initials}
          </span>
          <span className="navbar__brand-text">
            <strong>{SITE.name}</strong>
            <span className="navbar__brand-role">{SITE.role}</span>
          </span>
        </a>

        <nav className="navbar__nav" aria-label="Sections">
          <ul className="navbar__list">
            {SITE.nav.map((item) => (
              <li key={item.id}>
                <a
                  className={`navbar__link ${active === item.id ? 'is-active' : ''}`}
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <a
            className="navbar__icon-link"
            href={SITE.links.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub profile"
          >
            <IconGitHub width={17} height={17} />
            <span className="navbar__icon-label">GitHub</span>
          </a>
          <a className="btn btn--primary btn--sm navbar__cta" href="#contact">
            Get in touch
          </a>
          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={open}
            aria-controls="navbar-mobile"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <IconClose width={20} height={20} /> : <IconMenu width={20} height={20} />}
          </button>
        </div>
      </div>

      <div className={`navbar__mobile ${open ? 'is-open' : ''}`} id="navbar-mobile" hidden={!open}>
        <ul className="navbar__mobile-list">
          {SITE.nav.map((item) => (
            <li key={item.id}>
              <a
                className={`navbar__mobile-link ${active === item.id ? 'is-active' : ''}`}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          className="navbar__mobile-github"
          href={SITE.links.github}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => setOpen(false)}
        >
          <IconGitHub width={16} height={16} />
          github.com/{SITE.links.github.split('/').pop()}
        </a>
      </div>
    </header>
  )
}