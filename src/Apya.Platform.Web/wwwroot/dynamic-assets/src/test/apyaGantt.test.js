import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * wwwroot/js/apya-gantt.js — kaynak metni pin (task-detail.wiring.test.js deseni).
 *
 * Bileşen moment'e bağlı ve moment dynamic-assets bağımlılıklarında yok; jsdom'da
 * çalıştırılamaz (jqueryShim yetmez). Davranış canlıda ölçülür; burada STA-01
 * düzeltmesinin geri alınmadığı kilitlenir:
 *  - kayıt yalnız tarih ucuna (updateSchedule) gider — tam güncelleme liste DTO'sundan
 *    kurulduğu için öncülleri ve bütçe bağını siliyordu;
 *  - öncüller gizlilik süzgeçli kenar ucundan gelir, düşerse ABP penceresi açılmaz.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(here, '../../../js/apya-gantt.js'), 'utf8');

describe('apya-gantt.js — kaynak metni pin (STA-01)', () => {
    it('kayıt yalnız tarih ucunu çağırır', () => {
        expect(src).toContain('taskSvc.updateSchedule(');
    });

    it('tam güncelleme ve elle DTO kurucusu yok', () => {
        expect(src).not.toContain('taskSvc.update(');
        expect(src).not.toContain('toUpdateDto');
    });

    it('öncüller kenar ucundan, ABP hata penceresi kapalı alınır', () => {
        expect(src).toContain('getProjectDependencies(');
        expect(src).toContain('abpHandleError: false');
    });

    it('jQuery 4 ile uyumsuz .finally kullanılmaz', () => {
        expect(src).not.toContain('.finally(');
    });
});
