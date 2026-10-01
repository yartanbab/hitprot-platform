import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DetailPanel } from './DetailPanel';

/**
 * Belge detay paneli — kaydedilmemiş taslak izi (DOC-09).
 *
 * Panel taslağı ve "kirli" durumunu onDraftChange ile üst bileşene bildirir; üst bileşen
 * belge / sekme değişiminde ve sayfadan ayrılırken sorar. Kirli = DÜZENLENEBİLİR alanların
 * sunucu kaydından farkı (biçim farkı — ISO tarih ↔ YYYY-AA-GG, boş metin ↔ null — sayılmaz).
 */

const DETAIL = {
  id: 'd1', displayName: 'Fatura 0042', fileName: 'fatura.pdf', contentType: 'application/pdf',
  fileSize: 2048, versionCount: 1, status: 1, expiryDate: null, isLocked: false,
  folderName: 'Faturalar', uploaderName: 'Ayşe', creationTime: '2026-01-05T10:00:00Z',
  documentTypeId: 't1', amount: 1250.5, currency: 'TRY',
  documentDate: '2026-05-01T00:00:00', periodCode: '2026-Q2',
  fields: [
    { fieldId: 'x1', label: 'Fatura no', fieldType: 1, isRequired: false, fillSource: 1, valueText: 'A-42', valueNumber: null, valueDate: null },
    { fieldId: 'x2', label: 'Vade', fieldType: 2, isRequired: false, fillSource: 1, valueText: null, valueNumber: null, valueDate: '2026-06-15T00:00:00' },
  ],
  tags: [], related: [], versions: [],
};

const TYPES = [{ id: 't1', name: 'Fatura' }, { id: 't2', name: 'Sözleşme' }];

let onDraftChange;

function renderPanel(props = {}) {
  return render(
    <DetailPanel
      detail={DETAIL} loading={false} canEdit saving={false} documentTypes={TYPES}
      onSave={vi.fn()} onDelete={vi.fn()} onDraftChange={onDraftChange} {...props}
    />,
  );
}

const last = () => onDraftChange.mock.calls.at(-1)[0];
const everDirty = () => onDraftChange.mock.calls.some(([arg]) => arg.dirty);

beforeEach(() => {
  window.abp = { appPath: '/' };
  onDraftChange = vi.fn();
});

