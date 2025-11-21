/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          teal: '#14b8a6',
          blue: '#0ea5e9',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}

