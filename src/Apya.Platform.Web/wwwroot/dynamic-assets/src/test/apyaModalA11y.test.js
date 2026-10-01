import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// wwwroot/js/apya-modal-a11y.js bir IIFE: API'si yok, belge düzeyinde Bootstrap'in yerel
// olaylarını dinler (show.bs.modal) ve modal öğesine hidden.bs.modal dinleyicisi bağlar.
// jQuery gerektirmez. Olaylar gerçeğiyle aynı adla, kabarcıklı olarak üretilir.

beforeAll(async () => {
    await import('../../../js/apya-modal-a11y.js');
});

beforeEach(() => {
    document.body.innerHTML = '';
});

function page(markup) {
    document.body.innerHTML = markup;
    return (id) => document.getElementById(id);
}

const show = (modal) => modal.dispatchEvent(new Event('show.bs.modal', { bubbles: true, cancelable: true }));
const hidden = (modal) => modal.dispatchEvent(new Event('hidden.bs.modal', { bubbles: true }));

/** Bootstrap'in yaptığı: odak pencereye geçer. */
function open(modal) {
    show(modal);
    const first = modal.querySelector('input, button');
    if (first) { first.focus(); }
}

/** ABP ModalManager: kap jQuery aşamasında DOM'dan silinir, yerel olay kopuk öğede üretilir. */
function closeAbp(modal) {
    modal.remove();
    hidden(modal);
}

const MODAL = '<div class="modal" id="m" role="dialog" aria-modal="true"><h5 class="modal-title">Yeni Gider</h5><input id="first"></div>';

describe('erişilebilir ad (RSP-05.4)', () => {
    it('ad yoksa başlığa id verilir ve modala aria-labelledby yazılır', () => {
        const $ = page(MODAL);

        show($('m'));

        const title = $('m').querySelector('.modal-title');
        expect(title.id).toMatch(/^apya-modal-title-\d+$/);
        expect($('m').getAttribute('aria-labelledby')).toBe(title.id);
    });

    it('her pencere kendi kimliğini alır', () => {
        const $ = page(MODAL + MODAL.replace('id="m"', 'id="n"').replace('id="first"', 'id="second"'));

        show($('m'));
        show($('n'));

        expect($('m').getAttribute('aria-labelledby')).not.toBe($('n').getAttribute('aria-labelledby'));
    });

    it('başlığın id\'si varsa o kullanılır', () => {
        const $ = page('<div class="modal" id="m"><h5 class="modal-title" id="GiderBaslik">Yeni Gider</h5></div>');

        show($('m'));

        expect($('m').getAttribute('aria-labelledby')).toBe('GiderBaslik');
    });

    it.each([
        ['aria-labelledby', '<div class="modal" id="m" aria-labelledby="Kendi"><h5 class="modal-title">Çağrı</h5></div>'],
        ['aria-label', '<div class="modal" id="m" aria-label="Çağrı ekle"><h5 class="modal-title">Çağrı</h5></div>']
    ])('ad zaten varsa (%s) dokunulmaz', (attribute, markup) => {
        const $ = page(markup);
        const before = $('m').outerHTML;

        show($('m'));

        expect($('m').outerHTML).toBe(before);
    });

    it('başlık yoksa dokunulmaz', () => {
        const $ = page('<div class="modal" id="m"><p>Gövde</p></div>');

        show($('m'));

        expect($('m').hasAttribute('aria-labelledby')).toBe(false);
    });

    it('modal olmayan öğenin olayına karışılmaz', () => {
        const $ = page('<div class="offcanvas" id="m"><h5 class="modal-title">x</h5></div>');

        show($('m'));

        expect($('m').hasAttribute('aria-labelledby')).toBe(false);
    });
});

