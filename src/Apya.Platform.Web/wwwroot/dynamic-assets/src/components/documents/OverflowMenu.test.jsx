import React from 'react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverflowMenu } from './OverflowMenu';
import { DocsPageHeader } from './DocsPageHeader';

/**
 * ⋯ menüsü ve başlık satırı — buton kuralının yapısal karşılığı.
 *
 * Kilitlenen davranışlar: ikincil eylemler menüde durur ve menü seçimden
 * sonra kapanır; kapalı öğe nedenini metinle söyler; izin koşuluyla elenen
 * öğeler (false) sessizce düşer ve öğe kalmazsa ⋯ düğmesi hiç basılmaz.
 */

beforeAll(() => {
  // Radix Popper boyutu ResizeObserver ile izliyor; jsdom'da yok.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('OverflowMenu', () => {
  it('öğeyi çalıştırır ve menüyü kapatır', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <OverflowMenu
        items={[
          { key: 'folder', label: 'Yeni klasör', onSelect },
          { key: 'bulk', label: 'Toplu yükleme', href: '/Documents/Upload' },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Diğer eylemler' }));
    expect(screen.getByRole('link', { name: 'Toplu yükleme' })).toHaveAttribute('href', '/Documents/Upload');

    await user.click(screen.getByRole('button', { name: 'Yeni klasör' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Yeni klasör' })).not.toBeInTheDocument();
  });

  it('kapalı öğe nedenini yazar ve çalışmaz', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <OverflowMenu
        items={[{ key: 'capture', label: 'Belge yakala', disabled: true, hint: 'Önce bir klasör seçin', onSelect }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Diğer eylemler' }));

    const item = screen.getByRole('button', { name: /Belge yakala/ });
    expect(item).toBeDisabled();
    expect(item).toHaveTextContent('Önce bir klasör seçin');
  });

  it('öğe kalmazsa ⋯ düğmesi basılmaz', () => {
    render(<OverflowMenu items={[false, null]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('DocsPageHeader', () => {
  it('tek birincil düğme ve ⋯ menüsüyle basılır', () => {
    render(
      <DocsPageHeader
        title="Dokümanlar"
        description="Klasörler, belgeler ve meta veri"
        primary={<button type="button">Yükle</button>}
        menuItems={[{ key: 'folder', label: 'Yeni klasör', onSelect: () => {} }]}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Dokümanlar' })).toBeInTheDocument();
    expect(screen.getAllByRole('button').map((b) => b.textContent || b.getAttribute('aria-label')))
      .toEqual(['Yükle', 'Diğer eylemler']);
  });
});
