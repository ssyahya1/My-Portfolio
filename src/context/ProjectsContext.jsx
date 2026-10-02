import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  applyOverride,
  buildProjectsFromRepos,
  computeFilterOptions,
  computeProjectStats,
  draftFromProject,
  emptyDraft,
  filterProjects,
  isDataProject,
  mergeProjects,
  sortProjects,
  validateProjectInput,
  FILTER_ALL,
} from '../data/projects.js'
import {
  clearGitHubCache,
  describeGitHubError,
  fetchRepos,
  fetchUser,
} from '../services/githubApi.js'
import {
  createProject,
  deleteProject,
  isAdminEnabled,
  isAdminPasscode,
  listOverrides,
  listProjects,
  resetLocalData,
  setAdminEnabled,
  setOverride,
  updateProject,
} from '../services/projectStore.js'
import { storage } from '../services/storage.js'

export const ProjectsContext = createContext(null)

export function ProjectsProvider({ children }) {
  /* --------------------------------------------------------- remote data */
  const [githubProjects, setGithubProjects] = useState([])
  const [hiddenRepos, setHiddenRepos] = useState([])
  const [profile, setProfile] = useState(null)

  /* ---------------------------------------------------------- local data */
  const [manualProjects, setManualProjects] = useState([])
  const [overrides, setOverrides] = useState({})

  /* --------------------------------------------------------------- status */
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [adminMode, setAdminMode] = useState(false)

  /* ------------------------------------------------------------------- ui */
  const [category, setCategory] = useState(FILTER_ALL)
  const [search, setSearch] = useState('')
  const [detailsProject, setDetailsProject] = useState(null)
  const [form, setForm] = useState({ open: false, project: null, draft: emptyDraft() })
  const [formErrors, setFormErrors] = useState({})

  /* ---------------------------------------------------------- load GitHub */
  const loadGitHub = useCallback(async ({ refresh = false } = {}) => {
    if (refresh) clearGitHubCache()
    setStatus('loading')
    setError(null)

    try {
      const repos = await fetchRepos()
      const { projects, hidden } = buildProjectsFromRepos(repos)
      setGithubProjects(projects)
      setHiddenRepos(hidden)
      setStatus('ready')

      // The profile summary is a nice-to-have; never fail the page over it.
      try {
        setProfile(await fetchUser())
      } catch {
        setProfile(null)
      }
    } catch (caught) {
      setError(describeGitHubError(caught))
      setStatus('error')
    }
  }, [])

  /* --------------------------------------------- load local data first up */
  const loadLocal = useCallback(async () => {
    const [projects, storedOverrides] = await Promise.all([listProjects(), listOverrides()])
    setManualProjects(projects)
    setOverrides(storedOverrides)
    setAdminMode(isAdminEnabled())
  }, [])

  /* ------------------------------------------------------------- derived */
  const merged = useMemo(
    () => mergeProjects({ githubProjects, manualProjects, overrides }),
    [githubProjects, manualProjects, overrides],
  )

  /** Includes unpublished projects - only the admin view uses this. */
  const allProjects = useMemo(() => {
    const combined = [
      ...githubProjects.map((project) => applyOverride(project, overrides[project.id])),
      ...manualProjects.map((project) => applyOverride(project, overrides[project.id])),
    ]
    return sortProjects(combined)
  }, [githubProjects, manualProjects, overrides])

  const publishedProjects = merged.projects
  const displayProjects = adminMode ? allProjects : publishedProjects

  const stats = useMemo(() => computeProjectStats(publishedProjects), [publishedProjects])
  const filterOptions = useMemo(() => computeFilterOptions(publishedProjects), [publishedProjects])
  const featuredProjects = useMemo(
    () => publishedProjects.filter((project) => project.featured),
    [publishedProjects],
  )
  const dataProjects = useMemo(() => publishedProjects.filter(isDataProject), [publishedProjects])

  const gridProjects = useMemo(
    () => filterProjects(displayProjects, { category, search }),
    [displayProjects, category, search],
  )

  /* --------------------------------------------------------------- load */
  useEffect(() => {
    loadLocal()
    loadGitHub()
  }, [loadLocal, loadGitHub])

  /* ------------------------------------------------------------ actions */
  const refresh = useCallback(() => loadGitHub({ refresh: true }), [loadGitHub])
  const dismissNotice = useCallback(() => setNotice(null), [])

  const openDetails = useCallback((project) => setDetailsProject(project), [])
  const closeDetails = useCallback(() => setDetailsProject(null), [])

  const setProjectFilter = useCallback((next) => setCategory(next), [])
  const setProjectSearch = useCallback((next) => setSearch(next), [])

  const openCreateForm = useCallback(() => {
    setFormErrors({})
    setForm({ open: true, project: null, draft: emptyDraft() })
  }, [])

  const openEditForm = useCallback((project) => {
    setFormErrors({})
    setForm({ open: true, project, draft: draftFromProject(project) })
  }, [])

  const closeForm = useCallback(() => {
    setForm({ open: false, project: null, draft: emptyDraft() })
    setFormErrors({})
  }, [])

  /**
   * Creates a manual project, edits one, or stores an override for a GitHub
   * project. Returns { ok } so the form can close only on success.
   */
  const saveForm = useCallback(
    async (draft) => {
      const { valid, errors, value } = validateProjectInput(draft)
      if (!valid) {
        setFormErrors(errors)
        return { ok: false, errors }
      }

      const target = form.project

      try {
        if (target && target.source === 'github') {
          await setOverride(target.id, value)
          setOverrides(await listOverrides())
          setNotice({ tone: 'ok', text: `"${value.title}" updated. The GitHub repository was not modified.` })
        } else if (target) {
          await updateProject(target.id, value)
          setManualProjects(await listProjects())
          setNotice({ tone: 'ok', text: `"${value.title}" updated.` })
        } else {
          await createProject(value)
          setManualProjects(await listProjects())
          setNotice({ tone: 'ok', text: `"${value.title}" added to the portfolio.` })
        }

        setFormErrors({})
        setForm({ open: false, project: null, draft: emptyDraft() })
        return { ok: true }
      } catch (caught) {
        const fields = caught.fields || {}
        setFormErrors(fields)
        setNotice({ tone: 'danger', text: caught.message || 'The project could not be saved.' })
        return { ok: false, errors: fields }
      }
    },
    [form.project],
  )

  /** Hides GitHub projects (repo untouched) and deletes manual ones. */
  const removeProject = useCallback(async (project) => {
    try {
      if (project.source === 'github') {
        await setOverride(project.id, { published: false })
        setOverrides(await listOverrides())
        setNotice({
          tone: 'ok',
          text: `"${project.title}" is hidden from the portfolio. The GitHub repository itself is untouched.`,
        })
      } else {
        await deleteProject(project.id)
        setManualProjects(await listProjects())
        setNotice({ tone: 'ok', text: `"${project.title}" deleted.` })
      }
      setDetailsProject(null)
      return true
    } catch (caught) {
      setNotice({ tone: 'danger', text: caught.message || 'The project could not be removed.' })
      return false
    }
  }, [])

  const toggleFeatured = useCallback(async (project) => {
    const next = !project.featured
    try {
      if (project.source === 'github') {
        await setOverride(project.id, { featured: next })
        setOverrides(await listOverrides())
      } else {
        await updateProject(project.id, { featured: next })
        setManualProjects(await listProjects())
      }
      setNotice({
        tone: 'ok',
        text: next ? `"${project.title}" is now featured.` : `"${project.title}" is no longer featured.`,
      })
    } catch (caught) {
      setNotice({ tone: 'danger', text: caught.message || 'Could not change the featured state.' })
    }
  }, [])

  const toggleVisibility = useCallback(
    async (project) => {
      const next = project.published === false
      try {
        if (project.source === 'github') {
          await setOverride(project.id, { published: next })
          setOverrides(await listOverrides())
        } else {
          await updateProject(project.id, { published: next })
          setManualProjects(await listProjects())
        }
        setNotice({
          tone: 'ok',
          text: next ? `"${project.title}" is published.` : `"${project.title}" is unpublished.`,
        })
      } catch (caught) {
        setNotice({ tone: 'danger', text: caught.message || 'Could not change the visibility.' })
      }
    },
    [],
  )

  const setProjectCategory = useCallback(async (project, nextCategory) => {
    try {
      if (project.source === 'github') {
        await setOverride(project.id, { category: nextCategory })
        setOverrides(await listOverrides())
      } else {
        await updateProject(project.id, { category: nextCategory })
        setManualProjects(await listProjects())
      }
      setNotice({ tone: 'ok', text: `"${project.title}" moved to ${nextCategory}.` })
    } catch (caught) {
      setNotice({ tone: 'danger', text: caught.message || 'Could not change the category.' })
    }
  }, [])

  /* -------------------------------------------------------- admin session */
  const enableAdmin = useCallback((passcode) => {
    if (!isAdminPasscode(passcode)) {
      setNotice({ tone: 'danger', text: 'That passcode is not correct.' })
      return false
    }
    setAdminEnabled(true)
    setAdminMode(true)
    setNotice({
      tone: 'ok',
      text: 'Editing mode enabled. Changes are stored in this browser only, so they do not affect other visitors.',
    })
    return true
  }, [])

  const disableAdmin = useCallback(() => {
    setAdminEnabled(false)
    setAdminMode(false)
    setNotice(null)
    setDetailsProject(null)
    setForm({ open: false, project: null, draft: emptyDraft() })
    setFormErrors({})
  }, [])

  const discardLocalChanges = useCallback(async () => {
    resetLocalData()
    await loadLocal()
    setNotice({ tone: 'ok', text: 'All locally stored changes were cleared.' })
  }, [loadLocal])

  const value = useMemo(
    () => ({
      // data
      projects: publishedProjects,
      allProjects,
      gridProjects,
      featuredProjects,
      dataProjects,
      stats,
      filterOptions,
      hiddenRepos,
      droppedProjects: merged.dropped,
      profile,

      // status
      status,
      error,
      notice,
      adminMode,
      isPersistent: storage.isPersistent(),

      // ui state
      category,
      search,
      detailsProject,
      form,
      formErrors,

      // actions
      refresh,
      setProjectFilter,
      setProjectSearch,
      openDetails,
      closeDetails,
      openCreateForm,
      openEditForm,
      closeForm,
      saveForm,
      removeProject,
      toggleFeatured,
      toggleVisibility,
      setProjectCategory,
      enableAdmin,
      disableAdmin,
      discardLocalChanges,
      dismissNotice,
    }),
    [
      publishedProjects,
      allProjects,
      gridProjects,
      featuredProjects,
      dataProjects,
      stats,
      filterOptions,
      hiddenRepos,
      merged.dropped,
      profile,
      status,
      error,
      notice,
      adminMode,
      category,
      search,
      detailsProject,
      form,
      formErrors,
      refresh,
      setProjectFilter,
      setProjectSearch,
      openDetails,
      closeDetails,
      openCreateForm,
      openEditForm,
      closeForm,
      saveForm,
      removeProject,
      toggleFeatured,
      toggleVisibility,
      setProjectCategory,
      enableAdmin,
      disableAdmin,
      discardLocalChanges,
      dismissNotice,
    ],
  )

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}