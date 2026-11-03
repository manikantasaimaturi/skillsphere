
import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

const RESUME_TEMPLATES = [
  { id: 'ats-clean', name: 'ATS Professional', description: 'Clean single-column standard preferred by ATS systems' },
  { id: 'modern-blue', name: 'Modern Blue', description: 'Contemporary header banner with stylish accents' },
  { id: 'minimal-bw', name: 'Minimal B&W', description: 'Ultra-clean monochromatic layout' },
  { id: 'developer-dark', name: 'Developer Prime', description: 'Terminal-flavored tech resume' },
  { id: 'fresher-prime', name: 'Fresher Campus', description: 'Education and coursework focused layout' },
  { id: 'technical-split', name: 'Technical Systems', description: 'Emphasizes software architecture and skills' },
  { id: 'executive-serif', name: 'Executive Serif', description: 'Formal academic and leadership styling' },
  { id: 'modern-two-col', name: 'Modern Two-Column', description: 'Skills sidebar with projects in main column' }
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

      summary:
        'Proactive Computer Science undergraduate with hands-on experience in full-stack web applications, relational databases, and algorithmic problem-solving.',

      education: [
        {
          id: 'edu-1',
          degree: 'B.Tech in Computer Science and Engineering',
          institution: user?.college || 'University Name',
          year: '2022 - 2026',
          score: 'CGPA: 8.9 / 10.0'
        }
      ],

      skills: [
        {
          category: 'Programming Languages',
          items: 'C++, Python, Java, JavaScript, TypeScript, SQL'
        },
        {
          category: 'Frameworks & Libraries',
          items: 'React.js, Node.js, Express.js, REST APIs'
        },
        {
          category: 'Developer Tools',
          items: 'Git, GitHub, Docker, Postman, Linux, VS Code'
        }
      ],

      experience: [
        {
          id: 'exp-1',
          title: 'Software Developer Intern',
          company: 'Nexus Technologies',
          period: 'June 2025 - August 2025',
          description:
            'Developed REST APIs using Node.js and TypeScript.'
        }
      ],

      projects: [
        {
          id: 'proj-1',
          title: 'SkillSphere: Student Skill Platform',
          technologies: 'React, TypeScript, Express, MongoDB',
          link: '',
          description:
            'Developed a full-stack student learning and skill development platform.'
        }
      ],

      certifications: [
        'AWS Certified Cloud Practitioner',
        'Meta Front-End Developer Certificate'
      ],

      achievements: [
        'Participated in coding competitions',
        'Solved Data Structures problems'
      ]
    };

    setActiveResume(fresh);
  };

  const handleSave = async () => {
    if (!activeResume) return;

    try {
      const payload = {
        ...activeResume,
        templateId: selectedTemplate
      };

      if (resumes.some(r => r.id === activeResume.id)) {
        await api.updateResume(activeResume.id, payload);
      } else {
        await api.createResume(payload);
      }

      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 2500);

      await loadResumes();
    } catch (err) {
      console.error('Save error:', err);
      alert('Unable to save resume. Please try again.');
    }
  };

  const handleAiEnhanceSummary = async () => {
    if (!activeResume) return;

    setIsAiLoading(true);

    try {
      const res = await api.aiEnhanceResume(
        'Professional Summary',
        activeResume.summary,
        aiTargetRole
      );

      setActiveResume((prev: any) => ({
        ...prev,
        summary: res.improvedText
      }));
    } catch (err) {
      console.error('AI Enhance error:', err);
      alert('Unable to contact AI. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleExportPdf = () => {
    window.print();
  };

  if (!activeResume) return null;

  return (
    <>
      {/* PRINT STYLES */}
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 12mm;
            }

            html,
            body {
              width: 100% !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              overflow: visible !important;
            }

            body * {
              visibility: hidden !important;
            }

            #printable-resume,
            #printable-resume * {
              visibility: visible !important;
            }

            #printable-resume {
              display: block !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: none !important;
              min-height: 0 !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              transform: none !important;
              overflow: visible !important;
              background: white !important;
              color: black !important;
            }

            #printable-resume * {
              overflow: visible !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            #printable-resume h2,
            #printable-resume h3 {
              page-break-after: avoid;
              break-after: avoid;
            }

            #printable-resume p,
            #printable-resume li {
              orphans: 3;
              widows: 3;
            }

            button,
            input,
            textarea {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER AND ACTIONS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" />

                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Professional Resume Builder
                </h1>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Create your professional resume with AI-powered enhancement.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-2"
              >
                <Save className="h-3.5 w-3.5 text-cyan-400" />
                {saveSuccess ? 'Saved!' : 'Save Resume'}
              </button>

              <button
                onClick={handleExportPdf}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                Export PDF / Print
              </button>
            </div>
          </div>

          {/* TEMPLATE SELECTOR */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Resume Template
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {RESUME_TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`p-2.5 rounded-xl border text-left ${
                    selectedTemplate === tpl.id
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-[11px] block">
                    {tpl.name}
                  </span>

                  <span className="text-[9px] text-slate-500">
                    {tpl.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* EDITOR AND PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT EDITOR */}
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-800 space-y-6 max-h-[850px] overflow-y-auto">

              {/* AI ASSISTANT */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    AI Resume Assistant
                  </span>

                  <span className="text-[10px] font-mono text-cyan-400">
                    Gemini AI
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aiTargetRole}
                    onChange={e => setAiTargetRole(e.target.value)}
                    placeholder="Target Role"
                    className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />

                  <button
                    type="button"
                    onClick={handleAiEnhanceSummary}
                    disabled={isAiLoading}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-xs disabled:opacity-50"
                  >
                    {isAiLoading ? 'Improving...' : 'Rewrite Summary'}
                  </button>
                </div>
              </div>

              {/* PERSONAL INFORMATION */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase">
                  Personal Information
                </h3>

                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={activeResume.personalInfo.fullName}
                    onChange={e =>
                      setActiveResume({
                        ...activeResume,
                        personalInfo: {
                          ...activeResume.personalInfo,
                          fullName: e.target.value
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      placeholder="Email"
                      value={activeResume.personalInfo.email}
                      onChange={e =>
                        setActiveResume({
                          ...activeResume,
                          personalInfo: {
                            ...activeResume.personalInfo,
                            email: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />

                    <input
                      type="text"
                      placeholder="Phone"
                      value={activeResume.personalInfo.phone}
                      onChange={e =>
                        setActiveResume({
                          ...activeResume,
                          personalInfo: {
                            ...activeResume.personalInfo,
                            phone: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Location"
                      value={activeResume.personalInfo.location}
                      onChange={e =>
                        setActiveResume({
                          ...activeResume,
                          personalInfo: {
                            ...activeResume.personalInfo,
                            location: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />

                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      value={activeResume.personalInfo.linkedin}
                      onChange={e =>
                        setActiveResume({
                          ...activeResume,
                          personalInfo: {
                            ...activeResume.personalInfo,
                            linkedin: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="GitHub URL"
                    value={activeResume.personalInfo.github}
                    onChange={e =>
                      setActiveResume({
                        ...activeResume,
                        personalInfo: {
                          ...activeResume.personalInfo,
                          github: e.target.value
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>

              {/* SUMMARY */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase">
                  Professional Summary
                </h3>

                <textarea
                  rows={3}
                  value={activeResume.summary}
                  onChange={e =>
                    setActiveResume({
                      ...activeResume,
                      summary: e.target.value
                    })
                  }
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              {/* EDUCATION */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase">
                  Education
                </h3>

                {activeResume.education?.map((edu: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                  >
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={e => {
                        const updated = [...activeResume.education];
                        updated[i] = {
                          ...updated[i],
                          degree: e.target.value
                        };
                        setActiveResume({
                          ...activeResume,
                          education: updated
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />

                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={e => {
                        const updated = [...activeResume.education];
                        updated[i] = {
                          ...updated[i],
                          institution: e.target.value
                        };
                        setActiveResume({
                          ...activeResume,
                          education: updated
                        });
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
                          updated[i] = {
                            ...updated[i],
                            year: e.target.value
                          };
                          setActiveResume({
                            ...activeResume,
                            education: updated
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />

                      <input
                        type="text"
                        placeholder="Score / CGPA"
                        value={edu.score}
                        onChange={e => {
                          const updated = [...activeResume.education];
                          updated[i] = {
                            ...updated[i],
                            score: e.target.value
                          };
                          setActiveResume({
                            ...activeResume,
                            education: updated
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* TECHNICAL SKILLS */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase">
                  Technical Skills
                </h3>

                {activeResume.skills?.map((sk: any, i: number) => (
                  <div key={i} className="space-y-1 text-xs">
                    <input
                      type="text"
                      placeholder="Category"
                      value={sk.category}
                      onChange={e => {
                        const updated = [...activeResume.skills];
                        updated[i] = {
                          ...updated[i],
                          category: e.target.value
                        };
                        setActiveResume({
                          ...activeResume,
                          skills: updated
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300"
                    />

                    <input
                      type="text"
                      placeholder="Skills"
                      value={sk.items}
                      onChange={e => {
                        const updated = [...activeResume.skills];
                        updated[i] = {
                          ...updated[i],
                          items: e.target.value
                        };
                        setActiveResume({
                          ...activeResume,
                          skills: updated
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                ))}
              </div>

              {/* PROJECTS */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase">
                  Key Projects
                </h3>

                {activeResume.projects?.map((proj: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                  >
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={e => {
                        const updated = [...activeResume.projects];
                        updated[i] = {
                          ...updated[i],
                          title: e.target.value
                        };
                        setActiveResume({
                          ...activeResume,
                          projects: updated
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />

                    <input
                      type="text"
                      placeholder="Technologies Used"
                      value={proj.technologies}
                      onChange={e => {
                        const updated = [...activeResume.projects];
                        updated[i] = {
                          ...updated[i],
                          technologies: e.target.value
                        };
                        setActiveResume({
                          ...activeResume,
                          projects: updated
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400"
                    />

                    <textarea
                      rows={2}
                      placeholder="Project Description"
                      value={proj.description}
                      onChange={e => {
                        const updated = [...activeResume.projects];
                        updated[i] = {
                          ...updated[i],
                          description: e.target.value
                        };
                        setActiveResume({
                          ...activeResume,
                          projects: updated
                        });
                      }}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: RESUME PREVIEW */}
            <div className="lg:col-span-7 flex justify-center">
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

                {/* TEMPLATE 1: ATS CLEAN */}
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
                      <h3 className="font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                        Professional Summary
                      </h3>
                      <p className="text-slate-700">{activeResume.summary}</p>
                    </div>

                    <div>
                      <h3 className="font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                        Education
                      </h3>

                      {activeResume.education?.map((edu: any, i: number) => (
                        <div key={i} className="flex justify-between mb-1">
                          <div>
                            <p className="font-bold">{edu.degree}</p>
                            <p className="text-slate-600">{edu.institution}</p>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">{edu.year}</p>
                            <p className="text-slate-600">{edu.score}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                        Technical Skills
                      </h3>

                      {activeResume.skills?.map((sk: any, i: number) => (
                        <p key={i} className="mb-0.5">
                          <span className="font-bold">{sk.category}: </span>
                          {sk.items}
                        </p>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                        Projects
                      </h3>

                      {activeResume.projects?.map((proj: any, i: number) => (
                        <div key={i} className="mb-2.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold">{proj.title}</span>
                            <span className="text-[10px] text-slate-600">
                              {proj.technologies}
                            </span>
                          </div>

                          <p className="text-slate-700 mt-0.5">
                            {proj.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                        Achievements & Certifications
                      </h3>

                      <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                        {activeResume.achievements?.map((ach: string, i: number) => (
                          <li key={i}>{ach}</li>
                        ))}

                        {activeResume.certifications?.map((cert: string, i: number) => (
                          <li key={`cert-${i}`}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* TEMPLATE 2: MODERN BLUE */}
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

                      <p className="text-slate-700 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
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

                      {activeResume.skills?.map((sk: any, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-bold text-indigo-900">
                            {sk.category}:
                          </span>
                          <span className="text-slate-700">{sk.items}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-800 mb-1.5">
                        Software Projects
                      </h3>

                      {activeResume.projects?.map((proj: any, i: number) => (
                        <div key={i} className="mb-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <p className="font-bold text-slate-900">{proj.title}</p>
                          <p className="text-[10px] text-indigo-600">{proj.technologies}</p>
                          <p className="text-slate-700 mt-1">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TEMPLATE 3: DEVELOPER DARK */}
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
                      <p className="text-emerald-400 text-[10px] font-mono">
                        // Summary
                      </p>
                      <p className="text-slate-300 mt-1">{activeResume.summary}</p>
                    </div>

                    <div>
                      <p className="text-emerald-400 text-[10px] font-mono">
                        // Tech Stack
                      </p>

                      {activeResume.skills?.map((sk: any, i: number) => (
                        <div key={i}>
                          <span className="text-cyan-300">{sk.category}: </span>
                          <span className="text-slate-300">{sk.items}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-emerald-400 text-[10px] font-mono">
                        // Featured Projects
                      </p>

                      {activeResume.projects?.map((proj: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <p className="font-bold text-white">{proj.title}</p>
                          <p className="text-cyan-400 text-[10px]">{proj.technologies}</p>
                          <p className="text-slate-400 text-[10px] mt-1">
                            {proj.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TEMPLATE 4-8: MULTI-COLUMN / MINIMAL */}
                {(selectedTemplate === 'modern-two-col' ||
                  selectedTemplate === 'minimal-bw' ||
                  selectedTemplate === 'fresher-prime' ||
                  selectedTemplate === 'technical-split' ||
                  selectedTemplate === 'executive-serif') && (
                  <div className="grid grid-cols-12 gap-6 text-[11px] leading-relaxed">

                    <div className="col-span-4 border-r border-slate-200 pr-4 space-y-4">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          {activeResume.personalInfo.fullName}
                        </h2>

                        <p className="text-slate-600 text-[10px] mt-1">
                          {activeResume.personalInfo.location}
                        </p>

                        <p className="text-slate-600 text-[10px]">
                          {activeResume.personalInfo.email}
                        </p>

                        <p className="text-slate-600 text-[10px]">
                          {activeResume.personalInfo.phone}
                        </p>

                        <p className="text-slate-600 text-[10px]">
                          {activeResume.personalInfo.linkedin}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-900 border-b pb-1 mb-2">
                          Technical Skills
                        </h3>

                        {activeResume.skills?.map((sk: any, i: number) => (
                          <div key={i} className="mb-2">
                            <span className="font-semibold text-slate-900 block">
                              {sk.category}
                            </span>
                            <span className="text-slate-600">{sk.items}</span>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-900 border-b pb-1 mb-2">
                          Education
                        </h3>

                        {activeResume.education?.map((edu: any, i: number) => (
                          <div key={i} className="mb-2">
                            <p className="font-bold text-slate-900">{edu.degree}</p>
                            <p className="text-slate-600">{edu.institution}</p>
                            <p className="text-slate-500">{edu.year} • {edu.score}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-8 space-y-4">
                      <div>
                        <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-900 border-b pb-1 mb-2">
                          Professional Summary
                        </h3>

                        <p className="text-slate-700 leading-relaxed">
                          {activeResume.summary}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-900 border-b pb-1 mb-2">
                          Software Projects
                        </h3>

                        {activeResume.projects?.map((proj: any, i: number) => (
                          <div key={i} className="mb-2.5">
                            <p className="font-bold text-slate-950">{proj.title}</p>
                            <p className="text-[10px] text-indigo-700">{proj.technologies}</p>
                            <p className="text-slate-700 text-[10px] mt-0.5">
                              {proj.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h3 className="font-bold uppercase text-[10px] tracking-wider text-slate-900 border-b pb-1 mb-2">
                          Achievements & Certifications
                        </h3>

                        <ul className="list-disc pl-4 text-slate-700 space-y-1">
                          {activeResume.achievements?.map((ach: string, i: number) => (
                            <li key={i}>{ach}</li>
                          ))}

                          {activeResume.certifications?.map((cert: string, i: number) => (
                            <li key={`cert-${i}`}>{cert}</li>
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
    </>
  );
};
