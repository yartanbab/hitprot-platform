import React, { useState } from 'react';
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { EmptyState, RetryButton, useRetryFocus } from './EmptyState';

/**
 * EmptyState sözleşmesi — G3 (hata sınırı) ve G6 (locked) buna bağlı.
 *
 * 1) Varsayılan varyant BUGÜNKÜ çıktısını korur (30+ kullanım variant geçmiyor).
 * 2) error: role=alert, fa-triangle-exclamation, açıklama G1 hata kanalından
 *    (errorMessage) ya da Common:FetchError; kanal null (merkezi oturum penceresi)
 *    dönerse açıklama basılmaz; onRetry argümansız çağrılır; açık action onu ezer.
 * 3) locked: fa-lock, role=status, varsayılan açıklama/eylem yok.
 * 4) Kanonik "Tekrar dene" (karar 10): Razor'la AYNI Bootstrap sınıfları (btn btn-sm
 *    btn-outline-primary + fa fa-rotate-right me-1), Common:Retry; başlığa aria-describedby
 *    ile bağlı; retrying → kart kalır, düğme meşgul, odak düğmede.
 * 5) Bağımlılıksız (karar 11): içe aktarma grafiğinde ui-vendor parçasının paketi yok.
 * 6) useRetryFocus: başarılı "Tekrar dene"de odak <body>'ye düşmez, içerik kabına geçer
 *    (yalnız düğme odaklıyken basıldıysa; başka yerdeki odak çalınmaz).
 */

afterEach(() => {
    delete window.apya;
});

