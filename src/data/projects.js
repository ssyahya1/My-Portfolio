/**
 * =========================================================================
 * PROJECT DATA LAYER
 * =========================================================================
 *
 * Everything that knows about "what a project is" lives here, so the UI never
 * talks to GitHub directly.
 *
 *            GitHub API  (services/githubApi.js)
 *                 |
 *                 v
 *        PROJECT DATA LAYER  <- this file
 *        curation overlay, filtering, categorisation, model shape
 *                 |
 *                 v
 *       PROJECT MANAGEMENT   (services/projectStore.js)
 *       manual projects, overrides, CRUD
 *                 |
 *                 v
 *            PROJECT UI      (components/Projects.jsx, ProjectCard.jsx, ...)
 *
 * HOW GITHUB DATA BECOMES A PROJECT
 * ---------------------------------
 * 1. Every public repository is fetched from the GitHub API.
 * 2. `shouldIncludeRepo()` filters out repositories that should not be shown.
 * 3. `repoToProject()` builds the project model. It prefers the curated
 *    metadata below (verified against each repository's README and file tree);
 *    anything missing falls back to the GitHub API data and, failing that, to
 *    neutral wording. Nothing is invented.
 *
 * Every repository on this profile currently has an empty `description` and no
 * topics, so repository facts alone cannot produce a useful card. That is why
 * the overlay exists - and why it is keyed by repository name: any *new*
 * repository still appears automatically, just with less metadata.
 *
 * NOT INCLUDED, ON PURPOSE
 * ------------------------
 * - Repositories that do not exist (there is no "AI Resume SaaS" repository on
 *   this profile, so that project is not displayed).
 * - Technologies that are not verifiably used, invented statistics, or
 *   invented certifications.
 * - The EV repository lists WebSockets and ML-based demand prediction under
 *   *future* improvements only, so they are not claimed as technologies.
 */

import { GITHUB_USERNAME } from './site.js'

export const PROJECT_CATEGORIES = [
  'Backend',
  'Full-Stack',
  'Data Science',
  'Machine Learning',
  'AI',
  'Frontend',
  'Other',
]

export const FILTER_ALL = 'All'

/** Filter buttons shown in the projects section (plus any category in use). */
export const BASE_FILTERS = [
  FILTER_ALL,
  'Backend',
  'Full-Stack',
  'Data Science',
  'Machine Learning',
  'AI',
  'Frontend',
]

/* =========================================================================
 * CURATION OVERLAY
 * Keyed by GitHub repository name. Content verified from each repository's
 * README, file tree and package / requirements files.
 * ========================================================================= */
