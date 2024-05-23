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
      white: '#FFFFFF',
      purple: {
        light: '#C4CFFF',
        DEFAULT: '#9DAFFF',
        dark: '#7E93F4',
      },
      blue: {
        light: '#C4F1FF',
        DEFAULT: '#9DE8FF',
        dark: '#7EC9F4',
      },
      green: {
        light: '#C6FFC4',
        DEFAULT: '#9FFF9D',
        dark: '#75EA73',
      },
      red: {
        light: '#FFC4C4',
        DEFAULT: '#FF9D9D',
        dark: '#EA7373',
      },
      yellow: {
        light: '#FEFFC4',
        DEFAULT: '#FDFF9D',
        dark: '#EED477',
      },
      grey: {
        '10': '#E7E7E7',
        '20': '#CFCFCF',
        '30': '#B7B7B7',
        '40': '#9F9FA0',
        '60': '#6F6F70',
        '70': '#575758',
        '80': '#3F3F40',
        '90': '#272728',
      },
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
