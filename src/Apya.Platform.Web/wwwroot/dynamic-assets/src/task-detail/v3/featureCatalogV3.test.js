import { describe, it, expect } from 'vitest';
import { isUnbuilt, UNBUILT_CODES, featureInfo, catalogGroups } from './featureCatalogV3';
import { TASK_FEATURE_REGISTRY, getVisibleTabs } from '../TaskFeatureRegistry';

/**
 * featureCatalogV3 — "hangi sekme gerçek, hangisi yapım aşamasında" kararının
 * tek kaynağı. Faz 10-B'de uydurma içerikli sekmeler buraya alındı; bu testler
 * o kararın sessizce geri alınmasını engeller.
 */
describe('featureCatalogV3 / isUnbuilt', () => {
    it('backend i olmayan sekmeleri yapim asamasinda sayar', () => {
        // Faz 10-B: uydurma icerik basiyorlardi, dogru davranis dürüst bos durum.
        expect(isUnbuilt('approvals')).toBe(true);
        expect(isUnbuilt('ai')).toBe(true);
        expect(isUnbuilt('automations')).toBe(true);
    });

    it('gercek bilesenli sekmeleri yapim asamasinda SAYMAZ', () => {
        expect(isUnbuilt('subtasks')).toBe(false);
        expect(isUnbuilt('files')).toBe(false);
        expect(isUnbuilt('time-tracking')).toBe(false);
        expect(isUnbuilt('gantt')).toBe(false);
        expect(isUnbuilt('dependencies')).toBe(false);
        expect(isUnbuilt('finance')).toBe(false);
        expect(isUnbuilt('activity')).toBe(false);
    });

    it('2026-09-03 te acilan sekmeler artik unbuilt DEGIL', () => {
        expect(isUnbuilt('checklist')).toBe(false);
        expect(isUnbuilt('history')).toBe(false);
        expect(isUnbuilt('gallery')).toBe(false);
    });

    it('general sekmesi asla unbuilt olamaz (RootV3 onu ayri render eder)', () => {
        expect(isUnbuilt('general')).toBe(false);
    });

    it('bilinmeyen kod icin false doner', () => {
        expect(isUnbuilt('boyle-bir-kod-yok')).toBe(false);
    });
});

/**
 * BILINCLI ISTISNA — CommentsTab'in GERCEK bileseni var ama kodu UNBUILT_CODES'ta
 * oldugu icin RootV3 onu hic render etmiyor; icerigi Genel sekmesinde sunuluyor
 * (bkz. featureCatalogV3 icindeki not). Yani binding OLU KOD. Burada listeleniyor ki:
 *   - durum belgelensin (yeni gelen "bu neden calismiyor?" diye aramasin),
 *   - YENI bir sekme yanlislikla ayni tuzaga duserse asagidaki test kirilsin.
 *
 * 2026-09-03: `checklist` ve `history` buradan CIKTI — ikisi de artik kendi V3
 * bilesenlerine (ChecklistTabV3 / HistoryTabV3) bagli ve gercekten render ediliyor.
 */
const BOUND_BUT_HIDDEN = new Set(['comments']);

describe('featureCatalogV3 / registry tutarliligi', () => {
    /**
     * Kritik tutarlilik: unbuilt bir sekmenin registry'de component'i OLMAMALI.
     * Aksi halde birileri component baglar ama UNBUILT_CODES'tan cikarmayi unutur
     * -> bilesen sessizce olu koda doner (Faz 10-B'de tam olarak bu olmustu).
     */
    it('unbuilt sekmelerin component u null olmali (bilinen istisnalar haric)', () => {
        for (const code of UNBUILT_CODES) {
            if (BOUND_BUT_HIDDEN.has(code)) continue;
            const entry = TASK_FEATURE_REGISTRY.find((f) => f.code === code);
            if (!entry) continue; // katalogda olmayan kod
            expect(entry.component, `${code} unbuilt ama component bagli`).toBeNull();
        }
    });

    it('component u olan her sekme unbuilt DEGIL (bilinen istisnalar haric)', () => {
        for (const entry of TASK_FEATURE_REGISTRY) {
            if (!entry.component || BOUND_BUT_HIDDEN.has(entry.code)) continue;
            expect(isUnbuilt(entry.code), `${entry.code} component var ama unbuilt`).toBe(false);
        }
    });

    /** Istisna listesi gercegi yansitmali; biri gercekten acilirsa buradan da dus. */
    it('istisna listesindeki sekmeler hala hem unbuilt hem component li', () => {
        for (const code of BOUND_BUT_HIDDEN) {
            const entry = TASK_FEATURE_REGISTRY.find((f) => f.code === code);
            expect(entry, `${code} registry de yok`).toBeTruthy();
            expect(isUnbuilt(code), `${code} artik unbuilt degil -> istisnadan cikar`).toBe(true);
            expect(entry.component, `${code} component u kaldirilmis -> istisnadan cikar`).toBeTruthy();
        }
    });
});

/**
 * GIZLENEN OZELLIKLER (2026-09-03) — arkalarinda DB'ye yazan bir akis olmadigi
 * (ya da icerikleri baska sekmede sunuldugu) icin katalogdan ve sekme cubugundan
 * cikarildilar. Karar registry'deki `hidden: true` satirinda yasiyor; bu testler
 * sessizce geri alinmasini engeller. Geri acmak = o satiri silmek + burayi guncellemek.
 */
const HIDDEN_CODES = [
    'risks', 'comments', 'activity', 'ai', 'custom-fields', 'automations', 'emails',
    'approvals', 'dashboard',
];

describe('featureCatalogV3 / gizlenen ozellikler', () => {
    it('gizli kodlar katalogda HIC gorunmez', () => {
        const shown = catalogGroups().flatMap((g) => g.items.map((i) => i.code));
        for (const code of HIDDEN_CODES) {
            expect(shown, `${code} hala katalogda`).not.toContain(code);
        }
    });

    it('gizli kod icin featureInfo null doner', () => {
        for (const code of HIDDEN_CODES) {
            expect(featureInfo(code), `${code} featureInfo dondu`).toBeNull();
        }
    });

    it('gizli kod atanmis olsa bile sekme cubuguna cikmaz', () => {
        const codes = getVisibleTabs(HIDDEN_CODES).map((t) => t.code);
        for (const code of HIDDEN_CODES) {
            expect(codes, `${code} sekme cubugunda`).not.toContain(code);
        }
    });

    it('gizlenmeyen gercek ozellikler yerinde duruyor', () => {
        const shown = catalogGroups().flatMap((g) => g.items.map((i) => i.code));
        for (const code of ['checklist', 'gantt', 'time-tracking', 'dependencies', 'history', 'finance', 'gallery']) {
            expect(shown, `${code} katalogdan dusmus`).toContain(code);
        }
    });
});

describe('featureCatalogV3 / featureInfo', () => {
    it('baslik ve ikonu registry den alir (tek dogruluk kaynagi)', () => {
        const info = featureInfo('time-tracking');
        const reg = TASK_FEATURE_REGISTRY.find((f) => f.code === 'time-tracking');
        expect(info.title).toBe(reg.title);
        expect(info.icon).toBe(reg.icon);
    });

    it('sunum bilgisini (aciklama/renk) ekler', () => {
        const info = featureInfo('gallery');
        expect(info.desc).toBeTruthy();
        expect(info.bg).toBeTruthy();
        expect(info.fg).toBeTruthy();
    });

    it('bilinmeyen kod icin null doner', () => {
        expect(featureInfo('boyle-bir-kod-yok')).toBeNull();
    });
});
