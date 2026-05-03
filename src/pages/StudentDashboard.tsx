import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  BookOpen, MessageSquare,
  Calendar, Sparkles,
  Zap, Bell, Plus, ArrowRight,
  ExternalLink, MapPin, Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { toast, Toaster } from 'sonner'

// Mock Data
const trendData = [
  { day: 'Apr 1', score: 32 },
  { day: 'Apr 8', score: 38 },
  { day: 'Apr 16', score: 44 },
  { day: 'Apr 22', score: 51 },
  { day: 'Apr 30', score: 58 },
]

const skillBars = [
  { name: 'STATISTICS', progress: 40, impact: '+14 pts', color: '#E8132A' },
  { name: 'TENSORFLOW', progress: 20, impact: '+12 pts', color: '#E8132A' },
  { name: 'SQL', progress: 55, impact: '+9 pts', color: '#F5A623' },
  { name: 'ML BASICS', progress: 70, impact: '+5 pts', color: '#F5A623' },
  { name: 'PYTHON', progress: 90, impact: '+2 pts', color: '#00A86B' },
]

const mentors = [
  {
    name: 'Mr. Sover Singh Bisht',
    role: 'Dy. Head · CS (Data Science)',
    match: 'Covers Statistics + TensorFlow',
    location: 'Building 2, Cabin 14',
    available: 'Mon, Wed',
    type: 'faculty',
    photo_url: 'https://niet.co.in/uploads/mentor/6635b89f99c981714796703.webp'
  },
  {
    name: 'Dr. Ritesh Rastogi',
    role: 'Professor & Head · IT',
    match: 'Industry SQL + ML expertise',
    location: 'Building 2, Cabin 305',
    available: 'Mon, Wed, Fri',
    type: 'faculty',
    photo_url: 'https://niet.co.in/uploads/mentor/65fa7b3d0649a1710914365.webp'
  },
  {
    name: 'Priya Verma',
    role: 'Data Scientist @ Flipkart · NIET Alumni \'22',
    match: 'Industry SQL + ML expertise',
    location: 'Group Session · Sat 11 AM',
    available: '6/20 seats left',
    type: 'alumni',
    seed: 'Priya'
  }
]

const newsItems = [
  { source: 'TechCrunch', time: '2 hrs ago', title: 'Generative AI is transforming SDE roles', summary: 'Why LLMs are now a core requirement for junior developers.', tag: 'Relevant to you', tagColor: '#00A86B' },
  { source: 'NVIDIA', time: '4 hrs ago', title: 'New TensorRT updates released', summary: 'Performance boost for TensorFlow and PyTorch models.', tag: 'On your roadmap', tagColor: '#0A1628' },
  { source: 'Naukri', time: '1 day ago', title: 'Demand for SQL specialists up by 30%', summary: 'Backend and data engineering roles see massive spike.', tag: 'Skill alert', tagColor: '#E8132A' }
]

const activityItems = [
  { icon: <Calendar size={14} />, text: 'Dr. Sharma confirmed your slot', highlight: 'Thu 3 PM', time: '3 hrs ago', color: '#E8132A' },
  { icon: <MessageSquare size={14} />, text: 'Your doubt on gradient descent was answered', highlight: '', time: 'Yesterday', color: '#0A1628' },
  { icon: <Zap size={14} />, text: 'Skill Alert: SQL trending — added to roadmap', highlight: '', time: 'Yesterday', color: '#E8132A' },
  { icon: <Sparkles size={14} />, text: 'Priya Verma\'s session rated 4.8/5 · 18 students', highlight: '', time: '2 days ago', color: '#00A86B' },
  { icon: <BookOpen size={14} />, text: 'Dr. Sharma added 2 new resources to SQL box', highlight: '', time: '3 days ago', color: '#0A1628' },
]

