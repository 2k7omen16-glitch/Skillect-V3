import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export default function GapScoreDemo() {
  return (
    <section className="py-28 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="text-[#00C2FF] text-[10px] font-black uppercase tracking-[0.4em] mb-6">Interactive Demo</div>
            <h2 className="text-4xl lg:text-5xl font-display font-black text-[#1e293b] mb-8 leading-tight">
              Calculate your <span className="text-[#00C2FF]">Gap Score</span> instantly
            </h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
              GenZ doesn't read manuals—they play with tools. Use our AI analyzer to see how ready you are for your dream role at <span className="font-bold text-[#1e293b]">Microsoft, Google, or NVIDIA</span>.
            </p>
            <ul className="space-y-4 mb-10">
              <ListItem icon={<CheckCircle size={20} className="text-emerald-500" />} text="Self-rated skill mapping algorithm" />
              <ListItem icon={<CheckCircle size={20} className="text-emerald-500" />} text="Real-time industry benchmark comparison" />
              <ListItem icon={<CheckCircle size={20} className="text-emerald-500" />} text="Personalized roadmap generation" />
            </ul>
            <button className="bg-[#1e293b] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00C2FF] transition-all active:scale-95 shadow-xl shadow-blue-100">
              Try the full analyzer →
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#00C2FF]/10 blur-3xl rounded-full" />
            <div className="relative glass-dark p-10 rounded-[3rem] border-white/5 shadow-2xl">
              <div className="space-y-8">
                <SkillSlider label="Frontend (React/Vite)" value={85} />
                <SkillSlider label="Backend (Python/Node)" value={42} />
                <SkillSlider label="AI/ML Concepts" value={65} />
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Calculated Readiness:</span>
                  <span className="text-[#00C2FF] font-display font-black text-4xl">64%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ListItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-4">
      {icon}
      <span className="text-gray-600 font-medium">{text}</span>
    </li>
  )
}

function SkillSlider({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs font-black text-white/80 uppercase tracking-widest">
        <span>{label}</span>
        <span className="text-[#00C2FF]">{value}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#00C2FF] to-blue-400"
        />
      </div>
    </div>
  )
}
