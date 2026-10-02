import { useState } from 'react'
import { formatUpdated, isDataProject } from '../data/projects.js'
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
import './ProjectCard.css'

/** "Smart EV Fleet Charging" -> "SE" (used for the generated cover). */
function monogram(title = '') {
  const words = title
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(Boolean)
  if (words.length === 0) return 'PR'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

/**
 * A single project card.
 *
 * Covers: a real image when the project has one, otherwise a generated
 * monogram cover. No fake screenshots are used anywhere.
 * When `preview` is true the card is inert (used inside the add / edit form).
 */
export default function ProjectCard({ project, preview = false }) {
  const { adminMode, openDetails, openEditForm, toggleFeatured, toggleVisibility, removeProject, form } =
    useProjects()
  const [imageFailed, setImageFailed] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const dataProject = isDataProject(project)
  const updated = formatUpdated(project.updatedAt || project.date)
  const tags = (project.technologies || []).slice(0, 6)
  const extraTags = Math.max((project.technologies || []).length - tags.length, 0)
  const unpublished = project.published === false
  const showImage = Boolean(project.image) && !imageFailed
  const editingThis = Boolean(form.open && form.project && form.project.id === project.id)

  return (
    <article
      className={`project-card ${dataProject ? 'project-card--data' : ''} ${
        unpublished ? 'project-card--unpublished' : ''
      } ${editingThis ? 'project-card--editing' : ''}`}
    >
      <div className="project-card__cover">
        {showImage ? (
          <img src={project.image} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <span className="project-card__monogram" aria-hidden="true">
            {monogram(project.title)}
          </span>
        )}
        <span className="project-card__cover-tag">{project.category}</span>
      </div>

      <div className="project-card__body">
        <div className="project-card__meta">
          {project.featured ? (
            <span className="chip chip--featured chip--dot">
              <IconStar width={12} height={12} />
              Featured
            </span>
          ) : null}
          {unpublished ? <span className="chip chip--dot">Unpublished</span> : null}
          {project.source === 'manual' ? (
            <span className="chip chip--dot">Manual entry</span>
          ) : (
            <span className="chip chip--dot project-card__repo" title={project.githubRepo}>
              {project.githubRepo}
            </span>
          )}
        </div>

        <h3 className="project-card__title">
          {preview ? (
            project.title || 'Untitled project'
          ) : (
            <button type="button" className="project-card__title-button" onClick={() => openDetails(project)}>
              {project.title}
            </button>
          )}
        </h3>

        <p className="project-card__description">{project.description}</p>

        {project.needsDescription ? (
          <p className="project-card__flag">
            This repository has no description on GitHub yet, so the card shows neutral placeholder text.
          </p>
        ) : null}

        {tags.length > 0 ? (
          <ul className="tag-list project-card__tags">
            {tags.map((tag) => (
              <li key={tag}>
                <span className="tag">{tag}</span>
              </li>
            ))}
            {extraTags > 0 ? (
              <li>
                <span className="tag">+{extraTags} more</span>
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="project-card__foot">
          <span className="project-card__date">{updated ? `Updated ${updated}` : ''}</span>
          <span className="project-card__links">
            {project.githubUrl ? (
              <a
                className="project-card__link"
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${project.title} on GitHub`}
              >
                <IconGitHub width={15} height={15} />
                Code
              </a>
            ) : null}
            {project.liveUrl ? (
              <a
                className="project-card__link"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${project.title} live site`}
              >
                <IconExternal width={14} height={14} />
                Live
              </a>
            ) : null}
            {!preview ? (
              <button
                type="button"
                className="project-card__link project-card__link--strong"
                onClick={() => openDetails(project)}
              >
                Details
              </button>
            ) : null}
          </span>
        </div>

        {adminMode && !preview ? (
          <div className="project-card__admin">
            <span className="project-card__admin-label">Admin</span>
            <button type="button" className="project-card__admin-btn" onClick={() => openEditForm(project)}>
              <IconPencil width={14} height={14} />
              Edit
            </button>
            <button type="button" className="project-card__admin-btn" onClick={() => toggleFeatured(project)}>
              <IconStar width={14} height={14} />
              {project.featured ? 'Unfeature' : 'Feature'}
            </button>
            <button type="button" className="project-card__admin-btn" onClick={() => toggleVisibility(project)}>
              {unpublished ? <IconEye width={14} height={14} /> : <IconEyeOff width={14} height={14} />}
              {unpublished ? 'Publish' : 'Hide'}
            </button>

            {confirming ? (
              <span className="project-card__confirm" role="group" aria-label="Confirm removal">
                <span className="project-card__confirm-text">
                  {project.source === 'github' ? 'Hide this project?' : 'Delete this project?'}
                </span>
                <button
                  type="button"
                  className="project-card__admin-btn is-danger"
                  onClick={() => removeProject(project)}
                >
                  <IconCheck width={14} height={14} />
                  Yes
                </button>
                <button type="button" className="project-card__admin-btn" onClick={() => setConfirming(false)}>
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                className="project-card__admin-btn is-danger"
                onClick={() => setConfirming(true)}
              >
                <IconTrash width={14} height={14} />
                {project.source === 'github' ? 'Hide' : 'Delete'}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </article>
  )
}