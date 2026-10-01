import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// wwwroot/js/apya-confirm.js bir IIFE: window.apya.confirm'ü ve belge düzeyindeki
// [data-confirm] delegesini kurar. jQuery kullanmaz; abp (SweetAlert yapılandırması,
// kaçış, yerelleştirme), Swal ve apya.session ÇAĞRI ANINDA okunur — dosya bir kez
// yüklenir, sahteler her testte yeniden kurulur.
// SweetAlert sahtesi gerçeğiyle (11.26) aynı sırayı izler: willOpen eşzamanlı, didOpen bir
// sonraki görevde; kapanış willClose → didDestroy; başka bir Swal.fire tarafından ezilme
// YALNIZ didDestroy (willClose yok) ve { isDismissed: true }.

let dialogs;

const TYPE_HINT = 'Onaylamak için aşağıya SİL yazın.';
const TYPE_MISMATCH = 'Onaylamak için SİL yazmalısınız.';

function installAbp({ resource, culture = 'tr' } = {}) {
    window.abp = {
        localization: {
            currentCulture: { name: culture },
            getResource: () => resource || ((key) => key)
        },
        // abp.js ile aynı
        utils: { htmlEscape: (html) => html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') },
        // abp-sweetalert2.js (configurationInitialized sonrası) + ajax-error-detail.js yalıtımı
        libs: {
            sweetAlert: {
                config: {
                    default: {
                        confirmButtonText: 'Tamam',
                        cancelButtonText: 'Vazgeç',
                        buttonsStyling: false,
                        customClass: { confirmButton: 'btn btn-primary', cancelButton: 'btn btn-outline-primary mx-2' },
                        willOpen: vi.fn(),
                        keydownListenerCapture: true
                    },
                    confirm: { icon: 'warning', title: 'Emin misiniz?', confirmButtonText: 'Evet', showCancelButton: true, reverseButtons: true }
                }
            }
        }
    };
}

function installSwal() {
    dialogs = [];
    const current = () => dialogs.filter((d) => !d.closed).pop();
    window.Swal = {
        fire: vi.fn((opts) => {
            const previous = current();
            if (previous) { previous.replace(); }
            const container = document.createElement('div');
            container.className = 'swal2-container';
            const popup = document.createElement('div');
            popup.className = 'swal2-popup';
            const input = opts.input ? document.createElement('input') : null;
            const cancelButton = document.createElement('button');
            const confirmButton = document.createElement('button');
            [input, cancelButton, confirmButton].forEach((el) => { if (el) { popup.appendChild(el); } });
            container.appendChild(popup);
            document.body.appendChild(container);
            let resolve;
            let reject;
            const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
            const finish = (result) => {
                dialog.closed = true;
                container.remove();
                if (opts.didDestroy) { opts.didDestroy(); }
                resolve(result);
            };
            const dialog = {
                opts, popup, input, cancelButton, confirmButton, closed: false,
                close(result) {
                    if (dialog.closed) { return; }
                    if (opts.willClose) { opts.willClose(popup); }
                    finish(result);
                },
                replace() { if (!dialog.closed) { finish({ isDismissed: true }); } },
                fail(error) {
                    dialog.closed = true;
                    container.remove();
                    if (opts.didDestroy) { opts.didDestroy(); }
                    reject(error);
                }
            };
            dialogs.push(dialog);
            if (opts.willOpen) { opts.willOpen(popup); }
            setTimeout(() => { if (opts.didOpen) { opts.didOpen(popup); } });
            return promise;
        }),
        getInput: () => (current() ? current().input : null),
        getCancelButton: () => (current() ? current().cancelButton : null),
        getConfirmButton: () => (current() ? current().confirmButton : null),
        showValidationMessage: vi.fn()
    };
}

const flush = async () => {
    for (let i = 0; i < 5; i++) { await new Promise((r) => setTimeout(r, 0)); }
};

const last = () => dialogs[dialogs.length - 1];

function focusOutside() {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    // jsdom focus() ile birlikte focusin'i de üretir.
    outside.focus();
    return outside;
}

beforeAll(async () => {
    installAbp();
    installSwal();
    await import('../../../js/apya-confirm.js');
});

beforeEach(() => {
    document.body.innerHTML = '';
    installAbp();
    installSwal();
    delete window.apya.session;
});

afterEach(() => {
    dialogs.filter((d) => !d.closed).forEach((d) => d.close({ isDismissed: true }));
});

describe('apya.confirm: görünüm abp.message.confirm ile aynı kaynaktan', () => {
    it('ABP confirm yapılandırmasını kopyalar; ABP\'nin nesnelerine dokunmaz', () => {
        const config = abp.libs.sweetAlert.config;
        const before = JSON.stringify(config);

        apya.confirm({ message: 'Kalem silinsin mi?', danger: true, title: 'Kalem', typeToConfirm: true });

        expect(last().opts).toMatchObject({
            icon: 'warning',
            showCancelButton: true,
            reverseButtons: true,
            buttonsStyling: false,
            keydownListenerCapture: true,
            cancelButtonText: 'Vazgeç'
        });
        // Yalıtım (Radix / Bootstrap modalı üstünde tıklanabilirlik) config.default'tan gelir.
        expect(last().opts.willOpen).toBe(config.default.willOpen);
        expect(JSON.stringify(config)).toBe(before);
        expect(config.default.customClass.confirmButton).toBe('btn btn-primary');
        expect(config.confirm.title).toBe('Emin misiniz?');
    });

    it('düz onay: başlık "Emin misiniz?", düğmeler Vazgeç / Evet, odak ayarı yok', () => {
        apya.confirm({ message: 'Kural uygulansın mı?' });

        expect(last().opts.title).toBe('Emin misiniz?');
        expect(last().opts.confirmButtonText).toBe('Evet');
        expect(last().opts.customClass.confirmButton).toBe('btn btn-primary');
        expect(last().opts.focusCancel).toBeUndefined();
        expect(last().opts.input).toBeUndefined();
    });

    it('message kaçışlanır, satır sonu <br> olur; html verilirse aynen basılır', () => {
        apya.confirm({ message: '<img src=x onerror=alert(1)> "A"\nikinci satır' });
        expect(last().opts.html).toBe('&lt;img src=x onerror=alert(1)&gt; &quot;A&quot;<br>ikinci satır');
        expect(last().opts.text).toBeUndefined();

        apya.confirm({ message: 'yok sayılır', html: '<strong>3 kolon</strong>' });
        expect(last().opts.html).toBe('<strong>3 kolon</strong>');
    });

    it('title düz metin basılır (titleText); ABP\'nin HTML başlığı düşer', () => {
        apya.confirm({ message: 'm', title: '<b>Ayşe</b> ekipten çıkarılsın mı?' });

        expect(last().opts.titleText).toBe('<b>Ayşe</b> ekipten çıkarılsın mı?');
        expect('title' in last().opts).toBe(false);
    });

    it('danger: kırmızı onay düğmesi, başlangıç odağı Vazgeç\'te; Vazgeç sınıfı korunur', () => {
        apya.confirm({ message: 'm', danger: true });

        expect(last().opts.customClass).toEqual({ confirmButton: 'btn btn-danger', cancelButton: 'btn btn-outline-primary mx-2' });
        expect(last().opts.focusCancel).toBe(true);
    });

    it('confirmText / cancelText düğme metinlerini ezer', () => {
        apya.confirm({ message: 'm', confirmText: 'Değişiklikleri at', cancelText: 'Düzenlemeye devam et' });

        expect(last().opts.confirmButtonText).toBe('Değişiklikleri at');
        expect(last().opts.cancelButtonText).toBe('Düzenlemeye devam et');
    });

    it('dize kısayolu: apya.confirm("mesaj")', async () => {
        const result = apya.confirm('Kaynak silinsin mi?');
        expect(last().opts.html).toBe('Kaynak silinsin mi?');

        last().close({ isConfirmed: true, value: true });
        expect(await result).toBe(true);
    });
});

describe('apya.confirm: sonuç yalnız boolean, asla reddetmez', () => {
    it('onay düğmesi → true', async () => {
        const result = apya.confirm({ message: 'm' });
        last().close({ isConfirmed: true, value: true });

        expect(await result).toBe(true);
    });

    it('Vazgeç / Esc / dış tık → false', async () => {
        const result = apya.confirm({ message: 'm' });
        last().close({ isConfirmed: false, isDismissed: true, dismiss: 'esc' });

        expect(await result).toBe(false);
    });

    it('başka bir pencere tarafından ezilme → false (eylem çalışmaz)', async () => {
        const result = apya.confirm({ message: 'm' });
        Swal.fire({ titleText: 'Oturumunuz sona erdi' });

        expect(await result).toBe(false);
    });

    it('SweetAlert reddederse → false', async () => {
        const result = apya.confirm({ message: 'm' });
        last().fail(new Error('swal'));

        expect(await result).toBe(false);
    });

    it('SweetAlert yoksa false; tarayıcının yerel penceresine düşülmez', async () => {
        const native = vi.spyOn(window, 'confirm').mockReturnValue(true);
        delete window.Swal;

        expect(await apya.confirm({ message: 'm' })).toBe(false);
        expect(native).not.toHaveBeenCalled();
    });

    it('oturum penceresi açıkken açılmaz, false döner (merkezi pencere ezilmez)', async () => {
        window.apya.session = { isDialogOpen: () => true };

        expect(await apya.confirm({ message: 'm', danger: true })).toBe(false);
        expect(Swal.fire).not.toHaveBeenCalled();

        window.apya.session = { isDialogOpen: () => false };
        apya.confirm({ message: 'm' });
        expect(Swal.fire).toHaveBeenCalledTimes(1);
    });
});

describe('apya.confirm: yazarak onay', () => {
    it('typeToConfirm: true → sözcük SİL; kutu, etiket ve yer tutucu; odak kutuda', () => {
        apya.confirm({ message: 'm', danger: true, typeToConfirm: true });
        const { opts } = last();

        expect(opts.input).toBe('text');
        expect(opts.inputLabel).toBe(TYPE_HINT);
        expect(opts.inputPlaceholder).toBe('SİL');
        expect(opts.inputAttributes).toEqual({ autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
        // danger odağı Vazgeç'e çekerdi; yazarak onayda odak kutuda kalır (inputAutoFocus).
        expect(opts.focusCancel).toBe(false);
        expect(opts.customClass.confirmButton).toBe('btn btn-danger');
    });

    it('kırpılmış ve kültüre göre büyük/küçük harf duyarsız: "sil" kabul, noktasız "SIL" ret', () => {
        apya.confirm({ message: 'm', typeToConfirm: true });
        const { preConfirm } = last().opts;

        expect(preConfirm('SİL')).toBe(true);
        expect(preConfirm('sil')).toBe(true);
        expect(preConfirm(' SİL ')).toBe(true);
        expect(Swal.showValidationMessage).not.toHaveBeenCalled();

        expect(preConfirm('SIL')).toBe(false);
        expect(preConfirm('sıl')).toBe(false);
        expect(preConfirm('')).toBe(false);
        expect(preConfirm(undefined)).toBe(false);
        // Pencere açık kalır (preConfirm false) ve doğrulama satırı basılır.
        expect(Swal.showValidationMessage).toHaveBeenCalledTimes(4);
        expect(Swal.showValidationMessage).toHaveBeenLastCalledWith(TYPE_MISMATCH);
    });

    it('typeToConfirm: "metin" → o metin beklenir; doğrulama satırı kaçışlanır', () => {
        apya.confirm({ message: 'm', typeToConfirm: 'PRJ-<1>' });
        const { opts } = last();

        expect(opts.inputPlaceholder).toBe('PRJ-<1>');
        expect(opts.inputLabel).toBe('Onaylamak için aşağıya PRJ-<1> yazın.');
        expect(opts.preConfirm('prj-<1>')).toBe(true);
        expect(opts.preConfirm('SİL')).toBe(false);
        expect(Swal.showValidationMessage).toHaveBeenCalledWith('Onaylamak için PRJ-&lt;1&gt; yazmalısınız.');
    });

    it('metinler Platform kaynağından: İngilizce arayüzde DELETE', () => {
        const en = { 'Confirm:TypeWord': 'DELETE', 'Confirm:TypeHint': 'Type {0} below to confirm.', 'Confirm:TypeMismatch': 'You must type {0} to confirm.' };
        installAbp({ culture: 'en', resource: (key, arg) => (en[key] ? en[key].replace('{0}', arg) : key) });

        apya.confirm({ message: 'm', typeToConfirm: true });
        const { opts } = last();

        expect(opts.inputPlaceholder).toBe('DELETE');
        expect(opts.inputLabel).toBe('Type DELETE below to confirm.');
        expect(opts.preConfirm('delete')).toBe(true);
        expect(opts.preConfirm('SİL')).toBe(false);
        expect(Swal.showValidationMessage).toHaveBeenLastCalledWith('You must type DELETE to confirm.');
    });

    it('doğru sözcükle onay → true', async () => {
        const result = apya.confirm({ message: 'm', typeToConfirm: true });
        last().close({ isConfirmed: true, value: last().opts.preConfirm('sil') });

        expect(await result).toBe(true);
    });
});

describe('apya.confirm: odak bekçisi (Radix kapanırken odağı tetikleyiciye geri verir)', () => {
    it('yazarak onayda dışarı düşen odak kutuya geri alınır', async () => {
        apya.confirm({ message: 'm', danger: true, typeToConfirm: true });
        await flush();

        focusOutside();

        expect(document.activeElement).toBe(last().input);
    });

    it('danger\'da Vazgeç\'e, düz onayda onay düğmesine geri alınır', async () => {
        apya.confirm({ message: 'm', danger: true });
        await flush();
        focusOutside();
        expect(document.activeElement).toBe(last().cancelButton);
        last().close({ isDismissed: true });

        apya.confirm({ message: 'm' });
        await flush();
        focusOutside();
        expect(document.activeElement).toBe(last().confirmButton);
    });

    it('pencere içindeki odak değişimine karışmaz', async () => {
        apya.confirm({ message: 'm', danger: true, typeToConfirm: true });
        await flush();
        const { input, confirmButton } = last();
        const stolen = vi.spyOn(input, 'focus');

        confirmButton.focus();

        expect(stolen).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(confirmButton);
    });

    it('willClose\'da sökülür: SweetAlert\'in kapanışta odağı tetikleyiciye iadesi geri çekilmez', async () => {
        apya.confirm({ message: 'm', danger: true });
        await flush();
        const { opts, popup, cancelButton } = last();

        opts.willClose(popup);
        const outside = focusOutside();

        expect(document.activeElement).toBe(outside);
        expect(document.activeElement).not.toBe(cancelButton);
    });

    it('didDestroy\'da da sökülür (pencere ezildi: willClose gelmez)', async () => {
        apya.confirm({ message: 'm' });
        await flush();

        Swal.fire({ titleText: 'Oturumunuz sona erdi' });
        const outside = focusOutside();

        expect(document.activeElement).toBe(outside);
    });

    it('pencere didOpen\'dan ÖNCE ezilirse bekçi hiç kurulmaz (yeni pencerenin odağını çalmaz)', async () => {
        const added = vi.spyOn(document, 'addEventListener');
        apya.confirm({ message: 'm' });
        Swal.fire({ titleText: 'Oturumunuz sona erdi' });
        await flush();

        expect(added.mock.calls.filter((args) => args[0] === 'focusin')).toHaveLength(0);
        const outside = focusOutside();
        expect(document.activeElement).toBe(outside);
    });
});

describe('[data-confirm] genel delegesi', () => {
    function form(inner) {
        document.body.innerHTML = `<form id="f" action="/x" method="post">${inner}</form>`;
        const el = document.getElementById('f');
        const submits = [];
        // jsdom gezinmeyi uygulamaz; gönderim kaydedilip durdurulur.
        el.addEventListener('submit', (e) => { submits.push(e.submitter); e.preventDefault(); });
        return { el, submits };
    }

    it('submit düğmesi: ilk tıklamada gönderim YOK, pencere data-confirm metniyle açılır', () => {
        const { el, submits } = form('<button type="submit" id="b" data-confirm="Kalem silinsin mi?">Sil</button>');

        el.querySelector('#b').click();

        expect(submits).toHaveLength(0);
        expect(Swal.fire).toHaveBeenCalledTimes(1);
        expect(last().opts.html).toBe('Kalem silinsin mi?');
    });

    it('onayda AYNI tıklama yeniden oynatılır: gönderim tam bir kez ve gönderen düğme korunur (formaction)', async () => {
        const { el, submits } = form(
            '<button type="submit" id="save">Kaydet</button>' +
            '<button type="submit" id="reset" formaction="/x?handler=Reset" data-confirm="Kota sayacı sıfırlansın mı?">Kotayı Sıfırla</button>');
        const reset = el.querySelector('#reset');

        reset.click();
        last().close({ isConfirmed: true, value: true });
        await flush();

        expect(submits).toHaveLength(1);
        expect(submits[0]).toBe(reset);
        // İkinci pencere açılmadı: yeniden oynatılan tıklama dokunulmadan geçti.
        expect(Swal.fire).toHaveBeenCalledTimes(1);
    });

    it('Vazgeç\'te gönderim hiç gelmez', async () => {
        const { el, submits } = form('<button type="submit" id="b" data-confirm="Silinsin mi?">Sil</button>');

        el.querySelector('#b').click();
        last().close({ isDismissed: true, dismiss: 'cancel' });
        await flush();

        expect(submits).toHaveLength(0);
    });

    it('data-confirm-title / data-confirm-yes / data-confirm-danger seçeneklere taşınır', () => {
        form('<button type="submit" id="b" data-confirm="Fatura iptal edilecek." data-confirm-title="Fatura iptal edilsin mi?" data-confirm-yes="Faturayı iptal et" data-confirm-danger>İptal</button>');

        document.getElementById('b').click();

        expect(last().opts).toMatchObject({
            html: 'Fatura iptal edilecek.',
            titleText: 'Fatura iptal edilsin mi?',
            confirmButtonText: 'Faturayı iptal et',
            focusCancel: true
        });
        expect(last().opts.customClass.confirmButton).toBe('btn btn-danger');
    });

    it('öznitelikler yokken ABP varsayılanları: başlık "Emin misiniz?", düğme "Evet", kırmızı değil', () => {
        form('<button type="submit" id="b" data-confirm="Yeniden hesaplansın mı?">Hesapla</button>');

        document.getElementById('b').click();

        expect(last().opts.title).toBe('Emin misiniz?');
        expect(last().opts.confirmButtonText).toBe('Evet');
        expect(last().opts.customClass.confirmButton).toBe('btn btn-primary');
    });

    it.each([
        ['<a href="#hedef" id="t" data-confirm="Çıkılsın mı?">Git</a>'],
        ['<button type="button" id="t" data-confirm="Uygulansın mı?"><i></i><span>Uygula</span></button>']
    ])('bağlantı / type=button: öğenin kendi dinleyicisi onaydan ÖNCE çalışmaz, sonra tam bir kez çalışır (%s)', async (html) => {
        document.body.innerHTML = html;
        const target = document.getElementById('t');
        const own = vi.fn((e) => e.preventDefault());
        const bubbled = vi.fn();
        target.addEventListener('click', own);
        document.addEventListener('click', bubbled);

        // İç öğeye tıklama da (ikon / metin) düğmeyi bulur.
        (target.querySelector('span') || target).click();
        expect(own).not.toHaveBeenCalled();
        expect(bubbled).not.toHaveBeenCalled();

        last().close({ isConfirmed: true, value: true });
        await flush();

        expect(own).toHaveBeenCalledTimes(1);
        expect(bubbled).toHaveBeenCalledTimes(1);
        document.removeEventListener('click', bubbled);
    });

    it.each([
        ['<button type="submit" id="b" data-confirm="x" disabled>Sil</button>'],
        ['<button type="submit" id="b" data-confirm="x" aria-disabled="true">Sil</button>'],
        ['<button type="submit" id="b" data-confirm="">Sil</button>'],
        ['<button type="submit" id="b">Sil</button>']
    ])('delege karışmaz: %s', (html) => {
        const { el } = form(html);
        const own = vi.fn();
        el.querySelector('#b').addEventListener('click', own);

        el.querySelector('#b').click();

        expect(Swal.fire).not.toHaveBeenCalled();
        // disabled düğmede tarayıcı tıklamayı hiç üretmez; diğerlerinde olağan akış sürer.
        expect(own).toHaveBeenCalledTimes(html.includes(' disabled') ? 0 : 1);
    });

    it('betik yüklendikten SONRA eklenen öğe de yakalanır (AJAX modal içeriği)', () => {
        const { el, submits } = form('');
        el.insertAdjacentHTML('beforeend', '<button type="submit" id="late" data-confirm="Dilim silinsin mi?">Sil</button>');

        el.querySelector('#late').click();

        expect(submits).toHaveLength(0);
        expect(last().opts.html).toBe('Dilim silinsin mi?');
    });

    it('işaret tek kullanımlık: aynı öğeye ikinci tıklama yeniden onay ister', async () => {
        const { el, submits } = form('<button type="submit" id="b" data-confirm="Silinsin mi?">Sil</button>');
        const button = el.querySelector('#b');

        button.click();
        last().close({ isConfirmed: true, value: true });
        await flush();
        expect(submits).toHaveLength(1);

        button.click();
        expect(submits).toHaveLength(1);
        expect(Swal.fire).toHaveBeenCalledTimes(2);
    });

    it('oturum penceresi açıkken tıklama yutulur: eylem çalışmaz, pencere açılmaz', async () => {
        window.apya.session = { isDialogOpen: () => true };
        const { el, submits } = form('<button type="submit" id="b" data-confirm="Silinsin mi?">Sil</button>');

        el.querySelector('#b').click();
        await flush();

        expect(submits).toHaveLength(0);
        expect(Swal.fire).not.toHaveBeenCalled();
    });
});

/* Kablolama (kaynak metni pin — errorChannel.wiring deseni): tarayıcıda görünen sözleşme. */
describe('kablolama: metinler, global demet, koyu tema', () => {
    const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
    const shared = path.resolve(web, '..', 'Apya.Platform.Domain.Shared', 'Localization', 'Platform');
    const source = readFileSync(path.join(web, 'wwwroot', 'js', 'apya-confirm.js'), 'utf8');
    const trRaw = readFileSync(path.join(shared, 'tr.json'), 'utf8');
    const enRaw = readFileSync(path.join(shared, 'en.json'), 'utf8');
    const tr = JSON.parse(trRaw).texts;
    const en = JSON.parse(enRaw).texts;
    const count = (text, needle) => text.split(needle).length - 1;

    const pairs = [];
    const re = /\btext\(\s*'(Confirm:[^']+)'\s*,\s*'([^']*)'/g;
    let m;
    while ((m = re.exec(source))) { pairs.push([m[1], m[2]]); }

    it('apya-confirm.js üç metni Platform kaynağından okur', () => {
        expect(pairs.map((p) => p[0]).sort()).toEqual(['Confirm:TypeHint', 'Confirm:TypeMismatch', 'Confirm:TypeWord']);
    });

    it.each(pairs)('%s: JS yedeği tr.json ile aynı, en.json\'da karşılığı var', (key, fallback) => {
        expect(tr[key]).toBe(fallback);
        expect(en[key]).toBeTruthy();
        expect(en[key]).not.toBe(key);
    });

    it.each(['Confirm:TypeWord', 'Confirm:TypeHint', 'Confirm:TypeMismatch', 'Confirm:Yes:Delete', 'Confirm:Yes:Remove'])(
        '%s: her dosyada tam bir kez (yinelenen anahtar sessizce ezer)', (key) => {
            expect(count(trRaw, `"${key}":`)).toBe(1);
            expect(count(enRaw, `"${key}":`)).toBe(1);
        });

    it('yazılacak sözcük: tr SİL, en DELETE', () => {
        expect(tr['Confirm:TypeWord']).toBe('SİL');
        expect(en['Confirm:TypeWord']).toBe('DELETE');
    });

    it('tarayıcının yerel onay penceresine düşülmez', () => {
        expect(source).not.toMatch(/window\.confirm\b/);
        expect(source).not.toMatch(/(^|[^.\w])confirm\(/m);
    });

    it('global demette ajax-error-detail.js ve kota sarmalayıcısından SONRA', () => {
        const module = readFileSync(path.join(web, 'PlatformWebModule.cs'), 'utf8');
        const at = (file) => module.indexOf(`bundle.AddFiles("${file}")`);

        expect(at('/js/apya-confirm.js')).toBeGreaterThan(at('/js/ajax-error-detail.js'));
        expect(at('/js/apya-confirm.js')).toBeGreaterThan(at('/js/apya-quota-upsell.js'));
        expect(at('/js/ajax-error-detail.js')).toBeGreaterThan(0);
    });

    it('koyu temada tehlike düğmesi negatif tonda, doğrulama satırı okunur (sabit hex yok)', () => {
        const css = readFileSync(path.join(web, 'wwwroot', 'css', 'apya-shell.css'), 'utf8').replace(/\r\n/g, '\n');

        expect(css).toContain('[data-theme="dark"] .swal2-confirm.btn-danger {\n    background-color: var(--apya-negative-600) !important;\n}');
        expect(css).toMatch(/\[data-theme="dark"\] \.swal2-validation-message \{\n {4}background: var\(--apya-surface-sunken\) !important;\n {4}color: var\(--apya-text-secondary\) !important;\n\}/);
        // Özgüllük: genel kural (vurgu rengi) tehlike kuralından ÖNCE gelir.
        expect(css.indexOf('[data-theme="dark"] .swal2-confirm {')).toBeLessThan(css.indexOf('[data-theme="dark"] .swal2-confirm.btn-danger {'));
        expect(source).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    });
});
