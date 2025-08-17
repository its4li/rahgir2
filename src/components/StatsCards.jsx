export default function StatsCards({ stats, network }) {
  if (!stats) return null

  const networkNames = {
    eth: 'اتریوم',
    bnb: 'BNB Chain',
    arb: 'آربیتروم',
    op: 'اپتیمیسم',
    btc: 'بیت‌کوین',
    sol: 'سولانا'
  }

  const currencies = {
    eth: 'ETH',
    bnb: 'BNB',
    arb: 'ETH',
    op: 'ETH',
    btc: 'BTC',
    sol: 'SOL'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="glass-effect rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">موجودی</p>
            <p className="text-2xl font-bold text-white">
              {stats.balance} {currencies[network]}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <span className="text-primary text-2xl">💰</span>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">تعداد تراکنش</p>
            <p className="text-2xl font-bold text-white">
              {stats.totalTransactions?.toLocaleString('fa-IR') || '0'}
            </p>
          </div>
          <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
            <span className="text-secondary text-2xl">📊</span>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">شبکه</p>
            <p className="text-2xl font-bold text-white">
              {networkNames[network]}
            </p>
          </div>
          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
            <span className="text-accent text-2xl">🌐</span>
          </div>
        </div>
      </div>
    </div>
  )
}
