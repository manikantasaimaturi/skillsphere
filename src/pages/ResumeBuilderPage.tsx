import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Layout,
  Check,
  Printer,
  ChevronRight,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award
} from 'lucide-react';
import jsPDF from 'jspdf';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

const RESUME_TEMPLATES = [
  { id: 'ats-clean', name: 'ATS Professional', description: 'Clean single-column standard preferred by FAANG ATS bots' },
  { id: 'modern-blue', name: 'Modern Blue', description: 'Contemporary header banner with stylish accent accents' },
  { id: 'minimal-bw', name: 'Minimal B&W', description: 'Ultra-clean monochromatic typographic layout' },
  { id: 'developer-dark', name: 'Developer Prime', description: 'Terminal-flavored tech resume with code tags' },
  { id: 'fresher-prime', name: 'Fresher Campus', description: 'Education, coursework, and competitive ratings upfront' },
  { id: 'technical-split', name: 'Technical Systems', description: 'Emphasizes software architecture, schemas & metrics' },
  { id: 'executive-serif', name: 'Executive Serif', description: 'Distinguished formal academic and leadership styling' },
  { id: 'modern-two-col', name: 'Modern Two-Column', description: 'Skills & contact in dedicated sidebar, projects in main' }
];

export const ResumeBuilderPage: React.FC = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<any[]>([]);
  const [activeResume, setActiveResume] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('ats-clean');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiTargetRole, setAiTargetRole] = useState<string>('Software Development Engineer');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await api.getResumes();
      setResumes(data);
      if (data.length > 0) {
        setActiveResume(data[0]);
        setSelectedTemplate(data[0].templateId || 'ats-clean');
      } else {
        createNewResume();
      }
    } catch (err) {
      console.error('Failed to load resumes:', err);
    }
  };

  const createNewResume = () => {
    const fresh = {
      id: `resume-${Date.now()}`,
      title: 'Software Engineer Resume',
      templateId: selectedTemplate,
      personalInfo: {
        fullName: user?.name || 'Aarav Sharma',
        email: user?.email || 'student@university.edu',
        phone: '+91 98765 43210',
        location: 'New Delhi, India',
        linkedin: 'https://linkedin.com/in/aarav-sharma',
        github: 'https://github.com/aaravsharma'
      },
      summary: 'Proactive Computer Science undergraduate with hands-on experience in full-stack web applications, relational databases, and algorithmic problem-solving. Solved 300+ problems on competitive programming platforms.',
      education: [
        {
          id: 'edu-1',
          degree: 'B.Tech in Computer Science and Engineering',
          institution: user?.college || 'Delhi Technological University (DTU)',
          year: '2022 - 2026',
          score: 'CGPA: 8.9 / 10.0'
        }
      ],
      skills: [
        { category: 'Programming Languages', items: 'C++, Python, Java, JavaScript, TypeScript, SQL' },
        { category: 'Frameworks & Libraries', items: 'React.js, Node.js, Express.js, Tailwind CSS, REST APIs' },
        { category: 'Developer Tools', items: 'Git, GitHub, Docker, Postman, Linux, VS Code' }
      ],
      experience: [
        {
          id: 'exp-1',
          title: 'Software Developer Intern',
          company: 'Nexus Technologies',
          period: 'June 2025 - August 2025',
          description: 'Engineered RESTful backend microservices in Node.js and TypeScript, reducing API latency by 28%. Implemented secure user authentication and database indexing.'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'SkillSphere: Live Compiler & Learning Platform',
          technologies: 'React, TypeScript, Express, Monaco Editor, Docker',
          link: 'https://github.com/aaravsharma/skillsphere',
          description: 'Architected full-stack web platform enabling sandboxed multi-language code execution. Integrated automated test grading and context-aware AI tutor.'
        }
      ],
      certifications: [
        'AWS Certified Cloud Practitioner (2025)',
        'Meta Front-End Developer Certificate'
      ],
      achievements: [
        'Ranked in top 5% in TCS CodeVita 2025',
        'Solved 300+ Data Structures problems on LeetCode'
      ]
    };
    setActiveResume(fresh);
  };

  const handleSave = async () => {
    if (!activeResume) return;
    try {
      const payload = { ...activeResume, templateId: selectedTemplate };
      if (resumes.some(r => r.id === activeResume.id)) {
        await api.updateResume(activeResume.id, payload);
      } else {
        await api.createResume(payload);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      await loadResumes();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleAiEnhanceSummary = async () => {
    if (!activeResume) return;
    setIsAiLoading(true);
    try {
      const res = await api.aiEnhanceResume('Professional Summary', activeResume.summary, aiTargetRole);
      setActiveResume((prev: any) => ({ ...prev, summary: res.improvedText }));
    } catch (err) {
      console.error('AI Enhance error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleExportPdf = () => {
    window.print();
  };

  if (!activeResume) return null;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Professional Resume Builder
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose from 8 genuinely distinct layouts with AI-powered ATS bullet point enhancement
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {saveSuccess ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Save className="h-3.5 w-3.5 text-cyan-400" />}
              <span>{saveSuccess ? 'Saved!' : 'Save Resume'}</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export PDF / Print</span>
            </button>
          </div>
        </div>

        {/* Template Selector Carousel */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Select Resume Template:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {RESUME_TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedTemplate === tpl.id
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold text-[11px] block truncate">{tpl.name}</span>
                <span className="text-[9px] text-slate-500 line-clamp-1">{tpl.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Studio: Left Editor / Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Editor */}
          <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-800 space-y-6 max-h-[850px] overflow-y-auto">
            {/* AI Assistant Banner */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>AI Resume Assistant</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Gemini 3.8 Flash</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiTargetRole}
                  onChange={e => setAiTargetRole(e.target.value)}
                  placeholder="Target Role (e.g. SDE-1)"
                  className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAiEnhanceSummary}
                  disabled={isAiLoading}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs whitespace-nowrap disabled:opacity-50"
                >
                  {isAiLoading ? 'Improving...' : 'Rewrite Summary'}
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Personal Information
              </h3>
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={activeResume.personalInfo.fullName}
                  onChange={e => setActiveResume({
                    ...activeResume,
                    personalInfo: { ...activeResume.personalInfo, fullName: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={activeResume.personalInfo.email}
                    onChange={e => setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={activeResume.personalInfo.phone}
                    onChange={e => setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Location (City, Country)"
                    value={activeResume.personalInfo.location}
                    onChange={e => setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, location: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={activeResume.personalInfo.linkedin}
                    onChange={e => setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, linkedin: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={activeResume.personalInfo.github}
                  onChange={e => setActiveResume({
                    ...activeResume,
                    personalInfo: { ...activeResume.personalInfo, github: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Professional Summary
              </h3>
              <textarea
                rows={3}
                value={activeResume.summary}
                onChange={e => setActiveResume({ ...activeResume, summary: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white leading-relaxed resize-none"
              />
            </div>

            {/* Education */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Education</h3>
              </div>
              {activeResume.education?.map((edu: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={e => {
                      const updated = [...activeResume.education];
                      updated[i].degree = e.target.value;
                      setActiveResume({ ...activeResume, education: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={e => {
                      const updated = [...activeResume.education];
                      updated[i].institution = e.target.value;
                      setActiveResume({ ...activeResume, education: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Year"
                      value={edu.year}
                      onChange={e => {
                        const updated = [...activeResume.education];
                        updated[i].year = e.target.value;
                        setActiveResume({ ...activeResume, education: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Score / CGPA"
                      value={edu.score}
                      onChange={e => {
                        const updated = [...activeResume.education];
                        updated[i].score = e.target.value;
                        setActiveResume({ ...activeResume, education: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Skills */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Technical Skills</h3>
              {activeResume.skills?.map((sk: any, i: number) => (
                <div key={i} className="space-y-1 text-xs">
                  <input
                    type="text"
                    placeholder="Category"
                    value={sk.category}
                    onChange={e => {
                      const updated = [...activeResume.skills];
                      updated[i].category = e.target.value;
                      setActiveResume({ ...activeResume, skills: updated });
                    }}
                    className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-semibold text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Comma separated items"
                    value={sk.items}
                    onChange={e => {
                      const updated = [...activeResume.skills];
                      updated[i].items = e.target.value;
                      setActiveResume({ ...activeResume, skills: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Key Projects</h3>
              {activeResume.projects?.map((proj: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={e => {
                      const updated = [...activeResume.projects];
                      updated[i].title = e.target.value;
                      setActiveResume({ ...activeResume, projects: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Technologies Used"
                    value={proj.technologies}
                    onChange={e => {
                      const updated = [...activeResume.projects];
                      updated[i].technologies = e.target.value;
                      setActiveResume({ ...activeResume, projects: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]"
                  />
                  <textarea
                    rows={2}
                    placeholder="Project description & metrics"
                    value={proj.description}
                    onChange={e => {
                      const updated = [...activeResume.projects];
                      updated[i].description = e.target.value;
                      setActiveResume({ ...activeResume, projects: updated });
                    }}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-[11px] resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live Formatted Resume Preview */}
          <div className="lg:col-span-7 flex justify-center">
            {/* Simulated A4 Paper */}
            <div
              ref={resumePreviewRef}
              id="printable-resume"
              className={`w-full max-w-[700px] min-h-[900px] p-8 sm:p-10 rounded-2xl shadow-2xl transition-all ${
                selectedTemplate === 'ats-clean'
                  ? 'bg-white text-slate-900 font-sans'
                  : selectedTemplate === 'modern-blue'
                  ? 'bg-slate-50 text-slate-900 font-sans border-t-8 border-indigo-600'
                  : selectedTemplate === 'minimal-bw'
                  ? 'bg-white text-black font-serif'
                  : selectedTemplate === 'developer-dark'
                  ? 'bg-[#0f172a] text-slate-100 font-mono border border-cyan-500/30'
                  : selectedTemplate === 'fresher-prime'
                  ? 'bg-white text-slate-900 font-sans border-t-8 border-emerald-600'
                  : selectedTemplate === 'technical-split'
                  ? 'bg-slate-100 text-slate-900 font-sans'
                  : selectedTemplate === 'executive-serif'
                  ? 'bg-[#fcfbf9] text-stone-900 font-serif'
                  : 'bg-white text-slate-900 font-sans'
              }`}
            >
              {/* RENDER TEMPLATE 1: ATS CLEAN */}
              {selectedTemplate === 'ats-clean' && (
                <div className="space-y-5 text-[11px] leading-relaxed">
                  <div className="text-center border-b pb-3 border-slate-300">
                    <h2 className="text-xl font-bold uppercase tracking-wide text-slate-950">
                      {activeResume.personalInfo.fullName}
                    </h2>
                    <p className="text-slate-600 mt-1">
                      {activeResume.personalInfo.email} • {activeResume.personalInfo.phone} • {activeResume.personalInfo.location}
                    </p>
                    <p className="text-slate-600">
                      {activeResume.personalInfo.linkedin} • {activeResume.personalInfo.github}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                      Professional Summary
                    </h3>
                    <p className="text-slate-700">{activeResume.summary}</p>
                  </div>

                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                      Education
                    </h3>
                    {activeResume.education?.map((edu: any, i: number) => (
                      <div key={i} className="flex justify-between mb-1">
                        <div>
                          <p className="font-bold text-slate-900">{edu.degree}</p>
                          <p className="text-slate-600">{edu.institution}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">{edu.year}</p>
                          <p className="text-slate-600">{edu.score}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                      Technical Skills
                    </h3>
                    {activeResume.skills?.map((sk: any, i: number) => (
                      <p key={i} className="mb-0.5 text-slate-800">
                        <span className="font-bold">{sk.category}: </span>
                        <span>{sk.items}</span>
                      </p>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                      Projects
                    </h3>
                    {activeResume.projects?.map((proj: any, i: number) => (
                      <div key={i} className="mb-2.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-slate-950">{proj.title}</span>
                          <span className="text-[10px] text-slate-600 font-mono">{proj.technologies}</span>
                        </div>
                        <p className="text-slate-700 mt-0.5">{proj.description}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                      Achievements & Certifications
                    </h3>
                    <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                      {activeResume.achievements?.map((ach: string, i: number) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* RENDER TEMPLATE 2: MODERN BLUE */}
              {selectedTemplate === 'modern-blue' && (
                <div className="space-y-5 text-[11px] leading-relaxed">
                  <div className="border-b-2 border-indigo-600 pb-4">
                    <h2 className="text-2xl font-black text-indigo-900">
                      {activeResume.personalInfo.fullName}
                    </h2>
                    <p className="text-slate-600 text-xs mt-1">
                      {activeResume.personalInfo.email} • {activeResume.personalInfo.phone} • {activeResume.personalInfo.location}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-800 mb-1">
                      Professional Summary
                    </h3>
                    <p className="text-slate-700 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                      {activeResume.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-800 mb-1.5">
                      Education
                    </h3>
                    {activeResume.education?.map((edu: any, i: number) => (
                      <div key={i} className="flex justify-between border-l-2 border-indigo-500 pl-3 mb-2">
                        <div>
                          <p className="font-bold text-slate-900">{edu.degree}</p>
                          <p className="text-slate-600">{edu.institution}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-indigo-700">{edu.year}</p>
                          <p className="text-slate-600">{edu.score}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-800 mb-1.5">
                      Key Technical Skills
                    </h3>
                    <div className="space-y-1">
                      {activeResume.skills?.map((sk: any, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-bold text-indigo-900 shrink-0">{sk.category}:</span>
                          <span className="text-slate-700">{sk.items}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-800 mb-1.5">
                      Software Engineering Projects
                    </h3>
                    {activeResume.projects?.map((proj: any, i: number) => (
                      <div key={i} className="mb-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-900">{proj.title}</span>
                          <span className="text-[10px] text-indigo-600 font-mono font-semibold">{proj.technologies}</span>
                        </div>
                        <p className="text-slate-700 mt-1">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RENDER TEMPLATE 4: DEVELOPER DARK */}
              {selectedTemplate === 'developer-dark' && (
                <div className="space-y-5 text-[11px] leading-relaxed">
                  <div className="border-b border-cyan-500/40 pb-3 font-mono">
                    <p className="text-cyan-400 text-xs">$ whoami</p>
                    <h2 className="text-xl font-bold text-white mt-1">
                      {activeResume.personalInfo.fullName}
                    </h2>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      {activeResume.personalInfo.email} | {activeResume.personalInfo.phone} | {activeResume.personalInfo.github}
                    </p>
                  </div>

                  <div>
                    <p className="text-emerald-400 text-[10px] font-mono">// Summary</p>
                    <p className="text-slate-300 mt-1">{activeResume.summary}</p>
                  </div>

                  <div>
                    <p className="text-emerald-400 text-[10px] font-mono">// Tech Stack</p>
                    <div className="mt-1 space-y-1">
                      {activeResume.skills?.map((sk: any, i: number) => (
                        <div key={i}>
                          <span className="text-cyan-300">{sk.category}: </span>
                          <span className="text-slate-300">{sk.items}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-emerald-400 text-[10px] font-mono">// Featured Repositories</p>
                    <div className="mt-2 space-y-2">
                      {activeResume.projects?.map((proj: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="flex justify-between text-white font-bold">
                            <span>{proj.title}</span>
                            <span className="text-cyan-400 text-[10px]">{proj.technologies}</span>
                          </div>
                          <p className="text-slate-400 text-[10px] mt-1">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER TEMPLATE 8: MODERN TWO-COLUMN */}
              {(selectedTemplate === 'modern-two-col' || selectedTemplate === 'minimal-bw' || selectedTemplate === 'fresher-prime' || selectedTemplate === 'technical-split' || selectedTemplate === 'executive-serif') && (
                <div className="grid grid-cols-12 gap-6 text-[11px] leading-relaxed">
                  {/* Left Column */}
                  <div className="col-span-4 border-r border-slate-200 pr-4 space-y-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">
                        {activeResume.personalInfo.fullName}
                      </h2>
                      <p className="text-slate-600 text-[10px] mt-1">{activeResume.personalInfo.location}</p>
                      <p className="text-slate-600 text-[10px]">{activeResume.personalInfo.email}</p>
                      <p className="text-slate-600 text-[10px]">{activeResume.personalInfo.phone}</p>
                    </div>

                    <div>
                      <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-900 border-b pb-0.5 mb-1.5">
                        Technical Skills
                      </h3>
                      {activeResume.skills?.map((sk: any, i: number) => (
                        <div key={i} className="mb-2">
                          <span className="font-semibold text-slate-900 block text-[10px]">{sk.category}</span>
                          <span className="text-slate-600 text-[10px]">{sk.items}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-900 border-b pb-0.5 mb-1.5">
                        Education
                      </h3>
                      {activeResume.education?.map((edu: any, i: number) => (
                        <div key={i} className="mb-2">
                          <p className="font-bold text-slate-900 text-[10px]">{edu.degree}</p>
                          <p className="text-slate-600 text-[10px]">{edu.institution}</p>
                          <p className="text-slate-500 text-[9px]">{edu.year} • {edu.score}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-span-8 space-y-4">
                    <div>
                      <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-900 border-b pb-0.5 mb-1">
                        Professional Summary
                      </h3>
                      <p className="text-slate-700 leading-relaxed">{activeResume.summary}</p>
                    </div>

                    <div>
                      <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-900 border-b pb-0.5 mb-1.5">
                        Software Projects
                      </h3>
                      {activeResume.projects?.map((proj: any, i: number) => (
                        <div key={i} className="mb-2.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-slate-950">{proj.title}</span>
                            <span className="text-[10px] text-indigo-700 font-mono">{proj.technologies}</span>
                          </div>
                          <p className="text-slate-700 text-[10px] mt-0.5">{proj.description}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-900 border-b pb-0.5 mb-1">
                        Achievements & Honors
                      </h3>
                      <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[10px]">
                        {activeResume.achievements?.map((ach: string, i: number) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
