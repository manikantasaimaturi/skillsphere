import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDatabase, saveDatabase } from './server/db.ts';
import { executeCode } from './server/compiler.ts';
import { askAiMentor, improveResumeWithAi, getAiConfigurationStatus } from './server/ai.ts';
import { User, ResumeData, CodeSubmission, QuizAttempt } from './server/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillsphere-super-secret-jwt-key-2026';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Authentication Middleware ---
interface AuthenticatedRequest extends Request {
  user?: User;
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }
    const db = getDatabase();
    const user = db.users.find(u => u.id === decoded.userId);
    if (!user) {
      res.status(404).json({ error: 'User account not found' });
      return;
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin privileges required' });
    return;
  }
  next();
}

// Optional Auth (for public views that personalize if logged in)
function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const db = getDatabase();
      req.user = db.users.find(u => u.id === decoded.userId);
    } catch {
      // ignore
    }
  }
  next();
}

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, college, branch, graduationYear, targetRole } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const db = getDatabase();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'student', // Public registration creates ONLY student accounts
      college: college?.trim() || 'Engineering College',
      branch: branch?.trim() || 'Computer Science and Engineering',
      graduationYear: graduationYear ? Number(graduationYear) : 2026,
      targetRole: targetRole?.trim() || 'Full Stack Software Engineer',
      createdAt: new Date().toISOString(),
      streakDays: 1,
      lastActiveDate: new Date().toISOString()
    };

    db.users.push(newUser);

    // Auto-enroll in foundational Python and DSA
    db.enrollments.push(
      {
        userId: newUser.id,
        courseId: 'course-python',
        completedTopicIds: [],
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
      },
      {
        userId: newUser.id,
        courseId: 'course-dsa',
        completedTopicIds: [],
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
      }
    );

    saveDatabase();

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({ user: safeUser, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const db = getDatabase();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Update streak and lastActiveDate
    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.lastActiveDate ? user.lastActiveDate.split('T')[0] : '';
    if (lastActive !== today) {
      user.streakDays = (user.streakDays || 0) + 1;
      user.lastActiveDate = new Date().toISOString();
      saveDatabase();
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { passwordHash: _, ...safeUser } = req.user!;
  res.json({ user: safeUser });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({
    message: `If an account with ${email} exists, a password reset link and verification code have been dispatched.`
  });
});

// ==========================================
// 2. COURSES & LMS ROUTES
// ==========================================
app.get('/api/courses', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const userId = req.user?.id;

  const coursesWithProgress = db.courses.map(course => {
    let completedTopicsCount = 0;
    let isEnrolled = false;

    if (userId) {
      const enrollment = db.enrollments.find(e => e.userId === userId && e.courseId === course.id);
      if (enrollment) {
        isEnrolled = true;
        completedTopicsCount = enrollment.completedTopicIds.length;
      }
    }

    const totalTopics = course.totalTopicsCount || 20;
    const completionPercentage = isEnrolled ? Math.min(100, Math.round((completedTopicsCount / totalTopics) * 100)) : 0;

    return {
      ...course,
      isEnrolled,
      completedTopicsCount,
      completionPercentage
    };
  });

  res.json(coursesWithProgress);
});

app.get('/api/courses/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const course = db.courses.find(c => c.id === req.params.id || c.slug === req.params.id);

  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  let completedTopicIds: string[] = [];
  let isEnrolled = false;

  if (req.user) {
    const enrollment = db.enrollments.find(e => e.userId === req.user!.id && e.courseId === course.id);
    if (enrollment) {
      isEnrolled = true;
      completedTopicIds = enrollment.completedTopicIds;
    }
  }

  res.json({
    ...course,
    isEnrolled,
    completedTopicIds
  });
});

app.post('/api/courses/:id/enroll', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  let enrollment = db.enrollments.find(e => e.userId === req.user!.id && e.courseId === course.id);
  if (!enrollment) {
    enrollment = {
      userId: req.user!.id,
      courseId: course.id,
      completedTopicIds: [],
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };
    db.enrollments.push(enrollment);
    saveDatabase();
  }

  res.json({ message: 'Successfully enrolled', enrollment });
});

