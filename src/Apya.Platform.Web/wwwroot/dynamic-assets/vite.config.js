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
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [], // tümü bundle'a girer — CDN bağımlılığı yok
      output: {
        // Shared chunk (React/ReactDOM) → sabit isim; global bundle'a eklenebilir.
        chunkFileNames: 'vendor.js',
      }
    }
  }
})
