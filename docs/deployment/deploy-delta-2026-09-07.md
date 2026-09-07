# Deploy delta — 2026-09-07 (`e1f93653` → `main`)

Canlıda koşan kod **`e1f93653`** + tek dosyalık protokol yaması (`5411a19d`).
Bu paket ikisinin de üzerine gelir.

## Taban nasıl ölçüldü

Sunucudan üç statik dosya indirilip `git hash-object` ile ağaçlarda arandı:

| Canlıdaki dosya | Canlı blob | Eşleşen ağaç |
|---|---|---|
| `Pages/Account/Protokol.js` | `09726f2c` | **main** (yama uygulanmış) |
| `css/apya-shell.css` | `96472a36` | `e1f93653` |
| `Pages/Projects/Index.js` | `c30c25fd` | `e1f93653` |

🔑 **Tek dosyaya bakan bir ölçüm bu turda YANLIŞ cevap verirdi.** Protokol yaması
canlıya elle uygulandığı için gövde `e1f93653`, o dosya ise main seviyesinde.
Sürüm tespitini her zaman birden çok dosyada yap.

## Ne iniyor

**14 commit · PR #349 → #364.** Müşterinin göreceği başlıklar:

| Alan | Değişiklik |
|---|---|
| Muhasebe | Cari kartı, cari ekstre, mizan ve yıl sonu kur değerlemesi ekranları **menüden kaldırıldı** (#356). Kayıtlar ve tablolar duruyor, silinmedi. Proje formundaki "Cari (Müşteri)" alanı ve proje listesindeki "Müşteri" sütunu da kalktı. Fatura ekranındaki müşteri seçimi **değişmedi**. |
| Genel Bakış | "Özet Raporlar" ekranı kaldırıldı, `/Reports` → Genel Bakış'a yönleniyor (#364). Yerine "Efor dağılımı" kartı ve İstatistikler bandında "Kaydedilen efor" kutucuğu geldi. |
| Kabuk | Avatar menüsü yenilendi: kimlik bloğu + "Profil" / "Görünüm" sekmeleri; dil, açık/koyu tema ve yoğunluk menüden değiştiriliyor (#357). |
| Hata yönetimi | PUT/AJAX isteklerinde `/Error` yönlendirme döngüsü giderildi; kaydedilemeyen değişiklikler artık kullanıcıya bildiriliyor, teknik kod yerine Türkçe mesaj çıkıyor (#355). |
| Kayıt akışı | Aynı e-posta ile ikinci hesap açılması dört noktada engellendi (#363). Protokol onay kutuları düzeltmesi (#360) zaten canlıda yamalı, pakete de girdi. |
| Hız | Bildirim zili/listesi, görev konsolu, proje belge listesi ve finans toplamları için indeksler (#359, #361, #362). |
| Veri bütünlüğü | Filtresiz UNIQUE indeksler soft-delete satırının anahtarını kalıcı rezerve ediyordu; 14 indeks yeniden kuruldu, 7'si `IsDeleted = 0` filtresi aldı (#353). SQL Server'da sıralı GUID sağlayıcısı düzeltildi (#352). |

## Migration — 4 adet, **hiçbiri veri düşürmüyor**

```
20260906194546_SoftDeleteAwareUniqueIndexes
20260906201249_HotPathIndexesShellAndTasks
20260906203048_FinanceCoveringIndexes
20260907094533_NotificationAndDocumentIndexes
```

Her biri hem `Apya.Platform.EntityFrameworkCore` (PostgreSql) hem
`Apya.Platform.EntityFrameworkCore.SqlServer` altında üretildi.

🔑 **Dördü de yalnız indeks işlemi.** `DropColumn`, `DropTable`, `RenameTable` ve
`AlterColumn` hiç yok — ölçüldü. 2026-09-06 paketindeki
`RenameDemoRequestsToRegistrationRequests` gibi bir veri riski **bu turda yok**;
deploy öncesi tablo CSV'si almak gerekmiyor.

`SoftDeleteAwareUniqueIndexes` mevcut UNIQUE indeksleri düşürüp filtreli hâlde
yeniden kuruyor. Bu, tabloda **halihazırda mükerrer canlı satır varsa** düşer —
migration sırasında hata alınırsa sebebi budur, veri kaybı değil.

## Tohumlama — DbMigrator ŞART

`dotnet ef database update` **yetmez**: şema uygular, tohumlamayı çalıştırmaz.

Bu turda tohumlanacak yeni bir izin yok, ama `ReleaseNotePublicationDataSeedContributor`
davranışı önemli:

🔴 **Yeni sürüm notu maddeleri VARSAYILAN OLARAK KAPALIDIR.** Tohum yalnız tablo
tamamen boşsa çalışır; canlıda tablo 2026-09-06 paketiyle doldu. Dolayısıyla
`2026.09.07`'nin **9 maddesi kullanıcıya GİTMEZ** — host `/Admin/ReleaseNotes`
ekranından onaylayana kadar yalnız host'a "Onay bekliyor" rozetiyle görünür.

## Deploy adımları

1. Yedek al (DB + site kökü).
2. Korunacak dosyaları FileZilla filtresine ekle — `appsettings.secrets.json`,
   `openiddict.pfx`, `App_Data/uploads/*`, `App_Data/DataProtection-Keys/*`, `Logs/*`.
3. Web paketini site köküne aç (`App_offline.htm` ile havuzu düşürmek DLL kilidini önler).
4. `dbmigrator` klasörünü yükle, **sunucudaki `appsettings.secrets.json`'ı içine kopyala**
   (yoksa araç localhost'a bağlanmaya çalışır).
5. Plesk › Zamanlanmış Görevler › `migrate.bat` → "Şimdi Çalıştır".
6. Sonucu **çıkış kodundan değil** `dbmigrator\Logs\logs.txt` dosyasındaki
   `Successfully completed all database migrations.` satırından doğrula.
7. Zamanlanmış görevi **SİL** (varsayılan "Günlük 00:00" — yoksa her gece koşar).
8. App pool geri dönüşümü.
9. `/Admin/ReleaseNotes` → `2026.09.07` maddelerini onayla (yukarıdaki 🔴 nota bak).

## Deploy sonrası QA

- `/health/ready` **200** (ilk istek soğuk başlangıç, 15-20 sn normal).
- Avatar menüsü: sekmeler geliyor mu, tema/yoğunluk değişimi anında uygulanıyor mu.
- Genel Bakış'ta "Efor dağılımı" kartı; `/Reports` → Genel Bakış'a yönleniyor mu.
- Menüde cari/mizan/ekstre/değerleme **yok**; Kasalar, Finans Merkezi, Kurlar, Proje
  Bütçesi **var**.
- Fatura ekranında müşteri seçimi çalışıyor.
- Bildirim zili ve görev konsolu açılış süresi.
- Sürüm notu penceresi: onaydan **önce** kullanıcıda çıkmamalı, onaydan **sonra** çıkmalı.

## Bilinen sınır

- İndeks turunun tek seferlik **REBUILD** adımı bu pakete dâhil değil, ayrı iş.
- #354 (giriş faz ölçümü) bilerek dışarıda bırakıldı; giriş POST yavaşlığı
  (ort. ~2 sn, %72'si kiracı arama döngüsünde) bu paketle düzelmez.
