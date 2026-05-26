/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "../../Pages/**/*.{cshtml,html}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: ['attribute', 'data-theme'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* Surfaces */
        'surface-app-bg':  'var(--apya-surface-app-bg)',
        'surface-base':    'var(--apya-surface-base)',
        'surface-raised':  'var(--apya-surface-raised)',
        'surface-elevated':'var(--apya-surface-elevated)',
        'surface-sunken':  'var(--apya-surface-sunken)',
        'surface-sidebar': 'var(--apya-surface-sidebar)',
        'surface-header':  'var(--apya-surface-header)',
        /* Text */
        'text-primary':    'var(--apya-text-primary)',
        'text-secondary':  'var(--apya-text-secondary)',
        'text-tertiary':   'var(--apya-text-tertiary)',
        'text-link':       'var(--apya-brand-500)',
        'text-negative':   'var(--apya-negative-500)',
        'text-warning':    'var(--apya-warning-500)',
        'text-positive':   'var(--apya-positive-500)',
        /* Borders */
        'border-subtle':   'var(--apya-border-subtle)',
        'border-default':  'var(--apya-border-default)',
        'border-strong':   'var(--apya-border-strong)',
        'border-focus':    'var(--apya-accent-500)',
        /* Accent */
        'accent-soft':     'var(--apya-accent-soft)',
        'accent':          'var(--apya-accent-500)',
        'accent-600':      'var(--apya-accent-600)',
        /* Semantic */
        'positive':        'var(--apya-positive-500)',
        'negative':        'var(--apya-negative-500)',
        'warning':         'var(--apya-warning-500)',
      },
      borderColor: {
        DEFAULT:           'var(--apya-border-default)',
        'subtle':          'var(--apya-border-subtle)',
        'default':         'var(--apya-border-default)',
        'strong':          'var(--apya-border-strong)',
        'focus':           'var(--apya-accent-500)',
      },
      boxShadow: {
        'focus':           'var(--apya-shadow-focus)',
        'sm':              'var(--apya-shadow-sm)',
        'md':              'var(--apya-shadow-md)',
        'lg':              'var(--apya-shadow-lg)',
        'xl':              'var(--apya-shadow-xl)',
      },
      zIndex: {
        'sticky':  40,
        'overlay': 50,
        'modal':   60,
        'toast':   70,
      },
      animation: {
        'blob':    'blob 7s infinite',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%':  { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
