import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import { motion } from 'framer-motion'

interface LayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300">
      <Header />
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {children}
      </motion.main>
      {showFooter && <Footer />}
    </div>
  )
}
