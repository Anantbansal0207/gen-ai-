/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4D4B30',
          hover: '#3a392b',
        },
        secondary: {
          DEFAULT: '#908660',
          hover: '#7d7453',
        },
        accent: {
          DEFAULT: '#482216',
          hover: '#351910',
        },
        cream: {
          DEFAULT: '#FEEBCA',
          hover: '#f9e0b5',
        },
        peach: {
          DEFAULT: '#F4CCA6',
          hover: '#efc193',
        },
        coral: {
          DEFAULT: '#DAA38B',
          hover: '#d1917a',
        },
        background: {
          DEFAULT: '#FEEBCA',
          secondary: '#F4CCA6',
        }
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
      },
      animation: {
        scroll: 'scroll 20s linear infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        breathe: 'breathe 4s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}