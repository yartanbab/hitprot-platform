import React, { useEffect, useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, fireEvent, within } from '@testing-library/react';
import { IslandErrorBoundary, IslandErrorFallback } from './IslandErrorBoundary';
import { mountIsland } from '../../lib/mountIsland';
import { PERSIST_THROTTLE_MS, QUERY_CACHE_STORAGE_KEY } from '../../lib/api/queryCacheStorage';

/**
 * Ada hata sınırı (RES-11, CAL-24).
 *
 * 1) Hata yokken çocuklar sarmalayıcısız; render ya da efekt istisnasında (falsy fırlatma dahil)
 *    EmptyState error kartı (Tekrar dene + Sayfayı yenile), abp yokken Türkçe varsayılan metinler.
 * 2) Bir ada çökünce diğer ada çalışmaya devam eder (mountIsland, ayrı kökler).
 * 3) Önbellek (CAL-24): çökmede hemen ve kısıt süresi dolunca bir kez daha silinir; başka
 *    oturum anahtarlarına dokunulmaz. Tekrar dene / Sayfayı yenile de siler.
 * 4) Telemetri bir kez; telemetri yoksa ya da fırlatırsa kart yine çizilir.
 * 5) Odak: "Tekrar dene" de düşerse yeni kartın düğmesine döner; başka yerdeki odak çalınmaz.
 *
 * React DEV yakalanan hatayı console.error'a basar (jsdom da "Uncaught" yazar) → susturulur.
 * Üretimde window.onerror'a iletilmediği (çift kayıt yok) canlıda ölçülür.
 */

function Bomb({ message = 'patladı' }) {
    throw new Error(message);
}

/* Verilen değeri olduğu gibi fırlatır: falsy (undefined/null/0/'') dahil. */
function Thrower({ value }) {
    throw value;
}

/* Bayrak açıkken her render'da fırlatır (React hata anında render'ı bir kez yeniden dener). */
const flaky = { broken: true };
function Flaky({ n = 0 }) {
    if (flaky.broken) throw new Error('bozuk');
    return <p>çalıştı {n}</p>;
}

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    flaky.broken = true;
});

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
    delete window.ApyaTelemetry;
    delete window.abp;
});

