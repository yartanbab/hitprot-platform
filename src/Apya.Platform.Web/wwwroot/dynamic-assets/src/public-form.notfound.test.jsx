import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, screen } from '@testing-library/react';

/**
 * Herkese açık form — silinmiş / slug'ı değişmiş form bağlantısı (DOC-15).
 *
 * Anonim ziyaretçiye sunucunun varlık metni ("Id değeri … olan AppDocument türünden bir nesne
 * bulunamadı!") gösterilmemeli; forma özgü, yol gösteren Türkçe metin ve sekme başlığı. Taslak
 * formun (403) yerelleştirilmiş cümlesi aynen kalır. Modül yüklenince #public-form-root'a kendini
 * bağlıyor → kök import'tan ÖNCE kurulur, her test vi.resetModules() ile yeniden yükler.
 */

const NOT_FOUND = 'Bu form bulunamadı ya da yayından kaldırılmış. Bağlantıyı size gönderen kişiye başvurun.';

let getImpl;

vi.mock('./lib/api/httpClient', () => ({
  api: {
    get: (url) => getImpl(url),
    post: () => Promise.resolve({}),
  },
}));

async function mountForm() {
  vi.resetModules();
  document.title = 'qa-ux-slug';
  document.body.innerHTML = '<div id="public-form-root" data-slug="qa-ux-slug"></div>';
  await act(async () => { await import('./public-form.jsx'); });
}

describe('Genel form · bulunamayan form (DOC-15)', () => {
  beforeEach(() => {
    getImpl = () => Promise.resolve({ title: 'QA-UX başvuru', blocks: [] });
  });

  it('404: forma özgü dostane metin, ham varlık metni yok; sekme başlığı "Form bulunamadı"', async () => {
    getImpl = () => Promise.reject(Object.assign(
      new Error('Id değeri qa-ux-slug olan AppDocument türünden bir nesne bulunamadı!'), { status: 404 }));

    await mountForm();

    expect(await screen.findByText(NOT_FOUND)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('AppDocument');
    expect(document.body.textContent).not.toContain('Id değeri');
    expect(document.title).toBe('Form bulunamadı');
  });

  it('403 (taslak form): sunucunun yerelleştirilmiş cümlesi aynen, sekme başlığı değişmez', async () => {
    getImpl = () => Promise.reject(Object.assign(new Error('Bu form şu anda yayında değil.'), { status: 403 }));

    await mountForm();

    expect(await screen.findByText('Bu form şu anda yayında değil.')).toBeInTheDocument();
    expect(screen.queryByText(NOT_FOUND)).not.toBeInTheDocument();
    expect(document.title).toBe('qa-ux-slug');
  });

  it('başarılı yüklemede sekme başlığı slug değil form adı', async () => {
    await mountForm();

    expect(await screen.findByText('QA-UX başvuru')).toBeInTheDocument();
    expect(document.title).toBe('QA-UX başvuru');
  });
});
