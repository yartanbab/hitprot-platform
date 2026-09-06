# Deploy delta — 2026-09-06 (`ece0755a` → `main`)

> **Hedef SHA bilerek başlıkta değil.** Bu belgenin kendi commit'i `main`'i ilerlettiği için
> buraya yazılan her SHA yazıldığı anda bayatlar. Paketin üretildiği tam commit, ZIP adında
> (`Apya-Yayin-<sha>.zip`) yazılıdır — tek doğru kaynak orasıdır.

**40 commit · PR #309 → #348 · 8 migration (çift sağlayıcı).**

---

## 🔴 TABAN DEĞİŞTİ — 2026-09-02 paketi canlıya İNDİ

Önceki altı delta belgesi tabanı `63cb35c6` (2026-08-27) alıyordu, çünkü 08-31, 09-01 ve
09-02 paketlerinin hiçbiri uygulanmamıştı. **Bu artık geçerli değil.** 2026-09-06'da
dışarıdan ölçüldü:

| Ölçüm | Sonuç |
|---|---|
| `/health/ready` | **200** (15,4 sn — soğuk başlangıç) |
| `/` | **302** (girişe yönlendirme — normal) |
| `/libs/signalr/signalr.min.js` | **200** |
| `/Pages/Grants/Tenant.js` | **200** — hibe modülü canlıda, `63cb35c6`'da bu dosya YOKTU |

Sürüm kanıtı **blob eşleştirmeyle** kapatıldı (bkz. `project-production-deployment`
reçetesi, 3. madde): canlıdan indirilen `Pages/Grants/Tenant.js`'in `git hash-object`
değeri `a43d311361`, bu **`ece0755a` ağacındaki blob ile birebir aynı** —
`63cb35c6`'daki (`f06c90f96f`) ve bugünkü `main`'deki (`998bd81b26`) blob'larla
tutmuyor. `Pages/Tasks/index.js` de aynı sonucu veriyor.

Yani canlı kod **`ece0755a`**, şema da 2026-09-03'te koşan DbMigrator ile aynı seviyede
(21 migration + üç veri tohumu uygulanmıştı). Bu paketin taşıdığı yük buradan itibaren
ölçülüyor: **40 commit, 8 migration** — 09-02 belgesindeki 33 commit / 21 migration
**tekrar uygulanmayacak**.

Ayrıca 09-02 belgesinin "Adım 0"ı (503 → `hostingModel` düzeltmesi + havuzu başlatma)
**kapandı**: site ayakta ve `OutOfProcess` paketiyle çalışıyor. Bu deploy'da Adım 0 yok.

---

## Ne iniyor

