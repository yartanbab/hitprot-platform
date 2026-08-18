import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {}
  },
  build: {
    outDir: '../js',
    emptyOutDir: false,
    lib: {
      // Her yeni island buraya eklenir; çıktı ayrı bir .js dosyasına gider.
      entry: {
        'template-builder': 'src/template-builder.jsx',
        'form-builder':     'src/form-builder.jsx',
        'forms':            'src/forms.jsx',
        'public-form':      'src/public-form.jsx',
        'responses':        'src/responses.jsx',
        'customers':        'src/customers.jsx',
        'dashboard':        'src/dashboard.jsx',
        'expense-capture':  'src/expense-capture.jsx',
        'documents':        'src/documents.jsx',
        'deliveries':       'src/deliveries.jsx',
        'documents-admin':  'src/documents-admin.jsx',
        'task-detail':      'src/task-detail.jsx',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [], // tümü bundle'a girer — CDN bağımlılığı yok
      output: {
        // [name] DİNAMİK placeholder — manualChunks'ın döndürdüğü isimle eşleşir.
        // SABİT string ('vendor.js') KULLANMA: birden fazla shared chunk üretilince
        // (react/query/signalr/grid/ui hepsi ayrı) Rollup çakışan isimlere otomatik
        // numara ekliyor (vendor2/vendor3) ve chunk'lar arası import graph'ı bozuluyor
        // ("does not provide an export" runtime crash). Kategori bazlı isimlendirme
        // bunu kalıcı çözer + her vendor grubu kendi (kararlı) dosya adını korur.
        chunkFileNames: '[name].js',
        // React/react-dom + diğer ağır bağımlılıklar kategoriye göre ayrı, sabit
        // isimli chunk'lara — hem çakışma önlenir hem browser cache'i daha iyi
        // kullanılır (bir island güncellenince yalnız o island + kendi chunk'ı değişir).
        manualChunks(id) {
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-grid-layout/') ||
              id.includes('node_modules/react-resizable/') ||
              id.includes('node_modules/react-draggable/')) {
            return 'grid-vendor';
          }
          if (id.includes('node_modules/@radix-ui/') ||
              id.includes('node_modules/class-variance-authority/') ||
              id.includes('node_modules/clsx/') ||
              id.includes('node_modules/tailwind-merge/')) {
            return 'ui-vendor';
          }
          if (id.includes('node_modules/@tanstack/')) {
            return 'query-vendor';
          }
          if (id.includes('node_modules/@microsoft/signalr/')) {
            return 'signalr-vendor';
          }
          return undefined;
        },
      }
    }
  }
})
