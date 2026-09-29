import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Takvim — yükleme ve boş durumları (CAL-09).
 *
 * Kilitlenen davranışlar:
 *  1) Feed hiç gelmediyse boş durum DEĞİL tek hata kartı + Tekrar dene; efsane, üst şerit
 *     ve 240px'lik boş ray kabı çizilmez.
 *  2) Boş ayda ızgara kaybolmaz (42 gün hücresi) + ince ipucu şeridi; "Görev oluştur"
 *     araç çubuğundaki "Yeni görev" ile aynı modalı açar. Ajanda kendi boş kartını korur.
 *  3) Veri varken tazeleme düşerse ızgara kalır, üstte "yenilenemedi" şeridi; hata kartı yok.
 *  4) Kalıcı önbellek geri yüklenirken (isLoading yalan söyler) iskelet; sahte hata/boş yok.
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

    state.feed = () => Promise.resolve(feedWith([ITEM]));
    fireEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));

    expect(within(await screen.findByRole('grid')).getByText('Rapor teslimi')).toBeInTheDocument();
    expect(screen.queryByText('Takvim yüklenemedi')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Takvim kaynakları' })).toBeInTheDocument();
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
