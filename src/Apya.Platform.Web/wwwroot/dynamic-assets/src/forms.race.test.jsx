import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';

/**
 * Formlarım — kategori çipi yarışı (STA-09).
 *
 * Çip hızla değişince önceki kategorinin geç dönen formları yeni çipin altında
 * kalmamalı. Modül yüklenince #forms-list-root'a kendini bağlıyor; bu yüzden kök
 * import'tan ÖNCE kurulur ve dosyada tek test vardır.
 */

const CATEGORIES = [{ id: 'c1', name: 'Kategori 1' }, { id: 'c2', name: 'Kategori 2' }];
const formCalls = [];

vi.mock('./lib/api/httpClient', () => ({
  api: {
    get: (url) => {
      if (url.startsWith('/api/app/form-category')) return Promise.resolve({ items: CATEGORIES });
      const category = new URL(url, 'http://x').searchParams.get('CategoryId');
      return new Promise((resolve) => { formCalls.push({ category, resolve }); });
    },
  },
}));

const form = (id, title, categoryId) => ({
  id, title, categoryId, status: 0, responseCount: 0, viewCount: 0, creationTime: '2026-09-01T10:00:00Z',
});
const settle = (fn) => act(async () => { fn(); await new Promise((r) => setTimeout(r, 0)); });

describe('Formlarım · kategori çipi', () => {
  it('geç dönen eski kategorinin formları yeni çipin altında kalmaz', async () => {
    document.body.innerHTML = '<div id="forms-list-root"></div>';
    await act(async () => { await import('./forms.jsx'); });

    await waitFor(() => expect(formCalls).toHaveLength(1));
    await settle(() => formCalls[0].resolve({ items: [] }));

    fireEvent.click(await screen.findByText('Kategori 1'));
    fireEvent.click(screen.getByText('Kategori 2'));
    await waitFor(() => expect(formCalls).toHaveLength(3));
    expect(formCalls[1].category).toBe('c1');
    expect(formCalls[2].category).toBe('c2');

    await settle(() => formCalls[2].resolve({ items: [form('fc2', 'Form C2', 'c2')] }));
    await settle(() => formCalls[1].resolve({ items: [form('fc1', 'Form C1', 'c1')] }));

    expect(screen.getByText('Form C2')).toBeInTheDocument();
    expect(screen.queryByText('Form C1')).not.toBeInTheDocument();
    expect(screen.queryByText('Formlar yükleniyor…')).not.toBeInTheDocument();
  });
});
