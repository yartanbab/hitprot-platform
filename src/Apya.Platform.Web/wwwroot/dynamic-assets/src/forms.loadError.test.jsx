import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';

/**
 * Formlarım — yükleme hatası (STA-V02, DOC-13).
 *
 * Liste okunamadığında "0 form" + "Henüz formun yok" + oluşturma çağrısı çıkmamalı;
 * hata kartı + Tekrar dene gelmeli, engelleyici abp.message penceresi açılmamalı.
 * Veri kaynakları penceresinde de "Tanımlı veri kaynağı yok." hata anında yanlış.
 * Yeniden deneme sürerken iki kart da yerinde kalır (düğme meşgul), "yükleniyor"a dönmez.
 * Modül yüklenince #forms-list-root'a kendini bağlıyor; kök import'tan ÖNCE kurulur
 * ve dosyada tek test vardır (forms.race.test.jsx deseni).
 */

const formCalls = [];
const sourceCalls = [];
let formRetry;
let sourceRetry;

const apiError = (message, status) => Object.assign(new Error(message), { status });

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

vi.mock('./lib/api/httpClient', () => ({
  api: {
    get: (url) => {
      if (url.startsWith('/api/app/form-category')) return Promise.resolve({ items: [] });
      if (url.startsWith('/api/app/form/choice-sources')) {
        sourceCalls.push(url);
        return sourceCalls.length === 1
          ? Promise.reject(apiError('Sunucu geçici olarak kullanılamıyor.', 503))
          : sourceRetry.promise;
      }
      formCalls.push(url);
      return formCalls.length === 1
        ? Promise.reject(apiError('Sunucuda beklenmeyen bir hata oluştu.', 500))
        : formRetry.promise;
    },
  },
}));

describe('Formlarım · yükleme hatası', () => {
  it('liste düşerse hata kartı + Tekrar dene; sayaç "—"; pencere yok; veri kaynakları penceresi de hata der', async () => {
    const messageError = vi.fn();
    window.abp = { message: { error: messageError, info: vi.fn() }, notify: { success: vi.fn() }, auth: { isGranted: () => false } };
    document.body.innerHTML = '<div id="forms-list-root"></div>';
    await act(async () => { await import('./forms.jsx'); });

    expect(await screen.findByText('Formlar yüklenemedi')).toBeInTheDocument();
    expect(screen.getByText('Sunucuda beklenmeyen bir hata oluştu.')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.queryByText('0 form')).not.toBeInTheDocument();
    expect(screen.queryByText('Henüz formun yok')).not.toBeInTheDocument();
    expect(screen.queryByText('+ Yeni Form Oluştur')).not.toBeInTheDocument();
    expect(messageError).not.toHaveBeenCalled();

    formRetry = deferred();
    const retry = screen.getByRole('button', { name: 'Tekrar dene' });
    fireEvent.click(retry);
    await waitFor(() => expect(retry).toHaveAttribute('aria-busy', 'true'));
    expect(screen.getByText('Formlar yüklenemedi')).toBeInTheDocument();
    expect(screen.queryByText('Formlar yükleniyor…')).not.toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();

    await act(async () => {
      formRetry.resolve({ items: [{ id: 'f1', title: 'Form X', status: 0, responseCount: 0, viewCount: 0, creationTime: '2026-09-01T10:00:00Z' }] });
    });

    expect(await screen.findByText('Form X')).toBeInTheDocument();
    expect(screen.getByText('1 form')).toBeInTheDocument();
    expect(screen.queryByText('Formlar yüklenemedi')).not.toBeInTheDocument();
    expect(formCalls).toHaveLength(2);

    fireEvent.click(screen.getByText('⚡ Veri kaynakları'));

    expect(await screen.findByText('Veri kaynakları yüklenemedi')).toBeInTheDocument();
    expect(screen.queryByText('Tanımlı veri kaynağı yok.')).not.toBeInTheDocument();
    expect(messageError).not.toHaveBeenCalled();

    sourceRetry = deferred();
    const sourceButton = screen.getByRole('button', { name: 'Tekrar dene' });
    fireEvent.click(sourceButton);
    await waitFor(() => expect(sourceCalls).toHaveLength(2));
    await waitFor(() => expect(sourceButton).toHaveAttribute('aria-busy', 'true'));
    expect(screen.queryByText('Yükleniyor…')).not.toBeInTheDocument();

    await act(async () => { sourceRetry.reject(apiError('Sunucu geçici olarak kullanılamıyor.', 503)); });
    await waitFor(() => expect(sourceButton).not.toHaveAttribute('aria-busy'));
    expect(screen.getByText('Veri kaynakları yüklenemedi')).toBeInTheDocument();
  });
});
