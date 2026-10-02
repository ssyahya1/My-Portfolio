import { SITE } from '../data/site.js'
import { useProjects } from '../hooks/useProjects.js'
import {
  IconAlert,
  IconExternal,
  IconGitHub,
  IconGrid,
  IconInfo,
  IconLock,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSliders,
} from './Icons.jsx'
import ProjectCard from './ProjectCard.jsx'
import Reveal from './Reveal.jsx'
import './Projects.css'

function ProjectSkeletons() {
  return (
    <ul className="projects__grid" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <li className="skeleton projects__skeleton" key={index} />
      ))}
    </ul>
  )
}

export default function Projects() {
  const {
    status,
    error,
    refresh,
    projects,
    featuredProjects,
    gridProjects,
    filterOptions,
    category,
    setProjectFilter,
    setProjectSearch,
    search,
    adminMode,
    openCreateForm,
    disableAdmin,
    hiddenRepos,
    droppedProjects,
    stats,
  } = useProjects()

  const searching = search.trim().length > 0
  const filtering = category !== 'All' || searching

  return (
    <section className="section section--soft" id="projects">
      <div className="container">
        <div className="projects__head">
          <div className="section-head projects__head-copy">
            <span className="eyebrow">Projects</span>
            <h2>Work, loaded from GitHub</h2>
            <p className="lead">
              These cards are built from the public repositories on my GitHub account. Categories, technology
              tags and descriptions were written by hand against what each repository actually contains.
            </p>
          </div>

          <div className="projects__source card card--pad">
            <div className="projects__source-row">
              <IconGitHub width={17} height={17} />
              <span className="mono projects__source-name">
                github.com/{SITE.links.github.split('/').pop()}
              </span>
            </div>
            <p className="projects__source-note">
              {status === 'ready'
                ? `${stats.fromGithub} repositories shown · ${stats.total} projects total`
                : status === 'loading'
                  ? 'Loading repositories…'
                  : 'Repositories unavailable'}
            </p>
            <div className="btn-row">
              <a
                className="btn btn--ghost btn--sm"
                href={SITE.links.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                <IconExternal width={14} height={14} />
                Open profile
              </a>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={refresh}
                disabled={status === 'loading'}
              >
                <IconRefresh width={14} height={14} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="notice notice--warn projects__error" role="status">
            <span className="notice__icon" aria-hidden="true">
              <IconAlert width={18} height={18} />
            </span>
            <div>
              <strong className="notice__title">{error.title}</strong>
              <p className="notice__body">{error.body}</p>
              <div className="btn-row projects__error-actions">
                <button type="button" className="btn btn--outline btn--sm" onClick={refresh}>
                  <IconRefresh width={14} height={14} />
                  Try again
                </button>
                <a
                  className="btn btn--ghost btn--sm"
                  href={SITE.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <IconGitHub width={14} height={14} />
                  View on GitHub instead
                </a>
              </div>
              <p className="projects__error-note">
                Manually added projects still work; only the GitHub-sourced ones are affected.
              </p>
            </div>
          </div>
        ) : null}

        {adminMode ? (
          <div className="projects__admin-bar">
            <span className="projects__admin-badge">
              <IconLock width={14} height={14} />
              Editing mode
            </span>
            <button type="button" className="btn btn--primary btn--sm" onClick={openCreateForm}>
              <IconPlus width={15} height={15} />
              Add New Project
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={disableAdmin}>
              Exit editing mode
            </button>
          </div>
        ) : null}

        {/* Featured ------------------------------------------------------- */}
        {featuredProjects.length > 0 ? (
          <div className="projects__featured">
            <h3 className="projects__subhead">
              <IconGrid width={15} height={15} />
              Featured projects
            </h3>
            <ul className="projects__grid projects__grid--featured">
              {featuredProjects.map((project, index) => (
                <Reveal as="li" key={project.id} delay={index * 40}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Toolbar -------------------------------------------------------- */}
        <div className="projects__toolbar">
          <h3 className="projects__subhead">
            {filtering ? 'Filtered results' : 'All projects'}
            <span className="projects__count">{gridProjects.length}</span>
          </h3>

          <div className="projects__controls">
            <div className="projects__search">
              <IconSearch width={16} height={16} />
              <label className="sr-only" htmlFor="project-search">
                Search projects
              </label>
              <input
                id="project-search"
                type="search"
                value={search}
                placeholder="Search title, technology, category…"
                onChange={(event) => setProjectSearch(event.target.value)}
              />
            </div>

            <div className="projects__filters" role="group" aria-label="Filter projects by category">
              <span className="projects__filters-label">
                <IconSliders width={14} height={14} />
                Category
              </span>
              {filterOptions.map((option) => (
                <button
                  type="button"
                  key={option.name}
                  className={`projects__filter ${category === option.name ? 'is-active' : ''}`}
                  aria-pressed={category === option.name}
                  onClick={() => setProjectFilter(option.name)}
                >
                  {option.name}
                  <span className="projects__filter-count">{option.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {status === 'loading' && projects.length === 0 ? <ProjectSkeletons /> : null}

        {gridProjects.length > 0 ? (
          <ul className="projects__grid">
            {gridProjects.map((project, index) => (
              <Reveal as="li" key={project.id} delay={(index % 3) * 40}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </ul>
        ) : status !== 'loading' ? (
          <div className="projects__empty card card--pad">
            <IconInfo width={20} height={20} />
            <div>
              <strong>No projects match that.</strong>
              <p>
                {searching
                  ? `Nothing matched "${search.trim()}".`
                  : `There are no projects in the ${category} category yet.`}{' '}
                Try a different search or category.
              </p>
              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    setProjectFilter('All')
                    setProjectSearch('')
                  }}
                >
                  Reset filters
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Admin-only explanations --------------------------------------- */}
        {adminMode && (hiddenRepos.length > 0 || droppedProjects.length > 0) ? (
          <div className="projects__admin-info card card--pad">
            <h3>What is not shown</h3>
            <p className="muted">
              These repositories or entries were filtered out. The reason is recorded rather than hidden, so the
              decision can be reviewed.
            </p>
            <ul className="projects__admin-list">
              {hiddenRepos.map((repo) => (
                <li key={repo.name}>
                  <span className="mono">{repo.name}</span>
                  <span className="muted">{repo.reason}</span>
                </li>
              ))}
              {droppedProjects.map((item) => (
                <li key={item.title}>
                  <span className="mono">{item.title}</span>
                  <span className="muted">{item.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}