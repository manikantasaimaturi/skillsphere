import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
        {/* Brand */}
        <div className="md:col-span-2 space-y-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-slate-950">
                <BrainCircuit className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-lg font-bold text-white font-heading">SkillSphere</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            The complete B.Tech Computer Science learning, live coding compiler, AI tutoring, and placement preparation ecosystem.
            Empowering engineers to master fundamentals and secure dream careers.
          </p>
          <div className="text-xs text-slate-500">
            Learn Concepts. Practice Skills. Build Projects. Get Placed.
          </div>
        </div>

        {/* Column 1: Core Curriculum */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
            Core Curriculum
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/courses" className="hover:text-cyan-400 transition-colors">Data Structures & Algo</Link></li>
            <li><Link to="/courses" className="hover:text-cyan-400 transition-colors">Python & C++ Mastery</Link></li>
            <li><Link to="/courses" className="hover:text-cyan-400 transition-colors">DBMS & SQL Architecture</Link></li>
            <li><Link to="/courses" className="hover:text-cyan-400 transition-colors">Operating Systems</Link></li>
            <li><Link to="/courses" className="hover:text-cyan-400 transition-colors">Computer Networks</Link></li>
          </ul>
        </div>

        {/* Column 2: Practice & Tools */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
            Practice & Tools
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/compiler" className="hover:text-cyan-400 transition-colors">Live Monaco Compiler</Link></li>
            <li><Link to="/assessments" className="hover:text-cyan-400 transition-colors">500+ MCQ Assessments</Link></li>
            <li><Link to="/ai-mentor" className="hover:text-cyan-400 transition-colors">Gemini AI Tutor</Link></li>
            <li><Link to="/skill-assessment" className="hover:text-cyan-400 transition-colors">Skill Gap Diagnostic</Link></li>
            <li><Link to="/projects" className="hover:text-cyan-400 transition-colors">Project Hub Blueprints</Link></li>
          </ul>
        </div>

        {/* Column 3: Placement & Career */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
            Placement Prep
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/placement" className="hover:text-cyan-400 transition-colors">TCS & Infosys Guides</Link></li>
            <li><Link to="/placement" className="hover:text-cyan-400 transition-colors">Amazon & Google Tracks</Link></li>
            <li><Link to="/placement" className="hover:text-cyan-400 transition-colors">Quantitative Aptitude</Link></li>
            <li><Link to="/placement" className="hover:text-cyan-400 transition-colors">HR Interview Frameworks</Link></li>
            <li><Link to="/resume-builder" className="hover:text-cyan-400 transition-colors">8 ATS Resume Templates</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 SkillSphere Platform. B.Tech Computer Science & Engineering Final Project.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            Engineered with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for CSE Students
          </span>
          <span className="text-slate-500">•</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-white"
          >
            <Github className="h-3.5 w-3.5" />
            <span>Open Source</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
