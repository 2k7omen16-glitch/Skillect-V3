import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LiveActivityTicker() {
  const [activities] = useState([
    "Rahul verified ERP ID (2026-CS-041)",
    "Priya generated MERN Roadmap with AI",
    "Prof. Amit approved a Doubt Box query",
    "Siddharth matched with Mentor 'S. Gupta'",
    "New domain pulse: 'Next.js 15 launched'",
    "Aryan improved Gap Score by 12 points"
  ])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [activities.length])

  return (
    <div className="bg-[#1e293b] py-4 border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Pulse</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="relative h-5 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[11px] font-bold text-white/60 uppercase tracking-wider flex items-center gap-3"
            >
              {activities[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
