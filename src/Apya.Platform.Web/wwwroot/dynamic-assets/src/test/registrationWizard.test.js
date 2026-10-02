import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Pages/Account/RegistrationRequest.js bir IIFE: oturumsuz kayıt talebi formunu dört
// adımlı sihirbaza çevirir. Bu dosya 2026-09-28 UX denetimindeki ACC-08'i kilitler:
//   • adım hafızası — yalnız adım NUMARASI history.state'te; kişisel veri HİÇBİR depoya
//     (sessionStorage / localStorage / çerez) yazılmaz (ürün kararı K2);
//   • ayrılma uyarısı — formda yazı varken beforeunload iptal edilir, formun kendi
//     gönderiminde edilmez.
// Betik içe aktarıldığı anda çalışır; her vaka kendi DOM'unu kurup modülü yeniden yükler.

const STEP_KEY = 'apyaWizardStep';

function markup({ serverErrorInPanel = 0, companyName = '' } = {}) {
    const error = (panel) => (serverErrorInPanel === panel
        ? '<span class="field-validation-error" data-valmsg-for="Input.CompanyName">Sunucu reddetti.</span>'
        : '<span class="field-validation-valid" data-valmsg-for="Input.CompanyName"></span>');

    return `
        <ol data-wizard-steps hidden>
            <li data-wizard-indicator="1"></li><li data-wizard-indicator="2"></li>
            <li data-wizard-indicator="3"></li><li data-wizard-indicator="4"></li>
        </ol>
        <form method="post" data-wizard-form>
            <input id="Website" name="Website" type="text">
            <input name="__RequestVerificationToken" type="hidden" value="jeton">

            <fieldset data-wizard-panel="1">
                <label class="apya-wiz__plan">
                    <input type="radio" id="plan-Standard" name="Input.RequestedPlan" value="Standard"
                           data-val="true" data-val-required="Paket seçin.">
                    <span class="apya-wiz__plan-name">Standart Paket</span>
                </label>
                <label class="apya-wiz__plan">
                    <input type="radio" id="plan-Corporate" name="Input.RequestedPlan" value="Corporate"
                           data-val="true" data-val-required="Paket seçin.">
                    <span class="apya-wiz__plan-name">Kurumsal Paket</span>
                </label>
                <span data-valmsg-for="Input.RequestedPlan"></span>
            </fieldset>

            <fieldset data-wizard-panel="2">
                <div class="apya-auth__field">
                    <label class="apya-auth__label">Kurum adı</label>
                    <input class="apya-auth__input" id="Input_CompanyName" name="Input.CompanyName" type="text"
                           value="${companyName}" data-val="true" data-val-required="Kurum adı gerekli.">
                    ${error(2)}
                </div>
                <div class="apya-auth__field">
                    <label class="apya-auth__label">Kurum türü</label>
                    <select class="apya-auth__input" id="Input_CompanyType" name="Input.CompanyType">
                        <option value="">Seçin</option><option value="Association">Dernek</option>
                    </select>
                </div>
            </fieldset>

            <fieldset data-wizard-panel="3">
                <div class="apya-auth__field">
                    <label class="apya-auth__label">Ad soyad</label>
                    <input class="apya-auth__input" id="Input_FullName" name="Input.FullName" type="text"
                           data-val="true" data-val-required="Ad soyad gerekli.">
                    <span data-valmsg-for="Input.FullName"></span>
                </div>
                <div class="apya-auth__field">
                    <label class="apya-auth__label">Not</label>
                    <textarea class="apya-auth__input" id="Input_Message" name="Input.Message"></textarea>
                </div>
            </fieldset>

            <fieldset data-wizard-panel="4">
                <dl data-wizard-summary hidden></dl>
                <input type="checkbox" id="AcceptKvkk" name="AcceptKvkk" value="true">
            </fieldset>

            <button type="button" data-wizard-back hidden>Geri</button>
            <button type="button" data-wizard-next hidden>İleri</button>
            <button type="submit" data-wizard-submit>Gönder</button>
        </form>`;
}

async function load(options) {
    document.body.innerHTML = markup(options);
    vi.resetModules();
    await import('../../../../Pages/Account/RegistrationRequest.js');
}

const $ = (selector) => document.querySelector(selector);
const form = () => $('[data-wizard-form]');

/** Ekranda görünen adım (gizli olmayan tek panel). */
function visibleStep() {
    const open = [...document.querySelectorAll('[data-wizard-panel]')].filter((p) => !p.hidden);
    expect(open).toHaveLength(1);
    return Number(open[0].getAttribute('data-wizard-panel'));
}

