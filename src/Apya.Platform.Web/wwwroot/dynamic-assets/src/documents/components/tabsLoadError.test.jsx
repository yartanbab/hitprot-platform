import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

/**
 * Dokümanlar · Uygunluk ve Etkinlik sekmeleri — yükleme hatası (DOC-13).
 *
 * Kilitlenen davranışlar:
 *  1) Okunamayan veri "paket uygulanmadı" / "henüz etkinlik yok" DEĞİL: hata kartı + Tekrar dene;
 *     yeniden deneme sürerken kart iskelete dönmez (düğme meşgul, odak düğmede).
 *  2) Yükleme hatasında toast yok; istek ABP penceresini kapatır ({ abpHandleError: false }).
 *  3) Sayaç yüklenirken ve hatada "—"; hata anında sayfalama çizilmez.
 *  4) Son istek kazanır: geç dönen eski hata yeni bağlamın verisini ezmez.
 */

const mocks = vi.hoisted(() => ({
  getComplianceOverview: vi.fn(),
  getCompliancePackages: vi.fn(),
  getActivity: vi.fn(),
  notify: vi.fn(),
}));

vi.mock('../api', async (importOriginal) => ({
  ...(await importOriginal()),
  abpAuth: () => false, // yönetim izni yok: paket kataloğu (ayrı uçlar) çizilmez
  abpNotify: (...args) => mocks.notify(...args),
  getComplianceOverview: (...args) => mocks.getComplianceOverview(...args),
  getCompliancePackages: (...args) => mocks.getCompliancePackages(...args),
  getActivity: (...args) => mocks.getActivity(...args),
}));

const { ComplianceTab } = await import('./ComplianceTab');
const { ActivityTab } = await import('./ActivityTab');

const QUIET = { abpHandleError: false };

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

const tick = () => new Promise((r) => setTimeout(r, 0));

const overviewFor = (name) => ({
  summary: { totalCount: 1, satisfiedCount: 1, waivedCount: 0, missingCount: 0, blockingMissingCount: 0, percent: 100 },
  checklists: [{
    assignmentId: `a-${name}`,
    packageName: `Paket ${name}`,
    issuer: 'Kurum',
    periodCode: null,
    summary: { totalCount: 1, satisfiedCount: 1, waivedCount: 0, missingCount: 0, blockingMissingCount: 0, percent: 100 },
    items: [{ requirementId: `r-${name}`, title: `Kalem ${name}`, status: 1, source: 1, scope: 1 }],
  }],
});

const activityRow = (id) => ({
  id, action: 1, documentFileName: `Belge ${id}`, actorName: 'Ayşe', creationTime: '2026-09-01T10:00:00Z',
});

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  mocks.getCompliancePackages.mockImplementation(() => Promise.resolve([]));
});

describe('ComplianceTab · yükleme hatası', () => {
  const onSummaryChange = () => {};

  it('okunamazsa "paket uygulanmadı" değil hata kartı; toast yok; Tekrar dene veriyi getirir', async () => {
    const retry = deferred();
    mocks.getComplianceOverview
      .mockImplementationOnce(() => Promise.reject(new Error('500')))
      .mockImplementation(() => retry.promise);

    render(<ComplianceTab projectId="p1" periodCode={null} onSummaryChange={onSummaryChange} />);

    expect(await screen.findByText('Uygunluk verisi yüklenemedi')).toBeInTheDocument();
    expect(screen.queryByText('Bu projeye henüz kurum paketi uygulanmadı')).not.toBeInTheDocument();
    expect(mocks.notify).not.toHaveBeenCalled();
    expect(mocks.getComplianceOverview).toHaveBeenCalledWith('p1', null, QUIET);
    expect(mocks.getCompliancePackages).toHaveBeenCalledWith('p1', QUIET);

    // Yeniden deneme sürerken kart iskelete dönmez: düğme meşgul, odak onda kalır.
    const button = screen.getByRole('button', { name: 'Tekrar dene' });
    button.focus();
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute('aria-busy', 'true'));
    expect(screen.getByText('Uygunluk verisi yüklenemedi')).toBeInTheDocument();
    expect(document.activeElement).toBe(button);

    retry.resolve(overviewFor('P1'));

    expect(await screen.findByText('Paket P1')).toBeInTheDocument();
    expect(screen.queryByText('Uygunluk verisi yüklenemedi')).not.toBeInTheDocument();
  });

  it('proje hızla değişince eski projenin geç dönen hatası yeni projenin verisini ezmez', async () => {
    const p1 = deferred();
    mocks.getComplianceOverview.mockImplementation((projectId) => (
      projectId === 'p1' ? p1.promise : Promise.resolve(overviewFor('P2'))
    ));

    const { rerender } = render(<ComplianceTab projectId="p1" periodCode={null} onSummaryChange={onSummaryChange} />);
    rerender(<ComplianceTab projectId="p2" periodCode={null} onSummaryChange={onSummaryChange} />);

    expect(await screen.findByText('Paket P2')).toBeInTheDocument();
    p1.reject(new Error('500'));
    await tick();

    expect(screen.getByText('Paket P2')).toBeInTheDocument();
    expect(screen.queryByText('Uygunluk verisi yüklenemedi')).not.toBeInTheDocument();
  });
});

