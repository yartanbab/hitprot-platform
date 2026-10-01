import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';

/**
 * Genel form — bağlı alan seçenekleri (STA-09).
 *
 * Üst seçim hızla değişince çocuk alanda yalnız SON üst seçimin seçenekleri
 * görünmeli; eski seçimin geç dönen listesi yeni seçimin altına düşerse seçilen
 * değer sunucuda reddedilirdi. Modül yüklenince #public-form-root'a kendini
 * bağlıyor; bu yüzden kök import'tan ÖNCE kurulur, sonraki test modülü
 * vi.resetModules() ile yeniden yükler.
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
// Üst alan bir koşula bağlı: kapı "Evet" değilse gizlenir, cevabı düşer.
const GATED_DOC = {
  title: 'QA-UX koşullu üst',
  blocks: [
    { id: 'gate', type: DROPDOWN, content: 'Kapı', order: 0, settings: JSON.stringify({ options: ['Evet', 'Hayır'] }) },
    {
      id: 'parent', type: DROPDOWN, content: 'Üst alan', order: 1,
      settings: JSON.stringify({ visibleWhen: { blockId: 'gate', op: 'eq', value: 'Evet' } }),
      choices: [{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }],
    },
    { id: 'child', type: DROPDOWN, content: 'Çocuk alan', order: 2, settings: '{}', dependsOnBlockId: 'parent' },
  ],
};
let currentDoc = DOC;
const choiceCalls = [];
const submits = [];

vi.mock('./lib/api/httpClient', () => ({
  api: {
    get: (url) => {
      if (url.includes('/by-slug')) return Promise.resolve(currentDoc);
      const parentValue = new URL(url, 'http://x').searchParams.get('parentValue');
      return new Promise((resolve) => { choiceCalls.push({ parentValue, resolve }); });
    },
    post: (url, body) => { submits.push(body); return Promise.resolve({}); },
  },
}));

const settle = (fn) => act(async () => { fn(); await new Promise((r) => setTimeout(r, 0)); });
const optionTexts = (select) => Array.from(select.options).map((o) => o.textContent);
const progress = () => document.querySelector('#public-form-root .fixed > div').style.width;

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

  it('üst değişince yükleme boyunca eski seçenek seçilemez; eski cevap kalmaz, ilerleme ve gönderim doğru', async () => {
    choiceCalls.length = 0;
    vi.resetModules();
    document.body.innerHTML = '<div id="public-form-root" data-slug="s"></div>';
    await act(async () => { await import('./public-form.jsx'); });

    expect(await screen.findByText('Çocuk alan')).toBeInTheDocument();
    const [parent, child] = screen.getAllByRole('combobox');

    fireEvent.change(parent, { target: { value: 'B' } });
    await waitFor(() => expect(choiceCalls).toHaveLength(1));
    await settle(() => choiceCalls[0].resolve([{ value: 'b1', label: 'B seçeneği' }]));
    fireEvent.change(child, { target: { value: 'b1' } });
    expect(progress()).toBe('100%');

    // Üst A olur, A listesi uçuştayken B seçenekleri gitmiştir ve alan kapalıdır.
    fireEvent.change(parent, { target: { value: 'A' } });
    await waitFor(() => expect(choiceCalls).toHaveLength(2));
    expect(optionTexts(child)).toEqual(['Yükleniyor…']);
    expect(child).toBeDisabled();
    expect(progress()).toBe('50%');

    // Canlıdaki adım: yüklenirken b1 seçilmeye çalışılır; cevaba yazılmaz.
    fireEvent.change(child, { target: { value: 'b1' } });
    expect(progress()).toBe('50%');

    await settle(() => choiceCalls[1].resolve([{ value: 'a1', label: 'A-1' }, { value: 'a2', label: 'A-2' }]));
    expect(optionTexts(child)).toEqual(['Seçiniz…', 'A-1', 'A-2']);
    expect(child).not.toBeDisabled();
    expect(child.value).toBe('');
    expect(progress()).toBe('50%');

    fireEvent.click(screen.getByText('Gönder'));
    await waitFor(() => expect(submits).toHaveLength(1));
    const sent = JSON.parse(submits[0].answers);
    expect(sent.parent).toEqual({ value: 'A', label: 'A' });
    expect(sent.child?.value).toBeUndefined();
  });

  it('üst alan koşulla gizlenince bağlı alan boşalır, cevabı düşer; uçuştaki yanıt listeyi doldurmaz', async () => {
    choiceCalls.length = 0;
    submits.length = 0;
    currentDoc = GATED_DOC;
    vi.resetModules();
    document.body.innerHTML = '<div id="public-form-root" data-slug="s"></div>';
    await act(async () => { await import('./public-form.jsx'); });

    expect(await screen.findByText('Çocuk alan')).toBeInTheDocument();
    const [gate, child] = screen.getAllByRole('combobox'); // üst alan kapı yanıtlanmadan gizli

    fireEvent.change(gate, { target: { value: 'Evet' } });
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'A' } });
    await waitFor(() => expect(choiceCalls).toHaveLength(1));
    await settle(() => choiceCalls[0].resolve([{ value: 'a1', label: 'A-1' }]));
    fireEvent.change(child, { target: { value: 'a1' } });
    expect(progress()).toBe('100%');

    // Kapı kapanır: üst gizlenip cevabı düşer; çocuğun A listesi ve seçimi de gider.
    fireEvent.change(gate, { target: { value: 'Hayır' } });
    expect(screen.queryByText('Üst alan')).not.toBeInTheDocument();
    expect(optionTexts(child)).toEqual(['Listede kayıt yok']);
    expect(child).toBeDisabled();
    expect(progress()).toBe('50%');

    // Kapı açılır, üst B olur; B listesi uçuştayken kapı yine kapanır ve geç yanıt yok sayılır.
    fireEvent.change(gate, { target: { value: 'Evet' } });
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'B' } });
    await waitFor(() => expect(choiceCalls).toHaveLength(2));
    fireEvent.change(gate, { target: { value: 'Hayır' } });
    await settle(() => choiceCalls[1].resolve([{ value: 'b1', label: 'B-1' }]));
    expect(optionTexts(child)).toEqual(['Listede kayıt yok']);
    expect(child).toBeDisabled();
    expect(progress()).toBe('50%');

    fireEvent.click(screen.getByText('Gönder'));
    await waitFor(() => expect(submits).toHaveLength(1));
    expect(JSON.parse(submits[0].answers)).toEqual({ gate: 'Hayır' });
  });
});
