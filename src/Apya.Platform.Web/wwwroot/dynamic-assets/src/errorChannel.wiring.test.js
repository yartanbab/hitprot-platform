import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Hata kanalının kablolaması (kaynak metni pin — dataChanged.wiring deseni). jQuery
 * sayfa betikleri (kanban, Projeler, Hibe Belgeler) vitest altında uçtan uca
 * çalıştırılamıyor; tek kanal sözleşmesi ve metinlerin tr.json/en.json ile eşliği
 * burada kaynaktan kilitlenir, gerçek davranış canlıda doğrulanır.
 */
const src = path.dirname(fileURLToPath(import.meta.url));
const web = path.resolve(src, '../../..');
const shared = path.resolve(web, '..', 'Apya.Platform.Domain.Shared', 'Localization', 'Platform');
const read = (...p) => readFileSync(path.join(...p), 'utf8');
const count = (text, needle) => text.split(needle).length - 1;

const errorDetail = read(web, 'wwwroot', 'js', 'ajax-error-detail.js');
const httpClient = read(src, 'lib', 'api', 'httpClient.js');
const trRaw = read(shared, 'tr.json');
const enRaw = read(shared, 'en.json');
const tr = JSON.parse(trRaw).texts;
const en = JSON.parse(enRaw).texts;

