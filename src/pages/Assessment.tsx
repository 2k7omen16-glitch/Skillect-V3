import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CheckCircle, Circle, BrainCircuit, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { generateSkillChecklist, generateGapScore } from '../services/ai'
import { useAuth } from '../context/AuthContext'

interface SkillItem { name: string; weight: number }
interface ChecklistData {
  must_have: SkillItem[]
  good_to_have: SkillItem[]
  bonus: SkillItem[]
}

const FALLBACK: ChecklistData = {
  must_have: [
    { name: 'SQL', weight: 15 },
    { name: 'Python', weight: 15 },
    { name: 'Excel / Google Sheets', weight: 10 },
    { name: 'Statistics & Probability', weight: 10 },
    { name: 'Data Visualization', weight: 10 },
  ],
  good_to_have: [
    { name: 'Tableau / Power BI', weight: 8 },
    { name: 'Pandas & NumPy', weight: 8 },
    { name: 'Data Cleaning', weight: 6 },
    { name: 'A/B Testing', weight: 6 },
  ],
  bonus: [
    { name: 'AWS / Cloud Basics', weight: 5 },
    { name: 'Machine Learning Basics', weight: 4 },
    { name: 'ETL Pipelines', weight: 3 },
  ],
}

export default function Assessment() {
  const navigate = useNavigate()
  const location = useLocation()
  const { updateUserData } = useAuth()
  const role = location.state?.role || 'SDE Intern'

  const [checklist, setChecklist] = useState<ChecklistData | null>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [gapResult, setGapResult] = useState<any>(null)

  useEffect(() => {
    const loadChecklist = async () => {
      setLoading(true)
      try {
        const data = await generateSkillChecklist(role)
        setChecklist(data?.must_have ? data : FALLBACK)
      } catch {
        setChecklist(FALLBACK)
      } finally {
        setLoading(false)
      }
    }
    loadChecklist()
  }, [role])

  const toggleSkill = (skill: string) => {
    const next = new Set(checked)
    if (next.has(skill)) next.delete(skill)
    else next.add(skill)
    setChecked(next)
  }

  const allSkills = checklist ? [...checklist.must_have, ...checklist.good_to_have, ...checklist.bonus] : []
  const totalWeight = allSkills.reduce((sum, s) => sum + s.weight, 0)
  const earnedWeight = allSkills.filter((s) => checked.has(s.name)).reduce((sum, s) => sum + s.weight, 0)
  const localScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0

  const handleSubmit = async () => {
    setGenerating(true)
    try {
      const knownSkills = Array.from(checked)
      const aiResult = await generateGapScore(knownSkills, role)
      const finalScore = aiResult?.gapScore ?? localScore
      updateUserData({ readiness_score: finalScore, skills_mastered: checked.size, total_skills: allSkills.length })
      localStorage.setItem('skillect_gapscore', String(finalScore))
      setGapResult({ ...aiResult, gapScore: finalScore })
      setSubmitted(true)
    } catch {
      updateUserData({ readiness_score: localScore, skills_mastered: checked.size, total_skills: allSkills.length })
      localStorage.setItem('skillect_gapscore', String(localScore))
      setGapResult({ gapScore: localScore })
      setSubmitted(true)
    } finally {
      setGenerating(false)
    }
  }

  if (loading || generating) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12">
           <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl animate-pulse" />
           <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center relative border border-gray-50">
             <BrainCircuit size={48} className="text-[#E8132A] animate-bounce" />
           </div>
        </div>
        <h2 className="text-3xl font-black text-[#0A1628] tracking-tight mb-2 font-display">
          {generating ? 'Executing AI Skill Audit...' : 'Synthesizing Industry Requirements...'}
        </h2>
        <p className="text-[#4A5568] text-xs font-bold uppercase tracking-[0.2em]">{role}</p>
        <div className="mt-12 flex gap-1">
           {[0, 1, 2].map((i) => (
             <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, delay: i * 0.2 }} className="w-2 h-2 bg-[#E8132A] rounded-full" />
           ))}
        </div>
      </div>
    )
  }

  if (!checklist) return null

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Top Header Banner */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="niet-card niet-header-accent p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-none shadow-none bg-[#F5F6FA]/50 mb-10">
          <div>
            <h1 className="text-xl font-bold text-[#0A1628] font-display mb-1">ASSESSMENT PROTOCOL</h1>
            <p className="text-xs text-[#4A5568] max-w-2xl leading-relaxed">
              Check the skills you have mastered. Skillect AI will calculate your <span className="text-[#E8132A] font-bold">Gap Score</span> and generate a personalized roadmap.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-[#E2E8F0] shadow-sm">
             <Sparkles size={16} className="text-[#E8132A]" />
             <span className="text-[10px] font-bold text-[#0A1628] uppercase tracking-widest">NIET Academic Profile Linked</span>
          </div>
        </div>

        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
            <div className="space-y-12">
              <Section 
                title="Must-Have Essentials" 
                subtitle="CORE FOUNDATION • HIGHEST WEIGHT" 
                items={checklist.must_have} 
                checked={checked} 
                toggle={toggleSkill} 
                theme="red" 
                weightBadge="60% of Gap Score"
              />
              <Section 
                title="Industry Leverage" 
                subtitle="GOOD TO HAVE • PROFILE STRENGTH" 
                items={checklist.good_to_have} 
                checked={checked} 
                toggle={toggleSkill} 
                theme="amber" 
                weightBadge="30% of Gap Score"
              />
              <Section 
                title="Bonus Edge" 
                subtitle="EXTRA ADVANTAGE • COMPETITIVE EDGE" 
                items={checklist.bonus} 
                checked={checked} 
                toggle={toggleSkill} 
                theme="green" 
                weightBadge="10% of Gap Score"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
            <div className="bg-white rounded-[1.5rem] p-10 shadow-2xl border border-[#E2E8F0] text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-[#E8132A]" />
               <div className="relative">
                  <p className="text-[10px] font-bold text-[#4A5568] uppercase tracking-[0.2em] mb-4">Aggregate Readiness Score</p>
                  <div className={`text-6xl font-bold tracking-tighter mb-4 font-display ${
                    (gapResult?.gapScore ?? localScore) >= 71 ? 'text-[#00A86B]' :
                    (gapResult?.gapScore ?? localScore) >= 41 ? 'text-[#F5A623]' : 'text-[#E8132A]'
                  }`}>
                    {gapResult?.gapScore ?? localScore}<span className="text-xl text-gray-200">/100</span>
                  </div>
                  <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
                    (gapResult?.gapScore ?? localScore) >= 71 ? 'bg-[#E8F8F2] text-[#00A86B]' :
                    (gapResult?.gapScore ?? localScore) >= 41 ? 'bg-[#FFF9E6] text-[#F5A623]' : 'bg-[#FEF0F1] text-[#E8132A]'
                  }`}>
                    {(gapResult?.gapScore ?? localScore) >= 71 ? <CheckCircle size={14} /> : <Zap size={14} />}
                    {(gapResult?.gapScore ?? localScore) >= 71 ? 'BATTLE READY' :
                     (gapResult?.gapScore ?? localScore) >= 41 ? 'DEVELOPING' : 'FOUNDATION CRITICAL'}
                  </div>
               </div>
            </div>

            {gapResult?.missingSkills && gapResult.missingSkills.length > 0 && (
              <div className="niet-card niet-header-accent p-12">
                <h3 className="text-xl font-bold text-[#0A1628] mb-10 flex items-center gap-4 font-display">
                  <Sparkles size={24} className="text-[#E8132A]" />
                  Strategic Skill Gaps
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {gapResult.missingSkills.map((s: any, i: number) => (
                    <div key={i} className={`p-6 rounded-2xl border-2 transition-all hover:translate-x-1 ${
                      s.priority === 'Must-Have' ? 'bg-[#FEF0F1] border-[#FCCDD0]' : 'bg-[#FFF9E6] border-[#FDE68A]'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[#0A1628] text-base">{s.skill}</span>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                          s.priority === 'Must-Have' ? 'bg-[#E8132A] text-white' : 'bg-[#F5A623] text-white'
                        }`}>
                          {s.priority}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#4A5568] font-bold uppercase tracking-widest">Industry Relevance: Critical</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6">
              <button onClick={() => { setSubmitted(false); setGapResult(null) }} className="niet-btn-outline flex-1 py-5">
                RECALIBRATE ASSESSMENT
              </button>
              <button onClick={() => navigate('/student/roadmap', { state: { score: gapResult?.gapScore ?? localScore, role, insights: gapResult } })} className="niet-btn-primary flex-[2] py-5 flex items-center justify-center gap-3">
                VIEW AI ROADMAP <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      {!submitted && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-[72px] bg-white border-t border-[#E2E8F0] px-8 py-3 z-40 shadow-2xl flex items-center justify-between transition-all" style={{ left: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'auto' : '0', width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'calc(100% - 72px)' : '100%' }}>
           <div className="hidden md:block">
              <p className="text-[8px] font-bold text-[#8B9BB4] uppercase tracking-widest mb-0.5">Current Selection</p>
              <p className="text-xs font-bold text-[#0A1628]">{checked.size} <span className="text-[#8B9BB4] font-medium">skills mastered</span></p>
           </div>
           <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="flex-1 md:w-40">
                 <div className="h-1 bg-[#F5F6FA] rounded-full overflow-hidden mb-0.5">
                    <div className="h-full bg-[#E8132A] transition-all duration-500" style={{ width: `${(checked.size / allSkills.length) * 100}%` }} />
                 </div>
                 <p className="text-[8px] text-[#4A5568] font-bold uppercase tracking-widest">{Math.round((checked.size / allSkills.length) * 100)}% Complete</p>
              </div>
              <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                 <div className="flex items-center gap-1.5 bg-[#0A1628] text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg animate-bounce-slow">
                   <Sparkles size={10} className="text-[#F5A623]" /> Strategic Insight Ready
                 </div>
                 <button onClick={handleSubmit} className="niet-btn-primary px-8 py-3.5 flex items-center gap-2 shadow-2xl shadow-red-500/30 group text-xs uppercase tracking-wider">
                   CALCULATE GAP SCORE <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, subtitle, items, checked, toggle, theme, weightBadge }: any) {
  const themeStyles: any = {
    red: { dot: 'bg-[#E8132A]', badge: 'bg-[#FEF0F1] text-[#E8132A]' },
    amber: { dot: 'bg-[#F5A623]', badge: 'bg-[#FFF9E6] text-[#F5A623]' },
    green: { dot: 'bg-[#00A86B]', badge: 'bg-[#E8F8F2] text-[#00A86B]' },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 niet-header-accent">
         <div className="flex items-center gap-4">
            <div className={`w-2.5 h-2.5 rounded-full ${themeStyles[theme].dot} animate-pulse`} />
            <div>
               <h3 className="font-bold text-[#0A1628] text-base tracking-tight font-display leading-none uppercase">{title}</h3>
               <p className="text-[9px] text-[#4A5568] font-bold uppercase tracking-[0.2em] mt-1.5">{subtitle}</p>
            </div>
         </div>
         <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${themeStyles[theme].badge}`}>
           {weightBadge}
         </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((s: any) => (
          <button
            key={s.name}
            onClick={() => toggle(s.name)}
            className={`niet-card text-left flex flex-col group p-5 ${
              checked.has(s.name)
                ? 'border-[#E8132A] bg-[#FEF0F1] shadow-md -translate-y-1'
                : 'bg-white hover:border-[#E8132A]/30'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                checked.has(s.name) ? 'bg-[#E8132A] text-white' : 'bg-[#F5F6FA] text-[#CBD5E0]'
              }`}>
                {checked.has(s.name) ? <CheckCircle size={18} /> : <Circle size={18} />}
              </div>
              <div className="flex gap-1.5">
                {theme === 'red' && (
                  <span className="bg-[#E8132A] text-white text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-[0.15em] shadow-sm">Critical</span>
                )}
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap ${
                  checked.has(s.name) ? 'bg-[#E8132A] text-white shadow-sm' : 'bg-[#F5F6FA] text-[#8B9BB4]'
                }`}>
                  +{s.weight} PTS
                </span>
              </div>
            </div>
            <span className={`font-bold text-sm leading-tight transition-colors font-display ${checked.has(s.name) ? 'text-[#0A1628]' : 'text-[#4A5568]'}`}>
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
