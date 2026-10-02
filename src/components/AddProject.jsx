import { useEffect, useState } from 'react'
import { PROJECT_CATEGORIES, validateProjectInput } from '../data/projects.js'
import { useProjects } from '../hooks/useProjects.js'
import { IconClose, IconPlus } from './Icons.jsx'
import Modal from './Modal.jsx'
import ProjectCard from './ProjectCard.jsx'
import './AddProject.css'

/**
 * Add / edit form.
 *
 * Handles both cases in one component:
 *  - a new manually added project (stored in the browser)
 *  - an edit of any project, including GitHub ones (stored as an override)
 *
 * Validation reuses the data layer's `validateProjectInput`, so the rules live
 * in one place instead of being duplicated in the UI.
 */
export default function AddProject() {
  const { form, formErrors, closeForm, saveForm } = useProjects()

  const [draft, setDraft] = useState(form.draft)
  const [errors, setErrors] = useState(formErrors)
  const [techInput, setTechInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(form.draft)
    setTechInput('')
    setShowPreview(false)
    setSaving(false)
  }, [form.draft])

  useEffect(() => {
    setErrors(formErrors)
  }, [formErrors])

  // Nothing to render until the form is actually opened from the context.
  if (!form.open) return null

  const editing = Boolean(form.project)
  const isGithub = Boolean(editing && form.project.source === 'github')

  const update = (field, value) => setDraft((previous) => ({ ...previous, [field]: value }))

  const addTechnology = () => {
    const value = techInput.trim()
    if (!value) return
    if (draft.technologies.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setTechInput('')
      return
    }
    update('technologies', [...draft.technologies, value])
    setTechInput('')
  }

  const removeTechnology = (value) =>
    update(
      'technologies',
      draft.technologies.filter((item) => item !== value),
    )

  const handleTechKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTechnology()
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const { valid, errors: found } = validateProjectInput(draft)
    if (!valid) {
      setErrors(found)
      return
    }

    setSaving(true)
    const result = await saveForm(draft)
    setSaving(false)
    if (!result.ok) setErrors(result.errors || {})
  }

  const previewProject = {
    ...draft,
    id: 'preview',
    source: isGithub ? 'github' : 'manual',
    githubRepo: form.project ? form.project.githubRepo : '',
    categorySource: 'curated',
    updatedAt: draft.date,
    needsDescription: false,
  }

  const errorCount = Object.keys(errors).length

  return (
    <Modal
      open
      onClose={closeForm}
      title={editing ? `Edit: ${form.project.title}` : 'Add a new project'}
      subtitle={
        isGithub
          ? 'GitHub project — changes are stored as an override in this browser. The repository itself is never modified.'
          : editing
            ? 'Manual project stored in this browser.'
            : 'Manual project stored in this browser. Nothing is sent anywhere.'
      }
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowPreview((v) => !v)}>
            {showPreview ? 'Hide preview' : 'Preview'}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={closeForm}>
            Cancel
          </button>
          <button type="submit" form="project-form" className="btn btn--primary btn--sm" disabled={saving}>
            <IconPlus width={15} height={15} />
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add project'}
          </button>
        </>
      }
    >
      {errorCount > 0 ? (
        <div className="notice notice--danger add-project__summary" role="alert">
          <div>
            <strong className="notice__title">Check {errorCount === 1 ? 'this field' : 'these fields'}</strong>
            <p className="notice__body">{Object.values(errors).slice(0, 3).join(' ')}</p>
          </div>
        </div>
      ) : null}

      <form id="project-form" className="add-project__form" onSubmit={handleSubmit} noValidate>
        <div className="add-project__grid">
          <div className="field add-project__field--wide">
            <label htmlFor="f-title">Project title *</label>
            <input
              id="f-title"
              type="text"
              value={draft.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="e.g. Inventory Management API"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title ? <span className="field__error">{errors.title}</span> : null}
          </div>

          <div className="field">
            <label htmlFor="f-category">Category *</label>
            <select id="f-category" value={draft.category} onChange={(e) => update('category', e.target.value)}>
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="f-date">Date</label>
            <input id="f-date" type="date" value={draft.date} onChange={(e) => update('date', e.target.value)} />
            {errors.date ? <span className="field__error">{errors.date}</span> : null}
          </div>

          <div className="field add-project__field--wide">
            <label htmlFor="f-description">Short description *</label>
            <textarea
              id="f-description"
              rows={3}
              value={draft.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="One or two sentences — this is what appears on the card."
              aria-invalid={Boolean(errors.description)}
            />
            <span className="field__hint">{(draft.description || '').length} characters</span>
            {errors.description ? <span className="field__error">{errors.description}</span> : null}
          </div>

          <div className="field add-project__field--wide">
            <label htmlFor="f-long">Full description</label>
            <textarea
              id="f-long"
              rows={4}
              value={draft.longDescription}
              onChange={(event) => update('longDescription', event.target.value)}
              placeholder="What it does, how it is built, what you learned, what is still missing."
            />
          </div>

          <div className="field add-project__field--wide">
            <label htmlFor="f-tech">Technologies</label>
            <div className="add-project__tag-input">
              <input
                id="f-tech"
                type="text"
                value={techInput}
                onChange={(event) => setTechInput(event.target.value)}
                onKeyDown={handleTechKeyDown}
                placeholder="Type a technology and press Enter (e.g. PostgreSQL)"
              />
              <button type="button" className="btn btn--outline btn--sm" onClick={addTechnology}>
                <IconPlus width={14} height={14} />
                Add
              </button>
            </div>
            <span className="field__hint">
              {draft.technologies.length} added. Press Enter or comma after each one.
            </span>
            {draft.technologies.length > 0 ? (
              <ul className="add-project__chips">
                {draft.technologies.map((item) => (
                  <li key={item}>
                    <span className="tag tag--accent">{item}</span>
                    <button
                      type="button"
                      className="add-project__chip-remove"
                      onClick={() => removeTechnology(item)}
                      aria-label={`Remove ${item}`}
                    >
                      <IconClose width={12} height={12} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="field add-project__field--wide">
            <label htmlFor="f-features">Key features</label>
            <textarea
              id="f-features"
              rows={4}
              value={(draft.features || []).join('\n')}
              onChange={(event) => update('features', event.target.value.split('\n'))}
              placeholder={'One feature per line, for example:\nJWT authentication with refresh tokens\nRole-based authorisation'}
            />
            <span className="field__hint">{(draft.features || []).length} lines</span>
          </div>

          <div className="field">
            <label htmlFor="f-github">GitHub URL</label>
            <input
              id="f-github"
              type="url"
              value={draft.githubUrl}
              onChange={(event) => update('githubUrl', event.target.value)}
              placeholder="https://github.com/…"
              aria-invalid={Boolean(errors.githubUrl)}
            />
            {errors.githubUrl ? <span className="field__error">{errors.githubUrl}</span> : null}
          </div>

          <div className="field">
            <label htmlFor="f-live">Live URL</label>
            <input
              id="f-live"
              type="url"
              value={draft.liveUrl}
              onChange={(event) => update('liveUrl', event.target.value)}
              placeholder="https://…"
              aria-invalid={Boolean(errors.liveUrl)}
            />
            {errors.liveUrl ? <span className="field__error">{errors.liveUrl}</span> : null}
          </div>

          <div className="field add-project__field--wide">
            <label htmlFor="f-image">Image URL</label>
            <input
              id="f-image"
              type="url"
              value={draft.image}
              onChange={(event) => update('image', event.target.value)}
              placeholder="Leave empty to use a generated monogram cover"
              aria-invalid={Boolean(errors.image)}
            />
            {errors.image ? <span className="field__error">{errors.image}</span> : null}
          </div>
        </div>

        <div className="add-project__toggles">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={Boolean(draft.featured)}
              onChange={(event) => update('featured', event.target.checked)}
            />
            <span>Featured project (shown in the featured row)</span>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={draft.published !== false}
              onChange={(event) => update('published', event.target.checked)}
            />
            <span>Published (visible to visitors)</span>
          </label>
        </div>
      </form>

      {showPreview ? (
        <div className="add-project__preview">
          <span className="add-project__preview-label">Card preview</span>
          <div className="add-project__preview-card">
            <ProjectCard project={previewProject} preview />
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