export const REPO_CURATION = {
  'smart-ev-optimizer': {
    title: 'Smart EV Fleet Charging & Grid Operations Optimizer',
    category: 'Full-Stack',
    featured: true,
    date: '2026-09-27',
    liveUrl: 'https://smart-ev-optimizer.vercel.app',
    description:
      'Full-stack EV fleet and smart-grid management system: React front end, Express REST API, PostgreSQL, and algorithm-driven charging optimisation.',
    longDescription:
      'Built to answer the question "how do data structures and algorithms actually behave inside a real application?" instead of as separate algorithm exercises. Users manage electric vehicles, charging bays, grid slots and charging sessions, and the backend exposes optimisation modules for vehicle assignment, charging scheduling, power allocation, routing, journey planning and resource allocation. This is where I worked most on authentication and API security: JWT in HttpOnly cookies, access and refresh tokens with rotation and revocation, Zod validation, Helmet, CORS configuration and API rate limiting, all enforced on the server with ownership checks on top. The repository also documents a Vercel + Railway + Neon deployment and automated Vitest / Supertest tests.',
    technologies: [
      'React',
      'Vite',
      'JavaScript',
      'React Router',
      'Node.js',
      'Express.js',
      'REST APIs',
      'PostgreSQL',
      'node-postgres',
      'JWT',
      'HttpOnly Cookies',
      'Zod',
      'Helmet',
      'bcrypt',
      'Rate Limiting',
      'Vitest',
      'Supertest',
      'Vercel',
      'Railway',
      'Neon',
    ],
    features: [
      'JWT authentication with HttpOnly cookies',
      'Access + refresh tokens with rotation and revocation',
      'Role-based authorization',
      'Request validation with Zod',
      'Assignment, routing, journey, power and resource-allocation algorithms',
      'Vehicle and charging-bay management',
      'Grid slot capacity and power allocation',
      'Charging session management',
      'Admin dashboard',
      'Algorithm performance benchmarking',
      'Automated backend and frontend tests',
      'Deployed front end (Vercel) with the API on Railway',
    ],
  },

  'hospital-management-system': {
    title: 'Hospital Management System',
    category: 'Full-Stack',
    featured: true,
    date: '2026-09-10',
    liveUrl: 'https://hospital-management-system-syed-yahya.vercel.app',
    description:
      'Full-stack hospital management application with a role-based REST API, a PostgreSQL database and a React front end for patients, doctors and administrators.',
    longDescription:
      'My most complete backend project. It manages users, patients, doctors, appointments and transactions, with the API split into routes, controllers, middleware and a database access module. Permissions are enforced per role: patients only reach their own records, doctors are restricted to their own appointments, and administrators manage users and system-wide data. Rules live in the database as well as the API, for example a constraint that stops a doctor from holding two appointments at the same date and time. It also covers the parts of a real application that are easy to skip: bcrypt hashing, API-key protection, validation middleware, duplicate-email checks, account deactivation, email-based password reset, parameterised queries, a centralised error handler returning correct HTTP status codes, and a documented Vercel + Neon deployment.',
    technologies: [
      'Node.js',
      'Express.js',
      'JavaScript',
      'REST APIs',
      'PostgreSQL',
      'Neon',
      'SQL',
      'React',
      'Vite',
      'JWT',
      'bcrypt',
      'API Keys',
      'Middleware',
      'Vercel',
    ],
    features: [
      'Role-based access control (patient / doctor / admin)',
      'JWT authentication with bcrypt password hashing',
      'API-key protection layered on top of authentication',
      'Validation middleware per resource',
      'Centralised error handling with correct HTTP status codes',
      'Rate limiting',
      'Patient profiles with ownership checks',
      'Appointment scheduling with a duplicate-time database constraint',
      'Transaction creation and status workflow',
      'User management: create, edit, change roles, activate / deactivate',
      'Email-based password reset',
      'Parameterised SQL queries',
    ],
  },

  'Fraud-detection-': {
    title: 'Fraud Detection - Machine Learning Service',
    category: 'Machine Learning',
    featured: true,
    date: '2026-08-21',
    image: 'https://raw.githubusercontent.com/ssyahya1/Fraud-detection-/main/assets/logo.png',
    apiDocs: 'https://fraud-detection.fastapicloud.dev/docs',
    description:
      'Transaction fraud detection: a machine learning pipeline served behind a FastAPI service, with a multi-page Streamlit interface in front of it.',
    longDescription:
      'The clearest example in my work of AI treated as an engineering problem rather than a notebook. The model is served behind a FastAPI endpoint and the interface is a separate deployment that calls it. Four classifiers were trained and compared, an automated preprocessing pipeline handles scaling, encoding and class imbalance with SMOTE, and a tuned Random Forest pipeline is the version the API serves. Instead of accepting the default 0.5 cut-off, the service applies a stored 0.40 probability threshold and returns the probability, the threshold and the resulting classification together, so a decision can be explained rather than just asserted. The README is explicit that the dataset is synthetic and that the output is educational, and I kept that disclaimer.',
    technologies: [
      'Python',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'imbalanced-learn (SMOTE)',
      'XGBoost',
      'Matplotlib',
      'Seaborn',
      'Joblib',
      'FastAPI',
      'Uvicorn',
      'Streamlit',
      'Jupyter Notebook',
    ],
    features: [
      'Random Forest pipeline with automatic preprocessing',
      'SMOTE for class imbalance',
      'Custom 0.40 probability threshold instead of the default 0.5',
      'Four classifiers compared before model selection',
      'GridSearchCV / RandomizedSearchCV tuning',
      'FastAPI endpoint returning probability, threshold and decision',
      'Streamlit pages: dashboard, dataset, prediction, about',
      'Interface and model service deployed separately',
    ],
    ds: {
      dataset:
        'synthetic_fraud_dataset.csv - transaction amount and type, account balance, device type, location, merchant category, IP-address flag, previous fraudulent activity, daily transaction count, average amount, card type and age, transaction distance, authentication method, risk score, weekend flag.',
      problem:
        'Classify a transaction as fraudulent or legitimate (target: Fraud_Label) from its attributes.',
      preparation:
        'One preprocessing pipeline performs numeric scaling with StandardScaler and One-Hot encoding of categoricals, with SMOTE applied, so training and prediction use identical transformations.',
      analysis:
        'Exploratory analysis of the transaction attributes against the fraud label, with the dataset also documented inside the application.',
      visualization: 'Matplotlib and Seaborn charts in the notebook and on the Streamlit dashboard page.',
      model:
        'Logistic Regression, Decision Tree, Random Forest and XGBoost were trained and compared; the served model is a Random Forest pipeline tuned with GridSearchCV / RandomizedSearchCV.',
      evaluation:
        'Models were compared during selection; the deployed service applies a stored 0.40 decision threshold to the predicted fraud probability.',
      findings:
        'The threshold mattered as much as the model. The same probability is classified differently depending on where the cut-off is set, which is why the threshold is stored as its own artefact and returned with every prediction.',
    },
  },

  'House-Price-Prediction-': {
    title: 'House Price Prediction',
    category: 'Machine Learning',
    featured: true,
    date: '2026-08-05',
    description:
      'End-to-end regression project that estimates house prices, from cleaning and EDA to a tuned model served through a multi-page Streamlit app.',
    longDescription:
      'The project I would point to when asked whether I can follow a whole machine learning workflow rather than just call `.fit()`. It runs from data loading and cleaning through EDA, feature engineering, preprocessing, training, tuning, evaluation and deployment as separate explicit steps. The preprocessing is a real Scikit-learn Pipeline, so training and prediction cannot drift apart, and several engineered features carry the domain thinking: total square footage, combined bathroom and garage scores, house age and time since remodelling. Linear Regression is kept as a baseline, Random Forest is tuned with RandomizedSearchCV, and XGBoost is included as a boosting comparison, with MAE, RMSE and R² reported in the README.',
    technologies: [
      'Python',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'XGBoost',
      'Joblib',
      'Matplotlib',
      'Seaborn',
      'Streamlit',
      'Jupyter Notebook',
    ],
    features: [
      'Complete workflow: load, clean, EDA, feature engineering, train, tune, evaluate, deploy',
      'Scikit-learn Pipeline for repeatable preprocessing',
      'Engineered features: TotalSF, TotalFloorSF, TotalBath, TotalGarageSF, HouseAge, RemodAge, TotalOutdoorSF',
      'Linear Regression baseline',
      'Random Forest Regressor tuned with RandomizedSearchCV',
      'XGBoost Regressor comparison',
      'MAE, RMSE and R² evaluation',
      'Multi-page Streamlit app: prediction, house information, model information',
    ],
    ds: {
      dataset:
        'A housing dataset (train.csv plus data_description.txt) covering overall quality, living area, location, garage and basement details, rooms, house age and condition.',
      problem: 'Predict the sale price of a property from its characteristics (regression).',
      preparation:
        'A Scikit-learn Pipeline handles missing values and One-Hot encoding so the same transformations are reused at prediction time.',
      analysis:
        'Correlation and distribution analysis plus scatter plots for numerical features, and category-wise average price comparisons for categorical features.',
      visualization: 'Matplotlib / Seaborn plots in the notebook and a model-information page inside the app.',
      model:
        'Linear Regression as a baseline, Random Forest Regressor tuned with RandomizedSearchCV, and XGBoost Regressor.',
      evaluation: 'MAE, RMSE and R².',
      findings:
        'Feature engineering around total area, bathrooms and garage space is what moved the model, not the choice of algorithm alone - the coefficients and importances only became meaningful once those combined features existed.',
    },
  },

  'Superstore-Sales-Prediction': {
    title: 'Superstore Sales Prediction',
    category: 'Machine Learning',
    date: '2026-07-29',
    description:
      'Regression study on the Kaggle Superstore dataset comparing four models to predict order sales - and reporting the result honestly, including where the data runs out.',
    longDescription:
      'The most useful lesson in my portfolio is in this project, and it is not a good score. Four regression models were trained on the Kaggle Superstore dataset and compared, and the honest conclusion is that the available features carry limited predictive power for sales: the best model reached an R² of roughly 0.19, and every model landed in a similar place. Rather than dropping the project or dressing the numbers up, I wrote the explanation into the README - performance here depends on feature quality, not on algorithm choice. Everything around that conclusion is still a complete workflow: missing and duplicate records removed, dates parsed into year, month, day, weekday, quarter and shipping-days features, categoricals One-Hot encoded, numerics standardised for Linear Regression, and R²/MAE/RMSE compared in a table.',
    technologies: [
      'Python',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'XGBoost',
      'Joblib',
      'Matplotlib',
      'Seaborn',
      'Plotly',
      'Streamlit',
      'Jupyter Notebook',
    ],
    features: [
      'EDA across category, region, state, segment, month and year',
      'Date-based feature engineering: year, month, day, weekday, quarter, shipping days',
      'One-Hot encoding and feature scaling',
      'Four regressors trained and compared',
      'R² / MAE / RMSE comparison table',
      'XGBoost model exported with Joblib',
      'Streamlit application included in the repository',
    ],
    ds: {
      dataset: 'Kaggle Superstore Sales dataset (orders, customers, products, regions and the Sales target).',
      problem: 'Predict the Sales value of each order from historical order and product information.',
      preparation:
        'Removed missing and duplicate records, parsed date columns, dropped unnecessary columns, One-Hot encoded categoricals and standardised numerics.',
      analysis:
        'Sales distribution, sales by category, region, state, segment, month and year, top products and cities, and ship-mode analysis.',
      visualization: 'Matplotlib and Seaborn plots in the notebook.',
      model:
        'Linear Regression, Random Forest Regressor, Gradient Boosting Regressor and XGBoost Regressor.',
      evaluation: 'R², MAE and RMSE, compared in a single table across all four models.',
      findings:
        'XGBoost performed best overall, but R² stayed around 0.19 for every model. The README states plainly that the available features have limited predictive power for sales - a result I kept rather than hid, because knowing when a dataset is the bottleneck is part of the job.',
    },
  },

  'Movie-Recommendation-System-': {
    title: 'Movie Recommendation System',
    category: 'Machine Learning',
    date: '2026-07-29',
    description:
      'Content-based recommender that suggests similar films from genres, cast, crew and keywords, with precomputed similarity data served through Streamlit.',
    longDescription:
      'A recommendation system built the way that works without a single user rating: instead of collaborative filtering, each film is described by its own metadata - genres, cast, crew and keywords - and films are ranked by how much of that description they share. The interesting part was not the ranking itself but noticing why it fails: films only connect when they share credits, so obscure titles fall back to weak neighbours. That limitation is written into the repository as the reason collaborative filtering and a hybrid approach are the next step. The notebook and the Streamlit app live together, with the movie data and similarity artefacts saved so the app does not recompute them on start.',
    technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Streamlit', 'Jupyter Notebook'],
    features: [
      'Content-based similarity over combined movie metadata',
      'Genres, cast, crew and keywords used as the feature source',
      'Precomputed movie data and similarity artefacts reused by the app',
      'Streamlit interface: pick a film, get similar recommendations',
      'Notebook and application kept in the same repository',
    ],
    ds: {
      dataset: 'Movie metadata records containing genres, cast, crew and keywords.',
      problem: 'Given a film the user selects, rank and return the most similar films.',
      preparation:
        'Cast, crew, genres and keywords are combined into a single description per film and vectorised so films can be compared numerically.',
      analysis:
        'Inspection of how much metadata films actually share, which is what exposes the weakness of a purely content-based approach.',
      visualization:
        'Similarity inspection during development; the delivered interface is the ranked recommendation list itself.',
      model:
        'Content-based similarity with no user ratings involved, with the similarity data precomputed and stored alongside the app.',
      evaluation:
        'Verified by inspecting the returned neighbours for well-known films. Collaborative filtering and a hybrid system are listed as future work.',
      findings:
        'Content-based recommendation is transparent and needs no user history, but it cannot learn from behaviour - a limitation I documented rather than worked around.',
    },
  },

  'Heart-Stroke-Prediction-': {
    title: 'Heart Disease Prediction System',
    category: 'Machine Learning',
    date: '2026-07-29',
    description:
      'Streamlit application that estimates heart disease risk from patient health measurements using a trained, scaled model.',
    longDescription:
      'A focused classification project built around a workflow that has to be correct in a specific way: the model is only trustworthy if the inputs it receives at prediction time go through exactly the same transformations as the training data. Categorical fields are encoded using the stored column order, numerical fields are scaled with a persisted StandardScaler, and both artefacts ship with the model so the Streamlit app cannot silently pass raw values to a model that expects scaled ones. Eleven clinical inputs are exposed in the interface - age, sex, chest pain type, resting blood pressure, cholesterol, fasting blood sugar, resting ECG, maximum heart rate, exercise-induced angina, oldpeak and ST slope - and the README documents the full workflow from cleaning through to deployment.',
    technologies: [
      'Python',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'SciPy',
      'Joblib',
      'Matplotlib',
      'Seaborn',
      'Streamlit',
    ],
    features: [
      'Interactive Streamlit interface for real-time prediction',
      'Eleven clinical input features',
      'Categorical encoding using persisted column definitions',
      'Feature scaling with a saved StandardScaler',
      'Model and preprocessing artefacts saved with Joblib',
      'Documented workflow: collection, cleaning, EDA, engineering, encoding, scaling, training, evaluation, deployment',
    ],
    ds: {
      dataset:
        'A heart-disease patient dataset with age, sex, chest pain type, resting blood pressure, cholesterol, fasting blood sugar, resting ECG, maximum heart rate, exercise-induced angina, oldpeak and ST slope.',
      problem: 'Predict whether a patient is at risk of heart disease from clinical measurements (classification).',
      preparation:
        'Categorical variables encoded and numerical features scaled with StandardScaler, with the scaler and column definitions persisted so prediction uses identical transformations.',
      analysis: 'Exploratory analysis and feature inspection across the clinical variables before modelling.',
      visualization: 'Matplotlib and Seaborn during EDA; the shipped interface shows the prediction result.',
      model: 'A Logistic Regression model trained on the prepared features and saved with Joblib.',
      evaluation:
        'Evaluated as part of the documented workflow. No accuracy claim is made in the interface, and the app is presented as a prediction aid rather than a diagnosis.',
      findings:
        'The project reinforced that the preprocessing around a model needs to travel with it - most of the bugs worth fixing were mismatches between training transformations and prediction inputs, not model choice.',
    },
  },

  'Customer--Response-Prediction': {
    title: 'Customer Response Prediction',
    category: 'Machine Learning',
    date: '2026-07-26',
    description:
      'Predicts whether a customer will respond to a marketing campaign, covering cleaning, feature engineering, tuning and model selection.',
    longDescription:
      'A marketing-campaign classification project where the most valuable work happened before any model was trained. The existing columns describe who a customer is, but not how engaged they are, so additional features were derived: age, customer tenure in days, total spending, total purchases and number of children at home. Those features are what gave the models something to separate on. Categorical fields are One-Hot encoded and numerical fields standardised inside a Scikit-learn Pipeline, so the same transformations are reused at prediction time, and five classifiers plus tuned variants were compared with Accuracy, Precision and Recall rather than a single headline number.',
    technologies: [
      'Python',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'XGBoost',
      'Joblib',
      'Matplotlib',
      'Seaborn',
      'Streamlit',
      'Jupyter Notebook',
    ],
    features: [
      'Derived features: Age, Customer_Tenure_days, Total_Spending, Total_Purchases, Children at home',
      'One-Hot encoding and StandardScaler inside a Scikit-learn Pipeline',
      'Five classifiers trained and compared',
      'Tuned variants using RandomizedSearchCV',
      'Accuracy, Precision and Recall evaluation',
      'Streamlit deployment of the selected model',
    ],
    ds: {
      dataset:
        'Marketing campaign dataset (marketing_campaign.csv) with education, marital status, income, children at home, purchase history, product spending, website activity and complaints.',
      problem:
        'Predict whether a customer will respond to a marketing campaign (target: Response, 1 = responded, 0 = did not respond).',
      preparation:
        'Categorical features One-Hot encoded and numerical features standardised with StandardScaler inside a Scikit-learn Pipeline, after cleaning and EDA.',
      analysis:
        'Exploratory analysis of customer demographics, spending behaviour and campaign response before feature engineering.',
      visualization: 'Matplotlib and Seaborn during EDA, with the Streamlit app presenting the interactive prediction.',
      model:
        'Logistic Regression, Decision Tree, Gradient Boosting, Random Forest and XGBoost, plus Random Forest and XGBoost variants tuned with RandomizedSearchCV.',
      evaluation: 'Accuracy, Precision and Recall used to compare candidates and select the final model.',
      findings:
        'Derived engagement features - tenure, total spending and total purchases - separated responders far better than the original demographic columns alone, which is the part of this project I would reuse immediately.',
    },
  },

  'Supply-Chain-Data-Analyst-': {
    title: 'Supply Chain Analytics Dashboard',
    category: 'Data Science',
    date: '2026-07-30',
    description:
      'Streamlit analytics dashboard connected to a MySQL product database, reporting inventory, pricing and availability insights through interactive charts.',
    longDescription:
      'A reminder that not every data project needs a model. This one connects a Streamlit multi-page app to a MySQL products table and turns raw operational records into something a person can act on: product counts, average price, total stock, availability, product-type distribution, stock levels per type, price distribution, and the most and least expensive items. It is also the project where I wrote the database side myself - creating the schema, connecting with the MySQL connector, and loading queries into Pandas DataFrames before charting them with Plotly, which is far closer to how analytics is actually done than a static CSV in a notebook.',
    technologies: ['Python', 'Streamlit', 'MySQL', 'mysql-connector-python', 'Pandas', 'Plotly', 'SQL'],
    features: [
      'Multi-page Streamlit app: main dashboard, product, inventory, price and raw-data pages',
      'KPIs for product count, average price, total stock and availability',
      'Product type and category analysis',
      'Stock-level analysis by product type',
      'Price distribution with highest and lowest cost products',
      'Full product records browser',
      'MySQL schema and connection written for the project',
    ],
    ds: {
      dataset:
        'A MySQL `products` table created for the project: SKU, product type, price, availability and stock levels.',
      problem:
        'Monitor supply-chain performance - product mix, inventory levels, pricing and availability - from a live database rather than a static file.',
      preparation:
        'Database schema created manually and queried through the MySQL connector, with results loaded into Pandas DataFrames.',
      analysis:
        'Product performance and category comparison, stock analysis by product type, and price distribution including the extremes.',
      visualization: 'Interactive Plotly charts across the pages, plus a raw-data view for auditing.',
      findings:
        'The bottleneck was data access, not analysis: once the schema and connection were correct, the charts were straightforward. Analytics on real operational data depends more on querying it properly than on the plotting library.',
    },
  },

  'fraud-detection-ui-': {
    title: 'Fraud Guard AI - Interface Prototype',
    category: 'Frontend',
    date: '2026-08-21',
    image: 'https://raw.githubusercontent.com/ssyahya1/fraud-detection-ui-/main/logo.svg',
    description:
      'Static HTML, CSS and JavaScript client for the fraud detection API: dashboard, transaction check, analytics, about and API status views.',
    longDescription:
      'The interface half of the fraud detection work, written without a framework on purpose. It is a self-contained single-page application in plain JavaScript: a sidebar navigation that collapses behind a hamburger with an overlay on mobile, five views switched in place, a twenty-field transaction form with client-side validation and an accessible error region, a risk-score slider with a live value and bar, and an API status indicator that actually polls the deployed FastAPI service instead of assuming it is up. The styling runs on CSS design tokens, so the whole theme is controlled from one place. Building this taught me what React is solving for, which is exactly why it was worth doing in vanilla JS first.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Fetch API'],
    features: [
      'Five views: dashboard, transaction check, analytics, about, API status',
      'Sidebar navigation with mobile hamburger and overlay',
      'Twenty-field transaction form with client-side validation',
      'Risk-score slider with live value readout and bar',
      'Live API connectivity check against the deployed FastAPI service',
      'Design tokens in CSS for the entire theme',
      'Fully responsive layout',
    ],
  },
}

