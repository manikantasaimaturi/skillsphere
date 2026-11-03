// SkillSphere API Client

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('skillsphere_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('skillsphere_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('skillsphere_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request<any>('/auth/me'),
  logout: () => request<any>('/auth/logout', { method: 'POST' }),

  // Courses
  getCourses: () => request<any[]>('/courses'),
  getCourse: (id: string) => request<any>(`/courses/${id}`),
  enrollCourse: (id: string) => request<any>(`/courses/${id}/enroll`, { method: 'POST' }),
  getTopic: (id: string) => request<any>(`/topics/${id}`),
  completeTopic: (id: string) => request<any>(`/topics/${id}/complete`, { method: 'POST' }),
  submitTopicAssessment: (id: string, answers: any) => request<any>(`/assessments/${id}/submit`, { method: 'POST', body: JSON.stringify({ answers }) }),

  // Coding Practice & Live Compiler
  getProblems: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any[]>(`/coding/problems${qs}`);
  },
  getProblem: (id: string) => request<any>(`/coding/problems/${id}`),
  runCode: (body: { language: string; code: string; stdin?: string }) => request<any>('/coding/run', { method: 'POST', body: JSON.stringify(body) }),
  submitCode: (body: { problemId: string; language: string; code: string }) => request<any>('/coding/submit', { method: 'POST', body: JSON.stringify(body) }),
  getSubmissions: () => request<any[]>('/coding/submissions'),

  // Assessments & MCQs
  getMcqs: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return request<any[]>(`/assessments/mcqs${qs}`);
  },
  generateQuiz: (body: { subject?: string; count?: number; difficulty?: string }) => request<any>('/assessments/generate-quiz', { method: 'POST', body: JSON.stringify(body) }),
  submitQuiz: (body: { subject: string; userAnswers: any[]; timeSpentSeconds: number }) => request<any>('/assessments/submit-quiz', { method: 'POST', body: JSON.stringify(body) }),
  getQuizHistory: () => request<any[]>('/assessments/history'),

  // AI Mentor
  chatWithAi: (prompt: string, conversationId?: string) => request<any>('/ai/chat', { method: 'POST', body: JSON.stringify({ prompt, conversationId }) }),
  getConversations: () => request<any[]>('/ai/conversations'),
  getConversation: (id: string) => request<any>(`/ai/conversations/${id}`),

  // Placement Prep
  getCompanies: () => request<any[]>('/companies'),
  getCompany: (id: string) => request<any>(`/companies/${id}`),
  getAptitudeTopics: () => request<any[]>('/placement/aptitude'),

  // Resumes
  getResumes: () => request<any[]>('/resumes'),
  getResume: (id: string) => request<any>(`/resumes/${id}`),
  createResume: (data: any) => request<any>('/resumes', { method: 'POST', body: JSON.stringify(data) }),
  updateResume: (id: string, data: any) => request<any>(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteResume: (id: string) => request<any>(`/resumes/${id}`, { method: 'DELETE' }),
  aiEnhanceResume: (section: string, content: string, targetRole?: string) => request<any>('/resumes/ai-enhance', { method: 'POST', body: JSON.stringify({ section, content, targetRole }) }),

  // Skills, Roadmaps & Projects
  getSkillAssessmentQuestions: () => request<any[]>('/skills/assessment'),
  submitSkillAssessment: (domainScores: Record<string, number>, targetRole?: string) => request<any>('/skills/submit', { method: 'POST', body: JSON.stringify({ domainScores, targetRole }) }),
  getRoadmaps: () => request<any[]>('/roadmaps'),
  getProjects: () => request<any[]>('/projects'),
  getMyProjects: () => request<any[]>('/projects/my-projects'),
  trackProject: (data: any) => request<any>('/projects/track', { method: 'POST', body: JSON.stringify(data) }),

  // Student Dashboard & Profile
  getDashboard: () => request<any>('/student/dashboard'),
  updateProfile: (data: any) => request<any>('/student/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Admin CMS
  getAdminDashboard: () => request<any>('/admin/dashboard'),
  createAdminCourse: (data: any) => request<any>('/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
  createAdminTopic: (data: any) => request<any>('/admin/topics', { method: 'POST', body: JSON.stringify(data) }),
  createAdminQuestion: (data: any) => request<any>('/admin/questions', { method: 'POST', body: JSON.stringify(data) })
};
