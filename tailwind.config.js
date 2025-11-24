/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8eef3',
          100: '#d1dde7',
          200: '#a3bccf',
          300: '#759ab7',
          400: '#47799f',
          500: '#355C7D',
          600: '#2a4a64',
          700: '#20374b',
          800: '#152532',
          900: '#0b1219',
        },
      },
    },
  },
  plugins: [],
}
