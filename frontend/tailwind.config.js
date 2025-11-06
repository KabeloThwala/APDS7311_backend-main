/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0b1020'
      },
      boxShadow: {
        glow: '0 20px 45px -20px rgba(56, 189, 248, 0.65)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}
