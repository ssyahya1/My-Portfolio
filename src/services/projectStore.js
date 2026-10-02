/**
 * =========================================================================
 * PROJECT MANAGEMENT LAYER
 * =========================================================================
 * Owns everything that is *edited* rather than *fetched*:
 *   - manually added projects
 *   - editorial overrides for GitHub projects (featured, published, copy)
 *   - the local editing ("admin") session flag
 *
 * Every method is async on purpose. The current implementation persists to
 * localStorage, but the signatures match a REST API, so moving to a real
 * backend (Postgres + admin authentication) means replacing the bodies of
 * these functions with `fetch` calls - the UI stays unchanged.
 *
 *   createProject(input)          -> POST   /api/projects
 *   listProjects()                -> GET    /api/projects
 *   updateProject(id, patch)      -> PATCH  /api/projects/:id
 *   deleteProject(id)             -> DELETE /api/projects/:id
 *   setOverride(id, patch)        -> PATCH  /api/projects/:id/overrides
 *
 * NOTE ON ADMIN MODE: the passcode is a convenience gate for a static site,
 * not security. Anything shipped to the browser is public. When the projects
 * move behind a real API, this becomes a real login and these functions become
 * authorised requests.
 */

import { storage } from './storage.js'
import { ADMIN_PASSCODE } from '../data/site.js'
import { createManualProject, validateProjectInput } from '../data/projects.js'

const KEY_PROJECTS = 'manual-projects'
const KEY_OVERRIDES = 'project-overrides'
const KEY_ADMIN = 'admin-mode'

/* ------------------------------------------------------------- utilities */

const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

function readProjects() {
  const value = storage.get(KEY_PROJECTS, [])
  return Array.isArray(value) ? value : []
}

function readOverrides() {
  const value = storage.get(KEY_OVERRIDES, {})
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

/* ------------------------------------------------- manual project CRUD */

export async function listProjects() {
  return readProjects()
}

export async function createProject(input) {
  const { valid, errors, value } = validateProjectInput(input)
  if (!valid) {
    const error = new Error('The project could not be saved because some fields are invalid.')
    error.fields = errors
    throw error
  }

  const project = createManualProject({ ...input, ...value })
  const projects = readProjects()
  storage.set(KEY_PROJECTS, [...projects, project])
  await wait()
  return project
}

export async function updateProject(id, patch) {
  const projects = readProjects()
  const index = projects.findIndex((project) => project.id === id)
  if (index === -1) {
    throw new Error('That project no longer exists.')
  }

  const merged = { ...projects[index], ...patch }
  const { valid, errors, value } = validateProjectInput(merged)
  if (!valid) {
    const error = new Error('The project could not be saved because some fields are invalid.')
    error.fields = errors
    throw error
  }

  const next = [...projects]
  next[index] = { ...merged, ...value }
  storage.set(KEY_PROJECTS, next)
  await wait()
  return next[index]
}

export async function deleteProject(id) {
  const projects = readProjects()
  const next = projects.filter((project) => project.id !== id)
  storage.set(KEY_PROJECTS, next)
  await wait()
  return next
}

/* --------------------------------------------- overrides for GitHub repos */

export async function listOverrides() {
  return readOverrides()
}

export async function setOverride(projectId, patch) {
  const overrides = readOverrides()
  const next = { ...overrides, [projectId]: { ...(overrides[projectId] || {}), ...patch } }
  storage.set(KEY_OVERRIDES, next)
  await wait()
  return next[projectId]
}

export async function clearOverride(projectId) {
  const overrides = readOverrides()
  if (!overrides[projectId]) return null
  const next = { ...overrides }
  delete next[projectId]
  storage.set(KEY_OVERRIDES, next)
  await wait()
  return null
}

/* ------------------------------------------------------------ admin mode */

export function isAdminPasscode(value) {
  return String(value || '') === ADMIN_PASSCODE
}

export function isAdminEnabled() {
  return storage.getSession(KEY_ADMIN, false) === true
}

export function setAdminEnabled(enabled) {
  if (enabled) storage.setSession(KEY_ADMIN, true)
  else storage.removeSession(KEY_ADMIN)
  return Boolean(enabled)
}

/** Wipes every locally stored change. Used by the "reset" action in admin. */
export function resetLocalData() {
  storage.remove(KEY_PROJECTS)
  storage.remove(KEY_OVERRIDES)
  storage.removeSession(KEY_ADMIN)
}

export { KEY_PROJECTS, KEY_OVERRIDES, KEY_ADMIN }