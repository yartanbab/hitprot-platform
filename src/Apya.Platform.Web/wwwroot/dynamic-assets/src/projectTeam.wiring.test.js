import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Pages/Projects/ProjectDetails.js bir jQuery IIFE'si — vitest/jsdom altında
 * ÇALIŞTIRILAMAZ (jQuery, Bootstrap, DataTables ve ABP proxy'leri ister). Bu yüzden
 * tarayıcıda görünen sözleşme KAYNAK METNİ okunarak sabitlenir; davranışın kendisi
 * canlıda doğrulanır (task-detail.wiring.test.js ile aynı desen).
 *
 * 2026-09-28 UX denetimi, STA-17: Ekip çekmecesindeki rol seçiminde yalnız başarı dalı
 * vardı. Sunucu rol değişikliğini reddedince (yetki, son sorumlu kuralı, ağ) seçim YENİ
 * rolde kalıyor, ekran kaydedilmemiş bir rolü gösteriyordu.
 */
const dynamicAssetsSrc = path.dirname(fileURLToPath(import.meta.url));
const file = path.resolve(dynamicAssetsSrc, '../../../Pages/Projects/ProjectDetails.js');

describe('Proje ekibi — rol seçimi (kaynak metni pin)', () => {
    const src = readFileSync(file, 'utf8');
    const start = src.indexOf('memberService.updateRole(');
    const end = src.indexOf('$row.append($sel)', start);

    it('rol güncelleme çağrısı tek ve rol seçiminin içinde', () => {
        expect(start).toBeGreaterThan(-1);
        expect(end).toBeGreaterThan(start);
        expect(src.indexOf('memberService.updateRole(', start + 1)).toBe(-1);
    });

    it('ret dalı seçimi kayıtlı role geri alır', () => {
        const handler = src.slice(start, end);

        // .then(başarı, ret): ikinci geri çağrı olmadan sunucu reddi seçimi yeni rolde bırakır.
        expect(handler).toMatch(/\.then\(function \(\) \{[\s\S]*?\},\s*function \(\) \{[\s\S]*?\}\);/);

        const reject = handler.slice(handler.search(/\},\s*function \(\) \{/));
        expect(reject).toContain('$sel.val(String(m.role));');
        // Başarı dalı yerinde: liste yeniden çizilir (seçim sunucudaki role göre kurulur).
        expect(handler.slice(0, handler.length - reject.length)).toContain('loadMembers();');
    });
});
