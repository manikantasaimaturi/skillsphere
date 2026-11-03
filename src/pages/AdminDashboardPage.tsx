import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Code2,
  GraduationCap,
  Plus,
  CheckCircle,
  AlertCircle,
  Check,
  Search,
  Layers,
  FileText
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'metrics' | 'courses' | 'questions' | 'students'>('metrics');

  // New Course Form State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Computer Science Core');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [courseAddSuccess, setCourseAddSuccess] = useState(false);

  // New Question Form State
  const [qSubject, setQSubject] = useState('Python');
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qDifficulty, setQDifficulty] = useState('Intermediate');
  const [qAddSuccess, setQAddSuccess] = useState(false);

  // Student Search
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    loadAdminData();
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminDashboard();
      setAdminData(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) return;
    try {
      await api.createAdminCourse({
        title: newCourseTitle,
        category: newCourseCategory,
        shortDescription: newCourseDesc
      });
      setCourseAddSuccess(true);
      setNewCourseTitle('');
      setNewCourseDesc('');
      setTimeout(() => setCourseAddSuccess(false), 2500);
      await loadAdminData();
    } catch (err) {
      console.error('Create course error:', err);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText || qOptions.some(o => !o.trim())) return;
    try {
      await api.createAdminQuestion({
        subject: qSubject,
        question: qText,
        options: qOptions,
        correctAnswer: qCorrect,
        explanation: qExplanation,
        difficulty: qDifficulty
      });
      setQAddSuccess(true);
      setQText('');
      setQOptions(['', '', '', '']);
      setQExplanation('');
      setTimeout(() => setQAddSuccess(false), 2500);
      await loadAdminData();
    } catch (err) {
      console.error('Create question error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mb-2" />
      </div>
    );
  }

  const m = adminData?.metrics || {};

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800/80 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <ShieldAlert className="h-3.5 w-3.5 text-purple-400" />
              <span>Restricted Administrator Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              SkillSphere Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Real-time platform analytics, curriculum content management, question authoring, and student learning audits.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'metrics' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'courses' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Courses CMS
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'questions' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Question Authoring
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'students' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Students Roster
            </button>
          </div>
        </div>

        {/* TAB 1: METRICS OVERVIEW */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Registered Students</span>
                <p className="text-2xl font-bold font-heading text-white mt-2">{m.totalStudents || 0}</p>
                <p className="text-[10px] text-emerald-400 mt-1 font-mono">{m.activeStudents || 0} active</p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Course Modules</span>
                <p className="text-2xl font-bold font-heading text-white mt-2">{m.totalCourses || 0} Courses</p>
                <p className="text-[10px] text-cyan-400 mt-1 font-mono">{m.totalTopics || 0} total topics</p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Verified Question Bank</span>
                <p className="text-2xl font-bold font-heading text-white mt-2">{m.totalMcqs || 0} MCQs</p>
                <p className="text-[10px] text-indigo-400 mt-1 font-mono">{m.totalCodingProblems || 0} Coding Problems</p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Code Submissions</span>
                <p className="text-2xl font-bold font-heading text-white mt-2">{m.totalSubmissions || 0}</p>
                <p className="text-[10px] text-amber-400 mt-1 font-mono">{m.totalQuizAttempts || 0} Quizzes Evaluated</p>
              </div>
            </div>

            {/* Course Content Completeness Indicator */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Course Content Completeness Auditor
                </h3>
                <span className="text-xs font-mono text-emerald-400">100% Foundational Coverage</span>
              </div>

              <div className="space-y-3">
                {adminData?.courses?.map((c: any) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white">{c.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{c.category} • {c.totalModulesCount} Modules</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-28 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${c.completionPercentage || 100}%` }} />
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-[11px]">{c.completionPercentage || 100}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURSE AUTHORING */}
        {activeTab === 'courses' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 max-w-2xl">
            <h2 className="text-base font-bold text-white font-heading">
              Publish New Course Syllabus Module
            </h2>
            {courseAddSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Course created and registered in catalogue!</span>
              </div>
            )}

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Architecture"
                  value={newCourseTitle}
                  onChange={e => setNewCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category *</label>
                <select
                  value={newCourseCategory}
                  onChange={e => setNewCourseCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                >
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Computer Science Core">Computer Science Core</option>
                  <option value="Advanced Technologies">Advanced Technologies</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Short Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Overview of modules, key concepts, and practical learning objectives..."
                  value={newCourseDesc}
                  onChange={e => setNewCourseDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Add Course to System
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: QUESTION AUTHORING */}
        {activeTab === 'questions' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 max-w-2xl">
            <h2 className="text-base font-bold text-white font-heading">
              Add Verified MCQ to Question Bank
            </h2>
            {qAddSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Question saved and mapped to subject bank!</span>
              </div>
            )}

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Subject *</label>
                  <select
                    value={qSubject}
                    onChange={e => setQSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  >
                    {['Python', 'C++', 'Java', 'Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'Aptitude'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Difficulty</label>
                  <select
                    value={qDifficulty}
                    onChange={e => setQDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Question Statement *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter clear technical question..."
                  value={qText}
                  onChange={e => setQText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-400 mb-1">Answer Options (4) & Correct Choice *</label>
                {qOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={qCorrect === i}
                      onChange={() => setQCorrect(i)}
                      className="text-purple-600"
                    />
                    <input
                      type="text"
                      required
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      value={opt}
                      onChange={e => {
                        const updated = [...qOptions];
                        updated[i] = e.target.value;
                        setQOptions(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Detailed Explanation *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Step-by-step why the selected option is correct..."
                  value={qExplanation}
                  onChange={e => setQExplanation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Save Question
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: STUDENTS ROSTER */}
        {activeTab === 'students' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-bold text-white font-heading">
                Registered Student Accounts & Placement Profiles
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              {adminData?.students
                ?.filter((st: any) => st.name.toLowerCase().includes(studentSearch.toLowerCase()) || st.email.toLowerCase().includes(studentSearch.toLowerCase()))
                ?.map((st: any) => (
                  <div key={st.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white text-xs">{st.name}</h4>
                      <p className="text-[11px] text-slate-400">{st.email} • {st.college}</p>
                      <p className="text-[10px] text-cyan-400 font-mono mt-0.5">Target: {st.targetRole || 'SDE'}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-amber-400 font-bold">{st.streakDays || 1}d Streak</span>
                      <p className="text-[10px] text-slate-500">Graduation: {st.graduationYear || 2026}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
