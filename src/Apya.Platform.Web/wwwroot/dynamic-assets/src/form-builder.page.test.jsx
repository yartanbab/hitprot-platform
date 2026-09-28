import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { api } from './lib/api/httpClient';
import { FormBuilder } from './form-builder';

/**
 * Form oluşturucu · veri kaybı (DOC-04, DOC-02, STA-07, DOC-03).
 *
 * - Yüklenemeyen form boş editörle açılmaz; kaydetme ve yayınlama yolu yoktur.
 * - Silinen alanlar kayıtla bildirilir; yanıt almış formda cevaplanabilir soru silinirken onay istenir.
 * - Önce alanlar kaydedilir: sunucu reddederse başlık da yazılmaz.
 * - Kaydedilmemiş değişiklikte sayfadan çıkış uyarılır, Yayınla önce kaydeder.
 * - Yayın penceresi mevcut ayarlar ve bağlantıyla açılır; bağlantı değişimi onay ister.
 */
vi.mock('./lib/api/httpClient', () => ({ api: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

const FORM_ID = '11111111-1111-4111-8111-111111111111';
const A = 'aaaaaaaa-0000-4000-8000-00000000000a';
const B = 'aaaaaaaa-0000-4000-8000-00000000000b';
const H = 'aaaaaaaa-0000-4000-8000-00000000000c';

const block = (id, type, order, content, settings = {}) => ({ id, type, order, content, settings: JSON.stringify(settings) });
const formDto = (over = {}) => ({
  id: FORM_ID, title: 'QA-UX form', slug: 'qa-ux-form', description: null, categoryId: null,
  status: 0, responseCount: 0, publishSettingsJson: null,
  blocks: [block(A, 0, 1, 'Soru A'), block(B, 9, 2, 'Soru B')],
  ...over,
});

/** Sunucu kaydı: gelen alanları kimlikleriyle geri döndürür, yeni alana kimlik verir. */
let newIdSeq = 0;
const echoBlocks = (body, over = {}) => ({
  ...formDto(over),
  blocks: body.blocks.map((b) => ({
    id: b.id || `bbbbbbbb-0000-4000-8000-${String(++newIdSeq).padStart(12, '0')}`,
    type: b.type, order: b.order, content: b.content, settings: b.settings,
  })),
});

const apiError = (message, extra = {}) => Object.assign(new Error(message), { status: 403, ...extra });

let confirmAnswer;
let loadForm;

function stubApi() {
  api.get.mockImplementation((url) => {
    if (url.startsWith('/api/app/form-category')) return Promise.resolve({ items: [] });
    if (url === '/api/app/form/choice-sources') return Promise.resolve([]);
    if (url === `/api/app/form/${FORM_ID}`) return loadForm();
    return Promise.resolve([]);
  });
  api.put.mockImplementation((url, body) => Promise.resolve(url.endsWith('/blocks') ? echoBlocks(body) : formDto()));
}

beforeEach(() => {
  window.history.replaceState({}, '', `/DynamicAssets/Builder?id=${FORM_ID}`);
  confirmAnswer = true;
  loadForm = () => Promise.resolve(formDto());
  window.abp = {
    notify: { success: vi.fn(), info: vi.fn() },
    message: {
      error: vi.fn(), warn: vi.fn(), info: vi.fn(),
      confirm: vi.fn((message, title, cb) => cb(confirmAnswer)),
    },
  };
  stubApi();
});

const settle = () => act(async () => { await new Promise((r) => setTimeout(r, 0)); });

async function renderLoaded() {
  render(<FormBuilder />);
  await screen.findByDisplayValue('QA-UX form');
}

const cardOf = (content) => screen.getByDisplayValue(content).closest('.group');
function removeQuestion(content) {
  fireEvent.click(cardOf(content));
  fireEvent.click(screen.getByTitle('Sil'));
}
const saveButton = () => screen.getByRole('button', { name: 'Kaydet' });
const publishButton = () => screen.getByRole('button', { name: 'Yayınla' });
const modal = () => within(screen.getByText('Formu Yayınla').parentElement.parentElement);
const putCalls = () => api.put.mock.calls.map(([url]) => url);
const blocksBody = () => api.put.mock.calls.find(([url]) => url.endsWith('/blocks'))?.[1];
const beforeUnloadBlocked = () => {
  const ev = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(ev);
  return ev.defaultPrevented;
};

describe('Form oluşturucu · yükleme hatası (DOC-04)', () => {
  it('yuklenemeyen form bos editorle acilmaz, tekrar dene formu yukler', async () => {
    loadForm = () => Promise.reject(apiError('İşlem tamamlanamadı, lütfen tekrar deneyin.', { status: 500 }));
    render(<FormBuilder />);

    expect(await screen.findByText('Form yüklenemedi')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Kaydet' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Yayınla' })).not.toBeInTheDocument();
    expect(screen.queryByText('Başlamak için bir soru ekleyin.')).not.toBeInTheDocument();

    loadForm = () => Promise.resolve(formDto());
    fireEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));
    expect(await screen.findByDisplayValue('Soru A')).toBeInTheDocument();
    expect(saveButton()).toBeInTheDocument();
    expect(api.put).not.toHaveBeenCalled();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('ag hatasinda Ingilizce metin yerine Turkce yonlendirme gorunur', async () => {
    loadForm = () => Promise.reject(new TypeError('Failed to fetch'));
    render(<FormBuilder />);

    expect(await screen.findByText(/Bağlantınızı kontrol edip/)).toBeInTheDocument();
    expect(screen.queryByText(/Failed to fetch/)).not.toBeInTheDocument();
  });
});

describe('Form oluşturucu · silme bildirimi ve kayıt sırası (DOC-04)', () => {
  it('yanit almis formda cevaplanabilir soru silinirken onay istenir; vazgecince istek gitmez', async () => {
    loadForm = () => Promise.resolve(formDto({ responseCount: 2 }));
    await renderLoaded();
    removeQuestion('Soru A');

    confirmAnswer = false;
    fireEvent.click(saveButton());
    await waitFor(() => expect(window.abp.message.confirm).toHaveBeenCalledTimes(1));
    expect(window.abp.message.confirm.mock.calls[0][0]).toMatch(/^1 soru silinecek/);
    await settle();
    expect(api.put).not.toHaveBeenCalled();

    confirmAnswer = true;
    fireEvent.click(saveButton());
    await waitFor(() => expect(window.abp.notify.success).toHaveBeenCalledWith('Form kaydedildi.'));
    expect(blocksBody().removedBlockIds).toEqual([A]);
  });

  it('yalniz duzen blogu silinirse onay istenmez, kimligi yine bildirilir', async () => {
    loadForm = () => Promise.resolve(formDto({
      responseCount: 2,
      blocks: [block(A, 0, 1, 'Soru A'), block(H, 16, 2, 'Bölüm'), block(B, 9, 3, 'Soru B')],
    }));
    await renderLoaded();
    removeQuestion('Bölüm');

    fireEvent.click(saveButton());
    await waitFor(() => expect(window.abp.notify.success).toHaveBeenCalledWith('Form kaydedildi.'));
    expect(window.abp.message.confirm).not.toHaveBeenCalled();
    expect(blocksBody().removedBlockIds).toEqual([H]);
  });

  it('yanitsiz formda onay istenmez, silinen kimlik yine bildirilir', async () => {
    await renderLoaded();
    removeQuestion('Soru A');

    fireEvent.click(saveButton());
    await waitFor(() => expect(window.abp.notify.success).toHaveBeenCalledWith('Form kaydedildi.'));
    expect(window.abp.message.confirm).not.toHaveBeenCalled();
    expect(blocksBody().removedBlockIds).toEqual([A]);
  });

  it('once alanlar kaydedilir; sunucu reddederse form bilgisi hic gonderilmez', async () => {
    await renderLoaded();
    fireEvent.change(screen.getByDisplayValue('QA-UX form'), { target: { value: 'QA-UX form A' } });
    fireEvent.click(saveButton());
    await waitFor(() => expect(window.abp.notify.success).toHaveBeenCalledWith('Form kaydedildi.'));
    expect(putCalls()).toEqual([`/api/app/form/${FORM_ID}/blocks`, `/api/app/form/${FORM_ID}`]);

    api.put.mockClear();
    const stale = 'Form siz düzenlerken başka bir yerde değiştirilmiş: bu kayıt, ekranınızda olmayan 1 alanı silecekti.';
    api.put.mockImplementation(() => Promise.reject(apiError(stale, { code: 'Platform:DynamicAssets:FormBlocksOutOfDate' })));
    fireEvent.change(screen.getByDisplayValue('QA-UX form A'), { target: { value: 'QA-UX form B' } });
    fireEvent.click(saveButton());
    await waitFor(() => expect(window.abp.message.error).toHaveBeenCalledWith(stale));
    expect(putCalls()).toEqual([`/api/app/form/${FORM_ID}/blocks`]);
    // Kaydedilemeyen düzenleme ekranda ve çıkış korumasında kalır.
    expect(screen.getByDisplayValue('QA-UX form B')).toBeInTheDocument();
    expect(beforeUnloadBlocked()).toBe(true);
  });

  it('yanit sayisi kayit yanitindan tazelenir', async () => {
    await renderLoaded();
    api.put.mockImplementation((url, body) => Promise.resolve(url.endsWith('/blocks')
      ? echoBlocks(body, { responseCount: 3 })
      : formDto({ responseCount: 3 })));
    fireEvent.click(saveButton());
    await waitFor(() => expect(window.abp.notify.success).toHaveBeenCalledTimes(1));

    removeQuestion('Soru B');
    confirmAnswer = false;
    fireEvent.click(saveButton());
    await waitFor(() => expect(window.abp.message.confirm).toHaveBeenCalledTimes(1));
    expect(window.abp.message.confirm.mock.calls[0][0]).toMatch(/^1 soru silinecek/);
  });
});

describe('Form oluşturucu · kaydedilmemiş değişiklik (STA-07)', () => {
  it('kirliyken cikis uyarilir; kayittan sonra, yeni alan kimlikleri eslenince de uyari kalkar', async () => {
    await renderLoaded();
    expect(beforeUnloadBlocked()).toBe(false);

    fireEvent.change(screen.getByDisplayValue('QA-UX form'), { target: { value: 'QA-UX form 2' } });
    expect(beforeUnloadBlocked()).toBe(true);

    fireEvent.click(screen.getByText('+ Soru Ekle'));
    fireEvent.click(saveButton());
    await waitFor(() => expect(window.abp.notify.success).toHaveBeenCalledWith('Form kaydedildi.'));
    expect(blocksBody().blocks[2]).toMatchObject({ id: null, clientId: expect.any(String) });
    expect(beforeUnloadBlocked()).toBe(false);
  });

  it('kirliyken Yayinla once kaydeder, sonra pencereyi acar', async () => {
    await renderLoaded();
    fireEvent.change(screen.getByDisplayValue('Soru A'), { target: { value: 'Soru A (yeni)' } });

    fireEvent.click(publishButton());
    expect(await screen.findByText('Formu Yayınla')).toBeInTheDocument();
    expect(putCalls()).toEqual([`/api/app/form/${FORM_ID}/blocks`, `/api/app/form/${FORM_ID}`]);
    expect(blocksBody().blocks[0].content).toBe('Soru A (yeni)');
  });

  it('Yayinla oncesi kayit duserse pencere acilmaz', async () => {
    await renderLoaded();
    api.put.mockImplementation(() => Promise.reject(apiError('Bu işlem için yetkiniz yok.')));
    fireEvent.change(screen.getByDisplayValue('Soru A'), { target: { value: 'Soru A (yeni)' } });

    fireEvent.click(publishButton());
    await waitFor(() => expect(window.abp.message.error).toHaveBeenCalledWith('Bu işlem için yetkiniz yok.'));
    expect(screen.queryByText('Formu Yayınla')).not.toBeInTheDocument();
  });
});

describe('Form oluşturucu · yayın penceresi (STA-07, DOC-03)', () => {
  const SETTINGS = { startDate: '2026-10-01', endDate: '2026-10-31', kvkk: true, captcha: true };
  const toggle = (label) => modal().getByText(label).closest('label').querySelector('button');

  it('mevcut yayin ayarlariyla acilir ve ayni ayarlari geri gonderir', async () => {
    loadForm = () => Promise.resolve(formDto({ publishSettingsJson: JSON.stringify(SETTINGS) }));
    api.post.mockImplementation(() => Promise.resolve(formDto({ status: 1, publishSettingsJson: JSON.stringify(SETTINGS) })));
    await renderLoaded();

    fireEvent.click(publishButton());
    await screen.findByText('Formu Yayınla');
    expect(toggle('KVKK onayı iste')).toHaveAttribute('aria-pressed', 'true');
    expect(toggle('Bot koruması')).toHaveAttribute('aria-pressed', 'true');
    expect(modal().getByDisplayValue('2026-10-01')).toBeInTheDocument();
    expect(modal().getByDisplayValue('2026-10-31')).toBeInTheDocument();
    expect(api.put).not.toHaveBeenCalled();

    fireEvent.click(modal().getByRole('button', { name: 'Yayınla' }));
    await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
    const [url, body] = api.post.mock.calls[0];
    expect(url).toBe(`/api/app/form/${FORM_ID}/publish`);
    expect(body.slug).toBe('qa-ux-form');
    expect(JSON.parse(body.publishSettingsJson)).toEqual(SETTINGS);
  });

  it('yayindaki formda mevcut baglanti gorunur; baglanti degisimi onay ister', async () => {
    loadForm = () => Promise.resolve(formDto({ status: 1 }));
    await renderLoaded();

    fireEvent.click(publishButton());
    await screen.findByText('Formu Yayınla');
    expect(modal().getByLabelText('Yayın bağlantısı').value).toContain('/f/qa-ux-form');
    expect(modal().getByRole('button', { name: 'Kopyala' })).toBeInTheDocument();

    fireEvent.change(modal().getByPlaceholderText('musteri-memnuniyet'), { target: { value: 'yeni-adres' } });
    confirmAnswer = false;
    fireEvent.click(modal().getByRole('button', { name: 'Ayarları güncelle' }));
    await waitFor(() => expect(window.abp.message.confirm).toHaveBeenCalledTimes(1));
    expect(window.abp.message.confirm.mock.calls[0][0]).toMatch(/^Bağlantı adresi değişecek/);
    await settle();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('yayin sonucu olusturucuya geri yazilir; pencere yeniden acilinca yeni baglanti gelir', async () => {
    api.post.mockImplementation(() => Promise.resolve(formDto({ slug: 'yeni-slug', status: 1 })));
    await renderLoaded();

    fireEvent.click(publishButton());
    await screen.findByText('Formu Yayınla');
    fireEvent.change(modal().getByPlaceholderText('musteri-memnuniyet'), { target: { value: 'yeni-slug' } });
    fireEvent.click(modal().getByRole('button', { name: 'Yayınla' }));
    await screen.findByText(/Form yayında!/);
    fireEvent.click(modal().getByText('✕'));

    fireEvent.click(publishButton());
    await screen.findByText('Formu Yayınla');
    expect(modal().getByPlaceholderText('musteri-memnuniyet')).toHaveValue('yeni-slug');
    expect(modal().getByRole('button', { name: 'Ayarları güncelle' })).toBeInTheDocument();
    expect(window.abp.message.confirm).not.toHaveBeenCalled();
  });
});

describe('Form oluşturucu · bozuk koşul (DOC-02)', () => {
  const brokenForm = (over = {}) => formDto({
    blocks: [
      block(A, 2, 1, 'Evet mi?', { options: ['Evet', 'Hayır'] }),
      block(B, 0, 2, 'Detay', { visibleWhen: { blockId: 'w06hu9nb', op: 'eq', value: 'Evet' } }),
    ],
    ...over,
  });

  it('bozuk kosullu form yayina acilmaz, bozuk alan secilir', async () => {
    loadForm = () => Promise.resolve(brokenForm());
    await renderLoaded();

    fireEvent.click(publishButton());
    await waitFor(() => expect(window.abp.message.warn).toHaveBeenCalledTimes(1));
    expect(window.abp.message.warn.mock.calls[0][0]).toMatch(/^"Detay" alanının görünürlük koşulu/);
    expect(screen.queryByText('Formu Yayınla')).not.toBeInTheDocument();
    expect(screen.getByText(/Koşuldaki alan artık yukarıda değil/)).toBeInTheDocument();
    expect(api.put).not.toHaveBeenCalled();
  });

  it('yayindaki formda bozuk kosulla kayit onay ister; vazgecince istek gitmez', async () => {
    loadForm = () => Promise.resolve(brokenForm({ status: 1 }));
    await renderLoaded();

    confirmAnswer = false;
    fireEvent.click(saveButton());
    await waitFor(() => expect(window.abp.message.confirm).toHaveBeenCalledTimes(1));
    expect(window.abp.message.confirm.mock.calls[0][0]).toMatch(/Form yayında/);
    await settle();
    expect(api.put).not.toHaveBeenCalled();
  });
});

describe('Form oluşturucu · yeni form', () => {
  it('olusturmada yeni alanlarin gecici kimligi clientId olarak gider', async () => {
    window.history.replaceState({}, '', '/DynamicAssets/Builder');
    api.post.mockImplementation((url, body) => Promise.resolve(echoBlocks(body)));
    render(<FormBuilder />);

    fireEvent.change(screen.getByPlaceholderText('Form başlığı…'), { target: { value: 'QA-UX yeni' } });
    fireEvent.click(screen.getByText('+ Soru Ekle'));
    fireEvent.click(screen.getByRole('button', { name: 'Oluştur' }));
    await waitFor(() => expect(window.abp.notify.success).toHaveBeenCalledWith('Form oluşturuldu.'));

    const [url, body] = api.post.mock.calls[0];
    expect(url).toBe('/api/app/form');
    expect(body.blocks[0]).toMatchObject({ id: null, clientId: expect.any(String) });
    expect(beforeUnloadBlocked()).toBe(false);
  });
});
