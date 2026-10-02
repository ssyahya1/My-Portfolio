/**
 * Temporary component-level render check for the editing UI.
 * Renders the most complex components against a mocked context, so it does not
 * depend on network access or localStorage.
 *
 * Build + run:
 *   npx vite build --ssr scripts/ssr-ui-check.jsx --outDir dist-ssr --logLevel error
 *   node dist-ssr/ssr-ui-check.js
 */
import { renderToString } from 'react-dom/server'
import { ProjectsContext } from '../src/context/ProjectsContext.jsx'
import { emptyDraft, draftFromProject } from '../src/data/projects.js'
import AddProject from '../src/components/AddProject.jsx'
import ProjectCard from '../src/components/ProjectCard.jsx'
import ProjectDetails from '../src/components/ProjectDetails.jsx'

let failures = 0
const check = (label, condition, extra = '') => {
  if (condition) {
    console.log(`  PASS  ${label}`)
  } else {
    failures += 1
    console.log(`  FAIL  ${label} ${extra}`)
  }
}

const noop = () => {}

const baseContext = {
  adminMode: false,
  openDetails: noop,
  closeDetails: noop,
  openEditForm: noop,
  toggleFeatured: noop,
  toggleVisibility: noop,
  removeProject: noop,
  form: { open: false, project: null, draft: emptyDraft() },
}

const render = (element, overrides = {}) =>
  renderToString(
    <ProjectsContext.Provider value={{ ...baseContext, ...overrides }}>{element}</ProjectsContext.Provider>,
  )

const githubProject = {
  id: 'github-smart-ev-optimizer',
  source: 'github',
  githubRepo: 'smart-ev-optimizer',
  title: 'Smart EV Fleet Charging & Grid Operations Optimizer',
  category: 'Full-Stack',
  categorySource: 'curated',
  description: 'Full-stack EV fleet and smart-grid management system with a REST API.',
  longDescription: 'A longer description of the project.',
  technologies: ['Node.js', 'Express.js', 'PostgreSQL', 'React'],
  features: ['JWT authentication', 'Role-based authorization'],
  githubUrl: 'https://github.com/ssyahya1/smart-ev-optimizer',
  liveUrl: 'https://smart-ev-optimizer.vercel.app',
  image: '',
  date: '2026-09-27',
  updatedAt: '2026-09-27',
  featured: true,
  published: true,
  stars: 1,
  language: 'JavaScript',
  topics: [],
  needsDescription: false,
  ds: null,
}

const dsProject = {
  ...githubProject,
  id: 'github-Fraud-detection-',
  source: 'github',
  githubRepo: 'Fraud-detection-',
  title: 'Fraud Detection - Machine Learning Service',
  category: 'Machine Learning',
  featured: false,
  liveUrl: '',
  apiDocs: 'https://fraud-detection.fastapicloud.dev/docs',
  ds: {
    dataset: 'synthetic_fraud_dataset.csv with transaction attributes.',
    model: 'Random Forest pipeline tuned with GridSearchCV.',
    findings: 'The threshold mattered as much as the model.',
  },
}

console.log('\n1. ProjectCard — public visitor')
const publicCard = render(<ProjectCard project={githubProject} />)
check('title rendered', publicCard.includes('Smart EV Fleet Charging'))
check('featured chip rendered', publicCard.includes('Featured'))
check('technologies rendered', publicCard.includes('PostgreSQL'))
check('repository link rendered', publicCard.includes('github.com/ssyahya1/smart-ev-optimizer'))
check('live link rendered', publicCard.includes('smart-ev-optimizer.vercel.app'))
check('details button rendered', publicCard.includes('Details'))
check('no admin controls', !publicCard.includes('project-card__admin-btn'))

console.log('\n2. ProjectCard — editing mode')
const adminCard = render(<ProjectCard project={githubProject} />, { adminMode: true })
check('admin controls rendered', adminCard.includes('project-card__admin-btn'))
check('edit / unfeature / hide controls rendered', ['Edit', 'Unfeature', 'Hide'].every((label) => adminCard.includes(label)))

const unpublishedCard = render(<ProjectCard project={{ ...githubProject, published: false }} />, {
  adminMode: true,
})
check('unpublished project marked', unpublishedCard.includes('Unpublished'))
check('unpublished project offers publish', unpublishedCard.includes('Publish'))

const manualCard = render(
  <ProjectCard
    project={{ ...githubProject, id: 'manual-1', source: 'manual', githubRepo: '', featured: false, stars: 0 }}
  />,
  { adminMode: true },
)
check('manual project marked as manual entry', manualCard.includes('Manual entry'))
check('manual project offers delete', manualCard.includes('Delete'))

console.log('\n3. ProjectCard — form preview mode')
const previewCard = render(
  <ProjectCard
    project={{ ...githubProject, id: 'preview', source: 'manual', githubRepo: '', categorySource: 'curated' }}
    preview
  />,
  { adminMode: true },
)
check('preview renders title', previewCard.includes('Smart EV Fleet Charging'))
check('preview hides details button', !previewCard.includes('Details</button>'))
check('preview hides admin controls', !previewCard.includes('project-card__admin-btn'))