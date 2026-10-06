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
            <div className="hero__status-pill">
              <span className="hero__status-dot" aria-hidden="true" />
              <span>Available for Backend &amp; Full-Stack Roles</span>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="hero__title">
              Backend systems, reliable APIs, and applied data science.
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="lead hero__tagline">
              I am {SITE.name} — a software engineer building resilient server architectures, relational databases in
              PostgreSQL, and production machine learning microservices.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="btn-row hero__cta">
              <a className="btn btn--primary" href="#projects">
                Explore Projects
                <IconArrowRight width={16} height={16} />
              </a>
              <a className="btn btn--outline" href="#contact">
                Get In Touch
              </a>
            </div>
          </Reveal>

          <Reveal delay={210}>
            <div className="hero__socials" aria-label="Direct contact and repositories">
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
            <div className="hero__telemetry">
              <span className="hero__telemetry-badge mono">LIVE GITHUB SYNC</span>
              <span className="hero__telemetry-text">
                {status === 'ready'
                  ? `${stats.total} repositories loaded dynamically across ${stats.categories} functional categories`
                  : 'Syncing public repositories from GitHub…'}
              </span>
            </div>
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
              <div>
                <strong>{SITE.name}</strong>
                <span className="hero__portrait-sub">Node.js · PostgreSQL · React · Python</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}