/** Kullanıcı yazıyormuş gibi: değer + kabaran input olayı. */
function typeInto(selector, value) {
    const field = $(selector);
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Tarayıcı geri yüklüyormuş gibi: değer yazılır, OLAY ÜRETİLMEZ. */
function restoreSilently(values) {
    Object.entries(values).forEach(([selector, value]) => {
        const field = $(selector);
        if (field.type === 'radio') { field.checked = value; } else { field.value = value; }
    });
}

function choosePlan() {
    const radio = $('#plan-Standard');
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
}

const next = () => $('[data-wizard-next]').click();
const back = () => $('[data-wizard-back]').click();

/** Tarayıcı sayfadan ayrılmayı kullanıcıya sorar mı? */
function leaveBlocked() {
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
}

beforeEach(() => {
    history.replaceState(null, '');
    sessionStorage.clear();
    localStorage.clear();
    // jsdom scrollIntoView'u uygulamaz; sihirbaz hatalı alana kaydırırken çağırır.
    Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
    // Bu vakanın örneği window'a dinleyici bağladı (beforeunload, pageshow). Alanlar
    // boşaltılıp input olayı yollanınca beforeunload sökülür; kalan pageshow dinleyicisi
    // boş formda etkisizdir — sonraki vakaya sızmaz.
    vi.useRealTimers();
    const current = form();
    if (current) {
        current.querySelectorAll('input, select, textarea').forEach((field) => {
            if (field.type === 'radio' || field.type === 'checkbox') { field.checked = false; } else { field.value = ''; }
        });
        current.dispatchEvent(new Event('input', { bubbles: true }));
    }
    expect(leaveBlocked()).toBe(false);
    document.body.innerHTML = '';
});

describe('adım hafızası', () => {
    it('açılışta 1. adım görünür, adım arayüzü açılır', async () => {
        await load();

        expect(visibleStep()).toBe(1);
        expect($('[data-wizard-steps]').hidden).toBe(false);
        expect($('[data-wizard-next]').hidden).toBe(false);
    });

    it('İleri / Geri adımı history.state\'e yazar; sayfanın kendi state\'i korunur', async () => {
        history.replaceState({ baska: 'deger' }, '');
        await load();

        choosePlan();
        next();
        expect(visibleStep()).toBe(2);
        expect(history.state).toEqual({ baska: 'deger', [STEP_KEY]: 2 });

        back();
        expect(visibleStep()).toBe(1);
        expect(history.state[STEP_KEY]).toBe(1);
    });

    it('eksik adımda İleri ilerletmez ve state\'e yazmaz', async () => {
        await load();

        next();

        expect(visibleStep()).toBe(1);
        expect(history.state).toBeNull();
        expect($('[data-valmsg-for="Input.RequestedPlan"]').textContent).toBe('Paket seçin.');
    });

    it('kişisel veri HİÇBİR depoya yazılmaz: yalnız adım numarası saklanır', async () => {
        const setItem = vi.spyOn(Storage.prototype, 'setItem');
        const cookieBefore = document.cookie;
        await load();

        choosePlan();
        next();
        typeInto('#Input_CompanyName', 'Gizli Kurum A.Ş.');
        next();
        typeInto('#Input_FullName', 'Ayşe Yılmaz');
        typeInto('#Input_Message', 'kişisel not');
        next();

        expect(visibleStep()).toBe(4);
        expect(setItem).not.toHaveBeenCalled();
        expect(sessionStorage.length).toBe(0);
        expect(localStorage.length).toBe(0);
        expect(document.cookie).toBe(cookieBefore);
        expect(history.state).toEqual({ [STEP_KEY]: 4 });
        expect(JSON.stringify(history.state)).not.toMatch(/Gizli Kurum|Ayşe|kişisel not/);
    });

    it('kayıtlı adım 3 ve önceki adımlar doluysa sihirbaz 3. adımda açılır', async () => {
        history.replaceState({ [STEP_KEY]: 3 }, '');
        document.body.innerHTML = markup({ companyName: 'Örnek Derneği' });
        restoreSilently({ '#plan-Standard': true });
        vi.resetModules();
        await import('../../../../Pages/Account/RegistrationRequest.js');

        expect(visibleStep()).toBe(3);
    });

    it('kayıtlı adım 3 ama 2. adımda zorunlu alan boşsa 2. adımda durur', async () => {
        history.replaceState({ [STEP_KEY]: 3 }, '');
        document.body.innerHTML = markup();
        restoreSilently({ '#plan-Standard': true });
        vi.resetModules();
        await import('../../../../Pages/Account/RegistrationRequest.js');

        expect(visibleStep()).toBe(2);
        // Geri yükleme sessizdir: kullanıcı henüz bir şey yapmadı, hata mesajı basılmaz.
        expect($('[data-valmsg-for="Input.CompanyName"]').textContent).toBe('');
    });

    it('yenilemede form boşaldıysa kayıtlı adım yok sayılır (1. adım)', async () => {
        history.replaceState({ [STEP_KEY]: 4 }, '');
        await load();

        expect(visibleStep()).toBe(1);
    });

    it('alanlar betikten SONRA geri yüklendiyse adım pageshow\'da yeniden değerlendirilir', async () => {
        history.replaceState({ [STEP_KEY]: 3 }, '');
        await load();
        expect(visibleStep()).toBe(1);

        restoreSilently({ '#plan-Standard': true, '#Input_CompanyName': 'Örnek Derneği' });
        window.dispatchEvent(new Event('pageshow'));

        expect(visibleStep()).toBe(3);
    });

    it('sunucu doğrulama hatası varken kayıtlı adım yok sayılır: hatalı alanın adımı kazanır', async () => {
        history.replaceState({ [STEP_KEY]: 4 }, '');
        document.body.innerHTML = markup({ serverErrorInPanel: 2, companyName: 'Örnek Derneği' });
        restoreSilently({ '#plan-Standard': true, '#Input_FullName': 'Ayşe Yılmaz' });
        vi.resetModules();
        await import('../../../../Pages/Account/RegistrationRequest.js');

        expect(visibleStep()).toBe(2);

        window.dispatchEvent(new Event('pageshow'));
        expect(visibleStep()).toBe(2);
    });
});

describe('ayrılma uyarısı', () => {
    it('boş formda uyarı yok; Input.* alanı dolunca var; boşalınca yine yok', async () => {
        await load();
        expect(leaveBlocked()).toBe(false);

        typeInto('#Input_CompanyName', 'Örnek Derneği');
        expect(leaveBlocked()).toBe(true);

        typeInto('#Input_CompanyName', '   ');
        expect(leaveBlocked()).toBe(false);
    });

    it('seçim listesi ve çok satırlı alan da veri sayılır', async () => {
        await load();

        const select = $('#Input_CompanyType');
        select.value = 'Association';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        expect(leaveBlocked()).toBe(true);

        select.value = '';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        expect(leaveBlocked()).toBe(false);

        typeInto('#Input_Message', 'not');
        expect(leaveBlocked()).toBe(true);
    });

    it('yalnız paket seçimi uyarı kurmaz', async () => {
        await load();

        choosePlan();

        expect(leaveBlocked()).toBe(false);
    });

    it('bal küpü (Website) ve AcceptKvkk tek başına uyarı kurmaz', async () => {
        await load();

        typeInto('#Website', 'https://bot.example');
        const kvkk = $('#AcceptKvkk');
        kvkk.checked = true;
        kvkk.dispatchEvent(new Event('change', { bubbles: true }));

        expect(leaveBlocked()).toBe(false);
    });

    it('sunucudan dolu dönen form olay beklemeden korunur', async () => {
        await load({ companyName: 'Örnek Derneği' });

        expect(leaveBlocked()).toBe(true);
    });

    it('tarayıcının sonradan geri yüklediği form pageshow\'da korunmaya başlar', async () => {
        await load();
        restoreSilently({ '#Input_CompanyName': 'Örnek Derneği' });
        expect(leaveBlocked()).toBe(false);

        window.dispatchEvent(new Event('pageshow'));

        expect(leaveBlocked()).toBe(true);
    });

    it('formun kendi gönderimi uyarıya takılmaz; gönderim iptal olduysa 1 sn sonra koruma geri gelir', async () => {
        await load();
        typeInto('#Input_CompanyName', 'Örnek Derneği');
        expect(leaveBlocked()).toBe(true);

        vi.useFakeTimers();
        form().dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

        expect(leaveBlocked()).toBe(false);

        vi.advanceTimersByTime(999);
        expect(leaveBlocked()).toBe(false);

        vi.advanceTimersByTime(1);
        expect(leaveBlocked()).toBe(true);
    });
});
