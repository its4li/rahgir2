import { NextResponse } from 'next/server'

// تنظیمات شبکه‌های EVM
const EVM_NETWORKS = {
  eth: { chainId: 1, name: 'Ethereum', explorer: 'etherscan.io' },
  bnb: { chainId: 56, name: 'BNB Chain', explorer: 'bscscan.com' },
  arb: { chainId: 42161, name: 'Arbitrum', explorer: 'arbiscan.io' },
  op: { chainId: 10, name: 'Optimism', explorer: 'optimistic.etherscan.io' }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const network = searchParams.get('network')
  const address = searchParams.get('address')
  const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 100)

  if (!network || !address) {
    return NextResponse.json(
      { error: 'پارامترهای network و address الزامی هستند' },
      { status: 400 }
    )
  }

  try {
    // شبکه‌های EVM (Ethereum، BNB، Arbitrum، Optimism)
    if (EVM_NETWORKS[network]) {
      return await handleEvmNetwork(network, address, limit)
    }

    // بیت‌کوین
    if (network === 'btc') {
      return await handleBitcoin(address, limit)
    }

    // سولانا
    if (network === 'sol') {
      return await handleSolana(address, limit)
    }

    return NextResponse.json(
      { error: 'شبکه پشتیبانی نمی‌شود' },
      { status: 400 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: `خطای سرور: ${error.message}` },
      { status: 500 }
    )
  }
}

// مدیریت شبکه‌های EVM
async function handleEvmNetwork(network, address, limit) {
  const apiKey = process.env.ETHERSCAN_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'کلید API Etherscan تنظیم نشده است' },
      { status: 500 }
    )
  }

  const config = EVM_NETWORKS[network]
  const baseUrl = getEtherscanUrl(network)
  
  // دریافت تراکنش‌ها
  const txUrl = `${baseUrl}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${apiKey}&chainId=${config.chainId}`
  
  const response = await fetch(txUrl)
  const data = await response.json()
  
  if (!response.ok || data.status !== '1') {
    throw new Error(data.message || 'خطا در دریافت اطلاعات از Etherscan')
  }

  // دریافت موجودی
  const balanceUrl = `${baseUrl}/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}&chainId=${config.chainId}`
  const balanceResponse = await fetch(balanceUrl)
  const balanceData = await balanceResponse.json()
  
  const balance = balanceData.status === '1' ? balanceData.result : '0'

  return NextResponse.json({
    network,
    address,
    items: data.result || [],
    stats: {
      balance: (parseInt(balance) / 1e18).toFixed(6),
      totalTransactions: data.result?.length || 0,
      network: config.name
    }
  })
}

// مدیریت بیت‌کوین
async function handleBitcoin(address, limit) {
  // دریافت آمار آدرس
  const addressUrl = `https://blockstream.info/api/address/${address}`
  const addressResponse = await fetch(addressUrl)
  
  if (!addressResponse.ok) {
    throw new Error('آدرس بیت‌کوین معتبر نیست')
  }
  
  const addressData = await addressResponse.json()
  
  // دریافت تراکنش‌ها
  const txUrl = `https://blockstream.info/api/address/${address}/txs`
  const txResponse = await fetch(txUrl)
  
  if (!txResponse.ok) {
    throw new Error('خطا در دریافت تراکنش‌های بیت‌کوین')
  }
  
  const transactions = await txResponse.json()
  
  return NextResponse.json({
    network: 'btc',
    address,
    items: transactions.slice(0, limit),
    stats: {
      balance: ((addressData.chain_stats?.funded_txo_sum || 0) - (addressData.chain_stats?.spent_txo_sum || 0)) / 1e8,
      totalTransactions: addressData.chain_stats?.tx_count || 0,
      network: 'Bitcoin'
    }
  })
}

// مدیریت سولانا
async function handleSolana(address, limit) {
  const apiKey = process.env.SOLANA_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'کلید API Solscan تنظیم نشده است' },
      { status: 500 }
    )
  }

  // دریافت جزئیات اکانت
  const accountUrl = `https://pro-api.solscan.io/v2.0/account/detail?account=${address}`
  const accountResponse = await fetch(accountUrl, {
    headers: {
      'accept': 'application/json',
      'token': apiKey
    }
  })

  let accountData = null
  if (accountResponse.ok) {
    const accountJson = await accountResponse.json()
    accountData = accountJson.success ? accountJson.data : null
  }

  // دریافت تراکنش‌ها
  const txUrl = `https://pro-api.solscan.io/v2.0/account/transactions?account=${address}&limit=${limit}`
  const txResponse = await fetch(txUrl, {
    headers: {
      'accept': 'application/json',
      'token': apiKey
    }
  })

  if (!txResponse.ok) {
    throw new Error('خطا در دریافت تراکنش‌های سولانا')
  }

  const txData = await txResponse.json()
  
  if (!txData.success) {
    throw new Error(txData.message || 'خطا در پردازش درخواست سولانا')
  }

  return NextResponse.json({
    network: 'sol',
    address,
    items: txData.data?.items || txData.data || [],
    stats: {
      balance: accountData ? (accountData.lamports / 1e9).toFixed(6) : '0',
      totalTransactions: txData.data?.items?.length || 0,
      network: 'Solana'
    }
  })
}

// تابع کمکی برای URL Etherscan
function getEtherscanUrl(network) {
  const urls = {
    eth: 'https://api.etherscan.io',
    bnb: 'https://api.bscscan.com',
    arb: 'https://api.arbiscan.io',
    op: 'https://api-optimistic.etherscan.io'
  }
  return urls[network]
}
