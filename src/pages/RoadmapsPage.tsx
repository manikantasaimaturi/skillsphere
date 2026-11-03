import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2,
  Briefcase
} from 'lucide-react';
import { api } from '../services/api.ts';

export const RoadmapsPage: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    setLoading(true);
    try {
      const data = await api.getRoadmaps();
      setRoadmaps(data);
      if (data.length > 0) setSelectedRoadmap(data[0]);
    } catch (err) {
      console.error('Failed to load roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800/80 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold mb-3">
            <Compass className="h-3.5 w-3.5" />
            <span>Structured Engineering Specializations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Career Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Step-by-step learning sequences from beginner to advanced stages, mapped directly to SkillSphere courses, live coding practice, and placement interview criteria.
          </p>
        </div>

        {/* Roadmap Selector Horizontal Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {roadmaps.map(rm => (
            <button
              key={rm.id}
              onClick={() => setSelectedRoadmap(rm)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedRoadmap?.id === rm.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {rm.title}
            </button>
          ))}
        </div>

        {/* Selected Roadmap Details */}
        {selectedRoadmap && (
          <div className="space-y-8">
            {/* Overview Banner */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  {selectedRoadmap.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                  {selectedRoadmap.title} Roadmap
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {selectedRoadmap.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs shrink-0 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Estimated Placement Range:</span>
                  <span className="text-emerald-400 font-bold text-sm">{selectedRoadmap.salaryRange}</span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Top Hiring Firms:</span>
                  <span className="text-cyan-300">{selectedRoadmap.hiringCompanies?.slice(0, 4).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Stages Timeline */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Progressive Learning Stages:
              </h3>

              <div className="space-y-4">
                {selectedRoadmap.stages?.map((stg: any, idx: number) => (
                  <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                          STAGE {idx + 1} • {stg.level}
                        </span>
                        <h4 className="text-base font-bold text-white font-heading mt-0.5">
                          {stg.stage}
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Topics */}
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span className="font-bold text-cyan-400 block mb-1">Key Concepts to Master:</span>
                        <ul className="space-y-1 text-slate-300">
                          {stg.topics?.map((top: string, i: number) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-cyan-400">•</span>
                              <span>{top}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommended Courses & Projects */}
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span className="font-bold text-indigo-400 block mb-1">Recommended Courses:</span>
                        <ul className="space-y-1 text-slate-300 mb-3">
                          {stg.recommendedCourses?.map((rc: string, i: number) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <BookOpen className="h-3 w-3 text-indigo-400" />
                              <span>{rc}</span>
                            </li>
                          ))}
                        </ul>
                        <span className="font-bold text-emerald-400 block mb-1">Target Portfolio Project:</span>
                        <p className="text-slate-300 text-[11px]">{stg.projects?.join(', ')}</p>
                      </div>

                      {/* Interview Focus */}
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span className="font-bold text-amber-400 block mb-1">Interview Evaluation Focus:</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {stg.interviewFocus?.join('; ')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
