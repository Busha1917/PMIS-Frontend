import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
          'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          600: '#0f172a',
          700: '#161A61',
          900: '#000d1a',
        },
        accent: '#ff9500',
      },
    },
  },
  plugins: [],
}

export default config
