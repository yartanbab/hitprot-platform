# Deploy delta — 2026-09-14 (`e1f93653` → `d5e84c04`)

> ✅ **Bu paket canlıya İNDİ — 2026-09-14, 20:40 ile 23:18 arasında.** 23:18'de aynı beş dosya yeniden
> ölçüldü: `css/apya-shell.css` `ce7baefa`, `js/apya-kanban.js` `42634812`, `js/documents.js`
> `9e775717`, `Pages/Projects/Index.js` `65e03b13`, `Pages/Account/Protokol.js` `09726f2c` — beşi de
> main `a9012b56` (= `d5e84c04`'ün `src/` ağacı) ile birebir; 09-07 sonrası chunk
> `js/QueryProvider-B4436sFh.js` artık **200**, `Pages/Grants/Journey.js`, `InterestReview.js`,
> `Funnel.js` **200**, `/Hibeler` **200**, `/health/ready` **200** (0,07 sn). DbMigrator'ın koşup
> koşmadığı dışarıdan ölçülemez: `dbmigrator\Logs\logs.txt` sonundaki "Successfully completed"
> satırına bakılmalı; `/Admin/ReleaseNotes` onayı (43 madde) da sunucuda yapılacak iş.
>
> 🔴 **Bu paketle canlıya bir hata da indi:** `wwwroot/libs/jquery/jquery.js` **4.0.0** (install-libs
> böyle kopyalıyor, canlıda da 4.0.0) `$.trim`'i kaldırmıştır; `Pages/Grants/Detail.js` ("Evet,
> ilgileniyorum") ve `Pages/Grants/Tenant.js` (takip notu kaydet) bu çağrıyla gönderimde `TypeError`
> verir, düğme sessizce hiçbir şey yapmaz. Düzeltme ve dokuz soruluk ilgi formu bir sonraki pakette:
> `deploy-delta-2026-09-14-3.md` (`337eaf55`).

Canlıda koşan kod (bu paket üretilirken) **`e1f93653`** + tek dosyalık protokol yaması (`5411a19d`).
Bu paket ikisinin de üzerine geldi.

Paket: `Apya-Yayin-d5e84c04.zip` + `Apya-DbMigrator-d5e84c04.zip`
(`Masaüstü\Apya-Yayin-2026-09-14-2\`).

> Paket `claude/yayin-2026-09-14-2` dalındaki **`d5e84c04`** commit'inden üretildi: main
> `d83038a5` + yayın öncesi tam test koşusunda düşen iki yerelleştirme testinin düzeltmesi
> (altı `DisplayName` anahtarı, yalnız `tr.json`/`en.json`). Dal squash ile girdiğinde commit
> kimliği değişir; main o ana kadar ilerlemediyse ağaç birebir aynıdır, paket yeniden üretilmez.
>
> Bu paketten önce dört paket üretildi, **hiçbiri yüklenmedi**: `b2b15129` (2026-09-09),
> `c70cef19` ve `10a34d6e` (2026-09-11), `366408de` (2026-09-14 öğlen). Sonuncusu hibe ve
> Formlar turunun on üç PR'ı main'e girince geride kaldı. Dördünün de içeriği burada eksiksiz
> var; eski paketlerin dosyaları artık kullanılmamalı (`Masaüstü\Apya-Yayin-2026-09-11\` ve
> `Masaüstü\Apya-Yayin-2026-09-14\` klasörleri silinebilir).

## Taban nasıl ölçüldü — 2026-09-14

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

Aynı beş dosya bu paket üretilmeden önce (20:40) **yeniden ölçüldü**: blob'ların hepsi aynı, 09-07
sonrası chunk'lar hâlâ **302**, `/health/ready` **200** (0,05 sn, havuz sıcak). `366408de` yüklenmemiş.

🔑 Sonuç 2026-09-07 ölçümüyle aynı: gövde `e1f93653`, protokol dosyası yamalı.
Tek dosyaya bakan bir ölçüm bu turda da yanlış cevap verirdi — sürüm tespitini her zaman
birden çok dosyada yap.

## Ne iniyor

**56 commit** — 55'i main'de (PR #349 → #406), sonuncusu bu paketin yerelleştirme düzeltmesi.
Müşterinin göreceği başlıklar:

| Alan | Değişiklik |
|---|---|
| Muhasebe | Cari kartı, cari ekstre, mizan ve yıl sonu kur değerlemesi ekranları **menüden kaldırıldı** (#356). Kayıtlar ve tablolar duruyor, silinmedi. Proje formundaki "Cari (Müşteri)" alanı ve proje listesindeki "Müşteri" sütunu da kalktı. Fatura ekranındaki müşteri seçimi **değişmedi**. |
| Genel Bakış | "Özet Raporlar" ekranı kaldırıldı, `/Reports` → Genel Bakış'a yönleniyor (#364). Yerine "Efor dağılımı" kartı ve İstatistikler bandında "Kaydedilen efor" kutucuğu geldi. |
| Kabuk | Avatar menüsü yenilendi: kimlik bloğu + "Profil" / "Görünüm" sekmeleri; dil, açık/koyu tema ve yoğunluk menüden değiştiriliyor (#357). |
| Hata yönetimi | PUT/AJAX isteklerinde `/Error` yönlendirme döngüsü giderildi; kaydedilemeyen değişiklikler artık kullanıcıya bildiriliyor, teknik kod yerine Türkçe mesaj çıkıyor (#355). |
| Kayıt akışı | Aynı e-posta ile ikinci hesap açılması dört noktada engellendi (#363). Kayıt talebi sihirbazının paket kartları yıllık bedeli gösteriyor; bedeli girilmemiş pakette "Bedel görüşmede paylaşılır" (#386, kamuya açık sayfa). Protokol onay kutuları düzeltmesi (#360) zaten canlıda yamalı, pakete de girdi. |
| Kurum Profili | Avatar menüsünde kurum adına tıklayınca yeni **Kurum Profili** ekranı: resmî unvan, kurum türü, vergi bilgileri, çalışan sayısı, adres, yetkili ve operasyonel kişiler; yanında paket, protokol, kullanıcı sayısı. Bilgiler kayıt başvurusundaki değerlerle dolu gelir (migration aşağıda), kurum yöneticisi düzenler. Hibe kurum profili hiç kaydedilmemişse bu bilgilerle ön doluyor; fatura ve pano çıktılarında resmî unvan (#396, #397). |
| Sekme düzeni | Görevler, projeler ve finans ekranlarında sekmeler tek ortak düzende çalışıyor (#371–#373). Proje detayına yeni panolar geldi: takvim, gösterge, galeri, belgeler ve fazlası. Görev penceresinde özellik ekleme tek menüye indi; telefonda sekme şeridi rahatladı. |
| Proje kapsamı & finans | Kontrol listesine artık **proje** maddeleri de eklenebiliyor (migration aşağıda). Proje finansında görev harcamaları tablosu; Görevler ekranında tüm projelerin giderlerini tek yerde gösteren Finans sekmesi; gider kaydının bağlantısı sonradan değiştirilebiliyor (#374, #375). |
| Görevler | **Kart Panosu v2:** dört yoğunluk (Kart, Kompakt, Liste, Başlık), kartta görünecek alanlar Görünüm menüsünden seçiliyor ve hesapta saklanıyor; kart eylemleri ⋯ menüsünde, boş kolonlar ince şeride daralıyor (#378, #382). Filtre çubuğunda yalnız etkin filtreler etiket olarak duruyor, yenisi ＋ Filtre ile ekleniyor (#381). Belgeler / Formlar / Kontrol Listesi / Bağımlılıklar panelleri Görevler ekranında tüm projeleri kapsayan kipte (#383). |
| Hibe | **Bugün** ekranı — kiracıda sıradaki işler risk × tutar sırasıyla, host'ta gelen kutusu; menüde hibe grubunun ilk girişi (#390). Kiracı kartları üç sekmeye indi, takip edilen çağrıya not yazılabiliyor, Başvurularım'da gösterge kartları yerine durum cümleleri (#391). İlgi bildiriminde onay adımı, proje fikri (bütçe, ortak, başlangıç) ve geri çekme; host'a hiç gitmeyen "yeni ilgi" bildirimi düzeltildi (#388). Host parametre formunda şart kartları, "nereden geldi" ve çelişki eylemleri (#389). 15 satır tablosu 992 px altında karta dönüşüyor (#385). Evrak Takibi, Red ve İtiraz, Uygulama ve Tahsilat ekranlarında tıklanınca hiçbir şey yapmayan ekleme diyalogları ve açılır liste yerine boş metin kutusu gösteren durum seçimleri düzeltildi (#366). **Bu turun eki:** kiracı kartlarında program afişi, host parametre formunda afiş yükleme (#394). Kiracıda **Hibe Yolculuğum** — bütün hibe ilişkileri çağrı başına tek satırda, toplam onaylanan destek (#399). Yanıt bekleyen talepte **görüşme saati önerme**: firma üç saat önerir, danışman inceleme ekranında birini onaylar ya da notla başka saat ister, iki tarafa bildirim (#405). Host çağrıyı kapatınca bekleyen talepler "Kaçırıldı" (kiracıda "Çağrı kapandı") olur, yarım kalan firmaya benzer iki açık çağrıyla tek bildirim gider (#400). Host'a özel: danışman ilgi inceleme ekranı — iç not, devret, firma kartı, ortak önerisi (#398); çağrı **dönüşüm hunisi** `/Grants/Funnel`, görüntülenme sayımı pargetto ve platform detay sayfalarında (#404). |
| Dokümanlar | Süreç şeridi (Belgeler → Uygunluk → Derle → Teslim) yedi ekranda, sağda bağlama göre "Sırada: …" ipucu; başlıkta tek birincil düğme, ikincil eylemler ⋯ menüsünde; rapor derleyicide Taslak kaydet · Önizle · Üret ve teslime geç (#392). Aynı PR'da canlıdaki dört kusur da düzeldi: uygunluk kartı Uygunluk sekmesi açılana kadar boş kalıyordu, telefonda Belge yakala düğmesi sayfanın en altına düşüyordu, belge detayındaki paket bağlantısı paketi açmıyordu, rapor derleyicinin etkin sekmesi vurgulanmıyordu. |
| Formlar | Kiracının herkese açık form bağlantısı oturumsuz ziyaretçiye **açılmıyordu** — bağlantı artık formun kiracısını taşıyor (`?tenant=`); daha önce paylaşılmış bağlantılar yeniden kopyalanmalı. Host formunu oturum açmış kiracı kullanıcısı doldurabiliyor, yanıt kendi kiracısına yazılıyor; host yanıtları firma adıyla görüyor (#402). Yayındaki formu düzenleyip kaydetmek eski yanıtları sorularından koparıyordu; form webhook'ları kiracı aboneliğini bulamayıp hiç gönderilmiyordu — ikisi de düzeldi (#401). Açılır liste "Yayındaki hibeler" canlı listesine bağlanabiliyor, bağlantıdaki `?grant=` çağrıyı ön seçiyor (#403). |
| Geri bildirim | SQL Server'da gönderim her seferinde 500 veriyordu — takip numarası sorgusu (#387). Canlı SQL Server olduğu için müşteriler büyük ihtimalle bugüne kadar gönderemedi. |
| Hız | Bildirim zili/listesi, görev konsolu, proje belge listesi ve finans toplamları için indeksler (#359, #361, #362). |
| Veri bütünlüğü | Filtresiz UNIQUE indeksler soft-delete satırının anahtarını kalıcı rezerve ediyordu; 14 indeks yeniden kuruldu, 7'si `IsDeleted = 0` filtresi aldı (#353). SQL Server'da sıralı GUID sağlayıcısı düzeltildi (#352). |
| Giriş | Yavaş giriş POST'unu fazlara ayıran **ölçüm** — yalnız log, davranış değişmez (#354). |
| Sürüm notu | `2026.09.07` **12** madde (#358, #364, #355, #365, #367, #377) · `2026.09.10` **8** madde (#376) · `2026.09.11` **12** madde (#384, #388, #393 ve bu paketin commit'i). · `2026.09.14` **11** madde (#397 Kurum Profili 3 + #406 hibe ve Formlar 8). Host'a özel #398 ve #404 nota girmedi. |

## Migration — 12 adet, **hiçbiri veri düşürmüyor**

```
20260906194546_SoftDeleteAwareUniqueIndexes
20260906201249_HotPathIndexesShellAndTasks
20260906203048_FinanceCoveringIndexes
20260907094533_NotificationAndDocumentIndexes
20260910124932_TaskScopeAndFinanceIndexes      (#374)
20260913212218_GrantInterestProposal           (#388)
20260914082238_GrantBookmarkNote               (#391)
20260914085403_AddTenantProfileLegalIdentity   ← YENİ (#396)
20260914091407_GrantPoster                     ← YENİ (#394)
20260914115716_GrantInterestReview             ← YENİ (#398)
20260914153143_GrantCallDailyStats             ← YENİ (#404)
20260914160415_GrantMeetingProposals           ← YENİ (#405)
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

🔑 **`GrantInterestProposal` ve `GrantBookmarkNote`'un `Up()`'u yalnız nullable `AddColumn`** — iki sağlayıcıda da ölçüldü:

| Migration | Tablo | Eklenen kolonlar (hepsi nullable) |
|---|---|---|
| `GrantInterestProposal` | `AppGrantInterests` | `EstimatedBudget` decimal(18,2) · `NeedsPartner` bit · `PartnerName` nvarchar(200) · `TargetStartDate` datetime2 · `WithdrawnAt` datetime2 |
| `GrantBookmarkNote` | `AppGrantBookmarks` | `MarkedByUserId` uniqueidentifier · `Note` nvarchar(500) |

Mevcut satırlar olduğu gibi kalır; deploy öncesi tablo CSV'si almak gerekmiyor.

🔑 **Bu turun beş migration'ı** — `Up()` iki sağlayıcıda da ölçüldü; `DropColumn`, `DropTable`,
`RenameColumn` ve `AlterColumn` yok:

| Migration | İşlem | Etkisi |
|---|---|---|
| `AddTenantProfileLegalIdentity` | `AppTenantProfiles` +4 kolon: `LegalName` nvarchar(200), `LegalRepresentativeTitle` nvarchar(100), `LegalRepresentativeEmail` nvarchar(256) — üçü NOT NULL, varsayılan `''` · `EmployeeCount` int NULL. Ardından **tek `UPDATE`**: yeni dört kolon `AppRegistrationRequests`'teki şirket adı, yetkili unvanı, e-posta ve çalışan sayısıyla doldurulur (`TenantId` eşleşmesi). | Yalnız **yeni kolonlara** yazar; mevcut kolonlara dokunmaz. Hedef boyları kaynakla aynı sabitten gelir, taşma yok. Kayıt talebi olmayan kiracıda kolonlar boş kalır. |
| `GrantPoster` | `AppGrants.PosterFileName` nvarchar(256) NULL | Yalnız ekleme |
| `GrantInterestReview` | `AppGrantInterests` +`AssignedUserId` uniqueidentifier NULL, +`ConsultantNote` nvarchar(2000) NULL | Yalnız ekleme |
| `GrantCallDailyStats` | Yeni tablo `AppGrantCallDailyStats` + tekil indeks `(GrantCallId, Day, Kind)` | Boş başlar; ilk satır çağrı detayı açılınca yazılır |
| `GrantMeetingProposals` | Yeni tablo `AppGrantMeetingProposals` + indeks `(GrantInterestId, Status)`, `AppGrantInterests`'e FK (cascade) | Boş başlar |

🔴 **Geri alma uyarısı:** `TaskScopeAndFinanceIndexes`'in `Down()`'u `TaskId`'yi
tekrar NOT NULL yapar. Deploy sonrası bir kullanıcı **proje maddesi** eklerse
(`TaskId` boş satır) geri alma o satırda düşer. Geri dönüş planı **sunucu yedeği**
olmalı, migration'ı geri sarmak değil.

`SoftDeleteAwareUniqueIndexes` mevcut UNIQUE indeksleri düşürüp filtreli hâlde
yeniden kuruyor. Bu, tabloda **halihazırda mükerrer canlı satır varsa** düşer —
migration sırasında hata alınırsa sebebi budur, veri kaybı değil.

## Tohumlama — DbMigrator ŞART

`dotnet ef database update` **yetmez**: şema uygular, tohumlamayı çalıştırmaz.

- **Dört yeni hibe bildirim şablonu:** `GrantNotificationTemplateDataSeedContributor` host kataloğunda
  eksik tetikleyicinin şablonunu ekler — `InterestReceived` (#388, host'a "yeni ilgi"), `CallClosed`
  (#400, yarım kalan firmaya), `MeetingProposed` (#405, host'a) ve `MeetingAnswered` (#405, firmaya).
  Şablon yoksa bildirim **sessizce gitmez**. Host'un düzenlediği mevcut şablonlara dokunmaz.
- Yeni izin yok: "Bugün", Hibe Yolculuğum ve görüşme `Grants.Default`; inceleme ekranı ve huni `Grants.Edit`;
  Kurum Profili mevcut kapıları kullanır (`e1f93653..d5e84c04` izin dosyalarında fark **0**).

🔴 **Yeni sürüm notu maddeleri VARSAYILAN OLARAK KAPALIDIR.** `ReleaseNotePublicationDataSeedContributor`
yalnız tablo tamamen boşsa çalışır; canlıda tablo 2026-09-06 paketiyle doldu. `2026.09.07` (12),
`2026.09.10` (8), `2026.09.11` (12) ve `2026.09.14` (11) — **43 madde** host `/Admin/ReleaseNotes`
ekranından onaylanana kadar kullanıcıya gitmez, yalnız host'a "Onay bekliyor" rozetiyle görünür.

## Deploy adımları

1. Yedek al (DB + site kökü).
2. Korunacak dosyaları FileZilla filtresine ekle — `appsettings.secrets.json`,
   `openiddict.pfx`, `App_Data/uploads/*`, `App_Data/DataProtection-Keys/*`, `Logs/*`.
3. Web paketini site köküne aç (`App_offline.htm` ile havuzu düşürmek DLL kilidini önler).
4. `dbmigrator` klasörünü yükle, **sunucudaki `appsettings.secrets.json`'ı içine kopyala**
   (yoksa araç localhost'a bağlanmaya çalışır). Dosyadaki anahtar **`ConnectionStrings:SqlServer`**
   olmalı: başka adla yazılırsa araç hata vermeden `appsettings.json`'daki localhost bağlantısına düşer.
5. Plesk › Zamanlanmış Görevler › `migrate.bat` → "Şimdi Çalıştır".
6. Sonucu **çıkış kodundan değil** `dbmigrator\Logs\logs.txt` dosyasındaki
   `Successfully completed all database migrations.` satırından doğrula
   (12 migration birkaç saniyede bittiyse hiçbir şey koşmamıştır).
7. Zamanlanmış görevi **SİL** (varsayılan "Günlük 00:00" — yoksa her gece koşar);
   `dbmigrator` klasörünü de sil (ClientSecret düz metin kalır).
8. App pool geri dönüşümü.
9. `/Admin/ReleaseNotes` → `2026.09.07`, `2026.09.10`, `2026.09.11` ve `2026.09.14` maddelerini (43) onayla.
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
- **Kurum Profili:** avatar menüsünde kurum adı → ekran açılıyor, alanlar kayıt başvurusundan dolu mu
  (`AddTenantProfileLegalIdentity` geri doldurması); Düzenle → kaydet → yenile; fatura yazdırmada resmî unvan.
- **Hibe afişi:** host parametre formunda afiş yükle (`GrantPoster` kolonunun ilk kullanımı); kiracı kartında
  görünüyor mu; afişsiz programda kurum renginde zemin.
- **Hibe Yolculuğum (kiracı):** menüde var mı, satırlar ve toplam destek; bekleyen talepte **Görüşme saati
  öner** → üç saat → gönder (`AppGrantMeetingProposals`'a ilk yazım, host'a `MeetingProposed` bildirimi).
- **İlgi inceleme (host):** İlgi Talepleri'nden bir talebi aç; iç not kaydet ve devret
  (`GrantInterestReview` kolonları); Ön görüşme kartında saati onayla → firmaya `MeetingAnswered` bildirimi,
  talep incelemeye geçmeli.
- **Çağrı kapanışı:** test çağrısını Kapandı yap → bekleyen talep "Kaçırıldı", firmaya tek `CallClosed` bildirimi.
- **Dönüşüm hunisi (host):** pargetto'da bir çağrı detayını aç, sonra `/Grants/Funnel`'da görüntülenme 1
  artmış mı (`AppGrantCallDailyStats`'a ilk yazım).
- **Formlar:** kiracıda bir formu yayınla, bağlantıyı **oturumsuz** tarayıcıda aç (`?tenant=`) ve gönder; yanıt
  ekranında görünmeli. Yayındaki formun bir sorusunu düzenleyip kaydet → eski yanıt sorusuyla eşleşmeye devam
  etmeli. Webhook tanımlı formda yanıt → teslim geçmişinde kayıt. Açılır listede "Yayındaki hibeler".
- Sürüm notu penceresi: onaydan **önce** kullanıcıda çıkmamalı, onaydan **sonra** çıkmalı.

## Paket doğrulaması

2026-09-14 akşam **ZIP'lerin kendisinden** ölçüldü (publish klasöründen değil):

| Denetim | Sonuç |
|---|---|
| ZIP'ler | `Apya-Yayin-d5e84c04.zip` 115,5 MB · **4189 girdi** · `Apya-DbMigrator-d5e84c04.zip` 53,4 MB · **454 girdi** · ikisinde de ters slash **0** |
| Self-contained | İki ZIP'in kökünde `System.Private.CoreLib.dll`, `coreclr.dll`, `hostfxr.dll` var |
| Kök dosyalar | Web: `web.config`, `Apya.Platform.Web.exe` · DbMigrator: `Apya.Platform.DbMigrator.exe`, `migrate.bat`, `appsettings.json` |
| `web.config` | Yorumlar ayıklanınca tek `<aspNetCore>` etiketi kalıyor: `processPath=".\Apya.Platform.Web.exe"` · `hostingModel="OutOfProcess"`. Betiğin "InProcess" uyarısı yorum satırına takılan bilinen yanlış alarm. |
| Sırlar | `appsettings.secrets.json`, `*.pfx`, `App_Data/`, `Logs/` iki pakette de **yok** |
| İstemci | `wwwroot/libs/signalr/signalr.min.js` ve `wwwroot/js/.vite/manifest.json` pakette |
| Commit | `Apya.Platform.Web.dll` ve `Apya.Platform.DbMigrator.dll` içinde `+d5e84c04ed18…` gömülü |
| Migration | Canlıya göre yeni **12** migration kimliği hem web hem DbMigrator paketindeki `Apya.Platform.EntityFrameworkCore.SqlServer.dll`'de; toplam 72/72, son kimlik `20260914160415_GrantMeetingProposals` |
| Sürüm notu | `Apya.Platform.Application.Contracts.dll`: `2026.09.07` 12/12 · `2026.09.10` 8/8 · `2026.09.11` 12/12 · `2026.09.14` 11/11 madde başlığı |
| Yerelleştirme | `Apya.Platform.Domain.Shared.dll` gömülü JSON'da bu turun anahtarları var (`DisplayName:SlotIndex`, `DisplayName:LegalName`, `Grants:Notify:Trigger:MeetingProposed:Name`, `Menu:Grants:Funnel`) |
| Statik dosyalar | `wwwroot/js`, `wwwroot/css` ve `Pages` altındaki **168** js/css dosyası commit'tekiyle **birebir aynı** (blob karşılaştırması) |
| DbMigrator | 441 dosya (09-06, 09-11 ve öğlen paketiyle aynı yapı) |
| DbMigrator denemesi | ZIP'ten açılan kopyanın yanına sahte `appsettings.secrets.json` (`ConnectionStrings:SqlServer` = `127.0.0.1,9`) kondu, `migrate.bat`'taki gibi `ClientSecret` argümanıyla koşturuldu → `Starting DbMigrator` → `Started database migrations` → `Migrating database schema...` satırlarına geldi, **yalnız TCP bağlantısında** düştü; assembly yükleme hatası 0. Çıkış kodu yine **0** — başarının log'dan doğrulanmasının sebebi bu. |
| Uçtan uca | Denemenin ilk koşusunda sahte dosyadaki anahtar yanlış (`Default`) yazıldı; araç hata vermeden `appsettings.json`'daki yerel SQL Server'a bağlandı ve **geliştirme veritabanında** koştu: `Executing data seeders...` → `Successfully completed all database migrations.` (15 sn). Yerelde `AppGrantCallDailyStats` ve `AppGrantMeetingProposals` o anda oluştu, `CallClosed` / `MeetingProposed` / `MeetingAnswered` şablonları tohumlandı; OpenIddict istemcilerine dokunulmadı. Paketin migration + tohumlama zincirinin gerçek SQL Server'da çalıştığının kanıtı, ama aynı zamanda adım 4'teki anahtar uyarısının sebebi. |

Karşı kontrol: aynı denetim öğlenki `366408de` paketinde commit kimliğini **yok**, yeni migration'ları
**7/12**, `2026.09.14` notunu **0/11**, bu turun yerelleştirme anahtarlarını **yok** ve 26 statik dosyayı
farklı ya da eksik gösterdi — denetim ayırt ediyor.

## Test

2026-09-14 akşam, main `d83038a5` üzerinde tam koşu; iki test düştü, düzeltme `d5e84c04`'te. .NET ve
vitest **ardışık** koştu; Web.Tests sınıf öbekleri hâlinde (altışar sınıf, 12 öbek), her öbek ayrı süreçte:

| Takım | Sonuç |
|---|---|
| `Apya.Platform.Domain.Tests` | 339 / 339 ✅ |
| `Apya.Platform.Application.Tests` | 269 / 269 ✅ |
| `Apya.Platform.EntityFrameworkCore.Tests` | 376 / 376 ✅ |
| `Apya.Platform.Web.Tests` (12 öbek) | 548 / 550 ilk koşu → düzeltme sonrası düşen öbek ve yerelleştirme testleri 33 / 33 ✅ — `--list-tests` 550 = öbeklerde koşan 550 |
| Vitest (`dynamic-assets`) | 84 dosya · 777 / 777 ✅ |

**Toplam 2311 test, 0 hata** (düzeltme sonrası). `npm run build` demeti yeniden üretti, içerik farkı **0**
(yalnız satır sonu hayaleti) — commit'teki demet kaynağın birebir çıktısı.

🔴 **Yakalanan hata:** `ValidationLocalization_Tests` iki testi düştü. #396 (Kurum Profili) ve #405 (görüşme)
doğrulama özniteliği taşıyan ya da formda basılan altı alana Türkçe `DisplayName` karşılığı eklememişti;
doğrulama mesajı İngilizce özellik adıyla çıkardı ("LegalName boş bırakılamaz"). İki PR da web testlerini
filtreli öbeklerle koşturduğu için kaçmıştı — tam koşunun değeri bu.

## Bilinen sınır

- İndeks turunun tek seferlik **REBUILD** adımı bu pakete dâhil değil, ayrı iş.
- #354 yalnız ölçer; giriş POST yavaşlığı (ort. ~2 sn, %72'si kiracı arama döngüsünde)
  bu paketle düzelmez.
- Hibe "Bugün" menüde ilk giriş oldu ama konsollar yerinde; "konsollar ikinci katmana iner"
  kabuk kararı verilmedi.
- Doküman ekranlarının şeridi, hibe inceleme/huni/görüşme ekranları ve Formlar'ın kiracı bağlantısı oturum
  açılmış gerçek uygulamada denenmedi (sunucu çıktısı + sahte API ile tarayıcıda doğrulandı) — deploy sonrası
  QA'da ilk kez görülecek.
- Önceden paylaşılmış kiracı form bağlantıları (`?tenant=` taşımayan) açılmamaya devam eder; sürüm notu
  müşteriye yeniden kopyalamasını söylüyor.
- Görüşme onayında takvim daveti gönderilmez; iki taraf yalnız uygulama içi bildirim alır.
- Dönüşüm hunisinin görüntülenme sayımı bu paketle başlar; önceki günler sıfır görünür.
- Hibe tasarımının tur 16-17'si (veri kaynakları kataloğu, yanıt → kayıt eşleme, koşullu alanlar) yok.
