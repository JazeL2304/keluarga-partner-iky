/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#1E3A8A',
          'navy-dark': '#131B2E',
          pink: '#FF4081',
          'pink-hover': '#E02868',
          slate: '#0F172A',
          muted: '#64748B',
          surface: '#F8FAFC',
          border: '#E2E8F0',
          tint: '#EFF6FF',
        }
      },
      boxShadow: {
        'portal': '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.04)',
        'cert': '0 20px 40px -8px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
      }
    },
  },
  plugins: [],
}
