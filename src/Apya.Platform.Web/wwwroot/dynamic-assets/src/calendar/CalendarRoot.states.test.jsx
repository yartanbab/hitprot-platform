import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Takvim — yükleme ve boş durumları (CAL-09).
 *
 * Kilitlenen davranışlar:
 *  1) Feed hiç gelmediyse boş durum DEĞİL tek hata kartı + Tekrar dene; efsane, üst şerit
 *     ve 240px'lik boş ray kabı çizilmez (ay ve hafta görünümü). Yeniden deneme sürerken
 *     kart sökülmez (odak düğmede); yine düşerse aynı kart yeni hatayla kalır.
 *  2) Boş ayda ızgara kaybolmaz (42 gün hücresi) + ince ipucu şeridi; "Görev oluştur"
 *     araç çubuğundaki "Yeni görev" ile aynı modalı açar. Ajanda kendi boş kartını korur.
 *  3) Veri varken tazeleme düşerse ızgara kalır, üstte "yenilenemedi" şeridi (kanonik
 *     "Tekrar dene"); hata kartı yok.
 *  4) Kalıcı önbellek geri yüklenirken (isLoading yalan söyler) iskelet; sahte hata/boş yok.
 *  5) Feed geldi ama izinli kaynak yoksa 240px boş ray kabı yok.
 */

const state = vi.hoisted(() => ({ feed: null }));

vi.mock('../lib/api/httpClient', async (importOriginal) => ({
  ...(await importOriginal()),
  api: {
    get: (url) => {
      if (url.startsWith('/api/app/calendar/feed')) return state.feed(url);
      if (url.startsWith('/api/app/calendar/external-events')) return Promise.resolve({ items: [], accounts: [] });
      if (url.startsWith('/api/app/calendar/preferences')) return Promise.resolve({ setupCompleted: true });
      return new Promise(() => {});
    },
    post: () => Promise.resolve(null),
    put: () => Promise.resolve(null),
  },
}));

const { CalendarRoot } = await import('./CalendarRoot');
const { QueryProvider } = await import('../lib/api/QueryProvider');
const { isoDay } = await import('./lib/model');

const apiError = (message, status) => Object.assign(new Error(message), { status });
const SOURCES = [{ source: 1, isAvailable: true, count: 1 }];
const feedWith = (items) => ({ items, sources: SOURCES, dailyCapacityHours: 8 });
const ITEM = {
  key: 'task-1', source: 1, title: 'Rapor teslimi', subtitle: '',
  date: `${isoDay(new Date())}T09:00:00`, canReschedule: false, isDone: false, risk: 0, amount: null,
};

let modalOpen;

function renderCalendar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const utils = render(<QueryClientProvider client={client}><CalendarRoot /></QueryClientProvider>);
  return { client, ...utils };
}

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/Calendars');
  modalOpen = vi.fn();
  window.abp = {
    auth: { isGranted: () => true },
    ModalManager: vi.fn(function ModalManager() { this.open = modalOpen; this.onResult = vi.fn(); }),
  };
});

afterEach(() => {
  delete window.abp;
  delete window.apya;
});

/** httpClient'ın 401'de (oturumlu sayfa) ürettiği hata: merkezi pencere gösteriyor. */
const sessionError = () => Object.assign(apiError('Oturumunuz sona erdi.', 401), { apyaShown: true, apyaCentral: true });

/** G1 köprüsünün sözleşmesi: merkezi pencereye giden hata için message() null döner. */
function stubG1Bridge() {
  window.apya = {
    ajaxErrors: {
      message: (err, fallback) => (err?.apyaCentral ? null : (err?.message || fallback || null)),
      wasShown: (err) => Boolean(err?.apyaShown || err?.apyaCentral),
    },
  };
}

