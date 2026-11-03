import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Code2,
  BrainCircuit,
  Briefcase,
  FileText,
  CheckCircle,
  ArrowRight,
  Flame,
  Terminal,
  Play,
  Zap,
  Target,
  GraduationCap,
  Layers,
  ChevronRight,
  Star
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor.tsx';
import { api } from '../services/api.ts';

export const LandingPage: React.FC = () => {
  const [demoCode, setDemoCode] = useState<string>(
`# SkillSphere Live Compiler Demo
# Kadane's Algorithm: Maximum Subarray Sum

def max_subarray_sum(nums):
    max_so_far = nums[0]
    curr_max = nums[0]
    
    for x in nums[1:]:
        curr_max = max(x, curr_max + x)
        max_so_far = max(max_so_far, curr_max)
        
    return max_so_far

data = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
result = max_subarray_sum(data)
print(f"Input Array: {data}")
print(f"Maximum Contiguous Subarray Sum = {result}")`
  );

  const [demoOutput, setDemoOutput] = useState<string>('Click "Run Code" above to execute this live on the server...');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRunDemo = async () => {
    setIsRunning(true);
    setDemoOutput('Compiling and executing in isolated sandbox...');
    try {
      const res = await api.runCode({ language: 'python', code: demoCode });
      setDemoOutput(res.output || res.stdout || 'Program finished with no output.');
    } catch (err: any) {
      setDemoOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#080c14] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none -z-10 opacity-40">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[128px]" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/25 rounded-full blur-[128px]" />
        <div className="absolute top-48 left-1/3 w-80 h-80 bg-violet-600/20 rounded-full blur-[140px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>Major B.Tech CSE Project • 2026 Academic Edition</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading leading-tight mb-6">
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            SkillSphere – Your Complete
          </span>{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Learning & Career Development
          </span>{' '}
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Platform
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Learn technical concepts, practice coding, identify skill gaps, prepare for interviews and build your career using one intelligent platform.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/courses"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="h-4 w-4 text-cyan-400" />
            <span>Explore 32 Courses</span>
          </Link>
          <Link
            to="/compiler"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span>Live Compiler</span>
          </Link>
        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4 border-t border-slate-800/60 text-xs text-slate-300">
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <CheckCircle className="h-4 w-4 text-cyan-400" />
            <span>32 Full CSE Courses</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>300+ Live Coding Problems</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <CheckCircle className="h-4 w-4 text-indigo-400" />
            <span>500+ Technical MCQs</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <CheckCircle className="h-4 w-4 text-amber-400" />
            <span>Gemini AI Tutor</span>
          </div>
        </div>
      </section>

      {/* Interactive Live Compiler Preview on Landing Page */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2 font-medium">
                  SkillSphere Sandboxed Multi-Language Compiler
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Executes genuine code through isolated containers. Zero faked outputs.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded">
                Python 3.10
              </span>
              <button
                onClick={handleRunDemo}
                disabled={isRunning}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            <div className="lg:col-span-7">
              <CodeEditor
                language="python"
                value={demoCode}
                onChange={setDemoCode}
                height="320px"
              />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Output Console</span>
                <span className="text-[10px] text-emerald-400 font-mono">Sandbox Active</span>
              </div>
              <pre className="flex-1 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-y-auto whitespace-pre-wrap leading-relaxed min-h-[200px]">
                {demoOutput}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold font-heading mb-4 text-white">
            Engineered for Academic Rigor & Corporate Placements
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every course contains actual educational content with detailed explanations, practical code examples, and topic-wise assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: 32 Courses */}
          <div className="glass-card p-6 rounded-2xl relative group hover:border-cyan-500/40 transition-all">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">
              Comprehensive Course Library
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              32 complete subjects categorized into Programming Languages, Web Development, Computer Science Core, and Advanced Technologies. Follows standard CSE university syllabi.
            </p>
            <Link to="/courses" className="text-xs font-semibold text-cyan-400 inline-flex items-center gap-1 hover:underline">
              Browse course catalogue <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 2: Compiler */}
          <div className="glass-card p-6 rounded-2xl relative group hover:border-emerald-500/40 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">
              Live Coding Practice & 300+ Problems
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Monaco-powered coding arena executing real code in C, C++, Python, Java, JavaScript, TypeScript, and SQL. Automated test cases with memory and execution metrics.
            </p>
            <Link to="/compiler" className="text-xs font-semibold text-emerald-400 inline-flex items-center gap-1 hover:underline">
              Enter coding arena <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 3: AI Mentor */}
          <div className="glass-card p-6 rounded-2xl relative group hover:border-indigo-500/40 transition-all">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">
              SkillSphere AI Mentor
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Integrated Google Gemini 3.8 Flash tutor. Explains complex algorithms step-by-step, debugs compile errors, and tailors study advice to your quiz history.
            </p>
            <Link to="/ai-mentor" className="text-xs font-semibold text-indigo-400 inline-flex items-center gap-1 hover:underline">
              Ask AI Mentor <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 4: Placement Prep */}
          <div className="glass-card p-6 rounded-2xl relative group hover:border-amber-500/40 transition-all">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">
              Placement Preparation Center
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Deep company-wise recruitment tracks: TCS, Infosys, Amazon, Google. Quantitative aptitude with formulas, verified previous-year questions, and HR STAR frameworks.
            </p>
            <Link to="/placement" className="text-xs font-semibold text-amber-400 inline-flex items-center gap-1 hover:underline">
              Prepare for companies <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 5: Resume Builder */}
          <div className="glass-card p-6 rounded-2xl relative group hover:border-rose-500/40 transition-all">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">
              8 Professional Resume Templates
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Genuinely distinct visual layouts (ATS Clean, Modern Blue, Minimal B&W, Developer Dark, Two-Column, Fresher). AI bullet-point enhancer and clean PDF export.
            </p>
            <Link to="/resume-builder" className="text-xs font-semibold text-rose-400 inline-flex items-center gap-1 hover:underline">
              Build your resume <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 6: Diagnostic & Roadmaps */}
          <div className="glass-card p-6 rounded-2xl relative group hover:border-violet-500/40 transition-all">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">
              Skill Gap & Career Roadmaps
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Take diagnostic tests across programming, DBMS, networks, and OS. Measure readiness against your target dream role (Full Stack, SDE, AI Engineer, Cloud).
            </p>
            <Link to="/skill-assessment" className="text-xs font-semibold text-violet-400 inline-flex items-center gap-1 hover:underline">
              Analyze skill gap <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sample Testimonials (Strictly labelled as sample content) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center mb-10">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-800/40">
            Sample Student Testimonials (Simulated Demo Content)
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-3">
            Trusted by Engineering Students
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              "The DBMS normalization and transaction explanations are clearer than most textbooks. The knowledge-check quizzes after each topic solidified my concepts for the TCS Digital technical round!"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-xs text-white">
                R
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Rohan Verma</p>
                <p className="text-[10px] text-slate-400">Placed at TCS Digital (2026 Batch)</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              "Being able to write C++ and Python in Monaco Editor with instant real sandbox execution made practicing Two Pointers and Dynamic Programming seamless during campus placements."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                P
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Priya Patel</p>
                <p className="text-[10px] text-slate-400">B.Tech IT, Final Year</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              "The ATS resume builder with Google XYZ action verbs helped me pass the initial screening filter for Amazon SDE-1. Outstanding full-stack platform!"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-violet-600 flex items-center justify-center font-bold text-xs text-white">
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Aditi Roy</p>
                <p className="text-[10px] text-slate-400">Software Engineer Intern</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mb-4">
            Ready to Master Computer Science & Get Placed?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-8">
            Access complete foundational modules, practice live coding, test your knowledge, and prepare for top tech companies today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all"
            >
              Create Student Account
            </Link>
            <Link
              to="/courses"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all"
            >
              Explore Course Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
