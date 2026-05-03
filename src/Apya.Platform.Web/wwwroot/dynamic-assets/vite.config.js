import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/**
 * Vite multi-entry library mode.
 *
 * Her entry self-contained bir ES module üretir. Razor sayfaları sadece
 * ihtiyacı olanı `<script type="module" src=".../js/<name>.js">` ile yükler.
 *
 * React/react-dom her bundle'a kopyalanır (dependency, peer değil) — kabul
 * edilebilir, çünkü template-builder ve dashboard farklı sayfalarda mount
 * edilir, aynı anda yüklenmez. Birleştirmek istersek code-splitting'e geçeriz
 * (rollupOptions.input + manualChunks). Şimdilik basit tutuluyor.
 */
export default defineConfig({
    plugins: [react()],

    /* ABP/jQuery legacy code'u "process" referansı atınca crash olmasın diye
       (APYA-91 fix). React production build için NODE_ENV mutlaka 'production'. */
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env': {},
    },

    build: {
        outDir: '../js',
        emptyOutDir: false,
        sourcemap: false,
        cssCodeSplit: false, /* Tüm CSS tek bir style.css'te toplansın */
        lib: {
            entry: {
                'template-builder': resolve(__dirname, 'src/template-builder.jsx'),
                'dashboard':        resolve(__dirname, 'src/dashboard.jsx'),
            },
            formats: ['es'],
            fileName: (_format, entryName) => `${entryName}.js`,
        },
        rollupOptions: {
            external: [], /* Hiçbir şey unpkg/CDN'e bırakılmaz; bundle self-contained */
            output: {
                /* Razor `~/js/<name>.js` ile load eder — hash filename çalışmaz.
                   Browser ES module resolution shared chunk'ları otomatik halleder
                   (entry içinden `import` çağrısı tarayıcı tarafından çözülür). */
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: (asset) => {
                    if (asset.name && asset.name.endsWith('.css')) return 'style.css';
                    return '[name][extname]';
                },
                /* React/react-dom ortak chunk'a — iki entry de paylaşır.
                   Bundle boyutu duplikasyondan kurtulur. */
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
                    return undefined;
                },
            },
        },
    },
});
