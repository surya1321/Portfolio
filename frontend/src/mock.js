// Centralized mock data for the portfolio

export const availability = {
  open: true,
  label: "Open to Opportunities",
  availableFrom: "July 2025",
  roles: ["SDE", "Data Engineer", "ML Engineer"],
  tooltip: "Available for full-time roles from July 2025"
};

export const profile = {
  name: "Meruva Surya Tej",
  fullName: "Meruva Surya Tej",
  initials: "MST",
  role: "Data Engineer & SDE",
  tagline: "Building data-driven systems that turn raw signals into measurable business outcomes.",
  location: "Hyderabad, India",
  email: "suryatej.m13@gmail.com",
  github: "surya1321",
  githubUrl: "https://github.com/surya1321",
  linkedin: "https://www.linkedin.com/in/meruva-surya-tej-b7b51426a",
  resumeUrl: "https://customer-assets.emergentagent.com/job_impact-hub-68/artifacts/sh2yc7mz_Meruva%20Surya%20Tej%20Resume.pdf",
  bio: "I sit at the intersection of data science, software engineering, and ERP. I build Python pipelines that replace hours of manual ops, ship internal platforms end-to-end, and translate raw data into dashboards leadership can act on. Pragmatic, fast-shipping, and obsessed with clean error handling and audit-grade reliability.",
  stats: [
    { label: "Years Coding", value: 4, suffix: "+" },
    { label: "Projects Shipped", value: 12, suffix: "+" },
    { label: "Gesture Model Acc.", value: 95, suffix: "%" },
    { label: "Hours Automated / mo", value: 40, suffix: "+" }
  ]
};

export const experience = [
  {
    id: "exp-guardian",
    company: "Guardian Capital Investment Advisors",
    role: "Software / Automation Intern",
    location: "Hyderabad, India",
    period: "Jan 2025 — Mar 2025",
    type: "Internship · Fin-Tech",
    summary: "Built internal tooling and automation pipelines that reduced monthly manual workload and surfaced KPI dashboards to leadership.",
    achievements: [
      "Built an internal Exam Portal end-to-end, streamlining assessments for both candidates and admins.",
      "Designed Python automation pipelines with fail-closed error handling, audit logging, and modular parsing — replacing hours of monthly manual work.",
      "Hands-on with n8n workflow automation and Zoho RPA; modeled business data and built KPI dashboards driving strategic decisions."
    ],
    stack: ["Python", "n8n", "Zoho RPA", "SQL", "Dashboards"]
  }
];

export const projects = [
  {
    id: "absa",
    title: "ABSA — Aspect-Based Sentiment Analysis",
    category: "NLP · Data Science",
    year: "2024",
    short: "Aspect-extraction + per-aspect sentiment classification with a Tkinter GUI.",
    description:
      "Sentiment analysis pipeline that extracts product/service aspects and classifies sentiment per aspect. Ships with a Tkinter GUI so non-technical users can analyze customer feedback in seconds.",
    bullets: [
      "Aspect extraction + per-aspect sentiment classification using NLTK + Stanza.",
      "Tkinter GUI for interactive, non-technical analysis.",
      "Designed for actionable insights from raw customer feedback."
    ],
    outcomes: [
      "Cuts manual feedback triage time dramatically.",
      "Per-aspect granularity surfaces issues product teams can act on.",
      "GUI removes the Python barrier for business users."
    ],
    stack: ["Python", "NLTK", "Stanza", "Tkinter"],
    metric: "Per-aspect classification",
    github: "https://github.com/surya1321",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=70&auto=format&fit=crop",
    accent: "NLP"
  },
  {
    id: "gesture-player",
    title: "Hands-Free Media Player via Gesture Recognition",
    category: "Computer Vision · Deep Learning",
    year: "2024",
    short: "CNN + OpenCV gesture controller for media, slides, and mouse.",
    description:
      "Real-time gesture-controlled media player. Webcam input is classified by a CNN to drive play/pause, volume, and navigation — plus extras like slide control, virtual whiteboard, and mouse interaction.",
    bullets: [
      "95% recognition accuracy in ideal lighting; 90%+ in varied environments.",
      "Hand-tracking via OpenCV + Mediapipe, classification via CNN.",
      "Bonus modules: slide control, virtual whiteboard, mouse interaction."
    ],
    outcomes: [
      "95% recognition accuracy in ideal conditions.",
      "Modular architecture extends to new gestures without retraining base.",
      "Removes the keyboard/mouse barrier for accessible media control."
    ],
    stack: ["Python", "OpenCV", "Mediapipe", "PyAutoGUI", "CNN"],
    metric: "95% accuracy",
    github: "https://github.com/surya1321",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=70&auto=format&fit=crop",
    accent: "CV"
  },
  {
    id: "eda",
    title: "Exploratory Data Analysis Toolkit",
    category: "Data Analysis · Visualization",
    year: "2023",
    short: "Reusable EDA helpers for profiling, distributions, and report charts.",
    description:
      "In-depth EDA on large datasets — wrangling, statistical exploration, and visualization to surface trends and anomalies that drive decisions.",
    bullets: [
      "Data wrangling, cleaning, and feature inspection at scale.",
      "Statistical summaries and distribution analysis.",
      "Insight-rich visualizations using Matplotlib / Seaborn."
    ],
    outcomes: [
      "Reusable across multiple datasets — not a one-off notebook.",
      "Report-ready charts with consistent styling.",
      "Surfaces anomalies before they reach modeling stage."
    ],
    stack: ["Python", "Pandas", "Matplotlib", "Seaborn"],
    metric: "Insight-driven",
    github: "https://github.com/surya1321",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=70&auto=format&fit=crop",
    accent: "DATA"
  }
];

