/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sl-dark': '#0a0a0f',
        'sl-dark-card': '#16161e',
        'sl-red': '#e63946',
        'sl-gold': '#ffd700',
        'sl-gray': '#8b8b9a',
      }
    },
  },
  plugins: [],
}