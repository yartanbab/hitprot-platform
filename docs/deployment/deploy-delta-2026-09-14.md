# Deploy delta — 2026-09-14 (`e1f93653` → `366408de`)

Canlıda koşan kod **`e1f93653`** + tek dosyalık protokol yaması (`5411a19d`).
Bu paket ikisinin de üzerine gelir.

Paket: `Apya-Yayin-366408de.zip` + `Apya-DbMigrator-366408de.zip`
(`Masaüstü\Apya-Yayin-2026-09-14\`).

> Paket `claude/yayin-2026-09-14` dalındaki **`366408de`** commit'inden üretildi: main
> `a571a740` + bu turun sürüm notu maddeleri. Dal squash ile girdiğinde commit kimliği
> değişir; main o ana kadar ilerlemediyse ağaç birebir aynıdır, paket yeniden üretilmez.
> Önce başka bir PR girerse (ör. açık #394 — çift migration'lı) paket main'in gerisinde kalır.
>
> Bu paketten önce üç paket üretildi, **hiçbiri yüklenmedi**: `b2b15129` (2026-09-09),
> `c70cef19` ve `10a34d6e` (2026-09-11). Sonuncusu Kart Panosu v2 main'e girince geride
> kaldı. Üçünün de içeriği burada eksiksiz var; `10a34d6e` dosyaları artık kullanılmamalı.

## Taban nasıl ölçüldü — 2026-09-14, bu paket için

Sunucudan beş statik dosya indirilip `git hash-object` ile ağaçlarda arandı:

| Canlıdaki dosya | Canlı blob | `e1f93653` | `10a34d6e` | main |
|---|---|---|---|---|
| `css/apya-shell.css` | `96472a36` | ✅ aynı | farklı | farklı |
| `js/apya-kanban.js` | `b5629484` | ✅ aynı | ✅ aynı | farklı |
| `js/documents.js` | `7783d255` | ✅ aynı | farklı | farklı |
| `Pages/Projects/Index.js` | `c30c25fd` | ✅ aynı | farklı | farklı |
| `Pages/Account/Protokol.js` | `09726f2c` | farklı | ✅ aynı | ✅ aynı (yama) |

Ek kanıt: 09-07 sonrası demetlerin chunk'ları (`js/QueryProvider-B4436sFh.js`,
`js/Dialog-Bky2XNdc.js`, `js/EmptyState-D5m5kdmR.js`) canlıda **302** — dosya yok.
`/health/ready` **200** (17,6 sn, soğuk başlangıç).

🔑 Sonuç 2026-09-07 ölçümüyle aynı: gövde `e1f93653`, protokol dosyası yamalı.
Tek dosyaya bakan bir ölçüm bu turda da yanlış cevap verirdi — sürüm tespitini her zaman
birden çok dosyada yap.

## Ne iniyor

**43 commit** — 42'si main'de (PR #349 → #393), sonuncusu bu paketin sürüm notu commit'i.
Müşterinin göreceği başlıklar:

| Alan | Değişiklik |
|---|---|
| Muhasebe | Cari kartı, cari ekstre, mizan ve yıl sonu kur değerlemesi ekranları **menüden kaldırıldı** (#356). Kayıtlar ve tablolar duruyor, silinmedi. Proje formundaki "Cari (Müşteri)" alanı ve proje listesindeki "Müşteri" sütunu da kalktı. Fatura ekranındaki müşteri seçimi **değişmedi**. |
| Genel Bakış | "Özet Raporlar" ekranı kaldırıldı, `/Reports` → Genel Bakış'a yönleniyor (#364). Yerine "Efor dağılımı" kartı ve İstatistikler bandında "Kaydedilen efor" kutucuğu geldi. |
| Kabuk | Avatar menüsü yenilendi: kimlik bloğu + "Profil" / "Görünüm" sekmeleri; dil, açık/koyu tema ve yoğunluk menüden değiştiriliyor (#357). |
| Hata yönetimi | PUT/AJAX isteklerinde `/Error` yönlendirme döngüsü giderildi; kaydedilemeyen değişiklikler artık kullanıcıya bildiriliyor, teknik kod yerine Türkçe mesaj çıkıyor (#355). |
| Kayıt akışı | Aynı e-posta ile ikinci hesap açılması dört noktada engellendi (#363). Kayıt talebi sihirbazının paket kartları yıllık bedeli gösteriyor; bedeli girilmemiş pakette "Bedel görüşmede paylaşılır" (#386, kamuya açık sayfa). Protokol onay kutuları düzeltmesi (#360) zaten canlıda yamalı, pakete de girdi. |
| Sekme düzeni | Görevler, projeler ve finans ekranlarında sekmeler tek ortak düzende çalışıyor (#371–#373). Proje detayına yeni panolar geldi: takvim, gösterge, galeri, belgeler ve fazlası. Görev penceresinde özellik ekleme tek menüye indi; telefonda sekme şeridi rahatladı. |
| Proje kapsamı & finans | Kontrol listesine artık **proje** maddeleri de eklenebiliyor (migration aşağıda). Proje finansında görev harcamaları tablosu; Görevler ekranında tüm projelerin giderlerini tek yerde gösteren Finans sekmesi; gider kaydının bağlantısı sonradan değiştirilebiliyor (#374, #375). |
| Görevler | **Kart Panosu v2:** dört yoğunluk (Kart, Kompakt, Liste, Başlık), kartta görünecek alanlar Görünüm menüsünden seçiliyor ve hesapta saklanıyor; kart eylemleri ⋯ menüsünde, boş kolonlar ince şeride daralıyor (#378, #382). Filtre çubuğunda yalnız etkin filtreler etiket olarak duruyor, yenisi ＋ Filtre ile ekleniyor (#381). Belgeler / Formlar / Kontrol Listesi / Bağımlılıklar panelleri Görevler ekranında tüm projeleri kapsayan kipte (#383). |
| Hibe | **Bugün** ekranı — kiracıda sıradaki işler risk × tutar sırasıyla, host'ta gelen kutusu; menüde hibe grubunun ilk girişi (#390). Kiracı kartları üç sekmeye indi, takip edilen çağrıya not yazılabiliyor, Başvurularım'da gösterge kartları yerine durum cümleleri (#391). İlgi bildiriminde onay adımı, proje fikri (bütçe, ortak, başlangıç) ve geri çekme; host'a hiç gitmeyen "yeni ilgi" bildirimi düzeltildi (#388). Host parametre formunda şart kartları, "nereden geldi" ve çelişki eylemleri (#389). 15 satır tablosu 992 px altında karta dönüşüyor (#385). Evrak Takibi, Red ve İtiraz, Uygulama ve Tahsilat ekranlarında tıklanınca hiçbir şey yapmayan ekleme diyalogları ve açılır liste yerine boş metin kutusu gösteren durum seçimleri düzeltildi (#366). |
| Dokümanlar | Süreç şeridi (Belgeler → Uygunluk → Derle → Teslim) yedi ekranda, sağda bağlama göre "Sırada: …" ipucu; başlıkta tek birincil düğme, ikincil eylemler ⋯ menüsünde; rapor derleyicide Taslak kaydet · Önizle · Üret ve teslime geç (#392). Aynı PR'da canlıdaki dört kusur da düzeldi: uygunluk kartı Uygunluk sekmesi açılana kadar boş kalıyordu, telefonda Belge yakala düğmesi sayfanın en altına düşüyordu, belge detayındaki paket bağlantısı paketi açmıyordu, rapor derleyicinin etkin sekmesi vurgulanmıyordu. |
| Geri bildirim | SQL Server'da gönderim her seferinde 500 veriyordu — takip numarası sorgusu (#387). Canlı SQL Server olduğu için müşteriler büyük ihtimalle bugüne kadar gönderemedi. |
| Hız | Bildirim zili/listesi, görev konsolu, proje belge listesi ve finans toplamları için indeksler (#359, #361, #362). |
| Veri bütünlüğü | Filtresiz UNIQUE indeksler soft-delete satırının anahtarını kalıcı rezerve ediyordu; 14 indeks yeniden kuruldu, 7'si `IsDeleted = 0` filtresi aldı (#353). SQL Server'da sıralı GUID sağlayıcısı düzeltildi (#352). |
| Giriş | Yavaş giriş POST'unu fazlara ayıran **ölçüm** — yalnız log, davranış değişmez (#354). |
| Sürüm notu | `2026.09.07` **12** madde (#358, #364, #355, #365, #367, #377) · `2026.09.10` **8** madde (#376) · `2026.09.11` **12** madde (#384, #388, #393 ve bu paketin commit'i). |

## Migration — 7 adet, **hiçbiri veri düşürmüyor**

```
20260906194546_SoftDeleteAwareUniqueIndexes
20260906201249_HotPathIndexesShellAndTasks
20260906203048_FinanceCoveringIndexes
20260907094533_NotificationAndDocumentIndexes
20260910124932_TaskScopeAndFinanceIndexes      (#374)
20260913212218_GrantInterestProposal           ← YENİ (#388)
20260914082238_GrantBookmarkNote               ← YENİ (#391)
```

Adlar SQL Server tarafınınkiler (canlı sağlayıcı). Her biri hem
`Apya.Platform.EntityFrameworkCore` (PostgreSql) hem
`Apya.Platform.EntityFrameworkCore.SqlServer` altında üretildi.

🔑 **İlk dördü yalnız indeks işlemi.** `DropColumn`, `DropTable`, `RenameTable` ve
`AlterColumn` hiç yok — ölçüldü.

🔑 **`TaskScopeAndFinanceIndexes` şemaya dokunuyor ama veri düşürmüyor** — `Up()` ölçüldü:

| İşlem | Tablo · kolon | Etkisi |
|---|---|---|
| `AlterColumn` | `AppTaskChecklistItems.TaskId` NOT NULL → **NULL** | Kolon **genişliyor**; mevcut satırlar olduğu gibi kalır |
| `AddColumn` | `AppTaskChecklistItems.ProjectId` (nullable) | Mevcut satırlarda boş gelir |
| `CreateIndex` ×3 | `AppTaskDependencies(PredecessorTaskId)`, `AppTaskChecklistItems(ProjectId)`, `AppExpenses(ProjectId, ExpenseDate)` | Yalnız ekleme |

🔑 **İki yeni migration'ın `Up()`'u yalnız nullable `AddColumn`** — iki sağlayıcıda da ölçüldü:

| Migration | Tablo | Eklenen kolonlar (hepsi nullable) |
|---|---|---|
| `GrantInterestProposal` | `AppGrantInterests` | `EstimatedBudget` decimal(18,2) · `NeedsPartner` bit · `PartnerName` nvarchar(200) · `TargetStartDate` datetime2 · `WithdrawnAt` datetime2 |
| `GrantBookmarkNote` | `AppGrantBookmarks` | `MarkedByUserId` uniqueidentifier · `Note` nvarchar(500) |

Mevcut satırlar olduğu gibi kalır; deploy öncesi tablo CSV'si almak gerekmiyor.

🔴 **Geri alma uyarısı:** `TaskScopeAndFinanceIndexes`'in `Down()`'u `TaskId`'yi
tekrar NOT NULL yapar. Deploy sonrası bir kullanıcı **proje maddesi** eklerse
(`TaskId` boş satır) geri alma o satırda düşer. Geri dönüş planı **sunucu yedeği**
olmalı, migration'ı geri sarmak değil.

`SoftDeleteAwareUniqueIndexes` mevcut UNIQUE indeksleri düşürüp filtreli hâlde
yeniden kuruyor. Bu, tabloda **halihazırda mükerrer canlı satır varsa** düşer —
migration sırasında hata alınırsa sebebi budur, veri kaybı değil.

## Tohumlama — DbMigrator ŞART

`dotnet ef database update` **yetmez**: şema uygular, tohumlamayı çalıştırmaz.

- **Yeni hibe bildirim şablonu:** `GrantNotificationTemplateDataSeedContributor` host kataloğunda
  eksik tetikleyicinin şablonunu ekler — bu turda `InterestReceived` (#388, host'a "yeni ilgi").
  Host'un düzenlediği mevcut şablonlara dokunmaz.
- Yeni izin yok (#390 "Bugün" mevcut `Grants.Default` / `Grants.Edit` kapısını kullanır).

🔴 **Yeni sürüm notu maddeleri VARSAYILAN OLARAK KAPALIDIR.** `ReleaseNotePublicationDataSeedContributor`
yalnız tablo tamamen boşsa çalışır; canlıda tablo 2026-09-06 paketiyle doldu. `2026.09.07` (12),
`2026.09.10` (8) ve `2026.09.11` (12) — **32 madde** host `/Admin/ReleaseNotes` ekranından onaylanana
kadar kullanıcıya gitmez, yalnız host'a "Onay bekliyor" rozetiyle görünür.

## Deploy adımları

1. Yedek al (DB + site kökü).
2. Korunacak dosyaları FileZilla filtresine ekle — `appsettings.secrets.json`,
   `openiddict.pfx`, `App_Data/uploads/*`, `App_Data/DataProtection-Keys/*`, `Logs/*`.
3. Web paketini site köküne aç (`App_offline.htm` ile havuzu düşürmek DLL kilidini önler).
4. `dbmigrator` klasörünü yükle, **sunucudaki `appsettings.secrets.json`'ı içine kopyala**
   (yoksa araç localhost'a bağlanmaya çalışır).
5. Plesk › Zamanlanmış Görevler › `migrate.bat` → "Şimdi Çalıştır".
6. Sonucu **çıkış kodundan değil** `dbmigrator\Logs\logs.txt` dosyasındaki
   `Successfully completed all database migrations.` satırından doğrula
   (7 migration birkaç saniyede bittiyse hiçbir şey koşmamıştır).
7. Zamanlanmış görevi **SİL** (varsayılan "Günlük 00:00" — yoksa her gece koşar);
   `dbmigrator` klasörünü de sil (ClientSecret düz metin kalır).
8. App pool geri dönüşümü.
9. `/Admin/ReleaseNotes` → `2026.09.07`, `2026.09.10` ve `2026.09.11` maddelerini (32) onayla.
   Kayıt akışının iki maddesi (#377) kataloğun müşteri odaklılık kuralında sınırda
   (yaşayan kişi henüz hesabı olmayan aday) — yayınlayıp yayınlamamak burada ayrıca
   karar verilebilir.

## Deploy sonrası QA

- `/health/ready` **200** (ilk istek soğuk başlangıç, 15-20 sn normal).
- Avatar menüsü: sekmeler geliyor mu, tema/yoğunluk değişimi anında uygulanıyor mu.
- Genel Bakış'ta "Efor dağılımı" kartı; `/Reports` → Genel Bakış'a yönleniyor mu.
- Menüde cari/mizan/ekstre/değerleme **yok**; Kasalar, Finans Merkezi, Kurlar, Proje
  Bütçesi **var**. Fatura ekranında müşteri seçimi çalışıyor.
- Bildirim zili ve görev konsolu açılış süresi.
- Sekme düzeni: Görevler, bir projenin detayı ve Finans ekranlarında sekmeler aynı
  davranıyor mu; proje detayında takvim/gösterge/galeri/belgeler panoları açılıyor mu;
  telefonda sekme şeridi taşmıyor mu.
- **Kontrol listesine proje maddesi ekle** — `TaskScopeAndFinanceIndexes` kolonunu (`ProjectId`,
  boş `TaskId`) canlıda ilk kez kullanan akış; kaydedip sayfayı yenileyince madde yerinde durmalı.
- Görevler ekranında Finans sekmesi; bir gider kaydının bağlantısını değiştirme.
- **Kart Panosu:** dört yoğunluk, Görünüm menüsünden alan aç/kapa, kart ⋯ menüsünde
  taşı/ata/sil, boş kolon rayı; Görevler filtre çubuğunda ＋ Filtre → etiket → ✕.
- **Görevler ＋ menüsü:** Belgeler / Formlar / Kontrol Listesi / Bağımlılıklar panelleri tüm projelerle.
- **Hibe (kiracı):** Hibeler › Bugün; kartların üç sekmesi; bir çağrıyı takibe alıp **not yaz**
  (`GrantBookmarkNote` kolonunun ilk kullanımı); ilgi bildir → bütçe/ortak/başlangıç alanları →
  **geri çek** (`GrantInterestProposal` kolonlarının ilk kullanımı); telefonda katalog ve
  Başvurularım satırları kart. Evrak Takibi'nde evrak ekleme, Red ve İtiraz'da madde ekleme,
  Uygulama ve Tahsilat'ta rapor ekleme düğmeleri iş yapıyor mu; durum seçimi açılır liste mi.
- **Hibe (host):** Bugün gelen kutusu; parametre formunda şart kartları ve "Metindeki değere dön";
  yeni bir ilgi talebinde host'a bildirim geliyor mu (`InterestReceived` şablonu).
- **Geri Bildirim:** sağ üstten bir kayıt gönder → hata vermemeli. `AppFeedbacks` tablosunun son
  kayıt tarihi, bozukluğun canlıda ne zamandır sürdüğünü gösterir.
- **Dokümanlar:** süreç şeridi yedi ekranda; bir adıma tıklayınca proje korunuyor mu; rapor
  derleyicide Taslak kaydet → Teslimler'de taslak paket; "Üret ve teslime geç" paketi açık
  getiriyor mu; telefonda Belge yakala düğmesi ekranın altında sabit mi.
- Kayıt talebi sihirbazı: paket kartlarında bedel (`/PackageManagement`'ta bedeli girilmemiş
  pakette "Bedel görüşmede paylaşılır").
- Sürüm notu penceresi: onaydan **önce** kullanıcıda çıkmamalı, onaydan **sonra** çıkmalı.

## Paket doğrulaması

2026-09-14'te **ZIP'lerin kendisinden** ölçüldü (publish klasöründen değil):

| Denetim | Sonuç |
|---|---|
| ZIP'ler | `Apya-Yayin-366408de.zip` 115,2 MB · **4164 girdi** · `Apya-DbMigrator-366408de.zip` 53,1 MB · **454 girdi** · ikisinde de ters slash **0** |
| Self-contained | İki ZIP'in kökünde `System.Private.CoreLib.dll`, `coreclr.dll`, `hostfxr.dll` var |
| Kök dosyalar | Web: `web.config`, `Apya.Platform.Web.exe` · DbMigrator: `Apya.Platform.DbMigrator.exe`, `migrate.bat`, `appsettings.json` |
| `web.config` | Yorumlar ayıklanınca tek `<aspNetCore>` etiketi kalıyor: `processPath=".\Apya.Platform.Web.exe"` · `hostingModel="OutOfProcess"`. Betiğin "InProcess" uyarısı yorum satırına takılan bilinen yanlış alarm. |
| Sırlar | `appsettings.secrets.json`, `*.pfx`, `App_Data/`, `Logs/` **yok** — tek eşleşme `Microsoft.Extensions.Configuration.UserSecrets.dll` |
| İstemci | `wwwroot/libs/signalr/signalr.min.js` ve `wwwroot/js/.vite/manifest.json` pakette |
| Commit | `Apya.Platform.Web.dll` ve `Apya.Platform.DbMigrator.dll` içinde `+366408de2f0b…` gömülü |
| Migration | 7 migration kimliği hem web hem DbMigrator paketindeki `Apya.Platform.EntityFrameworkCore.SqlServer.dll`'de; DLL'deki son kimlik `20260914082238_GrantBookmarkNote` (toplam 67) |
| Sürüm notu | `Apya.Platform.Application.Contracts.dll`: `2026.09.07` 12/12 · `2026.09.10` 8/8 · `2026.09.11` 12/12 madde, üç başlık da var |
| Statik dosyalar | `wwwroot/js` (74), `wwwroot/css` (7) ve `Pages` altındaki 79 js/css dosyası commit'tekiyle **birebir aynı**; pakette fazladan yalnız `.gz` / `.br` sıkıştırılmış kopyaları var |
| DbMigrator | 441 dosya · 410 DLL · 13 dil klasörü · 148 MB (09-06 ve 09-11 paketleriyle aynı yapı) |
| DbMigrator denemesi | ZIP'ten açılan kopyanın yanına sahte `appsettings.secrets.json` (`127.0.0.1,9`) kondu, `migrate.bat`'taki gibi `ClientSecret` argümanıyla koşturuldu → `Starting DbMigrator` → `Started database migrations` → `Migrating database schema...` satırlarına geldi, **yalnız TCP bağlantısında** düştü; assembly yükleme hatası 0. Çıkış kodu yine **0** — başarının log'dan doğrulanmasının sebebi bu. |

Karşı kontrol: aynı denetim `10a34d6e` paketinde iki yeni migration'ı ve `2026.09.11` notunu **yok** gösterdi.

## Test

2026-09-14, paketin commit'i `366408de` üzerinde. .NET ve vitest **ardışık** koştu; Web.Tests tek
süreçte 9 GB'ı aştığı için sınıf öbekleri hâlinde, her öbek ayrı süreçte:

| Takım | Sonuç |
|---|---|
| `Apya.Platform.Domain.Tests` | 334 / 334 ✅ |
| `Apya.Platform.Application.Tests` | 269 / 269 ✅ |
| `Apya.Platform.EntityFrameworkCore.Tests` | 336 / 336 ✅ |
| `Apya.Platform.Web.Tests` (12 öbek) | 525 / 525 ✅ — `--list-tests` 525 = koşan 525, öbekler hiçbir sınıfı atlamadı |
| Vitest (`dynamic-assets`) | 82 dosya · 763 / 763 ✅ |

**Toplam 2227 test, 0 hata.** `npm run build` demeti yeniden üretti, `git status` boş kaldı —
commit'teki demet kaynağın birebir çıktısı.

## Bilinen sınır

- İndeks turunun tek seferlik **REBUILD** adımı bu pakete dâhil değil, ayrı iş.
- #354 yalnız ölçer; giriş POST yavaşlığı (ort. ~2 sn, %72'si kiracı arama döngüsünde)
  bu paketle düzelmez.
- Hibe "Bugün" menüde ilk giriş oldu ama konsollar yerinde; "konsollar ikinci katmana iner"
  kabuk kararı verilmedi.
- Doküman ekranlarının yeni şeridi ve rapor derleyici akışı oturum açılmış gerçek uygulamada
  denenmedi (sahte veriyle tarayıcıda doğrulandı) — deploy sonrası QA'da ilk kez görülecek.
- Açık PR #394 (hibe program afişi, `GrantPoster` çift migration) pakette **yok**.
