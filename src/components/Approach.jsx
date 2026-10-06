import Reveal from './Reveal.jsx'
import './Approach.css'

const STEPS = [
  {
    title: 'Understand the problem before the framework',
    detail:
      'What data exists, who touches it, and what has to be true afterwards. In the EV fleet project that meant writing down vehicle priorities, deadlines and grid capacity as a model before writing a single route.',
  },
  {
    title: 'Model the data properly',
    detail:
      'Tables, relationships and constraints come first, because they prevent a whole class of bugs. The hospital appointment constraint — one doctor, one slot — lives in the database, not only in the API.',
  },
  {
    title: 'Build the API in layers',
    detail:
      'Routes, then middleware for auth, roles, validation and rate limiting, then controllers. Shared concerns get shared middleware instead of copy-pasted checks.',
  },
  {
    title: 'Get it working end to end early',
    detail:
      'A rough path from interface to database beats a perfect backend nobody can see. Styling and polish come after the data actually flows.',
  },
  {
    title: 'Attack the failure paths',
    detail:
      'Invalid input, expired tokens, forbidden roles, duplicate records, a missing description. Most of the code worth writing exists for the cases nobody demonstrates.',
  },
  {
    title: 'Deploy and document it honestly',
    detail:
      'Real deployments on Vercel, Railway and Neon, with READMEs that state what the project does, how to run it, and where it falls short — including a model whose R² was only 0.19.',
  },
]

const TOOLING = [
  { label: 'Version control', detail: 'Git and GitHub for every project' },
  { label: 'Testing', detail: 'Vitest and Supertest on the EV optimiser backend' },
  { label: 'Deployment', detail: 'Vercel, Railway and Neon' },
  { label: 'Model serving', detail: 'FastAPI for the fraud detection service' },
  { label: 'Config', detail: 'Environment variables, never committed secrets' },
  { label: 'Documentation', detail: 'README per project, written for someone else' },
]

export default function Approach() {
  return (
    <section className="section" id="approach">
      <div className="container">
        <div className="section-head">
          <h2>How I build robust applications</h2>
          <p className="lead">
            The same sequence shows up across the projects below — it is what keeps them from turning into
            demos that only work on one machine.
          </p>
        </div>

        <ol className="approach__steps">
          {STEPS.map((step, index) => (
            <Reveal as="li" className="approach__step" key={step.title} delay={index * 40}>
              <span className="approach__step-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="approach__step-body">
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="approach__tooling">
          <h3 className="approach__tooling-title">Tooling I rely on</h3>
          <ul className="approach__tooling-list">
            {TOOLING.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}