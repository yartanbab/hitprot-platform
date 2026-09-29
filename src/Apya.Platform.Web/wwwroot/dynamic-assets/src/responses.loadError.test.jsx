import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';

/**
 * Yanıtlar — yükleme hatası (STA-V02).
 *
 * Sayfa düzeyi (istatistik/form) ile liste düzeyi hata ayrışır:
 *  - liste düşerse gerçek istatistikler görünür kalır, liste/analiz alanında hata kartı,
 *    başlık "Yanıtlar (—)", satırlar temizlenir (CSV pasif), süzgeç değişimi listeyi getirir;
 *  - sayfa düşerse sahte "Toplam Yanıt 0" kartları yerine tek hata kartı;
 *  - liste yüklenirken (süzgeç, Tekrar dene) sayaç "—", CSV pasif, liste/analiz yerine
 *    "yükleniyor"; hata kartı yeniden denemede yerinde kalır (düğme meşgul).
 * Engelleyici abp.message penceresi açılmaz. Modül yüklenince #responses-root'a kendini
 * bağlar: her test taze modül ve taze DOM ile başlar.
 */

const state = vi.hoisted(() => ({ get: null }));

vi.mock('./lib/api/httpClient', () => ({
  api: { get: (url) => state.get(url), post: () => Promise.resolve(null) },
}));

const apiError = (message, status) => Object.assign(new Error(message), { status });

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

const tick = () => new Promise((r) => setTimeout(r, 0));

let messageError;

async function mount() {
  vi.resetModules();
  document.body.innerHTML = '<div id="responses-root" data-form-id="f1"></div>';
  await act(async () => { await import('./responses.jsx'); });
}

beforeEach(() => {
  messageError = vi.fn();
  window.abp = { message: { error: messageError, info: vi.fn() }, notify: { success: vi.fn() }, auth: { isGranted: () => false } };
});

const STATS = { responseCount: 3, todayResponseCount: 1, pendingResponseCount: 2, viewCount: 9 };
const ROW = { id: 'r1', status: 0, creationTime: '2026-09-01T10:00:00Z', tenantName: 'Firma A', answers: '{}' };

