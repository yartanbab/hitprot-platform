# Apya.Platform — Architectural Quality Roadmap

> Oluşturulma: 2026-05-21  
> Kaynak: Principal Architect Review (8-katmanlı analiz)  
> Milestone: `arch-quality-v1`  
> Production Readiness Score: **72 / 100** → hedef **90 / 100**

---

## Genel Bakış

Bu roadmap, 2026-05-21 tarihinde yapılan kapsamlı mimari incelemenin bulguları doğrultusunda
hazırlanmıştır. 7 bulgu, 3 faz halinde ele alınacak; her bulgu bağımsız bir PR ile kapatılacak.

```
Faz 1 — Critical  (2-3 gün)   → Invoice domain + InvoiceManager
Faz 2 — High      (1-2 gün)   → TenantId güvenliği + AI client + Worker batch
Faz 3 — Medium    (1 gün)     → Polly DI + tablo adlandırma + EF ref temizliği
```

---

## Faz 1 — Critical: Domain Model Bütünlüğü

### ARCH-001 · Invoice: Anemic Domain Model Düzeltmesi

**Öncelik:** Critical  
**Efor:** ~1 gün  
**Branch:** `arch/arch-001-invoice-rich-domain`

**Sorun:**  
`Invoice.cs` tüm property'lerini `public set;` ile açık bırakmış; `TotalAmount` hesabı ve
`Status` geçiş mantığı `InvoiceAppService` içinde yaşıyor. Aggregate, davranışsız bir POCO.

**Yapılacaklar:**
- [ ] `Invoice` property'lerini `private set` yap
- [ ] `AddItem()` → `Draft` durumu guard + `RecalculateTotal()` tetikler
- [ ] `UpdateStatus(decimal totalPaid)` domain metodu ekle
- [ ] `Invoice(...)` constructor'ına `tenantId` parametresi ekle ve `private set`'e bağla
- [ ] `InvoiceAppService.CreateAsync` içindeki `TotalAmount` hesabını sil
- [ ] `InvoiceAppService.AddPaymentAsync` içindeki `Status` hesabını `invoice.UpdateStatus(...)` çağrısıyla değiştir
- [ ] Domain testleri: `InvoiceTests` — `AddItem` guard, `UpdateStatus` geçişleri

**Referans kod:** PR açıklamasında diff gösterilecek.

---

### ARCH-002 · InvoiceManager Domain Service: Cross-Aggregate Logic Toplanması

**Öncelik:** Critical  
**Efor:** ~1.5 gün  
**Branch:** `arch/arch-002-invoice-manager`  
**Bağımlılık:** ARCH-001 tamamlandıktan sonra başla

**Sorun:**  
`InvoiceAppService.AddPaymentAsync` → Payment + CashMovement + FX çevrimi + CustomerLedgerEntry +
Status güncellemesi — 5 farklı aggregate üzerinde iş mantığı tek application service metodunda.
7 repository injection bu ihlalın mimari semptomu.

**Yapılacaklar:**
- [ ] `InvoiceManager : DomainService` oluştur (`src/Apya.Platform.Domain/Invoices/`)
- [ ] `RecordPaymentAsync(invoiceId, amount, method, reference, cashAccountId?)` domain metodu
- [ ] FX dönüşüm mantığını `InvoiceManager`'a taşı (`PaymentCashConverter` burada kalabilir)
- [ ] `InvoiceManager` içinden `ILocalEventBus` ile `InvoicePaymentRecordedEvent` fırlat
- [ ] `InvoiceAppService` → tek bağımlılık `InvoiceManager`, inject edilen repository sayısı 7→1
- [ ] `CustomerLedgerEntry` oluşturma → `InvoicePaymentRecordedEventHandler`'a taşı (decoupling)
- [ ] `CashMovement` oluşturma → aynı handler veya ikinci handler

---

## Faz 2 — High: Güvenlik ve Performans

### ARCH-003 · TenantId: Tüm Aggregate Root'larda private set

**Öncelik:** High  
**Efor:** ~2 saat  
**Branch:** `arch/arch-003-tenantid-private`

**Sorun:**  
`Invoice`, `CashAccount`, `Project`, `TaskItem` — hepsinde `public Guid? TenantId { get; set; }`.
Herhangi bir uygulama kodu tenant sahipliğini değiştirebilir; ABP data filter bunu engellemez.

**Yapılacaklar:**
- [ ] `Invoice.TenantId { get; private set; }` — constructor parametre ekle
- [ ] `CashAccount.TenantId { get; private set; }` — constructor zaten `tenantId` alıyor, private yap
- [ ] `Project.TenantId { get; private set; }` — constructor parametre ekle
- [ ] `TaskItem.TenantId { get; private set; }` — constructor parametre ekle
- [ ] `DraftApprovedEventHandler` → `new TaskItem(..., tenantId: eventData.TenantId, ...)` constructor'dan geçir
- [ ] Diğer aggregate'ler (`CustomerLedgerEntry`, `CashMovement`, `Expense`, `IncomeEntry`, `Notification`) — tek tek incele ve gerekenleri private yap
- [ ] Tüm `new XyzAggregate(...)` çağrılarını `CurrentTenant.Id` ile güncelle

---

### ARCH-004 · OpenAiProvider: Singleton HttpClient / ChatClient

**Öncelik:** High  
**Efor:** ~1 saat  
**Branch:** `arch/arch-004-openai-singleton`

**Sorun:**  
`OpenAiProvider` her AI isteğinde `new ChatClient(model, apiKey)` oluşturuyor.
Her `ChatClient` arka planda yeni bir `HttpClient` → connection pool exhaustion riski.
Aynı zamanda API key her request'te `IConfiguration`'dan okunuyor.

