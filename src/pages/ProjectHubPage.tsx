import React, { useState, useEffect } from 'react';
import {
  Layers,
  Code2,
  Database,
  CheckCircle,
  ExternalLink,
  Github,
  Plus,
  Sparkles,
  ChevronRight,
  Save,
  Check
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const ProjectHubPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [statusInput, setStatusInput] = useState<string>('In Progress');
  const [githubUrlInput, setGithubUrlInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    loadProjectHub();
  }, []);

  const loadProjectHub = async () => {
    setLoading(true);
    try {
      const [projs, tracked] = await Promise.all([
        api.getProjects(),
        user ? api.getMyProjects() : Promise.resolve([])
      ]);
      setProjects(projs);
      setMyProjects(tracked);
      if (projs.length > 0) {
        selectProject(projs[0], tracked);
      }
    } catch (err) {
      console.error('Failed to load project hub:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectProject = (proj: any, trackedList = myProjects) => {
    setSelectedProject(proj);
    const existing = trackedList.find((p: any) => p.projectId === proj.id);
    if (existing) {
      setStatusInput(existing.status);
      setGithubUrlInput(existing.githubUrl || '');
      setNotesInput(existing.notes || '');
    } else {
      setStatusInput('Planned');
      setGithubUrlInput('');
      setNotesInput('');
    }
  };

  const handleSaveTracking = async () => {
    if (!selectedProject || !user) return;
    try {
      await api.trackProject({
        projectId: selectedProject.id,
        status: statusInput,
        githubUrl: githubUrlInput,
        notes: notesInput
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      const updated = await api.getMyProjects();
      setMyProjects(updated);
    } catch (err) {
      console.error('Failed to update project status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800/80 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>Capstone & Portfolio Project Blueprints</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Project Hub & Progress Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Real-world system designs, database schemas, feature specifications, and personal GitHub progress tracking for B.Tech CSE students.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Project Cards List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1">
              Recommended Project Blueprints
            </span>
            {projects.map(proj => {
              const isTracked = myProjects.find(p => p.projectId === proj.id);
              const isSelected = selectedProject?.id === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => selectProject(proj)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/20 text-white shadow-lg'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{proj.category}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      proj.difficulty === 'Beginner' ? 'text-emerald-400 bg-emerald-500/10' :
                      proj.difficulty === 'Intermediate' ? 'text-indigo-400 bg-indigo-500/10' :
                      'text-purple-400 bg-purple-500/10'
                    }`}>
                      {proj.difficulty}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs leading-snug">{proj.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{proj.description}</p>

                  {isTracked && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                      <span>Status: {isTracked.status}</span>
                      {isTracked.githubUrl && <span className="underline">Repo Linked</span>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Blueprint & GitHub Tracker */}
          <div className="lg:col-span-8 space-y-6">
            {selectedProject ? (
              <>
                <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded uppercase">
                      {selectedProject.category} • {selectedProject.difficulty}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    {selectedProject.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedProject.description}
                  </p>

                  {/* Tech stack badges */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">
                      Required Technology Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies?.map((t: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Features & Architecture */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-emerald-400" />
                      <span>Key Engineering Features</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedProject.keyFeatures?.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Database className="h-4 w-4 text-indigo-400" />
                      <span>Database Relational Schemas</span>
                    </h3>
                    <div className="space-y-2 font-mono text-[11px] text-slate-300">
                      {selectedProject.databaseSchema?.map((sch: string, i: number) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                          {sch}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Personal Progress Tracker & GitHub submission */}
                <div className="glass-card p-6 rounded-2xl border border-cyan-800/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Github className="h-4 w-4 text-cyan-400" />
                      <span>My Project Tracker & GitHub Submission</span>
                    </h3>
                    {saveSuccess && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                        <Check className="h-3.5 w-3.5" />
                        <span>Saved Successfully!</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Project Status:</label>
                      <select
                        value={statusInput}
                        onChange={e => setStatusInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">GitHub Repository Link:</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username/repository"
                        value={githubUrlInput}
                        onChange={e => setGithubUrlInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Implementation Notes:</label>
                    <textarea
                      rows={2}
                      placeholder="Record architectural decisions, blockers, or milestone notes..."
                      value={notesInput}
                      onChange={e => setNotesInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveTracking}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Project Progress</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-500">Select a project blueprint to view architecture.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
