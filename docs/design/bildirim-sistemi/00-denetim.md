# Bildirim ve Proaktif Uyarı Sistemi — Faz 0: Mevcut Durum Denetimi

> 2026-09-17 · Kapsam: `Apya.Platform` çekirdek + `Apya.Platform.Ai`
> Bu belge **ölçüm** belgesidir; ne yapılacağını değil, bugün ne olduğunu kaydeder.
> Kararlar ve uygulama planı: [`01-plan.md`](01-plan.md)

---

## 0. Yönetici özeti

Görev tanımı "merkezi bir Notification & Alert Infrastructure kur" diyor.
**Ölçüm bunun gerekmediğini gösteriyor: altyapı kurulu, çalışıyor ve olgun.**

Gerçek eksikler üç başlıkta toplanıyor:

1. **Kapsama boşluğu (asıl iş).** Finans/bütçe ekseni bildirim üretmiyor —
   `ProjectBudgets`, `Expenses`, `Incomes`, `Invoices`, `CashAccounts`, `FxRevaluations`
   altında `NotificationManager` **hiç enjekte edilmemiş**. Bütçe revizyonu, dilim
   tahsilatı, kesinti, limit aşımı: hepsi sessizce oluyor.
2. **Yönetim boşluğu.** Şablon / kural / gönderim kaydı yalnız Hibe modülünde var
   (`GrantNotificationTemplate` + `/Grants/NotificationTemplates`). Platform geneli için yok.
3. **Sarkan uçlar.** Kayıtlı ama hiç üretilmeyen iki tür (`Mention`, `ProjectMemberAdded`),
   dinleyicisi olmayan iki olay, kullanılmayan bir bağımlılık.

Doğru iş: **yeni motor yazmak değil**, var olan motoru finans eksenine bağlamak ve
Hibe'de kanıtlanmış şablon desenini gerektiği kadar genele çıkarmak.

---

## 1. Mevcut bildirim altyapısı

### 1.1 Katman yerleşimi

| Katman | Dosyalar | Sorumluluk |
|---|---|---|
| `Domain.Shared/Notifications` | `NotificationType` (27 tür), `NotificationCategory` (7), `NotificationSeverity` (4), `NotificationConsts`, `NotificationTypeRegistry` | Tür kaydı: kategori, varsayılan aciliyet, ikon, derin link şablonu, gruplama, zorunluluk |
| `Domain/Notifications` | `Notification`, `NotificationPreference`, `NotificationManager`, `NotificationDomainEventHandler`, `NotificationDigestWorker`, `NotificationCleanupWorker` | Entity, tercih, dispatcher, olay köprüsü, özet + temizlik işçileri |
| `Application.Contracts/Notifications` | `INotificationAppService`, `NotificationDto`, `GetNotificationsInput`, `NotificationSummaryDto`, `NotificationPreferenceDto` | Listeleme, özet, okundu, tercih sözleşmesi |
| `Application/Notifications` | `NotificationAppService` | Sorgu, okundu/silme, tercih yazma |
| `Web/Notifications` | `NotificationBellViewComponent`, `NotificationToolbarContributor`, `SignalRNotificationEventHandler` | Zil, toolbar kaydı, anlık yayın |
| `Web/Pages/Notifications` | `Index.cshtml(.cs/.js)` | Bildirim merkezi |

### 1.2 Görev tanımındaki yetenekler — karşılık tablosu

