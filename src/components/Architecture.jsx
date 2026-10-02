import { REQUEST_LAYERS, SUPPORTING_SERVICES } from '../data/architecture.js'
import Reveal from './Reveal.jsx'
import './Architecture.css'

/**
 * Backend architecture.
 *
 * Rendered as vertically stacked layers with connectors — deliberately a
 * different visual language from the data-science workflow (a horizontal
 * pipeline), so the two diagrams cannot be confused.
 *
 * The `note` under each layer is honest about where the published projects
 * currently sit, rather than implying every layer already exists everywhere.
 */
export default function Architecture() {
  return (
    <section className="section section--soft" id="architecture">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Architecture</span>
          <h2>How I structure a backend</h2>
          <p className="lead">
            A request makes one predictable trip through the system. Keeping each layer responsible for one
            thing is what makes an API possible to change later.
          </p>
        </div>

        <div className="arch__layout">
          <Reveal className="arch__diagram">
            <ol className="arch__layers">
              {REQUEST_LAYERS.map((layer, index) => (
                <li className="arch__layer" key={layer.label}>
                  <div className="arch__layer-card">
                    <div className="arch__layer-top">
                      <span className="arch__layer-index">{String(index + 1).padStart(2, '0')}</span>
                      <h3>{layer.label}</h3>
                    </div>
                    <p className="arch__layer-detail">{layer.detail}</p>
                    {layer.note ? <p className="arch__layer-note">{layer.note}</p> : null}
                  </div>
                  {index < REQUEST_LAYERS.length - 1 ? (
                    <span className="arch__connector" aria-hidden="true">
                      <span className="arch__connector-line" />
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="arch__support" delay={80}>
            <h3 className="arch__support-title">Supporting infrastructure</h3>
            <p className="arch__support-copy">
              Components that show up once an application grows past a single request and a single database.
              These are the pieces I am actively working into my own projects — they are listed as target
              architecture, not as claims about existing code.
            </p>
            <ul className="arch__services">
              {SUPPORTING_SERVICES.map((service) => (
                <li className="arch__service" key={service.label}>
                  <span className="arch__service-label mono">{service.label}</span>
                  <span className="arch__service-role">{service.role}</span>
                  <span className="arch__service-detail">{service.detail}</span>
                </li>
              ))}
            </ul>

            <div className="notice arch__where">
              <div>
                <strong className="notice__title">Where my projects sit today</strong>
                <p className="notice__body">
                  Controllers and middleware are the strongest implemented layers — authentication, role
                  checks, validation, rate limiting and a central error handler are all real code. Data access
                  runs through a small PostgreSQL module using parameterised queries. Extracting services and
                  repositories into their own layers is the next step, which is why those rows say so.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}