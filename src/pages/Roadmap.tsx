import { ArrowLeft, ExternalLink, PlayCircle, BookOpen, X, CheckCircle, ZoomIn, ZoomOut, LayoutGrid, Check, Trophy, GraduationCap, Building2, Users, Book, School, Map, ChevronRight, Zap, Award } from 'lucide-react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { roadmapPaths } from '../data/roadmapData'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'

export default function Roadmap() {
  const { user } = useAuth()
  const [activePathId, setActivePathId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({})

  const activePath = useMemo(() => {
    return roadmapPaths.find(p => p.id === activePathId) || null
  }, [activePathId])

  const selectedNode = useMemo(() => {
    if (!activePath) return null
    return activePath.nodes.find(n => n.id === selectedNodeId) || null
  }, [activePath, selectedNodeId])

  useEffect(() => {
    if (user && activePathId) {
      const fetchProgress = async () => {
        const { data } = await supabase.from('user_roadmap_progress').select('node_id, is_completed').eq('user_id', user.id).eq('roadmap_id', activePathId)
        if (data) {
          const map: Record<string, boolean> = {}
          data.forEach(p => map[p.node_id] = p.is_completed)
          setUserProgress(map)
        }
      }
      fetchProgress()
    }
  }, [user, activePathId])

  const toggleProgress = async (nodeId: string) => {
    if (!user || !activePathId) return
    const isCompleted = !userProgress[nodeId]
    setUserProgress(prev => ({ ...prev, [nodeId]: isCompleted }))
    
    await supabase.from('user_roadmap_progress').upsert({
      user_id: user.id,
      roadmap_id: activePathId,
      node_id: nodeId,
      is_completed: isCompleted,
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id,roadmap_id,node_id' })
  }

  // Winding Path Logic
  const getPositionForIndex = (index: number) => {
    const row = Math.floor(index / 3)
    const col = index % 3
    const isEvenRow = row % 2 === 0
    
    // Horizontal spacing: 400px, Vertical spacing: 300px
    const x = isEvenRow ? col * 400 : (2 - col) * 400
    const y = row * 300
    
    return { x: x + 150, y: y + 150 }
  }

  const generateCurvedPath = (nodes: any[]) => {
    if (nodes.length < 2) return ""
    let d = `M ${getPositionForIndex(0).x} ${getPositionForIndex(0).y}`
    
    for (let i = 0; i < nodes.length - 1; i++) {
      const p1 = getPositionForIndex(i)
      const p2 = getPositionForIndex(i + 1)
      
      // Calculate control points for smooth winding
      const midY = (p1.y + p2.y) / 2
      const cp1 = { x: p1.x, y: midY }
      const cp2 = { x: p2.x, y: midY }
      
      if (p1.y === p2.y) {
        // Horizontal connection (same row)
        const midX = (p1.x + p2.x) / 2
        d += ` Q ${midX} ${p1.y - 40}, ${p2.x} ${p2.y}`
      } else {
        // Turning point (next row)
        d += ` C ${p1.x} ${p1.y + 150}, ${p2.x} ${p2.y - 150}, ${p2.x} ${p2.y}`
      }
    }
    return d
  }

  const getIconForType = (type: string, index: number) => {
    const icons = [School, GraduationCap, Users, Book, Award, Trophy, Map]
    const Icon = icons[index % icons.length]
    return <Icon size={24} />
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#4ade80] rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[#4ade80] rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[30%] w-64 h-64 bg-[#22d3ee] rounded-full blur-[80px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 z-[200]">
        <div className="flex items-center gap-6">
          <button onClick={() => { if (activePathId) setActivePathId(null); else window.history.back(); }} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-black border border-slate-100 transition-all hover:scale-105 active:scale-95 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
             <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4ade80]">Learning Roadmap</h1>
             <span className="text-xl font-black text-[#0A1628] tracking-tight">{activePath ? activePath.title : 'Discovery Hub'}</span>
          </div>
        </div>
        
        {activePathId && (
          <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-bold text-slate-600 flex items-center gap-2">
              <CheckCircle size={14} className="text-[#4ade80]" />
              {Object.values(userProgress).filter(v => v).length} / {activePath?.nodes.length} Steps Completed
            </div>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {!activePathId ? (
          <motion.main key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-32 pb-20 px-8 max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-6">
              <h2 className="text-7xl font-black text-[#0A1628] leading-[0.9] tracking-tighter">
                Evolve Your <br/> <span className="text-[#4ade80] drop-shadow-sm">Architectural</span> Vision.
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Select a specialized mastery path designed by industry experts to accelerate your technical growth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roadmapPaths.map((path) => (
                <motion.div key={path.id} whileHover={{ y: -10, scale: 1.02 }} className="group relative" onClick={() => setActivePathId(path.id)}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/10 to-[#22d3ee]/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative h-full bg-white border-2 border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />
                    <div>
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl mb-8 border border-slate-100 shadow-inner group-hover:bg-[#4ade80] group-hover:text-white transition-colors">
                        🚀
                      </div>
                      <h3 className="text-2xl font-black text-[#0A1628] uppercase tracking-tight mb-4 group-hover:text-[#4ade80] transition-colors">{path.title}</h3>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed italic line-clamp-3">{path.description}</p>
                    </div>
                    <div className="mt-10 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Skillect Exclusive</span>
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-lg">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.main>
        ) : (
          <motion.main key="flowchart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-20 bg-white">
            <div className="max-w-[1200px] mx-auto px-12 relative overflow-visible">
              
              {/* Infographic SVG Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0" style={{ minHeight: (Math.ceil((activePath?.nodes.length || 0) / 3)) * 300 + 300 }}>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                  </marker>
                </defs>
                <path
                  d={generateCurvedPath(activePath?.nodes || [])}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="4"
                  strokeDasharray="12 12"
                  className="opacity-40"
                />
              </svg>

              {/* Decorative Background Circles (Mint theme) */}
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {activePath?.nodes.map((_, i) => {
                   const pos = getPositionForIndex(i)
                   if (i % 2 === 0) return null
                   return (
                     <div key={i} className="absolute w-64 h-64 bg-[#4ade80]/5 rounded-full blur-3xl" style={{ left: pos.x - 100, top: pos.y - 100 }} />
                   )
                })}
              </div>

              {/* Interactive Nodes */}
              <div className="relative z-10" style={{ minHeight: (Math.ceil((activePath?.nodes.length || 0) / 3)) * 300 + 300 }}>
                {activePath?.nodes.map((node, i) => {
                  const pos = getPositionForIndex(i)
                  const completed = userProgress[node.id]
                  
                  return (
                    <div key={node.id} className="absolute" style={{ left: pos.x - 75, top: pos.y - 120 }}>
                      <div className="flex flex-col items-center group">
                        
                        {/* Number Indicator */}
                        <div className="mb-4 w-10 h-10 rounded-full border-2 border-dotted border-slate-200 flex items-center justify-center text-[11px] font-black text-slate-300">
                          {i + 1}
                        </div>

                        {/* Node Circle */}
                        <motion.button 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`w-36 h-36 rounded-full p-2 border-2 border-dotted transition-all relative ${completed ? 'border-[#4ade80]' : 'border-slate-200 group-hover:border-slate-400'}`}
                        >
                          <div className={`w-full h-full rounded-full flex flex-col items-center justify-center shadow-2xl transition-all overflow-hidden ${completed ? 'bg-[#4ade80] text-white' : 'bg-white text-slate-800 border border-slate-100 shadow-slate-200/50'}`}>
                            {getIconForType(node.type, i)}
                            <span className="mt-3 text-[10px] font-black uppercase tracking-widest px-4 line-clamp-2 leading-tight">{node.label}</span>
                            
                            {completed && (
                              <div className="absolute inset-0 bg-[#4ade80] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Check size={32} strokeWidth={4} />
                              </div>
                            )}
                          </div>
                        </motion.button>

                        {/* Label & Description */}
                        <div className="mt-6 text-center max-w-[200px]">
                          <h4 className={`text-xs font-black uppercase tracking-tight mb-1 ${completed ? 'text-[#4ade80]' : 'text-slate-900'}`}>{node.label}</h4>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight line-clamp-2">Master the core concepts of {node.label.toLowerCase()} in this phase.</p>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Final Destination Arrow */}
                <div className="absolute" style={{ 
                  left: getPositionForIndex(activePath?.nodes.length || 0).x - 40, 
                  top: getPositionForIndex(activePath?.nodes.length || 0).y - 100 
                }}>
                  <div className="w-20 h-20 bg-slate-50 rounded-full border-4 border-white shadow-xl flex items-center justify-center rotate-45">
                    <Zap size={32} className="text-[#4ade80]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Modal for Node Details */}
            <AnimatePresence>
              {selectedNode && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNodeId(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[250]" />
                  <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-[300] flex flex-col">
                    <div className="p-10 flex flex-col h-full overflow-y-auto custom-scrollbar">
                      <div className="flex justify-between items-start mb-12">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl ${userProgress[selectedNode.id] ? 'bg-[#4ade80]' : 'bg-slate-900'}`}>
                          {userProgress[selectedNode.id] ? <CheckCircle size={32} /> : <BookOpen size={32} />}
                        </div>
                        <button onClick={() => setSelectedNodeId(null)} className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                          <X size={24} />
                        </button>
                      </div>

                      <div className="space-y-6 mb-12">
                         <div className="space-y-2">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4ade80]">Current Module</span>
                           <h2 className="text-4xl font-black text-[#0A1628] leading-tight tracking-tighter">{selectedNode.content?.title || selectedNode.label}</h2>
                         </div>
                         <p className="text-slate-500 text-lg font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">
                           {selectedNode.content?.description || "Accelerate your mastery of this domain through our curated expert-led resources and hands-on exercises."}
                         </p>
                      </div>

                      <button onClick={() => toggleProgress(selectedNode.id)} className={`w-full py-6 rounded-3xl transition-all flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.2em] shadow-xl ${userProgress[selectedNode.id] ? 'bg-[#4ade80] text-white shadow-[#4ade80]/30' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                         {userProgress[selectedNode.id] ? <CheckCircle size={20} /> : <Trophy size={20} />}
                         {userProgress[selectedNode.id] ? 'Module Mastered' : 'Complete Module'}
                      </button>

                      <div className="mt-16 space-y-6">
                         <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-4 flex items-center gap-3">
                           <PlayCircle size={18} /> Deep Dive Resources
                         </h3>
                         <div className="grid gap-4">
                           {(selectedNode.content?.resources || []).map((res: any, idx: number) => (
                             <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="group p-6 bg-slate-50 rounded-[2rem] hover:bg-white border-2 border-transparent hover:border-[#4ade80] transition-all flex items-center justify-between shadow-sm hover:shadow-xl">
                                <div className="flex items-center gap-6">
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${res.type === 'video' ? 'bg-[#4ade80] text-white' : 'bg-slate-900 text-white'}`}>
                                      {res.type === 'video' ? <PlayCircle size={24} /> : <BookOpen size={24} />}
                                   </div>
                                   <div>
                                      <span className="block text-xs font-black uppercase text-slate-900 mb-1">{res.label}</span>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.type === 'video' ? 'Video Lesson' : 'Reading Material'}</span>
                                   </div>
                                </div>
                                <ExternalLink size={16} className="text-slate-300 group-hover:text-[#4ade80]" />
                             </a>
                           ))}
                         </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}