| Alan | İş |
|---|---|
| Görevler | Görev finansı (#334 gider/gelir + bütçe bağı, #335 fatura, #336 evrak), göreve form bağlama (#329, misafir doldurması dâhil), özellik kataloğu gerçek modüllerle sınırlandı + yedi yeni görünüm (#326), özellik modalı tek listeye indi (#333), mobil üst şerit + FAB (#330), dosya/görsel listeleri sürükle-bırak kutusunun üstüne alındı |
| Hibe | "Başvuru Aç" yerine "İlgileniyorum" akışı (#327), dernek/vakıf/kulüp profil formu (#339), boş sonuçta kalkmayan iskelet + üst üste binen son tarih etiketleri (#309), okunabilirlik ölçeği (#310), rozet dili (#320) |
| Finans | Bütçe rakamı tek kaynağa indi (#311), projeden bütçe/finans/belge geçişi (#319), menüde "Finans & Bütçe" tek çatı (#315), tutar/kur/oran maskesi (#318, #321, #324) |
| Genel | Genel Bakış baskı çıktısı (#337), Takvim menüde kök başlık + Panolar görev konsolu görünüşleri (#341 · **#344** taşımayı gerçekten uygular), takvim Google/Outlook entegrasyonu düzeltmesi (#317), form textarea (#314), proje tarih alanları (#312), proje modalı finans izni (#316), mobil Genel Bakış (#323), doğrulama mesajlarında üç alanın Türkçe adı |
| Kayıt & abonelik (#342) | Demo talebi yerine dört adımlı **kayıt talebi sihirbazı**; host onayınca davet bağlantısı e-postayla gidiyor, davetli clickwrap **protokol onayı** verince hesap otomatik açılıyor; host→kiracı **fatura ve tahsilat takibi**; satış paketlerine yıllık liste bedeli — 🔴 `AppDemoRequests` → `AppRegistrationRequests` yeniden adlandırması ve altı serbest metin alanının düşmesi bu işten geliyor. Sürüm notuna **iki maddesi girdi** (#347): kiracı "Paketim" ekranında protokol metnini, "Faturalarım" bölümünde faturalarını görüyor ve ödemesini dekontuyla bildiriyor. Sihirbaz, davet ve host tarafındaki tahsilat kontrolü nota girmez |
| Host | Sürüm notu yayın onayı (#322), Sistem Sağlığı markdown özeti (#313) — **ikisi de sürüm notuna girmez** |

---

## Migration — 8 adet, biri **veri düşürüyor**

```
20260903100503_AddTaskDocuments
20260903121602_Add_ReleaseNotePublications
20260904082319_GrantInterests
20260904085559_AddTaskFormLinks
20260905205359_RenameDemoRequestsToRegistrationRequests   🔴
20260905210029_Add_FirmProfile_NgoFields
20260905215134_AddServiceAgreementsAndInvite
20260905230857_AddSubscriptionBilling
```

| Migration | Tablo | Kolon (+/−) | İndeks | FK |
|---|---|---|---|---|
| `AddTaskDocuments` | 1 | — | 1 | — |
| `Add_ReleaseNotePublications` | 1 | — | 1 | — |
| `GrantInterests` | 1 | — | 3 | — |
| `AddTaskFormLinks` | 1 | +2 | 3 | — |
| `RenameDemoRequestsToRegistrationRequests` | rename | **+11 / −7** | 2 yeniden adlandırıldı | — |
| `Add_FirmProfile_NgoFields` | — | +6 | — | — |
| `AddServiceAgreementsAndInvite` | 1 | +5 | 4 | — |
| `AddSubscriptionBilling` | 2 | — | 4 | — |
| **Toplam** | **7** | **+24 / −7** | **16** | **0** |

Yedi migration salt eklemeli: `Up()` gövdelerinde `DropTable` / `DropColumn` /
`RenameTable` / `RenameColumn` / `AlterColumn` yok, varsayılansız `nullable: false`
AddColumn yok.

### 🔴 `RenameDemoRequestsToRegistrationRequests` — tek istisna, veri kaybı var

#342 demo talebi kavramını kayıt talebine çevirdi. Migration `AppDemoRequests` tablosunu
`AppRegistrationRequests` olarak **yeniden adlandırıyor** (tablo silinmiyor, satırlar
korunuyor; PK ve iki indeks de yeni ada çekiliyor) ve şu **altı sütunu kalıcı olarak
düşürüyor**:

```
TargetAudience   ProblemStatement   PlannedActivities
BudgetRange      ExpectedOutcomes   InterestedModules
```

Bunlar eski demo talebi formunun serbest metin alanları. Yeni akışta karşılıkları yok;
**içerikleri geri getirilemez.** Yedinci düşen sütun `OrganizationKind`, kör bırakılmıyor:
migration önce `CompanyType`'ı ekliyor, bir `UPDATE` ile enum eşlemesini yapıyor
(Dernek → Dernek, Kamu → Kamu, kalan → Diğer), sonra eskisini düşürüyor — veri korunuyor.

🔴 **Deploy öncesi `AppDemoRequests` tablosunu ayrıca dışa aktar.** Canlıda kaç talep
birikmiş bilinmiyor (yerelde 4 satır var). Genel DB yedeği bunu zaten kapsar, ama o altı
alanı bir daha okumak isteyeceksen yedeği geri yüklemek yerine elinde bir CSV olsun:

```sql
SELECT * FROM AppDemoRequests;   -- deploy ÖNCESİ, sonuç CSV olarak saklansın
```

Postgres tarafında karşılıkları mevcut (çift sağlayıcı); canlı SQL Server kullanıyor.

---

## Tohumlama — DbMigrator ŞART

`dotnet ef database update` bu deploy için **yeterli değil**: yeni bir izin ve yeni bir
veri tohumu var.

**1. Yeni izin:** `PlatformPermissions.ReleaseNotes.Manage` (host tarafı, `MultiTenancySides.Host`).
Tohumlanmazsa host `/Admin/ReleaseNotes` ekranına giremez.

**2. Yeni tohumlayıcı:** `ReleaseNotePublicationDataSeedContributor`.

> 🔴 **Bu tohum, sürüm notlarının kullanıcıya görünürlüğünü belirler.** Yayın onayı kapısı
> (#322) "karar yoksa gösterme" mantığıyla çalışır. Tohum, **tablo tamamen boşsa** —
> canlıda öyle, tablo bu paketle geliyor — katalogdaki **bütün maddeleri** "onaylı · tüm
> paketler · herkes" olarak geri doldurur. Sonuç: `2026.09.06` sürümünün **70 maddesi
> de onaylı** başlar ve kullanıcılar ilk girişte "Yenilikler" penceresini görür.
> İstenmeyen madde varsa host `/Admin/ReleaseNotes` ekranından kaldırır.
> Bundan **sonraki** her sürüm host onayı bekler; tohum bir daha çalışmaz (tablo dolu).

---

## Deploy adımları

1. **Yedek al** — DB yedeği + site kökünün kopyası.
2. **Korunacak dosyaları filtrele** — `appsettings.secrets.json`, `openiddict.pfx`,
   `App_Data/uploads/*`, `App_Data/DataProtection-Keys/*`, `Logs/*`.
   Ayrıntı: `reference-plesk-deploy-preserve-files`. Bunlar pakette **yoktur**; "temiz
   değiştirme" ile klasörü yenilersen hepsi gider ve site açılmaz.
3. **Web paketini yükle** — `Apya-Yayin-<sha>.zip` site köküne. DLL kilidi verirse site
   köküne boş `App_offline.htm` at, yükle, sonra sil.
4. **DbMigrator'ı çalıştır** — `dbmigrator` klasörüne paketi aç, sunucudaki
   `appsettings.secrets.json`'ı o klasöre **elle kopyala** (yoksa araç localhost'a gider),
   Plesk → Zamanlanmış Görevler → `migrate.bat` → "Şimdi Çalıştır".
   `migrate.bat`'a komut satırı override'ı **yazma** — secrets dosyası zaten her şeyi taşıyor.
   Sonucu çıkış kodundan değil `Logs\logs.txt` içindeki
   `Successfully completed all database migrations.` satırından doğrula.
   🔴 İş bitince zamanlanmış görevi **SİL** (varsayılanı "Günlük 00:00").
5. **App pool'u geri dönüştür.**

---

## Deploy sonrası QA

**Kiracı hesabıyla:**
- Görev detayında Finans sekmesi: gider/gelir ekleme, fatura, bütçe bağı kaydediliyor mu
- Göreve form bağlama; misafir bağlantısıyla form dolduruluyor mu
- Görev Dosyalar/Görseller sekmesi: liste üstte, sürükle-bırak kutusu altta
- Hibe: kurum türü dernek/vakıf seçilince form değişiyor mu; "İlgileniyorum" akışı
- Hibe: uygun çağrı yokken ekranın altı "yükleniyor" kalmıyor; "Yaklaşan son tarihler"
  şeridinde aynı tarihli çağrıların adları üst üste binmiyor
- Menü: Takvim kök başlıkta; Panolar → Görevler / Kart Panosu / Zaman Çizelgesi;
  eski `/Board` adresi kart panosuna yönleniyor (301)
- 🔴 **Menüsünü özelleştirmiş kullanıcıda Takvim'i ayrıca kontrol et.** #344 menü
  kimliğini `Apya.Work.Calendar` → `Apya.Calendar` yaptı; taşımanın görünmesi için
  şarttı (kayıtlı `ShellMenuLayout` koddaki varsayılanı eziyor, ID korunursa taşıma
  ekranda hiç görünmüyor). Bedeli: kayıtlı düzeni olan kullanıcıda yeni düğüm listenin
  **sonuna** düşüyor ve Takvim'e elle koyulmuş iğne kayboluyor. Ayarlar → Menü Düzeni'nden
  tek sürüklemeyle düzeltilebiliyor; düzeni olmayan kullanıcıda doğru sırada geliyor.
- Doğrulama hatası mesajlarında ham property adı görünmüyor (hibe "İlgileniyorum"
  gönderimi ve STK profilinde kayıt/kütük numarası alanı)
- Genel Bakış → yazdır: künye var, istatistikler kırpılmamış
- İlk girişte "Yenilikler" penceresi 2026.09.06 sürümüyle açılıyor

**Host hesabıyla:**
- `/Admin/ReleaseNotes` açılıyor (yeni izin tohumlandı mı) ve maddeler onaylı görünüyor
- `/Admin/RegistrationRequests` açılıyor ve **eski demo talepleri listede duruyor** — tablo
  yeniden adlandırıldı, satırların kaybolmaması gerekiyor. Kurum türü sütunu dolu
  görünmeli (`OrganizationKind` → `CompanyType` çevrimi tuttu mu). Kayıt öncesi aldığın
  CSV ile satır sayısını karşılaştır.
- Bir talebi onayla → davet bağlantısı üretiliyor mu. 🔴 **SMTP hâlâ ayarlı değil**, posta
  gitmez; bağlantıyı ekrandan kopyalayıp elle denemen gerekir.
- Abonelik faturası/tahsilatı ekranları açılıyor (yeni üç tablo)

**Anonim (oturumsuz):**
- `/Account/RegistrationRequest` dört adımlı sihirbazı açıyor
- `/Account/Protokol?token=<davet>` protokol metnini gösteriyor, onay hesabı açıyor

---

## Bilinen sınır

Canlı, kiracı oturumlu uçtan uca QA yerelde yapıldı; canlıda deploy sonrası yukarıdaki
listeyle doğrulanmalı. SMTP hâlâ ayarlı değil — şifre sıfırlama postası gitmez.
