import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { User, Mail, BookOpen, Target, Calendar, Award, Camera, Check, ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'

export default function Profile() {
  const { userData, updateUserData } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(userData?.photo_url || null)

  const [formData, setFormData] = useState({
    name: userData?.name || '',
    age: userData?.age || '20',
    branch: userData?.branch || 'Computer Science & Engineering',
    year: userData?.year || '3rd Year',
    goal: userData?.goal || 'SDE Intern',
    course: 'B.Tech',
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size too large (max 2MB)')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreviewImage(base64String)
        toast.success('Photo uploaded! Click save to keep it.')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    updateUserData({
      ...formData,
      photo_url: previewImage || undefined
    })
    setLoading(false)
    toast.success('Profile updated successfully!')
  }

  const profileAvatar = previewImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}&backgroundColor=ffdfbf`

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <div className="flex items-center gap-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-[#F5F6FA] rounded-xl text-[#4A5568] hover:text-[#E8132A] transition-all border border-[#E2E8F0]">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628] font-display">Student Profile</h1>
          <p className="text-[10px] text-[#4A5568] font-bold uppercase tracking-widest mt-1">Manage your academic identity and goals</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Left: Avatar & Identity Card */}
        <div className="md:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="niet-card p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#E8132A]" />
            
            <div className="relative w-32 h-32 mx-auto mb-6 group">
              <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-[#F5F6FA]">
                <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#E8132A] text-white rounded-xl border-4 border-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-10"
              >
                <Camera size={16} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-[#0A1628] font-display line-clamp-1">{formData.name}</h2>
            <p className="text-[#E8132A] text-[10px] font-black uppercase tracking-widest mt-1 mb-6">{formData.branch}</p>

            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#E8F8F2] text-[#00A86B] rounded-xl text-[10px] font-bold border border-[#00A86B]/20">
              <Award size={14} /> Profile 92% Complete
            </div>
          </motion.div>

          <div className="niet-card p-6 space-y-4">
             <h3 className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest border-b border-[#F5F6FA] pb-3 mb-2">Connected Accounts</h3>
             <div className="flex items-center justify-between text-xs font-bold text-[#4A5568]">
                <span className="flex items-center gap-2"><Mail size={14} /> NIET Email</span>
                <Check size={14} className="text-[#00A86B]" />
             </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="md:col-span-2">
          <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="niet-card p-10 space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest ml-1 flex items-center gap-2">
                  <User size={14} /> Full Name
                </label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm font-bold text-[#0A1628] focus:border-[#E8132A] transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar size={14} /> Age
                </label>
                <input 
                  type="number" 
                  value={formData.age} 
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm font-bold text-[#0A1628] focus:border-[#E8132A] transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest ml-1 flex items-center gap-2">
                  <BookOpen size={14} /> Course
                </label>
                <select 
                  value={formData.course} 
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm font-bold text-[#0A1628] focus:border-[#E8132A] transition-all outline-none appearance-none"
                >
                  <option>B.Tech</option>
                  <option>M.Tech</option>
                  <option>MCA</option>
                  <option>MBA</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Award size={14} /> Branch
                </label>
                <select 
                  value={formData.branch} 
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm font-bold text-[#0A1628] focus:border-[#E8132A] transition-all outline-none appearance-none"
                >
                  <option>Computer Science & Engineering</option>
                  <option>Information Technology</option>
                  <option>Electronics & Communication</option>
                  <option>Data Science</option>
                  <option>AIML</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar size={14} /> Academic Year
                </label>
                <select 
                  value={formData.year} 
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm font-bold text-[#0A1628] focus:border-[#E8132A] transition-all outline-none appearance-none"
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Target size={14} /> Career Goal
                </label>
                <input 
                  type="text" 
                  value={formData.goal} 
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm font-bold text-[#0A1628] focus:border-[#E8132A] transition-all outline-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#F5F6FA] flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="niet-btn-primary px-10 py-4 flex items-center justify-center gap-3 shadow-xl shadow-red-500/20 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} SAVE CHANGES
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
