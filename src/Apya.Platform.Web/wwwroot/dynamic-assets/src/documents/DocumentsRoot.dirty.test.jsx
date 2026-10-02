import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

/**
 * Dokümanlar — belge detayında kaydedilmemiş taslak koruması (DOC-09).
 *
 * Detay panelinde alan değiştirip başka belgeye tıklamak, "Uygunluk" / "Etkinlik" sekmesine
 * geçmek ya da sayfayı yenilemek taslağı uyarısız siliyordu. Artık belge ve sekme değişimi
 * ortak pencereyi açar ("Düzenlemeye devam et" / "Değişiklikleri at" / "Kaydet ve devam et"),
 * sayfadan ayrılırken tarayıcı uyarır.
 * Kurulum DocumentsRoot.race.test.jsx deseni ('./api' sahtesi).
 */

const FILES = [
  { id: 'a', displayName: 'Belge A', fileName: 'a.pdf', contentType: 'application/pdf', status: 1, versionCount: 1, amount: null, currency: 'TRY', creationTime: '2026-01-05T10:00:00Z' },
  { id: 'b', displayName: 'Belge B', fileName: 'b.pdf', contentType: 'application/pdf', status: 1, versionCount: 1, amount: null, currency: 'TRY', creationTime: '2026-01-06T10:00:00Z' },
];

const detailFor = (id, extra = {}) => ({
  ...FILES.find((f) => f.id === id),
  fileSize: 1024, isLocked: false, expiryDate: null, folderName: 'Klasör', uploaderName: 'Ayşe',
  documentTypeId: null, documentDate: null, periodCode: id === 'a' ? '2026-Q1' : '2025-Q4',
  fields: [], tags: [], related: [], versions: [],
  ...extra,
});

let getFileImpl;
let updateImpl;
let getFileCalls;
let updateCalls;
let notifyCalls;

vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal()),
  abpAuth: () => true,
  abpAppPath: () => '/',
  abpNotify: (...args) => notifyCalls.push(args),
  abpDocument: () => ({ getList: () => Promise.resolve({ items: [] }) }),
  getFiles: (input) => Promise.resolve(input.maxResultCount === 1
    ? { items: [], totalCount: 0 }
    : { items: FILES, totalCount: FILES.length }),
  getFile: (id) => { getFileCalls.push(id); return getFileImpl(id); },
  updateFileMeta: (id, dto) => { updateCalls.push([id, dto]); return updateImpl(id, dto); },
  getSetupState: () => Promise.resolve({ setupCompleted: true }),
  getWorkSteps: () => Promise.resolve([]),
  getDocumentTypes: () => Promise.resolve([]),
  getSuggestions: () => Promise.resolve(null),
}));

vi.mock('../components/documents/useComplianceOverview', () => ({
  useComplianceOverview: () => ({ overview: null, loading: false, failed: false, reload: () => Promise.resolve() }),
}));

// Sekme içerikleri bu testin konusu değil (kendi uçlarını çağırırlar).
vi.mock('./components/ComplianceTab', () => ({ ComplianceTab: () => <div>Uygunluk içeriği</div> }));
vi.mock('./components/ActivityTab', () => ({ ActivityTab: () => <div>Etkinlik içeriği</div> }));

const { DocumentsRoot } = await import('./DocumentsRoot');

const TITLE = 'Kaydedilmemiş değişiklikleriniz var';
const STAY = 'Düzenlemeye devam et';
const DISCARD = 'Değişiklikleri at';
const SAVE_CONTINUE = 'Kaydet ve devam et';

const period = () => screen.getByLabelText('Dönem');
const dialog = () => screen.findByRole('alertdialog', { name: TITLE });
const noDialog = () => expect(screen.queryByRole('alertdialog')).toBeNull();
const button = (name) => screen.getByRole('button', { name });
const selectedRow = (container) => container.querySelector('.apya-doc-row.is-selected');
/* Pencere açıkken Radix sayfanın kalanını aria-hidden yapar: sekmeler gizli ağaçta da aranır. */
const tab = (name) => screen.getByRole('tab', { name, hidden: true });

const unloadBlocked = () => {
  const event = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(event);
  return event.defaultPrevented;
};

