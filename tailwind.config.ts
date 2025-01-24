import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#000000',
          secondary: '#101010',
        },
        foreground: {
          DEFAULT: '#FFFFFF',
          secondary: '#A0A0A0',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
        },
        input: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
        },
        ring: {
          DEFAULT: '#3B82F6',
        },
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1F1F1F',
          foreground: '#A0A0A0',
        },
        muted: {
          DEFAULT: '#1F1F1F',
          foreground: '#737373',
        },
        accent: {
          DEFAULT: '#2D2D2D',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#34D399',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
