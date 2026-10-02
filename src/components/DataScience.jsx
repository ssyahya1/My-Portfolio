import { DS_CARDS } from '../data/workflow.js'
import { useProjects } from '../hooks/useProjects.js'
import {
  IconCode,
  IconCpu,
  IconDatabase,
  IconGrid,
  IconSparkles,
  IconStar,
} from './Icons.jsx'
import ProjectCard from './ProjectCard.jsx'
import Reveal from './Reveal.jsx'
import Workflow from './Workflow.jsx'
import './DataScience.css'

const CARD_ICONS = {
  analysis: IconDatabase,
  eda: IconGrid,
  visualization: IconCode,
  ml: IconStar,
  ai: IconCpu,
}

export default function DataScience() {
  const { dataProjects, status } = useProjects()

  return (
    <section className="section" id="data-science">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow--data">Data Science &amp; AI</span>
          <h2>Working with data, end to end</h2>
          <p className="lead">
            I work through the whole path, not just the modelling step: understanding the data, cleaning it,
            exploring it, engineering features, training and comparing models, and then putting the result
            somewhere useful — a dashboard, an app, or a service behind an API.
          </p>
        </div>

        <ul className="ds__cards">
          {DS_CARDS.map((card, index) => {
            const Icon = CARD_ICONS[card.id] || IconSparkles
            return (
              <Reveal as="li" className="ds__card" key={card.id} delay={index * 40}>
                <span className="ds__card-icon" aria-hidden="true">
                  <Icon width={18} height={18} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.detail}</p>
                <ul className="ds__points">
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </ul>

        <Workflow />

        <div className="ds__projects">
          <h3 className="ds__projects-head">
            Data, machine learning and analytics projects
            <span className="ds__projects-count">{dataProjects.length}</span>
          </h3>

          {dataProjects.length > 0 ? (
            <ul className="ds__grid">
              {dataProjects.map((project, index) => (
                <Reveal as="li" key={project.id} delay={index * 40}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="ds__empty card card--pad">
              <IconSparkles width={20} height={20} />
              <div>
                <h4>Data Science Projects Coming Soon</h4>
                <p>
                  {status === 'loading'
                    ? 'Still loading repositories from GitHub…'
                    : 'No repositories are currently categorised as Data Science, Machine Learning or AI. As soon as one is published it will appear here automatically — nothing is added in advance.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}