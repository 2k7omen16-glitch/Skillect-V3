import { motion } from 'framer-motion'
import { Target, Zap, MessageSquare, FileText, LayoutDashboard, User } from 'lucide-react'

export default function PlatformShowcase() {
  return (
    <section className="py-28 bg-[#1e293b] rounded-[4rem] mx-4 lg:mx-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E31E24]/20 rounded-full blur-[150px] -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00C2FF]/10 rounded-full blur-[150px] -ml-40 -mb-40" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-24">
          <div className="max-w-2xl">
            <div className="text-[#E31E24] text-[10px] font-black uppercase tracking-[0.4em] mb-6">Platform Showcase</div>
            <h2 className="text-4xl lg:text-6xl font-display font-black leading-tight">
              One platform. <span className="text-gray-500">Infinite</span> career paths.
            </h2>
          </div>
          <div className="flex gap-12 lg:pb-4">
            <StatBox count="500+" label="Students" />
            <StatBox count="200+" label="NIET Experts" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <PlatformFeature 
            icon={<Target className="text-[#E31E24]" size={24} />} 
            title="Skill Checklist" 
            description="Verify your tech stack with ERP-linked data and get a real-time readiness score."
            accent="red"
          />
          <PlatformFeature 
            icon={<Zap className="text-[#00C2FF]" size={24} />} 
            title="AI Roadmap" 
            description="LLaMA 3.3 powered learning paths tailored to your specific industry gaps."
            accent="blue"
          />
          <PlatformFeature 
            icon={<MessageSquare className="text-indigo-400" size={24} />} 
            title="Doubt Box" 
            description="Anonymous community and mentor support to solve technical bottlenecks fast."
            accent="indigo"
          />
          <PlatformFeature 
            icon={<FileText className="text-emerald-400" size={24} />} 
            title="Resume Engine" 
            description="ATS-optimized resume builder that auto-syncs with your latest projects."
            accent="emerald"
          />
          <PlatformFeature 
            icon={<LayoutDashboard className="text-amber-400" size={24} />} 
            title="Career Pulse" 
            description="Real-time domain news and internship feeds curated for your interest."
            accent="amber"
          />
          <PlatformFeature 
            icon={<User className="text-purple-400" size={24} />} 
            title="Mentor Match" 
            description="Direct link to alumni and professors who have been in your shoes."
            accent="purple"
          />
        </div>
      </div>
    </section>
  )
}

function StatBox({ count, label }: { count: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-2"
    >
      <div className="text-5xl lg:text-6xl font-display font-black text-white">{count}</div>
      <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">{label}</div>
    </motion.div>
  )
}

function PlatformFeature({ icon, title, description, accent }: { icon: React.ReactNode; title: string; description: string; accent: string }) {
  const accentColors: Record<string, string> = {
    red: "hover:border-red-100/20 hover:bg-red-50/5",
    blue: "hover:border-blue-100/20 hover:bg-blue-50/5",
    indigo: "hover:border-indigo-100/20 hover:bg-indigo-50/5",
    emerald: "hover:border-emerald-100/20 hover:bg-emerald-50/5",
    amber: "hover:border-amber-100/20 hover:bg-amber-50/5",
    purple: "hover:border-purple-100/20 hover:bg-purple-50/5",
  }

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass-dark rounded-[2.5rem] p-10 transition-all border border-white/5 group ${accentColors[accent] || ''} hover:shadow-2xl`}
    >
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white transition-colors border border-white/5">
        {icon}
      </div>
      <h3 className="text-white font-display font-black text-xl mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm font-medium leading-relaxed">{description}</p>
    </motion.div>
  )
}
