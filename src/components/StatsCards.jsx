'use client'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function StatsCards({ stats, network }) {
  const cards = [
    { title: 'موجودی کیف پول', value: `${stats.balance} ${network.currency}`, icon: Wallet, color: 'from-blue-500 to-cyan-500' },
    { title: 'کل تراکنش‌ها', value: stats.totalTransactions, icon: Activity, color: 'from-purple-500 to-pink-500' },
    { title: 'تراکنش‌های ارسالی', value: `${stats.sentTransactions} (${stats.totalValueSent} ${network.currency})`, icon: TrendingUp, color: 'from-red-500 to-orange-500' },
    { title: 'تراکنش‌های دریافتی', value: `${stats.receivedTransactions} (${stats.totalValueReceived} ${network.currency})`, icon: TrendingDown, color: 'from-green-500 to-emerald-500' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} whileHover={{ scale: 1.05 }} className="glass-dark rounded-xl p-6 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10`} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">{card.title}</h3>
            <p className="text-white text-xl font-bold">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
