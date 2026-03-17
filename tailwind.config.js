/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Saudi Bank Locator Brand Colors
        'saudi-green': {
          50: '#e6f5ef',
          100: '#b3e0ce',
          200: '#80cbad',
          300: '#4db58c',
          400: '#26a574',
          500: '#006B3F', // Primary
          600: '#005a35',
          700: '#00492b',
          800: '#003821',
          900: '#002716'
        },
        'gold': {
          50: '#fdf8e8',
          100: '#f9ecc0',
          200: '#f5df97',
          300: '#f0d26e',
          400: '#ecc850',
          500: '#C9A227', // Primary
          600: '#a88920',
          700: '#876f19',
          800: '#665413',
          900: '#453a0d'
        },
        'dark': '#1C2526',
        'light': '#F8F9FA'
      },
      fontFamily: {
        'arabic': ['Tajawal', 'Arial', 'sans-serif'],
        'english': ['Poppins', 'sans-serif']
      },
      animation: {
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out'
      },
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
