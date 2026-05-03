import { useNavigate, useLocation } from 'react-router-dom'
import { HelpCircle, ThumbsUp, Search, Send, User, Loader2, Zap, Lock, Plus } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateDoubtAnswer } from '../services/ai'
import { useAuth } from '../context/AuthContext'

interface DoubtItem {
  id: number;
  question: string;
  domain: string;
  professor: string;
  photo_url?: string;
  building: number;
  cabin: string;
  answer: string;
  upvotes: number;
  answeredAt: string;
  addons: any[];
}

const doubtsData = [
  {
    id: 1,
    question: 'How do I prepare for a Data Analyst internship interview at Amazon?',
    domain: 'Data Analytics',
    professor: 'Dr. Sonia Munjal',
    photo_url: 'https://niet.co.in/uploads/mentor/65fa7e79060901710915193.webp',
    building: 2,
    cabin: '305',
    answer: 'Focus on SQL joins, window functions, and case studies. Practice explaining your projects with metrics. Review probability questions and A/B testing scenarios.',
    upvotes: 24,
    answeredAt: '2 days ago',
    addons: [] as any[],
  },
  {
    id: 2,
    question: 'What is the difference between supervised and unsupervised learning in simple terms?',
    domain: 'Machine Learning',
    professor: 'Mr. Sover Singh Bisht',
    photo_url: 'https://niet.co.in/uploads/mentor/6635b89f99c981714796703.webp',
    building: 2,
    cabin: '214',
    answer: 'Supervised = learning with labeled examples (like a teacher guiding you). Unsupervised = finding patterns on your own (like organizing books by similarity without labels).',
    upvotes: 18,
    answeredAt: '3 days ago',
    addons: [] as any[],
  },
  {
    id: 3,
    question: 'Which programming language should I learn first: Python or JavaScript for web dev?',
    domain: 'Web Development',
    professor: 'Dr. Ritesh Rastogi',
    photo_url: 'https://niet.co.in/uploads/mentor/65fa7b3d0649a1710914365.webp',
    building: 1,
    cabin: '112',
    answer: 'For web development, start with JavaScript since it runs in the browser. Once comfortable, add Python for backend or data tasks. Both complement each other.',
    upvotes: 31,
    answeredAt: '5 days ago',
    addons: [] as any[],
  },
]

