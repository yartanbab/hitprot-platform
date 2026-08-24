import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Yeni Görev hızlı giriş ayrıştırıcısı.
 *
 * Kaynak wwwroot/js/apya-quick-task.js'tir — React island DEĞİL, MVC sayfalarına global
 * demetle giden düz bir script. Kopyalamak yerine dosyayı okuyup jsdom'un window'unda
 * çalıştırıyoruz: tek kaynak korunur, test gerçekten yayınlanan kodu ölçer.
 */
let taskCreate;

beforeAll(() => {
  const file = path.resolve(__dirname, '../../../js/apya-quick-task.js');
  // eslint-disable-next-line no-new-func
  new Function(fs.readFileSync(file, 'utf8')).call(window);
  taskCreate = window.apya.taskCreate;
});

const LOOKUPS = {
  users: [
    { id: 'u-ahmet', name: 'Ahmet Yılmaz' },
    { id: 'u-ayse', name: 'Ayşe Demir' },
    { id: 'u-ali', name: 'Ali Vural' },
  ],
  tags: ['backend', 'db', 'İyileştirme'],
};

// Sabit "bugün": 22 Ağustos 2026, Cumartesi.
const TODAY = new Date(2026, 7, 22);

const parse = (text) => taskCreate.parseQuickLine(text, LOOKUPS, TODAY);

describe('fold — Türkçe katlama', () => {
  it('İ/I/ı hepsini i yapar', () => {
    expect(taskCreate.fold('İYİLEŞTİRME')).toBe('iyilestirme');
    expect(taskCreate.fold('ırmak')).toBe('irmak');
  });

  it('aksanlı harfleri düşürür', () => {
    expect(taskCreate.fold('Ağustos')).toBe('agustos');
    expect(taskCreate.fold('ÇÖPLÜK')).toBe('copluk');
  });
});

describe('parseQuickLine — başlık', () => {
  it('işaretçi yoksa tüm satır başlıktır', () => {
    expect(parse('Veritabanı optimizasyonu').title).toBe('Veritabanı optimizasyonu');
  });

  it('tüm işaretçileri başlıktan çıkarır ve boşlukları toparlar', () => {
    const r = parse('Veritabanı optimizasyonu @ahmet !yüksek #backend >29 Ağu');
    expect(r.title).toBe('Veritabanı optimizasyonu');
  });

  it('işaretçi ortada geçse de başlık bütün kalır', () => {
    expect(parse('Rapor @ayse ekranı #db hazırlansın').title).toBe('Rapor ekranı hazırlansın');
  });

  it('boş satır boş başlık verir', () => {
    expect(parse('').title).toBe('');
    expect(parse('   ').title).toBe('');
  });

  it('e-posta adresini atanan sanmaz — @ ancak sözcük başındayken işaretçidir', () => {
    const r = parse('info@apya.com adresine yaz');
    expect(r.assigneeId).toBeNull();
    expect(r.title).toBe('info@apya.com adresine yaz');
  });
});

describe('parseQuickLine — @atanan', () => {
  it('ön ekle tek adayı seçer', () => {
    const r = parse('İş @ahmet');
    expect(r.assigneeId).toBe('u-ahmet');
    expect(r.assigneeName).toBe('Ahmet Yılmaz');
  });

  it('Türkçe harf farkını yok sayar', () => {
    expect(parse('İş @ayşe').assigneeId).toBe('u-ayse');
    expect(parse('İş @ayse').assigneeId).toBe('u-ayse');
  });

  it('soyadıyla da tutar (içinde geçen)', () => {
    expect(parse('İş @yılmaz').assigneeId).toBe('u-ahmet');
  });

  it('birden çok aday varsa hiçbirini seçmez', () => {
    expect(parse('İş @a').assigneeId).toBeNull();
  });

  it('bilinmeyen kişi sessizce yok sayılır ama satırdan düşer', () => {
    const r = parse('İş @kimseyok');
    expect(r.assigneeId).toBeNull();
    expect(r.title).toBe('İş');
  });
});

describe('parseQuickLine — #etiket', () => {
  it('birden çok etiket toplar', () => {
    expect(parse('İş #backend #db').tags).toEqual(['backend', 'db']);
  });

  it('bilinen etiketin YAZIMINI korur', () => {
    expect(parse('İş #iyilestirme').tags).toEqual(['İyileştirme']);
  });

  it('yeni etiket olduğu gibi geçer', () => {
    expect(parse('İş #yenietiket').tags).toEqual(['yenietiket']);
  });

  it('aynı etiketi iki kez eklemez', () => {
    expect(parse('İş #db #db').tags).toEqual(['db']);
  });
});

