import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../js',
    emptyOutDir: false,
    lib: {
      entry: 'src/template-builder.jsx',
      formats: ['es'],
      fileName: () => 'template-builder.js'
    },
    rollupOptions: {
      external: [] // bundle everything into the file to avoid unpkg CDNs!
    }
  }
})
