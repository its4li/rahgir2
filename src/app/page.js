'use client'
import { useState } from 'react'
import NetworkSelector from '@/components/NetworkSelector'
import AddressForm from '@/components/AddressForm'
import TransactionsTable from '@/components/TransactionsTable'
import StatsCards from '@/components/StatsCards'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function HomePage() {
  const [network, setNetwork] = useState('eth')
  const [address, setAddress] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  const fetchTransactions = async () => {
    if (!address.trim()) {
      setError('لطفاً آدرس والت را وارد کنید')
      return
    }

    setLoading(true)
    setError('')
    setTransactions([])
    setStats(null)

    try {
      const params = new URLSearchParams({
        network,
        address: address.trim(),
        limit: '50'
      })

      const response = await fetch(`/api/transactions?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'خطا در دریافت اطلاعات')
      }

      setTransactions(data.items || [])
      setStats(data.stats || null)
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError(err.message || 'خطا در اتصال به سرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="animate-float mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center animate-pulse-slow">
            <span className="text-white font-bold text-4xl">ر</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold gradient-text mb-4">
          رهگیر کریپتو
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          ردیابی تراکنش‌های کریپتو در شبکه‌های مختلف با سرعت و دقت بالا
        </p>
        
        {/* شبکه‌های پشتیبانی شده */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { name: 'اتریوم', color: 'bg-blue-500' },
            { name: 'BNB', color: 'bg-yellow-500' },
            { name: 'آربیتروم', color: 'bg-cyan-500' },
            { name: 'اپتیمیسم', color: 'bg-red-500' },
            { name: 'بیت‌کوین', color: 'bg-orange-500' },
            { name: 'سولانا', color: 'bg-green-500' }
          ].map((net, idx) => (
            <div key={idx} className={`${net.color} px-3 py-1 rounded-full text-sm text-white font-medium`}>
              {net.name}
            </div>
          ))}
        </div>
      </div>

      {/* فرم جستجو */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="glass-effect rounded-2xl p-8 border border-slate-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                انتخاب شبکه
              </label>
              <NetworkSelector value={network} onChange={setNetwork} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                آدرس والت
              </label>
              <AddressForm 
                address={address} 
                onChange={setAddress}
                onSubmit={fetchTransactions}
                network={network}
              />
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* آمار */}
      {stats && (
        <div className="max-w-6xl mx-auto mb-8">
          <StatsCards stats={stats} network={network} />
        </div>
      )}

      {/* نتایج */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="glass-effect rounded-2xl p-12 text-center border border-slate-700/50">
            <LoadingSpinner />
            <p className="text-slate-300 mt-4">در حال دریافت تراکنش‌ها...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="glass-effect rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                تراکنش‌های اخیر
              </h2>
              <div className="badge badge-primary">
                {transactions.length} تراکنش
              </div>
            </div>
            <TransactionsTable 
              network={network}
              address={address}
              items={transactions}
              loading={loading}
            />
          </div>
        ) : address && !loading && (
          <div className="glass-effect rounded-2xl p-12 text-center border border-slate-700/50">
            <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-slate-400 text-2xl">📭</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              تراکنشی یافت نشد
            </h3>
            <p className="text-slate-400">
              برای این آدرس در شبکه {network.toUpperCase()} تراکنشی یافت نشد
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
