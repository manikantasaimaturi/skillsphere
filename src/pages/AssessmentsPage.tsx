import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Filter,
  Check,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

const SUBJECT_LIST = [
  'All Subjects',
  'C', 'C++', 'Python', 'Java', 'JavaScript', 'HTML', 'CSS', 'React',
  'DBMS', 'SQL', 'Data Structures', 'Algorithms', 'Operating Systems',
  'Computer Networks', 'Computer Organization', 'Software Engineering',
  'Artificial Intelligence', 'Machine Learning', 'Cybersecurity',
  'Aptitude', 'Logical reasoning', 'Verbal ability'
];

export const AssessmentsPage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizDifficulty, setQuizDifficulty] = useState<string>('All');
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 mins
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadHistory();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isTestActive || testCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTestActive, testCompleted]);

  const loadHistory = async () => {
    if (!user) return;
    try {
      const data = await api.getQuizHistory();
      setQuizHistory(data);
    } catch (err) {
      console.error('Failed to load quiz history:', err);
    }
  };

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.generateQuiz({
        subject: selectedSubject === 'All Subjects' ? undefined : selectedSubject,
        count: questionCount,
        difficulty: quizDifficulty === 'All' ? undefined : quizDifficulty
      });

      setQuestions(res.questions);
      setCurrentIdx(0);
      setUserAnswers({});
      setTimeLeft(questionCount * 60); // 1 min per question
      setTestCompleted(false);
      setTestResults(null);
      setIsTestActive(true);
    } catch (err) {
      console.error('Failed to start quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (testCompleted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleFinishTest = async () => {
    setLoading(true);
    const answersList = Object.entries(userAnswers).map(([qId, optIdx]) => ({
      questionId: qId,
      selectedOption: optIdx
    }));

    try {
      const res = await api.submitQuiz({
        subject: selectedSubject,
        userAnswers: answersList,
        timeSpentSeconds: (questionCount * 60) - timeLeft
      });
      setTestResults(res);
      setTestCompleted(true);
      await loadHistory();
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800/80 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-semibold mb-3">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Comprehensive 500+ Technical MCQ Bank</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Knowledge Assessment Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Test your engineering concepts across 21 core computer science & placement subjects with custom timers and instant solutions.
            </p>
          </div>
        </div>

        {/* ACTIVE TEST MODE */}
        {isTestActive ? (
          <div className="space-y-6">
            {/* Test Status Bar */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded">
                  {selectedSubject} Assessment
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Question {currentIdx + 1} of {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-full ${
                  timeLeft < 120 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse' : 'bg-slate-900 text-emerald-400 border border-slate-800'
                }`}>
                  <Clock className="h-3.5 w-3.5" />
                  <span>Time Left: {formatTime(timeLeft)}</span>
                </div>

                {!testCompleted && (
                  <button
                    onClick={handleFinishTest}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Finish & Submit Test
                  </button>
                )}
              </div>
            </div>

            {/* Test Results View */}
            {testCompleted && testResults ? (
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-8 animate-in fade-in">
                <div className="text-center space-y-2">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <Award className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-white">
                    Assessment Evaluation Complete
                  </h2>
                  <div className="flex items-center justify-center gap-4 text-xs font-mono pt-2">
                    <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full font-bold text-sm">
                      Score: {testResults.attempt?.score} / {testResults.attempt?.totalQuestions} ({testResults.attempt?.accuracy}%)
                    </span>
                    <span className="text-slate-400">
                      Time: {testResults.attempt?.timeSpentSeconds}s
                    </span>
                  </div>
                </div>

                {/* Weak topics identify */}
                {testResults.attempt?.weakTopics && testResults.attempt.weakTopics.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                    <span className="font-semibold text-amber-400 block mb-1">Recommended Topics to Review:</span>
                    <p className="text-slate-300">{testResults.attempt.weakTopics.join(', ')}</p>
                  </div>
                )}

                {/* Detailed Questions & Explanations Review */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Detailed Answers & Explanations:
                  </h3>
                  {testResults.results?.map((res: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-200">
                          <span className="text-cyan-400 font-mono mr-2">{idx + 1}.</span>
                          {res.question}
                        </span>
                        {res.isCorrect ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] shrink-0 font-semibold flex items-center gap-1">
                            <Check className="h-3 w-3" /> Correct
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-mono text-[10px] shrink-0 font-semibold flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Incorrect
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {res.options?.map((opt: string, optIdx: number) => {
                          let optStyle = 'border-slate-800 bg-slate-950/60 text-slate-400';
                          if (optIdx === res.correctAnswer) {
                            optStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-semibold';
                          } else if (optIdx === res.selectedOption && !res.isCorrect) {
                            optStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-200';
                          }
                          return (
                            <div key={optIdx} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}>
                              <span>{opt}</span>
                              {optIdx === res.correctAnswer && <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                        <span className="font-semibold text-indigo-400 block mb-0.5">Solution & Explanation:</span>
                        {res.explanation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setIsTestActive(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                  >
                    Back to Assessment Hub
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    Generate New Assessment
                  </button>
                </div>
              </div>
            ) : (
              /* Ongoing Question Card */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-9 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                  {questions[currentIdx] && (
                    <>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-mono text-cyan-400 uppercase">
                            {questions[currentIdx].subject || selectedSubject}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">•</span>
                          <span className="text-[10px] font-mono text-indigo-300">
                            {questions[currentIdx].difficulty}
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                          {questions[currentIdx].question}
                        </h2>
                      </div>

                      <div className="space-y-3">
                        {questions[currentIdx].options?.map((option: string, optIdx: number) => {
                          const isSelected = userAnswers[questions[currentIdx].id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(questions[currentIdx].id, optIdx)}
                              className={`w-full p-4 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-semibold shadow-md shadow-cyan-500/10'
                                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                              }`}
                            >
                              <span>{option}</span>
                              <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                                isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                              }`}>
                                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation Controls */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <button
                          disabled={currentIdx === 0}
                          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-40"
                        >
                          Previous
                        </button>

                        <button
                          disabled={currentIdx === questions.length - 1}
                          onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-40"
                        >
                          Next Question
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Question Palette Sidebar */}
                <div className="lg:col-span-3 glass-card p-5 rounded-3xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Question Palette
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => {
                      const isAnswered = userAnswers[q.id] !== undefined;
                      const isCurrent = currentIdx === idx;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIdx(idx)}
                          className={`h-9 w-9 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center ${
                            isCurrent
                              ? 'border-2 border-cyan-400 bg-cyan-950 text-cyan-300'
                              : isAnswered
                              ? 'bg-emerald-600/80 text-white border border-emerald-500'
                              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-emerald-600" />
                      <span>Answered ({Object.keys(userAnswers).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-slate-900 border border-slate-800" />
                      <span>Unanswered ({questions.length - Object.keys(userAnswers).length})</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* QUIZ SETUP CONFIGURATOR & HISTORY */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Custom Quiz Generator */}
            <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  Configure Custom Assessment
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select subject, question density, and difficulty parameters to launch a timed mock test.
                </p>
              </div>

              {/* Subject selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Select Engineering Subject
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {SUBJECT_LIST.map(subject => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => setSelectedSubject(subject)}
                      className={`p-2 rounded-xl text-xs font-medium transition-all text-left truncate ${
                        selectedSubject === subject
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count Options */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                        questionCount === cnt
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Target Difficulty
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setQuizDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${
                        quizDifficulty === diff
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:opacity-95 shadow-xl shadow-cyan-400/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{loading ? 'Compiling Test Questions...' : `Start ${selectedSubject} Assessment`}</span>
              </button>
            </div>

            {/* Right: Past Quiz Attempt History */}
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-heading mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-cyan-400" />
                  <span>Recent Assessment Performance</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Past scores are saved to compute your live skill gap and placement readiness score.
                </p>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {quizHistory.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">
                      No attempts recorded yet. Launch your first test on the left!
                    </p>
                  ) : (
                    quizHistory.map(att => (
                      <div key={att.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-semibold text-white">{att.subject}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(att.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono font-bold ${
                            att.accuracy >= 80 ? 'text-emerald-400' :
                            att.accuracy >= 60 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {att.score}/{att.totalQuestions} ({att.accuracy}%)
                          </span>
                          <p className="text-[10px] text-slate-500 font-mono">{att.timeSpentSeconds}s elapsed</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