app.get('/api/topics/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const topicId = req.params.id;

  for (const course of db.courses) {
    if (course.modules) {
      for (const mod of course.modules) {
        for (const chap of mod.chapters) {
          const topic = chap.topics.find(t => t.id === topicId);
          if (topic) {
            let isCompleted = false;
            if (req.user) {
              const enrollment = db.enrollments.find(e => e.userId === req.user!.id && e.courseId === course.id);
              if (enrollment && enrollment.completedTopicIds.includes(topicId)) {
                isCompleted = true;
              }
            }
            res.json({
              ...topic,
              courseId: course.id,
              courseTitle: course.title,
              isCompleted
            });
            return;
          }
        }
      }
    }
  }

  res.status(404).json({ error: 'Topic not found' });
});

app.post('/api/topics/:id/complete', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const topicId = req.params.id;
  const userId = req.user!.id;

  // Find which course owns this topic
  let targetCourseId = '';
  for (const course of db.courses) {
    if (course.modules) {
      for (const mod of course.modules) {
        for (const chap of mod.chapters) {
          if (chap.topics.some(t => t.id === topicId)) {
            targetCourseId = course.id;
            break;
          }
        }
      }
    }
  }

  if (!targetCourseId) {
    res.status(404).json({ error: 'Topic course not found' });
    return;
  }

  let enrollment = db.enrollments.find(e => e.userId === userId && e.courseId === targetCourseId);
  if (!enrollment) {
    enrollment = {
      userId,
      courseId: targetCourseId,
      completedTopicIds: [topicId],
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };
    db.enrollments.push(enrollment);
  } else {
    if (!enrollment.completedTopicIds.includes(topicId)) {
      enrollment.completedTopicIds.push(topicId);
    }
    enrollment.lastAccessedAt = new Date().toISOString();
  }

  saveDatabase();
  res.json({ success: true, completedTopicIds: enrollment.completedTopicIds });
});

app.post('/api/assessments/:id/submit', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const topicId = req.params.id;
  const { answers } = req.body; // array of { questionId, selectedOption }

  // Find topic
  let targetTopic = null;
  for (const course of db.courses) {
    if (course.modules) {
      for (const mod of course.modules) {
        for (const chap of mod.chapters) {
          const t = chap.topics.find(top => top.id === topicId);
          if (t) {
            targetTopic = t;
            break;
          }
        }
      }
    }
  }

  if (!targetTopic || !targetTopic.assessment) {
    res.status(404).json({ error: 'Assessment questions not found for this topic' });
    return;
  }

  const assessmentQuestions = targetTopic.assessment;
  let correctCount = 0;
  const detailedResults = assessmentQuestions.map(q => {
    const submission = answers?.find((a: any) => a.questionId === q.id);
    const selected = submission !== undefined ? submission.selectedOption : -1;
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      question: q.question,
      options: q.options,
      selectedOption: selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation
    };
  });

  const scorePercentage = Math.round((correctCount / assessmentQuestions.length) * 100);
  const passed = scorePercentage >= 60;

  // If passed, auto-complete topic
  if (passed) {
    let enrollment = db.enrollments.find(e => e.userId === req.user!.id && e.courseId === targetTopic.courseId);
    if (enrollment && !enrollment.completedTopicIds.includes(topicId)) {
      enrollment.completedTopicIds.push(topicId);
      saveDatabase();
    }
  }

  res.json({
    totalQuestions: assessmentQuestions.length,
    correctCount,
    scorePercentage,
    passed,
    results: detailedResults
  });
});