| İstenen (§6–§9, §15, §16) | Durum | Karşılığı / not |
|---|---|---|
| Notification veri modeli | ✅ | `Notification`: TenantId, UserId, Type, Category, Severity, Title, Body, EntityType, EntityId, GroupKey, OccurrenceCount, LastOccurredAt, ActorUserId/Name, IsRead, ReadAt + `FullAudited` |
| `ActionUrl` | ✅ farklı biçimde | Saklanmaz, **türden türetilir** (`BuildDeepLink`) — bayat link kalmasın diye. Bilinçli karar |
| `SourceModule` | ✅ farklı biçimde | Ayrı alan yok; `Category` bu rolü taşıyor |
| `ExpiresAt`, `Metadata` | ❌ | Yok. Bugün ihtiyaç doğuran bir akış da yok |
| Dispatcher | ✅ | `NotificationManager.PublishAsync` |
| Recipient Resolver | ⚠️ kısmi | Genel bileşen yok; her çağrı noktası alıcıyı kendi çözüyor. Hibe'de `GrantNotificationDispatcher.DispatchToTenantAsync` bu rolü üstlenmiş |
| Rules Engine (koşul + kanal + öncelik) | ⚠️ yalnız Hibe | `GrantNotificationTemplate` (aç/kapa + kanal + metin) + `GrantNotificationTriggerRegistry` (tetikleyici → tür + değişken listesi) |
| NotificationPreference | ✅ | Kategori bazlı `InApp`/`Email`. Kayıt yoksa varsayılan: `InApp=true`, `Email=false` |
| In-App (zil, rozet, merkez, filtre, okundu) | ✅ | `NotificationBell` + `/Notifications` (kategori ağacı, önem eşiği, metin araması, sıralama) |
| Real-time | ✅ | `NotificationHub` → `/notification-hub`, `Clients.User(...)` |
| E-posta | ✅ | Kritikler anında, gerisi günlük özet |
| Deduplication / Grouping | ✅ | `GroupKey` + `OccurrenceCount` + `Repeat()`; okunmamış satır varsa yeni satır açılmaz |
| Digest | ✅ | `NotificationDigestWorker`, 24 saat, `Severity < Critical` |
| Retention / arşiv | ✅ | `NotificationCleanupWorker`, 90 gün, okunmuş **ve** soft-delete edilmiş satırları hard delete |
| Tenant izolasyonu + kişisellik | ✅ | `IMultiTenant`; AppService host dahil herkesi kendi `UserId`'sine kilitler |
| Yetki ihlali üretmeme (§17) | ✅ | Derin link normal sayfaya gider, sayfanın izin denetimi işler — bypass yok. ⚠️ Ama **gövde metni** veriyi taşır (bkz. §4.3) |
| Veritabanı performansı (§16) | ✅ | 4 bileşik indeks + INCLUDE; rozet sayımı indeksten çıkıyor (ayrıntı §1.4) |
| Escalation | ❌ | Yok |
| Quiet hours / digest sıklığı | ❌ | Özet sabit 24 saat |
| Tür bazlı (kategori değil) tercih | ❌ | Tercih kategori granülaritesinde |
| Admin: şablon yönetimi | ⚠️ yalnız Hibe | `/Grants/NotificationTemplates` + 14 şablon seed'i |
| Admin: teslim logu / analitik | ❌ | `GrantNotificationLog` yalnız "bu eşik gönderildi" tekilliği; teslim/okunma logu değil |
| Push / SMS / Teams / Slack | ❌ (ilk fazda istenmiyor) | Kanal soyutlaması da yok: `PublishAsync` içinde in-app + e-posta sabit |

### 1.3 Tasarımda kanıtlanmış kararlar — **korunacak**

Kod içinde gerekçeleriyle yazılı. Yeni tasarım bunları bozmamalı:

