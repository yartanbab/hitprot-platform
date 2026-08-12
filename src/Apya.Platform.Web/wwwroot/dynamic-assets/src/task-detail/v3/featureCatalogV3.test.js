import { describe, it, expect } from 'vitest';
import { isUnbuilt, UNBUILT_CODES, featureInfo } from './featureCatalogV3';
import { TASK_FEATURE_REGISTRY } from '../TaskFeatureRegistry';

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

    it('general sekmesi asla unbuilt olamaz (RootV3 onu ayri render eder)', () => {
        expect(isUnbuilt('general')).toBe(false);
    });

    it('bilinmeyen kod icin false doner', () => {
        expect(isUnbuilt('boyle-bir-kod-yok')).toBe(false);
    });
});

/**
 * BILINCLI ISTISNA — bu uc sekmenin GERCEK bileseni var (ChecklistTab /
 * CommentsTab / HistoryTab) ama kodlari UNBUILT_CODES'ta oldugu icin RootV3 onlari
 * hic render etmiyor; icerikleri Genel sekmesinde sunuluyor (bkz. featureCatalogV3
 * icindeki not). Yani binding OLU KOD. Burada tek tek listeleniyor ki:
 *   - durum belgelensin (yeni gelen "bu neden calismiyor?" diye aramasin),
 *   - YENI bir sekme yanlislikla ayni tuzaga duserse asagidaki test kirilsin.
 */
const BOUND_BUT_HIDDEN = new Set(['checklist', 'comments', 'history']);

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

describe('featureCatalogV3 / featureInfo', () => {
    it('baslik ve ikonu registry den alir (tek dogruluk kaynagi)', () => {
        const info = featureInfo('time-tracking');
        const reg = TASK_FEATURE_REGISTRY.find((f) => f.code === 'time-tracking');
        expect(info.title).toBe(reg.title);
        expect(info.icon).toBe(reg.icon);
    });

    it('sunum bilgisini (aciklama/renk) ekler', () => {
        const info = featureInfo('approvals');
        expect(info.desc).toBeTruthy();
        expect(info.bg).toBeTruthy();
        expect(info.fg).toBeTruthy();
    });

    it('bilinmeyen kod icin null doner', () => {
        expect(featureInfo('boyle-bir-kod-yok')).toBeNull();
    });
});
