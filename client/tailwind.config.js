/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        maroon: {
          50: '#FDF6F6',
          100: '#FAEBEC',
          200: '#F4D2D5',
          300: '#E7A5AC',
          400: '#D56E7A',
          500: '#B83B4A',
          600: '#952230',
          700: '#751723',
          800: '#58121A', // Primary brand maroon from certificate
          900: '#420D13',
          950: '#2A060A',
          DEFAULT: '#58121A',
        },
        gold: {
          50: '#FAF7F0',
          100: '#F4EDDD',
          200: '#E9DAC0',
          300: '#DCC39C',
          400: '#C4A36B', // Primary brand gold from certificate
          500: '#B38E50',
          600: '#96733B',
          700: '#76572C',
          DEFAULT: '#C4A36B',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FDFCF9',
          200: '#FAF8F5', // Primary warm parchment background
          300: '#F3EFE7',
          400: '#EAE3D7',
          500: '#DDD4C4',
          DEFAULT: '#FAF8F5',
        },
        espresso: {
          50: '#F6F5F5',
          100: '#EAE8E7',
          200: '#D4D0CE',
          300: '#B5AEAB',
          400: '#8A827E',
          500: '#675F5B',
          600: '#4F4744',
          700: '#3D3633',
          800: '#2D2725',
          900: '#1F1A1B', // Primary deep text
          DEFAULT: '#1F1A1B',
        },
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(45, 39, 37, 0.04)',
        'warm': '0 4px 16px -2px rgba(45, 39, 37, 0.06), 0 1px 3px 0 rgba(45, 39, 37, 0.03)',
        'warm-lg': '0 12px 32px -4px rgba(45, 39, 37, 0.08), 0 2px 6px -1px rgba(45, 39, 37, 0.04)',
      },
    },
  },
  plugins: [],
}
