import { SITE } from '../data/site.js'
import { useProjects } from '../hooks/useProjects.js'
import { IconCheck, IconExternal, IconGitHub } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './About.css'

const PRACTICES = [
  {
    title: 'Relational Integrity First',
    detail:
      'Foreign keys, unique constraints, and transactions belong in the database schema, ensuring data consistency before an API handler ever executes.',
  },
  {
    title: 'Layered API Boundaries',
    detail:
      'Clear separation across routing, validation middleware, auth guards, controllers, and database queries keeps systems maintainable and testable.',
  },
  {
    title: 'Applied ML Beyond Notebooks',
    detail:
      'Packaging trained Python models behind lightweight FastAPI services with strict schemas turns machine learning into consumable production APIs.',
  },
  {
    title: 'Honest Documentation & Edge Cases',
    detail:
      'Documenting failure modes, input boundaries, and architecture trade-offs directly in repository READMEs and commit histories.',
  },
]

export default function About() {
  const { profile, stats, status } = useProjects()

  const publicRepos = profile?.public_repos
  const memberSince = profile?.created_at ? new Date(profile.created_at).getFullYear() : null

  return (
    <section className="section section--soft" id="about">
      <div className="container">
        <div className="section-head">
          <h2>Engineering with depth, from database schemas to deployed models</h2>
          <p className="lead">
            I am a software engineer focused on backend architecture, full-stack systems, and practical machine
            learning. I care about how software behaves when real data, edge cases, and concurrent requests hit it.
          </p>
        </div>

        <div className="about__grid">
          <Reveal className="about__body">
            <p>
              I&apos;m {SITE.name}. Most of what I build starts with the part of an application that can never afford to
              be superficial: the database and the backend. While frontend interfaces make software accessible, the
              reliability of an entire system depends on how data is structured, how authentication is enforced, and how
              cleanly the server responds to unexpected failures.
            </p>
            <p>
              Rather than building throwaway demo scripts, I focus on end-to-end architectures. In my hospital management
              system, I structured the backend with Node.js and Express into distinct layers — routing, auth middleware,
              role-based access control, validation, and parameterized PostgreSQL queries — making sure business rules
              like single-slot appointments are enforced in database constraints, not just in the API. In the EV fleet
              charging optimizer, I placed scheduling algorithms and queue logic behind authenticated, tested REST endpoints.
            </p>
            <p>
              On the data science side, I take machine learning out of isolated notebooks and into running code. That means
              handling the full lifecycle: cleaning dirty datasets with Pandas and NumPy, engineering meaningful features,
              evaluating Scikit-learn models on recall and ROC-AUC rather than misleading accuracy scores, and deploying the
              trained model behind a FastAPI microservice so web applications can query real-time predictions.
            </p>
            <p>
              Right now, I am expanding deeper into backend systems — service/repository patterns, Redis caching,
              background task queues with BullMQ, and integrating asynchronous AI endpoints into production backends.
            </p>

            <div className="about__practices">
              <h3 className="about__practices-title">How I approach building systems</h3>
              <div className="about__practices-grid">
                {PRACTICES.map((practice) => (
                  <div className="about__practice-card" key={practice.title}>
                    <div className="about__practice-header">
                      <span className="about__practice-icon" aria-hidden="true">
                        <IconCheck width={14} height={14} />
                      </span>
                      <h4>{practice.title}</h4>
                    </div>
                    <p>{practice.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={80} className="about__aside">
            <div className="card card--pad about__card">
              <h3 className="about__card-title">Engineer Overview</h3>

              <div className="about__meta-list">
                <div className="about__meta-item">
                  <span className="about__meta-label">Primary Stack</span>
                  <p className="about__meta-val">Node.js, Express, PostgreSQL, React, Python, FastAPI</p>
                </div>
                <div className="about__meta-item">
                  <span className="about__meta-label">Core Focus</span>
                  <p className="about__meta-val">Backend architecture, relational modeling, API design, applied ML</p>
                </div>
                <div className="about__meta-item">
                  <span className="about__meta-label">Repositories &amp; Code</span>
                  <p className="about__meta-val">
                    {status === 'ready'
                      ? `${publicRepos || stats.fromGithub} public repos on GitHub${memberSince ? ` (member since ${memberSince})` : ''}`
                      : 'Connecting to GitHub…'}
                  </p>
                </div>
                <div className="about__meta-item">
                  <span className="about__meta-label">Currently Exploring</span>
                  <p className="about__meta-val">Background workers, Redis caching, microservice communication</p>
                </div>
              </div>

              <a
                className="btn btn--outline btn--sm about__github-btn"
                href={SITE.links.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                <IconGitHub width={15} height={15} />
                View GitHub Repositories
                <IconExternal width={13} height={13} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}