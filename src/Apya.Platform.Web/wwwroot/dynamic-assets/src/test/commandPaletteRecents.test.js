import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

// wwwroot/js/command-palette.js jQuery hazır olunca kurulur; Ctrl K ile açılır. X-02 · paletten açılan kayıt
// "SON AÇILANLAR" grubuna girer (kullanıcıya özel anahtar), sorgu boşken en üstte görünür.
let navigated = [];

beforeAll(async () => {
    // jQuery yalnız hazır kuyruğu ve tetikleyici temsilcisi için: küçük bir sahte yeter.
    window.$ = window.jQuery = (arg) => (typeof arg === 'function' ? arg() : { on: () => {} });
    window.abp = { currentUser: { id: 'u1', tenantId: null } };
    window.apya = {
        platform: {
            search: {
                recordSearch: {
                    search: () => Promise.resolve([{ kind: 'task', title: 'Saha ölçümü', url: '/Tasks/Detail/1', subtitle: 'Görev' }])
                }
            }
        }
    };
    await import('../../../js/command-palette.js');
});

beforeEach(() => { localStorage.clear(); navigated = []; });

function openPalette() {
    const press = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
    const isOpen = () => Boolean(document.querySelector('.apya-command-palette-overlay.open'));
    if (isOpen()) { press(); } // Ctrl K aç/kapa: önceki testten açık kaldıysa önce kapat
    press();
}
const groups = () => [...document.querySelectorAll('.apya-command-palette-group')].map((g) => g.textContent);
const labels = () => [...document.querySelectorAll('.apya-command-palette-item-label')].map((g) => g.textContent);

describe('komut paleti: son açılan kayıtlar (X-02)', () => {
    it('sorgu boşken kullanıcının son açtığı kayıtlar en üstte', () => {
        localStorage.setItem('apya.cp.recent.host.u1', JSON.stringify([
            { label: 'Saha ölçümü', href: '/Tasks/Detail/1', icon: 'fa fa-list-check', section: 'Görev' }
        ]));
        localStorage.setItem('apya.cp.recent.host.u2', JSON.stringify([
            { label: 'Başkasının kaydı', href: '/Tasks/Detail/2', icon: 'fa fa-list-check', section: 'Görev' }
        ]));

        openPalette();

        expect(groups()[0]).toBe('SON AÇILANLAR');
        expect(labels()).toContain('Saha ölçümü');
        expect(labels()).not.toContain('Başkasının kaydı');
    });

    it('depolama bozuksa palet yine açılır', () => {
        localStorage.setItem('apya.cp.recent.host.u1', '{bozuk');
        openPalette();
        expect(groups()).not.toContain('SON AÇILANLAR');
    });
});
