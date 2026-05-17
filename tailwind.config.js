/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'neu-bg': '#e8ecf1',
        'neu-light': '#ffffff',
        'neu-dark': '#c4c9d0',
        'neu-primary': '#7c6ff7',
        'neu-secondary': '#6c63ff',
      },
      boxShadow: {
        'neu-raised': '5px 5px 15px #c4c9d0, -5px -5px 15px #ffffff',
        'neu-inset': 'inset 3px 3px 8px #c4c9d0, inset -3px -3px 8px #ffffff',
        'neu-button': '5px 5px 15px #c4c9d0, -5px -5px 15px #ffffff',
        'neu-button-active': 'inset 3px 3px 8px #c4c9d0, inset -3px -3px 8px #ffffff',
      },
      borderRadius: {
        'neu': '16px',
        'neu-sm': '12px',
      },
    },
  },
  plugins: [],
};
