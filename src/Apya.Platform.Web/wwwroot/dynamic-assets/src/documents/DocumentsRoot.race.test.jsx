import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
 *
 * Yükleme hatası (DOC-13): boş durum değil hata kartı; toast/ABP penceresi yok
 * (her yükleme isteği { abpHandleError: false } taşır).
 */

let treeImpl;
let fileImpl;
let uploadImpl;
let listCalls;
let holdFiles;
let notifyCalls;
let loadArgs;
let kpiAjax;

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

function getFilesMock(input, ajax) {
  if (input.maxResultCount === 1) {
    kpiAjax.push(ajax);
    return Promise.resolve({ items: [], totalCount: 0 });
  }
  return new Promise((resolve, reject) => {
    const call = {
      input, ajax, reject,
      resolve: () => resolve({ items: [fileFor(input)], totalCount: 1 }),
      resolveWith: (value) => resolve(value),
    };
    listCalls.push(call);
    if (!holdFiles) call.resolve();
  });
}

/** Son argüman (abp.ajax seçenekleri) kaydedilir: yükleme istekleri ABP penceresini kapatmalı. */
const recording = (name, result) => (...args) => { loadArgs[name] = args; return result(); };

vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal()),
  abpAuth: () => true,
  abpAppPath: () => '/',
  abpNotify: (...args) => notifyCalls.push(args),
  abpDocument: () => ({ getList: (...args) => { loadArgs.tree = args; return treeImpl(...args); } }),
  getFiles: (input, ajax) => getFilesMock(input, ajax),
  getFile: (id) => fileImpl(id),
  getSetupState: recording('setupState', () => Promise.resolve({ setupCompleted: true })),
  getWorkSteps: recording('workSteps', () => Promise.resolve([])),
  getDocumentTypes: recording('documentTypes', () => Promise.resolve([])),
  getSuggestions: recording('suggestions', () => Promise.resolve(null)),
  uploadAttachment: (...args) => uploadImpl(...args),
}));

