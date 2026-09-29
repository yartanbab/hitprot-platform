import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';

// wwwroot/js/apya-load-state.js bir IIFE: Razor/jQuery sayfalarının satır içi
// yükleme ve hata kutusunu (apya.loadState) kurar. Çekirdek jQuery GEREKMEZ; DataTables
// yardımcıları (failTable) çalışırken window.jQuery kullanır — burada sahtesi kurulur.
// Yarış koruması bu dosyada değil, apya.latest'te (apyaLatest.test.js).

let loadState;

function parse(html) {
    return new DOMParser().parseFromString(html, 'text/html').body;
}

beforeAll(async () => {
    delete global.abp;
    await import('../../../js/apya-load-state.js');
    loadState = window.apya.loadState;
});

afterEach(() => {
    delete global.abp;
});

describe('errorHtml', () => {
    it('başlığı kaçışlar: HTML metin olarak basılır, öğe oluşmaz', () => {
        const body = parse(loadState.errorHtml('<img src=x onerror=alert(1)>', 'js-x-retry'));

        expect(body.querySelector('img')).toBeNull();
        expect(body.querySelector('strong').textContent).toBe('<img src=x onerror=alert(1)>');
    });

    it('role=alert taşır; retryClass type=button düğmeye konur', () => {
        const body = parse(loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry'));

        const box = body.querySelector('.apya-console-state');
        expect(box.getAttribute('role')).toBe('alert');

        const button = box.querySelector('button.js-x-retry');
        expect(button).not.toBeNull();
        expect(button.getAttribute('type')).toBe('button');
    });

    it('abp yokken Türkçe varsayılan metinleri basar', () => {
        const body = parse(loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry'));

        expect(body.querySelector('p').textContent).toBe('Veri alınırken bir hata oluştu.');
        expect(body.querySelector('button').textContent).toBe('Tekrar dene');
    });

    it('metinleri Platform kaynağından alır; anahtar geri dönerse varsayılana düşer', () => {
        global.abp = {
            localization: {
                getResource: () => (k) => (k === 'Common:Retry' ? 'Try again' : k)
            }
        };

        const body = parse(loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry'));

        expect(body.querySelector('button').textContent).toBe('Try again');
        expect(body.querySelector('p').textContent).toBe('Veri alınırken bir hata oluştu.');
    });
});

describe('errorHtml: hata nesnesi verilince açıklama G1 kanalından (karar 2)', () => {
    afterEach(() => {
        delete window.apya.ajaxErrors;
    });

    it('açıklama apya.ajaxErrors.message(hata, Common:FetchError) — ABP penceresi açılmadığı için nedeni kart söyler', () => {
        const message = vi.fn(() => 'Sunucuya ulaşılamadı.');
        window.apya.ajaxErrors = { message };
        const err = { status: 0 };

        const body = parse(loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry', err));

        expect(message).toHaveBeenCalledWith(err, 'Veri alınırken bir hata oluştu.');
        expect(body.querySelector('p').textContent).toBe('Sunucuya ulaşılamadı.');
    });

    it('message null dönerse (merkezi oturum penceresi açık) açıklama satırı basılmaz, düğme kalır', () => {
        window.apya.ajaxErrors = { message: () => null };

        const body = parse(loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry', { apyaCentral: true }));

        expect(body.querySelector('p')).toBeNull();
        expect(body.querySelector('button.js-x-retry')).not.toBeNull();
    });

    it('sunucu metni kaçışlanır', () => {
        window.apya.ajaxErrors = { message: () => '<b>kalın</b>' };

        const body = parse(loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry', {}));

        expect(body.querySelector('b')).toBeNull();
        expect(body.querySelector('p').textContent).toBe('<b>kalın</b>');
    });

    it('G1 kanalı yokken Common:FetchError varsayılanına düşer', () => {
        const body = parse(loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry', { status: 500 }));

        expect(body.querySelector('p').textContent).toBe('Veri alınırken bir hata oluştu.');
    });

    it('kanonik Tekrar dene düğmesi: btn-outline-primary + fa-rotate-right (karar 10)', () => {
        const button = parse(loadState.errorHtml('x', 'js-x-retry')).querySelector('button');

        expect(button.className).toBe('btn btn-sm btn-outline-primary js-x-retry');
        expect(button.querySelector('i.fa.fa-rotate-right.me-1').getAttribute('aria-hidden')).toBe('true');
    });
});

/* ─────────────── DataTables: failTable / tableFailed / Tekrar dene ─────────────── */

// Sahte jQuery: yalnız apya-load-state.js'in kullandığı yüzey — $(tablo).on('draw.dt', fn),
// $.fn.dataTable.isDataTable, $(tablo).DataTable().ajax.reload.
function installFakeJquery() {
    const handlers = [];
    const tables = new Set();
    const reload = vi.fn();
    const $ = (el) => ({
        on(evt, fn) { handlers.push({ el, evt, fn }); return this; },
        DataTable() { return { ajax: { reload } }; }
    });
    $.fn = { dataTable: { isDataTable: (t) => tables.has(t) } };
    window.jQuery = $;
    return { handlers, tables, reload };
}

// DataTables'ın boş tablo çizimi: tbody'de tek td.dt-empty (sLoadingRecords/sEmptyTable);
// kap (nTableWrapper) bilgi satırını (.dt-info) taşır.
function mountTable() {
    document.body.innerHTML = '<div class="dt-container" id="w">'
        + '<table id="t"><tbody><tr><td class="dt-empty" colspan="3">Tabloda veri yok</td></tr></tbody></table>'
        + '<div class="dt-info" role="status">0 kayıttan 0 ile 0 arası gösteriliyor.</div></div>'
        + '<button type="button" class="js-apya-table-retry" id="outside">x</button>'
        + '<input id="search" />';
    const table = document.getElementById('t');
    return { nTable: table, nTBody: table.querySelector('tbody'), nTableWrapper: document.getElementById('w') };
}

describe('failTable', () => {
    let fake;

    beforeEach(() => {
        fake = installFakeJquery();
    });

    afterEach(() => {
        delete window.jQuery;
        delete window.apya.ajaxErrors;
        document.body.innerHTML = '';
    });

    // DataTables callback'i gibi: settings.json'u yanıta eşitler, sonra draw olayını tetikler.
    function drawWith(settings, json) {
        settings.json = json;
        fake.handlers.filter((h) => h.el === settings.nTable).forEach((h) => h.fn());
    }

    it('DataTables callback\'ini boş veri + işaretle çağırır; error/sError KOYMAZ (errMode alert açmasın)', () => {
        const settings = mountTable();
        const callback = vi.fn();
        const err = { status: 500 };

        loadState.failTable(settings, callback, err);

        expect(callback).toHaveBeenCalledTimes(1);
        const json = callback.mock.calls[0][0];
        expect(json).toMatchObject({ data: [], recordsTotal: 0, recordsFiltered: 0, apyaLoadFailed: true });
        expect(json.apyaLoadError).toBe(err);
        expect(json).not.toHaveProperty('error');
        expect(json).not.toHaveProperty('sError');
    });

    it('draw kancası tablo başına BİR kez kaydolur', () => {
        const settings = mountTable();

        loadState.failTable(settings, vi.fn());
        loadState.failTable(settings, vi.fn());

        expect(fake.handlers.filter((h) => h.el === settings.nTable && h.evt === 'draw.dt')).toHaveLength(1);
    });

    it('hata yanıtında boş hücreye role=alert kart + tablo Tekrar dene düğmesi basar', () => {
        const settings = mountTable();
        window.apya.ajaxErrors = { message: () => 'Sunucu şu an yanıt vermiyor.' };
        const callback = (json) => drawWith(settings, json);

        loadState.failTable(settings, callback, { status: 503 });

        const cell = settings.nTBody.querySelector('td.dt-empty');
        const box = cell.querySelector('.apya-console-state');
        expect(box.getAttribute('role')).toBe('alert');
        expect(box.querySelector('strong').textContent).toBe('Liste yüklenemedi.');
        expect(box.querySelector('p').textContent).toBe('Sunucu şu an yanıt vermiyor.');
        expect(box.querySelector('button.js-apya-table-retry')).not.toBeNull();
    });

    it('istemci tarafı yeniden çizimde (sıralama/arama) kart korunur; başarılı yanıt gelince hücreye dokunmaz', () => {
        const settings = mountTable();
        loadState.failTable(settings, (json) => drawWith(settings, json));

        // Sıralama: aynı json, yeni boş hücre.
        settings.nTBody.innerHTML = '<tr><td class="dt-empty">Tabloda veri yok</td></tr>';
        drawWith(settings, settings.json);
        expect(settings.nTBody.querySelector('.apya-console-state')).not.toBeNull();

        // Başarılı yanıt: işaret düşer.
        settings.nTBody.innerHTML = '<tr><td class="dt-empty">Tabloda veri yok</td></tr>';
        drawWith(settings, { data: [], recordsTotal: 0, recordsFiltered: 0 });
        expect(settings.nTBody.querySelector('.apya-console-state')).toBeNull();
        expect(settings.nTBody.querySelector('td.dt-empty').textContent).toBe('Tabloda veri yok');
    });

    it('settings ya da callback yoksa hiçbir şey yapmaz', () => {
        expect(() => loadState.failTable(null, vi.fn())).not.toThrow();
        expect(() => loadState.failTable(mountTable(), null)).not.toThrow();
        expect(fake.handlers).toHaveLength(0);
    });

    it('başlık tablonun data-load-failed özniteliğinden gelir (sayfaya özgü), yoksa genel başlık', () => {
        const settings = mountTable();
        settings.nTable.setAttribute('data-load-failed', 'Görevler yüklenemedi.');

        loadState.failTable(settings, (json) => drawWith(settings, json));
        expect(settings.nTBody.querySelector('.apya-console-state strong').textContent).toBe('Görevler yüklenemedi.');

        settings.nTable.removeAttribute('data-load-failed');
        settings.nTBody.innerHTML = '<tr><td class="dt-empty">Tabloda veri yok</td></tr>';
        drawWith(settings, settings.json);
        expect(settings.nTBody.querySelector('.apya-console-state strong').textContent).toBe('Liste yüklenemedi.');
    });

    it('kart dururken bilgi satırı ("0 kayıttan 0 ile 0 arası") boşalır; başarılı çizimde DataTables\'ın yazdığına dokunulmaz', () => {
        const settings = mountTable();
        const info = settings.nTableWrapper.querySelector('.dt-info');

        loadState.failTable(settings, (json) => drawWith(settings, json));
        expect(info.textContent).toBe('');

        // Başarılı yanıt: DataTables bilgi satırını drawCallback'te (olaydan önce) yeniden yazar.
        info.textContent = '12 kayıttan 1 ile 10 arası gösteriliyor.';
        drawWith(settings, { data: [], recordsTotal: 12, recordsFiltered: 12 });
        expect(info.textContent).toBe('12 kayıttan 1 ile 10 arası gösteriliyor.');
    });
});

describe('tableFailed', () => {
    it('DataTables API\'si (ajax.json()) ve settings (json) kabul eder', () => {
        const failed = { apyaLoadFailed: true };
        const ok = { data: [] };

        expect(loadState.tableFailed({ ajax: { json: () => failed } })).toBe(true);
        expect(loadState.tableFailed({ ajax: { json: () => ok } })).toBe(false);
        expect(loadState.tableFailed({ ajax: function () { }, json: failed })).toBe(true);
        expect(loadState.tableFailed({ json: undefined })).toBe(false);
        expect(loadState.tableFailed(null)).toBe(false);
    });
});

describe('tablo kartının Tekrar dene düğmesi', () => {
    let fake;

    beforeEach(() => {
        fake = installFakeJquery();
    });

    afterEach(() => {
        delete window.jQuery;
        document.body.innerHTML = '';
    });

    it('tablo içinde tıklanınca düğme meşgul olur (aria-disabled + aria-busy + dönen ikon, disabled DEĞİL) ve DataTables sayfa konumunu koruyarak yeniden yüklenir', () => {
        const settings = mountTable();
        fake.tables.add(settings.nTable);
        settings.nTBody.querySelector('td.dt-empty').innerHTML = loadState.errorHtml('Liste yüklenemedi.', 'js-apya-table-retry');
        const button = settings.nTBody.querySelector('.js-apya-table-retry');

        button.querySelector('i').click();

        expect(button.getAttribute('aria-disabled')).toBe('true');
        expect(button.getAttribute('aria-busy')).toBe('true');
        expect(button.querySelector('i').classList.contains('fa-spin')).toBe(true);
        // disabled olsaydı Chromium odağı body'ye atardı (G2b ölçümü).
        expect(button.disabled).toBe(false);
        expect(fake.reload).toHaveBeenCalledWith(null, false);
    });

    it('yeniden deneme sürerken ikinci tıklama yutulur (tek istek)', () => {
        const settings = mountTable();
        fake.tables.add(settings.nTable);
        settings.nTBody.querySelector('td.dt-empty').innerHTML = loadState.errorHtml('x', 'js-apya-table-retry');
        const button = settings.nTBody.querySelector('.js-apya-table-retry');

        button.click();
        button.click();

        expect(fake.reload).toHaveBeenCalledTimes(1);
    });

    it('DataTable olmayan tablo ya da tablo dışındaki aynı sınıf tıklanınca hiçbir şey olmaz', () => {
        const settings = mountTable();
        settings.nTBody.querySelector('td.dt-empty').innerHTML = loadState.errorHtml('x', 'js-apya-table-retry');

        settings.nTBody.querySelector('.js-apya-table-retry').click();
        document.getElementById('outside').click();

        expect(fake.reload).not.toHaveBeenCalled();
        expect(settings.nTBody.querySelector('.js-apya-table-retry').getAttribute('aria-disabled')).toBeNull();
        expect(document.getElementById('outside').getAttribute('aria-disabled')).toBeNull();
    });
});

/* Odak: "Tekrar dene" yeniden çizimde sökülür; klavye kullanıcısı sayfa başına düşmesin. */
describe('tablo kartının Tekrar dene odağı', () => {
    let fake;

    beforeEach(() => {
        fake = installFakeJquery();
    });

    afterEach(() => {
        delete window.jQuery;
        document.body.innerHTML = '';
    });

    // İlk hata: kart basılı, tablo DataTable; düğmeye odaklanıp basılır.
    function failThenRetry({ focusButton = true } = {}) {
        const settings = mountTable();
        fake.tables.add(settings.nTable);
        const draw = (json) => {
            settings.json = json;
            fake.handlers.filter((h) => h.el === settings.nTable).forEach((h) => h.fn());
        };
        loadState.failTable(settings, draw);
        const button = settings.nTBody.querySelector('.js-apya-table-retry');
        if (focusButton) { button.focus(); }
        button.click();
        return { settings, draw, button };
    }

    it('yine düşerse odak yeni kartın Tekrar dene düğmesine verilir', () => {
        const { settings, draw, button } = failThenRetry();
        expect(document.activeElement).toBe(button);

        // DataTables yeni boş satırı basar (eski düğme sökülür), ardından failTable yeniden çizer.
        settings.nTBody.innerHTML = '<tr><td class="dt-empty">Tabloda veri yok</td></tr>';
        loadState.failTable(settings, draw);

        const again = settings.nTBody.querySelector('.js-apya-table-retry');
        expect(again).not.toBe(button);
        expect(document.activeElement).toBe(again);
        expect(again.getAttribute('aria-disabled')).toBeNull();
    });

    it('gelirse odak tablonun kendisine (tabindex=-1) verilir', () => {
        const { settings, draw } = failThenRetry();

        settings.nTBody.innerHTML = '<tr><td>Satır</td></tr>';
        draw({ data: [{}], recordsTotal: 1, recordsFiltered: 1 });

        expect(settings.nTable.getAttribute('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(settings.nTable);
    });

    it('düğme odaklı değilken basıldıysa (fare, Safari) odak taşınmaz', () => {
        const { settings, draw } = failThenRetry({ focusButton: false });

        settings.nTBody.innerHTML = '<tr><td>Satır</td></tr>';
        draw({ data: [{}], recordsTotal: 1, recordsFiltered: 1 });

        expect(settings.nTable.hasAttribute('tabindex')).toBe(false);
        expect(document.activeElement).toBe(document.body);
    });

    it('kullanıcı arada başka alana geçtiyse (arama kutusu) odak çalınmaz', () => {
        const { settings, draw } = failThenRetry();
        const search = document.getElementById('search');
        search.focus();

        settings.nTBody.innerHTML = '<tr><td>Satır</td></tr>';
        draw({ data: [{}], recordsTotal: 1, recordsFiltered: 1 });

        expect(document.activeElement).toBe(search);
    });
});

describe('loadingHtml', () => {
    it('role=status taşır ve mesajı kaçışlar', () => {
        const body = parse(loadState.loadingHtml('<b>Olay</b> yükleniyor…'));

        const box = body.querySelector('.apya-console-state');
        expect(box.getAttribute('role')).toBe('status');
        expect(body.querySelector('b')).toBeNull();
        expect(box.querySelector('p').textContent).toBe('<b>Olay</b> yükleniyor…');
    });
});
