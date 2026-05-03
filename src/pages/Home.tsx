import { useScroll, useSpring, motion } from 'framer-motion'
import LiveActivityTicker from './Home/components/LiveActivityTicker'
import Hero from './Home/components/Hero'
import FeatureSection from './Home/components/FeatureSection'
import PlatformShowcase from './Home/components/PlatformShowcase'
import GapScoreDemo from './Home/components/GapScoreDemo'

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="relative">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E31E24] to-[#00C2FF] origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Main Sections */}
      <LiveActivityTicker />
      <Hero />
      <FeatureSection />
      <PlatformShowcase />
      <GapScoreDemo />

      {/* Trust Quote Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100">
                <span className="text-3xl">"</span>
              </div>
            </div>
            <h3 className="text-3xl lg:text-5xl font-display font-black text-[#1e293b] leading-tight italic">
              "We don't just teach technology; we build the <span className="text-[#E31E24]">intelligence</span> to master it."
            </h3>
            <div className="space-y-2">
              <div className="text-sm font-black text-[#1e293b] uppercase tracking-widest">Innovation Council</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">NIET Greater Noida</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
