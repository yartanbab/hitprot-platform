import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { TemplatePicker } from './TemplatePicker';

/**
 * Rapor derleyicinin şablon listesi: kuruma göre gruplu ve aranabilir.
 * Kırktan fazla şablonun düz listesi taranamıyordu.
 */

const tpl = (id, name, { issuer = null, isSystem = true, recipient = 1 } = {}) =>
  ({ id, name, issuer, isSystem, recipient, enabledSectionCount: 3, sections: [] });

const TEMPLATES = [
  tpl('k1', 'KOSGEB ara rapor (3 ayda bir)', { issuer: 'KOSGEB' }),
  tpl('t1', 'TÜBİTAK TEYDEB dönem raporu (6 ayda bir)', { issuer: 'TÜBİTAK' }),
  tpl('b1', 'Banka / finans dosyası', { recipient: 2 }),
  tpl('t2', 'TÜBİTAK TEYDEB proje sonuç raporu', { issuer: 'TÜBİTAK' }),
  tpl('k2', 'KOSGEB proje sonuç raporu', { issuer: 'KOSGEB' }),
  tpl('o1', 'Bizim KOSGEB kopyası', { issuer: 'KOSGEB', isSystem: false }),
];

function setup(selectedId = 'k1') {
  const onSelect = vi.fn();
  render(<TemplatePicker templates={TEMPLATES} selectedId={selectedId} onSelect={onSelect} />);
  return { onSelect };
}

/** Grup başlığı: aria-expanded taşıyan düğme (şablon düğmeleri de aynı adla başlayabilir). */
const groupHead = (name) => {
  const heads = screen.getAllByRole('button')
    .filter((b) => b.hasAttribute('aria-expanded') && b.textContent.startsWith(name));
  expect(heads).toHaveLength(1);
  return heads[0];
};

describe('TemplatePicker', () => {
  it('kendi şablonları başta; açılışta yalnız kendi grubu ve seçili şablonun grubu açık', () => {
    setup('k1');

    const heads = screen.getAllByRole('button', { expanded: true })
      .concat(screen.getAllByRole('button', { expanded: false }));
    expect(heads.map((b) => b.textContent)).toEqual(
      expect.arrayContaining(['Kendi şablonlarım1', 'KOSGEB2', 'TÜBİTAK2', 'Genel şablonlar1']),
    );

    expect(groupHead('Kendi şablonlarım')).toHaveAttribute('aria-expanded', 'true');
    expect(groupHead('KOSGEB')).toHaveAttribute('aria-expanded', 'true');
    expect(groupHead('TÜBİTAK')).toHaveAttribute('aria-expanded', 'false');

    expect(screen.getByText('KOSGEB proje sonuç raporu')).toBeInTheDocument();
    expect(screen.queryByText('TÜBİTAK TEYDEB proje sonuç raporu')).not.toBeInTheDocument();
  });

  it('grup başlığı grubu açıp kapatır; şablona tıklamak seçer', () => {
    const { onSelect } = setup('k1');

    fireEvent.click(groupHead('TÜBİTAK'));
    expect(groupHead('TÜBİTAK')).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByText('TÜBİTAK TEYDEB proje sonuç raporu'));
    expect(onSelect).toHaveBeenCalledWith('t2');

    fireEvent.click(groupHead('KOSGEB'));
    expect(screen.queryByText('KOSGEB proje sonuç raporu')).not.toBeInTheDocument();
  });

  it('arama aksansız yazımla süzer ve eşleşen grupları açık gösterir; Esc temizler', () => {
    setup('k1');
    const search = screen.getByRole('searchbox', { name: 'Şablon ara' });

    fireEvent.change(search, { target: { value: 'tubitak sonuc' } });

    const group = screen.getByRole('group', { name: 'TÜBİTAK' });
    expect(within(group).getByText('TÜBİTAK TEYDEB proje sonuç raporu')).toBeInTheDocument();
    expect(within(group).queryByText('TÜBİTAK TEYDEB dönem raporu (6 ayda bir)')).not.toBeInTheDocument();
    expect(screen.queryByText('KOSGEB ara rapor (3 ayda bir)')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { expanded: false })).not.toBeInTheDocument();

    fireEvent.keyDown(search, { key: 'Escape' });
    expect(search).toHaveValue('');
    expect(screen.getByText('KOSGEB ara rapor (3 ayda bir)')).toBeInTheDocument();
  });

  it('eşleşme yoksa bunu söyler', () => {
    setup('k1');
    fireEvent.change(screen.getByRole('searchbox', { name: 'Şablon ara' }), { target: { value: 'olmayan kurum' } });

    expect(screen.getByText('Aramaya uyan şablon yok.')).toBeInTheDocument();
  });
});