describe('CalendarRoot · yükleme ve boş durumları (CAL-09)', () => {
  it('feed düşerse yalnız hata kartı: boş durum, efsane, üst şerit ve boş ray kabı yok; Tekrar dene ızgarayı getirir', async () => {
    state.feed = () => Promise.reject(apiError('Sunucuda beklenmeyen bir hata oluştu.', 500));
    const { container } = renderCalendar();

    expect(await screen.findByText('Takvim yüklenemedi')).toBeInTheDocument();
    expect(screen.getByText('Sunucuda beklenmeyen bir hata oluştu.')).toBeInTheDocument();
    expect(screen.queryByText(/planlanmış bir şey yok/)).not.toBeInTheDocument();
    expect(screen.queryByText('gün yükü')).not.toBeInTheDocument();
    expect(screen.queryByText(/Takvim yenilenemedi/)).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Takvim kaynakları' })).toBeNull();
    expect(container.querySelector('.w-\\[240px\\]')).toBeNull();
    expect(screen.queryByRole('grid')).toBeNull();

    // Yeniden deneme sürerken kart sökülmez (TanStack durumu 'pending'e çekse de): iskelet,
    // 240px ray kabı ve efsane yok; düğme meşgul, odak düğmede kalır, açıklama korunur.
    let answer;
    state.feed = () => new Promise((resolve) => { answer = resolve; });
    const retry = screen.getByRole('button', { name: 'Tekrar dene' });
    expect(retry).toHaveAccessibleDescription('Takvim yüklenemedi');
    retry.focus();
    fireEvent.click(retry);

    await vi.waitFor(() => expect(answer).toBeTypeOf('function'));
    await act(() => new Promise((r) => setTimeout(r, 20)));
    expect(screen.getByText('Takvim yüklenemedi')).toBeInTheDocument();
    expect(screen.getByText('Sunucuda beklenmeyen bir hata oluştu.')).toBeInTheDocument();
    expect(retry).toHaveAttribute('aria-busy', 'true');
    expect(retry).toHaveAttribute('aria-disabled', 'true');
    expect(document.activeElement).toBe(retry);
    expect(container.querySelector('.skeleton')).toBeNull();
    expect(container.querySelector('.w-\\[240px\\]')).toBeNull();
    expect(screen.queryByText('gün yükü')).not.toBeInTheDocument();

    await act(async () => { answer(feedWith([ITEM])); });

    expect(within(await screen.findByRole('grid')).getByText('Rapor teslimi')).toBeInTheDocument();
    expect(screen.queryByText('Takvim yüklenemedi')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Takvim kaynakları' })).toBeInTheDocument();
  });

  it('yeniden deneme yine düşerse aynı kart yeni hatayla kalır; düğme tekrar etkin', async () => {
    state.feed = () => Promise.reject(apiError('Sunucuda beklenmeyen bir hata oluştu.', 500));
    renderCalendar();
    const retry = await screen.findByRole('button', { name: 'Tekrar dene' });

    state.feed = () => Promise.reject(apiError('Sunucu geçici olarak kullanılamıyor.', 503));
    fireEvent.click(retry);

    expect(await screen.findByText('Sunucu geçici olarak kullanılamıyor.')).toBeInTheDocument();
    await vi.waitFor(() => expect(retry).not.toHaveAttribute('aria-busy'));
    expect(retry).toBeInTheDocument();
    expect(screen.getByText('Takvim yüklenemedi')).toBeInTheDocument();
  });

  it('hafta görünümünde de feed düşerse yalnız hata kartı: ızgara ve efsane yok', async () => {
    window.localStorage.setItem('apya.calendar.view', 'week');
    state.feed = () => Promise.reject(apiError('Sunucuda beklenmeyen bir hata oluştu.', 500));
    renderCalendar();

    expect(await screen.findByText('Takvim yüklenemedi')).toBeInTheDocument();
    expect(screen.queryByText('gün yükü')).not.toBeInTheDocument();
    expect(screen.queryByText(/planlanmış bir şey yok/)).not.toBeInTheDocument();
    expect(screen.queryByText('Rapor teslimi')).not.toBeInTheDocument();

    state.feed = () => Promise.resolve(feedWith([ITEM]));
    fireEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));

    // Hafta ızgarası: son tarih şeridindeki öğe ve efsane geri gelir.
    expect(await screen.findByRole('button', { name: /Rapor teslimi/ })).toBeInTheDocument();
    expect(screen.getByText('gün yükü')).toBeInTheDocument();
    expect(screen.queryByText('Takvim yüklenemedi')).not.toBeInTheDocument();
  });

  it('feed geldi ama izinli kaynak yoksa 240px boş ray kabı çizilmez; ızgara çizilir', async () => {
    state.feed = () => Promise.resolve({ items: [], sources: [{ source: 1, isAvailable: false, count: 0 }], dailyCapacityHours: 8 });
    const { container } = renderCalendar();

    expect(await screen.findByRole('grid')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Takvim kaynakları' })).toBeNull();
    expect(container.querySelector('.w-\\[240px\\]')).toBeNull();
    expect(screen.queryByText('Takvim yüklenemedi')).not.toBeInTheDocument();
  });

  it('boş ayda ızgara çizilir (42 gün) + ipucu şeridi; "Görev oluştur" Yeni görev modalını açar', async () => {
    state.feed = () => Promise.resolve(feedWith([]));
    renderCalendar();

    expect(await screen.findByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('gridcell')).toHaveLength(42);
    expect(screen.getByText('Bu aralıkta planlanmış bir şey yok.')).toBeInTheDocument();
    expect(screen.getByText('gün yükü')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Görev oluştur' }));
    expect(window.abp.ModalManager).toHaveBeenCalledWith('/Tasks/CreateModal');
    expect(modalOpen).toHaveBeenCalledTimes(1);
  });

  it('ajanda görünümünde boş aralık mevcut boş kartı korur', async () => {
    window.localStorage.setItem('apya.calendar.view', 'agenda');
    state.feed = () => Promise.resolve(feedWith([]));
    renderCalendar();

    expect(await screen.findByText('Bu aralıkta planlanmış bir şey yok')).toBeInTheDocument();
    expect(screen.queryByText('Bu aralıkta planlanmış bir şey yok.')).not.toBeInTheDocument();
    expect(screen.queryByRole('grid')).toBeNull();
  });

  it('veri varken tazeleme düşerse ızgara kalır, üstte "yenilenemedi" şeridi; hata kartı yok', async () => {
    state.feed = () => Promise.resolve(feedWith([ITEM]));
    const { client } = renderCalendar();
    expect(within(await screen.findByRole('grid')).getByText('Rapor teslimi')).toBeInTheDocument();

    state.feed = () => Promise.reject(apiError('Sunucu geçici olarak kullanılamıyor.', 503));
    await act(() => client.refetchQueries({ queryKey: ['calendar', 'feed'] }));

    expect(await screen.findByText('Takvim yenilenemedi; son yüklenen veriler gösteriliyor.')).toBeInTheDocument();
    expect(within(screen.getByRole('grid')).getByText('Rapor teslimi')).toBeInTheDocument();
    expect(screen.queryByText('Takvim yüklenemedi')).not.toBeInTheDocument();

    // Şeritteki düğme de kanonik "Tekrar dene" ("Yeniden dene" yok), şeridin metniyle betimlenir.
    expect(screen.queryByText('Yeniden dene')).not.toBeInTheDocument();
    const retry = screen.getByRole('button', { name: 'Tekrar dene' });
    expect(retry).toHaveClass('btn', 'btn-sm', 'btn-outline-primary');
    expect(retry).toHaveAccessibleDescription('Takvim yenilenemedi; son yüklenen veriler gösteriliyor.');

    state.feed = () => Promise.resolve(feedWith([{ ...ITEM, title: 'Rapor teslimi (güncel)' }]));
    fireEvent.click(retry);

    expect(await within(screen.getByRole('grid')).findByText('Rapor teslimi (güncel)')).toBeInTheDocument();
    expect(screen.queryByText(/Takvim yenilenemedi/)).not.toBeInTheDocument();
  });

  it('oturum düştüyse (401) ilk yüklemede kart ayrıntısız: merkezi pencerenin metni tekrarlanmaz', async () => {
    stubG1Bridge();
    state.feed = () => Promise.reject(sessionError());
    renderCalendar();

    const title = await screen.findByText('Takvim yüklenemedi');
    expect(title.closest('[role="alert"]').querySelectorAll('p')).toHaveLength(1);
    expect(screen.queryByText('Oturumunuz sona erdi.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
  });

  it('veri ekrandayken tazeleme 401 alırsa "yenilenemedi" şeridi basılmaz (merkezi pencere gösteriyor)', async () => {
    stubG1Bridge();
    state.feed = () => Promise.resolve(feedWith([ITEM]));
    const { client } = renderCalendar();
    expect(within(await screen.findByRole('grid')).getByText('Rapor teslimi')).toBeInTheDocument();

    state.feed = () => Promise.reject(sessionError());
    await act(async () => {
      await client.refetchQueries({ queryKey: ['calendar', 'feed'] });
      // TanStack bildirimleri setTimeout(0) partisiyle React'e ulaşır; yokluk iddiası ondan sonra.
      await new Promise((r) => setTimeout(r, 20));
    });

    expect(client.getQueryCache().findAll({ queryKey: ['calendar', 'feed'] })[0].state.status).toBe('error');
    expect(screen.queryByText(/Takvim yenilenemedi/)).not.toBeInTheDocument();
    expect(screen.queryByText('Takvim yüklenemedi')).not.toBeInTheDocument();
    expect(within(screen.getByRole('grid')).getByText('Rapor teslimi')).toBeInTheDocument();
  });

  it('kalıcı önbellek geri yüklenirken iskelet: sahte hata kartı ya da boş ipucu yok', () => {
    window.abp.currentUser = { id: 'u1', tenantId: 't1' };
    state.feed = () => new Promise(() => {});

    const { container, unmount } = render(<QueryProvider><CalendarRoot /></QueryProvider>);

    expect(container.querySelector('.skeleton')).not.toBeNull();
    expect(screen.queryByText('Takvim yüklenemedi')).not.toBeInTheDocument();
    expect(screen.queryByText(/planlanmış bir şey yok/)).not.toBeInTheDocument();
    expect(screen.queryByRole('grid')).toBeNull();
    // Ölçülen yalnız ilk kare (geri yükleme penceresi); sonraki geri yükleme güncellemesi beklenmez.
    unmount();
  });
});