// Uygunluk özeti bu testin konusu değil; yalnız KPI alt satırı için `failed` değiştirilir.
let complianceFailed;
vi.mock('../components/documents/useComplianceOverview', () => ({
  useComplianceOverview: () => ({ overview: null, loading: false, failed: complianceFailed, reload: () => Promise.resolve() }),
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
  loadArgs = {};
  kpiAjax = [];
  complianceFailed = false;
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

    // Ağaç okunamadı: "Henüz klasör yok." değil hata kartı (DOC-13).
    expect(await screen.findByText('Klasörler yüklenemedi')).toBeInTheDocument();
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

describe('DocumentsRoot · yükleme hatası (DOC-13)', () => {
  const QUIET = { abpHandleError: false };

  afterEach(() => {
    delete window.apya;
  });

  it('oturum düştüyse (401, merkezi pencere) kartta ikinci metin yok: başlık + Tekrar dene', async () => {
    // G1 köprüsünün sözleşmesi: merkezi pencereye giden hata için message() null döner.
    window.apya = {
      ajaxErrors: {
        message: (err, fallback) => (err?.apyaCentral ? null : (err?.message || fallback || null)),
        wasShown: (err) => Boolean(err?.apyaShown || err?.apyaCentral),
      },
    };
    window.history.replaceState({}, '', '/Documents');
    holdFiles = true;
    render(<DocumentsRoot />);
    await waitFor(() => expect(listCalls.length).toBe(1));

    listCalls[0].reject({ message: 'Current user did not login to the application!', apyaShown: true, apyaCentral: true });

    const title = await screen.findByText('Belge listesi yüklenemedi');
    const card = title.closest('[role="alert"]');
    expect(card.querySelectorAll('p')).toHaveLength(1);
    expect(screen.queryByText('Current user did not login to the application!')).not.toBeInTheDocument();
    expect(screen.queryByText('Veri alınırken bir hata oluştu.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
    expect(notifyCalls).toEqual([]);
  });

  it('ekran yükleme istekleri ABP hata penceresini kapatır', async () => {
    window.history.replaceState({}, '', '/Documents');
    render(<DocumentsRoot />);
    expect(await screen.findByText('Belge tümü')).toBeInTheDocument();
    await waitFor(() => expect(loadArgs.setupState).toBeDefined());

    expect(listCalls[0].ajax).toEqual(QUIET);
    expect(kpiAjax).toEqual([QUIET, QUIET]);
    expect(loadArgs.tree.at(-1)).toEqual(QUIET);
    expect(loadArgs.workSteps.at(-1)).toEqual(QUIET);
    expect(loadArgs.documentTypes.at(-1)).toEqual(QUIET);
    expect(loadArgs.suggestions.at(-1)).toEqual(QUIET);
    expect(loadArgs.setupState.at(-1)).toEqual(QUIET);
  });

  it('liste düşerse boş durum değil hata kartı; sayaç "—"; toast yok; Tekrar dene listeyi getirir', async () => {
    window.history.replaceState({}, '', '/Documents');
    holdFiles = true;
    render(<DocumentsRoot />);
    await waitFor(() => expect(listCalls.length).toBe(1));

    // ABP zarfı: kartın açıklaması G1 hata kanalından (errorMessage) gelir.
    listCalls[0].reject({ message: 'Sunucuda beklenmeyen bir hata oluştu.' });

    expect(await screen.findByText('Belge listesi yüklenemedi')).toBeInTheDocument();
    expect(screen.getByText('Sunucuda beklenmeyen bir hata oluştu.')).toBeInTheDocument();
    expect(screen.queryByText('Burada henüz belge yok')).not.toBeInTheDocument();
    expect(screen.getByText('— belge')).toBeInTheDocument();
    expect(notifyCalls).toEqual([]);

    holdFiles = false;
    fireEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));

    expect(await screen.findByText('Belge tümü')).toBeInTheDocument();
    expect(screen.queryByText('Belge listesi yüklenemedi')).not.toBeInTheDocument();
    expect(screen.getByText('1 belge')).toBeInTheDocument();
  });

  it('bağlam değişiminde liste düşerse önceki klasörün belgeleri yeni seçimin altında kalmaz', async () => {
    window.history.replaceState({}, '', '/Documents');
    render(<DocumentsRoot />);
    expect(await screen.findByText('Belge tümü')).toBeInTheDocument();

    holdFiles = true;
    fireEvent.click(screen.getByText('Klasör 2'));
    await waitFor(() => expect(lastList().input.documentId).toBe('f2'));
    lastList().reject(new Error('500'));

    expect(await screen.findByText('Belge listesi yüklenemedi')).toBeInTheDocument();
    expect(screen.queryByText('Belge tümü')).not.toBeInTheDocument();
    expect(screen.getByText('— belge')).toBeInTheDocument();
  });

  it('geç dönen eski hata yeni başarının üstüne hata kartı yazmaz', async () => {
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
    f1.reject(new Error('500'));
    await tick();

    expect(screen.getByText('Belge f2')).toBeInTheDocument();
    expect(screen.queryByText('Belge listesi yüklenemedi')).not.toBeInTheDocument();
  });

  it('ağaç okunamazsa kurulum eylemi (Şemayı kur / Yeni klasör) çıkmaz; ağacın Tekrar dene\'si ağacı getirir', async () => {
    window.history.replaceState({}, '', '/Documents');
    treeImpl = () => Promise.reject(new Error('500'));
    holdFiles = true;
    render(<DocumentsRoot />);

    expect(await screen.findByText('Klasörler yüklenemedi')).toBeInTheDocument();
    expect(screen.queryByText('Henüz klasör yok.')).not.toBeInTheDocument();
    await waitFor(() => expect(listCalls.length).toBe(1));
    await waitFor(() => expect(loadArgs.setupState).toBeDefined());
    listCalls[0].resolveWith({ items: [], totalCount: 0 });

    // Liste gerçekten boş (başarılı) — ama klasör olmadığı bilinmiyor: sihirbaz önerilmez.
    expect(await screen.findByText('Burada henüz belge yok')).toBeInTheDocument();
    expect(screen.queryByText('Şemayı kur')).not.toBeInTheDocument();
    expect(screen.queryByText('Yeni klasör')).not.toBeInTheDocument();
    expect(screen.queryByText('veya boş klasörle başla')).not.toBeInTheDocument();
    expect(screen.queryByText(/Klasör şemasını/)).not.toBeInTheDocument();
    expect(notifyCalls).toEqual([]);

    treeImpl = () => Promise.resolve({ items: FOLDERS });
    fireEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));

    expect(await screen.findByText('Klasör 1')).toBeInTheDocument();
    expect(screen.queryByText('Klasörler yüklenemedi')).not.toBeInTheDocument();
  });

  it('proje seçiliyken uygunluk özeti okunamazsa KPI alt satırı "Yüklenemedi" der, "Proje bağlamı seçin" demez', async () => {
    complianceFailed = true;
    window.history.replaceState({}, '', '/Documents?folder=f1');
    render(<DocumentsRoot />);

    expect(await screen.findByText('Yüklenemedi')).toBeInTheDocument();
    expect(screen.queryAllByText('Proje bağlamı seçin')).toHaveLength(0);
  });

  it('ağaç yeniden denenince adresteki klasör projesiyle geri yüklenir', async () => {
    window.history.replaceState({}, '', '/Documents?folder=f1');
    treeImpl = () => Promise.reject(new Error('500'));
    render(<DocumentsRoot />);

    expect(await screen.findByText('Klasörler yüklenemedi')).toBeInTheDocument();
    expect(await screen.findByText('Belge f1')).toBeInTheDocument();
    // Ağaç yokken klasörün projesi bilinmiyor: KPI ve şerit proje bağlamı istiyor.
    expect(screen.getAllByText('Proje bağlamı seçin').length).toBeGreaterThan(0);

    treeImpl = () => Promise.resolve({ items: FOLDERS });
    fireEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));

    expect(await screen.findByText('Klasör 1')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryAllByText('Proje bağlamı seçin')).toHaveLength(0));
    expect(screen.getByText('Klasör 1').closest('button')).toHaveClass('selected');
    expect(window.location.search).toContain('folder=f1');
  });
});
