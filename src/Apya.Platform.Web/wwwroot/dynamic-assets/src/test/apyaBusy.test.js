import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';

// wwwroot/js/apya-busy.js bir IIFE: apya.busy meşgul kilidini ve belge düzeyindeki tek
// gönderim (data-apya-submit-once) dinleyicisini kurar. jQuery ve abp GEREKMEZ; jQuery
// nesnesi yerine dizi-benzeri nesne, jQuery Deferred yerine yalnız then(ok, fail) taşıyan
// sahte kullanılır (jQuery 4 Deferred'da finally/always yok).

let busy;

beforeAll(async () => {
    await import('../../../js/apya-busy.js');
    busy = window.apya.busy;
});

afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.body.removeAttribute('data-apya-submit-once');
});

function el(html) {
    const host = document.createElement('div');
    host.innerHTML = html;
    const node = host.firstElementChild;
    document.body.appendChild(node);
    return node;
}

// Mikro görevlerin (ve Node'un unhandledRejection turunun) bitmesini bekler.
function flush() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

// Elle sonuçlandırılan söz.
function pending() {
    let resolve;
    let reject;
    const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; });
    return { promise, resolve, reject };
}

// jQuery Deferred benzeri: YALNIZ then(ok, fail); finally / always / catch yok.
function deferredLike() {
    const waiting = [];
    return {
        thenable: { then(ok, fail) { waiting.push({ ok, fail }); } },
        resolve(value) { waiting.forEach((w) => w.ok(value)); },
        reject(reason) { waiting.forEach((w) => w.fail(reason)); }
    };
}

