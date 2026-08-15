# Apya.Platform — Uçtan Uca Denetim Bulgu Sicili

**Başlangıç:** 2026-08-15 · **main HEAD:** `d643a6e` · **Baseline:** `dotnet build` ✅ (exit 0), `dotnet test` ✅ (exit 0)

Bu dosya denetimin kalıcı sicilidir. Her bulgu bir ID + önem + kanıt (dosya:satır) + öneri taşır.
Düzeltme PR'ları bulgu ID'sine referans verir. Denetim çok oturuma yayılır; ilerleme burada birikir.

**Önem:** 🔴 Kritik · 🟠 Yüksek · 🟡 Orta · 🔵 Düşük · ⚪ Bilgi
**Durum:** `AÇIK` · `DOĞRULANDI` (kanıtla teyit) · `DÜZELTİLDİ` · `KAPANDI` (yanlış alarm) · `BEKLİYOR` (doğrulama gerekli)

---

## Faz durumu

| Faz | Kapsam | Durum |
|---|---|---|
| **1 — Yatay statik tarama** | Güvenlik, izin haritası, mimari, bug, perf, ölü kod | ✅ 1. geçiş tamam (bu belge). Derin per-servis + AI modülü + webhooks 2. geçişe |
| **1b — KVKK / Veri koruma** | TR öncelikli → AB → Dünya | ✅ **Dalga 1 (4/4) UYGULANDI + doğrulandı**; metinler taslak (hukuki inceleme bekliyor) |
| **Düzeltmeler** | SEC-007, SEC-DEP Kademe 1, FN-001, CORR-004, ARCH-001+FN-002 (33 ölü dosya) | ✅ Hepsi uygulandı+doğrulandı; **suite tam yeşil 351/351** (TEST-001 çözüldü) |
| **2 — Dikey dinamik (E2E)** | Sayfa/buton canlı tıklama, UX/UI, veri bütünlüğü | ⏳ DB kapalı (MSSQL) → kullanıcı başlatmalı + DbMigrator + giriş; install-libs ✅ |

**E2E ortam ön-koşulu:** worktree boş doğdu → `abp install-libs` + user-secrets (cert parolası) + 44386 port çakışması kontrolü + kullanıcı bir kez giriş yapmalı (Claude parola giremez).

---

## Düzeltme günlüğü

