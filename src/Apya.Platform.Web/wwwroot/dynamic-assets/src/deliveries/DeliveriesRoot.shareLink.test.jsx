import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Teslimler — paylaşım bağlantısı.
 *
 * Bağlantı (içindeki anahtarla) sunucudan YALNIZ oluşturma yanıtında döner; sonradan yeniden
 * gösterilemez. Kilitlenen davranışlar:
 *  1) Seçenekler ve bağlantı tarayıcı kutularında değil, sayfanın kendi penceresinde.
 *  2) Bağlantı, liste yenilemesinden ÖNCE gösterilir: yenileme düşerse bağlantı kaybolmaz
 *     ve "oluşturulamadı" denmez (bağlantı oluşmuştur).
 */

const createShareLink = vi.fn();
const getShareLinks = vi.fn();
const abpNotify = vi.fn();

vi.mock('./api', () => ({
  abpAppPath: () => '/',
  abpAuth: () => true,
  abpNotify: (...args) => abpNotify(...args),
  addItems: vi.fn(),
  createPackage: vi.fn(),
  createShareLink: (...args) => createShareLink(...args),
  deletePackage: vi.fn(),
  generate: vi.fn(),
  getPackage: () => Promise.resolve({
    id: 'pk2', projectId: 'p1', name: 'KOSGEB 1. dönem', status: 2, itemCount: 1, hasOutput: true,
    items: [{ id: 'i1', annexNumber: 'EK-1', documentFileName: 'rapor.pdf', fileSize: 1024 }],
  }),
  getPackages: () => Promise.resolve([
    { id: 'pk2', projectId: 'p1', name: 'KOSGEB 1. dönem', status: 2, itemCount: 1, hasOutput: true },
  ]),
  getPreflight: vi.fn(),
  getRuns: () => Promise.resolve([]),
  getShareLinks: (...args) => getShareLinks(...args),
  getTemplates: () => Promise.resolve([]),
  removeItem: vi.fn(),
  revokeShareLink: vi.fn(),
  searchDocuments: vi.fn(),
}));

vi.mock('../components/documents/useComplianceOverview', () => ({
  useComplianceOverview: () => ({ overview: null, loading: false, failed: false, reload: vi.fn() }),
}));

const { DeliveriesRoot } = await import('./DeliveriesRoot');

const CREATED = { id: 'l1', url: '/Shared/Package?token=abc' };
const expectedLink = () => window.location.origin + CREATED.url;

let promptSpy;
let confirmSpy;

beforeEach(() => {
  createShareLink.mockReset();
  getShareLinks.mockReset();
  abpNotify.mockReset();
  getShareLinks.mockResolvedValue([]);
  window.abp = { appPath: '/' };
  window.history.replaceState({}, '', '/Documents/Deliveries?projectId=p1&packageId=pk2');
  promptSpy = vi.spyOn(window, 'prompt').mockReturnValue(null);
  confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
});

afterEach(() => {
  promptSpy.mockRestore();
  confirmSpy.mockRestore();
});

async function openShareDialog(user) {
  await screen.findByRole('link', { name: /Çıktıyı indir/ });
  await user.click(screen.getByRole('button', { name: 'Paket eylemleri' }));
  await user.click(await screen.findByRole('button', { name: /Paylaşım bağlantısı oluştur/ }));
}

describe('DeliveriesRoot · paylaşım bağlantısı', () => {
  it('seçenekleri pencerede sorar, bağlantıyı pencerede gösterir; tarayıcı kutusu açmaz', async () => {
    createShareLink.mockResolvedValue(CREATED);
    const user = userEvent.setup();
    render(<DeliveriesRoot />);

    await openShareDialog(user);
    await user.click(screen.getByLabelText('İndirmeye izin ver'));
    await user.click(screen.getByRole('button', { name: 'Bağlantı oluştur' }));

    expect(await screen.findByLabelText('Paylaşım bağlantısı')).toHaveValue(expectedLink());
    expect(createShareLink).toHaveBeenCalledWith({
      targetType: 1, targetId: 'pk2', lifetimeDays: 14, allowDownload: true, watermark: null,
    });
    expect(promptSpy).not.toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('vazgeçilirse bağlantı oluşturulmaz', async () => {
    const user = userEvent.setup();
    render(<DeliveriesRoot />);

    await openShareDialog(user);
    await user.click(screen.getByRole('button', { name: 'Vazgeç' }));

    await waitFor(() => expect(screen.queryByLabelText('Geçerlilik süresi (gün)')).not.toBeInTheDocument());
    expect(createShareLink).not.toHaveBeenCalled();
  });

  it('liste yenilenemese de oluşan bağlantı gösterilir ve hata denmez', async () => {
    createShareLink.mockResolvedValue(CREATED);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<DeliveriesRoot />);

    await openShareDialog(user);
    // Paket açılırken liste bir kez okundu; oluşturma sonrasındaki yenileme düşüyor.
    getShareLinks.mockRejectedValue(new Error('500'));
    await user.click(screen.getByRole('button', { name: 'Bağlantı oluştur' }));

    expect(await screen.findByLabelText('Paylaşım bağlantısı')).toHaveValue(expectedLink());
    expect(abpNotify).not.toHaveBeenCalledWith('error', 'Bağlantı oluşturulamadı.');
    errorSpy.mockRestore();
  });

  it('bağlantı oluşturulamazsa pencere seçeneklerle açık kalır', async () => {
    createShareLink.mockRejectedValue(new Error('500'));
    const user = userEvent.setup();
    render(<DeliveriesRoot />);

    await openShareDialog(user);
    await user.click(screen.getByRole('button', { name: 'Bağlantı oluştur' }));

    await waitFor(() => expect(abpNotify).toHaveBeenCalledWith('error', 'Bağlantı oluşturulamadı.'));
    expect(screen.getByLabelText('Geçerlilik süresi (gün)')).toBeInTheDocument();
    expect(screen.queryByLabelText('Paylaşım bağlantısı')).not.toBeInTheDocument();
  });
});
