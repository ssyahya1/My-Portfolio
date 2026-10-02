/**
 * Skills, grouped by area.
 *
 * Every item below is either (a) verifiably used in one of the public
 * repositories loaded by the projects section, or (b) a topic the author works
 * with / is actively learning. No framework is listed as "expert level".
 */

export const SKILL_GROUPS = [
  {
    id: 'backend',
    title: 'Backend',
    blurb: 'The area I spend most of my time in — request handling, auth and API design.',
    tone: 'accent',
    items: [
      'JavaScript',
      'Node.js',
      'Express.js',
      'REST APIs',
      'Authentication',
      'Authorization',
      'JWT',
      'Cookies',
      'Sessions',
      'Middleware',
      'Service architecture',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    blurb: 'Enough front end to build and ship the full application, not just the API.',
    tone: 'accent',
    items: ['React', 'JavaScript', 'Vite', 'HTML', 'CSS'],
  },
  {
    id: 'databases',
    title: 'Databases',
    blurb: 'Relational modelling, queries and the constraints that keep data honest.',
    tone: 'accent',
    items: [
      'PostgreSQL',
      'Supabase',
      'SQL',
      'Row Level Security',
      'Database Transactions',
    ],
  },
  {
    id: 'data-science',
    title: 'Data Science',
    blurb: 'Working from messy raw data towards something explainable.',
    tone: 'data',
    items: [
      'Python',
      'NumPy',
      'Pandas',
      'Matplotlib',
      'Seaborn',
      'Plotly',
      'Data Cleaning',
      'Exploratory Data Analysis',
      'Data Visualization',
      'Statistical Analysis',
      'Feature Engineering',
      'Scikit-learn',
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI / Machine Learning',
    blurb: 'Preprocessing, training, evaluation and serving models as part of an application.',
    tone: 'data',
    items: [
      'Machine Learning',
      'AI API Integration',
      'Data Preprocessing',
      'Model Evaluation',
      'AI-powered Applications',
    ],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure / Tools',
    blurb: 'Version control, deployment platforms and the services around an application.',
    tone: 'accent',
    items: [
      'Git',
      'GitHub',
      'Railway',
      'Vercel',
      'Redis',
      'BullMQ',
      'WebSockets',
      'Stripe',
      'Streamlit',
      'FastAPI',
    ],
  },
]