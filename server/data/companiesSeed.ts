import { CompanyPlacementInfo, AptitudeTopic } from '../types.ts';

export const SEED_APTITUDE_TOPICS: AptitudeTopic[] = [
  {
    id: 'apt-time-work',
    category: 'Quantitative',
    title: 'Time and Work',
    shortDesc: 'Work equivalence, efficiency ratios, individual vs collective rates, and pipes & cisterns.',
    explanation: 'Work is inversely proportional to time taken. If a person completes a piece of work in D days, their rate of work per day is 1/D. If person A does work in A days and B in B days, together they complete 1/A + 1/B per day.',
    keyFormulas: [
      { name: 'Combined Work Rate', formula: '1/T_total = 1/T_A + 1/T_B = (A + B) / (A * B)', description: 'Total days required when A and B work concurrently = (A * B) / (A + B).' },
      { name: 'Men-Days Equivalence', formula: '(M1 * D1 * H1) / W1 = (M2 * D2 * H2) / W2', description: 'Equates manpower (M), days (D), hours/day (H), and units of work (W).' }
    ],
    shortcuts: [
      'LCM Method: Assume total work equals the LCM of individual day counts. Efficiency = Total Work / Days.',
      'If A is k times as efficient as B, A takes 1/k of the time B takes.'
    ],
    solvedExamples: [
      {
        problem: 'A can complete a task in 12 days and B can complete it in 18 days. Working together, in how many days will they finish the task?',
        solution: 'LCM of 12 and 18 = 36 units (Total Work).\nEfficiency of A = 36 / 12 = 3 units/day.\nEfficiency of B = 36 / 18 = 2 units/day.\nCombined efficiency = 3 + 2 = 5 units/day.\nTime taken = 36 / 5 = 7.2 days (or 7 1/5 days).',
        shortcutSolution: 'Direct formula: (12 * 18) / (12 + 18) = 216 / 30 = 7.2 days.'
      },
      {
        problem: '15 men can build a wall in 20 days working 8 hours a day. In how many days can 20 men build the same wall working 6 hours a day?',
        solution: 'Using (M1 * D1 * H1) / W1 = (M2 * D2 * H2) / W2:\n(15 * 20 * 8) / 1 = (20 * D2 * 6) / 1\n2400 = 120 * D2 => D2 = 2400 / 120 = 20 days.'
      }
    ],
    questions: [
      {
        id: 'q-apt-tw-1',
        type: 'mcq',
        question: 'Pipe A can fill a tank in 6 hours and Pipe B can empty it in 8 hours. If both pipes are opened together, how long will it take to fill the empty tank?',
        options: ['14 hours', '24 hours', '12 hours', '18 hours'],
        correctAnswer: 1,
        explanation: 'Net filling rate = 1/6 - 1/8 = (4 - 3)/24 = 1/24 tank per hour. Total time = 24 hours.',
        difficulty: 'Beginner'
      }
    ]
  },
  {
    id: 'apt-speed-distance',
    category: 'Quantitative',
    title: 'Speed, Time and Distance (Trains & Streams)',
    shortDesc: 'Relative velocity, average speed, train crossing platforms/poles, and upstream/downstream flow.',
    explanation: 'Distance = Speed * Time. When converting km/h to m/s, multiply by 5/18. For relative speed: when moving in opposite directions, speeds add (S1 + S2); when moving in same direction, speeds subtract (|S1 - S2|).',
    keyFormulas: [
      { name: 'Average Speed (Equal Distances)', formula: 'Avg Speed = (2 * S1 * S2) / (S1 + S2)', description: 'Harmonic mean of two speeds over equal distance legs.' },
      { name: 'Boats & Streams', formula: 'Downstream = U + V, Upstream = U - V', description: 'U = speed of boat in still water, V = stream velocity. U = (Downstream + Upstream)/2.' }
    ],
    shortcuts: [
      'To pass a telegraph pole, a train covers its own length.',
      'To pass a platform of length P, a train of length L covers (L + P).'
    ],
    solvedExamples: [
      {
        problem: 'A person travels from city A to B at 60 km/h and returns from B to A at 40 km/h. Find the average speed for the entire trip.',
        solution: 'Since distances are identical, Average Speed = (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h.'
      }
    ],
    questions: [
      {
        id: 'q-apt-std-1',
        type: 'mcq',
        question: 'A train 150m long moving at 72 km/h crosses a 250m long platform. What is the time taken?',
        options: ['15 seconds', '20 seconds', '25 seconds', '18 seconds'],
        correctAnswer: 1,
        explanation: 'Speed = 72 * (5/18) = 20 m/s. Total distance = 150 + 250 = 400m. Time = 400 / 20 = 20 seconds.',
        difficulty: 'Beginner'
      }
    ]
  },
  {
    id: 'apt-blood-relations',
    category: 'Logical',
    title: 'Blood Relations',
    shortDesc: 'Family tree mapping, generation levels, direct relations, and coded relationship puzzles.',
    explanation: 'Blood relations evaluate logical deduction using genealogical trees. Key conventions: represent generations vertically (grandparents top, grandchildren bottom), siblings horizontally with horizontal bonds, and married couples with double bonds.',
    keyFormulas: [
      { name: 'Family Tree Levels', formula: 'Gen +2 (Grandparents), Gen +1 (Parents/Uncles), Gen 0 (Self/Siblings/Spouse), Gen -1 (Children)', description: 'Standard hierarchy.' }
    ],
    shortcuts: [
      'Deconstruct coded statements from the innermost phrase (e.g. "my mother’s only son’s wife").',
      'Use symbols: + for male, - for female, = for spouse, - for sibling.'
    ],
    solvedExamples: [
      {
        problem: 'Pointing to a photograph, Rahul says, "She is the only daughter of my grandfather\'s only son." How is the woman related to Rahul?',
        solution: "Grandfather's only son = Rahul's father. The only daughter of Rahul's father = Rahul's sister. Hence, the woman is Rahul's sister."
      }
    ],
    questions: [
      {
        id: 'q-apt-br-1',
        type: 'mcq',
        question: 'If A is the brother of B; B is the sister of C; and C is the father of D, how is D related to A?',
        options: ['Brother', 'Nephew or Niece', 'Uncle', 'Father'],
        correctAnswer: 1,
        explanation: "A, B, and C are siblings. C is the father of D. Therefore, A is D's uncle, meaning D is A's nephew or niece (gender of D not specified).",
        difficulty: 'Beginner'
      }
    ]
  }
];

