import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

/**
 * Dokümanlar — bağlantı bağlamı ve bayat yanıt (DOC-V01, STA-09).
 *
 * Kilitlenen davranışlar:
 *  1) ?folder= açılışında liste ağaç çözülmeden, klasör süzgeciyle istenir;
 *     filtresiz istek hiç gitmez. Ağaç yüklenemese de bağlam ve adres korunur.
 *  2) ?projectId= açılışında liste ağaç gelene kadar bekler, sonra TEK kez
 *     proje klasörüyle istenir. Bu arada kullanıcının seçimi ezilmez.
 *  3) Hızlı düğüm değişiminde ve mutasyon sonrası yenilemede ekrana güncel
 *     bağlamın yanıtı yazılır.
 *  4) Detay açılamazsa vurgulanan satır ile panel ayrışmaz.
 *  5) Arama debounce'lu; sayfa sıfırlaması da uygulanan metinle yapılır.
 *
 * Liste çağrıları yalnız maxResultCount === 25 olanlardır; KPI çağrıları
 * (maxResultCount 1) bu kurallara dahil değil ve kendiliğinden çözülür.
 */

let treeImpl;
let fileImpl;
let uploadImpl;
let listCalls;
let holdFiles;
let notifyCalls;

const FOLDERS = [
  { id: 'f1', title: 'Klasör 1', projectId: 'p1', parentDocumentId: null, sortOrder: 0 },
  { id: 'f2', title: 'Klasör 2', projectId: 'p2', parentDocumentId: null, sortOrder: 1 },
];

const fileFor = (input) => {
  const ctx = input.documentId ?? 'tümü';
  return {
    id: `d-${ctx}`, displayName: `Belge ${ctx}`, fileName: 'belge.pdf', contentType: 'application/pdf',
    status: 1, versionCount: 1, amount: null, currency: 'TRY', creationTime: '2026-01-05T10:00:00Z',
  };
};

function getFilesMock(input) {
  if (input.maxResultCount === 1) return Promise.resolve({ items: [], totalCount: 0 });
  return new Promise((resolve, reject) => {
    const call = { input, resolve: () => resolve({ items: [fileFor(input)], totalCount: 1 }), reject };
    listCalls.push(call);
    if (!holdFiles) call.resolve();
  });
}

vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal()),
  abpAuth: () => true,
  abpAppPath: () => '/',
  abpNotify: (...args) => notifyCalls.push(args),
  abpDocument: () => ({ getList: (...args) => treeImpl(...args) }),
  getFiles: (input) => getFilesMock(input),
  getFile: (id) => fileImpl(id),
  getSetupState: () => Promise.resolve({ setupCompleted: true }),
  getWorkSteps: () => Promise.resolve([]),
  getDocumentTypes: () => Promise.resolve([]),
  getSuggestions: () => Promise.resolve(null),
  uploadAttachment: (...args) => uploadImpl(...args),
}));

// Uygunluk özeti bu testin konusu değil.
vi.mock('../components/documents/useComplianceOverview', () => ({
  useComplianceOverview: () => ({ overview: null, loading: false, failed: false, reload: () => Promise.resolve() }),
}));

const { DocumentsRoot } = await import('./DocumentsRoot');

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

const tick = () => new Promise((r) => setTimeout(r, 0));
const lastList = () => listCalls[listCalls.length - 1];

