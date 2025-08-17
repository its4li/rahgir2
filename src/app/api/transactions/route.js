import { NextResponse } from 'next/server'

const API_KEY = process.env.ETHERSCAN_API_KEY

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const chainId = searchParams.get('chainId')

  if (!address || !chainId) {
    return NextResponse.json({ success: false, error: 'آدرس والت و شناسه شبکه الزامی است' }, { status: 400 })
  }
  if (!API_KEY) {
    return NextResponse.json({ success: false, error: 'کلید API تنظیم نشده است' }, { status: 500 })
  }

  try {
    const [balanceRes, txRes] = await Promise.all([
      fetch(`https://api.etherscan.io/v2/api?chainid=${chainId}&module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEY}`, { next: { revalidate: 15 } }),
      fetch(`https://api.etherscan.io/v2/api?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${API_KEY}`, { cache: 'no-store' })
    ])

    const balanceData = await balanceRes.json()
    const txData = await txRes.json()

    if (balanceData.status === '0' && balanceData.message === 'NOTOK') {
      return NextResponse.json({ success: false, error: balanceData.result || 'خطا در دریافت موجودی' }, { status: 502 })
    }
    if (txData.status === '0' && txData.message === 'NOTOK') {
      return NextResponse.json({ success: false, error: txData.result || 'خطا در دریافت تراکنش‌ها' }, { status: 502 })
    }

    const rawBalance = balanceData.result || '0'
    const balance = Number(rawBalance) / 1e18

    const transactions = Array.isArray(txData.result) ? txData.result : []

    const totalTxs = transactions.length
    const lowerAddr = address.toLowerCase()
    const sentTxs = transactions.filter(tx => tx.from?.toLowerCase() === lowerAddr).length
    const receivedTxs = totalTxs - sentTxs

    const totalValueSent = transactions
      .filter(tx => tx.from?.toLowerCase() === lowerAddr)
      .reduce((sum, tx) => sum + Number(tx.value || 0) / 1e18, 0)

    const totalValueReceived = transactions
      .filter(tx => tx.to?.toLowerCase() === lowerAddr)
      .reduce((sum, tx) => sum + Number(tx.value || 0) / 1e18, 0)

    const stats = {
      balance: Number(balance.toFixed(6)),
      totalTransactions: totalTxs,
      sentTransactions: sentTxs,
      receivedTransactions: receivedTxs,
      totalValueSent: totalValueSent.toFixed(6),
      totalValueReceived: totalValueReceived.toFixed(6)
    }

    const formatted = transactions.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: (Number(tx.value || 0) / 1e18).toFixed(6),
      timestamp: Number(tx.timeStamp) * 1000,
      blockNumber: tx.blockNumber,
      gasPrice: tx.gasPrice,
      gasUsed: tx.gasUsed,
      status: tx.txreceipt_status === '1' ? 'موفق' : 'ناموفق',
      isError: tx.isError === '1'
    }))

    return NextResponse.json({ success: true, transactions: formatted, stats })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'خطا در دریافت اطلاعات از سرور' }, { status: 500 })
  }
}
