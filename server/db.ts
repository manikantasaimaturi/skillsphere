import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import {
  User,
  Course,
  CodingProblem,
  Question,
  CodeSubmission,
  QuizAttempt,
  CompanyPlacementInfo,
  AptitudeTopic,
  ResumeData,
  CareerRoadmap,
  ProjectIdea
} from './types.ts';
import { SEED_COURSES } from './data/coursesSeed.ts';
import { generateFullCodingProblemBank } from './data/codingProblemsSeed.ts';
import { generateFullMcqBank } from './data/mcqsSeed.ts';
import { SEED_COMPANIES, SEED_APTITUDE_TOPICS } from './data/companiesSeed.ts';
import { SEED_CAREER_ROADMAPS, SEED_PROJECT_IDEAS } from './data/roadmapsAndProjectsSeed.ts';

const DB_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

export interface DatabaseSchema {
  users: User[];
  courses: Course[];
  codingProblems: CodingProblem[];
  mcqQuestions: Question[];
  companies: CompanyPlacementInfo[];
  aptitudeTopics: AptitudeTopic[];
  careerRoadmaps: CareerRoadmap[];
  projectIdeas: ProjectIdea[];
  submissions: CodeSubmission[];
  quizAttempts: QuizAttempt[];
  resumes: ResumeData[];
  enrollments: {
    userId: string;
    courseId: string;
    completedTopicIds: string[];
    enrolledAt: string;
    lastAccessedAt: string;
  }[];
  studentProjects: {
    userId: string;
    projectId: string;
    status: 'Planned' | 'In Progress' | 'Completed';
    githubUrl?: string;
    notes?: string;
    updatedAt: string;
  }[];
  chatConversations: {
    id: string;
    userId: string;
    title: string;
    messages: {
      id: string;
      role: 'user' | 'model';
      content: string;
      timestamp: string;
    }[];
    createdAt: string;
    updatedAt: string;
  }[];
  skillAssessments: {
    userId: string;
    targetRole: string;
    scores: Record<string, number>;
    strongSkills: string[];
    weakSkills: string[];
    gapAnalysis: string;
    takenAt: string;
  }[];
}