/** Belge A'yı açar; `edit` verilirse Dönem'e yazar (taslak kirlenir). */
async function openA({ edit } = {}) {
  const view = render(<DocumentsRoot />);
  fireEvent.click(await screen.findByText('Belge A'));
  await waitFor(() => expect(period()).toHaveValue('2026-Q1'));
  if (edit) fireEvent.change(period(), { target: { value: edit } });
  return view;
}

beforeEach(() => {
  getFileCalls = [];
  updateCalls = [];
  notifyCalls = [];
  getFileImpl = (id) => Promise.resolve(detailFor(id));
  updateImpl = () => Promise.resolve();
  window.abp = { appPath: '/' };
  window.history.replaceState({}, '', '/Documents');
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => { delete window.abp; });

describe('DocumentsRoot — kirli taslakta belge değişimi (DOC-09)', () => {
  it('Dönem yazılıp başka satıra tıklanınca pencere açılır; ikinci belge İSTENMEZ, seçili satır değişmez', async () => {
    const { container } = await openA({ edit: '2026-Q3' });

    fireEvent.click(screen.getByText('Belge B'));

    const alert = await dialog();
    expect(alert).toHaveAccessibleDescription('Bu belgede yaptığınız değişiklikler kaydedilmedi. Devam ederseniz kaybolur.');
    expect(button(SAVE_CONTINUE)).toBeInTheDocument();
    expect(getFileCalls).toEqual(['a']);
    expect(selectedRow(container)).toHaveTextContent('Belge A');
  });

  it('"Düzenlemeye devam et": yazılan değer panelde durur', async () => {
    const { container } = await openA({ edit: '2026-Q3' });
    fireEvent.click(screen.getByText('Belge B'));
    await dialog();

    fireEvent.click(button(STAY));

    await waitFor(noDialog);
    expect(period()).toHaveValue('2026-Q3');
    expect(getFileCalls).toEqual(['a']);
    expect(selectedRow(container)).toHaveTextContent('Belge A');
  });

  it('"Değişiklikleri at": ikinci belge açılır, taslak atılır, kayıt gitmez', async () => {
    const { container } = await openA({ edit: '2026-Q3' });
    fireEvent.click(screen.getByText('Belge B'));
    await dialog();

    fireEvent.click(button(DISCARD));

    await waitFor(() => expect(period()).toHaveValue('2025-Q4'));
    expect(getFileCalls).toEqual(['a', 'b']);
    expect(updateCalls).toEqual([]);
    expect(selectedRow(container)).toHaveTextContent('Belge B');
    noDialog();
    // Yeni belge temiz: geri dönmek pencere açmaz.
    fireEvent.click(screen.getByText('Belge A'));
    await waitFor(() => expect(period()).toHaveValue('2026-Q1'));
    noDialog();
  });

  it('"Kaydet ve devam et": yeni dönemle kaydeder, sonra ikinci belgeyi açar', async () => {
    getFileImpl = (id) => Promise.resolve(detailFor(id, id === 'a' && updateCalls.length ? { periodCode: '2026-Q3' } : {}));
    await openA({ edit: '2026-Q3' });
    fireEvent.click(screen.getByText('Belge B'));
    await dialog();

    fireEvent.click(button(SAVE_CONTINUE));

    await waitFor(() => expect(period()).toHaveValue('2025-Q4'));
    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0][0]).toBe('a');
    expect(updateCalls[0][1]).toMatchObject({ periodCode: '2026-Q3' });
    expect(getFileCalls).toEqual(['a', 'a', 'b']);            // aç · kayıt sonrası tazele · ikinci belge
    noDialog();
  });

  it('kayıt düşerse pencere AÇIK kalır, ikinci belge açılmaz, taslak yerinde', async () => {
    updateImpl = () => Promise.reject(new Error('500'));
    const { container } = await openA({ edit: '2026-Q3' });
    fireEvent.click(screen.getByText('Belge B'));
    await dialog();

    fireEvent.click(button(SAVE_CONTINUE));

    expect(await screen.findByText('Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.')).toBeInTheDocument();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(notifyCalls).toContainEqual(['error', 'Belge güncellenemedi.']);
    expect(getFileCalls).toEqual(['a']);
    expect(selectedRow(container)).toHaveTextContent('Belge A');

    // Kilit yok: "Değişiklikleri at" ile ikinci belgeye geçilir.
    await waitFor(() => expect(button(DISCARD)).toBeEnabled());
    fireEvent.click(button(DISCARD));
    await waitFor(() => expect(period()).toHaveValue('2025-Q4'));
  });

  it('kirliyken aynı (seçili) satıra tıklamak hiçbir şey yapmaz (yeniden yükleyip taslağı silmez)', async () => {
    const { container } = await openA({ edit: '2026-Q3' });

    fireEvent.click(selectedRow(container));      // ad panelde de yazdığı için satırın kendisi
    await new Promise((resolve) => setTimeout(resolve, 0));

    noDialog();
    expect(getFileCalls).toEqual(['a']);
    expect(period()).toHaveValue('2026-Q3');
  });

  it('paneldeki Kaydet başarılıysa taslak temizlenir: sonraki belge değişimi sormaz', async () => {
    getFileImpl = (id) => Promise.resolve(detailFor(id, id === 'a' && updateCalls.length ? { periodCode: '2026-Q3' } : {}));
    await openA({ edit: '2026-Q3' });

    fireEvent.click(button('Kaydet'));
    await waitFor(() => expect(getFileCalls).toEqual(['a', 'a']));
    await waitFor(() => expect(unloadBlocked()).toBe(false));

    fireEvent.click(screen.getByText('Belge B'));
    await waitFor(() => expect(period()).toHaveValue('2025-Q4'));
    noDialog();
  });

  it('temizken satır değişimi pencere açmaz', async () => {
    await openA();

    fireEvent.click(screen.getByText('Belge B'));

    await waitFor(() => expect(period()).toHaveValue('2025-Q4'));
    noDialog();
  });
});

