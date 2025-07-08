/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'light-blue': '#0443F2',
      'dark-blue': '#001756',
      'light-gray': '#F1F5F9',
      'medium-gray': '#E6ECF1',
      'dark-gray': '#64748B',
      'white': '#FFFFFF',
      'red': 'red'
    },
    extend: {
      height: {
        '128': '30rem',
        'modal': '40rem'
      },
      width: {
        'modal': '50rem'
      },
      scale: {
        '98': '0.98',
        '101': '1.01',
        '102': '1.02',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}