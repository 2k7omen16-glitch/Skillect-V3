import { motion } from 'framer-motion'
import { GraduationCap, FlaskConical, Briefcase, Brain } from 'lucide-react'

export default function FeatureSection() {
  return (
    <section className="bg-gray-50 py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="text-[#E31E24] text-[10px] font-black uppercase tracking-[0.4em] mb-6">Core Ecosystem</div>
          <h2 className="text-4xl lg:text-6xl font-display font-black text-[#1e293b] leading-tight mb-8">
            Empowering the next generation of <span className="text-[#E31E24]">Innovators</span>
          </h2>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            Skillect bridges the gap between campus learning and industry expectations through high-performance intelligence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<GraduationCap size={32} />}
            title="Engineering School"
            description="Premier multidisciplinary education with 10+ core specializations and lab excellence."
            delay={0.1}
          />
          <FeatureCard
            icon={<FlaskConical size={32} />}
            title="Pharmacy Excellence"
            description="NIRF Ranked 27th All India with state-of-the-art research centers."
            delay={0.2}
          />
          <FeatureCard
            icon={<Briefcase size={32} />}
            title="Business Leadership"
            description="PGDM programs focused on global management, data, and fintech analytics."
            delay={0.3}
          />
          <FeatureCard
            icon={<Brain size={32} />}
            title="Future Tech Hub"
            description="Dedicated AI, ML, and Blockchain centers for future-proof engineering skills."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white border border-gray-100 rounded-[3rem] p-10 hover:shadow-[0_40px_80px_-15px_rgba(227,30,36,0.12)] hover:border-[#E31E24]/20 transition-all group cursor-default shadow-sm"
    >
      <div className="w-16 h-16 bg-red-50 rounded-[1.5rem] flex items-center justify-center text-[#E31E24] mb-8 group-hover:scale-110 group-hover:bg-[#E31E24] group-hover:text-white transition-all shadow-sm">
        {icon}
      </div>
      <h3 className="text-[#1e293b] font-display font-black text-2xl mb-4 tracking-tight group-hover:text-[#E31E24] transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm font-medium leading-relaxed">{description}</p>
    </motion.div>
  )
}
