import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Pages/Admin/ReleaseNotes/Index.js bir IIFE: sürüm notu yayın onayı ekranındaki
// "Hepsini onayla" / "Bu sürümün tümünü onayla" kutularını yönetir (2026-09-28 UX
// denetimi, ADM-04). Bu ekranda GERÇEK yayın kararı verilir: yanlış bir "kendi karar"
// hesabı Kaydet'te istenmeyen onay ya da onay kaldırma demektir.
//
// Sunucunun bastığı işaretleme burada elle kurulur: madde kutusunun `checked`
// özniteliği sunucudaki karardır (ReleaseNotesPublishing_Tests bu sözleşmeyi sayfa
// tarafında kilitler).

const here = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.resolve(here, '../../../../Pages/Admin/ReleaseNotes');

let init;

beforeAll(async () => {
    await import('../../../../Pages/Admin/ReleaseNotes/Index.js');
    init = window.apya.releaseNoteApproval.init;
});

/**
 * @param {Record<string, boolean[]>} releases sürüm → madde kutularının sunucudaki değeri
 */
function mount(releases) {
    let index = 0;
    const blocks = Object.entries(releases).map(([version, approvals]) => {
        const rows = approvals.map((approved) => {
            const i = index++;
            return `<tr><td>
                <input type="hidden" name="Items[${i}].Version" value="${version}">
                <input class="form-check-input rn-approve" type="checkbox" data-version="${version}"
                       id="Items_${i}__IsApproved" name="Items[${i}].IsApproved" value="true"${approved ? ' checked="checked"' : ''}>
            </td></tr>`;
        }).join('');
        return `<details><div><input type="checkbox" class="rn-select-version" data-version="${version}"></div>
            <table><tbody>${rows}</tbody></table></details>`;
    }).join('');

    document.body.innerHTML = `<form method="post"><input type="checkbox" id="rnSelectAll">${blocks}</form>`;
    init(document);
}

const all = () => document.getElementById('rnSelectAll');
const versionBox = (version) => document.querySelector(`.rn-select-version[data-version="${version}"]`);
const items = () => [...document.querySelectorAll('.rn-approve')];
const states = () => items().map((cb) => cb.checked);
const box = (el) => ({ checked: el.checked, indeterminate: el.indeterminate });

const ON = { checked: true, indeterminate: false };
const OFF = { checked: false, indeterminate: false };
const PARTIAL = { checked: false, indeterminate: true };

beforeEach(() => {
    document.body.innerHTML = '';
});

describe('açılış durumu', () => {
    it('ana kutu kısmi durumu gösterir; sürüm kutuları kendi sürümünü özetler', () => {
        mount({ '2026.09.27': [true, true], '2026.09.21': [false, false], '2026.09.17': [true, false] });

        expect(box(all())).toEqual(PARTIAL);
        expect(box(versionBox('2026.09.27'))).toEqual(ON);
        expect(box(versionBox('2026.09.21'))).toEqual(OFF);
        expect(box(versionBox('2026.09.17'))).toEqual(PARTIAL);
    });

    it('hepsi onaylıysa ana kutu işaretli, hiçbiri onaylı değilse boş', () => {
        mount({ a: [true, true], b: [true] });
        expect(box(all())).toEqual(ON);

        mount({ a: [false, false], b: [false] });
        expect(box(all())).toEqual(OFF);
    });
});

describe('ana kutu', () => {
    it('işaretle → kaldır önceki onayları geri getirir (65 → 207 → 65, AYNI maddeler)', () => {
        const baslangic = [true, false, false, true, false];
        mount({ a: baslangic.slice(0, 3), b: baslangic.slice(3) });

        all().click();
        expect(states()).toEqual([true, true, true, true, true]);
        expect(box(all())).toEqual(ON);

        all().click();
        expect(states()).toEqual(baslangic);
        expect(box(all())).toEqual(PARTIAL);
    });

    it('elle kaldırılan madde toplu turdan sonra kaldırılmış kalır', () => {
        mount({ a: [true, true, false] });

        items()[0].click();           // onaylı A'yı elle kaldır
        all().click();                // hepsini onayla
        expect(states()).toEqual([true, true, true]);
        all().click();                // geri al

        expect(states()).toEqual([false, true, false]);
    });

    it('elle onaylanan madde toplu turdan sonra onaylı kalır', () => {
        mount({ a: [false, false, true] });

        items()[1].click();
        all().click();
        all().click();

        expect(states()).toEqual([false, true, true]);
    });

    it('her şey onaylıyken kaldırmak hepsini kaldırır; gidiş-dönüş tutarlıdır', () => {
        mount({ a: [true, true], b: [true] });

        all().click();
        expect(states()).toEqual([false, false, false]);
        expect(box(all())).toEqual(OFF);
        expect(box(versionBox('a'))).toEqual(OFF);

        all().click();
        expect(states()).toEqual([true, true, true]);

        all().click();
        expect(states()).toEqual([false, false, false]);
    });

    it('kaldırılınca sürüm kutusuyla yapılan toplu işaret de geri alınır (kalıntı yok)', () => {
        mount({ a: [true, false], b: [false, false] });

        versionBox('b').click();      // "Bu sürümün tümünü onayla"
        expect(states()).toEqual([true, false, true, true]);

        all().click();                // hepsini onayla
        all().click();                // geri al

        expect(states()).toEqual([true, false, false, false]);
        expect(box(versionBox('b'))).toEqual(OFF);
        expect(box(versionBox('a'))).toEqual(PARTIAL);
    });
});

