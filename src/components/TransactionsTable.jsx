function formatDate(timestamp) {
  if (!timestamp) return '—'
  try {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR')
  } catch {
    return '—'
  }
}

function formatValue(value, decimals = 18) {
  if (!value || value === '0') return '0'
  try {
    return (parseInt(value) / Math.pow(10, decimals)).toFixed(6)
  } catch {
    return '—'
  }
}

function formatHash(hash) {
  if (!hash) return '—'
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export default function TransactionsTable({ network, address, items, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <div className="text-6xl mb-4">📭</div>
        <p>تراکنشی یافت نشد</p>
      </div>
    )
  }

  // رندر EVM Networks
  if (['eth', 'bnb', 'arb', 'op'].includes(network)) {
    return (
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-slate-300">
              <th>هش تراکنش</th>
              <th>بلاک</th>
              <th>زمان</th>
              <th>از</th>
              <th>به</th>
              <th>مقدار (ETH)</th>
              <th>کارمزد</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {items.map((tx) => (
              <tr key={tx.hash} className="hover:bg-slate-800/50">
                <td>
                  <code className="text-primary text-xs">
                    {formatHash(tx.hash)}
                  </code>
                </td>
                <td className="text-sm">{tx.blockNumber}</td>
                <td className="text-sm">{formatDate(tx.timeStamp)}</td>
                <td>
                  <code className="text-xs text-slate-400">
                    {formatHash(tx.from)}
                  </code>
                </td>
                <td>
                  <code className="text-xs text-slate-400">
                    {formatHash(tx.to)}
                  </code>
                </td>
                <td className="font-mono">{formatValue(tx.value)}</td>
                <td className="text-xs text-slate-400">
                  {formatValue(tx.gasUsed * tx.gasPrice, 18)}
                </td>
                <td>
                  <div className={`badge ${tx.txreceipt_status === '1' ? 'badge-success' : 'badge-error'}`}>
                    {tx.txreceipt_status === '1' ? 'موفق' : 'ناموفق'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // رندر Bitcoin
  if (network === 'btc') {
    return (
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-slate-300">
              <th>TXID</th>
              <th>زمان</th>
              <th>ورودی/خروجی</th>
              <th>مقدار (BTC)</th>
              <th>تایید</th>
            </tr>
          </thead>
          <tbody>
            {items.map((tx) => {
              const txid = tx.txid || tx.hash || '—'
              const time = tx.status?.block_time || tx.block_time
              const vinCount = tx.vin?.length || 0
              const voutCount = tx.vout?.length || 0
              const totalValue = tx.vout?.reduce((sum, out) => sum + (out.value || 0), 0) || 0
              const confirmed = tx.status?.confirmed

              return (
                <tr key={txid} className="hover:bg-slate-800/50">
                  <td>
                    <code className="text-primary text-xs">
                      {formatHash(txid)}
                    </code>
                  </td>
                  <td className="text-sm">{formatDate(time)}</td>
                  <td className="text-sm">{vinCount} / {voutCount}</td>
                  <td className="font-mono">{(totalValue / 1e8).toFixed(8)}</td>
                  <td>
                    <div className={`badge ${confirmed ? 'badge-success' : 'badge-warning'}`}>
                      {confirmed ? 'تایید شده' : 'در انتظار'}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // رندر Solana
  if (network === 'sol') {
    return (
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-slate-300">
              <th>Signature</th>
              <th>زمان</th>
              <th>Slot</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {items.map((tx, idx) => {
              const signature = tx.signature || tx.txHash || `tx-${idx}`
              const time = tx.block_time || tx.blockTime || tx.timestamp
              const slot = tx.slot || tx.block_slot || tx.block || '—'
              const status = tx.status || (tx.err ? 'Failed' : 'Success')

              return (
                <tr key={signature} className="hover:bg-slate-800/50">
                  <td>
                    <code className="text-primary text-xs">
                      {formatHash(signature)}
                    </code>
                  </td>
                  <td className="text-sm">{formatDate(time)}</td>
                  <td className="text-sm">{slot}</td>
                  <td>
                    <div className={`badge ${status === 'Success' ? 'badge-success' : 'badge-error'}`}>
                      {status === 'Success' ? 'موفق' : 'ناموفق'}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return null
}