// ==========================================
// 3. CODING PRACTICE & LIVE COMPILER
// ==========================================
app.get('/api/coding/problems', (req: Request, res: Response) => {
  const db = getDatabase();
  const { topic, difficulty, company, search } = req.query;

  let filtered = [...db.codingProblems];

  if (topic && topic !== 'All') {
    filtered = filtered.filter(p => p.topic.toLowerCase() === String(topic).toLowerCase());
  }

  if (difficulty && difficulty !== 'All') {
    filtered = filtered.filter(p => p.difficulty.toLowerCase() === String(difficulty).toLowerCase());
  }

  if (company && company !== 'All') {
    filtered = filtered.filter(p => p.companies.some(c => c.toLowerCase() === String(company).toLowerCase()));
  }

  if (search) {
    const term = String(search).toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(term) || p.tags.some(t => t.toLowerCase().includes(term)));
  }

  // Return problem cards without hidden test cases
  const sanitized = filtered.map(({ hiddenTestCases: _, starterCode: __, ...rest }) => rest);
  res.json(sanitized);
});

app.get('/api/coding/problems/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const problem = db.codingProblems.find(p => p.id === req.params.id || p.slug === req.params.id);

  if (!problem) {
    res.status(404).json({ error: 'Coding problem not found' });
    return;
  }

  // Do not expose hidden test cases to client
  const { hiddenTestCases: _, ...clientProblem } = problem;
  res.json(clientProblem);
});

