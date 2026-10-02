import { ProjectsProvider } from './context/ProjectsContext.jsx'
import About from './components/About.jsx'
import AddProject from './components/AddProject.jsx'
import Approach from './components/Approach.jsx'
import Architecture from './components/Architecture.jsx'
import Contact from './components/Contact.jsx'
import DataScience from './components/DataScience.jsx'
import Footer from './components/Footer.jsx'
import GitHubSection from './components/GitHubSection.jsx'
import Hero from './components/Hero.jsx'
import Navbar from './components/Navbar.jsx'
import Notice from './components/Notice.jsx'
import ProjectDetails from './components/ProjectDetails.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import './App.css'

/**
 * Layout, top to bottom.
 *
 * The provider owns all project state (GitHub + local edits) so any section can
 * read from it without prop drilling, and the two dialogs are rendered once at
 * the root instead of inside each section.
 */
export default function App() {
  return (
    <ProjectsProvider>
      <div className="app-shell">
        <a className="skip-link" href="#home">
          Skip to content
        </a>

        <Navbar />
        <Notice />

        <main>
          <Hero />
          <About />
          <Approach />
          <Skills />
          <DataScience />
          <Projects />
          <Architecture />
          <GitHubSection />
          <Contact />
        </main>

        <Footer />

        <ProjectDetails />
        <AddProject />
      </div>
    </ProjectsProvider>
  )
}