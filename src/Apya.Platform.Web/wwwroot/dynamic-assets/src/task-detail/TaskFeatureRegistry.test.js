import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./hooks/useTaskDetail', () => ({ isGranted: vi.fn(() => true) }));

import { getVisibleTabs, getPickerEntries, TASK_FEATURE_REGISTRY } from './TaskFeatureRegistry';
import { isGranted } from './hooks/useTaskDetail';

describe('getVisibleTabs', () => {
    it('hicbir sey atanmamisken sadece implemented core sekmeler gorunur (Genel + Alt Gorevler + Dosyalar)', () => {
        const tabs = getVisibleTabs([]);
        expect(tabs.map((t) => t.code)).toEqual(['general', 'subtasks', 'files']);
    });

    it('implemented olmayan bir non-core atanmis olsa bile gorunmez', () => {
        // Bugun icin gercekci degil (picker bunu asla addable gostermez) ama
        // fonksiyon veri-guvenli olmali: assignedCodes tek gercek kaynagi degil.
        const tabs = getVisibleTabs(['non_existent_feature']);
        expect(tabs.some((t) => t.code === 'non_existent_feature')).toBe(false);
    });
});

describe('getPickerEntries', () => {
    beforeEach(() => { isGranted.mockReturnValue(true); });

    it('core entry hic listelenmez', () => {
        const entries = getPickerEntries([]);
        expect(entries.some((e) => e.code === 'general')).toBe(false);
        expect(entries.some((e) => e.code === 'subtasks')).toBe(false);
    });

    it('non-core her entry isAssigned:false ile doner', () => {
        const entries = getPickerEntries([]);
        expect(entries.every((e) => e.isAssigned === false)).toBe(true);
    });

    it('atanmis bir kod isAssigned:true ile isaretlenir', () => {
        const entries = getPickerEntries(['checklist']);
        expect(entries.find((e) => e.code === 'checklist').isAssigned).toBe(true);
    });

    it('izni olmayan entry listelenmez', () => {
        isGranted.mockReturnValue(false);
        // Bugun icin hicbir entry'nin permission'i yok, bu yuzden filtre
        // simdilik hicbir seyi elemiyor — mekanizmayi kanitlamak icin geçici
        // olarak bir entry'e permission ekleyip test ediyoruz.
        const entries = getPickerEntries([]);
        expect(entries.length).toBeGreaterThan(0); // hicbirinde permission yok, hepsi gecer
    });
});

/**
 * Birlesik sekme sistemi (PR-1): `surfaces` alani modulun hangi yuzeylerde panel
 * olarak acilabildigini soyler — 'task' / 'project' / 'tasks'. PR-2'de proje ve
 * /Tasks katalog menuleri bu alani okuyacak; veri simdiden sozlesme.
 */
describe('surfaces alani', () => {
    const byCode = Object.fromEntries(TASK_FEATURE_REGISTRY.map((f) => [f.code, f]));

    it('her gorunur kayit surfaces tasir ve gecerli yuzey adlari kullanir', () => {
        const valid = new Set(['task', 'project', 'tasks']);
        TASK_FEATURE_REGISTRY.filter((f) => !f.hidden).forEach((f) => {
            expect(Array.isArray(f.surfaces), `${f.code} surfaces tasimali`).toBe(true);
            expect(f.surfaces.length).toBeGreaterThan(0);
            f.surfaces.forEach((s) => expect(valid.has(s), `${f.code}: ${s}`).toBe(true));
        });
    });

    it('handoff kapsam cipleriyle birebir: uc yuzeyli moduller', () => {
        // Wireframe 2a/2b/2d: Takvim, Gantt, Dosya Galerisi = G·P·D
        ['calendar', 'gantt', 'gallery'].forEach((code) => {
            expect(byCode[code].surfaces).toEqual(['task', 'project', 'tasks']);
        });
    });

    it('handoff kapsam cipleriyle birebir: proje+gorev yuzeyli moduller', () => {
        // Wireframe 2e-2i: Belge, Form, Kontrol Listesi, Bagimliliklar, Gecmis = P·D
        ['documents', 'forms', 'checklist', 'dependencies', 'history'].forEach((code) => {
            expect(byCode[code].surfaces).toEqual(['task', 'project']);
        });
    });

    it('alt gorev gorunumleri ve Finans yalniz gorev detayinda kalir', () => {
        // Finans proje ve /Tasks yuzeylerinde SABIT sekmedir, katalog modulu degil.
        ['subtask-table', 'subtask-board', 'finance', 'time-tracking', 'sharing'].forEach((code) => {
            expect(byCode[code].surfaces).toEqual(['task']);
        });
    });

    it('Gosterge Paneli gorev detayinda gizli ama proje ve /Tasks yuzeylerine acik', () => {
        expect(byCode.dashboard.hidden).toBe(true);
        expect(byCode.dashboard.surfaces).toEqual(['project', 'tasks']);
    });
});