// Run Code against custom input
app.post('/api/coding/run', async (req: Request, res: Response) => {
  try {
    const { language, code, stdin } = req.body;
    if (!code || !language) {
      res.status(400).json({ error: 'Code and language are required' });
      return;
    }

    const result = await executeCode({ language, code, stdin });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Code against test cases
app.post('/api/coding/submit', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { problemId, language, code } = req.body;
    const db = getDatabase();
    const problem = db.codingProblems.find(p => p.id === problemId || p.slug === problemId);

    if (!problem) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }

    // Combine sample test cases and hidden test cases
    const allTestCases = [
      ...problem.sampleTestCases.map(tc => ({ ...tc, isHidden: false })),
      ...problem.hiddenTestCases.map(tc => ({ ...tc, isHidden: true }))
    ];

    const execution = await executeCode({
      language,
      code,
      testCases: allTestCases
    });

    const passedCount = execution.testCaseResults?.filter(tc => tc.passed).length || 0;
    const totalCount = allTestCases.length;
    const isAccepted = execution.allPassed && passedCount === totalCount;

    let status: CodeSubmission['status'] = 'Wrong Answer';
    if (execution.compileError || (execution.exitCode !== 0 && !execution.testCaseResults)) {
      status = 'Compilation Error';
    } else if (isAccepted) {
      status = 'Accepted';
    }

    const submission: CodeSubmission = {
      id: `sub-${Date.now()}`,
      userId: req.user!.id,
      problemId: problem.id,
      code,
      language,
      status,
      passedTestCases: passedCount,
      totalTestCases: totalCount,
      executionTimeMs: execution.executionTimeMs,
      output: execution.output,
      submittedAt: new Date().toISOString()
    };

    db.submissions.unshift(submission);
    saveDatabase();

    res.json({
      submission,
      testCaseResults: execution.testCaseResults,
      allPassed: isAccepted
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/coding/submissions', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const userSubs = db.submissions.filter(s => s.userId === req.user!.id);
  res.json(userSubs);
});

// ==========================================
// 4. ASSESSMENTS & MCQ QUIZ ENGINE
// ==========================================
app.get('/api/assessments/mcqs', (req: Request, res: Response) => {
  const db = getDatabase();
  const { subject, difficulty, limit = 50 } = req.query;

  let questions = [...db.mcqQuestions];
  if (subject && subject !== 'All') {
    questions = questions.filter(q => q.subject?.toLowerCase() === String(subject).toLowerCase());
  }
  if (difficulty && difficulty !== 'All') {
    questions = questions.filter(q => q.difficulty.toLowerCase() === String(difficulty).toLowerCase());
  }

  res.json(questions.slice(0, Number(limit)));
});

app.post('/api/assessments/generate-quiz', (req: Request, res: Response) => {
  const db = getDatabase();
  const { subject, count = 10, difficulty } = req.body;

  let pool = [...db.mcqQuestions];
  if (subject && subject !== 'All') {
    pool = pool.filter(q => q.subject?.toLowerCase() === subject.toLowerCase());
  }
  if (difficulty && difficulty !== 'All') {
    pool = pool.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  // Shuffle pool
  pool.sort(() => Math.random() - 0.5);
  const selected = pool.slice(0, Number(count));

  // Hide correct answer during active test mode
  const sanitized = selected.map(({ correctAnswer: _, explanation: __, ...q }) => q);
  res.json({
    quizId: `quiz-${Date.now()}`,
    subject: subject || 'Full Mock Assessment',
    count: sanitized.length,
    questions: sanitized
  });
});

app.post('/api/assessments/submit-quiz', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const { subject, userAnswers, timeSpentSeconds } = req.body;
  // userAnswers: array of { questionId, selectedOption }

  let score = 0;
  const weakTopicsSet = new Set<string>();

  const results = (userAnswers || []).map((ans: any) => {
    const q = db.mcqQuestions.find(item => item.id === ans.questionId);
    if (!q) return null;
    const isCorrect = ans.selectedOption === q.correctAnswer;
    if (isCorrect) {
      score++;
    } else {
      weakTopicsSet.add(q.subject || 'General');
    }
    return {
      questionId: q.id,
      question: q.question,
      options: q.options,
      selectedOption: ans.selectedOption,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      subject: q.subject
    };
  }).filter(Boolean);

  const total = results.length || 1;
  const accuracy = Math.round((score / total) * 100);

  const attempt: QuizAttempt = {
    id: `qa-${Date.now()}`,
    userId: req.user!.id,
    subject: subject || 'Mixed Assessment',
    totalQuestions: total,
    score,
    accuracy,
    timeSpentSeconds: timeSpentSeconds || 180,
    answers: results.map((r: any) => ({
      questionId: r.questionId,
      selectedOption: r.selectedOption,
      correctOption: r.correctAnswer,
      isCorrect: r.isCorrect
    })),
    weakTopics: Array.from(weakTopicsSet),
    createdAt: new Date().toISOString()
  };

  db.quizAttempts.unshift(attempt);
  saveDatabase();

  res.json({
    attempt,
    results
  });
});

app.get('/api/assessments/history', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const userAttempts = db.quizAttempts.filter(q => q.userId === req.user!.id);
  res.json(userAttempts);
});

// ==========================================
// 5. AI MENTOR ROUTES
// ==========================================
app.get('/api/ai/status', (_req: Request, res: Response) => {
  res.json(getAiConfigurationStatus());
});

app.post('/api/ai/chat', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { prompt, conversationId } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const db = getDatabase();
    const userId = req.user!.id;

    // Retrieve or create conversation
    let conv = db.chatConversations.find(c => c.id === conversationId && c.userId === userId);
    if (!conv) {
      conv = {
        id: conversationId || `conv-${Date.now()}`,
        userId,
        title: prompt.slice(0, 45) + (prompt.length > 45 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.chatConversations.unshift(conv);
    }

    // Append user message
    conv.messages.push({
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString()
    });

    // Student personalized context
    const studentAttempts = db.quizAttempts.filter(q => q.userId === userId);
    const weakSubjects = Array.from(new Set(studentAttempts.flatMap(q => q.weakTopics)));
    const solvedCount = db.submissions.filter(s => s.userId === userId && s.status === 'Accepted').length;

    const studentContext = {
      studentName: req.user!.name,
      college: req.user!.college,
      branch: req.user!.branch,
      targetRole: req.user!.targetRole,
      weakSubjects,
      solvedProblemsCount: solvedCount
    };

    const historyForAi = conv.messages.map(m => ({ role: m.role, content: m.content }));
    const aiReply = await askAiMentor(prompt, historyForAi, studentContext);

    conv.messages.push({
      id: `msg-${Date.now()}-m`,
      role: 'model',
      content: aiReply,
      timestamp: new Date().toISOString()
    });
    conv.updatedAt = new Date().toISOString();

    saveDatabase();
    res.json({ reply: aiReply, conversationId: conv.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ai/conversations', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const convs = db.chatConversations.filter(c => c.userId === req.user!.id);
  res.json(convs);
});

app.get('/api/ai/conversations/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const conv = db.chatConversations.find(c => c.id === req.params.id && c.userId === req.user!.id);
  if (!conv) {
    res.status(404).json({ error: 'Conversation not found' });
    return;
  }
  res.json(conv);
});

// ==========================================
// 6. PLACEMENT PREPARATION
// ==========================================
app.get('/api/companies', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.companies);
});

app.get('/api/companies/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const company = db.companies.find(c => c.id === req.params.id);
  if (!company) {
    res.status(404).json({ error: 'Company profile not found' });
    return;
  }
  res.json(company);
});

app.get('/api/placement/aptitude', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.aptitudeTopics);
});

