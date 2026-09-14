import { describe, it, expect } from 'vitest';
import {
  complianceSub, compliancePercent, firstMissingItem, nextHint, projectedPercent, sameSummary, stepHref,
} from './flow';

/**
 * Süreç şeridinin saf mantığı.
 *
 * Yüzde hesabı sunucudaki ComplianceCalculator.Percent ile AYNI olmak zorunda:
 * şerit "yükle → uygunluk %80" derse, yükleme sonrası KPI da 80 göstermeli.
 */

const SUMMARY = {
  totalCount: 64, satisfiedCount: 50, waivedCount: 0, missingCount: 14, blockingMissingCount: 2, percent: 78,
};

const item = (title, { isBlocking = false, status = 2 } = {}) => ({ title, isBlocking, status });

const overview = (items, summary = SUMMARY) => ({
  summary,
  checklists: [{ assignmentId: 'a1', items }],
});

const ready = (value) => ({ hasProject: true, loading: false, overview: value });

describe('stepHref', () => {
  it('proje bağlamını her adıma taşır', () => {
    expect(stepHref('docs', null)).toBe('/Documents');
    expect(stepHref('compliance', 'p1')).toBe('/Documents?tab=compliance&projectId=p1');
    expect(stepHref('report', 'p1', '/app/')).toBe('/app/Documents/ReportBuilder?projectId=p1');
    expect(stepHref('deliver', 'p1')).toBe('/Documents/Deliveries?projectId=p1');
  });

  it('bilinmeyen adım için null döner', () => {
    expect(stepHref('nope', 'p1')).toBeNull();
  });
});

describe('compliancePercent — sunucu hesabının aynası', () => {
  it('yarımı yukarı yuvarlar (AwayFromZero)', () => {
    expect(compliancePercent(1, 8, 0)).toBe(13); // 12,5
    expect(compliancePercent(50, 64, 0)).toBe(78); // 78,125
  });

  it('feragat edilen kalemleri paydadan düşer', () => {
    expect(compliancePercent(3, 6, 2)).toBe(75);
  });

  it('payda sıfırsa %100', () => {
    expect(compliancePercent(0, 2, 2)).toBe(100);
  });
});

describe('projectedPercent', () => {
  it('bir kalem daha karşılanınca ulaşılacak yüzdeyi verir', () => {
    expect(projectedPercent(SUMMARY)).toBe(80); // 51 / 64 = 79,69
  });

  it('paydayı aşmaz', () => {
    expect(projectedPercent({ ...SUMMARY, satisfiedCount: 64, missingCount: 0 })).toBe(100);
  });
});

describe('firstMissingItem', () => {
  it('teslimi bloke eden eksik önce gelir', () => {
    const value = overview([item('Bordro'), item('SGK Borcu Yoktur Yazısı', { isBlocking: true })]);
    expect(firstMissingItem(value).title).toBe('SGK Borcu Yoktur Yazısı');
  });

  it('karşılanmış ve feragat edilmiş kalemleri atlar', () => {
    const value = overview([item('Tamam', { status: 1 }), item('Feragat', { status: 3 })]);
    expect(firstMissingItem(value)).toBeNull();
  });
});

describe('complianceSub', () => {
  it('bağlam, yükleme ve paket durumunu ayırır', () => {
    expect(complianceSub({ hasProject: false })).toBe('Proje seçin');
    expect(complianceSub({ hasProject: true, loading: true, overview: null })).toBe('Kontrol listesi');
    expect(complianceSub(ready({ summary: SUMMARY, checklists: [] }))).toBe('Paket uygulanmadı');
    expect(complianceSub(ready(overview([])))).toBe('%78 · 14 eksik');
    expect(complianceSub(ready(overview([], { ...SUMMARY, missingCount: 0, percent: 100 })))).toBe('%100 · tamam');
  });
});

describe('nextHint', () => {
  it('proje yokken bağlam ister, yüklenirken bekler', () => {
    expect(nextHint('docs', { hasProject: false })).toEqual({ text: 'Proje bağlamı seçin', tone: 'neutral' });
    expect(nextHint('docs', { hasProject: true, loading: true, overview: null }).pending).toBe(true);
  });

  it('veri okunamadıysa uydurma ipucu basmaz', () => {
    expect(nextHint('docs', ready(null))).toBeNull();
  });

  it('Belgeler: en kritik eksiği ve yükleme sonrası yüzdeyi söyler', () => {
    const value = overview([item('Bordro'), item('SGK Borcu Yoktur Yazısı', { isBlocking: true })]);
    expect(nextHint('docs', ready(value))).toEqual({
      text: 'Yükle: SGK Borcu Yoktur Yazısı → uygunluk %80',
      tone: 'warning',
    });
  });

  it('adımı olmayan ekran Belgeler ipucunu kullanır', () => {
    const value = overview([item('Bordro')]);
    expect(nextHint(null, ready(value)).text).toBe('Yükle: Bordro → uygunluk %80');
  });

  it('Uygunluk: eksik sayısı; eksik yoksa derlemeye yönlendirir', () => {
    expect(nextHint('compliance', ready(overview([item('Bordro')]))).text).toBe('14 eksik belgeyi yükle');
    const done = overview([], { ...SUMMARY, missingCount: 0, blockingMissingCount: 0, percent: 100 });
    expect(nextHint('compliance', ready(done)).text).toBe('Raporu derle');
  });

  it('kurum paketi yoksa önce paket uygulatır', () => {
    expect(nextHint('docs', ready({ summary: SUMMARY, checklists: [] })).text).toBe('Kurum paketi uygula');
  });

  it('Derle ve Teslim adımları', () => {
    const value = overview([item('SGK', { isBlocking: true })]);
    expect(nextHint('report', ready(value)).text).toBe('Önizle ve teslime geç');
    expect(nextHint('deliver', ready(value))).toEqual({ text: '2 bloke kalemi çöz, paketi üret', tone: 'warning' });
    const clear = overview([], { ...SUMMARY, blockingMissingCount: 0 });
    expect(nextHint('deliver', ready(clear)).text).toBe('Paketi üret');
  });
});

describe('sameSummary', () => {
  it('sayılar aynıysa aynı sayar', () => {
    expect(sameSummary(SUMMARY, { ...SUMMARY })).toBe(true);
    expect(sameSummary(SUMMARY, { ...SUMMARY, missingCount: 13 })).toBe(false);
    expect(sameSummary(null, null)).toBe(true);
    expect(sameSummary(SUMMARY, null)).toBe(false);
  });
});
