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
        buttonS: ['0.8125rem', {lineHeight: '1rem', fontWeight: 700}], // 13px, 16px
        buttonM: ['1rem', {lineHeight: '1.5rem', fontWeight: 700}], // 16px, 24px
        buttonL: ['1.25rem', {lineHeight: '1.5rem', fontWeight: 700}], // 20px, 24px
        bodyS: ['0.8125rem', {lineHeight: '1rem', fontWeight: 400}], // 13px, 16px
        bodyM: ['1rem', {lineHeight: '1.5rem', fontWeight: 400}], // 16px, 24px
        bodyL: ['1.25rem', {lineHeight: '2rem', fontWeight: 400}], // 20px, 32px
        titleS: ['1.125rem', {lineHeight: '1.5rem', fontWeight: 600}], // 18px, 24px
        titleM: ['1.5rem', {lineHeight: '2rem', fontWeight: 600}], // 24px, 32px
        titleL: ['1.75rem', {lineHeight: '2.5rem', fontWeight: 600}], // 28px, 40px
        headlineS: ['2rem', {lineHeight: '2.5rem', fontWeight: 600}], // 32px, 40x
        headlineM: ['2.5rem', {lineHeight: '3rem', fontWeight: 700}], // 40px, 48px
        headlineL: ['3rem', {lineHeight: '3.5rem', fontWeight: 700}], // 48px, 56px
        displayS: ['4.3125rem', {lineHeight: '4.5rem', fontWeight: 700}], // 69px, 72px
        displayM: ['4.6875rem', {lineHeight: '6rem', fontWeight: 700}], // 75px, 96px
        displayL: ['5.875rem', {lineHeight: '7rem', fontWeight: 700}], // 94px, 112px
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
