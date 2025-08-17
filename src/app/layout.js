import './globals.css'

export const metadata = {
  title: 'رهگیر | ردیاب تراکنش‌های بلاکچین',
  description: 'ردیاب حرفه‌ای تراکنش‌های بلاکچین برای Ethereum، BSC، Arbitrum و Optimism'
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className="rtl">
      <body className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="fixed inset-0 animated-bg opacity-20 pointer-events-none"></div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
