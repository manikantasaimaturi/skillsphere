import { CareerRoadmap, ProjectIdea } from '../types.ts';

export const SEED_CAREER_ROADMAPS: CareerRoadmap[] = [
  {
    id: 'roadmap-fullstack',
    title: 'Full Stack Developer',
    category: 'Software Engineering',
    description: 'Master frontend interfaces, backend microservices, database schemas, and cloud deployment pipelines.',
    salaryRange: '₹6 LPA – ₹24 LPA',
    hiringCompanies: ['Amazon', 'Microsoft', 'Flipkart', 'Swiggy', 'PhonePe', 'Accenture', 'TCS'],
    stages: [
      {
        stage: 'Stage 1: Frontend Fundamentals',
        level: 'Beginner',
        topics: ['HTML5 Semantic Markup', 'CSS3 Flexbox & Grid', 'Modern JavaScript (ES6+)', 'DOM Manipulation', 'Git & GitHub'],
        recommendedCourses: ['HTML5 & Web Semantics', 'CSS3 & Modern Layouts', 'Modern JavaScript (ES6+)', 'Git & GitHub Version Control'],
        projects: ['Responsive Portfolio with Dark Mode', 'Interactive Task Management Dashboard'],
        interviewFocus: ['Closures, Event Loop, Flexbox vs Grid, Git Branching']
      },
      {
        stage: 'Stage 2: Modern Frontend & State',
        level: 'Intermediate',
        topics: ['React.js Architecture', 'Hooks & Custom Hooks', 'TypeScript Strict Mode', 'Tailwind CSS', 'Client State Management'],
        recommendedCourses: ['React.js & Modern Frontend', 'TypeScript for Production'],
        projects: ['E-Commerce Product Catalog with Filtering & Cart', 'Real-Time Markdown Notes App'],
        interviewFocus: ['Virtual DOM Reconciliation, React Fiber, Type Narrowing']
      },
      {
        stage: 'Stage 3: Backend & Persistence',
        level: 'Intermediate',
        topics: ['Node.js & Express.js', 'REST API Architecture', 'PostgreSQL / MySQL', 'Prisma ORM', 'JWT Authentication & Security'],
        recommendedCourses: ['Node.js Backend Architecture', 'Express.js Framework', 'REST API Design & Architecture', 'SQL & Database Queries'],
        projects: ['Full Stack Collaborative Task Workspace', 'Secure Banking & Wallet Transaction API'],
        interviewFocus: ['ACID Transactions, SQL Joins, JWT Expiry & Refresh Tokens']
      },
      {
        stage: 'Stage 4: Advanced Architecture & Deployment',
        level: 'Advanced',
        topics: ['Docker Containerization', 'Redis Caching', 'CI/CD Pipelines', 'System Design & Scalability', 'AWS / Cloud Run'],
        recommendedCourses: ['Full Stack Engineering', 'System Design & Distributed Systems', 'Cloud Computing Architecture'],
        projects: ['Distributed URL Shortener with Analytics & Rate Limiting', 'Real-time Collaborative Canvas'],
        interviewFocus: ['Horizontal Scaling, Cache Invalidation, CAP Theorem']
      }
    ]
  },
  {
    id: 'roadmap-sde',
    title: 'Software Development Engineer (SDE)',
    category: 'Computer Science Core',
    description: 'The premier path for high-tier tech placements at FAANG and top unicorn product firms.',
    salaryRange: '₹14 LPA – ₹45 LPA',
    hiringCompanies: ['Google', 'Amazon', 'Microsoft', 'Adobe', 'Uber', 'Atlassian', 'Goldman Sachs'],
    stages: [
      {
        stage: 'Stage 1: Core Language & Complexity',
        level: 'Beginner',
        topics: ['C++ / Java Deep Dive', 'Memory Pointers & Allocation', 'Big-O Asymptotic Complexity', 'Arrays & Strings'],
        recommendedCourses: ['C++ Programming & STL', 'Java Programming & JVM', 'Data Structures & Algorithms'],
        projects: ['Command-Line Memory Profiler', 'Custom Dynamic Array Library'],
        interviewFocus: ['Time/Space Complexity, Two Pointers, Sliding Window']
      },
      {
        stage: 'Stage 2: Core Data Structures & Recursion',
        level: 'Intermediate',
        topics: ['Linked Lists', 'Stacks & Queues', 'Binary Trees & BSTs', 'Recursion & Backtracking', 'Sorting Algorithms'],
        recommendedCourses: ['Data Structures & Algorithms', 'Design & Analysis of Algorithms'],
        projects: ['Sudoku Solver with Backtracking Visualization', 'File System Directory Tree Indexer'],
        interviewFocus: ['Tree Traversals, Stack Evaluation, QuickSort vs MergeSort']
      },
      {
        stage: 'Stage 3: Advanced DSA & Core CSE',
        level: 'Advanced',
        topics: ['Graphs (BFS, DFS, Dijkstra, MST)', 'Dynamic Programming', 'OS Process & Concurrency', 'DBMS Normalization & Indexes', 'Computer Networks'],
        recommendedCourses: ['Operating Systems', 'Database Management Systems (DBMS)', 'Computer Networks'],
        projects: ['Network Packet Sniffer & Visualizer', 'In-Memory Relational Query Engine'],
        interviewFocus: ['DP State Formulation, Graph Cycle Detection, 2-Phase Locking']
      },
      {
        stage: 'Stage 4: Low-Level & High-Level System Design',
        level: 'Advanced',
        topics: ['Object-Oriented Design (SOLID)', 'Design Patterns', 'Microservice Communication', 'Message Queues', 'Database Sharding'],
        recommendedCourses: ['Object-Oriented Programming (OOP)', 'System Design & Distributed Systems'],
        projects: ['Design an LRU Cache', 'Design a Scalable Distributed Chat Architecture'],
        interviewFocus: ['Factory / Observer Pattern, Load Balancers, Redis Pub/Sub']
      }
    ]
  },
  {
    id: 'roadmap-ai-ml',
    title: 'AI & Machine Learning Engineer',
    category: 'Advanced Technologies',
    description: 'Transform raw data into predictive algorithms, neural architectures, and intelligent LLM applications.',
    salaryRange: '₹10 LPA – ₹35 LPA',
    hiringCompanies: ['Google', 'Microsoft', 'NVIDIA', 'Amazon', 'Adobe', 'Fractal', 'Mu Sigma'],
    stages: [
      {
        stage: 'Stage 1: Python, Math & Data Manipulation',
        level: 'Beginner',
        topics: ['Python Data Stack', 'Linear Algebra & Matrices', 'Calculus & Optimization', 'NumPy & Pandas', 'Data Visualization'],
        recommendedCourses: ['Python Programming', 'Data Science & Analytics'],
        projects: ['Exploratory Data Analysis Dashboard for COVID-19 / Finance', 'Matrix Multiplication NumPy Engine'],
        interviewFocus: ['Vectorization, Gradient Descent Derivation, Data Cleaning']
      },
      {
        stage: 'Stage 2: Classical Machine Learning',
        level: 'Intermediate',
        topics: ['Supervised Learning (Regression, Trees, SVM)', 'Unsupervised Learning (K-Means, PCA)', 'Bias-Variance Tradeoff', 'Scikit-Learn'],
        recommendedCourses: ['Machine Learning', 'Artificial Intelligence'],
        projects: ['Housing Price Prediction with Regularization', 'Customer Segmentation with K-Means'],
        interviewFocus: ['Precision vs Recall, Overfitting Prevention, Random Forest Mechanics']
      },
      {
        stage: 'Stage 3: Deep Learning & Neural Networks',
        level: 'Advanced',
        topics: ['Backpropagation & Multi-Layer Perceptrons', 'CNNs for Computer Vision', 'RNNs & LSTMs', 'Transformers & Attention', 'PyTorch'],
        recommendedCourses: ['Deep Learning & Neural Networks'],
        projects: ['Chest X-Ray Pneumonia Classifier using CNNs', 'Transformer-based Sentiment Analyzer'],
        interviewFocus: ['Vanishing Gradients, Self-Attention Equation, Loss Functions']
      },
      {
        stage: 'Stage 4: LLMs, RAG & MLOps',
        level: 'Advanced',
        topics: ['Prompt Engineering & LLM APIs (Gemini)', 'Retrieval-Augmented Generation (RAG)', 'Vector Databases (Pinecone, Chroma)', 'Model Deployment & Docker'],
        recommendedCourses: ['Artificial Intelligence', 'Cloud Computing Architecture'],
        projects: ['Enterprise Document Q&A Assistant with Gemini & Vector Search', 'Autonomous Code Reviewer'],
        interviewFocus: ['Vector Embeddings, Chunking Strategies, Hallucination Mitigation']
      }
    ]
  },
  {
    id: 'roadmap-cybersecurity',
    title: 'Cybersecurity Engineer',
    category: 'Security & Infrastructure',
    description: 'Protect enterprise infrastructure, conduct penetration testing, and build zero-trust security postures.',
    salaryRange: '₹7 LPA – ₹28 LPA',
    hiringCompanies: ['Palo Alto Networks', 'CrowdStrike', 'Cisco', 'Deloitte', 'EY', 'IBM Security'],
    stages: [
      {
        stage: 'Stage 1: Networking & Linux Security',
        level: 'Beginner',
        topics: ['Linux Administration', 'TCP/IP Packet Inspection', 'Wireshark & Nmap', 'Firewalls & IPTables'],
        recommendedCourses: ['Computer Networks', 'Operating Systems'],
        projects: ['Automated Port Scanner in Python', 'Snort Intrusion Detection Rule Config'],
        interviewFocus: ['TCP Handshake SYN Floods, Subnetting, OSI Layers']
      },
      {
        stage: 'Stage 2: Cryptography & AppSec',
        level: 'Intermediate',
        topics: ['AES & RSA Cryptography', 'Hashing & Salt (SHA-256, bcrypt)', 'OWASP Top 10 Web Vulnerabilities', 'SQLi, XSS, CSRF Prevention'],
        recommendedCourses: ['Computer Security Fundamentals', 'Cybersecurity & Ethical Hacking'],
        projects: ['Vulnerable Web App Exploitation & Hardening Lab', 'Encrypted Secure Messaging CLI'],
        interviewFocus: ['Public Key Infrastructure, SQL Injection Mitigation, SameSite Cookies']
      }
    ]
  }
];