describe('apya.busy', () => {
    it('kilit: hedef data-apya-busy + aria-busy + aria-disabled alır, disabled özelliğine dokunmaz', () => {
        const button = el('<button type="button">Kaydet</button>');
        button.focus();
        const work = vi.fn(() => pending().promise);

        expect(busy(button, work)).toBe(true);

        expect(work).toHaveBeenCalledTimes(1);
        expect(button.hasAttribute('data-apya-busy')).toBe(true);
        expect(button.getAttribute('aria-busy')).toBe('true');
        expect(button.getAttribute('aria-disabled')).toBe('true');
        // disabled DEĞİL: odak düğmede kalır, sayfanın kendi disabled yazımı korunur.
        expect(button.disabled).toBe(false);
        expect(button.hasAttribute('disabled')).toBe(false);
        expect(document.activeElement).toBe(button);
    });

    it('söz çözülünce kilit kalkar; işaretler iz bırakmaz', async () => {
        const button = el('<button type="button">Kaydet</button>');
        const request = pending();

        busy(button, () => request.promise);
        request.resolve();
        await flush();

        expect(button.hasAttribute('data-apya-busy')).toBe(false);
        expect(button.hasAttribute('aria-busy')).toBe(false);
        expect(button.hasAttribute('aria-disabled')).toBe(false);
    });

    it('önceden var olan aria-disabled / aria-busy değeri kilit kalkınca geri gelir', async () => {
        const button = el('<button type="button" aria-disabled="false" aria-busy="false">Kaydet</button>');
        const request = pending();

        busy(button, () => request.promise);
        expect(button.getAttribute('aria-disabled')).toBe('true');
        expect(button.getAttribute('aria-busy')).toBe('true');

        request.resolve();
        await flush();

        expect(button.getAttribute('aria-disabled')).toBe('false');
        expect(button.getAttribute('aria-busy')).toBe('false');
    });

    it('söz reddedilince de kilit kalkar ve yakalanmamış ret üretmez', async () => {
        const button = el('<button type="button">Kaydet</button>');
        const unhandled = vi.fn();
        process.on('unhandledRejection', unhandled);

        try {
            busy(button, () => Promise.reject(new Error('sunucu hatası')));
            await flush();
            await flush();

            expect(button.hasAttribute('data-apya-busy')).toBe(false);
            expect(button.hasAttribute('aria-disabled')).toBe(false);
            expect(unhandled).not.toHaveBeenCalled();
        } finally {
            process.off('unhandledRejection', unhandled);
        }
    });

    it('meşgulken ikinci çağrı işi ÇAĞIRMAZ ve false döner — ikinci tıklama istek göndermez', async () => {
        const button = el('<button type="button">Kaydet</button>');
        const request = pending();
        const first = vi.fn(() => request.promise);
        const second = vi.fn(() => Promise.resolve());

        expect(busy(button, first)).toBe(true);
        expect(busy(button, second)).toBe(false);

        expect(first).toHaveBeenCalledTimes(1);
        expect(second).not.toHaveBeenCalled();

        // Kilit kalkınca yeniden çalışır (kalıcı kilit değil).
        request.resolve();
        await flush();
        expect(busy(button, second)).toBe(true);
        expect(second).toHaveBeenCalledTimes(1);
    });

    it('kilit zincirin tamamı boyunca sürer: iş sonuçlanmayan söz döndürürse açılmaz', async () => {
        const button = el('<button type="button">Ekle</button>');
        const write = pending();
        const reload = pending();

        // Başarı işleyicisi "return yukle()" der: yenileme bitene kadar kilitli.
        busy(button, () => write.promise.then(() => reload.promise));
        write.resolve();
        await flush();
        expect(button.hasAttribute('data-apya-busy')).toBe(true);

        reload.resolve();
        await flush();
        expect(button.hasAttribute('data-apya-busy')).toBe(false);

        // Sayfa değiştiren başarı: return new Promise(function () { }) — kilit kalır.
        busy(button, () => Promise.resolve().then(() => new Promise(function () { })));
        await flush();
        expect(button.hasAttribute('data-apya-busy')).toBe(true);
    });

    it('jQuery Deferred benzeri thenable (yalnız then(ok, fail)) ile de açılır — başarı ve ret', async () => {
        const button = el('<button type="button">Kaydet</button>');

        const ok = deferredLike();
        busy(button, () => ok.thenable);
        await flush();
        expect(button.hasAttribute('data-apya-busy')).toBe(true);
        ok.resolve({ id: 1 });
        await flush();
        expect(button.hasAttribute('data-apya-busy')).toBe(false);

        const fail = deferredLike();
        busy(button, () => fail.thenable);
        await flush();
        expect(button.hasAttribute('data-apya-busy')).toBe(true);
        fail.reject({ status: 500 });
        await flush();
        expect(button.hasAttribute('data-apya-busy')).toBe(false);
        expect(button.hasAttribute('aria-disabled')).toBe(false);
    });

    it('iş eşzamanlı fırlatırsa kilit hemen kalkar ve hata çağırana gider', () => {
        const button = el('<button type="button">Kaydet</button>');
        const boom = new Error('dto kurulamadı');

        expect(() => busy(button, () => { throw boom; })).toThrow(boom);

        expect(button.hasAttribute('data-apya-busy')).toBe(false);
        expect(button.hasAttribute('aria-busy')).toBe(false);
        expect(button.hasAttribute('aria-disabled')).toBe(false);
    });

    it('iş söz döndürmezse kilit bir sonraki mikro görevde kalkar', async () => {
        const button = el('<button type="button">Kaydet</button>');

        expect(busy(button, () => undefined)).toBe(true);
        // Eşzamanlı olarak hâlâ kilitli: aynı tıklamanın içindeki ikinci çağrı geçemez.
        expect(button.hasAttribute('data-apya-busy')).toBe(true);

        await Promise.resolve();
        await Promise.resolve();
        expect(button.hasAttribute('data-apya-busy')).toBe(false);
    });

    it('iş fonksiyon değilse (hazır söz) TypeError atar ve hedefi kilitlemez', () => {
        const button = el('<button type="button">Kaydet</button>');

        expect(() => busy(button, Promise.resolve())).toThrow(TypeError);
        expect(() => busy(button)).toThrow(TypeError);
        // Yardımcının kendi denetimi (çağrı anındaki "is not a function" değil): neden söylenir.
        expect(() => busy(button, Promise.resolve())).toThrow(/apya\.busy/);

        expect(button.hasAttribute('data-apya-busy')).toBe(false);
    });

    it('jQuery benzeri dizi-nesne, tek öğe, dizi ve NodeList hedef kabul edilir', async () => {
        const a = el('<button type="button" class="t">A</button>');
        const b = el('<button type="button" class="t">B</button>');

        const jq = pending();
        busy({ 0: a, length: 1 }, () => jq.promise);
        expect(a.hasAttribute('data-apya-busy')).toBe(true);
        expect(b.hasAttribute('data-apya-busy')).toBe(false);
        jq.resolve();
        await flush();

        const list = pending();
        busy([a, b], () => list.promise);
        expect(a.hasAttribute('data-apya-busy')).toBe(true);
        expect(b.hasAttribute('data-apya-busy')).toBe(true);
        list.resolve();
        await flush();

        const nodes = pending();
        busy(document.querySelectorAll('.t'), () => nodes.promise);
        expect(a.hasAttribute('data-apya-busy')).toBe(true);
        expect(b.hasAttribute('data-apya-busy')).toBe(true);
        nodes.resolve();
        await flush();
        expect(a.hasAttribute('data-apya-busy')).toBe(false);
        expect(b.hasAttribute('data-apya-busy')).toBe(false);
    });

    it('hedeflerden biri meşgulse çağrının tamamı yok sayılır; diğer hedef işaretlenmez', () => {
        const a = el('<button type="button">A</button>');
        const b = el('<button type="button">B</button>');
        busy(a, () => pending().promise);
        const work = vi.fn(() => pending().promise);

        expect(busy([b, a], work)).toBe(false);

        expect(work).not.toHaveBeenCalled();
        expect(b.hasAttribute('data-apya-busy')).toBe(false);
        expect(b.hasAttribute('aria-disabled')).toBe(false);
    });

    it('kap (div) hedefi data-apya-busy + aria-busy alır, aria-disabled almaz', () => {
        const row = el('<div id="LeadStatusRow"><button type="button">Yeni</button></div>');
        const link = el('<a href="#">Bağlantı</a>');
        const roleButton = el('<span role="button" tabindex="0">Çip</span>');

        busy([row, link, roleButton], () => pending().promise);

        expect(row.hasAttribute('data-apya-busy')).toBe(true);
        expect(row.getAttribute('aria-busy')).toBe('true');
        expect(row.hasAttribute('aria-disabled')).toBe(false);
        // Kabın içindeki denetime dokunulmaz (tıklanamazlık CSS'ten: pointer-events kalıtsal).
        expect(row.firstElementChild.hasAttribute('data-apya-busy')).toBe(false);
        // Denetim sayılanlar: a ve [role=button].
        expect(link.getAttribute('aria-disabled')).toBe('true');
        expect(roleButton.getAttribute('aria-disabled')).toBe('true');
    });

    it('kilit sırasında sayfa disabled yazarsa kilit sürer; kalkınca sayfanın değeri kalır', async () => {
        // Hibe Sihirbazı: paintSteps istek sürerken düğmelerin disabled'ını yeniden yazar.
        const button = el('<button type="button">Kuruma gönder</button>');
        const request = pending();
        const second = vi.fn(() => Promise.resolve());

        busy(button, () => request.promise);
        button.disabled = false;                 // boyama araya girdi
        expect(busy(button, second)).toBe(false);
        expect(second).not.toHaveBeenCalled();

        button.disabled = true;                  // yanıt: başvuru gönderildi, salt okunur
        request.resolve();
        await flush();

        expect(button.hasAttribute('data-apya-busy')).toBe(false);
        expect(button.disabled).toBe(true);
    });

    it('hedef istek sürerken DOM\'dan sökülse de hata vermez', async () => {
        const row = el('<div><button type="button" class="apya-doc-approve">Onayla</button></div>');
        const button = row.firstElementChild;
        const request = pending();

        busy(button, () => request.promise);
        row.innerHTML = '';                      // liste yeniden boyandı
        request.resolve();
        await flush();

        expect(button.isConnected).toBe(false);
        expect(button.hasAttribute('data-apya-busy')).toBe(false);
    });
});