// ==========================================
// 7. RESUME BUILDER
// ==========================================
app.get('/api/resumes', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const userResumes = db.resumes.filter(r => r.userId === req.user!.id);
  res.json(userResumes);
});

app.post('/api/resumes', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const data = req.body;
  const newResume: ResumeData = {
    id: `resume-${Date.now()}`,
    userId: req.user!.id,
    title: data.title || 'Untitled Resume',
    templateId: data.templateId || 'ats-clean',
    personalInfo: data.personalInfo || {
      fullName: req.user!.name,
      email: req.user!.email,
      phone: '+91 98765 43210',
      location: 'India',
      linkedin: '',
      github: ''
    },
    summary: data.summary || 'Proactive Computer Science student with a strong passion for software engineering and problem solving.',
    education: data.education || [
      {
        id: 'edu-1',
        degree: `B.Tech in ${req.user!.branch || 'CSE'}`,
        institution: req.user!.college || 'Engineering College',
        year: `${req.user!.graduationYear ? req.user!.graduationYear - 4 : 2022} - ${req.user!.graduationYear || 2026}`,
        score: 'CGPA: 8.5 / 10.0'
      }
    ],
    skills: data.skills || [
      { category: 'Programming Languages', items: 'Python, C++, JavaScript, SQL' },
      { category: 'Web Technologies', items: 'React, Node.js, Express, HTML/CSS' }
    ],
    experience: data.experience || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    achievements: data.achievements || [],
    updatedAt: new Date().toISOString()
  };

  db.resumes.unshift(newResume);
  saveDatabase();
  res.status(201).json(newResume);
});

app.get('/api/resumes/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const resume = db.resumes.find(r => r.id === req.params.id && r.userId === req.user!.id);
  if (!resume) {
    res.status(404).json({ error: 'Resume not found' });
    return;
  }
  res.json(resume);
});

app.put('/api/resumes/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const idx = db.resumes.findIndex(r => r.id === req.params.id && r.userId === req.user!.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Resume not found' });
    return;
  }

  db.resumes[idx] = {
    ...db.resumes[idx],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  saveDatabase();
  res.json(db.resumes[idx]);
});

app.delete('/api/resumes/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  db.resumes = db.resumes.filter(r => !(r.id === req.params.id && r.userId === req.user!.id));
  saveDatabase();
  res.json({ success: true });
});

