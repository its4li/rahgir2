'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Wallet } from 'lucide-react'

export default function AddressForm({ onSearch, loading, selectedNetwork }) {
  const [address, setAddress] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (address.trim() && !loading) onSearch(address.trim())
  }

  const isValidAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr)

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
      <div className="glass-dark rounded-2xl p-6">
        <div className="flex items-center justify-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 bg-gradient-to-r ${selectedNetwork.color}`}>
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">جستجوی آدرس والت</h2>
            <p className="text-gray-400">شبکه {selectedNetwork.name} - {selectedNetwork.currency}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="آدرس والت را وارد کنید (0x...)"
              className={`w-full px-6 py-4 pr-14 rounded-xl text-white placeholder-gray-400 bg-black/20 border-2 transition-all duration-300 outline-none ${
                isValidAddress(address) ? 'border-green-500 focus:border-green-400' : address.length > 0 ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-blue-400'
              }`}
              disabled={loading}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {address.length > 0 && !isValidAddress(address) && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm text-center">
              فرمت آدرس والت صحیح نیست
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={!isValidAddress(address) || loading}
            whileHover={{ scale: isValidAddress(address) && !loading ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              isValidAddress(address) && !loading ? `bg-gradient-to-r ${selectedNetwork.color} hover:shadow-lg hover:shadow-blue-500/25` : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span>در حال جستجو...</span>
            ) : (
              <div className="flex items-center justify-center">
                <Search className="w-5 h-5 ml-2" />
                جستجوی تراکنش‌ها
              </div>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
