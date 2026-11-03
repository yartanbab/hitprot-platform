import { describe, it, expect } from 'vitest';
import { GENERAL_GROUP_KEY, OWN_GROUP_KEY, groupTemplates, matchesQuery, searchKey } from './templateGroups';

const tpl = (id, name, { issuer = null, isSystem = true, recipient = 1 } = {}) =>
  ({ id, name, issuer, isSystem, recipient });

// Sunucunun döndürdüğü sıra (Order, ad).
const TEMPLATES = [
  tpl('k1', 'KOSGEB ara rapor (3 ayda bir)', { issuer: 'KOSGEB' }),
  tpl('t1', 'TÜBİTAK TEYDEB dönem raporu (6 ayda bir)', { issuer: 'TÜBİTAK' }),
  tpl('b1', 'Banka / finans dosyası', { recipient: 2 }),
  tpl('i1', 'İç yönetim özeti', { recipient: 5 }),
  tpl('t2', 'TÜBİTAK TEYDEB proje sonuç raporu', { issuer: 'TÜBİTAK' }),
  tpl('k2', 'KOSGEB proje sonuç raporu', { issuer: 'KOSGEB' }),
  tpl('e1', 'AB Funding & Tenders nihai raporu', { issuer: 'Avrupa Komisyonu' }),
  tpl('o1', 'Bizim KOSGEB kopyası', { issuer: 'KOSGEB', isSystem: false }),
];

describe('searchKey', () => {
  it('Türkçe büyük/küçük harf ve aksanı katlar', () => {
    expect(searchKey('TÜBİTAK')).toBe('tubitak');
    expect(searchKey('IŞIK')).toBe('isik');
    expect(searchKey('İç yönetim')).toBe('ic yonetim');
    expect(searchKey('Gençlik ve Spor')).toBe('genclik ve spor');
  });

  it('boş ve tanımsız değerde boş döner', () => {
    expect(searchKey(null)).toBe('');
    expect(searchKey(undefined)).toBe('');
  });
});

describe('matchesQuery', () => {
  it('boş sorgu her şablonu geçirir', () => {
    expect(matchesQuery(TEMPLATES[0], '   ')).toBe(true);
  });

  it('kurum adında, şablon adında ve alıcı türünde arar; aksansız yazım eşleşir', () => {
    expect(matchesQuery(TEMPLATES[1], 'tubitak')).toBe(true);
    expect(matchesQuery(TEMPLATES[6], 'komisyon')).toBe(true);
    expect(matchesQuery(TEMPLATES[2], 'banka')).toBe(true);
    expect(matchesQuery(TEMPLATES[1], 'kosgeb')).toBe(false);
  });

  it('her kelime geçmeli', () => {
    expect(matchesQuery(TEMPLATES[1], 'tübitak dönem')).toBe(true);
    expect(matchesQuery(TEMPLATES[4], 'tübitak dönem')).toBe(false);
  });
});

describe('groupTemplates', () => {
  it('kendi şablonları başa, sistem şablonlarını kuruma göre ilk görünüş sırasıyla gruplar', () => {
    const groups = groupTemplates(TEMPLATES);

    expect(groups.map((g) => g.key)).toEqual([
      OWN_GROUP_KEY, 'issuer:KOSGEB', 'issuer:TÜBİTAK', GENERAL_GROUP_KEY, 'issuer:Avrupa Komisyonu',
    ]);
    expect(groups[0].title).toBe('Kendi şablonlarım');
    expect(groups[0].items.map((t) => t.id)).toEqual(['o1']);
    expect(groups[1].items.map((t) => t.id)).toEqual(['k1', 'k2']);
    expect(groups[3].title).toBe('Genel şablonlar');
    expect(groups[3].items.map((t) => t.id)).toEqual(['b1', 'i1']);
  });

  it('sorguyla süzer ve boş kalan grubu çıkarır', () => {
    const groups = groupTemplates(TEMPLATES, 'tubitak');

    expect(groups.map((g) => g.key)).toEqual(['issuer:TÜBİTAK']);
    expect(groups[0].items.map((t) => t.id)).toEqual(['t1', 't2']);
  });

  it('eşleşme yoksa boş liste döner', () => {
    expect(groupTemplates(TEMPLATES, 'olmayan kurum')).toEqual([]);
  });
});
