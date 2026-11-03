import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  GraduationCap,
  Calculator,
  BrainCircuit,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Award,
  Search,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api.ts';

export const PlacementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'companies' | 'aptitude'>('companies');
  const [companies, setCompanies] = useState<any[]>([]);
  const [aptitudeTopics, setAptitudeTopics] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedAptitude, setSelectedAptitude] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [companySearch, setCompanySearch] = useState<string>('');
  const [expandedHrIdx, setExpandedHrIdx] = useState<number | null>(null);

  useEffect(() => {
    loadPlacementData();
  }, []);

  const loadPlacementData = async () => {
    setLoading(true);
    try {
      const [comps, apt] = await Promise.all([
        api.getCompanies(),
        api.getAptitudeTopics()
      ]);
      setCompanies(comps);
      setAptitudeTopics(apt);
      if (comps.length > 0) setSelectedCompany(comps[0]);
      if (apt.length > 0) setSelectedAptitude(apt[0]);
    } catch (err) {
      console.error('Failed to load placement data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.category.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800/80 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold mb-3">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Campus Recruitment & Industry Placement Prep</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Placement Preparation Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Company-wise hiring patterns, eligibility criteria, verified previous-year question sets, quantitative formulas, and HR interview frameworks.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'companies'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Company Guides
            </button>
            <button
              onClick={() => setActiveTab('aptitude')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'aptitude'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aptitude & Reasoning
            </button>
          </div>
        </div>

        {/* TAB 1: COMPANY-WISE PREPARATION */}
        {activeTab === 'companies' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Company List Drawer */}
            <div className="lg:col-span-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search company (TCS, Amazon, Google)..."
                  value={companySearch}
                  onChange={e => setCompanySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2 max-h-[700px] overflow-y-auto">
                {filteredCompanies.map(comp => (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompany(comp)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      selectedCompany?.id === comp.id
                        ? 'border-amber-500/80 bg-amber-950/20 shadow-lg shadow-amber-500/5'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white font-mono">
                        {comp.logoText || comp.name.substring(0, 3)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{comp.name}</h4>
                        <span className="text-[10px] text-slate-400">{comp.category}</span>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${selectedCompany?.id === comp.id ? 'text-amber-400' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Company Detail Profile */}
            <div className="lg:col-span-8 space-y-6">
              {selectedCompany ? (
                <>
                  {/* Banner */}
                  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2.5 py-0.5 rounded uppercase">
                          {selectedCompany.category}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-2">
                          {selectedCompany.name}
                        </h2>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedCompany.about}
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <span className="font-semibold text-amber-400 block mb-1">Eligibility Criteria:</span>
                      <p className="text-slate-300">{selectedCompany.eligibility}</p>
                    </div>
                  </div>

                  {/* Selection Process Rounds */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Selection Process & Evaluation Rounds
                    </h3>
                    <div className="space-y-3">
                      {selectedCompany.selectionProcess?.map((rnd: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start justify-between text-xs gap-4">
                          <div className="flex items-start gap-3">
                            <span className="h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-400 shrink-0 text-[11px]">
                              {rnd.round}
                            </span>
                            <div>
                              <h4 className="font-bold text-white text-xs">{rnd.name}</h4>
                              <p className="text-slate-400 mt-0.5">{rnd.details}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{rnd.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Previous-Year Verified Questions */}
                  {selectedCompany.previousYearQuestions && selectedCompany.previousYearQuestions.length > 0 && (
                    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                          Questions from Exam Papers & Modeled Practice
                        </h3>
                        <span className="text-[10px] font-mono text-cyan-400">Strictly Attributed</span>
                      </div>

                      <div className="space-y-4">
                        {selectedCompany.previousYearQuestions.map((q: any) => (
                          <div key={q.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                                {q.type} ({q.year}) • {q.section}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">Source: {q.source}</span>
                            </div>

                            <p className="font-semibold text-white leading-relaxed">{q.question}</p>

                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                              <span className="font-semibold text-emerald-400 block mb-0.5">Solution & Approach:</span>
                              {q.solution}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HR Interview Frameworks */}
                  {selectedCompany.hrQuestionsWithFrameworks && (
                    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-cyan-400" />
                        <span>HR Interview Questions & Sample Answer Frameworks</span>
                      </h3>

                      <div className="space-y-3">
                        {selectedCompany.hrQuestionsWithFrameworks.map((hr: any, i: number) => {
                          const isOpen = expandedHrIdx === i;
                          return (
                            <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                              <button
                                onClick={() => setExpandedHrIdx(isOpen ? null : i)}
                                className="w-full flex items-center justify-between text-left font-semibold text-white hover:text-amber-400"
                              >
                                <span>{hr.question}</span>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {isOpen ? 'Collapse' : 'View Answer Framework'}
                                </span>
                              </button>

                              {isOpen && (
                                <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 text-slate-300">
                                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/30">
                                    <span className="font-bold text-indigo-300 block mb-1">Recommended Framework:</span>
                                    <p className="text-[11px]">{hr.framework}</p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                                    <span className="font-bold text-emerald-400 block mb-1">Sample Professional Response:</span>
                                    <p className="italic text-slate-200">"{hr.sampleAnswer}"</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-slate-500">Select a company on the left to view comprehensive details.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: APTITUDE PREPARATION */}
        {activeTab === 'aptitude' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                Aptitude Modules
              </span>
              {aptitudeTopics.map(apt => (
                <button
                  key={apt.id}
                  onClick={() => setSelectedAptitude(apt)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all ${
                    selectedAptitude?.id === apt.id
                      ? 'border-cyan-500 bg-cyan-950/20 text-white shadow-md'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">{apt.category} Aptitude</span>
                  <h4 className="font-bold text-xs mt-0.5">{apt.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{apt.shortDesc}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 space-y-6">
              {selectedAptitude && (
                <>
                  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded uppercase">
                      {selectedAptitude.category}
                    </span>
                    <h2 className="text-2xl font-bold text-white font-heading">{selectedAptitude.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{selectedAptitude.explanation}</p>
                  </div>

                  {/* Key Formulas */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-emerald-400" />
                      <span>Essential Formulas</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedAptitude.keyFormulas?.map((f: any, i: number) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
                          <span className="text-slate-400 block mb-1 font-sans text-[11px]">{f.name}:</span>
                          <span className="text-emerald-400 font-bold">{f.formula}</span>
                          <p className="text-[10px] text-slate-400 font-sans mt-1">{f.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solved Examples with Shortcuts */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400" />
                      <span>Solved Examples & Speed Shortcuts</span>
                    </h3>
                    {selectedAptitude.solvedExamples?.map((ex: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                        <p className="font-semibold text-white">Problem: {ex.problem}</p>
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-line">
                          {ex.solution}
                        </div>
                        {ex.shortcutSolution && (
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px]">
                            ⚡ Shortcut: {ex.shortcutSolution}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
