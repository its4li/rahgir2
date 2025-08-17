'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import NetworkSelector from '@/components/NetworkSelector'
import AddressForm from '@/components/AddressForm'
import TransactionsTable from '@/components/TransactionsTable'
import StatsCards from '@/components/StatsCards'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Search, TrendingUp, Shield, Zap } from 'lucide-react'

const NETWORKS = {
  ethereum: { name: 'اتریوم', chainId: 1, color: 'from-blue-500 to-purple-600', currency: 'ETH', explorerUrl: 'https://etherscan.io' },
  bsc: { name: 'بایننس', chainId: 56, color: 'from-yellow-500 to-orange-600', currency: 'BNB', explorerUrl: 'https://bscscan.com' },
  arbitrum: { name: 'آربیتروم', chainId: 42161, color: 'from-blue-600 to-cyan-500', currency: 'ETH', explorerUrl: 'https://arbiscan.io' },
  optimism: { name: 'اپتیمیزم', chainId: 10, color: 'from-red-500 to-pink-600', currency: 'ETH', explorerUrl: 'https://optimistic.etherscan.io' }
}

export default function Home() {
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum')
  const [address, setAddress] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  const fetchTransactions = async (walletAddress, networkKey) => {
    if (!walletAddress) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/transactions?address=${walletAddress}&chainId=${NETWORKS[networkKey].chainId}`)
      const data = await res.json()
      if (data.success) {
        setTransactions(data.transactions)
        setStats(data.stats)
      } else {
        setError(data.error || 'خطا در دریافت اطلاعات')
      }
    } catch {
      setError('خطا در اتصال به سرور')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (addr) => {
    setAddress(addr)
    fetchTransactions(addr, selectedNetwork)
  }

  const handleNetworkChange = (net) => {
    setSelectedNetwork(net)
    if (address) fetchTransactions(address, net)
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <div className="glass-dark rounded-3xl p-8 mb-8">
            <motion.h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4" animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
              رهگیر
            </motion.h1>
            <p className="text-xl text-gray-300 mb-6">ردیاب حرفه‌ای تراکنش‌های بلاکچین</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <motion.div whileHover={{ scale: 1.05 }} className="glass rounded-xl p-4">
                <Search className="w-8 h-8 text-blue-400 mb-2 mx-auto" />
                <h3 className="font-semibold text-white mb-1">جستجوی سریع</h3>
                <p className="text-sm text-gray-400">ردیابی آنی تراکنش‌ها</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="glass rounded-xl p-4">
                <TrendingUp className="w-8 h-8 text-green-400 mb-2 mx-auto" />
                <h3 className="font-semibold text-white mb-1">تحلیل پیشرفته</h3>
                <p className="text-sm text-gray-400">آمار کامل پورتفولیو</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="glass rounded-xl p-4">
                <Shield className="w-8 h-8 text-purple-400 mb-2 mx-auto" />
                <h3 className="font-semibold text-white mb-1">امنیت بالا</h3>
                <p className="text-sm text-gray-400">حفاظت از اطلاعات</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <NetworkSelector networks={NETWORKS} selectedNetwork={selectedNetwork} onNetworkChange={handleNetworkChange} />
        </motion.div>

        <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <AddressForm onSearch={handleSearch} loading={loading} selectedNetwork={NETWORKS[selectedNetwork]} />
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-xl p-4 mb-6 border-l-4 border-red-500">
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center my-12">
            <LoadingSpinner />
          </motion.div>
        )}

        {stats && !loading && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <StatsCards stats={stats} network={NETWORKS[selectedNetwork]} />
          </motion.div>
        )}

        {transactions.length > 0 && !loading && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <TransactionsTable transactions={transactions} network={NETWORKS[selectedNetwork]} />
          </motion.div>
        )}

        {!loading && !transactions.length && !error && address && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="glass-dark rounded-xl p-8">
              <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">تراکنشی یافت نشد</h3>
              <p className="text-gray-400">برای این آدرس در شبکه {NETWORKS[selectedNetwork].name} تراکنشی ثبت نشده است</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
