import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, BookOpen, Calendar, Target, ArrowRight, Sparkles, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function Onboarding() {
  const navigate = useNavigate()
  const { setDemoUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    branch: 'Computer Science',
    year: '3rd Year',
    goal: 'Internship',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDemoUser({
      email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@niet.co.in`,
      name: formData.name,
      role: 'student',
      branch: formData.branch,
      year: formData.year,
      goal: formData.goal,
    })
    localStorage.setItem('studentName', formData.name)
    navigate('/student/opportunities')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gray-50">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-100/30 rounded-full -mr-64 -mt-64 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/20 rounded-full -ml-32 -mb-32 blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 w-full max-w-[480px] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo size="normal" centered />
          </div>
          <h2 className="text-3xl font-black text-[#1e293b] mb-2 tracking-tight">Welcome to Skillect</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-[#E31E24]" /> Initialize your smart profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest ml-1 flex items-center gap-2">
              <User size={14} className="text-indigo-500" /> Full Identity
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#1e293b] focus:outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-red-50 transition-all shadow-sm"
              placeholder="What should we call you?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest ml-1 flex items-center gap-2">
                <BookOpen size={14} className="text-[#E31E24]" /> Branch
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#1e293b] focus:outline-none focus:border-[#E31E24] transition-all shadow-sm appearance-none"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              >
                <option>Computer Science</option>
                <option>IT</option>
                <option>AI/ML</option>
                <option>Data Science</option>
                <option>ECE</option>
                <option>ME</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={14} className="text-emerald-500" /> Session
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#1e293b] focus:outline-none focus:border-[#E31E24] transition-all shadow-sm appearance-none"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Target size={14} className="text-amber-500" /> Ultimate Career Goal
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Internship', 'Job', 'Part-time'].map((goal) => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => setFormData({ ...formData, goal })}
                  className={`py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    formData.goal === goal
                      ? 'bg-[#1e293b] text-white shadow-xl shadow-slate-200'
                      : 'bg-gray-50 text-gray-400 border border-transparent hover:bg-gray-100 hover:text-gray-600'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#E31E24] hover:bg-[#c41a20] text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-red-100 active:scale-95 group"
            >
              Discover Opportunities <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-2">
              <Zap size={10} /> Secure Identity Analysis Enforced
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