app.post('/api/resumes/ai-enhance', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { section, content, targetRole } = req.body;
    const improved = await improveResumeWithAi(section, content, targetRole || req.user?.targetRole);
    res.json({ improvedText: improved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. SKILL ASSESSMENT, ROADMAPS & PROJECTS
// ==========================================
app.get('/api/skills/assessment', (_req: Request, res: Response) => {
  const questions = [
    { id: 'sa-1', domain: 'Programming', question: 'What is the consequence of memory fragmentation in dynamic heap allocation?', options: ['Virtual addresses become exhausted', 'Sufficient total free memory exists but cannot satisfy a contiguous allocation request', 'CPU registers slow down', 'Stack pointer underflow'], answer: 1 },
    { id: 'sa-2', domain: 'Data Structures', question: 'Which data structure guarantees O(1) average lookup and O(1) worst-case with perfect hashing?', options: ['Binary Search Tree', 'Hash Table', 'B+ Tree', 'Fibonacci Heap'], answer: 1 },
    { id: 'sa-3', domain: 'DBMS & SQL', question: 'Which index type is best suited for range queries like `WHERE age BETWEEN 20 AND 30`?', options: ['Hash Index', 'B+ Tree Index', 'Bitmap Index', 'GiST Index'], answer: 1 },
    { id: 'sa-4', domain: 'Operating Systems', question: 'What is thrashing in virtual memory?', options: ['High CPU utilization running user code', 'System spending more time paging in and out than executing real instructions', 'Deadlock among 3+ processes', 'Buffer overflow in kernel stack'], answer: 1 },
    { id: 'sa-5', domain: 'Computer Networks', question: 'What is the function of the TCP Window Size field in the TCP header?', options: ['Designates encryption protocol', 'Flow control: advertises how many bytes receiver buffer can accept without ACK', 'Congestion window multiplier', 'Port multiplexer'], answer: 1 },
    { id: 'sa-6', domain: 'Web Development', question: 'What problem does the Virtual DOM in React primarily solve?', options: ['Bypasses browser JavaScript engine', 'Minimizes expensive direct DOM layout recalculations and repaints via batch diffing', 'Encodes HTML securely', 'Enables server side rendering only'], answer: 1 }
  ];
  res.json(questions);
});

app.post('/api/skills/submit', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const { domainScores, targetRole } = req.body;
  // domainScores: Record<string, number>

  const scores = domainScores || {
    'Programming': 85,
    'Data Structures & Algorithms': 80,
    'DBMS & SQL': 75,
    'Web Development': 88,
    'Computer Networks': 70,
    'Operating Systems': 68,
    'Quantitative Aptitude': 80
  };

  const strongSkills: string[] = [];
  const weakSkills: string[] = [];

  Object.entries(scores).forEach(([domain, score]) => {
    if ((score as number) >= 75) strongSkills.push(domain);
    else weakSkills.push(domain);
  });

  const gapAnalysis = `For your target role "${targetRole || 'Full Stack Software Engineer'}", your skills in ${strongSkills.join(', ')} are strong! Focus on boosting ${weakSkills.join(', ')} by solving targeted topic quizzes and coding challenges in SkillSphere.`;

  const record = {
    userId: req.user!.id,
    targetRole: targetRole || 'Full Stack Software Engineer',
    scores,
    strongSkills,
    weakSkills,
    gapAnalysis,
    takenAt: new Date().toISOString()
  };

  db.skillAssessments.unshift(record);
  saveDatabase();

  res.json(record);
});

app.get('/api/roadmaps', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.careerRoadmaps);
});

app.get('/api/projects', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.projectIdeas);
});

app.get('/api/projects/my-projects', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const studentProjs = db.studentProjects.filter(p => p.userId === req.user!.id);
  res.json(studentProjs);
});

app.post('/api/projects/track', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const { projectId, status, githubUrl, notes } = req.body;
  const userId = req.user!.id;

  let existing = db.studentProjects.find(p => p.userId === userId && p.projectId === projectId);
  if (!existing) {
    existing = {
      userId,
      projectId,
      status: status || 'In Progress',
      githubUrl,
      notes,
      updatedAt: new Date().toISOString()
    };
    db.studentProjects.push(existing);
  } else {
    if (status) existing.status = status;
    if (githubUrl !== undefined) existing.githubUrl = githubUrl;
    if (notes !== undefined) existing.notes = notes;
    existing.updatedAt = new Date().toISOString();
  }

  saveDatabase();
  res.json(existing);
});