let dbInstance: DatabaseSchema | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function initializeSeedData(): DatabaseSchema {
  console.log('[SkillSphere DB] Initializing fresh database with complete seed data...');
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('AdminPassword123!', salt);
  const studentPasswordHash = bcrypt.hashSync('StudentPassword123!', salt);

  const defaultAdmin: User = {
    id: 'user-admin-1',
    name: 'SkillSphere Administrator',
    email: 'admin@skillsphere.edu',
    passwordHash: adminPasswordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
    streakDays: 45,
    lastActiveDate: new Date().toISOString()
  };

  const defaultStudent: User = {
    id: 'user-student-1',
    name: 'Aarav Sharma',
    email: 'student@skillsphere.edu',
    passwordHash: studentPasswordHash,
    role: 'student',
    college: 'Delhi Technological University (DTU)',
    branch: 'Computer Science and Engineering',
    graduationYear: 2026,
    targetRole: 'Full Stack Software Engineer',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    streakDays: 14,
    lastActiveDate: new Date().toISOString()
  };

  const codingProblems = generateFullCodingProblemBank();
  const mcqQuestions = generateFullMcqBank();

  // Initial student enrollment
  const initialEnrollments = [
    {
      userId: defaultStudent.id,
      courseId: 'course-python',
      completedTopicIds: ['topic-py-execution-model', 'topic-py-variables-memory'],
      enrolledAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      lastAccessedAt: new Date().toISOString()
    },
    {
      userId: defaultStudent.id,
      courseId: 'course-dsa',
      completedTopicIds: ['topic-dsa-big-o', 'topic-dsa-singly-linked-list'],
      enrolledAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      lastAccessedAt: new Date().toISOString()
    },
    {
      userId: defaultStudent.id,
      courseId: 'course-dbms',
      completedTopicIds: ['topic-dbms-normalization'],
      enrolledAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      lastAccessedAt: new Date().toISOString()
    }
  ];

  const initialSubmissions: CodeSubmission[] = [
    {
      id: 'sub-1',
      userId: defaultStudent.id,
      problemId: 'prob-two-sum',
      code: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []`,
      language: 'python',
      status: 'Accepted',
      passedTestCases: 4,
      totalTestCases: 4,
      executionTimeMs: 42,
      submittedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'sub-2',
      userId: defaultStudent.id,
      problemId: 'prob-reverse-linked-list',
      code: `def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
      language: 'python',
      status: 'Accepted',
      passedTestCases: 4,
      totalTestCases: 4,
      executionTimeMs: 38,
      submittedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    }
  ];

  const initialQuizAttempts: QuizAttempt[] = [
    {
      id: 'quiz-1',
      userId: defaultStudent.id,
      subject: 'Python',
      totalQuestions: 10,
      score: 9,
      accuracy: 90,
      timeSpentSeconds: 240,
      answers: [],
      weakTopics: ['Generators and Coroutines'],
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'quiz-2',
      userId: defaultStudent.id,
      subject: 'DBMS',
      totalQuestions: 10,
      score: 8,
      accuracy: 80,
      timeSpentSeconds: 310,
      answers: [],
      weakTopics: ['Strict 2-Phase Locking', 'Multiversion Concurrency'],
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    }
  ];

  const initialResumes: ResumeData[] = [
    {
      id: 'resume-demo-1',
      userId: defaultStudent.id,
      title: 'Full Stack SDE Resume (ATS)',
      templateId: 'ats-clean',
      personalInfo: {
        fullName: 'Aarav Sharma',
        email: 'aarav.sharma@dtu.ac.in',
        phone: '+91 98765 43210',
        location: 'New Delhi, India',
        linkedin: 'https://linkedin.com/in/aarav-sharma-dev',
        github: 'https://github.com/aaravsharma'
      },
      summary: 'Computer Science and Engineering undergraduate with strong expertise in algorithms, React.js, Node.js, and relational database systems. Solved 300+ problems on competitive platforms; engineered full-stack web applications serving 2,000+ active campus users.',
      education: [
        {
          id: 'edu-1',
          degree: 'B.Tech in Computer Science and Engineering',
          institution: 'Delhi Technological University (DTU)',
          year: '2022 - 2026',
          score: 'CGPA: 8.92 / 10.0'
        },
        {
          id: 'edu-2',
          degree: 'Senior Secondary (Class XII CBSE)',
          institution: 'Delhi Public School, R.K. Puram',
          year: '2022',
          score: '96.4%'
        }
      ],
      skills: [
        { category: 'Programming Languages', items: 'C++, Python, JavaScript (ES6+), TypeScript, SQL, Java' },
        { category: 'Web & Backend', items: 'React.js, Node.js, Express.js, Tailwind CSS, REST APIs, HTML5/CSS3' },
        { category: 'Databases & Tools', items: 'PostgreSQL, MySQL, Redis, Git & GitHub, Docker, Postman, Linux' },
        { category: 'Core CS Fundamentals', items: 'Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks' }
      ],
      experience: [
        {
          id: 'exp-1',
          title: 'Software Engineering Intern',
          company: 'TechFlow Solutions',
          period: 'June 2025 - August 2025',
          description: 'Engineered RESTful microservices in Node.js and TypeScript, reducing API response times by 32%. Designed automated database indexing across PostgreSQL tables handling 50k+ daily transactions.'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'SkillSphere Learning & Live Code Execution Platform',
          technologies: 'React, TypeScript, Express, Docker, Monaco Editor, Tailwind CSS',
          link: 'https://github.com/aaravsharma/skillsphere',
          description: 'Architected an end-to-end learning platform with real-time multi-language sandboxed code execution and AI tutoring. Integrated custom compiler runner with automated test cases.'
        },
        {
          id: 'proj-2',
          title: 'Distributed URL Shortener with Redis Cache',
          technologies: 'Node.js, Express, Redis, PostgreSQL, Jest',
          link: 'https://github.com/aaravsharma/url-shortener',
          description: 'Built scalable URL shortener with Base62 encoding and token-bucket rate limiting. Achieved 94% cache hit ratio and sub-6ms latency under load testing.'
        }
      ],
      certifications: [
        'AWS Certified Cloud Practitioner',
        'Meta Front-End Developer Professional Certificate'
      ],
      achievements: [
        'Global Rank 412 in Google Kick Start 2025 Round D',
        'Solved 350+ algorithmic problems on LeetCode with 1850+ contest rating'
      ],
      updatedAt: new Date().toISOString()
    }
  ];

  return {
    users: [defaultAdmin, defaultStudent],
    courses: SEED_COURSES,
    codingProblems,
    mcqQuestions,
    companies: SEED_COMPANIES,
    aptitudeTopics: SEED_APTITUDE_TOPICS,
    careerRoadmaps: SEED_CAREER_ROADMAPS,
    projectIdeas: SEED_PROJECT_IDEAS,
    submissions: initialSubmissions,
    quizAttempts: initialQuizAttempts,
    resumes: initialResumes,
    enrollments: initialEnrollments,
    studentProjects: [
      {
        userId: defaultStudent.id,
        projectId: 'proj-compiler-platform',
        status: 'In Progress',
        githubUrl: 'https://github.com/aaravsharma/skillsphere',
        notes: 'Building the Monaco editor code execution and test runner.',
        updatedAt: new Date().toISOString()
      }
    ],
    chatConversations: [],
    skillAssessments: [
      {
        userId: defaultStudent.id,
        targetRole: 'Full Stack Software Engineer',
        scores: {
          'Programming': 90,
          'Data Structures & Algorithms': 85,
          'DBMS & SQL': 80,
          'Web Development': 88,
          'Computer Networks': 75,
          'Operating Systems': 72,
          'Quantitative Aptitude': 82,
          'Logical Reasoning': 86
        },
        strongSkills: ['Programming (Python/C++)', 'Web Development (React/Node)', 'Data Structures'],
        weakSkills: ['Operating Systems (Process Synchronization)', 'Computer Networks (Subnetting)'],
        gapAnalysis: 'Solid foundation for junior to mid-tier Full Stack developer roles. To crack Tier 1 product firms (Google, Amazon), strengthen Operating Systems memory models and practice DP on Trees.',
        takenAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
      }
    ]
  };
}

