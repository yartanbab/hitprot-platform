import { describe, it, expect, vi } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';

/**
 * Herkese açık form (/f/{slug}) çökünce misafir boş sayfa yerine kart görür (RES-11).
 * Sayfa anonim ve Layout=null: abp, Font Awesome ve apya-telemetry.js YOK — metinler t()'nin
 * Türkçe yedeğine düşmeli, telemetri sessizce atlanmalı, hiçbir şey patlamamalı.
 * Tetikleyici: sunucudan dizi olmayan blocks → alan sıralaması render'da TypeError.
 */
vi.mock('./lib/api/httpClient', () => ({
  api: {
    get: () => Promise.resolve({ title: 'QA-UX bozuk form', blocks: 'x' }),
    post: () => Promise.resolve({}),
  },
}));

describe('Genel form · ada hata sınırı', () => {
  it('abp ve telemetri yokken Türkçe kart; halka ikonu FA\'sız', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    delete window.abp;
    delete window.ApyaTelemetry;
    document.body.innerHTML = '<div id="public-form-root" data-slug="s"></div>';

    await act(async () => { await import('./public-form.jsx'); });

    await waitFor(() => expect(document.querySelector('[data-island-error="public-form"]')).not.toBeNull());
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Bu bölüm gösterilemedi');
    expect(alert).toHaveTextContent('Beklenmeyen bir hata oluştu. Tekrar deneyin; sorun sürerse sayfayı yenileyin.');
    expect(within(alert).getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
    expect(within(alert).getByRole('button', { name: 'Sayfayı yenile' })).toBeInTheDocument();
    expect(alert.querySelector('span[aria-hidden="true"] svg')).not.toBeNull();
  });
});
