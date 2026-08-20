import { describe, expect, it } from 'vitest';
import { humanMessage, statusMessage, validate } from './api';

const dosya = (name, size = 10) => ({ name, size });

describe('humanMessage', () => {
    it('ham .NET istisna metnini kullanıcıya geçirmez', () => {
        expect(humanMessage(
            'Volo.Abp.Data.AbpDbConcurrencyException: The database operation was '
            + 'expected to affect 1 row(s), but actually affected 0 row(s)',
        )).toBeNull();
    });

    it('iç içe istisna zincirini de eler', () => {
        expect(humanMessage(
            'Microsoft.EntityFrameworkCore.DbUpdateException: An error occurred '
            + '---> Microsoft.Data.SqlClient.SqlException: zaman aşımı',
        )).toBeNull();
    });

    it('yığın izi içeren metni eler', () => {
        expect(humanMessage('Bir şeyler ters gitti at System.Threading.Tasks.Task.Run')).toBeNull();
    });

    it('insan dilindeki sunucu mesajını korur', () => {
        expect(humanMessage('Geçersiz veya boş dosya.')).toBe('Geçersiz veya boş dosya.');
    });

    it('boş girdide null döner', () => {
        expect(humanMessage('')).toBeNull();
        expect(humanMessage(null)).toBeNull();
        expect(humanMessage('   ')).toBeNull();
    });

    it('çok uzun mesajı kırpar', () => {
        const uzun = 'a'.repeat(300);
        const sonuc = humanMessage(uzun);
        expect(sonuc).toHaveLength(158); /* 157 karakter + tek karakterlik üç nokta */
        expect(sonuc.endsWith('…')).toBe(true);
    });
});

describe('statusMessage', () => {
    it('bilinen durumlara Türkçe karşılık verir', () => {
        expect(statusMessage(403)).toBe('Bu klasöre yükleme yetkiniz yok.');
        expect(statusMessage(413)).toBe('Dosya sunucu sınırını aşıyor.');
    });

    it('5xx için tekrar denemeyi önerir', () => {
        expect(statusMessage(500)).toMatch(/tekrar deneyebilirsiniz/);
        expect(statusMessage(503)).toMatch(/tekrar deneyebilirsiniz/);
    });

    it('bilinmeyen 4xx durumunu ham kodla bildirir', () => {
        expect(statusMessage(418)).toBe('Sunucu 418 döndü');
    });
});

describe('validate', () => {
    it('desteklenmeyen uzantıyı reddeder', () => {
        expect(validate(dosya('kotu.exe'))).toBe('Desteklenmeyen dosya türü');
        expect(validate(dosya('uzantisiz'))).toBe('Desteklenmeyen dosya türü');
    });

    it('25 MB üstünü reddeder', () => {
        expect(validate(dosya('buyuk.pdf', 26 * 1024 * 1024))).toBe('Dosya 25 MB sınırını aşıyor');
    });

    it('geçerli dosyada null döner', () => {
        expect(validate(dosya('rapor.pdf', 1024))).toBeNull();
        expect(validate(dosya('TABLO.CSV', 1024))).toBeNull(); /* uzantı büyük harfli olabilir */
    });
});
