import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Pages/Settings/Index.js iki IIFE'dir; ikincisi Ayarlar › Projeler sekmesindeki proje
// kategorisi CRUD bölümünü yönetir (ilki sekmeli formu bulamayınca sessizce çıkar).
//
// 2026-09-28 UX denetimi, STA-17: düzenleme formunda "sıra" ve "etkin" alanı yok; Kaydet
// yine de order = listenin sonu, isActive = true gönderiyordu. Pasif bir kategoriyi
// yeniden adlandırmak onu sessizce ETKİNLEŞTİRİYOR ve listenin sonuna taşıyordu. Artık
// düzenlemede iki değer satırın data-order / data-active özniteliklerinden gelir.

const ACTIVE_ID = '11111111-1111-1111-1111-111111111111';
const PASSIVE_ID = '22222222-2222-2222-2222-222222222222';

let svc;

function row({ id, name, icon, tone, order, active }) {
    return `
        <li data-id="${id}" data-system="false" data-name="${name}" data-icon="${icon}" data-tone="${tone}"
            data-order="${order}" data-active="${active}">
            <input type="checkbox" data-cat-active${active ? ' checked' : ''}>
            <button type="button" data-cat-edit>Düzenle</button>
            <button type="button" data-cat-delete>Sil</button>
        </li>`;
}

async function load() {
    document.body.innerHTML = `
        <fieldset id="ProjectCategories" data-can-manage="true">
            <ul id="ProjectCategoryList">
                ${row({ id: ACTIVE_ID, name: 'Ar-Ge', icon: 'fa-flask', tone: 'info', order: 7, active: true })}
                ${row({ id: PASSIVE_ID, name: 'Eski tür', icon: 'fa-box', tone: 'warning', order: 3, active: false })}
            </ul>
            <input type="hidden" id="CatEditId" value="">
            <input type="text" id="CatName">
            <input type="text" id="CatIcon">
            <select id="CatTone">
                <option value="neutral">Nötr</option>
                <option value="info">Bilgi</option>
                <option value="warning">Uyarı</option>
            </select>
            <button type="button" id="CatSave">Ekle</button>
            <button type="button" id="CatCancel" hidden>Vazgeç</button>
        </fieldset>`;

    // Sözler HİÇ çözülmez: başarı dalı window.location.reload() çağırır, jsdom gezinemez.
    const pending = () => new Promise(() => {});
    svc = {
        create: vi.fn(pending),
        update: vi.fn(pending),
        delete: vi.fn(pending),
        setSystemVisibility: vi.fn(pending),
    };

    globalThis.abp = {
        localization: { getResource: () => (key) => key },
        message: { confirm: vi.fn(() => pending()) },
    };
    globalThis.apya = { platform: { projects: { projectCategory: svc } } };

    vi.resetModules();
    await import('../../../../Pages/Settings/Index.js');
}

const $ = (selector) => document.querySelector(selector);
const edit = (id) => $(`li[data-id="${id}"] [data-cat-edit]`).click();
const save = () => $('#CatSave').click();

beforeEach(load);

afterEach(() => {
    delete globalThis.abp;
    delete globalThis.apya;
    document.body.innerHTML = '';
});

describe('proje kategorisi › Kaydet', () => {
    it('pasif kategoriyi yeniden adlandırmak onu etkinleştirmez ve sırasını değiştirmez', () => {
        edit(PASSIVE_ID);
        expect($('#CatName').value).toBe('Eski tür');

        $('#CatName').value = 'Yeni ad';
        save();

        expect(svc.update).toHaveBeenCalledTimes(1);
        expect(svc.update).toHaveBeenCalledWith(PASSIVE_ID, {
            name: 'Yeni ad', icon: 'fa-box', tone: 'warning', order: 3, isActive: false,
        });
        expect(svc.create).not.toHaveBeenCalled();
    });

    it('etkin kategoride düzenleme isActive: true ve SATIRIN sırasını gönderir (listenin sonunu değil)', () => {
        edit(ACTIVE_ID);
        $('#CatTone').value = 'neutral';
        save();

        expect(svc.update).toHaveBeenCalledWith(ACTIVE_ID, {
            name: 'Ar-Ge', icon: 'fa-flask', tone: 'neutral', order: 7, isActive: true,
        });
    });

    it('yeni kategori listenin sonuna ve etkin eklenir', () => {
        $('#CatName').value = '  Saha  ';
        $('#CatIcon').value = ' fa-map ';
        $('#CatTone').value = 'info';
        save();

        expect(svc.create).toHaveBeenCalledTimes(1);
        expect(svc.create).toHaveBeenCalledWith({
            name: 'Saha', icon: 'fa-map', tone: 'info', order: 8, isActive: true,
        });
        expect(svc.update).not.toHaveBeenCalled();
    });

    it('düzenlemeden vazgeçince Kaydet yeniden "yeni kategori" olur', () => {
        edit(PASSIVE_ID);
        $('#CatCancel').click();

        $('#CatName').value = 'Saha';
        save();

        expect(svc.update).not.toHaveBeenCalled();
        expect(svc.create).toHaveBeenCalledWith(expect.objectContaining({ order: 8, isActive: true }));
    });

    it('ad boşken istek gitmez', () => {
        edit(PASSIVE_ID);
        $('#CatName').value = '   ';
        save();

        expect(svc.update).not.toHaveBeenCalled();
        expect(svc.create).not.toHaveBeenCalled();
    });
});
