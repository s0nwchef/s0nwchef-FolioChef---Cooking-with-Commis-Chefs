/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Spotify Primary
        spotify: {
          green: '#1ED760',
          'green-dark': '#1DB954',
          'green-active': '#1aa34a',
        },
        // Accent Colors
        accent: {
          rose: '#B85860',
          orange: '#BD5839',
          blue: '#1078C0',
          'slate-blue': '#687A80',
        },
        // Interactive
        interactive: {
          light: '#B3B3B3',
          transparent: 'rgba(0, 0, 0, 0)',
          dark: 'rgba(0, 0, 0, 0.5)',
        },
        // Neutral Scale (Dark Mode)
        neutral: {
          white: '#FFFFFF',
          black: '#000000',
          'near-black': '#121212',
          'dark-1': '#1F1F1F',
          'dark-2': '#282828',
          'dark-3': '#2A2A2A',
          'warm-gray': '#9D968E',
        },
        // Surface & Borders
        surface: {
          DEFAULT: '#121212',
          dim: '#121212',
          container: '#1F1F1F',
          'container-low': '#1F1F1F',
          'container-lowest': '#121212',
          'container-high': '#282828',
          'container-highest': '#2A2A2A',
        },
        border: {
          gray: '#B3B3B3',
          dark: '#707070',
        },
        // Semantic / Status
        success: '#1ED760',
        error: '#E61E32',
        // Text Colors
        'on-surface': {
          DEFAULT: '#FFFFFF',
          variant: '#B3B3B3',
          muted: '#9D968E',
        },
      },
      fontFamily: {
        sans: ['SpotifyMixUI', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['SpotifyMixUITitle', 'SpotifyMixUI', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier Prime', 'monospace'],
      },
      fontSize: {
        'display-1': ['48px', { lineHeight: '1.2', letterSpacing: '-0.5px', fontWeight: '700' }],
        'display-2': ['32px', { lineHeight: '1.2', letterSpacing: '-0.25px', fontWeight: '700' }],
        'heading-1': ['24px', { lineHeight: '1.3', letterSpacing: '-0.2px', fontWeight: '700' }],
        'heading-2': ['18px', { lineHeight: '1.4', letterSpacing: '0px', fontWeight: '700' }],
        'heading-3': ['16px', { lineHeight: '1.4', letterSpacing: '0px', fontWeight: '700' }],
        'body-lg': ['16px', { lineHeight: '1.5', letterSpacing: '0px', fontWeight: '400' }],
        body: ['14px', { lineHeight: '1.5', letterSpacing: '0.5px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.4', letterSpacing: '0.25px', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.3', letterSpacing: '0.5px', fontWeight: '400' }],
        button: ['16px', { lineHeight: '1.0', letterSpacing: '0px', fontWeight: '700' }],
        'button-sm': ['14px', { lineHeight: '1.0', letterSpacing: '0px', fontWeight: '700' }],
        link: ['14px', { lineHeight: '1.5', letterSpacing: '0px', fontWeight: '400' }],
        code: ['12px', { lineHeight: '1.5', letterSpacing: '0px', fontWeight: '400' }],
      },
      borderRadius: {
        none: '0px',
        subtle: '4px',
        card: '6px',
        rounded: '9px',
        pill: '500px',
        circle: '50%',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '64px',
      },
      boxShadow: {
        'hover': '0px 2px 8px rgba(0, 0, 0, 0.2)',
        'overlay': '0px 8px 32px rgba(0, 0, 0, 0.4)',
        'emphasis': '0px 12px 40px rgba(0, 0, 0, 0.6)',
        'focus': '0px 0px 0px 3px rgba(30, 215, 96, 0.4)',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'ease-out',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
