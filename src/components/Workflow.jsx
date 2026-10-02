import { DS_WORKFLOW } from '../data/workflow.js'
import Reveal from './Reveal.jsx'
import './Workflow.css'

/**
 * The data-science workflow, shown as a left-to-right pipeline.
 *
 * Deliberately a different visual from the backend architecture diagram (which
 * stacks layers vertically): this is a sequence, so it reads as a track of
 * numbered stages with connectors, with detail cards underneath.
 */
export default function Workflow() {
  return (
    <div className="workflow">
      <h3 className="workflow__title">
        The workflow I follow
        <span className="workflow__title-note">from raw files to something usable</span>
      </h3>

      <div className="workflow__scroll">
        <ol className="workflow__track">
          {DS_WORKFLOW.map((stage, index) => (
            <li className="workflow__stage" key={stage.step}>
              <span className="workflow__dot" aria-hidden="true">
                {stage.step}
              </span>
              <span className="workflow__stage-label">{stage.label}</span>
              {index < DS_WORKFLOW.length - 1 ? (
                <span className="workflow__connector" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <ul className="workflow__cards">
        {DS_WORKFLOW.map((stage, index) => (
          <Reveal as="li" className="workflow__card" key={stage.step} delay={index * 30}>
            <span className="workflow__card-step">{stage.step}</span>
            <strong className="workflow__card-title">{stage.label}</strong>
            <span className="workflow__card-detail">{stage.detail}</span>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}