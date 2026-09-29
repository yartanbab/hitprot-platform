import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Ada hata sınırının kablolaması (kaynak metni pin — task-detail.wiring / errorChannel.wiring
 * deseni). Sınır davranışı IslandErrorBoundary.test.jsx ve lib/mountIsland.persist.test.jsx'te.
 *
 * 1) vite.config.js'teki HER giriş ortak kapıdan (lib/mountIsland) açılır; createRoot yalnız
 *    orada. Yeni ada doğrudan createRoot yazarsa sınırsız açılır → burada kırılır (RES-11).
 * 2) Sınır TÜM adalara girer: içe aktarma zinciri (mountIsland → IslandErrorBoundary →
 *    EmptyState → i18n / abpErrors, queryCacheStorage) ui-vendor ya da query-vendor paketine
 *    dayanan hiçbir modül çekmez (karar 11 — EmptyState.test "bağımlılıksız" emsal). Aksi hâlde
 *    herkese açık form, cari, formlar, yanıtlar gibi hafif adalar bu parçaları yüklerdi.
 * 3) Önbellek anahtarı tek kaynakta (CAL-24): sınırın sildiği ile kalıcılaştırıcının yazdığı aynı.
 * 4) Kartın metinleri tr.json / en.json'da; JS yedeği tr.json ile aynı.
 */
const src = path.dirname(fileURLToPath(import.meta.url));
const shared = path.resolve(src, '../../../..', 'Apya.Platform.Domain.Shared', 'Localization', 'Platform');
const read = (...p) => readFileSync(path.join(...p), 'utf8');
const relative = (file) => path.relative(src, file).split(path.sep).join('/');
const viteConfig = read(src, '..', 'vite.config.js');

const ENTRIES = [...viteConfig.matchAll(/'src\/([^']+\.jsx)'/g)].map((m) => m[1]);

function sourceFiles(dir) {
    return readdirSync(dir).flatMap((name) => {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) return name === 'test' ? [] : sourceFiles(full);
        return /\.jsx?$/.test(name) && !/\.test\.jsx?$/.test(name) ? [full] : [];
    });
}

describe('her ada ortak açılış kapısından açılır (RES-11)', () => {
    it('vite.config.js girişleri okunabildi', () => {
        expect(ENTRIES.length).toBeGreaterThanOrEqual(17);
        expect(ENTRIES).toEqual(expect.arrayContaining(['calendar.jsx', 'customers.jsx', 'public-form.jsx', 'task-detail.jsx']));
    });

    it.each(ENTRIES)('%s: mountIsland ile açılır, createRoot kullanmaz', (entry) => {
        const text = read(src, entry);
        expect(text).toContain("import { mountIsland } from './lib/mountIsland';");
        expect(text).toMatch(/\bmountIsland\([^)]*,\s*['`][^'`]+['`],/);
        expect(text).not.toContain('createRoot');
    });

    it('createRoot yalnız lib/mountIsland.jsx\'te çağrılır (testler hariç)', () => {
        const callers = sourceFiles(src)
            .filter((file) => readFileSync(file, 'utf8').includes('createRoot('))
            .map(relative);
        expect(callers).toEqual(['lib/mountIsland.jsx']);
    });
});

