import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

/**
 * Süreç şeridi.
 *
 * Kilitlenen davranışlar: adımlar proje bağlamını taşıyan GERÇEK bağlantıdır,
 * etkin adım `aria-current="step"` taşır, ipucu uygunluk özetinden gelir ve
 * veriyi ekran zaten verdiyse şerit ikinci kez ağa gitmez.
 */

const getComplianceOverview = vi.fn();

vi.mock('../../documents/api', () => ({
  abpAppPath: () => '/',
  getComplianceOverview: (...args) => getComplianceOverview(...args),
}));

const { ProcessRibbon } = await import('./ProcessRibbon');

const OVERVIEW = {
  summary: { totalCount: 10, satisfiedCount: 7, waivedCount: 0, missingCount: 3, blockingMissingCount: 1, percent: 70 },
  checklists: [{
    assignmentId: 'a1',
    items: [
      { title: 'Bordro', status: 2, isBlocking: false },
      { title: 'SGK Borcu Yoktur Yazısı', status: 2, isBlocking: true },
    ],
  }],
};

beforeEach(() => {
  getComplianceOverview.mockReset();
  getComplianceOverview.mockResolvedValue(OVERVIEW);
});

describe('ProcessRibbon', () => {
  it('dört adımı proje bağlamıyla bağlar ve etkin adımı işaretler', async () => {
    render(<ProcessRibbon active="report" projectId="p1" />);

    const links = screen.getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/Documents?projectId=p1',
      '/Documents?tab=compliance&projectId=p1',
      '/Documents/ReportBuilder?projectId=p1',
      '/Documents/Deliveries?projectId=p1',
    ]);

    const current = links.filter((a) => a.getAttribute('aria-current') === 'step');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName(/^3\. Derle/);

    expect(await screen.findByText('Önizle ve teslime geç')).toBeInTheDocument();
  });

  it('uygunluk özetini alt etikete ve ipucuna yansıtır', async () => {
    render(<ProcessRibbon active="docs" projectId="p1" />);

    expect(await screen.findByText('Yükle: SGK Borcu Yoktur Yazısı → uygunluk %80')).toBeInTheDocument();
    expect(screen.getByText('%70 · 3 eksik')).toBeInTheDocument();
    expect(getComplianceOverview).toHaveBeenCalledWith('p1', null);
  });

  it('proje yoksa ağa gitmez, bağlam ister', () => {
    render(<ProcessRibbon active="docs" projectId={null} />);

    expect(getComplianceOverview).not.toHaveBeenCalled();
    expect(screen.getByText('Proje bağlamı seçin')).toBeInTheDocument();
    expect(screen.getAllByRole('link')[3]).toHaveAttribute('href', '/Documents/Deliveries');
  });

  it('veriyi ekran verdiyse ikinci istek atmaz', () => {
    render(
      <ProcessRibbon
        active="deliver"
        projectId="p1"
        compliance={{ overview: OVERVIEW, loading: false, failed: false }}
      />,
    );

    expect(getComplianceOverview).not.toHaveBeenCalled();
    expect(screen.getByText('1 bloke kalemi çöz, paketi üret')).toBeInTheDocument();
  });

  it('onSelect gezinmeyi durdurabilir; değiştirici tuşlu tık yeni sekmeye bırakılır', () => {
    const onSelect = vi.fn((key, event) => event.preventDefault());
    render(<ProcessRibbon active="docs" projectId={null} onSelect={onSelect} />);

    const compliance = screen.getAllByRole('link')[1];

    fireEvent.click(compliance);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toBe('compliance');

    // jsdom gezinmeyi desteklemiyor; değiştirici tuşlu tıkın varsayılanını test durdurur.
    const blockNavigation = (event) => event.preventDefault();
    window.addEventListener('click', blockNavigation);
    try {
      fireEvent.click(compliance, { ctrlKey: true });
    } finally {
      window.removeEventListener('click', blockNavigation);
    }
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
