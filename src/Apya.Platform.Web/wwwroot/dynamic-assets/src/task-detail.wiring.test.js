import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Pages/Tasks/index.js, Pages/Board/index.js, Pages/Projects/ProjectDetails.js
 * jQuery IIFE'leri — bu repoda vitest/jsdom altında ÇALIŞTIRILAMAZ (DataTables,
 * Select2, SortableJS, frappe-gantt bağımlılıkları + gerçek DOM elemanları
 * gerektiriyor). Bayrağın GERÇEK DAVRANIŞI (kapalıyken eski drawer, açıkken
 * merkezi modal) yalnız canlı tarayıcıda doğrulanabilir — bkz. task-8-report.md
 * "Manuel doğrulama" bölümü.
 *
 * Bu dosya bunun YERİNE geçmez; yalnız kaynak metninde koşulun VAR OLDUĞUNU
 * sabitler — birisi ileride "geçici olarak" satırı `new abp.ModalManager(...)`'a
 * geri alıp commit ederse bu test kırılır.
 */
const dynamicAssetsSrc = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.resolve(dynamicAssetsSrc, '../../../Pages');

const FILES = [
    { path: path.join(pagesDir, 'Tasks', 'index.js'), fallback: "abp.ModalManager(abp.appPath + 'Tasks/EditModal')" },
    { path: path.join(pagesDir, 'Board', 'index.js'), fallback: "abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' })" },
    { path: path.join(pagesDir, 'Projects', 'ProjectDetails.js'), fallback: "abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' })" },
];

describe('Görev sayfaları — editModal bayrakla seçiliyor (kaynak metni pin)', () => {
    it.each(FILES)('$path — bayrak açıkken apya.taskDetail, kapalıyken eski ModalManager', ({ path: filePath, fallback }) => {
        const src = readFileSync(filePath, 'utf8');

        expect(src).toMatch(/apya\.taskDetailV2Enabled/);
        expect(src).toContain('apya.taskDetail');
        expect(src).toContain(fallback);
    });
});