export const SEED_PROJECT_IDEAS: ProjectIdea[] = [
  {
    id: 'proj-compiler-platform',
    title: 'SkillSphere: Collaborative Online Code Execution & Learning Engine',
    category: 'Full Stack',
    difficulty: 'Advanced',
    description: 'A production-grade web application featuring sandboxed multi-language code compilation, automated test case grading, AI tutoring, and student progress tracking.',
    technologies: ['React.js', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'Monaco Editor', 'Google Gemini API', 'Docker/Piston API'],
    keyFeatures: [
      'Interactive multi-language code editor with syntax highlighting and auto-formatting',
      'Sandboxed remote code execution supporting C, C++, Java, Python, and SQL',
      'Automated grading against hidden and public test cases with timing metrics',
      'Context-aware AI tutor injecting student weak areas into model prompts',
      'Dynamic resume generation supporting 8 ATS-compliant templates'
    ],
    architectureOverview: 'Client-server architecture with React SPA frontend communicating over REST API to Express backend. Code execution dispatched to isolated containers via Piston API with strict resource limits and fallback to local sandbox.',
    databaseSchema: [
      'Users (id, name, email, password_hash, role, streak_days)',
      'Courses (id, title, category, description, total_topics)',
      'Submissions (id, user_id, problem_id, code, status, runtime_ms, created_at)',
      'QuizAttempts (id, user_id, subject, score, weak_topics)'
    ],
    learningOutcomes: [
      'Mastered full-stack TypeScript engineering across client and server boundaries',
      'Implemented secure sandboxed process execution preventing arbitrary code injection',
      'Engineered responsive, accessible glassmorphism UI with Tailwind CSS'
    ]
  },
  {
    id: 'proj-distributed-url-shortener',
    title: 'Scalable Distributed URL Shortener with Analytics & Caching',
    category: 'System Design',
    difficulty: 'Intermediate',
    description: 'A high-throughput URL shortening service (like TinyURL/Bitly) designed to handle 10,000 requests per second with sub-5ms redirection latency.',
    technologies: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'Docker', 'Jest'],
    keyFeatures: [
      'Base62 encoding with distributed Snowflake unique ID generation to prevent collisions',
      'LRU Redis caching achieving 95%+ cache hit ratio for hot URLs',
      'Rate limiting using Token Bucket algorithm preventing abuse',
      'Real-time analytics tracking clicks, geo-location, referrers, and device types'
    ],
    architectureOverview: 'Read-heavy architecture with Nginx reverse proxy load-balancing requests across stateless Node.js workers. Redis cache-aside layer buffers reads before querying partitioned PostgreSQL tables.',
    databaseSchema: [
      'Urls (short_key VARCHAR PRIMARY KEY, long_url TEXT, user_id INT, created_at TIMESTAMP, expires_at TIMESTAMP)',
      'ClickEvents (id BIGSERIAL, short_key VARCHAR, ip_address VARCHAR, user_agent TEXT, timestamp TIMESTAMP)'
    ],
    learningOutcomes: [
      'Implemented caching strategies (Cache-Aside, Write-Through)',
      'Calculated bandwidth, storage, and throughput capacity estimates',
      'Engineered distributed unique ID generation algorithms'
    ]
  },
  {
    id: 'proj-ai-resume-ats-analyzer',
    title: 'AI Resume Builder & ATS Matcher',
    category: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    description: 'An intelligent platform allowing job seekers to draft targeted resumes, compare text against job descriptions using vector embeddings, and generate PDF exports.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'jsPDF', 'Express', 'Gemini 3.8 Flash'],
    keyFeatures: [
      '8 distinct visual templates with instant live preview',
      'AI bullet-point rewriter utilizing the Google XYZ formula',
      'ATS keyword density scoring and missing skill identification',
      'Pixel-perfect client-side PDF export with A4 pagination'
    ],
    architectureOverview: 'Client provides real-time state editing with modular section reordering. Server communicates with Gemini API for semantic skill extraction and ATS matching.',
    databaseSchema: [
      'Resumes (id, user_id, template_id, title, content_json, updated_at)'
    ],
    learningOutcomes: [
      'Integrated LLM API prompts for structured text generation',
      'Managed dynamic React form state and DOM-to-PDF rendering',
      'Engineered accessible semantic templates'
    ]
  }
];
