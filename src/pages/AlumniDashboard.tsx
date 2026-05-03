import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Briefcase, MessageSquare, 
  Bell, GraduationCap, Building2, 
  CheckCircle, ExternalLink, 
  Sparkles, LogOut, TrendingUp, Award, Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// --- FAKE DATA FOR PRESENTATION ---
const MOCK_ANNOUNCEMENTS = [
  { id: 'a1', title: 'Global Alumni Meet 2026', content: 'Join us for the biggest alumni gathering of the year on campus. Reconnect with old friends and see how NIET has transformed.', audience: 'alumni', created_at: new Date().toISOString() },
  { id: 'a2', title: 'Mentor a Capstone Project', content: 'Share your industry expertise by mentoring final year students on their capstone projects. Your guidance can shape future careers.', audience: 'alumni', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'a3', title: 'NIET Innovation Awards', content: 'Nominations are open for the prestigious NIET Innovation Awards. Recognizing alumni who have made significant impacts in tech.', audience: 'all', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'a4', title: 'Recruit from NIET', content: 'Our 2026 batch is placement-ready! If your company is hiring, consider our highly skilled students for your next technical roles.', audience: 'alumni', created_at: new Date(Date.now() - 259200000).toISOString() }
]

const MOCK_REQUESTS = [
  { id: 'r1', student: 'Aman Verma', branch: 'CSE', topic: 'SQL Performance Tuning', time: '2h ago' },
  { id: 'r2', student: 'Ishita Roy', branch: 'IT', topic: 'Career in Data Science', time: '5h ago' },
  { id: 'r3', student: 'Karan Singh', branch: 'CSE', topic: 'Mock Interview Prep', time: 'Yesterday' }
]

const MOCK_JOBS = [
  { id: 'j1', company: 'Google', role: 'SDE II', location: 'Remote / Bangalore', salary: '32-45 LPA' },
  { id: 'j2', company: 'Microsoft', role: 'AI Researcher', location: 'Hyderabad', salary: '28-40 LPA' },
  { id: 'j3', company: 'Amazon', role: 'Cloud Architect', location: 'Seattle / Dublin', salary: '$140k+' }
]

export default function AlumniDashboard() {
  const { userData, logoutDemo } = useAuth()
  const navigate = useNavigate()
  const [announcements] = useState<any[]>(MOCK_ANNOUNCEMENTS)

  useEffect(() => {
    // In real app, fetch from Supabase
    // fetchData()
  }, [])



  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-[#1e293b] text-white pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#E31E24] to-[#ff6b6b] flex items-center justify-center font-black text-4xl shadow-2xl border-4 border-white/10 relative group">
              {userData?.name?.charAt(0) || 'A'}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[#1e293b] flex items-center justify-center">
                <CheckCircle size={14} className="text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black tracking-tight">{userData?.name || 'Alumni Member'}</h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1">
                  Verified Alumni
                </span>
              </div>
              <p className="text-gray-400 font-medium flex items-center gap-2">
                <GraduationCap size={16} /> NIET Class of {userData?.year || '2023'} · {userData?.branch || 'Computer Science'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all backdrop-blur-md border border-white/10 flex items-center gap-2 group">
              <MessageSquare size={16} className="group-hover:rotate-12 transition-transform" /> Mentorship Portal
            </button>
            <button 
              onClick={() => { logoutDemo(); navigate('/login'); }}
              className="bg-[#E31E24] hover:bg-[#c41a20] px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-900/20 flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-6">
              <StatCard icon={<Users className="text-blue-500" />} label="Students Guided" value="12" sub="Across 3 batches" color="blue" />
              <StatCard icon={<TrendingUp className="text-[#E31E24]" />} label="Impact Score" value="940" sub="Top 5% Mentor" color="red" />
              <StatCard icon={<Award className="text-amber-500" />} label="Sessions" value="26" sub="Total hours shared" color="amber" />
            </div>

            {/* Mentorship Requests */}
            <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50">
                <h2 className="text-xl font-black text-[#1e293b] flex items-center gap-3">
                  <Zap className="text-[#E31E24]" /> Active Mentorship Requests
                </h2>
                <span className="bg-red-50 text-[#E31E24] text-[10px] font-black px-3 py-1 rounded-full">{MOCK_REQUESTS.length} Pending</span>
              </div>
              <div className="p-4 space-y-3">
                {MOCK_REQUESTS.map(req => (
                  <div key={req.id} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-100 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-black text-[#1e293b] shadow-sm">
                        {req.student.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-[#1e293b]">{req.student} <span className="text-[10px] text-gray-400 font-bold ml-2">({req.branch})</span></div>
                        <div className="text-sm text-gray-500 font-medium mt-0.5">{req.topic}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{req.time}</span>
                      <button className="bg-white hover:bg-[#1e293b] hover:text-white border border-gray-100 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Announcements */}
            <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-black text-[#1e293b] flex items-center gap-3">
                  <Bell className="text-blue-500" /> Latest from Campus
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {announcements.map((a: any) => (
                  <div key={a.id} className="p-8 hover:bg-gray-50 transition-all group relative">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${a.audience === 'alumni' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        {a.audience === 'all' ? 'Announcement' : 'Exclusive Alumni Update'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">{new Date(a.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-black text-[#1e293b] mb-2 group-hover:text-[#E31E24] transition-colors">{a.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{a.content}</p>
                    <button className="text-xs font-black text-blue-500 flex items-center gap-2 hover:translate-x-2 transition-transform">
                      Read Full Details <ExternalLink size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Professional Profile */}
            <div className="bg-[#1e293b] text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#E31E24]/20 rounded-full blur-2xl" />
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-8 border-b border-white/5 pb-4">Professional Status</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                    <Building2 className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Company</div>
                    <div className="font-black text-xl">Google</div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                    <Briefcase className="text-[#E31E24]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Role</div>
                    <div className="font-black text-xl line-clamp-1">Senior Data Scientist</div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-white text-[#1e293b] py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:-translate-y-1 transition-all active:scale-95 shadow-xl font-display">
                  Update Portfolio
                </button>
              </div>
            </div>

            {/* Career Opportunities */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#1e293b] mb-8 flex items-center justify-between border-b border-gray-50 pb-4">
                Exclusive Roles
                <Sparkles size={16} className="text-amber-500" />
              </h3>
              <div className="space-y-4">
                {MOCK_JOBS.map(job => (
                  <div key={job.id} className="p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-100 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-black text-[#1e293b]">{job.role}</div>
                      <span className="text-[10px] font-black text-emerald-500">{job.salary}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Building2 size={12} /> {job.company}</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-4 text-xs font-black uppercase tracking-widest text-blue-500 hover:bg-blue-50 rounded-2xl transition-all mt-4">
                  Browse All Jobs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode, label: string, value: string, sub: string, color: string }) {
  const bgColors = {
    blue: 'bg-blue-50',
    red: 'bg-red-50',
    amber: 'bg-amber-50'
  }
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
    >
      <div className={`w-12 h-12 ${bgColors[color as keyof typeof bgColors]} rounded-2xl flex items-center justify-center mb-4 transition-transform`}>
        {icon}
      </div>
      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-black text-[#1e293b] mb-1">{value}</div>
      <div className="text-[10px] font-bold text-gray-400">{sub}</div>
    </motion.div>
  )
}
