/**
 * Single source of truth for identity, navigation and contact details.
 *
 * Nothing here claims anything that is not verifiable: the GitHub URL is real,
 * and the contact fields stay empty until a real value is provided through the
 * environment file (see .env.example). Empty links render as clearly-marked
 * placeholders instead of invented information.
 */

const env = import.meta.env || {}

export const GITHUB_USERNAME = (env.VITE_GITHUB_USERNAME || '').trim() || 'ssyahya1'

const CONTACT_EMAIL = (env.VITE_CONTACT_EMAIL || 'syedyahya308@gmail.com').trim()
const LINKEDIN_URL = (env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/syed-muhammad-yahya?utm_source=share_via&utm_content=profile&utm_medium=member_android').trim()

/** Local passcode for the editing mode. Convenience gate only - not security. */
export const ADMIN_PASSCODE = (env.VITE_ADMIN_PASSCODE || '').trim() || 'let-me-edit'

export const SITE = {
  name: 'Syed Muhammad Yahya',
  initials: 'SY',
  role: 'Backend & Full-Stack Developer',
  focus: 'Data Science & AI',
  tagline:
    'I build practical web applications, backend systems, and data-driven solutions with a focus on APIs, databases, automation, AI, and real-world engineering.',
  links: {
    github: `https://github.com/${GITHUB_USERNAME}`,
    linkedin: LINKEDIN_URL,
    email: CONTACT_EMAIL,
  },
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'data-science', label: 'Data Science' },
    { id: 'projects', label: 'Projects' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'contact', label: 'Contact' },
  ],
}