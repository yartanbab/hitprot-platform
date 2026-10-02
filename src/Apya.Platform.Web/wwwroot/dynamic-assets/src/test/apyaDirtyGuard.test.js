import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// wwwroot/js/apya-dirty-guard.js bir IIFE: window.apya.dirtyGuard'ı kurar, belge / pencere
// düzeyinde dinler ve (jQuery varsa) ABP'nin $.fn.needConfirmationOnUnsavedClose eklentisini
// ezer. Çekirdek jQuery gerektirmez. Her testte dosya YENİDEN yüklenir (izin damgası, kayıt
// ve açık onay modül durumudur); önceki yüklemenin dinleyicileri sökülür.
// Bootstrap'in olayları gerçeğiyle aynı adla ve yerel olarak (kabarcıklı, iptal edilebilir)
// üretilir; onay penceresi (apya.confirm / abp.message.confirm) ve konum sahtedir.

const TITLE = 'Kaydedilmemiş değişiklikleriniz var';
const BODY = 'Devam ederseniz kaydetmediğiniz değişiklikler kaybolur.';
const STAY = 'Düzenlemeye devam et';
const DISCARD = 'Değişiklikleri at';
const LEAVE_CONFIRM = 'Devam ederseniz kaydetmediğiniz değişiklikler kaybolur. Yine de devam edilsin mi?';

let guard;
let recorded = [];
let answer;
let jqueryHandlers;

function removeRecorded() {
    recorded.splice(0).forEach(([target, args]) => target.removeEventListener(...args));
}

/** ABP modal akışının kullandığı yüzey: $(window).on, $form.on, $.fn, dizin erişimi. */
function installJquery() {
    jqueryHandlers = [];
    const $ = (target) => {
        const list = target === window || (target && target.nodeType) ? [target] : Array.from(target || []);
        const api = Object.create($.fn);
        api.length = list.length;
        list.forEach((node, i) => { api[i] = node; });
        api.on = (type, handler) => {
            jqueryHandlers.push({ type, handler });
            list.forEach((node) => node.addEventListener(type, (e) => handler.call(node, {
                target: e.target, originalEvent: e, isDefaultPrevented: () => e.defaultPrevented
            })));
            return api;
        };
        return api;
    };
    $.fn = {};
    window.jQuery = window.$ = $;
    return $;
}

/** Onay sahtesi: çağrı kaydedilir, yanıt testte answer(true | false) ile verilir. */
function installConfirm() {
    const calls = [];
    window.apya = window.apya || {};
    window.apya.confirm = vi.fn((options) => new Promise((resolve) => { calls.push(resolve); }));
    answer = (value) => calls.shift()(value);
}

async function load({ jquery = false, confirm = true } = {}) {
    removeRecorded();
    window.apya = window.apya || {};
    delete window.apya.dirtyGuard;
    delete window.apya.confirm;
    delete window.jQuery;
    delete window.$;
    delete window.abp;
    if (jquery) { installJquery(); }
    if (confirm) { installConfirm(); }
    vi.resetModules();
    const onWindow = vi.spyOn(window, 'addEventListener');
    const onDocument = vi.spyOn(document, 'addEventListener');
    await import('../../../js/apya-dirty-guard.js');
    recorded = [
        ...onWindow.mock.calls.map((args) => [window, args]),
        ...onDocument.mock.calls.map((args) => [document, args])
    ];
    onWindow.mockRestore();
    onDocument.mockRestore();
    guard = window.apya.dirtyGuard;
}

function html(markup) {
    document.body.innerHTML = markup;
    return document.body.firstElementChild;
}

const fire = (el, type, init) => {
    const event = new Event(type, { bubbles: true, cancelable: true, ...init });
    el.dispatchEvent(event);
    return event;
};

/** Kullanıcı alana dokunur (ilk jest) ve yazar. */
function type(el, value) {
    fire(el, 'pointerdown');
    el.value = value;
    fire(el, 'input');
}

/** Sayfadan ayrılma denemesi: tarayıcı sorar mı? */
function leaveBlocked() {
    return fire(window, 'beforeunload').defaultPrevented;
}

/** Bağlantıya tıklama; jsdom gezinmeyi uygulamadığı için varsayılan en sonda durdurulur. */
function clickLink(a, init) {
    let prevented;
    const late = (e) => { prevented = e.defaultPrevented; e.preventDefault(); };
    window.addEventListener('click', late);
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init }));
    window.removeEventListener('click', late);
    return prevented;
}

function submit(form, { submitter = null, prevented = false } = {}) {
    const event = new Event('submit', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'submitter', { value: submitter });
    if (prevented) { form.addEventListener('submit', (e) => e.preventDefault(), { once: true }); }
    form.dispatchEvent(event);
}

const flush = () => vi.advanceTimersByTimeAsync(0);

beforeAll(async () => {
    // Tutar maskesi gerçek dosya (RSP-05 gerilemesi); bir kez yüklenir.
    await import('../../../js/apya-money-input.js');
});

beforeEach(async () => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    await load();
});

