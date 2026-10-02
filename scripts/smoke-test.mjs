/**
 * Temporary smoke test for the project data layer.
 * Run with: node scripts/smoke-test.mjs
 */
import {
  buildProjectsFromRepos,
  mergeProjects,
  filterProjects,
  computeFilterOptions,
  validateProjectInput,
  createManualProject,
  applyOverride,
  sortProjects,
  shouldIncludeRepo,
  deriveTitle,
  classifyRepo,
  draftFromProject,
  emptyDraft,
} from '../src/data/projects.js'

/** Minimal stand-in for a GitHub API repository object. */
const repo = (name, language, extra = {}) => ({
  name,
  language,
  fork: false,
  archived: false,
  disabled: false,
  size: 100,
  description: null,
  topics: [],
  stargazers_count: 0,
  forks_count: 0,
  pushed_at: '2026-08-01T00:00:00Z',
  created_at: '2026-07-01T00:00:00Z',
  html_url: `https://github.com/ssyahya1/${name}`,
  homepage: null,
  default_branch: 'main',
  ...extra,
})

const repos = [
  repo('smart-ev-optimizer', 'JavaScript', {
    size: 335,
    stargazers_count: 1,
    pushed_at: '2026-09-27T22:24:31Z',
    homepage: 'https://smart-ev-optimizer.vercel.app',
  }),
  repo('hospital-management-system', 'JavaScript', {
    size: 185,
    pushed_at: '2026-09-10T05:59:15Z',
    homepage: 'https://hospital-management-system-syed-yahya.vercel.app',
  }),
  repo('fraud-detection-ui-', 'CSS', { size: 19, pushed_at: '2026-08-21T03:29:24Z' }),
  repo('Fraud-detection-', 'Jupyter Notebook', { size: 20526, pushed_at: '2026-08-21T01:08:00Z' }),
  repo('House-Price-Prediction-', 'Python', { size: 130, pushed_at: '2026-08-05T20:26:21Z' }),
  repo('Supply-Chain-Data-Analyst-', 'Python', { size: 14, pushed_at: '2026-07-30T02:21:55Z' }),
  repo('Superstore-Sales-Prediction', 'Jupyter Notebook', { size: 912, pushed_at: '2026-07-29T22:48:58Z' }),
  repo('Movie-Recommendation-System-', 'Python', { size: 10854, pushed_at: '2026-07-29T22:40:00Z' }),
  repo('Heart-Stroke-Prediction-', 'Python', { size: 8, pushed_at: '2026-07-29T22:04:38Z' }),
  repo('Customer--Response-Prediction', 'Jupyter Notebook', { size: 736, pushed_at: '2026-07-29T21:46:34Z' }),
  repo('Python-', 'Python', { size: 12, description: 'Bano qabil2.0', pushed_at: '2024-01-28T14:52:40Z' }),
  // Noise that must be filtered out automatically.
  repo('dotfiles', null, { size: 1 }),
  repo('some-forked-repo', 'Python', { fork: true, size: 500, description: 'A fork' }),
  repo('sales-forecasting-model', 'Python', {
    size: 42,
    description: 'A new machine learning regression notebook',
    topics: ['machine-learning'],
    pushed_at: '2026-09-30T00:00:00Z',
  }),
]

let failures = 0
const check = (label, condition, extra = '') => {
  if (condition) {
    console.log(`  PASS  ${label}`)
  } else {
    failures += 1
    console.log(`  FAIL  ${label} ${extra}`)
  }
}

console.log('\n1. Repository filtering')
const { projects, hidden } = buildProjectsFromRepos(repos)
const names = projects.map((project) => project.githubRepo)
check('10 curated repositories included', projects.length === 10, `got ${projects.length}`)
check('Python- excluded', !names.includes('Python-'))
check('dotfiles excluded', !names.includes('dotfiles'))
check('forked repo excluded', !names.includes('some-forked-repo'))
check('unknown ML repo auto-included', names.includes('sales-forecasting-model'))
check('every exclusion has a reason', hidden.every((item) => item.reason && item.reason.length > 10))
check('excluded list reports 4 items', hidden.length === 4, hidden.map((h) => h.name).join(', '))