beforeEach(() => {
  listCalls = [];
  notifyCalls = [];
  holdFiles = false;
  treeImpl = () => Promise.resolve({ items: FOLDERS });
  fileImpl = () => Promise.reject(new Error('kullanılmadı'));
  uploadImpl = () => Promise.resolve({ documentFileId: 'yeni' });
  window.abp = { appPath: '/' };
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('DocumentsRoot · bağlantı bağlamı (DOC-V01)', () => {
  it('?folder= ile ilk liste isteği ağaçtan önce klasör süzgeciyle gider, yinelenmez', async () => {
    window.history.replaceState({}, '', '/Documents?folder=f1');
    const tree = deferred();
    treeImpl = () => tree.promise;

    render(<DocumentsRoot />);

    await waitFor(() => expect(listCalls.length).toBe(1));
    expect(listCalls[0].input.documentId).toBe('f1');

    tree.resolve({ items: FOLDERS });
    expect(await screen.findByText('Klasör 1')).toBeInTheDocument();
    await tick();

    expect(listCalls.length).toBe(1);
    expect(listCalls.every((c) => c.input.documentId === 'f1')).toBe(true);
    expect(window.location.search).toContain('folder=f1');
  });

  it('ağaç yüklenemese de liste klasör süzgeçli kalır ve adres korunur', async () => {
    window.history.replaceState({}, '', '/Documents?folder=f1');
    treeImpl = () => Promise.reject(new Error('500'));

    render(<DocumentsRoot />);

    expect(await screen.findByText('Henüz klasör yok.')).toBeInTheDocument();
    await tick();

    expect(listCalls.length).toBeGreaterThan(0);
    expect(listCalls.every((c) => c.input.documentId === 'f1')).toBe(true);
    expect(window.location.search).toContain('folder=f1');
  });

  it('?projectId= ile liste ağacı bekler, sonra TEK kez proje klasörüyle istenir', async () => {
    window.history.replaceState({}, '', '/Documents?projectId=p1');
    const tree = deferred();
    treeImpl = () => tree.promise;

    render(<DocumentsRoot />);
    await tick();
    expect(listCalls.length).toBe(0);

    tree.resolve({ items: FOLDERS });
    await waitFor(() => expect(listCalls.length).toBe(1));
    await tick();

    expect(listCalls.length).toBe(1);
    expect(listCalls[0].input.documentId).toBe('f1');
    expect(listCalls[0].input.projectId).toBeUndefined();
  });

  it('ağaç beklenirken "Tüm Dokümanlar" seçilirse geri yükleme seçimi ezmez', async () => {
    window.history.replaceState({}, '', '/Documents?projectId=p1');
    const tree = deferred();
    treeImpl = () => tree.promise;

    render(<DocumentsRoot />);
    fireEvent.click(screen.getByText('Tüm Dokümanlar'));
    await waitFor(() => expect(listCalls.length).toBe(1));

    tree.resolve({ items: FOLDERS });
    expect(await screen.findByText('Klasör 1')).toBeInTheDocument();
    await tick();

    expect(listCalls.some((c) => c.input.documentId)).toBe(false);
    expect(screen.getByText('Tüm Dokümanlar').closest('button')).toHaveClass('selected');
    expect(window.location.search).not.toContain('folder=');
  });
});

describe('DocumentsRoot · bayat yanıt (STA-09)', () => {
  it('klasörler hızla değişince geç dönen eski liste yeni bağlamı ezmez', async () => {
    window.history.replaceState({}, '', '/Documents');
    render(<DocumentsRoot />);
    expect(await screen.findByText('Belge tümü')).toBeInTheDocument();

    holdFiles = true;
    fireEvent.click(screen.getByText('Klasör 1'));
    await waitFor(() => expect(lastList().input.documentId).toBe('f1'));
    const f1 = lastList();
    fireEvent.click(screen.getByText('Klasör 2'));
    await waitFor(() => expect(lastList().input.documentId).toBe('f2'));
    const f2 = lastList();

    f2.resolve();
    expect(await screen.findByText('Belge f2')).toBeInTheDocument();
    f1.resolve();
    await tick();

    expect(screen.getByText('Belge f2')).toBeInTheDocument();
    expect(screen.queryByText('Belge f1')).not.toBeInTheDocument();
  });

  it('yükleme sürerken başka klasöre geçilirse yükleme sonrası liste yeni klasörde kalır', async () => {
    window.history.replaceState({}, '', '/Documents?folder=f1');
    const upload = deferred();
    uploadImpl = () => upload.promise;

    const { container } = render(<DocumentsRoot />);
    expect(await screen.findByText('Klasör 2')).toBeInTheDocument();
    expect(await screen.findByText('Belge f1')).toBeInTheDocument();

    const input = container.querySelector('input[type="file"][multiple]');
    fireEvent.change(input, { target: { files: [new File(['x'], 'yeni.pdf', { type: 'application/pdf' })] } });

    fireEvent.click(screen.getByText('Klasör 2'));
    expect(await screen.findByText('Belge f2')).toBeInTheDocument();
    const before = listCalls.length;

    upload.resolve({ documentFileId: 'yeni' });
    await waitFor(() => expect(listCalls.length).toBeGreaterThan(before));
    await tick();

    expect(lastList().input.documentId).toBe('f2');
    expect(screen.getByText('Belge f2')).toBeInTheDocument();
    expect(screen.queryByText('Belge f1')).not.toBeInTheDocument();
  });

  it('belge detayı açılamazsa satır seçili kalmaz, panel boş duruma döner', async () => {
    window.history.replaceState({}, '', '/Documents');
    fileImpl = () => Promise.reject(new Error('500'));

    const { container } = render(<DocumentsRoot />);
    fireEvent.click(await screen.findByText('Belge tümü'));

    await waitFor(() => expect(notifyCalls).toContainEqual(['error', 'Belge detayı açılamadı.']));
    expect(container.querySelector('.apya-doc-row.is-selected')).toBeNull();
    expect(screen.getByText('Bir belge seçin')).toBeInTheDocument();
  });

  it('arama debounce\'lu: tek istek son metinle ve ilk sayfayla gider', async () => {
    window.history.replaceState({}, '', '/Documents?page=2');
    render(<DocumentsRoot />);

    await waitFor(() => expect(listCalls.length).toBe(1));
    expect(listCalls[0].input.skipCount).toBe(50);

    const box = screen.getByPlaceholderText('Bu bağlamda filtrele');
    fireEvent.change(box, { target: { value: 'f' } });
    fireEvent.change(box, { target: { value: 'fa' } });
    fireEvent.change(box, { target: { value: 'fat' } });

    await waitFor(() => expect(listCalls.length).toBe(2));
    await new Promise((r) => setTimeout(r, 350));

    expect(listCalls.length).toBe(2);
    expect(listCalls[1].input.filterText).toBe('fat');
    expect(listCalls[1].input.skipCount).toBe(0);
  });
});
