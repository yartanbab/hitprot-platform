# Bildirim Sistemi — Faz 2: Çok Kanallı Teslim (Web Push · Masaüstü · Mobil)

> 2026-09-17 · Girdi: [`00-denetim.md`](00-denetim.md) · [`01-plan.md`](01-plan.md)
> Kapsam: CTO prompt'unun 34 maddesi → mevcut kod tabanı ölçümü → uygulanabilir faz planı.
>
> **Durum:** K1 (Faz 1) ve K5 (`sw.js` hizalama) **onaylandı ve uygulandı** — bkz. §M.
> Faz 2 ve sonrası hâlâ **ONAY BEKLİYOR** (özellikle K3 paket ve K8 çift migration).

---

## 0. Yönetici özeti

Görev tanımı "merkezi bildirim mimarisi kur" diyor. Ölçüm şunu söylüyor:

**Motor merkezi ve olgun; eksik olan TESLİM katmanı.**

Bugün bildirim iki kanaldan çıkıyor: uygulama içi (SignalR + zil + `/Notifications`) ve
e-posta (kritikler anında, gerisi 24 saatlik özet). Prompt'un 34 maddesinin **19'u**
bugünkü kodla zaten karşılanıyor (§2 motor, §10 anlık, §11 merkez, §12 derin link,
§13 tercih, §15 önem, §16 olay standardı, §20 bildirim düzeyi tekilleştirme, §27 tenant/yetki,
§29 asenkron altyapı). Bu yüzden doğru iş **yeni motor değil**, mevcut motora kanal takmak.

Gerçek boşluklar:

| # | Boşluk | Bugünkü durum |
|---|---|---|
| 1 | **Kanal soyutlaması yok** | `NotificationManager.PublishAsync` içinde in-app + e-posta **sabit kodlu** |
| 2 | **Web Push sunucu tarafı SIFIR** | VAPID yok, abonelik tablosu yok, gönderici yok, paket yok |
| 3 | **Masaüstü bildirimi hiç denenmemiş** | `Notification.requestPermission` kod tabanında **hiç çağrılmıyor** |
| 4 | **Cihaz kaydı yok** | Kullanıcı ↔ tarayıcı/cihaz ilişkisi tutulmuyor |
| 5 | **İzin durum modeli yok** | Tercih = kategori × (InApp, Email) — iki boolean |
| 6 | **Teslim takibi yok** | `IsRead` var; Created→Queued→Sent→Delivered→Opened zinciri yok |
| 7 | **Mobil istemci yok** | Aşağıda: blokaj |

### 0.1 En kritik iki bulgu

**(a) `sw.js` içinde ölü bir push işleyicisi var.**
`src/Apya.Platform.Web/wwwroot/sw.js` sonunda `push` + `notificationclick` işleyicileri
duruyor (yorumda "APYA-97"). Ama:

- `pushManager.subscribe()` **kod tabanının hiçbir yerinde çağrılmıyor** → abonelik hiç
  oluşmuyor → bu işleyici **hiç tetiklenemez**.
- Sözleşmesi `payload.approval.id` + `actions: [approve/reject]` +
  `POST /api/app/approvals/{id}/{action}` varsayıyor. **Bu uç yok** (yalnız
  `IProtocolApprovalAppService` var, o da `RemoteService(false)` ve farklı iş).
  Abonelik bir gün açılırsa bu buton **404** üretir.
- `?approval=ID` derin linkini okuyan istemci kodu da yok (`dashboard.jsx` altında yok).

CLAUDE.md gereği **silinmedi, bildiriliyor**: bu bir ölü sözleşme ve Faz 2'de ya hizalanmalı
ya kaldırılmalı (karar **K5**).

**(b) Service Worker yalnız iki sayfada kaydediliyor.**
`registerServiceWorker()` sadece `dashboard.jsx` ve `expense-capture.jsx` içinden çağrılıyor.
Scope `/` olduğu için bir kez kaydolduktan sonra tüm siteyi kontrol eder — ama **Genel Bakış'a
hiç girmemiş kullanıcıda SW yoktur**, dolayısıyla push da olmaz. Push'un ön koşulu SW kaydının
kabuğa taşınması (karar **K4**).

### 0.2 Blokaj: mobil push'un istemcisi yok

`_claude-skills/apya-mobil-api/SKILL.md` kuralı net: mobil uygulama **ayrı repoda** yaşar,
bu repoya React Native/Flutter kodu girmez. Bu repoda mobil istemciye dair **hiç iz yok**;
ayrı repoda çalışan bir uygulama olduğuna dair de kanıt yok.