describe('DocumentsRoot — kirli taslakta sekme değişimi (DOC-09)', () => {
  it('"Uygunluk" sekmesi pencere açar; "devam et" sekmeyi değiştirmez, "at" değiştirir', async () => {
    await openA({ edit: '2026-Q3' });

    fireEvent.click(tab('Uygunluk'));
    await dialog();
    expect(tab('Dosyalar')).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(button(STAY));
    await waitFor(noDialog);
    expect(period()).toHaveValue('2026-Q3');

    fireEvent.click(tab('Uygunluk'));
    await dialog();
    fireEvent.click(button(DISCARD));

    expect(await screen.findByText('Uygunluk içeriği')).toBeInTheDocument();
    expect(tab('Uygunluk')).toHaveAttribute('aria-selected', 'true');
    expect(updateCalls).toEqual([]);
    // Dosyalar'a dönünce panel sunucu değeriyle gelir, koruma temizdir.
    fireEvent.click(tab('Dosyalar'));
    await waitFor(() => expect(period()).toHaveValue('2026-Q1'));
    noDialog();
    expect(unloadBlocked()).toBe(false);
  });

  it('süreç şeridinden Uygunluk adımına geçiş de pencere açar', async () => {
    await openA({ edit: '2026-Q3' });

    fireEvent.click(screen.getByRole('link', { name: /2\. Uygunluk/ }));

    await dialog();
    expect(tab('Dosyalar')).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(button(DISCARD));
    expect(await screen.findByText('Uygunluk içeriği')).toBeInTheDocument();
  });

  it('"Kaydet ve devam et" sekme değişiminde: kaydeder, sonra sekme değişir', async () => {
    await openA({ edit: '2026-Q3' });
    fireEvent.click(tab('Etkinlik'));
    await dialog();

    fireEvent.click(button(SAVE_CONTINUE));

    expect(await screen.findByText('Etkinlik içeriği')).toBeInTheDocument();
    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0][1]).toMatchObject({ periodCode: '2026-Q3' });
  });

  it('temizken sekme değişimi pencere açmaz', async () => {
    await openA();

    fireEvent.click(tab('Uygunluk'));

    expect(await screen.findByText('Uygunluk içeriği')).toBeInTheDocument();
    noDialog();
  });
});

describe('DocumentsRoot — sayfadan ayrılma (DOC-09)', () => {
  it('kirliyken beforeunload engellenir; temizken ve eski değere dönünce engellenmez', async () => {
    await openA();
    expect(unloadBlocked()).toBe(false);

    fireEvent.change(period(), { target: { value: '2026-Q3' } });
    await waitFor(() => expect(unloadBlocked()).toBe(true));

    fireEvent.change(period(), { target: { value: '2026-Q1' } });
    await waitFor(() => expect(unloadBlocked()).toBe(false));
  });
});
