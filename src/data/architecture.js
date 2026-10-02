/**
 * Data for the backend architecture diagram.
 *
 * The layer list describes the request path I aim for in backend applications.
 * The `note` on each layer is deliberately honest about where the published
 * projects sit today rather than implying every layer already exists.
 */

export const REQUEST_LAYERS = [
  {
    label: 'Client',
    detail: 'Browser or mobile client sending HTTP requests.',
    note: 'React + Vite front ends in the full-stack projects.',
  },
  {
    label: 'Routes',
    detail: 'Maps URLs and HTTP verbs to handlers; the API surface.',
    note: 'Express routers split per resource (users, patients, appointments, vehicles).',
  },
  {
    label: 'Middleware',
    detail: 'Runs before controllers: authentication, authorisation, validation, rate limiting, error handling.',
    note: 'The strongest implemented layer in my projects — auth, RBAC, validation, rate limiting and a central error handler.',
  },
  {
    label: 'Controllers',
    detail: 'Handles the request, calls the data layer, shapes the HTTP response.',
    note: 'One controller per resource, with errors forwarded to the central handler.',
  },
  {
    label: 'Services',
    detail: 'Business rules and orchestration kept out of the HTTP layer.',
    note: 'Direction I am moving towards — currently this logic still lives partly in controllers.',
  },
  {
    label: 'Repositories / Data Access',
    detail: 'The only place that talks to the database; parameterised queries and transactions.',
    note: 'Implemented as a small PostgreSQL access module, using parameterised queries.',
  },
  {
    label: 'PostgreSQL',
    detail: 'Relational storage: tables, constraints, relationships and indexes.',
    note: 'PostgreSQL (Neon in production) with real relational constraints, e.g. preventing duplicate appointments.',
  },
]

export const SUPPORTING_SERVICES = [
  {
    label: 'Redis',
    role: 'Caching',
    detail: 'Keeps frequently-read data out of the database and gives shared state a home.',
  },
  {
    label: 'Queue',
    role: 'Background processing',
    detail: 'Accepts work that should not block an HTTP response and hands it to a worker.',
  },
  {
    label: 'Worker',
    role: 'Async jobs',
    detail: 'Processes queued jobs — long reports, retries, scheduled work — independently of requests.',
  },
  {
    label: 'AI APIs',
    role: 'AI processing',
    detail: 'Calls out to model providers, or serves an own model behind an API as in the fraud service.',
  },
  {
    label: 'Stripe',
    role: 'Payments',
    detail: 'Handles billing and subscriptions, with webhooks treated as their own input source.',
  },
  {
    label: 'WebSockets',
    role: 'Real-time communication',
    detail: 'Pushes updates to clients instead of polling, for live status and notifications.',
  },
]