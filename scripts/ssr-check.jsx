/**
 * Temporary integration check: renders the whole component tree with
 * react-dom/server to prove it mounts without throwing, and asserts that
 * admin-only UI stays hidden for a normal visitor.
 *
 * Build + run:
 *   npx vite build --ssr scripts/ssr-check.jsx --outDir dist-ssr --logLevel error
 *   node dist-ssr/ssr-check.js
 */
import { renderToString } from 'react-dom/server'
import App from '../src/App.jsx'

let failures = 0
const check = (label, condition, extra = '') => {
  if (condition) {
    console.log(`  PASS  ${label}`)
  } else {
    failures += 1
    console.log(`  FAIL  ${label} ${extra}`)
  }
}

const html = renderToString(<App />)

console.log('\nRendered HTML length:', html.length)

const sections = ['home', 'about', 'approach', 'skills', 'data-science', 'projects', 'architecture', 'github', 'contact']
sections.forEach((id) => {
  check(`section #${id} rendered`, html.includes(`id="${id}"`))
})

check('skip link rendered', html.includes('Skip to content'))
check('navbar rendered', html.includes('navbar__mark'))
check('hero heading rendered', html.includes('backend systems and data-driven applications'))
check('skills groups rendered', html.includes('Infrastructure / Tools'))
check('data science workflow rendered', html.includes('The workflow I follow'))
check('backend architecture rendered', html.includes('Supporting infrastructure'))
check('ds empty state shown while loading', html.includes('Data Science Projects Coming Soon'))
check('projects section renders the API source card', html.includes('github.com/ssyahyia1') || html.includes('github.com/ssyahya1'))
check('footer rendered', html.includes('Back to top'))
check('filter buttons rendered', html.includes('Full-Stack') && html.includes('Machine Learning'))
check('loading skeletons rendered before fetch resolves', html.includes('projects__skeleton'))

console.log('\nAdmin-only UI hidden for a normal visitor')
check('no "Add New Project" button', !html.includes('Add New Project'))
check('no add/edit form fields', !html.includes('Project title *'))
check('no details modal', !html.includes('modal-root'))
check('no admin card controls', !html.includes('project-card__admin-btn'))
check('no "What is not shown" panel', !html.includes('What is not shown'))

console.log(`\n${failures === 0 ? 'ALL RENDER CHECKS PASSED' : `${failures} RENDER CHECK(S) FAILED`}\n`)
process.exit(failures === 0 ? 0 : 1)
