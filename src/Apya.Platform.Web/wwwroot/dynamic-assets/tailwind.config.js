/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "../../Pages/**/*.{cshtml,html}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  /* v3'te geçerli strateji 'selector' — ['attribute','data-theme'] v4 sözdizimi
     olduğu için v3.4 hiçbir dark: varyantı ÜRETMİYORDU (sessizce). Şu an kodda
     dark: kullanımı yok; tema CSS custom property'leriyle geliyor (doğru yaklaşım),
     ama ilk dark: yazan kişi için tuzaktı. */
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      /* mobile: max-width — tüm kullanımlar "mobilde küçült/gizle" anlamında
         (mobile:hidden, mobile:grid-cols-2, mobile:px-2). Eşik useDeviceMode'un
         decision→triage sınırıyla (768px) aynı. Tanımsızken 8 sınıf sessizce
         ölüydü → mobil yerleşim uygulanmıyordu.
         tablet: min-width — Sheet.jsx/Toast.jsx zaten bu prefix'i kullanıyordu
         ama tanımsızdı; tüm tablet: varyantları sessizce ölüydü (Sheet her
         ekranda bottom-sheet render ediyordu). Eşikler useDeviceMode.jsx'in
         decision→triage sınırıyla (768px) aynı — ikisi senkron kalmalı. */
      screens: {
        mobile: { max: '767.98px' },
        tablet: '768px',
      },
      fontFamily: {
        /* Token tek kaynak: 'Plus Jakarta Sans' self-host EDİLMİYOR
           (apya-fonts.css yalnız Inter + JetBrains Mono barındırıyor), bu yüzden
           preflight'ın html kuralı sistem fontuna düşüyordu. */
        sans: 'var(--apya-font-sans)',
      },
      /* duration-fast/base/slow: 11 yerde kullanılıyordu ama tanımsızdı →
         transition-* kısayolunun 150ms varsayılanına düşüyordu (font-tabular
         ile aynı sınıf hata, bkz. src/index.css). */
      transitionDuration: {
        fast: 'var(--apya-motion-fast)',
        base: 'var(--apya-motion-base)',
        slow: 'var(--apya-motion-slow)',
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
        'surface-overlay': 'var(--apya-surface-overlay)',
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
      /* tokens.css'teki --apya-z-* ölçeğinin BİREBİR aynısı. Sayı olarak
         tutuluyor (var() değil) ki test dosyası değerleri karşılaştırabilsin;
         tailwind.config.test.js tokens.css'i okuyup eşitliği doğruluyor, bu
         yüzden ikisi sessizce ayrışamaz.
         modal=1050 bilinçli olarak Bootstrap .modal'ın (1055) ALTINDA:
         görev detayından açılan ABP modalleri (Expenses/CreateModal) üstte
         görünmeli. modal-backdrop=1040 LeptonX kabuğunun (~1030) üstünde. */
      zIndex: {
        'dropdown':       1000,
        'sticky':         1020,
        'fixed':          1030,
        'modal-backdrop': 1040,
        'modal':          1050,
        'popover':        1060,
        'tooltip':        1070,
        'toast':          1080,
      },
      animation: {
        'blob':         'blob 7s infinite',
        'fade-in':      'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'overlay-fade': 'overlayFade var(--apya-motion-fast) cubic-bezier(0.16, 1, 0.3, 1) both',
        'sheet-bottom': 'sheetBottom var(--apya-motion-slow) cubic-bezier(0.16, 1, 0.3, 1) both',
        'sheet-right':  'sheetRight var(--apya-motion-slow) cubic-bezier(0.16, 1, 0.3, 1) both',
        'dialog-in':    'dialogIn var(--apya-motion-slow) cubic-bezier(0.16, 1, 0.3, 1) both',
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
        overlayFade: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        sheetBottom: {
          '0%':   { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sheetRight: {
          '0%':   { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        /* Tetikleyiciden büyüyerek gelir — mekânsal süreklilik (HIG modal-motion).
           SADECE scale/opacity: konumlama artık flexbox'ta (Dialog.jsx wrapper),
           transform burada translate(-50%,-50%) taşırsa "both" fill-mode kalıcı
           kalıp flexbox'un uyguladığı konumu override ediyordu. */
        dialogIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
