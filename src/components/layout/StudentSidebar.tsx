import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, ClipboardCheck, Map, Users, MessageSquare, FileText,
  LogOut, ScanSearch, ChevronLeft, Menu, Briefcase, TrendingUp
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Logo from '../Logo'

export default function StudentSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logoutDemo } = useAuth()
  const [sidebarHover, setSidebarHover] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleLogout = () => {
    logoutDemo()
    navigate('/')
  }

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Overview', path: '/student/dashboard' },
    { icon: <TrendingUp size={18} />, label: 'Analytics', path: '/student/analytics' },
    { icon: <Briefcase size={18} />, label: 'Opportunities', path: '/student/opportunities' },
    { icon: <ClipboardCheck size={18} />, label: 'Assessment', path: '/student/assessment' },
    { icon: <Map size={18} />, label: 'Roadmap', path: '/student/roadmap' },
    { icon: <Users size={18} />, label: 'Mentors', path: '/student/mentors' },
    { icon: <MessageSquare size={18} />, label: 'Doubt Box', path: '/student/doubt-box' },
    { icon: <FileText size={18} />, label: 'Resume', path: '/student/resume' },
    { icon: <ScanSearch size={18} />, label: 'ATS Checker', path: '/student/ats-checker' },
  ]

  return (
    <>
      <aside
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className="hidden lg:flex flex-col bg-white border-r border-[#E2E8F0] shadow-xl fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out overflow-hidden"
        style={{ width: sidebarHover ? '240px' : '72px' }}
      >
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-center h-16">
          <Logo iconOnly={!sidebarHover} size={sidebarHover ? "normal" : "small"} />
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-auto mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#E8132A] text-white shadow-xl shadow-red-600/20 scale-[1.02]'
                    : 'text-[#4A5568] hover:bg-[#F5F6FA] hover:text-[#E8132A]'
                }`}
              >
                <span className={`flex-shrink-0 transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>{item.icon}</span>
                <AnimatePresence>
                  {sidebarHover && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-[#E2E8F0]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-[13px] font-bold text-[#4A5568] hover:bg-red-500/10 hover:text-[#E8132A] transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {sidebarHover && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-[#E2E8F0] z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenu(!mobileMenu)} className="w-10 h-10 flex items-center justify-center bg-[#F5F6FA] rounded-xl text-[#4A5568]">
            <Menu size={20} />
          </button>
          <Logo size="small" />
        </div>
      </div>

      {/* Mobile Slide-out */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black z-[100]" onClick={() => setMobileMenu(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-[101] shadow-2xl p-5 border-r border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-8">
                <Logo size="small" />
                <button onClick={() => setMobileMenu(false)} className="w-8 h-8 flex items-center justify-center bg-[#F5F6FA] rounded-lg text-[#4A5568]"><ChevronLeft size={20} /></button>
              </div>
              <div className="space-y-1.5">
                {menuItems.map((item) => (
                  <button key={item.path} onClick={() => { navigate(item.path); setMobileMenu(false) }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      location.pathname === item.path ? 'bg-[#E8132A] text-white shadow-lg' : 'text-[#4A5568] hover:bg-[#F5F6FA]'
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
              <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-[#4A5568] hover:bg-red-500/10 hover:text-[#E8132A] mt-6 transition-all">
                <LogOut size={18} /> Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