export function getDatabase(): DatabaseSchema {
  if (dbInstance) {
    return dbInstance;
  }

  ensureDataDirectory();

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbInstance = JSON.parse(raw);
      // Apply syllabus updates from the source seed without resetting user accounts,
      // enrollments, assessments, chat history, or other saved student data.
      const savedCourses = Array.isArray(dbInstance!.courses) ? dbInstance!.courses : [];
      const savedById = new Map(savedCourses.map(course => [course.id, course]));
      for (const seededCourse of SEED_COURSES) {
        const savedCourse = savedById.get(seededCourse.id);
        if (!savedCourse) {
          savedCourses.push(seededCourse);
          continue;
        }
        const savedTopicCount = (savedCourse.modules || []).reduce(
          (count, module) => count + (module.chapters || []).reduce((chapterCount, chapter) => chapterCount + (chapter.topics || []).length, 0), 0
        );
        const seededTopicCount = (seededCourse.modules || []).reduce(
          (count, module) => count + (module.chapters || []).reduce((chapterCount, chapter) => chapterCount + (chapter.topics || []).length, 0), 0
        );
        if (seededTopicCount > savedTopicCount) {
          Object.assign(savedCourse, seededCourse);
        }
      }
      dbInstance!.courses = savedCourses;
      saveDatabase();
      console.log(`[SkillSphere DB] Loaded database and synchronized ${savedCourses.length} course syllabi`);
      return dbInstance!;
    } catch (err) {
      console.error('[SkillSphere DB] Failed to parse existing database file. Re-initializing...', err);
    }
  }

  dbInstance = initializeSeedData();
  saveDatabase();
  return dbInstance;
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  ensureDataDirectory();
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(dbInstance, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[SkillSphere DB] Error saving database:', err);
  }
}
