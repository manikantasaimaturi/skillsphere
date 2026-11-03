import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  BookOpen,
  Code2,
  GraduationCap,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Compass,
  AlertTriangle,
  Play
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
          <span>Loading personalized student analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold">
                CSE Batch of {user?.graduationYear || 2026}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user?.college || 'Engineering College'} • Target Role:{' '}
              <span className="text-indigo-400 font-medium">{user?.targetRole || 'Full Stack Software Engineer'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold">
              <Flame className="h-4 w-4 fill-amber-400" />
              <span>{data?.streakDays || 1} Day Streak</span>
            </div>
            <Link
              to="/ai-mentor"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>Consult AI Mentor</span>
            </Link>
          </div>
        </div>

        {/* Real Metrics Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Courses */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Courses Enrolled</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-heading text-white">{data?.enrolledCoursesCount || 0}</span>
              <span className="text-[11px] text-slate-400">({data?.completedCoursesCount || 0} completed)</span>
            </div>
            <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, ((data?.completedCoursesCount || 0) / Math.max(1, data?.enrolledCoursesCount || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 2: Coding Problems Solved */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Problems Solved</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Code2 className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-heading text-white">{data?.codingProblemsSolved || 0}</span>
              <span className="text-[11px] text-slate-400">/ 300 Target</span>
            </div>
            <p className="text-[10px] text-emerald-400 mt-2 font-mono">
              {data?.codingSubmissionsTotal || 0} total compiler runs
            </p>
          </div>

          {/* Card 3: Avg Quiz Accuracy */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Assessment Score</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <GraduationCap className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-heading text-white">{data?.avgQuizScore || 85}%</span>
              <span className="text-[11px] text-indigo-300 font-medium">Avg Accuracy</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              {data?.totalTopicsCompleted || 0} topics verified
            </p>
          </div>

          {/* Card 4: Career Readiness Index */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-violet-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Career Readiness</span>
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-heading text-white">{data?.careerReadiness || 68}%</span>
              <span className="text-[11px] text-violet-300">Tier 1 Target</span>
            </div>
            <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${data?.careerReadiness || 68}%` }}
              />
            </div>
          </div>
        </div>

        {/* Charts & In-Progress Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Learning Activity Chart */}
          <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-white font-heading">
                  Weekly Learning & Coding Activity
                </h3>
                <p className="text-xs text-slate-400">Problems solved, quizzes completed, and topics studied</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                Last 7 Days
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.activityData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Bar dataKey="problems" name="Coding Problems" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="topics" name="Topics Studied" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="quizzes" name="Quizzes" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Weak Subjects & AI Prescription */}
          <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-heading">
                  Identified Weak Areas & Diagnostic Gaps
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Based on your recent assessment submissions, the system recommends strengthening these topics before placement drives:
              </p>

              <div className="space-y-2.5 mb-6">
                {(data?.weakSubjects || ['Operating Systems (Synchronization)', 'Dynamic Programming']).map((subj: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-200 font-medium">{subj}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px]">
                      Needs Practice
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>AI Tutor Recommendation</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                "Solve 3 practice questions on Semaphores and complete the Kadane's algorithm module to boost your core CSE assessment score."
              </p>
              <Link
                to="/ai-mentor"
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:underline"
              >
                <span>Ask AI to generate practice plan</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Enrolled Courses & In-Progress Topics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                My Active Enrolled Courses
              </h2>
              <p className="text-xs text-slate-400">Continue learning where you left off</p>
            </div>
            <Link to="/courses" className="text-xs text-cyan-400 font-medium hover:underline flex items-center gap-1">
              <span>View all 32 courses</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.enrolledCourses?.map((c: any) => (
              <div key={c.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                      {c.category}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {c.completionPercentage || 0}%
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 font-heading">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {c.shortDescription}
                  </p>
                </div>

                <div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all"
                      style={{ width: `${c.completionPercentage || 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>{c.completedTopicsCount || 0} / {c.totalTopicsCount || 20} Topics</span>
                    <Link
                      to={`/courses/${c.id}`}
                      className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Coding Questions & Upcoming Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span>Recommended Coding Problems</span>
              </h3>
              <Link to="/compiler" className="text-xs text-cyan-400 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {data?.recommendedProblems?.map((prob: any) => (
                <div key={prob.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div>
                    <h4 className="text-xs font-semibold text-white">{prob.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{prob.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                      prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                      prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {prob.difficulty}
                    </span>
                    <Link
                      to={`/compiler?problem=${prob.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                    >
                      <Play className="h-3 w-3 fill-current" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-400" />
                <span>Upcoming Placement Mock Contests</span>
              </h3>
              <Link to="/assessments" className="text-xs text-indigo-400 hover:underline">
                Open Quiz Center
              </Link>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">TCS NQT National Mock Assessment</h4>
                  <p className="text-[11px] text-slate-400">Numerical Ability + Hands-on Coding (60 mins)</p>
                </div>
                <Link
                  to="/assessments"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  Start Test
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Amazon SDE-1 Algorithmic Qualifier</h4>
                  <p className="text-[11px] text-slate-400">Two Pointers, Graphs, and DP (70 mins)</p>
                </div>
                <Link
                  to="/assessments"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  Start Test
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
