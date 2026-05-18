/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    screens: {
      'xs': '320px',
      'sm': '375px',
      'md': '428px',
      'lg': '768px',
    },
    extend: {
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      touchAction: {
        'none': 'none',
        'pan-x': 'pan-x',
        'pan-y': 'pan-y',
        'pinch-zoom': 'pinch-zoom',
      },
    },
  },
  plugins: [],
};
