# Syed Muhammad Yahya — Developer Portfolio

A production-quality personal portfolio built with **React + Vite (JavaScript, plain CSS)**.

The projects section is **powered by the GitHub REST API**. Repositories are fetched at runtime,
filtered, categorised and rendered — nothing is hard-coded as a screenshot or a static card list.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
npm run test:data  # data-layer smoke test (filtering, merging, search, validation)
```

Node 18+ is required (Node 24 was used during development).

---

## Environment variables (all optional)

Copy `.env.example` to `.env`:

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_GITHUB_USERNAME` | GitHub account to load repositories from | `ssyahya1` |
| `VITE_GITHUB_TOKEN` | Raises the GitHub rate limit from 60 to 5,000 requests/hour. Use a token with **no scopes** — anything in a Vite env file is shipped to the browser. | — |
| `VITE_CONTACT_EMAIL` | Publishes a real email link in the Contact section | empty (placeholder state) |
| `VITE_LINKEDIN_URL` | Publishes a real LinkedIn link | empty (placeholder state) |
| `VITE_ADMIN_PASSCODE` | Passcode for the local editing mode | `let-me-edit` |

The site works with no `.env` file at all.

---

## Architecture

The layers are deliberately separated so the UI never talks to GitHub directly:

```
GitHub REST API
      │  src/services/githubApi.js        fetch, pagination, typed errors, caching
      ▼
Project data layer
      │  src/data/projects.js             filtering · categorisation · project model · validation
      ▼
Project management
      │  src/services/projectStore.js     manual projects · overrides · CRUD (async, REST-shaped)
      │  src/services/storage.js          safe localStorage wrapper
      ▼
State
      │  src/context/ProjectsContext.jsx  merges everything, exposes actions
      │  src/hooks/useProjects.js
      ▼
UI
         src/components/*                  cards, filters, details modal, add/edit form
```

`projectStore.js` is async on purpose: its method signatures (`createProject`, `updateProject`,
`deleteProject`, `setOverride`) match a REST API, so moving to a real backend means replacing the
function bodies with `fetch` calls and leaving the UI untouched.

---

## Where project data comes from

1. Every public repository owned by the account is fetched (`/users/:user/repos`).
2. `shouldIncludeRepo()` filters out anything that should not be shown — forks, archived and
   disabled repositories, scratch/template names, and empty repositories with no description.
   **Every exclusion records a reason**, which the editing mode displays instead of hiding silently.
3. `repoToProject()` builds one project model:

```js
{
  id, source: 'github' | 'manual', githubRepo, title, category,
  description, longDescription, technologies[], features[],
  githubUrl, liveUrl, image, date, featured, published,
  stars, language, topics, ds, apiDocs
}
```

### Curation overlay

Every repository on this profile has an **empty GitHub description and no topics**, so the API alone
cannot produce a useful card. `REPO_CURATION` in `src/data/projects.js` therefore holds verified
metadata (title, category, description, technologies, features, dataset/model notes) read from each
repository's README, file tree and dependency files.

The overlay is keyed by repository name, so **a brand new repository still appears automatically** —
it falls back to the GitHub description, the detected language and a derived title, and is flagged as
needing a description.

### Honesty rules applied

- Nothing is invented. No fabricated experience, metrics, certifications or technologies.
- **No "AI Resume SaaS" project is shown** — that repository does not exist on this profile.
- The EV optimizer README lists WebSockets and ML-based demand prediction under *future improvements*,
  so they are **not** claimed as technologies anywhere.
- Redis, BullMQ, WebSockets and Stripe appear only in the **Supporting infrastructure** diagram, which
  is explicitly labelled as target architecture rather than existing code.
- Superstore Sales Prediction shows the result that is actually in its README: best model ≈ **R² 0.19**,
  with the explanation that the dataset, not the algorithm, is the limit.
- No model accuracy figure is claimed for any project unless its own README states one.
- No project screenshots are faked — projects without a real image get a generated monogram cover.

---

## Editing mode (admin)

Click **Editing mode** in the footer and enter the passcode (default `let-me-edit`, override with
`VITE_ADMIN_PASSCODE`). The mode is stored per browser session.

Once enabled:

- **+ Add New Project** appears in the Projects section (hidden from normal visitors).
- Every card gains **Edit**, **Feature/Unfeature**, **Hide/Publish** and **Delete** controls.
- GitHub projects are never modified — edits are stored as **overrides** in this browser.
  Manual projects are stored in this browser too.
- The "What is not shown" panel lists every filtered-out repository with its reason.
- **Clear local changes** in the footer removes all local data.

> The passcode is a convenience gate for a static site, **not security** — anything shipped to the
> browser is public. Replace it with real authentication when the projects move behind an API.

Duplicate protection: adding a manual project whose GitHub URL matches an already-loaded repository is
rejected with an explanation rather than producing two cards for one repo.

---

## Project structure

```
├── index.html
├── vite.config.js
├── public/favicon.svg
├── scripts/smoke-test.mjs          data-layer checks (npm run test:data)
└── src
    ├── main.jsx  App.jsx  App.css
    ├── styles/global.css           design tokens, resets, utilities, motion
    ├── data
    │   ├── site.js                 identity, nav, contact links
    │   ├── projects.js             curation overlay, filtering, model, validation
    │   ├── skills.js  architecture.js  workflow.js
    ├── services
    │   ├── githubApi.js            API access, error types, cache
    │   ├── projectStore.js         CRUD + overrides + admin session
    │   └── storage.js
    ├── context/ProjectsContext.jsx
    ├── hooks/useProjects.js
    └── components                  Navbar, Hero, About, Approach, Skills, DataScience,
                                    Workflow, Projects, ProjectCard, ProjectDetails,
                                    AddProject, Architecture, GitHubSection, Contact,
                                    Footer, Modal, Notice, Reveal, Icons (+ co-located CSS)
```

---

## Failure handling

| Situation | Behaviour |
| --- | --- |
| GitHub rate limit hit | Warning banner, retry button, link to the profile; manual projects still render |
| Network failure | Same banner with a network-specific message |
| Unknown username (404) | "GitHub user not found" with the variable to check |
| Repository has no description | Neutral placeholder text plus an admin-visible flag |
| Repository has no README | "No README.md was found" — never an invented summary |
| `localStorage` unavailable | Everything still runs; the footer notes local storage is unavailable |
| Filter or search with no matches | Empty state with a one-click reset |

---

## Accessibility and responsiveness

- Semantic landmarks, labelled form fields, `aria-expanded` / `aria-pressed` / `aria-invalid` states.
- Dialogs trap focus, restore focus on close, close on Escape or backdrop click, and lock background scroll.
- Visible focus rings everywhere; a skip-to-content link.
- `prefers-reduced-motion` disables the reveal and scroll animations.
- Fluid type and layout (`clamp`, `auto-fit` grids) with breakpoints at 1060 / 980 / 900 / 620 / 560 px;
  `overflow-x: clip` on the shell prevents accidental horizontal scrolling.

---

## Deploying

The build output in `dist/` is fully static.

- **Vercel / Netlify:** build command `npm run build`, output directory `dist`.
- Set the optional environment variables in the host's dashboard (not in a committed `.env`).

Because the projects are fetched client-side, a GitHub token set at build time is visible to visitors —
prefer no token, or proxy the GitHub request through a serverless function if the rate limit becomes a
problem.