import './globals.css'

export const metadata = {
  title: 'رهگیر | ردیاب تراکنش‌های کریپتو',
  description: 'ردیابی تراکنش‌های کریپتو برای شبکه‌های مختلف با رابط کاربری فارسی',
  keywords: 'کریپتو, بیت‌کوین, اتریوم, تراکنش, بلاک‌چین',
  author: 'Rahgir Team',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" data-theme="rahgir">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className="font-vazir bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="min-h-screen">
          {/* Header */}
          <header className="glass-effect border-b border-slate-700/50 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">ر</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold gradient-text">رهگیر</h1>
                    <p className="text-sm text-slate-400">ردیاب تراکنش‌های کریپتو</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                  <div className="badge badge-primary">v2.0</div>
                  <div className="text-sm text-slate-400">
                    پشتیبانی از ۶ شبکه
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="glass-effect border-t border-slate-700/50 mt-20">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <p className="text-slate-400 mb-2">
                  ساخته شده با ❤️ برای جامعه کریپتو ایران
                </p>
                <p className="text-xs text-slate-500">
                  پشتیبانی از Ethereum، BNB Chain، Arbitrum، Optimism، Bitcoin، Solana
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
