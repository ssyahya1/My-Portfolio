/**
 * The data-science workflow shown in the Data Science & AI section.
 * Kept separate from the backend architecture data on purpose: the two are
 * different processes and are rendered differently.
 */

export const DS_WORKFLOW = [
  {
    step: '01',
    label: 'Raw Data',
    detail: 'CSV files, database tables or synthetic data, exactly as it arrives.',
  },
  {
    step: '02',
    label: 'Data Cleaning',
    detail: 'Missing values, duplicates, wrong types, inconsistent categories.',
  },
  {
    step: '03',
    label: 'Exploratory Analysis',
    detail: 'Distributions, relationships, outliers and what the target actually looks like.',
  },
  {
    step: '04',
    label: 'Visualization',
    detail: 'Plots that make a pattern obvious to someone who has not seen the data.',
  },
  {
    step: '05',
    label: 'Feature Engineering',
    detail: 'Encoding, scaling and building new features that carry more signal.',
  },
  {
    step: '06',
    label: 'Machine Learning',
    detail: 'Training candidate models — regression, classification or similarity.',
  },
  {
    step: '07',
    label: 'Model Evaluation',
    detail: 'MAE / RMSE / R² for regression, accuracy, precision and recall for classification.',
  },
  {
    step: '08',
    label: 'Insights / Application',
    detail: 'A dashboard, a Streamlit app or a service the model is served behind.',
  },
]

export const DS_CARDS = [
  {
    id: 'analysis',
    title: 'Data Analysis',
    detail: 'Cleaning, exploring, and understanding structured datasets.',
    points: ['Missing-value handling', 'Type and category fixes', 'Summary statistics'],
  },
  {
    id: 'eda',
    title: 'Exploratory Data Analysis',
    detail: 'Investigating distributions, relationships, missing values, trends, and patterns.',
    points: ['Correlation analysis', 'Distribution and outlier checks', 'Target behaviour'],
  },
  {
    id: 'visualization',
    title: 'Data Visualization',
    detail: 'Creating visualizations that make data easier to understand.',
    points: ['Matplotlib and Seaborn', 'Plotly for interactive charts', 'Explaining a result simply'],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    detail: 'Working with preprocessing, feature engineering, model training, and evaluation.',
    points: ['Scikit-learn pipelines', 'Multiple models compared', 'Tuning and honest evaluation'],
  },
  {
    id: 'ai',
    title: 'AI Integration',
    detail: 'Integrating AI capabilities into practical applications and backend systems.',
    points: [
      'Serving a model behind an API',
      'Separating the model service from the interface',
      'Keeping AI features inside a normal backend',
    ],
  },
]