// ==========================================
// 9. STUDENT DASHBOARD
// ==========================================
app.get('/api/student/dashboard', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const userId = req.user!.id;

  const enrollments = db.enrollments.filter(e => e.userId === userId);
  const enrolledCourses = enrollments.map(e => {
    const c = db.courses.find(course => course.id === e.courseId);
    const totalTopics = c?.totalTopicsCount || 20;
    const completed = e.completedTopicIds.length;
    return {
      ...c,
      completedTopicsCount: completed,
      completionPercentage: Math.min(100, Math.round((completed / totalTopics) * 100)),
      lastAccessedAt: e.lastAccessedAt
    };
  });

  const totalTopicsCompleted = enrollments.reduce((acc, e) => acc + e.completedTopicIds.length, 0);
  const completedCoursesCount = enrolledCourses.filter(c => c.completionPercentage === 100).length;
  const inProgressCoursesCount = enrolledCourses.filter(c => c.completionPercentage > 0 && c.completionPercentage < 100).length;

  const userSubmissions = db.submissions.filter(s => s.userId === userId);
  const solvedProblemIds = new Set(userSubmissions.filter(s => s.status === 'Accepted').map(s => s.problemId));
  const codingProblemsSolved = solvedProblemIds.size;

  const userQuizAttempts = db.quizAttempts.filter(q => q.userId === userId);
  const avgQuizScore = userQuizAttempts.length > 0
    ? Math.round(userQuizAttempts.reduce((acc, q) => acc + q.accuracy, 0) / userQuizAttempts.length)
    : 85;

  const weakSubjects = Array.from(new Set(userQuizAttempts.flatMap(q => q.weakTopics)));
  const latestSkillAssessment = db.skillAssessments.find(s => s.userId === userId);

  // Recommended courses based on weak subjects or uncompleted courses
  const recommendedCourses = db.courses
    .filter(c => !enrollments.some(e => e.courseId === c.id))
    .slice(0, 3);

  // Recommended coding questions
  const recommendedProblems = db.codingProblems
    .filter(p => !solvedProblemIds.has(p.id))
    .slice(0, 4);

  // Weekly learning activity graph data
  const activityData = [
    { day: 'Mon', problems: 2, quizzes: 1, topics: 3 },
    { day: 'Tue', problems: 3, quizzes: 2, topics: 4 },
    { day: 'Wed', problems: 1, quizzes: 0, topics: 2 },
    { day: 'Thu', problems: 4, quizzes: 1, topics: 5 },
    { day: 'Fri', problems: 2, quizzes: 2, topics: 3 },
    { day: 'Sat', problems: 5, quizzes: 3, topics: 6 },
    { day: 'Sun', problems: 3, quizzes: 1, topics: 4 }
  ];

  res.json({
    student: req.user,
    streakDays: req.user!.streakDays || 14,
    enrolledCoursesCount: enrolledCourses.length,
    completedCoursesCount,
    inProgressCoursesCount,
    totalTopicsCompleted,
    codingProblemsSolved,
    codingSubmissionsTotal: userSubmissions.length,
    avgQuizScore,
    enrolledCourses,
    weakSubjects: weakSubjects.length > 0 ? weakSubjects : ['Operating Systems (Deadlocks)', 'Dynamic Programming'],
    latestSkillAssessment,
    recommendedCourses,
    recommendedProblems,
    activityData,
    careerReadiness: Math.min(95, Math.max(35, Math.round((codingProblemsSolved * 1.5) + (avgQuizScore * 0.4) + (totalTopicsCompleted * 2))))
  });
});

app.put('/api/student/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const user = db.users.find(u => u.id === req.user!.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { name, college, branch, graduationYear, targetRole } = req.body;
  if (name) user.name = name.trim();
  if (college) user.college = college.trim();
  if (branch) user.branch = branch.trim();
  if (graduationYear) user.graduationYear = Number(graduationYear);
  if (targetRole) user.targetRole = targetRole.trim();

  saveDatabase();
  const { passwordHash: _, ...safeUser } = user;
  res.json(safeUser);
});

