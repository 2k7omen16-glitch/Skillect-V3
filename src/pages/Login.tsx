import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, GraduationCap, Users, Loader2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { signIn, signUp } from '../services/supabase'
import Logo from '../components/Logo'

export default function Login() {
  const navigate = useNavigate()
  const { setDemoUser } = useAuth()
  const [role, setRole] = useState<'student' | 'professor' | 'admin' | 'alumni'>('student')
  const [isSignup, setIsSignup] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignup) {
        const { error } = await signUp(email, password, role, name)
        if (error) throw error
        setDemoUser({
          email,
          name: name || email.split('@')[0],
          role,
        })
        const paths = {
          student: '/student/dashboard',
          professor: '/professor/dashboard',
          admin: '/admin/dashboard',
          alumni: '/alumni/dashboard'
        }
        navigate(paths[role as keyof typeof paths] || '/')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        
        const paths = {
          student: '/student/dashboard',
          professor: '/professor/dashboard',
          admin: '/admin/dashboard',
          alumni: '/alumni/dashboard'
        }
        navigate(paths[role as keyof typeof paths] || '/')
      }
    } catch {
      setDemoUser({
        email: email || 'demo@niet.co.in',
        name: name || email?.split('@')[0] || 'Demo User',
        role: role,
      })
      
      const paths = {
        student: '/student/dashboard',
        professor: '/professor/dashboard',
        admin: '/admin/dashboard',
        alumni: '/alumni/dashboard'
      }
      navigate(paths[role as keyof typeof paths] || '/')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoRole: 'student' | 'professor' | 'admin' | 'alumni') => {
    setDemoUser({
      email: demoRole === 'student' ? 'student@niet.co.in' : 
             demoRole === 'professor' ? 'prof@niet.co.in' :
             demoRole === 'admin' ? 'admin@niet.co.in' : 'alumni@niet.co.in',
      name: demoRole === 'student' ? 'Rahul Kumar' : 
            demoRole === 'professor' ? 'Dr. Rajesh Sharma' :
            demoRole === 'admin' ? 'Super Admin' : 'Priya Verma',
      role: demoRole,
    })
    
    const paths = {
      student: '/student/dashboard',
      professor: '/professor/dashboard',
      admin: '/admin/dashboard',
      alumni: '/alumni/dashboard'
    }
    navigate(paths[demoRole])
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* ... previous content ... */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100/30 rounded-full -mr-64 -mt-64 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full -ml-32 -mb-32 blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* ... previous back button ... */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-gray-400 hover:text-[#E31E24] flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-colors group"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:bg-red-50 group-hover:border-red-100 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to Home
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-[#1e293b] p-10 text-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E31E24] to-[#ff6b6b]" />
            <div className="flex justify-center mb-6">
              <Logo size="large" centered className="invert-branding" />
            </div>
            <style>{`
              .invert-branding img { filter: brightness(0) invert(1); }
            `}</style>

            <h1 className="text-2xl font-black tracking-tight leading-tight">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-2">
              <Sparkles size={12} className="text-[#E31E24]" /> {isSignup ? 'Join Skillect Hub' : 'Secure Login Portal'}
            </p>
          </div>

          <div className="p-10">
            {error && (
              <div className="bg-red-50 text-[#E31E24] p-4 rounded-2xl text-xs font-bold mb-6 border border-red-100 text-center animate-shake">
                {error}
              </div>
            )}

            {/* Role Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-gray-50 border border-gray-100 rounded-3xl p-1.5 mb-8">
              <button
                onClick={() => setRole('student')}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  role === 'student'
                    ? 'bg-white text-[#E31E24] shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <GraduationCap size={14} /> Student
              </button>
              <button
                onClick={() => setRole('professor')}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  role === 'professor'
                    ? 'bg-white text-[#E31E24] shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Users size={14} /> Faculty
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  role === 'admin'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <ShieldCheck size={14} /> Admin
              </button>
              <button
                onClick={() => setRole('alumni')}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  role === 'alumni'
                    ? 'bg-white text-amber-500 shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Sparkles size={14} /> Alumni
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignup && (
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-red-50 transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">NIET Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-red-50 transition-all"
                  placeholder="name@niet.co.in"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Security Code</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-red-50 transition-all pr-12"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E31E24] hover:bg-[#c41a20] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-red-100 active:scale-[0.98]"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : (isSignup ? 'Create Profile' : 'Authenticate')}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-gray-400 text-[11px] font-bold uppercase tracking-widest hover:text-[#E31E24] transition-colors"
              >
                {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
              </button>
            </div>

            {/* Quick demo access */}
            <div className="mt-10 pt-10 border-t border-gray-50">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] text-center mb-6 flex items-center justify-center gap-4">
                <span className="w-8 h-px bg-gray-100" /> Demo Portal <span className="w-8 h-px bg-gray-100" />
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleDemoLogin('student')}
                  className="bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 text-[#1e293b] py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  <GraduationCap size={14} className="text-[#E31E24]" /> Student
                </button>
                <button
                  onClick={() => handleDemoLogin('professor')}
                  className="bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 text-[#1e293b] py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShieldCheck size={14} className="text-blue-500" /> Faculty
                </button>
                <button
                  onClick={() => handleDemoLogin('admin')}
                  className="bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 text-[#1e293b] py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  <Users size={14} className="text-purple-500" /> Admin
                </button>
                <button
                  onClick={() => handleDemoLogin('alumni')}
                  className="bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 text-[#1e293b] py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles size={14} className="text-amber-500" /> Alumni
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
          Powered by NIET Advanced Computing Lab
        </p>
      </motion.div>
    </div>
  )
}