/* =========================================================================
 * WHAT GETS HIDDEN, AND WHY
 * Anything listed here is kept out of the portfolio but the reason is
 * preserved, so the admin view can explain why a repository is not shown
 * instead of silently dropping it.
 * ========================================================================= */
export const EXCLUDED_REPOS = {
  'Python-':
    'Course practice repository ("Bano qabil 2.0"): assignment scripts only, no application, no README content and no description to present.',
}

/** Repository names matching these are treated as scratch work. */
const DENY_NAME_PATTERNS = [
  /(^|[-_.])(test|tests|testing|dummy|sample|scratch|tmp|temp|playground|practice|assignment|sandbox|experiment|backup|oldcopy|archive)([-_.]|$)/i,
  /(^|[-_.])(dotfiles|config|configs|boilerplate|template|starter)([-_.]|$)/i,
]

/** Repositories that may stay even if they look like forks / archived. */
export const REPO_ALLOWLIST = Object.keys(REPO_CURATION)

/* =========================================================================
 * CATEGORISATION
 * Used for repositories that are not in the curation overlay yet, so a new
 * repository still lands in a sensible category instead of disappearing.
 * ========================================================================= */
const SIGNALS = {
  ml: [
    'machine-learning',
    'machine learning',
    'scikit',
    'sklearn',
    'xgboost',
    'random-forest',
    'regression',
    'classification',
    'model',
    'smote',
    'clustering',
    'recommendation',
  ],
  dataScience: [
    'data-analysis',
    'data-analysis-project',
    'data-science',
    'analytics',
    'dashboard',
    'pandas',
    'eda',
    'visualization',
    'dataset',
    'sql-analysis',
    'notebook',
  ],
  ai: ['artificial-intelligence', 'llm', 'openai', 'nlp', 'computer-vision', 'deep-learning', 'transformer', 'ai'],
  backend: [
    'api',
    'rest',
    'express',
    'node',
    'server',
    'backend',
    'postgres',
    'postgresql',
    'mongodb',
    'mysql',
    'fastapi',
    'django',
    'flask',
    'jwt',
    'auth',
    'graphql',
    'microservice',
    'crud',
  ],
  frontend: ['react', 'vue', 'svelte', 'next', 'vite', 'frontend', 'html', 'css', 'tailwind', 'ui'],
}

