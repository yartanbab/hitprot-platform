import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';

/**
 * Genel form — bağlı alan seçenekleri (STA-09).
 *
 * Üst seçim hızla değişince çocuk alanda yalnız SON üst seçimin seçenekleri
 * görünmeli; eski seçimin geç dönen listesi yeni seçimin altına düşerse seçilen
 * değer sunucuda reddedilirdi. Modül yüklenince #public-form-root'a kendini
 * bağlıyor; bu yüzden kök import'tan ÖNCE kurulur ve dosyada tek test vardır.
 */

const DROPDOWN = 18;
const DOC = {
  title: 'QA-UX bağlı alan',
  blocks: [
    {
      id: 'parent', type: DROPDOWN, content: 'Üst alan', order: 0, settings: '{}',
      choices: [{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }],
    },
    { id: 'child', type: DROPDOWN, content: 'Çocuk alan', order: 1, settings: '{}', dependsOnBlockId: 'parent' },
  ],
};
const choiceCalls = [];

vi.mock('./lib/api/httpClient', () => ({
  api: {
    get: (url) => {
      if (url.includes('/by-slug')) return Promise.resolve(DOC);
      const parentValue = new URL(url, 'http://x').searchParams.get('parentValue');
      return new Promise((resolve) => { choiceCalls.push({ parentValue, resolve }); });
    },
  },
}));

const settle = (fn) => act(async () => { fn(); await new Promise((r) => setTimeout(r, 0)); });
const optionTexts = (select) => Array.from(select.options).map((o) => o.textContent);

describe('Genel form · bağlı alan', () => {
  it('yalnız son üst seçimin seçenekleri görünür; üst temizlenince geç yanıt listeyi doldurmaz', async () => {
    document.body.innerHTML = '<div id="public-form-root" data-slug="s"></div>';
    await act(async () => { await import('./public-form.jsx'); });

    expect(await screen.findByText('Çocuk alan')).toBeInTheDocument();
    const [parent, child] = screen.getAllByRole('combobox');

    fireEvent.change(parent, { target: { value: 'A' } });
    fireEvent.change(parent, { target: { value: 'B' } });
    await waitFor(() => expect(choiceCalls.map((c) => c.parentValue)).toEqual(['A', 'B']));

    await settle(() => choiceCalls[1].resolve([{ value: 'b1', label: 'B seçeneği' }]));
    await settle(() => choiceCalls[0].resolve([{ value: 'a1', label: 'A seçeneği' }]));

    expect(optionTexts(child)).toContain('B seçeneği');
    expect(optionTexts(child)).not.toContain('A seçeneği');

    // Üst yeniden A olur, istek uçuştayken üst temizlenir; geç dönen A yanıtı yok sayılır.
    fireEvent.change(parent, { target: { value: 'A' } });
    await waitFor(() => expect(choiceCalls).toHaveLength(3));
    fireEvent.change(parent, { target: { value: '' } });
    await settle(() => choiceCalls[2].resolve([{ value: 'a1', label: 'A seçeneği' }]));

    expect(optionTexts(child)).not.toContain('A seçeneği');
    expect(optionTexts(child)).not.toContain('Yükleniyor…');
    expect(child.options).toHaveLength(1);
  });
});
