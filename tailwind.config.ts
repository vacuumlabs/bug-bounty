import type {Config} from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindcssTypography from '@tailwindcss/typography'
import colors from 'tailwindcss/colors'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#0F0F10',
      white: {
        DEFAULT: '#FFFFFF',
        '5': 'rgba(255, 255, 255, 0.05)',
        '10': 'rgba(255, 255, 255, 0.1)',
        '70': 'rgba(255, 255, 255, 0.7)',
      },
      green: '#9FFF9D',
      blue: '#9DAFFF',
      red: '#FF9D9D',
      sky: '#9DE8FF',
      slate: colors.slate,
    },
    extend: {
      fontSize: {
        '5xl': ['3rem', '3.5rem'],
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config

export default config
