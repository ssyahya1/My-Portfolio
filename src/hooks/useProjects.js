import { useContext } from 'react'
import { ProjectsContext } from '../context/ProjectsContext.jsx'

/**
 * Access the project data, status and actions from any component.
 * Throws early if the provider is missing, instead of failing with
 * "cannot read property of null" deep inside a render.
 */
export function useProjects() {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error('useProjects() must be used inside <ProjectsProvider>.')
  }
  return context
}