console.log('\n2. Categorisation and model shape')
const byRepo = Object.fromEntries(projects.map((project) => [project.githubRepo, project]))
check('smart-ev-optimizer is Full-Stack', byRepo['smart-ev-optimizer'].category === 'Full-Stack')
check('hospital-management-system is Full-Stack', byRepo['hospital-management-system'].category === 'Full-Stack')
check('Fraud-detection- is Full-Stack', byRepo['Fraud-detection-'].category === 'Full-Stack')
check('Supply-Chain is Data Science', byRepo['Supply-Chain-Data-Analyst-'].category === 'Data Science')
check('JavaScript UI repo is combined, not listed separately', !byRepo['fraud-detection-ui-'])
check(
  'unknown repo category inferred',
  byRepo['sales-forecasting-model'].category !== 'Other',
  byRepo['sales-forecasting-model'].category,
)
check(
  'unknown repo gets a derived title',
  byRepo['sales-forecasting-model'].title.length > 5,
  byRepo['sales-forecasting-model'].title,
)
check('unknown repo flagged with GitHub description', byRepo['sales-forecasting-model'].needsDescription === false)
check(
  'repo description from GitHub is used when there is no curation',
  byRepo['sales-forecasting-model'].description === 'A new machine learning regression notebook',
)
const { projects: noDescription } = buildProjectsFromRepos([repo('helper-scripts', 'JavaScript', { size: 60 })])
check(
  'repo with no description gets neutral placeholder text',
  noDescription[0].needsDescription === true && /description on GitHub yet/i.test(noDescription[0].description),
  noDescription[0].description,
)
check('curated repo not flagged', byRepo['smart-ev-optimizer'].needsDescription === false)
check('featured flag from curation', byRepo['smart-ev-optimizer'].featured === true)
check('combined fraud project appears only in the main grid', byRepo['Fraud-detection-'].featured === false)
check(
  'project model has all keys',
  ['id', 'source', 'githubRepo', 'title', 'category', 'description', 'technologies', 'features', 'githubUrl', 'liveUrl', 'frontendUrl', 'image', 'date', 'featured', 'published'].every(
    (key) => key in byRepo['Fraud-detection-'],
  ),
)
check('live url captured', byRepo['smart-ev-optimizer'].liveUrl.includes('vercel.app'))
check(
  'Fraud Detection live demo uses its deployed JavaScript UI',
  byRepo['Fraud-detection-'].liveUrl === 'https://ssyahya1.github.io/fraud-detection-ui-/',
)
check(
  'ML and analytics demos use the supplied app URLs',
  [
    ['Customer--Response-Prediction', 'https://customer--response-prediction.streamlit.app/'],
    ['Heart-Stroke-Prediction-', 'https://heart-stroke-predi.streamlit.app/'],
    ['House-Price-Prediction-', 'https://house-price-esti.streamlit.app/'],
    ['Movie-Recommendation-System-', 'https://movie-recommendation-nlp-app.streamlit.app/'],
    ['Superstore-Sales-Prediction', 'https://superstore-sales-prediction-app.streamlit.app/'],
    ['Supply-Chain-Data-Analyst-', 'https://supply-chain-dashboard-app.streamlit.app/'],
  ].every(([repoName, url]) => byRepo[repoName].liveUrl === url),
)
check('JS UI repository link captured', byRepo['Fraud-detection-'].frontendUrl.endsWith('/fraud-detection-ui-'))
check(
  'combined project uses JavaScript and omits Streamlit',
  byRepo['Fraud-detection-'].technologies.includes('JavaScript') && !byRepo['Fraud-detection-'].technologies.includes('Streamlit'),
)
check('ds metadata present on Fraud-detection-', Boolean(byRepo['Fraud-detection-'].ds && byRepo['Fraud-detection-'].ds.model))
check('every visible project has technologies', projects.every((project) => project.technologies.length > 0))

console.log('\n3. Merging, overrides and sorting')
const manual = createManualProject({
  title: 'Inventory Management API',
  category: 'Backend',
  description: 'A REST API for stock levels, suppliers and reorder points, built as a practice project.',
  technologies: ['Node.js', 'Express', 'PostgreSQL'],
  features: ['CRUD endpoints\nStock alerts'],
})
check('manual project created', manual.source === 'manual' && manual.id.startsWith('manual-'))
check('list normalisation from newline text', manual.features.length === 2, JSON.stringify(manual.features))

