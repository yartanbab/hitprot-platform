import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';

// wwwroot/js/apya-activity.js bir IIFE: XHR/fetch'i sarmalar, etkileşimi ve gezinmeyi dinler.
// fetch, betik yüklenmeden ÖNCE sahte olmalı (betik o anki window.fetch'i sarmalar).
let pendingFetch = [];

beforeAll(async () => {
    window.fetch = vi.fn(() => new Promise((resolve) => { pendingFetch.push(resolve); }));
    await import('../../../js/apya-activity.js');
});

beforeEach(() => { vi.useFakeTimers(); pendingFetch = []; });
afterEach(() => { vi.useRealTimers(); document.body.innerHTML = ''; });

const bar = () => document.querySelector('.apya-activity');
const isActive = () => Boolean(bar() && bar().classList.contains('is-active'));

function button() {
    const b = document.createElement('button');
    b.textContent = 'Kaydet';
    document.body.appendChild(b);
    return b;
}

async function settle() {
    await Promise.resolve();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(0);
}

describe('apya-activity: kullanıcının tetiklediği istek', () => {
    it('tıklamadan sonra başlayan istek 250 ms sonra çubuğu ve düğme simgesini açar, bitince kapatır', async () => {
        const b = button();
        b.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        window.fetch('/api/app/task');

        await vi.advanceTimersByTimeAsync(100);
        expect(isActive()).toBe(false); // kısa istek titreşmesin

        await vi.advanceTimersByTimeAsync(200);
        expect(isActive()).toBe(true);
        expect(b.hasAttribute('data-apya-pending')).toBe(true);
        expect(b.getAttribute('aria-busy')).toBe('true');

        pendingFetch.forEach((resolve) => resolve({ ok: true }));
        await settle();
        expect(isActive()).toBe(false);
        expect(b.hasAttribute('data-apya-pending')).toBe(false);
        expect(b.hasAttribute('aria-busy')).toBe(false);
    });

    it('etkileşime bağlı olmayan istek (yoklama) gösterge üretmez', async () => {
        await vi.advanceTimersByTimeAsync(5000);
        window.fetch('/api/shell/state');
        await vi.advanceTimersByTimeAsync(400);
        expect(isActive()).toBe(false);
        pendingFetch.forEach((resolve) => resolve({ ok: true }));
        await settle();
    });

    it('apya.busy ile kilitli düğmeye simge konmaz', async () => {
        const b = button();
        b.setAttribute('data-apya-busy', '');
        b.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        window.fetch('/api/app/task');
        await vi.advanceTimersByTimeAsync(300);
        expect(b.hasAttribute('data-apya-pending')).toBe(false);
        pendingFetch.forEach((resolve) => resolve({ ok: true }));
        await settle();
    });
});

describe('apya-activity: sayfa geçişi', () => {
    it('aynı kökenli bağlantı tıklaması gezinme çubuğunu açar; bfcache dönüşünde kapanır', async () => {
        const a = document.createElement('a');
        a.href = '/Projects';
        a.textContent = 'Projeler';
        document.body.appendChild(a);
        // jsdom gerçek gezinme yapmaz; varsayılan eylemi burada durdurmak testi bozar, o yüzden
        // yalnız gezinme sonrası kabarcık dinleyicisinin kararını ölçeriz.
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
        await vi.advanceTimersByTimeAsync(150);
        expect(isActive()).toBe(true);

        const e = new Event('pageshow');
        Object.defineProperty(e, 'persisted', { value: true });
        window.dispatchEvent(e);
        expect(isActive()).toBe(false);
    });

    it('sayfanın durdurduğu tıklama (onay penceresi, SPA) çubuk açmaz', async () => {
        const a = document.createElement('a');
        a.href = '/Tasks';
        a.addEventListener('click', (ev) => ev.preventDefault());
        document.body.appendChild(a);
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
        await vi.advanceTimersByTimeAsync(200);
        expect(isActive()).toBe(false);
    });

    it('yeni sekmede açılan ve çapa bağlantısı çubuk açmaz', async () => {
        for (const attrs of [{ href: '/Tasks', target: '_blank' }, { href: '#bolum' }]) {
            const a = document.createElement('a');
            Object.entries(attrs).forEach(([k, v]) => a.setAttribute(k, v));
            document.body.appendChild(a);
            a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
        }
        await vi.advanceTimersByTimeAsync(200);
        expect(isActive()).toBe(false);
    });
});
