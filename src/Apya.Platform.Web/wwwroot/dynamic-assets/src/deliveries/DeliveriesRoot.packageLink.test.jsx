import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

/**
 * Teslimler — adresle gelen paket ve buton kuralı.
 *
 * Kilitlenen davranışlar:
 *  1) Rapor derleyicinin "Üret ve teslime geç"i ve belge detayındaki "ilişkili
 *     kayıt" bağlantısı paketi adresle açar. Yalnız ?packageId= varsa proje
 *     paketten çözülür. Yarış: proje değiştiği render'da eski "yüklendi"
 *     bayrağıyla boş listede aranan paket DÜŞÜYORDU.
 *  2) Paket başlığında tek birincil düğme: taslakta "Paketi üret", üretilmiş
 *     pakette "Çıktıyı indir"; geri kalanı ⋯ menüsünde.
 */

const getPackage = vi.fn();
const getPackages = vi.fn();

vi.mock('./api', () => ({
  abpAppPath: () => '/',
  abpAuth: () => true,
  abpNotify: vi.fn(),
  addItems: vi.fn(),
  createPackage: vi.fn(),
  createShareLink: vi.fn(),
  deletePackage: vi.fn(),
  generate: vi.fn(),
  getPackage: (...args) => getPackage(...args),
  getPackages: (...args) => getPackages(...args),
  getPreflight: vi.fn(),
  getRuns: () => Promise.resolve([]),
  getShareLinks: () => Promise.resolve([]),
  getTemplates: () => Promise.resolve([]),
  removeItem: vi.fn(),
  revokeShareLink: vi.fn(),
  searchDocuments: vi.fn(),
}));

// Şeridin uygunluk özeti bu testin konusu değil.
vi.mock('../components/documents/useComplianceOverview', () => ({
  useComplianceOverview: () => ({ overview: null, loading: false, failed: false, reload: vi.fn() }),
}));

const { DeliveriesRoot } = await import('./DeliveriesRoot');

const DRAFT = { id: 'pk1', projectId: 'p1', name: 'KOSGEB ara rapor taslağı', status: 1, itemCount: 1, hasOutput: false };
const GENERATED = { id: 'pk2', projectId: 'p1', name: 'KOSGEB 1. dönem', status: 2, itemCount: 1, hasOutput: true };
const withItems = (pkg) => ({ ...pkg, items: [{ id: 'i1', annexNumber: 'EK-1', documentFileName: 'rapor.pdf', fileSize: 1024 }] });

beforeEach(() => {
  getPackage.mockReset();
  getPackages.mockReset();
  window.abp = { appPath: '/' };
});

describe('DeliveriesRoot · adresle gelen paket', () => {
  it('yalnız ?packageId= ile gelince projeyi paketten çözer ve paketi açar', async () => {
    window.history.replaceState({}, '', '/Documents/Deliveries?packageId=pk1');
    getPackage.mockImplementation((id) => Promise.resolve(withItems(id === 'pk2' ? GENERATED : DRAFT)));
    getPackages.mockResolvedValue([DRAFT, GENERATED]);

    render(<DeliveriesRoot />);

    expect(await screen.findByRole('button', { name: 'Paketi üret' })).toBeInTheDocument();
    expect(getPackages).toHaveBeenCalledWith('p1');
    expect(window.location.search).toContain('projectId=p1');
  });

  it('üretilmiş pakette birincil düğme indirmedir, üretim ⋯ menüsüne iner', async () => {
    window.history.replaceState({}, '', '/Documents/Deliveries?projectId=p1&packageId=pk2');
    getPackage.mockResolvedValue(withItems(GENERATED));
    getPackages.mockResolvedValue([DRAFT, GENERATED]);

    render(<DeliveriesRoot />);

    const download = await screen.findByRole('link', { name: /Çıktıyı indir/ });
    expect(download).toHaveAttribute('href', '/Documents/Deliveries?handler=DownloadPackage&packageId=pk2');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Paketi üret' })).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Paket eylemleri' })).toBeInTheDocument();
  });
});
