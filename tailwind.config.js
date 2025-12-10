/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**",
    "!./dist/**",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151f2e',
          900: '#0f172a',
          950: '#020617',
        }
      }
    },
  },
  plugins: [],
}

