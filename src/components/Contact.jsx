import { SITE } from '../data/site.js'
import { IconExternal, IconGitHub, IconLinkedIn, IconMail } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import './Contact.css'

/**
 * Contact section.
 *
 * Only GitHub has a real, available URL. Email and LinkedIn render in an
 * explicit "not set yet" state instead of showing invented contact details -
 * fill them in through .env (VITE_CONTACT_EMAIL / VITE_LINKEDIN_URL) or
 * src/data/site.js and the cards switch to live links automatically.
 */
function ContactCard({ icon: Icon, label, value, href, placeholder, note }) {
  const isPlaceholder = !href

  return (
    <li className={`contact__card ${isPlaceholder ? 'contact__card--pending' : ''}`}>
      <span className="contact__card-icon" aria-hidden="true">
        <Icon width={18} height={18} />
      </span>
      <div className="contact__card-body">
        <span className="contact__card-label">{label}</span>
        {isPlaceholder ? (
          <>
            <span className="contact__card-value contact__card-value--pending">Not configured yet</span>
            <span className="contact__card-note">{placeholder}</span>
          </>
        ) : (
          <a className="contact__card-value" href={href} target="_blank" rel="noreferrer noopener">
            {value}
            <IconExternal width={13} height={13} />
          </a>
        )}
        {note ? <span className="contact__card-note">{note}</span> : null}
      </div>
    </li>
  )
}

export default function Contact() {
  const { github, linkedin, email } = SITE.links

  return (
    <section className="section section--soft" id="contact">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Contact</span>
          <h2>Let&apos;s talk about building something</h2>
          <p className="lead">
            I am open to backend and full-stack work, and to data or machine learning projects where the model
            has to survive contact with real users and real data.
          </p>
        </div>

        <Reveal>
          <ul className="contact__grid">
            <ContactCard
              icon={IconGitHub}
              label="GitHub"
              value={`github.com/${github.split('/').pop()}`}
              href={github}
              note="Repositories, commits and READMEs for every project here."
            />
            <ContactCard
              icon={IconMail}
              label="Email"
              placeholder="Set VITE_CONTACT_EMAIL (or edit src/data/site.js) to publish an address here."
              note={email ? undefined : 'Deliberately left blank rather than showing a made-up address.'}
            />
            <ContactCard
              icon={IconLinkedIn}
              label="LinkedIn"
              placeholder="Set VITE_LINKEDIN_URL (or edit src/data/site.js) to publish a profile link here."
              note={linkedin ? undefined : 'Deliberately left blank rather than showing a made-up profile.'}
            />
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <div className="contact__cta card card--pad">
            <div>
              <h3>Start from the code</h3>
              <p className="muted">
                If you would rather read first, open any project above, or browse the repositories directly —
                every claim on this page can be checked against them.
              </p>
            </div>
            <a className="btn btn--primary" href={github} target="_blank" rel="noreferrer noopener">
              <IconGitHub width={16} height={16} />
              Open GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}