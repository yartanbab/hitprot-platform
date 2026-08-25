# Deploy delta — 2026-08-25 (`1d4a039` → `main` `602fd92`)

Bu belge, **canlıdaki `1d4a039`** (2026-08-20 beşinci yayın — 12 migration uygulandı, ayakta) ile
bugünkü `main` (`602fd92`) arasındaki farkı toplar.

> ⚠️ **Bu belge `deploy-delta-2026-08-24.md`'nin YERİNE geçer.**
> O belge `1d4a039..4323466` aralığını kapsıyordu ve "**KOD-ONLY, migration YOK**" diyordu.
> Hazırlık PR'ı (#217) merge edildikten sonra **#218, #219, #220, #221, #222 de main'e girdi** ve
> bunlardan **#218 bir migration getirdi**. Bu yüzden 08-24 belgesinin
> "DbMigrator çalıştırma / yedek alma" muafiyeti **ARTIK GEÇERSİZDİR.**
>
> 📌 **Varsayım:** 08-24 paketi (`4323466`) canlıya **yüklenmedi** ve canlı hâlâ `1d4a039`.
> Eğer 08-24 paketi yüklendiyse bu belge yine geçerlidir — aralığın bir kısmı zaten canlıda
> olduğu için o maddeler yalnız etkisiz (idempotent) kalır. **Migration sayısı iki durumda da
> AYNIDIR: tek bir yeni migration.**

---

## 🔴 Bu yayın KOD-ONLY DEĞİLDİR

| | 08-24 belgesi (eski) | **Bu yayın (doğru)** |
|---|---|---|
| Yeni migration | yok | **1 adet** — `ProjectCoverAndAttachments` |
| DbMigrator | çalıştırılmaz | **ÇALIŞTIRILIR (zorunlu)** |
| Veritabanı yedeği | zorunlu değil | **🔴 ZORUNLU** |
| Üretilecek paket | 1 (Web) | **2 (Web + DbMigrator)** |

Migration her iki sağlayıcı için de üretilmiş durumda:

- `src/Apya.Platform.EntityFrameworkCore/Migrations/20260824162214_ProjectCoverAndAttachments.cs` (PostgreSql)
- `src/Apya.Platform.EntityFrameworkCore.SqlServer/Migrations/20260824162308_ProjectCoverAndAttachments.cs` (SqlServer — **canlıda kullanılan**)

### Migration ne yapıyor

| İşlem | Tablo | Not |
|---|---|---|
| `CoverImageFileName` sütunu ekle (`nvarchar(256)`, null olabilir) | `AppProjects` | Güvenli |
| `ContentType` sütunu ekle (`nvarchar(128)`, NOT NULL, `default ''`) | `AppProjectAttachments` | Güvenli |
| `TenantId` sütunu ekle (`uniqueidentifier`, null olabilir) | `AppProjectAttachments` | Güvenli |
| `Title` sütunu ekle (`nvarchar(256)`, null olabilir) | `AppProjectAttachments` | Güvenli |
| `IX_AppProjectAttachments_ProjectId` indeksi | `AppProjectAttachments` | Güvenli |
| 🟡 `FileName`: `nvarchar(max)` → **`nvarchar(256)`** | `AppProjectAttachments` | **DARALTMA** |
| 🟡 `StoredFileName`: `nvarchar(max)` → **`nvarchar(256)`** | `AppProjectAttachments` | **DARALTMA** |
| `UPDATE ... SET TenantId = p.TenantId` (backfill) | `AppProjectAttachments` | Mevcut ekleri kiracıya bağlar |

> 🟡 **Daraltma riski:** 256 karakterden uzun bir `FileName`/`StoredFileName` varsa `ALTER COLUMN`
> **hata verir ve migration yarıda kalır.** Deploy ÖNCESİ şu sorguyla kontrol et — **0 dönmeli**:
>
> ```sql
> SELECT COUNT(*) FROM AppProjectAttachments
> WHERE LEN(FileName) > 256 OR LEN(StoredFileName) > 256;
> ```
>
> 0 değilse deploy'a başlama; önce o satırlar kısaltılmalı.

