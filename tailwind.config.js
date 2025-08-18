/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body: ['Lora', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#396362',
          50: '#f0f9f9',
          100: '#cceded',
          200: '#99dbdb',
          300: '#66c8c8',
          400: '#4da8a7',
          500: '#396362',
          600: '#2d4f4e',
          700: '#213b3a',
          800: '#152827',
          900: '#0a1414',
        },
        secondary: {
          DEFAULT: '#f5f4ed',
          50: '#fefefe',
          100: '#fcfcfa',
          200: '#f9f8f5',
          300: '#f5f4ed',
          400: '#f1f0e5',
          500: '#edecdd',
          600: '#e9e8d5',
          700: '#e5e4cd',
          800: '#e1e0c5',
          900: '#dddcbd',
        },
        background: {
          DEFAULT: '#faf9f5',
          secondary: '#f5f4ed',
        },
      },
    },
  },
  plugins: [],
}