describe('sınır hafif adalara ağır parça taşımaz (karar 11)', () => {
    const vendorPackages = (chunk) => {
        const before = viteConfig.slice(0, viteConfig.indexOf(`return '${chunk}'`));
        return [...before.slice(before.lastIndexOf('if (')).matchAll(/node_modules\/([^']+?)\/'/g)].map((m) => m[1]);
    };
    const HEAVY = [...vendorPackages('ui-vendor'), ...vendorPackages('query-vendor')];

    const withoutComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
    const specifiers = (file) => [...withoutComments(readFileSync(file, 'utf8'))
        .matchAll(/\b(?:import|export)\s[^;]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]/g)]
        .map((m) => m[1] ?? m[2]);
    const resolve = (from, spec) => {
        const base = path.resolve(path.dirname(from), spec);
        const found = [base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js')]
            .find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
        if (!found) throw new Error(`çözülemedi: ${spec} (${from})`);
        return found;
    };
    const graph = new Map();
    const walk = (file) => {
        if (graph.has(file)) return;
        graph.set(file, specifiers(file));
        graph.get(file).filter((s) => s.startsWith('.')).forEach((s) => walk(resolve(file, s)));
    };
    walk(path.join(src, 'lib', 'mountIsland.jsx'));
    const files = [...graph.keys()].map(relative);

    it('ui-vendor ve query-vendor paket listeleri okunabildi', () => {
        expect(vendorPackages('ui-vendor')).toEqual(expect.arrayContaining(['@radix-ui', 'class-variance-authority', 'clsx', 'tailwind-merge']));
        expect(vendorPackages('query-vendor')).toEqual(['@tanstack']);
    });

    it('zincir: mountIsland → IslandErrorBoundary → EmptyState; barrel, Button, cn ve queryPersister YOK', () => {
        expect(files).toEqual(expect.arrayContaining([
            'lib/mountIsland.jsx',
            'components/ui/IslandErrorBoundary.jsx',
            'components/ui/EmptyState.jsx',
            'lib/i18n.js',
            'lib/api/abpErrors.js',
            'lib/api/queryCacheStorage.js',
        ]));
        ['components/ui/index.js', 'components/ui/Button.jsx', 'lib/utils.js', 'lib/api/queryPersister.js', 'lib/api/QueryProvider.jsx']
            .forEach((heavy) => expect(files).not.toContain(heavy));
    });

    it('erişilen hiçbir modül ui-vendor ya da query-vendor paketini içe aktarmaz', () => {
        const offenders = [...graph.entries()].flatMap(([file, specs]) => specs
            .filter((s) => HEAVY.some((pkg) => s === pkg || s.startsWith(`${pkg}/`)))
            .map((s) => `${relative(file)} → ${s}`));
        expect(offenders).toEqual([]);
    });
});

describe('önbellek anahtarı tek kaynakta (CAL-24)', () => {
    it('queryPersister anahtarı ve kısıt süresini queryCacheStorage\'dan alır', () => {
        const persister = read(src, 'lib', 'api', 'queryPersister.js');
        expect(persister).not.toContain("'apya-rq-cache'");
        expect(persister).toContain("from './queryCacheStorage'");
        expect(persister).toContain('key: QUERY_CACHE_STORAGE_KEY');
        expect(persister).toContain('throttleTime: PERSIST_THROTTLE_MS');
    });
});

describe('kart metinleri tek kaynaktan: tr.json / en.json', () => {
    const trRaw = read(shared, 'tr.json');
    const enRaw = read(shared, 'en.json');
    const tr = JSON.parse(trRaw).texts;
    const en = JSON.parse(enRaw).texts;
    const pairs = ['components/ui/IslandErrorBoundary.jsx', 'task-detail.jsx']
        .flatMap((file) => [...read(src, file).matchAll(/\bt\(\s*'(Common:[^']+)'\s*,\s*'([^']*)'/g)])
        .map((m) => [m[1], m[2]]);
    const count = (text, needle) => text.split(needle).length - 1;

    it('kart dört anahtarın hepsini kullanır', () => {
        expect(new Set(pairs.map(([key]) => key))).toEqual(new Set([
            'Common:SectionError:Title', 'Common:SectionError:Description', 'Common:ReloadPage', 'Common:Close',
        ]));
    });

    it.each(pairs)('%s: tr ve en var, JS yedeği tr.json ile aynı, her dosyada tam bir kez', (key, fallback) => {
        expect(tr[key]).toBe(fallback);
        expect(en[key]).toBeTruthy();
        expect(en[key]).not.toBe(key);
        expect(count(trRaw, `"${key}":`)).toBe(1);
        expect(count(enRaw, `"${key}":`)).toBe(1);
    });
});