export const SEED_COMPANIES: CompanyPlacementInfo[] = [
  {
    id: 'comp-tcs',
    name: 'Tata Consultancy Services (TCS)',
    category: 'IT Services',
    logoText: 'TCS',
    badgeColor: 'blue',
    about: 'Tata Consultancy Services is a global leader in IT services, consulting, and business solutions, operating across 55 countries. Offers Ninja (3.6 LPA), Digital (7.5 LPA), and Prime (9-11 LPA) hiring cadres through TCS NQT.',
    eligibility: 'B.Tech/M.Tech (All engineering branches), minimum 60% or 6.0 CGPA throughout 10th, 12th, and graduation. Maximum 1 active backlog permitted at assessment.',
    selectionProcess: [
      { round: 1, name: 'TCS NQT Online Cognitive & Technical Test', details: 'Numerical Ability, Verbal, Reasoning, Advanced Quantitative, and 2 Hands-on Coding questions.', duration: '165 minutes' },
      { round: 2, name: 'Technical Interview', details: 'DSA, OOP, SQL, projects, and fundamentals of candidate branch.', duration: '30-45 minutes' },
      { round: 3, name: 'Managerial & HR Interview', details: 'Situational questions, adaptability, relocation willingness, and company values.', duration: '20-30 minutes' }
    ],
    assessmentPattern: [
      { section: 'Foundation: Numerical Ability', questions: 20, timeLimit: '25 mins' },
      { section: 'Foundation: Verbal Ability', questions: 25, timeLimit: '25 mins' },
      { section: 'Foundation: Reasoning Ability', questions: 20, timeLimit: '25 mins' },
      { section: 'Advanced Cognitive & Quantitative', questions: 15, timeLimit: '20 mins' },
      { section: 'Hands-on Coding (2 Questions)', questions: 2, timeLimit: '70 mins' }
    ],
    aptitudeTopics: ['Time and Work', 'Speed Distance Time', 'Permutations & Combinations', 'Data Interpretation', 'Syllogisms', 'Blood Relations'],
    codingTopics: ['Arrays and Strings', 'Number Theory', 'Hash Maps', 'Matrix Manipulation', 'Basic Dynamic Programming'],
    technicalTopics: ['OOP (Java/C++)', 'DBMS & SQL Joins', 'Computer Networks (OSI, TCP)', 'OS Process Synchronization', 'B.Tech Final Project Architecture'],
    hrTopics: ['Tell me about yourself', 'Why TCS?', 'How do you handle conflict in team projects?', 'Willingness to work night shifts and relocate'],
    previousYearQuestions: [
      {
        id: 'pyq-tcs-1',
        year: 2024,
        type: 'Previous-Year Question',
        section: 'Numerical Ability',
        question: 'A shopkeeper marks an article 30% above the cost price and allows a discount of 15% on the marked price. What is his profit percentage?',
        options: ['10.5%', '12%', '15%', '11.5%'],
        correctAnswer: 0,
        solution: 'Let CP = 100. Marked Price MP = 130. Discount = 15% of 130 = 19.5. Selling Price SP = 130 - 19.5 = 110.5. Profit = 110.5 - 100 = 10.5%.',
        source: 'TCS NQT 2024 Shift 1 Numerical Section'
      },
      {
        id: 'pyq-tcs-2',
        year: 2023,
        type: 'Practice Question',
        section: 'Hands-on Coding',
        question: 'Given an array of integers representing house values on a street, calculate the maximum amount of money you can rob without alerting the police (cannot rob adjacent houses).',
        options: ['O(N) Dynamic Programming: dp[i] = max(dp[i-1], dp[i-2] + nums[i])', 'Greedy: Pick all odd indices', 'Brute force all subsets in O(2^N)', 'Sorting in descending order'],
        correctAnswer: 0,
        solution: "Standard House Robber DP: Maintain two variables (prev1, prev2) recording max profit up to the previous two houses. Time complexity O(N), space O(1).",
        source: 'Modeled on TCS Digital Coding Track'
      }
    ],
    hrQuestionsWithFrameworks: [
      {
        question: 'Tell me about yourself and why you chose computer science.',
        framework: 'Present-Past-Future Model: 1. Present education & technical core strengths. 2. Past: Spark of interest and notable academic project built. 3. Future: Why this company matches your career aspirations.',
        sampleAnswer: 'I am a final-year Computer Science student at XYZ Institute with a passionate focus on full-stack web engineering and scalable databases. Recently, I built SkillSphere, an interactive learning platform that executes sandboxed code and delivers real-time AI mentoring. I chose CSE because I love turning abstract logic into impactful software that solves genuine user pain points. Joining TCS offers me the opportunity to deploy enterprise solutions on a global scale.',
        tips: ['Keep answer under 90 seconds', 'Do not simply re-read your resume', 'Highlight tangible results']
      },
      {
        question: 'Are you comfortable working in night shifts or relocating anywhere in India?',
        framework: 'Adaptability & Professional Commitment: Demonstrate genuine flexibility while reiterating enthusiasm for learning and project needs.',
        sampleAnswer: 'Yes, absolutely. At this stage in my career, learning, gaining diverse project exposure, and contributing to high-impact client deliveries are my highest priorities. I am completely open to relocating and adapting to global project time zones as required.',
        tips: ['Answer decisively without hesitation', 'Reiterate enthusiasm for team collaboration']
      }
    ]
  },
  {
    id: 'comp-infosys',
    name: 'Infosys',
    category: 'IT Services',
    logoText: 'INFY',
    badgeColor: 'blue',
    about: 'Infosys is a global leader in next-generation digital services and consulting. Hires through InfyTQ and campus drives for System Engineer (3.6 LPA), Digital Specialist Engineer (DSE, 6.25 LPA), and Specialist Programmer (SP, 9.5 LPA).',
    eligibility: 'B.Tech/M.Tech (CSE, IT, ECE, EEE, Mechanical), 60% or 6.0 CGPA throughout 10th, 12th, and college. Maximum 1 backlog allowed.',
    selectionProcess: [
      { round: 1, name: 'Online Assessment (Cognitive & Technical)', details: 'Reasoning Ability, Technical Ability, Verbal, and Pseudocode debugging.', duration: '100 minutes' },
      { round: 2, name: 'Technical & HR Combined Interview', details: 'Project deep-dive, OOP, SQL queries, and situational behavioral questions.', duration: '35 minutes' }
    ],
    assessmentPattern: [
      { section: 'Reasoning Ability', questions: 15, timeLimit: '25 mins' },
      { section: 'Technical Ability (Math/Quant)', questions: 10, timeLimit: '35 mins' },
      { section: 'Verbal Ability', questions: 20, timeLimit: '20 mins' },
      { section: 'Pseudocode & Algorithms', questions: 5, timeLimit: '10 mins' },
      { section: 'Numerical Puzzle Solving', questions: 4, timeLimit: '10 mins' }
    ],
    aptitudeTopics: ['Cryptarithmetic Puzzles', 'Data Sufficiency', 'Critical Reasoning', 'Probability & Combinatorics', 'Algebra'],
    codingTopics: ['Dynamic Programming', 'Graph Traversals (BFS/DFS)', 'Greedy Algorithms', 'Trees & BSTs'],
    technicalTopics: ['Java Collections Framework', 'Normalization and SQL Group By', 'Operating Systems Virtual Memory', 'REST API lifecycle'],
    hrTopics: ['Why Infosys?', 'Describe a time you failed and what you learned', 'Handling tight deadlines'],
    previousYearQuestions: [
      {
        id: 'pyq-infy-1',
        year: 2024,
        type: 'Previous-Year Question',
        section: 'Reasoning Ability',
        question: 'In a code language: "apple is fruit" is coded as "5 2 7", "fruit is sweet" is coded as "7 9 2". What code represents "sweet"?',
        options: ['5', '2', '7', '9'],
        correctAnswer: 3,
        solution: 'Common words in both sentences: "is" and "fruit" match common codes "2" and "7". Therefore, the remaining word in the second sentence "sweet" corresponds to "9".',
        source: 'Infosys Campus Assessment 2024 Slot 2'
      }
    ],
    hrQuestionsWithFrameworks: [
      {
        question: 'Describe a significant challenge you faced during an engineering project and how you resolved it.',
        framework: 'STAR Technique: Situation, Task, Action, Result.',
        sampleAnswer: 'Situation: During our semester group project, our team database suffered from deadlocks during concurrent user signups. Task: I was responsible for the database architecture and query pipeline. Action: I profiled the queries, isolated uncommitted transactions, implemented row-level locking with Redis distributed caching, and refactored the schemas to 3NF. Result: Deadlocks dropped to zero and registration latency improved by 40%.',
        tips: ['Focus heavily on your specific individual actions (Action phase)', 'Quantify results with percentages or metrics']
      }
    ]
  },
  {
    id: 'comp-amazon',
    name: 'Amazon',
    category: 'Product & Tech',
    logoText: 'AMZN',
    badgeColor: 'amber',
    about: 'Amazon is a multinational technology giant focusing on e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence. Hires Software Development Engineers (SDE-1) with 30-45 LPA compensation packages.',
    eligibility: 'B.Tech/M.Tech/MCA in Computer Science, IT, or related fields. Solid grounding in Data Structures, Algorithms, and Object-Oriented Design.',
    selectionProcess: [
      { round: 1, name: 'Online Coding Assessment (OA)', details: '2 DSA problems (Medium/Hard) + Amazon Work Style Simulation (Leadership Principles).', duration: '90-105 minutes' },
      { round: 2, name: 'Technical Interview 1: DSA', details: 'Binary Trees, Graphs, Dynamic Programming, Two Pointers.', duration: '60 minutes' },
      { round: 3, name: 'Technical Interview 2: DSA & OOD', details: 'Object-Oriented Design (e.g. Design a Parking Lot / File System) + DSA.', duration: '60 minutes' },
      { round: 4, name: 'Bar Raiser Round', details: 'Deep dive into 16 Amazon Leadership Principles + algorithmic problem solving.', duration: '60 minutes' }
    ],
    assessmentPattern: [
      { section: 'Coding Round: 2 DSA Problems', questions: 2, timeLimit: '70 mins' },
      { section: 'Work Simulation Assessment', questions: 15, timeLimit: '20 mins' },
      { section: 'Work Style Survey', questions: 40, timeLimit: '15 mins' }
    ],
    aptitudeTopics: ['Algorithmic Logic', 'Mathematical Induction', 'Combinatorics'],
    codingTopics: ['Topological Sort', 'Dijkstra Shortest Path', 'LRU Cache Design', 'Sliding Window', 'Trie', 'Dynamic Programming on Trees'],
    technicalTopics: ['Object-Oriented Design (Low Level Design)', 'System Scalability Fundamentals', 'Concurrency and Mutexes', 'Garbage Collection'],
    hrTopics: ['Customer Obsession', 'Ownership', 'Bias for Action', 'Dive Deep', 'Have Backbone; Disagree and Commit'],
    previousYearQuestions: [
      {
        id: 'pyq-amzn-1',
        year: 2024,
        type: 'Previous-Year Question',
        section: 'Coding Assessment',
        question: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) Cache, supporting get(key) and put(key, value) in O(1) time complexity.',
        options: [
          'Hash Map combined with a Doubly Linked List',
          'Single Array with binary search',
          'Min Heap with timestamp keys',
          'Balanced Binary Search Tree (AVL)'
        ],
        correctAnswer: 0,
        solution: 'A Hash Map provides O(1) key lookups to Doubly Linked List nodes. The Doubly Linked List maintains access order with O(1) node removals and insertions at the head.',
        source: 'Amazon SDE-1 OA 2024'
      }
    ],
    hrQuestionsWithFrameworks: [
      {
        question: 'Give me an example of a time you showed "Customer Obsession" in your technical work.',
        framework: 'Amazon Leadership Principle (Customer Obsession): Leaders start with the customer and work backwards. They work vigorously to earn and keep customer trust.',
        sampleAnswer: 'When building our department placement portal, initial feedback indicated that students with poor internet connections in rural areas had exam forms fail silently. Rather than blaming network limits, I worked backwards from the student experience. I implemented offline service workers with IndexedDB state caching and automatic background retries when connectivity restored. This eliminated lost submissions for over 300 students.',
        tips: ['Ground the story in customer empathy', 'Show proactive ownership rather than following instructions passively']
      }
    ]
  },
  {
    id: 'comp-google',
    name: 'Google',
    category: 'Product & Tech',
    logoText: 'GOOG',
    badgeColor: 'emerald',
    about: 'Google is a global technology pioneer in search, advertising, cloud, hardware, and artificial intelligence. Known for rigorous algorithmic interviews evaluating problem-solving speed, clean modular code, and Googleyness.',
    eligibility: 'B.Tech/M.Tech/PhD in Computer Science or related STEM disciplines. Excellent algorithmic problem-solving abilities.',
    selectionProcess: [
      { round: 1, name: 'Online Challenge (Google OA)', details: '2 algorithmic coding challenges on Google hiring platform.', duration: '60-90 minutes' },
      { round: 2, name: 'Technical Phone Screen', details: '1-on-1 coding interview in Google Docs / internal IDE.', duration: '45 minutes' },
      { round: 3, name: 'Onsite / Virtual Rounds (3-4 rounds)', details: 'Advanced algorithms, data structures, graph theory, and Googleyness & Leadership.', duration: '45 mins each' }
    ],
    assessmentPattern: [
      { section: 'Algorithmic Problem 1 (Medium/Hard)', questions: 1, timeLimit: '45 mins' },
      { section: 'Algorithmic Problem 2 (Hard)', questions: 1, timeLimit: '45 mins' }
    ],
    aptitudeTopics: ['Discrete Mathematics', 'Graph Theory', 'Probability & Expected Value'],
    codingTopics: ['Dynamic Programming with Bitmasking', 'Trie / Suffix Automata', 'Segment Trees & Fenwick Trees', 'Shortest Paths & Min Cut', 'Union Find'],
    technicalTopics: ['System Design Fundamentals', 'Memory Architecture', 'Distributed Systems Basics', 'Clean Code Engineering'],
    hrTopics: ['Googleyness', 'Navigating ambiguity', 'Collaborative decision making', 'Intellectual humility'],
    previousYearQuestions: [
      {
        id: 'pyq-goog-1',
        year: 2024,
        type: 'Previous-Year Question',
        section: 'Coding Round',
        question: 'Given an array of meeting time intervals consisting of start and end times [[s1,e1],[s2,e2],...], find the minimum number of conference rooms required.',
        options: [
          'Sort start times and end times separately, then use two pointers in O(N log N) time',
          'Sort by duration in O(N log N) time',
          'Brute force checking all pairs in O(N^2)',
          'Binary search on room count'
        ],
        correctAnswer: 0,
        solution: 'Chronological events method: sort starts and ends. Traverse start times; if start < end, increment active rooms; otherwise advance end pointer. Max concurrent rooms = answer.',
        source: 'Google SWE Campus Assessment 2024'
      }
    ],
    hrQuestionsWithFrameworks: [
      {
        question: 'Tell me about a time you had a strong disagreement with a peer or teammate on a technical decision. How did you resolve it?',
        framework: 'Googleyness & Intellectual Humility: 1. Respectful listening. 2. Data and benchmarks over personal opinions. 3. Collaborative outcome prioritizing project success.',
        sampleAnswer: 'During our hackathon project, my teammate favored using MongoDB for storing transactional payment logs, whereas I advocated for PostgreSQL with ACID guarantees. Instead of arguing, I scheduled a 30-minute whiteboard session where we mapped out our concurrency requirements and ran a simulated benchmark testing dirty reads under load. When the test clearly revealed inconsistent balances in the un-normalized setup, my teammate agreed PostgreSQL was the right choice. We remained close friends and won second prize.',
        tips: ['Never speak negatively about teammates', 'Show data-driven objectivity and intellectual humility']
      }
    ]
  }
];