Sonuç: FCM/APNs için backend yazılabilir ama **doğrulanamaz** — §28'in mobil senaryolarının
(foreground/background/killed/locked/tapped) hiçbiri test edilemez, token'ı kaydedecek istemci
yoktur. CLAUDE.md "gerçekleşmesi imkânsız senaryolar için kod yazma" der.
Önerilen: cihaz tablosu `Platform` kolonuyla mobili **şimdiden kabul eder** (maliyeti sıfır),
sağlayıcı soyutlaması ikinci sağlayıcı gerçekten gelince yazılır (karar **K6**).

### 0.3 Önerilen kesim

| Faz | İçerik | Şema | Paket | Doğrulanabilir mi |
|---|---|---|---|---|
| **1** | İzin akışı UX + **sayfa açıkken masaüstü bildirimi** (Notification API) | **yok** | **yok** | ✅ tarayıcı QA |
| **2** | **Web Push** (tarayıcı kapalıyken) + cihaz kaydı + kanal çözücü | **çift migration** | 1 paket | ✅ gerçek tarayıcı |
| **3** | Teslim logu + admin ekranı + metrikler (§25, §30) | **çift migration** | yok | ✅ |
| **4** | Mobil push (FCM/APNs) | kolon zaten hazır | 1-2 paket | ❌ istemci gelene kadar |

**Faz 1 tek başına** prompt'un §3, §4 (tarayıcı açıkken), §5, §6, §21, §22, §23, §24
maddelerini karşılar ve **veritabanına dokunmaz**. Görünür değerin büyük kısmı burada.

---

## A — Mevcut durum analizi

### A.1 Prompt maddesi → kod karşılığı

