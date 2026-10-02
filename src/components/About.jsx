import { SITE } from '../data/site.js'
import { useProjects } from '../hooks/useProjects.js'
import { IconArrowRight, IconExternal, IconGitHub } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './About.css'

const PRINCIPLES = [
  'Build complete systems instead of finishing tutorials.',
  'Keep the interesting logic out of the HTTP layer.',
  'Put rules in the database too, not only in the API.',
  'Document what did not work, not just what did.',
  'Ship it somewhere real, then fix what breaks.',
]

export default function About() {
  const { profile, stats, status } = useProjects()

  const publicRepos = profile?.public_repos
  const memberSince = profile?.created_at ? new Date(profile.created_at).getFullYear() : null

  return (
    <section className="section section--soft" id="about">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">About</span>
          <h2>A backend-first developer who finishes the whole application</h2>
        </div>

        <div className="about__grid">
          <Reveal className="about__body">
            <p>
              I am {SITE.name}, a developer focused on backend and full-stack engineering, with a growing
              body of data science and machine learning work. Most of what I build follows the same shape: a
              real problem, a database that models it properly, an API that enforces the rules, and an
              interface someone can actually use.
            </p>
            <p>
              I started with Python fundamentals and course assignments, then moved on to building complete
              applications rather than exercises. That shift is visible in the work: the hospital management
              system splits the API into routes, controllers, middleware and a database layer, with roles,
              ownership checks, validation and a central error handler; the EV fleet optimiser puts data
              structures and algorithms behind a real REST API with authentication hardening and automated
              tests.
            </p>
            <p>
              On the data side I follow the workflow through to the end — cleaning and exploring the data,
              engineering features, training and comparing several models, and then serving the chosen one.
              The fraud detection project is the clearest example: the model is served behind a FastAPI
              endpoint and consumed by a separate interface, which is much closer to how AI features actually
              arrive in a product than a notebook is.
            </p>
            <p>
              I am currently going deeper into backend architecture — service and repository layers,
              background jobs, caching and real-time features — and into integrating AI capabilities into
              ordinary backend systems. The principles below are the ones I actually work by.
            </p>

            <div className="about__principles">
              <h3>How I work</h3>
              <ul className="about__principle-list">
                {PRINCIPLES.map((item) => (
                  <li key={item}>
                    <IconArrowRight width={15} height={15} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100} className="about__aside">
            <div className="card card--pad about__facts">
              <h3 className="about__facts-title">Quick facts</h3>
              <dl className="about__fact-list">
                <div className="about__fact">
                  <dt>Focus</dt>
                  <dd>Backend systems, full-stack applications, data science &amp; AI</dd>
                </div>
                <div className="about__fact">
                  <dt>Primary stack</dt>
                  <dd>Node.js, Express, PostgreSQL, React, Python, Scikit-learn</dd>
                </div>
                <div className="about__fact">
                  <dt>Projects shown here</dt>
                  <dd>{status === 'ready' ? `${stats.total} (${stats.fromGithub} loaded from GitHub)` : 'Loading…'}</dd>
                </div>
                <div className="about__fact">
                  <dt>Public repositories</dt>
                  <dd>
                    {publicRepos || (status === 'ready' ? '—' : 'Loading…')}
                    {memberSince ? ` · on GitHub since ${memberSince}` : ''}
                  </dd>
                </div>
                <div className="about__fact">
                  <dt>Currently learning</dt>
                  <dd>Service and repository layers, background jobs, caching, AI integration</dd>
                </div>
              </dl>

              <a
                className="btn btn--outline btn--sm about__github"
                href={SITE.links.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                <IconGitHub width={15} height={15} />
                @{SITE.links.github.split('/').pop()}
                <IconExternal width={13} height={13} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}