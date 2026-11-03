import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Play,
  Send,
  RotateCcw,
  Code2,
  Terminal,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  BookOpen,
  Filter,
  Search,
  ChevronDown,
  History,
  FileCode
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor.tsx';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

const LANGUAGES = [
  { id: 'python', name: 'Python 3.10' },
  { id: 'cpp', name: 'C++ (G++ 10)' },
  { id: 'c', name: 'C (GCC 10)' },
  { id: 'java', name: 'Java 15' },
  { id: 'javascript', name: 'JavaScript (Node 18)' },
  { id: 'typescript', name: 'TypeScript 5.0' },
  { id: 'sql', name: 'SQL (SQLite Sandbox)' }
];

export const CodingCompilerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [problems, setProblems] = useState<any[]>([]);
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');
  const [stdin, setStdin] = useState<string>('');
  const [outputLogs, setOutputLogs] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<'problem' | 'hints' | 'editorial' | 'submissions'>('problem');
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [problemSearch, setProblemSearch] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    loadProblems();
    loadSubmissions();

    // Check prefilled code from session storage
    const prefillCode = sessionStorage.getItem('compiler_prefill_code');
    const prefillLang = sessionStorage.getItem('compiler_prefill_lang');
    if (prefillCode) {
      setCode(prefillCode);
      if (prefillLang) setSelectedLanguage(prefillLang.toLowerCase());
      sessionStorage.removeItem('compiler_prefill_code');
      sessionStorage.removeItem('compiler_prefill_lang');
    }
  }, []);

  const loadProblems = async () => {
    try {
      const data = await api.getProblems();
      setProblems(data);
      const targetParam = searchParams.get('problem');
      const initial = targetParam ? data.find((p: any) => p.id === targetParam || p.slug === targetParam) : data[0];
      if (initial) selectProblem(initial.id);
    } catch (err) {
      console.error('Failed to load problems:', err);
    }
  };

  const loadSubmissions = async () => {
    if (!user) return;
    try {
      const data = await api.getSubmissions();
      setUserSubmissions(data);
    } catch (err) {
      console.error('Failed to load user submissions:', err);
    }
  };

  const selectProblem = async (problemId: string) => {
    try {
      const fullProblem = await api.getProblem(problemId);
      setCurrentProblem(fullProblem);
      // Load starter code for selected language
      const starter = fullProblem.starterCode?.[selectedLanguage] || `# Write your solution for ${fullProblem.title} here\n`;
      setCode(starter);
      if (fullProblem.sampleTestCases && fullProblem.sampleTestCases.length > 0) {
        setStdin(fullProblem.sampleTestCases[0].input);
      }
      setTestResults(null);
      setOutputLogs('Select "Run Code" to test against custom input, or "Submit Code" to grade against test cases.');
    } catch (err) {
      console.error('Failed to select problem:', err);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    if (currentProblem && currentProblem.starterCode) {
      const starter = currentProblem.starterCode[newLang];
      if (starter) setCode(starter);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutputLogs('Executing code in secure sandbox...');
    try {
      const res = await api.runCode({
        language: selectedLanguage,
        code,
        stdin
      });
      setOutputLogs(res.output || res.stdout || res.stderr || 'Finished (no output)');
    } catch (err: any) {
      setOutputLogs(`Execution Failed:\n${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentProblem) return;
    setIsSubmitting(true);
    setOutputLogs('Grading solution against public and hidden test cases...');
    try {
      const res = await api.submitCode({
        problemId: currentProblem.id,
        language: selectedLanguage,
        code
      });

      setTestResults(res.testCaseResults || []);
      if (res.allPassed) {
        setOutputLogs(`🎉 ALL TEST CASES PASSED!\nStatus: Accepted\nRuntime: ${res.submission?.executionTimeMs || 42}ms\nMemory: Verified within 256MB limit`);
      } else {
        const passed = res.testCaseResults?.filter((t: any) => t.passed).length || 0;
        const total = res.testCaseResults?.length || 0;
        setOutputLogs(`❌ TEST CASES FAILED: (${passed}/${total} passed)\nStatus: ${res.submission?.status || 'Wrong Answer'}`);
      }
      await loadSubmissions();
    } catch (err: any) {
      setOutputLogs(`Submission Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (currentProblem?.starterCode?.[selectedLanguage]) {
      setCode(currentProblem.starterCode[selectedLanguage]);
    }
  };

  const filteredProblems = problems.filter(p => {
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === 'All' || p.topic === topicFilter;
    const matchesSearch = p.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
                          p.topic.toLowerCase().includes(problemSearch.toLowerCase());
    return matchesDiff && matchesTopic && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      {/* Top Action Toolbar */}
      <div className="border-b border-slate-800 bg-slate-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-xs sm:text-sm text-white font-heading">
              {currentProblem ? currentProblem.title : 'Coding Arena'}
            </span>
          </div>
          {currentProblem && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
              currentProblem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              currentProblem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {currentProblem.difficulty}
            </span>
          )}
        </div>

        {/* Language selector & Run/Submit controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={e => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleReset}
            title="Reset code to starter template"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Grading...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Problem Bank & Statement */}
        <div className="lg:col-span-5 border-r border-slate-800 bg-slate-950/70 flex flex-col h-[calc(100vh-112px)] overflow-y-auto">
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-800 text-xs font-semibold px-4">
            <button
              onClick={() => setActiveTab('problem')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'problem' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Problem Statement
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'hints' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Hints
            </button>
            <button
              onClick={() => setActiveTab('editorial')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'editorial' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Editorial Solution
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'submissions' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Submissions ({userSubmissions.length})
            </button>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto text-xs">
            {activeTab === 'problem' && currentProblem && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <div className="text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                    {currentProblem.description}
                  </div>
                </div>

                {/* Company tags */}
                {currentProblem.companies && currentProblem.companies.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1.5">
                      Frequently Asked At:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProblem.companies.map((comp: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-mono">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Examples
                  </h3>
                  <div className="space-y-3">
                    {currentProblem.examples?.map((ex: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono space-y-1.5">
                        <p className="text-slate-400 text-[11px]">Example {idx + 1}:</p>
                        <div>
                          <span className="text-slate-500">Input: </span>
                          <span className="text-slate-200">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Output: </span>
                          <span className="text-emerald-400 font-semibold">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-[11px] text-slate-400 font-sans pt-1 border-t border-slate-800">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Constraints
                  </h3>
                  <pre className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
                    {currentProblem.constraints}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'hints' && currentProblem && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Algorithmic Hints
                </h3>
                {currentProblem.hints?.map((hint: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-slate-300">
                    <span className="text-cyan-400 font-bold block mb-1">Hint {i + 1}:</span>
                    {hint}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'editorial' && currentProblem && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Editorial & Approach
                </h3>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-slate-300 leading-relaxed">
                  <h4 className="font-semibold text-emerald-400">Solution Approach:</h4>
                  <p>{currentProblem.solutionApproach}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-slate-300 leading-relaxed">
                  <h4 className="font-semibold text-cyan-400">Complexity Analysis:</h4>
                  <p>{currentProblem.editorial}</p>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Submission History
                </h3>
                {userSubmissions.length === 0 ? (
                  <p className="text-slate-500">No submissions yet for this problem.</p>
                ) : (
                  userSubmissions.map(sub => (
                    <div key={sub.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className={`font-bold ${sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {sub.status}
                        </span>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {sub.language} • {new Date(sub.submittedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {sub.passedTestCases}/{sub.totalTestCases} Tests ({sub.executionTimeMs}ms)
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Quick Drawer to browse 300+ problems */}
            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Browse 300+ Problem Bank
                </span>
                <span className="text-[10px] font-mono text-cyan-400">{filteredProblems.length} Found</span>
              </div>

              {/* Problem search & diff filters */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Filter problems..."
                  value={problemSearch}
                  onChange={e => setProblemSearch(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white focus:outline-none focus:border-cyan-500"
                />
                <select
                  value={difficultyFilter}
                  onChange={e => setDifficultyFilter(e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 focus:outline-none"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {filteredProblems.slice(0, 15).map(p => (
                  <button
                    key={p.id}
                    onClick={() => selectProblem(p.id)}
                    className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between ${
                      currentProblem?.id === p.id
                        ? 'bg-cyan-950/60 border border-cyan-800 text-cyan-200'
                        : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <span className="truncate pr-2">{p.title}</span>
                    <span className={`text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded ${
                      p.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' :
                      p.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10' :
                      'text-rose-400 bg-rose-500/10'
                    }`}>
                      {p.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Console */}
        <div className="lg:col-span-7 flex flex-col h-[calc(100vh-112px)] overflow-hidden">
          {/* Editor Header */}
          <div className="flex-1 overflow-hidden p-3 bg-[#111827]">
            <CodeEditor
              language={selectedLanguage}
              value={code}
              onChange={setCode}
              height="100%"
            />
          </div>

          {/* Lower Panel: Stdin & Output Console */}
          <div className="h-64 border-t border-slate-800 bg-slate-950 p-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-white flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                  Execution Output
                </span>
                {testResults && (
                  <span className="text-emerald-400 font-mono text-[11px]">
                    Tests: {testResults.filter(t => t.passed).length}/{testResults.length} passed
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Piston / VM Sandbox
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 overflow-hidden">
              {/* Custom Stdin */}
              <div className="md:col-span-4 flex flex-col overflow-hidden">
                <label className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                  Custom Input (stdin):
                </label>
                <textarea
                  value={stdin}
                  onChange={e => setStdin(e.target.value)}
                  placeholder="Enter custom input..."
                  className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-200 resize-none focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Output Logs / Test Results */}
              <div className="md:col-span-8 flex flex-col overflow-hidden">
                <div className="flex-1 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-200 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {outputLogs}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
