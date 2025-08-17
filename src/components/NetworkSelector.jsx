'use client'
import { motion } from 'framer-motion'

export default function NetworkSelector({ networks, selectedNetwork, onNetworkChange }) {
  return (
    <div className="mb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">انتخاب شبکه</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(networks).map(([key, network]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNetworkChange(key)}
              className={`relative overflow-hidden rounded-xl p-4 text-center transition-all duration-300 ${
                selectedNetwork === key ? `bg-gradient-to-r ${network.color} shadow-lg shadow-blue-500/25` : 'glass hover:glass-dark'
              }`}
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-gradient-to-r ${network.color}`}>
                  <span className="text-white font-bold text-lg">{network.currency}</span>
                </div>
                <h3 className="font-semibold text-white mb-1">{network.name}</h3>
                <p className="text-sm text-gray-300">{network.currency}</p>
              </div>
              {selectedNetwork === key && <motion.div layoutId="selectedNetwork" className="absolute inset-0 rounded-xl border-2 border-white/30" transition={{ type: 'spring', duration: 0.6 }} />}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
