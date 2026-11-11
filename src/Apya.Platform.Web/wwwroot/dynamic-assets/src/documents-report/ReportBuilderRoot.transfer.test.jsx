import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

/**
 * Rapor derleyici · şablon .json aktarımı. Seçili şablonun "JSON" bağlantısı ExportTemplate ucunu
 * gösterir; dosya seçilince ImportTemplate'e gider ve açılan yeni şablon seçilir.
 */

const section = (id, order) => ({ id, templateId: 't', sectionKey: order, order, isEnabled: true, isAvailable: true });
const OWN = { id: 'own', tenantId: 'k', name: 'Bizim şablon', recipient: 1, issuer: null, isSystem: false, enabledSectionCount: 1, sections: [section('o1', 1)] };
const NEW = { ...OWN, id: 'new', name: 'Aktarılan şablon', sections: [section('n1', 1)] };

let templates = [OWN];
const importTemplate = vi.fn();

vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal()),
  abpAppPath: () => '/',
  abpNotify: () => {},
  getTemplates: () => Promise.resolve(templates),
  getProjects: () => Promise.resolve([]),
  importTemplate: (file) => importTemplate(file),
}));
vi.mock('../deliveries/api', async (importOriginal) => ({ ...(await importOriginal()), abpAuth: () => true }));
vi.mock('./PreviewTab', () => ({ PreviewTab: () => null }));
vi.mock('./DistributionTab', () => ({ DistributionTab: () => null }));

const { ReportBuilderRoot } = await import('./ReportBuilderRoot');

afterEach(() => { delete window.abp; templates = [OWN]; });

describe('ReportBuilderRoot · şablon aktarımı', () => {
  it('JSON bağlantısı seçili şablonu indirir; içe aktarılan şablon seçilir', async () => {
    window.abp = { appPath: '/', currentTenant: { id: 'k' }, auth: { isGranted: () => true }, notify: {} };
    render(<ReportBuilderRoot />);

    const link = await screen.findByRole('link', { name: 'JSON' });
    expect(link.getAttribute('href')).toBe('/Documents/ReportBuilder?handler=ExportTemplate&id=own');

    importTemplate.mockImplementation(async () => { templates = [OWN, NEW]; return { ok: true, id: 'new', message: 'ok' }; });
    const file = new File(['{}'], 'sablon.json', { type: 'application/json' });
    fireEvent.change(screen.getByTestId('template-import-input'), { target: { files: [file] } });

    await waitFor(() => expect(importTemplate).toHaveBeenCalledWith(file));
    expect(await screen.findByText('Aktarılan şablon', { selector: '.apya-doc-check-head span' })).toBeInTheDocument();
  });
});
