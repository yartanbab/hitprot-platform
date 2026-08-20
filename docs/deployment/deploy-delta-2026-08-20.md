# Deploy delta — 2026-08-20 (`b82e481` → bu belgenin bulunduğu `main`)

Bu, **canlıdaki `b82e481`** (2026-08-16 dördüncü yayın) ile bu yayının `main`'i (PR #205 + #206
dahil) arasındaki farktır — **kesin sha paket adında yazar.**
Tam Plesk süreci için `docs/deployment/plesk-windows.md`
geçerli; bu belge yalnız **bu sürüme özel** zorunlu adımları ve davranış değişikliklerini toplar.

**Yükleme biçimi (bu yayın için karar):** tüm kod baştan yüklenecek — **full self-contained paket**.
Incremental FTP yolu bu sürümde kullanılmıyor (bir önceki runbook'taki `⚡ Hızlı incremental` bölümü
hâlâ geçerli bir yöntemdir, ama 21 PR'lık bu deltada dosya listesi çok geniş).

**İki paket üretilir** (Masaüstünde):

| Paket | Ne için | Sonrası |
|---|---|---|
| `Apya-Yayin-<sha>.zip` | Web uygulaması — sunucudaki site köküne açılır | Kalıcı |
| `Apya-DbMigrator-<sha>.zip` | 12 migration + seed'leri uygular, Plesk Zamanlanmış Görev ile **bir kez** çalışır | 🔴 **Bitince sunucudan SİL** (sır içerir) |

---

## Ne değişti (özet)

| Alan | İçerik |
|---|---|
| **Takvim — baştan tasarım (Faz 1–9)** | Ay/Hafta/Gün/Ajanda görünümleri, kaynak rayı (6 kaynak tek uçtan), sürükle-bırak + geri alma, dış takvim okuma, senkron kuralları + günlüğü, iCal dışa/içe aktarım, kapasite + akıllı toplu erteleme, klavye/erişilebilirlik/A4 baskı, ekip katmanı + toplantıdan görev + çevrimdışı kuyruk |
| **Dokümanlar — baştan kurulum (Faz A–F)** | Belge çekirdeği + meta şeması, kurum uygunluğu + denetim izi, rapor derleyici + teslim paketi + denetçi görünümü, kural motoru + alan bazlı izinler, zaman çizelgesi/bütçe + harcama↔belge eşleştirme + risk kütüğü, proje kapsamı ağacı, çöp kutusu, sınıflandırma önerileri, zamanlanmış rapor + aboneler, ilk kurulum sihirbazı |
| **Yükleme deneyimi** | Toplu yükleme kuyruğu, toplu künye, eşzamanlı yükleme çakışması düzeltmesi, insan dilinde hata mesajları |
| **Tanıtım** | İlk girişte ürün turu (`Platform.Tour.Completed` kullanıcı ayarı — **migration YOK**), müşteri sunumu (`docs/sunum/`) |
| **Düzeltmeler** | Ad+soyad gösterimi, Dashboard masaüstü/mobil, görev detayında fare tekerleği |
| **Veri izolasyonu** | Fatura numarası + form slug tekilliği kiracı bazına çekildi |
| **Deploy aracı** | DbMigrator çalışma dizinini exe'nin yanına sabitler (Plesk zamanlanmış görev tuzağı çözüldü) |

**Sürüm notları kullanıcıya gösterilir:** katalogda yeni **`2026.08.20`** girdisi var
(`src/Apya.Platform.Web/ReleaseNotes/ReleaseNoteCatalog.cs`). Geçmiş `2026.08.16` girdisi
korunuyor → `/ReleaseNotes` sayfasında **iki sürüm birden** listelenir.

---

## 🔴 Zorunlu deploy adımları

### 1. Paketleme
- Publish öncesi **`abp install-libs`** (Web projesinde), ardından **`npm ci`**
  (`wwwroot/dynamic-assets` — install-libs yarn çalıştırıp `@testing-library/dom`'u düşürür).
- `git diff --stat` ile `ui-vendor.js` kirlenmediğini doğrula; kirlendiyse `git checkout --` ile geri al.
  `dynamic-assets/yarn.lock`'ta oluşan değişikliği **commit etme** (install-libs artığı).
- `dotnet publish -c Release -r win-x64 --self-contained true` (kısa yola, ör. `C:\ApyaPublish`).
- **Pakete GİRMEMELİ:** `openiddict.pfx` (sunucudaki sertifikayı ezerse `CertificatePassword`
  eşleşmez → uygulama açılmadan çöker), `appsettings.secrets.json`.
  🔴 **DbMigrator paketinde secrets dosyasına ayrıca dikkat:** Web'de `CopyToPublishDirectory=Never`
  ama **`Apya.Platform.DbMigrator.csproj`'de `PreserveNewest`** — yani yerelde o dizinde bir
  `appsettings.secrets.json` varsa **publish çıktısına kopyalanır.** Paketlemeden önce publish
  klasöründe olmadığını doğrula (paketleme script'i bulursa siler ve uyarır).
- ZIP üretirken ters-slash tuzağı: `ZipFile::Open($zip,'Create')` + entry adını `-replace '\\','/'`.
  Denetim: ZIP'i açıp `wwwroot/libs` girdi sayısını say (0 = ayraç bozuk).

### 2. 🔴 VERİ TAŞIMA UYARISI — önce yedek al
`A1_DocumentsCore` migration'ı yalnız tablo eklemiyor, **veri de taşıyor**: mevcut
`AppDocumentAttachments` kayıtlarından her sürüm grubunun en son sürümü yeni `AppDocumentFiles`
tablosuna kopyalanıyor (`ROW_NUMBER()` penceresiyle).

Backfill **yerelde gerçek satırlarla doğrulandı**: 15 sürüm grubu → 15 `AppDocumentFiles` kaydı
(bire bir). Yani mantık boş veriyle değil, gerçek kayıtlarla çalıştı. Yine de prod'un veri hacmi ve
geçmişi (çok sürümlü belgeler, silinmiş kayıtlar, kiracı dağılımı) yereldekinden farklı.

**DbMigrator'dan önce veritabanı yedeği al.** Geri alma yolu yedekten dönmektir.

### 3. Şema + seed — **DbMigrator ile (SQL konsolu yok)**
Bekleyen **12 migration** (SqlServer, prod). DbMigrator sırayla uygular:

| # | Migration | Ne yapar |
|---|---|---|
| 1 | `20260817125419_A1_DocumentsCore` | 7 tablo (belge tipi/alan şeması/dosya/etiket) + **veri taşıma (§2)** |
| 2 | `20260817135225_B1_Compliance` | 4 tablo — kurum uygunluk paketi, gereksinim, atama, kalem durumu |
| 3 | `20260818110159_C1_Reporting` | 7 tablo — rapor şablonu/çalıştırma, teslim paketi, dış paylaşım linki |
| 4 | `20260818122015_D1_Administration` | 6 tablo — kural motoru, kural çalıştırma, alan bazlı izin, entegrasyon |
| 5 | `20260818130549_E1_Matching` | 2 tablo — harcama↔belge eşleşmesi, proje risk kütüğü |
| 6 | `20260819075604_Add_CalendarSyncRules` | Senkron günlüğü tablosu + hesap üzerinde kural kolonları |
| 7 | `20260819081138_Add_IcalFeedAndSubscriptions` | Takvim feed token'ları + .ics abonelikleri |
| 8 | `20260819081354_TenantScopedUniqueIndexes` | Fatura no + form slug tekil indeksleri **kiracı bazına** taşır |
| 9 | `20260820135004_DocumentSoftDeleteRecoverable` | Çöp kutusu / geri alınabilir silme |
| 10 | `20260820140803_ComplianceRequirementSource` | Kontrol listesi kalem kaynağı |
| 11 | `20260820143054_DocumentSuggestionDismissals` | Reddedilen sınıflandırma önerileri |
| 12 | `20260820144810_ReportSchedulesAndSubscribers` | Zamanlanmış rapor + aboneler |

> **8 numaraya dikkat:** eski tekil indeks kaldırılıp kiracı bazlı olanı kurulur. Aynı fatura
> numarası veya form slug'ı **farklı kiracılarda** varsa sorun yok; **aynı kiracı içinde**
> yinelenen kayıt varsa indeks kurulumu hata verir. Yerelde temizdi; prod'da migration
> düşerse önce yinelenen kaydı ayıkla.

**DbMigrator ayrıca SEEDER'ları çalıştırır — bu sürümde yeni olanlar:**

- **İzin seed'i (YENİ, bu yayında eklendi):** `Documents.ManageMeta`, `BulkOperations`,
  `ManageCompliance`, `GenerateReports`, `ShareExternally`, `Administer` → **host + her kiracının**
  `admin` rolü (`DocumentsPermissionDataSeedContributor`).
  🔴 **Bu seeder olmadan Dokümanlar modülünün yeni işlevleri kimseye açık olmazdı** (AppService'ler
  bu izinleri `[Authorize]` ile istiyor; ABP yeni izinleri var olan rollere otomatik vermez —
  FN-004 ile aynı sınıf). Efektif erişimi paket izin tavanı sınırlamaya devam eder.
- **Veri seed'i (YENİ):** 6 sistem belge tipi + alan şemaları · kurum paketleri
  (KOSGEB Ar-Ge, TÜBİTAK 1501) + kontrol listesi kalemleri · sistem rapor şablonları.
  Hepsi **host seviyesinde** (`TenantId = null`), sabit GUID'lerle, idempotent — kiracılar okur.

> ⚠️ **KRİTİK (değişmedi):** `SUNUCU-1-dbmigrator-secrets.json` içindeki **`ClientSecret` +
> `DefaultPassPhrase` ilk seed'deki değerlerle AYNI olmak zorunda.** Değişirse OpenIddict seed'i /
> giriş ve AI anahtarı çözümü kırılır.

> ✅ **Demo verisi prod'a GİRMEZ:** 150 proje / 30 kiracılık demo dünyası `App:SeedDemoData`
> anahtarına bağlı ve `appsettings.Production.json` bunu **`false`** tutuyor. DbMigrator'ı
> `--App:SeedDemoData=true` ile **çalıştırma.**

DbMigrator'ı Plesk Zamanlanmış Görev ile bir kez çalıştır → **bitince klasörü sil** (sır içerir).
Beklenen: çıkış 0 + log'da `"Successfully completed all database migrations."`
(Bu sürümde DbMigrator artık çalışma dizinini exe'nin yanına sabitliyor — `appsettings.json`
görülmeme sorunu çözüldü.)

---

## ⚠️ Deploy sonrası davranış değişiklikleri

| Değişiklik | Etki / aksiyon |
|---|---|
| **Belge verisi yeni tabloya taşındı** | Eski `AppDocumentAttachments` kayıtları `AppDocumentFiles` üzerinden görünür. ✅ **TEST ET:** deploy sonrası mevcut bir projede eski belgelerin listelendiğini ve indirilebildiğini doğrula. |
| **Takvim entegrasyonları** | Bir önceki yayında token şifrelemesine geçilmişti; bağlantılarını yeniden bağlamamış kullanıcılar hâlâ bağlamalı. Yeni senkron kuralları paneli varsayılan değerlerle gelir. |
| **İlk açılışta iki pencere sırayla** | Turu görmemiş kullanıcıda önce **tanıtım turu** açılır; tur bitince (veya atlanınca) bir sonraki sayfa açılışında **Yenilikler penceresi** çıkar. Aynı anda iki modal çıkmaz (`ReleaseNotesViewComponent` tur bitene kadar susar). |
| **Sürüm notları** | Menüdeki **Yenilikler** → `/ReleaseNotes` artık **2026.08.20** ve **2026.08.16** olmak üzere iki sürümü listeler. |
| **Fatura no / form slug tekilliği** | Artık kiracı bazlı. Farklı kiracılar aynı fatura numarasını kullanabilir — muhasebe tarafında beklenen davranış budur. |
| **Dokümanlar yönetim ekranı** | İzin seed'i sonrası host ve kiracı admin'lerine görünür olur. Başka rollere gerekiyorsa Roller ekranından verilir. |

---

## Doğrulama (deploy sonrası)

- [ ] `https://apya.pargetto.com.tr` → 200; `/` → `/Account/Login` (kök yönlendirme + authz)
- [ ] **Giriş çalışıyor** (ClientSecret + passphrase eşleşiyor demektir)
- [ ] DB: 12 yeni migration kayıtlı; `AppDocumentFiles`, `AppCompliancePackages`, `AppReportTemplates`,
      `AppCalendarFeedTokens`, `AppReportSchedules` tabloları var
- [ ] **Eski belgeler görünüyor ve indirilebiliyor** (A1 backfill doğrulaması — §2)
- [ ] **Takvim** açılıyor: Ay/Hafta/Gün/Ajanda geçişi, kaynak rayı, bir öğeyi sürükleyip başka güne taşıma
- [ ] **Dokümanlar** açılıyor: proje kapsamı ağacı, dosya yükleme, çöp kutusu
- [ ] Uygunluk kontrol listesi + rapor şablonu ekranları **403 vermiyor** (izin seed'i çalıştı)
- [ ] Fatura oluşturma + tutar maskesi hâlâ çalışıyor (önceki yayının regresyon kontrolü)
- [ ] İlk girişte **tanıtım turu** çıkıyor; kapatınca **Yenilikler** penceresi geliyor
- [ ] `/ReleaseNotes` **iki sürümü** listeliyor

## Geri alma

Önceki paket (`b82e481`) + **§2'de alınan veritabanı yedeği.** Bu sürümde migration'lar yalnız
eklemeli değil — `A1_DocumentsCore` veri taşıyor ve `TenantScopedUniqueIndexes` indeks değiştiriyor.
Şemayı geriye almak yerine **yedekten dönmek** doğru yoldur.

---

## Deploy dışı açık (bu yayına engel DEĞİL)

- **SEC-001/002 sır rotasyonu** — `ClientSecret` + `DefaultPassPhrase` git geçmişinde duruyor.
- **KVKK yasal metinleri** hâlâ taslak (`/aydinlatma-metni`, `/gizlilik-politikasi`).
- Dokümanlar modülünde etkileşimli test edilmemiş yollar: `/Share/{token}` dış paylaşım akışı ve
  mobil görünüm.
- Denetim sicili: `docs/denetim/bulgular.md`.
