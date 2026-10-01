import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Veri-değişti köprüsünün kablolaması (kaynak metni pin — task-detail.wiring
 * deseni). Tasks/index.js ve ProjectDetails.js jQuery IIFE'leri vitest/jsdom
 * altında çalıştırılamıyor (DataTables, Select2, SortableJS, gerçek DOM); yayın
 * noktaları ve toplu akışın yeni sözleşmesi burada kaynaktan kilitlenir, gerçek
 * davranış canlıda doğrulanır.
 */
const src = path.dirname(fileURLToPath(import.meta.url));
const web = path.resolve(src, '../../..');
const read = (...p) => readFileSync(path.join(...p), 'utf8');
const count = (text, needle) => text.split(needle).length - 1;

/** Her runSequential( çağrısından sonraki İLK .then( — sonucun alındığını kanıtlar. */
function thensAfterRunSequential(text) {
    const out = [];
    let i = text.indexOf('runSequential(');
    while (i >= 0) {
        const t = text.indexOf('.then(', i);
        out.push(text.slice(t, t + '.then(function (result)'.length));
        i = text.indexOf('runSequential(', i + 1);
    }
    return out;
}

const CONSOLES = [
    path.join(web, 'Pages', 'Tasks', 'index.js'),
    path.join(web, 'Pages', 'Projects', 'ProjectDetails.js'),
];

describe('Görev konsolları — yayın ve toplu akış (STA-03, STA-15, STA-11)', () => {
    it.each(CONSOLES)('%s — reloadAll, kanban onChanged ve gantt onSaved görev olayı yayınlar', (file) => {
        expect(count(read(file), "apya.dataChanged.emit({ entity: 'task' })")).toBeGreaterThanOrEqual(3);
    });

    it.each(CONSOLES)('%s — toplu işlemler kalem başına ABP penceresi açmaz, sonucu özetler', (file) => {
        const text = read(file);
        expect(count(text, 'abpHandleError: false')).toBeGreaterThanOrEqual(2);
        expect(count(text, 'notifyBulkResult(')).toBe(2);
        // Eski sonuçsuz desen (.then(function () {) — hata yolunda özet/yenileme yoktu.
        const thens = thensAfterRunSequential(text);
        expect(thens).toHaveLength(2);
        thens.forEach((t) => expect(t).toBe('.then(function (result)'));
    });
});

describe('Yeni Görev modalı ve global demet (CAL-04)', () => {
    it('CreateModal kayıt başarısında (abp-ajax-success) görev oluşturma olayı yayınlar', () => {
        const text = read(web, 'Pages', 'Tasks', 'CreateModal.cshtml');
        expect(text).toContain("'abp-ajax-success'");
        expect(text).toContain("apya.dataChanged.emit({ entity: 'task', action: 'create' })");
    });

    it('apya-data-changed.js global demette, Yeni Görev modülünden önce', () => {
        const text = read(web, 'PlatformWebModule.cs');
        const bridge = text.indexOf('"/js/apya-data-changed.js"');
        expect(bridge).toBeGreaterThan(text.indexOf('LeptonXLiteThemeBundles.Scripts.Global'));
        expect(bridge).toBeLessThan(text.indexOf('"/js/apya-quick-task.js"'));
    });
});

describe('React adaları — dinleyiciler', () => {
    it('takvim görev olayını dinler ve boş durumda sayfadan çıkmadan modalı açar', () => {
        const text = read(src, 'calendar', 'CalendarRoot.jsx');
        expect(text).not.toContain("window.location.href = '/Tasks'");
        expect(text).toContain('onClick={openNewTask}');
        expect(text).toContain('useInvalidateTaskDerivedOnChange()');
    });

    it('toplantıdan görev oluşturma olay yayınlar', () => {
        expect(read(src, 'calendar', 'MeetingActions.jsx')).toContain('emitDataChanged(');
    });

    it('Pano aynı sekmedeki görev yazmalarını dinler', () => {
        expect(read(src, 'dashboard', 'DashboardRealtimeBridge.jsx')).toContain('useInvalidateTaskDerivedOnChange()');
    });
});