describe('IslandErrorBoundary · kart', () => {
    it('hata yokken çocuklar sarmalayıcısız çizilir', () => {
        const { container } = render(
            <IslandErrorBoundary name="calendar"><p data-testid="cocuk">içerik</p></IslandErrorBoundary>,
        );

        expect(container.firstChild).toBe(screen.getByTestId('cocuk'));
        expect(container.querySelector('[data-island-error]')).toBeNull();
    });

    it('render istisnası → EmptyState error kartı; abp yokken Türkçe metinler, FA\'sız ikon', () => {
        const { container } = render(<IslandErrorBoundary name="calendar"><Bomb /></IslandErrorBoundary>);

        const card = container.querySelector('[data-island-error="calendar"]');
        expect(card).not.toBeNull();
        const alert = within(card).getByRole('alert');
        expect(alert).toHaveTextContent('Bu bölüm gösterilemedi');
        expect(alert).toHaveTextContent('Beklenmeyen bir hata oluştu. Tekrar deneyin; sorun sürerse sayfayı yenileyin.');
        // İkon satır içi SVG: herkese açık formda (Layout=null) Font Awesome yüklü değil.
        const ring = alert.querySelector('span[aria-hidden="true"]');
        expect(ring).toHaveClass('rounded-full', 'bg-surface-sunken');
        expect(ring.querySelector('svg')).not.toBeNull();
        expect(ring.querySelector('i')).toBeNull();

        const retry = within(card).getByRole('button', { name: 'Tekrar dene' });
        // Kanonik "Tekrar dene" (karar 10) kartın başlığıyla betimlenir.
        expect(retry).toHaveClass('border-accent', 'text-accent');
        expect(retry).toHaveAccessibleDescription('Bu bölüm gösterilemedi');
        const reload = within(card).getByRole('button', { name: 'Sayfayı yenile' });
        expect(reload).toHaveAttribute('type', 'button');
        expect(reload).toHaveClass('border-strong', 'text-text-primary');
        expect(within(card).queryByRole('button', { name: 'Kapat' })).toBeNull();
    });

    it('useEffect içinde senkron istisna (finally\'siz thenable — CUS-01 kopyası) da karta düşer', () => {
        function Liste() {
            useEffect(() => {
                const jqueryDeferred = { then: () => jqueryDeferred };
                jqueryDeferred.then(() => {}).finally(() => {});
            }, []);
            return <p>liste</p>;
        }

        const { container } = render(<IslandErrorBoundary name="customers"><Liste /></IslandErrorBoundary>);

        expect(container.querySelector('[data-island-error="customers"] [role="alert"]')).not.toBeNull();
        expect(screen.queryByText('liste')).toBeNull();
    });

    it('falsy değer fırlatılsa da (throw undefined/null/0/\'\') kart çizilir; telemetriye Error gider', () => {
        const reportIslandError = vi.fn();
        window.ApyaTelemetry = { reportIslandError };

        for (const value of [undefined, null, 0, '']) {
            const { container, unmount } = render(
                <IslandErrorBoundary name="calendar"><Thrower value={value} /></IslandErrorBoundary>,
            );
            expect(container.querySelector('[data-island-error="calendar"]')).toHaveTextContent('Bu bölüm gösterilemedi');
            unmount();
        }

        expect(reportIslandError.mock.calls.map(([, error]) => error instanceof Error && error.message))
            .toEqual(['undefined', 'null', '0', '']);
    });

    it('fallback verilirse { name, retry, reload, refocus } ile çağrılır', () => {
        const fallback = vi.fn(() => <p>özel kart</p>);

        render(<IslandErrorBoundary name="task-detail" fallback={fallback}><Bomb /></IslandErrorBoundary>);

        expect(screen.getByText('özel kart')).toBeInTheDocument();
        const actions = fallback.mock.calls.at(-1)[0];
        expect(actions).toEqual({ name: 'task-detail', retry: expect.any(Function), reload: expect.any(Function), refocus: false });
    });

    it('onClose verilirse "Kapat" çizilir ve çağrılır (görev modalı)', () => {
        const onClose = vi.fn();
        render(<IslandErrorFallback name="task-detail" retry={() => {}} reload={() => {}} onClose={onClose} />);

        fireEvent.click(screen.getByRole('button', { name: 'Kapat' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

describe('mountIsland · adalar birbirinden yalıtık', () => {
    it('bir ada çökünce diğeri çizili kalır ve tıklanabilir', () => {
        function Sayac() {
            const [n, setN] = useState(0);
            return <button type="button" onClick={() => setN(n + 1)}>{`sayaç ${n}`}</button>;
        }
        const a = document.createElement('div');
        const b = document.createElement('div');
        document.body.append(a, b);
        let rootA;
        let rootB;

        act(() => {
            rootA = mountIsland(a, 'ada-a', <Bomb />);
            rootB = mountIsland(b, 'ada-b', <Sayac />);
        });

        expect(a.querySelector('[data-island-error="ada-a"]')).not.toBeNull();
        expect(b.querySelector('[data-island-error]')).toBeNull();
        fireEvent.click(within(b).getByRole('button', { name: 'sayaç 0' }));
        expect(within(b).getByRole('button', { name: 'sayaç 1' })).toBeInTheDocument();

        act(() => { rootA.unmount(); rootB.unmount(); });
        a.remove();
        b.remove();
    });
});

describe('IslandErrorBoundary · önbellek (CAL-24)', () => {
    it('çökmede önbellek silinir; iz ve veri-değişti damgasına dokunulmaz', () => {
        window.sessionStorage.setItem(QUERY_CACHE_STORAGE_KEY, '{"bozuk":true}');
        window.sessionStorage.setItem('apyaBreadcrumb', '[]');
        window.sessionStorage.setItem('apya-data-changed-at', '1');

        render(<IslandErrorBoundary name="calendar"><Bomb /></IslandErrorBoundary>);

        expect(window.sessionStorage.getItem(QUERY_CACHE_STORAGE_KEY)).toBeNull();
        expect(window.sessionStorage.getItem('apyaBreadcrumb')).toBe('[]');
        expect(window.sessionStorage.getItem('apya-data-changed-at')).toBe('1');
    });

    it('kısıt süresi içinde düşen bekleyen yazma ikinci silmeyle kaldırılır', () => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
        render(<IslandErrorBoundary name="calendar"><Bomb /></IslandErrorBoundary>);

        // Kalıcılaştırıcının çökmeden önce kurulmuş kısıtlı yazması sökülmeden sonra düşer.
        vi.advanceTimersByTime(PERSIST_THROTTLE_MS);
        window.sessionStorage.setItem(QUERY_CACHE_STORAGE_KEY, '{"bozuk":true}');
        vi.advanceTimersByTime(99);
        expect(window.sessionStorage.getItem(QUERY_CACHE_STORAGE_KEY)).toBe('{"bozuk":true}');

        vi.advanceTimersByTime(1);
        expect(window.sessionStorage.getItem(QUERY_CACHE_STORAGE_KEY)).toBeNull();
    });

    it('"Tekrar dene" önbelleği siler ve alt ağacı yeniden bağlar', () => {
        render(<IslandErrorBoundary name="calendar"><Flaky /></IslandErrorBoundary>);
        window.sessionStorage.setItem(QUERY_CACHE_STORAGE_KEY, '{"bozuk":true}');
        flaky.broken = false;

        fireEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));

        expect(screen.getByText('çalıştı 0')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).toBeNull();
        expect(window.sessionStorage.getItem(QUERY_CACHE_STORAGE_KEY)).toBeNull();
    });

    it('"Sayfayı yenile" önbelleği siler ve sayfayı yeniler', () => {
        const reload = vi.fn();
        vi.stubGlobal('location', { ...window.location, reload });
        render(<IslandErrorBoundary name="calendar"><Bomb /></IslandErrorBoundary>);
        window.sessionStorage.setItem(QUERY_CACHE_STORAGE_KEY, '{"bozuk":true}');

        fireEvent.click(screen.getByRole('button', { name: 'Sayfayı yenile' }));

        expect(reload).toHaveBeenCalledTimes(1);
        expect(window.sessionStorage.getItem(QUERY_CACHE_STORAGE_KEY)).toBeNull();
    });
});

describe('IslandErrorBoundary · telemetri', () => {
    it('ApyaTelemetry.reportIslandError bir kez (ad, hata, bileşen yığını) ile çağrılır', () => {
        const reportIslandError = vi.fn();
        window.ApyaTelemetry = { reportIslandError };

        render(<IslandErrorBoundary name="calendar"><Bomb message="Invalid time value" /></IslandErrorBoundary>);

        expect(reportIslandError).toHaveBeenCalledTimes(1);
        const [name, error, componentStack] = reportIslandError.mock.calls[0];
        expect(name).toBe('calendar');
        expect(error.message).toBe('Invalid time value');
        expect(componentStack).toContain('Bomb');
    });

    it('telemetri yoksa ya da fırlatırsa kart yine çizilir', () => {
        const { unmount } = render(<IslandErrorBoundary name="a"><Bomb /></IslandErrorBoundary>);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        unmount();

        window.ApyaTelemetry = { reportIslandError: () => { throw new Error('telemetri'); } };
        render(<IslandErrorBoundary name="b"><Bomb /></IslandErrorBoundary>);
        expect(screen.getByRole('alert')).toHaveTextContent('Bu bölüm gösterilemedi');
    });
});

describe('IslandErrorBoundary · odak (EmptyState sözleşmesi madde 7)', () => {
    it('ilk çökme odağı almaz; "Tekrar dene" de düşerse odak yeni kartın "Tekrar dene"sine döner', () => {
        render(<IslandErrorBoundary name="calendar"><Flaky /></IslandErrorBoundary>);
        expect(document.activeElement).toBe(document.body);

        const first = screen.getByRole('button', { name: 'Tekrar dene' });
        first.focus();
        fireEvent.click(first);

        const second = screen.getByRole('button', { name: 'Tekrar dene' });
        expect(second).not.toBe(first);
        expect(document.activeElement).toBe(second);
    });

    it('odak başka bir alandaysa çalınmaz', () => {
        const tree = (n) => (
            <>
                <input aria-label="dış alan" />
                <IslandErrorBoundary name="calendar"><Flaky n={n} /></IslandErrorBoundary>
            </>
        );
        const { rerender } = render(tree(0));
        flaky.broken = false;
        fireEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));
        expect(screen.getByText('çalıştı 0')).toBeInTheDocument();

        const outside = screen.getByLabelText('dış alan');
        outside.focus();
        flaky.broken = true;
        rerender(tree(1));

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(document.activeElement).toBe(outside);
    });
});

/* SON blok: lib/i18n kaynağı ilk çözülüşte önbelleğe alır; sonraki testler bu sahte kaynağı görürdü. */
describe('IslandErrorBoundary · yerelleştirme', () => {
    it('abp varken metinler Platform kaynağından gelir', () => {
        const texts = {
            'Common:SectionError:Title': 'This section could not be displayed',
            'Common:SectionError:Description': 'An unexpected error occurred.',
            'Common:ReloadPage': 'Reload page',
            'Common:Retry': 'Try again',
        };
        window.abp = { localization: { getResource: () => (key) => texts[key] ?? key } };

        render(<IslandErrorBoundary name="calendar"><Bomb /></IslandErrorBoundary>);

        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('This section could not be displayed');
        expect(alert).toHaveTextContent('An unexpected error occurred.');
        expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument();
    });
});