describe('EmptyState · varsayılan (mevcut kullanımların kilidi)', () => {
    it('role=status + aria-live=polite; ikon verilmezse halka çizilmez', () => {
        const { container } = render(<EmptyState title="Kayıt yok" description="Açıklama" action={<a href="/x">Git</a>} />);

        const root = container.firstChild;
        expect(root).toHaveAttribute('role', 'status');
        expect(root).toHaveAttribute('aria-live', 'polite');
        expect(root.className).toBe('flex flex-col items-center justify-center text-center gap-3 py-6');
        expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
        expect(screen.getByText('Kayıt yok')).toBeInTheDocument();
        // Başlık kimliği yalnız "Tekrar dene" ona bağlanırken basılır.
        expect(screen.getByText('Kayıt yok')).not.toHaveAttribute('id');
        expect(screen.getByText('Açıklama')).toHaveClass('max-w-sm', 'text-text-tertiary', 'text-sm');
        expect(screen.getByRole('link', { name: 'Git' }).parentElement).toHaveClass('mt-1');
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('verilen ikon eski halkayla çizilir; compact sınıfları korunur', () => {
        const { container } = render(<EmptyState compact icon={<i className="fa fa-inbox" />} title="Boş" />);

        expect(container.firstChild).toHaveClass('gap-2', 'py-3');
        const ring = container.querySelector('[aria-hidden="true"]');
        expect(ring).toHaveClass('rounded-full', 'bg-neutral-100', 'text-neutral-500', 'h-8', 'w-8');
        expect(ring.querySelector('.fa-inbox')).not.toBeNull();
        expect(screen.getByText('Boş')).toHaveClass('text-sm');
    });

    it('bilinmeyen variant default\'a düşer', () => {
        const { container } = render(<EmptyState variant="yok-boyle" icon={<i className="fa fa-x" />} title="T" />);
        expect(container.firstChild).toHaveAttribute('role', 'status');
        expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bg-neutral-100');
    });
});

describe('EmptyState · error', () => {
    it('role=alert (aria-live yok), varsayılan ikon ve sessiz halka, Common:FetchError açıklaması', () => {
        const { container } = render(<EmptyState variant="error" title="Liste yüklenemedi" />);

        const root = container.firstChild;
        expect(root).toHaveAttribute('role', 'alert');
        expect(root).not.toHaveAttribute('aria-live');
        const ring = container.querySelector('[aria-hidden="true"]');
        expect(ring).toHaveClass('bg-surface-sunken', 'text-text-secondary', 'h-12', 'w-12');
        expect(ring.querySelector('i')).toHaveClass('fa', 'fa-triangle-exclamation');
        expect(screen.getByText('Liste yüklenemedi')).toBeInTheDocument();
        expect(screen.getByText('Veri alınırken bir hata oluştu.')).toHaveClass('text-text-secondary');
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('açıklama hata nesnesinden, G1 hata kanalıyla üretilir', () => {
        const message = vi.fn((err, fallback) => err.detail || fallback);
        window.apya = { ajaxErrors: { message } };

        render(<EmptyState variant="error" title="T" error={{ detail: 'Sunucuya ulaşılamadı.' }} />);

        expect(screen.getByText('Sunucuya ulaşılamadı.')).toBeInTheDocument();
        expect(message).toHaveBeenCalledWith({ detail: 'Sunucuya ulaşılamadı.' }, 'Veri alınırken bir hata oluştu.');
    });

    it('kanal null dönerse (merkezi oturum penceresi açık) açıklama basılmaz, başlık ve düğme kalır', () => {
        window.apya = { ajaxErrors: { message: () => null } };

        const { container } = render(
            <EmptyState variant="error" title="Liste yüklenemedi" error={{ apyaCentral: true }} onRetry={() => {}} />,
        );

        expect(container.querySelectorAll('p')).toHaveLength(1);
        expect(screen.getByText('Liste yüklenemedi')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
    });

    it('description={null} açıklamayı bastırır; açık description kanalı ezer', () => {
        const { container, rerender } = render(<EmptyState variant="error" title="T" description={null} />);
        expect(container.querySelectorAll('p')).toHaveLength(1);

        rerender(<EmptyState variant="error" title="T" description="Özel metin" error={new Error('x')} />);
        expect(screen.getByText('Özel metin')).toBeInTheDocument();
        expect(screen.queryByText('x')).toBeNull();
    });

    it('onRetry → kanonik "Tekrar dene" (Razor\'la aynı btn btn-sm btn-outline-primary); tıklamada ARGÜMANSIZ çağrılır', () => {
        const onRetry = vi.fn();
        render(<EmptyState variant="error" title="T" onRetry={onRetry} />);

        const button = screen.getByRole('button', { name: 'Tekrar dene' });
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveClass('btn', 'btn-sm', 'btn-outline-primary');
        // Nötr outline (btn-outline-secondary) değil: kanonik düğme accent renkli.
        expect(button).not.toHaveClass('btn-outline-secondary');
        expect(button.querySelector('i.fa.fa-rotate-right.me-1')).toHaveAttribute('aria-hidden', 'true');
        expect(button).not.toHaveAttribute('aria-busy');
        expect(button).not.toHaveAttribute('aria-disabled');
        expect(button.parentElement).toHaveClass('mt-1');
        fireEvent.click(button);
        expect(onRetry).toHaveBeenCalledTimes(1);
        expect(onRetry).toHaveBeenCalledWith();
    });

    it('düğme kartın başlığıyla betimlenir: aynı adlı iki "Tekrar dene" ayırt edilir', () => {
        render(
            <>
                <EmptyState compact variant="error" title="Klasörler yüklenemedi" onRetry={() => {}} />
                <EmptyState variant="error" title="Belge listesi yüklenemedi" onRetry={() => {}} />
            </>,
        );

        const [tree, list] = screen.getAllByRole('button', { name: 'Tekrar dene' });
        expect(tree).toHaveAccessibleDescription('Klasörler yüklenemedi');
        expect(list).toHaveAccessibleDescription('Belge listesi yüklenemedi');
        expect(tree.getAttribute('aria-describedby')).not.toBe(list.getAttribute('aria-describedby'));
    });

    it('retrying: kart sökülmez; düğme aria-disabled + aria-busy + dönen ikon, tıklama yutulur, odak düğmede kalır', () => {
        const onRetry = vi.fn();
        const { rerender } = render(<EmptyState variant="error" title="Liste yüklenemedi" onRetry={onRetry} />);
        const button = screen.getByRole('button', { name: 'Tekrar dene' });
        button.focus();
        fireEvent.click(button);
        expect(onRetry).toHaveBeenCalledTimes(1);

        rerender(<EmptyState variant="error" title="Liste yüklenemedi" onRetry={onRetry} retrying />);

        const busy = screen.getByRole('button', { name: 'Tekrar dene' });
        expect(busy).toBe(button);
        expect(document.activeElement).toBe(button);
        // `disabled` DEĞİL: Chromium odaklı düğme disabled olunca odağı body'ye atar.
        expect(busy).not.toBeDisabled();
        expect(busy).toHaveAttribute('aria-disabled', 'true');
        expect(busy).toHaveAttribute('aria-busy', 'true');
        expect(busy.querySelector('i')).toHaveClass('fa-rotate-right', 'fa-spin');
        expect(screen.getByRole('alert')).toHaveTextContent('Liste yüklenemedi');
        fireEvent.click(busy);
        expect(onRetry).toHaveBeenCalledTimes(1);

        // Yeniden deneme yine düştü: aynı düğme tekrar etkin, odak hâlâ onda.
        rerender(<EmptyState variant="error" title="Liste yüklenemedi" onRetry={onRetry} />);
        expect(document.activeElement).toBe(button);
        expect(button).not.toHaveAttribute('aria-busy');
        fireEvent.click(button);
        expect(onRetry).toHaveBeenCalledTimes(2);
    });

    it('açık action onRetry düğmesini ezer', () => {
        render(<EmptyState variant="error" title="T" onRetry={() => {}} action={<button type="button">Sayfayı yenile</button>} />);

        expect(screen.getByRole('button', { name: 'Sayfayı yenile' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Tekrar dene' })).toBeNull();
    });

    it('compact: küçük halka ve metin', () => {
        const { container } = render(<EmptyState compact variant="error" title="T" />);
        expect(container.firstChild).toHaveClass('gap-2', 'py-3');
        expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('h-8', 'w-8');
        expect(screen.getByText('Veri alınırken bir hata oluştu.')).toHaveClass('text-xs');
    });
});

describe('EmptyState · locked (G6)', () => {
    it('fa-lock, role=status, varsayılan açıklama ve düğme YOK', () => {
        const { container } = render(<EmptyState variant="locked" title="Bu bölümü görme yetkiniz yok" />);

        const root = container.firstChild;
        expect(root).toHaveAttribute('role', 'status');
        expect(root).toHaveAttribute('aria-live', 'polite');
        const ring = container.querySelector('[aria-hidden="true"]');
        expect(ring).toHaveClass('bg-surface-sunken', 'text-text-secondary');
        expect(ring.querySelector('i')).toHaveClass('fa', 'fa-lock');
        expect(container.querySelectorAll('p')).toHaveLength(1);
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('açıklama ve eylem çağırandan gelir', () => {
        render(
            <EmptyState
                variant="locked"
                title="Bu bölümü görme yetkiniz yok"
                description="Gelirler izni gerekir; yöneticiniz verebilir."
                action={<a href="/x">Yöneticiye yaz</a>}
            />,
        );
        expect(screen.getByText('Gelirler izni gerekir; yöneticiniz verebilir.')).toHaveClass('text-text-secondary');
        expect(screen.getByRole('link', { name: 'Yöneticiye yaz' })).toBeInTheDocument();
    });
});

describe('RetryButton (kart dışı şerit/satır içi uyarılar)', () => {
    it('kartla aynı kanonik düğme; betimleme çağırandan, onRetry argümansız', () => {
        const onRetry = vi.fn();
        render(
            <p>
                <span id="uyari">Klasörler yenilenemedi.</span>
                <RetryButton onRetry={onRetry} aria-describedby="uyari" />
            </p>,
        );

        const button = screen.getByRole('button', { name: 'Tekrar dene' });
        expect(button).toHaveClass('btn', 'btn-sm', 'btn-outline-primary');
        expect(button).toHaveAccessibleDescription('Klasörler yenilenemedi.');
        fireEvent.click(button);
        expect(onRetry).toHaveBeenCalledWith();
    });
});

/* Karar 10: React ve Razor "Tekrar dene"si AYNI görünür. Görünüm Tailwind'le taklit edilirken
   Bootstrap'ın `.border { … !important }` yardımcısı `border border-accent`'i eziyor, çerçeve griye
   dönüyordu (canlıda ölçüldü). Düğme artık Razor'ın sınıflarını taşır; karşılaştırılan taraf
   Razor/jQuery sayfalarının gerçek üreticisidir (wwwroot/js/apya-load-state.js errorHtml). */
describe('RetryButton · Razor errorHtml ile aynı (karar 10)', () => {
    let razor;

    beforeAll(async () => {
        await import('../../../../js/apya-load-state.js');
        razor = new DOMParser()
            .parseFromString(window.apya.loadState.errorHtml('Liste yüklenemedi.', 'js-x-retry'), 'text/html')
            .querySelector('button');
    });

    const visual = (button) => [...button.classList].filter((c) => c !== 'js-x-retry' && !c.startsWith('aria-disabled:'));

    it('düğme ve ikon sınıfları, metin birebir aynı', () => {
        render(<RetryButton onRetry={() => {}} />);
        const react = screen.getByRole('button', { name: 'Tekrar dene' });

        expect(visual(razor)).toEqual(['btn', 'btn-sm', 'btn-outline-primary']);
        expect(visual(react)).toEqual(visual(razor));
        expect(react.querySelector('i').className).toBe(razor.querySelector('i').className);
        expect(react.querySelector('i')).toHaveAttribute('aria-hidden', 'true');
        expect(react.textContent).toBe(razor.textContent);
        expect(react.getAttribute('type')).toBe(razor.getAttribute('type'));
    });

    it('görünüm sınıfı olarak yalnız Bootstrap: Bootstrap\'ın !important yardımcılarıyla adaş Tailwind sınıfı yok', () => {
        render(<RetryButton onRetry={() => {}} retrying />);
        const react = screen.getByRole('button', { name: 'Tekrar dene' });

        // Tek fazlalık meşgul durumun soluklaşması; varyant önekli olduğu için Bootstrap'la çakışmaz.
        expect([...react.classList].filter((c) => !visual(razor).includes(c)))
            .toEqual(['aria-disabled:opacity-50', 'aria-disabled:pointer-events-none']);
        expect(react).not.toHaveClass('border');
        // Meşgulken de aynı ikon; yalnız dönme eklenir (failTable ile aynı).
        expect(react.querySelector('i')).toHaveClass('fa', 'fa-rotate-right', 'me-1', 'fa-spin');
    });
});

/* Sözleşme madde 7: başarılı yeniden denemede kart içerikle yer değiştirir, düğme sökülür. */
describe('useRetryFocus · başarılı "Tekrar dene"de odak içerik kabına', () => {
    /* Çağıranların deseni: hata varken yükleniyor = yeniden deneniyor (kart kalır). */
    function Liste({ outcomes }) {
        const [state, setState] = useState({ loading: false, error: new Error('500') });
        const focus = useRetryFocus(!state.loading && !state.error);
        const load = () => {
            setState((s) => ({ ...s, loading: true }));
            outcomes.shift().then(
                () => setState({ loading: false, error: null }),
                (error) => setState({ loading: false, error }),
            );
        };
        return (
            <>
                <input aria-label="Ara" />
                <div data-testid="icerik" ref={focus.contentRef} tabIndex={-1}>
                    {state.error
                        ? <EmptyState variant="error" title="Liste yüklenemedi" onRetry={focus.retry(load)} retrying={state.loading} />
                        : state.loading ? <p>Yükleniyor…</p> : <p>satırlar</p>}
                </div>
            </>
        );
    }

    function deferred() {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
        return { promise, resolve, reject };
    }

    it('düğme odaklıyken basıldı, yükleme başarılı → odak içerik kabında (body\'de değil)', async () => {
        const first = deferred();
        render(<Liste outcomes={[first.promise]} />);
        const retry = screen.getByRole('button', { name: 'Tekrar dene' });
        retry.focus();
        fireEvent.click(retry);
        expect(document.activeElement).toBe(retry);

        await act(async () => { first.resolve(); });

        expect(screen.getByText('satırlar')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Tekrar dene' })).toBeNull();
        expect(document.activeElement).toBe(screen.getByTestId('icerik'));
        expect(screen.getByTestId('icerik')).toHaveAttribute('tabindex', '-1');
    });

    it('odak sayfayı kaydırmadan taşınır (preventScroll)', async () => {
        const first = deferred();
        render(<Liste outcomes={[first.promise]} />);
        const focus = vi.spyOn(screen.getByTestId('icerik'), 'focus');
        const retry = screen.getByRole('button', { name: 'Tekrar dene' });
        retry.focus();
        fireEvent.click(retry);

        await act(async () => { first.resolve(); });

        expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    });

    it('yeniden deneme yine düşerse kart ve odak yerinde kalır; sonraki başarıda içerik kabına geçer', async () => {
        const first = deferred();
        const second = deferred();
        render(<Liste outcomes={[first.promise, second.promise]} />);
        const retry = screen.getByRole('button', { name: 'Tekrar dene' });
        retry.focus();
        fireEvent.click(retry);

        await act(async () => { first.reject(new Error('503')); });

        expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBe(retry);
        expect(document.activeElement).toBe(retry);

        fireEvent.click(retry);
        await act(async () => { second.resolve(); });

        expect(document.activeElement).toBe(screen.getByTestId('icerik'));
    });

    it('kullanıcı arada başka yere geçtiyse odak çalınmaz', async () => {
        const first = deferred();
        render(<Liste outcomes={[first.promise]} />);
        const retry = screen.getByRole('button', { name: 'Tekrar dene' });
        retry.focus();
        fireEvent.click(retry);
        screen.getByLabelText('Ara').focus();

        await act(async () => { first.resolve(); });

        expect(screen.getByText('satırlar')).toBeInTheDocument();
        expect(document.activeElement).toBe(screen.getByLabelText('Ara'));
    });

    it('düğme odaklı değilken (fareyle, odak sayfada) basıldıysa odak taşınmaz', async () => {
        const first = deferred();
        render(<Liste outcomes={[first.promise]} />);
        expect(document.activeElement).toBe(document.body);
        fireEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));

        await act(async () => { first.resolve(); });

        expect(screen.getByText('satırlar')).toBeInTheDocument();
        expect(document.activeElement).toBe(document.body);
    });
});

/* Karar 11: EmptyState'i içe aktaran hafif adalar (Formlar, Yanıtlar) ui-vendor parçasını
   yüklememeli. Parçanın paketleri vite.config.js'teki manualChunks'tan okunur; EmptyState'ten
   erişilen her modülün içe aktarmaları taranır (yalnız doğrudan değil, dolaylı da). */
describe('EmptyState · bağımlılıksız (ui-vendor taşımaz)', () => {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const src = path.resolve(here, '../..');
    const viteConfig = readFileSync(path.resolve(src, '../vite.config.js'), 'utf8');
    const beforeUiVendor = viteConfig.slice(0, viteConfig.indexOf("return 'ui-vendor'"));
    const UI_VENDOR = [...beforeUiVendor.slice(beforeUiVendor.lastIndexOf('if (')).matchAll(/node_modules\/([^']+?)\/'/g)]
        .map((m) => m[1]);

    const withoutComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
    const specifiers = (file) => [...withoutComments(readFileSync(file, 'utf8'))
        .matchAll(/\b(?:import|export)\s[^;]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]/g)]
        .map((m) => m[1] ?? m[2]);
    const resolve = (from, spec) => {
        const base = path.resolve(path.dirname(from), spec);
        const found = [base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js')]
            .find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
        if (!found) throw new Error(`çözülemedi: ${spec} (${from})`);
        return found;
    };
    const graph = new Map();
    const walk = (file) => {
        if (graph.has(file)) return;
        graph.set(file, specifiers(file));
        graph.get(file).filter((s) => s.startsWith('.')).forEach((s) => walk(resolve(file, s)));
    };
    walk(path.join(here, 'EmptyState.jsx'));
    const relative = (file) => path.relative(src, file).split(path.sep).join('/');

    it('ui-vendor paket listesi okunabildi', () => {
        expect(UI_VENDOR).toEqual(expect.arrayContaining(['@radix-ui', 'class-variance-authority', 'clsx', 'tailwind-merge']));
    });

    it('EmptyState yalnız react, lib/i18n ve lib/api/abpErrors içe aktarır; cn ve Button YOK', () => {
        const direct = graph.get(path.join(here, 'EmptyState.jsx'));
        expect(direct).toEqual(expect.arrayContaining(['react', '../../lib/i18n', '../../lib/api/abpErrors']));
        expect(direct).not.toContain('../../lib/utils');
        expect(direct).not.toContain('./Button');
        const files = [...graph.keys()].map(relative);
        expect(files).not.toContain('lib/utils.js');
        expect(files).not.toContain('components/ui/Button.jsx');
    });

    it('erişilen hiçbir modül ui-vendor paketini içe aktarmaz (abpErrors ve i18n dahil)', () => {
        const files = [...graph.keys()].map(relative);
        expect(files).toEqual(expect.arrayContaining(['components/ui/EmptyState.jsx', 'lib/i18n.js', 'lib/api/abpErrors.js']));

        const offenders = [...graph.entries()].flatMap(([file, specs]) => specs
            .filter((s) => UI_VENDOR.some((pkg) => s === pkg || s.startsWith(`${pkg}/`)))
            .map((s) => `${relative(file)} → ${s}`));
        expect(offenders).toEqual([]);
    });
});
