import type { ReactNode } from 'react'
import { useState } from 'react'
import StudentSidebar from './StudentSidebar'
import { Search, Bell, X, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface StudentLayoutProps {
  children: ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const { userData, notifications, removeNotification, clearNotifications } = useAuth()
  const navigate = useNavigate()
  const [sidebarHover, setSidebarHover] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const studentFirstName = userData?.name?.split(' ')[0] || 'Student'
  const profileAvatar = userData?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'Student'}&backgroundColor=ffdfbf`

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    // Premium routing logic: Route to the most relevant page based on query
    const query = searchQuery.toLowerCase()
    if (query.includes('mentor') || query.includes('teacher') || query.includes('faculty')) {
      navigate('/student/mentors', { state: { searchTerm: searchQuery } })
    } else {
      navigate('/student/doubt-box', { state: { searchTerm: searchQuery } })
    }
    setSearchQuery('')
  }

  const handleDeleteNotification = (id: number) => {
    removeNotification(id)
  }

  const handleClearAll = () => {
    clearNotifications()
    setTimeout(() => setShowNotifications(false), 300)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-[#0A1628] dark:text-slate-100 flex overflow-x-hidden transition-colors duration-300">
      {/* Sidebar Wrapper - Keep Dark Navy */}
      <div 
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className="relative z-50"
      >
        <StudentSidebar />
      </div>

      <main 
        className="flex-1 mt-16 lg:mt-0 transition-all duration-300 ease-in-out min-w-0" 
        style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (sidebarHover ? '240px' : '72px') : '0px' }}
      >
        {/* Universal Top Bar - Pure White */}
        <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-[#E2E8F0] dark:border-slate-900 px-4 lg:px-8 py-5 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
          <div>
            <h1 className="text-xl font-bold text-[#0A1628] dark:text-slate-100 flex items-center gap-2 truncate font-display cursor-pointer hover:text-[#E8132A] transition-colors" onClick={() => navigate('/student/dashboard')}>
              Welcome back, {studentFirstName} <span className="animate-bounce-slow">👋</span>
            </h1>
            <p className="text-[10px] text-[#4A5568] dark:text-slate-500 font-bold uppercase tracking-[0.15em] mt-1">
              {userData?.branch || 'CSE'} • {userData?.year || '3rd Year'} • NIET Greater Noida
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B9BB4]" />
              <input 
                type="text" 
                placeholder="Search knowledge..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-[#F5F6FA] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-[#E8132A] transition-all shadow-inner text-[#0A1628] dark:text-slate-100 placeholder-[#8B9BB4]" 
              />
            </form>
            <div className="flex items-center gap-3 relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-11 h-11 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl flex items-center justify-center transition-all ${showNotifications ? 'bg-[#FEF0F1] dark:bg-red-500/10 text-[#E8132A] border-[#FCCDD0] dark:border-red-500/20' : 'bg-white dark:bg-slate-900 text-[#4A5568] dark:text-slate-400 hover:text-[#E8132A] hover:bg-[#FEF0F1] dark:hover:bg-red-500/10'}`}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-[#E8132A] border-2 border-white rounded-full text-white text-[8px] font-black flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-14 right-0 w-80 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-[2rem] shadow-2xl z-20 overflow-hidden"
                    >
                      <div className="p-5 border-b border-[#F5F6FA] flex items-center justify-between">
                        <h3 className="text-xs font-black text-[#0A1628] uppercase tracking-widest">Notifications</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-[#8B9BB4] hover:text-[#E8132A]"><X size={16} /></button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          <AnimatePresence initial={false}>
                            {notifications.map((n) => (
                              <motion.div 
                                key={n.id} 
                                initial={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onClick={() => {
                                  if (n.link) {
                                    navigate(n.link);
                                    setShowNotifications(false);
                                  }
                                }}
                                className={`p-5 hover:bg-[#F5F6FA] transition-colors border-b border-[#F5F6FA] last:border-0 flex gap-4 group relative ${n.link ? 'cursor-pointer' : ''}`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === 'success' ? 'bg-[#E8F8F2] text-[#00A86B]' : n.type === 'warning' ? 'bg-[#FFF9E6] text-[#F5A623]' : 'bg-[#FEF0F1] text-[#E8132A]'}`}>
                                  {n.type === 'success' ? <CheckCircle size={18} /> : n.type === 'warning' ? <AlertTriangle size={18} /> : <Info size={18} />}
                                </div>
                                <div className="flex-1 pr-4 pointer-events-none">
                                  <p className="text-xs font-bold text-[#0A1628]">{n.title}</p>
                                  <p className="text-[10px] text-[#4A5568] font-medium mt-1 leading-relaxed">{n.desc}</p>
                                  <p className="text-[8px] text-[#8B9BB4] font-black uppercase tracking-widest mt-2">{n.time}</p>
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteNotification(n.id); }}
                                  className="absolute right-4 top-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#CBD5E0] hover:text-[#E8132A] z-10"
                                >
                                  <X size={14} />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        ) : (
                          <div className="p-10 text-center">
                            <Bell size={32} className="text-[#E2E8F0] mx-auto mb-3" />
                            <p className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest">No New Notifications</p>
                          </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <button 
                          onClick={handleClearAll}
                          className="w-full py-4 bg-[#F5F6FA] text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest hover:text-[#E8132A] transition-colors"
                        >
                          Clear All Notifications
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <div 
                onClick={() => navigate('/student/profile')}
                className="w-11 h-11 rounded-2xl border-2 border-[#F5F6FA] shadow-sm overflow-hidden bg-white ring-2 ring-white/5 cursor-pointer hover:ring-[#E8132A]/20 transition-all active:scale-95"
              >
                <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8 bg-white dark:bg-[#020617] min-h-[calc(100vh-80px)] transition-colors duration-300">
          {children}
        </div>
      </main>
    </div>
  )
}