> ℹ️ **TenantId backfill'i neden var:** `ProjectAttachment` bu sürümde `IMultiTenant` oldu. Backfill
> olmasa mevcut eklerin `TenantId`'si NULL kalır ve kiracı kullanıcısı **kendi eski eklerini göremezdi.**

---

## 🔴 Bilinen boşluk — yeni izinler DbMigrator ile TOHUMLANMAZ

Bu yayın iki yeni izin getiriyor: `Platform.Tasks.QuickCreate` ve `Platform.Tasks.ManagePlanning`
(Yeni Görev ekranının hızlı giriş satırı + planlama alanları).

Bunlar için `TasksPermissionDataSeedContributor` yazılmış ve **doğru** yazılmış (host-only guard'lı,
`IPermissionDataSeeder` kullanıyor). **Ama çalışmayacak:**

> `Apya.Platform.DbMigrator` yalnız `Application.Contracts`'a referans verir; **`Apya.Platform.Application`'a
> vermez.** Tüm izin tohumlayıcıları (`Tasks`, `Documents`, `Consents`, `LoginScreen`) ve
> `PackageDataSeedContributor` **Application katmanındadır.** Doğrulama: DbMigrator'ın build çıktısında
> `Apya.Platform.Application.dll` **yoktur** → ABP bu contributor'ları hiç göremez.

Bu **yeni bir hata değil**, önceden beri var olan bir boşluk (aynı sebeple `AppPlatformPackages`
tablosunun boş kalması daha önce de gözlenmişti). Ama **bu yayında ilk kez ısırıyor**, çünkü yeni
görev ekranının ekstraları bu izinlere bağlı.

**Sonuç:** Deploy sonrası hızlı giriş satırı ve planlama alanları **hiç kimseye görünmez.**

**Geçici çözüm (deploy sonrası, bir kereliğine):**
Host → **Kimlik Yönetimi → Roller → admin → İzinler → Görev Yönetimi** →
"Hızlı Görev Girişi" + "Planlama Alanlarını Yönetme" işaretlenir.
Kiracılar için aynı işlem ilgili kiracının admin rolünde tekrarlanır.

**Kalıcı çözüm (bu yayına dahil DEĞİL — mimari karar, onay ister):**
`Apya.Platform.DbMigrator`'a `Apya.Platform.Application` referansı + `PlatformApplicationModule`
bağımlılığı eklemek. Bu bir **bağımlılık yönü değişikliğidir**; ayrı bir PR'da ele alınmalı.

---

## Ne değişti (özet)

### Bu belgeye 08-24'ten SONRA eklenenler (PR #218–#222)

