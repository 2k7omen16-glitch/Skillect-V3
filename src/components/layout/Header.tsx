import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../Logo'

export default function Header() {
  const { user, userData, logoutDemo } = useAuth()

  // Show header everywhere for consistent branding and navigation

  const firstName = userData?.name?.split(' ')[0] || 'User'
  const profileAvatar = userData?.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}&backgroundColor=0A1628&textColor=ffffff`

  return (
    <header className="bg-white/80 border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/">
          <Logo size="normal" />
        </Link>

        <nav className="flex gap-8 text-[11px] font-black text-gray-400 items-center uppercase tracking-widest">
          {userData?.role === 'student' && (
            <>
              <Link to="/student/dashboard" className="hover:text-[#E31E24] transition-all hover:tracking-widest hidden md:block">Dashboard</Link>
              <Link to="/student/opportunities" className="hover:text-[#E31E24] transition-all hover:tracking-widest hidden md:block">Opportunities</Link>
              <Link to="/student/doubt-box" className="hover:text-[#E31E24] transition-all hover:tracking-widest hidden md:block">Doubt Box</Link>
              <Link to="/student/mentors" className="hover:text-[#E31E24] transition-all hover:tracking-widest hidden md:block">Mentors</Link>
            </>
          )}
          {userData?.role === 'professor' && (
            <Link to="/professor/dashboard" className="hover:text-[#E31E24] transition-all">Dashboard</Link>
          )}

          {user ? (
            <div className="flex items-center gap-5 pl-6 border-l border-gray-100">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-black text-[#1e293b] leading-tight font-display">{userData?.name || 'User'}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{userData?.role || 'Member'}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-gray-100 ring-2 ring-gray-50">
                <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={logoutDemo}
                className="text-gray-300 hover:text-red-500 transition-all p-1.5 bg-gray-50 rounded-xl hover:bg-red-50"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-[#E31E24] text-white px-8 py-3 rounded-2xl text-[10px] font-black shadow-xl shadow-red-100 active:scale-95 transition-all">LOGIN</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