| Prompt | Durum | Karşılığı / eksik |
|---|---|---|
| §2 Merkezi motor | ✅ | `NotificationManager` (`PublishAsync`, `PublishOnceAsync`) + `NotificationTypeRegistry` (34 tür, 8 kategori, 4 aciliyet) |
| §2 Kanal listesi | ⚠️ 2/5 | In-app ✅, E-posta ✅, Web Push ❌, Masaüstü ❌, Mobil ❌ |
| §2 Tür bazlı kanal seçimi | ❌ | Kanal türden değil, kategori tercihinden çıkıyor; `NotificationTypeInfo`'da kanal alanı yok |
| §3 Web izin akışı | ❌ | `Notification.requestPermission` hiç çağrılmıyor |
| §4 Masaüstü bildirimi | ❌ | `sw.js` push işleyicisi var ama ölü (bkz. §0.1a) |
| §5 "Uygulamada aç" davranışı | ❌ | Tercih ekranı yalnız DB boolean'ı yazıyor; platform izni sorgulanmıyor |
| §6 Durum modeli | ❌ | `InApp`/`Email` iki boolean |
| §7 Mobil bildirim | ❌ | İstemci yok (§0.2) |
| §8 Kilit ekranı | ❌ | Mobile bağlı |
| §9 Cihaz kaydı | ❌ | Tablo yok |
| §10 Anlık uygulama bildirimi | ✅ | `NotificationHub` → `/notification-hub`, `Clients.User(...)`; rozet + merkez + toast + çok sekme eşitleme (`NotificationCountChangedEto`) çalışıyor |
| §11 Bildirim merkezi | ✅ | Zil paneli (`notification-bell.js`) + `/Notifications` (kategori ağacı, önem eşiği, arama, sıralama, okundu/sil/temizle) |
| §12 Derin link | ✅ | `NotificationTypeRegistry.BuildDeepLink` — link **saklanmaz, türetilir** (bilinçli karar) |
| §13 Bildirim tercihleri | ⚠️ | Kategori × 2 kanal ızgarası (`/Notifications` → Tercihler modalı). Tür bazlı ve platform bazlı yok |
| §14 Platform bazlı ayar | ❌ | — |
| §15 Önem seviyesi | ✅ | `NotificationSeverity` (Info/Normal/High/Critical) + kritikte anında e-posta |
| §16 Olay standardı | ✅ kısmi | `Notification` entity: Type, Category, Severity, EntityType, EntityId, GroupKey, Actor, OccurrenceCount. **`ActionUrl` bilinçli saklanmıyor**; `Metadata` / `ExpiresAt` yok |
| §17 Web Push altyapısı | ❌ | SW ✅ + manifest ✅ (PWA kurulu) / Push API ❌ VAPID ❌ abonelik ❌ |
| §18 Mobil push altyapısı | ❌ | — |
| §19 Açık/kapalı davranış | ❌ | Presence yok (`NotificationHub` boş; presence yalnız `GrantApplicationHub`'da, süreç belleğinde, başvuru formu için) |
| §20 Duplicate önleme | ⚠️ | **Bildirim düzeyinde** var (`GroupKey`, `OccurrenceCount`, `PublishOnceAsync`). **Kanal düzeyinde** (delivery id) yok |
| §21 İzin yönetimi UX | ❌ | — |
| §22 Ayarlara hızlı erişim | ✅ | Avatar menüsü → "Bildirim tercihleri" (`apya-shell-actions.js`) + `/Notifications` → Tercihler |
| §23 İlk kullanım | ❌ | İzin istenmiyor, dolayısıyla rahatsız da etmiyor |
| §25 Admin teslim logu | ❌ | `GrantNotificationLog` yalnız "bu eşik gönderildi" tekilliği; teslim/okunma logu değil |
| §26 Hata yönetimi / retry | ✅ altyapı | ABP `AbpBackgroundJobs` **DB destekli** ve kurulu (retry + exponential backoff hazır, AI modülünde kullanılıyor). Push için yeni kuyruk gerekmiyor |
| §29 Performans / asenkron | ⚠️ | Altyapı var ama **kritik e-posta istek içinde senkron gidiyor** (`TrySendCriticalEmailAsync` → `IEmailSender.SendAsync`). ABP 10.0.2'de `IEmailSender.QueueAsync` mevcut → tek satırlık iyileştirme |
| §30 Observability | ❌ | Sayaç/metrik yok; yalnız Serilog satırları |
| §33 Mevcudu bozmama | — | Bu planın birinci kısıtı |

### A.2 Riskler (00-denetim.md'den taşınan, hâlâ geçerli)

- **SignalR backplane yok** → `Clients.User(...)` tek sunucuda doğru; çoklu instance'ta Redis şart.
- **Worker'lar in-process, tek instance varsayımlı.**
- **Bildirim ↔ iş kaydı atomik değil** (ADR-6, kabul edilmiş kısıt).
- **SMTP doğrulanmadı** (`Smtp.Host` 127.0.0.1, sertifika uyuşmazlığı ölçüldü) → e-posta kanalı
  bugün pratikte **ölü**. Bu, "çok kanal" isteğinin asıl gerekçesi.

---

## A.3 🔴 Mevcut mimariyle çakışan noktalar

Prompt'un istediği ile kod tabanındaki yazılı kararlar bu beş yerde çarpışıyor.
Her biri karar gerektiriyor:

| # | Prompt diyor | Kod tabanı diyor | Öneri |
|---|---|---|---|
| **Ç1** | "Merkezi Notification Engine kur" (§2) | **ADR-1: yeni motor yazılmayacak** (01-plan.md) — paralel motor tercih ve gruplama mantığını ikiye böler | Mevcut `PublishAsync` **imzası korunur**, sonuna tek satır kanal dağıtımı eklenir. İkinci motor açılmaz |
| **Ç2** | `NotificationEvent`'te `ActionUrl`, `Metadata`, `ExpiresAt` olsun (§16) | Derin link **bilinçli saklanmıyor** (sayfa taşınınca bayat link kalmasın); `Metadata`/`ExpiresAt` yok; **ADR-7: kullanılmayan alan açılmaz** | Push payload'ı `BuildDeepLink` ile **sunucuda türetilir** — aynı registry çalışır. Yeni kolon **açılmaz** |
| **Ç3** | Kullanıcıya ayrıntılı tercih ver (§13) **ama** checkbox'la boğma (§24) | Tercih **kategori** granülaritesinde; 8 kategori × 5 kanal = **40 anahtar** | İki katman: **kanal** anahtarları cihaz/kullanıcı düzeyinde (3 anahtar), **içerik** tercihi kategori düzeyinde kalır; matrise yalnız tek `Push` kolonu eklenir (8×3) |
| **Ç4** | Sunucuda `PermissionStatus` durumu tut (§6, §9) | — | İzin **tarayıcıda yaşar**; sunucudaki kopya her an bayatlar ve tam olarak §24'ün yasakladığı "açık diyor ama kapalı" yanılgısını üretir. Karar: **gerçek kaynak = abonelik varlığı (sunucu) + canlı `Notification.permission` (istemci)**; sunucudaki alan yalnız "son bilinen" olarak saklanır, UI her açılışta canlı değerle doğrular |
| **Ç5** | Şablon/log yönetimi + admin analitik (§25) | **K3 kararı (bugün): şablon genelleştirilmeyecek**, teslim logu Faz 5'e ertelendi | Prompt bunu geri açıyor → **yeni karar gerekiyor (K7)**. Öneri: teslim logu Faz 3, şablon yönetimi hâlâ ertelenmiş kalsın |

---

## B — Hedef mimari

Minimum delta. Yeni kutular **kalın**; geri kalanı bugün çalışan kod.

```
Uygulama olayı  (AppService / Manager / Worker)
        |
        v
NotificationManager.PublishAsync / PublishOnceAsync      <- imza DEĞİŞMEZ
        |   kategori tercihi · gruplama · "bir kez" hafızası   (bugünkü haliyle)
        |--> Notification satırı (DB)                         [in-app]
        |--> NotificationCreatedEto -> SignalR -> zil/toast    [in-app anlık]
        |                                  \--> tarayıcı Notification API  [masaüstü, sayfa AÇIKKEN]
        \--> INotificationDelivery.DispatchAsync(notification)     <- tek yeni satır
                     |
                     v
            ChannelResolver   (tür + kategori tercihi + kanal tercihi + cihaz kaydı)
                     |
        +------------+---------------+--------------------------+
        v                            v                          v
   EmailChannel               WebPushChannel             MobilePushChannel
 (bugünkü kritik+digest)      (VAPID · abonelik)          (Faz 4 · istemci yok)
        |                            |
        +-------------+--------------+
                      v
       ABP IBackgroundJobManager -> AbpBackgroundJobs tablosu
              (retry + exponential backoff HAZIR — yeni kuyruk yok)
                      |
                      v
        Geçersiz abonelik -> cihaz pasifleştirme (404/410'da retry YOK)
```

### B.1 Duplicate önleme kararı — presence DEĞİL, Service Worker

Prompt §19/§20 "uygulama açıksa push atma" diyor. İki yol var:

| Yol | Nasıl | Sorun |
|---|---|---|
| Sunucu presence | Hub'da açık bağlantı sayısı | Sunucu **soketin açık** olduğunu bilir, **sekmenin görünür/odakta** olduğunu bilmez. Çoklu instance'ta da bozulur |
| **SW tarafı bastırma** ✅ | `push` işleyicisi `clients.matchAll()` ile görünür pencere arar; varsa `showNotification` çağırmaz | Push yine gönderilir (kota/bant genişliği) — kabul edilebilir |

Karar: **bastırma Service Worker'da**. Daha doğru, çoklu instance'ta çalışır, sunucuda
durum tutmaz. Presence yalnız kota tasarrufu için sonradan eklenebilir (gerek yok).

---

## C — Veri modeli

### Faz 1: **şema değişikliği YOK.**

Masaüstü bildirimi (sayfa açıkken) + izin akışı tamamen istemcide. "Bu cihazda masaüstü
bildirimi" anahtarı `localStorage` — cihaz başına kolaylık, sunucuya yazılmamalı.

### Faz 2: **tek çift migration** (Postgres + SqlServer — CLAUDE.md §3)

**1. Yeni tablo `AppNotificationDevices`** (`NotificationDevice`, `FullAuditedEntity<Guid>`, `IMultiTenant`)

| Alan | Tip | Not |
|---|---|---|
| `TenantId` | `Guid?` | 🔴 `new` satırı `CurrentTenant.Change` kapsamında olmalı (ABP TenantId nesne kurulurken atanır) |
| `UserId` | `Guid` | |
| `Platform` | enum | `WebPush=1, Android=2, iOS=3` — mobil şimdiden kabul, maliyeti sıfır |
| `Endpoint` | `nvarchar(1024)` | Web Push endpoint URL'i / FCM-APNs token'ı. **İndekslenmez** |
| `EndpointHash` | `char(64)` | SHA-256 hex. 🔴 Endpoint 450 karakteri aşabilir → SQL Server indeks anahtarı sınırı; tekillik hash üzerinden |
| `P256dh`, `Auth` | `nvarchar(256)` | Web Push şifreleme anahtarları; mobilde `null` |
| `DeviceLabel` | `nvarchar(128)` | "Chrome · Windows" — UI'da cihaz listesi için |
| `UserAgent` | `nvarchar(512)` | |
| `IsActive` | `bool` | |
| `LastSeenAt`, `LastSuccessAt`, `LastFailureAt` | `DateTime?` | |
| `FailureCount` | `int` | |
| `DeactivationReason` | `nvarchar(128)?` | "410 Gone", "kullanıcı çıkışı", "kullanıcı kapattı" |

İndeksler:

- `(UserId, EndpointHash)` **filtreli tekil** (`IsDeleted = 0`) — 🔴 UNIQUE ⊥ soft-delete tuzağı;
  `NotificationPreference`'ın kurulu deseni birebir izlenir.
- `(UserId, IsActive)` INCLUDE `Platform, Endpoint, P256dh, Auth` — gönderim sorgusu indekste bitsin.

**2. `AppNotificationPreferences` + `Push` kolonu** (`bool`, varsayılan **true**)

Asimetri bilinçli: `Email` varsayılan **false** çünkü adres zaten var, açık gelseydi kimse
istemeden e-posta alırdı. `Push` varsayılan **true** güvenli, çünkü **abonelik yoksa hiçbir
şey gitmez** — kullanıcı izin vermeden kanal fiilen kapalıdır. Böylece izin veren kullanıcı
ikinci bir anahtarla uğraşmaz.

### Faz 3 (§25, §30): ikinci çift migration

`AppNotificationDeliveries`: `NotificationId`, `DeviceId?`, `Channel`, `Status`
(Queued/Sent/Failed/Delivered/Opened), `Error`, `QueuedAt`, `SentAt`, `OpenedAt`,
`DeliveryId` (idempotency).
🔴 Soft delete **konulmaz** (`GrantNotificationLog` dersi).
🔴 Hacim uyarısı: bildirim × kanal büyür → retention politikası aynı PR'da tanımlanmalı.

---

## D — API

Yeni AppService: `INotificationDeviceAppService` (`[Authorize]`, kullanıcı **yalnız kendi
cihazına** dokunur — `CurrentUser.GetId()` kilidi `NotificationAppService`'teki desenle aynı).

| Uç | İş |
|---|---|
| `GET /api/app/notification-device/web-push-config` | `{ enabled, vapidPublicKey }` — özel anahtar **asla** dönmez |
| `POST /api/app/notification-device/web-push` | Abonelik kaydı (`endpoint`, `p256dh`, `auth`, `userAgent`). Aynı `EndpointHash` varsa **günceller** (token rotasyonu — §9) |
| `GET /api/app/notification-device` | Cihaz listesi (etiket, platform, son görülme, aktif) |
| `DELETE /api/app/notification-device/{id}` | Kendi cihazını kaldır |
| `POST /api/app/notification-device/unsubscribe` | Endpoint ile kaldır — çıkışta ve `pushsubscriptionchange`'de |
| `POST /api/app/notification-device/test` | Kendine test bildirimi (§3.4 "başarılı durum gösterilir"). Hız sınırlı |
| `PUT` mevcut `UpdatePreferenceAsync` | `Push` alanı eklenir (DTO'ya **alan ekleme**, alan silme değil — mobil sözleşme kuralı) |

Faz 4 (mobil): `POST /api/app/notification-device/mobile` (`platform`, `token`).

---

## E — Frontend / UX

### E.1 Durum birleştirme (Ç4'ün uygulaması)

İstemci beş durumdan birini hesaplar; **hiçbiri sunucudan okunmaz**:

```
NotSupported        : 'Notification' in window === false
NotRequested        : permission === 'default'
PermissionDenied    : permission === 'denied'
PermissionGranted   : permission === 'granted' && abonelik yok      (Faz 1 son durağı)
Subscribed          : permission === 'granted' && sunucuda abonelik var
```

### E.2 Zil paneli (`notification-bell.js`)

`NotRequested` ise panelin başına tek satırlık, kapatılabilir şerit:

```
🔔  Bildirimleri aç — görev, bütçe ve proje gelişmelerini anında gör.   [ Aç ]
```

- Kullanıcı kapatırsa `localStorage`'a yazılır ve **bir daha gösterilmez** (§3.5, §24).
- `denied` ise şerit **hiç çıkmaz**; tercihler ekranında yönlendirme metni olur (§21).
- İlk girişte hiçbir şey sorulmaz (§23) — şerit yalnız zil açıldığında görünür, yani
  kullanıcı zaten bildirimle ilgilenmişken.

### E.3 Tercihler modalı

Üstte yeni "Bu cihaz" bloğu, altta bugünkü matris + tek yeni kolon:

```
Bu cihaz — Chrome · Windows
  Masaüstü bildirimleri            [ Açık ]     <- izin + abonelik durumundan hesaplanır
  Durum: tarayıcı izni verildi, abonelik aktif
  [ Test bildirimi gönder ]     [ Bu cihazı kaldır ]

Kayıtlı cihazlarım (2)                                    <- Faz 2
  Chrome · Windows    · son görülme 2 dk önce   [ Kaldır ]
  Edge · Windows      · son görülme 3 gün önce  [ Kaldır ]

Kategori          Uygulama içi    E-posta    Push         <- Push kolonu Faz 2
Görevler               [x]          [ ]       [x]
Finans                 [x]          [ ]       [x]
...
```

`denied` durumunda anahtar yerine (§21):

> Tarayıcı bildirim izni kapalı. [ Bunu nasıl açarım? ] — tarayıcıya göre kısa yönlendirme.
> **Tekrar `requestPermission()` çağrılmaz** (tarayıcı zaten sessizce reddeder).

### E.4 SignalR payload'ına üç alan

`SignalRNotificationEventHandler` bugün `{title, body, entityType, entityId, type}` yolluyor.
Eklenecek: `id`, `severity`, `deepLinkUrl`. Böylece:

- toast aciliyete göre biçimlenir,
- **sayfa açıkken masaüstü bildirimi push'a ihtiyaç duymadan** `new Notification(...)` ile gösterilir,
- tıklama doğrudan derin linke gider (§12) — ekstra istek yok.

🔴 C#→JS sözleşmesi sessizce kayar: alan adları kaynak okuyan testle kilitlenmeli.

---

## F — Web Push teknik altyapısı (Faz 2)

| Parça | Karar |
|---|---|
| VAPID anahtar çifti | Bir kez üretilir. **Public** → `PlatformSettings.Notifications.WebPushPublicKey` (host düzeyi ayar, mevcut desen). **Private** → `secrets.json` / ortam değişkeni. 🔴 `appsettings.json`'a **yazılmaz** (SEC-001 dersi) |
| Gönderici | NuGet paketi (`WebPush` ya da `Lib.Net.Http.WebPush`) — **paket ekleme onayı gerekiyor (K3)**. Alternatif: ES256 JWT + HKDF/AES128GCM elle (~200 satır kripto) — **önerilmiyor** |
| .NET 10 uyumu | Paket seçilince **ilk adımda** doğrulanacak; uyumsuzsa karar geri gelir |
| Payload sözleşmesi | `{ notificationId, title, body, tag, severity, url }`. `tag` = `GroupKey` → aynı grup mevcut bildirimi günceller, spam olmaz (§20 kanal düzeyi) |
| `sw.js` hizalama | Mevcut ölü sözleşme (approval/actions/404 uç) **karar K5** |
| Geçersiz abonelik | `404`/`410` → cihaz **pasif**, retry **yok**. `429`/`5xx` → ABP job retry (backoff) |
| iOS | Web Push **yalnız ana ekrana eklenmiş PWA'da** çalışır (iOS 16.4+). Manifest hazır; bu kısıt UI'da söylenmeli, gizlenmemeli |
| SW kaydı | Kabuğa taşınması **karar K4** |

### F.1 Güvenlik: push gövdesi

Push gövdesi işletim sistemine gider — kilit ekranında, yetkisi olmayan birinin gözü önünde
görünebilir. `00-denetim.md §4.3` bu riski finans için zaten işaretledi.

Karar önerisi (**K2**): push gövdesi **başlık düzeyinde** kalır, tutar taşımaz.
`Finance` kategorisinde:

- Push: "Bütçe uyarısı · Yeşil Enerji Projesi"
- In-app: "Personel kalemi %112 kullanıldı, 48.000 TL plan dışı"

Ayrıca kullanıcıya "hassas içeriği bildirimde gösterme" anahtarı (§8 generic lock-screen).

### F.2 Çıkışta abonelik

🔴 Kullanıcı çıkış yaptığında abonelik **tarayıcı profilinde** kalır — ortak bilgisayarda
sonraki kişi öncekinin bildirimini görür. Çıkış akışında `unsubscribe` + `POST .../unsubscribe`
çağrılmalı. Bu bir güvenlik maddesi, iyileştirme değil.

---

## G — Mobil push (Faz 4 — bloklu)

Bugün yapılabilen: `Platform` kolonu + `POST .../mobile` sözleşmesi (Faz 2'de bedava gelir).

Yapılamayan ve neden:

- **İstemci yok** → token üreten taraf yok, §28 senaryoları test edilemez.
- **Hesap/sertifika yok** → Firebase projesi + APNs `.p8` anahtarı gerekiyor (ürün/hesap kararı).
- **Sağlayıcı soyutlaması** tek sağlayıcı varken ölü katman olur (CLAUDE.md: tek kullanımlık
  kod için soyutlama üretme). İkinci sağlayıcı geldiğinde `IPushChannel` zaten yerinde olacak —
  `WebPushChannel` onu ilk uygulayan olur.

---

## H — Real-time (mevcut + küçük ekler)

Çalışan: hub, `Clients.User`, otomatik yeniden bağlanma + kullanıcıya durum bildirimi
(`onreconnecting/onreconnected/onclose`), çok sekme rozet eşitleme, merkez tazeleme.

Eklenecek:

1. §E.4'teki üç alan.
2. SW tarafı bastırma (§B.1).
3. `NotificationHub` boş kalır — presence eklenmiyor (gerekçe §B.1).

Bilinen kısıt (değişmiyor): çoklu instance'ta Redis backplane şart.

---

## I — Security

| Konu | Önlem |
|---|---|
| Abonelik sahipliği | Tüm uçlar `[Authorize]` + `CurrentUser.GetId()` kilidi; başka kullanıcının cihazı listelenemez/silinemez |
| Tenant izolasyonu | `IMultiTenant`; 🔴 `new NotificationDevice(...)` `CurrentTenant.Change` kapsamında |
| Payload sızıntısı | §F.1 — gövde başlık düzeyinde, ayrıntı in-app |
| Alıcı süzgeci | Finans için zaten izin denetimli (ADR-4); push aynı alıcı listesini kullanır, **yeni bir kitle üretmez** |
| VAPID özel anahtarı | Secrets/env; repoya girmez; `web-push-config` ucu yalnız public anahtar döner |
| Çıkış | §F.2 |
| Test ucu | Hız sınırı; yalnız kendine gönderir |
| SW approval uçları | 🔴 `sw.js`'teki `POST /api/app/approvals/...` **yok**; hizalanmadan abonelik açılırsa 404 üretir (K5) |

---

## J — Testing

**Faz 1 (otomatik):** `dynamic-assets` Vitest — durum makinesi (5 durum × izin/abonelik
kombinasyonu), şerit bir daha gösterilmeme kuralı, `denied`'de `requestPermission`
çağrılmaması, toast/masaüstü ayrımı. SignalR payload alanları için kaynak okuyan sözleşme testi.

**Faz 2 (otomatik):** xUnit — abonelik kaydı/güncelleme (aynı hash), tekil indeks +
soft-delete, kanal çözücü (tercih kapalı → gönderilmez; kategori kapalı → hiç üretilmez;
`Mandatory` türde in-app yine üretilir), `410` → pasifleştirme + retry yok, `5xx` → job retry,
payload'da tutar **olmaması**, tenant izolasyonu, başka kullanıcının cihazına erişememe.

**Manuel tarayıcı QA (otomatikleştirilemez — dürüst sınır):** §28'in web/desktop listesi —
izin istenmemiş / verildi / reddedildi, tarayıcı kapalı, çoklu sekme, çoklu tarayıcı,
bildirime tıklama, izin geri alınması, iOS ana ekran PWA. Kontrol listesi Faz 2 PR'ına eklenir.

**Mobil:** istemci gelene kadar **test edilemez** (§0.2).

---

## K — ONAY BEKLEYEN KARARLAR

| # | Soru | Öneri |
|---|---|---|
| **K1** | Faz kesimi §0.3'teki gibi mi? Faz 1 (şemasız/paketsiz) tek başına çıkarılsın mı? | ✅ **KARAR (2026-09-17): Evet** — uygulandı, §M |
| **K2** | Push gövdesinde tutar/isim taşınsın mı? | **Hayır** — başlık düzeyi + in-app ayrıntı (§F.1) |
| **K3** | **Paket ekleme onayı**: Web Push gönderimi için NuGet paketi | Paket (elle kripto yazma önerilmiyor); .NET 10 uyumu ilk adımda doğrulanır |
| **K4** | Service Worker kaydı kabuğa taşınsın mı? (bugün yalnız Dashboard + Expense/Capture) | **Evet, Faz 2'de** — push'un ön koşulu. Not: Dashboard'a girmiş kullanıcılarda SW zaten tüm siteyi kontrol ediyor, davranış farkı sınırlı |
| **K5** | `sw.js`'teki ölü approval sözleşmesi (404 üretecek) | ✅ **KARAR (2026-09-17): Hizala** — uygulandı, §M |
| **K6** | Mobil sağlayıcı soyutlaması şimdi mi yazılsın? | **Hayır** — `Platform` kolonu yeter; istemci + Firebase/APNs kararı gelince yazılır |
| **K7** | Teslim logu + admin ekranı (§25, §30) Faz 3'te mi? (bugünkü K3 kararı "Faz 5'e ertelendi" diyordu) | **Faz 3** — ama şablon yönetimi hâlâ ertelenmiş kalsın |
| **K8** | **Çift migration onayı**: `AppNotificationDevices` + `NotificationPreference.Push` | Faz 2'nin ön koşulu |
| **K9** | Kritik e-posta `QueueAsync`'e alınsın mı? (bugün istek içinde senkron SMTP) | ✅ **KARAR (2026-09-17): Evet** — uygulandı, §M |

---

## L — Fazların doğrulaması

```
Faz 1 -> doğrulama: dotnet build + Vitest yeşil; tarayıcıda izin akışı 3 durumda
         (default/granted/denied) elle gözlendi; sayfa açıkken gerçek Windows bildirimi
         göründü; şerit kapatılınca geri gelmedi
Faz 2 -> doğrulama: çift migration üretildi + DbMigrator logunda "Successfully completed";
         tarayıcı KAPALIYKEN push geldi; 410 senaryosunda cihaz pasifleşti;
         xUnit + Vitest yeşil (1085+ test)
Faz 3 -> doğrulama: admin ekranında Created->Sent->Opened zinciri gerçek bir bildirimde görüldü
Faz 4 -> doğrulama: mobil istemci olmadan YAPILAMAZ
```

---

## M — Faz 1 uygulandı (2026-09-17)

Dal: `claude/central-notification-architecture-30c50d`. **Migration yok, paket yok.**

| Değişiklik | Dosya |
|---|---|
| `NotificationCreatedEto`'ya `Id` + `Severity`; olay artık kaydın kendisinden üretiliyor (gruplanan bildirimde `Repeat()` sonrası metin) | `Domain/Notifications/NotificationManager.cs` |
| Kritik e-posta `SendAsync` → **`QueueAsync`** (ABP arka plan işi; SMTP el sıkışması artık kullanıcının isteğini bekletmiyor, geçici hata yeniden deneniyor) | aynı dosya |
| SignalR payload'ına `id`, `severity`, `deepLinkUrl` (link sunucuda `BuildDeepLink` ile türetiliyor) | `Web/Notifications/SignalRNotificationEventHandler.cs` |
| Masaüstü bildirimi modülü (`window.apyaDesktopNotifications`): 5 durumlu izin makinesi, cihaz anahtarı `localStorage`, **sayfa görünürken bastırma**, çoklu sekmede `tag` ile tekilleştirme, kritikte `requireInteraction`, aciliyete göre toast | `wwwroot/Pages/Notifications/notification-bell.js` |
| Zil panelinde izin şeridi (yalnız `NotRequested` + kapatılmamışken; `denied`'de **hiç** çıkmaz) | aynı dosya + `Components/NotificationBell/Default.cshtml` |
| Tercihler modalında "Bu cihaz" bloğu: durum metni, anahtar, "bu cihazda dene", `denied`'de tarayıcı yönlendirmesi | `Pages/Notifications/Index.cshtml` + `Index.js` |
| `sw.js` hizalandı: ölü approval sözleşmesi (`/api/app/approvals` — **hiç var olmayan uç**) çıkarıldı, çekirdek payload + görünür pencere bastırması geldi | `wwwroot/sw.js` |
| 15 yeni localization anahtarı (tr + en) | `Localization/Platform/{tr,en}.json` |
| Sözleşme testleri | `test/…/Pages/NotificationDesktopContract_Tests.cs` |

### Doğrulama (ölçülen)

- `dotnet build` **0 hata** (Web + test projeleri).
- **6/6** yeni sözleşme testi: istemcinin okuduğu her alan payload'da; `id`/`severity`/`deepLinkUrl` düşerse çakılıyor; iki JS dosyasındaki tüm `l('…')` anahtarları çözülüyor; `sw.js` var olmayan onay ucuna istek atmıyor.
- **40/40** bildirim + finans EF testi, **360/360** Domain testi yeşil (`PublishAsync` yolu `QueueAsync` ile bozulmadı).
- Gerçek tarayıcıda (44388, sahte `Notification` ile ölçüm): `denied` → `requestPermission` **0 kez** çağrılıyor, `show()` hem normalde hem `force` ile reddediyor · `default` → `NotRequested` · izin verildi + sayfa görünür → **bastırılıyor**, `force` ile gösteriliyor · sayfa gizli → gösteriliyor, etiket `apya-<id>`, kritikte `requireInteraction: true` · cihazda kapatıldı → `DisabledOnThisDevice`, gösterim yok.
- Şerit: tr.json metniyle liste kutusunun üstünde çıkıyor, "Bir daha gösterme" kalıcı (tekrar açılışta yok), izin verilmişte ve reddedilmişte hiç çıkmıyor.
- Sunulan `/sw.js` yeni içerik; 15 localization anahtarı istemci betiğine iniyor.

### Faz 1'de doğrulanAMAYAN (dürüst sınır)

- **Tercihler modalındaki "Bu cihaz" bloğunun görsel QA'si** — `/Notifications` oturum gerektiriyor; parola girmek bu oturumun yetkisinde değil. Kullanıcı girişi yaptıktan sonra bakılmalı.
- **Gerçek işletim sistemi bildiriminin görünümü** — gömülü tarayıcıda bildirim izni `denied`; gerçek Chrome'da izin verilerek bakılmalı.
- **Tarayıcı kapalıyken bildirim** — Faz 2 (Web Push) işi; bugün tasarım gereği yok.
