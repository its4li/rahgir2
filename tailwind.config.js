/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx,mdx}',
    './src/components/**/*.{js,jsx,ts,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        persian: ['Vazir', 'Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569'
        }
      },
      backgroundImage: {
        'mesh-gradient': 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(59, 130, 246, 0.1) 25%, rgba(139, 92, 246, 0.1) 50%, rgba(219, 39, 119, 0.1) 75%, rgba(239, 68, 68, 0.1) 100%)'
      },
      animation: {
        gradient: 'gradient 8s linear infinite'
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: 'left center', backgroundSize: '200% 200%' },
          '50%': { backgroundPosition: 'right center', backgroundSize: '200% 200%' }
        }
      }
    }
  },
  plugins: []
}