function countSignals(haystack, words) {
  return words.reduce((total, word) => (haystack.includes(word) ? total + 1 : total), 0)
}

/**
 * Best-effort category for a repository that has no curated entry.
 * Returns null when there is not enough evidence, and the caller then falls
 * back to "Other" rather than guessing.
 */
export function classifyRepo(repo = {}) {
  const haystack = [repo.name, repo.description, repo.language, ...(repo.topics || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const scores = {
    'Machine Learning': countSignals(haystack, SIGNALS.ml),
    'Data Science': countSignals(haystack, SIGNALS.dataScience),
    AI: countSignals(haystack, SIGNALS.ai),
    Backend: countSignals(haystack, SIGNALS.backend),
    Frontend: countSignals(haystack, SIGNALS.frontend),
  }

  const language = (repo.language || '').toLowerCase()
  const languageMl = ['python', 'jupyter notebook', 'r'].includes(language)

  const back = scores.Backend
  const front = scores.Frontend
  if (back > 0 && front > 0) return 'Full-Stack'
  if (scores['Machine Learning'] > 1 || (languageMl && scores['Machine Learning'] > 0)) {
    return 'Machine Learning'
  }
  if (scores.AI > 0 && languageMl) return 'AI'
  if (scores['Data Science'] > 0) return 'Data Science'
  if (scores.AI > 0) return 'AI'
  if (back > 0) return 'Backend'
  if (front > 0) return 'Frontend'
  return null
}

/** Acronyms that should stay upper-case when a repository name is prettified. */
const ACRONYMS = new Set([
  'ai',
  'ml',
  'ev',
  'api',
  'apis',
  'ui',
  'ux',
  'sql',
  'db',
  'css',
  'html',
  'js',
  'crud',
  'crm',
  'nlp',
  'llm',
  'ocr',
  'iot',
  'saas',
  'rest',
  'json',
  'csv',
  'os',
  'ip',
  'atm',
  'kpi',
  'eda',
])

/** "smart-ev-optimizer" -> "Smart EV Optimizer" (fallback title for new repos). */
export function deriveTitle(repoName = '') {
  return repoName
    .replace(/[-_.]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase()
      if (ACRONYMS.has(lower)) return lower.toUpperCase()
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/* =========================================================================
 * FILTERING
 * ========================================================================= */

/**
 * Decides whether a repository belongs on the portfolio.
 * Returns a reason in every case so the decision can be explained in the UI.
 */
export function shouldIncludeRepo(repo = {}) {
  const name = repo.name || ''
  const curated = Boolean(REPO_CURATION[name])

  if (EXCLUDED_REPOS[name]) {
    return { include: false, reason: EXCLUDED_REPOS[name] }
  }
  if (repo.fork && !curated) {
    return { include: false, reason: 'Forked repository - not original work.' }
  }
  if (repo.archived && !curated) {
    return { include: false, reason: 'Archived repository.' }
  }
  if (repo.disabled) {
    return { include: false, reason: 'Repository is disabled on GitHub.' }
  }
  if (!curated && DENY_NAME_PATTERNS.some((pattern) => pattern.test(name))) {
    return { include: false, reason: 'Name suggests a test, template or scratch repository.' }
  }

  const topics = repo.topics || []
  const hasDescription = Boolean(repo.description && repo.description.trim())
  const isEmpty = !repo.size || Number(repo.size) <= 2

  if (!curated) {
    // An empty repository with no description and no topics is not a project.
    if (isEmpty && !hasDescription) {
      return { include: false, reason: 'Empty repository with no description.' }
    }
    if (!hasDescription && topics.length === 0 && !repo.language) {
      return {
        include: false,
        reason: 'No description, topics or detected language - not enough information to present.',
      }
    }
  }

  return { include: true, reason: curated ? 'Curated project.' : 'Included from GitHub metadata.' }
}

/* =========================================================================
 * MODEL
 * ========================================================================= */

const GENERIC_DESCRIPTION =
  'Public repository. It does not have a description on GitHub yet, so open it in a new tab to see the code and README.'

/** Technologies that can be derived safely from the API alone. */
function technologiesFromRepo(repo = {}) {
  return [repo.language].filter(Boolean)
}

/**
 * Builds the single project shape the UI renders.
 *
 * GitHub repository -> project model
 *   id, source, githubRepo, title, category, description, longDescription,
 *   technologies[], features[], githubUrl, liveUrl, image, date, featured,
 *   published, stars, language, topics, ds, apiDocs
 */
export function repoToProject(repo = {}) {
  const curated = REPO_CURATION[repo.name] || {}
  const inferredCategory = classifyRepo(repo)
  const description = curated.description || (repo.description || '').trim()

  return {
    id: `github-${repo.name}`,
    source: 'github',
    githubRepo: repo.name,
    title: curated.title || deriveTitle(repo.name),
    category: curated.category || inferredCategory || 'Other',
    categorySource: curated.category ? 'curated' : 'inferred',

    description: description || GENERIC_DESCRIPTION,
    needsDescription: !description,
    longDescription: curated.longDescription || '',

    technologies: curated.technologies || technologiesFromRepo(repo),
    features: curated.features || [],

    githubUrl: repo.html_url || `https://github.com/${GITHUB_USERNAME}/${repo.name}`,
    liveUrl: curated.liveUrl || repo.homepage || '',
    apiDocs: curated.apiDocs || '',
    image: curated.image || '',

    date: curated.date || (repo.pushed_at || repo.updated_at || '').slice(0, 10),
    updatedAt: (repo.pushed_at || repo.updated_at || '').slice(0, 10),

    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    language: repo.language || '',
    topics: repo.topics || [],

    featured: Boolean(curated.featured),
    published: curated.published !== false,
    ds: curated.ds || null,

    overridden: false,
  }
}

/**
 * Turns a raw GitHub repository list into projects plus an explanation of
 * everything that was left out.
 */
export function buildProjectsFromRepos(repos = []) {
  const projects = []
  const hidden = []

  repos.forEach((repo) => {
    const decision = shouldIncludeRepo(repo)
    if (decision.include) {
      projects.push(repoToProject(repo))
    } else {
      hidden.push({ name: repo.name, url: repo.html_url || '', reason: decision.reason })
    }
  })

  return { projects, hidden }
}

/* =========================================================================
 * OVERRIDES + MERGE
 * GitHub is the source of repositories; the store is the source of editorial
 * decisions (featured, published, category, hand-written copy). Merging them
 * here keeps both sides independent.
 * ========================================================================= */
export const OVERRIDE_FIELDS = [
  'title',
  'category',
  'description',
  'longDescription',
  'technologies',
  'features',
  'liveUrl',
  'image',
  'date',
  'featured',
  'published',
]

export function applyOverride(project, override) {
  if (!override) return project
  const next = { ...project }
  let changed = false
  OVERRIDE_FIELDS.forEach((field) => {
    if (override[field] !== undefined && override[field] !== null) {
      next[field] = override[field]
      changed = true
    }
  })
  next.overridden = changed
  if (changed && override.description) next.needsDescription = false
  return next
}

export function mergeProjects({ githubProjects = [], manualProjects = [], overrides = {} } = {}) {
  const knownRepoUrls = new Set(
    githubProjects.map((project) => (project.githubUrl || '').toLowerCase()).filter(Boolean),
  )

  const mergedGithub = githubProjects.map((project) => applyOverride(project, overrides[project.id]))

  const dropped = []
  const mergedManual = []
  manualProjects.forEach((project) => {
    const key = (project.githubUrl || '').toLowerCase()
    if (key && knownRepoUrls.has(key)) {
      dropped.push({
        title: project.title,
        reason: 'A GitHub project already links to the same repository.',
      })
      return
    }
    mergedManual.push(applyOverride(project, overrides[project.id]))
  })

  const visible = [...mergedGithub, ...mergedManual].filter((project) => project.published !== false)

  return { projects: sortProjects(visible), dropped }
}

/** Featured projects first, then newest, then alphabetical. */
export function sortProjects(list = []) {
  return [...list].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1
    const dateA = a.date || ''
    const dateB = b.date || ''
    if (dateA !== dateB) return dateA < dateB ? 1 : -1
    return (a.title || '').localeCompare(b.title || '')
  })
}

export const DATA_CATEGORIES = ['Data Science', 'Machine Learning', 'AI']

export function isDataProject(project) {
  return DATA_CATEGORIES.includes(project.category)
}

export function filterProjects(list = [], { category = FILTER_ALL, search = '' } = {}) {
  const term = search.trim().toLowerCase()

  return list.filter((project) => {
    if (category !== FILTER_ALL && project.category !== category) return false
    if (!term) return true

    const haystack = [
      project.title,
      project.description,
      project.category,
      project.githubRepo,
      project.language,
      ...(project.technologies || []),
      ...(project.features || []),
      ...(project.topics || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(term)
  })
}

/** Filter buttons, always including any category that is actually in use. */
export function computeFilterOptions(projects = []) {
  const present = new Set(projects.map((project) => project.category))
  const names = [...BASE_FILTERS]
  PROJECT_CATEGORIES.forEach((category) => {
    if (present.has(category) && !names.includes(category)) names.push(category)
  })

  return names.map((name) => ({
    name,
    count:
      name === FILTER_ALL
        ? projects.length
        : projects.filter((project) => project.category === name).length,
  }))
}

export function computeProjectStats(projects = []) {
  return {
    total: projects.length,
    fromGithub: projects.filter((project) => project.source === 'github').length,
    manual: projects.filter((project) => project.source === 'manual').length,
    featured: projects.filter((project) => project.featured).length,
    dataProjects: projects.filter(isDataProject).length,
    categories: new Set(projects.map((project) => project.category)).size,
  }
}

/* =========================================================================
 * VALIDATION + NORMALISATION (used by the add / edit form)
 * ========================================================================= */
const URL_RE = /^https?:\/\/[^\s]+$/i

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function normalizeText(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
}

/** Accepts an array, or a newline / comma / semicolon separated string. */
export function normalizeList(value) {
  // Arrays are joined with newlines so the same splitting rules apply either
  // way - an array item can itself contain a comma or a newline.
  const source = Array.isArray(value) ? value.join('\n') : String(value || '')
  const out = []
  source.split(/[\n,;]/).forEach((part) => {
    const item = normalizeText(part)
    if (item && !out.some((existing) => existing.toLowerCase() === item.toLowerCase())) out.push(item)
  })
  return out
}

export function emptyDraft() {
  return {
    title: '',
    category: 'Full-Stack',
    description: '',
    longDescription: '',
    technologies: [],
    features: [],
    githubUrl: '',
    liveUrl: '',
    image: '',
    date: todayISO(),
    featured: false,
    published: true,
  }
}

/** Existing project -> editable draft (used by "edit" and by preview). */
export function draftFromProject(project = {}) {
  return {
    id: project.id,
    title: project.title || '',
    category: project.category || 'Full-Stack',
    description: project.description || '',
    longDescription: project.longDescription || '',
    technologies: [...(project.technologies || [])],
    features: [...(project.features || [])],
    githubUrl: project.githubUrl || '',
    liveUrl: project.liveUrl || '',
    image: project.image || '',
    date: project.date || todayISO(),
    featured: Boolean(project.featured),
    published: project.published !== false,
  }
}

export function validateProjectInput(draft = {}) {
  const errors = {}

  const value = {
    title: normalizeText(draft.title),
    category: PROJECT_CATEGORIES.includes(draft.category) ? draft.category : 'Full-Stack',
    description: normalizeText(draft.description),
    longDescription: String(draft.longDescription || '').trim(),
    technologies: normalizeList(draft.technologies),
    features: normalizeList(draft.features),
    githubUrl: normalizeText(draft.githubUrl),
    liveUrl: normalizeText(draft.liveUrl),
    image: normalizeText(draft.image),
    date: normalizeText(draft.date),
    featured: Boolean(draft.featured),
    published: draft.published !== false,
  }

  if (!value.title) errors.title = 'A project title is required.'
  else if (value.title.length < 3) errors.title = 'Use at least 3 characters.'

  if (!value.description) {
    errors.description = 'A short description is required - it is what visitors read first.'
  } else if (value.description.length < 20) {
    errors.description = 'Write at least 20 characters so the card says something useful.'
  }

  if (value.githubUrl && !URL_RE.test(value.githubUrl)) {
    errors.githubUrl = 'Enter a full URL starting with http:// or https://'
  }
  if (value.liveUrl && !URL_RE.test(value.liveUrl)) {
    errors.liveUrl = 'Enter a full URL starting with http:// or https://'
  }
  if (value.image && !URL_RE.test(value.image)) {
    errors.image = 'Enter a full image URL, or leave it empty to use a generated cover.'
  }
  if (value.date && !/^\d{4}-\d{2}-\d{2}$/.test(value.date)) {
    errors.date = 'Use the YYYY-MM-DD format.'
  }

  return { valid: Object.keys(errors).length === 0, errors, value }
}

/** Validated draft -> project model ready to be stored. */
export function createManualProject(input = {}) {
  const { value } = validateProjectInput(input)
  return {
    ...value,
    id: input.id || `manual-${Date.now().toString(36)}`,
    source: 'manual',
    githubRepo: '',
    apiDocs: '',
    stars: 0,
    forks: 0,
    language: '',
    topics: [],
    ds: null,
    needsDescription: false,
    overridden: false,
  }
}

/** ISO date -> "Sep 2026" for display. */
export function formatUpdated(iso) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}