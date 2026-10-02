import { useEffect, useState } from 'react'
import { formatUpdated } from '../data/projects.js'
import { fetchRepoReadme } from '../services/githubApi.js'
import { useProjects } from '../hooks/useProjects.js'
import {
  IconCheck,
  IconExternal,
  IconEye,
  IconEyeOff,
  IconGitHub,
  IconPencil,
  IconStar,
  IconTrash,
} from './Icons.jsx'
import Modal from './Modal.jsx'
import './ProjectDetails.css'

/** Data-science sections, rendered only when the project actually has them. */
const DS_FIELDS = [
  ['dataset', 'Dataset'],
  ['problem', 'Problem'],
  ['preparation', 'Data preparation'],
  ['analysis', 'Analysis'],
  ['visualization', 'Visualization'],
  ['model', 'Model'],
  ['evaluation', 'Evaluation'],
  ['findings', 'Key findings'],
]

export default function ProjectDetails() {
  const {
    detailsProject: project,
    closeDetails,
    adminMode,
    openEditForm,
    toggleFeatured,
    toggleVisibility,
    removeProject,
  } = useProjects()

  const [readme, setReadme] = useState(null)
  const [readmeState, setReadmeState] = useState('idle')
  const [showReadme, setShowReadme] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const projectId = project ? project.id : null
  const repoName = project ? project.githubRepo : ''
  const isGithub = Boolean(project && project.source === 'github')

  useEffect(() => {
    setReadme(null)
    setShowReadme(false)
    setConfirming(false)

    if (!projectId || !repoName) {
      setReadmeState('idle')
      return undefined
    }

    let cancelled = false
    setReadmeState('loading')

    fetchRepoReadme(repoName)
      .then((text) => {
        if (cancelled) return
        setReadme(text)
        setReadmeState(text ? 'ready' : 'empty')
      })
      .catch(() => {
        if (!cancelled) setReadmeState('empty')
      })

    return () => {
      cancelled = true
    }
  }, [projectId, repoName])

  if (!project) return null

  const updated = formatUpdated(project.updatedAt || project.date)
  const hasLong = Boolean(project.longDescription && project.longDescription.trim())
  const bodyCopy = hasLong ? project.longDescription : project.description
  const dsFields = project.ds ? DS_FIELDS.filter(([key]) => Boolean(project.ds[key])) : []

  return (
    <Modal
      open
      onClose={closeDetails}
      title={project.title}
      subtitle={`${project.category} · ${isGithub ? project.githubRepo : 'manually added project'}`}
      size="md"
      footer={
        <>
          {isGithub ? (
            <a
              className="btn btn--ghost btn--sm"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <IconGitHub width={15} height={15} />
              Repository
            </a>
          ) : null}
          {project.frontendUrl ? (
            <a
              className="btn btn--ghost btn--sm"
              href={project.frontendUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <IconGitHub width={15} height={15} />
              JavaScript UI
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              className="btn btn--primary btn--sm"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <IconExternal width={14} height={14} />
              Live demo
            </a>
          ) : null}
          {project.apiDocs ? (
            <a
              className="btn btn--outline btn--sm"
              href={project.apiDocs}
              target="_blank"
              rel="noreferrer noopener"
            >
              <IconExternal width={14} height={14} />
              API docs
            </a>
          ) : null}
          <button type="button" className="btn btn--ghost btn--sm" onClick={closeDetails}>
            Close
          </button>
        </>
      }
    >
      {project.image ? (
        <figure className="details__figure">
          <img src={project.image} alt="" loading="lazy" />
        </figure>
      ) : null}

      {hasLong ? (
        <p className="details__summary">{project.description}</p>
      ) : null}

      <p className="details__body">{bodyCopy}</p>

      {project.needsDescription ? (
        <p className="details__flag">
          This repository has no description on GitHub, and none has been added here yet. Use Edit in editing
          mode to write a real one.
        </p>
      ) : null}

      {project.technologies && project.technologies.length > 0 ? (
        <section className="details__section">
          <h4>Technologies</h4>
          <ul className="tag-list">
            {project.technologies.map((item) => (
              <li key={item}>
                <span className={`tag ${dsFields.length ? 'tag--data' : 'tag--accent'}`}>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.features && project.features.length > 0 ? (
        <section className="details__section">
          <h4>Key features</h4>
          <ul className="details__features">
            {project.features.map((item) => (
              <li key={item}>
                <IconCheck width={15} height={15} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dsFields.length > 0 ? (
        <section className="details__section details__section--data">
          <h4>
            Data science detail
            <span className="details__hint">documented from the repository</span>
          </h4>
          <dl className="details__ds">
            {dsFields.map(([key, label]) => (
              <div className="details__ds-row" key={key}>
                <dt>{label}</dt>
                <dd>{project.ds[key]}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="details__section">
        <h4>Project facts</h4>
        <dl className="details__meta">
          {updated ? (
            <div>
              <dt>Last updated</dt>
              <dd>{updated}</dd>
            </div>
          ) : null}
          {project.language ? (
            <div>
              <dt>Primary language</dt>
              <dd>{project.language}</dd>
            </div>
          ) : null}
          <div>
            <dt>Category</dt>
            <dd>
              {project.category}
              {project.categorySource === 'inferred' ? ' (inferred from repository metadata)' : ''}
            </dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{isGithub ? 'Loaded from the GitHub API' : 'Added manually in this portfolio'}</dd>
          </div>
          {isGithub && project.stars > 0 ? (
            <div>
              <dt>Stars</dt>
              <dd>{project.stars}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      {isGithub ? (
        <section className="details__section">
          <div className="details__readme-head">
            <h4>Repository README</h4>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setShowReadme((value) => !value)}
              aria-expanded={showReadme}
            >
              {showReadme ? 'Hide README' : 'Show README'}
            </button>
          </div>
          <p className="details__hint-block">
            Fetched on demand from the repository and shown as raw Markdown, so nothing gets paraphrased or
            invented between the code and this page.
          </p>
          {readmeState === 'loading' ? <div className="skeleton details__readme-skeleton" /> : null}
          {readmeState === 'empty' ? (
            <p className="muted details__hint-block">
              No README.md was found on the default branch of this repository.
            </p>
          ) : null}
          {readmeState === 'ready' && showReadme && readme ? (
            <pre className="details__readme">{readme}</pre>
          ) : null}
        </section>
      ) : null}

      {adminMode ? (
        <section className="details__admin">
          <h4>Editing</h4>
          <div className="btn-row">
            <button type="button" className="btn btn--outline btn--sm" onClick={() => openEditForm(project)}>
              <IconPencil width={14} height={14} />
              Edit project
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => toggleFeatured(project)}>
              <IconStar width={14} height={14} />
              {project.featured ? 'Remove from featured' : 'Mark as featured'}
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => toggleVisibility(project)}>
              {project.published === false ? (
                <IconEye width={14} height={14} />
              ) : (
                <IconEyeOff width={14} height={14} />
              )}
              {project.published === false ? 'Publish' : 'Unpublish'}
            </button>

            {confirming ? (
              <>
                <span className="muted details__confirm-text">
                  {isGithub ? 'Hide this project from the portfolio?' : 'Delete this project permanently?'}
                </span>
                <button type="button" className="btn btn--sm details__danger" onClick={() => removeProject(project)}>
                  <IconTrash width={14} height={14} />
                  Yes, {isGithub ? 'hide it' : 'delete it'}
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn--ghost btn--sm details__danger-ghost"
                onClick={() => setConfirming(true)}
              >
                <IconTrash width={14} height={14} />
                {isGithub ? 'Hide from portfolio' : 'Delete project'}
              </button>
            )}
          </div>
          <p className="muted details__hint-block">
            {isGithub
              ? 'Hiding a GitHub project only stores a preference in this browser — the repository is never modified.'
              : 'Manual projects are stored in this browser only.'}
          </p>
        </section>
      ) : null}
    </Modal>
  )
}