- **Tek kayıt noktası** (`NotificationTypeRegistry`): kategori, aciliyet, ikon, derin link,
  gruplama tek yerde. Önceden üç yere dağılmıştı (handler'daki emoji, AppService'teki switch,
  JS'teki sınıf adı).
- **Zorunlu türler** (`Mandatory`): kullanıcı tercihi kapalı olsa bile üretilir; yalnız hak
  kaybına yol açan olay için. Zorunluluk **tek yerde** tanımlı, `GrantNotificationTriggerRegistry`
  oradan okur.
- **Şablon "gönderilebilir mi", tercih "istiyor mu"** sorusunu yanıtlar — iki ayrı kapı.
- **E-posta varsayılan KAPALI** — açık olsaydı mevcut her kullanıcı istemeden özet almaya başlardı.
- **Alıcı kitlesi şablonda tutulmaz**, tetikleyiciden türer — host'un seçtiği kitle ile kodun
  yazdığı kitle sessizce ayrışmasın diye.
- **`GrantNotificationLog`'da soft delete yok** — tekil indeks silinmiş satırlarla dolarsa
  aynı eşik bir daha hiç gönderilemez.
- **Derin link saklanmaz, türetilir** — sayfa taşındığında eski satırlar ölü linke düşmesin diye.

### 1.4 Veritabanı (§16 karşılığı — zaten yapılmış)

`PlatformDbContext` içinde `Notification` için dört indeks:

| İndeks | Amaç |
|---|---|
| `(UserId, IsRead)` + INCLUDE `TenantId, IsDeleted` | Zil rozeti sayımı tamamen indekste biter |
| `(UserId, LastOccurredAt DESC)` + INCLUDE `TenantId, IsDeleted, IsRead, Severity` | Liste sayfalaması |
| `(UserId, Category, IsRead)` | Kategori ağacı / sekmeler |
| `(UserId, GroupKey, IsRead)` | Gruplama araması |

`NotificationPreference`: `(UserId, Category)` **filtreli tekil** indeks (`IsDeleted = 0`) —
soft-delete satırı anahtarı rezerve etmiyor. `IX_AppNotifications_CreationTime` bilinçli olarak
kaldırılmış. Bu tablo, veri hacmi büyüdüğünde ek çalışma gerektirmeyecek durumda.

### 1.5 Mevcut üretici envanteri (kim bildirim yazıyor)

| Üretici | Tür(ler) | Alıcı kuralı |
|---|---|---|
| `NotificationDomainEventHandler` | `TaskAssigned`, `TaskCommentAdded`, `TaskStatusChanged`, `TaskDueSoon`, `DocumentExpiring` | Atanan / oluşturan / belge sahibi; eylemi yapan kişi dışlanır |
| `GrantNotificationDispatcher` (13 çağıran servis + 1 worker) | 14 hibe türü | Şablondan kanal, tetikleyiciden kitle; `DispatchToTenantAsync` kiracının tüm aktif kullanıcıları |
| `FeedbackManager` | `FeedbackReceived`, `FeedbackStatusChanged`, `FeedbackResponded` | Geri bildirimi açan (doğru kiracıya `CurrentTenant.Change` ile) |
| `SubscriptionExpiryProcessor` | `SubscriptionExpiring`, `SubscriptionDowngraded` | Kiracının statik admin rolündeki kullanıcılar |
| `GrantHostDispatchAppService` | `GrantRecommended` | Kiracının tüm aktif kullanıcıları (host bayrağına bağlı) |
| `AiWorkflowTriggerHandler` | `AiWorkflowTriggered` | Akış eyleminin `ActionPayload`'ındaki kullanıcı |

### 1.6 Zamanlama altyapısı

Tümü ABP `AsyncPeriodicBackgroundWorkerBase` — **Hangfire / Quartz YOK**, `IDistributedEventBus`
kullanımı **YOK**, ABP `TextTemplating` **YOK**. Yani zamanlama in-process, tek instance varsayımlı.

| Worker | Periyot | İşi |
|---|---|---|
| `TaskDeadlineWorker` | 60 dk | 48 saat içinde biten görevler → `TaskDueSoonEto`, "gönderildi" bayrağıyla tekilleştirme |
| `DocumentExpiryWorker` | 24 sa | 7 gün içinde süresi dolan belgeler |
| `GrantDeadlineReminderWorker` | 24 sa | Evrak 7/3/1 gün, rapor 30/14/3 gün; tekillik `GrantNotificationLog(Trigger, EntityId, DayMark)` |
| `GrantIdeaInvitationReminderWorker` | 24 sa | Fikir daveti hatırlatması |
| `NotificationDigestWorker` / `NotificationCleanupWorker` | 24 sa | Özet / temizlik |
| `SubscriptionExpiryWorker` | 60 dk | Paket süresi |
| `IssueTaskAutomationWorker`, `TelemetryRetentionWorker`, `ScheduledReportWorker`, `FeedbackAttachmentRetentionWorker` | 60 dk / 24 sa | Bildirim dışı |

**Sonuç:** §13'ün istediği "zamanlanmış bildirim altyapısı" **var ve kanıtlanmış**
(`GrantDeadlineReminderWorker` referans uygulama). Yeni bir job altyapısı eklemeye gerek yok.

---

## 2. Bütçe ekseninin gerçek yerleşimi

Görev tanımı "Hibe Proje Bütçe Modülü"nü tek modül sayıyor. Kodda **iki fazlı**:

```
BAŞVURU FAZI (Grants)                     UYGULAMA FAZI (ProjectBudgets + Expenses/Incomes)
─────────────────────                     ────────────────────────────────────────────────
GrantEligibleCostItem   program neyi      ProjectBudgetLine    PlannedAmount / ApprovedAmount
                        destekler, %limit BudgetRevision       + BudgetRevisionLine
GrantApplicationBudgetLine  firma ne      FundingTranche       + TrancheDeduction
                        kadar yazdı       Expense.BudgetLineId / IncomeEntry.BudgetLineId
GrantBudgetCalculator   destek, öz katkı  ProjectBudgetManager
GrantDisbursementTranche ödeme planı      FxPolicy / FxRateResolver / FxLedgerStamper
                     │                                    ▲
                     └──── GrantApplication.ProjectId ────┘
                           (Convert.cshtml: onay → projeye dönüştürme)
```

Köprüyü okuyan servis `GrantImplementationAppService`: başvurunun projesine bağlı giderleri
bütçe kalemine göre toplayıp `SpentAmount` üretir — **saklamaz**, her okumada hesaplar.
Aynı disiplin `GrantApplicationBudgetLine` (destek tutarı saklanmaz) ve `Grant` (eş finansman
oranı saklanmaz, `100 − SupportRatePercent`) tarafında da var.

### 2.1 Ölçüm: bütçe tarafında tek bildirim yok

`src/Apya.Platform.Application/{ProjectBudgets,Expenses,Incomes}` ve
`src/Apya.Platform.Domain/ProjectBudgets` altında `NotificationManager` / `PublishAsync`
geçen **hiçbir satır yok**.

### 2.2 §4'teki bütçe olaylarının domain karşılığı

| §4'te istenen | Karşılık | Maliyet |
|---|---|---|
| Yeni bütçe oluşturuldu | ✅ `ProjectBudgetLine` ilk kalem | şemasız |
| Bütçe revizyonu oluşturuldu | ✅ `BudgetRevision` | şemasız |
| Kullanım oranı %50/75/90/100 | ⚠️ `UsagePercent` **okuma anında** hesaplanıyor; "eşiğin geçildiği an" yakalanmıyor | eşik hafızası gerek |
| Limit aşıldı (proje / kalem) | ⚠️ `IsOverBudget` var, olay yok | eşik hafızası gerek |
| Dilim tahsil edildi / kısmi tahsil | ✅ `RegisterCollectionAsync`, `FundingTrancheStatus` | şemasız |
| Dilim gecikti | ⚠️ `PlannedDate < bugün && Status == Pending` türetilir | worker + eşik hafızası |
| Kesinti eklendi / finanse edilmedi / itirazlı | ✅ `TrancheDeduction`, `DeductionResolution`, `Disputed` | şemasız |
| Harcama yapılmamış kalem | ⚠️ `SpentAmount == 0` türetilir | worker |
| Plan ↔ gerçekleşen sapması | ⚠️ `PlannedAmount` / `ApprovedAmount` / `SpentAmount` var | şemasız (eşik kararı ürün sorusu) |
| Finansal rapor teslim tarihi | ✅ **zaten çalışıyor** (`GrantReportDue`) | — |
| **Bütçe onaya gönderildi / onaylandı / reddedildi** | ❌ **domain karşılığı yok** | yeni iş akışı + şema |
| **Bütçe taslağı / kilit / dönem kapanışı** | ❌ kavram yok | yeni iş akışı + şema |
| **Revizyon onayı** | ❌ revizyon doğrudan uygulanır, onay adımı yok | yeni iş akışı + şema |
| Beklenmeyen yüksek harcama (anomali) | ❌ | AI/analitik işi (§14) |
| Excel import başarısız | ❌ bütçe import akışı yok | kapsam dışı |
| Yetkisiz bütçe erişimi denemesi | ⚠️ izin var (`Projects.ViewBudget`), olay kaydı yok | ayrı iş (güvenlik telemetrisi) |

**Özet:** §4'ün 30 kaleminin **14'ü bugünkü şemayla** bildirim eklenerek karşılanır,
**7'si** eşik hafızası ister, **9'u** yeni iş akışı + şema ister (onay, kilit, dönem).

---

## 3. Kapsama boşluğu — modül matrisi

Bugün bildirim üreten modüller ✅, üretmeyenler ❌:

| Modül | Bildirim | Not |
|---|---|---|
| Görevler | ✅ 4 tür | Atama, yorum, durum, son tarih |
| Belgeler | ⚠️ 1 tür | Yalnız süresi dolan belge; yükleme/onay/red bildirimi yok |
| Hibe | ✅ 14 tetikleyici | Platformun en olgun alanı; şablon + zamanlanmış hatırlatma + log |
| Geri bildirim | ✅ 3 tür | — |
| Abonelik / paket | ✅ 2 tür | — |
| AI | ⚠️ 1 tür | Yalnız akış eylemi; değerlendirme bitti/başarısız bildirimi yok |
| **Projeler** | ❌ | `ProjectMemberAdded` türü **kayıtlı ama üreticisi yok** |
| **Bahsetme (@mention)** | ❌ | `Mention` türü **kayıtlı ama üreticisi yok** |
| **ProjectBudgets** | ❌ | Bu çalışmanın pilotu |
| **Giderler / Gelirler** | ❌ | Bütçe kalemine bağlanıyor ama sessiz |
| **Faturalar** | ❌ | Vade/ödeme bildirimi yok |
| **Kasa / Kasa hareketleri** | ❌ | — |
| **Kur değerleme** | ❌ | — |
| **Takvim** | ❌ | Etkinlik hatırlatması yok |
| **Formlar (DynamicAssets)** | ❌ | Form cevabı geldi bildirimi yok |
| **Raporlar** | ⚠️ | `ScheduledReportWorker` e-posta atıyor ama uygulama içi bildirim üretmiyor |
| **Kayıt talepleri** | ⚠️ | E-posta var, bildirim yok |
| **Sistem sağlığı / hata** | ❌ | `IssueTaskAutomationWorker` görev açıyor, bildirim yok |

---

## 4. Tespit edilen kusurlar ve riskler

### 4.1 Sarkan uçlar (düzeltilmesi ucuz)

| Bulgu | Yer | Etki |
|---|---|---|
| `NotificationType.Mention` — kayıtlı, **üreticisi yok** | `NotificationType.cs` | Kullanıcı @bahsetmenin bildirim üreteceğini sanabilir |
| `NotificationType.ProjectMemberAdded` — kayıtlı, **üreticisi yok** | aynı | Aynı |
| `SubscriptionExpiringEto` / `SubscriptionExpiredEto` — yayınlanıyor, **dinleyicisi yok** | `SubscriptionExpiryProcessor` | Ölü olay; bildirim ayrıca doğrudan yazılıyor |
| `GrantApplicationDocumentAppService` — `NotificationManager` enjekte edilmiş, **hiç çağrılmıyor** | ilgili servis | Ölü bağımlılık (CLAUDE.md gereği **bildiriliyor, silinmiyor**) |

### 4.2 Mimari riskler

1. **Olaylar UoW ile atomik değil.** Hiçbir entity `AddLocalEvent` kullanmıyor; olaylar
   servis/worker içinden doğrudan `_localEventBus.PublishAsync` ile atılıyor. İşlem geri
   alınırsa bildirim yine de gitmiş olabilir. Finans bildirimlerinde bu daha acıtır
   ("bütçe revize edildi" bildirimi gitti ama revizyon rollback oldu).
2. **Tek instance varsayımı.** Worker'lar in-process; uygulama iki instance'a çıkarsa
   hatırlatmalar **iki kez** gider. `GrantNotificationLog` gibi tekillik kayıtları bunu
   kısmen absorbe eder, `TaskDeadlineWorker`'ın bayrağı da öyle — ama `NotificationDigestWorker`
   için koruma yok. Bugün tek instance olduğu için sorun değil; ölçeklenme kararı alınırsa gündeme gelir.
3. **SignalR backplane yok.** `Clients.User(...)` tek sunucuda çalışır; çoklu instance'ta
   Redis backplane gerekir (`GrantApplicationHub` dosyası da aynı notu düşmüş).
4. **`DateTime.UtcNow` ↔ `IClock` karışıklığı.** Entity `DateTime.UtcNow` yazıyor
   (`Notification` ctor, `Repeat`), worker'lar `IClock.Now` ile eşik hesaplıyor. ABP saat
   türü UTC değilse temizlik/özet eşiklerinde kayma olur. **Doğrulanmadı** — ölçülmeli.

### 4.3 Güvenlik notu (§17)

Derin link güvenli: hedef sayfa kendi iznini denetler. **Ama bildirim gövdesi veriyi taşır** —
"Personel kalemi %112 kullanıldı, 45.000 TL plan dışı" metni, `Projects.ViewBudget` izni
olmayan birine giderse sayfa açılmasa bile bilgi sızmış olur. Finans bildirimlerinde
**alıcı süzgeci izin denetimli olmalı**; bugünkü üreticilerin çoğu "kiracının tüm aktif
kullanıcıları" diyor ve bu finans için yeterli değil.

---

## 5. Sonuç

| Soru (§1) | Cevap |
|---|---|
| Mevcut altyapı var mı? | **Var ve olgun.** Entity, dispatcher, tercih, gruplama, özet, temizlik, SignalR, zil, merkez, indeksler |
| Aynı mantık tekrar mı yazılmış? | Hayır. Hibe dispatcher'ı çekirdek `NotificationManager`'ı kullanıyor; tekrar yok |
| Gerçek zamanlı altyapı var mı? | Var (`/notification-hub`) |
| Kalıcı saklama + retention var mı? | Var (90 gün) |
| Kullanıcı tercihleri var mı? | Var (kategori bazlı) |
| Tenant izolasyonu? | `IMultiTenant` + kullanıcı bazlı kilit |
| Background altyapı kullanılabilir mi? | Evet, 11 worker çalışıyor; yenisi aynı desenle eklenir |
| Sessizce gerçekleşen kritik süreç hangisi? | **Finans/bütçe ekseninin tamamı** |
