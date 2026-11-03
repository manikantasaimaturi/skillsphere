import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  Clock,
  Layers,
  Award,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadCourse(id);
  }, [id]);

  const loadCourse = async (courseId: string) => {
    setLoading(true);
    try {
      const data = await api.getCourse(courseId);
      setCourse(data);
    } catch (err) {
      console.error('Failed to load course details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      await api.enrollCourse(course.id);
      await loadCourse(course.id);
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="animate-spin h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full mb-2" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100 p-8 text-center">
        <p className="text-lg">Course not found.</p>
        <Link to="/courses" className="text-cyan-400 text-xs underline mt-2 inline-block">
          Back to Course Library
        </Link>
      </div>
    );
  }

  // Find first available topic for quick start
  let firstTopicId = '';
  if (course.modules && course.modules.length > 0) {
    const firstMod = course.modules[0];
    if (firstMod.chapters && firstMod.chapters.length > 0) {
      const firstChap = firstMod.chapters[0];
      if (firstChap.topics && firstChap.topics.length > 0) {
        firstTopicId = firstChap.topics[0].id;
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Link */}
        <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Course Catalogue</span>
        </Link>

        {/* Hero Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded uppercase">
                {course.category}
              </span>
              <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-2.5 py-0.5 rounded">
                Level: {course.level}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Foundational Curriculum Verified</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {course.longDescription || course.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>{course.totalModulesCount || 5} Detailed Modules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>{course.totalTopicsCount || 20} Topics & Assessments</span>
              </div>
            </div>

            {/* Enroll or Start Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {firstTopicId ? (
                <Link
                  to={`/learn/${course.id}/topic/${firstTopicId}`}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>{course.isEnrolled ? 'Resume Learning' : 'Start Course Now'}</span>
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || course.isEnrolled}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                >
                  {course.isEnrolled ? 'Already Enrolled' : enrolling ? 'Enrolling...' : 'Enroll in Course'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Prerequisites & Learning Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white font-heading mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-cyan-400" />
              <span>Learning Objectives</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {(course.learningObjectives || ['Master fundamental core principles', 'Build practical code applications', 'Pass placement interview evaluations']).map((obj: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white font-heading mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span>Prerequisites</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {(course.prerequisites || ['Basic computer operation and analytical thinking']).map((pre: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{pre}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Complete Syllabus Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-heading">
              Complete Course Syllabus & Topics
            </h2>
            <span className="text-xs font-mono text-cyan-400">
              {course.modules?.length || 0} Modules Available
            </span>
          </div>

          {course.modules && course.modules.length > 0 ? (
            <div className="space-y-4">
              {course.modules.map((mod: any, mIdx: number) => (
                <div key={mod.id || mIdx} className="glass-card rounded-2xl p-6 border border-slate-800">
                  <div className="mb-4">
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                      MODULE {mod.order || mIdx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 font-heading">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{mod.description}</p>
                  </div>

                  <div className="space-y-3">
                    {mod.chapters?.map((chap: any, cIdx: number) => (
                      <div key={chap.id || cIdx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80">
                        <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">
                          {chap.title}
                        </h4>

                        <div className="space-y-2">
                          {chap.topics?.map((topic: any) => {
                            const isCompleted = course.completedTopicIds?.includes(topic.id);
                            return (
                              <Link
                                key={topic.id}
                                to={`/learn/${course.id}/topic/${topic.id}`}
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs group"
                              >
                                <div className="flex items-center gap-3">
                                  {isCompleted ? (
                                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                                      {topic.order}
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                                      {topic.title}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                                      <span>{topic.estimatedMinutes} mins</span>
                                      <span>•</span>
                                      <span>{topic.difficulty}</span>
                                      {topic.assessment && (
                                        <>
                                          <span>•</span>
                                          <span className="text-indigo-400">Knowledge Check Quiz</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 text-slate-400 group-hover:text-cyan-400">
                                  <span className="text-[11px] font-semibold">Study Topic</span>
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
              <p>Foundational syllabus modules are being seeded for this course.</p>
              <Link to="/courses/course-python" className="text-cyan-400 underline mt-2 inline-block font-semibold">
                Explore Python or Data Structures course modules
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
