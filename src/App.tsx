import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';

// Pages
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { CourseLibraryPage } from './pages/CourseLibraryPage.tsx';
import { CourseDetailPage } from './pages/CourseDetailPage.tsx';
import { TopicLearningPage } from './pages/TopicLearningPage.tsx';
import { CodingCompilerPage } from './pages/CodingCompilerPage.tsx';
import { AssessmentsPage } from './pages/AssessmentsPage.tsx';
import { AiMentorPage } from './pages/AiMentorPage.tsx';
import { PlacementPage } from './pages/PlacementPage.tsx';
import { SkillAssessmentPage } from './pages/SkillAssessmentPage.tsx';
import { RoadmapsPage } from './pages/RoadmapsPage.tsx';
import { ProjectHubPage } from './pages/ProjectHubPage.tsx';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false
}) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="animate-spin h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full mb-2" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/courses" element={<CourseLibraryPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/learn/:courseId/topic/:topicId" element={<TopicLearningPage />} />
              <Route path="/compiler" element={<CodingCompilerPage />} />
              <Route path="/assessments" element={<AssessmentsPage />} />
              <Route path="/placement" element={<PlacementPage />} />
              <Route path="/roadmaps" element={<RoadmapsPage />} />
              <Route path="/projects" element={<ProjectHubPage />} />

              {/* Student Authenticated Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-mentor"
                element={
                  <ProtectedRoute>
                    <AiMentorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skill-assessment"
                element={
                  <ProtectedRoute>
                    <SkillAssessmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume-builder"
                element={
                  <ProtectedRoute>
                    <ResumeBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
