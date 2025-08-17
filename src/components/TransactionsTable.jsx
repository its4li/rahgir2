'use client'
import { motion } from 'framer-motion'
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, Hash } from 'lucide-react'

export default function TransactionsTable({ transactions, network }) {
  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  const formatHash = (hash) => `${hash.slice(0, 6)}...${hash.slice(-4)}`
  const formatAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Hash className="w-6 h-6 ml-2" />
          تراکنش‌های اخیر
        </h2>
        <div className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${network.color}`}>{transactions.length} تراکنش</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right py-4 px-4 text-gray-300 font-medium">هش تراکنش</th>
              <th className="text-right py-4 px-4 text-gray-300 font-medium">نوع</th>
              <th className="text-right py-4 px-4 text-gray-300 font-medium">از</th>
              <th className="text-right py-4 px-4 text-gray-300 font-medium">به</th>
              <th className="text-right py-4 px-4 text-gray-300 font-medium">مقدار</th>
              <th className="text-right py-4 px-4 text-gray-300 font-medium">زمان</th>
              <th className="text-right py-4 px-4 text-gray-300 font-medium">وضعیت</th>
              <th className="text-right py-4 px-4 text-gray-300 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <motion.tr key={tx.hash} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 text-gray-400 ml-2" />
                    <span className="font-mono text-sm text-blue-400">{formatHash(tx.hash)}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    {parseFloat(tx.value) > 0 ? (
                      <>
                        <ArrowUpRight className="w-4 h-4 text-red-400 ml-1" />
                        <span className="text-red-400 text-sm">ارسال</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft className="w-4 h-4 text-green-400 ml-1" />
                        <span className="text-green-400 text-sm">دریافت</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4"><span className="font-mono text-sm text-gray-300">{formatAddress(tx.from)}</span></td>
                <td className="py-4 px-4"><span className="font-mono text-sm text-gray-300">{formatAddress(tx.to)}</span></td>
                <td className="py-4 px-4">
                  <div className="text-right">
                    <span className="font-semibold text-white">{parseFloat(tx.value).toFixed(6)}</span>
                    <span className="text-gray-400 text-sm mr-1">{network.currency}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="w-4 h-4 ml-1" />
                    {formatDate(tx.timestamp)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${tx.isError ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{tx.status}</span>
                </td>
                <td className="py-4 px-4">
                  <motion.a href={`${network.explorerUrl}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-blue-400 hover:text-blue-300 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
