import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-14 h-8 flex items-center bg-gray-100 dark:bg-slate-800 rounded-full p-1 transition-colors duration-300 border border-gray-200 dark:border-slate-700 shadow-sm"
      aria-label="Toggle Theme"
    >
      <div className="absolute left-1 right-1 flex justify-between px-1 pointer-events-none">
        <Sun size={12} className="text-amber-500" />
        <Moon size={12} className="text-blue-400" />
      </div>
      
      <motion.div
        animate={{ x: theme === 'dark' ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-6 h-6 bg-white dark:bg-slate-900 rounded-full shadow-md flex items-center justify-center z-10"
      >
        {theme === 'light' ? (
          <Sun size={14} className="text-amber-500" />
        ) : (
          <Moon size={14} className="text-blue-400" />
        )}
      </motion.div>
    </motion.button>
  )
}