/** text('Api:…', 'yedek') / t('Api:…', 'yedek') çiftleri. */
function localizedPairs(source) {
    const re = /\b(?:text|t)\(\s*'(Api:(?:Error|Session):[^']+)'\s*,\s*'([^']*)'/g;
    const pairs = [];
    let m;
    while ((m = re.exec(source))) { pairs.push({ key: m[1], fallback: m[2] }); }
    return pairs;
}

describe('kök neden kalıcı olarak kapalı (ACC-06, RES-01)', () => {
    it('ABP varsayılan hata nesnesine yazılmaz; eski kendini onarma bayrağı yok', () => {
        expect(errorDetail).not.toMatch(/defaultError\.details\s*=/);
        expect(errorDetail).not.toContain('apyaAntiforgeryHeal');
    });

    it('sayfa yenileme yalnız kullanıcı düğmesinin çağırdığı hardReload içinde', () => {
        expect(count(errorDetail, 'location.reload(')).toBe(1);
        const hardReload = errorDetail.slice(errorDetail.indexOf('function hardReload()'));
        const body = hardReload.slice(0, hardReload.indexOf('\n    }'));
        expect(body).toContain('location.reload(');
    });

    it('global demette kota sarmalayıcısından ÖNCE (showError zinciri)', () => {
        const module = read(web, 'PlatformWebModule.cs');
        expect(module.indexOf('"/js/ajax-error-detail.js"')).toBeGreaterThan(0);
        expect(module.indexOf('"/js/ajax-error-detail.js"')).toBeLessThan(module.indexOf('"/js/apya-quota-upsell.js"'));
    });
});

describe('metinler tek kaynaktan: tr.json / en.json (STA-V01)', () => {
    const pairs = [...localizedPairs(errorDetail), ...localizedPairs(httpClient)];

    it('iki dosyada da Api:Error/Api:Session anahtarları kullanılıyor', () => {
        expect(localizedPairs(errorDetail).length).toBeGreaterThanOrEqual(15);
        expect(localizedPairs(httpClient).length).toBeGreaterThanOrEqual(8);
    });

    it.each(pairs.map((p) => [p.key, p.fallback]))('%s: tr ve en var, JS yedeği tr.json ile aynı', (key, fallback) => {
        expect(tr[key]).toBe(fallback);
        expect(en[key]).toBeTruthy();
        expect(en[key]).not.toBe(key);
    });

    it.each([...new Set(pairs.map((p) => p.key))])('%s: her dosyada tam bir kez (yinelenen anahtar sessizce ezer)', (key) => {
        expect(count(trRaw, `"${key}":`)).toBe(1);
        expect(count(enRaw, `"${key}":`)).toBe(1);
    });

    it('hiçbir metin sayfayı yenilemeyi ya da önbellek temizlemeyi önermiyor', () => {
        for (const key of Object.keys(tr).filter((k) => k.startsWith('Api:'))) {
            expect(tr[key]).not.toContain('Ctrl+Shift+R');
            if (key !== 'Api:Error:Antiforgery:Persist' && key !== 'Api:Error:Antiforgery:Reload' && key !== 'Api:Session:UserChanged') {
                expect(tr[key]).not.toMatch(/yenileyip|sayfayı yenileyin/i);
            }
        }
    });
});

describe('tek kanal: pencere gösterildiyse ikinci bildirim yok (STA-10, CON-03, SHL-10)', () => {
    it('geri bildirim gönderimi ABP penceresini kapatır, hata form içinde', () => {
        const text = read(web, 'wwwroot', 'js', 'apya-feedback.js');
        expect(text).toContain('feedback.submit(dto, { abpHandleError: false })');
        expect(text).toContain('apya.ajaxErrors.message(err, fallback)');
    });

    it('telemetri arka plan isteği: pencere açmaz', () => {
        expect(read(web, 'wwwroot', 'js', 'apya-telemetry.js'))
            .toContain('reportClientError(dto, { abpHandleError: false, apyaBackground: true })');
    });

    it.each([
        ['task-detail', 'v3', 'TaskDetailRootV3.jsx'],
        ['task-detail', 'v3', 'components', 'TaskGeneralTabV3.jsx'],
        ['task-detail', 'v3', 'components', 'SubtaskSheetV3.jsx'],
    ])('%s/%s/%s: çift bildirim deseni kalmadı', (...p) => {
        const text = read(src, ...p);
        expect(text).not.toContain('notify.err(err?.message ||');
        expect(text).not.toContain('notify?.error?.(err?.message ||');
        expect(text).toContain("from '");
        expect(text).toContain('notifyError(err, ');
    });

    it.each([
        [['documents', 'DocumentsRoot.jsx'], 8],
        [['deliveries', 'DeliveriesRoot.jsx'], 7],
        [['customers.jsx'], 1],
    ])('%s: işlem hatası bildirimi wasShown ile korunur', (p, expected) => {
        expect(count(read(src, ...p), 'if (!wasShown(e)) abpNotify(')).toBe(expected);
    });

    it('kanban: kart/kolon işlemleri ortak kanaldan bildirir', () => {
        const text = read(web, 'wwwroot', 'js', 'apya-kanban.js');
        ['İşlem tamamlanamadı.', 'Kolonlar kaydedilemedi.', 'Görev iptal edilemedi.', 'Görev taşınamadı.', 'Sıralama kaydedilemedi.', 'İptal geri alınamadı.']
            .forEach((msg) => {
                expect(text).not.toContain(`abp.notify.error('${msg}')`);
                expect(text).toContain(`notifyFailure(err, '${msg}')`);
            });
    });

    it('Projeler paneli ve Geri bildirim yorumu ortak kanaldan bildirir', () => {
        expect(count(read(web, 'Pages', 'Projects', 'Index.js'), 'apya.ajaxErrors.notify(err, ')).toBe(2);
        expect(read(web, 'Pages', 'Feedback', 'Index.js')).toContain("apya.ajaxErrors.notify(err, 'Yorum gönderilemedi.')");
    });

    it('Hibe Belgeler ham yanıt gövdesini (JSON zarfı/HTML) basmaz', () => {
        const text = read(web, 'Pages', 'Grants', 'Documents.js');
        expect(text).not.toContain('x.responseText ||');
        expect(count(text, 'apya.ajaxErrors.message(x, ')).toBe(2);
    });

    it('React Query ABP reddini yeniden denemez', () => {
        expect(read(src, 'lib', 'api', 'queryClient.js'))
            .toMatch(/retry: \(failureCount, error\) => \{\s*if \(!\(error instanceof ApiError\)\) return false;/);
    });
});
