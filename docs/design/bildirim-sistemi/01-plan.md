# Bildirim ve Proaktif Uyarı Sistemi — Mimari Kararlar ve Uygulama Planı

> 2026-09-17 · Girdi: [`00-denetim.md`](00-denetim.md)
> **Bu belge ONAY BEKLİYOR.** §6'daki kararlar verilmeden kod yazılmaz.

---

## 1. Temel tez

Denetim şunu gösterdi: **motor var, yakıt hattı finansa çekilmemiş.**

Bu yüzden plan "Notification Engine kur" değil, üç hatlı:

| Hat | İçerik | Şema |
|---|---|---|
| **A — Kapsama** | Finans/bütçe ekseni bildirim üretsin | şemasız |
| **B — Boşluk kapatma** | Kayıtlı ama üreticisi olmayan türler, eksik modüller | şemasız |
| **C — Yönetim** | Şablon/kural/log/analitik genelleştirmesi | migration |

A hattı tek başına görev tanımının §20 kriterini ("hiçbir önemli finansal değişiklik
sessizce gerçekleşmesin") karşılar. B ucuz. C pahalı ve ertelenebilir.

---

## 2. Mimari kararlar (ADR)

### ADR-1 — Yeni bildirim motoru yazılmayacak

Mevcut `NotificationManager` + `NotificationTypeRegistry` + tercih + gruplama + SignalR
zinciri korunur. Görev tanımındaki "Notification Rules Engine / Recipient Resolver /
Dispatcher" kutuları **zaten karşılanmış** ya da Hibe'de prototiplenmiş durumda.

*Gerekçe:* Paralel ikinci bir motor, tercih ve gruplama mantığını ikiye böler;
`NotificationTypeRegistry`'nin "tek kayıt noktası" kararını yıkar.

### ADR-2 — Finans kendi kategorisini alır

`NotificationCategory.Finance = 8` eklenir.

*Gerekçe:* Tercih granülaritesi kategori bazlı. Finans bildirimlerini `System` veya
`Projects` altına koymak, kullanıcıya "bütçe uyarılarını kapat, görev bildirimleri kalsın"
demesini imkânsız kılar. **Migration gerekmez** — `Category` zaten int kolon, tercih
ekranı enum'u geziyor; yeni kategori varsayılanla belirir.

### ADR-3 — Eşik hafızası yeni tablo İSTEMEZ

"Kullanım %90'a ulaştı" bildirimi her worker turunda tekrar etmemeli. Üç seçenek vardı:

| Seçenek | Maliyet | Karar |
|---|---|---|
| A. Bildirim satırının kendisini hafıza say (`GroupKey` = `tür:kalem:eşik`) | şemasız | ✅ **seçildi** |
| B. Genel `NotificationDispatchLog` tablosu | çift migration | ertelendi (Faz 5) |
| C. Bütçeye özel log (Hibe'deki gibi) | çift migration | reddedildi — ikinci tekillik mekanizması |

Uygulama: `NotificationManager`'a **`PublishOnceAsync(..., onceKey)`** eklenir. Aynı
`onceKey`'li satır **varsa (okunmuş, hatta soft-delete edilmiş olsa bile)** hiç üretmez.
Mevcut `GroupKey` araması yalnız okunmamışa bakar; "bir kez" anlamı için soft-delete
filtresi kapatılarak sorgulanır. `(UserId, GroupKey, IsRead)` indeksi bu sorguyu karşılar.

*Bilinen sınır:* `NotificationCleanupWorker` 90 gün sonra satırı sildiği için aynı eşik
90 gün sonra bir kez daha tetiklenebilir. Uzun projelerde yılda ~4 tekrar demek; kabul
edilebilir ve hatta istenir. Bunu kalıcı engellemek B seçeneğini gerektirir.

### ADR-4 — Alıcı çözümü finansta izin denetimli olmak zorunda

Bildirim gövdesi tutar taşıyor (§4.3). Bugünkü üreticilerin "kiracının tüm aktif
kullanıcıları" kuralı finans için **kullanılamaz**.

Kural: **proje ekibindeki `Lead` üyeler**; Lead yoksa projeyi oluşturan.
Her aday `Projects.ViewBudget` iznine göre süzülür.

*Açık teknik madde:* ABP'de başka bir kullanıcı adına izin denetiminin doğru yolu
(`IPermissionStore` / `PermissionManager`) uygulama sırasında doğrulanacak; çözülemezse
geri çekilme planı rol bazlı süzgeç (`SubscriptionExpiryProcessor`'ın admin rolü deseni).

### ADR-5 — Şablon yönetimi ilk fazda genelleştirilmeyecek

Finans bildirim metinleri **lokalizasyon dosyasından** gelir (`tr.json`), Hibe'deki gibi
düzenlenebilir şablon tablosundan değil.

*Gerekçe:* Genelleştirme (`GrantNotificationTemplate` → `NotificationTemplate`) çift
migration + veri taşıma + `/Grants/NotificationTemplates` ekranının yeniden yazımı demek.
Metinlerin host tarafından düzenlenmesi **henüz istenmedi**; istenirse Faz 5'te tek
seferde ve Hibe'yi de içine alarak yapılır. İki ayrı şablon tablosu açmak ise ADR-1'in
ihlali olur.

### ADR-6 — Olaylar üretildiği yerde, entity içinde değil

Depoda hiçbir entity `AddLocalEvent` kullanmıyor; olaylar servis katmanından atılıyor.
Finans bildirimleri de **AppService/Manager içinden**, yazma işlemi tamamlandıktan sonra
üretilir.

*Bilinen risk:* İşlem geri alınırsa bildirim yine de gitmiş olabilir (§4.2). Doğru çözüm
entity'de `AddLocalEvent` ile UoW'a bağlamak; ama bu **deponun tamamındaki deseni
değiştirmek** demek ve bu görevin kapsamı değil. Kapsama alınması ayrı bir karardır.

### ADR-7 — §3'teki 5'li sınıflandırma ayrı alan olarak eklenmeyecek

Görev tanımı INFO / ACTION_REQUIRED / WARNING / CRITICAL / SUCCESS istiyor.
Mevcut model `Severity` (4 kademe) + tür ikonu. Ayrı bir `Kind` kolonu **eklenmez**;
anlamı ikon + metin taşır. İstenirse `NotificationTypeInfo`'ya kod düzeyinde `Kind`
eklenebilir (migration yok) — ama bugünkü zil ve merkez ekranı bunu kullanmıyor,
kullanmadan eklemek ölü alan olur.

---

## 3. Finans bildirim kataloğu (Faz 1 kapsamı)

Kategori: `Finance`. Derin link: `/Reports/ProjectBudget?ProjectId={0}` (sayfa
`Projects.ViewBudget` denetimli).

| # | Tür | Olay kaynağı | Aciliyet | Alıcı | Tekillik |
|---|---|---|---|---|---|
| 1 | `BudgetRevisionApplied` | `ProjectBudgetAppService.ApplyRevisionAsync` | Normal | Lead | grup (revizyon no) |
| 2 | `BudgetUsageThresholdReached` | Gider yazımı sonrası + günlük worker | High | Lead | **bir kez** `proje:kalem:eşik` |
| 3 | `BudgetOverrun` | aynı | **Critical** | Lead | **bir kez** `proje:kalem` |
| 4 | `FundingTrancheCollected` | `RegisterCollectionAsync` | Info | Lead | grup |
| 5 | `FundingTrancheOverdue` | Günlük worker (`PlannedDate` geçti, `Pending`) | High | Lead | **bir kez** `dilim` |
| 6 | `TrancheDeductionAdded` | `AddDeductionAsync` | High | Lead | grup (dilim) |
| 7 | `TrancheDisputed` | `SetDisputedAsync(true)` | Normal | Lead | grup |
| 8 | `BudgetLineIdle` *(opsiyonel)* | Günlük worker — proje bitişine 30 gün, kalem hiç harcanmamış | Normal | Lead | **bir kez** `kalem` |

**Eşik değerleri ayardan gelir**, koda gömülmez: `Platform.Notifications.BudgetThresholds`
(varsayılan `"50,75,90,100"`) — `PlatformSettings` deseni zaten var (`IssueTasks` eşikleri
aynı şekilde yönetiliyor). Host kapatmak isterse boş bırakır.

**Bildirim yorgunluğu önlemi (§8):** Bir kalem %90'ı geçtiğinde hem #2 hem #3 tetiklenebilir.
Kural: `%100` eşiği **yalnız** `BudgetOverrun` üretir, `ThresholdReached` o eşikte susar.

### Metin kalitesi (§11)

Gövde "Bütçe aşıldı" demez. Şablon:

> **Personel kalemi bütçesini aştı** — Yeşil Enerji Projesi
> Onaylanan 400.000 TL, harcanan 448.000 TL (%112). 48.000 TL plan dışı.
> *Ne yapmalı:* kalem tutarını revize edin ya da gideri başka kaleme taşıyın.

---

## 4. Fazlar ve doğrulama

| Faz | İçerik | Şema | Doğrulama | Durum |
|---|---|---|---|---|
| **1a** | `Finance` kategorisi + 7 tür + registry + tr.json + `PublishOnceAsync` + merkez sekmesi | yok | 6 yeni "bir kez" testi + mevcut registry kapsama testi | ✅ `97cf05a7` |
| **1b** | Alıcı çözümü (`FinanceNotificationRecipientResolver`) | yok | 4 test: Lead süzgeci, izin süzgeci, oluşturan yedeği, boş liste | ✅ `baee6f9f` |
| **1c** | Olay kancaları: revizyon, dilim tahsilat, kesinti, itiraz | yok | 5 test: tür, aciliyet, tutar biçimi, gerekçe, sessiz kalma | ✅ `f74101cc` |
| **1d** | `BudgetRiskEvaluator` + `BudgetRiskWorker` + ayar tabanlı eşikler + gider kancası | yok | 6 test: en yüksek eşik, aşım, tam %100, revizyon yeniden kurma, gecikmiş dilim | ✅ |
| **1e** | Bildirim merkezi Finans sekmesi | yok | 1a'ya katıldı (kategori + etiket + sekme tek değişiklik) | ✅ |
| **2** | Ölü türlerin üreticileri: `ProjectMemberAdded`, `Mention` | yok | Ayrı PR'lar, her biri kendi testiyle |
| **3** | Belge onay/red, form cevabı, AI değerlendirme bildirimi | yok | Ayrı PR'lar |
| **4** | **Bütçe onay iş akışı** (taslak→onay→kilit) + üstüne escalation | **çift migration** | Ürün kararı gerekiyor — §6/K2 |
| **5** | Genel şablon yönetimi + teslim logu + admin analitik | **çift migration** | §6/K3 |

Her faz ayrı PR. Faz 1 kendi içinde 5 PR'a bölünür (granüler PR tercihi).

---

## 5. Riskler

| Risk | Etki | Önlem |
|---|---|---|
| Bildirim yorgunluğu — bütçe hareketi çok | Kullanıcı zili kapatır, kritik olan da kaybolur | Eşik ayarı + `PublishOnceAsync` + yalnız Lead'e gönderim + `%100`/aşım çakışma kuralı |
| Finansal veri sızıntısı | KVKK/ticari | ADR-4 izin süzgeci; gövdede tutar, başlıkta değil |
| İşlem geri alınır, bildirim kalır | Yanlış bilgi | ADR-6'da kabul edildi; kanca **yazma başarılı olduktan sonra** |
| Çoklu instance'ta çift gönderim | Tekrar | `PublishOnceAsync` absorbe eder; digest için koruma yok (mevcut durum) |
| `IClock` ↔ `DateTime.UtcNow` kayması | Eşik kayması | Faz 1a'da ölçülecek; sapma varsa ayrı düzeltme PR'ı |
| Kapsam şişmesi | Teslim edilemez paket | Faz 4/5 açıkça ertelendi |

---

## 6. KARARLAR (2026-09-17 · alındı)

| # | Soru | Karar |
|---|---|---|
| **K1** | Faz 1 kapsamı | **Tam finans ekseni** — 7 tür, ayar tabanlı eşik, 1 worker, şemasız |
| **K2** | Bütçe onay iş akışı bu işin parçası mı? | **Hayır, ayrı iş.** Domain'de karşılığı yok; durum makinesi + çift migration + yeni izin ister. Escalation buna bağlı olduğu için birlikte ertelendi |
| **K3** | Şablon yönetimi genelleştirilsin mi? | **Hayır.** Metinler `tr.json`'da; Hibe şablon tablosu olduğu yerde kalıyor |
| **K4** | Sarkan uçlar (`Mention`, `ProjectMemberAdded`, ölü bağımlılık) | **Raporda kalsın, dokunulmadı** |

## 7. Faz 1 sonrası bilinen sınırlar

Bunlar kabul edilmiş kısıtlar, keşfedilmemiş hatalar değil:

- **Eşik hafızası 90 günde eskir.** `NotificationCleanupWorker` satırı kalıcı silince
  koşul hâlâ doğruysa uyarı bir kez daha üretilir (ADR-3).
- **Bildirim ile iş kaydı atomik değil.** Kanca yazma başarılı olduktan sonra çalışır;
  bildirim üretimi hata alırsa yutulur ve loglanır (ADR-6).
- **Claim tabanlı dinamik izinler alıcı süzgecinde görünmez** — o kullanıcı bildirim
  almaz. Kapalı tarafa yanılma bilinçli (ADR-4).
- **Escalation, quiet hours, tür bazlı tercih, teslim logu ve analitik yok** — Faz 4/5.
- **Gelir kayıtları eşik hesabına girmiyor.** Harcanan tutar yalnız `Expense` toplamıdır;
  bu, `GetOverviewAsync`'in `SpentAmount` tanımıyla birebir aynıdır — iki ekran farklı
  rakam göstermesin diye bilinçli.
