import { SKILL_GROUPS } from '../data/skills.js'
import Reveal from './Reveal.jsx'
import './Skills.css'

/**
 * Skills grouped by area.
 *
 * `tone: 'data'` groups (data science, AI/ML) use the blue accent so they are
 * visually separated from the engineering groups without extra markup.
 */
export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Skills</span>
          <h2>Tools and areas I work in</h2>
          <p className="lead">
            Grouped by area rather than by claimed level. Everything in the engineering and data groups is
            used by at least one project below.
          </p>
        </div>

        <div className="skills__grid">
          {SKILL_GROUPS.map((group, index) => (
            <Reveal
              className={`skills__group ${group.tone === 'data' ? 'skills__group--data' : ''}`}
              key={group.id}
              delay={index * 35}
            >
              <header className="skills__group-head">
                <h3>{group.title}</h3>
                <p>{group.blurb}</p>
              </header>
              <ul className="tag-list skills__tags">
                {group.items.map((item) => (
                  <li key={item}>
                    <span className={`tag ${group.tone === 'data' ? 'tag--data' : 'tag--accent'}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}