describe('ActivityTab · yükleme hatası', () => {
  it('okunamazsa "henüz etkinlik yok" değil hata kartı; sayaç "—"; sayfalama yok; toast yok', async () => {
    const retry = deferred();
    mocks.getActivity
      .mockImplementationOnce(() => Promise.resolve({ items: [activityRow('e1')], totalCount: 60 }))
      .mockImplementationOnce(() => Promise.reject(new Error('500')))
      .mockImplementation(() => retry.promise);

    render(<ActivityTab projectId="p1" documentFileId={null} />);

    expect(await screen.findByText('Belge e1')).toBeInTheDocument();
    expect(screen.getByText('60 kayıt')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Yüklendi' }));

    expect(await screen.findByText('Etkinlik kaydı yüklenemedi')).toBeInTheDocument();
    expect(screen.getByText('— kayıt')).toBeInTheDocument();
    expect(screen.queryByText('Henüz kayıtlı etkinlik yok')).not.toBeInTheDocument();
    expect(screen.queryByText('Belge e1')).not.toBeInTheDocument();
    expect(screen.queryByText('1 / 3')).not.toBeInTheDocument();
    expect(mocks.notify).not.toHaveBeenCalled();
    expect(mocks.getActivity.mock.calls.at(-1)).toEqual([expect.objectContaining({ action: '1' }), QUIET]);

    // Yeniden deneme sürerken kart yerinde, düğme meşgul, sayaç "—".
    const button = screen.getByRole('button', { name: 'Tekrar dene' });
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute('aria-busy', 'true'));
    expect(screen.getByText('Etkinlik kaydı yüklenemedi')).toBeInTheDocument();
    expect(screen.getByText('— kayıt')).toBeInTheDocument();

    retry.resolve({ items: [activityRow('e2')], totalCount: 1 });

    expect(await screen.findByText('Belge e2')).toBeInTheDocument();
    expect(screen.getByText('1 kayıt')).toBeInTheDocument();
  });

  it('süzgeç çipi değişince geç dönen eski hata yeni sonucu ezmez', async () => {
    const first = deferred();
    mocks.getActivity
      .mockImplementationOnce(() => first.promise)
      .mockImplementation(() => Promise.resolve({ items: [activityRow('e9')], totalCount: 1 }));

    render(<ActivityTab projectId="p1" documentFileId={null} />);
    await waitFor(() => expect(mocks.getActivity).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole('button', { name: 'Silindi' }));

    expect(await screen.findByText('Belge e9')).toBeInTheDocument();
    first.reject(new Error('500'));
    await tick();

    expect(screen.getByText('Belge e9')).toBeInTheDocument();
    expect(screen.queryByText('Etkinlik kaydı yüklenemedi')).not.toBeInTheDocument();
    expect(screen.getByText('1 kayıt')).toBeInTheDocument();
  });
});