describe('odak iadesi (RSP-05.3)', () => {
    it('ABP modalı kapanınca (kap DOM\'dan silinir) odak açan düğmeye döner', () => {
        const $ = page('<button id="new">Yeni Gider</button>' + MODAL);
        $('new').focus();
        const modal = $('m');

        open(modal);
        expect(document.activeElement).toBe($('first'));
        closeAbp(modal);

        expect(document.activeElement).toBe($('new'));
    });

    it('DOM\'da kalan pencerede odak kapanan pencerenin içindeyse de döner', () => {
        const $ = page('<button id="new">Fikir ekle</button>' + MODAL);
        $('new').focus();

        open($('m'));
        hidden($('m'));

        expect(document.activeElement).toBe($('new'));
    });

    it('pencere odak <body>\'deyken (AJAX ile gecikmeli) açıldıysa son dış odak tetikleyicidir', () => {
        const $ = page('<button id="new">Yeni Gider</button><div class="swal2-container"><button id="swal">Tamam</button></div>' + MODAL);
        $('new').focus();
        // SweetAlert ve modal içi odak "dış odak" sayılmaz.
        $('swal').focus();
        $('swal').blur();
        expect(document.activeElement).toBe(document.body);
        const modal = $('m');

        open(modal);
        closeAbp(modal);

        expect(document.activeElement).toBe($('new'));
    });

    it('tetikleyici kapalı açılır menünün öğesiyse menüyü açan düğmeye döner (tablo "İşlemler › Düzenle")', () => {
        const $ = page(
            '<div class="dropdown"><button id="actions" data-bs-toggle="dropdown">İşlemler</button>' +
            '<ul class="dropdown-menu"><li><a class="dropdown-item" id="edit" href="#" tabindex="0">Düzenle</a></li></ul></div>' + MODAL);
        $('edit').focus();
        const modal = $('m');

        open(modal);
        closeAbp(modal);

        expect(document.activeElement).toBe($('actions'));
    });

    it('menü hâlâ açıksa öğenin kendisine döner', () => {
        const $ = page(
            '<div class="dropdown"><button id="actions" data-bs-toggle="dropdown">İşlemler</button>' +
            '<ul class="dropdown-menu show"><li><a class="dropdown-item" id="edit" href="#" tabindex="0">Düzenle</a></li></ul></div>' + MODAL);
        $('edit').focus();
        const modal = $('m');

        open(modal);
        closeAbp(modal);

        expect(document.activeElement).toBe($('edit'));
    });

    it('odak bilerek başka bir öğeye taşınmışsa (sayfanın onClose\'u, Bootstrap\'in kendi iadesi) çalınmaz', () => {
        const $ = page('<button id="new">Yeni Gider</button><input id="search">' + MODAL);
        $('new').focus();
        const modal = $('m');

        open(modal);
        modal.remove();
        $('search').focus();
        hidden(modal);

        expect(document.activeElement).toBe($('search'));
    });

    it('tetikleyici DOM\'da değilse (satır yeniden çizildi) dokunulmaz', () => {
        const $ = page('<button id="new">Düzenle</button>' + MODAL);
        const trigger = $('new');
        trigger.focus();
        const modal = $('m');

        open(modal);
        trigger.remove();
        closeAbp(modal);

        expect(document.activeElement).toBe(document.body);
    });

    it('aynı pencere ikinci kez açılınca tek dinleyici, SON tetikleyici kullanılır', () => {
        const $ = page('<button id="a">Fikir ekle</button><button id="b">Fikir ekle (boş durum)</button>' + MODAL);
        const modal = $('m');
        let added = 0;
        const original = modal.addEventListener.bind(modal);
        modal.addEventListener = (type, ...rest) => { if (type === 'hidden.bs.modal') { added++; } return original(type, ...rest); };

        $('a').focus();
        open(modal);
        hidden(modal);
        expect(document.activeElement).toBe($('a'));

        $('b').focus();
        open(modal);
        hidden(modal);

        expect(document.activeElement).toBe($('b'));
        expect(added).toBe(1);
    });

    it('iç içe pencere: tetikleyici dış pencerenin içindeki öğedir; iç pencerenin olayı dış pencereyi etkilemez', () => {
        const $ = page(
            '<button id="new">Görev</button>' +
            '<div class="modal" id="outer"><h5 class="modal-title">Görev</h5><button id="sub">Alt görev ekle</button>' +
            '<div class="modal" id="inner"><h5 class="modal-title">Alt görev</h5><input id="innerFirst"></div></div>');
        $('new').focus();
        show($('outer'));
        $('sub').focus();

        show($('inner'));
        $('innerFirst').focus();
        hidden($('inner'));

        // İç pencere kapandı: odak dış pencerenin düğmesine döner, sayfadaki düğmeye DEĞİL.
        expect(document.activeElement).toBe($('sub'));
    });

    it('tetikleyicisi bilinmeyen pencerede hiçbir şeye odaklanılmaz', async () => {
        const $ = page(MODAL);
        document.body.focus();
        const modal = $('m');

        // Önceki testlerin "son dış odak" öğeleri DOM'dan kalktı (isConnected false).
        show(modal);
        closeAbp(modal);

        expect(document.activeElement).toBe(document.body);
    });
});

/* Kablolama (kaynak metni pin): ortak parçaların global demetteki sırası. */
describe('global demet sırası', () => {
    const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
    const module = readFileSync(path.join(web, 'PlatformWebModule.cs'), 'utf8');
    const at = (file) => module.indexOf(`bundle.AddFiles("${file}")`);

    it('kota sarmalayıcısı → onay → meşgul kilidi → kirli-form koruması → modal a11y', () => {
        const order = ['/js/ajax-error-detail.js', '/js/apya-quota-upsell.js', '/js/apya-confirm.js', '/js/apya-busy.js', '/js/apya-dirty-guard.js', '/js/apya-modal-a11y.js'];
        const positions = order.map(at);

        positions.forEach((position) => expect(position).toBeGreaterThan(0));
        expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    });

    it.each(['apya-confirm.js', 'apya-busy.js', 'apya-dirty-guard.js', 'apya-modal-a11y.js'])('%s diskte var (eksik dosya demeti düşürür)', (file) => {
        expect(readFileSync(path.join(web, 'wwwroot', 'js', file), 'utf8').length).toBeGreaterThan(0);
    });
});