describe('sürüm kutusu', () => {
    it('yalnız kendi sürümünü etkiler; ana kutu yeniden hesaplanır', () => {
        mount({ a: [true, false], b: [false, false] });

        versionBox('a').click();
        expect(states()).toEqual([true, true, false, false]);
        expect(box(versionBox('a'))).toEqual(ON);
        expect(box(versionBox('b'))).toEqual(OFF);
        expect(box(all())).toEqual(PARTIAL);

        versionBox('a').click();
        expect(states()).toEqual([true, false, false, false]);
        expect(box(versionBox('a'))).toEqual(PARTIAL);

        versionBox('b').click();
        versionBox('a').click();
        expect(box(all())).toEqual(ON);
    });

    it('sürümün hepsi onaylıyken kaldırmak yalnız o sürümün onaylarını kaldırır', () => {
        mount({ a: [true, true], b: [true, false] });

        versionBox('a').click();

        expect(states()).toEqual([false, false, true, false]);
        expect(box(all())).toEqual(PARTIAL);
    });
});

describe('tek madde', () => {
    it('değişince sürüm kutusu ve ana kutu güncellenir', () => {
        mount({ a: [false, false] });

        items()[0].click();
        expect(box(versionBox('a'))).toEqual(PARTIAL);
        expect(box(all())).toEqual(PARTIAL);

        items()[1].click();
        expect(box(versionBox('a'))).toEqual(ON);
        expect(box(all())).toEqual(ON);

        items()[0].click();
        items()[1].click();
        expect(box(versionBox('a'))).toEqual(OFF);
        expect(box(all())).toEqual(OFF);
    });
});

describe('POST gövdesi', () => {
    it('toplu kutular adsız kalır; maddelere yalnız data-rn-own yazılır', () => {
        mount({ a: [true, false], b: [false] });
        const form = document.querySelector('form');
        const adlar = () => [...new FormData(form).keys()];
        const once = adlar();

        all().click();
        versionBox('a').click();

        expect(all().hasAttribute('name')).toBe(false);
        expect(versionBox('a').hasAttribute('name')).toBe(false);
        expect(form.querySelectorAll('input').length).toBe(1 + 2 + 3 * 2);
        // Gönderilen ALAN ADLARI kümesi değişmez (yalnız işaretli kutular eklenir).
        expect(adlar().filter((ad) => !once.includes(ad) && !/IsApproved$/.test(ad))).toEqual([]);
        items().forEach((cb) => {
            expect(cb.getAttribute('data-rn-own')).toMatch(/^[01]$/);
            expect(cb.getAttribute('name')).toMatch(/^Items\[\d+\]\.IsApproved$/);
        });
    });
});

describe('sayfa bağlantısı (kaynak sözleşmesi)', () => {
    const cshtml = readFileSync(path.join(pagesDir, 'Index.cshtml'), 'utf8');

    it('sayfa betiği abp-script ile yüklenir; satır içi betik kalmadı', () => {
        expect(cshtml).toMatch(/<abp-script\s+src="\/Pages\/Admin\/ReleaseNotes\/Index\.js"\s*\/>/);
        expect(cshtml).not.toMatch(/<script[\s>]/);
        expect(cshtml).not.toContain('approves.forEach');
    });

    it('betiğin aradığı kancalar işaretlemede duruyor', () => {
        expect(cshtml).toContain('id="rnSelectAll"');
        expect(cshtml).toMatch(/class="[^"]*\brn-select-version\b[^"]*"\s+data-version="@release\.Version"/);
        expect(cshtml).toMatch(/class="[^"]*\brn-approve\b[^"]*"[^>]*data-version="@release\.Version"/);
    });
});
