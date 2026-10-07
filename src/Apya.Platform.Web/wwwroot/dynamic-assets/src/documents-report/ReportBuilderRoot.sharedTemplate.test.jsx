import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

/**
 * Rapor derleyici — ortak (sistem) şablonunun bölümleri kiracıda SALT-OKUR.
 *
 * Sistem şablonu host'ta durur ve bütün kiracılarca paylaşılır. Bölüm satırları kiracıda da
 * aç/kapa ve sırala düğmeleriyle basılıyordu; kiracının "KOSGEB" şablonunda kapattığı bölüm
 * öbür bütün kiracıların raporundan düşüyordu. Sunucu artık reddediyor; ekran da düğmeleri
 * kapalı basar ve kullanıcıyı "Kopyala"ya yönlendirir.
 */

const TENANT = '11111111-1111-1111-1111-111111111111';

const section = (id, order) => ({ id, templateId: 't', sectionKey: order, order, isEnabled: true, isAvailable: true });

const SYSTEM = {
  id: 'sys', tenantId: null, name: 'KOSGEB', recipient: 1, issuer: 'KOSGEB', isSystem: true,
  enabledSectionCount: 2, sections: [section('s1', 1), section('s2', 2)],
};
const OWN = {
  id: 'own', tenantId: TENANT, name: 'Bizim şablon', recipient: 1, issuer: null, isSystem: false,
  enabledSectionCount: 2, sections: [section('o1', 1), section('o2', 2)],
};

let templates;
let updateCalls;

vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal()),
  abpAppPath: () => '/',
  abpNotify: () => {},
  getTemplates: () => Promise.resolve(templates),
  getProjects: () => Promise.resolve([]),
  updateSections: (dto) => { updateCalls.push(dto); return Promise.resolve(templates.find((t) => t.id === dto.templateId)); },
}));

vi.mock('../deliveries/api', async (importOriginal) => ({ ...(await importOriginal()), abpAuth: () => true }));

// Sekme içerikleri bu testin konusu değil (kendi uçlarını çağırırlar).
vi.mock('./PreviewTab', () => ({ PreviewTab: () => <div>Önizleme içeriği</div> }));
vi.mock('./DistributionTab', () => ({ DistributionTab: () => <div>Dağıtım içeriği</div> }));

const { ReportBuilderRoot } = await import('./ReportBuilderRoot');

function setup(currentTenantId, list) {
  templates = list;
  updateCalls = [];
  window.abp = { appPath: '/', currentTenant: { id: currentTenantId }, auth: { isGranted: () => true }, notify: {} };
  render(<ReportBuilderRoot />);
}

describe('ReportBuilderRoot · ortak şablon', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { delete window.abp; });

  it('kiracıda sistem şablonunun bölüm düğmeleri KAPALI basılır ve Kopyala önerilir', async () => {
    setup(TENANT, [SYSTEM]);

    const toggles = await screen.findAllByRole('checkbox');
    expect(toggles).toHaveLength(2);
    toggles.forEach((t) => expect(t).toBeDisabled());
    screen.getAllByRole('button', { name: /taşı/i }).forEach((b) => expect(b).toBeDisabled());

    expect(screen.getByText(/bölümleri ve künyesi buradan değiştirilemez/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kopyala' })).toBeEnabled();

    fireEvent.click(toggles[0]);
    expect(updateCalls).toHaveLength(0);
  });

  it('kiracı KENDİ şablonunun bölümünü kapatabilir', async () => {
    setup(TENANT, [OWN]);

    const toggles = await screen.findAllByRole('checkbox');
    toggles.forEach((t) => expect(t).toBeEnabled());

    fireEvent.click(toggles[0]);
    await waitFor(() => expect(updateCalls).toHaveLength(1));
    expect(updateCalls[0].templateId).toBe('own');
    expect(updateCalls[0].sections.find((s) => s.sectionId === 'o1').isEnabled).toBe(false);
  });

  it('host ortak şablonu yönetmeye devam eder (düğmeler açık, etki uyarısı var)', async () => {
    setup(null, [SYSTEM]);

    const toggles = await screen.findAllByRole('checkbox');
    toggles.forEach((t) => expect(t).toBeEnabled());
    expect(screen.getByText(/bütün kiracıların raporuna yansır/i)).toBeInTheDocument();
  });
});
