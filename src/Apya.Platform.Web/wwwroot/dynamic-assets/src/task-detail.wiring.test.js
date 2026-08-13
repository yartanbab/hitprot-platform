import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Pages/Tasks/index.js, Pages/Board/index.js, Pages/Projects/ProjectDetails.js
 * jQuery IIFE'leri — bu repoda vitest/jsdom altında ÇALIŞTIRILAMAZ (DataTables,
 * Select2, SortableJS bağımlılıkları + gerçek DOM elemanları
 * gerektiriyor). Bayrağın GERÇEK DAVRANIŞI (kapalıyken eski drawer, açıkken
 * merkezi modal) yalnız canlı tarayıcıda doğrulanabilir.
 *
 * Kuyruk köprüsü mimarisinde (v3+) bayrak artık _TaskDetailIsland.cshtml'deki
 * inline script'te tanımlanır. Sayfa script'leri yalnızca window.apya.taskDetail
 * nesnesini kullanır (köprü her zaman hazır).
 */
const dynamicAssetsSrc = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.resolve(dynamicAssetsSrc, '../../../Pages');

const FILES = [
    { path: path.join(pagesDir, 'Tasks', 'index.js'), fallback: "abp.ModalManager(abp.appPath + 'Tasks/EditModal')" },
    { path: path.join(pagesDir, 'Board', 'index.js'), fallback: "abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' })" },
    { path: path.join(pagesDir, 'Projects', 'ProjectDetails.js'), fallback: "abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' })" },
];

describe('Görev sayfaları — editModal kuyruk köprüsüyle seçiliyor (kaynak metni pin)', () => {
    it.each(FILES)('$path — apya.taskDetail var ise kullanır, yoksa eski ModalManager', ({ path: filePath, fallback }) => {
        const src = readFileSync(filePath, 'utf8');

        // Kuyruk köprüsü paterni: apya.taskDetail kontrolü olmalı
        expect(src).toContain('apya.taskDetail');
        // Eski modal fallback hâlâ durmalı
        expect(src).toContain(fallback);
    });
});
