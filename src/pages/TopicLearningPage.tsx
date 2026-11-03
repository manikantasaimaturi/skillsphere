import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Play,
  HelpCircle,
  BookOpen,
  Code,
  Terminal,
  AlertTriangle,
  Lightbulb,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Layers,
  GraduationCap
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const TopicLearningPage: React.FC = () => {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>();
  const [topic, setTopic] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState<boolean>(false);
  const [expandedInterviewIdx, setExpandedInterviewIdx] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (topicId) {
      loadTopicData(topicId);
    }
  }, [topicId, courseId]);

  const loadTopicData = async (tId: string) => {
    setLoading(true);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setQuizResult(null);
    try {
      const topicData = await api.getTopic(tId);
      setTopic(topicData);
      if (courseId) {
        const courseData = await api.getCourse(courseId);
        setCourse(courseData);
      }
    } catch (err) {
      console.error('Failed to load topic:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!topic?.assessment || topic.assessment.length === 0) return;
    const formattedAnswers = Object.entries(selectedAnswers).map(([qId, optIdx]) => ({
      questionId: qId,
      selectedOption: optIdx
    }));

    try {
      const res = await api.submitTopicAssessment(topic.id, formattedAnswers);
      setQuizResult(res);
      setQuizSubmitted(true);
      if (res.passed) {
        setTopic((prev: any) => ({ ...prev, isCompleted: true }));
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    }
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const handleMarkComplete = async () => {
    if (!topic) return;
    setIsMarkingComplete(true);
    try {
      await api.completeTopic(topic.id);
      setTopic((prev: any) => ({ ...prev, isCompleted: true }));
    } catch (err) {
      console.error('Error marking topic complete:', err);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleRunInCompiler = (code: string, language: string) => {
    // Navigate to compiler with prefilled code in session
    sessionStorage.setItem('compiler_prefill_code', code);
    sessionStorage.setItem('compiler_prefill_lang', language);
    navigate('/compiler');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
          <span>Loading topic concept breakdown...</span>
        </div>
      </div>
    );
  }

  if (!topic || !topic.content) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100 p-8 text-center">
        <h2 className="text-lg font-bold">Topic under detailed compilation</h2>
        <p className="text-xs text-slate-400 mt-2">
          This topic syllabus is mapped and currently in queue for complete content expansion.
        </p>
        <Link to={`/courses/${courseId}`} className="text-cyan-400 text-xs underline mt-4 inline-block">
          Return to Course Outline
        </Link>
      </div>
    );
  }

  const c = topic.content;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      {/* Top Breadcrumb Bar */}
      <div className="sticky top-16 z-30 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs truncate">
            <Link to="/courses" className="text-slate-400 hover:text-white">Courses</Link>
            <span className="text-slate-600">/</span>
            <Link to={`/courses/${courseId}`} className="text-slate-400 hover:text-white truncate">
              {topic.courseTitle || 'Course'}
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-medium truncate">{topic.title}</span>
          </div>

          <div className="flex items-center gap-3">
            {topic.isCompleted ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Completed</span>
              </span>
            ) : (
              <button
                onClick={handleMarkComplete}
                disabled={isMarkingComplete}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
              >
                {isMarkingComplete ? 'Saving...' : 'Mark as Completed'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-10">
        {/* Title Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
              TOPIC {topic.order}
            </span>
            <span className="text-[10px] font-mono text-slate-400">{topic.estimatedMinutes} Mins Read</span>
            <span className="text-[10px] font-mono text-indigo-300">{topic.difficulty}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            {topic.title}
          </h1>
        </div>

        {/* 1. Introduction */}
        <section className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>1. Introduction & Overview</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {c.introduction}
          </p>
        </section>

        {/* 2. Definition */}
        <section className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
          <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
            2. Formal Technical Definition
          </span>
          <blockquote className="text-sm font-semibold text-white leading-relaxed border-l-2 border-indigo-500 pl-4">
            {c.definition}
          </blockquote>
        </section>

        {/* 3 & 4. Why Important & How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="h-4 w-4" />
              <span>3. Why It Is Important</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {c.whyImportant}
            </p>
          </section>

          <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              <span>4. How It Works (Mechanism)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {c.howItWorks}
            </p>
          </section>
        </div>

        {/* 5. Detailed Explanation */}
        <section className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>5. In-Depth Architectural Explanation</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {c.detailedExplanation}
          </div>
        </section>

        {/* 6. Syntax or Structure */}
        {c.syntax && (
          <section className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              6. Formal Syntax & Structural Form
            </span>
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-cyan-300 whitespace-pre-wrap leading-relaxed shadow-lg">
              {c.syntax}
            </div>
          </section>
        )}

        {/* 7. Practical Examples (with Run in Compiler Button) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code className="h-4 w-4 text-emerald-400" />
              <span>7. Practical Implementations & Examples</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">At least 2 complete examples</span>
          </div>

          <div className="space-y-6">
            {c.examples?.map((ex: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                      Example {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{ex.title}</h3>
                  </div>
                  <button
                    onClick={() => handleRunInCompiler(ex.code, ex.language || 'python')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    <span>Run in Live Compiler</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
                  {ex.code}
                </pre>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-300">
                  <span className="font-semibold text-cyan-400">Step-by-Step Breakdown: </span>
                  {ex.explanation}
                </div>

                {ex.output && (
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">Expected Output:</span>
                    <pre className="text-emerald-400 whitespace-pre-wrap">{ex.output}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 8 & 9. Real World Applications & Common Errors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan-400" />
              <span>8. Real-World Applications</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {c.realWorldApplications?.map((app: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span>9. Common Errors & Misconceptions</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {c.commonErrors?.map((err: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 10. Placement Interview Questions */}
        {c.interviewQuestions && c.interviewQuestions.length > 0 && (
          <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-400" />
                <span>10. Placement Interview Questions</span>
              </h2>
              <span className="text-xs font-mono text-indigo-400">FAANG & Top MNC Questions</span>
            </div>

            <div className="space-y-3">
              {c.interviewQuestions.map((q: any, idx: number) => {
                const isOpen = expandedInterviewIdx === idx;
                return (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <button
                      onClick={() => setExpandedInterviewIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left font-semibold text-xs text-slate-200 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-indigo-400 font-mono">Q{idx + 1}.</span>
                        <span>{q.question}</span>
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono ml-2">
                        {isOpen ? 'Hide Answer' : 'View Answer'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg">
                        <span className="font-semibold text-emerald-400 block mb-1">Model Answer:</span>
                        {q.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 11. Knowledge Check Assessment */}
        {topic.assessment && topic.assessment.length > 0 && (
          <section className="glass-card p-6 sm:p-8 rounded-2xl border border-indigo-800/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                  11. Knowledge-Check Assessment
                </span>
                <h2 className="text-lg font-bold text-white font-heading mt-0.5">
                  Verify Your Understanding
                </h2>
              </div>
              {quizSubmitted && (
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full font-mono ${
                    quizResult?.passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    Score: {quizResult?.scorePercentage}% ({quizResult?.correctCount}/{quizResult?.totalQuestions})
                  </span>
                  <button
                    onClick={handleRetryQuiz}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {topic.assessment.map((q: any, qIdx: number) => {
                const selected = selectedAnswers[q.id];
                const res = quizResult?.results?.find((r: any) => r.questionId === q.id);

                return (
                  <div key={q.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-3">
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      <span className="text-cyan-400 font-mono mr-2">{qIdx + 1}.</span>
                      {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options?.map((opt: string, optIdx: number) => {
                        let optStyle = 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-300';

                        if (selected === optIdx) {
                          optStyle = 'border-cyan-500 bg-cyan-950/40 text-cyan-200';
                        }

                        if (quizSubmitted && res) {
                          if (optIdx === q.correctAnswer) {
                            optStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold';
                          } else if (selected === optIdx && !res.isCorrect) {
                            optStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${optStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIdx === q.correctAnswer && (
                              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && res && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 mt-2">
                        <span className="font-semibold text-indigo-400 block mb-1">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted && (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
              >
                Submit Answers for Grading
              </button>
            )}
          </section>
        )}

        {/* 12 & 13. Practice Exercise & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              12. Practice Exercise
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {c.practiceExercise}
            </p>
          </section>

          <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              13. Key Takeaway Summary
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {c.summary}
            </p>
          </section>
        </div>

        {/* Footer Navigation Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between">
          <Link
            to={`/courses/${courseId}`}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            ← Course Syllabus
          </Link>

          <button
            onClick={handleMarkComplete}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark Complete & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