// ==========================================
// 10. ADMIN DASHBOARD & CMS
// ==========================================
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  const db = getDatabase();

  const totalStudents = db.users.filter(u => u.role === 'student').length;
  const activeStudents = totalStudents; // All registered demo students are active
  const totalCourses = db.courses.length;
  let totalTopics = 0;
  let totalCompletedTopicsInSystem = 0;

  db.courses.forEach(c => {
    totalTopics += c.totalTopicsCount || 0;
    if (c.modules) {
      c.modules.forEach(m => {
        m.chapters.forEach(ch => {
          totalCompletedTopicsInSystem += ch.topics.length;
        });
      });
    }
  });

  const totalCodingProblems = db.codingProblems.length;
  const totalMcqs = db.mcqQuestions.length;
  const totalSubmissions = db.submissions.length;
  const totalQuizAttempts = db.quizAttempts.length;

  res.json({
    metrics: {
      totalStudents,
      activeStudents,
      totalCourses,
      totalTopics,
      totalCompletedTopicsInSystem,
      totalCodingProblems,
      totalMcqs,
      totalSubmissions,
      totalQuizAttempts,
      totalCompanies: db.companies.length
    },
    students: db.users.filter(u => u.role === 'student').map(({ passwordHash: _, ...u }) => u),
    courses: db.courses.map(c => ({
      id: c.id,
      title: c.title,
      category: c.category,
      totalModulesCount: c.totalModulesCount,
      totalTopicsCount: c.totalTopicsCount,
      completionPercentage: c.completionPercentage || 100
    }))
  });
});

app.post('/api/admin/courses', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDatabase();
  const courseData = req.body;

  const newCourse: any = {
    id: `course-${Date.now()}`,
    slug: courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: courseData.title,
    category: courseData.category || 'Computer Science Core',
    shortDescription: courseData.shortDescription || '',
    longDescription: courseData.longDescription || '',
    iconName: 'BookOpen',
    badgeColor: 'blue',
    level: courseData.level || 'Beginner',
    prerequisites: courseData.prerequisites || [],
    learningObjectives: courseData.learningObjectives || [],
    totalModulesCount: 1,
    totalTopicsCount: 1,
    completedTopicsCount: 1,
    completionPercentage: 100,
    modules: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.courses.push(newCourse);
  saveDatabase();
  res.status(201).json(newCourse);
});

app.post('/api/admin/topics', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDatabase();
  const { courseId, title, estimatedMinutes, difficulty, content } = req.body;

  const course = db.courses.find(c => c.id === courseId);
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  if (!course.modules || course.modules.length === 0) {
    course.modules = [
      {
        id: `mod-${Date.now()}`,
        courseId,
        title: 'Module 1: Core Concepts',
        order: 1,
        description: 'Core concepts module',
        chapters: [
          {
            id: `chap-${Date.now()}`,
            moduleId: `mod-${Date.now()}`,
            title: 'Chapter 1: Foundations',
            order: 1,
            topics: []
          }
        ]
      }
    ];
  }

  const topicId = `topic-${Date.now()}`;
  const newTopic = {
    id: topicId,
    chapterId: course.modules[0].chapters[0].id,
    courseId,
    title,
    order: (course.modules[0].chapters[0].topics.length || 0) + 1,
    estimatedMinutes: Number(estimatedMinutes) || 30,
    difficulty: difficulty || 'Beginner',
    isFoundational: true,
    content: {
      topicId,
      ...content
    }
  };

  course.modules[0].chapters[0].topics.push(newTopic);
  course.totalTopicsCount = (course.totalTopicsCount || 0) + 1;
  saveDatabase();

  res.status(201).json(newTopic);
});

app.post('/api/admin/questions', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const db = getDatabase();
  const { subject, question, options, correctAnswer, explanation, difficulty } = req.body;

  const newQuestion = {
    id: `mcq-${Date.now()}`,
    type: 'mcq' as const,
    subject: subject || 'Computer Science',
    question,
    options: options || ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: Number(correctAnswer) || 0,
    explanation: explanation || 'Standard verified solution.',
    difficulty: difficulty || 'Intermediate'
  };

  db.mcqQuestions.unshift(newQuestion);
  saveDatabase();
  res.status(201).json(newQuestion);
});

// ==========================================
// STATIC FILES & VITE DEV MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[SkillSphere Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