describe('Yanıtlar · yükleme hatası', () => {
  it('liste düşerse istatistikler kalır, liste alanında hata kartı; süzgeç değişimi listeyi getirir; eski ret yeniyi ezmez', async () => {
    const listCalls = [];
    state.get = (url) => {
      if (url.endsWith('/statistics')) return Promise.resolve(STATS);
      if (url.startsWith('/api/app/form/')) return Promise.resolve({ blocks: [] });
      const call = { url, ...deferred() };
      listCalls.push(call);
      return call.promise;
    };
    await mount();
    await waitFor(() => expect(listCalls).toHaveLength(1));

    listCalls[0].reject(apiError('Sunucuda beklenmeyen bir hata oluştu.', 500));

    expect(await screen.findByText('Yanıtlar yüklenemedi')).toBeInTheDocument();
    expect(screen.getByText('Sunucuda beklenmeyen bir hata oluştu.')).toBeInTheDocument();
    expect(screen.getByText('Toplam Yanıt')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Yanıtlar (—)')).toBeInTheDocument();
    expect(screen.queryByText('Henüz yanıt yok.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '⬇ CSV' })).toBeDisabled();
    expect(messageError).not.toHaveBeenCalled();

    // Analiz de aynı satırlardan çizilir: orada da hata kartı.
    fireEvent.click(screen.getByRole('button', { name: 'Analiz' }));
    expect(screen.getByText('Yanıtlar yüklenemedi')).toBeInTheDocument();
    expect(screen.queryByText(/Grafik gösterilebilecek soru yok/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Liste' }));

    // Süzgeç değişimi listeyi yeniden ister; gerçek boş sonuç boş durumdur.
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '0' } });
    await waitFor(() => expect(listCalls).toHaveLength(2));
    expect(listCalls[1].url).toContain('&Status=0');
    listCalls[1].resolve({ items: [] });

    expect(await screen.findByText('Henüz yanıt yok.')).toBeInTheDocument();
    expect(screen.getByText('Yanıtlar (0)')).toBeInTheDocument();
    expect(screen.queryByText('Yanıtlar yüklenemedi')).not.toBeInTheDocument();

    // Hızlı süzgeç değişimi: geç dönen eski ret yeni başarıyı ezmez.
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    await waitFor(() => expect(listCalls).toHaveLength(4));
    listCalls[3].resolve({ items: [ROW] });
    expect(await screen.findByText('Firma A')).toBeInTheDocument();
    listCalls[2].reject(apiError('Sunucuda beklenmeyen bir hata oluştu.', 500));
    await act(tick);

    expect(screen.getByText('Firma A')).toBeInTheDocument();
    expect(screen.getByText('Yanıtlar (1)')).toBeInTheDocument();
    expect(screen.queryByText('Yanıtlar yüklenemedi')).not.toBeInTheDocument();
    expect(messageError).not.toHaveBeenCalled();
  });

  it('istatistik/form düşerse sahte "Toplam Yanıt 0" yerine sayfa hata kartı; Tekrar dene sayfayı getirir', async () => {
    let statsCalls = 0;
    const statsRetry = deferred();
    state.get = (url) => {
      if (url.endsWith('/statistics')) {
        statsCalls += 1;
        return statsCalls === 1
          ? Promise.reject(apiError('Sunucu geçici olarak kullanılamıyor.', 503))
          : statsRetry.promise;
      }
      if (url.startsWith('/api/app/form/')) return Promise.resolve({ blocks: [] });
      return Promise.resolve({ items: [] });
    };
    await mount();

    expect(await screen.findByText('Yanıtlar yüklenemedi')).toBeInTheDocument();
    expect(screen.getByText('Sunucu geçici olarak kullanılamıyor.')).toBeInTheDocument();
    expect(screen.queryByText('Toplam Yanıt')).not.toBeInTheDocument();
    expect(screen.queryByText('Henüz yanıt yok.')).not.toBeInTheDocument();
    expect(messageError).not.toHaveBeenCalled();

    // Yeniden deneme sürerken sayfa kartı "yükleniyor"a dönmez: düğme meşgul.
    const retry = screen.getByRole('button', { name: 'Tekrar dene' });
    fireEvent.click(retry);
    await waitFor(() => expect(retry).toHaveAttribute('aria-busy', 'true'));
    expect(screen.getByText('Yanıtlar yüklenemedi')).toBeInTheDocument();
    expect(screen.queryByText('Yanıtlar yükleniyor…')).not.toBeInTheDocument();

    await act(async () => { statsRetry.resolve({ ...STATS, responseCount: 5 }); });

    expect(await screen.findByText('Toplam Yanıt')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Henüz yanıt yok.')).toBeInTheDocument();
    expect(statsCalls).toBe(2);
  });

  it('liste kartının Tekrar dene\'si ve süzgeç: istek sürerken sayaç "—", CSV pasif; önceki satırlar görünmez', async () => {
    const listCalls = [];
    state.get = (url) => {
      if (url.endsWith('/statistics')) return Promise.resolve(STATS);
      if (url.startsWith('/api/app/form/')) return Promise.resolve({ blocks: [] });
      const call = { url, ...deferred() };
      listCalls.push(call);
      return call.promise;
    };
    await mount();
    await waitFor(() => expect(listCalls).toHaveLength(1));
    listCalls[0].reject(apiError('Sunucuda beklenmeyen bir hata oluştu.', 500));
    expect(await screen.findByText('Yanıtlar yüklenemedi')).toBeInTheDocument();

    // Liste kartının Tekrar dene'si: kart yerinde kalır, düğme meşgul, odak onda.
    const retry = screen.getByRole('button', { name: 'Tekrar dene' });
    retry.focus();
    fireEvent.click(retry);
    await waitFor(() => expect(listCalls).toHaveLength(2));
    await waitFor(() => expect(retry).toHaveAttribute('aria-busy', 'true'));
    expect(document.activeElement).toBe(retry);
    expect(screen.getByText('Yanıtlar (—)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '⬇ CSV' })).toBeDisabled();

    await act(async () => { listCalls[1].resolve({ items: [ROW] }); });
    expect(await screen.findByText('Firma A')).toBeInTheDocument();
    expect(screen.getByText('Yanıtlar (1)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '⬇ CSV' })).toBeEnabled();

    // Süzgeç değişti, istek sürüyor: önceki süzgecin satırları ve sayısı yeni seçimin altında
    // görünmez, CSV onları aktaramaz; Analiz de onlardan çizilmez.
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '0' } });
    await waitFor(() => expect(listCalls).toHaveLength(3));
    expect(screen.getByText('Yanıtlar (—)')).toBeInTheDocument();
    expect(screen.getByText('Yanıtlar yükleniyor…')).toBeInTheDocument();
    expect(screen.queryByText('Firma A')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '⬇ CSV' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Analiz' }));
    expect(screen.getByText('Yanıtlar yükleniyor…')).toBeInTheDocument();
    expect(screen.queryByText(/Grafik gösterilebilecek soru yok/)).not.toBeInTheDocument();

    await act(async () => { listCalls[2].resolve({ items: [] }); });
    expect(await screen.findByText(/Grafik gösterilebilecek soru yok/)).toBeInTheDocument();
    expect(screen.getByText('Yanıtlar (0)')).toBeInTheDocument();
    expect(messageError).not.toHaveBeenCalled();
  });
});
