# Novu Entegrasyonu — Faz 0: Analiz ve Mimari Öneri

> 2026-10-25 · Kapsam: `Apya.Platform` çekirdek · Durum: **KARAR VERİLDİ** — Novu eklenmeyecek, mevcut motor geliştirilecek (§8)
> Önceki ölçümler: [`00-denetim.md`](00-denetim.md) · kararlar: [`01-plan.md`](01-plan.md) (ADR-1…7) · çok kanal: [`02-coklu-kanal-plan.md`](02-coklu-kanal-plan.md) (K1…K9)
> Bu belge ölçüm + öneri belgesidir; kod yazılmadı, paket eklenmedi.

---

## 0. Yönetici özeti

Görev tanımı "Novu tabanlı bildirim sistemi entegre et" diyor ve §2'de yedi yetenek sayıyor.
**Yedisi de bugün APYA'da çalışıyor** (§1). Novu, var olanın yerine değil **yanına** konabilir;
yerine konması üç yazılı mimari kararı (ADR-1, Ç1, K2) bozar ve 63 türün gruplama / bir-kez /
zorunluluk / derin link / sessiz saat mantığını Novu panosunda elle yeniden kurmayı gerektirir.

Görev tanımının kendi içinde de bir gerilim var: "Novu entegre et" ile "gereksiz yeniden
yazımdan kaçın, yeni teknoloji ekleme, mevcut mimariyi koru" aynı belgede. Bu gerilim
kodla değil **kararla** çözülür. Üç seçenek §5'te; önerim **Seçenek B** (Novu yalnız
*teslim kanalı* olarak, `NotificationCreatedEto`'nun arkasında, web push ile aynı kalıpta).

