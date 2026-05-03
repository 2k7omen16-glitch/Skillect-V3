import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Users, MessageSquare, BarChart3, LogOut, Award } from 'lucide-react'

export default function ProfessorDashboard() {
  const navigate = useNavigate()
  const { userData, logoutDemo } = useAuth()

  const handleLogout = () => {
    logoutDemo()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1e293b]">Professor Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome, {userData?.name || 'Professor'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users size={18} />} label="Active Mentees" value="12" color="#E31E24" />
          <StatCard icon={<MessageSquare size={18} />} label="Pending Doubts" value="5" color="#1e293b" />
          <StatCard icon={<BarChart3 size={18} />} label="Avg Gap Score" value="62%" color="#059669" />
          <StatCard icon={<Award size={18} />} label="Students Placed" value="8" color="#d97706" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Doubts */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-[#1e293b] mb-4">Recent Doubts</h2>
            {[
              { q: 'How to implement backpropagation from scratch?', domain: 'ML', time: '3h ago' },
              { q: 'Best resources for learning Docker?', domain: 'DevOps', time: '5h ago' },
              { q: 'Is Python or R better for data science?', domain: 'Data Science', time: '1 day ago' },
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={14} className="text-[#E31E24]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1e293b]">{d.q}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">{d.domain}</span>
                    <span>{d.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Mentees Progress */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-[#1e293b] mb-4">Mentee Progress</h2>
            {[
              { name: 'Rahul Kumar', score: 72, role: 'ML Intern' },
              { name: 'Priya Patel', score: 55, role: 'Data Analyst' },
              { name: 'Amit Singh', score: 88, role: 'Frontend Dev' },
              { name: 'Neha Verma', score: 34, role: 'Cybersecurity' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 bg-[#1e293b] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {s.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#1e293b]">{s.name}</span>
                    <span className={`text-xs font-medium ${s.score >= 70 ? 'text-green-600' : s.score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {s.score}%
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${s.score >= 70 ? 'bg-green-500' : s.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{s.role}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="text-xl font-bold text-[#1e293b]">{value}</div>
    </div>
  )
}
