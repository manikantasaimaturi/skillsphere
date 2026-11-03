export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  college?: string;
  branch?: string;
  graduationYear?: number;
  avatarUrl?: string;
  createdAt: string;
  streakDays: number;
  lastActiveDate?: string;
  targetRole?: string;
}

export interface ExampleSnippet {
  title: string;
  code: string;
  language: string;
  explanation: string;
  output?: string;
}

export interface InterviewQnA {
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface LessonContent {
  topicId: string;
  introduction: string;
  definition: string;
  whyImportant: string;
  howItWorks: string;
  detailedExplanation: string;
  syntax?: string;
  examples: ExampleSnippet[];
  realWorldApplications: string[];
  commonErrors: string[];
  interviewQuestions: InterviewQnA[];
  practiceExercise: string;
  summary: string;
}

export interface Question {
  id: string;
  type: 'mcq' | 'true_false' | 'code_trace' | 'output_prediction';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topicId?: string;
  subject?: string;
}

export interface Topic {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isFoundational: boolean;
  content?: LessonContent;
  assessment?: Question[];
}

export interface Chapter {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  topics: Topic[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description: string;
  chapters: Chapter[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: 'Programming Languages' | 'Web Development' | 'Computer Science Core' | 'Advanced Technologies';
  shortDescription: string;
  longDescription: string;
  iconName: string;
  badgeColor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  prerequisites: string[];
  learningObjectives: string[];
  totalModulesCount: number;
  totalTopicsCount: number;
  completedTopicsCount?: number;
  completionPercentage?: number;
  modules?: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

export interface CodingTestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface CodingProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  tags: string[];
  companies: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: {
    cpp: string;
    python: string;
    java: string;
    javascript: string;
    c: string;
    typescript: string;
  };
  sampleTestCases: CodingTestCase[];
  hiddenTestCases: CodingTestCase[];
  hints: string[];
  solutionApproach: string;
  editorial: string;
}

export interface CodeSubmission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Runtime Error';
  passedTestCases: number;
  totalTestCases: number;
  executionTimeMs: number;
  memoryKb?: number;
  output?: string;
  error?: string;
  submittedAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  subject: string;
  totalQuestions: number;
  score: number;
  accuracy: number;
  timeSpentSeconds: number;
  answers: {
    questionId: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
  }[];
  weakTopics: string[];
  createdAt: string;
}

export interface AptitudeFormula {
  name: string;
  formula: string;
  description: string;
}

export interface AptitudeTopic {
  id: string;
  category: 'Quantitative' | 'Logical' | 'Verbal';
  title: string;
  shortDesc: string;
  explanation: string;
  keyFormulas: AptitudeFormula[];
  shortcuts: string[];
  solvedExamples: {
    problem: string;
    solution: string;
    shortcutSolution?: string;
  }[];
  questions: Question[];
}

export interface CompanyPlacementInfo {
  id: string;
  name: string;
  category: 'IT Services' | 'Product & Tech';
  logoText: string;
  badgeColor: string;
  about: string;
  eligibility: string;
  selectionProcess: {
    round: number;
    name: string;
    details: string;
    duration: string;
  }[];
  assessmentPattern: {
    section: string;
    questions: number;
    timeLimit: string;
  }[];
  aptitudeTopics: string[];
  codingTopics: string[];
  technicalTopics: string[];
  hrTopics: string[];
  previousYearQuestions: {
    id: string;
    year: number;
    type: 'Practice Question' | 'Previous-Year Question';
    section: string;
    question: string;
    options: string[];
    correctAnswer: number;
    solution: string;
    source: string;
  }[];
  hrQuestionsWithFrameworks: {
    question: string;
    framework: string;
    sampleAnswer: string;
    tips: string[];
  }[];
}

export interface ResumeData {
  id: string;
  userId: string;
  title: string;
  templateId: 'ats-clean' | 'modern-blue' | 'minimal-bw' | 'developer-dark' | 'fresher-prime' | 'technical-split' | 'executive-serif' | 'modern-two-col';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio?: string;
  };
  summary: string;
  education: {
    id: string;
    degree: string;
    institution: string;
    year: string;
    score: string;
  }[];
  skills: {
    category: string;
    items: string;
  }[];
  experience: {
    id: string;
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  projects: {
    id: string;
    title: string;
    technologies: string;
    link?: string;
    description: string;
  }[];
  certifications: string[];
  achievements: string[];
  updatedAt: string;
}

export interface CareerRoadmap {
  id: string;
  title: string;
  category: string;
  description: string;
  salaryRange: string;
  hiringCompanies: string[];
  stages: {
    stage: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    topics: string[];
    recommendedCourses: string[];
    projects: string[];
    interviewFocus: string[];
  }[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  technologies: string[];
  keyFeatures: string[];
  architectureOverview: string;
  databaseSchema: string[];
  learningOutcomes: string[];
}
