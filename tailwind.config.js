/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Adding Lifewood's palette to Tailwind
        paper: '#f5eedb',
        'sea-salt': '#F9F7F7',
        'dark-serpent': '#133020',
        'castleton-green': '#046241',
        saffaron: '#FFB347',
        'earth-yellow': '#FFC370',
      },
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
        'display': ['Manrope', 'sans-serif'],
        'headline': ['Manrope', 'sans-serif'],
        'body': ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};