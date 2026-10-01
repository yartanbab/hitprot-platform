import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Kirli-form korumasının kablolaması (kaynak metni pin — errorChannel.wiring /
 * islandMount.wiring deseni). Davranış testleri: lib/feedback/useDirtyGuard.test.js,
 * components/ui/UnsavedChangesDialog.test.jsx, TaskDetailRootV3.dirtyGuard.test.jsx.
 *
 * CON-01'in kök nedeni: useDirtyGuard kirliyken yalnız `pendingClose` kurar, pencereyi
 * ÇAĞIRAN çizer. V3 hook'u kullanıp pencereyi çizmediği için kirli formda her çıkış
 * sessizce yutuluyordu. Burada kilitlenen: hook'u kullanan her dosya pencereyi de çizer.
 */
const src = path.dirname(fileURLToPath(import.meta.url));
const shared = path.resolve(src, '../../../..', 'Apya.Platform.Domain.Shared', 'Localization', 'Platform');
const relative = (file) => path.relative(src, file).split(path.sep).join('/');

function sourceFiles(dir) {
    return readdirSync(dir).flatMap((name) => {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) return name === 'test' ? [] : sourceFiles(full);
        return /\.jsx?$/.test(name) && !/\.test\.jsx?$/.test(name) ? [full] : [];
    });
}

const withoutComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
const SOURCES = sourceFiles(src).map((file) => ({ file: relative(file), text: readFileSync(file, 'utf8') }));
const HOOK = 'lib/feedback/useDirtyGuard.js';

describe('useDirtyGuard kullanan her bileşen pencereyi de çizer (CON-01)', () => {
    const callers = SOURCES.filter(({ file, text }) => file !== HOOK && /\buseDirtyGuard\(/.test(withoutComments(text)));

    it('kullanıcılar bulundu (görev detayı V3 ve v2)', () => {
        expect(callers.map((c) => c.file)).toEqual(expect.arrayContaining([
            'task-detail/v3/TaskDetailRootV3.jsx',
            'task-detail/TaskDetailRoot.jsx',
        ]));
    });

    it.each(callers.map((c) => [c.file, c.text]))('%s: <UnsavedChangesDialog open={guard.pendingClose} … /> çizer', (_file, text) => {
        expect(withoutComments(text)).toMatch(/<UnsavedChangesDialog\b[^>]*\bopen=\{guard\.pendingClose\}/);
    });

    it('hook tek kaynaktan içe aktarılır: lib/feedback/useDirtyGuard (task-detail/hooks altında kopya yok)', () => {
        expect(SOURCES.map((s) => s.file)).not.toContain('task-detail/hooks/useDirtyGuard.js');
        const importers = SOURCES.flatMap(({ file, text }) => [...withoutComments(text)
            .matchAll(/\bimport\s*\{[^}]*\buseDirtyGuard\b[^}]*\}\s*from\s*['"]([^'"]+)['"]/g)]
            .map((m) => `${file} ← ${m[1]}`));
        expect(importers.length).toBeGreaterThanOrEqual(2);
        importers.forEach((line) => expect(line).toMatch(/lib\/feedback\/useDirtyGuard$/));
    });

    it('eski resolvePendingClose(\'save\') çağrısı kalmadı (kayıt bitmeden pencereyi kapatıyordu)', () => {
        const offenders = SOURCES.filter(({ text }) => /resolvePendingClose\(\s*['"]save['"]\s*\)/.test(withoutComments(text)));
        expect(offenders.map((o) => o.file)).toEqual([]);
    });
});

describe('aynı koruma için ikinci mekanizma yok', () => {
    it('task-detail/** altında "Kaydedilmemiş" soran window.confirm kalmadı', () => {
        const offenders = SOURCES
            .filter(({ file }) => file.startsWith('task-detail/'))
            .filter(({ text }) => /window\.confirm\([^)]*Kaydedilmemiş/.test(withoutComments(text)));
        expect(offenders.map((o) => o.file)).toEqual([]);
    });

    /* Hafif adalar ortak pencereyi kullanmaz (islandMount.wiring "karar 11"); form oluşturucu
       ortak jQuery korumasına (apya.dirtyGuard.watch) kaydolur — Faz 5 decisions L4. */
    it.each(['form-builder.jsx', 'forms.jsx', 'responses.jsx', 'customers.jsx', 'public-form.jsx'])(
        '%s UnsavedChangesDialog içe aktarmaz', (entry) => {
            const found = SOURCES.find((s) => s.file === entry);
            expect(found).toBeTruthy();
            expect(found.text).not.toContain('UnsavedChangesDialog');
        });
});

describe('metinler tek kaynaktan: tr.json / en.json', () => {
    const trRaw = readFileSync(path.join(shared, 'tr.json'), 'utf8');
    const enRaw = readFileSync(path.join(shared, 'en.json'), 'utf8');
    const tr = JSON.parse(trRaw).texts;
    const en = JSON.parse(enRaw).texts;
    const count = (text, needle) => text.split(needle).length - 1;

    /* React ve Razor aynı cümleyi kullanır (decisions L1); Badge'i jQuery tarafı ekler. */
    const KEYS = [
        'Common:Unsaved:Title', 'Common:Unsaved:Body', 'Common:Unsaved:Stay', 'Common:Unsaved:Discard',
        'Common:Unsaved:SaveAndClose', 'Common:Unsaved:SaveAndContinue', 'Common:Unsaved:Saving',
        'Common:Unsaved:SaveFailed', 'Common:Unsaved:LeaveConfirm',
        'Documents:Detail:Unsaved:Body',
        'Tasks:Detail:TitleLabel', 'Tasks:Detail:Validation:TitleRequired', 'Tasks:Detail:Validation:StartDateRequired',
        'Tasks:Detail:Validation:DueBeforeStart', 'Tasks:Detail:Validation:Summary',
    ];

    it.each(KEYS)('%s: tr ve en var, her dosyada tam bir kez', (key) => {
        expect(tr[key]).toBeTruthy();
        expect(en[key]).toBeTruthy();
        expect(en[key]).not.toBe(tr[key]);
        expect(count(trRaw, `"${key}":`)).toBe(1);
        expect(count(enRaw, `"${key}":`)).toBe(1);
    });

    /* t('Anahtar', 'yedek') — yedek tek ya da çift tırnaklı olabilir. */
    const FALLBACK = /\bt\(\s*'((?:Common:Unsaved|Documents:Detail:Unsaved|Tasks:Detail:Validation|Tasks:Detail:TitleLabel)[^']*)'\s*,\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g;
    const usages = SOURCES.flatMap(({ file, text }) => [...text.matchAll(FALLBACK)]
        .map((m) => [file, m[1], (m[2] ?? m[3]).replace(/\\(['"])/g, '$1')]));

    it('pencere varsayılan metinlerini bu anahtarlardan alır', () => {
        const used = new Set(usages.filter(([file]) => file === 'components/ui/UnsavedChangesDialog.jsx').map(([, key]) => key));
        expect(used).toEqual(new Set([
            'Common:Unsaved:Title', 'Common:Unsaved:Body', 'Common:Unsaved:Stay',
            'Common:Unsaved:Discard', 'Common:Unsaved:SaveAndClose', 'Common:Unsaved:Saving',
        ]));
    });

    it.each(usages)('%s › %s: JS yedeği tr.json ile aynı', (_file, key, fallback) => {
        expect(KEYS).toContain(key);
        expect(fallback).toBe(tr[key]);
    });
});
