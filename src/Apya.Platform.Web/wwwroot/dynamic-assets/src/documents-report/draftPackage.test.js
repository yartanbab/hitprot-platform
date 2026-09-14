import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * "Taslak kaydet" = taslak teslim paketi.
 *
 * Kilitlenen davranış: aynı proje + şablon için ikinci basış yeni paket
 * AÇMAZ; üretilmiş paket ya da başka şablonun taslağı "taslak var" sayılmaz.
 */

const getPackages = vi.fn();
const createPackage = vi.fn();

vi.mock('../deliveries/api', () => ({
  getPackages: (...args) => getPackages(...args),
  createPackage: (...args) => createPackage(...args),
}));

const { draftName, ensureDraftPackage, findDraft } = await import('./draftPackage');

const TEMPLATE = { id: 't-kosgeb', name: 'KOSGEB ara rapor' };

beforeEach(() => {
  getPackages.mockReset();
  createPackage.mockReset();
});

describe('findDraft', () => {
  it('yalnız aynı şablonun TASLAK paketini bulur', () => {
    const packages = [
      { id: 'p1', status: 2, reportTemplateId: 't-kosgeb' },
      { id: 'p2', status: 1, reportTemplateId: 't-tubitak' },
      { id: 'p3', status: 1, reportTemplateId: 'T-KOSGEB' },
    ];

    expect(findDraft(packages, 't-kosgeb').id).toBe('p3');
    expect(findDraft(packages, 't-yok')).toBeNull();
    expect(findDraft(null, 't-kosgeb')).toBeNull();
  });
});

describe('ensureDraftPackage', () => {
  it('taslak varsa yenisini açmaz', async () => {
    getPackages.mockResolvedValue([{ id: 'p9', status: 1, reportTemplateId: 't-kosgeb', name: 'Eski taslak' }]);

    const result = await ensureDraftPackage({ projectId: 'proj', template: TEMPLATE });

    expect(result).toEqual({ pkg: expect.objectContaining({ id: 'p9' }), created: false });
    expect(createPackage).not.toHaveBeenCalled();
  });

  it('taslak yoksa şablona bağlı, üç biçimli paket açar', async () => {
    getPackages.mockResolvedValue([{ id: 'p1', status: 2, reportTemplateId: 't-kosgeb' }]);
    createPackage.mockResolvedValue({ id: 'new' });

    const result = await ensureDraftPackage({ projectId: 'proj', template: TEMPLATE });

    expect(result).toEqual({ pkg: { id: 'new' }, created: true });
    expect(getPackages).toHaveBeenCalledWith('proj');
    expect(createPackage).toHaveBeenCalledWith({
      projectId: 'proj',
      name: expect.stringMatching(/^KOSGEB ara rapor · \d{2}\.\d{2}\.\d{4}$/),
      reportTemplateId: 't-kosgeb',
      formats: 7,
    });
  });
});

describe('draftName', () => {
  it('paket adı sınırını (160) aşmaz', () => {
    const name = draftName('x'.repeat(300), new Date(2026, 8, 14));
    expect(name).toHaveLength(160);
    expect(name.endsWith(' · 14.09.2026')).toBe(true);
  });
});
