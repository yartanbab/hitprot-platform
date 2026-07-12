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

        /* Badge.jsx tone skalaları — tokens.css'te tanımlı, Tailwind'e
           köprülenmemişti (bg-brand-50 vb. sessizce transparent render
           ediyordu). Yalnız Badge'in fiilen kullandığı numaralar. */
        'neutral-100':     'var(--apya-neutral-100)',
        'neutral-200':     'var(--apya-neutral-200)',
        'neutral-500':     'var(--apya-neutral-500)',
        'neutral-700':     'var(--apya-neutral-700)',
        'brand-50':        'var(--apya-brand-50)',
        'brand-100':       'var(--apya-brand-100)',
        'brand-500':       'var(--apya-brand-500)',
        'brand-700':       'var(--apya-brand-700)',
        'positive-50':     'var(--apya-positive-50)',
        'positive-100':    'var(--apya-positive-100)',
        'positive-500':    'var(--apya-positive-500)',
        'positive-700':    'var(--apya-positive-700)',
        'negative-50':     'var(--apya-negative-50)',
        'negative-100':    'var(--apya-negative-100)',
        'negative-500':    'var(--apya-negative-500)',
        'negative-700':    'var(--apya-negative-700)',
        'warning-50':      'var(--apya-warning-50)',
        'warning-100':     'var(--apya-warning-100)',
        'warning-500':     'var(--apya-warning-500)',
        'warning-700':     'var(--apya-warning-700)',
        'critical-50':     'var(--apya-critical-50)',
        'critical-500':    'var(--apya-critical-500)',
        'critical-600':    'var(--apya-critical-600)',
        'ai-50':           'var(--apya-ai-50)',
        'ai-500':          'var(--apya-ai-500)',
        'ai-600':          'var(--apya-ai-600)',
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
