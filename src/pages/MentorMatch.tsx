import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Building, MessageSquare, Mail, Calendar, Clock, ArrowLeft, Loader2, Lightbulb, BookOpen, Check } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { generateMentorResponse } from '../services/ai'
import { toast, Toaster } from 'sonner'

const heatmapData = [
  { day: 'Mon', hours: [0, 1, 0, 2, 0, 0, 1, 0] },
  { day: 'Tue', hours: [0, 0, 2, 2, 1, 0, 0, 0] },
  { day: 'Wed', hours: [1, 1, 0, 0, 0, 2, 2, 0] },
  { day: 'Thu', hours: [0, 0, 0, 1, 1, 1, 0, 0] },
  { day: 'Fri', hours: [2, 2, 0, 0, 0, 0, 1, 1] },
]

export default function MentorMatch() {
  const navigate = useNavigate()
  const location = useLocation()
  const mentor = location.state?.mentor || {
    name: 'Dr. Pavan Kumar Shukla',
    designation: 'Professor & HOD',
    department: 'Computer Science & Engineering',
    experience_years: 15,
    research_areas: ['Artificial Intelligence', 'Cloud Computing'],
    patents: [],
    publications: [],
    email: 'hodcse@niet.co.in',
    location: 'Building 2, Cabin 108'
  }

  const [chatOpen, setChatOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  const studentName = localStorage.getItem('studentName') || 'Student'
  const chatKey = `chat_${studentName}_${mentor.name}`

  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem(chatKey)
    if (saved) return JSON.parse(saved)
    return [
      { sender: 'mentor', text: `Hello ${studentName}! I am ${mentor.name} from the ${mentor.department} department. How can I assist you with your career roadmap or technical doubts today?` },
    ]
  })

  useEffect(() => {
    localStorage.setItem(chatKey, JSON.stringify(chatHistory))
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatHistory, isTyping, chatKey])

  const sendMsg = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!msg.trim() || isTyping) return

    const userMsg = msg.trim()
    const newHistory = [...chatHistory, { sender: 'student', text: userMsg }]
    setChatHistory(newHistory)
    setMsg('')
    setIsTyping(true)

    const aiResponse = await generateMentorResponse(userMsg, chatHistory, mentor.name, mentor.department)
    setChatHistory([...newHistory, { sender: 'mentor', text: aiResponse }])
    setIsTyping(false)
  }

  const handleContact = () => {
    if (mentor.email) {
      navigator.clipboard.writeText(mentor.email)
      toast.success('Email copied to clipboard!', {
        description: mentor.email,
        icon: <Mail size={16} className="text-[#E8132A]" />,
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" expand={false} richColors />
      
      {/* Top Bar - Pure White */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/student/mentors')} className="w-10 h-10 flex items-center justify-center bg-[#F5F6FA] rounded-xl text-[#8B9BB4] hover:text-[#E8132A] hover:bg-[#FEF0F1] transition-all active:scale-95 border border-[#E2E8F0]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#0A1628] font-display leading-tight">Faculty Intelligence Profile</h1>
            <p className="text-[10px] text-[#4A5568] font-bold uppercase tracking-[0.15em] mt-0.5 flex items-center gap-2">
               <Check size={12} className="text-[#00A86B]" /> Verified NIET Mentor Profile
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Mentor Profile (Left) */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="niet-card p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#E8132A]" />
              
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#E2E8F0] p-1 mx-auto mb-6 relative group">
                <div className="w-full h-full bg-[#F5F6FA] rounded-full overflow-hidden border-4 border-white">
                  <img
                    src={mentor.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=FEF0F1&color=E8132A&bold=true`}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#00A86B] rounded-full border-4 border-white flex items-center justify-center shadow-md">
                   <Check size={14} className="text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#0A1628] font-display">{mentor.name}</h2>
              <p className="text-[#E8132A] text-xs font-bold uppercase tracking-widest mt-1 mb-6">{mentor.designation}</p>

              <div className="bg-[#F5F6FA] rounded-2xl p-6 text-left space-y-4 text-[11px] text-[#4A5568] border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <Building size={16} className="text-[#E8132A] flex-shrink-0" />
                  <span className="font-bold">{mentor.department}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#E8132A] flex-shrink-0" />
                  <span className="font-bold text-[#0A1628] uppercase">{mentor.location || 'NIET Main Campus'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#00A86B] flex-shrink-0" />
                  <span className="font-bold">{mentor.experience_years} Years Experience</span>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setChatOpen(true)} className="niet-btn-primary flex-1 py-4 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20">
                  <MessageSquare size={18} /> AI CHAT
                </button>
                <button onClick={handleContact} className="niet-btn-outline flex-1 py-4 flex items-center justify-center gap-2">
                  <Mail size={18} className="text-[#E8132A]" /> CONTACT
                </button>
              </div>
            </motion.div>
          </div>

          {/* Extended Details & Chat (Right) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="niet-card p-8 border-t-4 border-t-[#CBD5E0]">
                <h3 className="font-bold text-[#0A1628] mb-6 flex items-center gap-3 text-sm font-display uppercase tracking-tight">
                  <BookOpen size={20} className="text-[#E8132A]" /> Research Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(mentor.research_areas || []).map((area: string, idx: number) => (
                    <span key={idx} className="bg-[#F5F6FA] text-[#4A5568] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-[#E2E8F0]">
                      {area}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="niet-card p-8 border-t-4 border-t-[#E8132A]">
                <h3 className="font-bold text-[#0A1628] mb-6 flex items-center gap-3 text-sm font-display uppercase tracking-tight">
                  <Lightbulb size={20} className="text-[#E8132A]" /> Patents & IP
                </h3>
                <ul className="space-y-3">
                  {(mentor.patents || []).slice(0, 3).map((patent: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-[11px] text-[#4A5568] font-medium leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-[#E8132A] rounded-full mt-1.5 flex-shrink-0" />
                      {patent}
                    </li>
                  ))}
                  {!mentor.patents?.length && <p className="text-[11px] text-[#8B9BB4] italic">No active patents listed in NIET archive.</p>}
                </ul>
              </motion.div>
            </div>

            {/* Availability Heatmap */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="niet-card p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-[#0A1628] flex items-center gap-3 text-sm font-display uppercase tracking-tight">
                  <Calendar size={20} className="text-[#E8132A]" /> Consultation Availability
                </h3>
                <div className="px-4 py-1.5 bg-[#E8F8F2] text-[#00A86B] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#00A86B]/20">
                  Live: Faculty In Office
                </div>
              </div>
              
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[600px]">
                  <div className="flex mb-6">
                    <div className="w-16" />
                    {['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM'].map((h) => (
                      <div key={h} className="flex-1 text-center text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest">{h}</div>
                    ))}
                  </div>
                  {heatmapData.map((row) => (
                    <div key={row.day} className="flex mb-3 items-center">
                      <div className="w-16 text-xs font-bold text-[#0A1628] font-display">{row.day.toUpperCase()}</div>
                      {row.hours.map((val, j) => (
                        <div
                          key={j}
                          className={`flex-1 h-12 mx-1.5 rounded-xl transition-all border-2 ${
                            val === 2 ? 'bg-[#E8132A] border-[#E8132A] shadow-lg shadow-red-500/10' : val === 1 ? 'bg-[#FEF0F1] border-[#FCCDD0]' : 'bg-[#F5F6FA] border-[#E2E8F0]'
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                  <div className="flex items-center gap-8 mt-8 pt-6 border-t border-[#F5F6FA] text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-lg bg-[#E8132A]" /> Available</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-lg bg-[#FEF0F1] border border-[#FCCDD0]" /> Limited</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-lg bg-[#F5F6FA] border border-[#E2E8F0]" /> Class / Busy</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Chat Window */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="niet-card overflow-hidden shadow-2xl border-2 border-[#E2E8F0]"
                >
                  <div className="bg-white p-5 flex justify-between items-center text-[#0A1628] border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border-2 border-[#E8132A] overflow-hidden bg-white">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(mentor.name)}`} alt="" />
                      </div>
                      <div>
                        <p className="text-sm font-bold font-display uppercase tracking-tight">AI Mentor: {mentor.name}</p>
                        <p className="text-[10px] text-[#4A5568] font-bold uppercase tracking-widest flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" /> Synthesis Active
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setChatOpen(false)} className="text-[#8B9BB4] hover:text-[#E8132A] transition-colors">✕</button>
                  </div>
                  <div ref={chatRef} className="h-[400px] overflow-y-auto p-8 space-y-6 flex flex-col bg-[#F5F6FA]">
                    {chatHistory.map((c: any, i: number) => (
                      <div key={i} className={`max-w-[80%] p-5 rounded-2xl text-[13px] leading-relaxed font-medium shadow-sm ${
                        c.sender === 'mentor' ? 'bg-white text-[#0A1628] self-start border border-[#E2E8F0]' : 'bg-[#E8132A] text-white self-end shadow-red-500/10'
                      }`}>
                        {c.text}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="bg-white text-[#8B9BB4] self-start rounded-2xl p-4 flex items-center gap-3 text-[11px] font-bold border border-[#E2E8F0] shadow-sm">
                        <Loader2 size={14} className="animate-spin text-[#E8132A]" /> Mentorship protocol executing...
                      </div>
                    )}
                  </div>
                  <form onSubmit={sendMsg} className="p-5 bg-white border-t border-[#E2E8F0] flex gap-4">
                    <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Query the faculty expertise..." disabled={isTyping}
                      className="flex-1 bg-[#F5F6FA] border border-[#E2E8F0] rounded-xl px-5 py-3 text-sm font-bold text-[#0A1628] focus:border-[#E8132A] transition-all outline-none" />
                    <button type="submit" disabled={isTyping || !msg.trim()} className="niet-btn-primary w-12 h-12 flex items-center justify-center flex-shrink-0">
                       <SendIcon />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  )
}