**Yapılacaklar:**
- [ ] `OpenAiProvider` → `ISingletonDependency` yap (veya explicit DI `services.AddSingleton<OpenAiProvider>()`)
- [ ] `_chatClient` → constructor'da bir kez üret, field olarak sakla
- [ ] Startup'ta API key validation: null ise `InvalidOperationException` fırlat (runtime'a taşıma)
- [ ] `AiGateway`'in `OpenAiProvider`'a bağımlılığını `IAiProvider` interface üzerinden yap (test edilebilirlik)
- [ ] Unit test: `OpenAiProvider` mock ile `AiGateway` retry davranışı

---

### ARCH-005 · TaskDeadlineWorker: Async ToList + Batch UpdateAsync

**Öncelik:** High  
**Efor:** ~2 saat  
**Branch:** `arch/arch-005-deadline-worker-batch`

**Sorun:**  
`query.Where(...).ToList()` → async context'te synchronous çağrı (thread pool baskısı).  
`foreach` içinde `taskRepository.UpdateAsync(task)` → O(n) DB round-trip.

**Yapılacaklar:**
- [ ] `.ToList()` → `await AsyncExecuter.ToListAsync(query.Where(...))` ile değiştir
- [ ] `foreach` içindeki tek tek `UpdateAsync` → `ExecuteUpdateAsync` ile batch update

```csharp
// Hedef: tek SQL UPDATE
await taskRepository.GetDbSet()
    .Where(t => dueTaskIds.Contains(t.Id))
    .ExecuteUpdateAsync(s => s.SetProperty(t => t.IsDeadlineWarningSent, true));
```

- [ ] Tenant context switching mantığını koru (event publish tenant-aware olmalı)
- [ ] Worker test: mock repository ile deadline senaryosu

---

## Faz 3 — Medium: Teknik Borç Temizliği

### ARCH-006 · AiGateway: Static Polly Pipeline → DI Pipeline Registry

**Öncelik:** Medium  
**Efor:** ~2 saat  
**Branch:** `arch/arch-006-polly-di`

**Sorun:**  
`private static readonly ResiliencePipeline<AiCompletionResult> Pipeline` → test edilemez,
tüm tenant'lar için ortak circuit breaker (bir tenant'ın hatası herkesi etkiler).

**Yapılacaklar:**
- [ ] `services.AddResiliencePipeline<string, AiCompletionResult>("ai-gateway", builder => {...})` module'e ekle
- [ ] `AiGateway` constructor'da `ResiliencePipelineProvider<string>` inject et
- [ ] Static field'ı kaldır
- [ ] (Opsiyonel) Per-tenant key için `$"ai-gateway:{currentTenant.Id}"` pattern değerlendir

---

### ARCH-007 · DbContext: Tablo Adlandırma Tutarsızlığı Giderilmesi

**Öncelik:** Medium  
**Efor:** ~1 saat + migration  
**Branch:** `arch/arch-007-table-naming`

**Sorun:**  
`PlatformDbContext.OnModelCreating` içinde iki ayrı pattern:

| Aggregate | Mevcut | Beklenen |
|-----------|--------|---------|
| `Customer` | `AppCustomers` (prefix+schema ✓) | — |
| `TaskItem` | `AppTasks` (hardcoded, schema yok) | `AppTasks` (schema ekle) |
| `Invoice` | `AppInvoices` (hardcoded, schema yok) | `AppInvoices` (schema ekle) |
| `ProjectAnalysis` | `AppProjectAnalyses` (hardcoded) | `AppProjectAnalyses` (schema ekle) |

**Yapılacaklar:**
- [ ] `PlatformDbContext`'te tüm hardcoded `"AppXxx"` string'lerini `PlatformConsts.DbTablePrefix + "Xxx", PlatformConsts.DbSchema` formatına çevir
- [ ] Şema değişikliği yoksa (prefix aynı kalıyorsa) migration boş olacak — sadece EF metadata güncellenir
- [ ] `IEntityTypeConfiguration<T>` sınıflarına taşımayı değerlendir (uzun vadeli tercih)

---

## Backlog (Faz Dışı — İzleniyor)

| # | Başlık | Kategori | Not |
|---|--------|----------|-----|
| B-01 | Application → EF Core doğrudan referans | Clean Arch | `Microsoft.EntityFrameworkCore` Application.csproj'dan kaldırılmalı; custom repo interface ile izole edilmeli |
| B-02 | `InvoiceStatus` geçiş audit log | Observability | Status değişiminde domain event + ABP audit log entegrasyonu |
| B-03 | AI prompt injection koruması | Security | Multi-tenant context'te kullanıcı girdisi OpenAI'ye gitmeden sanitize edilmeli |
| B-04 | `DraftApprovedEventHandler` local→distributed | Resilience | Crash durumunda event kaybolmaması için Outbox pattern (JournalEntry'de zaten var, Tasks için de uygulanabilir) |

---

## PR ve Commit Kuralları

- Her ARCH-xxx için: `feat(arch): ARCH-001 - Invoice rich domain model`
- Branch adı: `arch/arch-NNN-kisa-aciklama`
- Her PR tek bir ARCH item'ı kapatır (GitHub `Closes #<issue>` ile)
- Faz 2 başlamadan Faz 1 PR'ları merge edilmiş olmalı

---

## Hedef Metrikler (Post-Roadmap)

| Metrik | Şimdi | Hedef |
|--------|-------|-------|
| Production Readiness | 72/100 | 90/100 |
| Invoice domain quality | 45/100 | 90/100 |
| AI module resilience | 80/100 | 92/100 |
| Multi-tenancy isolation | 65/100 | 92/100 |
| Max repository injection per service | 7 | ≤3 |
