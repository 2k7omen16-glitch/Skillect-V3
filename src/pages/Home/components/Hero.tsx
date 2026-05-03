import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Box, FlaskConical, Lightbulb } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CampusModelViewer from './CampusModelViewer'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-100/30 rounded-full -mr-72 -mt-72 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full -ml-40 -mb-40 blur-[100px] -z-10" />

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -40 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-3 bg-red-50/50 backdrop-blur-sm px-5 py-2.5 rounded-full text-[#E31E24] text-[10px] font-black uppercase tracking-[0.25em] mb-10 border border-red-100 shadow-sm">
            <Sparkles size={14} className="animate-pulse" /> AI-Powered Career Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-black text-[#1e293b] dark:text-slate-50 leading-[0.95] mb-8 tracking-[-0.04em]">
            Take charge of<br />your <span className="text-[#E31E24] relative">passion<span className="absolute -bottom-1 left-0 w-full h-4 bg-[#E31E24]/10 -z-10 -rotate-1 rounded-full" /></span>
          </h1>
          
          <p className="text-gray-500 dark:text-slate-400 text-lg sm:text-xl mb-12 max-w-xl leading-relaxed font-medium">
            Map your skills against real industry requirements, unlock <span className="text-[#1e293b] dark:text-slate-200 font-bold">personalized AI learning roadmaps</span>, and connect with 200+ NIET experts in one tap.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-[#E31E24] hover:bg-[#c41a20] text-white px-10 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-2xl shadow-red-200 active:scale-95 group"
            >
              Start Journey <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 hover:border-[#1e293b] dark:hover:border-slate-700 text-[#1e293b] dark:text-slate-100 px-10 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm hover:shadow-xl"
            >
              Login
            </button>
          </div>

          <div className="mt-16 flex items-center gap-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div 
                  key={i} 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 * i }}
                  className="w-12 h-12 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gray-100 hover:-translate-y-2 transition-transform cursor-pointer"
                >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}&backgroundColor=ffdfbf`} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
            <div className="space-y-1">
              <div className="text-base font-black text-[#1e293b] dark:text-slate-100 font-display">500+ Active Students</div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />)}
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time mapping</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1, ease: "easeOut" }} 
          className="relative"
        >
          <SkillTag label="React" top="10%" left="-10%" delay={0.5} />
          <SkillTag label="Python" top="40%" right="-15%" delay={1.2} color="bg-blue-500" />
          <SkillTag label="LLaMA 3.3" bottom="20%" left="-5%" delay={0.8} color="bg-purple-500" />
          <SkillTag label="Groq AI" top="5%" right="5%" delay={1.5} color="bg-emerald-500" />

          <div className="absolute inset-0 bg-gradient-to-tr from-[#E31E24]/30 to-blue-500/10 rounded-[3.5rem] rotate-3 blur-3xl -z-10" />
          
          <div className="relative overflow-hidden group min-h-[600px] flex items-center justify-center">
            <CampusModelViewer />
            
          </div>
        </motion.div>
      </div>

      {/* Landmark Buildings Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mt-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#1e293b] dark:text-slate-50 leading-tight tracking-tight">
            Explore NIET's <span className="text-[#E31E24]">3 Landmark</span> Buildings
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-12 bg-[#E31E24] rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Interactive 3D Experience</span>
            <div className="h-1 w-12 bg-[#E31E24] rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
          <BuildingCard 
            icon={<Box size={24} className="text-[#E31E24]" />} 
            title="Pyramid Block" 
            desc="The iconic architectural marvel of NIET." 
            delay={0.1} 
          />
          <BuildingCard 
            icon={<FlaskConical size={24} className="text-[#00C2FF]" />} 
            title="Pharmacy Institute" 
            desc="NIRF 27th Rank - Center for Pharma Research." 
            delay={0.2} 
          />
          <BuildingCard 
            icon={<Lightbulb size={24} className="text-amber-400" />} 
            title="Innovation Hub" 
            desc="Home to AI, ML and future-tech laboratories." 
            delay={0.3} 
          />
        </div>
      </motion.div>
    </section>
  )
}

function BuildingCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#E31E24]/20 transition-all group cursor-default p-6 rounded-[2.5rem]"
    >
      <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-[#1e293b] dark:text-slate-100 font-display font-black text-lg mb-1">{title}</h3>
      <p className="text-gray-400 dark:text-slate-500 text-xs font-medium leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function SkillTag({ label, top, left, right, bottom, delay, color = "bg-[#E31E24]" }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className={`absolute z-20 px-6 py-2.5 rounded-2xl ${color} text-white text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-black/20 backdrop-blur-md border border-white/20`}
      style={{ top, left, right, bottom }}
    >
      {label}
    </motion.div>
  )
}
