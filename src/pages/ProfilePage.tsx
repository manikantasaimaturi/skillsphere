import React, { useState, useEffect } from 'react';
import {
  User,
  School,
  BookOpen,
  Calendar,
  Flame,
  Award,
  CheckCircle,
  Save,
  Check,
  Target,
  FileText
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    branch: user?.branch || '',
    graduationYear: user?.graduationYear || 2026,
    targetRole: user?.targetRole || 'Full Stack Software Engineer'
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        branch: user.branch || '',
        graduationYear: user.graduationYear || 2026,
        targetRole: user.targetRole || 'Full Stack Software Engineer'
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await api.updateProfile(formData);
      updateUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const ACHIEVEMENTS = [
    { title: '14-Day Learning Streak', desc: 'Maintained consecutive daily practice in SkillSphere', icon: Flame, color: 'text-amber-400 bg-amber-500/10' },
    { title: 'Coding Practice Milestone', desc: 'Ran verified algorithms in sandboxed compiler', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10' },
    { title: 'Diagnostic Assessment Completed', desc: 'Analyzed skill gap against dream corporate role', icon: Target, color: 'text-cyan-400 bg-cyan-500/10' },
    { title: 'Resume Architect', desc: 'Engineered ATS-compliant resume with Google action verbs', icon: FileText, color: 'text-indigo-400 bg-indigo-500/10' }
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-3xl text-white shadow-xl shadow-cyan-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold font-heading text-white">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] capitalize">
                {user?.role} Account
              </span>
            </div>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <p className="text-xs text-slate-400">
              {user?.college} • Class of {user?.graduationYear || 2026}
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs shrink-0">
            <Flame className="h-4 w-4 fill-amber-400" />
            <span>{user?.streakDays || 14} Day Streak</span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white font-heading">
              Academic & Placement Information
            </h2>
            {saveSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="h-3.5 w-3.5" />
                <span>Profile updated successfully!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Full Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Target Placement Role:</label>
                <select
                  value={formData.targetRole}
                  onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                >
                  <option value="Full Stack Software Engineer">Full Stack SDE</option>
                  <option value="SDE-1 (Amazon/Google)">SDE-1 (Tier 1 Product)</option>
                  <option value="AI & Machine Learning Engineer">AI / ML Engineer</option>
                  <option value="Backend Developer (Node/Java)">Backend Developer</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 font-medium">College / Institute:</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={e => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Graduation Year:</label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={e => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Branch / Specialization:</label>
              <input
                type="text"
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Achievements Badges */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white font-heading">
            Earned Platform Badges & Milestones
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((ach, idx) => {
              const Icon = ach.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${ach.color} shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white">{ach.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ach.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