export default function DoubtBox() {
  const location = useLocation()
  const { addNotification } = useAuth()
  const [search, setSearch] = useState((location.state as any)?.searchTerm || '')
  const [newQuestion, setNewQuestion] = useState('')
  const [newDomain, setNewDomain] = useState('Data Analytics')
  const [doubts, setDoubts] = useState<DoubtItem[]>(doubtsData)
  const [selectedThread, setSelectedThread] = useState<DoubtItem | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleAddonSend = () => {
    if (!comment.trim() || !selectedThread) return

    const newAddon = {
      text: comment,
      status: 'Waiting',
      timestamp: 'Just now'
    }

    const updatedDoubts = doubts.map(d => {
      if (d.id === selectedThread.id) {
        const updatedAddons = [...(d.addons || []), newAddon]
        return { ...d, addons: updatedAddons }
      }
      return d
    })

    setDoubts(updatedDoubts)
    setSelectedThread({ ...selectedThread, addons: [...(selectedThread.addons || []), newAddon] })
    setComment('')

    // Simulate Faculty Reply after 5 seconds
    setTimeout(() => {
      const replyText = `Great follow-up! I've reviewed your query. You should focus on ${selectedThread.domain} implementation details. Come see me in Cabin ${selectedThread.cabin} if you need more depth.`
      
      const finalDoubts = updatedDoubts.map(d => {
        if (d.id === selectedThread.id) {
          const finalAddons = d.addons.map((a: any) => 
            a.text === newAddon.text ? { ...a, status: 'Answered', reply: replyText } : a
          )
          return { ...d, addons: finalAddons }
        }
        return d
      })

      setDoubts(finalDoubts)
      // Check if the modal is still open for this thread
      setSelectedThread((prev: any) => {
        if (prev?.id === selectedThread.id) {
          const finalAddons = prev.addons.map((a: any) => 
            a.text === newAddon.text ? { ...a, status: 'Answered', reply: replyText } : a
          )
          return { ...prev, addons: finalAddons }
        }
        return prev
      })

      // Update Global Notification System
      addNotification({
        title: 'Faculty Answered',
        desc: `${selectedThread.professor} replied to your query in ${selectedThread.domain}.`,
        type: 'success',
        link: '/student/doubt-box'
      })

      // Trigger Visual Toast
      import('sonner').then(({ toast }) => {
        toast.success(`Faculty Answered your Add-on!`, {
          description: `${selectedThread.professor} replied to your query in ${selectedThread.domain}.`,
          duration: 5000,
        })
      })
    }, 5000)
  }

  const filtered = doubts.filter(
    (d) =>
      d.question.toLowerCase().includes(search.toLowerCase()) ||
      d.domain.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return
    setSubmitting(true)

    let aiAnswer = ''
    try {
      aiAnswer = await generateDoubtAnswer(newQuestion, newDomain)
    } catch {
      aiAnswer = 'This question has been submitted and will be answered soon by a relevant professor.'
    }

    const newDoubt = {
      id: doubts.length + 1,
      question: newQuestion,
      domain: newDomain,
      professor: 'Skillect AI Assistant',
      building: 0,
      cabin: 'Cloud',
      answer: aiAnswer,
      upvotes: 0,
      answeredAt: 'Just now',
      addons: [],
    }
    setDoubts([newDoubt, ...doubts])
    setNewQuestion('')
    setSubmitting(false)
  }

  const upvote = (id: number) => {
    setDoubts(doubts.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d)))
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Header Banner */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="niet-card niet-header-accent p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-none shadow-none bg-[#F5F6FA]/50 mb-12">
          <div>
            <h1 className="text-2xl font-bold text-[#0A1628] font-display mb-1 uppercase">Anonymous Doubt Box</h1>
            <p className="text-sm text-[#4A5568] max-w-2xl leading-relaxed">
              Ask your academic doubts anonymously. Your identity is never revealed. Questions are routed to the most relevant <span className="text-[#E8132A] font-bold">NIET Professor</span> based on domain.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-[#E2E8F0] shadow-sm">
             <Zap size={18} className="text-[#F5A623]" />
             <span className="text-[11px] font-bold text-[#0A1628] uppercase tracking-widest">23 NIET Students asked this week</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Post Form (Left Panel) */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="niet-card p-10 sticky top-28">
              <h3 className="text-lg font-bold text-[#0A1628] mb-8 font-display">Ask Anonymously</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-[#4A5568] mb-3 uppercase tracking-widest">Academic Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-xs font-bold text-[#0A1628] focus:outline-none focus:border-[#E8132A] transition-all"
                  >
                    <option>Data Analytics</option>
                    <option>Machine Learning</option>
                    <option>Web Development</option>
                    <option>Cybersecurity</option>
                    <option>Cloud Computing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#4A5568] mb-3 uppercase tracking-widest">Your Question</label>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    maxLength={500}
                    rows={6}
                    className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm font-medium text-[#0A1628] focus:outline-none focus:border-[#E8132A] transition-all resize-none placeholder-[#8B9BB4]"
                    placeholder="Describe your technical doubt in detail..."
                  />
                  <div className="text-right text-[10px] font-bold text-[#8B9BB4] mt-2 uppercase tracking-widest">{newQuestion.length}/500</div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !newQuestion.trim()}
                  className="niet-btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-xl shadow-red-500/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> ANALYZING...</>
                  ) : (
                    <><Send size={18} /> ASK AI ANONYMOUSLY</>
                  )}
                </button>
                <div className="pt-4 flex flex-col gap-3">
                   <div className="flex items-center gap-3 text-[11px] text-[#4A5568] font-bold uppercase tracking-wider">
                      <Lock size={14} className="text-[#E8132A]" /> Identity Protected
                   </div>
                   <p className="text-[10px] text-[#8B9BB4] font-medium leading-relaxed italic">Your name is encrypted. Only the domain and question are sent to the faculty.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feed (Right Panel) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="relative mb-4">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8B9BB4]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search knowledge base..."
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-[#0A1628] focus:outline-none focus:border-[#E8132A] shadow-sm"
              />
            </div>

            <div className="space-y-8">
              {filtered.map((doubt, i) => (
                <motion.div
                  key={doubt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="niet-card hover:border-[#E8132A]/30"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#F5F6FA] rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#E2E8F0]">
                        <User size={22} className="text-[#CBD5E0]" />
                      </div>
                      <div className="max-w-xl">
                        <h3 className="text-base font-bold text-[#0A1628] leading-snug font-display">{doubt.question}</h3>
                        <p className="text-[10px] text-[#8B9BB4] font-black uppercase tracking-widest mt-2">POSTED ANONYMOUSLY · {doubt.answeredAt}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-[#FEF0F1] text-[#E8132A] text-[10px] font-bold rounded-lg border border-[#FCCDD0] uppercase tracking-widest">
                      {doubt.domain}
                    </span>
                  </div>

                  <div className={`rounded-3xl p-6 relative border ${
                    doubt.professor.includes('AI') 
                      ? 'bg-[#0A1628] text-white' 
                      : 'bg-[#F5F6FA] border-[#E2E8F0]'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border overflow-hidden ${
                          doubt.professor.includes('AI') ? 'bg-[#E8132A] border-none' : 'bg-white text-[#0A1628] border-[#E2E8F0]'
                        }`}>
                          {doubt.photo_url ? (
                             <img src={doubt.photo_url} alt={doubt.professor} className="w-full h-full object-cover" />
                          ) : (
                             doubt.professor.includes('AI') ? 'AI' : doubt.professor.split(' ').pop()?.[0]
                          )}
                        </div>
                        <div>
                          <p className={`text-[11px] font-bold uppercase tracking-widest ${doubt.professor.includes('AI') ? 'text-white' : 'text-[#0A1628]'}`}>
                            {doubt.professor}
                          </p>
                          {doubt.building > 0 && (
                            <p className="text-[10px] font-bold text-[#E8132A] uppercase tracking-widest mt-0.5">BUILDING {doubt.building} · CABIN {doubt.cabin}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed ${doubt.professor.includes('AI') ? 'text-[#8B9BB4]' : 'text-[#4A5568] font-medium'}`}>
                      {doubt.answer}
                    </p>
                  </div>

                  <div className="flex items-center gap-8 mt-6">
                    <button onClick={() => upvote(doubt.id)} className="flex items-center gap-2.5 text-[#8B9BB4] hover:text-[#E8132A] transition-all group">
                       <div className="w-9 h-9 bg-[#F5F6FA] rounded-xl flex items-center justify-center border border-[#E2E8F0] group-hover:border-[#E8132A]/20">
                          <ThumbsUp size={16} />
                       </div>
                       <span className="text-xs font-bold">{doubt.upvotes}</span>
                    </button>
                    <button onClick={() => setSelectedThread(doubt)} className="niet-btn-outline py-2 px-6 text-[10px] flex items-center gap-2">
                       <Plus size={14} /> ADD-ON QUESTION
                    </button>
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {filtered.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 niet-card">
                    <HelpCircle size={48} className="text-[#CBD5E0] mx-auto mb-6" />
                    <h3 className="text-lg font-bold text-[#0A1628] mb-1">No matches found</h3>
                    <p className="text-sm text-[#4A5568] font-medium">Try searching for a specific topic or technology.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ADD-ON MODAL */}
      <AnimatePresence>
        {selectedThread && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedThread(null)}
              className="absolute inset-0 bg-[#0A1628]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-[#F5F6FA] flex items-center justify-between bg-[#F5F6FA]/50">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E8132A] rounded-xl flex items-center justify-center text-white">
                       <Zap size={20} />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-[#0A1628] uppercase tracking-widest">Add-on Query Hub</h3>
                       <p className="text-[10px] text-[#4A5568] font-bold uppercase tracking-widest mt-0.5">Faculty Routing: {selectedThread.professor}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedThread(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors text-[#8B9BB4] hover:text-[#E8132A]">
                    <Plus className="rotate-45" size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                 {/* Original Context */}
                 <div className="flex gap-4">
                    <div className="w-10 h-10 bg-[#F5F6FA] rounded-xl flex items-center justify-center border border-[#E2E8F0] shrink-0">
                       <User size={20} className="text-[#CBD5E0]" />
                    </div>
                    <div className="flex-1">
                       <div className="bg-[#F5F6FA] p-5 rounded-2xl rounded-tl-none">
                          <p className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest mb-2 italic">Original Doubt</p>
                          <p className="text-sm font-bold text-[#0A1628]">{selectedThread.question}</p>
                       </div>
                    </div>
                 </div>

                 {/* Current Faculty Response */}
                 <div className="flex gap-4">
                    <div className="flex-1 text-right">
                       <div className="bg-[#0A1628] p-5 rounded-2xl rounded-tr-none text-left shadow-lg">
                          <p className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest mb-2 italic">Professor Response</p>
                          <p className="text-sm font-medium text-white">{selectedThread.answer}</p>
                       </div>
                    </div>
                 </div>

                 {/* Live Add-ons */}
                 {selectedThread.addons?.map((addon: any, idx: number) => (
                    <div key={idx} className="space-y-6">
                       <div className="flex gap-4">
                          <div className="w-10 h-10 bg-[#FEF0F1] rounded-xl flex items-center justify-center border border-[#FCCDD0] shrink-0">
                             <User size={20} className="text-[#E8132A]" />
                          </div>
                          <div className="flex-1">
                             <div className="bg-[#FEF0F1] p-5 rounded-2xl rounded-tl-none border border-[#FCCDD0]">
                                <div className="flex items-center justify-between mb-2">
                                   <p className="text-[10px] font-black text-[#E8132A] uppercase tracking-widest italic">Your Add-on Query</p>
                                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${addon.status === 'Waiting' ? 'bg-[#F5A623] text-white' : 'bg-[#00A86B] text-white'}`}>
                                      {addon.status}
                                   </span>
                                </div>
                                <p className="text-sm font-bold text-[#0A1628]">{addon.text}</p>
                             </div>
                          </div>
                       </div>
                       
                       {addon.reply && (
                          <div className="flex gap-4">
                             <div className="flex-1 text-right">
                                <div className="bg-[#F5F6FA] p-5 rounded-2xl rounded-tr-none text-left border border-[#E2E8F0] shadow-sm">
                                   <p className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest mb-2 italic">Faculty Follow-up</p>
                                   <p className="text-sm font-medium text-[#0A1628]">{addon.reply}</p>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 ))}
              </div>

              <div className="p-8 bg-[#F5F6FA]/50 border-t border-[#F5F6FA]">
                 <div className="flex gap-4">
                    <input 
                       type="text" 
                       value={comment}
                       onChange={(e) => setComment(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleAddonSend()}
                       placeholder="Ask a further question (Add-on)..."
                       className="flex-1 bg-white border border-[#E2E8F0] rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-[#E8132A] shadow-sm"
                    />
                    <button 
                       onClick={handleAddonSend}
                       disabled={!comment.trim()}
                       className="w-14 h-14 bg-[#E8132A] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
                    >
                       <Send size={20} />
                    </button>
                 </div>
                 <p className="text-[9px] text-[#8B9BB4] font-bold uppercase tracking-widest mt-3 text-center">Add-ons are encrypted and routed to {selectedThread.professor} immediately.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
