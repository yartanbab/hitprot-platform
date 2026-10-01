import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

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
const addItems = vi.fn();
const searchDocuments = vi.fn();

vi.mock('./api', () => ({
  abpAppPath: () => '/',
  abpAuth: () => true,
  abpNotify: vi.fn(),
  addItems: (...args) => addItems(...args),
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
  searchDocuments: (...args) => searchDocuments(...args),
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
  addItems.mockReset();
  searchDocuments.mockReset();
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

/**
 * Bayat yanıt (STA-09): yalnız son açılan paketin yanıtı yazılır; ekleme gibi
 * mutasyonlar sürerken başka paket açıldıysa eski paketin detayı yeni seçimin
 * altına yazılmaz. Ek arama kutusu debounce'lu ve bayat yanıtı yutar.
 */
describe('DeliveriesRoot · bayat yanıt', () => {
  function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // Elle çözülen yanıt act içinde akar; React güncellemeleri uyarısız işlenir.
  const settle = (fn) => act(async () => { fn(); await wait(0); });
  // Ad hem listede hem başlıkta geçebilir; listedeki düğme alınır.
  const packageButton = (name) => screen.getAllByText(name).map((el) => el.closest('button')).find(Boolean);
  const openFirst = async (name) => { await screen.findAllByText(name); fireEvent.click(packageButton(name)); };
  const detailArea = (container) => container.querySelector('.apya-docs-main');

  let packageCalls;

  beforeEach(() => {
    window.history.replaceState({}, '', '/Documents/Deliveries?projectId=p1');
    getPackages.mockResolvedValue([DRAFT, GENERATED]);
    packageCalls = [];
    getPackage.mockImplementation((id) => {
      const call = { id, ...deferred() };
      packageCalls.push(call);
      return call.promise;
    });
  });

  it('geç dönen eski paket yeni seçimi ezmez; yüklenirken önceki paketin eylemleri görünmez', async () => {
    const { container } = render(<DeliveriesRoot />);

    await openFirst(GENERATED.name);
    await settle(() => packageCalls[0].resolve(withItems(GENERATED)));
    expect(await screen.findByRole('link', { name: /Çıktıyı indir/ })).toBeInTheDocument();

    fireEvent.click(packageButton(DRAFT.name));
    await waitFor(() => expect(screen.queryByRole('link', { name: /Çıktıyı indir/ })).not.toBeInTheDocument());
    expect(detailArea(container).querySelector('[aria-busy="true"]')).not.toBeNull();

    fireEvent.click(packageButton(GENERATED.name));
    await settle(() => packageCalls[2].resolve(withItems(GENERATED)));
    expect(await screen.findByRole('link', { name: /Çıktıyı indir/ })).toBeInTheDocument();

    await settle(() => packageCalls[1].resolve(withItems(DRAFT)));

    expect(screen.getByRole('link', { name: /Çıktıyı indir/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Paketi üret' })).not.toBeInTheDocument();
  });

  it('paket açılamazsa hiçbir paket seçili kalmaz', async () => {
    const { container } = render(<DeliveriesRoot />);

    await openFirst(DRAFT.name);
    await settle(() => packageCalls[0].reject(new Error('500')));

    expect(await screen.findByText('Bir paket seçin')).toBeInTheDocument();
    expect(container.querySelector('.apya-md-item.selected')).toBeNull();
  });

  it('ek araması debounce\'lu; kutu temizlenince geç dönen yanıt listeyi doldurmaz', async () => {
    const searches = [];
    searchDocuments.mockImplementation((projectId, text) => {
      const call = { text, ...deferred() };
      searches.push(call);
      return call.promise;
    });
    render(<DeliveriesRoot />);
    await openFirst(DRAFT.name);
    await settle(() => packageCalls[0].resolve(withItems(DRAFT)));
    const box = await screen.findByPlaceholderText('Ek eklemek için belge ara');

    // 300 ms dolmadan silinen metin için istek hiç gitmez.
    fireEvent.change(box, { target: { value: 'x' } });
    fireEvent.change(box, { target: { value: '' } });
    await wait(350);
    expect(searches).toHaveLength(0);

    fireEvent.change(box, { target: { value: 'ra' } });
    await waitFor(() => expect(searches).toHaveLength(1));
    fireEvent.change(box, { target: { value: '' } });
    await settle(() => searches[0].resolve({ items: [{ id: 'doc1', displayName: 'ek-belge.pdf', documentTypeName: 'Rapor' }] }));

    expect(screen.queryByText('ek-belge.pdf')).not.toBeInTheDocument();
  });

  it('ek eklenirken başka paket açılırsa eski paketin detayı yeni seçimin altına yazılmaz', async () => {
    searchDocuments.mockResolvedValue({ items: [{ id: 'doc1', displayName: 'ek-belge.pdf', documentTypeName: 'Rapor' }] });
    const add = deferred();
    addItems.mockReturnValue(add.promise);
    render(<DeliveriesRoot />);
    await openFirst(DRAFT.name);
    await settle(() => packageCalls[0].resolve(withItems(DRAFT)));

    fireEvent.change(await screen.findByPlaceholderText('Ek eklemek için belge ara'), { target: { value: 'ra' } });
    fireEvent.click(await screen.findByText('ek-belge.pdf'));
    expect(addItems).toHaveBeenCalledWith('pk1', ['doc1']);

    fireEvent.click(packageButton(GENERATED.name));
    await settle(() => packageCalls[1].resolve(withItems(GENERATED)));
    expect(await screen.findByRole('link', { name: /Çıktıyı indir/ })).toBeInTheDocument();

    await settle(() => add.resolve(withItems(DRAFT)));

    expect(screen.getByRole('link', { name: /Çıktıyı indir/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Paketi üret' })).not.toBeInTheDocument();
  });
});
