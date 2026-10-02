import { SITE } from '../data/site.js'
import { useProjects } from '../hooks/useProjects.js'
import { IconExternal, IconGitHub, IconStar } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './GitHubSection.css'

export default function GitHubSection() {
  const { profile, projects, status } = useProjects()
  const repos = projects.filter((project) => project.source === 'github')
  const since = profile?.created_at ? new Date(profile.created_at).getFullYear() : null

  return (
    <section className="section" id="github">
      <div className="container">
        <div className="gh__card card">
          <div className="gh__main">
            <span className="gh__icon" aria-hidden="true">
              <IconGitHub width={26} height={26} />
            </span>
            <div>
              <span className="eyebrow">Explore my GitHub</span>
              <h2 className="gh__title">Code lives on GitHub, not in screenshots</h2>
              <p className="gh__copy">
                Every project on this page comes from a public repository. The full commit history, READMEs,
                notebooks and configuration are all there — including the projects that did not work out as
                well as planned.
              </p>

              <dl className="gh__stats">
                <div>
                  <dt>Profile</dt>
                  <dd className="mono">@{SITE.links.github.split('/').pop()}</dd>
                </div>
                <div>
                  <dt>Public repositories</dt>
                  <dd>{profile?.public_repos ?? '—'}</dd>
                </div>
                <div>
                  <dt>Shown here</dt>
                  <dd>{status === 'ready' ? repos.length : '—'}</dd>
                </div>
                {since ? (
                  <div>
                    <dt>On GitHub since</dt>
                    <dd>{since}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="btn-row gh__actions">
                <a
                  className="btn btn--primary"
                  href={SITE.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <IconGitHub width={16} height={16} />
                  View GitHub profile
                  <IconExternal width={14} height={14} />
                </a>
                <a
                  className="btn btn--ghost"
                  href={`${SITE.links.github}?tab=repositories`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Browse repositories
                </a>
              </div>
            </div>
          </div>

          {repos.length > 0 ? (
            <Reveal className="gh__list">
              <h3 className="gh__list-title">
                <IconStar width={14} height={14} />
                Repositories shown on this page
              </h3>
              <ul>
                {repos.map((project) => (
                  <li key={project.id}>
                    <a href={project.githubUrl} target="_blank" rel="noreferrer noopener">
                      <span className="mono gh__repo-name">{project.githubRepo}</span>
                      <span className="gh__repo-meta">
                        {project.category}
                        {project.language ? ` · ${project.language}` : ''}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  )
}