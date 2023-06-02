/** @type {import('tailwindcss').Config} */
// const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'twitter-blue': '#00acee',
        'progress-bar': '#3ff25a',
        'fav-orange': '#FDA228',
      },
    },
    scale: {
      25: '0.25',
    },
  },
  plugins: [],
};
