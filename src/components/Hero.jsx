import { SITE } from '../data/site.js'
import { useProjects } from '../hooks/useProjects.js'
import { IconArrowRight, IconGitHub, IconLinkedIn, IconMail } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './Hero.css'

/** The technologies shown here are all verified in the projects below. */
const BADGES = ['Node.js · Backend', 'PostgreSQL · Data', 'React · Full-stack', 'Python · ML']

export default function Hero() {
  const { stats, status } = useProjects()

  return (
    <section className="section section--plain hero" id="home">
      <div className="container hero__inner">
        <div className="hero__copy">
          <Reveal>
            <span className="eyebrow hero__availability">Software Engineer <span aria-hidden="true">|</span> Open to Opportunities</span>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="hero__title">
              Building Digital Products <span>with Code &amp; Creativity.</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="lead hero__tagline">
              Backend-first engineering, full-stack products, and data-driven applications built to work beyond the demo.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="btn-row hero__cta">
              <a className="btn btn--primary" href="#projects">
                View My Projects
                <IconArrowRight width={17} height={17} />
              </a>
              <a className="btn btn--outline" href="#contact">
                Connect
              </a>
            </div>
          </Reveal>

          <Reveal delay={210}>
            <div className="hero__socials" aria-label="Social links">
              <a href={SITE.links.github} target="_blank" rel="noreferrer noopener">
                <IconGitHub width={16} height={16} /> GitHub
              </a>
              <a href={SITE.links.linkedin} target="_blank" rel="noreferrer noopener">
                <IconLinkedIn width={16} height={16} /> LinkedIn
              </a>
              <a href={`mailto:${SITE.links.email}`}>
                <IconMail width={16} height={16} /> Email
              </a>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <dl className="hero__stats">
              <div className="hero__stat">
                <dt>Projects shown</dt>
                <dd>{status === 'ready' ? stats.total : '—'}</dd>
              </div>
              <div className="hero__stat">
                <dt>Categories</dt>
                <dd>{status === 'ready' ? stats.categories : '—'}</dd>
              </div>
              <div className="hero__stat">
                <dt>Data / ML projects</dt>
                <dd>{status === 'ready' ? stats.dataProjects : '—'}</dd>
              </div>
            </dl>
            <p className="hero__stats-note">
              Counted automatically from the projects loaded from GitHub — nothing here is a hand-written number.
            </p>
          </Reveal>
        </div>

        <Reveal delay={140} className="hero__aside">
          <div className="hero__portrait-frame">
            <div className="hero__portrait-wrap">
              <img
                className="hero__portrait"
                src="/profile-photo.jpeg"
                alt="Syed Muhammad Yahya"
              />
            </div>
            <div className="hero__portrait-caption">
              <span className="hero__portrait-status" aria-hidden="true" />
              Backend-first developer
            </div>
          </div>
          <ul className="hero__float-badges" aria-label="Areas of focus">
            {BADGES.map((badge) => <li key={badge}>{badge}</li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}