/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ocean-deep': '#0a3d62',
        'ocean-mid': '#1e6091',
        'ocean-light': '#2980b9',
        'coral': '#e74c3c',
        'pearl': '#f0f0f0',
        'sand': '#f4a261',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