describe('tek gönderim (data-apya-submit-once)', () => {
    const LOGIN = '<form method="post">' +
        '<input name="Email" value="a@b.c">' +
        '<button type="submit" name="Action" value="Login" data-busy-text="Giriş yapılıyor…">Giriş yap</button>' +
        '<button type="submit" name="Action" value="Cancel" formnovalidate>İptal</button>' +
        '</form>';

    // Tarayıcının gönderim olayı; jsdom gezinmeyi uygulamadığı için olay elle üretilir.
    function submit(form, submitter) {
        const event = new SubmitEvent('submit', { bubbles: true, cancelable: true, submitter: submitter || null });
        form.dispatchEvent(event);
        return event;
    }

    it('kapsam dışındaki formda hiçbir şey yapmaz', () => {
        const form = el(LOGIN);
        const [login] = form.querySelectorAll('button');

        const first = submit(form, login);
        const second = submit(form, login);

        expect(first.defaultPrevented).toBe(false);
        expect(second.defaultPrevented).toBe(false);
        expect(form.hasAttribute('data-apya-submitting')).toBe(false);
        expect(login.hasAttribute('data-apya-busy')).toBe(false);
        expect(login.textContent).toBe('Giriş yap');
    });

    it('ilk POST gönderiminde formu işaretler; gönderen meşgul + metin, tüm submit düğmeleri kilitli, disabled yok', () => {
        document.body.setAttribute('data-apya-submit-once', '');
        const form = el(LOGIN);
        const [login, cancel] = form.querySelectorAll('button');

        const event = submit(form, login);

        expect(event.defaultPrevented).toBe(false);
        expect(form.hasAttribute('data-apya-submitting')).toBe(true);
        expect(login.getAttribute('aria-busy')).toBe('true');
        expect(login.textContent).toBe('Giriş yapılıyor…');
        expect(cancel.hasAttribute('aria-busy')).toBe(false);
        expect(cancel.textContent).toBe('İptal');
        [login, cancel].forEach((button) => {
            expect(button.hasAttribute('data-apya-busy')).toBe(true);
            expect(button.getAttribute('aria-disabled')).toBe('true');
            expect(button.disabled).toBe(false);
        });
    });

    it('gönderen düğmenin name/value\'su form verisinde kalır (Action=Cancel) — disabled yazılmaz', () => {
        document.body.setAttribute('data-apya-submit-once', '');
        const form = el(LOGIN);
        const cancel = form.querySelectorAll('button')[1];

        submit(form, cancel);

        expect(cancel.getAttribute('aria-busy')).toBe('true');
        expect(new FormData(form, cancel).get('Action')).toBe('Cancel');
    });

    it('kapsam tek bir formda da açılabilir (<form data-apya-submit-once>)', () => {
        const form = el(LOGIN);
        form.setAttribute('data-apya-submit-once', '');
        const other = el(LOGIN);

        submit(form, form.querySelector('button'));
        submit(other, other.querySelector('button'));

        expect(form.hasAttribute('data-apya-submitting')).toBe(true);
        expect(other.hasAttribute('data-apya-submitting')).toBe(false);
    });

    it('ikinci gönderim durdurulur — ikinci POST gitmez', () => {
        document.body.setAttribute('data-apya-submit-once', '');
        const form = el(LOGIN);
        const [login] = form.querySelectorAll('button');

        const first = submit(form, login);
        const second = submit(form, login);
        const third = submit(form);                // metin alanında Enter tekrarı

        expect(first.defaultPrevented).toBe(false);
        expect(second.defaultPrevented).toBe(true);
        expect(third.defaultPrevented).toBe(true);
        expect(login.textContent).toBe('Giriş yapılıyor…');
    });

    it('defaultPrevented gelen gönderimde (istemci doğrulaması, AJAX formu) kilitlemez', () => {
        document.body.setAttribute('data-apya-submit-once', '');
        const form = el(LOGIN);
        const [login] = form.querySelectorAll('button');
        let invalid = true;
        form.addEventListener('submit', (e) => { if (invalid) { e.preventDefault(); } });

        submit(form, login);

        expect(form.hasAttribute('data-apya-submitting')).toBe(false);
        expect(login.hasAttribute('data-apya-busy')).toBe(false);
        expect(login.textContent).toBe('Giriş yap');

        // Alan düzeltildi: aynı form bu kez gönderilir ve kilitlenir.
        invalid = false;
        const retry = submit(form, login);
        expect(retry.defaultPrevented).toBe(false);
        expect(form.hasAttribute('data-apya-submitting')).toBe(true);
    });

    it('method=get formu (arama) ve method\'suz formu kilitlemez', () => {
        document.body.setAttribute('data-apya-submit-once', '');
        const search = el('<form method="get"><input name="q"><button type="submit">Ara</button></form>');
        const bare = el('<form><button type="submit">Git</button></form>');

        [search, bare].forEach((form) => {
            submit(form, form.querySelector('button'));
            const second = submit(form, form.querySelector('button'));

            expect(second.defaultPrevented).toBe(false);
            expect(form.hasAttribute('data-apya-submitting')).toBe(false);
            expect(form.querySelector('button').hasAttribute('data-apya-busy')).toBe(false);
        });
    });

    it('method büyük harfle yazılsa da (POST) kilitler', () => {
        document.body.setAttribute('data-apya-submit-once', '');
        const form = el('<form method="POST"><button type="submit">Gönder</button></form>');

        submit(form, form.querySelector('button'));

        expect(form.hasAttribute('data-apya-submitting')).toBe(true);
    });

    it('pageshow\'da (bfcache dönüşü) işaret, aria öznitelikleri ve düğme metni sıfırlanır', () => {
        document.body.setAttribute('data-apya-submit-once', '');
        const form = el(LOGIN);
        const [login, cancel] = form.querySelectorAll('button');
        submit(form, login);

        window.dispatchEvent(new Event('pageshow'));

        expect(form.hasAttribute('data-apya-submitting')).toBe(false);
        [login, cancel].forEach((button) => {
            expect(button.hasAttribute('data-apya-busy')).toBe(false);
            expect(button.hasAttribute('aria-disabled')).toBe(false);
            expect(button.hasAttribute('aria-busy')).toBe(false);
        });
        expect(login.textContent).toBe('Giriş yap');

        // Sıfırlanan form yeniden gönderilebilir.
        expect(submit(form, login).defaultPrevented).toBe(false);
        expect(login.textContent).toBe('Giriş yapılıyor…');
    });

    it('15 sn sonra emniyet zamanlayıcısı kilidi açar (gezinme hiç olmadıysa)', () => {
        vi.useFakeTimers();
        document.body.setAttribute('data-apya-submit-once', '');
        const form = el(LOGIN);
        const [login] = form.querySelectorAll('button');
        submit(form, login);

        vi.advanceTimersByTime(14999);
        expect(form.hasAttribute('data-apya-submitting')).toBe(true);
        expect(submit(form, login).defaultPrevented).toBe(true);

        vi.advanceTimersByTime(1);
        expect(form.hasAttribute('data-apya-submitting')).toBe(false);
        expect(login.hasAttribute('data-apya-busy')).toBe(false);
        expect(login.textContent).toBe('Giriş yap');
        expect(submit(form, login).defaultPrevented).toBe(false);
    });

    it('pageshow ile sıfırlanan formun eski zamanlayıcısı yeni kilidi erken açmaz', () => {
        vi.useFakeTimers();
        document.body.setAttribute('data-apya-submit-once', '');
        const form = el(LOGIN);
        const [login] = form.querySelectorAll('button');

        submit(form, login);
        vi.advanceTimersByTime(10000);
        window.dispatchEvent(new Event('pageshow'));
        submit(form, login);                       // yeni kilit, yeni 15 sn
        vi.advanceTimersByTime(6000);              // ilk zamanlayıcının süresi geçti

        expect(form.hasAttribute('data-apya-submitting')).toBe(true);
    });

    it('submitter yoksa formun ilk submit düğmesi meşgul gösterilir', () => {
        document.body.setAttribute('data-apya-submit-once', '');
        const form = el(LOGIN);
        const [login, cancel] = form.querySelectorAll('button');

        submit(form);                              // örtük gönderim (Enter)

        expect(login.getAttribute('aria-busy')).toBe('true');
        expect(login.textContent).toBe('Giriş yapılıyor…');
        expect(cancel.hasAttribute('aria-busy')).toBe(false);
    });

    it('alt öğesi olan (ikonlu) düğmede metin takası yapılmaz; kilit yine uygulanır', () => {
        document.body.setAttribute('data-apya-submit-once', '');
        const form = el('<form method="post">' +
            '<button type="submit" name="provider" value="Google" data-busy-text="Yönlendiriliyor…">' +
            '<i class="fa-brands fa-google"></i> Google</button></form>');
        const provider = form.querySelector('button');
        const markup = provider.innerHTML;

        submit(form, provider);

        expect(provider.innerHTML).toBe(markup);
        expect(provider.getAttribute('aria-busy')).toBe('true');
        expect(provider.getAttribute('aria-disabled')).toBe('true');
        expect(new FormData(form, provider).get('provider')).toBe('Google');
    });
});
