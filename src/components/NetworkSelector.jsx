export default function NetworkSelector({ value, onChange }) {
  const networks = [
    { value: 'eth', label: '🔷 اتریوم (Ethereum)', color: 'text-blue-400' },
    { value: 'bnb', label: '🟡 بی‌ان‌بی (BNB Chain)', color: 'text-yellow-400' },
    { value: 'arb', label: '🔵 آربیتروم (Arbitrum)', color: 'text-cyan-400' },
    { value: 'op', label: '🔴 اپتیمیسم (Optimism)', color: 'text-red-400' },
    { value: 'btc', label: '🟠 بیت‌کوین (Bitcoin)', color: 'text-orange-400' },
    { value: 'sol', label: '🟢 سولانا (Solana)', color: 'text-green-400' }
  ]

  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="select select-bordered w-full bg-slate-800/50 border-slate-600 text-white focus:border-primary"
    >
      {networks.map((network) => (
        <option key={network.value} value={network.value}>
          {network.label}
        </option>
      ))}
    </select>
  )
}
