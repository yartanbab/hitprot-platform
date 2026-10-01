import { describe, it, expect, beforeAll, vi } from 'vitest';

// wwwroot/js/apya-telemetry.js bir IIFE (global demet): window.ApyaTelemetry'yi kurar.
// reportIslandError — React adası hata sınırının (IslandErrorBoundary) kanalı: React yakaladığı
// hatayı window.onerror'a iletmediği için ada çökmeleri telemetriye yalnız buradan düşer.
// Aynı reportError yolu: arka plan isteği, sayfa başına parmak izi tekilleştirmesi.

const reportClientError = vi.fn(() => Promise.resolve('hata-1'));

beforeAll(async () => {
    window.apya = { platform: { telemetry: { telemetry: { reportClientError } } } };
    await import('../../../js/apya-telemetry.js');
});

describe('ApyaTelemetry.reportIslandError', () => {
    it('JsError olarak, [ada:<ad>] önekli ve React bileşen yığınıyla bildirir; arka plan isteği (pencere açmaz)', () => {
        const error = new RangeError('Invalid time value');

        window.ApyaTelemetry.reportIslandError('calendar', error, '\n    at Probe\n    at CalendarRoot');

        expect(reportClientError).toHaveBeenCalledTimes(1);
        const [dto, options] = reportClientError.mock.calls[0];
        expect(dto.source).toBe(1);
        expect(dto.message).toBe('[ada:calendar] Invalid time value');
        expect(dto.stackTrace).toContain(error.stack.split('\n')[0]);
        expect(dto.stackTrace).toContain('--- React bileşen yığını ---\n    at Probe');
        expect(dto.pageUrl).toBe(window.location.pathname + window.location.search);
        expect(options).toEqual({ abpHandleError: false, apyaBackground: true });
        expect(JSON.parse(window.ApyaTelemetry.getBreadcrumbJson()).at(-1))
            .toMatchObject({ y: 'error', l: '[ada:calendar] Invalid time value' });
    });

    it('aynı çökme ("Tekrar dene" döngüsü) sayfa başına bir kez gider; başka ada ayrı sayılır', () => {
        const error = new TypeError('x.map is not a function');

        window.ApyaTelemetry.reportIslandError('project-panels:forms', error, '\n    at FormsPanel');
        window.ApyaTelemetry.reportIslandError('project-panels:forms', error, '\n    at FormsPanel');
        window.ApyaTelemetry.reportIslandError('project-panels:checklist', error, '\n    at ChecklistPanel');

        expect(reportClientError.mock.calls.map(([dto]) => dto.message)).toEqual([
            '[ada:project-panels:forms] x.map is not a function',
            '[ada:project-panels:checklist] x.map is not a function',
        ]);
    });

    it('Error olmayan değer ve yığınsız çağrı: fırlatmaz, düz metinle bildirir', () => {
        expect(() => window.ApyaTelemetry.reportIslandError('forms', 'düz metin')).not.toThrow();

        expect(reportClientError).toHaveBeenCalledTimes(1);
        const [dto] = reportClientError.mock.calls[0];
        expect(dto.message).toBe('[ada:forms] düz metin');
        expect(dto.stackTrace).toBeNull();
    });

    it('mevcut yüzey duruyor (apya-feedback.js okur)', () => {
        expect(typeof window.ApyaTelemetry.getBreadcrumbJson).toBe('function');
        expect(typeof window.ApyaTelemetry.getPageContext).toBe('function');
        expect(typeof window.ApyaTelemetry.getLastClientErrorId).toBe('function');
    });
});
