# Deploy delta — 2026-09-11 (`e1f93653` → `c70cef19`)

Canlıda koşan kod **`e1f93653`** + tek dosyalık protokol yaması (`5411a19d`).
Bu paket ikisinin de üzerine gelir.

Paket: `Apya-Yayin-c70cef19.zip` + `Apya-DbMigrator-c70cef19.zip`
(`Masaüstü\Apya-Yayin-2026-09-11\`).

> `b2b15129` paketi (2026-09-09) hiç yüklenmedi ve birleşik sekme sistemi
> (#371–#376) main'e girince geride kaldı. Bu paket onun yerini alır; o
> paketin içeriği burada eksiksiz var.

## Taban nasıl ölçüldü — 🔴 DEPLOY ÖNCESİ YENİDEN ÖLÇ

Ölçüm **2026-09-07** tarihli; bu paket için sunucuya erişilmedi, tekrarlanmadı.
O günden sonra canlıya elle dosya atılmadıysa geçerlidir. Sunucudan üç statik
dosya indirilip `git hash-object` ile ağaçlarda arandı:

| Canlıdaki dosya | Canlı blob | Eşleşen ağaç |
|---|---|---|
| `Pages/Account/Protokol.js` | `09726f2c` | **main** (yama uygulanmış) |
| `css/apya-shell.css` | `96472a36` | `e1f93653` |
| `Pages/Projects/Index.js` | `c30c25fd` | `e1f93653` |

🔑 **Tek dosyaya bakan bir ölçüm bu turda YANLIŞ cevap verirdi.** Protokol yaması
canlıya elle uygulandığı için gövde `e1f93653`, o dosya ise main seviyesinde.
Sürüm tespitini her zaman birden çok dosyada yap.

## Ne iniyor

**24 commit · PR #349 → #376.** Müşterinin göreceği başlıklar:

| Alan | Değişiklik |
|---|---|
| Muhasebe | Cari kartı, cari ekstre, mizan ve yıl sonu kur değerlemesi ekranları **menüden kaldırıldı** (#356). Kayıtlar ve tablolar duruyor, silinmedi. Proje formundaki "Cari (Müşteri)" alanı ve proje listesindeki "Müşteri" sütunu da kalktı. Fatura ekranındaki müşteri seçimi **değişmedi**. |
| Genel Bakış | "Özet Raporlar" ekranı kaldırıldı, `/Reports` → Genel Bakış'a yönleniyor (#364). Yerine "Efor dağılımı" kartı ve İstatistikler bandında "Kaydedilen efor" kutucuğu geldi. |
| Kabuk | Avatar menüsü yenilendi: kimlik bloğu + "Profil" / "Görünüm" sekmeleri; dil, açık/koyu tema ve yoğunluk menüden değiştiriliyor (#357). |
| Hata yönetimi | PUT/AJAX isteklerinde `/Error` yönlendirme döngüsü giderildi; kaydedilemeyen değişiklikler artık kullanıcıya bildiriliyor, teknik kod yerine Türkçe mesaj çıkıyor (#355). |
| Kayıt akışı | Aynı e-posta ile ikinci hesap açılması dört noktada engellendi (#363). Protokol onay kutuları düzeltmesi (#360) zaten canlıda yamalı, pakete de girdi. |
| Hibe | Başvuru ekranlarındaki ekleme diyalogları hiçbir işlem yapmıyordu: "Evrak Takibi"nde evrak ekleme ve revizyon isteme, "Red ve İtiraz"da gerekçe maddesi ve görüş, "Uygulama ve Tahsilat"ta rapor ve bölüm ekleme düğmeleri tıklanınca sessizce hiçbir şey olmuyordu; durum seçimleri de açılır liste yerine boş metin kutusu gösteriyordu (#366). Yalnız istemci tarafı — migration yok. |
| Sekme düzeni | **YENİ (#371–#373).** Görevler, projeler ve finans ekranlarında sekmeler tek ortak düzende çalışıyor. Proje detayına yeni panolar geldi: takvim, gösterge, galeri, belgeler ve fazlası. Görev penceresinde özellik ekleme tek menüye indi; telefonda sekme şeridi rahatladı. |
| Proje kapsamı & finans | **YENİ (#374, #375).** Kontrol listesine artık **proje** maddeleri de eklenebiliyor (bu yüzden yeni migration var, aşağıda). Proje finansında görev harcamaları tablosu; Görevler ekranında tüm projelerin giderlerini tek yerde gösteren Finans sekmesi; gider kaydının bağlantısı sonradan değiştirilebiliyor. |
| Sürüm notu | `2026.09.07` girişine hibe maddesi (#367) — **10 madde**. Yeni `2026.09.10` girişi (#376) — **8 madde**. |
| Hız | Bildirim zili/listesi, görev konsolu, proje belge listesi ve finans toplamları için indeksler (#359, #361, #362). |
| Veri bütünlüğü | Filtresiz UNIQUE indeksler soft-delete satırının anahtarını kalıcı rezerve ediyordu; 14 indeks yeniden kuruldu, 7'si `IsDeleted = 0` filtresi aldı (#353). SQL Server'da sıralı GUID sağlayıcısı düzeltildi (#352). |

## Migration — 5 adet, **hiçbiri veri düşürmüyor**

```
20260906194546_SoftDeleteAwareUniqueIndexes
20260906201249_HotPathIndexesShellAndTasks
20260906203048_FinanceCoveringIndexes
20260907094533_NotificationAndDocumentIndexes
20260910124932_TaskScopeAndFinanceIndexes      ← YENİ (#374)
```

Adlar SQL Server tarafınınkiler (canlı sağlayıcı). Her biri hem
`Apya.Platform.EntityFrameworkCore` (PostgreSql) hem
`Apya.Platform.EntityFrameworkCore.SqlServer` altında üretildi.

🔑 **İlk dördü yalnız indeks işlemi.** `DropColumn`, `DropTable`, `RenameTable` ve
`AlterColumn` hiç yok — ölçüldü.

🔑 **Beşincisi (`TaskScopeAndFinanceIndexes`) şemaya dokunuyor ama veri düşürmüyor** —
`Up()` ölçüldü:

| İşlem | Tablo · kolon | Etkisi |
|---|---|---|
| `AlterColumn` | `AppTaskChecklistItems.TaskId` NOT NULL → **NULL** | Kolon **genişliyor**; mevcut satırlar olduğu gibi kalır |
| `AddColumn` | `AppTaskChecklistItems.ProjectId` (nullable) | Mevcut satırlarda boş gelir |
| `CreateIndex` ×3 | `AppTaskDependencies(PredecessorTaskId)`, `AppTaskChecklistItems(ProjectId)`, `AppExpenses(ProjectId, ExpenseDate)` | Yalnız ekleme |

2026-09-06 paketindeki `RenameDemoRequestsToRegistrationRequests` gibi bir veri
riski **bu turda yok**; deploy öncesi tablo CSV'si almak gerekmiyor.

🔴 **Geri alma uyarısı:** `TaskScopeAndFinanceIndexes`'in `Down()`'u `TaskId`'yi
tekrar NOT NULL yapar. Deploy sonrası bir kullanıcı **proje maddesi** eklerse
(`TaskId` boş satır) geri alma o satırda düşer. Geri dönüş planı **sunucu yedeği**
olmalı, migration'ı geri sarmak değil.

`SoftDeleteAwareUniqueIndexes` mevcut UNIQUE indeksleri düşürüp filtreli hâlde
yeniden kuruyor. Bu, tabloda **halihazırda mükerrer canlı satır varsa** düşer —
migration sırasında hata alınırsa sebebi budur, veri kaybı değil.

## Tohumlama — DbMigrator ŞART

`dotnet ef database update` **yetmez**: şema uygular, tohumlamayı çalıştırmaz.

Bu turda tohumlanacak yeni bir izin yok, ama `ReleaseNotePublicationDataSeedContributor`
davranışı önemli:

🔴 **Yeni sürüm notu maddeleri VARSAYILAN OLARAK KAPALIDIR.** Tohum yalnız tablo
tamamen boşsa çalışır; canlıda tablo 2026-09-06 paketiyle doldu. Dolayısıyla
`2026.09.07` (10) ve `2026.09.10` (8) girişlerinin **18 maddesi kullanıcıya GİTMEZ** — host `/Admin/ReleaseNotes`
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
9. `/Admin/ReleaseNotes` → `2026.09.07` ve `2026.09.10` maddelerini (18) onayla
   (yukarıdaki 🔴 nota bak).

## Deploy sonrası QA

- `/health/ready` **200** (ilk istek soğuk başlangıç, 15-20 sn normal).
- Avatar menüsü: sekmeler geliyor mu, tema/yoğunluk değişimi anında uygulanıyor mu.
- Genel Bakış'ta "Efor dağılımı" kartı; `/Reports` → Genel Bakış'a yönleniyor mu.
- Menüde cari/mizan/ekstre/değerleme **yok**; Kasalar, Finans Merkezi, Kurlar, Proje
  Bütçesi **var**.
- Fatura ekranında müşteri seçimi çalışıyor.
- Bildirim zili ve görev konsolu açılış süresi.
- Hibe: "Evrak Takibi"nde evrak ekleme, "Red ve İtiraz"da madde ekleme, "Uygulama ve
  Tahsilat"ta rapor ekleme düğmeleri iş yapıyor mu; durum seçimi açılır liste mi.
- Sekme düzeni: Görevler, bir projenin detayı ve Finans ekranlarında sekmeler aynı
  davranıyor mu; proje detayında takvim/gösterge/galeri/belgeler panoları açılıyor mu.
- **Kontrol listesine proje maddesi ekle** — yeni migration'ın kolonunu (`ProjectId`,
  boş `TaskId`) canlıda ilk kez kullanan akış bu; kaydedip sayfayı yenileyince
  madde yerinde durmalı.
- Görevler ekranında Finans sekmesi; bir gider kaydının bağlantısını değiştirme.
- Telefonda sekme şeridi (dar ekranda taşma yok).
- Sürüm notu penceresi: onaydan **önce** kullanıcıda çıkmamalı, onaydan **sonra** çıkmalı.

## Bilinen sınır

- İndeks turunun tek seferlik **REBUILD** adımı bu pakete dâhil değil, ayrı iş.
- #354 (giriş faz ölçümü) bilerek dışarıda bırakıldı; giriş POST yavaşlığı
  (ort. ~2 sn, %72'si kiracı arama döngüsünde) bu paketle düzelmez.