afterEach(() => {
    document.body.innerHTML = '';
    // Kapsamı düşen korumalar ayıklanır, beforeunload sökülür.
    guard.isDirty();
    removeRecorded();
    delete window.bootstrap;
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe('kayıt: işaretleme ve watch', () => {
    it('form[data-dirty-guard] yüklemede kendiliğinden izlenir', async () => {
        const form = html('<form data-dirty-guard><input name="Name" value="Proje"></form>');
        await load();

        type(form.querySelector('input'), 'Proje 2');

        expect(guard.isDirty(form)).toBe(true);
        expect(guard.isDirty()).toBe(true);
    });

    it('işaretsiz form izlenmez: yazmak sayfayı kirletmez', async () => {
        const form = html('<form><input name="Name" value="Proje"></form>');
        await load();

        type(form.querySelector('input'), 'Proje 2');

        expect(guard.isDirty()).toBe(false);
        expect(leaveBlocked()).toBe(false);
    });

    it('watch aynı kapsamda aynı korumayı döndürür', () => {
        const form = html('<form><input name="Name" value="Proje"></form>');

        const first = guard.watch(form);
        expect(guard.watch(form)).toBe(first);
        expect(first.scope).toBe(form);
    });

    it('kapsamı DOM\'dan düşen koruma kendiliğinden düşer', () => {
        const form = html('<form><input name="Name" value="Proje"></form>');
        guard.watch(form);
        type(form.querySelector('input'), 'Proje 2');
        expect(leaveBlocked()).toBe(true);

        form.remove();

        expect(guard.isDirty()).toBe(false);
        expect(leaveBlocked()).toBe(false);
    });

    it('dispose(): koruma kayıttan düşer, .is-dirty kalkar', async () => {
        const form = html('<form><input name="Name" value="Proje"></form>');
        const g = guard.watch(form);
        type(form.querySelector('input'), 'Proje 2');
        await flush();
        expect(form.classList.contains('is-dirty')).toBe(true);

        g.dispose();

        expect(form.classList.contains('is-dirty')).toBe(false);
        expect(guard.isDirty()).toBe(false);
        expect(leaveBlocked()).toBe(false);
    });
});

describe('"el değmemiş" kuralı: jestten önceki programatik değişiklik kirli sayılmaz', () => {
    it('değer atama, alan ekleme (tutar maskesi, zincirli seçim, API\'den doldurma) temizdir', () => {
        const form = html('<form><input name="Name" value="Proje"><select name="Kind"><option value="a">A</option><option value="b">B</option></select></form>');
        const g = guard.watch(form);

        form.querySelector('input').value = 'Sunucudan gelen ad';
        form.querySelector('select').value = 'b';
        form.insertAdjacentHTML('beforeend', '<input type="hidden" name="Amount" value="0">');
        fire(form.querySelector('select'), 'change');

        expect(g.isDirty()).toBe(false);
        expect(leaveBlocked()).toBe(false);
    });

    it.each(['pointerdown', 'keydown', 'beforeinput'])('ilk jest (%s) temeli O ANKİ durumdan alır; sonraki değişiklik kirletir', (gesture) => {
        const form = html('<form><input name="Name" value="Proje"></form>');
        const input = form.querySelector('input');
        const g = guard.watch(form);
        input.value = 'Maskenin yazdığı';

        fire(input, gesture);
        expect(g.isDirty()).toBe(false);

        input.value = 'Kullanıcının yazdığı';
        fire(input, 'input');
        expect(g.isDirty()).toBe(true);
    });

    it('eski değere dönülünce yine temiz', () => {
        const form = html('<form><input name="Name" value="Proje"></form>');
        const input = form.querySelector('input');
        const g = guard.watch(form);

        type(input, 'Proje 2');
        expect(g.isDirty()).toBe(true);

        input.value = 'Proje';
        fire(input, 'input');
        expect(g.isDirty()).toBe(false);
    });

    it('kapsam DIŞINDAKİ jest silahlamaz', () => {
        document.body.innerHTML = '<button id="out">Menü</button><form id="f"><input name="Name" value="Proje"></form>';
        const form = document.getElementById('f');
        const g = guard.watch(form);

        fire(document.getElementById('out'), 'pointerdown');
        form.querySelector('input').value = 'Betik yazdı';

        expect(g.isDirty()).toBe(false);
    });
});

describe('anlık görüntü', () => {
    it('adsız (yalnız id\'li) alanlar da sayılır (hibe formları)', () => {
        const form = html('<form><textarea id="IdeaSummary"></textarea></form>');
        const g = guard.watch(form);

        type(form.querySelector('textarea'), 'Fikir özeti');

        expect(g.isDirty()).toBe(true);
    });

    it('[data-dirty-ignore] altındakiler, type=search, düğmeler ve select2 arama kutusu sayılmaz', () => {
        const form = html(
            '<form><input name="Name" value="Proje">' +
            '<fieldset data-dirty-ignore><input name="Instant" value="1"></fieldset>' +
            '<input type="search" name="q" value=""><input class="select2-search__field" value="">' +
            '<input type="submit" value="Kaydet"><input type="button" value="Ekle"></form>');
        const g = guard.watch(form);
        fire(form.querySelector('[name="Name"]'), 'pointerdown');

        form.querySelector('[name="Instant"]').value = '2';
        form.querySelector('[type="search"]').value = 'ara';
        form.querySelector('.select2-search__field').value = 'ara';
        form.querySelector('[type="submit"]').value = 'Kaydediliyor…';
        form.querySelector('[type="button"]').value = 'Eklendi';
        expect(g.isDirty()).toBe(false);

        form.querySelector('[name="Name"]').value = 'Proje 2';
        expect(g.isDirty()).toBe(true);
    });

    it('atlanan alanın (select2 arama kutusu) sonradan eklenmesi adsız alanları kirli göstermez', () => {
        const form = html('<form><div id="slot"></div><input value="a"><input value="b"></form>');
        const g = guard.watch(form);
        fire(form.querySelector('input'), 'pointerdown');

        form.querySelector('#slot').innerHTML = '<input class="select2-search__field" value="">';

        expect(g.isDirty()).toBe(false);
    });

    it('checkbox / radio işaret durumu, select-multiple seçimi serileşir', () => {
        const form = html(
            '<form><input type="checkbox" name="Active" value="true">' +
            '<input type="radio" name="Mode" value="a" checked><input type="radio" name="Mode" value="b">' +
            '<select multiple name="Tags"><option value="x">X</option><option value="y">Y</option></select></form>');
        const g = guard.watch(form);
        const box = form.querySelector('[type="checkbox"]');
        fire(box, 'pointerdown');

        box.checked = true;
        expect(g.isDirty()).toBe(true);
        box.checked = false;
        expect(g.isDirty()).toBe(false);

        form.querySelector('[value="b"]').checked = true;
        expect(g.isDirty()).toBe(true);
        form.querySelector('[value="a"]').checked = true;
        expect(g.isDirty()).toBe(false);

        form.querySelector('option[value="y"]').selected = true;
        expect(g.isDirty()).toBe(true);
    });

    it('options.snapshot: DOM dışı durum (menü düzeni) kirliliği belirler; reset() yeni temeli alır', () => {
        const root = html('<div><button type="button">↑</button></div>');
        const order = ['a', 'b', 'c'];
        const g = guard.watch(root, { snapshot: () => JSON.stringify(order) });

        fire(root.querySelector('button'), 'pointerdown');
        order.reverse();
        expect(g.isDirty()).toBe(true);

        g.reset();
        expect(g.isDirty()).toBe(false);

        fire(root.querySelector('button'), 'pointerdown');
        order.reverse();
        expect(g.isDirty()).toBe(true);
        order.reverse();
        expect(g.isDirty()).toBe(false);
    });

    it('yeniden watch seçenekleri günceller ve temeli yeniler (kendiliğinden kayıt + sayfa betiği)', async () => {
        const form = html('<form data-dirty-guard><input name="Name" value="Proje"></form>');
        await load();
        const state = { order: 1 };

        const g = guard.watch(form, { snapshot: () => String(state.order) });
        fire(form.querySelector('input'), 'pointerdown');
        form.querySelector('input').value = 'anlık görüntüde yok';
        expect(g.isDirty()).toBe(false);

        state.order = 2;
        expect(g.isDirty()).toBe(true);
    });
});

describe('data-dirty-guard="dirty": sunucu doğrulama hatasıyla geri basılan form', () => {
    it('jest olmadan kirli başlar; reset() ile temizlenir', async () => {
        const form = html('<form data-dirty-guard="dirty"><input name="Budget" value="-5"></form>');
        await load();

        expect(guard.isDirty(form)).toBe(true);
        expect(form.classList.contains('is-dirty')).toBe(true);
        expect(leaveBlocked()).toBe(true);

        guard.reset(form);

        expect(guard.isDirty(form)).toBe(false);
        expect(form.classList.contains('is-dirty')).toBe(false);
        expect(leaveBlocked()).toBe(false);
    });

    it('alana dokunmak "kirli başladı" durumunu düşürmez', async () => {
        const form = html('<form data-dirty-guard="dirty"><input name="Budget" value="-5"></form>');
        await load();

        fire(form.querySelector('input'), 'pointerdown');

        expect(guard.isDirty(form)).toBe(true);
    });
});

describe('options.isDirty (yüklem): Hibe Sihirbazı / React adası', () => {
    it('anlık görüntü kullanılmaz; beforeunload kayıt anında bağlıdır; reset() etkisizdir', () => {
        const root = html('<div><input id="Field" value=""></div>');
        const pending = { count: 0 };
        const added = vi.spyOn(window, 'addEventListener');

        const g = guard.watch(root, { isDirty: () => pending.count > 0 });
        expect(added.mock.calls.filter((args) => args[0] === 'beforeunload')).toHaveLength(1);

        type(root.querySelector('input'), 'yazı');
        expect(g.isDirty()).toBe(false);
        expect(leaveBlocked()).toBe(false);

        pending.count = 1;
        expect(g.isDirty()).toBe(true);
        expect(leaveBlocked()).toBe(true);

        g.reset();
        expect(g.isDirty()).toBe(true);
    });
});

describe('.is-dirty sınıfı (rozet / düğme görünürlüğü CSS\'te)', () => {
    it('input sonrası eklenir, geri alınınca kalkar', async () => {
        const form = html('<form><input name="Name" value="Proje"></form>');
        const input = form.querySelector('input');
        guard.watch(form);

        type(input, 'Proje 2');
        await flush();
        expect(form.classList.contains('is-dirty')).toBe(true);

        input.value = 'Proje';
        fire(input, 'change');
        await flush();
        expect(form.classList.contains('is-dirty')).toBe(false);
    });

    it('click sonrası da yeniden hesaplanır (↑ / ↓ düğmeleri)', async () => {
        const root = html('<div><button type="button">↑</button></div>');
        const order = ['a', 'b'];
        guard.watch(root, { snapshot: () => order.join() });
        const button = root.querySelector('button');

        fire(button, 'pointerdown');
        order.reverse();
        fire(button, 'click');
        await flush();

        expect(root.classList.contains('is-dirty')).toBe(true);
    });

    it('refresh(): olay üretmeyen programatik değişikliği (sürükle-bırak) yansıtır', () => {
        const root = html('<div><span>⠿</span></div>');
        const order = ['a', 'b'];
        const g = guard.watch(root, { snapshot: () => order.join() });

        fire(root.querySelector('span'), 'pointerdown');
        order.reverse();
        expect(root.classList.contains('is-dirty')).toBe(false);

        g.refresh();
        expect(root.classList.contains('is-dirty')).toBe(true);

        order.reverse();
        guard.refresh(root);
        expect(root.classList.contains('is-dirty')).toBe(false);
    });
});

describe('beforeunload: Geri / yenileme / sekme kapatma', () => {
    it('kirliyken engeller, temizken dokunmaz', () => {
        const form = html('<form><input name="Name" value="Proje"></form>');
        const input = form.querySelector('input');
        guard.watch(form);

        fire(input, 'pointerdown');
        expect(leaveBlocked()).toBe(false);

        input.value = 'Proje 2';
        expect(leaveBlocked()).toBe(true);
    });

    it('hiçbir koruma silahlı değilken dinleyici BAĞLI DEĞİL (bfcache); ilk jestte bağlanır, reset\'te sökülür', () => {
        const form = html('<form><input name="Name" value="Proje"></form>');
        const added = vi.spyOn(window, 'addEventListener');
        const removed = vi.spyOn(window, 'removeEventListener');
        const unloads = (spy) => spy.mock.calls.filter((args) => args[0] === 'beforeunload');

        const g = guard.watch(form);
        form.querySelector('input').value = 'Betik yazdı';
        expect(unloads(added)).toHaveLength(0);

        fire(form.querySelector('input'), 'keydown');
        expect(unloads(added)).toHaveLength(1);
        expect(unloads(removed)).toHaveLength(0);

        g.reset();
        expect(unloads(removed)).toHaveLength(1);
        expect(unloads(removed)[0][1]).toBe(unloads(added)[0][1]);
    });
});

describe('allowUnload: kullanıcının bilerek seçtiği ayrılış', () => {
    function dirtyForm() {
        const form = html('<form><input name="Name" value="Proje"></form>');
        guard.watch(form);
        type(form.querySelector('input'), 'Proje 2');
        return form;
    }

    it('sıradaki ayrılış serbest; ikincisi yine engellenir', async () => {
        dirtyForm();
        expect(guard.isUnloadAllowed()).toBe(false);

        guard.allowUnload();
        expect(guard.isUnloadAllowed()).toBe(true);
        expect(leaveBlocked()).toBe(false);

        await flush();
        expect(guard.isUnloadAllowed()).toBe(false);
        expect(leaveBlocked()).toBe(true);
    });

    it('izin AYNI beforeunload olayının diğer dinleyicilerine de görünür (React useDirtyGuard)', () => {
        dirtyForm();
        let seen;
        const react = () => { seen = guard.isUnloadAllowed(); };
        window.addEventListener('beforeunload', react);

        guard.allowUnload();
        leaveBlocked();

        expect(seen).toBe(true);
        window.removeEventListener('beforeunload', react);
    });

    it('1,5 sn içinde ayrılış olmazsa izin düşer', () => {
        dirtyForm();
        guard.allowUnload();

        vi.advanceTimersByTime(1499);
        expect(guard.isUnloadAllowed()).toBe(true);

        vi.advanceTimersByTime(2);
        expect(guard.isUnloadAllowed()).toBe(false);
        expect(leaveBlocked()).toBe(true);
    });

    it('pageshow persisted (bfcache\'ten geri dönüş) izni sıfırlar', () => {
        dirtyForm();
        guard.allowUnload();

        const event = new Event('pageshow');
        Object.defineProperty(event, 'persisted', { value: true });
        window.dispatchEvent(event);

        expect(guard.isUnloadAllowed()).toBe(false);
        expect(leaveBlocked()).toBe(true);
    });

    it('başka sekmede giriş / çıkış (ABP auth-state sekme yenilemesi): sıradaki ayrılış serbest', () => {
        dirtyForm();
        const storage = (key, oldValue, newValue) => {
            const event = new Event('storage');
            Object.assign(event, { key, oldValue, newValue });
            window.dispatchEvent(event);
        };

        storage('apya-theme', 'light', 'dark');
        expect(leaveBlocked()).toBe(true);

        storage('authentication-state-id', 'u1', 'u1');
        expect(leaveBlocked()).toBe(true);

        storage('authentication-state-id', 'u1', null);
        expect(leaveBlocked()).toBe(false);
    });

    it('oturum akışı olayı kesmişse (ajax-error-detail.js önce kayıtlı) izin verilmez', async () => {
        const cut = (e) => e.stopImmediatePropagation();
        window.addEventListener('storage', cut, true);
        await load();
        dirtyForm();

        const event = new Event('storage');
        Object.assign(event, { key: 'authentication-state-id', oldValue: 'u1', newValue: null });
        window.dispatchEvent(event);

        expect(leaveBlocked()).toBe(true);
        window.removeEventListener('storage', cut, true);
    });
});

describe('gönderim: korunan formun kendi kaydı uyarısız', () => {
    function page() {
        document.body.innerHTML =
            '<form id="info"><input name="Name" value="Proje">' +
            '<button type="submit" id="save">Kaydet</button>' +
            '<button type="submit" id="reset" formaction="?handler=Reset">Sıfırla</button>' +
            '<button type="submit" id="bypass" formaction="?handler=Reset" data-dirty-bypass>Varsayılana dön</button></form>' +
            '<form id="files"><button type="submit" id="upload">Yükle</button></form>';
        const info = document.getElementById('info');
        guard.watch(info);
        type(info.querySelector('input'), 'Proje 2');
        return info;
    }

    it('kendi gönderimi serbest bırakır', () => {
        const info = page();
        submit(info, { submitter: info.querySelector('#save') });

        expect(leaveBlocked()).toBe(false);
    });

    it('gönderen düğme bilinmiyorsa da (Enter, form.requestSubmit) serbest', () => {
        const info = page();
        submit(info);

        expect(leaveBlocked()).toBe(false);
    });

    it('engellenen gönderim (istemci doğrulaması, AJAX formu) bırakmaz', () => {
        const info = page();
        submit(info, { submitter: info.querySelector('#save'), prevented: true });

        expect(leaveBlocked()).toBe(true);
    });

    it('formaction\'lı gönderen (kaydetmeyen alternatif eylem) bırakmaz: tarayıcı sorar', () => {
        const info = page();
        submit(info, { submitter: info.querySelector('#reset') });

        expect(leaveBlocked()).toBe(true);
    });

    it('data-dirty-bypass\'lı gönderen bırakır (formaction taşısa da)', () => {
        const info = page();
        submit(info, { submitter: info.querySelector('#bypass') });

        expect(leaveBlocked()).toBe(false);
    });

    it('BAŞKA formun gönderimi (dosya yükle) bırakmaz: bilgi formu kirliyse tarayıcı sorar', () => {
        page();
        const files = document.getElementById('files');
        submit(files, { submitter: files.querySelector('#upload') });

        expect(leaveBlocked()).toBe(true);
    });

    it('jQuery varken onun olayı dinlenir: .trigger("submit") ile gelen gönderim de görülür', async () => {
        await load({ jquery: true });
        const info = page();
        const handler = jqueryHandlers.find((h) => h.type === 'submit').handler;

        // jQuery'nin tetiklediği olay: originalEvent yok, gönderen düğme bilinmez.
        handler({ target: info, isDefaultPrevented: () => true });
        expect(leaveBlocked()).toBe(true);

        handler({ target: info, isDefaultPrevented: () => false });
        expect(leaveBlocked()).toBe(false);
    });

    it('jQuery varken yerel gönderimde gönderen düğme originalEvent\'ten okunur', async () => {
        await load({ jquery: true });
        const info = page();

        submit(info, { submitter: info.querySelector('#reset') });
        expect(leaveBlocked()).toBe(true);

        submit(info, { submitter: info.querySelector('#save') });
        expect(leaveBlocked()).toBe(false);
    });
});

describe('uygulama içi bağlantı: tarayıcı penceresi yerine ortak onay', () => {
    let assign;

    function page(link) {
        assign = vi.fn();
        vi.stubGlobal('location', { ...window.location, pathname: '/Projects/Edit/1', search: '', hash: '', assign });
        document.body.innerHTML = `<form id="f"><input name="Name" value="Proje"></form>${link}`;
        const form = document.getElementById('f');
        guard.watch(form);
        type(form.querySelector('input'), 'Proje 2');
        return document.querySelector('a');
    }

    it('kirliyken tıklama durdurulur ve ortak onay açılır; "Değişiklikleri at" → gidilir, tarayıcı ikinci kez sormaz', async () => {
        const a = page('<a href="/Dashboard"><i></i><span>Genel Bakış</span></a>');

        expect(clickLink(a.querySelector('span'))).toBe(true);
        expect(window.apya.confirm).toHaveBeenCalledTimes(1);
        expect(assign).not.toHaveBeenCalled();

        answer(true);
        await flush();

        expect(assign).toHaveBeenCalledWith(a.href);
        expect(a.href).toMatch(/\/Dashboard$/);
        expect(guard.isUnloadAllowed()).toBe(true);
    });

    it('"Düzenlemeye devam et" → sayfada kalınır; ikinci tık yeni onay açar', async () => {
        const a = page('<a href="/Dashboard">Genel Bakış</a>');

        clickLink(a);
        answer(false);
        await flush();
        expect(assign).not.toHaveBeenCalled();
        expect(guard.isDirty()).toBe(true);
        expect(leaveBlocked()).toBe(true);

        clickLink(a);
        expect(window.apya.confirm).toHaveBeenCalledTimes(2);
    });

    it('temiz sayfada bağlantıya karışılmaz', () => {
        const a = page('<a href="/Dashboard">Genel Bakış</a>');
        guard.reset();

        expect(clickLink(a)).toBe(false);
        expect(window.apya.confirm).not.toHaveBeenCalled();
    });

    it.each([
        ['yeni sekme', '<a href="/Dashboard" target="_blank">x</a>', undefined],
        ['çıplak #', '<a href="#">x</a>', undefined],
        ['sekme bağlantısı', '<a href="#files">x</a>', undefined],
        ['aynı belge içi hash', '<a href="/Projects/Edit/1#files">x</a>', undefined],
        ['javascript: (düğme gibi kullanılan bağlantı)', '<a href="javascript:void(0)">x</a>', undefined],
        ['orta tık', '<a href="/Dashboard">x</a>', { button: 1 }],
        ['Ctrl ile tık', '<a href="/Dashboard">x</a>', { ctrlKey: true }],
        ['Meta ile tık', '<a href="/Dashboard">x</a>', { metaKey: true }],
        ['Shift ile tık', '<a href="/Dashboard">x</a>', { shiftKey: true }]
    ])('%s: onay açılmaz, izin de verilmez', (_, link, init) => {
        const a = page(link);

        expect(clickLink(a, init)).toBe(false);
        expect(window.apya.confirm).not.toHaveBeenCalled();
        expect(guard.isUnloadAllowed()).toBe(false);
    });

    it('target="_self" aynı pencere sayılır', () => {
        const a = page('<a href="/Dashboard" target="_self">x</a>');

        expect(clickLink(a)).toBe(true);
        expect(window.apya.confirm).toHaveBeenCalledTimes(1);
    });

    it('sayfanın kendi işleyicisi tıklamayı durdurduysa (defaultPrevented) karışılmaz', () => {
        const a = page('<a href="/Dashboard">x</a>');
        a.addEventListener('click', (e) => e.preventDefault());

        clickLink(a);

        expect(window.apya.confirm).not.toHaveBeenCalled();
    });

    it.each([
        ['indirme', '<a href="/export.csv" download>x</a>'],
        ['data-dirty-bypass', '<a href="/Account/Logout" data-dirty-bypass>x</a>'],
        ['mailto:', '<a href="mailto:destek@example.com">x</a>'],
        ['tel:', '<a href="tel:+902120000000">x</a>']
    ])('%s: onay yok, tarayıcı da sormaz', (_, link) => {
        const a = page(link);

        expect(clickLink(a)).toBe(false);
        expect(window.apya.confirm).not.toHaveBeenCalled();
        expect(leaveBlocked()).toBe(false);
    });
});

describe('confirmDiscard: tek ortak pencere', () => {
    function dirtyForm() {
        const form = html('<form><input name="Name" value="Proje"></form>');
        const g = guard.watch(form);
        type(form.querySelector('input'), 'Proje 2');
        return g;
    }

    it('temizken pencere açmadan true', async () => {
        const form = html('<form><input name="Name" value="Proje"></form>');
        const g = guard.watch(form);

        expect(await g.confirmDiscard()).toBe(true);
        expect(await guard.confirmDiscard()).toBe(true);
        expect(await guard.confirmDiscard(document.body)).toBe(true);
        expect(window.apya.confirm).not.toHaveBeenCalled();
    });

    it('kirliyken apya.confirm: başlık / gövde / düğmeler ortak anahtarlardan, odak "Düzenlemeye devam et"te', async () => {
        const g = dirtyForm();

        const result = g.confirmDiscard();
        expect(window.apya.confirm).toHaveBeenCalledWith({ title: TITLE, message: BODY, confirmText: DISCARD, cancelText: STAY, danger: true });

        answer(true);
        expect(await result).toBe(true);
        // Kendisi temizlemez / izin vermez: çağıran karar verir.
        expect(g.isDirty()).toBe(true);
        expect(guard.isUnloadAllowed()).toBe(false);
    });

    it('art arda iki çağrı aynı sözü döndürür (tek pencere); yanıttan sonra yenisi açılabilir', async () => {
        const g = dirtyForm();

        const first = g.confirmDiscard();
        const second = guard.confirmDiscard();
        expect(second).toBe(first);
        expect(window.apya.confirm).toHaveBeenCalledTimes(1);

        answer(false);
        expect(await first).toBe(false);

        g.confirmDiscard();
        expect(window.apya.confirm).toHaveBeenCalledTimes(2);
    });

    it('metinler Platform kaynağından okunur', () => {
        window.abp = { localization: { getResource: () => (key) => `[${key}]` } };
        const g = dirtyForm();

        g.confirmDiscard();

        expect(window.apya.confirm).toHaveBeenCalledWith({
            title: '[Common:Unsaved:Title]', message: '[Common:Unsaved:Body]',
            confirmText: '[Common:Unsaved:Discard]', cancelText: '[Common:Unsaved:Stay]', danger: true
        });
    });

    it('apya.confirm yokken abp.message.confirm(soru cümlesi, başlık); Deferred\'ın değeriyle çözülür', async () => {
        await load({ confirm: false });
        const confirm = vi.fn(() => ({ then: (ok) => ok(true) }));
        window.abp = { localization: { getResource: () => (key) => key }, message: { confirm } };
        const g = dirtyForm();

        expect(await g.confirmDiscard()).toBe(true);
        expect(confirm).toHaveBeenCalledWith(LEAVE_CONFIRM, TITLE);
    });

    it('abp.message.confirm reddederse false ("kal")', async () => {
        await load({ confirm: false });
        window.abp = { message: { confirm: () => ({ then: (ok, fail) => fail(new Error('x')) }) } };
        const g = dirtyForm();

        expect(await g.confirmDiscard()).toBe(false);
    });

    it('hiçbir onay yolu yoksa false: değişiklik sessizce atılmaz', async () => {
        await load({ confirm: false });
        const g = dirtyForm();

        expect(await g.confirmDiscard()).toBe(false);
    });
});

describe('modal koruması: kirliyken kapatma sorar', () => {
    let hide;

    function modalForm(inner = '<input name="Title" value="">') {
        document.body.innerHTML = `<div class="modal" id="m"><form id="f">${inner}<button type="button" data-bs-dismiss="modal">Vazgeç</button></form></div>`;
        hide = vi.fn();
        window.bootstrap = { Modal: { getInstance: vi.fn(() => ({ hide })) } };
        return { modal: document.getElementById('m'), form: document.getElementById('f') };
    }

    async function open(modal) {
        modal.classList.add('show');
        fire(modal, 'shown.bs.modal');
        await flush();
    }

    it('dokunulmamış formda Esc / Vazgeç doğrudan kapatır (RSP-05.1)', async () => {
        const { modal, form } = modalForm();
        guard.watch(form, { modal });
        await open(modal);

        fire(form.querySelector('input'), 'keydown', { key: 'Escape' });

        expect(fire(modal, 'hide.bs.modal').defaultPrevented).toBe(false);
        expect(window.apya.confirm).not.toHaveBeenCalled();
    });

    it('açılış bitmeden (shown + 0) gelen jest sayılmaz; o ana kadarki doldurma temele girer', async () => {
        const { modal, form } = modalForm();
        const input = form.querySelector('input');
        guard.watch(form, { modal });

        fire(input, 'pointerdown');
        fire(modal, 'shown.bs.modal');
        fire(input, 'keydown');
        input.value = 'onOpen geri çağrısının yazdığı';
        await flush();

        expect(fire(modal, 'hide.bs.modal').defaultPrevented).toBe(false);
    });

    it('açılıştan SONRA biten eşzamansız doldurma (bütçe kalemi araması) da kirli saymaz', async () => {
        const { modal, form } = modalForm('<input name="Title" value=""><select name="LineId"><option value=""></option><option value="7">Kalem</option></select>');
        guard.watch(form, { modal });
        await open(modal);

        form.querySelector('select').value = '7';
        fire(form.querySelector('input'), 'keydown', { key: 'Escape' });

        expect(fire(modal, 'hide.bs.modal').defaultPrevented).toBe(false);
    });

    it('kirliyken hide engellenir ve ortak onay açılır; "Değişiklikleri at" → koruma temizlenir ve pencere kapatılır', async () => {
        const { modal, form } = modalForm();
        const g = guard.watch(form, { modal });
        await open(modal);
        type(form.querySelector('input'), 'Yeni gider');

        expect(fire(modal, 'hide.bs.modal').defaultPrevented).toBe(true);
        expect(window.apya.confirm).toHaveBeenCalledTimes(1);
        expect(hide).not.toHaveBeenCalled();

        answer(true);
        await flush();

        expect(g.isDirty()).toBe(false);
        expect(window.bootstrap.Modal.getInstance).toHaveBeenCalledWith(modal);
        expect(hide).toHaveBeenCalledTimes(1);
        // Programatik kapanış yeniden sorulmaz.
        expect(fire(modal, 'hide.bs.modal').defaultPrevented).toBe(false);
    });

    it('"Düzenlemeye devam et" → pencere açık kalır, yazı durur', async () => {
        const { modal, form } = modalForm();
        const g = guard.watch(form, { modal });
        await open(modal);
        type(form.querySelector('input'), 'Yeni gider');

        fire(modal, 'hide.bs.modal');
        answer(false);
        await flush();

        expect(hide).not.toHaveBeenCalled();
        expect(g.isDirty()).toBe(true);
        expect(form.querySelector('input').value).toBe('Yeni gider');
    });

    it('açık modal formu kirliyken Geri / yenileme uyarır (RES-08); kapandıktan sonra uyarmaz', async () => {
        const { modal, form } = modalForm();
        guard.watch(form, { modal });
        await open(modal);
        type(form.querySelector('input'), 'Yeni gider');
        expect(leaveBlocked()).toBe(true);

        modal.classList.remove('show');
        fire(modal, 'hidden.bs.modal');

        expect(guard.isDirty()).toBe(false);
        expect(leaveBlocked()).toBe(false);
    });

    it('modal kapalıyken koruma sayılmaz (elle yazılmış, DOM\'da kalan pencere)', async () => {
        const { modal, form } = modalForm();
        const g = guard.watch(form, { modal });

        type(form.querySelector('input'), 'açılmadan yazıldı');

        expect(g.isDirty()).toBe(false);
        expect(leaveBlocked()).toBe(false);
    });

    it('yeniden açılışta temel yeniden alınır: önceki oturumun yazısı kirli saymaz', async () => {
        const { modal, form } = modalForm();
        const g = guard.watch(form, { modal });
        await open(modal);
        type(form.querySelector('input'), 'ilk açılış');
        fire(modal, 'hidden.bs.modal');

        await open(modal);
        fire(form.querySelector('input'), 'pointerdown');

        expect(g.isDirty()).toBe(false);
    });

    it('dispose: true → kapanınca kayıttan düşer (ABP kabı DOM\'dan silinse de)', async () => {
        const { modal, form } = modalForm();
        const first = guard.watch(form, { modal, dispose: true });
        await open(modal);
        type(form.querySelector('input'), 'Yeni gider');

        // ABP ModalManager kabı jQuery aşamasında siler; yerel olay kopuk öğede üretilir.
        modal.remove();
        fire(modal, 'hidden.bs.modal');
        document.body.appendChild(modal);

        expect(guard.watch(form, { modal, dispose: true })).not.toBe(first);
    });

    it('iç içe modalın olayı dış modalın korumasını etkilemez', async () => {
        const { modal, form } = modalForm('<input name="Title" value=""><div class="modal" id="inner"></div>');
        const g = guard.watch(form, { modal });
        await open(modal);
        type(form.querySelector('input'), 'Yeni gider');

        fire(document.getElementById('inner'), 'hidden.bs.modal');
        expect(g.isDirty()).toBe(true);

        expect(fire(document.getElementById('inner'), 'hide.bs.modal').defaultPrevented).toBe(false);
    });

    it('zaten gösterilen pencereye bağlanılırsa açık sayılır', () => {
        const { modal, form } = modalForm();
        modal.classList.add('show');
        const g = guard.watch(form, { modal });

        type(form.querySelector('input'), 'Yeni gider');

        expect(g.isDirty()).toBe(true);
    });
});

describe('ABP modalları: $.fn.needConfirmationOnUnsavedClose ortak korumaya devredildi (RSP-05)', () => {
    function abpModal(inner) {
        document.body.innerHTML = `<div class="modal" id="m"><form id="f">${inner}</form></div>`;
        window.bootstrap = { Modal: { getInstance: () => ({ hide: vi.fn() }) } };
        return { modal: document.getElementById('m'), form: document.getElementById('f') };
    }

    async function open(modal) {
        modal.classList.add('show');
        fire(modal, 'shown.bs.modal');
        await flush();
    }

    it('jQuery yokken eklenti tanımlanmaz, dosya hatasız yüklenir', () => {
        expect(window.jQuery).toBeUndefined();
        expect(typeof guard.watch).toBe('function');
    });

    it('eklenti ABP ile aynı ad ve imzayla tanımlanır, zincirlenebilir', async () => {
        await load({ jquery: true });
        const { modal, form } = abpModal('<input name="Title" value="">');

        const $form = $(form);
        expect($form.needConfirmationOnUnsavedClose($(modal))).toBe($form);
    });

    it('tutar maskeli formda dokunmadan Esc: onay ÇIKMAZ; yazdıktan sonra çıkar (gerçek apya-money-input.js)', async () => {
        await load({ jquery: true });
        const { modal, form } = abpModal('<input name="Expense.Title" value=""><input name="Expense.Amount" data-money-input value="0,00">');
        $(form).needConfirmationOnUnsavedClose($(modal));

        // ABP'nin eski kontrolü tam burada yanılıyordu: shown'da maske adı gizli alana taşır
        // ve ham değeri ("0") oraya yazar — sunucunun bastığı "0,00"dan farklı.
        await open(modal);
        const hidden = form.querySelector('input[type="hidden"][name="Expense.Amount"]');
        expect(hidden.value).toBe('0');

        fire(form.querySelector('[name="Expense.Title"]'), 'keydown', { key: 'Escape' });
        expect(fire(modal, 'hide.bs.modal').defaultPrevented).toBe(false);

        type(form.querySelector('[name="Expense.Title"]'), 'Kırtasiye');
        expect(fire(modal, 'hide.bs.modal').defaultPrevented).toBe(true);
        expect(window.apya.confirm).toHaveBeenCalledWith(expect.objectContaining({ title: TITLE, confirmText: DISCARD, cancelText: STAY }));
    });

    it('abp-ajax-success sonrası kapanış sorulmaz (kaydedildi)', async () => {
        await load({ jquery: true });
        const { modal, form } = abpModal('<input name="Title" value="">');
        $(form).needConfirmationOnUnsavedClose($(modal));
        await open(modal);
        type(form.querySelector('input'), 'Yeni gider');
        expect(guard.isDirty()).toBe(true);

        fire(form, 'abp-ajax-success');

        expect(fire(modal, 'hide.bs.modal').defaultPrevented).toBe(false);
        expect(leaveBlocked()).toBe(false);
    });

    it('birden çok form varsa kapsam modalın kendisidir', async () => {
        await load({ jquery: true });
        document.body.innerHTML = '<div class="modal" id="m"><form><input name="A" value=""></form><form><input name="B" value=""></form></div>';
        const modal = document.getElementById('m');
        $(modal.querySelectorAll('form')).needConfirmationOnUnsavedClose($(modal));
        await open(modal);

        type(modal.querySelector('[name="B"]'), 'x');

        expect(guard.isDirty(modal)).toBe(true);
    });
});

/* Kablolama (kaynak metni pin — errorChannel.wiring deseni). */
describe('kablolama: metinler ve oturum penceresi', () => {
    const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
    const shared = path.resolve(web, '..', 'Apya.Platform.Domain.Shared', 'Localization', 'Platform');
    const source = readFileSync(path.join(web, 'wwwroot', 'js', 'apya-dirty-guard.js'), 'utf8');
    const trRaw = readFileSync(path.join(shared, 'tr.json'), 'utf8');
    const enRaw = readFileSync(path.join(shared, 'en.json'), 'utf8');
    const tr = JSON.parse(trRaw).texts;
    const en = JSON.parse(enRaw).texts;
    const count = (text, needle) => text.split(needle).length - 1;

    const pairs = [];
    const re = /\btext\(\s*'(Common:Unsaved:[^']+)'\s*,\s*'([^']*)'/g;
    let m;
    while ((m = re.exec(source))) { pairs.push([m[1], m[2]]); }

    it('beş metin ortak "kaydedilmemiş değişiklik" ailesinden', () => {
        expect(pairs.map((p) => p[0]).sort()).toEqual([
            'Common:Unsaved:Body', 'Common:Unsaved:Discard', 'Common:Unsaved:LeaveConfirm', 'Common:Unsaved:Stay', 'Common:Unsaved:Title'
        ]);
    });

    it.each(pairs)('%s: JS yedeği tr.json ile aynı, en.json\'da karşılığı var', (key, fallback) => {
        expect(tr[key]).toBe(fallback);
        expect(en[key]).toBeTruthy();
        expect(en[key]).not.toBe(key);
    });

    it.each([...pairs.map((p) => p[0]), 'Common:Unsaved:Badge'])('%s: her dosyada tam bir kez', (key) => {
        expect(count(trRaw, `"${key}":`)).toBe(1);
        expect(count(enRaw, `"${key}":`)).toBe(1);
    });

    it('React penceresiyle (UnsavedChangesDialog) aynı cümleler', () => {
        expect([tr['Common:Unsaved:Title'], tr['Common:Unsaved:Body'], tr['Common:Unsaved:Stay'], tr['Common:Unsaved:Discard'], tr['Common:Unsaved:LeaveConfirm']])
            .toEqual([TITLE, BODY, STAY, DISCARD, LEAVE_CONFIRM]);
        expect(tr['Common:Unsaved:Badge']).toBe('Kaydedilmemiş değişiklik var');
    });

    it('tarayıcının yerel onay penceresi kullanılmaz; yönlendirme çıplak location ile', () => {
        expect(source).not.toMatch(/window\.confirm\b/);
        expect(source).not.toMatch(/(^|[^.\w])confirm\(/m);
        expect(count(source, 'location.assign(')).toBe(1);
        expect(source).not.toContain('window.location');
    });

    it('global demette ajax-error-detail.js ve ortak onaydan SONRA', () => {
        const module = readFileSync(path.join(web, 'PlatformWebModule.cs'), 'utf8');
        const at = (file) => module.indexOf(`bundle.AddFiles("${file}")`);

        expect(at('/js/apya-dirty-guard.js')).toBeGreaterThan(at('/js/ajax-error-detail.js'));
        expect(at('/js/apya-dirty-guard.js')).toBeGreaterThan(at('/js/apya-confirm.js'));
        expect(at('/js/apya-confirm.js')).toBeGreaterThan(0);
    });

    it('oturum penceresi: "Giriş sayfasına git" ve "Sayfayı yenile" ayrılıştan hemen ÖNCE izin verir', () => {
        const errorDetail = readFileSync(path.join(web, 'wwwroot', 'js', 'ajax-error-detail.js'), 'utf8').replace(/\r\n/g, '\n');

        expect(errorDetail).toMatch(/allowLeave\(\);\n\s+location\.assign\(loginUrl\(\)\);/);
        expect(errorDetail).toMatch(/allowLeave\(\);\n\s+location\.reload\(\);/);
    });

    it('rozet ve yapışkan kaydet çubuğu ortak stilde', () => {
        const css = readFileSync(path.join(web, 'wwwroot', 'css', 'apya-shell.css'), 'utf8').replace(/\r\n/g, '\n');

        expect(css).toContain('.apya-dirty-badge { display: none; }\n.is-dirty .apya-dirty-badge { display: inline-flex; }');
        expect(css).toMatch(/\.apya-navedit-savebar \{\n {4}position: sticky;\n {4}bottom: 0;/);
        expect(css).toMatch(/html\[data-mobile-shell="tabs"\] \.apya-navedit-savebar \{\n {8}bottom: var\(--apya-mobile-tabs-h, 65px\);/);
    });
});