| Alan | İçerik | Deploy etkisi |
|---|---|---|
| 🗂️ **Proje düzenleme ekranı** (#218) | Yeni sayfa `/Projects/Edit/{id}` — 3 sekmeli. Kapak görseli + ek dosya yükleme. Proje kartına "düzenle" düğmesi, odak kartı kaldırıldı, silme menüden çıkarıldı (kod yazarak onay) | 🔴 **Migration** (yukarıdaki tablo). Yazma uçları izne bağlandı. |
| ✨ **Yeni Proje formu redesign** (#220) | `CreateModal` 840px tek ekran; proje kodu benzersizliği **sunucu tarafında** doğrulanıyor; kategoriye bağlı hazır görev takvimi; modal sayfalarına sayfa seviyesi yetki | Şemasız. Davranış değişikliği (§ Davranış). |
| ⚡ **Yeni Görev ekranı** (#222) | Hızlı giriş satırı (`@kişi #etiket !öncelik >tarih`) + sıkı form; paket kapılı ekstra konfigürasyonlar | 🔴 **İzin tohumlama boşluğu** (yukarıya bak). Yeni ayarlar kodda varsayılanlı. |
| 🐞 **Dashboard kırık link** (#219) | Proje Sağlığı kartı `/Projects/Detail/` → `/Projects/ProjectDetails/` | Kozmetik/fix. Bundle **zaten derlenmiş** (§1). |
| 📄 **Sunum desteleri** (#221) | `docs/sunum/` — dernek/vakıf odaklı ikinci deste | **Yalnız dokümantasyon, uygulamayı etkilemez.** |

### 08-24 belgesinden devralınanlar (PR #209–#216)

Domain değişikliği (`apya.pargetto.com`), sertifika yükleme düzeltmesi, Yeni Müşteri 500 fix'i,
proje görev paneli ayarı, sayfa yükleme animasyonu, takvim sihirbazı footer fix'i, kiracı adı
yazmadan giriş, hibe kataloğunun host'a kilitlenmesi.
**Ayrıntılar için `deploy-delta-2026-08-24.md` §"Ne değişti" ve §"Davranış" bölümleri hâlâ geçerlidir**
— yalnız o belgenin "migration yok / DbMigrator çalıştırma / yedek gerekmez" ifadeleri geçersizdir.

### Sürüm notları

Katalogdaki (`src/Apya.Platform.Web/ReleaseNotes/ReleaseNoteCatalog.cs`) en yeni girdi bu hazırlıkta
**`2026.08.24` → `2026.08.25`** olarak güncellendi ve #218–#222'nin kullanıcıya görünen değişiklikleri
eklendi (proje düzenleme ekranı, kapak/ek dosya, Yeni Görev ekranı, Yeni Proje formu, proje kodu
benzersizliği, pano bağlantı düzeltmesi). `/ReleaseNotes` yine **üç sürüm** listeler.

### Yeni ayarlar (kodda varsayılanlı, tohumlama gerekmez)

| Ayar | Varsayılan |
|---|---|
| `Platform.TaskCreate.DefaultMode` | `quick` (`quick` \| `form`) |
| `Platform.TaskCreate.ShowKeyboardHints` | `true` |
| `Platform.TaskCreate.ShowInfoBanner` | `false` |

Yeni feature: `Platform.TaskQuickEntry` — **varsayılan `true`**.

---

## 🔴 Zorunlu deploy adımları

### 0. 🔴 Veritabanı yedeği (bu yayında ZORUNLU)

Migration şema değiştiriyor ve **geri alınamaz bir daraltma** içeriyor. Plesk → veritabanı → **Dışa
aktar/yedekle**. Yedek alınmadan devam etme. Ardından yukarıdaki `LEN(...) > 256` ön-kontrolünü çalıştır.

### 1. Paketleme

```
abp install-libs
cd src/Apya.Platform.Web/wwwroot/dynamic-assets
npm ci
```

> ✅ **Bundle'lar güncel — yeniden derlemeye gerek yok.** Bu hazırlıkta `npm run build` çalıştırılıp
> sonuç commit'li bundle'larla karşılaştırıldı: **gerçek fark yok.** (Tek fark, Tailwind'in
> `CreateModal.cshtml` içindeki `text-wrap: pretty` CSS *özelliğini* sınıf adı sanıp ürettiği,
> hiçbir yerde kullanılmayan 26 baytlık `.text-wrap` yardımcı sınıfıdır — işlevsizdir.)
>
> ⚠️ `npm run build` çalıştırırsan: çıktı **LF**, commit'li bundle'lar `autocrlf` ile **CRLF** olduğu
> için `wwwroot/js/*.js`'in tamamı "değişmiş" görünür ama `git diff` yalnız gerçek farkı taşır.
> Gürültüyü `rm <dosya> && git checkout -- <dosya>` ile temizle.
>
> ⚠️ `abp install-libs` `dynamic-assets` altında **yarn** çalıştırır; proje **npm** ile kuruludur.
> `npm ci`'yi ATLAMA (yoksa frontend testleri toptan patlar) ve oluşan
> **`dynamic-assets/yarn.lock` değişikliğini COMMIT ETME** (`git checkout -- .../yarn.lock`).

- `dotnet publish -c Release -r win-x64 --self-contained true` (kısa yola, ör. `C:\ApyaPublish`).
- **İKİ paket üretilir:**

| Paket | Ne için | Sonrası |
|---|---|---|
| `Apya-Yayin-602fd92.zip` | Web uygulaması — site köküne açılır (üzerine yazılır) | Kalıcı |
| `Apya-DbMigrator-602fd92.zip` | Migration + seed — çalıştırılır, **sonra silinir** | 🔴 Sunucuda BIRAKMA |

- **Web paketine GİRMEMELİ:**
  - `openiddict.pfx` — sunucudakini ezerse `CertificatePassword` eşleşmez → uygulama açılmadan çöker.
  - `appsettings.secrets.json` — sunucudaki sırları ezmesin.
- 🔴 **DbMigrator paketi:** `Apya.Platform.DbMigrator.csproj` `appsettings.secrets.json`'ı publish
  çıktısına **KOPYALAR.** Paketi sunucuda bırakma; çalıştırdıktan sonra klasörü sil.
- ZIP üretirken ters-slash tuzağı: entry adını `-replace '\\','/'`. Denetim: ZIP'i açıp
  `wwwroot/libs` girdi sayısını say (0 = ayraç bozuk).

### 2. 🔴 DbMigrator'ı çalıştır

Site **durdurulur**, DbMigrator paketi sunucuda geçici bir klasöre açılır ve **kendi klasöründen**
çalıştırılır:

```
cd <dbmigrator-klasoru>
Apya.Platform.DbMigrator.exe --OpenIddict:Applications:Platform_Web:ClientSecret=<secret>
```

> 🔴 **`ClientSecret` parametresi şart.** `appsettings.json`'da boştur; `OpenIddictDataSeedContributor`
> confidential istemcide boş secret'ı reddeder ve **tüm tohumlama zincirini ilk adımda düşürür.**
>
> 🔴 **Kök dizinden çalıştırma.** Yapılandırma **çalışma dizininden** okunur; başka dizinden
> çalıştırırsan `appsettings.json` hiç yüklenmez → bağlantı dizesi boş gelir.
>
> 🔴 **Başarıyı çıkış kodundan değil log'dan doğrula:**
> `"Successfully completed all database migrations."` satırını ara. Tam log `Logs/logs.txt`'te.

Doğrulama (SQL):

```sql
SELECT TOP 3 [MigrationId] FROM [__EFMigrationsHistory] ORDER BY [MigrationId] DESC;
-- 20260824162308_ProjectCoverAndAttachments listede olmalı

SELECT COUNT(*) FROM AppProjectAttachments WHERE TenantId IS NULL;
-- backfill sonrası, projesi olan ekler için 0 olmalı
```

### 3. Web paketini aç ve siteyi başlat

### 4. 🔴 Yeni izinleri elle ver

Yukarıdaki "Bilinen boşluk" bölümüne göre: host admin rolünde **Hızlı Görev Girişi** ve
**Planlama Alanlarını Yönetme** izinlerini işaretle. Aksi hâlde #222'nin getirdiği ekran hiç görünmez.

### 5. `openiddict.pfx` ve domain kontrolü

`deploy-delta-2026-08-24.md` §2 ve §3 aynen geçerli (pfx uygulamanın yanında kalmalı; sunucudaki
`appsettings.secrets.json` içinde `App:SelfUrl` / `RootUrl` varsa `https://apya.pargetto.com`
göstermeli — **secrets, `appsettings.Production.json`'ı ezer**).

> ℹ️ Bu yayında DbMigrator **çalıştığı için**, OpenIddict'in DB'ye kayıtlı redirect URI'ları da
> yeni domaine **kendiliğinden geçer** (`HasSameRedirectUris` → `UpdateAsync`). 08-24 belgesindeki
> "bu yayında güncellenmez" notu bu yayın için geçerli değildir.

---

## ⚠️ Deploy sonrası davranış değişiklikleri

08-24 belgesindeki tüm maddeler geçerli (proje görev paneli varsayılan kapalı, sayfa animasyonu,
kiracı adsız giriş, hibe izinleri host'a taşındı — **mevcut kiracılarda hibe menüsü için elle izin
gerekir**). Bunlara ek olarak:

| Değişiklik | Etki / aksiyon |
|---|---|
| **Proje düzenleme artık ayrı sayfada** | Proje kartındaki "düzenle" düğmesi `/Projects/Edit/{id}`'e götürür. **Silme menüden kaldırıldı** — silmek için düzenleme ekranında proje kodunu yazarak onaylamak gerekiyor. |
| **Projelere kapak görseli ve ek dosya** | Yeni alanlar. Mevcut eklerin `TenantId`'si migration ile dolduruldu; kiracı kullanıcısı eski eklerini görmeye devam eder. |
| **Yeni Proje formu değişti** | Tek ekran 840px. **Proje kodu artık sunucuda benzersizlik kontrolünden geçer** — daha önce sessizce kabul edilen çift kod artık hata döner. Kategoriye göre hazır görev takvimi önerilir. |
| 🔴 **Yeni Görev ekranı ekstraları görünmüyor** | İzin tohumlanmadığı için beklenen durum. §4'teki elle izin adımından sonra gelir. Görev **oluşturmanın kendisi** kapısızdır — izin verilmese de görev açılabilir. |

---

## Doğrulama (deploy sonrası)

- [ ] `https://apya.pargetto.com` → 200; `/` → `/Account/Login`
- [ ] **Giriş çalışıyor** (cert yüklendi + domain tutarlı)
- [ ] `__EFMigrationsHistory`'de `ProjectCoverAndAttachments` var
- [ ] `AppProjectAttachments` → `TenantId` dolu (backfill çalıştı)
- [ ] **Proje düzenleme** `/Projects/Edit/{id}` açılıyor; kapak görseli yüklenebiliyor
- [ ] **Ek dosya** yüklenip indirilebiliyor; kiracı kullanıcısı **eski** eklerini görüyor
- [ ] **Yeni proje** oluşturulabiliyor; **aynı kodu ikinci kez** girince hata dönüyor
- [ ] §4 izinleri verildikten sonra **Yeni Görev** ekranında hızlı giriş satırı çıkıyor
- [ ] **Dashboard → Proje Sağlığı** kartındaki proje linki doğru sayfaya gidiyor
- [ ] **Yeni müşteri (kiracı) ekleme 200 dönüyor**
- [ ] **Kiracı adı yazmadan giriş** çalışıyor ve doğru kiracıya düşüyor
- [ ] `/ReleaseNotes` **üç sürüm** listeliyor (`2026.08.25` · `2026.08.20` · `2026.08.16`);
      ilk açılışta "Yenilikler" penceresi **2026.08.25**'i gösteriyor
- [ ] (Regresyon) Takvim Ay/Hafta/Gün, Dokümanlar ağacı, fatura oluşturma çalışıyor

## Geri alma

🔴 **08-24 belgesinden farklı olarak bu yayın veritabanını DEĞİŞTİRİR.** Geri alma:

1. Web paketini eski sürüme (`1d4a039`) döndür.
2. **Şema geri alınmaz.** Eklenen sütunlar eski kodu bozmaz (hepsi nullable ya da default'lu), bu
   yüzden **tek başına Web geri alımı yeterlidir.**
3. Şemayı da geri almak gerekirse §0'daki yedek geri yüklenir — **daraltma (`nvarchar(max)` →
   `nvarchar(256)`) `Down` ile geri alınabilir olsa da veri kaybı riski taşır; yedeği tercih et.**

---

## Deploy dışı açık (bu yayına engel DEĞİL)

- 🔴 **DbMigrator ↔ Application katmanı boşluğu** — yukarıdaki "Bilinen boşluk". Ayrı PR.
- **SEC-001/002 sır rotasyonu** — `ClientSecret` + `DefaultPassPhrase` git geçmişinde duruyor.
- **KVKK yasal metinleri** hâlâ taslak.
- Dokümanlar modülünde etkileşimli test edilmemiş yollar: `/Share/{token}` ve mobil görünüm.
- Denetim sicili: `docs/denetim/bulgular.md`.
