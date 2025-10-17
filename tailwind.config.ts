import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      boxShadow: {
        'sidebar-menu-shadow': '0px 2px 6px rgba(0,0,0,0.1)',
        'custom-nav': 'rgba(47, 43, 61, 0.14) 0px 2px 6px 0px',
        'primary-sm': '0 2px 6px rgba(115, 103, 240, 0.14)',
        'primary-md': '0 4px 12px rgba(115, 103, 240, 0.2)',
        'primary-lg': '0 8px 24px rgba(115, 103, 240, 0.25)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          100: '#E3E1FC',
          200: '#C7C2F9',
          300: '#ABA4F6',
          400: '#8F85F3',
          500: '#7367F0',
          600: '#675DD8',
          700: '#6258CC',
          800: '#5C52C0',
          900: '#564DB4',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          100: '#E6E6E9',
          200: '#CCCDD3',
          300: '#B3B5BC',
          400: '#999CA6',
          500: '#808390',
          600: '#737682',
          700: '#6D6F7A',
          800: '#666973',
          900: '#60626C',
        },
        info: {
          DEFAULT: '#00BAD1',
          100: '#CCF1F6',
          200: '#99E3ED',
          300: '#66D6E3',
          400: '#33C8DA',
          500: '#00BAD1',
          600: '#00A7BC',
          700: '#009EB2',
          800: '#0095A7',
          900: '#008C9D',
        },
        success: {
          DEFAULT: '#28C76F',
          100: '#D4F4E2',
          200: '#A9E9C5',
          300: '#7EDDA9',
          400: '#53D28C',
          500: '#28C76F',
          600: '#24B364',
          700: '#22A95E',
          800: '#209F59',
          900: '#1E9553',
        },
        warning: {
          DEFAULT: '#FF9F43',
          100: '#FFECD9',
          200: '#FFD9B4',
          300: '#FFC58E',
          400: '#FFB269',
          500: '#FF9F43',
          600: '#E68F3C',
          700: '#D98739',
          800: '#CC7F36',
          900: '#BF7732',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          100: '#FFDBDC',
          200: '#FFB7B9',
          300: '#FF9497',
          400: '#FF7074',
          500: '#FF4C51',
          600: '#E64449',
          700: '#D94145',
          800: '#CC3D41',
          900: '#BF393D',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontSize: {
        h1: ['2.875rem', { lineHeight: '4.25rem', fontWeight: '500' }],
        h2: ['2.375rem', { lineHeight: '3.5rem', fontWeight: '500' }],
        h3: ['1.75rem', { lineHeight: '2.625rem', fontWeight: '500' }],
        h4: ['1.5rem', { lineHeight: '2.375rem', fontWeight: '500' }],
        h5: ['1.125rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        h6: ['0.9375rem', { lineHeight: '1.375rem', fontWeight: '500' }],
        body1: ['0.9375rem', { lineHeight: '1.375rem', fontWeight: '400' }],
        body2: ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'button-lg': [
          '1.0625rem',
          { lineHeight: '1.625rem', fontWeight: '500' },
        ],
        'button-md': [
          '0.9375rem',
          { lineHeight: '1.375rem', fontWeight: '500' },
        ],
        'button-sm': [
          '0.8125rem',
          { lineHeight: '1.125rem', fontWeight: '500' },
        ],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function({ addUtilities }: any) {
      const newUtilities = {
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
        '.rtl .space-x-1 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '1',
        },
        '.rtl .space-x-2 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '1',
        },
        '.rtl .space-x-3 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '1',
        },
        '.rtl .space-x-4 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '1',
        },
        '.rtl .ml-2': {
          'margin-left': '0',
          'margin-right': '0.5rem',
        },
        '.rtl .ml-3': {
          'margin-left': '0',
          'margin-right': '0.75rem',
        },
        '.rtl .ml-4': {
          'margin-left': '0',
          'margin-right': '1rem',
        },
        '.rtl .mr-2': {
          'margin-right': '0',
          'margin-left': '0.5rem',
        },
        '.rtl .mr-3': {
          'margin-right': '0',
          'margin-left': '0.75rem',
        },
        '.rtl .mr-4': {
          'margin-right': '0',
          'margin-left': '1rem',
        },
        '.rtl .pl-3': {
          'padding-left': '0',
          'padding-right': '0.75rem',
        },
        '.rtl .pl-4': {
          'padding-left': '0',
          'padding-right': '1rem',
        },
        '.rtl .pr-3': {
          'padding-right': '0',
          'padding-left': '0.75rem',
        },
        '.rtl .pr-4': {
          'padding-right': '0',
          'padding-left': '1rem',
        },
        '.rtl .text-left': {
          'text-align': 'right',
        },
        '.rtl .text-right': {
          'text-align': 'left',
        },
        '.rtl .justify-start': {
          'justify-content': 'flex-end',
        },
        '.rtl .justify-end': {
          'justify-content': 'flex-start',
        },
        '.rtl .items-start': {
          'align-items': 'flex-end',
        },
        '.rtl .items-end': {
          'align-items': 'flex-start',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;