| Tarih | Bulgu | Aksiyon | Durum |
|---|---|---|---|
| 2026-08-15 | KVKK-001 | Aydınlatma metni + Gizlilik politikası sayfaları oluşturuldu (`/aydinlatma-metni`, `/gizlilik-politikasi`), ortak `_LegalLayout`; giriş footer'ı + genel form footer'ına linklendi. Build ✅. **Metinler TASLAK — hukuki inceleme + `[placeholder]` doldurma bekliyor. Görsel QA E2E fazında.** | 🟡 Kısmi |
| 2026-08-15 | KVKK-002 | Yurt dışı aktarım tablosu (AI: OpenAI/Anthropic/DeepSeek, takvim) aydınlatma metnine eklendi | 🟡 Kısmi (aktarım onay akışı KVKK Dalga sonrası) |
| 2026-08-15 | KVKK-003 | Genel form sayfasına (F/Index) aydınlatma/gizlilik linkleri eklendi | 🟡 Kısmi (zorunlu onay kutusu #2'de) |
| 2026-08-15 | ARCH-001 + FN-002 | **Ölü kod kaldırıldı (kullanıcı onayı "ölüleri kaldır"), 33 dosya:** (1) **Çift-taraflı defter** — tüm `Domain/Accounting/` (20) + `Domain.Shared/Accounting/` (5) + JournalEntry/Account/Money/Outbox hata kodları + tr.json lokalizasyonları. DB'ye map'lenmemişti → **migration YOK**, saf kod. (2) **"Proje analizi" orphaned özelliği** — `ProjectAnalysis` entity + 2 DTO + `Pages/Analysis/` (4) + 3 stub metot (IProjectAppService + ProjectAppService) + yorumlu `xProjectController`. Entity DB-mapped'ti → **`Drop_ProjectAnalyses` migration (SqlServer + Postgres)** yalnız `AppProjectAnalyses` tablosunu düşürür (deploy'da DbMigrator; tablo kullanılmıyordu). | ✅ **Doğrulandı**: build 0 hata; **tüm suite İLK KEZ TAM YEŞİL 351/351** (Web 50/50 — TEST-001'in 8 hatası kayboldu, aşağı bak). |
| 2026-08-15 | FN-001 | `ProjectAppService.GetDetailAsync` görev sorgusuna `.Include(t => t.Assignee)` eklendi → AutoMapper artık `AssigneeName`'i (Assignee.UserName) dolduruyor; Proje Detay "Atanan" filtresi artık dolu. `using Microsoft.EntityFrameworkCore`. | ✅ Doğrulandı: build 0 hata; testler baseline'la aynı |
| 2026-08-15 | CORR-004 | `DateTime.Now` → `Clock.Now` (6 yer / 5 servis): GrantApplication, GrantRecommendation, Shell (×2), FeedbackAdmin, SystemHealth. Application katmanında gerçek `DateTime.Now` kalmadı (niyetli `DateTime.UtcNow` — takvim token/webhook/form — dokunulmadı). | ✅ Doğrulandı: build 0 hata; testler baseline'la aynı (static-metot Clock fix: `today` parametresi çağırandan) |
| 2026-08-15 | FN-002 | **Teşhis (kod değişikliği YOK — karar bekliyor):** `ProjectAppService.GetAnalysisAsync/AddAnalysisAsync/GetSuitableGrantsAsync` `NotImplementedException` fırlatıyor; `Pages/Analysis/AnalysisModal` + `AnalysisInputModal` bunları çağırıyor → çağrılırsa 500. ANCAK bu modallar hiçbir yerden **linklenmemiş** (wwwroot/JS + .cshtml taraması boş) → orphaned ölü kod, canlı giriş noktası yok. Otomatik API (`/api/app/project/analysis` vb.) yine de açık ve doğrudan çağrılırsa 500. CLAUDE.md: ölü kod silinmez, bildirilir. **Karar:** "Proje analizi" ölü özelliğini kaldır (sayfalar+stub+interface metotları+yorumlu controller) MI yoksa uygula MI? (ARCH-001 gibi.) | ⚪ Karar bekliyor |
| 2026-08-15 | KVKK-004 | **Geri bildirim ekleri saklama süresi** (KVKK Dalga 1 son parça): `FeedbackAttachmentRetentionWorker` (Web katmanı — dosya silme FeedbackFileStorage'a bağlı) süre dolan ekin dosyasını + DB satırını batch'li imha eder, **geri bildirim METNİ korunur** (ürün hafızası ilkesi). Ayar `Feedback.AttachmentRetentionDays` (varsayılan 180g, clamp 30–3650), Ayarlar'dan değiştirilebilir; tr/en lokalizasyon. `FeedbackFileStorage.Delete` path-güvenli. Tüm kiracılar (IMultiTenant filtre kapalı). Şema değişikliği yok. | ✅ Doğrulandı: build 0 hata; testler baseline'la aynı (166/42/93, Web 42/50). **KVKK Dalga 1 (4/4 madde) TAMAM.** Worker davranışı E2E fazında gözlemlenebilir. |
| 2026-08-15 | SEC-007 | Fatura/rapor API'lerine sınıf-seviyesi izin eklendi (bypass kapatıldı): `InvoiceAppService`→`Invoices.Default`, `ReportAppService`→`Reports.Default`, `TrialBalanceAppService`→`Reports.TrialBalance` (hepsi ilgili sayfayla hizalı → mevcut kullanıcı kilitlenmez). Doğrulandı: tek tüketiciler ilgili izinli sayfalar. **Follow-up (opsiyonel sertleştirme):** fatura mutasyonlarına (`CreateAsync`/`AddPaymentAsync`) `Invoices.Create`/`Edit` alt-izni — ama önce mevcut rol grant'leri kontrol edilmeli (Default-only kullanıcıları kırabilir). | ✅ Doğrulandı: build 0 hata; testler baseline'la aynı (166/42/93, Web 42/50); `AppService_RequiresAuthorization` geçiyor |
| 2026-08-15 | KVKK-005 / FN-003 | **Form yayın ayarları artık UYGULANIYOR** (backend, şema değişikliği yok — `PublishSettingsJson` zaten vardı): `FormPublishSettings` parser; `PublicDocumentAppService` tarih penceresi (başlangıç/bitiş dışı → FormNotStarted/FormExpired) + RequireKvkk/RequireCaptcha bayrakları; `ResponseAppService` pencere (defense) + KVKK onay zorunluluğu + bot koruması (honeypot + min-süre, ÜÇÜNCÜ TARAF YOK) + rıza kaydı (ConsentRecord FormKvkk). 4 yeni hata kodu + tr/en mesaj. Frontend: public-form.jsx KVKK onay kutusu (aydınlatma linkli) + honeypot; form-builder ipucu güncellendi ("artık uygulanıyor"). Backend build ✅. | ✅ **Doğrulandı**: vite bundle (public-form.js + form-builder.js) yeniden üretildi (git M); full build 0 hata; testler baseline'la aynı (166/42/93 ✅, Web 42/50 — sıfır yeni regresyon). Etkileşimli QA E2E fazında. |
| 2026-08-15 | SEC-DEP Kademe 1 | Scriban 7.2.1→**7.2.2** + System.Security.Cryptography.Xml 9.0.16→**9.0.18** (Directory.Build.props + 2 csproj). SQLitePCLRaw: **yamalı sürüm henüz yok** (2.1.11 en son, upstream efcore#38547), test-only → izlemede. AutoMapper: **kullanıcı kararı = riski kabul + izle** (AM15 ticari, temiz fix yok). | ✅ **Doğrulandı**: restore'da Scriban+Xml uyarıları GİTTİ; build 0 hata; testler baseline'la aynı (166/42/93 ✅, Web 42/50 — SIFIR yeni regresyon) |
| 2026-08-15 | KVKK (çerez/rıza omurgası) | **Birleşik ConsentRecord omurgası kuruldu** (kullanıcı onaylı, yeni entity + çift-provider migration): Domain.Shared enum/consts, Domain `ConsentRecord`, Contracts DTO+`IConsentAppService`+izin `Consents.Default`, Application `ConsentAppService` (`[RemoteService(false)]`), EF config+DbSet, **SqlServer + Postgres migration** (`Add_ConsentRecords`). Web: anonim `ConsentController` (IP/UA sunucuda), çerez bilgilendirme şeridi (`CookieNotice` VC, `LayoutHooks.Body.Last`), admin analiz sayfası `/Admin/Consent` (Chart.js, izin korumalı), menü. Build ✅. **Etkileşimli QA E2E fazında (canlı tıklama yapılmadı).** | 🟢 Backend+UI tamam, QA bekliyor |

| 2026-08-15 | SEC-001/002 | Commit'li sırlar (`OpenIddict ClientSecret`, `StringEncryption:DefaultPassPhrase`) `appsettings.json` (Web + DbMigrator) içinden BOŞALTILDI → gerçek değerler yalnız env var / user-secrets ile verilmeli. Sicildeki örnek değerler de redakte edildi. **NOT: Değerler git GEÇMİŞİNDE hâlâ var** (bu yalnız güncel dosyaları temizler). Prod'da ezilmiyorsa passphrase rotasyonu + AI anahtarlarının yeniden şifrelenmesi ayrı iş. | 🟡 Kısmi (güncel dosyalar temiz; geçmiş + rotasyon açık) |

| 2026-08-15 | SEC-011 | **Webhook SSRF düzeltildi.** `WebhookUrlGuard`: (1) abonelikte erken doğrulama (`ValidateOrThrow` — http/https şema + IP literal iç aralık reddi, Create+Update'te), (2) **bağlantı-anında IP denetimi** (`GuardedConnectAsync` ConnectCallback → DNS çözümü sonrası loopback/private/link-local/metadata IP'leri reddeder; DNS-rebinding'e ve her redirect'e karşı) + **auto-redirect kapalı**. `WebhookClient` `SocketsHttpHandler` ile yapılandırıldı. Yeni hata kodu `WebhookTargetUrlNotAllowed` + tr/en. Build ✅. | 🟢 Uygulandı, doğrulanıyor |
| 2026-08-15 | SEC-010 | **Takvim OAuth token'ları şifrelendi.** Yeni `CalendarTokenProtector` (Domain, `IStringEncryptionService` sarmalar); entity daima ciphertext — yazımlar `Protect` (`ConnectAccountAsync` + `EnsureFreshTokenAsync`), okumalar `Unprotect` (Google/Outlook `BuildClient` + refresh). Çift-şifreleme fallback tuzağı düzeltildi. Şema değişikliği/migration YOK (kolonlar sınırsız). `Unprotect` hataya dayanıklı (eski düz-metin/rotasyon → boş+log → yeniden bağla). | ✅ Doğrulandı: build 0 hata; Domain 166 + Application 42 + EF 93 = **301/301** yeşil (kapsayan projeler); Web.Tests bağımsız kırık (TEST-002) |
| 2026-08-15 | TEST-002 | **Web.Tests host-boot çökmesi giderildi** (SEC-001 yan etkisi). `PlatformWebTestModule.PreConfigureServices`'te `ReplaceConfiguration` ile test-only dummy OpenIddict `Platform_Web:ClientSecret`. Ayrıca TEST-001 ortamsal (taze worktree `wwwroot/libs` boş → `abp install-libs`). | ✅ Doğrulandı: build 0 hata; tam suite **351/351** yeşil (166+42+50+93) |
| 2026-08-15 | FN-004 | **`Consents.Default` host admin'e seed edildi.** `ConsentsPermissionDataSeedContributor` (LoginScreen deseni; host-context, "ADMIN" rolü, idempotent). Migration YOK. Kiracı-admin kapsamı paket sistemine bırakıldı (ayrı karar). | ✅ Doğrulandı: build 0 hata; tam suite **351/351** yeşil |
| 2026-08-15 | SEC-012 | **Takvim OAuth state CSRF doğrulaması eklendi.** `GetAuthUrlAsync` rastgele token'ı kullanıcı-bağlı `IDistributedCache`'e yazar (`state="{provider}.{token}"`, 10 dk, tek kullanımlık); `ExchangeCodeAndConnectAsync` FixedTimeEquals ile doğrular+siler, eşleşmezse `BusinessException`. Cookie yerine cache (Application'a ASP.NET Core ref eklememek için); yeni endpoint/JS yok. | ✅ Doğrulandı: build 0 hata; tam suite **351/351** yeşil |
| 2026-08-16 | SEC-003 | **Anonim form cevap-şema doğrulaması eklendi.** `ResponseAppService.ValidateAnswers`: boyut sınırı (1 MB), geçerli JSON nesnesi, anahtarlar yalnız var olan cevaplanabilir bloklara ait (bilinmeyen anahtar reddi), zorunlu bloklar dolu. 3 yeni hata kodu + tr/en. Honeypot+min-süre (KVKK-005) + bu = çöp/spam veri kapandı. Per-tip format + 3.taraf CAPTCHA bilinçle kapsam dışı. | ✅ Doğrulandı: build 0 hata; tam suite **351/351** yeşil |
| 2026-08-16 | CORR-001 | **Negatif/sıfır ödeme tutarı guard'ı.** `RecordPaymentAsync` başına `amount <= 0 → BusinessException(PaymentAmountInvalid)`; yeni hata kodu + tr; 2 birim test. Aşırı ödeme bilinçle serbest (avans/kısmi). | ✅ Doğrulandı: build 0 hata; tam suite **353/353** yeşil (yeni testlerle) |

## Faz 2 — E2E canlı doğrulama (2026-08-15, MSSQL + kullanıcı Chrome oturumu)

Ortam: MSSQL (çalışıyordu, TCP 1433 kapalı ama Shared Memory ile `localhost` bağlanır) → `dotnet ef database update` ile `Add_ConsentRecords` + `Drop_ProjectAnalyses` uygulandı → app `https://localhost:44386` sorunsuz boot. (DbMigrator'ın ilk seed hatası soğuk-DB/şema-uyuşmazlığı kaynaklı geçiciydi.) Doğrulama kullanıcının gerçek Chrome oturumunda (in-app panel oturumsuzdu → ayrı çerez jarı).

| Doğrulama | Sonuç |
|---|---|
| Yasal sayfalar (aydınlatma + gizlilik) | ✅ Render, tüm bölümler + placeholder, konsol hatası yok |
| Giriş footer yasal linkleri | ✅ İkisi de doğru bağlı |
| App boot + retention worker | ✅ Tüm modüller init; `FeedbackAttachmentRetentionWorker` loglarda kayıtlı+başladı |
| Migration'lar (canlı DB sorgusu) | ✅ `AppConsentRecords` oluştu, `AppProjectAnalyses` düşürüldü |
| **Çerez/rıza omurgası (uçtan uca)** | ✅ `AppConsentRecords`'ta kayıt: Type=CookieNotice, SubjectKind=User, Granted=1, PolicyVersion=cookie-v1, SourceRef=/Dashboard, **IP=::1 (sunucuda yakalandı)** |
| `/Admin/Consent` authz gating | ✅ İzin yokken "Erişim reddedildi" → yetki koruması çalışıyor |
| SEC-007 (regresyon) | ✅ Faturalar sayfası + `/api/app/invoice` 200 + `/api/app/report/dashboard-stats` 200 (admin izinli → kilitlenme yok) |

**Canlı gösterilemeyenler (demo veri kısıtı, kod-doğrulandı):** FN-001 (DB'de atanmış görev YOK), form KVKK onayı (KVKK'lı yayınlanmış form YOK), SEC-007 yetkisiz-blok (kısıtlı-izinli kullanıcı yok).

#### FN-004 🟡 `DÜZELTİLDİ` — Yeni `Consents.Default` izni admin'e seed edilmiyor
`/Admin/Consent` sayfası `Consents.Default` istiyor (doğru) ama bu yeni izin hiçbir role otomatik verilmiyordu → host/admin bile analiz panelini göremiyordu (E2E'de "Erişim reddedildi" alındı). AI izin seed'leri eksikliğiyle aynı sınıf.
**Düzeltme (2026-08-15):** `ConsentsPermissionDataSeedContributor` (Application, `LoginScreenPermissionDataSeedContributor` deseninin birebir kopyası): host bağlamında (`context.TenantId == null`) "ADMIN" rolüne `Consents.Default`'ı `IPermissionDataSeeder` ile verir (idempotent, mevcut grant'ları eler). Migration YOK (izin grant'ı veri). Deploy'da DbMigrator çalıştırılınca uygulanır.
**Açık tasarım notu (kiracı kapsamı):** `ConsentAppService.GetAnalyticsAsync` `IMultiTenant` filtresine tabi → panel kiracı-bazlı veri gösterir; rıza kayıtlarının çoğu (form KVKK, AI aktarım, kiracı çerezleri) kiracı-scoped. Kiracı admin'inin KENDİ rıza analizini görmesi isteniyorsa `Consents.Default`'ın paket izin tavanı sistemine ([[project_package_permission_ceiling]]) eklenmesi gerekir — ayrı karar. Bu seeder yalnız host admin'i açar.
**Doğrulama:** build 0 hata; tam suite **351/351** yeşil (sıfır regresyon). Canlı "Erişim reddedildi → görünür" E2E DbMigrator seed sonrası doğrulanacak.

## Faz 1 — Bulgular (1. geçiş)

### Güvenlik

#### SEC-001 🟠 `BEKLİYOR` — Kaynak kontrolüne girmiş sırlar
`appsettings.json` üretim-hassas iki sırrı düz metin taşıyor ve `appsettings.Production.json` bunları **ezmiyor**:
- OpenIddict `Platform_Web:ClientSecret` = `[REDAKTE]`
- `StringEncryption:DefaultPassPhrase` = `[REDAKTE]`

**Kanıt:** [appsettings.json:17,37](src/Apya.Platform.Web/appsettings.json), [appsettings.Production.json](src/Apya.Platform.Web/appsettings.Production.json) (StringEncryption/ClientSecret yok)
**Risk:** Prod bu değerleri environment variable / user-secret ile ezmiyorsa, git'e erişen herkes prod passphrase + client secret'ına sahip.
**Doğrulama gerekli:** Prod sunucusu bu iki değeri env var ile mi sağlıyor? Sağlamıyorsa önem 🔴.
**Öneri:** İki sırrı da environment variable'a taşı; passphrase'i döndür (rotate); `appsettings.json`'dan çıkar.

#### SEC-002 🟠 `DOĞRULANDI` — Kiracı AI API anahtarları git'teki passphrase ile çözülebilir
`AiProviderCredentialStore.ResolveAsync` kiracı AI API anahtarını `IStringEncryptionService.Decrypt` ile çözüyor. Bu servis `StringEncryption:DefaultPassPhrase`'i kullanır — yani SEC-001'deki commit'li `[REDAKTE]`. DB'yi + repoyu gören biri tüm kiracıların OpenAI/AI sağlayıcı anahtarlarını çözebilir.
**Kanıt:** [AiProviderCredentialStore.cs:36](src/Apya.Platform.Ai.Application/Providers/AiProviderCredentialStore.cs)
**Öneri:** SEC-001 ile birlikte çözülür; passphrase döndürülünce mevcut şifreli anahtarların yeniden şifrelenmesi gerekir.

#### SEC-003 🟡 `DÜZELTİLDİ` — Anonim form gönderiminde abuse koruması yok
`ResponseAppService` (`[AllowAnonymous]`) yayınlanmış formlara kimliksiz yanıt kaydediyor. CAPTCHA / özel hız sınırı yok (yalnızca global tenant rate-limit var). Ayrıca `input.Answers` serbest JSON — formun bloklarıyla eşleştiği doğrulanmıyordu → spam + çöp/geçersiz veri.
**Kanıt:** [ResponseAppService.cs](src/Apya.Platform.Application/DynamicAssets/ResponseAppService.cs), DTO [PublicDynamicAssetsDtos.cs](src/Apya.Platform.Application.Contracts/DynamicAssets/PublicDynamicAssetsDtos.cs)
**Düzeltme (2026-08-16):** İki aşamada: (1) KVKK-005 turunda honeypot + min-doldurma-süresi bot koruması eklenmişti (üçüncü taraf CAPTCHA'dan bilinçle kaçınıldı). (2) Bu turda **sunucu-taraflı cevap-şema doğrulaması** (`ResponseAppService.ValidateAnswers`): boyut sınırı (1 MB → `FormAnswersTooLarge`), geçerli JSON nesnesi, **anahtarların yalnız var olan cevaplanabilir bloklara ait olması** (bilinmeyen/tampere anahtar reddi → `FormAnswersInvalid`), zorunlu blokların doldurulması (`FormRequiredAnswerMissing`). Cevaplanabilir küme = public-form.jsx'teki `LAYOUT_ONLY` (SectionHeader/Paragraph hariç) ile aynı; 3 yeni hata kodu + tr/en. Serbest JSON'la çöp/spam veri girişi kapandı.
**Kapsam dışı (bilinçli):** Per-tip değer formatı (email regex, sayı aralığı vb.) doğrulaması — büyük engel, "sade tut". Üçüncü taraf CAPTCHA — mevcut honeypot kararıyla tutarlı, eklenmedi. **Opsiyonel kalan:** anon gönderime IP+slug bazlı özel rate-limit (global tenant limit dışında) + `ResponseAppService.ValidateAnswers` için ithal birim testi (şu an form-submit testi yok → fix build+tam suite 351/351 ile doğrulandı).

#### SEC-008 🟠 `DOĞRULANDI` — Scriban 7.2.1 yüksek önem CVE
Build uyarısı: `Scriban` 7.2.1 paketinde yüksek önemli açık (GHSA-7jvp-hj45-2f2m). Scriban şablon motoru muhtemelen webhook/bildirim gövde şablonlarında kullanılıyor. AutoMapper CVE'siyle (SEC-005) birlikte iki yüksek-önem bağımlılık açığı build'de raporlanıyor.
**Öneri:** Scriban'ı yamalı sürüme yükselt; kullanım yerlerini tara (kullanıcı-girdisi şablona giriyorsa SSTI riski ayrıca değerlendirilmeli).

#### SEC-009 🟠 `DOĞRULANDI` — System.Security.Cryptography.Xml 9.0.16 çoklu yüksek CVE
`dotnet ef` çıktısı: `System.Security.Cryptography.Xml` 9.0.16'da birden çok yüksek önem açığı (GHSA-23rf-6693-g89p, GHSA-8q5v-6pqq-x66h, GHSA-cvvh-rhrc-wg4q, GHSA-g8r8-53c2-pm3f, GHSA-mmjf-rqrv-855v). Muhtemelen transitif (ABP/OpenIddict XML imzalama). AutoMapper (SEC-005) + Scriban (SEC-008) ile birlikte **üç ayrı bağımlılık açığı ailesi** build'de raporlanıyor.
**Öneri:** Bağımlılıkları güncelle; `dotnet list package --vulnerable --include-transitive` ile tam envanter çıkar, tek "bağımlılık güvenlik" PR'ında topla.

#### SEC-012 🟡 `DÜZELTİLDİ` — Takvim OAuth `state` CSRF token olarak doğrulanmıyor
[Callback.cshtml.cs](src/Apya.Platform.Web/Pages/Calendars/Callback.cshtml.cs): `state` yalnız sağlayıcı enum'unu (0/1) taşıyordu; başlangıçta rastgele, kullanıcıya-bağlı bir state üretilip callback'te karşılaştırılmıyordu. `[Authorize]` var (tam anonim değil) ama OAuth **account-linking CSRF** açıktı: kurban (girişli) kandırılıp saldırganın hazırladığı callback URL'ine yönlendirilirse, kod değişimi kurbanın bağlamında yapılır → istenmeyen takvim hesabı bağlanabilir.
**Düzeltme (2026-08-15):** `GetAuthUrlAsync` kriptografik rastgele token (`RandomNumberGenerator` 32 bayt hex) üretip **kullanıcı-bağlı `IDistributedCache` anahtarına** (`calendar-oauth-state:{userId}`, 10 dk, tek kullanımlık) yazar; `state = "{provider}.{token}"`. `ExchangeCodeAndConnectAsync(...,stateToken)` cache'teki token'ı okur, **siler (replay engelle)**, `CryptographicOperations.FixedTimeEquals` ile sabit-zaman karşılaştırır; eşleşmezse `BusinessException` + CSRF uyarı log'u. Callback state'i ayrıştırıp token'ı geçer. Saldırgan kurbanın sunucu-taraflı token'ını bilemez → CSRF kapanır.
**Not (yaklaşım):** Kullanıcı "cookie" (Option A) seçmişti; ancak cookie'yi AppService'ten kurmak Application katmanına ASP.NET Core (`IHttpContextAccessor`) referansı gerektiriyordu (katmanlama ihlali + paket ekleme). Aynı CSRF garantisini (kullanıcıya bağlı) veren, web tipi/paket gerektirmeyen sunucu-taraflı cache'e geçildi (mevcut `IDistributedCache` deseni). Yeni endpoint/JS değişikliği YOK (Option A ruhu korundu).
**Doğrulama:** build 0 hata; tam suite **351/351** yeşil. Canlı CSRF/başarılı-akış E2E gerçek OAuth client id gerektirir (SimulateAuth yolu state'i atlar).

#### SEC-011 🔴 `DOĞRULANDI` — Webhook hedef URL'inde SSRF (full-read)
Kiracı, webhook aboneliğine **herhangi bir hedef URL** girebilir; sunucu doğrulama yapmadan oraya POST eder ve **yanıt gövdesini teslimat log'una kaydeder** (kiracı görür) → sadece kör değil, **full-read SSRF**.
- URL doğrulaması YOK: `WebhookSubscription.SetTargetUrl` yalnız `Check.NotNullOrWhiteSpace + maxLength` ([WebhookSubscription.cs:50,61](src/Apya.Platform.Domain/DynamicAssets/Webhooks/WebhookSubscription.cs)); AppService düz geçiriyor. Şema/iç-IP/host kontrolü hiç yok.
- HttpClient korumasız: `"WebhookClient"` yalnız 15sn timeout ([PlatformApplicationModule.cs:34](src/Apya.Platform.Application/PlatformApplicationModule.cs)) — çözülen IP'yi özel aralıklara karşı denetleyen handler yok.
- Gönderici yanıtı döndürür + kaydeder: [WebhookDeliverySender.cs:36-64](src/Apya.Platform.Application/DynamicAssets/Webhooks/WebhookDeliverySender.cs); `ResendDeliveryAsync` **web isteği içinde senkron** ([WebhookSubscriptionAppService.cs:142](src/Apya.Platform.Application/DynamicAssets/Webhooks/WebhookSubscriptionAppService.cs)) → saldırgan tetikleyip yanıtı okur.
**Etki:** `http://169.254.169.254/` (bulut metadata), `http://localhost:*`, `10./172.16./192.168.` iç servisler. Plesk paylaşımlı barındırmada aynı sunucudaki diğer siteler/servisler. Kiracı-doğrulamalı ama çok-kiracılı → herhangi bir kiracı yöneticisi.
**Öneri:** Abonelikte URL doğrula — `https` zorunlu; host'u çöz ve **loopback/link-local/private/metadata IP'leri reddet** (DNS-rebinding'e karşı bağlantı-anında IP denetleyen handler ideal); mümkünse çıkış allowlist'i. Yanıt gövdesini kiracıya döndürmeyi de gözden geçir.

#### SEC-010 🟠 `DÜZELTİLDİ` — Takvim OAuth token'ları DB'de düz metin
`CalendarAppService` Google/Outlook `AccessToken` ve `RefreshToken`'ı **şifrelemeden** saklıyordu ([CalendarAppService.cs:59-60,68-69,133-134](src/Apya.Platform.Application/Calendars/CalendarAppService.cs) — `existing.AccessToken = input.AccessToken`, hiç `Encrypt` yok). `ExternalCalendarAccount.AccessToken` DB'de ham. DB'ye (ya da yedeğe) erişen biri kullanıcıların Google/Microsoft takvimlerine erişebilir; refresh token uzun ömürlü olduğu için kalıcı erişim. (Passphrase blast-radius araştırmasında bulundu — passphrase'e bağlı DEĞİL.)
**Düzeltme (2026-08-15):** Yeni `CalendarTokenProtector` domain servisi (`IStringEncryptionService` sarmalar; `Volo.Abp.Security` Domain'in transitif kapanışında zaten var → paket eklenmedi). Entity **daima ciphertext** taşır: yazımlar (`ConnectAccountAsync` + `CalendarManager.EnsureFreshTokenAsync`) `Protect`, okumalar (Google/Outlook `BuildClient` + refresh) `Unprotect`. `Unprotect` decrypt başarısızsa boş döner + log → eski düz-metin/rotasyon satırları çökme yerine "yeniden bağla"ya düşer. **Refresh fallback tuzağı düzeltildi**: `json.RefreshToken ?? account.RefreshToken` artık çözülmüş düz-metni fallback kullanıyor (yoksa `EnsureFreshTokenAsync` ciphertext'i tekrar Protect edip **çift şifreleme** yapardı). `AccessToken`/`RefreshToken` kolonları sınırsız (`nvarchar(max)`/`text`) → **şema değişikliği/migration YOK**.
**Doğrulama:** build 0 hata; Domain 166 + Application 42 + EF 93 = **301/301 yeşil** (SEC-010'u kapsayan projeler). Web.Tests SEC-001 test-config'i yüzünden bağımsız kırık (bkz TEST-002) — stash+baseline testiyle SEC-010'dan bağımsızlığı kanıtlandı.
**Rotasyon koordinasyonu:** Token'lar artık `DefaultPassPhrase`'e bağlı. Passphrase rotasyonunda (SEC-001/002) mevcut token'lar okunamaz olur → kullanıcılar takvimi yeniden bağlar (AI anahtarı yeniden-girişiyle aynı sınıf). Prod'da mevcut düz-metin satırlar da ilk sync'te başarısız olur → yeniden bağlama gerekir. Yerelde takvim hesabı sayısı E2E'de teyit edilecek. Bkz [[project_secret_rotation_plan]].

#### SEC-004 ⚪ `BEKLİYOR` — Git geçmişinde sır taraması önerilir
`appsettings.json` şu an OpenAI anahtarını redakte tutuyor (`sk-proj-...[GIZLI_ANAHTAR]...`), ama geçmiş commit'lerde gerçek anahtar bulunmuş olabilir (`git log -S "sk-proj"` commit `582f3af`'i işaret ediyor).
**Öneri:** `gitleaks`/`trufflehog` ile tam geçmiş taraması; bulunursa ilgili anahtarları döndür.

#### SEC-007 🟠 `DOĞRULANDI` — Fatura/Rapor API'leri rol iznini atlıyor (Broken Access Control, OWASP A01)
`InvoiceAppService` sınıf seviyesinde **çıplak `[Authorize]`** (yalnız kimlik doğrulama) taşıyor; hiçbir metodu (`GetListAsync`, `GetAsync`, `CreateAsync`, `AddPaymentAsync`, `GetPaymentsAsync`) `[Authorize(PlatformPermissions.Invoices.*)]` kullanmıyor. Oysa `PlatformPermissions.Invoices.Default` tanımlı ve Razor sayfasında ([Index.cshtml.cs:7](src/Apya.Platform.Web/Pages/Invoices/Index.cshtml.cs)) uygulanıyor. ABP bu servisten otomatik REST API üretir (`/api/app/invoice`) ve proje genelinde global fallback authorization policy **yok** (bkz. [TaskAttachmentController.cs:14](src/Apya.Platform.HttpApi/Tasks/TaskAttachmentController.cs) notu). Sonuç: **fatura izni olmayan bir kiracı kullanıcısı bile** API'ye doğrudan giderek fatura listeleyebilir/oluşturabilir ve **ödeme kaydedebilir**.
Aynı desen: `ReportAppService` ([:17](src/Apya.Platform.Application/Reports/ReportAppService.cs)) ve `TrialBalanceAppService` ([:20](src/Apya.Platform.Application/Reports/TrialBalanceAppService.cs)) çıplak `[Authorize]` — `Reports.Default` izni tanımlı ama uygulanmıyor; finansal özet/mizan izinsiz kullanıcıya sızar.
**Kanıt:** [InvoiceAppService.cs:16,99,121](src/Apya.Platform.Application/Invoices/InvoiceAppService.cs) (metotlarda `[Authorize]` yok)
**Kapsam notu:** Kiracı-arası sızıntı YOK (`IMultiTenant` veri filtresi korur); açık **kiracı içi rol yükseltmesi**. Ayrıca `TaskAppService` `GetListPolicyName` set etmiyor (görev listesi izinsiz) — daha düşük hassasiyet, ama aynı desen; tüm çıplak-`[Authorize]` AppService'ler sistematik taranmalı.
**Öneri:** `InvoiceAppService`/`ReportAppService`/`TrialBalanceAppService` sınıflarına en az `[Authorize(...Default)]`; mutasyon metotlarına (Create/AddPayment) ayrı izin. Fatura için `Create/Edit/Delete` alt-izinleri de tanımlanmalı (şu an yalnız `Default` var).

#### SEC-DEP 🟠 `DOĞRULANDI` — Bağımlılık güvenlik açıkları envanteri (SEC-005/008/009 konsolidasyonu)
`dotnet list package --vulnerable --include-transitive` + advisory doğrulaması. Repo zaten `Directory.Build.props` ile transitif CVE'leri yönetiyor (Scriban 6.3→7.2.1, Xml→9.0.16); bu tur onları güncelliyor.

| Paket | Mevcut | Açık | Yamalı | Katman | Risk / Not |
|---|---|---|---|---|---|
| **Scriban** | 7.2.1 | GHSA-7jvp-hj45-2f2m (mass-assignment/SSTI) | **7.2.2** | Runtime (ABP TextTemplating) | 🟢 Temiz yama, patch bump. ABP 7.x'i tolere ediyor. Kullanıcı girdisi şablona giriyorsa SSTI açısı ayrıca değerlendirilmeli (webhook/bildirim şablonları). |
| **AutoMapper** | 14.0.0 | GHSA-rvv3-g6hj-g44x (DoS) | **YOK (ücretsiz)** | Runtime (her yerde) | 🔴 **Temiz fix yok:** AM15 TİCARİ (ücretli lisans), 14.x'e yama gelmeyecek, ABP'nin kendisi de 14'te kalıyor. Karar gerekir (bkz. plan). |
| **System.Security.Cryptography.Xml** | 9.0.16 | 5× GHSA (CVE-2026-50648 vb., DoS) | **9.0.18** (veya 10.0.10) | **Dev/build-only** (`PrivateAssets=all`) | 🟢 Prod'a GİTMİYOR; yine de bump. Düşük risk. |
| **SQLitePCLRaw.lib.e_sqlite3** | 2.1.11 | GHSA-2m69-gcr7-jv3q | (yamalı sürüm) | **Test-only** | 🔵 Yalnız test projelerinde, sevk edilmiyor. Düşük öncelik. |

**Öneri — 3 kademe:**
- **Kademe 1 (güvenli, düşük risk):** Scriban 7.2.1→7.2.2 + Xml 9.0.16→9.0.18 (`Directory.Build.props`) + SQLite test override. Build+308 test ile doğrula.
- **Kademe 2 (AutoMapper — iş kararı):** temiz ücretsiz fix yok. Seçenekler: (a) riski kabul+izle (DoS, iç mapping → pratik sömürü düşük) [mevcut durum], (b) AM15 ticari lisans + ABP'yi AM15-uyumlu sürüme yükselt (maliyet + framework upgrade regresyon riski), (c) ABP'nin Mapperly/Mapster geçişini bekle. **Öneri: (a), kararı kaydet.**
- **Kademe 3 (ABP framework upgrade):** 10.0.2 → en son 10.x. Scriban/Xml CVE'lerini de kökten çözebilir ama geniş regresyon + canlı QA gerektirir; ayrı proje.

**Olumlu (güvenlik):** Yetkilendirme kapsamı güçlü — `[Authorize]` taşımayan her sınıf ya ölü stub ya bilinçli `[AllowAnonymous]`. Dosya yükleme path-traversal koruması (`ResolveSafePath`), KVKK ekleri wwwroot dışında (`FeedbackFileStorage` App_Data), uzantı+boyut allowlist'i, antiforgery refresh, prod'da Swagger kapalı, CSP ihlal raporlama, tenant rate-limit — hepsi mevcut.

### Mimari & Veri Bütünlüğü

#### ARCH-001 🟠 `AÇIK` (niyet onayı gerekli) — Çift taraflı defter iş akışına bağlı değil
`JournalEntryManager` + `LedgerIntegrityGuard` + `JournalEntry` (ΣDebit=ΣCredit zorlayan, idempotent, tenant-savunmalı, tam kaliteli bir defter) yalnızca kendi `Accounting/` klasörü içinde referanslanıyor — **hiçbir AppService, Manager veya HttpApi çağırmıyor.** Gerçek para akışı (`InvoiceManager.RecordPaymentAsync`) `CustomerLedgerEntry` + `CashMovement`'ı doğrudan yazıyor, denge-zorlayan guard'ı **atlayarak**. Yani reklamlanan "çift taraflı muhasebe" gerçek işlemlerde çift-kayıt dengesini **zorlamıyor**.
**Kanıt:** `JournalEntryManager` referansları yalnızca [Accounting/Services/](src/Apya.Platform.Domain/Accounting/Services/) içinde; [InvoiceManager.cs:96,201,219](src/Apya.Platform.Domain/Invoices/InvoiceManager.cs) CustomerLedger/CashMovement'ı doğrudan kullanıyor.
**Karar gerekli:** Bu defter (a) yarım kalmış bir özellik mi, (b) gelecekteki migrasyon için mi, (c) terk mi? CLAUDE.md gereği silmiyorum — niyetini soruyorum.

#### CORR-004 🟡 `DOĞRULANDI` — `DateTime.Now` sızıntısı → saat dilimi hataları (özellikle hibe son tarihleri)
Bazı servisler ABP zaman soyutlaması (`Clock.Now`) yerine ham `DateTime.Now` kullanıyor. `DateTime.Now` sunucunun yerel saatini döner, `IClock`'un UTC normalizasyonunu atlar. TR kullanıcı (+03) ile UTC sunucuda "bugün" sınırı gece yarısı 3 saat kayar → tarih kovalama ve son-tarih karşılaştırmaları hatalı olabilir.
**Kanıt:** [GrantApplicationAppService.cs:122](src/Apya.Platform.Application/Grants/GrantApplicationAppService.cs), [GrantRecommendationAppService.cs:84](src/Apya.Platform.Application/Grants/GrantRecommendationAppService.cs) (hibe çağrısı `today` karşılaştırması), [ShellAppService.cs:187,220](src/Apya.Platform.Application/Shell/ShellAppService.cs), [FeedbackAdminAppService.cs:622](src/Apya.Platform.Application/Feedbacks/FeedbackAdminAppService.cs), [SystemHealthAppService.cs:375](src/Apya.Platform.Application/Telemetry/SystemHealthAppService.cs)
**Not:** `ProjectAppService`/`ReportAppService` daha önce bilinçli `Clock.Now`'a çevrilmiş (ARCH-043/046) — bu servisler geride kalmış. En riskli: hibe son-tarih "bugün" sınırı (çağrı açık/kapalı yanlış görünebilir).
**Öneri:** Hepsini `Clock.Now`'a çevir (tek satırlık cerrahi değişiklikler).

#### CORR-001 🔵 `DÜZELTİLDİ` (kısmi — kasıtlı) — Ödeme kaydında negatif/sıfır tutar guard'ı yok
`RecordPaymentAsync` sıfır/negatif `amount`'ta da bir `Payment` satırı üretiyordu (side-effect'ler `amount > 0` ile korunuyordu ama satır oluşup `payments.Sum`'ı → fatura durumunu kirletiyordu).
**Kanıt:** [InvoiceManager.cs](src/Apya.Platform.Domain/Invoices/InvoiceManager.cs) `RecordPaymentAsync`
**Düzeltme (2026-08-16):** Metot başına `if (amount <= 0) throw BusinessException(PaymentAmountInvalid)` guard'ı (invoice sorgusundan önce). Yeni hata kodu `Platform:Payment:AmountInvalid` + tr mesajı (mevcut Payment kodları tr-only → aynı desen). **2 birim test** eklendi (0 ve -100 → `BusinessException` + Insert yok). **Aşırı ödeme (amount > fatura kalanı) bilinçle ENGELLENMEDİ** — avans/kısmi ödeme kasıtlı olabilir (iş kuralı kararı; blokla­mak isteniyorsa ayrı iş).
**Doğrulama:** build 0 hata; tam suite **353/353** yeşil (Application 42→44).

### İşlevsel (çalışmayan / eksik)

#### FN-001 🟡 `DOĞRULANDI` — Proje Detay "Atanan" filtresi hep boş
`ProjectAppService.GetDetailAsync` görevleri `_taskRepository.GetListAsync(...)` (Assignee navigasyonu **include edilmeden**) çekip ham AutoMapper ile map'liyor. Profil `AssigneeName`'i `src.Assignee.UserName`'den map'liyor ama navigasyon null → `AssigneeName` daima null. Razor tarafı bu alana göre atanan listesini kurduğu için filtre hep boş.
**Kanıt:** [ProjectAppService.cs:255](src/Apya.Platform.Application/Projects/ProjectAppService.cs), profil [PlatformApplicationAutoMapperProfile.cs:60](src/Apya.Platform.Application/PlatformApplicationAutoMapperProfile.cs), tüketim [ProjectDetails.cshtml:37](src/Apya.Platform.Web/Pages/Projects/ProjectDetails.cshtml), teşhis notu [ProjectDetails.js:814](src/Apya.Platform.Web/Pages/Projects/ProjectDetails.js)
**Öneri:** `TaskAppService`'teki batch-fill desenini uygula — task'ları map'ledikten sonra assignee id'lerini toplu Identity aramasıyla doldur.

#### FN-002 🟡 `BEKLİYOR` — NotImplementedException fırlatan uçlar UI'dan erişilebilir mi?
`ProjectAppService` üç stub `NotImplementedException` fırlatıyor: `GetAnalysisAsync`, `AddAnalysisAsync`, `GetSuitableGrantsAsync`. Bir buton/link bunları çağırıyorsa kullanıcı 500 alır.
**Kanıt:** [ProjectAppService.cs:228-244](src/Apya.Platform.Application/Projects/ProjectAppService.cs)
**Doğrulama:** E2E fazında "Proje analizi" / "Uygun hibe" tetikleyicileri var mı, çağırıyorlar mı?

### KVKK / Veri Koruma (TR öncelikli → AB → Dünya)

#### KVKK-001 🔴 `DOĞRULANDI` — Aydınlatma/gizlilik altyapısı hiç yok
Kod tabanında aydınlatma metni, gizlilik politikası sayfası, çerez bildirimi veya rıza kaydı **hiçbir yerde yok** (`kvkk|aydınlatma|gizlilik|privacy|consent` taraması: UI'da sıfır eşleşme — tek istisna form-builder'daki işlevsiz toggle, bkz. KVKK-005). Platform kişisel veri işliyor: kullanıcı hesapları, `Customer` (VKN/TCKN, adres, telefon, e-posta — şahıs firmasında TCKN = kişisel veri), `ClientIpAddress`+`UserAgent` telemetrisi, geri bildirim ekran görüntüleri.
**KVKK md. 10** aydınlatma yükümlülüğü karşılanmıyor.
**Öneri (Dalga 1):** Aydınlatma metni + gizlilik politikası sayfaları; giriş ekranı ve footer'dan link; kayıt/giriş akışına atıf.

#### KVKK-002 🟠 `DOĞRULANDI` — Yurt dışına veri aktarımı: AI sağlayıcıları + takvim
Kiracı içeriği yurt dışı işleyicilere gidiyor:
- **AI:** OpenAI (ABD), Anthropic/Claude (ABD), **DeepSeek (Çin)** — `AiTaskGeneratorAppService.ParseDocumentFromBytesAsync` yüklenen belgenin **tam metnini** gönderiyor ([AiTaskGeneratorAppService.cs:112](src/Apya.Platform.Ai.Application/AiTaskGeneratorAppService.cs)); prompt'lar görev/proje verisi taşıyor.
- **Takvim:** Google Calendar / Microsoft Outlook senkronu.

**KVKK md. 9** (yurt dışına aktarım): standart sözleşme/yeterlilik kararı/açık rıza gerekir; aydınlatmada aktarım açıkça belirtilmeli. DeepSeek (Çin) özellikle değerlendirilmeli.
**Öneri:** Aydınlatmada AI/takvim aktarımını açıkça say; kiracıya AI'yı kapatma seçeneği zaten tenant-bazlı — bunu "aktarım onayı" akışına bağla; DeepSeek'i TR müşterileri için varsayılan dışı bırakmayı değerlendir.

#### KVKK-003 🟡 `DOĞRULANDI` — Anonim form dolduranlara hiçbir aydınlatma gösterilmiyor
`/F/{slug}` genel formları kimliksiz kişilerden veri topluyor; yanıtlar kişisel veri içerebilir. Formu dolduran kişiye aydınlatma metni/rıza kutusu gösteren hiçbir mekanizma yok ([Pages/F/](src/Apya.Platform.Web/Pages/F/) taraması boş). Kiracı = veri sorumlusu, platform = veri işleyen; platformun bildirim mekanizmasını sağlaması gerekir.
**Öneri:** KVKK-005 düzeltilirken form sayfasına kiracı-tanımlı aydınlatma bloğu + zorunlu onay kutusu ekle.

#### KVKK-004 🟡 `AÇIK` — Saklama süresi boşlukları
Telemetri saklama süresi ayarlanabilir (7–3650 gün, worker siliyor — iyi), bildirimler 90 gün (iyi). Ama ayar açıklaması açıkça diyor: **"Geri bildirimler bu süreden etkilenmez"** ([tr.json:555](src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json)) — KVKK'lı ekran görüntüsü taşıyan geri bildirim ekleri **süresiz** saklanıyor. Ölçülülük ilkesine aykırı.
**Öneri:** Geri bildirimlere ayrı saklama süresi + worker; muhasebe verisi için VUK saklama yükümlülüğüyle (5-10 yıl) çelişmeyen ayrı politika.

#### KVKK-005 🟠 `DOĞRULANDI` — "KVKK onayı iste" ve "Captcha" anahtarları kayıt ediliyor ama UYGULANMIYOR
Form builder yayınlama ayarlarında dört anahtar (Başlangıç, Bitiş, KVKK onayı, Captcha) yalnızca JSON'a kaydediliyor; UI ipucu kendisi itiraf ediyor: *"hiçbiri gerçekten UYGULANMIYOR. Form, bitiş tarihi geçse de herkese açık kalır; KVKK kutucuğu ve captcha genel formda görünmez."*
**Kanıt:** [form-builder.jsx:490-495](src/Apya.Platform.Web/wwwroot/dynamic-assets/src/form-builder.jsx)
**Risk:** Kiracı KVKK onayı topladığını sanır — toplanmıyor (uyum tuzağı). Bitiş tarihi geçen form açık kalır. Captcha yok → SEC-003'ü büyütür.
**Öneri:** Dört ayarı uçtan uca uygula: `PublicDocumentAppService.GetBySlugAsync` + `ResponseAppService.SubmitAsync` tarih penceresini ve KVKK onay zorunluluğunu doğrulasın; forma onay kutusu + captcha render edilsin.

#### KVKK-006 🟡 `AÇIK` — Veri sahibi hakları (md. 11) mekanizması yok
Verisini görme/düzeltme/silme/taşıma talepleri için hiçbir akış yok (kişisel veri dışa aktarımı, hesap silme talebi, başvuru formu). AB fazında GDPR md. 15-20 (erişim, taşınabilirlik) bunu zorunlu kılar.
**Öneri (Dalga 2):** "Verilerim" sayfası: kişisel veri dökümü (JSON/PDF) + silme talebi akışı (muhasebe kayıtları VUK istisnasıyla).

#### KVKK-007 ⚪ `BEKLİYOR` — Veri lokasyonu doğrulanmalı (kullanıcıya soru)
Plesk paylaşımlı Windows barındırma (`apya.pargetto.com.tr`) — sunucu ve MSSQL **hangi ülkede**? TR'de ise yurt içi işleme; değilse tüm kiracı verisi md. 9 kapsamında yurt dışında demektir ve KVKK-002'nin kapsamı büyür.

**Olumlu (KVKK):** Üçüncü taraf analitik/izleyici hiç yok (çerezler yalnız oturum/antiforgery/kültür — zorunlu çerez); geri bildirim ekran görüntüleri bilinçli wwwroot dışında ve yetkiyle servis ediliyor; telemetri saklama süresi ayarlanabilir ve worker'la siliniyor; IP/UA alanları uzunluk-sınırlı.

**Kod dışı (organizasyonel) yapılacaklar:** VERBİS kayıt değerlendirmesi, veri işleme envanteri, kiracılarla veri işleyen sözleşmesi (DPA), AI sağlayıcılarıyla standart sözleşme, personel aydınlatması.

**Yol haritası:** **Dalga 1 (TR):** KVKK-001+003+005 (aydınlatma sayfaları + form onay/captcha/tarih penceresi) → KVKK-004 (feedback retention) → KVKK-002 (aktarım aydınlatması). **Dalga 2 (AB):** KVKK-006 (erişim/taşınabilirlik/silme akışı), DPA şablonları. **Dalga 3 (Dünya):** GDPR tabanı büyük ölçüde yeter; bölgesel farklar (CCPA vb.) o gün değerlendirilir.

### İşlevsel (devam)

#### FN-003 🟠 `DOĞRULANDI` — Form yayınlama ayarlarının 4'ü de işlevsiz
KVKK-005 ile aynı kök: Başlangıç/Bitiş tarihi, KVKK onayı, Captcha yalnız kaydediliyor, hiçbiri sunucu tarafında uygulanmıyor. Bitiş tarihi geçen kampanya formu süresiz açık kalır.
**Kanıt:** [form-builder.jsx:493](src/Apya.Platform.Web/wwwroot/dynamic-assets/src/form-builder.jsx), sunucu tarafı: [PublicDocumentAppService.cs](src/Apya.Platform.Application/DynamicAssets/PublicDocumentAppService.cs) yalnız `Status == Published` kontrol ediyor, tarih penceresi yok.

### Performans

#### PERF-001 🔵 `DOĞRULANDI` — Host-admin akışlarında sınırsız `GetListAsync()` + kiracı-döngüsü N+1
Birkaç host-yönetici akışı tüm tabloyu belleğe çekiyor veya kiracı listesinde döngü içinde sorgu atıyor:
- [GrantApplicationHostAppService.cs:169,184,199](src/Apya.Platform.Application/Grants/GrantApplicationHostAppService.cs) — `foreach (tenant in GetListAsync())` içinde per-tenant sorgu (kiracı sayısı büyürse N+1).
- [TaskAppService.cs:460,524](src/Apya.Platform.Application/Tasks/TaskAppService.cs) — tüm proje/etiket lookup'ı sınırsız çekiliyor.
- [FeedbackAdminAppService.cs:573](src/Apya.Platform.Application/Feedbacks/FeedbackAdminAppService.cs), [SystemHealthAppService.cs:321,337](src/Apya.Platform.Application/Telemetry/SystemHealthAppService.cs) — tüm kiracılar.
**Not:** Hepsi host-admin, düşük frekans → düşük öncelik. Dashboard sıcak yolu N+1'i zaten batch'liyor (iyi).
**Öneri:** Kiracı sayısı büyüdüğünde ele al; şimdilik izle.

#### PERF-002 ⚪ `AÇIK` (bilinen) — Kur cache hâlâ ertelenmiş
Döviz kuru aramaları cache'lenmiyor ([ExchangeRates](src/Apya.Platform.Application/ExchangeRates/) altında `IDistributedCache` yok); `InvoiceManager` ödeme başına DB sorgusu yapıyor. Performans altyapısı dalgalarında bilinçli ertelenmişti. ARCH-012 ile DB-side LIMIT 1 + composite index eklendiği için akut değil.
**Öneri:** Sıcak yol ölçülürse `IDistributedCache` ile (TenantId, FromCcy, ToCcy, Date) anahtarlı cache.

### Test / CI

#### TEST-001 🟡 `DOĞRULANDI` — 8 ana-sayfa smoke testi kırık (pre-existing)
`Apya.Platform.Web.Tests` içinde `Smoke_Tests.Page_ReturnsOkOrRedirect` 8 ana sayfa için düşüyor: `/Customers`, `/Projects`, `/Invoices`, `/Expenses`, `/CashMovements`, `/ExchangeRates`, `/Reports/TrialBalance`, `/Tasks`, `/Grants` (test host'unda 200-399 dışı dönüyor). **Bu oturumdaki çerez/rıza değişikliğinden ÖNCE de vardı** (baseline'da tıpatıp 42/50) → regresyon değil, mevcut kırıklık. Suite bütünü: Domain 166 ✅, Application 42 ✅, EF 93 ✅, Web 42/50.
**Doğrulama gerekli:** Gerçek 500 mü yoksa test-host kurulum sorunu mu (seed/DB)? Hata iletisi boş döndü, exception detayı çıkarılmalı. Canlıda bu sayfalar çalışıyor (prod QA geçmişi) → muhtemelen test-host'a özgü, ama CI yeşil değil.
**Öneri:** Bir sayfanın test-host exception'ını yakala (ITestOutputHelper/log), kök nedeni bul; CI'yi yeşile çek.
**✅ GÜNCELLEME (2026-08-15):** ARCH-001+FN-002 ölü kod kaldırıldıktan sonra bu 8 hata **artık yeniden ÜRETİLMİYOR** → suite tam yeşil (351/351). Güçlü hipotez: model'den çıkarılan `ProjectAnalysis` entity'si test-host'un SQLite şema oluşturmasını bozuyordu (Accounting'in DbSet'i olmadığından etkileyemezdi; tek DB-mapped ölü entity ProjectAnalysis'ti). **Teyit edildi:** iki ardışık tam koşuda 50/50 (flake değil). Bu oturumda 6+ kez tutarlı 42/50 → değişiklikten sonra 50/50 × 2. **TEST-001 = DÜZELTİLDİ (suite tam yeşil 351/351).**

**🔁 DÜZELTME (2026-08-15, devam oturumu — asıl kök neden):** Yukarıdaki "50/50" **o worktree'de `abp install-libs` yapılmış olduğu için**ti, ölü kod kaldırma yüzünden değil. TEST-002 (OpenIddict seed) düzeltilip host boot edince bu 8 sayfa hâlâ 500 dönüyor; gerçek istisna **`Volo.Abp.AbpException: Could not find file '/libs/abp/core/abp.css'`** → taze worktree'de `wwwroot/libs/` boş (client lib'ler kurulmamış). Ağır layout/bundle referansı olan 8 sayfa render'da patlıyor; hafif/redirect eden 42 sayfa etkilenmiyor. **Kök neden kod değil ORTAM:** `abp install-libs` gerekli (bkz [[project_test_infra]], [[reference_local_qa_gotchas]]). install-libs sonrası bu 8 geçer → suite 351/351. TEST-001 = **ortamsal ön-koşul**, kod hatası değil.

#### TEST-002 🟠 `DÜZELTİLDİ` — SEC-001 sır boşaltması taze build'de tüm Web.Tests host'unu kırıyor
SEC-001 (`48b34af`) `appsettings.json`'daki `OpenIddict:Applications:Platform_Web:ClientSecret`'i boşalttı. `Apya.Platform.Web.Tests` bu appsettings'i (Web projesi referansı üzerinden `CopyToOutputDirectory`) test bin'ine miras alıyor. `OpenIddictDataSeedContributor.CreateApplicationAsync` gizli (Confidential) istemci için boş secret'ta `BusinessException("TheClientSecretIsRequiredForConfidentialApplications")` fırlatıyor ([OpenIddictDataSeedContributor.cs:150-154](src/Apya.Platform.Domain/OpenIddict/OpenIddictDataSeedContributor.cs)) → `PlatformTestBaseModule.SeedTestData` → **modül init'i patlıyor → host'a bağlı 50 testin 45'i düşüyor** (yalnız host gerektirmeyen 5 geçiyor). Domain/Application/EF projeleri etkilenmiyor (OpenIddict app seed etmiyorlar → 301/301 yeşil).
**Kanıt:** Taze worktree'de `dotnet build` + test → Web.Tests 5/50; SEC-010 değişikliği stash'lenip baseline `6c3d457` yeniden derlenince **birebir aynı** hata (satır 153) → SEC-010'dan bağımsız, pre-existing. Sicildeki eski "351/351 yeşil" muhtemelen **bayat test bin'iyle** (`--no-build`, boşaltmadan önceki secret kopyası) ölçülmüştü; CI / temiz clone'da suite kırık.
**Düzeltme (2026-08-15):** `PlatformWebTestModule.PreConfigureServices`'te in-memory config kaynağı (`ReplaceConfiguration`) ile test-only dummy `OpenIddict:Applications:Platform_Web:ClientSecret` = `"test-only-not-a-real-secret"` verildi (prod sırrı DEĞİL; gerçek OAuth yapılmıyor, seed'in Confidential kontrolünü geçmesi için yeterli). Dosya çakışması yok (appsettings'i in-memory ezer). **Sonuç: Web.Tests host boot ediyor → 45 hata → 8 hata** (kalan 8 = TEST-001, aşağıda, ayrı ortamsal sebep).

### Temizlik

#### CLEAN-001 ⚪ `AÇIK` — Ölü stub dosyalar
"Bu dosya artık kullanılmıyor / Moved to..." diyen boş stub'lar duruyor:
[Application/Projects/ProjectTaskAppService.cs](src/Apya.Platform.Application/Projects/ProjectTaskAppService.cs), [Application/AiTasks/AiTaskGeneratorAppService.cs](src/Apya.Platform.Application/AiTasks/AiTaskGeneratorAppService.cs), [Application/Tasks/Drafts/DraftTaskAppService.cs](src/Apya.Platform.Application/Tasks/Drafts/DraftTaskAppService.cs)
**Öneri:** Sil (ayrı küçük temizlik PR'ı). CLAUDE.md gereği silmeden önce onay.

---

## Hafızadan taşınan açık borçlar (bu oturumda yeniden doğrulanmadı)

| ID | Önem | Konu | Kaynak |
|---|---|---|---|
| SEC-005 | 🟡 | AutoMapper CVE-2026-32933 dev'de açık (14.x fix yok) → ABP'yi AM15-uyumlu sürüme yükselt | project_automapper_cve |
| CORR-002 | ✅ | **KAPANDI (yanlış/bayat not).** Feedback `nextval` çift-DB açığı zaten çözülmüş: SqlServer `20260811121727_Add_FeedbackNumberSequence` + Postgres `ExtendFeedbackManagement` ikisi de `AppFeedbackNumberSeq`'i şemasız (default) oluşturur; `FeedbackNumberGenerator` çalışma-anında sağlayıcıya göre `NEXT VALUE FOR` / `nextval` seçer, sorgu şemaları eşleşir. Doğrulandı 2026-08-16. | project_dual_db_provider |
| SEC-006 | 🟡 `KARAR GEREKLİ` | **AI Center kiracı-facing paket özelliği** (`PackageFeatureGates.AiAssist` tüm `Ai.*`'ı gate'ler; `ai.AiProviderConfigs` kiracı-bazlı; menü kiracı bağlamında). Hiçbir role AI izni seed edilmiyor → AiAssist açık olsa bile kimse AI Center'ı göremiyor. **FN-004 gibi host-admin seed YANLIŞ olur** (host operatör kiracı AI'ını çalıştırmaz). Doğru fix: AiAssist paketli kiracının admin rolüne AI izinlerini grant et → **paket-izin sistemine entegrasyon (mimari karar, FN-004 kiracı-kapsamıyla aynı sınıf)**. 2026-08-16 karakterize edildi. | project_ai_evaluation_center, project_package_permission_ceiling |
| UX-001 | 🔵 | Mobil denetimden kalan TR localization eksikleri | project_mobile_design_review |
| QA-001 | 🟡 | Etkileşimli QA yapılmadan merge: kayıtlı görünümler #161, dashboard #168, projeler konsolu #169 → E2E ilk hedefleri | ilgili proje kayıtları |
| QA-002 | 🔵 | Bildirim hiyerarşisi #166 canlı QA açık | project_notification_hierarchy |
| CORR-003 | 🔵 | Görev detay modalı Faz 1 gerçek-bağlama işi commit'siz kalmıştı — kod duruyor mu? | project_task_detail_modal |

---

## Sonraki adımlar

1. **SEC-001 doğrulaması** (prod env var mı?) → cevaba göre SEC-001/002 önemini kesinleştir.
2. **ARCH-001 niyet kararı** (kullanıcı) → defter yarım mı, migrasyon mu, terk mi?
3. **KVKK-007 doğrulaması** (kullanıcı): Plesk sunucusu/DB hangi ülkede?
4. KVKK Dalga 1 düzeltmeleri (onay sonrası): aydınlatma sayfaları + form KVKK/captcha/tarih penceresi (KVKK-001/003/005 + FN-003) + feedback retention (KVKK-004).
5. Faz 1'i genişlet: N+1 taraması, kur cache, dashboard sorguları, kalan AppService'lerin izin haritası.
6. **Faz 2 (E2E)** ortam kurulumu → QA-001 hedeflerinden başla.
