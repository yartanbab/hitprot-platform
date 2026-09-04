import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

// wwwroot/js/apya-money-input.js bir IIFE; yüklenince window.apya.moneyInput'u kurar.
//
// Buradaki asıl sözleşme GİZLİ ALANA YAZILAN HAM DEĞERİN BİÇİMİ. Uygulama formu
// tr-TR ile bağlar (nokta = binlik). ASP.NET yalnız __Invariant işaretçisi olan
// alanı invariant çözer. Maske eskiden DAİMA noktalı yazıyordu; işaretçisi olmayan
// alanda bu 1000× sapma demekti (1234.56 -> 123456). Artık işaretçi aranıyor.

let mask;

beforeAll(async () => {
    await import('../../../js/apya-money-input.js');
    mask = window.apya.moneyInput;
});

beforeEach(() => {
    document.body.innerHTML = '';
});

function buildForm(inner) {
    document.body.innerHTML = '<form id="f">' + inner + '</form>';
    return document.getElementById('f');
}

function upgradeFirst(inner) {
    const form = buildForm(inner);
    const el = form.querySelector('input[data-money-input]');
    mask.upgrade(el);
    return { form, el, hidden: form.querySelector('input[type="hidden"][name]') };
}

function type(el, text) {
    el.value = text;
    el.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('görünür biçimlendirme', () => {
    it('binlik ayracı nokta, ondalık virgül', () => {
        expect(mask.format('1234567,89')).toBe('1.234.567,89');
    });

    it('ondalık hane varsayılan 2 ile kırpılır', () => {
        expect(mask.format('12,3456')).toBe('12,34');
    });

    it('data-decimals ile hane sınırı genişler (kur 6 hane)', () => {
        expect(mask.format('34,215678', 6)).toBe('34,215678');
    });

    it('gruplama kapatılabilir', () => {
        expect(mask.format('1234,5', 2, false)).toBe('1234,5');
    });

    it('eksi işareti korunur, baştaki sıfırlar atılır', () => {
        expect(mask.format('-0001234,5')).toBe('-1.234,5');
    });

    it('yalnız virgülle başlayan girdi 0 ile tamamlanır', () => {
        expect(mask.format(',5')).toBe('0,5');
    });
});

describe('ayrıştırma', () => {
    it('maskeli değeri sayıya çevirir', () => {
        expect(mask.parse('1.234.567,89')).toBe(1234567.89);
    });

    it('ilk değerde nokta ondalık sayılır (invariant sunucu değeri)', () => {
        expect(mask.parseInitial('1000.5')).toBe(1000.5);
    });

    it('ilk değerde virgül varsa tr-maske sayılır', () => {
        expect(mask.parseInitial('1.000,5')).toBe(1000.5);
    });
});

describe('gizli alanın biçimi — __Invariant işaretçisine göre', () => {
    it('işaretçi VARSA invariant (noktalı) yazar', () => {
        const { el, hidden } = upgradeFirst(
            '<input name="Expense.Amount" data-money-input />' +
            '<input type="hidden" name="__Invariant" value="Expense.Amount" />'
        );
        type(el, '1234,56');
        expect(el.value).toBe('1.234,56');
        expect(hidden.value).toBe('1234.56');
    });

    it('işaretçi YOKSA tr (virgüllü) yazar — nokta binlik sayılacağı için', () => {
        const { el, hidden } = upgradeFirst('<input name="Expense.Amount" data-money-input />');
        type(el, '1234,56');
        expect(el.value).toBe('1.234,56');
        expect(hidden.value).toBe('1234,56');
    });

    it('işaretçi BAŞKA alan içinse eşleşmez', () => {
        const { hidden, el } = upgradeFirst(
            '<input name="Expense.Amount" data-money-input />' +
            '<input type="hidden" name="__Invariant" value="Expense.Rate" />'
        );
        type(el, '1234,56');
        expect(hidden.value).toBe('1234,56');
    });

    it('tam sayıda her iki dal da aynı değeri yazar', () => {
        const a = upgradeFirst('<input name="A" data-money-input />');
        type(a.el, '1500');
        expect(a.hidden.value).toBe('1500');
    });

    it('alan boşaltılınca gizli alan da boşalır', () => {
        const { el, hidden } = upgradeFirst('<input name="A" data-money-input />');
        type(el, '1234,56');
        type(el, '');
        expect(hidden.value).toBe('');
    });
});

describe('alanın yükseltilmesi', () => {
    it('name görünür alandan gizli alana taşınır', () => {
        const { el, hidden } = upgradeFirst('<input name="Expense.Amount" type="number" data-money-input />');
        expect(el.hasAttribute('name')).toBe(false);
        expect(hidden.name).toBe('Expense.Amount');
        expect(el.getAttribute('type')).toBe('text');
        expect(el.getAttribute('inputmode')).toBe('decimal');
    });

    it('sunucudan gelen invariant ilk değer maskelenir', () => {
        const { el, hidden } = upgradeFirst(
            '<input name="A" value="1234.5" data-money-input />' +
            '<input type="hidden" name="__Invariant" value="A" />'
        );
        expect(el.value).toBe('1.234,5');
        expect(hidden.value).toBe('1234.5');
    });

    it('sunucudan gelen tr ilk değer maskelenir', () => {
        const { el, hidden } = upgradeFirst('<input name="A" value="1234,5" data-money-input />');
        expect(el.value).toBe('1.234,5');
        expect(hidden.value).toBe('1234,5');
    });

    it('sunucunun bastığı ondalık hane korunur ("0,00" -> "0", olmasın)', () => {
        // abp-input decimal alanı type="text" + value="0,00" basıyor.
        const { el, hidden } = upgradeFirst('<input name="A" value="0,00" data-money-input />');
        expect(el.value).toBe('0,00');
        expect(hidden.value).toBe('0');
    });

    it('boş alan boş kalır', () => {
        const { el, hidden } = upgradeFirst('<input name="A" value="" data-money-input />');
        expect(el.value).toBe('');
        expect(hidden.value).toBe('');
    });

    it('data-decimals ve data-group alan başına okunur', () => {
        const { el, hidden } = upgradeFirst(
            '<input name="R" data-money-input data-decimals="6" data-group="false" />'
        );
        type(el, '34,215678');
        expect(el.value).toBe('34,215678');
        expect(hidden.value).toBe('34,215678');
    });

    it('min="0" eksi işaretini reddeder', () => {
        // Alan type="text"e döndüğü için tarayıcı min'i uygulayamıyor; name de
        // gizli alana taşındığından jQuery validate devrede değil. Kısıtı maske sürdürür.
        const { el, hidden } = upgradeFirst('<input name="A" min="0" data-money-input />');
        type(el, '-500');
        expect(el.value).toBe('500');
        expect(hidden.value).toBe('500');
    });

    it('min yoksa eksi değer korunur', () => {
        const { el, hidden } = upgradeFirst('<input name="A" data-money-input />');
        type(el, '-500');
        expect(el.value).toBe('-500');
        expect(hidden.value).toBe('-500');
    });

    it('min negatifse eksi değer korunur', () => {
        const { el } = upgradeFirst('<input name="A" min="-1000" data-money-input />');
        type(el, '-500');
        expect(el.value).toBe('-500');
    });

    it('kur alanı 6 hane taşır (decimal(18,6) kırpılmaz)', () => {
        const { el, hidden } = upgradeFirst(
            '<input name="ExchangeRate.Rate" data-money-input data-decimals="6" />'
        );
        type(el, '34,215678');
        expect(el.value).toBe('34,215678');
        expect(hidden.value).toBe('34,215678');
    });

    it('aynı alan iki kez yükseltilmez', () => {
        const form = buildForm('<input name="A" data-money-input />');
        const el = form.querySelector('input[data-money-input]');
        mask.upgrade(el);
        mask.upgrade(el);
        expect(form.querySelectorAll('input[type="hidden"]').length).toBe(1);
    });

    it('shown.bs.modal ile açılan içerik taranır', () => {
        // Tutar alanlarının çoğu AJAX ile gelen ABP modallarında; açılıştaki
        // scan(document) onları göremiyor.
        document.body.innerHTML =
            '<div id="m" class="modal"><form><input name="A" data-money-input /></form></div>';
        const modal = document.getElementById('m');
        modal.dispatchEvent(new Event('shown.bs.modal', { bubbles: true }));
        const el = modal.querySelector('input[data-money-input]');
        expect(el.__apyaMoney).toBe(true);
        expect(el.hasAttribute('name')).toBe(false);
    });

    it('scan kapsayıcıdaki tüm alanları yükseltir', () => {
        const form = buildForm(
            '<input name="A" data-money-input /><input name="B" data-money-input /><input name="C" />'
        );
        mask.scan(form);
        expect(form.querySelectorAll('input[type="hidden"]').length).toBe(2);
    });
});

// name taşımayan, değeri JS ile API'ye giden alanlar (hibe ekranları).
describe('programatik okuma/yazma', () => {
    it('setValue sayıyı maskeleyerek yazar', () => {
        const { el } = upgradeFirst('<input id="X" data-money-input />');
        mask.setValue(el, 1234567.5);
        expect(el.value).toBe('1.234.567,5');
    });

    it('setValue null/boş değeri temizler', () => {
        const { el } = upgradeFirst('<input id="X" data-money-input />');
        mask.setValue(el, 1234);
        mask.setValue(el, null);
        expect(el.value).toBe('');
    });

    it('setValue alanın hane/grup ayarına uyar', () => {
        const { el } = upgradeFirst('<input id="R" data-money-input data-decimals="6" data-group="false" />');
        mask.setValue(el, 34.215678);
        expect(el.value).toBe('34,215678');
    });

    it('getValue maskeli metni sayıya çevirir', () => {
        const { el } = upgradeFirst('<input id="X" data-money-input />');
        type(el, '1234567,89');
        expect(mask.getValue(el)).toBe(1234567.89);
    });

    it('getValue boş alanda null döner', () => {
        const { el } = upgradeFirst('<input id="X" data-money-input />');
        expect(mask.getValue(el)).toBe(null);
    });

    it('getValue maskesiz alanda ham sayıyı okur', () => {
        buildForm('<input id="Y" value="12" />');
        expect(mask.getValue(document.getElementById('Y'))).toBe(12);
    });

    it('setValue -> getValue gidiş dönüşü değeri korur', () => {
        const { el } = upgradeFirst('<input id="X" data-money-input />');
        mask.setValue(el, 987654.32);
        expect(mask.getValue(el)).toBe(987654.32);
    });
});