Üç şey bu oturumda **yapılamaz**, kullanıcı kararı/eylemi ister:
1. **Paket ekleme** (`Novu` NuGet; Seçenek C'de ayrıca `@novu/js` npm) — CLAUDE.md §5 onay maddesi.
2. **Novu hesabı / ortamı**: Cloud (US/EU) ya da self-host. Secret key, application identifier
   ve iş akışı (workflow) tanımları Novu panosunda **elle** yapılır; kodun üretemediği dış bağımlılık.
3. **Veri çıkışı kararı**: bildirim gövdeleri tutar ve kişi adı taşır (00-denetim §4.3, ADR-4).
   Novu Cloud'a gönderim = bu verinin üçüncü taraf altyapısına çıkması (KVKK). EU bölgesi var;
   karar kullanıcının.

---

## 1. Mevcut durum — görev tanımı §2 karşılığı

| §2 maddesi | Durum | Bugünkü karşılık |
|---|---|---|
| Uygulama içi bildirim merkezi + okunmamış sayısı | ✅ | `NotificationBell` (toolbar) + `/Notifications` (kategori ağacı, önem eşiği, arama) · `GetUnreadCountAsync` indeksten |
| Gerçek zamanlı iletim | ✅ | `NotificationHub` `/notification-hub`, `Clients.User(id)`, yayın **commit sonrası** (N-01) · düşerse 60 sn yoklama |
| Okundu / okunmadı | ✅ | `MarkAsRead/All/Category`, `NotificationCountChangedEto` → rozet anlık |
| Tıklayınca ilgili sayfa | ✅ | `NotificationTypeRegistry.BuildDeepLink` — **saklanmaz, türetilir** (bayat link kalmasın, bilinçli karar) |
| Kullanıcı + tür bazlı tercih | ✅ (kategori) | `NotificationPreference(UserId, Category)`: InApp/Email/Digest/Push · sessiz saatler + kilit ekranı kullanıcı ayarı |
| E-posta ve web push | ✅ | Kritik anında `QueueAsync`, gerisi günlük özet · Web push VAPID (`Lib.Net.Http.WebPush`), cihaz tablosu, 404/410'da pasifleştirme, yeniden deneme ABP iş kuyruğunda |
| Türkçe içerik | ✅ | `tr.json` + Hibe'de host'un düzenlediği şablonlar |

Ek olarak bugün var: `GroupKey` gruplama (`OccurrenceCount`), `PublishOnceAsync` (eşik hafızası),
`Mandatory` tür (tercih kapalıyken bile görünür), izin süzgeçli alıcı çözümü (`PermittedUserFinder`),
90 gün temizlik, 44 test sınıfı / ~208 test, Sistem Sağlığı'nda "Bildirim Kanalları" kartı.

**Kanal soyutlaması yok** — in-app, SignalR, e-posta, web push doğrudan bağlı. Tek doğal dikiş yeri
**`NotificationCreatedEto`**: SignalR handler'ı ve `WebPushNotificationHandler` buna abone.
Web push kalıbı aynen yeni bir kanala uygulanabilir:

```
NotificationManager.PublishAsync
  └─ Notification satırı (DB)  +  ILocalEventBus → NotificationCreatedEto
        ├─ SignalRNotificationEventHandler   (uow.OnCompleted → hub)
        ├─ WebPushNotificationHandler        (tercih + cihaz → IBackgroundJobManager.EnqueueAsync)
        │     └─ WebPushJob (AbpBackgroundJobs satırı AYNI iş biriminde yazılır = outbox; retry hazır)
        └─ [YENİ] NovuNotificationHandler    (aynı kalıp → NovuTriggerJob → Novu API)
```

Görev tanımı §5'in istediği "DB başarılı olmadan gönderme", "retry", "mükerrer kontrol"
bu kalıpta **zaten** karşılanıyor: iş satırı transaction ile birlikte commit olur; commit
olmazsa iş yok; ABP retry'ı var; `Notification.Id` idempotent anahtardır.

### 1.1 Görev tanımı §3 olay listesi — bugünkü kapsama

| §3 olayı | Bugün | Not |
|---|---|---|
| Proje başvurusu oluşturma/gönderme | ✅ `GrantApplicationSubmitted` (35) | Hibe = APYA'daki "başvuru" kavramı |
| Kabul / ret / ek bilgi | ✅ `GrantDecisionIssued` (18, **Mandatory**), `GrantDocumentRevisionRequested` (16), `GrantApplicationStageChanged` (17) | |
| Proje / görev atamaları | ✅ `TaskAssigned` (1), `TaskUnassigned` (48), `ProjectMemberAdded` (5), `GrantApplicationAssigned` (56) | |
| Yaklaşan son tarih / gecikme | ✅ `TaskDueSoon` (3), `TaskOverdue` (36), `TaskOverdueEscalated` (62), `ProjectEndingSoon` (41) | `TaskDeadlineWorker` |
| Bütçe / finans / kritik değişiklik | ✅ 8 Finance türü (28–34, 63) | izin süzgeçli alıcı (ADR-4) |
| Onay / karar bekleyen işlemler | ⚠️ kısmi | Hibe kararları ✅; **`ProtocolApprovalAppService` (sözleşme onayı) bildirim üretmiyor**; bütçe onay akışı domainde yok (01-plan'da ertelendi) |
| Yorum / sorumluluk / etiketleme | ✅ `TaskCommentAdded` (2), `CommentReplied` (47), `Mention` (6), `ProjectMemberRoleChanged` (52) | yalnız görev yorumunda; genel yorum sistemi yok |
| Sistem hataları / işlem sonuçları | ⚠️ kısmi | `AiDraftsReady/Failed` (60/61), `RegistrationRequestReceived` (53); genel "işlem sonucu" türü yok — Sistem Sağlığı ekranı host'a hizmet ediyor |

**Gerçek kapsama boşluğu tek:** sözleşme/protokol onayı bildirimi. Bu, Novu'dan bağımsız,
mevcut motorla ~1 tür + 1 çağrı noktası + test işidir (§6 sıra 0).

---

## 2. Novu — doğrulanan gerçekler (2026-10-25)

| Konu | Bulgu | Kaynak |
|---|---|---|
| Sunucu SDK | NuGet **`Novu` 3.19.0** (2026-08-07); yalnız `net8.0` hedefi, net10 "computed compatible" → **derlemede doğrulanmalı**. Bağımlılık: Newtonsoft.Json ≥13.0.3, **NodaTime** ≥3.1.9 (ikisi de projede yok) | nuget.org/packages/Novu |
| İstemci | `new NovuSDK(secretKey, serverUrl?, retryConfig?)`; `TriggerAsync(WorkflowId, Payload, To, Overrides, Actor, Context)`; `CancelAsync(transactionId)`; Subscribers Create/Patch/Delete/Search/CreateBulk; `Subscribers.Preferences.BulkUpdate`; retry BACKOFF yapılandırılabilir | github novuhq/novu-csharp README |
| Tetikleme | `to` nesne verilince abone **tetikleme anında (JIT) oluşur**; topic ile toplu dağıtım; `context` ile tenant benzeri bağlam | docs.novu.co/platform/workflow/trigger-workflow |
| Inbox güvenliği | **HMAC-SHA256(secretKey, subscriberId) → hex**, sunucuda üretilir, istemciye `subscriberHash`; panoda In-App entegrasyonunda açılır; açıkken hash yoksa Inbox yüklenmez | docs.novu.co/platform/inbox/prepare-for-production |
| Tarayıcı SDK | `@novu/js` 3.19.0: `notifications.list/count/read/unread/archive/readAll`, `preferences.list/update`, olaylar `notifications.notification_received`, `unread_count_changed`; `backendUrl/socketUrl` ile self-host/EU; hazır `NovuUI` (Vanilla) ve `@novu/react` | docs.novu.co/platform/sdks/javascript |
| Self-host (Community) | API + Worker + WS + Dashboard + **MongoDB + Redis + S3**; tek VM 4 vCPU / 8 GB; **Inbox'ta Novu markası kalır**, e-posta takibi yok, en fazla **2 ortam**, **1 takım üyesi**, RBAC/SSO yok | docs.novu.co/community/self-hosting-novu/overview · self-hosted-and-novu-cloud |
| Web push | Novu'da **doğrudan VAPID sağlayıcı yok**; push kanalı FCM / APNs / Expo / OneSignal / **Pushpad** / **Push Webhook** (Novu → bizim uca HMAC imzalı POST) | docs.novu.co/platform/integrations/push |
| Bölge | US `api.novu.co`, EU `eu.api.novu.co` | SDK README |
| Fiyat | **ölçülmedi** (arama sonuç vermedi; pano/fiyat sayfası kullanıcıda) | — |

---

## 3. Çakışma noktaları

| # | Novu modeli | APYA kararı / gerçeği | Etki |
|---|---|---|---|
| **Ç-N1** | Bildirim = Novu'da iş akışı (workflow) + abone; in-app içeriği Novu DB'sinde | **ADR-1**: tek motor, `AppNotifications` tek doğruluk kaynağı; `PublishOnceAsync` hafızası bu tabloda | Inbox'ı Novu'ya taşımak tabloyu yine de gerektirir (eşik hafızası, Makro rozetleri, raporlar) → **iki kopya** |
| **Ç-N2** | Tercih = iş akışı × kanal, Novu'da saklanır | Tercih = kategori × kanal, `AppNotificationPreferences`; `Mandatory` tür tercihi ezer; sessiz saat / kilit ekranı ABP kullanıcı ayarı | Tek sahip seçilmeli; Novu'da "zorunlu tür" ve "kilit ekranı yalnız başlık" (K2) kavramı yok |
| **Ç-N3** | Abone kimliği global tek | Çok kiracı: aynı kullanıcı farklı kiracılarda farklı bağlam | `subscriberId = "{tenantId ?? "host"}:{userId}"` zorunlu; Novu "tenants" kavramı Community'de "v0 özelliği", ayrıntısı doğrulanmadı |
| **Ç-N4** | Gruplama/digest iş akışı adımı olarak Novu'da | `GroupKey` + `OccurrenceCount` + `Repeat()` DB'de, SignalR payload'ı güncel metni taşır | Novu Inbox'ta aynı göreve 5 yorum = 5 satır (ya da Novu digest adımı → gecikme) |
| **Ç-N5** | Derin link payload'da **saklanır** | **Ç2 kararı**: link saklanmaz, `BuildDeepLink` ile türetilir | Novu'ya gidecek payload'da link türetilip gönderilir; sayfa taşınırsa Novu'daki eski kayıtlar bayatlar (kabul edilebilir: Seçenek B'de Inbox bizde) |
| **Ç-N6** | Web push = üçüncü taraf sağlayıcı | VAPID doğrudan, cihaz tablosu, 410 pasifleştirme, SW bastırma — hepsi çalışıyor | Push Novu'ya taşınırsa ya Pushpad/OneSignal hesabı ya da "Push Webhook" ile **kendi gönderimimize geri dönüş** → anlamsız döngü. **Push Novu'ya taşınmaz** |
| **Ç-N7** | Gövde Novu sunucusunda | ADR-4: gövde tutar/isim taşır | Veri çıkışı kararı; EU bölgesi ya da self-host; K2 ile aynı mantıkla **Novu'ya yalnız başlık + derin link** gönderme seçeneği var |
| **Ç-N8** | Inbox UI: `NovuUI` (Community'de markalı) ya da headless | LeptonX zil `notification-bell.js` (623 satır, jQuery/ABP), 5 durumlu masaüstü izin makinesi, SW push kaydı aynı dosyada | Headless = zilin yeniden yazımı; hazır bileşen = tasarım sistemi dışı + marka |
| **Ç-N9** | Ortam başına iş akışı tanımı panoda | 63 tür; Community'de ortam değişkeni yok, 2 ortam | Dev/Test/Prod için 63 × 3 elle tanım ya da tek genel iş akışı (`apya-notification`) + payload ile içerik (önerilen) |
| **Ç-N10** | Üretim: Plesk Windows tek sunucu (hafıza) | Self-host = Linux/Docker + MongoDB + Redis + S3 | Self-host bugünkü üretim ortamında **yok**; Cloud ya da ayrı sunucu |

---

## 4. Güvenlik modeli (her seçenekte ortak)

- Secret key **yalnız sunucuda**: `Novu:SecretKey` → `appsettings.secrets.json` / User Secrets /
  `Novu__SecretKey` ortam değişkeni (WebPush PrivateKey ile aynı düzen). `appsettings.json`'a
  yalnız `Novu:Enabled`, `Novu:ServerUrl`, `Novu:ApplicationIdentifier` (gizli değil) girer.
- Kimlik **sunucudaki oturumdan**: `CurrentUser.GetId()` + `CurrentTenant.Id`; istemciden gelen
  subscriberId hiçbir uçta kabul edilmez.
- Inbox kullanılırsa (yalnız Seçenek C) `subscriberHash` sunucuda üretilir
  (`HMACSHA256(secret, subscriberId)` hex) ve sayfaya gömülür; panoda HMAC açılır.
- Alıcı yetkisi değişmez: Novu'ya giden her olay `NotificationManager`'ın zaten izin süzgecinden
  geçirdiği **tek kullanıcıya** ait satırdan türer; Novu yeni alıcı üretmez (web push ilkesiyle aynı).
- Mükerrerlik: `transactionId = Notification.Id` (gruplanan bildirimde `Repeat()` sonrası yeniden
  tetiklenir → Novu tarafında `Id` aynı kalır; bunun Novu'da "güncelle" mi "yoksay" mı olduğu
  **ilk entegrasyonda ölçülecek**; yoksayıyorsa `Id:OccurrenceCount`).
- Hata: Novu erişilemezse iş retry'a düşer, in-app ve SignalR etkilenmez; `NovuTriggerJob`
  loglar, Sistem Sağlığı "Bildirim Kanalları" kartına "Novu: açık/kapalı, son hata" eklenir.

---

## 5. Seçenekler

### A — Novu eklenmez; §1.1'deki tek boşluk (protokol onayı) mevcut motorla kapanır
- Maliyet: ~1 gün. Paket yok, dış bağımlılık yok, karar yok.
- Görev tanımının "Novu" kelimesini **karşılamaz**; diğer her maddesini zaten karşılıyor.

### B — Novu **teslim kanalı** olarak (önerilen) — in-app/SignalR/push bizde kalır
Novu'nun katma değeri bu kesimde: **e-posta sağlayıcı yönetimi, şablon düzenleme, teslim logu,
ileride SMS/WhatsApp/Slack** — yani 00-denetim'in "yönetim boşluğu" dediği yer (ADR-5 bunu
ertelemişti; Novu bunu kod yazmadan verir).

| Katman | Değişiklik |
|---|---|
| `Domain/Notifications` | `NovuOptions` (Enabled, ServerUrl, SecretKey, ApplicationIdentifier, WorkflowId, SendBody) — `WebPushOptions` kalıbı |
| `Application/Notifications` | `NovuNotificationHandler : ILocalEventHandler<NotificationCreatedEto>` (tercih: Email açık ya da Novu'ya yönlendirilen kanal) → `NovuTriggerJob(NovuTriggerJobArgs)`; `INovuClient` (`NovuSDK` sarmalı, testte sahte) |
| Sözleşme | Tek iş akışı `apya-notification`; payload: `id, type, category, severity, title, body?, deepLinkUrl (mutlak), actorName, tenantId, occurredAt`; subscriber JIT: `{tenant}:{userId}`, email, ad |
| E-posta | **Karar**: kritik e-posta + digest Novu'ya devredilir mi? Devredilirse `TrySendCriticalEmailAsync` Novu açıkken SMTP'yi atlar (çift e-posta olmasın). Hibe dispatcher'ının kendi e-postası da aynı anahtara bağlanır |
| Sağlık | `SystemHealthAppService.Channels` + `_NotificationChannels.cshtml`'e Novu satırı |
| Test | Handler: tercih kapalı → iş yok; açık → iş var, payload sözleşmesi; `SendBody=false` → gövde yok; Novu kapalı → hiçbir çağrı. Job: sahte istemciyle hata → fırlatır (retry); başarı → log. Mevcut 44 sınıf regresyon |
| Şema | **YOK**. Paket: `Novu` NuGet (Application). Frontend: **değişiklik yok** |

- Maliyet: ~2–3 gün kod + kullanıcı tarafında Novu hesabı/iş akışı.
- Risk: net10 uyumu (derlemede görülür), NodaTime/Newtonsoft bağımlılığı, veri çıkışı (Ç-N7; `SendBody=false` ile başlık düzeyinde tutulabilir).

### C — Novu tam yığın: Inbox + tercih + abone Novu'da
- Ek olarak: `@novu/js` (ya da `@novu/react`) paketi, HMAC uç noktası (`GET /api/app/notification/novu-session` → applicationIdentifier + subscriberId + subscriberHash), zilin yeniden yazımı (headless) **veya** `NovuUI` (Community'de markalı), `/Notifications` sayfasının yeniden yazımı, tercih ekranının Novu tercihlerine bağlanması, `NotificationCountChangedEto`/SignalR'ın devreden çıkması, sessiz saat / kilit ekranı / `Mandatory` / `PublishOnce` için iki sistemin senkronu.
- Kaybedilen: ADR-1, Ç1, Ç2, K2; gruplama; 44 test sınıfının büyük kısmı; Makro rozetleri `AppNotifications`'tan okuyor (`MacroNotificationLink_Tests`).
- Maliyet: ~2–3 hafta + sürekli iki kaynaklı tercih bakımı. Novu Cloud'a bağımlı in-app (Novu düşerse zil boş).
- **Önermiyorum.** Görev tanımı §6 "hazır Inbox'ı mevcut tasarımla karşılaştır; uygun değilse headless" diyor: hazır bileşen LeptonX/Atomic tasarımla uyumsuz ve Community'de markalı; headless ise bugün çalışan zilin yeniden yazımı demek — kazanım yok.

---

## 6. Uygulama sırası (Seçenek B onaylanırsa)

```
0. Protokol onayı bildirimi (Novu'dan bağımsız boşluk)
   → doğrulama: yeni NotificationType + registry + ProtocolApprovalAppService çağrısı; EF testi; Application.Tests (MacroNotificationLink) yeşil
1. Paket: Novu 3.19.0 → Application.csproj
   → doğrulama: dotnet build net10'da 0 hata/uyarı (NodaTime/Newtonsoft çakışması yok)
2. NovuOptions + appsettings anahtarları (secrets düzeni) + Development/Production ayrımı
   → doğrulama: Enabled=false iken hiçbir handler çalışmıyor (test)
3. INovuClient + NovuTriggerJob + NovuNotificationHandler (web push kalıbı, uow içinde enqueue)
   → doğrulama: 6–8 EF testi (tercih kapıları, payload sözleşmesi, SendBody, retry fırlatması)
4. E-posta devri anahtarı (kritik + digest + hibe) — kullanıcı kararına göre
   → doğrulama: Novu açıkken SMTP QueueAsync çağrılmıyor (test); kapalıyken eski davranış (mevcut testler)
5. Sistem Sağlığı kartı + Türkçe metinler
   → doğrulama: NotificationChannelsHealth_Tests genişletildi
6. Kurulum belgesi: Novu panosu (ortam, iş akışı apya-notification, in-app/e-posta adımları, Türkçe şablon), ortam değişkenleri, EU bölgesi seçimi
7. Gerçek gönderim: KULLANICININ secret key'i ile Development'ta tek bildirim → Novu Activity Feed'de görüldü
   → anahtar yoksa "doğrulanmadı" yazılır, sahte başarı üretilmez
8. Regresyon: ~Notification süzgeci (Domain + EF + Web öbekli) + Application.Tests tamamı
```

---

## 7. Karar soruları

| # | Soru | Önerim |
|---|---|---|
| **N1** | Hangi seçenek: A / **B** / C? | **B** |
| **N2** | Novu nerede: Cloud US / **Cloud EU** / self-host (ayrı Linux host gerekir, Ç-N10)? | Cloud EU (KVKK + altyapı yok) |
| **N3** | Novu'ya gövde gidecek mi (`SendBody`)? | Başlangıçta **hayır** (K2 ile aynı ilke); şablon ihtiyacı doğarsa açılır |
| **N4** | E-posta Novu'ya devredilsin mi (kritik + digest + hibe tek anahtar)? | **Evet**, ama ilk PR'da anahtar KAPALI; Novu'da e-posta sağlayıcısı bağlandıktan sonra açılır |
| **N5** | §1.1 protokol onayı bildirimi bu işe dahil mi? | Evet, ayrı küçük PR (sıra 0) |
| **N6** | Paket onayı: `Novu` 3.19.0 (+ NodaTime, Newtonsoft.Json geçişli) | — |

---

## 8. Karar ve uygulama (2026-10-25)

**Kullanıcı kararı:** "Sistemi Novu ile değiştirmeyelim, mevcudu geliştirelim." Gerekçe somut bir vaka:
veritabanına **dışarıdan** eklenen hibe için firmalara bildirim gitmedi — duyuru yalnız uygulama içi
yayın akışından (`GrantParameterAppService.PublishAsync`) çıkıyordu.

### 8.1 Ölçülen boşluk

Çağrı duyurusu (`GrantNotificationTrigger.CallPublished`) tek bir kod noktasından ateşleniyordu.
Çağrının başka yoldan "Açık" olduğu **üç** durumda hiçbir şey gitmiyordu:

| Yol | Örnek |
|---|---|
| Veritabanına dışarıdan yazım | SQL ile eklenen hibe + çağrı |
| Katalog tohumu | `GrantAnnouncementCatalogDataSeedContributor` çağrıyı doğrudan `Acik` yaratır |
| Host çağrı ekranı | `GrantCallAppService` oluştururken ya da düzenlerken durumu doğrudan `Acik` seçer |

### 8.2 Çözüm: duyuruyu olayın kaynağından değil durumundan türet

| Parça | Dosya | Ne yapar |
|---|---|---|
| `GrantCallAnnouncer` (alan servisi) | `Domain/Grants/GrantCallAnnouncer.cs` | `AnnounceAsync`: uygunluk eşiğini geçen firmalara duyurur, firma başına ve çağrı başına `GrantNotificationLog` yazar · `MarkProcessedAsync`: duyurmadan işler · `AnnounceUnannouncedAsync`: açık + işlenmemiş host çağrılarını tarar |
| `GrantCallAnnouncementWorker` | `Domain/Grants/GrantCallAnnouncementWorker.cs` | Saatte bir taramayı çağırır (`PlatformDomainModule`'e kayıtlı) |
| `GrantParameterAppService.AnnouncePublishedCallsAsync` | `Application/Grants/…` | Artık aynı servise devreder; yayın akışı ve tarama **tek işaretle** çakışmaz, kardeş taslaklar işlenmiş sayılır |

İşaretleme iki düzeyde ve **şemasız** (`GrantNotificationLog`, benzersiz indeks `(Trigger, EntityId, DayMark)`):
- firma satırı: `EntityId = LogKeyOf(çağrı, kiracı)` (kapanış zinciriyle aynı türetme) → aynı firmaya ikinci duyuru yok
- host satırı: `EntityId = çağrı`, `TenantId = null` → "bu çağrı işlendi", tarama sorgusunun anahtarı

**Birikmiş devir koruması:** ilk taramada kataloğun bütün açık çağrıları işlenmemiş görünür. Son değişikliği
(`LastModificationTime ?? CreationTime`) **7 günden eski** çağrı duyurulmadan yalnız işaretlenir
(`AnnounceWindowDays`); bir turda en çok **20** çağrı duyurulur (`MaxAnnouncePerRun`, LIF-03 ile aynı gerekçe).
Alıcı kuralı değişmedi: `GrantAudienceResolver` (skor ≥ 60, uygunluk şartını ihlal etmeyen) + `Platform.Grants` yetkisi.

> 🔴 Canlıya çıkışta sonuç: deploy'dan önce 7+ gün önce eklenmiş açık çağrılar **duyurulmaz** (sessizce işaretlenir).
> Bunların da duyurulması isteniyorsa deploy'dan hemen önce ilgili satırların `LastModificationTime`'ı güncellenir
> ya da pencere sabiti o paket için büyütülür — karar kullanıcının.

### 8.3 Doğrulama

- `dotnet build` Application: 0 hata.
- Yeni `GrantCallAnnouncement_Tests` (EF) **5/5**: dışarıdan eklenen açık çağrı uygun firmaya gider ve ikinci tur mükerrer üretmez · pencereden eski çağrı duyurulmaz ama işaretlenir · taslak taramaya girmez · uygun olmayan firma almaz · yayın akışıyla duyurulan çağrı taramada ikinci kez gitmez.
- Gerileme: EF `GrantCallClosing/AutoClose/NotificationRecipients/CatalogTenantIsolation/TenantOpenCallCatalog` **19/19** · Domain `~Grant` **195/195** · Web `GrantParametersPage/MissingJump/StageTemplate/NotificationChannelsHealth` **45/45** (worktree'de `wwwroot/libs` kopyalandıktan sonra; kök checkout'ta `libs/signalr` de yoktu, `signalr.min.js` node_modules'tan kondu).
- Tam paket KOŞULMADI.

### 8.4 Novu'nun yerine kalan iş (ayrı kararlar)

- §1.1'deki ikinci boşluk: `ProtocolApprovalAppService` (sözleşme onayı) bildirim üretmiyor.
- Aynı "durumdan türet" deseni başka dışarıdan beslenen tablolara gerekirse (ör. kiracı için toplu görev/proje içe aktarma) ayrı iş.
