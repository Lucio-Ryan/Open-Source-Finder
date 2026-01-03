/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Supabase-inspired color palette
        brand: {
          DEFAULT: '#3ECF8E',
          50: '#E8FAF0',
          100: '#C5F1DB',
          200: '#9EE8C3',
          300: '#6DDBA4',
          400: '#3ECF8E',
          500: '#30A46C',
          600: '#24815B',
          700: '#1C6547',
          800: '#155239',
          900: '#0F3D2B',
        },
        dark: {
          DEFAULT: '#1C1C1C',
          50: '#2A2A2A',
          100: '#232323',
          200: '#1C1C1C',
          300: '#171717',
          400: '#121212',
          500: '#0D0D0D',
          600: '#080808',
          700: '#050505',
          800: '#030303',
          900: '#000000',
        },
        surface: {
          DEFAULT: '#181818',
          50: '#2D2D2D',
          100: '#262626',
          200: '#1F1F1F',
          300: '#181818',
          400: '#131313',
          500: '#0E0E0E',
        },
        border: {
          DEFAULT: '#2D2D2D',
          light: '#3D3D3D',
          dark: '#1D1D1D',
        },
        muted: {
          DEFAULT: '#8B8B8B',
          foreground: '#A1A1A1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
        pixel: ['VT323', 'Press Start 2P', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'terminal-blink': 'terminalBlink 1s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(62, 207, 142, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(62, 207, 142, 0.4)' },
        },
        terminalBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, #2D2D2D 1px, transparent 1px), linear-gradient(to bottom, #2D2D2D 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
