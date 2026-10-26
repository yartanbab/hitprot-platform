import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';

// wwwroot/js/apya-activity.js bir IIFE: XHR/fetch'i sarmalar, etkileşimi ve gezinmeyi dinler.
// fetch, betik yüklenmeden ÖNCE sahte olmalı (betik o anki window.fetch'i sarmalar).
let pendingFetch = [];

beforeAll(async () => {
    window.fetch = vi.fn(() => new Promise((resolve) => { pendingFetch.push(resolve); }));
    await import('../../../js/apya-activity.js');
    await import('../../../js/apya-mark.js'); // gezinme katmanı işareti apya.mark ile basar
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

describe('apya-activity: çift tıklama koruması (Y-02)', () => {
    it('isteği süren düğmeye ikinci tıklama sayfaya ulaşmaz; istek bitince yeniden tıklanır', async () => {
        const b = button();
        let handled = 0;
        b.addEventListener('click', () => { handled++; window.fetch('/api/app/task'); });

        b.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        expect(handled).toBe(1);

        pendingFetch.forEach((resolve) => resolve({ ok: true }));
        await settle();
        b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        expect(handled).toBe(2);
        pendingFetch.forEach((resolve) => resolve({ ok: true }));
        await settle();
    });

    it('data-apya-repeat düğmesi korumadan muaf', async () => {
        const b = button();
        b.setAttribute('data-apya-repeat', '');
        let handled = 0;
        b.addEventListener('click', () => { handled++; window.fetch('/api/app/task'); });

        b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        expect(handled).toBe(2);
        pendingFetch.forEach((resolve) => resolve({ ok: true }));
        await settle();
    });

    it('klasik form gezinme sürerken ikinci kez gönderilmez', async () => {
        const form = document.createElement('form');
        form.action = '/Tasks/Create';
        document.body.appendChild(form);
        let submitted = 0;
        form.addEventListener('submit', () => { submitted++; });

        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await vi.advanceTimersByTimeAsync(0);
        const second = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(second);
        expect(submitted).toBe(1);
        expect(second.defaultPrevented).toBe(true);

        const e = new Event('pageshow');
        Object.defineProperty(e, 'persisted', { value: true });
        window.dispatchEvent(e);
    });
});

const overlay = () => document.querySelector('.apya-nav-overlay');

function backFromCache() {
    const e = new Event('pageshow');
    Object.defineProperty(e, 'persisted', { value: true });
    window.dispatchEvent(e);
}

function clickLink(attrs) {
    const a = document.createElement('a');
    Object.entries(attrs).forEach(([k, v]) => a.setAttribute(k, v));
    a.textContent = 'git';
    document.body.appendChild(a);
    // jsdom gerçek gezinme yapmaz; varsayılan eylemi burada durdurmak testi bozar, o yüzden
    // yalnız gezinme sonrası kabarcık dinleyicisinin kararını ölçeriz.
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
    return a;
}

describe('apya-activity: sayfa geçişi', () => {
    it('aynı kökenli bağlantı 250 ms içinde açılmazsa ekranı örten katman çıkar; bfcache dönüşünde kalkar', async () => {
        clickLink({ href: '/Projects' });
        await vi.advanceTimersByTimeAsync(200);
        expect(overlay()).toBeNull(); // hızlı sayfa: katman hiç görünmez

        await vi.advanceTimersByTimeAsync(100);
        const el = overlay();
        expect(el).not.toBeNull();
        expect(el.classList.contains('is-active')).toBe(true);
        expect(el.getAttribute('role')).toBe('status');
        expect(el.textContent).toContain('Yükleniyor');
        const mark = el.querySelector('svg.apya-mark');
        expect(mark).not.toBeNull();
        expect(mark.getAttribute('data-state')).toBe('thinking');
        expect(isActive()).toBe(false); // gezinmede çubuk değil katman

        backFromCache();
        expect(overlay()).toBeNull();
    });

    it('Esc katmanı kapatır; gezinme hiç olmazsa 10 sn sonra kendiliğinden kalkar', async () => {
        clickLink({ href: '/Tasks' });
        await vi.advanceTimersByTimeAsync(300);
        expect(overlay()).not.toBeNull();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(overlay()).toBeNull();

        clickLink({ href: '/Grants' });
        await vi.advanceTimersByTimeAsync(300);
        expect(overlay()).not.toBeNull();
        await vi.advanceTimersByTimeAsync(10000);
        expect(overlay()).toBeNull();
    });

    it.each([
        ['/Reports?handler=ExportExcel'],
        ['/Share/?handler=Download&fileId=1'],
        ['/api/app/document/abc/download'],
        ['/files/rapor.pdf'],
    ])('indirme adresi (%s) ekranı kilitlemez: katman yerine çubuk', async (href) => {
        clickLink({ href });
        await vi.advanceTimersByTimeAsync(300);
        expect(overlay()).toBeNull();
        expect(isActive()).toBe(true);
        backFromCache();
        expect(isActive()).toBe(false);
    });

    it('data-apya-no-overlay taşıyan bağlantı katman açmaz', async () => {
        clickLink({ href: '/Invoices/Print', 'data-apya-no-overlay': '' });
        await vi.advanceTimersByTimeAsync(300);
        expect(overlay()).toBeNull();
        backFromCache();
    });

    it('dışa aktarma formu katman açmaz; normal form açar', async () => {
        const exportForm = document.createElement('form');
        exportForm.setAttribute('action', '/Finance?handler=ExportPdf');
        document.body.appendChild(exportForm);
        exportForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await vi.advanceTimersByTimeAsync(300);
        expect(overlay()).toBeNull();
        backFromCache();

        const form = document.createElement('form');
        form.setAttribute('action', '/Projects/Create');
        document.body.appendChild(form);
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await vi.advanceTimersByTimeAsync(300);
        expect(overlay()).not.toBeNull();
        backFromCache();
    });

    it('sayfanın durdurduğu tıklama (onay penceresi, SPA) çubuk açmaz', async () => {
        const a = document.createElement('a');
        a.href = '/Tasks';
        a.addEventListener('click', (ev) => ev.preventDefault());
        document.body.appendChild(a);
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
        await vi.advanceTimersByTimeAsync(300);
        expect(isActive()).toBe(false);
        expect(overlay()).toBeNull();
    });

    it('yeni sekmede açılan ve çapa bağlantısı çubuk açmaz', async () => {
        for (const attrs of [{ href: '/Tasks', target: '_blank' }, { href: '#bolum' }]) {
            const a = document.createElement('a');
            Object.entries(attrs).forEach(([k, v]) => a.setAttribute(k, v));
            document.body.appendChild(a);
            a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
        }
        await vi.advanceTimersByTimeAsync(300);
        expect(isActive()).toBe(false);
        expect(overlay()).toBeNull();
    });
});
