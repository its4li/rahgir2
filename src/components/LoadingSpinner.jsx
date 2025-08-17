'use client'
import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div className="relative w-16 h-16 mb-4" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500"></div>
      </motion.div>
      <motion.p className="text-gray-400 text-lg" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
        در حال بارگذاری...
      </motion.p>
    </div>
  )
}