describe('parseQuickLine — !öncelik', () => {
  it.each([
    ['düşük', 1], ['dusuk', 1], ['low', 1],
    ['orta', 2], ['normal', 2],
    ['yüksek', 3], ['yuksek', 3], ['high', 3],
    ['kritik', 4], ['acil', 4],
  ])('!%s → %i', (word, expected) => {
    expect(parse(`İş !${word}`).priority).toBe(expected);
  });

  it('tanınmayan sözcük önceliği set etmez', () => {
    expect(parse('İş !mavi').priority).toBeNull();
  });

  it('ilk öncelik kazanır', () => {
    expect(parse('İş !kritik !düşük').priority).toBe(4);
  });
});

describe('parseQuickLine — >tarih', () => {
  it('bugün ve yarın', () => {
    expect(parse('İş >bugün').dueDate).toBe('2026-08-22');
    expect(parse('İş >yarın').dueDate).toBe('2026-08-23');
  });

  it('göreli gün', () => {
    expect(parse('İş >+3g').dueDate).toBe('2026-08-25');
    expect(parse('İş >+10gün').dueDate).toBe('2026-09-01');
  });

  it('sayısal biçimler', () => {
    expect(parse('İş >29.08').dueDate).toBe('2026-08-29');
    expect(parse('İş >29.08.2027').dueDate).toBe('2027-08-29');
    expect(parse('İş >1/9').dueDate).toBe('2026-09-01');
  });

  it('ay adıyla — boşluk içeren değeri de yer', () => {
    const r = parse('İş >29 Ağu');
    expect(r.dueDate).toBe('2026-08-29');
    expect(r.title).toBe('İş');
  });

  it('yıl verilmeyip tarih geçmişte kalıyorsa gelecek yıla taşır', () => {
    expect(parse('İş >3 Ocak').dueDate).toBe('2027-01-03');
  });

  it('gün adı bir sonraki o güne gider', () => {
    // 22 Ağu 2026 Cumartesi → sonraki Perşembe 27 Ağustos.
    expect(parse('İş >perşembe').dueDate).toBe('2026-08-27');
  });

  it('geçersiz tarih null bırakır ama token yine yenir', () => {
    const r = parse('İş >31.02');
    expect(r.dueDate).toBeNull();
    expect(r.title).toBe('İş');
  });

  it('iki sözcüklü biçim YALNIZ ay adıyla eşleşir — başlıktan sözcük yemez', () => {
    const r = parse('Toplantı >5 kişilik salon ayarlansın');
    expect(r.title).toBe('Toplantı kişilik salon ayarlansın');
    expect(r.dueDate).toBeNull();
  });

  it('ilk tarih kazanır', () => {
    expect(parse('İş >yarın >29.08').dueDate).toBe('2026-08-23');
  });
});

describe('parseQuickLine — ~gizli', () => {
  it('tek başına ~ gizli yapar', () => {
    const r = parse('İş ~');
    expect(r.isPrivate).toBe(true);
    expect(r.title).toBe('İş');
  });

  it('~gizli yazımı da tutar', () => {
    expect(parse('İş ~gizli').isPrivate).toBe(true);
  });

  it('işaretçi yoksa gizli değildir', () => {
    expect(parse('İş').isPrivate).toBe(false);
  });
});

describe('parseQuickLine — birleşik', () => {
  it('maketteki örnek satırı uçtan uca çözer', () => {
    const r = parse('Veritabanı optimizasyonu yapılacak @ahmet !yüksek #backend >29 Ağu');
    expect(r).toMatchObject({
      title: 'Veritabanı optimizasyonu yapılacak',
      assigneeId: 'u-ahmet',
      assigneeName: 'Ahmet Yılmaz',
      priority: 3,
      dueDate: '2026-08-29',
      isPrivate: false,
    });
    expect(r.tags).toEqual(['backend']);
  });
});

describe('formatRange — çip etiketi', () => {
  it('aynı ay içinde ayı bir kez yazar', () => {
    expect(taskCreate.formatRange('2026-08-22', '2026-08-29')).toBe('22 – 29 Ağu');
  });

  it('ay değişince iki tarafı da yazar', () => {
    expect(taskCreate.formatRange('2026-08-22', '2026-09-03')).toBe('22 Ağu – 3 Eyl');
  });

  it('bitiş yoksa yalnız başlangıcı yazar', () => {
    expect(taskCreate.formatRange('2026-08-22', '')).toBe('22 Ağu');
  });

  it('ikisi de yoksa yer tutucu döner', () => {
    expect(taskCreate.formatRange('', '')).toBe('Tarih');
  });
});
