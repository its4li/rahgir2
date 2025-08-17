export default function AddressForm({ address, onChange, onSubmit, network }) {
  const placeholders = {
    eth: 'آدرس اتریوم (0x...)',
    bnb: 'آدرس BNB Chain (0x...)',
    arb: 'آدرس آربیتروم (0x...)',
    op: 'آدرس اپتیمیسم (0x...)',
    btc: 'آدرس بیت‌کوین (bc1... یا 1... یا 3...)',
    sol: 'آدرس سولانا'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={address}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholders[network] || 'آدرس والت'}
        className="input input-bordered flex-1 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary"
        dir="ltr"
      />
      <button 
        type="submit"
        className="btn btn-primary px-8 hover:scale-105 transition-transform"
      >
        🔍 جستجو
      </button>
    </form>
  )
}