export const skills = {
  Languages: ["Python", "SQL", "C", "HTML", "CSS"],
  "Data & ML": ["Pandas", "NumPy", "Matplotlib", "Seaborn", "NLTK", "Stanza", "OpenCV", "Mediapipe", "CNN"],
  "ERP & Automation": ["ERP", "n8n", "Zoho RPA", "Workflow Automation", "KPI Dashboards"],
  Tools: ["Git", "GitHub", "VS Code", "Claude Code", "MS Excel", "Tkinter"]
};

export const education = [
  {
    id: "btech-sreyas",
    degree: "B.Tech, Computer Science",
    school: "Sreyas Institute of Engineering and Technology",
    location: "Hyderabad, India",
    period: "Nov 2021 — Jul 2025",
    notes:
      "Coursework spanning algorithms, databases, ML, software engineering, and applied computing — paired with hands-on internship and project work.",
    coursework: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Operating Systems",
      "Computer Networks",
      "Machine Learning",
      "Software Engineering",
      "Object-Oriented Programming",
      "Web Technologies"
    ]
  }
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "repos", label: "GitHub" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" }
];

export const mockRepos = [
  { id: 1, name: "aspect-sentiment-pipeline", description: "Aspect-based sentiment analysis with NLTK + Stanza and a Tkinter UI.", language: "Python", stargazers_count: 12, forks_count: 3, html_url: "https://github.com/surya1321", updated_at: "2025-04-12T10:00:00Z", topics: ["nlp", "sentiment", "python"] },
  { id: 2, name: "gesture-media-controller", description: "Hands-free media + slide controller using OpenCV, Mediapipe and a CNN.", language: "Python", stargazers_count: 24, forks_count: 6, html_url: "https://github.com/surya1321", updated_at: "2025-03-02T10:00:00Z", topics: ["computer-vision", "cnn", "automation"] },
  { id: 3, name: "eda-toolkit", description: "Reusable EDA helpers: profiling, distribution checks, and report-ready charts.", language: "Python", stargazers_count: 8, forks_count: 1, html_url: "https://github.com/surya1321", updated_at: "2025-02-18T10:00:00Z", topics: ["pandas", "eda", "visualization"] },
  { id: 4, name: "n8n-finops-recipes", description: "Battle-tested n8n flows for finance ops: reconciliation, alerts, and audit logging.", language: "JavaScript", stargazers_count: 5, forks_count: 0, html_url: "https://github.com/surya1321", updated_at: "2025-01-25T10:00:00Z", topics: ["automation", "n8n", "fintech"] },
  { id: 5, name: "exam-portal", description: "Internal exam portal — auth, question banks, scoring and admin dashboards.", language: "Python", stargazers_count: 4, forks_count: 1, html_url: "https://github.com/surya1321", updated_at: "2025-03-20T10:00:00Z", topics: ["fastapi", "portal", "internal-tools"] },
  { id: 6, name: "sql-playbook", description: "Pragmatic SQL patterns I keep reusing: window functions, audits and analytics.", language: "SQL", stargazers_count: 3, forks_count: 0, html_url: "https://github.com/surya1321", updated_at: "2024-12-10T10:00:00Z", topics: ["sql", "analytics"] }
];
