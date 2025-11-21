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
          DEFAULT: '#355C7D',
          dark: '#2a4a64',
          light: '#4a7599',
        },
        secondary: {
          DEFAULT: '#6C5B7B',
          dark: '#564962',
          light: '#847394',
        },
        accent: {
          DEFAULT: '#C06C84',
          dark: '#a85669',
          light: '#d0869f',
        },
        coral: {
          DEFAULT: '#F67280',
          dark: '#f45566',
          light: '#f88c9a',
        },
        peach: {
          DEFAULT: '#F8B195',
          dark: '#f69d7b',
          light: '#fac5af',
        },
      },
    },
  },
  plugins: [],
}