const overrideTarget = 'github-smart-ev-optimizer'
const overrideKey = { [overrideTarget]: { featured: false, category: 'Backend', published: true } }
const merged = mergeProjects({ githubProjects: projects, manualProjects: [manual], overrides: overrideKey })
check('manual project merged in', merged.projects.some((project) => project.id === manual.id))
check('override applied', merged.projects.find((p) => p.id === overrideTarget).category === 'Backend')
check('override marks the project', merged.projects.find((p) => p.id === overrideTarget).overridden === true)
check('featured projects sort first', merged.projects[0].featured === true)

const hiddenOne = mergeProjects({
  githubProjects: projects,
  manualProjects: [],
  overrides: { [overrideTarget]: { published: false } },
})
check('unpublishing removes it from the public list', !hiddenOne.projects.some((p) => p.id === overrideTarget))

const duplicate = mergeProjects({
  githubProjects: projects,
  manualProjects: [
    { ...manual, id: 'manual-dup', githubUrl: 'https://github.com/ssyahya1/smart-ev-optimizer' },
  ],
  overrides: {},
})
check('duplicate of a GitHub repo is dropped', duplicate.dropped.length === 1, JSON.stringify(duplicate.dropped))

console.log('\n4. Filtering and search')
const ml = filterProjects(projects, { category: 'Machine Learning' })
check('category filter works', ml.length === 6, String(ml.length))
check('All filter returns everything', filterProjects(projects, { category: 'All' }).length === 10)
check('search matches title', filterProjects(projects, { search: 'hospital' }).length === 1)
check('search matches technology', filterProjects(projects, { search: 'postgresql' }).length >= 2)
check('search is case insensitive', filterProjects(projects, { search: 'FASTAPI' }).length >= 1)
check('search with no match returns empty', filterProjects(projects, { search: 'zzz-nothing' }).length === 0)
const options = computeFilterOptions(projects)
check('filter options start with All', options[0].name === 'All')
check('filter options cover the seven base filters', options.length === 7, JSON.stringify(options.map((o) => `${o.name}:${o.count}`)))
check('All count equals project count', options[0].count === 10)
check(
  'category counts add up to the total',
  options.slice(1).reduce((sum, option) => sum + option.count, 0) === 10,
  JSON.stringify(options),
)

console.log('\n5. Validation')
check('rejects empty title', validateProjectInput({ title: '', description: 'x'.repeat(30), category: 'Backend' }).valid === false)
check('rejects short description', validateProjectInput({ title: 'Test', description: 'too short', category: 'Backend' }).valid === false)
const badUrl = validateProjectInput({ title: 'Test', description: 'x'.repeat(30), category: 'Backend', liveUrl: 'not-a-url' })
check('rejects bad url', badUrl.errors.liveUrl !== undefined)
const badDate = validateProjectInput({ title: 'Test', description: 'x'.repeat(30), category: 'Backend', date: '05/08/2026' })
check('rejects bad date', badDate.errors.date !== undefined)
check(
  'accepts a good payload',
  validateProjectInput({
    title: 'Good project',
    description: 'x'.repeat(30),
    category: 'Backend',
    liveUrl: 'https://example.com',
    date: '2026-01-01',
  }).valid === true,
)
check(
  'unknown category falls back',
  validateProjectInput({ title: 'Good project', description: 'x'.repeat(30), category: 'Nonsense' }).value.category === 'Full-Stack',
)

console.log('\n6. Helpers')
check('deriveTitle prettifies names', deriveTitle('smart-ev-optimizer') === 'Smart EV Optimizer', deriveTitle('smart-ev-optimizer'))
check(
  'classifyRepo handles python notebooks',
  classifyRepo({ language: 'Python', name: 'x', description: 'machine learning regression' }) === 'Machine Learning',
)
check('shouldIncludeRepo explains forks', shouldIncludeRepo({ name: 'x', fork: true }).include === false)
check('empty draft has the expected shape', Object.keys(emptyDraft()).length >= 12)
check('draftFromProject round-trips technologies', draftFromProject(byRepo['smart-ev-optimizer']).technologies.length > 5)
check(
  'sortProjects puts newest first when nothing is featured',
  sortProjects([
    { title: 'a', date: '2024-01-01' },
    { title: 'b', date: '2026-01-01' },
  ])[0].title === 'b',
)
check('applyOverride leaves other fields untouched', applyOverride({ featured: true, category: 'X' }, { category: 'Y' }).featured === true)

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}\n`)
process.exit(failures === 0 ? 0 : 1)