describe('DetailPanel — taslak izi (DOC-09)', () => {
  it('açılışta temiz bildirir; Dönem değişince kirli + taslak, eski değere dönünce temiz', () => {
    renderPanel();
    expect(last()).toMatchObject({ dirty: false });
    expect(last().draft.id).toBe('d1');

    fireEvent.change(screen.getByLabelText('Dönem'), { target: { value: '2026-Q3' } });
    expect(last().dirty).toBe(true);
    expect(last().draft.periodCode).toBe('2026-Q3');

    fireEvent.change(screen.getByLabelText('Dönem'), { target: { value: '2026-Q2' } });
    expect(last().dirty).toBe(false);
  });

  it('belge tipi, tutar ve özel alan değişikliği de kirli sayılır', () => {
    renderPanel();

    fireEvent.change(screen.getByLabelText('Belge tipi'), { target: { value: 't2' } });
    expect(last().dirty).toBe(true);
    fireEvent.change(screen.getByLabelText('Belge tipi'), { target: { value: 't1' } });
    expect(last().dirty).toBe(false);

    fireEvent.change(screen.getByLabelText('Tutar'), { target: { value: '99' } });
    expect(last().dirty).toBe(true);
    fireEvent.change(screen.getByLabelText('Tutar'), { target: { value: '1250.5' } });
    expect(last().dirty).toBe(false);

    fireEvent.change(screen.getByLabelText(/Fatura no/), { target: { value: 'B-7' } });
    expect(last().dirty).toBe(true);
    expect(last().draft.fields[0].valueText).toBe('B-7');
  });

  it('tarih alanında aynı gün (ISO ↔ YYYY-AA-GG) kirli sayılmaz; başka gün sayılır', () => {
    renderPanel();

    fireEvent.change(screen.getByLabelText('Belge tarihi'), { target: { value: '2026-05-02' } });
    expect(last().dirty).toBe(true);
    fireEvent.change(screen.getByLabelText('Belge tarihi'), { target: { value: '2026-05-01' } });
    expect(last().draft.documentDate).toBe('2026-05-01');       // sunucuda '2026-05-01T00:00:00'
    expect(last().dirty).toBe(false);

    fireEvent.change(screen.getByLabelText(/Vade/), { target: { value: '2026-06-16' } });
    expect(last().dirty).toBe(true);
    fireEvent.change(screen.getByLabelText(/Vade/), { target: { value: '2026-06-15' } });
    expect(last().dirty).toBe(false);
  });

  it('boş metin ile null aynıdır: dönemi olmayan belgede yazıp silmek temize döner', () => {
    renderPanel({ detail: { ...DETAIL, periodCode: null } });

    fireEvent.change(screen.getByLabelText('Dönem'), { target: { value: 'x' } });
    expect(last().dirty).toBe(true);
    fireEvent.change(screen.getByLabelText('Dönem'), { target: { value: '' } });
    expect(last().dirty).toBe(false);
  });

  it('aynı id ile yeni kayıt nesnesi gelince (kayıt sonrası) taslak sunucu değerine sıfırlanır, temiz olur', () => {
    const view = renderPanel();
    fireEvent.change(screen.getByLabelText('Dönem'), { target: { value: '2026-Q3' } });
    expect(last().dirty).toBe(true);

    const saved = { ...DETAIL, periodCode: '2026-Q3', documentTypeId: 't2' };
    view.rerender(
      <DetailPanel
        detail={saved} loading={false} canEdit saving={false} documentTypes={TYPES}
        onSave={vi.fn()} onDelete={vi.fn()} onDraftChange={onDraftChange}
      />,
    );

    expect(last().dirty).toBe(false);
    expect(last().draft.documentTypeId).toBe('t2');
    expect(screen.getByLabelText('Dönem')).toHaveValue('2026-Q3');
    expect(screen.getByLabelText('Belge tipi')).toHaveValue('t2');
  });

  it('aynı kayıt nesnesiyle yeniden çizim taslağı SİLMEZ', () => {
    const view = renderPanel();
    fireEvent.change(screen.getByLabelText('Dönem'), { target: { value: '2026-Q3' } });

    view.rerender(
      <DetailPanel
        detail={DETAIL} loading={false} canEdit saving documentTypes={TYPES}
        onSave={vi.fn()} onDelete={vi.fn()} onDraftChange={onDraftChange}
      />,
    );

    expect(screen.getByLabelText('Dönem')).toHaveValue('2026-Q3');
    expect(last().dirty).toBe(true);
  });

  it('başka belgeye geçince temiz bildirir (eski taslak yeni belgeye taşınmaz)', () => {
    const view = renderPanel();
    fireEvent.change(screen.getByLabelText('Dönem'), { target: { value: '2026-Q3' } });

    view.rerender(
      <DetailPanel
        detail={{ ...DETAIL, id: 'd2', periodCode: '2025-Q4' }} loading={false} canEdit saving={false}
        documentTypes={TYPES} onSave={vi.fn()} onDelete={vi.fn()} onDraftChange={onDraftChange}
      />,
    );

    expect(last().dirty).toBe(false);
    expect(last().draft.id).toBe('d2');
    expect(screen.getByLabelText('Dönem')).toHaveValue('2025-Q4');
  });

  it('panel sökülünce temiz ve taslaksız bildirir', () => {
    const view = renderPanel();
    fireEvent.change(screen.getByLabelText('Dönem'), { target: { value: '2026-Q3' } });
    expect(last().dirty).toBe(true);

    view.unmount();

    expect(last()).toEqual({ draft: null, dirty: false });
  });

  it.each([
    ['canEdit=false', { canEdit: false }],
    ['kilitli belge', { detail: { ...DETAIL, isLocked: true } }],
  ])('%s: alanlar kilitli, hiç kirli bildirilmez', (_name, props) => {
    renderPanel(props);
    ['Belge tipi', 'Tutar', 'Belge tarihi', 'Dönem'].forEach((label) => expect(screen.getByLabelText(label)).toBeDisabled());
    expect(screen.getByLabelText(/Fatura no/)).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Kaydet' })).toBeNull();
    expect(everDirty()).toBe(false);
  });

  it('onDraftChange verilmezse panel aynen çalışır', () => {
    render(
      <DetailPanel
        detail={DETAIL} loading={false} canEdit saving={false} documentTypes={TYPES}
        onSave={vi.fn()} onDelete={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText('Dönem'), { target: { value: '2026-Q3' } });
    expect(screen.getByLabelText('Dönem')).toHaveValue('2026-Q3');
  });
});
