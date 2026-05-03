/** @type {import('tailwindcss').Config} */

/* Semantic palette helper — bir token ailesini Tailwind color shape'ine çevirir.
   { 50: 'var(...)', 500: 'var(...)', 'DEFAULT': 'var(--..-500)' } şeklinde.
   Sayesinde `bg-positive`, `bg-positive-50`, `text-positive-700` hepsi çalışır. */
const semanticColor = (name, scales) =>
    scales.reduce((acc, s) => {
        acc[s] = `var(--apya-${name}-${s})`;
        return acc;
    }, { DEFAULT: `var(--apya-${name}-500)` });

export default {
    /* Tailwind sadece React island'da çalışsın — Razor `.cshtml`'leri tarama
       (Bootstrap class'ları ile çakışma riskini sıfırlar). Eski davranıştan
       farklı; kasıtlı: scope discipline. */
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './index.html',
    ],

    /* darkMode: 'class' DA çalışsın, [data-theme="dark"] DA çalışsın.
       Tek prop ile arr verirsen Tailwind ikisini de selector olarak ekler. */
    darkMode: ['class', '[data-theme="dark"]'],

    theme: {
        /* Container'ı varsayılan değil, tek breakpoint stratejisiyle veriyoruz.
           Apya'nın gerçek breakpoint'leri: mobile/tablet/desktop/wide. */
        screens: {
            'mobile': { 'max': '767px' },
            'tablet': '768px',
            'desktop': '1280px',
            'wide': '1920px',
        },

        extend: {
            /* ---------------------- COLORS (token-driven) ---------------------- */
            colors: {
                brand:    semanticColor('brand',    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
                positive: semanticColor('positive', [50, 100, 500, 600, 700]),
                negative: semanticColor('negative', [50, 100, 500, 600, 700]),
                warning:  semanticColor('warning',  [50, 100, 500, 600, 700]),
                critical: semanticColor('critical', [50, 500, 600]),
                neutral:  semanticColor('neutral',  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
                ai:       semanticColor('ai',       [50, 500, 600]),

                /* Surface — `bg-surface`, `bg-surface-raised` vs */
                surface: {
                    DEFAULT:  'var(--apya-surface-base)',
                    base:     'var(--apya-surface-base)',
                    raised:   'var(--apya-surface-raised)',
                    sunken:   'var(--apya-surface-sunken)',
                    elevated: 'var(--apya-surface-elevated)',
                    overlay:  'var(--apya-surface-overlay)',
                    inverse:  'var(--apya-surface-inverse)',
                },

                /* Text — `text-primary`, `text-secondary` */
                text: {
                    primary:   'var(--apya-text-primary)',
                    secondary: 'var(--apya-text-secondary)',
                    tertiary:  'var(--apya-text-tertiary)',
                    disabled:  'var(--apya-text-disabled)',
                    inverse:   'var(--apya-text-inverse)',
                    link:      'var(--apya-text-link)',
                    positive:  'var(--apya-text-positive)',
                    negative:  'var(--apya-text-negative)',
                    warning:   'var(--apya-text-warning)',
                },

                /* Border — `border-default`, `border-strong` etc. */
                border: {
                    DEFAULT: 'var(--apya-border-default)',
                    subtle:  'var(--apya-border-subtle)',
                    default: 'var(--apya-border-default)',
                    strong:  'var(--apya-border-strong)',
                    focus:   'var(--apya-border-focus)',
                    error:   'var(--apya-border-error)',
                },
            },

            /* ---------------------- SPACING (token-driven) ---------------------- */
            spacing: {
                /* Tailwind'in default scale'ini eziyoruz — tutarlı 4px modular. */
                0:  'var(--apya-space-0)',
                1:  'var(--apya-space-1)',
                2:  'var(--apya-space-2)',
                3:  'var(--apya-space-3)',
                4:  'var(--apya-space-4)',
                5:  'var(--apya-space-5)',
                6:  'var(--apya-space-6)',
                8:  'var(--apya-space-8)',
                10: 'var(--apya-space-10)',
                12: 'var(--apya-space-12)',
                16: 'var(--apya-space-16)',
                20: 'var(--apya-space-20)',
                24: 'var(--apya-space-24)',
            },

            /* ---------------------- RADIUS ---------------------- */
            borderRadius: {
                'xs':   'var(--apya-radius-xs)',
                'sm':   'var(--apya-radius-sm)',
                'md':   'var(--apya-radius-md)',
                'lg':   'var(--apya-radius-lg)',
                'xl':   'var(--apya-radius-xl)',
                '2xl':  'var(--apya-radius-2xl)',
                'full': 'var(--apya-radius-full)',
            },

            /* ---------------------- SHADOWS ---------------------- */
            boxShadow: {
                'sm': 'var(--apya-shadow-sm)',
                'md': 'var(--apya-shadow-md)',
                'lg': 'var(--apya-shadow-lg)',
                'xl': 'var(--apya-shadow-xl)',
                'focus': 'var(--apya-shadow-focus)',
            },

            /* ---------------------- TYPOGRAPHY ---------------------- */
            fontFamily: {
                /* Default 'sans' — Inter > Plus Jakarta Sans (mevcut) > system stack */
                sans:    ['var(--apya-font-sans)'],
                mono:    ['var(--apya-font-mono)'],
                numeric: ['var(--apya-font-numeric)'],
            },

            fontSize: {
                'xs':   ['var(--apya-text-xs)',   { lineHeight: 'var(--apya-leading-snug)' }],
                'sm':   ['var(--apya-text-sm)',   { lineHeight: 'var(--apya-leading-base)' }],
                'base': ['var(--apya-text-base)', { lineHeight: 'var(--apya-leading-base)' }],
                'lg':   ['var(--apya-text-lg)',   { lineHeight: 'var(--apya-leading-snug)' }],
                'xl':   ['var(--apya-text-xl)',   { lineHeight: 'var(--apya-leading-snug)' }],
                '2xl':  ['var(--apya-text-2xl)',  { lineHeight: 'var(--apya-leading-tight)' }],
                '3xl':  ['var(--apya-text-3xl)',  { lineHeight: 'var(--apya-leading-tight)' }],
                '4xl':  ['var(--apya-text-4xl)',  { lineHeight: 'var(--apya-leading-tight)' }],
                '5xl':  ['var(--apya-text-5xl)',  { lineHeight: 'var(--apya-leading-tight)' }],
                '6xl':  ['var(--apya-text-6xl)',  { lineHeight: 'var(--apya-leading-tight)' }],
            },

            fontWeight: {
                regular:  'var(--apya-weight-regular)',
                medium:   'var(--apya-weight-medium)',
                semibold: 'var(--apya-weight-semibold)',
                bold:     'var(--apya-weight-bold)',
            },

            /* ---------------------- Z-INDEX ---------------------- */
            zIndex: {
                'dropdown': 'var(--apya-z-dropdown)',
                'sticky':   'var(--apya-z-sticky)',
                'fixed':    'var(--apya-z-fixed)',
                'modal-backdrop': 'var(--apya-z-modal-backdrop)',
                'modal':    'var(--apya-z-modal)',
                'popover':  'var(--apya-z-popover)',
                'tooltip':  'var(--apya-z-tooltip)',
                'toast':    'var(--apya-z-toast)',
            },

            /* ---------------------- TRANSITIONS ---------------------- */
            transitionDuration: {
                'fast': 'var(--apya-motion-fast)',
                'base': 'var(--apya-motion-base)',
                'slow': 'var(--apya-motion-slow)',
            },

            transitionTimingFunction: {
                'standard':   'var(--apya-easing-standard)',
                'accelerate': 'var(--apya-easing-accelerate)',
                'decelerate': 'var(--apya-easing-decelerate)',
            },

            /* ---------------------- ANIMATION (existing + skeleton) ---------------------- */
            animation: {
                'fade-in':         'fadeIn 0.6s var(--apya-easing-standard) forwards',
                'shimmer':         'shimmer var(--apya-motion-skeleton) linear infinite',
                'blob':            'blob 7s infinite',
                'sheet-bottom':    'sheetBottomIn 250ms var(--apya-easing-decelerate) forwards',
                'sheet-right':     'sheetRightIn 200ms var(--apya-easing-decelerate) forwards',
                'overlay-fade':    'overlayFade 200ms var(--apya-easing-standard) forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%':   { opacity: '0', transform: 'translateY(15px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%':   { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                sheetBottomIn: {
                    '0%':   { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                sheetRightIn: {
                    '0%':   { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                overlayFade: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                blob: {
                    '0%':   { transform: 'translate(0px, 0px) scale(1)' },
                    '33%':  { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%':  { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
            },
        },
    },

    plugins: [
        /* Tabular figures + numeric utility — finansal sayılar için MUTLAKA. */
        function ({ addUtilities }) {
            addUtilities({
                '.font-tabular': {
                    'font-feature-settings': '"tnum" 1, "cv05" 1',
                    'font-variant-numeric':  'tabular-nums',
                },
                /* Text-balance — başlıklar için, satır kırma estetiği */
                '.text-balance': {
                    'text-wrap': 'balance',
                },
            });
        },
    ],
};
