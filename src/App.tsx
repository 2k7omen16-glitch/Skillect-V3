import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import { Loader2 } from 'lucide-react'

// Lazy Load Pages for Optimization
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Opportunities = lazy(() => import('./pages/Opportunities'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const Assessment = lazy(() => import('./pages/Assessment'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const Mentors = lazy(() => import('./pages/Mentors'))
const MentorMatch = lazy(() => import('./pages/MentorMatch'))
const DoubtBox = lazy(() => import('./pages/DoubtBox'))
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'))
const ATSChecker = lazy(() => import('./pages/ATSChecker'))
const Profile = lazy(() => import('./pages/Profile'))
const ProfessorDashboard = lazy(() => import('./pages/ProfessorDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AlumniDashboard = lazy(() => import('./pages/AlumniDashboard'))

const StudentLayout = lazy(() => import('./components/layout/StudentLayout'))

// Loading Spinner for Suspense
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-[#E31E24] animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing Page (No Global Layout Footer if needed, but we'll use Layout) */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        
        {/* Login Page (No Global Layout) */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/onboarding" element={<Layout><Onboarding /></Layout>} />

        {/* Student Routes - Persistent Layout */}
        <Route path="/student/*" element={
          <ProtectedRoute allowedRole="student">
            <StudentLayout>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="opportunities" element={<Opportunities />} />
                <Route path="assessment" element={<Assessment />} />
                <Route path="assessment/:id" element={<Assessment />} />
                <Route path="roadmap" element={<Roadmap />} />
                <Route path="mentors" element={<Mentors />} />
                <Route path="mentor-match" element={<MentorMatch />} />
                <Route path="doubt-box" element={<DoubtBox />} />
                <Route path="resume" element={<ResumeBuilder />} />
                <Route path="ats-checker" element={<ATSChecker />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </StudentLayout>
          </ProtectedRoute>
        } />

        {/* Professor Routes */}
        <Route path="/professor/dashboard" element={
          <ProtectedRoute allowedRole="professor">
            <Layout><ProfessorDashboard /></Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Alumni Routes */}
        <Route path="/alumni/dashboard" element={
          <ProtectedRoute allowedRole="alumni">
            <AlumniDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Suspense>
  )
}