function CountUp({ end, duration = 1.2 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = end / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [end, duration])
  return <span>{count}</span>
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { userData } = useAuth()
  const [isAlertVisible, setIsAlertVisible] = useState(true)

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <Toaster position="top-center" richColors />
      
      {/* ROW 1: TOP STATS & GAP SCORE CHART (RESTORED LAYOUT) */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Gap Score Chart Card */}
        <div className="lg:col-span-8 niet-card p-8 bg-white overflow-hidden relative group">
          <div className="flex justify-between items-start mb-8 niet-header-accent">
            <div>
              <p className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-[0.2em] mb-1">Gap Score Performance</p>
              <h2 className="text-2xl font-bold text-[#0A1628] font-display">30-Day Intelligence Trend</h2>
              <p className="text-[11px] text-[#4A5568] font-medium italic mt-1">You've improved 26 points this month. <span className="text-[#00A86B] font-bold">Excellent trajectory!</span></p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold font-display text-[#E8132A]">
                <CountUp end={userData?.readiness_score || 58} />%
              </div>
              <p className="text-[10px] font-black text-[#F5A623] uppercase tracking-widest mt-1">Developing</p>
            </div>
          </div>
          
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8132A" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#E8132A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8B9BB4', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#E8132A', fontWeight: 900, fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#E8132A" strokeWidth={3} fill="url(#scoreGradient)" animationDuration={2000} dot={{ r: 4, fill: '#FFFFFF', stroke: '#E8132A', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#E8132A', stroke: '#FFFFFF', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Cards Sidebar (Restored Position) */}
        <div className="lg:col-span-4 space-y-6">
          {/* SKILLS TICKED CARD */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-[#F8F9FB] rounded-[1.5rem] p-6 relative overflow-hidden group border border-[#E2E8F0]"
          >
             <div className="absolute top-5 right-5 w-10 h-10 bg-[#0A1628] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen size={18} />
             </div>
             <p className="text-[9px] font-black text-[#8B9BB4] uppercase tracking-widest mb-3">Skills Ticked</p>
             <div className="flex items-end gap-1 mb-3">
                <h2 className="text-3xl font-black text-[#0A1628] font-display">{userData?.skills_mastered || 8}/{userData?.total_skills || 13}</h2>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#CBD5E0]" />
                <span className="text-[9px] font-black text-[#8B9BB4] uppercase tracking-widest">
                  {Math.max(0, (userData?.total_skills || 13) - (userData?.skills_mastered || 8))} Remaining
                </span>
             </div>
          </motion.div>

          {/* ACTIVE SESSIONS CARD */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#F0FFF4] rounded-[1.5rem] p-6 relative overflow-hidden group border border-[#DCFCE7]"
          >
             <div className="absolute top-5 right-5 w-10 h-10 bg-[#00A86B] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Calendar size={18} />
             </div>
             <p className="text-[9px] font-black text-[#8B9BB4] uppercase tracking-widest mb-3">Active Sessions</p>
             <div className="flex items-end gap-1 mb-3">
                <h2 className="text-3xl font-black text-[#00A86B] font-display">3</h2>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#CBD5E0]" />
                <span className="text-[9px] font-black text-[#8B9BB4] uppercase tracking-widest">This Week</span>
             </div>
          </motion.div>

          {/* YOUR GOAL CARD */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-[#F5F3FF] rounded-[1.5rem] p-6 relative overflow-hidden group border border-[#EDE9FE]"
          >
             <div className="absolute top-5 right-5 w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles size={18} />
             </div>
             <p className="text-[9px] font-black text-[#8B9BB4] uppercase tracking-widest mb-3">Your Goal</p>
             <div className="flex items-end gap-1 mb-3">
                <h2 className="text-lg font-black text-[#7C3AED] font-display truncate pr-10">
                   {userData?.goal || 'SDE Intern'}
                </h2>
             </div>
             <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-white/50 text-[#7C3AED] text-[8px] font-black rounded-md uppercase tracking-widest border border-[#7C3AED]/20">Target Role</span>
             </div>
          </motion.div>
        </div>
      </div>

      {/* ROW 2: DOMAIN PULSE & ACTIVITY FEED (MOVED UP) */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Domain Pulse */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center niet-header-accent">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#0A1628] font-display">Domain Pulse</h2>
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#E8F8F2] text-[#00A86B] text-[8px] font-black rounded-md uppercase tracking-widest border border-[#00A86B]/20">
                <div className="w-1 h-1 rounded-full bg-[#00A86B] animate-pulse" /> Live Market Intel
              </span>
            </div>
          </div>

          {/* Skill Alert Banner - High Impact Demo Moment */}
          {isAlertVisible && (
            <motion.div 
              initial={{ y: -10, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FEF0F1] border-l-4 border-[#E8132A] p-5 rounded-r-2xl flex items-center justify-between shadow-sm border border-[#FCCDD0]"
            >
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#E8132A] border border-[#FCCDD0] shadow-sm">
                  <Bell size={20} className="animate-bounce" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A1628]">SQL is trending in 47 job postings this week.</p>
                  <p className="text-[11px] text-[#4A5568] font-medium">
                    Not on your roadmap yet. 
                    <button 
                      onClick={() => {
                        toast.success('SQL successfully added to your AI Roadmap!', {
                          description: 'Recommended by NIET Faculty based on market demand.',
                        })
                        setIsAlertVisible(false)
                      }} 
                      className="text-[#E8132A] font-bold hover:underline ml-1"
                    >
                      Add to Roadmap →
                    </button>
                  </p>
                </div>
              </div>
              <button onClick={() => setIsAlertVisible(false)} className="text-[#8B9BB4] hover:text-[#E8132A] transition-all p-1">
                <Plus className="rotate-45" size={20} />
              </button>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {newsItems.map((news) => (
              <div key={news.title} className="niet-card p-5 flex gap-4 group hover:border-[#E8132A] transition-all bg-white">
                <div className="w-12 h-12 bg-[#F5F6FA] rounded-xl flex items-center justify-center text-[#8B9BB4] flex-shrink-0 group-hover:text-[#E8132A] transition-colors border border-[#E2E8F0]">
                   <ExternalLink size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black text-[#8B9BB4] uppercase tracking-widest">{news.source}</span>
                    <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest" style={{ backgroundColor: `${news.tagColor}15`, color: news.tagColor, border: `1px solid ${news.tagColor}20` }}>{news.tag}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0A1628] mb-1 group-hover:text-[#E8132A] transition-colors line-clamp-1">{news.title}</h3>
                  <p className="text-[11px] text-[#4A5568] font-medium line-clamp-1">{news.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 niet-card p-6 bg-white">
          <h2 className="text-sm font-black text-[#0A1628] uppercase tracking-widest mb-8 border-b border-[#F5F6FA] pb-3">Activity Feed</h2>
          <div className="space-y-6">
            {activityItems.map((item, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== activityItems.length - 1 && (
                  <div className="absolute left-[17px] top-8 bottom-[-24px] w-[1px] border-l border-dashed border-[#E2E8F0]" />
                )}
                <div className="w-9 h-9 rounded-xl bg-[#F5F6FA] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 z-10" style={{ color: item.color }}>
                  {item.icon}
                </div>
                <div className="pt-1">
                  <p className="text-[12px] text-[#4A5568] font-medium leading-tight">
                    {item.text} {item.highlight && <strong className="text-[#0A1628] font-black">{item.highlight}</strong>}
                  </p>
                  <p className="text-[9px] text-[#8B9BB4] mt-1 font-black uppercase tracking-widest">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: SKILL GAP & MENTORS */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Skill Gap Analysis */}
        <div className="lg:col-span-7 niet-card p-8 bg-white">
          <div className="flex justify-between items-start mb-10 niet-header-accent">
            <div>
              <h2 className="text-lg font-bold text-[#0A1628] font-display">Gap Identification</h2>
              <p className="text-[10px] text-[#4A5568] font-bold uppercase tracking-widest mt-1">SDE INTERN • INDUSTRY BENCHMARK</p>
            </div>
            <button onClick={() => navigate('/student/assessment')} className="text-[#E8132A] text-[10px] font-black uppercase tracking-widest hover:underline">Update Skills</button>
          </div>

          <div className="space-y-6">
            {skillBars.map((skill, i) => (
              <div key={skill.name} className="relative group cursor-help" title={`Master this → ${skill.impact} to Gap Score`}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-black text-[#0A1628] uppercase tracking-wider">{skill.name}</span>
                  <span className="text-[10px] font-bold text-[#8B9BB4]">{skill.progress}% Mastery</span>
                </div>
                <div className="h-1.5 bg-[#F5F6FA] rounded-full overflow-hidden mb-1">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${skill.progress}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full rounded-full" style={{ backgroundColor: skill.color }} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 right-0 bg-[#E8132A] text-white text-[9px] font-black px-2 py-1 rounded shadow-xl">
                  {skill.impact} to Score
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matched Mentors */}
        <div className="lg:col-span-5 niet-card p-8 bg-white flex flex-col">
          <h2 className="text-lg font-bold text-[#0A1628] mb-8 font-display">Matched Experts</h2>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[420px] pr-2">
            {mentors.map((mentor) => (
              <div key={mentor.name} className="p-4 bg-[#F5F6FA] border border-[#E2E8F0] rounded-xl hover:border-[#E8132A] transition-all group">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 border overflow-hidden ${mentor.type === 'faculty' ? 'bg-[#FEF0F1] text-[#E8132A] border-[#FCCDD0]' : 'bg-[#FFF9E6] text-[#F5A623] border-[#FDE68A]'}`}>
                    {mentor.photo_url ? (
                      <img src={mentor.photo_url} alt={mentor.name} className="w-full h-full object-cover" />
                    ) : (
                      mentor.name.split(' ').map((n: string) => n[0]).join('')
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-bold text-[#0A1628] truncate">{mentor.name}</h3>
                      <button onClick={() => navigate('/student/mentor-match', { state: { mentor } })} className="text-[9px] font-black text-[#E8132A] uppercase tracking-widest hover:underline">Connect →</button>
                    </div>
                    <p className="text-[9px] text-[#4A5568] font-bold uppercase tracking-wider mb-2">{mentor.role}</p>
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#8B9BB4]">
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-[#E8132A]" /> {mentor.location}</span>
                      <span className="flex items-center gap-1 text-[#0A1628] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]"><Clock size={12} /> {mentor.available}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/student/mentors')} className="niet-btn-outline w-full mt-6 flex items-center justify-center gap-2 py-3 text-[11px]">
            Discovery Hub <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  )
}
